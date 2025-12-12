<template>
  <div class="invite-page">
    <HeaderSection :hide-get-started="true" />
    
    <div class="container">
      <div
        v-if="loading"
        class="invite-card text-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="mt-4">
          Loading invitation...
        </p>
      </div>

      <div
        v-else-if="error"
        class="invite-card text-center"
      >
        <v-icon
          size="64"
          color="error"
          class="mb-4"
        >
          mdi-alert-circle
        </v-icon>
        <h2 class="text-h5 mb-2">
          {{ error }}
        </h2>
        <p class="text-body-1 text-medium-emphasis mb-4">
          This invitation link may have expired or is invalid.
        </p>
        <v-btn
          color="primary"
          to="/login"
        >
          Go to Login
        </v-btn>
      </div>

      <div
        v-else
        class="invite-card"
      >
        <div class="invite-header">
          <v-icon
            size="64"
            color="primary"
            class="mb-4"
          >
            mdi-account-group
          </v-icon>
          <h1 class="text-h4 font-weight-bold text-center mb-2">
            You're Invited to Join!
          </h1>
          <p class="text-h6 text-center text-medium-emphasis mb-6">
            {{ inviteData.inviterName }} has invited you to collaborate on their freelance projects
          </p>
        </div>

        <div class="invite-content">
          <div class="inviter-info mb-6">
            <v-card
              variant="outlined"
              class="pa-4"
            >
              <div class="d-flex align-center">
                <v-avatar
                  size="48"
                  color="primary"
                  class="mr-3"
                >
                  <span class="text-h6">{{ getInitials(inviteData.inviterName) }}</span>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-medium">
                    {{ inviteData.inviterName }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    {{ inviteData.inviterEmail }}
                  </div>
                </div>
              </div>
            </v-card>
          </div>

          <!-- Registration Form -->
          <div
            v-if="showRegistrationForm"
            class="registration-form mb-6"
          >
            <h3 class="text-h6 mb-4">
              Create Your Account
            </h3>
            <v-form @submit.prevent="acceptInvitation">
              <v-text-field
                v-model="registrationData.email"
                label="Email"
                type="email"
                readonly
                variant="outlined"
                class="mb-3"
              />

              <v-text-field
                v-model="registrationData.firstName"
                label="First Name"
                required
                variant="outlined"
                class="mb-3"
              />

              <v-text-field
                v-model="registrationData.lastName"
                label="Last Name"
                required
                variant="outlined"
                class="mb-3"
              />

              <v-text-field
                v-model="registrationData.password"
                label="Password"
                type="password"
                required
                variant="outlined"
                hint="At least 8 characters"
                class="mb-3"
              />

              <v-text-field
                v-model="registrationData.confirmPassword"
                label="Confirm Password"
                type="password"
                required
                variant="outlined"
                class="mb-4"
              />

              <v-alert
                type="info"
                variant="tonal"
                class="mb-4"
              >
                <strong>Free Access:</strong> As an invited member, you'll get free access to the team workspace!
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="accepting"
              >
                Create Account & Join Team
              </v-btn>
            </v-form>
          </div>

          <!-- Benefits List (shown before registration form) -->
          <div
            v-else
            class="benefits mb-6"
          >
            <h3 class="text-h6 mb-3">
              What you'll get access to:
            </h3>
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">
                    mdi-check-circle
                  </v-icon>
                </template>
                <v-list-item-title>Shared project management workspace</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">
                    mdi-check-circle
                  </v-icon>
                </template>
                <v-list-item-title>Real-time team chat and collaboration</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">
                    mdi-check-circle
                  </v-icon>
                </template>
                <v-list-item-title>Task tracking and progress monitoring</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">
                    mdi-check-circle
                  </v-icon>
                </template>
                <v-list-item-title>File sharing and document management</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon color="success">
                    mdi-check-circle
                  </v-icon>
                </template>
                <v-list-item-title>✨ <strong>100% FREE access</strong> as an invited member!</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>

          <!-- Action Buttons -->
          <div
            v-if="!showRegistrationForm"
            class="actions"
          >
            <v-btn
              color="primary"
              size="large"
              block
              class="mb-3"
              @click="acceptInvitation"
            >
              <v-icon start>
                mdi-account-plus
              </v-icon>
              Accept Invitation & Create Account
            </v-btn>
            
            <div class="text-center">
              <span class="text-body-2 text-medium-emphasis">Already have an account? </span>
              <router-link
                to="/login"
                class="text-primary text-decoration-none"
              >
                Sign in instead
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterSection />
  </div>
</template>

<script>
import { teamService } from '../services/teamService.js';
import HeaderSection from '../components/HeaderSection.vue';
import FooterSection from '../components/FooterSection.vue';

export default {
  name: 'TeamInvitePage',
  components: {
    HeaderSection,
    FooterSection
  },
  data() {
    return {
      accepting: false,
      loading: true,
      token: '',
      inviteData: {
        inviterName: '',
        inviterEmail: '',
        inviteEmail: '',
        inviteeName: ''
      },
      showRegistrationForm: false,
      registrationData: {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      },
      error: null
    };
  },
  async mounted() {
    await this.loadInviteData();
  },
  methods: {
    async loadInviteData() {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.token = urlParams.get('token');
        
        if (!this.token) {
          this.error = 'No invitation token found';
          this.loading = false;
          return;
        }

        // Validate the invitation token
        const response = await teamService.validateInvitation(this.token);
        
        if (response.success) {
          this.inviteData = response.invitation;
          // Pre-fill the email from invitation
          this.registrationData.email = this.inviteData.inviteEmail;
          // Pre-fill name if available
          if (this.inviteData.inviteeName) {
            const nameParts = this.inviteData.inviteeName.split(' ');
            this.registrationData.firstName = nameParts[0] || '';
            this.registrationData.lastName = nameParts.slice(1).join(' ') || '';
          }
        } else {
          this.error = response.message || 'Invalid invitation';
        }
      } catch (error) {
        console.error('Error loading invite:', error);
        this.error = error.response?.data?.message || 'Failed to load invitation';
      } finally {
        this.loading = false;
      }
    },
    
    getInitials(name) {
      if (!name) return '?';
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },
    
    async acceptInvitation() {
      if (!this.showRegistrationForm) {
        this.showRegistrationForm = true;
        return;
      }

      // Validate form
      if (!this.registrationData.firstName || !this.registrationData.lastName) {
        alert('Please enter your first and last name');
        return;
      }

      if (!this.registrationData.password || this.registrationData.password.length < 8) {
        alert('Password must be at least 8 characters long');
        return;
      }

      if (this.registrationData.password !== this.registrationData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      this.accepting = true;
      
      try {
        const response = await teamService.acceptInvitation(
          this.token,
          this.registrationData.email,
          this.registrationData.password,
          this.registrationData.firstName,
          this.registrationData.lastName
        );

        if (response.success) {
          alert('Account created successfully! Please log in to access your team workspace.');
          this.$router.push('/login');
        } else {
          alert(response.message || 'Failed to create account');
        }
      } catch (error) {
        console.error('Error accepting invitation:', error);
        alert(error.response?.data?.message || 'Something went wrong. Please try again.');
      } finally {
        this.accepting = false;
      }
    }
  }
};
</script>

<style scoped>
.invite-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.invite-card {
  width: 100%;
  max-width: 600px;
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.invite-header {
  text-align: center;
  margin-bottom: 32px;
}

.inviter-info {
  background: linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%);
  border-radius: 12px;
}

.benefits {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
}

@media (max-width: 768px) {
  .invite-card {
    margin: 20px;
    padding: 32px 24px;
  }
  
  .container {
    padding: 20px 10px;
  }
}
</style>