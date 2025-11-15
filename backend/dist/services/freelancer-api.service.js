"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelancerService = void 0;
const freelancer_service_1 = require("./freelancer.service");
class FreelancerService extends freelancer_service_1.BasePlatformService {
    constructor(platform) {
        super(platform);
        this.baseURL = process.env.FREELANCER_API_BASE_URL || 'https://www.freelancer.com/api';
        this.sandboxURL = 'https://www.freelancer-sandbox.com/api';
        this.setupFreelancerClient();
    }
    setupFreelancerClient() {
        const baseURL = process.env.NODE_ENV === 'development' ? this.sandboxURL : this.baseURL;
        this.httpClient.defaults.baseURL = baseURL;
        // Add authorization interceptor
        this.httpClient.interceptors.request.use((config) => {
            if (this.accessToken) {
                config.headers.Authorization = `OAuth ${this.accessToken}`;
            }
            return config;
        });
        // Add response interceptor for error handling
        this.httpClient.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                this.platform.isActive = false;
                this.accessToken = undefined;
            }
            return Promise.reject(error);
        });
    }
    async authenticate(credentials) {
        try {
            const { oauthToken, oauthTokenSecret } = credentials;
            if (!oauthToken) {
                throw new Error('OAuth token is required for Freelancer authentication');
            }
            // Check if using mock/placeholder token
            if (oauthToken.includes('your_freelancer_token_here') || oauthToken.startsWith('mock_')) {
                console.log('Using mock Freelancer authentication');
                // Set mock token for development
                this.accessToken = 'mock_freelancer_token_' + Date.now();
                this.platform.accessToken = this.accessToken;
                this.platform.isActive = true;
                return true;
            }
            // Store real token
            this.accessToken = oauthToken;
            this.platform.accessToken = oauthToken;
            // Store token secret if provided (for OAuth 1.0a)
            if (oauthTokenSecret) {
                this.platform.refreshToken = oauthTokenSecret;
            }
            // Verify token by making a test API call
            const response = await this.httpClient.get('/users/0.1/self');
            if (response.data && response.data.result) {
                this.platform.isActive = true;
                return true;
            }
            throw new Error('Token verification failed');
        }
        catch (error) {
            console.error('Freelancer authentication failed:', error);
            this.platform.isActive = false;
            this.accessToken = undefined;
            return false;
        }
    }
    async fetchProjects(userId) {
        try {
            if (!this.isConnected()) {
                throw new Error('Freelancer service not authenticated');
            }
            // Check if using mock token
            if (this.accessToken?.startsWith('mock_freelancer_token_')) {
                console.log('Returning mock Freelancer projects (using mock credentials)');
                return this.getMockFreelancerProjects();
            }
            // Fetch active projects from Freelancer API
            const response = await this.httpClient.get('/projects/0.1/projects/', {
                params: {
                    owners: userId,
                    project_statuses: ['active', 'pending'],
                    limit: 50
                }
            });
            const projects = response.data.result.projects || [];
            return projects.map((project) => this.mapFreelancerProjectToExternal(project));
        }
        catch (error) {
            console.error('Failed to fetch Freelancer projects:', error);
            // Return mock data on error for development
            if (process.env.NODE_ENV === 'development') {
                console.log('Returning mock Freelancer projects due to API error');
                return this.getMockFreelancerProjects();
            }
            throw new Error(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getMockFreelancerProjects() {
        return [
            {
                id: 'freelancer_001',
                title: 'Vue.js Frontend Development for SaaS Platform',
                description: 'We are looking for an experienced Vue.js developer to build the frontend for our SaaS platform. The project includes creating reusable components, implementing state management with Vuex, and integrating with REST APIs.',
                budget: {
                    min: 1800,
                    max: 3200,
                    currency: 'USD',
                    type: 'fixed'
                },
                deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
                client: {
                    name: 'InnovateSoft Ltd',
                    rating: 4.7,
                    country: 'Singapore'
                },
                skills: ['Vue.js', 'JavaScript', 'Vuex', 'REST API', 'HTML', 'CSS'],
                status: 'active',
                platform: 'freelancer',
                platformUrl: 'https://www.freelancer.com/projects/javascript/vue-js-frontend-development',
                createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                updatedAt: new Date()
            },
            {
                id: 'freelancer_002',
                title: 'Python Web Scraping and Data Processing',
                description: 'Need a Python expert to build web scraping tools that can extract data from multiple e-commerce websites. The data should be cleaned, processed, and stored in a structured format.',
                budget: {
                    min: 15,
                    max: 25,
                    currency: 'USD',
                    type: 'hourly'
                },
                deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
                client: {
                    name: 'MarketData Solutions',
                    rating: 4.9,
                    country: 'Netherlands'
                },
                skills: ['Python', 'Web Scraping', 'BeautifulSoup', 'Scrapy', 'Data Processing', 'Pandas'],
                status: 'active',
                platform: 'freelancer',
                platformUrl: 'https://www.freelancer.com/projects/python/web-scraping-data-processing',
                createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
                updatedAt: new Date()
            },
            {
                id: 'freelancer_003',
                title: 'Logo Design and Brand Identity Package',
                description: 'Looking for a creative graphic designer to create a complete brand identity package including logo design, business cards, letterhead, and brand guidelines for a tech startup.',
                budget: {
                    min: 800,
                    max: 1500,
                    currency: 'USD',
                    type: 'fixed'
                },
                deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                client: {
                    name: 'StartupVentures Inc',
                    rating: 4.8,
                    country: 'United States'
                },
                skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Graphic Design', 'Print Design'],
                status: 'active',
                platform: 'freelancer',
                platformUrl: 'https://www.freelancer.com/projects/logo-design/brand-identity-package',
                createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
                updatedAt: new Date()
            },
            {
                id: 'freelancer_004',
                title: 'Android App Development - Fitness Tracker',
                description: 'We need an experienced Android developer to create a fitness tracking mobile application. The app should include workout tracking, progress monitoring, and social features.',
                budget: {
                    min: 2500,
                    max: 4500,
                    currency: 'USD',
                    type: 'fixed'
                },
                deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
                client: {
                    name: 'FitnessFirst Technologies',
                    rating: 4.6,
                    country: 'India'
                },
                skills: ['Android Development', 'Java', 'Kotlin', 'Mobile App Development', 'Firebase', 'REST APIs'],
                status: 'active',
                platform: 'freelancer',
                platformUrl: 'https://www.freelancer.com/projects/mobile-phone/android-fitness-tracker-app',
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                updatedAt: new Date()
            },
            {
                id: 'freelancer_005',
                title: 'Content Writing for Tech Blog',
                description: 'Seeking a skilled content writer to create high-quality articles for our technology blog. Topics include web development, AI, cybersecurity, and emerging technologies.',
                budget: {
                    min: 20,
                    max: 35,
                    currency: 'USD',
                    type: 'hourly'
                },
                deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                client: {
                    name: 'TechInsights Media',
                    rating: 4.7,
                    country: 'United Kingdom'
                },
                skills: ['Content Writing', 'Technical Writing', 'SEO', 'Blog Writing', 'Research'],
                status: 'active',
                platform: 'freelancer',
                platformUrl: 'https://www.freelancer.com/projects/article-writing/tech-blog-content-writing',
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                updatedAt: new Date()
            },
            {
                id: 'freelancer_006',
                title: 'Database Design and Optimization',
                description: 'We need a database expert to design and optimize our PostgreSQL database for better performance. The project includes schema design, indexing, and query optimization.',
                budget: {
                    min: 1200,
                    max: 2000,
                    currency: 'USD',
                    type: 'fixed'
                },
                deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // 22 days from now
                client: {
                    name: 'DataFlow Systems',
                    rating: 4.9,
                    country: 'Canada'
                },
                skills: ['PostgreSQL', 'Database Design', 'SQL', 'Performance Optimization', 'Database Administration'],
                status: 'active',
                platform: 'freelancer',
                platformUrl: 'https://www.freelancer.com/projects/sql/database-design-optimization',
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                updatedAt: new Date()
            }
        ];
    }
    async syncProject(projectId) {
        try {
            if (!this.isConnected()) {
                throw new Error('Freelancer service not authenticated');
            }
            // Check if using mock token
            if (this.accessToken?.startsWith('mock_freelancer_token_')) {
                const mockProjects = this.getMockFreelancerProjects();
                const project = mockProjects.find(p => p.id === projectId);
                if (!project) {
                    throw new Error(`Project ${projectId} not found`);
                }
                return project;
            }
            const response = await this.httpClient.get(`/projects/0.1/projects/${projectId}`);
            const freelancerProject = response.data.result.projects[0];
            if (!freelancerProject) {
                throw new Error(`Project ${projectId} not found on Freelancer`);
            }
            return this.mapFreelancerProjectToExternal(freelancerProject);
        }
        catch (error) {
            console.error('Failed to sync Freelancer project:', error);
            throw new Error(`Failed to sync project: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    mapFreelancerProjectToExternal(freelancerProject) {
        // Parse budget information
        const budget = {
            min: freelancerProject.budget.minimum,
            max: freelancerProject.budget.maximum,
            currency: freelancerProject.currency.code,
            type: freelancerProject.type === 'hourly' ? 'hourly' : 'fixed'
        };
        // Parse deadline
        const deadline = this.parseDeadline(freelancerProject.period);
        // Extract skills
        const skills = freelancerProject.jobs.map(job => job.name);
        return {
            id: freelancerProject.id.toString(),
            title: freelancerProject.title,
            description: freelancerProject.description,
            budget,
            deadline,
            client: {
                name: freelancerProject.owner.display_name,
                rating: freelancerProject.owner.reputation?.entire_history?.overall || undefined,
                country: freelancerProject.owner.country?.name
            },
            skills,
            status: this.mapFreelancerStatus(freelancerProject.status),
            platform: 'freelancer',
            platformUrl: freelancerProject.url,
            createdAt: new Date(freelancerProject.time_submitted * 1000),
            updatedAt: new Date()
        };
    }
    parseDeadline(period) {
        if (!period)
            return undefined;
        const now = new Date();
        const periodLower = period.toLowerCase();
        if (periodLower.includes('week')) {
            const weeks = parseInt(periodLower.match(/\d+/)?.[0] || '1');
            return new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
        }
        else if (periodLower.includes('month')) {
            const months = parseInt(periodLower.match(/\d+/)?.[0] || '1');
            return new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
        }
        else if (periodLower.includes('day')) {
            const days = parseInt(periodLower.match(/\d+/)?.[0] || '1');
            return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        }
        return undefined;
    }
    mapFreelancerStatus(status) {
        // Map Freelancer statuses to our status
        const statusMap = {
            'active': 'active',
            'pending': 'active',
            'closed': 'completed',
            'cancelled': 'cancelled',
            'draft': 'draft'
        };
        return statusMap[status] || 'active';
    }
    // Override isConnected to check for access token
    isConnected() {
        return this.platform.isActive && !!this.accessToken;
    }
    // Method to clear stored token
    async disconnect() {
        await super.disconnect();
        this.accessToken = undefined;
    }
    // Method to restore token from stored data
    restoreToken(accessToken) {
        this.accessToken = accessToken;
        this.platform.accessToken = accessToken;
        this.platform.isActive = true;
    }
}
exports.FreelancerService = FreelancerService;
