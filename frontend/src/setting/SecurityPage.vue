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
        <div class="mb-10">
          <h1
            class="text-h3 font-weight-bold mb-3"
            style="color: #1a1a1a;"
          >
            Security & Privacy
          </h1>
          <p
            class="text-body-1"
            style="color: #6b7280;"
          >
            Manage your account security, connected devices, and privacy settings
          </p>
        </div>
        
        <!-- Connected Devices Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Connected Devices
          </h3>
          <p class="section-description mb-8">
            Monitor all devices currently logged into your account. You can sign out of any device remotely to enhance your account security.
          </p>
          
          <div class="devices-section">
            <h4 class="subsection-title mb-4">
              Active Sessions
            </h4>
            
            <div class="devices-table">
              <div class="table-header">
                <div class="table-cell">
                  Device
                </div>
                <div class="table-cell">
                  Location
                </div>
                <div class="table-cell">
                  Last Active
                </div>
                <div class="table-cell">
                  Actions
                </div>
              </div>
              
              <div 
                v-for="(device, index) in activeDevices"
                :key="index"
                class="table-row"
              >
                <div class="table-cell">
                  <div class="device-info">
                    <div class="device-icon">
                      <v-icon
                        :color="getDeviceIconColor(device.name)"
                        size="20"
                      >
                        {{ getDeviceIcon(device.name) }}
                      </v-icon>
                    </div>
                    <div class="device-details">
                      <span class="device-name">{{ device.name }}</span>
                      <span class="device-type">{{ getDeviceType(device.name) }}</span>
                    </div>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="location-info">
                    <v-icon
                      color="#6b7280"
                      size="16"
                      class="mr-2"
                    >
                      mdi-map-marker
                    </v-icon>
                    {{ device.location }}
                  </div>
                </div>
                <div class="table-cell">
                  <span class="last-active">{{ device.lastActive }}</span>
                </div>
                <div class="table-cell">
                  <button 
                    class="btn btn-danger-text"
                    @click="signOutDevice(device)"
                  >
                    <v-icon
                      size="16"
                      class="mr-2"
                    >
                      mdi-logout
                    </v-icon>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- App Permissions Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            App Permissions & Integrations
          </h3>
          <p class="section-description mb-8">
            Manage third-party applications that have access to your account. Review and revoke permissions as needed to maintain your privacy.
          </p>
          
          <div class="apps-section">
            <h4 class="subsection-title mb-4">
              Connected Third-Party Apps
            </h4>
            
            <div class="apps-table">
              <div class="table-header">
                <div class="table-cell">
                  App Name
                </div>
                <div class="table-cell">
                  Access Granted
                </div>
                <div class="table-cell">
                  Connected Since
                </div>
                <div class="table-cell">
                  Actions
                </div>
              </div>
              
              <div 
                v-for="(app, index) in connectedApps"
                :key="index"
                class="table-row"
              >
                <div class="table-cell">
                  <div class="app-info">
                    <div class="app-icon">
                      <v-icon
                        :color="getAppIconColor(app.name)"
                        size="20"
                      >
                        {{ getAppIcon(app.name) }}
                      </v-icon>
                    </div>
                    <span class="app-name">{{ app.name }}</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="access-info">
                    <v-chip
                      size="small"
                      variant="flat"
                      :color="getAccessChipColor(app.access)"
                    >
                      {{ app.access }}
                    </v-chip>
                  </div>
                </div>
                <div class="table-cell">
                  <span class="connected-date">{{ app.connectedSince }}</span>
                </div>
                <div class="table-cell">
                  <button 
                    class="btn btn-danger-text"
                    @click="revokeAccess(app)"
                  >
                    <v-icon
                      size="16"
                      class="mr-2"
                    >
                      mdi-cancel
                    </v-icon>
                    Revoke Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security Notifications Section -->
        <div class="content-card">
          <h3 class="section-title mb-6">
            Security Notifications
          </h3>
          <p class="section-description mb-8">
            Configure alerts for security-related activities to stay informed about your account safety.
          </p>
          
          <div class="security-notifications">
            <h4 class="subsection-title mb-4">
              Email Alerts for Suspicious Activity
            </h4>
            
            <div class="notification-setting">
              <div class="setting-content">
                <div class="setting-icon">
                  <div class="icon-wrapper security">
                    <v-icon
                      color="white"
                      size="20"
                    >
                      mdi-shield-alert
                    </v-icon>
                  </div>
                </div>
                <div class="setting-info">
                  <h5 class="setting-title">
                    Security Alert Notifications
                  </h5>
                  <p class="setting-description">
                    Receive email notifications about suspicious login attempts, password changes, and other security-related activities on your account.
                  </p>
                </div>
              </div>
              <div class="setting-toggle">
                <button 
                  class="toggle-btn"
                  :class="{'toggle-active': securityNotifications}"
                  @click="toggleSecurityNotifications"
                >
                  <span class="toggle-slider" />
                </button>
              </div>
            </div>
          </div>
          
          <div class="mt-8">
            <button 
              class="btn btn-primary btn-large"
              :disabled="saving"
              @click="saveSecuritySettings"
            >
              <v-icon
                class="mr-2"
                size="16"
              >
                mdi-shield-check
              </v-icon>
              <span v-if="saving">Saving Settings...</span>
              <span v-else>Save Security Settings</span>
            </button>
          </div>
        </div>
        
        <!-- Sign Out Device Dialog -->
        <v-dialog
          v-model="confirmSignOutDialog"
          max-width="500"
          persistent
        >
          <v-card class="security-dialog">
            <div class="dialog-header">
              <div class="warning-icon">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-logout
                </v-icon>
              </div>
              <h3 class="dialog-title">
                Sign Out Device
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="dialog-message">
                Are you sure you want to sign out of <strong>{{ selectedDevice?.name }}</strong> in <strong>{{ selectedDevice?.location }}</strong>?
              </p>
              <div class="warning-note">
                <v-icon
                  color="#f59e0b"
                  size="20"
                  class="mr-3"
                >
                  mdi-information
                </v-icon>
                <span>This action will immediately end the session on that device.</span>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="confirmSignOutDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-danger"
                @click="confirmSignOut"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-logout
                </v-icon>
                Sign Out Device
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Revoke Access Dialog -->
        <v-dialog
          v-model="confirmRevokeDialog"
          max-width="500"
          persistent
        >
          <v-card class="security-dialog">
            <div class="dialog-header">
              <div class="warning-icon revoke">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-cancel
                </v-icon>
              </div>
              <h3 class="dialog-title">
                Revoke Access
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="dialog-message">
                Are you sure you want to revoke access for <strong>{{ selectedApp?.name }}</strong>?
              </p>
              <div class="warning-note">
                <v-icon
                  color="#f59e0b"
                  size="20"
                  class="mr-3"
                >
                  mdi-information
                </v-icon>
                <span>This app will no longer have access to your {{ selectedApp?.access.toLowerCase() }}.</span>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="confirmRevokeDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-danger"
                @click="confirmRevoke"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-cancel
                </v-icon>
                Revoke Access
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Success Notification -->
        <div
          v-if="successSnackbar"
          class="success-notification"
        >
          <div class="d-flex align-center">
            <div class="success-icon mr-3">
              ✓
            </div>
            <span>{{ snackbarMessage }}</span>
            <button
              class="close-btn ml-auto"
              @click="successSnackbar = false"
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
import { ref,  } from 'vue'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// States
const sidebarExpanded = ref(true)
const saving = ref(false)
const securityNotifications = ref(true)

