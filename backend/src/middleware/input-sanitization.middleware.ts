import { Request, Response, NextFunction } from 'express';
import { SecurityMonitor, SecurityEventType } from '../services/security.monitor';

/**
 * Input Sanitization Middleware
 * Protects against XSS, SQL injection, NoSQL injection, and prompt injection attacks
 */

// Dangerous patterns that might indicate attacks
const MALICIOUS_PATTERNS = [
  // XSS patterns
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // Event handlers like onclick=, onload=
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<applet/gi,
  
  // SQL Injection patterns
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
  /(;|--|\*|\/\*|\*\/|xp_|sp_)/gi,
  /('|('')|;|--|\/\*|\*\/)/gi,
  
  // NoSQL Injection patterns
  /\$where/gi,
  /\$ne/gi,
  /\$gt/gi,
  /\$lt/gi,
  /\$regex/gi,
  /\{\s*\$where/gi,
  
  // Command Injection
  /(\||&&|;|\n|\r|`|\$\()/gi,
  
  // Path Traversal
  /\.\.[\/\\]/gi,
  
  // Prompt Injection patterns (for AI/LLM protection)
  /ignore\s+(previous|all|above)\s+(instructions|prompts?|commands?)/gi,
  /disregard\s+(previous|all|above)\s+(instructions|prompts?|commands?)/gi,
  /new\s+(instruction|prompt|command|task|role)/gi,
  /you\s+are\s+now/gi,
  /system\s*:\s*/gi,
  /act\s+as\s+(a\s+)?(different|another|new)/gi,
  /forget\s+(everything|all|previous)/gi,
  /override\s+(settings?|instructions?|rules?)/gi,
];

// Suspicious keywords that might be part of an attack
const SUSPICIOUS_KEYWORDS = [
  'eval', 'exec', 'system', 'cmd', 'shell', 'base64', 'atob', 'btoa',
  'innerHTML', 'outerHTML', 'document.write', 'document.cookie',
  '__proto__', 'constructor', 'prototype',
  'Function', 'setTimeout', 'setInterval'
];

interface SanitizationResult {
  isSafe: boolean;
  threats: string[];
  sanitizedValue?: any;
}

/**
 * Check if a string contains malicious patterns
 */
function detectThreats(value: string): string[] {
  const threats: string[] = [];
  
  // Check malicious patterns
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(value)) {
      threats.push(`Malicious pattern detected: ${pattern.source.substring(0, 50)}`);
    }
  }
  
  // Check suspicious keywords
  const lowerValue = value.toLowerCase();
  for (const keyword of SUSPICIOUS_KEYWORDS) {
    if (lowerValue.includes(keyword.toLowerCase())) {
      threats.push(`Suspicious keyword detected: ${keyword}`);
    }
  }
  
  return threats;
}

/**
 * Sanitize a string value
 */
function sanitizeString(value: string): SanitizationResult {
  const threats = detectThreats(value);
  
  if (threats.length > 0) {
    return { isSafe: false, threats };
  }
  
  // Basic HTML encoding for special characters
  const sanitized = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return { 
    isSafe: true, 
    threats: [],
    sanitizedValue: sanitized
  };
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any, maxDepth = 10, currentDepth = 0): SanitizationResult {
  if (currentDepth > maxDepth) {
    return { isSafe: false, threats: ['Max object depth exceeded'] };
  }
  
  const allThreats: string[] = [];
  const sanitized: any = Array.isArray(obj) ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      // Check key for malicious patterns
      if (typeof key === 'string') {
        const keyThreats = detectThreats(key);
        if (keyThreats.length > 0) {
          allThreats.push(...keyThreats.map(t => `In key "${key}": ${t}`));
          continue; // Skip this key-value pair
        }
      }
      
      // Sanitize value based on type
      if (value === null || value === undefined) {
        sanitized[key] = value;
      } else if (typeof value === 'string') {
        const result = sanitizeString(value);
        if (!result.isSafe) {
          allThreats.push(...result.threats.map(t => `In field "${key}": ${t}`));
        }
        sanitized[key] = value; // Keep original for now, just detect
      } else if (typeof value === 'object') {
        const result = sanitizeObject(value, maxDepth, currentDepth + 1);
        if (!result.isSafe) {
          allThreats.push(...result.threats.map(t => `In field "${key}": ${t}`));
        }
        sanitized[key] = result.sanitizedValue || value;
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return {
    isSafe: allThreats.length === 0,
    threats: allThreats,
    sanitizedValue: sanitized
  };
}

/**
 * Main input sanitization middleware
 */
export const inputSanitization = (options: { 
  blockOnThreat?: boolean;
  logThreats?: boolean;
  sanitizeOutput?: boolean;
} = {}) => {
  const { 
    blockOnThreat = true, 
    logThreats = true,
    sanitizeOutput = false 
  } = options;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const securityMonitor = SecurityMonitor.getInstance();
      const allThreats: string[] = [];
      
      // Check request body
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyResult = sanitizeObject(req.body);
        if (!bodyResult.isSafe) {
          allThreats.push(...bodyResult.threats);
          if (sanitizeOutput) {
            req.body = bodyResult.sanitizedValue;
          }
        }
      }
      
      // Check query parameters
      if (req.query && Object.keys(req.query).length > 0) {
        const queryResult = sanitizeObject(req.query);
        if (!queryResult.isSafe) {
          allThreats.push(...queryResult.threats);
          if (sanitizeOutput) {
            req.query = queryResult.sanitizedValue;
          }
        }
      }
      
      // Check URL parameters
      if (req.params && Object.keys(req.params).length > 0) {
        const paramsResult = sanitizeObject(req.params);
        if (!paramsResult.isSafe) {
          allThreats.push(...paramsResult.threats);
        }
      }
      
      // If threats detected
      if (allThreats.length > 0) {
        const ipAddress = (req.ip || req.socket.remoteAddress || 'unknown').replace('::ffff:', '');
        const userAgent = req.get('user-agent') || 'unknown';
        
        // Log the security event
        if (logThreats) {
          console.warn('🚨 Security threat detected:', {
            ip: ipAddress,
            method: req.method,
            path: req.path,
            threats: allThreats,
            userAgent
          });
          
          // Record in security monitor
          await securityMonitor.logEvent(SecurityEventType.XSS_ATTEMPT, {
            userId: (req as any).user?.id,
            ipAddress,
            userAgent,
            metadata: {
              method: req.method,
              path: req.path,
              threats: allThreats,
              body: sanitizeOutput ? 'sanitized' : 'blocked',
              timestamp: new Date()
            }
          });
        }
        
        // Block the request if configured
        if (blockOnThreat) {
          return res.status(400).json({
            success: false,
            message: 'Invalid input detected. Your request contains potentially malicious content.',
            code: 'MALICIOUS_INPUT_DETECTED'
          });
        }
      }
      
      next();
    } catch (error) {
      console.error('Error in input sanitization middleware:', error);
      next(error);
    }
  };
};

/**
 * Strict sanitization for sensitive operations
 */
export const strictInputSanitization = inputSanitization({
  blockOnThreat: true,
  logThreats: true,
  sanitizeOutput: false
});

/**
 * Lenient sanitization that sanitizes but doesn't block
 */
export const lenientInputSanitization = inputSanitization({
  blockOnThreat: false,
  logThreats: true,
  sanitizeOutput: true
});

/**
 * Validate and sanitize specific field types
 */
export const validateField = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  },
  
  username: (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  },
  
  url: (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },
  
  mongoId: (id: string): boolean => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },
  
  alphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9\s]+$/.test(value);
  }
};

export default inputSanitization;
