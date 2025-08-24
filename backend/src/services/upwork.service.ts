import { BasePlatformService, ExternalProject, FreelancerPlatform } from './freelancer.service';
import crypto from 'crypto';
import querystring from 'querystring';
import axios from 'axios';

interface UpworkAuthCredentials {
  consumerKey: string;
  consumerSecret: string;
}

interface UpworkOAuthTokens {
  requestToken?: string;
  requestTokenSecret?: string;
  accessToken?: string;
  accessTokenSecret?: string;
  verifier?: string;
}

interface OAuthParameters {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_version: string;
  oauth_token?: string;
  oauth_verifier?: string;
  oauth_callback?: string;
}

interface UpworkAuthResponse {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed?: string;
}

interface UpworkProject {
  job_id: string;
  title: string;
  description: string;
  job_type: string;
  budget: string;
  duration: string;
  workload: string;
  skills: string[];
  posted_on: string;
  client: {
    feedback: number;
    reviews_count: number;
    jobs_posted: number;
    hire_rate: number;
    country: string;
    payment_verified: boolean;
  };
  url: string;
  category: string;
  subcategory: string;
}

interface UpworkJobsResponse {
  jobs: UpworkProject[];
  paging: {
    offset: number;
    count: number;
    total: number;
  };
}

export class UpworkService extends BasePlatformService {
  private readonly baseURL = process.env.UPWORK_API_BASE_URL || 'https://www.upwork.com/api';
  private readonly authURL = process.env.UPWORK_OAUTH_BASE_URL || 'https://www.upwork.com/api/auth/v1/oauth';
  private readonly callbackURL = process.env.UPWORK_CALLBACK_URL || 'http://localhost:3002/api/integrations/upwork/callback';
  
  private consumerKey: string;
  private consumerSecret: string;
  private oauthTokens: UpworkOAuthTokens = {};

  constructor(platform: FreelancerPlatform) {
    super(platform);
    this.consumerKey = process.env.UPWORK_CONSUMER_KEY || '';
    this.consumerSecret = process.env.UPWORK_CONSUMER_SECRET || '';
    this.setupUpworkClient();
  }

  private setupUpworkClient() {
    this.httpClient.defaults.baseURL = this.baseURL;
    
    // Add OAuth 1.0a authentication interceptor
    this.httpClient.interceptors.request.use((config: any) => {
      if (this.oauthTokens.accessToken && this.oauthTokens.accessTokenSecret) {
        // Generate OAuth 1.0a signature for authenticated requests
        const oauthParams = this.generateOAuthParams();
        const signature = this.generateSignature(
          config.method?.toUpperCase() || 'GET',
          config.baseURL + config.url,
          { ...oauthParams, ...config.params },
          this.oauthTokens.accessTokenSecret
        );
        
        const authHeader = this.buildAuthorizationHeader({ ...oauthParams, oauth_signature: signature });
        config.headers.Authorization = authHeader;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          this.platform.isActive = false;
          this.oauthTokens = {}; // Clear invalid tokens
        }
        return Promise.reject(error);
      }
    );
  }

  async authenticate(credentials: UpworkAuthCredentials): Promise<boolean> {
    try {
      const { consumerKey, consumerSecret } = credentials;
      
      if (!consumerKey || !consumerSecret) {
        throw new Error('Consumer key and secret are required for Upwork authentication');
      }

      // Store credentials
      this.consumerKey = consumerKey;
      this.consumerSecret = consumerSecret;
      this.platform.apiKey = consumerKey;
      this.platform.apiSecret = consumerSecret;

      return true;
    } catch (error) {
      console.error('Upwork authentication setup failed:', error);
      return false;
    }
  }

