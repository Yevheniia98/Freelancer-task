import { apiUtils } from './api.js';

const BASE_URL = 'http://localhost:3002';

export const teamManagementAPI = {
  /**
   * Send team invitation
   * @param {Object} inviteData - { inviteEmail: string, inviteeName: string }
   * @returns {Promise<Object>} API response
   */
  async sendInvitation(inviteData) {
    try {
      console.log('📧 Sending team invitation:', inviteData);
      
      const response = await fetch(`${BASE_URL}/api/team-management/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiUtils.getToken()}`
        },
        body: JSON.stringify(inviteData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send invitation');
      }

      console.log('✅ Team invitation sent successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error sending team invitation:', error);
      throw error;
    }
  },

  /**
   * Accept team invitation
   * @param {string} token - Invitation token
   * @returns {Promise<Object>} API response
   */
  async acceptInvitation(token) {
    try {
      console.log('🤝 Accepting team invitation with token:', token);
      
      const response = await fetch(`${BASE_URL}/api/team-management/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiUtils.getToken()}`
        },
        body: JSON.stringify({ token })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to accept invitation');
      }

      console.log('✅ Team invitation accepted successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error accepting team invitation:', error);
      throw error;
    }
  },

  /**
   * Get team members and pending invitations
   * @returns {Promise<Object>} API response with members and invitations
   */
  async getTeamMembers() {
    try {
      console.log('👥 Fetching team members...');
      
      const response = await fetch(`${BASE_URL}/api/team-management/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiUtils.getToken()}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch team members');
      }

      console.log('✅ Team members fetched successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error fetching team members:', error);
      throw error;
    }
  },

  /**
   * Remove team member
   * @param {string} memberId - Team member ID to remove
   * @returns {Promise<Object>} API response
   */
  async removeMember(memberId) {
    try {
      console.log('🗑️ Removing team member:', memberId);
      
      const response = await fetch(`${BASE_URL}/api/team-management/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiUtils.getToken()}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to remove team member');
      }

      console.log('✅ Team member removed successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error removing team member:', error);
      throw error;
    }
  },

  /**
   * Cancel pending invitation
   * @param {string} invitationId - Invitation ID to cancel
   * @returns {Promise<Object>} API response
   */
  async cancelInvitation(invitationId) {
    try {
      console.log('❌ Cancelling invitation:', invitationId);
      
      const response = await fetch(`${BASE_URL}/api/team-management/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiUtils.getToken()}`
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel invitation');
      }

      console.log('✅ Invitation cancelled successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error cancelling invitation:', error);
      throw error;
    }
  },

  /**
   * Get invitation details by token (for invite acceptance page)
   * @param {string} token - Invitation token
   * @returns {Promise<Object>} API response with invitation details
   */
  async getInvitationDetails(token) {
    try {
      console.log('🔍 Getting invitation details for token:', token);
      
      const response = await fetch(`${BASE_URL}/api/team-management/invitation/${encodeURIComponent(token)}`, {
        method: 'GET'
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to get invitation details');
      }

      console.log('✅ Invitation details fetched successfully:', result);
      return result;

    } catch (error) {
      console.error('❌ Error getting invitation details:', error);
      throw error;
    }
  }
};

export default teamManagementAPI;

