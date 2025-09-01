import mongoose from 'mongoose';
import { ClientEntity, IClientEntity } from '../models/client.entity';

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  totalEarned?: number;
  notes?: string;
}

export interface UpdateClientDto {
  name?: string;
  email?: string;
  phone?: string;
  totalEarned?: number;
  notes?: string;
}

export interface ClientFilters {
  name?: string;
  email?: string;
  status?: 'new' | 'bronze' | 'silver' | 'gold' | 'platinum';
  minEarnings?: number;
  maxEarnings?: number;
  search?: string;
}

export interface ClientListOptions extends ClientFilters {
  page?: number;
  limit?: number;
  sortBy?: keyof IClientEntity;
  sortOrder?: 'asc' | 'desc';
}

export class ClientService {
  private static instance: ClientService;

  public static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  // Create a new client
  async create(clientData: CreateClientDto): Promise<IClientEntity> {
    try {
      const client = new ClientEntity(clientData);
      return await client.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Client with this email already exists');
      }
      throw error;
    }
  }

  // Find all clients with filtering, pagination, and sorting
  async findAll(options: ClientListOptions = {}): Promise<{
    clients: IClientEntity[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      name,
      email,
      status,
      minEarnings,
      maxEarnings
    } = options;

    // Build query
    const query: any = {};

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
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [clients, total] = await Promise.all([
      ClientEntity.find(query)
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .exec(),
      ClientEntity.countDocuments(query)
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
  async findById(id: string): Promise<IClientEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID format');
    }
    return await ClientEntity.findById(id);
  }

  // Find client by email
  async findByEmail(email: string): Promise<IClientEntity | null> {
    return await ClientEntity.findOne({ email: email.toLowerCase() });
  }

  // Update client
  async update(id: string, updateData: UpdateClientDto): Promise<IClientEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID format');
    }

    try {
      return await ClientEntity.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true, runValidators: true }
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('Client with this email already exists');
      }
      throw error;
    }
  }

  // Delete client
  async delete(id: string): Promise<IClientEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID format');
    }
    return await ClientEntity.findByIdAndDelete(id);
  }

  // Add earnings to client
  async addEarnings(id: string, amount: number): Promise<IClientEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID format');
    }

    if (amount <= 0) {
      throw new Error('Earnings amount must be positive');
    }

    return await ClientEntity.findByIdAndUpdate(
      id,
      { $inc: { totalEarned: amount } },
      { new: true, runValidators: true }
    );
  }

  // Reset client earnings
  async resetEarnings(id: string): Promise<IClientEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid client ID format');
    }

    return await ClientEntity.findByIdAndUpdate(
      id,
      { totalEarned: 0 },
      { new: true }
    );
  }

  // Get client statistics
  async getStats(): Promise<{
    totalClients: number;
    totalEarnings: number;
    averageEarningsPerClient: number;
    statusBreakdown: {
      new: number;
      bronze: number;
      silver: number;
      gold: number;
      platinum: number;
    };
    topEarningClients: IClientEntity[];
  }> {
    const [
      totalClients,
      earningsStats,
      statusBreakdown,
      topEarningClients
    ] = await Promise.all([
      ClientEntity.countDocuments({}),
      ClientEntity.aggregate([
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: '$totalEarned' },
            averageEarnings: { $avg: '$totalEarned' }
          }
        }
      ]),
      ClientEntity.aggregate([
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
      ClientEntity.find({})
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

    statusBreakdown.forEach((item: any) => {
      statusBreakdownFormatted[item._id as keyof typeof statusBreakdownFormatted] = item.count;
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
  async search(searchTerm: string, options: { limit?: number } = {}): Promise<IClientEntity[]> {
    const { limit = 10 } = options;

    return await ClientEntity.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .exec();
  }

  // Get clients by status
  async findByStatus(status: 'new' | 'bronze' | 'silver' | 'gold' | 'platinum'): Promise<IClientEntity[]> {
    const query: any = {};

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

    return await ClientEntity.find(query).sort({ totalEarned: -1 }).exec();
  }

  // Bulk operations
  async bulkUpdateEarnings(updates: { id: string; amount: number }[]): Promise<void> {
    const operations = updates.map(update => ({
      updateOne: {
        filter: { _id: new mongoose.Types.ObjectId(update.id) },
        update: { $inc: { totalEarned: update.amount } }
      }
    }));

    await ClientEntity.bulkWrite(operations);
  }
}
