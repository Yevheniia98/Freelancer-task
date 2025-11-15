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
        
        <!-- Notifications Content -->
        <div class="notifications-content">
          <!-- Info Section -->
          <div class="content-card info-card">
            <h3 class="section-title">
              Notification Preferences
            </h3>
            <p class="section-description">
              Stay informed about your projects, deadlines, and team activities. Customize your notification preferences to receive alerts that matter most to you.
            </p>
          </div>
          
          <!-- Notification Settings -->
          <div class="content-card settings-card">
            <h3 class="section-title">
              Notification Settings
            </h3>
            
            <div class="notification-list">
              <!-- Email Notifications -->
              <div class="notification-item">
                <div class="notification-content">
                  <div class="notification-icon">
                    <div class="icon-wrapper email">
                      <v-icon
                        color="white"
                        size="20"
                      >
                        mdi-email
                      </v-icon>
                    </div>
                  </div>
                  <div class="notification-info">
                    <h4 class="notification-title">
                      Email Notifications
                    </h4>
                    <p class="notification-description">
                      Project progress updates, subscription renewals or reminders
                    </p>
                  </div>
                </div>
                <div class="notification-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': emailNotifications}"
                    @click="toggleEmailNotifications"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
              
              <!-- Push Notifications -->
              <div class="notification-item">
                <div class="notification-content">
                  <div class="notification-icon">
                    <div class="icon-wrapper push">
                      <v-icon
                        color="white"
                        size="20"
                      >
                        mdi-bell
                      </v-icon>
                    </div>
                  </div>
                  <div class="notification-info">
                    <h4 class="notification-title">
                      Push Notifications
                    </h4>
                    <p class="notification-description">
                      Push notifications on mobile and desktop devices
                    </p>
                  </div>
                </div>
                <div class="notification-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': pushNotifications}"
                    @click="togglePushNotifications"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
              
              <!-- Account Activity -->
              <div class="notification-item">
                <div class="notification-content">
                  <div class="notification-icon">
                    <div class="icon-wrapper security">
                      <v-icon
                        color="white"
                        size="20"
                      >
                        mdi-shield-check
                      </v-icon>
                    </div>
                  </div>
                  <div class="notification-info">
                    <h4 class="notification-title">
                      Account Activity
                    </h4>
                    <p class="notification-description">
                      Alerts about login from new devices, password changes, or security issues
                    </p>
                  </div>
                </div>
                <div class="notification-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': accountActivity}"
                    @click="toggleAccountActivity"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
              
              <!-- Billing Alerts -->
              <div class="notification-item">
                <div class="notification-content">
                  <div class="notification-icon">
                    <div class="icon-wrapper billing">
                      <v-icon
                        color="white"
                        size="20"
                      >
                        mdi-credit-card
                      </v-icon>
                    </div>
                  </div>
                  <div class="notification-info">
                    <h4 class="notification-title">
                      Billing Alerts
                    </h4>
                    <p class="notification-description">
                      Notifications for upcoming payments, failed transactions
                    </p>
                  </div>
                </div>
                <div class="notification-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': billingAlerts}"
                    @click="toggleBillingAlerts"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="save-section">
              <button 
                class="btn btn-primary btn-large"
                :disabled="saving"
                @click="saveAllSettings"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save Notification Preferences</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Spacing between sections -->
        <div class="section-spacing"></div>
        
        <!-- Recent Notifications -->
        <div id="recent-notifications" class="content-card settings-card">
          <div class="section-header">
            <h3 class="section-title">
              Recent Notifications
            </h3>
            <div class="notification-actions">
              <button
                v-if="notifications.length > 0"
                class="btn btn-secondary"
                @click="clearAllNotifications"
              >
                Clear All
              </button>
              <button
                class="btn btn-secondary"
                @click="refreshNotifications"
              >
                Refresh
              </button>
              <button
                class="btn btn-primary"
                @click="prepareForNewUser"
              >
                New User Setup
              </button>
            </div>
          </div>
          
          <div class="notifications-list">
            <div
              v-if="notifications.length === 0"
              class="empty-notifications"
            >
              <div class="empty-state">
                <v-icon
                  size="48"
                  color="grey-lighten-2"
                  class="mb-3"
                >
                  mdi-bell-outline
                </v-icon>
                <h4 class="text-subtitle-1 mb-2 text-medium-emphasis">You're all caught up!</h4>
                <p class="text-body-2 text-medium-emphasis">
                  Your notification center is ready.
                </p>
                <p class="text-body-2 text-medium-emphasis" style="margin-top: 16px;">
                  Try the <strong>Refresh</strong> button to see sample notifications!
                </p>
              </div>
            </div>
            
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="notification-item"
              :class="{ 'unread': !notification.read }"
              @click="markNotificationAsRead(notification)"
            >
              <div class="notification-icon">
                <v-icon
                  :color="getNotificationIconColor(notification.type)"
                  size="20"
                >
                  {{ getNotificationIcon(notification.type) }}
                </v-icon>
              </div>
              <div class="notification-content">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <p class="notification-message">{{ notification.message }}</p>
                <div class="notification-meta">
                  <span class="notification-time">{{ formatNotificationTime(notification.time) }}</span>
                  <span class="notification-type">{{ getNotificationTypeLabel(notification.type) }}</span>
                </div>
              </div>
              <div class="notification-actions">
                <button
                  class="delete-notification-btn"
                  @click.stop="deleteNotification(notification.id)"
                >
                  <v-icon size="16">mdi-close</v-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Success Notification -->
        <div
          v-if="snackbar"
          class="success-notification"
        >
          <div class="notification-inner">
            <div class="success-icon">
              ✓
            </div>
            <span>Notification preferences updated successfully!</span>
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
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'
import notificationService, { notifications, notificationSettings } from '@/services/notificationService.js'
// import billingService from '@/services/billingService.js'

