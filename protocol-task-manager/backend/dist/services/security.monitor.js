"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMonitor = exports.SecurityEventType = void 0;
const events_1 = require("events");
const redis_1 = require("../config/redis");
const user_model_1 = require("../models/user.model");
var SecurityEventType;
(function (SecurityEventType) {
    SecurityEventType["LOGIN_SUCCESS"] = "login_success";
    SecurityEventType["LOGIN_FAILED"] = "login_failed";
    SecurityEventType["LOGIN_BRUTE_FORCE"] = "login_brute_force";
    SecurityEventType["PASSWORD_CHANGED"] = "password_changed";
    SecurityEventType["TWO_FA_ENABLED"] = "two_fa_enabled";
    SecurityEventType["TWO_FA_DISABLED"] = "two_fa_disabled";
    SecurityEventType["TWO_FA_FAILED"] = "two_fa_failed";
    SecurityEventType["ACCOUNT_LOCKED"] = "account_locked";
    SecurityEventType["ACCOUNT_UNLOCKED"] = "account_unlocked";
    SecurityEventType["SUSPICIOUS_LOCATION"] = "suspicious_location";
    SecurityEventType["MULTIPLE_SESSIONS"] = "multiple_sessions";
    SecurityEventType["TOKEN_COMPROMISED"] = "token_compromised";
    SecurityEventType["UNAUTHORIZED_ACCESS"] = "unauthorized_access";
    SecurityEventType["PERMISSION_ESCALATION"] = "permission_escalation";
    SecurityEventType["DATA_EXPORT"] = "data_export";
    SecurityEventType["ADMIN_ACTION"] = "admin_action";
    SecurityEventType["SQL_INJECTION_ATTEMPT"] = "sql_injection_attempt";
    SecurityEventType["XSS_ATTEMPT"] = "xss_attempt";
    SecurityEventType["RATE_LIMIT_EXCEEDED"] = "rate_limit_exceeded";
    SecurityEventType["MALICIOUS_FILE_UPLOAD"] = "malicious_file_upload";
    SecurityEventType["SUSPICIOUS_API_USAGE"] = "suspicious_api_usage";
})(SecurityEventType || (exports.SecurityEventType = SecurityEventType = {}));
class SecurityMonitor extends events_1.EventEmitter {
    constructor() {
        super();
        this.isInitialized = false;
        // Configuration
        this.BRUTE_FORCE_THRESHOLD = 5;
        this.BRUTE_FORCE_WINDOW = 15 * 60 * 1000; // 15 minutes
        this.SUSPICIOUS_LOCATION_THRESHOLD = 1000; // km
        this.MAX_CONCURRENT_SESSIONS = 3;
        this.EVENT_RETENTION_DAYS = 90;
        this.setMaxListeners(20);
    }
    static getInstance() {
        if (!SecurityMonitor.instance) {
            SecurityMonitor.instance = new SecurityMonitor();
        }
        return SecurityMonitor.instance;
    }
    async initialize() {
        if (this.isInitialized)
            return;
        try {
            this.redisClient = await (0, redis_1.getRedisClient)();
            this.setupEventListeners();
            this.startBackgroundTasks();
            this.isInitialized = true;
            console.log('🔐 Security Monitor initialized');
        }
        catch (error) {
            console.error('Failed to initialize Security Monitor:', error);
            throw error;
        }
    }
    /**
     * Log a security event
     */
    async logEvent(type, details) {
        const event = {
            id: this.generateEventId(),
            type,
            severity: details.severity || this.getDefaultSeverity(type),
            userId: details.userId,
            ipAddress: details.ipAddress,
            userAgent: details.userAgent,
            timestamp: new Date(),
            details: details.metadata || {},
            resolved: false,
            location: await this.getLocationFromIP(details.ipAddress)
        };
        // Store event in Redis
        await this.storeEvent(event);
        // Emit event for real-time processing
        this.emit('securityEvent', event);
        // Check for patterns and potential threats
        await this.analyzeEvent(event);
        return event;
    }
    /**
     * Track login attempts and detect brute force attacks
     */
    async trackLoginAttempt(email, ipAddress, success, userAgent) {
        const key = `login_attempts:${ipAddress}:${email}`;
        const attempts = await this.redisClient.incr(key);
        await this.redisClient.expire(key, this.BRUTE_FORCE_WINDOW / 1000);
        if (success) {
            await this.logEvent(SecurityEventType.LOGIN_SUCCESS, {
                userId: await this.getUserIdByEmail(email),
                ipAddress,
                userAgent,
                severity: 'low',
                metadata: { email, attempt: attempts }
            });
            // Clear failed attempts on successful login
            await this.redisClient.del(key);
        }
        else {
            await this.logEvent(SecurityEventType.LOGIN_FAILED, {
                ipAddress,
                userAgent,
                severity: 'medium',
                metadata: { email, attempt: attempts }
            });
            // Check for brute force attack
            if (attempts >= this.BRUTE_FORCE_THRESHOLD) {
                await this.handleBruteForceAttack(email, ipAddress, attempts);
            }
        }
    }
    /**
     * Monitor user sessions
     */
    async trackSession(userId, ipAddress, action) {
        const key = `active_sessions:${userId}`;
        if (action === 'start') {
            await this.redisClient.sadd(key, ipAddress);
            await this.redisClient.expire(key, 24 * 60 * 60); // 24 hours
            const sessionCount = await this.redisClient.scard(key);
            if (sessionCount > this.MAX_CONCURRENT_SESSIONS) {
                await this.logEvent(SecurityEventType.MULTIPLE_SESSIONS, {
                    userId,
                    ipAddress,
                    severity: 'medium',
                    metadata: { sessionCount, maxAllowed: this.MAX_CONCURRENT_SESSIONS }
                });
            }
        }
        else {
            await this.redisClient.srem(key, ipAddress);
        }
    }
    /**
     * Check for suspicious location changes
     */
    async checkSuspiciousLocation(userId, currentIP) {
        const lastLocationKey = `last_location:${userId}`;
        const lastLocation = await this.redisClient.hgetall(lastLocationKey);
        if (lastLocation && lastLocation.ip) {
            const currentLocation = await this.getLocationFromIP(currentIP);
            const lastKnownLocation = {
                country: lastLocation.country,
                city: lastLocation.city,
                lat: parseFloat(lastLocation.lat || '0'),
                lon: parseFloat(lastLocation.lon || '0')
            };
            if (currentLocation && this.calculateDistance(lastKnownLocation.lat, lastKnownLocation.lon, currentLocation.lat || 0, currentLocation.lon || 0) > this.SUSPICIOUS_LOCATION_THRESHOLD) {
                await this.logEvent(SecurityEventType.SUSPICIOUS_LOCATION, {
                    userId,
                    ipAddress: currentIP,
                    severity: 'high',
                    metadata: {
                        previousLocation: lastKnownLocation,
                        currentLocation,
                        distance: this.calculateDistance(lastKnownLocation.lat, lastKnownLocation.lon, currentLocation.lat || 0, currentLocation.lon || 0)
                    }
                });
            }
        }
        // Update last known location
        const newLocation = await this.getLocationFromIP(currentIP);
        if (newLocation) {
            await this.redisClient.hmset(lastLocationKey, {
                ip: currentIP,
                country: newLocation.country || '',
                city: newLocation.city || '',
                lat: newLocation.lat || '0',
                lon: newLocation.lon || '0',
                timestamp: Date.now()
            });
            await this.redisClient.expire(lastLocationKey, 30 * 24 * 60 * 60); // 30 days
        }
    }
    /**
     * Get security events with filtering
     */
    async getEvents(filters = {}) {
        const { limit = 100, offset = 0 } = filters;
        const events = [];
        // Get event IDs from sorted set (sorted by timestamp)
        const eventIds = await this.redisClient.zrevrange('security_events_timeline', offset, offset + limit - 1);
        for (const eventId of eventIds) {
            const eventData = await this.redisClient.hgetall(`security_event:${eventId}`);
            if (eventData && eventData.id) {
                const event = this.parseStoredEvent(eventData);
                // Apply filters
                if (this.matchesFilters(event, filters)) {
                    events.push(event);
                }
            }
        }
        return events;
    }
    /**
     * Get security metrics and statistics
     */
    async getMetrics(timeRange) {
        const events = await this.getEvents({
            from: timeRange.from,
            to: timeRange.to,
            limit: 10000 // Get all events in range
        });
        const metrics = {
            totalEvents: events.length,
            eventsByType: {},
            eventsBySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
            activeAlerts: await this.getActiveAlertsCount(),
            topRiskyIPs: await this.getTopRiskyIPs(),
            loginAttempts: { successful: 0, failed: 0, bruteForce: 0 },
            timeRange
        };
        // Calculate metrics from events
        for (const event of events) {
            // Count by type
            metrics.eventsByType[event.type] = (metrics.eventsByType[event.type] || 0) + 1;
            // Count by severity
            metrics.eventsBySeverity[event.severity]++;
            // Count login attempts
            if (event.type === SecurityEventType.LOGIN_SUCCESS) {
                metrics.loginAttempts.successful++;
            }
            else if (event.type === SecurityEventType.LOGIN_FAILED) {
                metrics.loginAttempts.failed++;
            }
            else if (event.type === SecurityEventType.LOGIN_BRUTE_FORCE) {
                metrics.loginAttempts.bruteForce++;
            }
        }
        return metrics;
    }
    /**
     * Create a security alert
     */
    async createAlert(title, message, severity, events) {
        const alert = {
            id: this.generateEventId(),
            title,
            message,
            severity,
            events,
            createdAt: new Date(),
            acknowledged: false
        };
        await this.redisClient.hset(`security_alert:${alert.id}`, this.serializeAlert(alert));
        await this.redisClient.sadd('active_security_alerts', alert.id);
        // Emit alert for real-time notifications
        this.emit('securityAlert', alert);
        return alert;
    }
    /**
     * Acknowledge a security alert
     */
    async acknowledgeAlert(alertId, acknowledgedBy) {
        const alertData = await this.redisClient.hgetall(`security_alert:${alertId}`);
        if (alertData && alertData.id) {
            alertData.acknowledged = 'true';
            alertData.acknowledgedBy = acknowledgedBy;
            alertData.acknowledgedAt = new Date().toISOString();
            await this.redisClient.hset(`security_alert:${alertId}`, alertData);
            await this.redisClient.srem('active_security_alerts', alertId);
        }
    }
    setupEventListeners() {
        this.on('securityEvent', this.handleSecurityEvent.bind(this));
    }
    startBackgroundTasks() {
        // Clean up old events every hour
        setInterval(() => {
            this.cleanupOldEvents().catch(console.error);
        }, 60 * 60 * 1000);
        // Generate daily security reports
        setInterval(() => {
            this.generateDailyReport().catch(console.error);
        }, 24 * 60 * 60 * 1000);
    }
    async handleSecurityEvent(event) {
        // High severity events should create alerts
        if (event.severity === 'high' || event.severity === 'critical') {
            await this.createAlert(`Security Event: ${event.type}`, `A ${event.severity} security event was detected from IP ${event.ipAddress}`, event.severity, [event]);
        }
    }
    async analyzeEvent(event) {
        // Analyze patterns and create alerts based on event analysis
        switch (event.type) {
            case SecurityEventType.LOGIN_FAILED:
                await this.analyzeFailedLogins(event);
                break;
            case SecurityEventType.SUSPICIOUS_LOCATION:
                await this.analyzeSuspiciousLocation(event);
                break;
            default:
                break;
        }
    }
    async analyzeFailedLogins(event) {
        // Check for patterns in failed logins from same IP
        const recentEvents = await this.getEvents({
            type: SecurityEventType.LOGIN_FAILED,
            from: new Date(Date.now() - this.BRUTE_FORCE_WINDOW),
            to: new Date()
        });
        const sameIPEvents = recentEvents.filter(e => e.ipAddress === event.ipAddress);
        if (sameIPEvents.length >= this.BRUTE_FORCE_THRESHOLD) {
            await this.createAlert('Potential Brute Force Attack', `Multiple failed login attempts detected from IP ${event.ipAddress}`, 'high', sameIPEvents);
        }
    }
    async analyzeSuspiciousLocation(event) {
        await this.createAlert('Suspicious Location Login', `User logged in from unusual location: ${event.location?.city}, ${event.location?.country}`, 'medium', [event]);
    }
    async handleBruteForceAttack(email, ipAddress, attempts) {
        await this.logEvent(SecurityEventType.LOGIN_BRUTE_FORCE, {
            ipAddress,
            severity: 'high',
            metadata: { email, attempts, threshold: this.BRUTE_FORCE_THRESHOLD }
        });
        // Block IP temporarily
        await this.redisClient.setex(`blocked_ip:${ipAddress}`, 60 * 60, 'brute_force'); // 1 hour block
    }
    async storeEvent(event) {
        const eventKey = `security_event:${event.id}`;
        // Store event data
        await this.redisClient.hset(eventKey, this.serializeEvent(event));
        // Add to timeline (sorted by timestamp)
        await this.redisClient.zadd('security_events_timeline', event.timestamp.getTime(), event.id);
        // Add to type-specific index
        await this.redisClient.sadd(`security_events:${event.type}`, event.id);
        // Add to user-specific index if userId exists
        if (event.userId) {
            await this.redisClient.sadd(`user_security_events:${event.userId}`, event.id);
        }
        // Set expiration
        const expireTime = this.EVENT_RETENTION_DAYS * 24 * 60 * 60;
        await this.redisClient.expire(eventKey, expireTime);
    }
    async getLocationFromIP(ipAddress) {
        // Mock location service - in production, use a real IP geolocation service
        // like MaxMind GeoIP2, IPinfo, or similar
        if (ipAddress === '127.0.0.1' || ipAddress === '::1') {
            return { country: 'Local', city: 'Localhost', lat: 0, lon: 0 };
        }
        // Return mock data for demo
        return { country: 'Unknown', city: 'Unknown', lat: 0, lon: 0 };
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    toRad(value) {
        return value * Math.PI / 180;
    }
    async getUserIdByEmail(email) {
        try {
            const user = await user_model_1.User.findOne({ email });
            return user?._id?.toString();
        }
        catch (error) {
            return undefined;
        }
    }
    async getActiveAlertsCount() {
        return await this.redisClient.scard('active_security_alerts');
    }
    async getTopRiskyIPs() {
        // Implementation for getting top risky IPs based on event frequency
        const ipCounts = {};
        const recentEvents = await this.getEvents({
            from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            limit: 1000
        });
        for (const event of recentEvents) {
            if (event.severity === 'high' || event.severity === 'critical') {
                if (!ipCounts[event.ipAddress]) {
                    ipCounts[event.ipAddress] = { count: 0, lastSeen: 0 };
                }
                ipCounts[event.ipAddress].count++;
                ipCounts[event.ipAddress].lastSeen = Math.max(ipCounts[event.ipAddress].lastSeen, event.timestamp.getTime());
            }
        }
        return Object.entries(ipCounts)
            .map(([ip, data]) => ({
            ip,
            count: data.count,
            lastSeen: new Date(data.lastSeen)
        }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
    getDefaultSeverity(type) {
        const severityMap = {
            [SecurityEventType.LOGIN_SUCCESS]: 'low',
            [SecurityEventType.LOGIN_FAILED]: 'medium',
            [SecurityEventType.LOGIN_BRUTE_FORCE]: 'high',
            [SecurityEventType.PASSWORD_CHANGED]: 'medium',
            [SecurityEventType.TWO_FA_ENABLED]: 'low',
            [SecurityEventType.TWO_FA_DISABLED]: 'medium',
            [SecurityEventType.TWO_FA_FAILED]: 'medium',
            [SecurityEventType.ACCOUNT_LOCKED]: 'high',
            [SecurityEventType.ACCOUNT_UNLOCKED]: 'medium',
            [SecurityEventType.SUSPICIOUS_LOCATION]: 'high',
            [SecurityEventType.MULTIPLE_SESSIONS]: 'medium',
            [SecurityEventType.TOKEN_COMPROMISED]: 'critical',
            [SecurityEventType.UNAUTHORIZED_ACCESS]: 'critical',
            [SecurityEventType.PERMISSION_ESCALATION]: 'critical',
            [SecurityEventType.DATA_EXPORT]: 'high',
            [SecurityEventType.ADMIN_ACTION]: 'medium',
            [SecurityEventType.SQL_INJECTION_ATTEMPT]: 'critical',
            [SecurityEventType.XSS_ATTEMPT]: 'high',
            [SecurityEventType.RATE_LIMIT_EXCEEDED]: 'medium',
            [SecurityEventType.MALICIOUS_FILE_UPLOAD]: 'critical',
            [SecurityEventType.SUSPICIOUS_API_USAGE]: 'high'
        };
        return severityMap[type] || 'medium';
    }
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    serializeEvent(event) {
        return {
            id: event.id,
            type: event.type,
            severity: event.severity,
            userId: event.userId || '',
            ipAddress: event.ipAddress,
            userAgent: event.userAgent || '',
            timestamp: event.timestamp.toISOString(),
            details: JSON.stringify(event.details),
            resolved: event.resolved.toString(),
            resolvedAt: event.resolvedAt?.toISOString() || '',
            resolvedBy: event.resolvedBy || '',
            location: JSON.stringify(event.location || {})
        };
    }
    parseStoredEvent(data) {
        return {
            id: data.id,
            type: data.type,
            severity: data.severity,
            userId: data.userId || undefined,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent || undefined,
            timestamp: new Date(data.timestamp),
            details: JSON.parse(data.details || '{}'),
            resolved: data.resolved === 'true',
            resolvedAt: data.resolvedAt ? new Date(data.resolvedAt) : undefined,
            resolvedBy: data.resolvedBy || undefined,
            location: JSON.parse(data.location || '{}')
        };
    }
    serializeAlert(alert) {
        return {
            id: alert.id,
            title: alert.title,
            message: alert.message,
            severity: alert.severity,
            events: JSON.stringify(alert.events),
            createdAt: alert.createdAt.toISOString(),
            acknowledged: alert.acknowledged.toString(),
            acknowledgedBy: alert.acknowledgedBy || '',
            acknowledgedAt: alert.acknowledgedAt?.toISOString() || ''
        };
    }
    matchesFilters(event, filters) {
        if (filters.userId && event.userId !== filters.userId)
            return false;
        if (filters.type && event.type !== filters.type)
            return false;
        if (filters.severity && event.severity !== filters.severity)
            return false;
        if (filters.from && event.timestamp < filters.from)
            return false;
        if (filters.to && event.timestamp > filters.to)
            return false;
        return true;
    }
    async cleanupOldEvents() {
        const cutoffTime = Date.now() - (this.EVENT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
        // Remove old events from timeline
        await this.redisClient.zremrangebyscore('security_events_timeline', 0, cutoffTime);
    }
    async generateDailyReport() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const metrics = await this.getMetrics({ from: yesterday, to: today });
        // Emit daily report event
        this.emit('dailySecurityReport', metrics);
    }
}
exports.SecurityMonitor = SecurityMonitor;
