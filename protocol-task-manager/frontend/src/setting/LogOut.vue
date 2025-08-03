<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      @update:rail="sidebarExpanded = !$event"
    />
    <SearchBar />
    
    <v-main
      :class="{ 'ml-60': sidebarExpanded, 'ml-14': !sidebarExpanded }"
      class="transition-all duration-300"
      style="background-color: #fafafa; padding-left: 24px;"
    >
      <v-container
        fluid
        class="pa-6 container-full-width"
      >
        <!-- Header -->
        <div class="header-section">
          <div>
            <h1
              class="text-h3 font-weight-bold mb-3"
              style="color: #1a1a1a;"
            >
              Account Settings
            </h1>
            <p
              class="text-body-1"
              style="color: #6b7280;"
            >
              Manage your profile information and account preferences
            </p>
          </div>
        </div>
        
        <!-- Clean Tab Navigation -->
        <div class="tab-navigation">
          <div class="tab-container">
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'profile'}"
              @click="tab = 'profile'; navigateTo('AccountSetting')"
            >
              Profile
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'password'}"
              @click="tab = 'password'; navigateTo('PasswordSecurity')"
            >
              Security
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'notification'}"
              @click="tab = 'notification'; navigateTo('NotificationPage')"
            >
              Notifications
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'export'}"
              @click="tab = 'export'; navigateTo('DataExport')"
            >
              Data Export
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'delete'}"
              @click="tab = 'delete'; showDeleteSection()"
            >
              Delete Account
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'logout'}"
              @click="tab = 'logout'; showLogoutSection()"
            >
              Logout
            </div>
          </div>
        </div>
        
        <!-- Logout Content -->
        <div
          v-if="currentSection === 'logout'"
          class="logout-content"
        >
          <!-- Logout Confirmation Card -->
          <div class="content-card logout-card">
            <div class="logout-confirmation">
              <!-- Logout Icon -->
              <div class="logout-icon-container">
                <div class="logout-icon">
                  <v-icon
                    color="white"
                    size="32"
                  >
                    mdi-logout
                  </v-icon>
                </div>
              </div>
              
              <!-- Confirmation Message -->
              <h3 class="logout-title">
                Are You Sure You Want to Log Out?
              </h3>
              
              <p class="logout-description">
                Logging out will end your current session, and you'll need to log in again to access your account. Any unsaved changes may be lost.
              </p>
              
              <!-- Action Buttons -->
              <div class="logout-actions">
                <button 
                  class="btn btn-danger btn-large"
                  :disabled="loggingOut"
                  @click="logout"
                >
                  <v-icon
                    class="mr-2"
                    size="16"
                  >
                    mdi-logout
                  </v-icon>
                  <span v-if="loggingOut">Logging Out...</span>
                  <span v-else>Yes, Log Out</span>
                </button>
                
                <button 
                  class="btn btn-secondary btn-large"
                  :disabled="loggingOut"
                  @click="cancel"
                >
                  <v-icon
                    class="mr-2"
                    size="16"
                  >
                    mdi-arrow-left
                  </v-icon>
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <!-- Security Info Card -->
          <div class="content-card security-info-card">
            <h4 class="info-title">
              Security Tips
            </h4>
            
            <div class="security-tips">
              <div class="tip-item">
                <div class="tip-icon">
                  <v-icon
                    color="#0C9C8D"
                    size="18"
                  >
                    mdi-shield-check
                  </v-icon>
                </div>
                <div class="tip-content">
                  <p class="tip-text">
                    Always log out when using shared or public computers
                  </p>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">
                  <v-icon
                    color="#0C9C8D"
                    size="18"
                  >
                    mdi-lock
                  </v-icon>
                </div>
                <div class="tip-content">
                  <p class="tip-text">
                    Make sure to save your work before logging out
                  </p>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">
                  <v-icon
                    color="#0C9C8D"
                    size="18"
                  >
                    mdi-cellphone-check
                  </v-icon>
                </div>
                <div class="tip-content">
                  <p class="tip-text">
                    You can stay logged in on your personal devices
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete Account Content -->
        <div
          v-if="currentSection === 'delete'"
          class="delete-content"
        >
          <!-- Delete Account Warning Card -->
          <div class="content-card delete-card">
            <div class="delete-confirmation">
              <!-- Delete Icon -->
              <div class="delete-icon-container">
                <div class="delete-icon">
                  <v-icon
                    color="white"
                    size="32"
                  >
                    mdi-account-remove
                  </v-icon>
                </div>
              </div>
              
              <!-- Warning Message -->
              <h3 class="delete-title">
                Delete Your Account
              </h3>
              
              <p class="delete-description">
                <strong>This action cannot be undone.</strong> Deleting your account will permanently remove all your data, including your profile, settings, files, and account history. You will not be able to recover this information.
              </p>

              <!-- Password Confirmation -->
              <div class="password-confirmation">
                <label class="password-label">Enter your password to confirm:</label>
                <input 
                  v-model="confirmPassword" 
                  type="password"
                  class="password-input"
                  placeholder="Enter your current password"
                  :disabled="deletingAccount"
                >
              </div>

              <!-- Type DELETE Confirmation -->
              <div class="type-confirmation">
                <label class="type-label">Type <strong>DELETE</strong> to confirm:</label>
                <input 
                  v-model="deleteConfirmation" 
                  type="text"
                  class="type-input"
                  placeholder="Type DELETE here"
                  :disabled="deletingAccount"
                >
              </div>
              
              <!-- Action Buttons -->
              <div class="delete-actions">
                <button 
                  class="btn btn-danger-delete btn-large"
                  :disabled="!canDeleteAccount || deletingAccount"
                  @click="deleteAccount"
                >
                  <v-icon
                    class="mr-2"
                    size="16"
                  >
                    mdi-account-remove
                  </v-icon>
                  <span v-if="deletingAccount">Deleting Account...</span>
                  <span v-else>Delete My Account</span>
                </button>
                
                <button 
                  class="btn btn-secondary btn-large"
                  :disabled="deletingAccount"
                  @click="cancelDelete"
                >
                  <v-icon
                    class="mr-2"
                    size="16"
                  >
                    mdi-arrow-left
                  </v-icon>
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <!-- Data Deletion Info Card -->
          <div class="content-card data-info-card">
            <h4 class="info-title">
              What Will Be Deleted
            </h4>
            
            <div class="deletion-info">
              <div class="info-item">
                <div class="info-icon">
                  <v-icon
                    color="#dc2626"
                    size="18"
                  >
                    mdi-account
                  </v-icon>
                </div>
                <div class="info-content">
                  <p class="info-text">
                    Your profile information and personal data
                  </p>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <v-icon
                    color="#dc2626"
                    size="18"
                  >
                    mdi-file-multiple
                  </v-icon>
                </div>
                <div class="info-content">
                  <p class="info-text">
                    All uploaded files and documents
                  </p>
                </div>
              </div>
              
              <div class="info-item">
                <div class="info-icon">
                  <v-icon
                    color="#dc2626"
                    size="18"
                  >
                    mdi-history
                  </v-icon>
                </div>
                <div class="info-content">
                  <p class="info-text">
                    Your account history and activity logs
                  </p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <v-icon
                    color="#dc2626"
                    size="18"
                  >
                    mdi-cog
                  </v-icon>
                </div>
                <div class="info-content">
                  <p class="info-text">
                    All settings and preferences
                  </p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon">
                  <v-icon
                    color="#dc2626"
                    size="18"
                  >
                    mdi-email
                  </v-icon>
                </div>
                <div class="info-content">
                  <p class="info-text">
                    Associated email address and notifications
                  </p>
                </div>
              </div>
            </div>

            <div class="deletion-timeline">
              <h5 class="timeline-title">
                Deletion Timeline
              </h5>
              <p class="timeline-text">
                Your account will be immediately deactivated. All data will be permanently deleted within 30 days and cannot be recovered after this period.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Success/Error Notification -->
        <div
          v-if="snackbar"
          class="success-notification"
          :class="snackbarColor === 'error' ? 'error-notification' : ''"
        >
          <div class="notification-inner">
            <div class="success-icon">
              {{ snackbarColor === 'error' ? '!' : '✓' }}
            </div>
            <span>{{ snackbarMessage }}</span>
            <button
              class="close-btn"
              @click="snackbar = false"
            >
              ×
            </button>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api.js'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// Setup router
