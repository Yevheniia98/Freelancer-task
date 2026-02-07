"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCsrfToken = exports.csrfProtection = exports.csrfTokenGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generate a CSRF token
 */
function generateCsrfToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
/**
 * Middleware to generate and attach CSRF token to session
 */
const csrfTokenGenerator = (req, res, next) => {
    const session = req.session;
    if (!session.csrfToken) {
        session.csrfToken = generateCsrfToken();
    }
    // Attach token to response for client to use
    res.locals.csrfToken = session.csrfToken;
    next();
};
exports.csrfTokenGenerator = csrfTokenGenerator;
/**
 * Middleware to validate CSRF token on state-changing requests
 */
const csrfProtection = (req, res, next) => {
    // Only check CSRF for state-changing methods
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }
    const session = req.session;
    const token = req.headers['x-csrf-token'] || req.body._csrf || req.query._csrf;
    if (!token || token !== session.csrfToken) {
        console.warn('🚨 CSRF token validation failed:', {
            method: req.method,
            path: req.path,
            ip: req.ip,
            expectedToken: session.csrfToken ? 'exists' : 'missing',
            receivedToken: token ? 'exists' : 'missing'
        });
        return res.status(403).json({
            success: false,
            message: 'Invalid CSRF token',
            code: 'CSRF_VALIDATION_FAILED'
        });
    }
    next();
};
exports.csrfProtection = csrfProtection;
/**
 * Get CSRF token endpoint
 */
const getCsrfToken = (req, res) => {
    const session = req.session;
    if (!session.csrfToken) {
        session.csrfToken = generateCsrfToken();
    }
    res.json({
        success: true,
        csrfToken: session.csrfToken
    });
};
exports.getCsrfToken = getCsrfToken;