// Setup router
const router = useRouter()

// States
const tab = ref('notification')
const sidebarExpanded = ref(true)
const saving = ref(false)
const snackbar = ref(false)

// Use notification settings from service
const emailNotifications = computed({
  get: () => notificationSettings.value.emailNotifications,
  set: (value) => notificationService.updateSettings({ emailNotifications: value })
})

const pushNotifications = computed({
  get: () => notificationSettings.value.pushNotifications,
  set: (value) => notificationService.updateSettings({ pushNotifications: value })
})

const accountActivity = computed({
  get: () => notificationSettings.value.inAppNotifications,
  set: (value) => notificationService.updateSettings({ inAppNotifications: value })
})

const billingAlerts = computed({
  get: () => notificationSettings.value.billingNotifications,
  set: (value) => notificationService.updateSettings({ billingNotifications: value })
})

// Set the correct tab on component mount
onMounted(() => {
  tab.value = 'notification'
  
  // For new user experience, do a complete cleanup
  prepareForNewUser()
})

// Clean up test notifications for production
const cleanupTestNotifications = () => {
  // Remove any notifications that were added for testing or have formatting issues
  const testTitles = [
    'Payment Successful',
    'Payment Failed', 
    'Payment Reminder',
    'System Ready', // Remove old system ready notifications
    'Get Started with Projects', // Remove old getting started notifications
    'Set Your First Reminder',
    'Team Collaboration Ready'
  ]
  
  // Filter out test notifications and any that might have spacing issues
  const cleanedNotifications = notifications.value.filter(notification => 
    !testTitles.includes(notification.title) &&
    !notification.message.includes('$19.99') &&
    !notification.message.includes('$49.99') &&
    !notification.message.includes('$29.99') &&
    !notification.message.includes('$15') && // Remove the problematic $15 notification
    !notification.message.includes('Start creating projects and tasks') // Remove old system ready messages
  )
  
  // Only update if we found test notifications to remove
  if (cleanedNotifications.length !== notifications.value.length) {
    notifications.value = cleanedNotifications
    notificationService.saveToStorage()
    console.log('✅ Test notifications cleaned up for production')
  }
}

