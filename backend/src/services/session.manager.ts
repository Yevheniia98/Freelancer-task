import { EventEmitter } from 'events';
import { getRedisClient } from '../config/redis';
import crypto from 'crypto';

export interface SessionData {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: Date;
  lastAccessed: Date;
  expiresAt: Date;
  isActive: boolean;
  metadata: Record<string, any>;
  oauthState?: {
    platform: string;
    state: string;
    requestToken?: string;
    tokenSecret?: string;
    verifier?: string;
    redirectUrl?: string;
  };
}

export interface OAuthSession {
  sessionId: string;
  platform: string;
  state: string;
  requestToken?: string;
  tokenSecret?: string;
  verifier?: string;
  redirectUrl?: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface SessionConfig {
  maxAge: number; // Session max age in seconds
  cleanupInterval: number; // Cleanup interval in seconds
  maxConcurrentSessions: number; // Maximum concurrent sessions per user
  oauthStateExpiry: number; // OAuth state expiry in seconds
  extendOnActivity: boolean; // Whether to extend session on activity
}

export class SessionManager extends EventEmitter {
  private static instance: SessionManager;
  private redisClient: any;
  private isInitialized = false;
  private cleanupTimer: NodeJS.Timeout | null = null;
  
  private readonly config: SessionConfig = {
    maxAge: 24 * 60 * 60, // 24 hours
    cleanupInterval: 60 * 60, // 1 hour
    maxConcurrentSessions: 5,
    oauthStateExpiry: 10 * 60, // 10 minutes
    extendOnActivity: true
  };

  // Redis key prefixes
  private readonly SESSION_PREFIX = 'session:';
  private readonly USER_SESSIONS_PREFIX = 'user_sessions:';
  private readonly OAUTH_STATE_PREFIX = 'oauth_state:';
  private readonly OAUTH_SESSION_PREFIX = 'oauth_session:';

