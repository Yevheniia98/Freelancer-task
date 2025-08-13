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
      style="background-color: #fafafa; padding-left: 24px;"
    >
      <v-container
        fluid
        class="pa-6 container-full-width"
      >
        <!-- Header -->
        <div class="header-section">
          <h1
            class="text-h3 font-weight-bold mb-3"
            style="color: #1a1a1a;"
          >
            Customization
          </h1>
          <p
            class="text-body-1"
            style="color: #6b7280;"
          >
            Personalize your workspace with themes, notifications, and custom settings
          </p>
        </div>
        
        <!-- Theme & Appearance Section -->
        <div class="content-card theme-card">
          <h3 class="section-title">
            Theme & Appearance
          </h3>
          <p class="section-description section-subtitle">
            Choose your preferred color scheme and visual style for the interface.
          </p>
          
          <div class="theme-section">
            <h4 class="subsection-title theme-subsection-title">
              Color Schemes
            </h4>
            
            <div class="theme-options">
              <div 
                class="theme-card-item"
                :class="{ 'theme-selected': theme === 'light' }"
                @click="setTheme('light')"
              >
                <div class="theme-preview light-preview">
                  <div class="preview-header" />
                  <div class="preview-sidebar" />
                  <div class="preview-content">
                    <div class="preview-line" />
                    <div class="preview-line short" />
                  </div>
                </div>
                <div class="theme-info">
                  <h5 class="theme-name">
                    Light Mode
                  </h5>
                  <p class="theme-description">
                    Clean and bright interface
                  </p>
                </div>
                <div class="theme-indicator">
                  <div
                    class="radio-button"
                    :class="{ 'active': theme === 'light' }"
                  >
                    <div class="radio-dot" />
                  </div>
                </div>
              </div>
              
              <div 
                class="theme-card-item"
                :class="{ 'theme-selected': theme === 'dark' }"
                @click="setTheme('dark')"
              >
                <div class="theme-preview dark-preview">
                  <div class="preview-header" />
                  <div class="preview-sidebar" />
                  <div class="preview-content">
                    <div class="preview-line" />
                    <div class="preview-line short" />
                  </div>
                </div>
                <div class="theme-info">
                  <h5 class="theme-name">
                    Dark Mode
                  </h5>
                  <p class="theme-description">
                    Easy on the eyes interface
                  </p>
                </div>
                <div class="theme-indicator">
                  <div
                    class="radio-button"
                    :class="{ 'active': theme === 'dark' }"
                  >
                    <div class="radio-dot" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notifications & Alerts Section -->
        <div class="content-card notifications-card">
          <h3 class="section-title">
            Notifications & Alerts
          </h3>
          <p class="section-description section-subtitle">
            Manage how, when, and where you receive notifications to stay informed without being overwhelmed.
          </p>
          
          <!-- Notification Preferences -->
          <div class="notification-subsection">
            <h4 class="subsection-title">
              Notification Preferences
            </h4>
            
            <div class="notification-list">
              <div class="notification-item">
                <div class="notification-content">
                  <div class="notification-icon">
                    <div class="icon-wrapper app">
                      <v-icon
                        color="white"
                        size="20"
                      >
                        mdi-bell
                      </v-icon>
                    </div>
                  </div>
                  <div class="notification-info">
                    <h5 class="notification-title">
                      In-App Notifications
                    </h5>
                    <p class="notification-description">
                      Receive notifications directly within the application
                    </p>
                  </div>
                </div>
                <div class="notification-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': inAppNotifications}"
                    @click="toggleInAppNotifications"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
              
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
                    <h5 class="notification-title">
                      Email Notifications
                    </h5>
                    <p class="notification-description">
                      Get important updates and summaries via email
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
              
              <div class="notification-item">
                <div class="notification-content">
                  <div class="notification-icon">
                    <div class="icon-wrapper push">
                      <v-icon
                        color="white"
                        size="20"
                      >
                        mdi-cellphone
                      </v-icon>
                    </div>
                  </div>
                  <div class="notification-info">
                    <h5 class="notification-title">
                      Push Notifications
                    </h5>
                    <p class="notification-description">
                      Receive instant alerts on your mobile device
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
            </div>
          </div>
          
          <!-- Custom Alerts -->
          <div class="notification-subsection">
            <h4 class="subsection-title">
              Custom Alerts
            </h4>
            
            <div class="alert-list">
              <div class="alert-item">
                <div class="alert-content">
                  <div class="alert-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-plus-circle
                    </v-icon>
                  </div>
                  <div class="alert-info">
                    <h5 class="alert-title">
                      New Task Assigned
                    </h5>
                    <p class="alert-description">
                      Get notified when a new task is assigned to you
                    </p>
                  </div>
                </div>
                <div class="alert-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': newTaskAlert}"
                    @click="toggleNewTaskAlert"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
              
              <div class="alert-item">
                <div class="alert-content">
                  <div class="alert-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-clock-alert
                    </v-icon>
                  </div>
                  <div class="alert-info">
                    <h5 class="alert-title">
                      Due Date Approaching
                    </h5>
                    <p class="alert-description">
                      Receive reminders before task deadlines
                    </p>
                  </div>
                </div>
                <div class="alert-controls">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': dueDateAlert}"
                    @click="toggleDueDateAlert"
                  >
                    <span class="toggle-slider" />
                  </button>
                  
                  <div
                    v-if="dueDateAlert"
                    class="reminder-control"
                  >
                    <span class="reminder-label">Remind me</span>
                    <div class="reminder-select">
                      <select 
                        v-model="reminderTime"
                        class="custom-select"
                        @change="saveNotificationSettings"
                      >
                        <option
                          v-for="option in reminderOptions"
                          :key="option"
                          :value="option"
                        >
                          {{ option }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="alert-item">
                <div class="alert-content">
                  <div class="alert-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-swap-horizontal
                    </v-icon>
                  </div>
                  <div class="alert-info">
                    <h5 class="alert-title">
                      Status Change on Important Tasks
                    </h5>
                    <p class="alert-description">
                      Get notified when priority tasks change status
                    </p>
                  </div>
                </div>
                <div class="alert-toggle">
                  <button 
                    class="toggle-btn"
                    :class="{'toggle-active': statusChangeAlert}"
                    @click="toggleStatusChangeAlert"
                  >
                    <span class="toggle-slider" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="save-button-section">
            <button 
              class="btn btn-primary btn-large"
              :disabled="saving"
              @click="saveAllSettings"
            >
              <v-icon
                class="mr-2"
                size="16"
              >
                mdi-content-save
              </v-icon>
              <span v-if="saving">Saving Settings...</span>
              <span v-else>Save All Settings</span>
            </button>
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
import { ref } from 'vue'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// States
const sidebarExpanded = ref(true)
const saving = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')

// Theme state
const theme = ref('light')

// Notification states
const inAppNotifications = ref(true)
const emailNotifications = ref(false)
const pushNotifications = ref(true)

// Alert states
const newTaskAlert = ref(true)
const dueDateAlert = ref(true)
const statusChangeAlert = ref(false)

// Reminder options
const reminderTime = ref('1 day before')
const reminderOptions = [
  '1 hour before',
  '3 hours before',
  '1 day before',
  '2 days before',
  '1 week before'
]

// Methods
const setTheme = (themeName) => {
  theme.value = themeName
  // Implement actual theme change logic
  console.log('Setting theme to:', themeName)
  showSnackbar(`Theme changed to ${themeName} mode`)
}

const toggleInAppNotifications = () => {
  inAppNotifications.value = !inAppNotifications.value
  saveNotificationSettings()
}

const toggleEmailNotifications = () => {
  emailNotifications.value = !emailNotifications.value
  saveNotificationSettings()
}

const togglePushNotifications = () => {
  pushNotifications.value = !pushNotifications.value
  saveNotificationSettings()
}

const toggleNewTaskAlert = () => {
  newTaskAlert.value = !newTaskAlert.value
  saveNotificationSettings()
}

const toggleDueDateAlert = () => {
  dueDateAlert.value = !dueDateAlert.value
  saveNotificationSettings()
}

const toggleStatusChangeAlert = () => {
  statusChangeAlert.value = !statusChangeAlert.value
  saveNotificationSettings()
}

const saveNotificationSettings = () => {
  console.log('Auto-saving notification settings:', {
    inAppNotifications: inAppNotifications.value,
    emailNotifications: emailNotifications.value,
    pushNotifications: pushNotifications.value,
    newTaskAlert: newTaskAlert.value,
    dueDateAlert: dueDateAlert.value,
    statusChangeAlert: statusChangeAlert.value,
    reminderTime: reminderTime.value
  })
}

const saveAllSettings = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    saveNotificationSettings()
    showSnackbar('All settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    showSnackbar('Error saving settings. Please try again.')
  } finally {
    saving.value = false
  }
}

