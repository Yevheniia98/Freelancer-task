import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validator.middleware';

const router = express.Router();
const authController = new AuthController();

// Registration validation rules
const registerValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// Login validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Password validation rules
const passwordValidation = [
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Forgot password validation rules
const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Reset password validation rules
const resetPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('verificationCode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('Verification code must be 6 digits'),
  
  body('action')
    .isIn(['keep', 'change'])
    .withMessage('Action must be either "keep" or "change"'),
  
  body('newPassword')
    .optional()
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
];

// Routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);
router.post('/validate-password', passwordValidation, validateRequest, authController.validatePassword);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, authController.resetPassword);

export default router;