  private constructor(config?: Partial<SessionConfig>) {
    super();
    this.setMaxListeners(20);
    
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  public static getInstance(config?: Partial<SessionConfig>): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager(config);
    }
    return SessionManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.redisClient = await getRedisClient();
      this.setupEventListeners();
      this.startCleanupTask();
      this.isInitialized = true;
      console.log('🔑 Session Manager initialized');
    } catch (error) {
      console.error('Failed to initialize Session Manager:', error);
      throw error;
    }
  }

  /**
   * Create a new session
   */
  public async createSession(
    userId: string,
    ipAddress: string,
    userAgent?: string,
    metadata: Record<string, any> = {}
  ): Promise<SessionData> {
    if (!this.isInitialized) {
      throw new Error('Session Manager not initialized');
    }

    const sessionId = this.generateSessionId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.maxAge * 1000);

    const sessionData: SessionData = {
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
  public async getSession(sessionId: string): Promise<SessionData | null> {
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
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }

  /**
   * Update session activity
   */
  public async touchSession(sessionId: string): Promise<boolean> {
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
    } catch (error) {
      console.error('Failed to touch session:', error);
      return false;
    }
  }

  /**
   * Update session metadata
   */
  public async updateSessionMetadata(
    sessionId: string, 
    metadata: Record<string, any>
  ): Promise<boolean> {
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
    } catch (error) {
      console.error('Failed to update session metadata:', error);
      return false;
    }
  }

  /**
   * Destroy a session
   */
  public async destroySession(sessionId: string): Promise<boolean> {
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
    } catch (error) {
      console.error('Failed to destroy session:', error);
      return false;
    }
  }

  /**
   * Get all active sessions for a user
   */
  public async getUserSessions(userId: string): Promise<SessionData[]> {
    if (!this.isInitialized) {
      throw new Error('Session Manager not initialized');
    }

    try {
      const userSessionsKey = this.USER_SESSIONS_PREFIX + userId;
      const sessionIds = await this.redisClient.smembers(userSessionsKey);

      const sessions: SessionData[] = [];
      
      for (const sessionId of sessionIds) {
        const session = await this.getSession(sessionId);
        if (session) {
          sessions.push(session);
        } else {
          // Clean up stale reference
          await this.removeFromUserSessions(userId, sessionId);
        }
      }

      return sessions;
    } catch (error) {
      console.error('Failed to get user sessions:', error);
      return [];
    }
  }

  /**
   * Destroy all sessions for a user
   */
  public async destroyUserSessions(userId: string, excludeSessionId?: string): Promise<number> {
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
    } catch (error) {
      console.error('Failed to destroy user sessions:', error);
      return 0;
    }
  }

  /**
   * Create OAuth state for OAuth flows
   */
  public async createOAuthState(
    userId: string,
    platform: string,
    redirectUrl?: string,
    metadata: Record<string, any> = {}
  ): Promise<OAuthSession> {
    if (!this.isInitialized) {
      throw new Error('Session Manager not initialized');
    }

    const sessionId = this.generateSessionId();
    const state = this.generateOAuthState();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.config.oauthStateExpiry * 1000);

    const oauthSession: OAuthSession = {
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
  public async getOAuthSessionByState(state: string): Promise<OAuthSession | null> {
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
    } catch (error) {
      console.error('Failed to get OAuth session by state:', error);
      return null;
    }
  }

  /**
   * Get OAuth session by session ID
   */
  public async getOAuthSession(sessionId: string): Promise<OAuthSession | null> {
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
    } catch (error) {
      console.error('Failed to get OAuth session:', error);
      return null;
    }
  }

  /**
   * Update OAuth session with tokens
   */
  public async updateOAuthSession(
    sessionId: string,
    updates: Partial<Pick<OAuthSession, 'requestToken' | 'verifier' | 'redirectUrl'>>
  ): Promise<boolean> {
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
    } catch (error) {
      console.error('Failed to update OAuth session:', error);
      return false;
    }
  }

  /**
   * Destroy OAuth session
   */
  public async destroyOAuthSession(sessionId: string): Promise<boolean> {
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
    } catch (error) {
      console.error('Failed to destroy OAuth session:', error);
      return false;
    }
  }

  /**
   * Clean up expired sessions
   */
  public async cleanupExpiredSessions(): Promise<number> {
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
    } catch (error) {
      console.error('Failed to cleanup expired sessions:', error);
      return 0;
    }
  }

  /**
   * Get session statistics
   */
  public async getSessionStats(): Promise<{
    totalActiveSessions: number;
    totalActiveOAuthSessions: number;
    userSessionCounts: Record<string, number>;
    platformOAuthCounts: Record<string, number>;
  }> {
    if (!this.isInitialized) {
      throw new Error('Session Manager not initialized');
    }

    try {
      const sessionKeys = await this.redisClient.keys(this.SESSION_PREFIX + '*');
      const oauthKeys = await this.redisClient.keys(this.OAUTH_SESSION_PREFIX + '*');

      const userSessionCounts: Record<string, number> = {};
      const platformOAuthCounts: Record<string, number> = {};

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
    } catch (error) {
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
  public async validateSession(
    sessionId: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<{ isValid: boolean; session?: SessionData; warnings?: string[] }> {
    if (!this.isInitialized) {
      throw new Error('Session Manager not initialized');
    }

    try {
      const session = await this.getSession(sessionId);
      const warnings: string[] = [];

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
    } catch (error) {
      console.error('Failed to validate session:', error);
      return { isValid: false };
    }
  }

  /**
   * Force destroy sessions (for security reasons)
   */
  public async forceDestroyUserSessions(
    userId: string,
    reason: string = 'security_action'
  ): Promise<number> {
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
    } catch (error) {
      console.error('Failed to force destroy user sessions:', error);
      return 0;
    }
  }

  // Private helper methods

  private setupEventListeners(): void {
    this.on('sessionCreated', (session: SessionData) => {
      console.log(`Session created for user ${session.userId} from ${session.ipAddress}`);
    });

    this.on('sessionDestroyed', (data: { sessionId: string; userId: string }) => {
      console.log(`Session ${data.sessionId} destroyed for user ${data.userId}`);
    });

    this.on('oauthStateCreated', (oauthSession: OAuthSession) => {
      console.log(`OAuth state created for ${oauthSession.platform} platform`);
    });
  }

  private startCleanupTask(): void {
    this.cleanupTimer = setInterval(async () => {
      try {
        await this.cleanupExpiredSessions();
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    }, this.config.cleanupInterval * 1000);
  }

  private async storeSession(session: SessionData): Promise<void> {
    const sessionKey = this.SESSION_PREFIX + session.id;
    await this.redisClient.hset(sessionKey, this.serializeSession(session));
    await this.redisClient.expire(sessionKey, this.config.maxAge);
  }

  private async addToUserSessions(userId: string, sessionId: string): Promise<void> {
    const userSessionsKey = this.USER_SESSIONS_PREFIX + userId;
    await this.redisClient.sadd(userSessionsKey, sessionId);
    await this.redisClient.expire(userSessionsKey, this.config.maxAge);
  }

  private async removeFromUserSessions(userId: string, sessionId: string): Promise<void> {
    const userSessionsKey = this.USER_SESSIONS_PREFIX + userId;
    await this.redisClient.srem(userSessionsKey, sessionId);
  }

  private async enforceSessionLimits(userId: string): Promise<void> {
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

  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateOAuthState(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private serializeSession(session: SessionData): Record<string, string> {
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

  private deserializeSession(data: Record<string, string>): SessionData {
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

  private serializeOAuthSession(session: OAuthSession): Record<string, string> {
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

  private deserializeOAuthSession(data: Record<string, string>): OAuthSession {
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
  public async shutdown(): Promise<void> {
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
  public getConfig(): SessionConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<SessionConfig>): void {
    Object.assign(this.config, newConfig);
    
    // Restart cleanup timer if interval changed
    if (newConfig.cleanupInterval && this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.startCleanupTask();
    }
  }
}

export default SessionManager;