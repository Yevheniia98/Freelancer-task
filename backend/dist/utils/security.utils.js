"use strict";
/**
 * Security Utilities
 * Helper functions for security operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeHtml = sanitizeHtml;
exports.isValidEmail = isValidEmail;
exports.isValidUrl = isValidUrl;
exports.hasControlCharacters = hasControlCharacters;
exports.isValidMongoId = isValidMongoId;
exports.generateSecureToken = generateSecureToken;
exports.hashData = hashData;
exports.hasSqlInjection = hasSqlInjection;
exports.hasNoSqlInjection = hasNoSqlInjection;
exports.hasCommandInjection = hasCommandInjection;
exports.hasXss = hasXss;
exports.hasPathTraversal = hasPathTraversal;
exports.hasPromptInjection = hasPromptInjection;
exports.isSecureInput = isSecureInput;
exports.sanitizeFilename = sanitizeFilename;
exports.generateRateLimitKey = generateRateLimitKey;
exports.maskSensitiveData = maskSensitiveData;
exports.isIpAllowed = isIpAllowed;
exports.validatePasswordStrength = validatePasswordStrength;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Sanitize user input to prevent XSS
 */
function sanitizeHtml(input) {
    if (!input)
        return input;
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255 && !hasControlCharacters(email);
}
/**
 * Validate URL
 */
function isValidUrl(url) {
    try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
    }
    catch {
        return false;
    }
}
/**
 * Check for control characters that might be used in attacks
 */
function hasControlCharacters(input) {
    // eslint-disable-next-line no-control-regex
    return /[\x00-\x1F\x7F-\x9F]/.test(input);
}
/**
 * Validate MongoDB ObjectId format
 */
function isValidMongoId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}
/**
 * Generate a secure random token
 */
function generateSecureToken(length = 32) {
    return crypto_1.default.randomBytes(length).toString('hex');
}
/**
 * Hash sensitive data
 */
function hashData(data) {
    return crypto_1.default.createHash('sha256').update(data).digest('hex');
}
/**
 * Check if string contains SQL injection patterns
 */
function hasSqlInjection(input) {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
        /(;|--|\*|\/\*|\*\/|xp_|sp_)/gi,
        /('|('')|;|--|\/\*|\*\/)/gi
    ];
    return sqlPatterns.some(pattern => pattern.test(input));
}
/**
 * Check if string contains NoSQL injection patterns
 */
function hasNoSqlInjection(input) {
    if (typeof input !== 'string')
        return false;
    const noSqlPatterns = [
        /\$where/gi,
        /\$ne/gi,
        /\$gt/gi,
        /\$lt/gi,
        /\$regex/gi,
        /\{\s*\$where/gi
    ];
    return noSqlPatterns.some(pattern => pattern.test(input));
}
/**
 * Check if string contains command injection patterns
 */
function hasCommandInjection(input) {
    const cmdPatterns = [
        /(\||&&|;|\n|\r|`|\$\()/gi,
        /(bash|sh|cmd|powershell|exec|system)/gi
    ];
    return cmdPatterns.some(pattern => pattern.test(input));
}
/**
 * Check if string contains XSS patterns
 */
function hasXss(input) {
    const xssPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe/gi,
        /<object/gi,
        /<embed/gi
    ];
    return xssPatterns.some(pattern => pattern.test(input));
}
/**
 * Check if string contains path traversal attempts
 */
function hasPathTraversal(input) {
    return /\.\.[\/\\]/.test(input);
}
/**
 * Check if string contains prompt injection attempts
 */
function hasPromptInjection(input) {
    const promptInjectionPatterns = [
        /ignore\s+(previous|all|above)\s+(instructions|prompts?|commands?)/gi,
        /disregard\s+(previous|all|above)\s+(instructions|prompts?|commands?)/gi,
        /new\s+(instruction|prompt|command|task|role)/gi,
        /you\s+are\s+now/gi,
        /system\s*:\s*/gi,
        /act\s+as\s+(a\s+)?(different|another|new)/gi,
        /forget\s+(everything|all|previous)/gi,
        /override\s+(settings?|instructions?|rules?)/gi,
        /\/\s*system/gi,
        /execute\s+as\s+(admin|root|system)/gi
    ];
    return promptInjectionPatterns.some(pattern => pattern.test(input));
}
/**
 * Comprehensive security check
 */
function isSecureInput(input) {
    const threats = [];
    if (hasXss(input))
        threats.push('XSS attempt detected');
    if (hasSqlInjection(input))
        threats.push('SQL injection attempt detected');
    if (hasNoSqlInjection(input))
        threats.push('NoSQL injection attempt detected');
    if (hasCommandInjection(input))
        threats.push('Command injection attempt detected');
    if (hasPathTraversal(input))
        threats.push('Path traversal attempt detected');
    if (hasPromptInjection(input))
        threats.push('Prompt injection attempt detected');
    if (hasControlCharacters(input))
        threats.push('Control characters detected');
    return {
        safe: threats.length === 0,
        threats
    };
}
/**
 * Sanitize filename for safe storage
 */
function sanitizeFilename(filename) {
    return filename
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/\.{2,}/g, '.')
        .substring(0, 255);
}
/**
 * Rate limit key generator
 */
function generateRateLimitKey(ip, endpoint) {
    return `ratelimit:${hashData(ip)}:${hashData(endpoint)}`;
}
/**
 * Mask sensitive data for logging
 */
function maskSensitiveData(data) {
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn'];
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const masked = Array.isArray(data) ? [...data] : { ...data };
    for (const key in masked) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
            masked[key] = '***REDACTED***';
        }
        else if (typeof masked[key] === 'object') {
            masked[key] = maskSensitiveData(masked[key]);
        }
    }
    return masked;
}
/**
 * Check if IP is in allowed list
 */
function isIpAllowed(ip, allowedIps) {
    const normalizedIp = ip.replace('::ffff:', '');
    return allowedIps.includes(normalizedIp) || allowedIps.includes('*');
}
/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    const feedback = [];
    let score = 0;
    if (password.length >= 8)
        score += 1;
    else
        feedback.push('Password should be at least 8 characters long');
    if (password.length >= 12)
        score += 1;
    if (/[a-z]/.test(password))
        score += 1;
    else
        feedback.push('Password should contain lowercase letters');
    if (/[A-Z]/.test(password))
        score += 1;
    else
        feedback.push('Password should contain uppercase letters');
    if (/[0-9]/.test(password))
        score += 1;
    else
        feedback.push('Password should contain numbers');
    if (/[^a-zA-Z0-9]/.test(password))
        score += 1;
    else
        feedback.push('Password should contain special characters');
    return {
        valid: score >= 4,
        score,
        feedback
    };
}
