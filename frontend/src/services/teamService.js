import api from './api';

// Subscription Service
export const subscriptionService = {
  // Get current subscription
  async getSubscription() {
    const response = await api.get('/api/subscription/subscription');
    return response.data;
  },

  // Get all available plans
  async getPlans() {
    const response = await api.get('/api/subscription/plans');
    return response.data;
  },

  // Upgrade subscription
  async upgradeSubscription(plan) {
    const response = await api.post('/api/subscription/upgrade', { plan });
    return response.data;
  },

  // Cancel subscription
  async cancelSubscription() {
    const response = await api.post('/api/subscription/cancel');
    return response.data;
  },

  // Check if user can invite more members
  async canInvite() {
    const response = await api.get('/api/subscription/can-invite');
    return response.data;
  }
};

// Team Management Service
export const teamService = {
  // Send team invitation
  async sendInvitation(email, name) {
    const response = await api.post('/api/team/invite', { email, name });
    return response.data;
  },

  // Validate invitation token (public - no auth required)
  async validateInvitation(token) {
    const response = await api.get(`/api/team/invite/validate/${token}`);
    return response.data;
  },

  // Accept invitation and create account (public - no auth required)
  async acceptInvitation(token, email, password, firstName, lastName) {
    const response = await api.post('/api/team/invite/accept', {
      token,
      email,
      password,
      firstName,
      lastName
    });
    return response.data;
  },

  // Get team members
  async getTeamMembers() {
    const response = await api.get('/api/team/members');
    return response.data;
  },

  // Search team members
  async searchTeamMembers(query) {
    const response = await api.get(`/api/team/members/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Remove team member
  async removeMember(memberId) {
    const response = await api.delete(`/api/team/members/${memberId}`);
    return response.data;
  },

  // Get pending invitations
  async getPendingInvitations() {
    const response = await api.get('/api/team/invitations/pending');
    return response.data;
  }
};
