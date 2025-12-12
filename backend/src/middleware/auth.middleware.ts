import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { SecurityMonitor, SecurityEventType } from '../services/security.monitor';
import { isValidMongoId } from '../utils/security.utils';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const ipAddress = (req.ip || req.socket.remoteAddress || 'unknown').replace('::ffff:', '');

    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Check token format
    if (token.length < 20 || token.length > 500) {
      console.log('Auth middleware: Invalid token format');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format.' 
      });
    }

    console.log('Auth middleware: Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    console.log('Auth middleware: Token decoded:', { userId: decoded.userId, id: decoded.id });
    
    const userId = decoded.userId || decoded.id; // Support both userId and id fields
    
    // Validate userId format
    if (!isValidMongoId(userId)) {
      console.log('Auth middleware: Invalid user ID format');
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    
    const user = await User.findById(userId).select('-password');

    if (!user) {
      console.log('Auth middleware: User not found for ID:', userId);
      
      // Log potential token compromise
      const securityMonitor = SecurityMonitor.getInstance();
      await securityMonitor.logEvent(SecurityEventType.TOKEN_COMPROMISED, {
        userId: userId,
        ipAddress,
        userAgent: req.get('user-agent') || 'unknown',
        metadata: {
          reason: 'User not found for valid token',
          path: req.path,
          method: req.method
        }
      });
      
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }

    console.log('Auth middleware: User authenticated:', user._id);
    req.user = user;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Auth middleware error:', errorMessage);
    
    // Log failed authentication attempt
    const ipAddress = (req.ip || req.socket.remoteAddress || 'unknown').replace('::ffff:', '');
    const securityMonitor = SecurityMonitor.getInstance();
    
    await securityMonitor.logEvent(SecurityEventType.UNAUTHORIZED_ACCESS, {
      ipAddress,
      userAgent: req.get('user-agent') || 'unknown',
      metadata: {
        error: errorMessage,
        path: req.path,
        method: req.method
      }
    });
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

export const authenticate = authMiddleware;