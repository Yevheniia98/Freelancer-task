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
class AuthService {
    constructor() {
        // Mock users for demo mode (email-only mode without MongoDB)
        this.mockUsers = [
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
                email: 'suprun.jen@gmail.com',
                password: 'test123',
                firstName: 'Evgeniia',
                lastName: 'Suprun',
                twoFactorEnabled: false,
                twoFactorSecret: null
            },
            {
                id: 'demo-user-5',
                email: 'suprun.jen@gmail.com',
                password: 'test123',
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
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
        this.twoFactorService = new twoFactor_service_1.TwoFactorService();
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
                twoFactorEnabled: false
            });
            const savedUser = await newUser.save();
            // Generate token
            const token = this.generateToken(String(savedUser._id));
            return {
                token,
                user: {
                    id: String(savedUser._id),
                    email: savedUser.email,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
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
        }
        catch (error) {
            throw error;
        }
    }
    async setupTwoFactor(userId) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async enableTwoFactor(userId, code) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async initiatePasswordReset(email) {
        try {
            const user = this.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                throw new Error('User not found');
            }
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            // In demo mode, we simulate password reset but don't actually store tokens
            console.log(`Password reset token for ${email}: ${resetToken}`);
            // Return success for demo purposes
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
        }
        catch (error) {
            throw error;
        }
    }
    async logout(token) {
        try {
            // In demo mode, we simulate logout without Redis
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
            // In demo mode, we skip Redis blacklist check
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
