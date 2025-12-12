/**
 * Security Utilities
 * Helper functions for security operations
 */

import crypto from 'crypto';

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input) return input;
  
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
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255 && !hasControlCharacters(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Check for control characters that might be used in attacks
 */
export function hasControlCharacters(input: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /[\x00-\x1F\x7F-\x9F]/.test(input);
}

/**
 * Validate MongoDB ObjectId format
 */
export function isValidMongoId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data
 */
export function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Check if string contains SQL injection patterns
 */
export function hasSqlInjection(input: string): boolean {
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
export function hasNoSqlInjection(input: string): boolean {
  if (typeof input !== 'string') return false;
  
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
export function hasCommandInjection(input: string): boolean {
  const cmdPatterns = [
    /(\||&&|;|\n|\r|`|\$\()/gi,
    /(bash|sh|cmd|powershell|exec|system)/gi
  ];
  
  return cmdPatterns.some(pattern => pattern.test(input));
}

/**
 * Check if string contains XSS patterns
 */
export function hasXss(input: string): boolean {
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
export function hasPathTraversal(input: string): boolean {
  return /\.\.[\/\\]/.test(input);
}

/**
 * Check if string contains prompt injection attempts
 */
export function hasPromptInjection(input: string): boolean {
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
export function isSecureInput(input: string): { 
  safe: boolean; 
  threats: string[] 
} {
  const threats: string[] = [];
  
  if (hasXss(input)) threats.push('XSS attempt detected');
  if (hasSqlInjection(input)) threats.push('SQL injection attempt detected');
  if (hasNoSqlInjection(input)) threats.push('NoSQL injection attempt detected');
  if (hasCommandInjection(input)) threats.push('Command injection attempt detected');
  if (hasPathTraversal(input)) threats.push('Path traversal attempt detected');
  if (hasPromptInjection(input)) threats.push('Prompt injection attempt detected');
  if (hasControlCharacters(input)) threats.push('Control characters detected');
  
  return {
    safe: threats.length === 0,
    threats
  };
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
}

/**
 * Rate limit key generator
 */
export function generateRateLimitKey(ip: string, endpoint: string): string {
  return `ratelimit:${hashData(ip)}:${hashData(endpoint)}`;
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: any): any {
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn'];
  
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const masked = Array.isArray(data) ? [...data] : { ...data };
  
  for (const key in masked) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      masked[key] = '***REDACTED***';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }
  
  return masked;
}

/**
 * Check if IP is in allowed list
 */
export function isIpAllowed(ip: string, allowedIps: string[]): boolean {
  const normalizedIp = ip.replace('::ffff:', '');
  return allowedIps.includes(normalizedIp) || allowedIps.includes('*');
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) score += 1;
  else feedback.push('Password should be at least 8 characters long');
  
  if (password.length >= 12) score += 1;
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Password should contain lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Password should contain uppercase letters');
  
  if (/[0-9]/.test(password)) score += 1;
  else feedback.push('Password should contain numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else feedback.push('Password should contain special characters');
  
  return {
    valid: score >= 4,
    score,
    feedback
  };
}
