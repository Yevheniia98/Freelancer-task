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
const redis_1 = require("../config/redis");
const twoFactor_service_1 = require("./twoFactor.service");
class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
        this.twoFactorService = new twoFactor_service_1.TwoFactorService();
    }
    async register(userData) {
        try {
            // Check if user already exists
            const existingUser = await user_model_1.User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            // Hash password
            const salt = await bcrypt_1.default.genSalt(10);
            const hashedPassword = await bcrypt_1.default.hash(userData.password, salt);
            // Create new user
            const user = new user_model_1.User({
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
        }
        catch (error) {
            throw error;
        }
    }
    async login(email, password) {
        try {
            // Find user
            const user = await user_model_1.User.findOne({ email }).select('+password');
            if (!user) {
                throw new Error('Invalid credentials');
            }
            // Check password
            const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
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
        }
        catch (error) {
            throw error;
        }
    }
    async verifyTwoFactor(userId, code) {
        try {
            const user = await user_model_1.User.findById(userId).select('+twoFactorSecret');
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
            const user = await user_model_1.User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            const resetTokenHash = crypto_1.default
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
        }
        catch (error) {
            throw error;
        }
    }
    async resetPassword(token, newPassword) {
        try {
            const resetTokenHash = crypto_1.default
                .createHash('sha256')
                .update(token)
                .digest('hex');
            const user = await user_model_1.User.findOne({
                resetPasswordToken: resetTokenHash,
                resetPasswordExpires: { $gt: Date.now() }
            });
            if (!user) {
                throw new Error('Invalid or expired reset token');
            }
            const salt = await bcrypt_1.default.genSalt(10);
            user.password = await bcrypt_1.default.hash(newPassword, salt);
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
            const redisClient = await (0, redis_1.getRedisClient)();
            await redisClient.set(`blacklist:${token}`, 'true', 'EX', 86400); // 24 hours
            return { message: 'Logged out successfully' };
        }
        catch (error) {
            throw error;
        }
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
    generateTempToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, temp: true }, this.JWT_SECRET, { expiresIn: '5m' });
    }
    async validateToken(token) {
        try {
            const redisClient = await (0, redis_1.getRedisClient)();
            const isBlacklisted = await redisClient.get(`blacklist:${token}`);
            if (isBlacklisted) {
                throw new Error('Token is blacklisted');
            }
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
