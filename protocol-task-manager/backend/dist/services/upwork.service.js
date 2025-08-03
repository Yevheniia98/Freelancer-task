"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkService = void 0;
const freelancer_service_1 = require("./freelancer.service");
class UpworkService extends freelancer_service_1.BasePlatformService {
    constructor(platform) {
        super(platform);
        this.baseURL = 'https://www.upwork.com/api';
        this.authURL = 'https://www.upwork.com/api/auth/v1';
        this.setupUpworkClient();
    }
    setupUpworkClient() {
        this.httpClient.defaults.baseURL = this.baseURL;
        // Add OAuth 1.0a authentication interceptor
        this.httpClient.interceptors.request.use((config) => {
            if (this.platform.accessToken) {
                config.headers.Authorization = `Bearer ${this.platform.accessToken}`;
            }
            return config;
        });
        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                this.platform.isActive = false;
            }
            return Promise.reject(error);
        });
    }
    async authenticate(credentials) {
        try {
            // Note: Upwork uses OAuth 1.0a which requires a more complex flow
            // This is a simplified version - in production, you'd need to implement
            // the complete OAuth 1.0a flow with request tokens, user authorization, etc.
            const { consumerKey, consumerSecret } = credentials;
            if (!consumerKey || !consumerSecret) {
                throw new Error('Consumer key and secret are required for Upwork authentication');
            }
            // Store credentials
            this.platform.apiKey = consumerKey;
            this.platform.apiSecret = consumerSecret;
            // For now, we'll simulate authentication
            // In a real implementation, you'd redirect user to Upwork for authorization
            console.log('Upwork OAuth flow would be initiated here');
            return true;
        }
        catch (error) {
            console.error('Upwork authentication failed:', error);
            return false;
        }
    }
    async fetchProjects(userId) {
        try {
            if (!this.isConnected()) {
                throw new Error('Upwork service not authenticated');
            }
            // Fetch jobs from multiple endpoints
            const [activeJobs, completedJobs] = await Promise.all([
                this.fetchJobsByStatus('active'),
                this.fetchJobsByStatus('completed')
            ]);
            const allJobs = [...activeJobs, ...completedJobs];
            return allJobs.map(job => this.mapUpworkProjectToExternal(job));
        }
        catch (error) {
            console.error('Failed to fetch Upwork projects:', error);
            throw new Error(`Upwork API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async fetchJobsByStatus(status) {
        try {
            const response = await this.httpClient.get('/hr/v2/jobs', {
                params: {
                    status,
                    limit: 100,
                    offset: 0
                }
            });
            return response.data.jobs || [];
        }
        catch (error) {
            console.error(`Failed to fetch ${status} jobs:`, error);
            return [];
        }
    }
    async syncProject(projectId) {
        try {
            if (!this.isConnected()) {
                throw new Error('Upwork service not authenticated');
            }
            const response = await this.httpClient.get(`/hr/v2/jobs/${projectId}`);
            const upworkProject = response.data.job;
            if (!upworkProject) {
                throw new Error(`Project ${projectId} not found on Upwork`);
            }
            return this.mapUpworkProjectToExternal(upworkProject);
        }
        catch (error) {
            console.error('Failed to sync Upwork project:', error);
            throw new Error(`Failed to sync project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    mapUpworkProjectToExternal(upworkProject) {
        // Parse budget information
        const budget = this.parseBudget(upworkProject.budget, upworkProject.job_type);
        return {
            id: upworkProject.job_id,
            title: upworkProject.title,
            description: upworkProject.description,
            budget,
            deadline: this.parseDeadline(upworkProject.duration),
            client: {
                name: 'Upwork Client', // Upwork doesn't provide client names in job listings
                rating: upworkProject.client.feedback,
                country: upworkProject.client.country
            },
            skills: upworkProject.skills || [],
            status: this.mapUpworkStatus(upworkProject.job_type),
            platform: 'upwork',
            platformUrl: upworkProject.url,
            createdAt: new Date(upworkProject.posted_on),
            updatedAt: new Date()
        };
    }
    parseBudget(budgetString, jobType) {
        // Budget format examples: "$500", "$10-$20/hr", "$1,000-$5,000"
        const currency = 'USD'; // Upwork primarily uses USD
        const type = jobType === 'hourly' ? 'hourly' : 'fixed';
        if (!budgetString) {
            return { currency, type };
        }
        // Remove currency symbols and commas
        const cleanBudget = budgetString.replace(/[$,]/g, '');
        if (cleanBudget.includes('-')) {
            const [min, max] = cleanBudget.split('-').map(b => parseFloat(b.replace('/hr', '')));
            return { min, max, currency, type };
        }
        else {
            const amount = parseFloat(cleanBudget.replace('/hr', ''));
            return { min: amount, max: amount, currency, type };
        }
    }
    parseDeadline(duration) {
        if (!duration)
            return undefined;
        const now = new Date();
        const durationLower = duration.toLowerCase();
        if (durationLower.includes('week')) {
            const weeks = parseInt(durationLower.match(/\d+/)?.[0] || '1');
            return new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
        }
        else if (durationLower.includes('month')) {
            const months = parseInt(durationLower.match(/\d+/)?.[0] || '1');
            return new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
        }
        else if (durationLower.includes('day')) {
            const days = parseInt(durationLower.match(/\d+/)?.[0] || '1');
            return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        }
        return undefined;
    }
    mapUpworkStatus(jobType) {
        // Map Upwork job types to our status
        const statusMap = {
            'hourly': 'active',
            'fixed': 'active',
            'completed': 'completed',
            'cancelled': 'cancelled'
        };
        return statusMap[jobType] || 'active';
    }
    // Method to handle OAuth callback (for production implementation)
    async handleOAuthCallback(oauthToken, oauthVerifier) {
        try {
            // In a real implementation, exchange the oauth_token and oauth_verifier
            // for an access token and refresh token
            // For now, simulate successful authentication
            this.platform.accessToken = `upwork_access_token_${Date.now()}`;
            this.platform.refreshToken = `upwork_refresh_token_${Date.now()}`;
            this.platform.isActive = true;
            return true;
        }
        catch (error) {
            console.error('OAuth callback handling failed:', error);
            return false;
        }
    }
    // Method to refresh access token
    async refreshAccessToken() {
        try {
            if (!this.platform.refreshToken) {
                return false;
            }
            // In a real implementation, use the refresh token to get a new access token
            // For now, simulate token refresh
            this.platform.accessToken = `upwork_access_token_${Date.now()}`;
            return true;
        }
        catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }
}
exports.UpworkService = UpworkService;
