"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorService = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
class TwoFactorService {
    async generateSecret(email) {
        const secret = speakeasy_1.default.generateSecret({
            name: `Task Manager (${email})`,
            issuer: 'Task Manager',
            length: 32
        });
        const qrCodeUrl = await qrcode_1.default.toDataURL(secret.otpauth_url);
        return {
            secret: secret.base32,
            qrCodeUrl
        };
    }
    verifyToken(secret, token) {
        return speakeasy_1.default.totp.verify({
            secret,
            encoding: 'base32',
            token,
            window: 2
        });
    }
}
exports.TwoFactorService = TwoFactorService;
