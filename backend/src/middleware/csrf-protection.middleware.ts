import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 * Protects against Cross-Site Request Forgery attacks
 */

interface CsrfSession {
  csrfToken?: string;
}

/**
 * Generate a CSRF token
 */
function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Middleware to generate and attach CSRF token to session
 */
export const csrfTokenGenerator = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session as any;
  
  if (!session.csrfToken) {
    session.csrfToken = generateCsrfToken();
  }
  
  // Attach token to response for client to use
  res.locals.csrfToken = session.csrfToken;
  
  next();
};

/**
 * Middleware to validate CSRF token on state-changing requests
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Only check CSRF for state-changing methods
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }
  
  const session = req.session as any;
  const token = req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf;
  
  if (!token || token !== session.csrfToken) {
    console.warn('🚨 CSRF token validation failed:', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      expectedToken: session.csrfToken ? 'exists' : 'missing',
      receivedToken: token ? 'exists' : 'missing'
    });
    
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
      code: 'CSRF_VALIDATION_FAILED'
    });
  }
  
  next();
};

/**
 * Get CSRF token endpoint
 */
export const getCsrfToken = (req: Request, res: Response) => {
  const session = req.session as any;
  
  if (!session.csrfToken) {
    session.csrfToken = generateCsrfToken();
  }
  
  res.json({
    success: true,
    csrfToken: session.csrfToken
  });
};