// Dialog states
const confirmSignOutDialog = ref(false)
const confirmRevokeDialog = ref(false)
const selectedDevice = ref(null)
const selectedApp = ref(null)

// Snackbar
const successSnackbar = ref(false)
const snackbarMessage = ref('')

// Data
const activeDevices = ref([
  {
    id: 1,
    name: 'MacBook Pro',
    location: 'New York, USA',
    lastActive: 'Today, 11:24 AM'
  },
  {
    id: 2,
    name: 'iPhone 12',
    location: 'Los Angeles, USA',
    lastActive: 'Yesterday, 8:15 PM'
  },
  {
    id: 3,
    name: 'Windows Laptop',
    location: 'Berlin, Germany',
    lastActive: '3 Days Ago, 6:30 PM'
  }
])

const connectedApps = ref([
  {
    id: 1,
    name: 'Google',
    access: 'Profile & Files',
    connectedSince: 'Jan 5, 2024'
  },
  {
    id: 2,
    name: 'Slack',
    access: 'Tasks & Notifications',
    connectedSince: 'Mar 18, 2024'
  },
  {
    id: 3,
    name: 'Dropbox',
    access: 'Files',
    connectedSince: 'Sep 2, 2023'
  }
])

// Methods
const getDeviceIcon = (deviceName) => {
  if (deviceName.includes('MacBook') || deviceName.includes('Laptop')) return 'mdi-laptop'
  if (deviceName.includes('iPhone') || deviceName.includes('Phone')) return 'mdi-cellphone'
  if (deviceName.includes('iPad')) return 'mdi-tablet'
  return 'mdi-monitor'
}

const getDeviceIconColor = (deviceName) => {
  if (deviceName.includes('MacBook')) return '#0C9C8D'
  if (deviceName.includes('iPhone')) return '#3b82f6'
  if (deviceName.includes('Windows')) return '#ef4444'
  return '#6b7280'
}

const getDeviceType = (deviceName) => {
  if (deviceName.includes('MacBook')) return 'macOS'
  if (deviceName.includes('iPhone')) return 'iOS'
  if (deviceName.includes('Windows')) return 'Windows'
  return 'Unknown'
}

const getAppIcon = (appName) => {
  if (appName === 'Google') return 'mdi-google'
  if (appName === 'Slack') return 'mdi-slack'
  if (appName === 'Dropbox') return 'mdi-dropbox'
  return 'mdi-application'
}

