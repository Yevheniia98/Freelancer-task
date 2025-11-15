import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export class ProjectApiService {
  /**
   * Create a new project
   */
  static async create(projectData) {
    try {
      const response = await api.post('/projects', projectData);
      return response.data.data;
    } catch (error) {
      console.error('Create project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create project');
    }
  }

  /**
   * Get all projects with filtering and pagination
   */
  static async getAll(query = {}) {
    try {
      const params = new URLSearchParams();
      
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.status) params.append('status', query.status);
      if (query.priority) params.append('priority', query.priority);
      if (query.search) params.append('search', query.search);
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      const response = await api.get(`/projects?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get projects error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch projects');
    }
  }

  /**
   * Get project by ID
   */
  static async getById(id) {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch project');
    }
  }

  /**
   * Update project
   */
  static async update(id, updateData) {
    try {
      const response = await api.put(`/projects/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error('Update project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update project');
    }
  }

  /**
   * Delete project
   */
  static async delete(id) {
    try {
      await api.delete(`/projects/${id}`);
    } catch (error) {
      console.error('Delete project error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete project');
    }
  }

  /**
   * Get project statistics
   */
  static async getStats() {
    try {
      const response = await api.get('/projects/stats');
      return response.data.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch project statistics');
    }
  }

  /**
   * Search projects
   */
  static async search(searchTerm, limit = 10) {
    try {
      const response = await api.get(`/projects/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Search projects error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search projects');
    }
  }

  /**
   * Bulk update project status
   */
  static async bulkUpdateStatus(ids, status) {
    try {
      const response = await api.patch('/projects/bulk/status', { ids, status });
      return response.data.data.modifiedCount;
    } catch (error) {
      console.error('Bulk update error:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk update projects');
    }
  }
}

export default ProjectApiService;
