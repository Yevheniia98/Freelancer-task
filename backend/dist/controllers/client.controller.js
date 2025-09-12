"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const express_validator_1 = require("express-validator");
const client_service_1 = require("../services/client.service");
class ClientController {
    constructor() {
        // Create client
        this.createClient = async (req, res) => {
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
                const client = await this.clientService.create(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Client created successfully',
                    data: client
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to create client',
                    error: error.message
                });
            }
        };
        // Get all clients
        this.getClients = async (req, res) => {
            try {
                const options = {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    sortBy: req.query.sortBy || 'createdAt',
                    sortOrder: req.query.sortOrder || 'desc',
                    search: req.query.search,
                    name: req.query.name,
                    email: req.query.email,
                    status: req.query.status,
                    minEarnings: req.query.minEarnings ? parseFloat(req.query.minEarnings) : undefined,
                    maxEarnings: req.query.maxEarnings ? parseFloat(req.query.maxEarnings) : undefined
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve clients',
                    error: error.message
                });
            }
        };
        // Get client by ID
        this.getClientById = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to retrieve client',
                    error: error.message
                });
            }
        };
        // Update client
        this.updateClient = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to update client',
                    error: error.message
                });
            }
        };
        // Delete client
        this.deleteClient = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to delete client',
                    error: error.message
                });
            }
        };
        // Add earnings to client
        this.addEarnings = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to add earnings',
                    error: error.message
                });
            }
        };
        // Reset client earnings
        this.resetEarnings = async (req, res) => {
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
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to reset earnings',
                    error: error.message
                });
            }
        };
        // Get client statistics
        this.getStats = async (req, res) => {
            try {
                const stats = await this.clientService.getStats();
                res.status(200).json({
                    success: true,
                    message: 'Client statistics retrieved successfully',
                    data: stats
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve client statistics',
                    error: error.message
                });
            }
        };
        // Search clients
        this.searchClients = async (req, res) => {
            try {
                const searchTerm = req.query.q;
                const limit = parseInt(req.query.limit) || 10;
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to search clients',
                    error: error.message
                });
            }
        };
        // Get clients by status
        this.getClientsByStatus = async (req, res) => {
            try {
                const status = req.params.status;
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
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve clients by status',
                    error: error.message
                });
            }
        };
        // Bulk update earnings
        this.bulkUpdateEarnings = async (req, res) => {
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
                const { updates } = req.body;
                await this.clientService.bulkUpdateEarnings(updates);
                res.status(200).json({
                    success: true,
                    message: 'Bulk earnings update completed successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to bulk update earnings',
                    error: error.message
                });
            }
        };
        this.clientService = client_service_1.ClientService.getInstance();
    }
}
exports.ClientController = ClientController;
