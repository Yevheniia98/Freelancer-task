import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ClientService } from '../services/client.service';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = ClientService.getInstance();
  }

  // Create client
  createClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const client = await this.clientService.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Client created successfully',
        data: client
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create client',
        error: error.message
      });
    }
  };

  // Get all clients
  getClients = async (req: Request, res: Response): Promise<void> => {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as keyof import('../models/client.entity').IClientEntity) || 'createdAt',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        search: req.query.search as string,
        name: req.query.name as string,
        email: req.query.email as string,
        status: req.query.status as 'new' | 'bronze' | 'silver' | 'gold' | 'platinum',
        minEarnings: req.query.minEarnings ? parseFloat(req.query.minEarnings as string) : undefined,
        maxEarnings: req.query.maxEarnings ? parseFloat(req.query.maxEarnings as string) : undefined
      };

      const result = await this.clientService.findAll(options);
      
      res.status(200).json({
        success: true,
        message: 'Clients retrieved successfully',
        data: result.clients,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve clients',
        error: error.message
      });
    }
  };

  // Get client by ID
  getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
      const client = await this.clientService.findById(req.params.id);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Client not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Client retrieved successfully',
        data: client
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve client',
        error: error.message
      });
    }
  };

  // Update client
  updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const client = await this.clientService.update(req.params.id, req.body);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Client not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Client updated successfully',
        data: client
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update client',
        error: error.message
      });
    }
  };

  // Delete client
  deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const client = await this.clientService.delete(req.params.id);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Client not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Client deleted successfully',
        data: client
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete client',
        error: error.message
      });
    }
  };

  // Add earnings to client
  addEarnings = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { amount } = req.body;
      const client = await this.clientService.addEarnings(req.params.id, amount);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Client not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Earnings added successfully',
        data: client
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to add earnings',
        error: error.message
      });
    }
  };

  // Reset client earnings
  resetEarnings = async (req: Request, res: Response): Promise<void> => {
    try {
      const client = await this.clientService.resetEarnings(req.params.id);
      
      if (!client) {
        res.status(404).json({
          success: false,
          message: 'Client not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Earnings reset successfully',
        data: client
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset earnings',
        error: error.message
      });
    }
  };

  // Get client statistics
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.clientService.getStats();
      
      res.status(200).json({
        success: true,
        message: 'Client statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve client statistics',
        error: error.message
      });
    }
  };

  // Search clients
  searchClients = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchTerm = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!searchTerm) {
        res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
        return;
      }

      const clients = await this.clientService.search(searchTerm, { limit });
      
      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: clients
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to search clients',
        error: error.message
      });
    }
  };

  // Get clients by status
  getClientsByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.params.status as 'new' | 'bronze' | 'silver' | 'gold' | 'platinum';
      
      if (!['new', 'bronze', 'silver', 'gold', 'platinum'].includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be: new, bronze, silver, gold, or platinum'
        });
        return;
      }

      const clients = await this.clientService.findByStatus(status);
      
      res.status(200).json({
        success: true,
        message: `${status} clients retrieved successfully`,
        data: clients
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve clients by status',
        error: error.message
      });
    }
  };

  // Bulk update earnings
  bulkUpdateEarnings = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
        return;
      }

      const { updates } = req.body;
      await this.clientService.bulkUpdateEarnings(updates);
      
      res.status(200).json({
        success: true,
        message: 'Bulk earnings update completed successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to bulk update earnings',
        error: error.message
      });
    }
  };
}
