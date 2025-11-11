import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
// Removed User model import - running in email-only mode without MongoDB
import { TwoFactorService } from './twoFactor.service';
import SessionManager from './session.manager';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly twoFactorService: TwoFactorService;
  
  // Mock users for demo mode (email-only mode without MongoDB)
  private readonly mockUsers: Array<{
    id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
  }> = [
    {
      id: 'demo-user-1',
      email: 'demo@example.com',
      password: 'password123', // In real app this would be hashed
      firstName: 'Demo',
      lastName: 'User',
      twoFactorEnabled: false,
      twoFactorSecret: null
    },
    {
      id: 'demo-user-2', 
      email: 'test@example.com',
      password: 'test123',
      firstName: 'Test',
      lastName: 'User',
      twoFactorEnabled: false,
      twoFactorSecret: null
    },
    {
      id: 'demo-user-3',
      email: 'suprunjen@gmail.com', 
      password: '03101998Polo',
      firstName: 'Evgeniia',
      lastName: 'Suprun',
      twoFactorEnabled: false,
      twoFactorSecret: null
    },
    {
      id: 'demo-user-4',
      email: 'freelancer@example.com', 
      password: 'freelancer123',
      firstName: 'John',
      lastName: 'Freelancer',
      twoFactorEnabled: false,
      twoFactorSecret: null
    }
  ];

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
    this.twoFactorService = new TwoFactorService();
  }

  public async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      // Check if user already exists in mock data
      const existingUser = this.mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new mock user (in demo mode, we just simulate registration)
      const newUserId = `demo-user-${Date.now()}`;
      const newUser = {
        id: newUserId,
        email: userData.email,
        password: userData.password, // In demo mode, storing plain password
        firstName: userData.firstName,
        lastName: userData.lastName,
        twoFactorEnabled: false,
        twoFactorSecret: null
      };

      // In a real app, we would add to database, here we just simulate
      // this.mockUsers.push(newUser); // Commented out to keep original demo users

      // Generate token
      const token = this.generateToken(newUserId);

      return {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          twoFactorEnabled: newUser.twoFactorEnabled
        }
      };
    } catch (error) {
      throw error;
    }
  }

  public async login(email: string, password: string) {
    try {
      // Find user in mock data (email-only mode)
      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password (direct comparison for demo)
      if (user.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        const tempToken = this.generateTempToken(user.id);
        return {
          requiresTwoFactor: true,
          tempToken
        };
      }

      // Generate token
      const token = this.generateToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          twoFactorEnabled: user.twoFactorEnabled
        }
      };
    } catch (error) {
      throw error;
    }
  }

  public async verifyTwoFactor(userId: string, code: string) {
    try {
      const user = this.mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.twoFactorSecret) {
        throw new Error('Two-factor authentication not set up');
      }

      const isCodeValid = this.twoFactorService.verifyToken(user.twoFactorSecret, code);
      if (!isCodeValid) {
        throw new Error('Invalid 2FA code');
      }

      const token = this.generateToken(user.id);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          twoFactorEnabled: user.twoFactorEnabled
        }
      };
    } catch (error) {
      throw error;
    }
  }

  public async setupTwoFactor(userId: string) {
    try {
      const user = this.mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      const { secret, qrCodeUrl } = await this.twoFactorService.generateSecret(user.email);
      // In demo mode, we would update mock user data
      user.twoFactorSecret = secret;

      return {
        secret,
        qrCodeUrl
      };
    } catch (error) {
      throw error;
    }
  }

  public async enableTwoFactor(userId: string, code: string) {
    try {
      const user = this.mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (!user.twoFactorSecret) {
        throw new Error('Two-factor secret not found');
      }

      const isCodeValid = this.twoFactorService.verifyToken(user.twoFactorSecret, code);
      if (!isCodeValid) {
        throw new Error('Invalid 2FA code');
      }

      user.twoFactorEnabled = true;
      // In demo mode, changes are only in memory

      return {
        message: '2FA enabled successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  public async initiatePasswordReset(email: string) {
    try {
      const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // In demo mode, we simulate password reset but don't actually store tokens
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      // Return success for demo purposes

      return {
        resetToken,
        message: 'Password reset initiated'
      };
    } catch (error) {
      throw error;
    }
  }

  public async resetPassword(token: string, newPassword: string) {
    try {
      // In demo mode, we simulate password reset
      // Find user by email (simplified for demo)
      const user = this.mockUsers.find(u => u.email === 'suprunjen@gmail.com'); // Demo user
      
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password in demo mode
      user.password = newPassword; // In demo mode, storing plain password
      
      console.log(`Password updated for user: ${user.email}`);

      return {
        message: 'Password reset successful'
      };
    } catch (error) {
      throw error;
    }
  }

  public async logout(token: string) {
    try {
      // In demo mode, we simulate logout without Redis
      console.log(`User logged out with token: ${token.substring(0, 10)}...`);
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(userId: string): string {
    const secret = this.JWT_SECRET || 'fallback-secret';
    const payload = { userId };
    return jwt.sign(payload, secret, { expiresIn: this.JWT_EXPIRES_IN || '24h' } as any);
  }

  private generateTempToken(userId: string): string {
    const secret = this.JWT_SECRET || 'fallback-secret';
    const payload = { userId, temp: true };
    return jwt.sign(payload, secret, { expiresIn: '5m' } as any);
  }

  public async validateToken(token: string) {
    try {
      // In demo mode, we skip Redis blacklist check
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; temp?: boolean };
      if (decoded.temp) {
        throw new Error('Cannot use temporary token for this operation');
      }

      return decoded;
    } catch (error) {
      throw error;
    }
  }
}