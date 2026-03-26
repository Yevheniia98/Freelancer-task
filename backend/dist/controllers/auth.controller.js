"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const email_service_1 = require("../services/email.service");
const password_validator_1 = require("../utils/password.validator");
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { fullName, email, password, confirmPassword, phoneNumber, country } = req.body;
                // Input validation
                if (!fullName || !email || !password || !confirmPassword) {
                    res.status(400).json({
                        success: false,
                        message: 'All fields are required',
                        errors: ['fullName', 'email', 'password', 'confirmPassword'].filter(field => !req.body[field]).map(field => `${field} is required`)
                    });
                    return;
                }
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid email format',
                        errors: ['Please provide a valid email address']
                    });
                    return;
                }
                // Password confirmation validation
                if (password !== confirmPassword) {
                    res.status(400).json({
                        success: false,
                        message: 'Passwords do not match',
                        errors: ['Password and confirm password must match']
                    });
                    return;
                }
                // Split full name into first and last name
                const nameParts = fullName.trim().split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || 'User'; // Default to 'User' if no last name provided
                if (!firstName) {
                    res.status(400).json({
                        success: false,
                        message: 'Please provide at least a first name',
                        errors: ['First name is required']
                    });
                    return;
                }
                // Password strength validation
                const passwordValidation = password_validator_1.PasswordValidator.validate(password, {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: false, // Made optional for better UX
                    requireNoCommonPatterns: true,
                    requireNoUserInfo: true
                }, {
                    email: email,
                    firstName: firstName,
                    lastName: lastName
                });
                if (!passwordValidation.isValid) {
                    res.status(400).json({
                        success: false,
                        message: 'Password does not meet security requirements',
                        errors: passwordValidation.errors,
                        suggestions: passwordValidation.suggestions,
                        passwordStrength: {
                            score: passwordValidation.score,
                            strength: passwordValidation.strength,
                            color: password_validator_1.PasswordValidator.getPasswordStrengthColor(passwordValidation.strength)
                        }
                    });
                    return;
                }
                // Attempt registration
                const result = await this.authService.register({
                    email: email.toLowerCase(),
                    password,
                    firstName,
                    lastName,
                    fullName,
                    phoneNumber,
                    country
                });
                // Log successful registration
                console.log('User registered successfully:', result.user.email);
                res.status(201).json({
                    success: true,
                    message: 'Account created successfully',
                    data: {
                        token: result.token,
                        user: result.user
                    },
                    passwordStrength: {
                        score: passwordValidation.score,
                        strength: passwordValidation.strength,
                        color: password_validator_1.PasswordValidator.getPasswordStrengthColor(passwordValidation.strength)
                    }
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                // Handle specific error cases
                if (error.message === 'User already exists') {
                    res.status(409).json({
                        success: false,
                        message: 'An account with this email already exists',
                        errors: ['Please use a different email address or try logging in']
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while creating your account',
                    errors: ['Please try again later']
                });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                // Input validation
                if (!email || !password) {
                    res.status(400).json({
                        success: false,
                        message: 'Email and password are required',
                        errors: ['Please provide both email and password']
                    });
                    return;
                }
                // Track login attempt
                console.log('Login attempt for:', email.toLowerCase());
                const result = await this.authService.login(email.toLowerCase(), password);
                // Login successful
                console.log('Login successful for:', email.toLowerCase());
                res.status(200).json({
                    success: true,
                    message: 'Login successful',
                    data: result
                });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                    errors: ['Please check your credentials and try again']
                });
            }
        };
        this.validatePassword = async (req, res) => {
            try {
                const { password, userInfo } = req.body;
                if (!password) {
                    res.status(400).json({
                        success: false,
                        message: 'Password is required',
                        errors: ['Please provide a password to validate']
                    });
                    return;
                }
                const validation = password_validator_1.PasswordValidator.validate(password, {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: false,
                    requireNoCommonPatterns: true,
                    requireNoUserInfo: true
                }, userInfo);
                res.status(200).json({
                    success: true,
                    data: {
                        isValid: validation.isValid,
                        score: validation.score,
                        strength: validation.strength,
                        strengthText: password_validator_1.PasswordValidator.getPasswordStrengthText(validation.strength),
                        color: password_validator_1.PasswordValidator.getPasswordStrengthColor(validation.strength),
                        errors: validation.errors,
                        suggestions: validation.suggestions
                    }
                });
            }
            catch (error) {
                console.error('Password validation error:', error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while validating password',
                    errors: ['Please try again later']
                });
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({
                        success: false,
                        message: 'Email is required',
                        errors: ['Please provide your email address']
                    });
                    return;
                }
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid email format',
                        errors: ['Please provide a valid email address']
                    });
                    return;
                }
                // Find user by email
                const user = await user_model_1.User.findOne({ email: email.toLowerCase() });
                if (!user) {
                    // For security, don't reveal if email exists
                    res.status(200).json({
                        success: true,
                        message: 'If an account with this email exists, a reset code will be sent'
                    });
                    return;
                }
                // Generate verification code (6 digits)
                const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
                console.log(`🔑 Generated verification code for ${email}: ${verificationCode}`);
                // Hash the verification code before storing
                const hashedCode = await bcryptjs_1.default.hash(verificationCode, 10);
                // Save the hashed code and expiration to user
                user.resetPasswordToken = hashedCode;
                user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                await user.save();
                // Send reset email
                const emailSent = await this.emailService.sendPasswordResetEmail(email.toLowerCase(), verificationCode, user.firstName || 'User');
                if (!emailSent) {
                    // Clear the token if email fails
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    await user.save();
                    res.status(500).json({
                        success: false,
                        message: 'Failed to send reset email',
                        errors: ['Please try again later']
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Reset code sent successfully! Check your email for instructions.',
                    data: {
                        email: email.toLowerCase(),
                        // For demo purposes, also include the code in response (remove in production)
                        verificationCode: verificationCode,
                        expiresIn: '15 minutes'
                    }
                });
            }
            catch (error) {
                console.error('Forgot password error:', error);
                // For demo mode, always show success to prevent email enumeration
                res.status(200).json({
                    success: true,
                    message: 'If an account with this email exists, a reset code will be sent'
                });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { email, verificationCode, action, newPassword } = req.body;
                // Input validation
                if (!email || !verificationCode || !action) {
                    res.status(400).json({
                        success: false,
                        message: 'Missing required fields',
                        errors: ['Email, verification code, and action are required']
                    });
                    return;
                }
                if (!['keep', 'change'].includes(action)) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid action',
                        errors: ['Action must be either "keep" or "change"']
                    });
                    return;
                }
                if (action === 'change' && !newPassword) {
                    res.status(400).json({
                        success: false,
                        message: 'New password required',
                        errors: ['Please provide a new password']
                    });
                    return;
                }
                // Find user with reset token
                const user = await user_model_1.User.findOne({
                    email: email.toLowerCase(),
                    resetPasswordExpires: { $gt: Date.now() }
                }).select('+password');
                if (!user || !user.resetPasswordToken) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid or expired verification code',
                        errors: ['Please request a new verification code']
                    });
                    return;
                }
                // Verify the code
                const isValidCode = await bcryptjs_1.default.compare(verificationCode, user.resetPasswordToken);
                if (!isValidCode) {
                    res.status(400).json({
                        success: false,
                        message: 'Invalid verification code',
                        errors: ['Please check your code and try again']
                    });
                    return;
                }
                let message = '';
                if (action === 'change') {
                    // Validate new password
                    const passwordValidation = password_validator_1.PasswordValidator.validate(newPassword, {
                        minLength: 8,
                        requireUppercase: true,
                        requireLowercase: true,
                        requireNumbers: true,
                        requireSpecialChars: false,
                        requireNoCommonPatterns: true,
                        requireNoUserInfo: true
                    }, {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                    if (!passwordValidation.isValid) {
                        res.status(400).json({
                            success: false,
                            message: 'Password does not meet security requirements',
                            errors: passwordValidation.errors,
                            suggestions: passwordValidation.suggestions
                        });
                        return;
                    }
                    // Hash and update password
                    user.password = await bcryptjs_1.default.hash(newPassword, 10);
                    message = 'Password updated successfully';
                }
                else {
                    message = 'Password verification successful - password unchanged';
                }
                // Clear reset token
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                await user.save();
                // Generate JWT token for automatic login
                const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
                res.status(200).json({
                    success: true,
                    message,
                    data: {
                        action: action,
                        token: token,
                        user: {
                            id: user._id,
                            email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName
                        }
                    }
                });
            }
            catch (error) {
                console.error('Reset password error:', error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while resetting password',
                    errors: ['Please try again later']
                });
            }
        };
        /**
         * Get current authenticated user
         */
        this.getCurrentUser = async (req, res) => {
            try {
                const user = req.user;
                if (!user) {
                    res.status(401).json({
                        success: false,
                        message: 'Not authenticated'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email.split('@')[0],
                        firstName: user.firstName,
                        lastName: user.lastName,
                        fullName: user.fullName,
                        username: user.username || user.email.split('@')[0],
                        phoneNumber: user.phoneNumber,
                        country: user.country,
                        profileImage: user.profileImage
                    }
                });
            }
            catch (error) {
                console.error('Get current user error:', error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while fetching user data'
                });
            }
        };
        /**
         * Update user profile
         */
        this.updateProfile = async (req, res) => {
            try {
                const userId = req.user?._id;
                const { fullName, phoneNumber, country, profileImage } = req.body;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Not authenticated'
                    });
                    return;
                }
                // Update user in database
                const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, {
                    fullName,
                    phoneNumber,
                    country,
                    profileImage
                }, { new: true, runValidators: true });
                if (!updatedUser) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Profile updated successfully',
                    user: {
                        id: updatedUser._id,
                        email: updatedUser.email,
                        fullName: updatedUser.fullName,
                        phoneNumber: updatedUser.phoneNumber,
                        country: updatedUser.country,
                        profileImage: updatedUser.profileImage
                    }
                });
            }
            catch (error) {
                console.error('Update profile error:', error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while updating profile'
                });
            }
        };
        /**
         * Delete user account
         */
        this.deleteAccount = async (req, res) => {
            try {
                const userId = req.user?._id;
                const { password } = req.body;
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: 'Not authenticated'
                    });
                    return;
                }
                if (!password) {
                    res.status(400).json({
                        success: false,
                        message: 'Password is required to delete account'
                    });
                    return;
                }
                // Find user with password field
                const user = await user_model_1.User.findById(userId).select('+password');
                if (!user) {
                    res.status(404).json({
                        success: false,
                        message: 'User not found'
                    });
                    return;
                }
                // Verify password
                const bcrypt = require('bcrypt');
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid password'
                    });
                    return;
                }
                // Delete user account
                await user_model_1.User.findByIdAndDelete(userId);
                console.log('Account deleted successfully:', user.email);
                res.status(200).json({
                    success: true,
                    message: 'Account deleted successfully'
                });
            }
            catch (error) {
                console.error('Delete account error:', error);
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while deleting account'
                });
            }
        };
        this.authService = new auth_service_1.AuthService();
        this.emailService = new email_service_1.EmailService();
    }
}
exports.AuthController = AuthController;
