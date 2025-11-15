"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financial_controller_1 = __importStar(require("../controllers/financial.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * Financial data routes
 * All routes are protected with authentication
 */
// Get comprehensive financial summary
router.get('/summary', auth_middleware_1.authMiddleware, financial_controller_1.default.getFinancialSummary);
// Get specific platform earnings
router.get('/platform/:platform', auth_middleware_1.authMiddleware, financial_controller_1.default.getPlatformEarnings);
// Refresh financial data manually
router.post('/refresh', auth_middleware_1.authMiddleware, financial_controller_1.default.refreshFinancialData);
// Update platform API keys (for future implementation)
router.put('/api-keys', auth_middleware_1.authMiddleware, financial_controller_1.apiKeyValidation, financial_controller_1.default.updateApiKeys);
// Get financial health analysis
router.get('/health', auth_middleware_1.authMiddleware, financial_controller_1.default.getFinancialHealth);
// Health check endpoint (no auth required)
router.get('/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Financial API is operational',
        timestamp: new Date().toISOString(),
        endpoints: [
            'GET /api/financial/summary - Get complete financial overview',
            'GET /api/financial/platform/:platform - Get specific platform data',
            'POST /api/financial/refresh - Manually refresh all data',
            'PUT /api/financial/api-keys - Update platform API keys',
            'GET /api/financial/health - Get financial health analysis'
        ]
    });
});
exports.default = router;
