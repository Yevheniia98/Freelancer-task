import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from '../models/user.model';
import { TwoFactorService } from './twoFactor.service';
import { SubscriptionService } from './subscription.service';
import SessionManager from './session.manager';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly twoFactorService: TwoFactorService;
  private readonly subscriptionService: SubscriptionService;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
    this.twoFactorService = new TwoFactorService();
    this.subscriptionService = new SubscriptionService();
  }

  public async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    phoneNumber?: string;
    country?: string;
  }) {
    try {
      // Check if user already exists in database
      const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create new user in database
      const newUser = new User({
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        country: userData.country,
        twoFactorEnabled: false
      });

      const savedUser = await newUser.save();

      // Create free subscription for new user (not invited users - they get free access)
      if (!newUser.isInvitedUser) {
        try {
          await this.subscriptionService.createFreeSubscription(savedUser._id as any);
          console.log('✅ Free subscription created for user:', savedUser.email);
        } catch (subError) {
          console.error('⚠️ Failed to create subscription:', subError);
          // Don't fail registration if subscription creation fails
        }
      }

      // Generate token
      const token = this.generateToken(String(savedUser._id));

      return {
        token,
        user: {
          id: String(savedUser._id),
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          fullName: savedUser.fullName,
          phoneNumber: savedUser.phoneNumber,
          country: savedUser.country,
          twoFactorEnabled: savedUser.twoFactorEnabled
        }
      };
    } catch (error) {
      throw error;
    }
  }

  public async login(email: string, password: string) {
    try {
      // Find user in database
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password using bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
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
          id: String(user._id),
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
      const user = await User.findById(userId);
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
          id: String(user._id),
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
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('User not found');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
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
      const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
      
      const user = await User.findOne({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: { $gt: new Date() }
      });
      
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Hash the new password
      const saltRounds = 12;
      user.password = await bcrypt.hash(newPassword, saltRounds);
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