const getAppIconColor = (appName) => {
  if (appName === 'Google') return '#4285f4'
  if (appName === 'Slack') return '#4a154b'
  if (appName === 'Dropbox') return '#0061ff'
  return '#6b7280'
}

const getAccessChipColor = (access) => {
  if (access.includes('Profile')) return 'primary'
  if (access.includes('Files')) return 'info'
  if (access.includes('Tasks')) return 'success'
  return 'secondary'
}

const signOutDevice = (device) => {
  selectedDevice.value = device
  confirmSignOutDialog.value = true
}

const confirmSignOut = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    activeDevices.value = activeDevices.value.filter(device => device.id !== selectedDevice.value.id)
    
    confirmSignOutDialog.value = false
    snackbarMessage.value = `Successfully signed out of ${selectedDevice.value.name}`
    successSnackbar.value = true
    selectedDevice.value = null
  } catch (error) {
    console.error('Error signing out device:', error)
  }
}

const revokeAccess = (app) => {
  selectedApp.value = app
  confirmRevokeDialog.value = true
}

const confirmRevoke = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    connectedApps.value = connectedApps.value.filter(app => app.id !== selectedApp.value.id)
    
    confirmRevokeDialog.value = false
    snackbarMessage.value = `Successfully revoked access for ${selectedApp.value.name}`
    successSnackbar.value = true
    selectedApp.value = null
  } catch (error) {
    console.error('Error revoking access:', error)
  }
}

const toggleSecurityNotifications = () => {
  securityNotifications.value = !securityNotifications.value
  console.log('Security notifications:', securityNotifications.value)
}

const saveSecuritySettings = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Saving security settings:', {
      securityNotifications: securityNotifications.value
    })
    
    snackbarMessage.value = 'Security settings saved successfully!'
    successSnackbar.value = true
  } catch (error) {
    console.error('Error saving security settings:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Layout *//* Layout - Centered content with equal margins */
.ml-60 { 
  margin-left: 30px !important; /* sidebar width (240px) + 30px margin */
  margin-right: 30px !important; 
}
.ml-14 { 
  margin-left: 102px !important; /* collapsed sidebar width (72px) + 30px margin */
  margin-right: 30px !important; 
}
.transition-all { transition: all 0.3s ease; }

/* Container adjustments */
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

/* Tables */
.devices-table,
.apps-table {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
  background: #f8fafc;
  border-bottom: 1px solid #f3f4f6;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.table-header .table-cell {
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.table-row .table-cell {
  color: #4b5563;
}

/* Device Info */
.device-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-icon {
  width: 36px;
  height: 36px;
  background: rgba(12, 156, 141, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-details {
  display: flex;
  flex-direction: column;
}

.device-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.device-type {
  font-size: 12px;
  color: #6b7280;
}

.location-info {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.last-active {
  color: #4b5563;
}

/* App Info */
.app-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-icon {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-name {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.access-info {
  display: flex;
  align-items: center;
}

.connected-date {
  color: #4b5563;
}

/* Security Notifications */
.notification-setting {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.setting-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.setting-icon {
  margin-right: 16px;
}

.icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.security {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.setting-info {
  flex: 1;
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.setting-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Toggle Switch */
.setting-toggle {
  margin-left: 16px;
}

.toggle-btn {
  position: relative;
  width: 52px;
  height: 28px;
  background: #d1d5db;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  outline: none;
}

.toggle-btn:hover {
  background: #9ca3af;
}

.toggle-btn.toggle-active {
  background: #0C9C8D;
}

.toggle-btn.toggle-active:hover {
  background: #0a8a7e;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-active .toggle-slider {
  transform: translateX(24px);
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

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #4b5563;
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

.btn-danger-text {
  background: transparent;
  color: #ef4444;
  padding: 8px 12px;
}

.btn-danger-text:hover {
  background: rgba(239, 68, 68, 0.1);
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

/* Dialog Styles */
.security-dialog {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 0;
  margin-bottom: 20px;
}

.warning-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.warning-icon.revoke {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dialog-content {
  padding: 0 24px;
  margin-bottom: 24px;
}

.dialog-message {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.warning-note {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #92400e;
}

.dialog-actions {
  padding: 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Success Notification */
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
.d-flex { display: flex; }
.align-center { align-items: center; }
.ml-auto { margin-left: auto; }
.mr-2 { margin-right: 8px; }
.mr-3 { margin-right: 12px; }
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
  
  .content-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .table-header .table-cell {
    display: none;
  }
  
  .table-row .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
  }
  
  .notification-setting {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .setting-toggle {
    margin-left: 0;
  }
  
  .dialog-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .success-notification {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}

@media (max-width: 480px) {
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
  
  .device-info,
  .app-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .device-icon,
  .app-icon {
    width: 32px;
    height: 32px;
  }
  
  .setting-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    text-align: left;
  }
  
  .setting-icon {
    margin-right: 0;
  }
}
</style>