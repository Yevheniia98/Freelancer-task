import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { PasswordValidator } from '../utils/password.validator';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export class AuthController {
  private authService: AuthService;
  private emailService: EmailService;

  constructor() {
    this.authService = new AuthService();
    this.emailService = new EmailService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { fullName, email, password, confirmPassword } = req.body;

      // Input validation
      if (!fullName || !email || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: 'All fields are required',
          errors: ['fullName', 'email', 'password', 'confirmPassword'].filter(
            field => !req.body[field]
          ).map(field => `${field} is required`)
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
      const passwordValidation = PasswordValidator.validate(password, {
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
            color: PasswordValidator.getPasswordStrengthColor(passwordValidation.strength)
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
          color: PasswordValidator.getPasswordStrengthColor(passwordValidation.strength)
        }
      });

    } catch (error: any) {
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

  public login = async (req: Request, res: Response): Promise<void> => {
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

    } catch (error: any) {
      console.error('Login error:', error);

      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: ['Please check your credentials and try again']
      });
    }
  };

  public validatePassword = async (req: Request, res: Response): Promise<void> => {
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

      const validation = PasswordValidator.validate(password, {
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
          strengthText: PasswordValidator.getPasswordStrengthText(validation.strength),
          color: PasswordValidator.getPasswordStrengthColor(validation.strength),
          errors: validation.errors,
          suggestions: validation.suggestions
        }
      });

    } catch (error: any) {
      console.error('Password validation error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while validating password',
        errors: ['Please try again later']
      });
    }
  };

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
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

      // Use auth service for password reset (works in demo mode without MongoDB)
      try {
        const result = await this.authService.initiatePasswordReset(email.toLowerCase());
        
        // Generate verification code (6 digits) for email
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // In demo mode, we simulate finding user info
        const mockUserName = email === 'suprunjen@gmail.com' ? 'Evgeniia Suprun' : 'Demo User';
        
        // Send reset email with verification code
        const emailSent = await this.emailService.sendPasswordResetEmail(
          email.toLowerCase(),
          verificationCode,
          mockUserName
        );

      if (!emailSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to send reset email',
          errors: ['Please try again later']
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Reset code sent successfully',
        data: {
          email: user.email
        }
      });

    } catch (error: any) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while processing your request',
        errors: ['Please try again later']
      });
    }
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
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

      // In demo mode, we simulate verification code validation
      // For demo purposes, we accept any 6-digit code
      if (!verificationCode || verificationCode.length !== 6) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code format',
          errors: ['Verification code must be 6 digits']
        });
        return;
      }

      // In demo mode, check if email exists in our mock users
      const mockUsers = ['suprunjen@gmail.com', 'demo@example.com', 'test@example.com', 'freelancer@example.com'];
      if (!mockUsers.includes(email.toLowerCase())) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code',
          errors: ['Please request a new verification code']
        });
        return;
      }

      let message = '';

      if (action === 'change') {
        // Validate new password (demo mode - using mock user info)
        const mockUserInfo = {
          email: email.toLowerCase(),
          firstName: email === 'suprunjen@gmail.com' ? 'Evgeniia' : 'Demo',
          lastName: email === 'suprunjen@gmail.com' ? 'Suprun' : 'User'
        };
        
        const passwordValidation = PasswordValidator.validate(newPassword, {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
          requireNoCommonPatterns: true,
          requireNoUserInfo: true
        }, mockUserInfo);

        if (!passwordValidation.isValid) {
          res.status(400).json({
            success: false,
            message: 'Password does not meet security requirements',
            errors: passwordValidation.errors,
            suggestions: passwordValidation.suggestions
          });
          return;
        }

        // In demo mode, simulate password update using auth service
        try {
          await this.authService.resetPassword('demo-token', newPassword);
          message = 'Password updated successfully';
        } catch (error) {
          res.status(500).json({
            success: false,
            message: 'Failed to update password',
            errors: ['Please try again later']
          });
          return;
        }
      } else {
        message = 'Password verification successful - password unchanged';
      }

      // In demo mode, we simulate clearing reset token (no actual database operation needed)

      res.status(200).json({
        success: true,
        message,
        data: {
          action: action
        }
      });

    } catch (error: any) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while resetting password',
        errors: ['Please try again later']
      });
    }
  };
}