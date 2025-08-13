import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User, IUser } from '../models/user.model';
import { getRedisClient } from '../config/redis';
import { TwoFactorService } from './twoFactor.service';
import SessionManager from './session.manager';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly twoFactorService: TwoFactorService;

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
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        twoFactorEnabled: false
      });

      await user.save();

      // Generate token
      const token = this.generateToken(String(user._id));

      return {
        token,
        user: {
          id: user._id,
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

  public async login(email: string, password: string) {
    try {
      // Find user
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        const tempToken = this.generateTempToken(String(user._id));
        return {
          requiresTwoFactor: true,
          tempToken
        };
      }

      // Generate token
      const token = this.generateToken(String(user._id));

      return {
        token,
        user: {
          id: user._id,
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
      const user = await User.findById(userId).select('+twoFactorSecret');
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

      const token = this.generateToken(String(user._id));

      return {
        token,
        user: {
          id: user._id,
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
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const { secret, qrCodeUrl } = await this.twoFactorService.generateSecret(user.email);
      user.twoFactorSecret = secret;
      await user.save();

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
      const user = await User.findById(userId);
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
      await user.save();

      return {
        message: '2FA enabled successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  public async initiatePasswordReset(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

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
      const resetTokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return {
        message: 'Password reset successful'
      };
    } catch (error) {
      throw error;
    }
  }

  public async logout(token: string) {
    try {
      const redisClient = await getRedisClient();
      await redisClient.set(`blacklist:${token}`, 'true', 'EX', 86400); // 24 hours
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
      const redisClient = await getRedisClient();
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (isBlacklisted) {
        throw new Error('Token is blacklisted');
      }

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