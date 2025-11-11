import { Router } from 'express';
import FinancialController, { apiKeyValidation } from '../controllers/financial.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * Financial data routes
 * All routes are protected with authentication
 */

// Get comprehensive financial summary
router.get('/summary', authMiddleware, FinancialController.getFinancialSummary);

// Get specific platform earnings
router.get('/platform/:platform', authMiddleware, FinancialController.getPlatformEarnings);

// Refresh financial data manually
router.post('/refresh', authMiddleware, FinancialController.refreshFinancialData);

// Update platform API keys (for future implementation)
router.put('/api-keys', authMiddleware, apiKeyValidation, FinancialController.updateApiKeys);

// Get financial health analysis
router.get('/health', authMiddleware, FinancialController.getFinancialHealth);

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

export default router;