"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const client_entity_1 = require("../models/client.entity");
class ClientService {
    static getInstance() {
        if (!ClientService.instance) {
            ClientService.instance = new ClientService();
        }
        return ClientService.instance;
    }
    // Create a new client
    async create(clientData) {
        try {
            const client = new client_entity_1.ClientEntity(clientData);
            return await client.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error('Client with this email already exists');
            }
            throw error;
        }
    }
    // Find all clients with filtering, pagination, and sorting
    async findAll(options = {}) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, name, email, status, minEarnings, maxEarnings } = options;
        // Build query
        const query = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }
        if (minEarnings !== undefined || maxEarnings !== undefined) {
            query.totalEarned = {};
            if (minEarnings !== undefined) {
                query.totalEarned.$gte = minEarnings;
            }
            if (maxEarnings !== undefined) {
                query.totalEarned.$lte = maxEarnings;
            }
        }
        // Handle status filter (based on totalEarned ranges)
        if (status) {
            switch (status) {
                case 'new':
                    query.totalEarned = 0;
                    break;
                case 'bronze':
                    query.totalEarned = { $gte: 0.01, $lt: 1000 };
                    break;
                case 'silver':
                    query.totalEarned = { $gte: 1000, $lt: 5000 };
                    break;
                case 'gold':
                    query.totalEarned = { $gte: 5000, $lt: 10000 };
                    break;
                case 'platinum':
                    query.totalEarned = { $gte: 10000 };
                    break;
            }
        }
        // Calculate skip value
        const skip = (page - 1) * limit;
        // Sort configuration
        const sortConfig = {};
        sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;
        // Execute queries
        const [clients, total] = await Promise.all([
            client_entity_1.ClientEntity.find(query)
                .sort(sortConfig)
                .skip(skip)
                .limit(limit)
                .exec(),
            client_entity_1.ClientEntity.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            clients,
            total,
            page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }
    // Find client by ID
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid client ID format');
        }
        return await client_entity_1.ClientEntity.findById(id);
    }
    // Find client by email
    async findByEmail(email) {
        return await client_entity_1.ClientEntity.findOne({ email: email.toLowerCase() });
    }
    // Update client
    async update(id, updateData) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid client ID format');
        }
        try {
            return await client_entity_1.ClientEntity.findByIdAndUpdate(id, { ...updateData }, { new: true, runValidators: true });
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error('Client with this email already exists');
            }
            throw error;
        }
    }
    // Delete client
    async delete(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid client ID format');
        }
        return await client_entity_1.ClientEntity.findByIdAndDelete(id);
    }
    // Add earnings to client
    async addEarnings(id, amount) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid client ID format');
        }
        if (amount <= 0) {
            throw new Error('Earnings amount must be positive');
        }
        return await client_entity_1.ClientEntity.findByIdAndUpdate(id, { $inc: { totalEarned: amount } }, { new: true, runValidators: true });
    }
    // Reset client earnings
    async resetEarnings(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid client ID format');
        }
        return await client_entity_1.ClientEntity.findByIdAndUpdate(id, { totalEarned: 0 }, { new: true });
    }
    // Get client statistics
    async getStats() {
        const [totalClients, earningsStats, statusBreakdown, topEarningClients] = await Promise.all([
            client_entity_1.ClientEntity.countDocuments({}),
            client_entity_1.ClientEntity.aggregate([
                {
                    $group: {
                        _id: null,
                        totalEarnings: { $sum: '$totalEarned' },
                        averageEarnings: { $avg: '$totalEarned' }
                    }
                }
            ]),
            client_entity_1.ClientEntity.aggregate([
                {
                    $group: {
                        _id: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$totalEarned', 0] }, then: 'new' },
                                    { case: { $lt: ['$totalEarned', 1000] }, then: 'bronze' },
                                    { case: { $lt: ['$totalEarned', 5000] }, then: 'silver' },
                                    { case: { $lt: ['$totalEarned', 10000] }, then: 'gold' }
                                ],
                                default: 'platinum'
                            }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]),
            client_entity_1.ClientEntity.find({})
                .sort({ totalEarned: -1 })
                .limit(5)
                .exec()
        ]);
        const stats = earningsStats[0] || { totalEarnings: 0, averageEarnings: 0 };
        // Format status breakdown
        const statusBreakdownFormatted = {
            new: 0,
            bronze: 0,
            silver: 0,
            gold: 0,
            platinum: 0
        };
        statusBreakdown.forEach((item) => {
            statusBreakdownFormatted[item._id] = item.count;
        });
        return {
            totalClients,
            totalEarnings: stats.totalEarnings,
            averageEarningsPerClient: stats.averageEarnings,
            statusBreakdown: statusBreakdownFormatted,
            topEarningClients
        };
    }
    // Search clients by text
    async search(searchTerm, options = {}) {
        const { limit = 10 } = options;
        return await client_entity_1.ClientEntity.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .exec();
    }
    // Get clients by status
    async findByStatus(status) {
        const query = {};
        switch (status) {
            case 'new':
                query.totalEarned = 0;
                break;
            case 'bronze':
                query.totalEarned = { $gte: 0.01, $lt: 1000 };
                break;
            case 'silver':
                query.totalEarned = { $gte: 1000, $lt: 5000 };
                break;
            case 'gold':
                query.totalEarned = { $gte: 5000, $lt: 10000 };
                break;
            case 'platinum':
                query.totalEarned = { $gte: 10000 };
                break;
        }
        return await client_entity_1.ClientEntity.find(query).sort({ totalEarned: -1 }).exec();
    }
    // Bulk operations
    async bulkUpdateEarnings(updates) {
        const operations = updates.map(update => ({
            updateOne: {
                filter: { _id: new mongoose_1.default.Types.ObjectId(update.id) },
                update: { $inc: { totalEarned: update.amount } }
            }
        }));
        await client_entity_1.ClientEntity.bulkWrite(operations);
    }
}
exports.ClientService = ClientService;
