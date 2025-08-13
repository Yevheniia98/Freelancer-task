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
              :class="{'tab-active': tab === 'log-out'}"
              @click="tab = 'log-out'; navigateTo('LogOut')"
            >
              Logout
            </div>
          </div>
        </div>
        
        <!-- Data Export Content -->
        <div class="data-export-content">
          <!-- Info Section -->
          <div class="content-card info-card">
            <h3 class="section-title">
              Data Export
            </h3>
            <p class="section-description">
              Export your account data in various formats. You can choose specific data types, file formats, and date ranges for your exports.
            </p>
          </div>
          
          <!-- Export Controls Section -->
          <div class="content-card export-card">
            <h3 class="section-title">
              Export Your Data
            </h3>
            <p class="section-description section-subtitle">
              Select the data you want to export and choose your preferred format.
            </p>
            
            <div class="export-controls-grid">
              <div class="form-group">
                <label class="form-label">Data Type</label>
                <v-select
                  v-model="selectedData"
                  :items="dataOptions"
                  placeholder="Choose data to export"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">File Format</label>
                <v-select
                  v-model="selectedFormat"
                  :items="formatOptions"
                  placeholder="Choose file format"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Date Range</label>
                <v-select
                  v-model="dateRange"
                  :items="dateRangeOptions"
                  placeholder="Select date range"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
            </div>
            
            <div class="button-section">
              <button 
                class="btn btn-primary btn-large"
                :disabled="!selectedData || !selectedFormat || !dateRange || exporting"
                @click="exportData"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-download
                </v-icon>
                <span v-if="exporting">Exporting...</span>
                <span v-else>Export Data</span>
              </button>
            </div>
          </div>
          
          <!-- Automated Exports Section -->
          <div class="content-card automated-card">
            <h3 class="section-title">
              Automated Exports
            </h3>
            <p class="section-description section-subtitle">
              Set up automated exports to receive your data regularly via email or cloud storage.
            </p>
            
            <div class="automated-exports-grid">
              <div class="form-group">
                <label class="form-label">Weekly Export</label>
                <v-select
                  v-model="weeklyExport"
                  :items="exportFrequencyOptions"
                  placeholder="Export data every week"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Monthly Export</label>
                <v-select
                  v-model="monthlyExport"
                  :items="exportFrequencyOptions"
                  placeholder="Export data every month"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
            </div>
            
            <div class="button-section">
              <button 
                class="btn btn-secondary"
                :disabled="saving"
                @click="saveAutomatedExports"
              >
                <span v-if="saving">Saving...</span>
                <span v-else>Save Automated Export Settings</span>
              </button>
            </div>
          </div>
          
          <!-- Data Retention Policy Section -->
          <div class="content-card policy-card">
            <h3 class="section-title">
              Data Retention Policy
            </h3>
            
            <div class="retention-policy-box">
              <div class="policy-intro">
                <p>At Pro-Tasker, we take data privacy and security seriously. Below is our policy regarding data retention, archiving, and deletion:</p>
              </div>
              
              <div class="policy-list">
                <div class="policy-item">
                  <div class="policy-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-calendar-clock
                    </v-icon>
                  </div>
                  <div class="policy-content">
                    <h4 class="policy-title">
                      Data Retention Period
                    </h4>
                    <p class="policy-description">
                      We retain your account data, including project details, financial records, and task history, for 12 months after the cancellation of your subscription. After this period, all data will be permanently deleted.
                    </p>
                  </div>
                </div>
                
                <div class="policy-item">
                  <div class="policy-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-archive
                    </v-icon>
                  </div>
                  <div class="policy-content">
                    <h4 class="policy-title">
                      Archived Data
                    </h4>
                    <p class="policy-description">
                      After cancellation, your data may be archived for up to 3 months. During this time, you can request access to your archived data by reactivating your account.
                    </p>
                  </div>
                </div>
                
                <div class="policy-item">
                  <div class="policy-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-delete-forever
                    </v-icon>
                  </div>
                  <div class="policy-content">
                    <h4 class="policy-title">
                      Permanent Deletion
                    </h4>
                    <p class="policy-description">
                      If you do not reactivate your account within the archival period, all associated data will be permanently deleted. This includes all project files, task logs, and financial reports.
                    </p>
                  </div>
                </div>
                
                <div class="policy-item">
                  <div class="policy-icon">
                    <v-icon
                      color="#0C9C8D"
                      size="20"
                    >
                      mdi-cloud-download
                    </v-icon>
                  </div>
                  <div class="policy-content">
                    <h4 class="policy-title">
                      Export Your Data
                    </h4>
                    <p class="policy-description">
                      Before canceling, please export any important information using the Data Export feature to avoid losing access to your project and financial data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Success Notification -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// Setup router
