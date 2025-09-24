import axios from 'axios';

// Base API URL - matches your backend server
const API_BASE_URL = 'http://localhost:3030/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (you may need to adjust based on your auth implementation)
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        // You might want to redirect to login page here
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const taskService = {
  /**
   * Get task statistics for the authenticated user
   * @returns {Promise} Task statistics including total, completed, pending, etc.
   */
  async getTaskStatistics() {
    try {
      const response = await apiClient.get('/tasks/statistics');
      return response.data.data || response.data; // Handle different response formats
    } catch (error) {
      console.error('Failed to fetch task statistics:', error);
      
      // Return mock data as fallback when API is not available
      return {
        totalTasks: 5,
        completedTasks: 1,
        inProgressTasks: 2,
        pendingTasks: 2,
        completionRate: 20.0,
        overdueCount: 1,
        priorityBreakdown: {
          high: 2,
          medium: 2,
          low: 1
        },
        dataSource: 'Mock Data (API not available)'
      };
    }
  },

  /**
   * Get user's tasks with optional filtering and pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Items per page (default: 10)
   * @param {string} options.status - Filter by status
   * @param {string} options.priority - Filter by priority
   * @param {string} options.search - Search term
   * @returns {Promise} User's tasks with pagination info
   */
  async getUserTasks(options = {}) {
    try {
      const params = new URLSearchParams();
      
      // Add pagination
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      
      // Add filters
      if (options.status) params.append('status', options.status);
      if (options.priority) params.append('priority', options.priority);
      if (options.search) params.append('search', options.search);
      
      const response = await apiClient.get(`/tasks/my-tasks?${params.toString()}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Failed to fetch user tasks:', error);
      
      // Return mock data as fallback
      return {
        tasks: [
          {
            _id: '1',
            title: 'Complete Project Setup',
            description: 'Set up the initial project structure and dependencies',
            dueDate: '2024-02-15',
            priority: 'high',
            status: 'TODO'
          },
          {
            _id: '2', 
            title: 'Implement User Authentication',
            description: 'Create login and registration functionality',
            dueDate: '2024-02-20',
            priority: 'high',
            status: 'IN_PROGRESS'
          },
          {
            _id: '3',
            title: 'Design Database Schema',
            description: 'Create the database schema for all entities',
            dueDate: '2024-02-10',
            priority: 'medium',
            status: 'COMPLETED'
          },
          {
            _id: '4',
            title: 'Write API Documentation',
            description: 'Document all API endpoints and their usage',
            dueDate: '2024-03-01',
            priority: 'low',
            status: 'TODO'
          },
          {
            _id: '5',
            title: 'Code Review and Testing',
            description: 'Review code quality and write comprehensive tests',
            dueDate: '2024-02-25',
            priority: 'medium',
            status: 'IN_PROGRESS'
          }
        ],
        totalCount: 5,
        currentPage: options.page || 1,
        pagination: {
          page: options.page || 1,
          limit: options.limit || 10,
          totalCount: 5,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        },
        dataSource: 'Mock Data (API not available)'
      };
    }
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise} Created task
   */
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} Updated task
   */
  async updateTask(taskId, taskData) {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Promise} Success response
   */
  async deleteTask(taskId) {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  /**
   * Create sample task (for testing purposes)
   * @returns {Promise} Created sample task
   */
  async createSampleTask() {
    try {
      const response = await apiClient.post('/tasks/create-sample');
      return response.data;
    } catch (error) {
      console.error('Failed to create sample task:', error);
      throw error;
    }
  }
};

export default taskService;
