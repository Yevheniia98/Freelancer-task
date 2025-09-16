import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3030/api';

class MeetingInvitationApiService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${API_BASE_URL}/meeting-invitations`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests (temporarily disabled for testing)
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && false) { // Temporarily disabled
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Meeting invitation API error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Send meeting invitations to multiple recipients
   * @param {Array} recipients - Array of {email, name?} objects
   * @param {Object} meetingData - Meeting information
   * @returns {Promise<Object>} API response
   */
  async sendMultipleInvitations(recipients, meetingData) {
    try {
      const response = await this.apiClient.post('/send-multiple', {
        recipients,
        meetingData
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to send meeting invitations'
      );
    }
  }

  /**
   * Send a single meeting invitation
   * @param {Object} invitationData - Complete invitation data
   * @returns {Promise<Object>} API response
   */
  async sendSingleInvitation(invitationData) {
    try {
      const response = await this.apiClient.post('/send-single', invitationData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to send meeting invitation'
      );
    }
  }

  /**
   * Helper method to format meeting data for API
   * @param {Object} event - Meeting event object
   * @param {string} organizerName - Organizer's name
   * @param {string} organizerEmail - Organizer's email
   * @returns {Object} Formatted meeting data
   */
  formatMeetingData(event, organizerName, organizerEmail) {
    return {
      title: event.title,
      description: event.description || null,
      date: event.date, // Should be ISO date string
      startTime: event.timeFrom,
      endTime: event.timeTo,
      meetingLink: event.meetingLink || null,
      platform: event.platform || null,
      organizerName,
      organizerEmail
    };
  }

  /**
   * Helper method to format recipients from app users and email invitees
   * @param {Array} appUsers - Array of app user objects with name and email
   * @param {Array} emailInvitees - Array of email strings
   * @returns {Array} Formatted recipients array
   */
  formatRecipients(appUsers = [], emailInvitees = []) {
    const recipients = [];

    // Add app users (they have names)
    appUsers.forEach(user => {
      recipients.push({
        email: user.email,
        name: user.name
      });
    });

    // Add email invitees (no names)
    emailInvitees.forEach(email => {
      recipients.push({
        email: email
      });
    });

    return recipients;
  }

  /**
   * Send invitations for a meeting event
   * @param {Object} event - Meeting event object
   * @param {Array} appUsers - Array of app users to invite
   * @param {Array} emailInvitees - Array of email addresses to invite
   * @param {string} organizerName - Organizer's name
   * @param {string} organizerEmail - Organizer's email
   * @returns {Promise<Object>} API response with results
   */
  async sendMeetingInvitations(event, appUsers = [], emailInvitees = [], organizerName, organizerEmail) {
    try {
      console.log('🚀 MeetingInvitationApiService.sendMeetingInvitations called with:', {
        event,
        appUsers,
        emailInvitees,
        organizerName,
        organizerEmail
      });

      const recipients = this.formatRecipients(appUsers, emailInvitees);
      
      console.log('📧 Formatted recipients:', recipients);
      
      if (recipients.length === 0) {
        console.log('⚠️ No recipients provided for meeting invitations');
        throw new Error('No recipients provided for meeting invitations');
      }

      const meetingData = this.formatMeetingData(event, organizerName, organizerEmail);
      
      console.log('📅 Formatted meeting data:', meetingData);
      console.log('🌐 About to call API endpoint...');
      
      const result = await this.sendMultipleInvitations(recipients, meetingData);
      
      console.log('✅ Meeting invitations sent successfully:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to send meeting invitations:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Export singleton instance
export const meetingInvitationApi = new MeetingInvitationApiService();
export default meetingInvitationApi;