const showSnackbar = (message) => {
  snackbarMessage.value = message
  snackbar.value = true
  setTimeout(() => {
    snackbar.value = false
  }, 3000)
}
</script>

<style scoped>
/* Layout */
.main-expanded { margin-left: 240px !important; }
.main-collapsed { margin-left: 72px !important; }
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

/* Content Cards */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  width: 100%;
}

.theme-card {
  margin-bottom: 20px;
}

.notifications-card {
  margin-bottom: 20px;
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

.section-subtitle {
  margin-bottom: 24px;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
}

.theme-subsection-title {
  margin-bottom: 16px;
}

/* Theme Section */
.theme-section {
  max-width: 600px;
}

.theme-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.theme-card-item {
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.theme-card-item:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.theme-selected {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.05);
}

.theme-preview {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
}

.light-preview {
  background: #ffffff;
}

.dark-preview {
  background: #1f2937;
}

.preview-header {
  height: 12px;
  background: #f3f4f6;
  margin: 6px;
  border-radius: 4px;
}

.dark-preview .preview-header {
  background: #374151;
}

.preview-sidebar {
  position: absolute;
  left: 6px;
  top: 24px;
  width: 20px;
  height: 50px;
  background: #e5e7eb;
  border-radius: 4px;
}

.dark-preview .preview-sidebar {
  background: #4b5563;
}

.preview-content {
  position: absolute;
  right: 6px;
  top: 24px;
  left: 32px;
  height: 50px;
  padding: 8px;
}

.preview-line {
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
  margin-bottom: 6px;
}

.preview-line.short {
  width: 60%;
}

.dark-preview .preview-line {
  background: #6b7280;
}

.theme-info {
  margin-bottom: 16px;
}

.theme-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.theme-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.theme-indicator {
  display: flex;
  justify-content: center;
}

/* Notification Lists */
.notification-subsection {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 28px;
  margin-bottom: 28px;
}

.notification-subsection:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-bottom: 0;
}

