import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      // and if we have a token (meaning it's an authenticated user whose session expired)
      const hasToken = localStorage.getItem('auth_token');
      const currentPath = window.location.pathname;
      
      if (hasToken && currentPath !== '/login') {
        // Token expired or invalid for authenticated user
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      } else if (currentPath !== '/login') {
        // Clear any existing tokens but don't redirect if we're already on login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Validate password strength
  validatePassword: async (password, userInfo = {}) => {
    try {
      const response = await api.post('/auth/validate-password', {
        password,
        userInfo
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password validation failed' };
    }
  },

  // Forgot password - send reset code
  forgotPassword: async (data) => {
    try {
      const response = await api.post('/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reset code' };
    }
  },

  // Reset password with verification code
  resetPassword: async (data) => {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }
};

// User management API
export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  }
};

// Utility functions
export const apiUtils = {
  // Save authentication data
  saveAuthData: (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
  },

  // Get saved user data
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Format error messages
  formatErrorMessage: (error) => {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.join(', ');
    }
    return error.message || 'An unexpected error occurred';
  }
};

export default api;
