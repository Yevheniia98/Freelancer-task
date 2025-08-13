import { UpworkService } from '../services/upwork.service';
import { FreelancerPlatform } from '../services/freelancer.service';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UpworkService', () => {
  let upworkService: UpworkService;
  let mockPlatform: FreelancerPlatform;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create mock platform
    mockPlatform = {
      name: 'upwork',
      apiKey: 'test-consumer-key',
      apiSecret: 'test-consumer-secret',
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      isActive: true
    };

    // Create axios mock implementation
    mockedAxios.create.mockReturnValue({
      defaults: { baseURL: '', headers: {} },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() }
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any);

    upworkService = new UpworkService(mockPlatform);
  });

  describe('authentication', () => {
    it('should authenticate with valid credentials', async () => {
      const credentials = {
        consumerKey: 'valid-key',
        consumerSecret: 'valid-secret'
      };

      const result = await upworkService.authenticate(credentials);

      expect(result).toBe(true);
      expect(mockPlatform.apiKey).toBe(credentials.consumerKey);
      expect(mockPlatform.apiSecret).toBe(credentials.consumerSecret);
    });

    it('should fail authentication with missing credentials', async () => {
      const credentials = {
        consumerKey: '',
        consumerSecret: 'valid-secret'
      };

      const result = await upworkService.authenticate(credentials);

      expect(result).toBe(false);
    });

    it('should fail authentication with invalid credentials', async () => {
      const credentials = {
        consumerKey: 'invalid-key',
        consumerSecret: ''
      };

      const result = await upworkService.authenticate(credentials);

      expect(result).toBe(false);
    });
  });

  describe('connection status', () => {
    it('should return true when connected', () => {
      mockPlatform.isActive = true;
      mockPlatform.accessToken = 'valid-token';
      
      // Set up OAuth tokens using the restore method
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');

      const result = upworkService.isConnected();

      expect(result).toBe(true);
    });

    it('should return false when not active', () => {
      mockPlatform.isActive = false;
      mockPlatform.accessToken = 'valid-token';

      const result = upworkService.isConnected();

      expect(result).toBe(false);
    });

    it('should return false when no access token', () => {
      mockPlatform.isActive = true;
      mockPlatform.accessToken = '';

      const result = upworkService.isConnected();

      expect(result).toBe(false);
    });
  });

  describe('fetchProjects', () => {
    const mockUpworkProjects = [
      {
        job_id: 'job123',
        title: 'React Developer Needed',
        description: 'Build a React application with modern features',
        job_type: 'hourly',
        budget: '$25-$40/hr',
        duration: '3 months',
        workload: 'More than 30 hrs/week',
        skills: ['React', 'JavaScript', 'Node.js'],
        posted_on: '2025-08-01T10:00:00Z',
        client: {
          feedback: 4.8,
          reviews_count: 25,
          jobs_posted: 15,
          hire_rate: 85,
          country: 'United States',
          payment_verified: true
        },
        url: 'https://www.upwork.com/jobs/~job123',
        category: 'Web Development',
        subcategory: 'Frontend Development'
      },
      {
        job_id: 'job456',
        title: 'Mobile App Development',
        description: 'Create a cross-platform mobile application',
        job_type: 'fixed',
        budget: '$5000',
        duration: '2 months',
        workload: 'Less than 30 hrs/week',
        skills: ['React Native', 'iOS', 'Android'],
        posted_on: '2025-08-02T14:30:00Z',
        client: {
          feedback: 4.5,
          reviews_count: 12,
          jobs_posted: 8,
          hire_rate: 90,
          country: 'Canada',
          payment_verified: true
        },
        url: 'https://www.upwork.com/jobs/~job456',
        category: 'Mobile Development',
        subcategory: 'Cross-platform'
      }
    ];

    beforeEach(() => {
      // Mock the HTTP client get method
      const mockHttpClient = {
        get: jest.fn()
      };
      
      // Set up the service to use our mock
      (upworkService as any).httpClient = mockHttpClient;
    });

    it('should fetch projects successfully', async () => {
      // Set up OAuth tokens first
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');
      
      const mockHttpClient = (upworkService as any).httpClient;
      
      // Mock the profile/roles call first
      mockHttpClient.get
        .mockResolvedValueOnce({ 
          data: { 
            userrole: [
              { role: 'manager', team__id: 'team123' }
            ]
          } 
        })
        .mockResolvedValueOnce({ data: { jobs: [mockUpworkProjects[0]] } })
        .mockResolvedValueOnce({ data: { jobs: [mockUpworkProjects[1]] } });

      const projects = await upworkService.fetchProjects('user123');

      expect(projects).toHaveLength(2);
      expect(projects[0]).toMatchObject({
        id: 'job123',
        title: 'React Developer Needed',
        platform: 'upwork',
        skills: ['React', 'JavaScript', 'Node.js']
      });
      expect(projects[1]).toMatchObject({
        id: 'job456',
        title: 'Mobile App Development',
        platform: 'upwork',
        skills: ['React Native', 'iOS', 'Android']
      });
    });

    it('should handle API errors gracefully', async () => {
      // Set up OAuth tokens first
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');
      
      const mockHttpClient = (upworkService as any).httpClient;
      mockHttpClient.get.mockRejectedValue(new Error('API Error'));

      await expect(upworkService.fetchProjects('user123')).rejects.toThrow('Upwork API error: API Error');
    });

    it('should throw error when not connected', async () => {
      mockPlatform.isActive = false;

      await expect(upworkService.fetchProjects('user123')).rejects.toThrow('Upwork service not authenticated');
    });
  });

  describe('syncProject', () => {
    const mockUpworkProject = {
      job_id: 'job789',
      title: 'Full Stack Developer',
      description: 'Build a complete web application',
      job_type: 'fixed',
      budget: '$8000',
      duration: '4 months',
      workload: 'More than 30 hrs/week',
      skills: ['React', 'Node.js', 'MongoDB'],
      posted_on: '2025-08-03T09:15:00Z',
      client: {
        feedback: 4.9,
        reviews_count: 50,
        jobs_posted: 30,
        hire_rate: 95,
        country: 'United Kingdom',
        payment_verified: true
      },
      url: 'https://www.upwork.com/jobs/~job789',
      category: 'Web Development',
      subcategory: 'Full Stack'
    };

    beforeEach(() => {
      const mockHttpClient = {
        get: jest.fn()
      };
      (upworkService as any).httpClient = mockHttpClient;
    });

    it('should sync individual project successfully', async () => {
      // Set up OAuth tokens first
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');
      
      const mockHttpClient = (upworkService as any).httpClient;
      mockHttpClient.get.mockResolvedValue({ data: { job: mockUpworkProject } });

      const project = await upworkService.syncProject('job789');

      expect(project).toMatchObject({
        id: 'job789',
        title: 'Full Stack Developer',
        platform: 'upwork',
        budget: {
          min: 8000,
          max: 8000,
          currency: 'USD',
          type: 'fixed'
        }
      });
    });

    it('should handle project not found', async () => {
      // Set up OAuth tokens first
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');
      
      const mockHttpClient = (upworkService as any).httpClient;
      mockHttpClient.get.mockResolvedValue({ data: { job: null } });

      await expect(upworkService.syncProject('nonexistent')).rejects.toThrow('Project nonexistent not found on Upwork');
    });

    it('should handle API errors', async () => {
      // Set up OAuth tokens first
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');
      
      const mockHttpClient = (upworkService as any).httpClient;
      mockHttpClient.get.mockRejectedValue(new Error('Not found'));

      await expect(upworkService.syncProject('job789')).rejects.toThrow('Failed to sync project: Not found');
    });
  });

  describe('budget parsing', () => {
    it('should parse fixed budget correctly', () => {
      const service = upworkService as any;
      
      const budget1 = service.parseBudget('$1000', 'fixed');
      expect(budget1).toEqual({
        min: 1000,
        max: 1000,
        currency: 'USD',
        type: 'fixed'
      });

      const budget2 = service.parseBudget('$500-$1500', 'fixed');
      expect(budget2).toEqual({
        min: 500,
        max: 1500,
        currency: 'USD',
        type: 'fixed'
      });
    });

    it('should parse hourly budget correctly', () => {
      const service = upworkService as any;
      
      const budget1 = service.parseBudget('$25/hr', 'hourly');
      expect(budget1).toEqual({
        min: 25,
        max: 25,
        currency: 'USD',
        type: 'hourly'
      });

      const budget2 = service.parseBudget('$15-$30/hr', 'hourly');
      expect(budget2).toEqual({
        min: 15,
        max: 30,
        currency: 'USD',
        type: 'hourly'
      });
    });

    it('should handle empty budget', () => {
      const service = upworkService as any;
      
      const budget = service.parseBudget('', 'fixed');
      expect(budget).toEqual({
        currency: 'USD',
        type: 'fixed'
      });
    });
  });

  describe('deadline parsing', () => {
    it('should parse week-based deadlines', () => {
      const service = upworkService as any;
      const now = new Date();
      
      const deadline = service.parseDeadline('2 weeks');
      const expectedDate = new Date(now.getTime() + 2 * 7 * 24 * 60 * 60 * 1000);
      
      expect(deadline).toBeDefined();
      expect(Math.abs(deadline.getTime() - expectedDate.getTime())).toBeLessThan(1000); // Within 1 second
    });

    it('should parse month-based deadlines', () => {
      const service = upworkService as any;
      const now = new Date();
      
      const deadline = service.parseDeadline('3 months');
      const expectedDate = new Date(now.getTime() + 3 * 30 * 24 * 60 * 60 * 1000);
      
      expect(deadline).toBeDefined();
      expect(Math.abs(deadline.getTime() - expectedDate.getTime())).toBeLessThan(1000);
    });

    it('should parse day-based deadlines', () => {
      const service = upworkService as any;
      const now = new Date();
      
      const deadline = service.parseDeadline('5 days');
      const expectedDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      
      expect(deadline).toBeDefined();
      expect(Math.abs(deadline.getTime() - expectedDate.getTime())).toBeLessThan(1000);
    });

    it('should return undefined for invalid duration', () => {
      const service = upworkService as any;
      
      const deadline = service.parseDeadline('invalid duration');
      expect(deadline).toBeUndefined();
    });
  });

  describe('OAuth handling', () => {
    it('should handle OAuth callback successfully', async () => {
      // Mock the axios.post call for token exchange
      mockedAxios.post.mockResolvedValue({
        data: 'oauth_token=access-token&oauth_token_secret=access-secret',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      } as any);
      
      // Set up request tokens first
      (upworkService as any).oauthTokens.requestToken = 'oauth-token';
      (upworkService as any).oauthTokens.requestTokenSecret = 'request-secret';
      
      const result = await upworkService.handleOAuthCallback('oauth-token', 'oauth-verifier');

      expect(result).toBe(true);
      expect(mockPlatform.accessToken).toBe('access-token');
      expect(mockPlatform.refreshToken).toBe('access-secret');
      expect(mockPlatform.isActive).toBe(true);
    });

    it('should refresh access token', async () => {
      // Set up OAuth tokens first
      upworkService.restoreTokens('oauth-access-token', 'oauth-access-secret');
      
      // Mock the HTTP client for validation call
      const mockHttpClient = (upworkService as any).httpClient;
      mockHttpClient.get.mockResolvedValue({ status: 200 });
      
      const result = await upworkService.refreshAccessToken();

      expect(result).toBe(true);
    });

    it('should fail to refresh without refresh token', async () => {
      // Clear tokens
      upworkService.clearTokens();

      const result = await upworkService.refreshAccessToken();

      expect(result).toBe(false);
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      await upworkService.disconnect();

      expect(mockPlatform.isActive).toBe(false);
      expect(mockPlatform.accessToken).toBeUndefined();
      expect(mockPlatform.refreshToken).toBeUndefined();
    });
  });
});