.notification-list,
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notification-item,
.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.notification-item:hover,
.alert-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.notification-content,
.alert-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.notification-icon,
.alert-icon {
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

.icon-wrapper.app {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.icon-wrapper.email {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.icon-wrapper.push {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.alert-icon {
  width: 40px;
  height: 40px;
  background: rgba(12, 156, 141, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-info,
.alert-info {
  flex: 1;
}

.notification-title,
.alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.notification-description,
.alert-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Toggle Switches */
.notification-toggle,
.alert-toggle {
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

/* Radio Buttons */
.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.radio-button.active {
  border-color: #0C9C8D;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #0C9C8D;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.radio-button.active .radio-dot {
  opacity: 1;
}

/* Alert Controls */
.alert-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.reminder-control {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.3s ease;
}

.reminder-label {
  font-size: 14px;
  color: #6b7280;
  white-space: nowrap;
}

.reminder-select {
  position: relative;
}

.custom-select {
  appearance: none;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 32px 8px 12px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  min-width: 140px;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
}

.custom-select:focus {
  outline: none;
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

/* Save Button Section */
.save-button-section {
  margin-top: 28px;
  padding-top: 20px;
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

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
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

/* Utilities */
.mr-2 { margin-right: 8px; }

/* Animations */
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-expanded, .main-collapsed {
    margin-left: 0 !important;
  }
  
  v-main {
    padding-left: 0 !important;
  }
  
  .content-card {
    padding: 20px;
    border-radius: 12px;
  }
  
  .theme-options {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .notification-item,
  .alert-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    text-align: left;
  }
  
  .notification-toggle,
  .alert-toggle {
    margin-left: 0;
    align-self: flex-end;
  }
  
  .alert-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }
  
  .reminder-control {
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
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
  
  .content-card {
    padding: 16px;
  }
  
  .theme-card {
    margin-bottom: 16px;
  }
  
  .notifications-card {
    margin-bottom: 16px;
  }
  
  .notification-subsection {
    padding-bottom: 20px;
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
  
  .custom-select {
    min-width: 120px;
    padding: 6px 28px 6px 10px;
    font-size: 13px;
  }
}
</style>