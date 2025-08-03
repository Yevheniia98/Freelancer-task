"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const security_monitor_1 = require("../services/security.monitor");
const password_validator_1 = require("../utils/password.validator");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { fullName, email, password, confirmPassword } = req.body;
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
                const lastName = nameParts.slice(1).join(' ') || '';
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
                    lastName
                });
                // Log successful registration
                await this.securityMonitor.logEvent(security_monitor_1.SecurityEventType.LOGIN_SUCCESS, {
                    userId: String(result.user.id),
                    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
                    userAgent: req.get('User-Agent'),
                    severity: 'low',
                    metadata: {
                        action: 'registration',
                        email: email.toLowerCase(),
                        passwordStrength: passwordValidation.strength
                    }
                });
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
                // Log failed registration attempt
                await this.securityMonitor.logEvent(security_monitor_1.SecurityEventType.LOGIN_FAILED, {
                    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
                    userAgent: req.get('User-Agent'),
                    severity: 'medium',
                    metadata: {
                        action: 'registration',
                        email: req.body.email?.toLowerCase(),
                        error: error.message
                    }
                });
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
                await this.securityMonitor.trackLoginAttempt(email.toLowerCase(), req.ip || req.connection.remoteAddress || 'unknown', false, // Will be updated to true if successful
                req.get('User-Agent'));
                const result = await this.authService.login(email.toLowerCase(), password);
                // Update login attempt to successful
                await this.securityMonitor.trackLoginAttempt(email.toLowerCase(), req.ip || req.connection.remoteAddress || 'unknown', true, req.get('User-Agent'));
                // Check for suspicious location
                if (result.user) {
                    await this.securityMonitor.checkSuspiciousLocation(String(result.user.id), req.ip || req.connection.remoteAddress || 'unknown');
                    // Track session
                    await this.securityMonitor.trackSession(String(result.user.id), req.ip || req.connection.remoteAddress || 'unknown', 'start');
                }
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
        this.authService = new auth_service_1.AuthService();
        this.securityMonitor = security_monitor_1.SecurityMonitor.getInstance();
    }
}
exports.AuthController = AuthController;