const router = useRouter()

// States
const tab = ref('logout')
const currentSection = ref('logout')
const sidebarExpanded = ref(true)
const loggingOut = ref(false)
const deletingAccount = ref(false)
const confirmPassword = ref('')
const deleteConfirmation = ref('')
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Computed properties
const canDeleteAccount = computed(() => {
  return confirmPassword.value.length > 0 && deleteConfirmation.value === 'DELETE'
})

// Set the correct tab on component mount
onMounted(() => {
  tab.value = 'logout'
  currentSection.value = 'logout'
})

// Methods
const navigateTo = (componentName) => {
  router.push({ name: componentName })
}

const showLogoutSection = () => {
  currentSection.value = 'logout'
}

const showDeleteSection = () => {
  currentSection.value = 'delete'
  // Reset form fields when switching to delete section
  confirmPassword.value = ''
  deleteConfirmation.value = ''
}

const logout = async () => {
  loggingOut.value = true
  try {
    console.log('Logging out...')
    
    // Call logout API to clear server-side session
    authAPI.logout()
    
    // Clear all user data from localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    // Clear session storage
    sessionStorage.clear()
    
    // Show success message
    showSnackbar('You have been logged out successfully', 'success')
    
    // Navigate to landing page and prevent back button issues
    setTimeout(() => {
      router.replace('/')
      // Force reload to ensure complete state reset
      window.location.href = '/'
    }, 1000)
    
  } catch (error) {
    console.error('Logout error:', error)
    // Even if logout API fails, clear local data and redirect
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    sessionStorage.clear()
    showSnackbar('Logged out successfully', 'success')
    setTimeout(() => {
      window.location.href = '/'
    }, 1000)
  } finally {
    loggingOut.value = false
  }
}

