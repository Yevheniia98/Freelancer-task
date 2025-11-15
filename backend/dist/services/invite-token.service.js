"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteTokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
class InviteTokenService {
    /**
     * Generate a secure invite token
     */
    static generateInviteToken(payload) {
        const now = Math.floor(Date.now() / 1000);
        const tokenPayload = {
            ...payload,
            iat: now,
            exp: now + this.TOKEN_EXPIRY
        };
        return jsonwebtoken_1.default.sign(tokenPayload, this.JWT_SECRET, {
            algorithm: 'HS256',
            issuer: 'freelancer-task',
            audience: 'team-collaboration'
        });
    }
    /**
     * Verify and decode invite token
     */
    static verifyInviteToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.JWT_SECRET, {
                algorithms: ['HS256'],
                issuer: 'freelancer-task',
                audience: 'team-collaboration'
            });
            // Check if token is expired
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp < now) {
                console.log('Token expired:', { exp: decoded.exp, now });
                return null;
            }
            return decoded;
        }
        catch (error) {
            console.error('Token verification failed:', error.message);
            return null;
        }
    }
    /**
     * Generate secure random token for additional security
     */
    static generateSecureToken() {
        return crypto_1.default.randomBytes(32).toString('hex');
    }
    /**
     * Calculate expiry date (7 days from now)
     */
    static getExpiryDate() {
        return new Date(Date.now() + this.TOKEN_EXPIRY * 1000);
    }
    /**
     * Check if token is expired based on date
     */
    static isTokenExpired(expiresAt) {
        return new Date() > expiresAt;
    }
}
exports.InviteTokenService = InviteTokenService;
InviteTokenService.JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
InviteTokenService.TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds
