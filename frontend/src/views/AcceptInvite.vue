<template>
  <div class="accept-invite-page">
    <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
      <v-card class="invite-card" max-width="600" elevation="8" rounded="xl">
        <!-- Loading State -->
        <div v-if="loading" class="text-center pa-8">
          <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
          <h3 class="mt-4">Loading invitation...</h3>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center pa-8">
          <v-icon size="64" color="error">mdi-alert-circle</v-icon>
          <h3 class="mt-4 text-error">{{ error }}</h3>
          <v-btn class="mt-4" color="primary" @click="$router.push('/')">
            Go to Homepage
          </v-btn>
        </div>

        <!-- Invitation Details -->
        <div v-else-if="invitationData" class="pa-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <v-icon size="64" color="success">mdi-account-multiple-plus</v-icon>
            <h2 class="mt-4 text-h4 font-weight-bold">Team Collaboration Invitation</h2>
          </div>

          <!-- Invitation Info -->
          <v-card class="invitation-info mb-6" flat outlined rounded="lg">
            <v-card-text class="pa-6">
              <div class="mb-4">
                <h3 class="text-h6 mb-2">Hello {{ invitationData.inviteeName }}! 👋</h3>
                <p class="text-body-1">
                  <strong>{{ invitationData.inviterName }}</strong> 
                  (<a :href="`mailto:${invitationData.inviterEmail}`">{{ invitationData.inviterEmail }}</a>) 
                  has invited you to collaborate on <strong>Freelancer Task</strong>.
                </p>
              </div>

              <div class="features mb-4">
                <h4 class="text-h6 mb-3">You'll get access to:</h4>
                <v-row>
                  <v-col cols="6">
                    <div class="feature-item d-flex align-center mb-2">
                      <v-icon class="mr-3" color="success">mdi-view-dashboard</v-icon>
                      <span>Shared Projects</span>
                    </div>
                    <div class="feature-item d-flex align-center mb-2">
                      <v-icon class="mr-3" color="success">mdi-chat</v-icon>
                      <span>Team Chat</span>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div class="feature-item d-flex align-center mb-2">
                      <v-icon class="mr-3" color="success">mdi-chart-line</v-icon>
                      <span>Progress Tracking</span>
                    </div>
                    <div class="feature-item d-flex align-center mb-2">
                      <v-icon class="mr-3" color="success">mdi-file-document</v-icon>
                      <span>File Sharing</span>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-alert type="info" variant="tonal" class="mb-4">
                <strong>Note:</strong> If you don't have an account yet, you'll be taken to the account creation page first. 
                Once your account is created, you'll automatically get access to {{ invitationData.inviterName }}'s projects and chat.
              </v-alert>

              <div class="expiry-info text-caption text-medium-emphasis">
                ⏰ This invitation expires on {{ formatDate(invitationData.expiresAt) }}
              </div>
            </v-card-text>
          </v-card>

          <!-- Accept Button -->
          <div class="text-center">
            <v-btn 
              size="large" 
              color="success" 
              @click="acceptInvitation" 
              :loading="accepting"
              :disabled="accepting"
              rounded="lg"
              elevation="2"
            >
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Accept Invitation
            </v-btn>
          </div>

          <!-- Already have account hint -->
          <div class="text-center mt-4">
            <p class="text-caption">
              Already have an account? 
              <router-link to="/login" class="text-primary">Sign in here</router-link>
            </p>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="accepted" class="text-center pa-8">
          <v-icon size="64" color="success">mdi-check-circle</v-icon>
          <h3 class="mt-4 text-success">Invitation Accepted!</h3>
          <p class="mt-2">You now have access to the team's projects and chat.</p>
          <v-btn class="mt-4" color="primary" @click="$router.push('/dashboard')">
            Go to Dashboard
          </v-btn>
        </div>
      </v-card>
    </v-container>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" timeout="5000">
      <v-icon class="mr-2">mdi-check-circle</v-icon>
      {{ successMessage }}
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar v-model="showErrorSnackbar" color="error" timeout="7000">
      <v-icon class="mr-2">mdi-alert-circle</v-icon>
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import teamManagementAPI from '../services/teamManagementApi.service.js'
import { apiUtils } from '../services/api.js'

export default {
  name: 'AcceptInvite',
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const loading = ref(true)
    const accepting = ref(false)
    const accepted = ref(false)
    const error = ref('')
    const invitationData = ref(null)
    const successMessage = ref('')
    const errorMessage = ref('')
    const showSuccessSnackbar = ref(false)
    const showErrorSnackbar = ref(false)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const loadInvitationDetails = async () => {
      try {
        loading.value = true
        error.value = ''
        
        const token = route.query.token
        if (!token) {
          error.value = 'Invalid invitation link - missing token'
          return
        }

        const response = await teamManagementAPI.getInvitationDetails(token)
        if (response.success) {
          invitationData.value = response.data
        } else {
          error.value = response.message || 'Failed to load invitation details'
        }

      } catch (err) {
        console.error('Error loading invitation:', err)
        error.value = err.message || 'Failed to load invitation details'
      } finally {
        loading.value = false
      }
    }

    const acceptInvitation = async () => {
      try {
        accepting.value = true
        errorMessage.value = ''
        
        const token = route.query.token
        if (!token) {
          throw new Error('Missing invitation token')
        }

        // Check if user is logged in
        const isAuthenticated = apiUtils.getToken()
        
        if (!isAuthenticated) {
          // Redirect to create account with invite info
          const createAccountQuery = {
            invite: 'true',
            token: token,
            email: invitationData.value.inviteEmail,
            name: invitationData.value.inviteeName
          }
          
          router.push({ 
            path: '/create-account', 
            query: createAccountQuery 
          })
          return
        }

        // User is authenticated, try to accept invitation
        const response = await teamManagementAPI.acceptInvitation(token)
        
        if (response.success) {
          if (response.requiresAccount) {
            // Should not happen if user is authenticated, but handle just in case
            router.push({ 
              path: '/create-account', 
              query: { 
                invite: 'true', 
                token: token,
                email: response.data.inviteEmail,
                name: response.data.inviteeName
              } 
            })
          } else {
            // Successfully accepted
            accepted.value = true
            successMessage.value = 'Welcome to the team! You now have access to shared projects and chat.'
            showSuccessSnackbar.value = true
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 3000)
          }
        } else {
          throw new Error(response.message || 'Failed to accept invitation')
        }

      } catch (err) {
        console.error('Error accepting invitation:', err)
        errorMessage.value = err.message || 'Failed to accept invitation'
        showErrorSnackbar.value = true
      } finally {
        accepting.value = false
      }
    }

    onMounted(() => {
      loadInvitationDetails()
    })

    return {
      loading,
      accepting,
      accepted,
      error,
      invitationData,
      successMessage,
      errorMessage,
      showSuccessSnackbar,
      showErrorSnackbar,
      formatDate,
      acceptInvitation
    }
  }
}
</script>

<style scoped>
.accept-invite-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.invite-card {
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.invitation-info {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e9ecef;
}

.feature-item {
  font-size: 14px;
}

.expiry-info {
  border-top: 1px solid #e9ecef;
  padding-top: 16px;
  margin-top: 16px;
}

.v-btn {
  text-transform: none;
  font-weight: 600;
}

.text-primary {
  color: #064E47 !important;
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}
</style>