const router = useRouter()

// States
const tab = ref('export')
const sidebarExpanded = ref(true)
const exporting = ref(false)
const saving = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Form data
const selectedData = ref('')
const selectedFormat = ref('')
const dateRange = ref('')
const weeklyExport = ref('Disabled')
const monthlyExport = ref('Disabled')

// Options
const dataOptions = [
  'All Data',
  'Projects Only',
  'Financial Records',
  'Task History',
  'User Profiles'
]

const formatOptions = [
  'CSV',
  'JSON',
  'Excel (XLSX)',
  'PDF'
]

const dateRangeOptions = [
  'Last 30 days',
  'Last 90 days',
  'Last 6 months',
  'Last Year',
  'All Time'
]

const exportFrequencyOptions = [
  'Disabled',
  'Email',
  'Download to Cloud Storage',
  'FTP Transfer'
]

// Set the correct tab on component mount
onMounted(() => {
  tab.value = 'export'
})

// Methods
const navigateTo = (componentName) => {
  router.push({ name: componentName })
}

const exportData = async () => {
  exporting.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Exporting data...', {
      selectedData: selectedData.value,
      selectedFormat: selectedFormat.value,
      dateRange: dateRange.value
    })
    showSnackbar(`${selectedData.value} exported successfully as ${selectedFormat.value}`, 'success')
  } catch (error) {
    showSnackbar('Error exporting data', 'error')
  } finally {
    exporting.value = false
  }
}

const saveAutomatedExports = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Saving automated exports:', {
      weeklyExport: weeklyExport.value,
      monthlyExport: monthlyExport.value
    })
    showSnackbar('Automated export settings saved successfully', 'success')
  } catch (error) {
    showSnackbar('Error saving automated export settings', 'error')
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

/* Content Layout */
.data-export-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
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

.info-card {
  padding: 20px 28px;
}

.export-card, .automated-card, .policy-card {
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

.section-subtitle {
  margin-bottom: 24px;
}

/* Export Controls Grid */
.export-controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.automated-exports-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

/* Form Styles */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.modern-select :deep(.v-field) {
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: white;
  font-size: 15px;
}

.modern-select :deep(.v-field--focused) {
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

.modern-select :deep(.v-field:hover) {
  border-color: #9ca3af;
}

.modern-select :deep(.v-field__input) {
  padding: 12px 16px;
  min-height: 48px;
}

/* Button Section */
.button-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

/* Data Retention Policy */
.retention-policy-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.policy-intro {
  margin-bottom: 20px;
}

.policy-intro p {
  color: #4b5563;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

.policy-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.policy-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.policy-icon {
  width: 40px;
  height: 40px;
  background: rgba(12, 156, 141, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.policy-content {
  flex: 1;
}

.policy-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.policy-description {
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
  
  .export-controls-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .automated-exports-grid {
    grid-template-columns: 1fr;
    gap: 16px;
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
  
  .export-card, .automated-card, .policy-card {
    padding: 20px;
  }
  
  .policy-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .policy-icon {
    align-self: flex-start;
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
  
  .data-export-content {
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
  
  .export-card, .automated-card, .policy-card {
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
  
  .retention-policy-box {
    padding: 16px;
  }
  
  .button-section {
    margin-top: 20px;
    padding-top: 16px;
  }
}
</style>