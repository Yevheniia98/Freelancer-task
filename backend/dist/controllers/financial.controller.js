"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyValidation = void 0;
const express_validator_1 = require("express-validator");
const freelance_platforms_service_1 = __importDefault(require("../services/freelance-platforms.service"));
class FinancialController {
    /**
     * Get comprehensive financial summary
     * GET /api/financial/summary
     */
    async getFinancialSummary(req, res) {
        try {
            console.log('📊 Financial summary requested');
            const financialData = await freelance_platforms_service_1.default.getCachedFinancialSummary();
            res.status(200).json({
                success: true,
                data: financialData,
                message: 'Financial summary retrieved successfully'
            });
        }
        catch (error) {
            console.error('❌ Error fetching financial summary:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch financial data',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
    /**
     * Get specific platform earnings
     * GET /api/financial/platform/:platform
     */
    async getPlatformEarnings(req, res) {
        try {
            const { platform } = req.params;
            const validPlatforms = ['upwork', 'freelancer', 'fiverr'];
            if (!validPlatforms.includes(platform.toLowerCase())) {
                res.status(400).json({
                    success: false,
                    message: `Invalid platform. Must be one of: ${validPlatforms.join(', ')}`
                });
                return;
            }
            console.log(`📊 ${platform} earnings requested`);
            const platformData = await freelance_platforms_service_1.default.getPlatformEarnings(platform.toLowerCase());
            res.status(200).json({
                success: true,
                data: platformData,
                message: `${platform} earnings retrieved successfully`
            });
        }
        catch (error) {
            console.error(`❌ Error fetching ${req.params.platform} earnings:`, error);
            res.status(500).json({
                success: false,
                message: `Failed to fetch ${req.params.platform} earnings`,
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
    /**
     * Refresh financial data manually
     * POST /api/financial/refresh
     */
    async refreshFinancialData(req, res) {
        try {
            console.log('🔄 Manual financial data refresh requested');
            const freshData = await freelance_platforms_service_1.default.refreshFinancialData();
            res.status(200).json({
                success: true,
                data: freshData,
                message: 'Financial data refreshed successfully'
            });
        }
        catch (error) {
            console.error('❌ Error refreshing financial data:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to refresh financial data',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
    /**
     * Update platform API keys (for future implementation)
     * PUT /api/financial/api-keys
     */
    async updateApiKeys(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
                return;
            }
            const { upwork, freelancer, fiverr } = req.body;
            // In a real implementation, you'd encrypt and store these API keys securely
            console.log('🔑 API keys update requested (not implemented in demo)');
            res.status(200).json({
                success: true,
                message: 'API keys would be updated (feature not implemented in demo)',
                note: 'In production, API keys would be encrypted and stored securely'
            });
        }
        catch (error) {
            console.error('❌ Error updating API keys:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update API keys',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
    /**
     * Get financial health status
     * GET /api/financial/health
     */
    async getFinancialHealth(req, res) {
        try {
            const summary = await freelance_platforms_service_1.default.getCachedFinancialSummary();
            // Calculate financial health metrics
            const monthlyGrowth = summary.lastMonthIncome > 0
                ? ((summary.currentMonthIncome - summary.lastMonthIncome) / summary.lastMonthIncome) * 100
                : 0;
            const averageEarningsPerPlatform = summary.currentMonthIncome / summary.platforms.length;
            const activePlatforms = summary.platforms.filter(p => p.currentMonth > 0).length;
            const healthScore = Math.min(100, Math.max(0, (summary.currentMonthIncome / 10000) * 40 + // Income score (40%)
                (activePlatforms / 3) * 30 + // Diversification score (30%)
                Math.max(0, monthlyGrowth) * 0.3 // Growth score (30%)
            ));
            const healthData = {
                score: Math.round(healthScore),
                status: healthScore >= 80 ? 'excellent' :
                    healthScore >= 60 ? 'good' :
                        healthScore >= 40 ? 'fair' : 'poor',
                metrics: {
                    monthlyIncome: summary.currentMonthIncome,
                    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
                    activePlatforms,
                    totalPlatforms: summary.platforms.length,
                    averageEarningsPerPlatform: Math.round(averageEarningsPerPlatform)
                },
                recommendations: this.generateRecommendations(healthScore, summary)
            };
            res.status(200).json({
                success: true,
                data: healthData,
                message: 'Financial health analysis completed'
            });
        }
        catch (error) {
            console.error('❌ Error analyzing financial health:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to analyze financial health',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
    /**
     * Generate financial recommendations based on health score
     */
    generateRecommendations(healthScore, summary) {
        const recommendations = [];
        if (healthScore < 40) {
            recommendations.push('Consider diversifying income across more platforms');
            recommendations.push('Focus on increasing earnings on your most successful platform');
        }
        if (summary.platforms.filter((p) => p.currentMonth > 0).length < 2) {
            recommendations.push('Try to activate at least 2-3 income sources for stability');
        }
        const monthlyGrowth = summary.lastMonthIncome > 0
            ? ((summary.currentMonthIncome - summary.lastMonthIncome) / summary.lastMonthIncome) * 100
            : 0;
        if (monthlyGrowth < 0) {
            recommendations.push('Income has declined this month - consider reviewing your strategy');
        }
        if (healthScore >= 80) {
            recommendations.push('Great job! Your income is well diversified and growing');
            recommendations.push('Consider setting aside 20% for taxes and emergency fund');
        }
        return recommendations;
    }
}
// Validation rules for API key updates
exports.apiKeyValidation = [
    (0, express_validator_1.body)('upwork').optional().isString().isLength({ min: 10, max: 100 })
        .withMessage('UpWork API key must be between 10-100 characters'),
    (0, express_validator_1.body)('freelancer').optional().isString().isLength({ min: 10, max: 100 })
        .withMessage('Freelancer API key must be between 10-100 characters'),
    (0, express_validator_1.body)('fiverr').optional().isString().isLength({ min: 10, max: 100 })
        .withMessage('Fiverr API key must be between 10-100 characters')
];
exports.default = new FinancialController();
