"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_connection_model_1 = __importDefault(require("../models/platform-connection.model"));
const financial_transaction_model_1 = __importDefault(require("../models/financial-transaction.model"));
const axios_1 = __importDefault(require("axios"));
class FinanceService {
    /**
     * Get comprehensive financial summary for a user
     */
    async getFinancialSummary(userId) {
        try {
            // Get all active platform connections
            const connections = await platform_connection_model_1.default.find({
                userId,
                isActive: true,
            });
            // Get all transactions for this user
            const allTransactions = await financial_transaction_model_1.default.find({
                userId,
                type: 'earning',
                status: 'completed',
            }).sort({ transactionDate: -1 });
            // Calculate date ranges
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            // Calculate total earnings
            const totalEarnings = {
                allTime: allTransactions.reduce((sum, t) => sum + t.amount, 0),
                thisMonth: allTransactions
                    .filter((t) => t.transactionDate >= startOfMonth)
                    .reduce((sum, t) => sum + t.amount, 0),
                thisYear: allTransactions
                    .filter((t) => t.transactionDate >= startOfYear)
                    .reduce((sum, t) => sum + t.amount, 0),
            };
            // Calculate last month earnings for growth
            const lastMonthEarnings = allTransactions
                .filter((t) => t.transactionDate >= startOfLastMonth &&
                t.transactionDate <= endOfLastMonth)
                .reduce((sum, t) => sum + t.amount, 0);
            // Calculate monthly growth percentage
            const monthlyGrowth = lastMonthEarnings > 0
                ? ((totalEarnings.thisMonth - lastMonthEarnings) / lastMonthEarnings) *
                    100
                : 0;
            // Calculate per-platform earnings
            const platformEarnings = [];
            for (const connection of connections) {
                const platformTransactions = allTransactions.filter((t) => t.platform === connection.platform);
                // Get unique projects
                const uniqueProjects = new Set(platformTransactions
                    .filter((t) => t.projectId)
                    .map((t) => t.projectId));
                // Estimate active projects (projects with transactions in last 30 days)
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                const activeProjectIds = new Set(platformTransactions
                    .filter((t) => t.projectId && t.transactionDate >= thirtyDaysAgo)
                    .map((t) => t.projectId));
                platformEarnings.push({
                    platform: connection.platform,
                    earnings: {
                        total: platformTransactions.reduce((sum, t) => sum + t.amount, 0),
                        thisMonth: platformTransactions
                            .filter((t) => t.transactionDate >= startOfMonth)
                            .reduce((sum, t) => sum + t.amount, 0),
                        thisYear: platformTransactions
                            .filter((t) => t.transactionDate >= startOfYear)
                            .reduce((sum, t) => sum + t.amount, 0),
                    },
                    projects: {
                        total: uniqueProjects.size,
                        active: activeProjectIds.size,
                    },
                    lastSynced: connection.lastSyncedAt,
                });
            }
            // Count total projects across all platforms
            const allProjectIds = new Set(allTransactions
                .filter((t) => t.projectId)
                .map((t) => `${t.platform}-${t.projectId}`));
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const allActiveProjectIds = new Set(allTransactions
                .filter((t) => t.projectId && t.transactionDate >= thirtyDaysAgo)
                .map((t) => `${t.platform}-${t.projectId}`));
            return {
                totalBalance: totalEarnings.allTime,
                totalEarnings,
                platforms: platformEarnings,
                statistics: {
                    totalProjects: allProjectIds.size,
                    activeProjects: allActiveProjectIds.size,
                    monthlyGrowth,
                },
            };
        }
        catch (error) {
            console.error('Error getting financial summary:', error);
            throw error;
        }
    }
    /**
     * Sync earnings from a specific platform
     */
    async syncPlatformEarnings(userId, platform) {
        try {
            // Get platform connection
            const connection = await platform_connection_model_1.default.findOne({
                userId,
                platform,
                isActive: true,
            }).select('+accessToken +refreshToken');
            if (!connection) {
                throw new Error(`No active connection found for platform: ${platform}`);
            }
            // Sync based on platform
            let transactionsAdded = 0;
            switch (platform) {
                case 'upwork':
                    transactionsAdded = await this.syncUpworkEarnings(userId, connection);
                    break;
                case 'freelancer':
                    transactionsAdded = await this.syncFreelancerEarnings(userId, connection);
                    break;
                case 'fiverr':
                    transactionsAdded = await this.syncFiverrEarnings(userId, connection);
                    break;
                default:
                    throw new Error(`Platform sync not implemented: ${platform}`);
            }
            // Update last synced timestamp
            connection.lastSyncedAt = new Date();
            await connection.save();
            return {
                success: true,
                message: `Successfully synced ${transactionsAdded} transactions from ${platform}`,
                transactionsAdded,
            };
        }
        catch (error) {
            console.error(`Error syncing ${platform}:`, error);
            return {
                success: false,
                message: error.message || `Failed to sync ${platform}`,
                transactionsAdded: 0,
            };
        }
    }
    /**
     * Sync all connected platforms for a user
     */
    async syncAllPlatforms(userId) {
        const connections = await platform_connection_model_1.default.find({
            userId,
            isActive: true,
        });
        const results = [];
        for (const connection of connections) {
            const result = await this.syncPlatformEarnings(userId, connection.platform);
            results.push({
                platform: connection.platform,
                success: result.success,
                message: result.message,
            });
        }
        return {
            success: results.some((r) => r.success),
            results,
        };
    }
    /**
     * Connect a new platform (store OAuth tokens)
     */
    async connectPlatform(userId, platform, accessToken, refreshToken, tokenExpiry, platformUserId, platformUsername) {
        try {
            // Check if connection already exists
            let connection = await platform_connection_model_1.default.findOne({
                userId,
                platform,
            });
            if (connection) {
                // Update existing connection
                connection.accessToken = accessToken;
                connection.refreshToken = refreshToken;
                connection.tokenExpiry = tokenExpiry;
                connection.platformUserId = platformUserId;
                connection.platformUsername = platformUsername;
                connection.isActive = true;
                await connection.save();
            }
            else {
                // Create new connection
                connection = await platform_connection_model_1.default.create({
                    userId,
                    platform,
                    accessToken,
                    refreshToken,
                    tokenExpiry,
                    platformUserId,
                    platformUsername,
                    isActive: true,
                });
            }
            // Immediately sync earnings after connection
            await this.syncPlatformEarnings(userId, platform);
            return connection;
        }
        catch (error) {
            console.error('Error connecting platform:', error);
            throw error;
        }
    }
    /**
     * Disconnect a platform
     */
    async disconnectPlatform(userId, platform) {
        try {
            const connection = await platform_connection_model_1.default.findOne({
                userId,
                platform,
            });
            if (!connection) {
                return {
                    success: false,
                    message: 'Platform connection not found',
                };
            }
            connection.isActive = false;
            await connection.save();
            return {
                success: true,
                message: `Successfully disconnected ${platform}`,
            };
        }
        catch (error) {
            console.error('Error disconnecting platform:', error);
            return {
                success: false,
                message: error.message || 'Failed to disconnect platform',
            };
        }
    }
    /**
     * Get list of connected platforms
     */
    async getConnectedPlatforms(userId) {
        const connections = await platform_connection_model_1.default.find({
            userId,
            isActive: true,
        }).select('-accessToken -refreshToken');
        return connections;
    }
    // Platform-specific sync methods
    /**
     * Sync Upwork earnings
     * Uses Upwork API v3 to fetch real earnings data
     */
    async syncUpworkEarnings(userId, connection) {
        try {
            // Check if token needs refresh
            if (connection.tokenExpiry && new Date(connection.tokenExpiry) < new Date()) {
                await this.refreshUpworkToken(connection);
            }
            // Fetch earnings from Upwork API v3
            // Documentation: https://developers.upwork.com/
            const response = await axios_1.default.get('https://www.upwork.com/api/hr/v2/teams/owned/earnings', {
                headers: {
                    'Authorization': `Bearer ${connection.accessToken}`,
                },
                params: {
                    // Fetch last 12 months
                    from_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    to_date: new Date().toISOString().split('T')[0],
                }
            });
            let transactionsAdded = 0;
            const earnings = response.data?.table?.rows || response.data?.earnings || [];
            for (const earning of earnings) {
                try {
                    const amount = parseFloat(earning.amount || earning.charges || 0);
                    if (amount <= 0)
                        continue;
                    const transactionDate = earning.date ? new Date(earning.date) : new Date();
                    const transactionId = earning.reference || `upwork-${earning.engagement_id || Date.now()}-${amount}`;
                    await financial_transaction_model_1.default.findOneAndUpdate({
                        userId,
                        platform: 'upwork',
                        platformTransactionId: transactionId,
                    }, {
                        amount,
                        currency: earning.currency || 'USD',
                        description: earning.description || earning.memo || 'Upwork earnings',
                        projectId: earning.engagement_id,
                        projectName: earning.engagement_name || earning.job_title,
                        clientName: earning.buyer_company,
                        transactionDate,
                        type: 'earning',
                        status: 'completed',
                        metadata: earning,
                    }, { upsert: true, new: true });
                    transactionsAdded++;
                }
                catch (error) {
                    console.error('Error processing Upwork transaction:', error);
                }
            }
            return transactionsAdded;
        }
        catch (error) {
            console.error('Upwork sync error:', error.response?.data || error.message);
            // If token is invalid, mark connection as inactive
            if (error.response?.status === 401 || error.response?.status === 403) {
                connection.isActive = false;
                await connection.save();
                throw new Error('Upwork authorization expired. Please reconnect your account.');
            }
            throw error;
        }
    }
    /**
     * Refresh Upwork OAuth token
     */
    async refreshUpworkToken(connection) {
        try {
            const response = await axios_1.default.post('https://www.upwork.com/api/v3/oauth2/token', {
                grant_type: 'refresh_token',
                refresh_token: connection.refreshToken,
                client_id: process.env.UPWORK_CLIENT_ID,
                client_secret: process.env.UPWORK_CLIENT_SECRET,
            });
            const responseData = response.data;
            connection.accessToken = responseData.access_token;
            connection.refreshToken = responseData.refresh_token || connection.refreshToken;
            connection.tokenExpiry = new Date(Date.now() + responseData.expires_in * 1000);
            await connection.save();
            console.log('✅ Upwork token refreshed successfully');
        }
        catch (error) {
            console.error('Failed to refresh Upwork token:', error.response?.data || error.message);
            throw new Error('Failed to refresh Upwork token');
        }
    }
    /**
     * Sync Freelancer.com earnings
     * Uses Freelancer API to fetch real transaction data
     */
    async syncFreelancerEarnings(userId, connection) {
        try {
            // Freelancer.com API documentation: https://developers.freelancer.com/
            const response = await axios_1.default.get('https://www.freelancer.com/api/projects/0.1/users/self/transactions/', {
                headers: {
                    'Freelancer-OAuth-V1': connection.accessToken,
                },
                params: {
                    transaction_types: 'credit',
                    limit: 100,
                }
            });
            let transactionsAdded = 0;
            const transactions = response.data?.result?.transactions || [];
            for (const transaction of transactions) {
                try {
                    const amount = parseFloat(transaction.amount || 0);
                    if (amount <= 0)
                        continue;
                    const transactionDate = transaction.time ? new Date(transaction.time * 1000) : new Date();
                    const transactionId = String(transaction.id);
                    // Fetch project details if available
                    let projectName = transaction.description || 'Freelancer earnings';
                    let projectId = transaction.project_id;
                    if (projectId) {
                        try {
                            const projectResponse = await axios_1.default.get(`https://www.freelancer.com/api/projects/0.1/projects/${projectId}/`, {
                                headers: { 'Freelancer-OAuth-V1': connection.accessToken }
                            });
                            projectName = projectResponse.data?.result?.title || projectName;
                        }
                        catch (error) {
                            console.log('Could not fetch project details:', projectId);
                        }
                    }
                    await financial_transaction_model_1.default.findOneAndUpdate({
                        userId,
                        platform: 'freelancer',
                        platformTransactionId: transactionId,
                    }, {
                        amount,
                        currency: transaction.currency?.code || 'USD',
                        description: transaction.description || 'Freelancer earnings',
                        projectId: projectId ? String(projectId) : undefined,
                        projectName,
                        transactionDate,
                        type: 'earning',
                        status: 'completed',
                        metadata: transaction,
                    }, { upsert: true, new: true });
                    transactionsAdded++;
                }
                catch (error) {
                    console.error('Error processing Freelancer transaction:', error);
                }
            }
            return transactionsAdded;
        }
        catch (error) {
            console.error('Freelancer sync error:', error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                connection.isActive = false;
                await connection.save();
                throw new Error('Freelancer authorization expired. Please reconnect your account.');
            }
            throw error;
        }
    }
    /**
     * Sync Fiverr earnings
     * Uses Fiverr API to fetch real seller earnings
     */
    async syncFiverrEarnings(userId, connection) {
        try {
            // Fiverr API documentation: https://developers.fiverr.com/
            // Note: Fiverr has limited public API. This is based on their seller API
            const response = await axios_1.default.get('https://api.fiverr.com/v1/seller/orders', {
                headers: {
                    'Authorization': `Bearer ${connection.accessToken}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    status: 'completed',
                    limit: 100,
                }
            });
            let transactionsAdded = 0;
            const orders = response.data?.orders || [];
            for (const order of orders) {
                try {
                    // Fiverr takes 20% commission, so seller gets 80%
                    const grossAmount = parseFloat(order.price || 0);
                    const amount = grossAmount * 0.8; // Net earnings after Fiverr commission
                    if (amount <= 0)
                        continue;
                    const transactionDate = order.completed_at ? new Date(order.completed_at) : new Date();
                    const transactionId = String(order.id);
                    await financial_transaction_model_1.default.findOneAndUpdate({
                        userId,
                        platform: 'fiverr',
                        platformTransactionId: transactionId,
                    }, {
                        amount,
                        currency: order.currency || 'USD',
                        description: order.gig_title || order.description || 'Fiverr earnings',
                        projectId: String(order.gig_id),
                        projectName: order.gig_title,
                        clientName: order.buyer_username,
                        transactionDate,
                        type: 'earning',
                        status: 'completed',
                        metadata: {
                            ...order,
                            grossAmount,
                            fiverrCommission: grossAmount * 0.2,
                        },
                    }, { upsert: true, new: true });
                    transactionsAdded++;
                }
                catch (error) {
                    console.error('Error processing Fiverr transaction:', error);
                }
            }
            return transactionsAdded;
        }
        catch (error) {
            console.error('Fiverr sync error:', error.response?.data || error.message);
            if (error.response?.status === 401 || error.response?.status === 403) {
                connection.isActive = false;
                await connection.save();
                throw new Error('Fiverr authorization expired. Please reconnect your account.');
            }
            throw error;
        }
    }
    /**
     * Create demo transactions for testing
     */
    async createDemoTransactions(userId) {
        const demoTransactions = [
            {
                userId,
                platform: 'upwork',
                transactionId: 'upwork-demo-1',
                type: 'earning',
                amount: 2500,
                currency: 'USD',
                description: 'Web Development Project',
                projectName: 'E-commerce Website',
                clientName: 'Tech Corp',
                status: 'completed',
                transactionDate: new Date('2024-01-15'),
            },
            {
                userId,
                platform: 'upwork',
                transactionId: 'upwork-demo-2',
                type: 'earning',
                amount: 1800,
                currency: 'USD',
                description: 'Mobile App Development',
                projectName: 'Fitness Tracker App',
                clientName: 'Wellness Inc',
                status: 'completed',
                transactionDate: new Date('2024-01-25'),
            },
            {
                userId,
                platform: 'freelancer',
                transactionId: 'freelancer-demo-1',
                type: 'earning',
                amount: 1200,
                currency: 'USD',
                description: 'UI/UX Design',
                projectName: 'Dashboard Redesign',
                clientName: 'Startup XYZ',
                status: 'completed',
                transactionDate: new Date('2024-01-10'),
            },
            {
                userId,
                platform: 'fiverr',
                transactionId: 'fiverr-demo-1',
                type: 'earning',
                amount: 500,
                currency: 'USD',
                description: 'Logo Design',
                projectName: 'Brand Identity',
                clientName: 'Marketing Agency',
                status: 'completed',
                transactionDate: new Date('2024-01-20'),
            },
        ];
        for (const transaction of demoTransactions) {
            try {
                await financial_transaction_model_1.default.findOneAndUpdate({
                    userId: transaction.userId,
                    platform: transaction.platform,
                    transactionId: transaction.transactionId,
                }, transaction, { upsert: true, new: true });
            }
            catch (error) {
                console.error('Error creating demo transaction:', error);
            }
        }
    }
}
exports.default = new FinanceService();