// Methods
const navigateTo = (componentName) => {
  router.push({ name: componentName })
}

const toggleEmailNotifications = () => {
  emailNotifications.value = !emailNotifications.value
}

const togglePushNotifications = () => {
  pushNotifications.value = !pushNotifications.value
}

const toggleAccountActivity = () => {
  accountActivity.value = !accountActivity.value
}

const toggleBillingAlerts = () => {
  billingAlerts.value = !billingAlerts.value
}

// Notification management methods
const markNotificationAsRead = (notification) => {
  notificationService.markAsRead(notification.id)
}

const deleteNotification = (notificationId) => {
  notificationService.deleteNotification(notificationId)
}

const clearAllNotifications = () => {
  if (confirm('Are you sure you want to clear all notifications?')) {
    notificationService.clearAll()
  }
}

const refreshNotifications = () => {
  // Clean up any problematic notifications and refresh the display
  cleanupTestNotifications()
  
  // If no notifications exist, add some welcoming sample notifications
  if (notifications.value.length === 0) {
    addWelcomeNotifications()
  }
  
  // Force reactivity update
  notifications.value = [...notifications.value]
  
  console.log('✅ Notifications refreshed and cleaned')
}

const prepareForNewUser = () => {
  // Complete reset for new user experience
  notificationService.clearAll()
  
  // Clear localStorage completely
  localStorage.removeItem('app_notifications')
  localStorage.removeItem('notification_settings')
  localStorage.removeItem('user_payments')
  
  // Add fresh welcome notifications
  addWelcomeNotifications()
  
  console.log('✅ System prepared for new user')
}

const addWelcomeNotifications = () => {
  // Add only the main welcome notification that users love
  notificationService.addNotification({
    type: 'general',
    title: 'Welcome to Your Dashboard!',
    message: 'Your notification system is now active. You\'ll see updates here when you create projects, set reminders, or receive team messages.',
    icon: 'mdi-hand-wave',
    category: 'welcome'
  })
}

const getNotificationIcon = (type) => {
  const icons = {
    project: 'mdi-folder-plus',
    reminder: 'mdi-bell-plus',
    meeting: 'mdi-calendar-plus',
    team_chat: 'mdi-message-text',
    task: 'mdi-check-circle',
    billing: 'mdi-credit-card-clock',
    payment: 'mdi-bell-alert',
    general: 'mdi-bell'
  }
  return icons[type] || 'mdi-bell'
}

const getNotificationIconColor = (type) => {
  const colors = {
    project: '#4CAF50',
    reminder: '#FF9800',
    meeting: '#2196F3',
    team_chat: '#9C27B0',
    task: '#00BCD4',
    billing: '#F44336',
    payment: '#FF5722',
    general: '#757575'
  }
  return colors[type] || '#757575'
}

const getNotificationTypeLabel = (type) => {
  const labels = {
    project: 'Project',
    reminder: 'Reminder',
    meeting: 'Meeting',
    team_chat: 'Team Chat',
    task: 'Task',
    billing: 'Billing',
    payment: 'Payment',
    general: 'General'
  }
  return labels[type] || 'Notification'
}

const formatNotificationTime = (time) => {
  if (!time) return ''
  const now = new Date()
  const notificationTime = new Date(time)
  const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return notificationTime.toLocaleDateString()
}

// const testBillingNotifications = () => {
//   // Add sample billing notifications for demonstration
//   notificationService.addBillingNotification(29.99, new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'Pro Plan Subscription')
//   notificationService.addBillingNotification(15.00, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'Additional Storage')
//   
//   // Show success message
//   console.log('✅ Sample billing notifications added!')
// }



