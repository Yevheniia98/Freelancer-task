"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = void 0;
const events_1 = require("events");
const redis_1 = require("../config/redis");
const crypto_1 = __importDefault(require("crypto"));
class SessionManager extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.isInitialized = false;
        this.cleanupTimer = null;
        this.config = {
            maxAge: 24 * 60 * 60, // 24 hours
            cleanupInterval: 60 * 60, // 1 hour
            maxConcurrentSessions: 5,
            oauthStateExpiry: 10 * 60, // 10 minutes
            extendOnActivity: true
        };
        // Redis key prefixes
        this.SESSION_PREFIX = 'session:';
        this.USER_SESSIONS_PREFIX = 'user_sessions:';
        this.OAUTH_STATE_PREFIX = 'oauth_state:';
        this.OAUTH_SESSION_PREFIX = 'oauth_session:';
        this.setMaxListeners(20);
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    static getInstance(config) {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager(config);
        }
        return SessionManager.instance;
    }
    async initialize() {
        if (this.isInitialized)
            return;
        try {
            this.redisClient = await (0, redis_1.getRedisClient)();
            this.setupEventListeners();
            this.startCleanupTask();
            this.isInitialized = true;
            console.log('🔑 Session Manager initialized');
        }
        catch (error) {
            console.error('Failed to initialize Session Manager:', error);
            throw error;
        }
    }
    /**
     * Create a new session
     */
    async createSession(userId, ipAddress, userAgent, metadata = {}) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        const sessionId = this.generateSessionId();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.config.maxAge * 1000);
        const sessionData = {
            id: sessionId,
            userId,
            ipAddress,
            userAgent,
            createdAt: now,
            lastAccessed: now,
            expiresAt,
            isActive: true,
            metadata
        };
        // Store session data
        await this.storeSession(sessionData);
        // Add to user sessions index
        await this.addToUserSessions(userId, sessionId);
        // Check for concurrent session limits
        await this.enforceSessionLimits(userId);
        // Log session creation
        console.log(`Session created for user ${userId} from ${ipAddress}`);
        this.emit('sessionCreated', sessionData);
        return sessionData;
    }
    /**
     * Get session by ID
     */
    async getSession(sessionId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const sessionKey = this.SESSION_PREFIX + sessionId;
            const sessionData = await this.redisClient.hgetall(sessionKey);
            if (!sessionData || Object.keys(sessionData).length === 0) {
                return null;
            }
            const session = this.deserializeSession(sessionData);
            // Check if session is expired
            if (new Date() > session.expiresAt || !session.isActive) {
                await this.destroySession(sessionId);
                return null;
            }
            return session;
        }
        catch (error) {
            console.error('Failed to get session:', error);
            return null;
        }
    }
    /**
     * Update session activity
     */
    async touchSession(sessionId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const session = await this.getSession(sessionId);
            if (!session) {
                return false;
            }
            const now = new Date();
            session.lastAccessed = now;
            // Extend session if configured
            if (this.config.extendOnActivity) {
                session.expiresAt = new Date(now.getTime() + this.config.maxAge * 1000);
            }
            await this.storeSession(session);
            this.emit('sessionTouched', session);
            return true;
        }
        catch (error) {
            console.error('Failed to touch session:', error);
            return false;
        }
    }
    /**
     * Update session metadata
     */
    async updateSessionMetadata(sessionId, metadata) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const session = await this.getSession(sessionId);
            if (!session) {
                return false;
            }
            session.metadata = { ...session.metadata, ...metadata };
            await this.storeSession(session);
            this.emit('sessionUpdated', session);
            return true;
        }
        catch (error) {
            console.error('Failed to update session metadata:', error);
            return false;
        }
    }
    /**
     * Destroy a session
     */
    async destroySession(sessionId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const session = await this.getSession(sessionId);
            if (!session) {
                return false;
            }
            // Remove from storage
            const sessionKey = this.SESSION_PREFIX + sessionId;
            await this.redisClient.del(sessionKey);
            // Remove from user sessions index
            await this.removeFromUserSessions(session.userId, sessionId);
            // Log session destruction
            console.log(`Session ${sessionId} destroyed for user ${session.userId}`);
            this.emit('sessionDestroyed', { sessionId, userId: session.userId });
            return true;
        }
        catch (error) {
            console.error('Failed to destroy session:', error);
            return false;
        }
    }
    /**
     * Get all active sessions for a user
     */
    async getUserSessions(userId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const userSessionsKey = this.USER_SESSIONS_PREFIX + userId;
            const sessionIds = await this.redisClient.smembers(userSessionsKey);
            const sessions = [];
            for (const sessionId of sessionIds) {
                const session = await this.getSession(sessionId);
                if (session) {
                    sessions.push(session);
                }
                else {
                    // Clean up stale reference
                    await this.removeFromUserSessions(userId, sessionId);
                }
            }
            return sessions;
        }
        catch (error) {
            console.error('Failed to get user sessions:', error);
            return [];
        }
    }
    /**
     * Destroy all sessions for a user
     */
    async destroyUserSessions(userId, excludeSessionId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const sessions = await this.getUserSessions(userId);
            let destroyedCount = 0;
            for (const session of sessions) {
                if (session.id !== excludeSessionId) {
                    const destroyed = await this.destroySession(session.id);
                    if (destroyed) {
                        destroyedCount++;
                    }
                }
            }
            // Log bulk session destruction
            if (destroyedCount > 0) {
                console.log(`Destroyed ${destroyedCount} sessions for user ${userId}`);
            }
            return destroyedCount;
        }
        catch (error) {
            console.error('Failed to destroy user sessions:', error);
            return 0;
        }
    }
    /**
     * Create OAuth state for OAuth flows
     */
    async createOAuthState(userId, platform, redirectUrl, metadata = {}) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        const sessionId = this.generateSessionId();
        const state = this.generateOAuthState();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + this.config.oauthStateExpiry * 1000);
        const oauthSession = {
            sessionId,
            platform,
            state,
            redirectUrl,
            userId,
            createdAt: now,
            expiresAt
        };
        // Store OAuth session
        const oauthKey = this.OAUTH_SESSION_PREFIX + sessionId;
        await this.redisClient.hset(oauthKey, this.serializeOAuthSession(oauthSession));
        await this.redisClient.expire(oauthKey, this.config.oauthStateExpiry);
        // Store state mapping for quick lookup
        const stateKey = this.OAUTH_STATE_PREFIX + state;
        await this.redisClient.set(stateKey, sessionId, 'EX', this.config.oauthStateExpiry);
        this.emit('oauthStateCreated', oauthSession);
        return oauthSession;
    }
    /**
     * Get OAuth session by state
     */
    async getOAuthSessionByState(state) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const stateKey = this.OAUTH_STATE_PREFIX + state;
            const sessionId = await this.redisClient.get(stateKey);
            if (!sessionId) {
                return null;
            }
            return await this.getOAuthSession(sessionId);
        }
        catch (error) {
            console.error('Failed to get OAuth session by state:', error);
            return null;
        }
    }
    /**
     * Get OAuth session by session ID
     */
    async getOAuthSession(sessionId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const oauthKey = this.OAUTH_SESSION_PREFIX + sessionId;
            const sessionData = await this.redisClient.hgetall(oauthKey);
            if (!sessionData || Object.keys(sessionData).length === 0) {
                return null;
            }
            const oauthSession = this.deserializeOAuthSession(sessionData);
            // Check if session is expired
            if (new Date() > oauthSession.expiresAt) {
                await this.destroyOAuthSession(sessionId);
                return null;
            }
            return oauthSession;
        }
        catch (error) {
            console.error('Failed to get OAuth session:', error);
            return null;
        }
    }
    /**
     * Update OAuth session with tokens
     */
    async updateOAuthSession(sessionId, updates) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const oauthSession = await this.getOAuthSession(sessionId);
            if (!oauthSession) {
                return false;
            }
            // Update fields
            Object.assign(oauthSession, updates);
            // Store updated session
            const oauthKey = this.OAUTH_SESSION_PREFIX + sessionId;
            await this.redisClient.hset(oauthKey, this.serializeOAuthSession(oauthSession));
            this.emit('oauthSessionUpdated', oauthSession);
            return true;
        }
        catch (error) {
            console.error('Failed to update OAuth session:', error);
            return false;
        }
    }
    /**
     * Destroy OAuth session
     */
    async destroyOAuthSession(sessionId) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const oauthSession = await this.getOAuthSession(sessionId);
            if (!oauthSession) {
                return false;
            }
            // Remove OAuth session
            const oauthKey = this.OAUTH_SESSION_PREFIX + sessionId;
            await this.redisClient.del(oauthKey);
            // Remove state mapping
            const stateKey = this.OAUTH_STATE_PREFIX + oauthSession.state;
            await this.redisClient.del(stateKey);
            this.emit('oauthSessionDestroyed', { sessionId, platform: oauthSession.platform });
            return true;
        }
        catch (error) {
            console.error('Failed to destroy OAuth session:', error);
            return false;
        }
    }
    /**
     * Clean up expired sessions
     */
    async cleanupExpiredSessions() {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            let cleanedCount = 0;
            const now = new Date();
            // Get all session keys
            const sessionKeys = await this.redisClient.keys(this.SESSION_PREFIX + '*');
            for (const sessionKey of sessionKeys) {
                const sessionData = await this.redisClient.hgetall(sessionKey);
                if (sessionData && sessionData.expiresAt) {
                    const expiresAt = new Date(sessionData.expiresAt);
                    if (now > expiresAt || sessionData.isActive === 'false') {
                        const sessionId = sessionKey.replace(this.SESSION_PREFIX, '');
                        await this.destroySession(sessionId);
                        cleanedCount++;
                    }
                }
            }
            // Clean up expired OAuth sessions
            const oauthKeys = await this.redisClient.keys(this.OAUTH_SESSION_PREFIX + '*');
            for (const oauthKey of oauthKeys) {
                const oauthData = await this.redisClient.hgetall(oauthKey);
                if (oauthData && oauthData.expiresAt) {
                    const expiresAt = new Date(oauthData.expiresAt);
                    if (now > expiresAt) {
                        const sessionId = oauthKey.replace(this.OAUTH_SESSION_PREFIX, '');
                        await this.destroyOAuthSession(sessionId);
                        cleanedCount++;
                    }
                }
            }
            if (cleanedCount > 0) {
                console.log(`🧹 Cleaned up ${cleanedCount} expired sessions`);
            }
            return cleanedCount;
        }
        catch (error) {
            console.error('Failed to cleanup expired sessions:', error);
            return 0;
        }
    }
    /**
     * Get session statistics
     */
    async getSessionStats() {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const sessionKeys = await this.redisClient.keys(this.SESSION_PREFIX + '*');
            const oauthKeys = await this.redisClient.keys(this.OAUTH_SESSION_PREFIX + '*');
            const userSessionCounts = {};
            const platformOAuthCounts = {};
            // Count regular sessions by user
            for (const sessionKey of sessionKeys) {
                const sessionData = await this.redisClient.hgetall(sessionKey);
                if (sessionData && sessionData.userId && sessionData.isActive === 'true') {
                    userSessionCounts[sessionData.userId] = (userSessionCounts[sessionData.userId] || 0) + 1;
                }
            }
            // Count OAuth sessions by platform
            for (const oauthKey of oauthKeys) {
                const oauthData = await this.redisClient.hgetall(oauthKey);
                if (oauthData && oauthData.platform) {
                    platformOAuthCounts[oauthData.platform] = (platformOAuthCounts[oauthData.platform] || 0) + 1;
                }
            }
            return {
                totalActiveSessions: sessionKeys.length,
                totalActiveOAuthSessions: oauthKeys.length,
                userSessionCounts,
                platformOAuthCounts
            };
        }
        catch (error) {
            console.error('Failed to get session stats:', error);
            return {
                totalActiveSessions: 0,
                totalActiveOAuthSessions: 0,
                userSessionCounts: {},
                platformOAuthCounts: {}
            };
        }
    }
    /**
     * Validate session and check for suspicious activity
     */
    async validateSession(sessionId, ipAddress, userAgent) {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const session = await this.getSession(sessionId);
            const warnings = [];
            if (!session) {
                return { isValid: false };
            }
            // Check IP address change
            if (session.ipAddress !== ipAddress) {
                warnings.push('IP address changed');
                console.log(`IP address changed for session ${sessionId}: ${session.ipAddress} -> ${ipAddress}`);
            }
            // Check user agent change
            if (session.userAgent && userAgent && session.userAgent !== userAgent) {
                warnings.push('User agent changed');
                console.log(`User agent changed for session ${sessionId}`);
            }
            // Update session with new info if needed
            if (warnings.length > 0) {
                session.ipAddress = ipAddress;
                if (userAgent) {
                    session.userAgent = userAgent;
                }
                await this.storeSession(session);
            }
            return { isValid: true, session, warnings };
        }
        catch (error) {
            console.error('Failed to validate session:', error);
            return { isValid: false };
        }
    }
    /**
     * Force destroy sessions (for security reasons)
     */
    async forceDestroyUserSessions(userId, reason = 'security_action') {
        if (!this.isInitialized) {
            throw new Error('Session Manager not initialized');
        }
        try {
            const sessions = await this.getUserSessions(userId);
            let destroyedCount = 0;
            for (const session of sessions) {
                await this.destroySession(session.id);
                destroyedCount++;
            }
            // Log forced session destruction
            if (destroyedCount > 0) {
                console.log(`Force destroyed ${destroyedCount} sessions for user ${userId} - reason: ${reason}`);
            }
            return destroyedCount;
        }
        catch (error) {
            console.error('Failed to force destroy user sessions:', error);
            return 0;
        }
    }
    // Private helper methods
    setupEventListeners() {
        this.on('sessionCreated', (session) => {
            console.log(`Session created for user ${session.userId} from ${session.ipAddress}`);
        });
        this.on('sessionDestroyed', (data) => {
            console.log(`Session ${data.sessionId} destroyed for user ${data.userId}`);
        });
        this.on('oauthStateCreated', (oauthSession) => {
            console.log(`OAuth state created for ${oauthSession.platform} platform`);
        });
    }
    startCleanupTask() {
        this.cleanupTimer = setInterval(async () => {
            try {
                await this.cleanupExpiredSessions();
            }
            catch (error) {
                console.error('Session cleanup error:', error);
            }
        }, this.config.cleanupInterval * 1000);
    }
    async storeSession(session) {
        const sessionKey = this.SESSION_PREFIX + session.id;
        await this.redisClient.hset(sessionKey, this.serializeSession(session));
        await this.redisClient.expire(sessionKey, this.config.maxAge);
    }
    async addToUserSessions(userId, sessionId) {
        const userSessionsKey = this.USER_SESSIONS_PREFIX + userId;
        await this.redisClient.sadd(userSessionsKey, sessionId);
        await this.redisClient.expire(userSessionsKey, this.config.maxAge);
    }
    async removeFromUserSessions(userId, sessionId) {
        const userSessionsKey = this.USER_SESSIONS_PREFIX + userId;
        await this.redisClient.srem(userSessionsKey, sessionId);
    }
    async enforceSessionLimits(userId) {
        const sessions = await this.getUserSessions(userId);
        if (sessions.length > this.config.maxConcurrentSessions) {
            // Sort by last accessed (oldest first)
            sessions.sort((a, b) => a.lastAccessed.getTime() - b.lastAccessed.getTime());
            // Destroy oldest sessions
            const sessionsToDestroy = sessions.slice(0, sessions.length - this.config.maxConcurrentSessions);
            for (const session of sessionsToDestroy) {
                await this.destroySession(session.id);
            }
            // Log session limit enforcement
            console.log(`Session limit enforced for user ${userId}: destroyed ${sessionsToDestroy.length} sessions, max allowed: ${this.config.maxConcurrentSessions}`);
        }
    }
    generateSessionId() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
    generateOAuthState() {
        return crypto_1.default.randomBytes(16).toString('hex');
    }
    serializeSession(session) {
        return {
            id: session.id,
            userId: session.userId,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent || '',
            createdAt: session.createdAt.toISOString(),
            lastAccessed: session.lastAccessed.toISOString(),
            expiresAt: session.expiresAt.toISOString(),
            isActive: session.isActive.toString(),
            metadata: JSON.stringify(session.metadata),
            oauthState: session.oauthState ? JSON.stringify(session.oauthState) : ''
        };
    }
    deserializeSession(data) {
        return {
            id: data.id,
            userId: data.userId,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent || undefined,
            createdAt: new Date(data.createdAt),
            lastAccessed: new Date(data.lastAccessed),
            expiresAt: new Date(data.expiresAt),
            isActive: data.isActive === 'true',
            metadata: JSON.parse(data.metadata || '{}'),
            oauthState: data.oauthState ? JSON.parse(data.oauthState) : undefined
        };
    }
    serializeOAuthSession(session) {
        return {
            sessionId: session.sessionId,
            platform: session.platform,
            state: session.state,
            requestToken: session.requestToken || '',
            verifier: session.verifier || '',
            redirectUrl: session.redirectUrl || '',
            userId: session.userId,
            createdAt: session.createdAt.toISOString(),
            expiresAt: session.expiresAt.toISOString()
        };
    }
    deserializeOAuthSession(data) {
        return {
            sessionId: data.sessionId,
            platform: data.platform,
            state: data.state,
            requestToken: data.requestToken || undefined,
            verifier: data.verifier || undefined,
            redirectUrl: data.redirectUrl || undefined,
            userId: data.userId,
            createdAt: new Date(data.createdAt),
            expiresAt: new Date(data.expiresAt)
        };
    }
    /**
     * Graceful shutdown
     */
    async shutdown() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        // Perform final cleanup
        await this.cleanupExpiredSessions();
        this.removeAllListeners();
        this.isInitialized = false;
        console.log('🔑 Session Manager shutdown complete');
    }
    /**
     * Get configuration
     */
    getConfig() {
        return { ...this.config };
    }
    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        // Restart cleanup timer if interval changed
        if (newConfig.cleanupInterval && this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.startCleanupTask();
        }
    }
}
exports.SessionManager = SessionManager;
exports.default = SessionManager;
