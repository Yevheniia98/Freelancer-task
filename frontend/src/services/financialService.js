import api from './api';

class FinancialService {
  /**
   * Get financial summary (balance, earnings by platform, statistics)
   */
  async getFinancialSummary() {
    try {
      const response = await api.get('/finance/summary');
      return response.data;
    } catch (error) {
      // Silently throw - component layer handles error logging via logControl
      throw error;
    }
  }

  /**
   * Sync earnings from all connected platforms
   */
  async syncAllPlatforms() {
    try {
      const response = await api.post('/finance/sync');
      return response.data;
    } catch (error) {
      // Silently throw - component layer handles error logging
      throw error;
    }
  }

  /**
   * Sync earnings from a specific platform
   */
  async syncPlatform(platform) {
    try {
      const response = await api.post(`/finance/sync/${platform}`);
      return response.data;
    } catch (error) {
      // Silently throw - component layer handles error logging
      throw error;
    }
  }

  /**
   * Get list of connected platforms
   */
  async getConnectedPlatforms() {
    try {
      const response = await api.get('/finance/platforms');
      return response.data;
    } catch (error) {
      // Silently throw - component layer handles error logging
      throw error;
    }
  }

  /**
   * Initiate OAuth flow for a platform
   */
  async connectPlatform(platform) {
    try {
      const response = await api.get(`/finance/oauth/${platform}/authorize`);
      return response.data.authUrl;
    } catch (error) {
      // Silently throw - component layer handles error logging
      throw error;
    }
  }

  /**
   * Disconnect a platform
   */
  async disconnectPlatform(platform) {
    try {
      const response = await api.delete(`/finance/platforms/${platform}`);
      return response.data;
    } catch (error) {
      // Silently throw - component layer handles error logging
      throw error;
    }
  }

  /**
   * Get platform display information
   */
  getPlatformInfo(platform) {
    const platformData = {
      upwork: {
        name: 'Upwork',
        color: '#14a800',
        logo: 'U',
      },
      freelancer: {
        name: 'Freelancer',
        color: '#0e83cd',
        logo: 'F',
      },
      fiverr: {
        name: 'Fiverr',
        color: '#1dbf73',
        logo: 'F',
      },
      toptal: {
        name: 'Toptal',
        color: '#204ecf',
        logo: 'T',
      },
      guru: {
        name: 'Guru',
        color: '#ff6600',
        logo: 'G',
      },
    };

    return (
      platformData[platform.toLowerCase()] || {
        name: platform,
        color: '#666',
        logo: platform.charAt(0).toUpperCase(),
      }
    );
  }
}

export default new FinancialService();