  /**
   * Step 1: Get request token from Upwork
   */
  async getRequestToken(): Promise<{ authUrl: string; requestToken: string }> {
    try {
      // Check if using mock credentials
      if (!this.consumerKey || !this.consumerSecret || 
          this.consumerKey.includes('your_upwork_consumer_key_here') ||
          this.consumerSecret.includes('your_upwork_consumer_secret_here')) {
        
        console.log('Using mock Upwork OAuth response (credentials not configured)');
        
        // Return mock response for development
        const mockRequestToken = 'mock_request_token_' + Date.now();
        const mockRequestTokenSecret = 'mock_request_token_secret_' + Date.now();
        
        this.oauthTokens.requestToken = mockRequestToken;
        this.oauthTokens.requestTokenSecret = mockRequestTokenSecret;
        
        return {
          authUrl: `${this.callbackURL}?oauth_token=${mockRequestToken}&oauth_verifier=mock_verifier&mock=true`,
          requestToken: mockRequestToken
        };
      }

      const oauthParams = this.generateOAuthParams();
      oauthParams.oauth_callback = this.callbackURL;
      
      const signature = this.generateSignature(
        'POST',
        `${this.authURL}/token/request`,
        oauthParams
      );

      const authHeader = this.buildAuthorizationHeader({ 
        ...oauthParams, 
        oauth_signature: signature 
      });

      const response = await axios.post(`${this.authURL}/token/request`, null, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const responseData = querystring.parse(response.data as string) as any;
      
      if (!responseData.oauth_token || !responseData.oauth_token_secret) {
        throw new Error('Invalid response from Upwork OAuth request');
      }

      // Store request token
      this.oauthTokens.requestToken = responseData.oauth_token as string;
      this.oauthTokens.requestTokenSecret = responseData.oauth_token_secret as string;

      const authUrl = `${this.authURL}/authorize?oauth_token=${responseData.oauth_token}`;
      
      return {
        authUrl,
        requestToken: responseData.oauth_token as string
      };

    } catch (error) {
      console.error('Failed to get Upwork request token:', error);
      throw new Error(`OAuth request token failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Step 2: Exchange request token for access token
   */
  async exchangeTokens(oauthToken: string, oauthVerifier: string): Promise<boolean> {
    try {
      // Handle mock OAuth flow
      if (oauthToken.startsWith('mock_request_token_') || oauthVerifier === 'mock_verifier') {
        console.log('Using mock Upwork token exchange');
        
        // Set mock access tokens
        this.oauthTokens.accessToken = 'mock_access_token_' + Date.now();
        this.oauthTokens.accessTokenSecret = 'mock_access_token_secret_' + Date.now();
        this.platform.accessToken = this.oauthTokens.accessToken;
        this.platform.refreshToken = this.oauthTokens.accessTokenSecret;
        this.platform.isActive = true;
        
        return true;
      }

      if (!this.oauthTokens.requestToken || !this.oauthTokens.requestTokenSecret) {
        throw new Error('No request token found. Please initiate OAuth flow first.');
      }

      if (oauthToken !== this.oauthTokens.requestToken) {
        throw new Error('OAuth token mismatch');
      }

      const oauthParams = this.generateOAuthParams();
      oauthParams.oauth_token = oauthToken;
      oauthParams.oauth_verifier = oauthVerifier;

      const signature = this.generateSignature(
        'POST',
        `${this.authURL}/token/access`,
        oauthParams,
        this.oauthTokens.requestTokenSecret
      );

      const authHeader = this.buildAuthorizationHeader({ 
        ...oauthParams, 
        oauth_signature: signature 
      });

      const response = await axios.post(`${this.authURL}/token/access`, null, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const responseData = querystring.parse(response.data as string) as any;
      
      if (!responseData.oauth_token || !responseData.oauth_token_secret) {
        throw new Error('Invalid access token response from Upwork');
      }

      // Store access tokens
      this.oauthTokens.accessToken = responseData.oauth_token as string;
      this.oauthTokens.accessTokenSecret = responseData.oauth_token_secret as string;
      
      // Update platform status
      this.platform.accessToken = responseData.oauth_token as string;
      this.platform.refreshToken = responseData.oauth_token_secret as string; // Store secret as refresh token
      this.platform.isActive = true;

      return true;

    } catch (error) {
      console.error('Failed to exchange OAuth tokens:', error);
      throw new Error(`OAuth token exchange failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchProjects(userId: string): Promise<ExternalProject[]> {
    try {
      if (!this.isConnected() || !this.oauthTokens.accessToken) {
        throw new Error('Upwork service not authenticated');
      }

      // Check if using mock tokens
      if (this.oauthTokens.accessToken?.startsWith('mock_access_token_')) {
        console.log('Returning mock Upwork projects (using mock credentials)');
        return this.getMockUpworkProjects();
      }

      // Fetch user profile first to get team information
      const profileResponse = await this.httpClient.get('/hr/v2/userroles');
      const userRoles = profileResponse.data;

      if (!userRoles || !userRoles.userrole || userRoles.userrole.length === 0) {
        throw new Error('No user roles found. User may not have access to jobs.');
      }

      // Get jobs from all teams the user belongs to
      const allJobs: UpworkProject[] = [];
      
      for (const role of userRoles.userrole) {
        if (role.role === 'manager' || role.role === 'recruiter') {
          try {
            // Fetch active and completed jobs for this team
            const [activeJobs, completedJobs] = await Promise.all([
              this.fetchJobsByTeamAndStatus(role.team__id, 'open'),
              this.fetchJobsByTeamAndStatus(role.team__id, 'completed')
            ]);
            
            allJobs.push(...activeJobs, ...completedJobs);
          } catch (error) {
            console.warn(`Failed to fetch jobs for team ${role.team__id}:`, error);
          }
        }
      }

      return allJobs.map(job => this.mapUpworkProjectToExternal(job));

    } catch (error) {
      console.error('Failed to fetch Upwork projects:', error);
      
      // Return mock data on error for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Returning mock Upwork projects due to API error');
        return this.getMockUpworkProjects();
      }
      
      throw new Error(`Upwork API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getMockUpworkProjects(): ExternalProject[] {
    return [
      {
        id: 'upwork_001',
        title: 'Full-Stack Web Application Development',
        description: 'Looking for an experienced full-stack developer to build a modern web application using React, Node.js, and MongoDB. The project involves creating a user management system, RESTful APIs, and responsive UI components.',
        budget: {
          min: 2500,
          max: 4000,
          currency: 'USD',
          type: 'fixed'
        },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        client: {
          name: 'TechStart Solutions',
          rating: 4.8,
          country: 'United States'
        },
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'REST APIs'],
        status: 'active',
        platform: 'upwork',
        platformUrl: 'https://www.upwork.com/jobs/~01234567890abcdef',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date()
      },
      {
        id: 'upwork_002',
        title: 'Mobile App UI/UX Design',
        description: 'We need a talented designer to create modern, intuitive UI/UX designs for our mobile application. The app is in the fitness industry and targets young professionals.',
        budget: {
          min: 25,
          max: 40,
          currency: 'USD',
          type: 'hourly'
        },
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        client: {
          name: 'FitLife Corp',
          rating: 4.9,
          country: 'Canada'
        },
        skills: ['UI Design', 'UX Design', 'Mobile Design', 'Figma', 'Prototyping'],
        status: 'active',
        platform: 'upwork',
        platformUrl: 'https://www.upwork.com/jobs/~02345678901bcdef2',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updatedAt: new Date()
      },
      {
        id: 'upwork_003',
        title: 'WordPress E-commerce Site Development',
        description: 'Seeking a WordPress expert to develop a complete e-commerce website with WooCommerce integration, payment gateways, and custom theme development.',
        budget: {
          min: 1500,
          max: 2500,
          currency: 'USD',
          type: 'fixed'
        },
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        client: {
          name: 'Boutique Fashion Store',
          rating: 4.7,
          country: 'United Kingdom'
        },
        skills: ['WordPress', 'WooCommerce', 'PHP', 'HTML', 'CSS', 'Payment Integration'],
        status: 'active',
        platform: 'upwork',
        platformUrl: 'https://www.upwork.com/jobs/~03456789012cdef34',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updatedAt: new Date()
      },
      {
        id: 'upwork_004',
        title: 'Data Analysis and Visualization Dashboard',
        description: 'Looking for a data analyst to create comprehensive dashboards using Python, Pandas, and visualization tools. The project involves analyzing sales data and creating interactive reports.',
        budget: {
          min: 30,
          max: 50,
          currency: 'USD',
          type: 'hourly'
        },
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        client: {
          name: 'DataDriven Analytics',
          rating: 4.6,
          country: 'Australia'
        },
        skills: ['Python', 'Pandas', 'Data Analysis', 'Tableau', 'SQL', 'Data Visualization'],
        status: 'active',
        platform: 'upwork',
        platformUrl: 'https://www.upwork.com/jobs/~04567890123def456',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date()
      },
      {
        id: 'upwork_005',
        title: 'DevOps and Cloud Infrastructure Setup',
        description: 'We need a DevOps engineer to set up CI/CD pipelines, containerize applications with Docker, and deploy to AWS. Experience with Kubernetes is preferred.',
        budget: {
          min: 3000,
          max: 5000,
          currency: 'USD',
          type: 'fixed'
        },
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000), // 35 days from now
        client: {
          name: 'CloudTech Solutions',
          rating: 4.9,
          country: 'Germany'
        },
        skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
        status: 'active',
        platform: 'upwork',
        platformUrl: 'https://www.upwork.com/jobs/~05678901234ef5678',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date()
      }
    ];
  }

  private async fetchJobsByTeamAndStatus(teamId: string, status: string): Promise<UpworkProject[]> {
    try {
      const response = await this.httpClient.get(`/hr/v2/teams/${teamId}/jobs`, {
        params: {
          status,
          $limit: 100,
          $offset: 0
        }
      });

      return response.data.jobs || [];
    } catch (error) {
      console.error(`Failed to fetch jobs for team ${teamId} with status ${status}:`, error);
      return [];
    }
  }

  private async fetchJobsByStatus(status: string): Promise<UpworkProject[]> {
    const response = await this.httpClient.get('/hr/v2/jobs', {
      params: {
        status,
        $limit: 100,
        $offset: 0
      }
    });

    return response.data.jobs || [];
  }

  async syncProject(projectId: string): Promise<ExternalProject> {
    try {
      if (!this.isConnected() || !this.oauthTokens.accessToken) {
        throw new Error('Upwork service not authenticated');
      }

      const response = await this.httpClient.get(`/hr/v2/jobs/${projectId}`);
      const upworkProject = response.data.job;

      if (!upworkProject) {
        throw new Error(`Project ${projectId} not found on Upwork`);
      }

      return this.mapUpworkProjectToExternal(upworkProject);

    } catch (error) {
      console.error('Failed to sync Upwork project:', error);
      throw new Error(`Failed to sync project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * OAuth 1.0a signature generation methods
   */
  private generateOAuthParams(): OAuthParameters {
    return {
      oauth_consumer_key: this.consumerKey,
      oauth_nonce: this.generateNonce(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_version: '1.0'
    };
  }

  private generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private generateSignature(
    method: string, 
    url: string, 
    params: any, 
    tokenSecret: string = ''
  ): string {
    // Sort parameters
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${this.percentEncode(key)}=${this.percentEncode(params[key])}`)
      .join('&');

    // Create signature base string
    const signatureBaseString = [
      method.toUpperCase(),
      this.percentEncode(url),
      this.percentEncode(sortedParams)
    ].join('&');

    // Create signing key
    const signingKey = `${this.percentEncode(this.consumerSecret)}&${this.percentEncode(tokenSecret)}`;

    // Generate signature
    return crypto
      .createHmac('sha1', signingKey)
      .update(signatureBaseString)
      .digest('base64');
  }

  private percentEncode(str: string): string {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  }

  private buildAuthorizationHeader(params: any): string {
    const headerParams = Object.keys(params)
      .filter(key => key.startsWith('oauth_'))
      .sort()
      .map(key => `${key}="${this.percentEncode(params[key])}"`)
      .join(', ');

    return `OAuth ${headerParams}`;
  }

  private mapUpworkProjectToExternal(upworkProject: UpworkProject): ExternalProject {
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

  private parseBudget(budgetString: string, jobType: string): ExternalProject['budget'] {
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
    } else {
      const amount = parseFloat(cleanBudget.replace('/hr', ''));
      return { min: amount, max: amount, currency, type };
    }
  }

  private parseDeadline(duration: string): Date | undefined {
    if (!duration) return undefined;

    const now = new Date();
    const durationLower = duration.toLowerCase();

    if (durationLower.includes('week')) {
      const weeks = parseInt(durationLower.match(/\d+/)?.[0] || '1');
      return new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
    } else if (durationLower.includes('month')) {
      const months = parseInt(durationLower.match(/\d+/)?.[0] || '1');
      return new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
    } else if (durationLower.includes('day')) {
      const days = parseInt(durationLower.match(/\d+/)?.[0] || '1');
      return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    }

    return undefined;
  }

  private mapUpworkStatus(jobType: string): string {
    // Map Upwork job types to our status
    const statusMap: { [key: string]: string } = {
      'hourly': 'active',
      'fixed': 'active',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };

    return statusMap[jobType] || 'active';
  }

  // Method to handle OAuth callback (for production implementation)
  async handleOAuthCallback(oauthToken: string, oauthVerifier: string): Promise<boolean> {
    try {
      return await this.exchangeTokens(oauthToken, oauthVerifier);
    } catch (error) {
      console.error('OAuth callback handling failed:', error);
      return false;
    }
  }

  // Method to refresh access token (OAuth 1.0a doesn't use refresh tokens)
  async refreshAccessToken(): Promise<boolean> {
    try {
      // OAuth 1.0a access tokens don't typically expire
      // If token is invalid, user needs to re-authenticate
      if (!this.oauthTokens.accessToken || !this.oauthTokens.accessTokenSecret) {
        return false;
      }

      // Test token validity with a simple API call
      const response = await this.httpClient.get('/hr/v2/userroles');
      return response.status === 200;
      
    } catch (error) {
      console.error('Token validation failed:', error);
      this.platform.isActive = false;
      this.oauthTokens = {};
      return false;
    }
  }

  // Method to restore tokens from stored data
  restoreTokens(accessToken: string, accessTokenSecret: string): void {
    this.oauthTokens.accessToken = accessToken;
    this.oauthTokens.accessTokenSecret = accessTokenSecret;
    this.platform.accessToken = accessToken;
    this.platform.refreshToken = accessTokenSecret;
    this.platform.isActive = true;
  }

  // Method to clear all stored tokens
  clearTokens(): void {
    this.oauthTokens = {};
    this.platform.accessToken = undefined;
    this.platform.refreshToken = undefined;
    this.platform.isActive = false;
  }

  // Override isConnected to check for OAuth tokens
  isConnected(): boolean {
    return this.platform.isActive && 
           !!this.oauthTokens.accessToken && 
           !!this.oauthTokens.accessTokenSecret;
  }
}
