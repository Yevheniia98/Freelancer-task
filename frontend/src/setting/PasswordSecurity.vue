<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      class="left-menu-fixed"
      :class="{ 'expanded': sidebarExpanded }"
      @update:rail="sidebarExpanded = !$event"
    />
    <SearchBar />
    
    <v-main
      :class="{ 'main-expanded': sidebarExpanded, 'main-collapsed': !sidebarExpanded }"
      class="transition-all duration-300"
      style="background-color: #fafafa;"
    >
      <v-container
        fluid
        class="pa-6 container-full-width"
      >
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-10">
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
        <div class="mb-8">
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
              :class="{'tab-active': tab === 'data-export'}"
              @click="tab = 'data-export'; navigateTo('DataExport')"
            >
              Data Export
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'log-out'}"
              @click="tab = 'log-out'; navigateTo('LogOut')"
            >
              Logout
            </div>
          </div>
        </div>
        
        <!-- Security Content -->
        <div class="security-content">
          <!-- Info Section -->
          <div class="content-card mb-8">
            <div class="security-info">
              <h3 class="section-title mb-4">
                Password & Security
              </h3>
              <div class="info-text">
                <p>Ensure your account is secure by regularly updating your password and managing your security settings.</p>
                <p>Strong passwords help protect your information from unauthorized access.</p>
              </div>
            </div>
          </div>
          
          <!-- Change Password Section -->
          <div class="content-card mb-8">
            <h3 class="section-title mb-6">
              Change Password
            </h3>
            <p class="section-description mb-6">
              To enhance your account security, please create a strong password.
            </p>
            
            <v-form
              ref="passwordFormRef"
              @submit.prevent="changePassword"
            >
              <div class="password-grid">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <div class="password-input-wrapper">
                    <v-text-field
                      v-model="passwordData.currentPassword"
                      :type="showCurrentPassword ? 'text' : 'password'"
                      placeholder="Enter current password"
                      variant="outlined"
                      hide-details
                      class="modern-input"
                      density="comfortable"
                    />
                    <button 
                      type="button"
                      class="password-toggle"
                      @click="showCurrentPassword = !showCurrentPassword"
                    >
                      <v-icon size="20">
                        {{ showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </button>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <div class="password-input-wrapper">
                    <v-text-field
                      v-model="passwordData.newPassword"
                      :type="showNewPassword ? 'text' : 'password'"
                      placeholder="Enter new password"
                      variant="outlined"
                      hide-details
                      class="modern-input"
                      density="comfortable"
                    />
                    <button 
                      type="button"
                      class="password-toggle"
                      @click="showNewPassword = !showNewPassword"
                    >
                      <v-icon size="20">
                        {{ showNewPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </button>
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Confirm New Password</label>
                  <div class="password-input-wrapper">
                    <v-text-field
                      v-model="passwordData.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      placeholder="Confirm new password"
                      variant="outlined"
                      hide-details
                      class="modern-input"
                      density="comfortable"
                    />
                    <button 
                      type="button"
                      class="password-toggle"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <v-icon size="20">
                        {{ showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                      </v-icon>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <button 
                  type="submit"
                  class="btn btn-primary"
                  :disabled="saving"
                >
                  <span v-if="saving">Changing Password...</span>
                  <span v-else>Change Password</span>
                </button>
              </div>
            </v-form>
          </div>
          
          <!-- Account Recovery Section -->
          <div class="content-card">
            <h3 class="section-title mb-6">
              Account Recovery Options
            </h3>
            <p class="section-description mb-6">
              Set up account recovery options in case you forget your password.
            </p>
            
            <v-form ref="recoveryFormRef">
              <div class="recovery-section">
                <h4 class="subsection-title mb-4">
                  Recovery Email Address
                </h4>
                <div class="form-group recovery-email">
                  <label class="form-label">Email Address</label>
                  <v-text-field
                    v-model="recoveryEmail"
                    type="email"
                    placeholder="Enter your recovery email"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
              </div>
            </v-form>
            
            <div class="mt-8">
              <button 
                class="btn btn-primary btn-large"
                :disabled="saving"
                @click="updateProfile"
              >
                <span v-if="saving">Updating...</span>
                <span v-else>Update Security Settings</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Success Notification -->
        <div
          v-if="snackbar"
          class="success-notification"
          :class="snackbarColor === 'error' ? 'error-notification' : ''"
        >
          <div class="d-flex align-center">
            <div class="success-icon mr-3">
              {{ snackbarColor === 'error' ? '!' : '✓' }}
            </div>
            <span>{{ snackbarMessage }}</span>
            <button
              class="close-btn ml-auto"
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// Setup router
const router = useRouter()

// States
const tab = ref('password')
const sidebarExpanded = ref(true)
const saving = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Form refs
const passwordFormRef = ref(null)
const recoveryFormRef = ref(null)

// Password visibility states
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const recoveryEmail = ref('john.doe@example.com')

// Set the correct tab on component mount
onMounted(() => {
  tab.value = 'password'
})

// Methods
const navigateTo = (componentName) => {
  router.push({ name: componentName })
}

const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    showSnackbar('New passwords do not match', 'error')
    return
  }
  
  if (passwordData.value.newPassword.length < 8) {
    showSnackbar('Password must be at least 8 characters long', 'error')
    return
  }
  
  try {
    saving.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSnackbar('Password changed successfully', 'success')
    // Clear form
    passwordData.value.currentPassword = ''
    passwordData.value.newPassword = ''
    passwordData.value.confirmPassword = ''
  } catch (error) {
    showSnackbar('Error changing password', 'error')
  } finally {
    saving.value = false
  }
}

const updateProfile = async () => {
  try {
    saving.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Updating profile:', {
      password: passwordData.value,
      recoveryEmail: recoveryEmail.value
    })
    showSnackbar('Security settings updated successfully', 'success')
  } catch (error) {
    showSnackbar('Error updating security settings', 'error')
  } finally {
    saving.value = false
  }
}

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
  setTimeout(() => {
    snackbar.value = false
  }, 3000)
}
</script>

<style scoped>
/* Layout - Centered content with equal margins */
.main-expanded { 
  margin-left: 30px !important; /* sidebar width (240px) + 30px margin */
  margin-right: 30px !important; 
}
.main-collapsed { 
  margin-left: 102px !important; /* collapsed sidebar width (72px) + 30px margin */
  margin-right: 30px !important; 
}
.transition-all { transition: all 0.3s ease; }

/* Container adjustments - Centered with max width */
.container-full-width {
  max-width: 1200px !important;
  margin: 0 auto !important;
  width: 100%;
  padding-left: 30px !important;
  padding-right: 30px !important;
}

/* Left Menu Override */
:deep(.left-menu-fixed) {
  background: linear-gradient(180deg, #064E47 0%, #0a5751 100%) !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  width: 72px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.left-menu-fixed.expanded) {
  width: 240px !important;
}

/* Tab Navigation */
.tab-container {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
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

/* Content width optimization */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  max-width: none;
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-description {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

/* Security Info */
.security-info .info-text p {
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.security-info .info-text p:last-child {
  margin-bottom: 0;
}

/* Password Grid */
.password-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
}

@media (min-width: 768px) {
  .password-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

/* Form Styles */
.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.password-toggle:hover {
  color: #374151;
  background: #f3f4f6;
}

.modern-input :deep(.v-field) {
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: white;
  font-size: 15px;
  width: 100%;
}

.modern-input :deep(.v-field--focused) {
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

.modern-input :deep(.v-field:hover) {
  border-color: #9ca3af;
}

.modern-input :deep(.v-field__input) {
  padding: 12px 16px;
  min-height: 48px;
  padding-right: 48px;
}

/* Recovery Section */
.recovery-section {
  max-width: 400px;
  width: 100%;
}

.recovery-email .modern-input :deep(.v-field__input) {
  padding-right: 16px;
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
}

.btn-primary {
  background: #0C9C8D;
  color: white;
}

.btn-primary:hover {
  background: #0a8a7e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(12, 156, 141, 0.3);
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
}

/* Utilities */
.gap-4 { gap: 16px; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.justify-space-between { justify-content: space-between; }
.ml-auto { margin-left: auto; }
.mr-3 { margin-right: 12px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.mb-6 { margin-bottom: 24px; }
.mb-8 { margin-bottom: 32px; }
.mb-10 { margin-bottom: 40px; }
.mt-6 { margin-top: 24px; }
.mt-8 { margin-top: 32px; }

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
  .main-expanded, .main-collapsed {
    margin-left: 0 !important;
    padding-left: 16px !important;
  }
  
  .container-full-width {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .d-flex.justify-space-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .d-flex.align-center.gap-4 {
    width: 100%;
    justify-content: space-between;
  }
  
  .tab-container {
    border-radius: 8px 8px 0 0;
  }
  
  .tab-item {
    padding: 16px 12px;
    font-size: 13px;
  }
  
  .content-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
  
  .password-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .success-notification {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}

@media (max-width: 480px) {
  .tab-item {
    padding: 12px 8px;
    font-size: 12px;
  }
  
  .content-card {
    padding: 20px 16px;
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