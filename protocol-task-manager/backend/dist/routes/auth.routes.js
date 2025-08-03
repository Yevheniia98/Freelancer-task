"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const validator_middleware_1 = require("../middleware/validator.middleware");
const router = express_1.default.Router();
const authController = new auth_controller_1.AuthController();
// Registration validation rules
const registerValidation = [
    (0, express_validator_1.body)('fullName')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    (0, express_validator_1.body)('confirmPassword')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    })
];
// Login validation rules
const loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
// Password validation rules
const passwordValidation = [
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required')
];
// Routes
router.post('/register', registerValidation, validator_middleware_1.validateRequest, authController.register);
router.post('/login', loginValidation, validator_middleware_1.validateRequest, authController.login);
router.post('/validate-password', passwordValidation, validator_middleware_1.validateRequest, authController.validatePassword);
exports.default = router;
