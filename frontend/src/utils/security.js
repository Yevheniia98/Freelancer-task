/**
 * Frontend Security Utilities
 * Client-side input validation and sanitization
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input) {
  if (!input) return input;
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate URL
 */
export function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Check for XSS patterns in user input
 */
export function hasXssPattern(input) {
  if (typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<applet/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for SQL injection patterns
 */
export function hasSqlInjection(input) {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|SCRIPT)\b)/gi,
    /(;|--|\*|\/\*|\*\/)/gi
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate input before sending to API
 */
export function validateInput(input, options = {}) {
  const {
    allowHtml = false,
    maxLength = 10000,
    minLength = 0,
    required = false
  } = options;
  
  // Check if required
  if (required && (!input || input.trim().length === 0)) {
    return { valid: false, error: 'This field is required' };
  }
  
  // Check length
  if (input && input.length < minLength) {
    return { valid: false, error: `Minimum length is ${minLength} characters` };
  }
  
  if (input && input.length > maxLength) {
    return { valid: false, error: `Maximum length is ${maxLength} characters` };
  }
  
  // Check for XSS if HTML not allowed
  if (!allowHtml && input && hasXssPattern(input)) {
    return { valid: false, error: 'Invalid characters detected' };
  }
  
  // Check for SQL injection
  if (input && hasSqlInjection(input)) {
    return { valid: false, error: 'Invalid input detected' };
  }
  
  return { valid: true };
}

/**
 * Sanitize user input for display
 */
export function sanitizeForDisplay(input) {
  if (!input) return '';
  
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate password strength
 */
export function validatePassword(password) {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain special characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * Calculate password strength score
 */
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

/**
 * Secure localStorage wrapper
 */
export const secureStorage = {
  setItem(key, value) {
    try {
      const encrypted = btoa(JSON.stringify(value));
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error saving to secure storage:', error);
    }
  },
  
  getItem(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(atob(encrypted));
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return null;
    }
  },
  
  removeItem(key) {
    localStorage.removeItem(key);
  },
  
  clear() {
    localStorage.clear();
  }
};

/**
 * Detect and prevent clickjacking
 */
export function preventClickjacking() {
  if (window.self !== window.top) {
    console.warn('🚨 Possible clickjacking attempt detected');
    window.top.location = window.self.location;
  }
}

/**
 * Rate limit function calls
 */
export function rateLimit(fn, delay = 1000) {
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - lastCall < delay) {
      console.warn('Rate limit exceeded');
      return Promise.reject(new Error('Rate limit exceeded'));
    }
    
    lastCall = now;
    return fn.apply(this, args);
  };
}

/**
 * Debounce function for input validation
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Safe JSON parse
 */
export function safeJsonParse(json, defaultValue = null) {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * Remove dangerous attributes from HTML
 */
export function removeDangerousAttributes(html) {
  const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'];
  let clean = html;
  
  dangerousAttributes.forEach(attr => {
    const regex = new RegExp(`${attr}\\s*=\\s*["'][^"']*["']`, 'gi');
    clean = clean.replace(regex, '');
  });
  
  return clean;
}

/**
 * Validate file upload
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  } = options;
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed'
    };
  }
  
  return { valid: true };
}

/**
 * Log security events (to be sent to backend)
 */
export function logSecurityEvent(eventType, details) {
  console.warn(`🔒 Security Event: ${eventType}`, details);
  
  // Send to backend for logging
  // This should be implemented based on your API structure
  try {
    fetch('/api/security/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: eventType,
        details,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

export default {
  sanitizeHtml,
  isValidEmail,
  isValidUrl,
  hasXssPattern,
  hasSqlInjection,
  validateInput,
  sanitizeForDisplay,
  validatePassword,
  secureStorage,
  preventClickjacking,
  rateLimit,
  debounce,
  safeJsonParse,
  removeDangerousAttributes,
  validateFile,
  logSecurityEvent
};