const deleteAccount = async () => {
  if (!canDeleteAccount.value) {
    showSnackbar('Please complete all required fields to delete your account.', 'error')
    return
  }

  deletingAccount.value = true
  try {
    // Simulate account deletion process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Implement account deletion logic here
    console.log('Deleting account...')
    
    // Example deletion implementation:
    // 1. Verify password with backend
    // const passwordValid = await api.verifyPassword(confirmPassword.value)
    // if (!passwordValid) {
    //   throw new Error('Invalid password')
    // }
    
    // 2. Send deletion request to backend
    // await api.deleteAccount({
    //   password: confirmPassword.value,
    //   confirmation: deleteConfirmation.value
    // })
    
    // 3. Clear all local data
    localStorage.clear()
    sessionStorage.clear()
    
    // 4. Clear any cached data (if using service workers, etc.)
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    // 5. Show success message
    showSnackbar('Your account has been successfully deleted. You will be redirected shortly.', 'success')
    
    // 6. Navigate to a goodbye page or login after a delay
    setTimeout(() => {
      router.push({ name: 'AccountDeleted' }) // or Login
    }, 2000)
    
  } catch (error) {
    console.error('Account deletion error:', error)
    if (error.message === 'Invalid password') {
      showSnackbar('Invalid password. Please try again.', 'error')
    } else {
      showSnackbar('Error deleting account. Please try again or contact support.', 'error')
    }
  } finally {
    deletingAccount.value = false
  }
}

const cancel = () => {
  // Navigate back to the previous page or dashboard
  router.push({ name: 'Dashboard' })
}

const cancelDelete = () => {
  // Reset form and go back to logout section
  confirmPassword.value = ''
  deleteConfirmation.value = ''
  tab.value = 'logout'
  currentSection.value = 'logout'
}

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
  setTimeout(() => {
    snackbar.value = false
  }, 4000)
}
</script>