const saveAllSettings = async () => {
  saving.value = true
  try {
    // Settings are automatically saved through computed properties
    // Just simulate a brief loading state for user feedback
    await new Promise(resolve => setTimeout(resolve, 500))
    
    console.log('All notification settings saved:', notificationSettings.value)
    
    // Show success notification
    snackbar.value = true
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      snackbar.value = false
    }, 3000)
  } catch (error) {
    console.error('Error saving settings:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* Layout - Centered content with equal margins */
.ml-60 { 
  margin-left: 30px !important; /* sidebar width (240px) + 30px margin */
  margin-right: 30px !important; 
}
.ml-14 { 
  margin-left: 102px !important; /* collapsed sidebar width (72px) + 30px margin */
  margin-right: 30px !important; 
}
.transition-all { transition: all 0.3s ease; }
.container-full-width { 
  max-width: 1200px !important;
  margin: 0 auto !important;
  width: 100%;
  padding-left: 30px !important;
  padding-right: 30px !important;
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
.notifications-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.content-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  width: 100%;
}

.info-card {
  padding: 20px 28px;
}

.settings-card {
  padding: 28px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
}

.section-description {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* Notification List */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 24px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: #f9fafb;
  margin: 0 -32px;
  padding: 24px 32px;
  border-radius: 8px;
}

.notification-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.notification-icon {
  margin-right: 16px;
  flex-shrink: 0;
}

.icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper.email {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.icon-wrapper.push {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.icon-wrapper.security {
  background: linear-gradient(135deg, #10b981, #059669);
}

.icon-wrapper.billing {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.notification-info {
  flex: 1;
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.notification-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Custom Toggle Switch */
.notification-toggle {
  margin-left: 16px;
  flex-shrink: 0;
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

/* Save Section */
.save-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
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
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
  transform: translateY(-1px);
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

/* Section Spacing */
.section-spacing {
  height: 32px;
}

/* Recent Notifications */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.notification-actions {
  display: flex;
  gap: 12px;
}

.notifications-list {
  max-height: 500px;
  overflow-y: auto;
}

.empty-notifications {
  padding: 40px 20px;
  text-align: center;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.notification-item:hover {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.notification-item.unread {
  background: #eff6ff;
  border-color: #dbeafe;
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3b82f6;
  border-radius: 0 4px 4px 0;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0 !important;
  padding-bottom: 4px;
  display: block;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 20px 0 !important;
  margin-top: 8px !important;
  line-height: 1.4;
  display: block;
  padding-top: 4px;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 8px;
}

.notification-time {
  font-weight: 500;
}

.notification-type {
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 12px;
  font-weight: 500;
}

.notification-actions {
  flex-shrink: 0;
  margin-left: 12px;
}

.delete-notification-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
}

.delete-notification-btn:hover {
  background: #fee2e2;
  color: #dc2626;
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
  
  .info-card {
    padding: 16px 20px;
  }
  
  .settings-card {
    padding: 20px;
  }
  
  .notification-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px 0;
  }
  
  .notification-content {
    width: 100%;
  }
  
  .notification-toggle {
    margin-left: 0;
    align-self: flex-end;
    margin-top: 8px;
  }
  
  .notification-item:hover {
    margin: 0 -20px;
    padding: 20px;
  }
  
  .success-notification {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}

@media (max-width: 480px) {
  .header-section {
    margin-bottom: 24px;
  }
  
  .tab-navigation {
    margin-bottom: 16px;
  }
  
  .notifications-content {
    gap: 16px;
  }
  
  .tab-item {
    padding: 12px 8px;
    font-size: 12px;
  }
  
  .content-card {
    padding: 16px;
  }
  
  .info-card {
    padding: 12px 16px;
  }
  
  .settings-card {
    padding: 16px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .btn-large {
    padding: 14px 28px;
    font-size: 15px;
  }
  
  .notification-item:hover {
    margin: 0 -16px;
    padding: 20px 16px;
  }
  
  .save-section {
    margin-top: 24px;
    padding-top: 20px;
  }
}
</style>