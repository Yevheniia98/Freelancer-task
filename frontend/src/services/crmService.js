import axios from 'axios';

const API_BASE_URL = 'http://localhost:3030/api';

// Create axios instance with auth token
const createApiClient = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

// Client service
export const clientService = {
  // Get all clients
  async getClients() {
    const api = createApiClient();
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      throw error;
    }
  },

  // Get client by ID
  async getClient(id) {
    const api = createApiClient();
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client:', error);
      throw error;
    }
  },

  // Create new client
  async createClient(clientData) {
    const api = createApiClient();
    try {
      const response = await api.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Failed to create client:', error);
      throw error;
    }
  },

  // Update client
  async updateClient(id, clientData) {
    const api = createApiClient();
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  },

  // Delete client
  async deleteClient(id) {
    const api = createApiClient();
    try {
      await api.delete(`/clients/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw error;
    }
  }
};

// Communication service
export const communicationService = {
  // Get all communications
  async getCommunications(filters = {}) {
    const api = createApiClient();
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/communications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch communications:', error);
      throw error;
    }
  },

  // Get communications for a client
  async getClientCommunications(clientId) {
    const api = createApiClient();
    try {
      const response = await api.get(`/clients/${clientId}/communications`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client communications:', error);
      throw error;
    }
  },

  // Create new communication
  async createCommunication(communicationData) {
    const api = createApiClient();
    try {
      const response = await api.post('/communications', communicationData);
      return response.data;
    } catch (error) {
      console.error('Failed to create communication:', error);
      throw error;
    }
  },

  // Update communication
  async updateCommunication(id, communicationData) {
    const api = createApiClient();
    try {
      const response = await api.put(`/communications/${id}`, communicationData);
      return response.data;
    } catch (error) {
      console.error('Failed to update communication:', error);
      throw error;
    }
  },

  // Delete communication
  async deleteCommunication(id) {
    const api = createApiClient();
    try {
      await api.delete(`/communications/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete communication:', error);
      throw error;
    }
  }
};

// Invoice service
export const invoiceService = {
  // Get all invoices
  async getInvoices(filters = {}) {
    const api = createApiClient();
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/invoices?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  },

  // Get invoices for a client
  async getClientInvoices(clientId) {
    const api = createApiClient();
    try {
      const response = await api.get(`/clients/${clientId}/invoices`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client invoices:', error);
      throw error;
    }
  },

  // Get invoice by ID
  async getInvoice(id) {
    const api = createApiClient();
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  },

  // Create new invoice
  async createInvoice(invoiceData) {
    const api = createApiClient();
    try {
      const response = await api.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  },

  // Update invoice
  async updateInvoice(id, invoiceData) {
    const api = createApiClient();
    try {
      const response = await api.put(`/invoices/${id}`, invoiceData);
      return response.data;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  },

  // Mark invoice as paid
  async markInvoicePaid(id, paymentData) {
    const api = createApiClient();
    try {
      const response = await api.post(`/invoices/${id}/mark-paid`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Failed to mark invoice as paid:', error);
      throw error;
    }
  },

  // Delete invoice
  async deleteInvoice(id) {
    const api = createApiClient();
    try {
      await api.delete(`/invoices/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  },

  // Get invoice statistics
  async getInvoiceStatistics() {
    const api = createApiClient();
    try {
      const response = await api.get('/invoices/statistics');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch invoice statistics:', error);
      throw error;
    }
  }
};

// Deal service
export const dealService = {
  // Get all deals
  async getDeals(filters = {}) {
    const api = createApiClient();
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/deals?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      throw error;
    }
  },

  // Get pipeline data
  async getPipeline() {
    const api = createApiClient();
    try {
      const response = await api.get('/deals/pipeline');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pipeline:', error);
      throw error;
    }
  },

  // Get deals for a client
  async getClientDeals(clientId) {
    const api = createApiClient();
    try {
      const response = await api.get(`/clients/${clientId}/deals`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client deals:', error);
      throw error;
    }
  },

  // Create new deal
  async createDeal(dealData) {
    const api = createApiClient();
    try {
      const response = await api.post('/deals', dealData);
      return response.data;
    } catch (error) {
      console.error('Failed to create deal:', error);
      throw error;
    }
  },

  // Update deal
  async updateDeal(id, dealData) {
    const api = createApiClient();
    try {
      const response = await api.put(`/deals/${id}`, dealData);
      return response.data;
    } catch (error) {
      console.error('Failed to update deal:', error);
      throw error;
    }
  },

  // Move deal to stage
  async moveDealToStage(id, stage, probability) {
    const api = createApiClient();
    try {
      const response = await api.post(`/deals/${id}/move-stage`, { stage, probability });
      return response.data;
    } catch (error) {
      console.error('Failed to move deal to stage:', error);
      throw error;
    }
  },

  // Close deal as won
  async closeDealWon(id) {
    const api = createApiClient();
    try {
      const response = await api.post(`/deals/${id}/close-won`);
      return response.data;
    } catch (error) {
      console.error('Failed to close deal as won:', error);
      throw error;
    }
  },

  // Close deal as lost
  async closeDealLost(id, reason) {
    const api = createApiClient();
    try {
      const response = await api.post(`/deals/${id}/close-lost`, { reason });
      return response.data;
    } catch (error) {
      console.error('Failed to close deal as lost:', error);
      throw error;
    }
  },

  // Add activity to deal
  async addDealActivity(id, activity) {
    const api = createApiClient();
    try {
      const response = await api.post(`/deals/${id}/activities`, activity);
      return response.data;
    } catch (error) {
      console.error('Failed to add deal activity:', error);
      throw error;
    }
  },

  // Delete deal
  async deleteDeal(id) {
    const api = createApiClient();
    try {
      await api.delete(`/deals/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete deal:', error);
      throw error;
    }
  }
};

// Note service
export const noteService = {
  // Get all notes
  async getNotes(filters = {}) {
    const api = createApiClient();
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/notes?${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      throw error;
    }
  },

  // Get notes for a client
  async getClientNotes(clientId) {
    const api = createApiClient();
    try {
      const response = await api.get(`/clients/${clientId}/notes`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch client notes:', error);
      throw error;
    }
  },

  // Get reminders
  async getReminders() {
    const api = createApiClient();
    try {
      const response = await api.get('/notes/reminders');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch reminders:', error);
      throw error;
    }
  },

  // Get overdue notes
  async getOverdueNotes() {
    const api = createApiClient();
    try {
      const response = await api.get('/notes/overdue');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch overdue notes:', error);
      throw error;
    }
  },

  // Create new note
  async createNote(noteData) {
    const api = createApiClient();
    try {
      const response = await api.post('/notes', noteData);
      return response.data;
    } catch (error) {
      console.error('Failed to create note:', error);
      throw error;
    }
  },

  // Update note
  async updateNote(id, noteData) {
    const api = createApiClient();
    try {
      const response = await api.put(`/notes/${id}`, noteData);
      return response.data;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  },

  // Mark note as completed
  async completeNote(id) {
    const api = createApiClient();
    try {
      const response = await api.post(`/notes/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Failed to complete note:', error);
      throw error;
    }
  },

  // Archive note
  async archiveNote(id) {
    const api = createApiClient();
    try {
      const response = await api.post(`/notes/${id}/archive`);
      return response.data;
    } catch (error) {
      console.error('Failed to archive note:', error);
      throw error;
    }
  },

  // Delete note
  async deleteNote(id) {
    const api = createApiClient();
    try {
      await api.delete(`/notes/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  }
};
