"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const user_model_1 = require("../models/user.model");
const twoFactor_service_1 = require("./twoFactor.service");
const subscription_service_1 = require("./subscription.service");
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
        this.twoFactorService = new twoFactor_service_1.TwoFactorService();
        this.subscriptionService = new subscription_service_1.SubscriptionService();
    }
    async register(userData) {
        try {
            // Check if user already exists in database
            const existingUser = await user_model_1.User.findOne({ email: userData.email.toLowerCase() });
            if (existingUser) {
                throw new Error('User already exists');
            }
            // Hash password
            const saltRounds = 12;
            const hashedPassword = await bcrypt_1.default.hash(userData.password, saltRounds);
            // Create new user in database
            const newUser = new user_model_1.User({
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
                    await this.subscriptionService.createFreeSubscription(savedUser._id);
                    console.log('✅ Free subscription created for user:', savedUser.email);
                }
                catch (subError) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async login(email, password) {
        try {
            // Find user in database
            const user = await user_model_1.User.findOne({ email: email.toLowerCase() }).select('+password');
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Check password using bcrypt
            const isValidPassword = await bcrypt_1.default.compare(password, user.password);
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
        }
        catch (error) {
            throw error;
        }
    }
    async verifyTwoFactor(userId, code) {
        try {
            const user = await user_model_1.User.findById(userId);
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
        }
        catch (error) {
            throw error;
        }
    }
    async setupTwoFactor(userId) {
        try {
            const user = await user_model_1.User.findById(userId);
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
        }
        catch (error) {
            throw error;
        }
    }
    async enableTwoFactor(userId, code) {
        try {
            const user = await user_model_1.User.findById(userId);
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
        }
        catch (error) {
            throw error;
        }
    }
    async initiatePasswordReset(email) {
        try {
            const user = await user_model_1.User.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new Error('User not found');
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetTokenHash = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
            user.resetPasswordToken = resetTokenHash;
            user.resetPasswordExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
            await user.save();
            return {
                resetToken,
                message: 'Password reset initiated'
            };
        }
        catch (error) {
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const resetTokenHash = crypto_1.default.createHash('sha256').update(token).digest('hex');
            const user = await user_model_1.User.findOne({
                resetPasswordToken: resetTokenHash,
                resetPasswordExpires: { $gt: new Date() }
            });
            if (!user) {
                throw new Error('Invalid or expired reset token');
            }
            // Hash the new password
            const saltRounds = 12;
            user.password = await bcrypt_1.default.hash(newPassword, saltRounds);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            return {
                message: 'Password reset successful'
            };
        }
        catch (error) {
            throw error;
        }
    }
    async logout(token) {
        try {
            console.log(`User logged out with token: ${token.substring(0, 10)}...`);
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    generateToken(userId) {
        const secret = this.JWT_SECRET || 'fallback-secret';
        const payload = { userId };
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: this.JWT_EXPIRES_IN || '24h' });
    }
    generateTempToken(userId) {
        const secret = this.JWT_SECRET || 'fallback-secret';
        const payload = { userId, temp: true };
        return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '5m' });
    }
    async validateToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
            if (decoded.temp) {
                throw new Error('Cannot use temporary token for this operation');
            }
            return decoded;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.AuthService = AuthService;
