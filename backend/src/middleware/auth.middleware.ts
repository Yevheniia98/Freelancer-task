import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    console.log('Auth middleware: Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    console.log('Auth middleware: Token decoded:', { userId: decoded.userId, id: decoded.id });
    
    const userId = decoded.userId || decoded.id; // Support both userId and id fields
    const user = await User.findById(userId).select('-password');

    if (!user) {
      console.log('Auth middleware: User not found for ID:', userId);
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
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

export const authenticate = authMiddleware;