<style scoped>
/* Layout */
.ml-60 { margin-left: 240px; }
.ml-14 { margin-left: 56px; }
.transition-all { transition: all 0.3s ease; }

.container-full-width { 
  max-width: none !important; 
  width: 100%;
}

/* Header Section */
.header-section {
  margin-bottom: 24px;
}

.header-section h1 {
  margin-bottom: 8px;
}

.header-section p {
  margin: 0;
}

/* Tab Navigation */
.tab-navigation {
  margin-bottom: 20px;
}

.tab-container {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  padding: 20px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: none;
  background: white;
  position: relative;
}

.tab-item:hover {
  color: #0C9C8D;
  background: #f9fafb;
}

.tab-active {
  color: #0C9C8D !important;
  background: #f0fdfa !important;
  border-bottom: 3px solid #0C9C8D;
}

/* Content Cards */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  width: 100%;
}

/* Logout Content */
.logout-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
  width: 100%;
}

/* Delete Content */
.delete-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
  width: 100%;
}

@media (max-width: 1024px) {
  .logout-content,
  .delete-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Logout Card */
.logout-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
}

.logout-confirmation {
  text-align: center;
  max-width: 480px;
  width: 100%;
}

.logout-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.logout-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

.logout-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.logout-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 32px 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.logout-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Delete Account Styles */
.delete-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 500px;
}

.delete-confirmation {
  text-align: center;
  max-width: 520px;
  width: 100%;
}

.delete-icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.delete-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
}

.delete-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.delete-description {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 32px 0;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

.password-confirmation,
.type-confirmation {
  margin-bottom: 24px;
  text-align: left;
}

.password-label,
.type-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.password-input,
.type-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.password-input:focus,
.type-input:focus {
  outline: none;
  border-color: #0C9C8D;
}

.password-input:disabled,
.type-input:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.delete-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Security Info Card */
.security-info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.data-info-card {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.info-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.security-tips,
.deletion-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item,
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.tip-icon,
.info-icon {
  width: 32px;
  height: 32px;
  background: rgba(12, 156, 141, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  background: rgba(220, 38, 38, 0.1);
}

.tip-content,
.info-content {
  flex: 1;
}

.tip-text,
.info-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.deletion-timeline {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #fecaca;
}

.timeline-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.timeline-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-width: 140px;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-danger-delete {
  background: #dc2626;
  color: white;
}

.btn-danger-delete:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #4b5563;
}

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Success/Error Notification */
.success-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #10b981;
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.error-notification {
  background: #ef4444;
}

.notification-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.success-icon {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Utilities */
.mr-2 { margin-right: 8px; }

/* Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .ml-60, .ml-14 {
    margin-left: 0;
  }
  
  v-main {
    padding-left: 0 !important;
  }
  
  .tab-container {
    border-radius: 8px 8px 0 0;
  }
  
  .tab-item {
    padding: 16px 12px;
    font-size: 13px;
  }
  
  .content-card {
    padding: 20px;
    border-radius: 12px;
  }
  
  .logout-card,
  .delete-card {
    min-height: 280px;
  }
  
  .logout-actions,
  .delete-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 280px;
  }
  
  .success-notification {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}

@media (max-width: 480px) {
  .header-section {
    margin-bottom: 20px;
  }
  
  .tab-navigation {
    margin-bottom: 16px;
  }
  
  .logout-content,
  .delete-content {
    gap: 16px;
  }
  
  .tab-item {
    padding: 12px 8px;
    font-size: 12px;
  }
  
  .content-card {
    padding: 16px;
  }
  
  .logout-title,
  .delete-title {
    font-size: 20px;
  }
  
  .logout-description,
  .delete-description {
    font-size: 15px;
  }
  
  .logout-icon,
  .delete-icon {
    width: 64px;
    height: 64px;
  }
  
  .logout-icon-container,
  .delete-icon-container {
    margin-bottom: 20px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .btn-large {
    padding: 14px 28px;
    font-size: 15px;
  }
}
</style>