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
            Backup & Data Management
          </h1>
          <p
            class="text-body-1"
            style="color: #6b7280;"
          >
            Manage your data backups, storage usage, and export options to keep your information safe
          </p>
        </div>
        
        <!-- Backup Status Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Backup Status
          </h3>
          
          <div class="backup-status-card">
            <div class="status-header">
              <div class="status-icon">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-shield-check
                </v-icon>
              </div>
              <div class="status-info">
                <h4 class="status-title">
                  Automatic Backups
                </h4>
                <p class="status-description">
                  Your data is automatically backed up every day
                </p>
              </div>
              <div class="status-badge">
                <v-chip
                  color="success"
                  size="small"
                  variant="flat"
                >
                  <v-icon
                    class="mr-1"
                    size="16"
                  >
                    mdi-check-circle
                  </v-icon>
                  Active
                </v-chip>
              </div>
            </div>
            
            <div class="status-details">
              <div class="detail-item">
                <span class="detail-label">Last backup:</span>
                <span class="detail-value">Today, 4:30 AM</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Backup frequency:</span>
                <span class="detail-value">Daily</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Next backup:</span>
                <span class="detail-value">Tomorrow, 4:30 AM</span>
              </div>
            </div>
            
            <div class="status-actions">
              <button
                class="btn btn-primary"
                @click="runManualBackup"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-backup-restore
                </v-icon>
                Run Manual Backup
              </button>
            </div>
          </div>
          
          <!-- Backup History Table -->
          <div class="mt-8">
            <h4 class="subsection-title mb-4">
              Backup History
            </h4>
            
            <div class="backup-table">
              <div class="table-header">
                <div class="table-cell">
                  Date & Time
                </div>
                <div class="table-cell">
                  Type
                </div>
                <div class="table-cell">
                  Size
                </div>
                <div class="table-cell">
                  Status
                </div>
                <div class="table-cell">
                  Actions
                </div>
              </div>
              
              <div 
                v-for="(backup, index) in backupHistory"
                :key="index"
                class="table-row"
              >
                <div class="table-cell">
                  <div class="backup-datetime">
                    <v-icon
                      color="#6b7280"
                      size="16"
                      class="mr-2"
                    >
                      mdi-calendar
                    </v-icon>
                    {{ backup.datetime }}
                  </div>
                </div>
                <div class="table-cell">
                  <v-chip 
                    :color="backup.type === 'Automatic' ? 'primary' : 'secondary'" 
                    size="small" 
                    variant="outlined"
                  >
                    {{ backup.type }}
                  </v-chip>
                </div>
                <div class="table-cell">
                  <span class="backup-size">{{ backup.size }}</span>
                </div>
                <div class="table-cell">
                  <div class="status-indicator">
                    <div
                      class="status-dot"
                      :class="{ 'success': backup.status === 'Completed' }"
                    />
                    <span class="status-text">{{ backup.status }}</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="action-buttons">
                    <button
                      class="btn-icon"
                      title="Download"
                      @click="downloadBackup(backup)"
                    >
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >
                        mdi-download
                      </v-icon>
                    </button>
                    <button
                      class="btn-icon"
                      title="Restore"
                      @click="restoreBackup(backup)"
                    >
                      <v-icon
                        color="#3b82f6"
                        size="16"
                      >
                        mdi-restore
                      </v-icon>
                    </button>
                    <button
                      class="btn-icon"
                      title="Delete"
                      @click="deleteBackup(backup)"
                    >
                      <v-icon
                        color="#ef4444"
                        size="16"
                      >
                        mdi-delete
                      </v-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Backup Settings Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Backup Settings
          </h3>
          <p class="section-description mb-8">
            Configure your automatic backup preferences and schedule.
          </p>
          
          <div class="settings-grid">
            <div class="settings-section">
              <h4 class="subsection-title mb-4">
                Backup Schedule
              </h4>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Frequency</label>
                  <v-select
                    v-model="backupFrequency"
                    :items="frequencyOptions"
                    variant="outlined"
                    hide-details
                    class="modern-select"
                    density="comfortable"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Time</label>
                  <v-select
                    v-model="backupTime"
                    :items="timeOptions"
                    variant="outlined"
                    hide-details
                    class="modern-select"
                    density="comfortable"
                    :disabled="backupFrequency === 'Off'"
                  />
                </div>
              </div>
            </div>
            
            <div class="settings-section">
              <h4 class="subsection-title mb-4">
                Data to Include
              </h4>
              
              <div class="checkbox-group">
                <div class="checkbox-item">
                  <input 
                    id="projects" 
                    v-model="includeProjects" 
                    type="checkbox" 
                    class="custom-checkbox"
                  >
                  <label
                    for="projects"
                    class="checkbox-label"
                  >
                    <div class="checkbox-icon">
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >mdi-folder-multiple</v-icon>
                    </div>
                    <span>Projects & Tasks</span>
                  </label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    id="files" 
                    v-model="includeFiles" 
                    type="checkbox" 
                    class="custom-checkbox"
                  >
                  <label
                    for="files"
                    class="checkbox-label"
                  >
                    <div class="checkbox-icon">
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >mdi-file-multiple</v-icon>
                    </div>
                    <span>Files & Attachments</span>
                  </label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    id="settings" 
                    v-model="includeSettings" 
                    type="checkbox" 
                    class="custom-checkbox"
                  >
                  <label
                    for="settings"
                    class="checkbox-label"
                  >
                    <div class="checkbox-icon">
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >mdi-cog</v-icon>
                    </div>
                    <span>User Settings & Preferences</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8">
            <button
              class="btn btn-primary btn-large"
              @click="saveBackupSettings"
            >
              <v-icon
                class="mr-2"
                size="16"
              >
                mdi-content-save
              </v-icon>
              Save Settings
            </button>
          </div>
        </div>
        
        <!-- Storage Management Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Storage Management
          </h3>
          <p class="section-description mb-8">
            Monitor your storage usage and manage your data efficiently.
          </p>
          
          <div class="storage-overview">
            <div class="storage-header">
              <div class="storage-info">
                <h4 class="storage-title">
                  Storage Usage
                </h4>
                <p class="storage-subtitle">
                  Using 12.4 GB of 20 GB (62%)
                </p>
              </div>
              <button class="btn btn-secondary">
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-arrow-up
                </v-icon>
                Upgrade Storage
              </button>
            </div>
            
            <div class="storage-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: storageUsed + '%' }"
                />
              </div>
              <div class="progress-labels">
                <span class="progress-used">12.4 GB used</span>
                <span class="progress-total">20 GB total</span>
              </div>
            </div>
            
            <div class="storage-breakdown">
              <h5 class="breakdown-title">
                Storage Breakdown
              </h5>
              <div class="breakdown-list">
                <div 
                  v-for="(item, index) in storageBreakdown"
                  :key="index"
                  class="breakdown-item"
                >
                  <div class="breakdown-info">
                    <div
                      class="breakdown-dot"
                      :style="{ backgroundColor: getBreakdownColor(index) }"
                    />
                    <span class="breakdown-type">{{ item.type }}</span>
                  </div>
                  <div class="breakdown-stats">
                    <span class="breakdown-usage">{{ item.usage }}</span>
                    <span class="breakdown-percentage">{{ item.percentage }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="storage-actions">
              <button
                class="btn btn-danger-outline"
                @click="showDataClearDialog = true"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-delete-sweep
                </v-icon>
                Clear Temporary Data
              </button>
            </div>
          </div>
        </div>
        
        <!-- Data Export Section -->
        <div class="content-card">
          <h3 class="section-title mb-6">
            Data Export
          </h3>
          <p class="section-description mb-8">
            Export your data in various formats for use in other applications or as an additional backup measure.
          </p>
          
          <div class="export-controls">
            <div class="export-form">
              <div class="form-group">
                <label class="form-label">Export Format</label>
                <v-select
                  v-model="exportFormat"
                  :items="formatOptions"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Data Type</label>
                <v-select
                  v-model="exportDataType"
                  :items="dataTypeOptions"
                  variant="outlined"
                  hide-details
                  class="modern-select"
                  density="comfortable"
                />
              </div>
              
              <div class="form-group">
                <button
                  class="btn btn-primary btn-large"
                  @click="exportData"
                >
                  <v-icon
                    class="mr-2"
                    size="16"
                  >
                    mdi-download
                  </v-icon>
                  Export Data
                </button>
              </div>
            </div>
            
            <div class="export-info">
              <div class="info-card">
                <v-icon
                  color="#3b82f6"
                  size="20"
                  class="mr-3"
                >
                  mdi-information
                </v-icon>
                <span>Exports may take several minutes to process depending on the amount of data.</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Restore Backup Dialog -->
        <v-dialog
          v-model="restoreDialog"
          max-width="500"
          persistent
        >
          <v-card class="backup-dialog">
            <div class="dialog-header">
              <div class="warning-icon restore">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-restore
                </v-icon>
              </div>
              <h3 class="dialog-title">
                Restore Backup
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="dialog-message">
                Are you sure you want to restore the backup from <strong>{{ selectedBackup?.datetime }}</strong>?
              </p>
              <div class="warning-note">
                <v-icon
                  color="#f59e0b"
                  size="20"
                  class="mr-3"
                >
                  mdi-alert-triangle
                </v-icon>
                <span>This will replace your current data with the backup data. This action cannot be undone.</span>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="restoreDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-primary"
                @click="confirmRestore"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-restore
                </v-icon>
                Restore Backup
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Delete Backup Dialog -->
        <v-dialog
          v-model="deleteDialog"
          max-width="500"
          persistent
        >
          <v-card class="backup-dialog">
            <div class="dialog-header">
              <div class="warning-icon delete">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-delete
                </v-icon>
              </div>
              <h3 class="dialog-title">
                Delete Backup
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="dialog-message">
                Are you sure you want to delete the backup from <strong>{{ selectedBackup?.datetime }}</strong>?
              </p>
              <div class="warning-note">
                <v-icon
                  color="#ef4444"
                  size="20"
                  class="mr-3"
                >
                  mdi-alert-circle
                </v-icon>
                <span>This action cannot be undone. The backup will be permanently removed.</span>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="deleteDialog = false"
              >
                Cancel
              </button>
              <button
                class="btn btn-danger"
                @click="confirmDelete"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-delete
                </v-icon>
                Delete Backup
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Clear Data Dialog -->
        <v-dialog
          v-model="showDataClearDialog"
          max-width="500"
          persistent
        >
          <v-card class="backup-dialog">
            <div class="dialog-header">
              <div class="warning-icon clear">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-delete-sweep
                </v-icon>
              </div>
              <h3 class="dialog-title">
                Clear Temporary Data
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="dialog-message">
                Select which temporary data you want to clear to free up storage space.
              </p>
              
              <div class="clear-options">
                <div class="checkbox-item">
                  <input 
                    id="clearCache" 
                    v-model="clearCache" 
                    type="checkbox" 
                    class="custom-checkbox"
                  >
                  <label
                    for="clearCache"
                    class="checkbox-label"
                  >
                    <div class="checkbox-icon">
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >mdi-database</v-icon>
                    </div>
                    <div class="checkbox-text">
                      <span>Clear application cache</span>
                      <small>Temporary files used to speed up the app</small>
                    </div>
                  </label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    id="clearTempFiles" 
                    v-model="clearTempFiles" 
                    type="checkbox" 
                    class="custom-checkbox"
                  >
                  <label
                    for="clearTempFiles"
                    class="checkbox-label"
                  >
                    <div class="checkbox-icon">
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >mdi-file-remove</v-icon>
                    </div>
                    <div class="checkbox-text">
                      <span>Clear temporary files</span>
                      <small>Files created during uploads and processing</small>
                    </div>
                  </label>
                </div>
                
                <div class="checkbox-item">
                  <input 
                    id="clearLogs" 
                    v-model="clearLogs" 
                    type="checkbox" 
                    class="custom-checkbox"
                  >
                  <label
                    for="clearLogs"
                    class="checkbox-label"
                  >
                    <div class="checkbox-icon">
                      <v-icon
                        color="#0C9C8D"
                        size="16"
                      >mdi-text-box-remove</v-icon>
                    </div>
                    <div class="checkbox-text">
                      <span>Clear system logs</span>
                      <small>Remove logs older than 30 days</small>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="showDataClearDialog = false"
              >
                Cancel
              </button>
              <button 
                class="btn btn-primary" 
                :disabled="!clearCache && !clearTempFiles && !clearLogs"
                @click="clearTemporaryData"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  mdi-delete-sweep
                </v-icon>
                Clear Selected Data
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
import { ref} from 'vue'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// States
const sidebarExpanded = ref(true)
const successSnackbar = ref(false)
const snackbarMessage = ref('')

// Dialog states
const restoreDialog = ref(false)
const deleteDialog = ref(false)
const showDataClearDialog = ref(false)
const selectedBackup = ref(null)

// Backup data
const backupHistory = ref([
  {
    id: 1,
    datetime: 'May 6, 2025 04:30 AM',
    type: 'Automatic',
    size: '1.2 GB',
    status: 'Completed'
  },
  {
    id: 2,
    datetime: 'May 5, 2025 04:30 AM',
    type: 'Automatic',
    size: '1.1 GB',
    status: 'Completed'
  },
  {
    id: 3,
    datetime: 'May 4, 2025 04:30 AM',
    type: 'Automatic',
    size: '1.1 GB',
    status: 'Completed'
  },
  {
    id: 4,
    datetime: 'May 3, 2025 12:45 PM',
    type: 'Manual',
    size: '1.3 GB',
    status: 'Completed'
  },
  {
    id: 5,
    datetime: 'May 2, 2025 04:30 AM',
    type: 'Automatic',
    size: '1.0 GB',
    status: 'Completed'
  }
])

// Backup settings
const backupFrequency = ref('Daily')
const frequencyOptions = ['Off', 'Daily', 'Weekly', 'Monthly']

const backupTime = ref('4:00 AM')
const timeOptions = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
  '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
  '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
]

const includeProjects = ref(true)
const includeFiles = ref(true)
const includeSettings = ref(true)

// Storage data
const storageUsed = ref(62)
const storageBreakdown = ref([
  { type: 'Project Files', usage: '7.8 GB', percentage: '39%' },
  { type: 'Attachments', usage: '3.4 GB', percentage: '17%' },
  { type: 'System Data', usage: '1.2 GB', percentage: '6%' }
])

// Export settings
const exportFormat = ref('ZIP')
const formatOptions = ['ZIP', 'JSON', 'CSV', 'PDF']

const exportDataType = ref('All Data')
const dataTypeOptions = ['All Data', 'Projects Only', 'Files Only', 'User Settings']

// Data clearing options
const clearCache = ref(true)
const clearTempFiles = ref(true)
const clearLogs = ref(false)

// Methods
const getBreakdownColor = (index) => {
  const colors = ['#0C9C8D', '#3b82f6', '#f59e0b']
  return colors[index] || '#6b7280'
}

const runManualBackup = () => {
  showSnackbar('Manual backup started. This may take a few minutes...')
  // Simulate backup process
  setTimeout(() => {
    const newBackup = {
      id: Date.now(),
      datetime: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'Manual',
      size: '1.3 GB',
      status: 'Completed'
    }
    backupHistory.value.unshift(newBackup)
    showSnackbar('Manual backup completed successfully!')
  }, 3000)
}

const downloadBackup = (backup) => {
  console.log('Downloading backup:', backup.id)
  showSnackbar(`Started downloading backup from ${backup.datetime}`)
}

const restoreBackup = (backup) => {
  selectedBackup.value = backup
  restoreDialog.value = true
}

const confirmRestore = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    restoreDialog.value = false
    showSnackbar(`Started restoring backup from ${selectedBackup.value.datetime}`)
    selectedBackup.value = null
  } catch (error) {
    console.error('Error restoring backup:', error)
  }
}

const deleteBackup = (backup) => {
  selectedBackup.value = backup
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    // Remove from array
    backupHistory.value = backupHistory.value.filter(
      backup => backup.id !== selectedBackup.value.id
    )
    
    deleteDialog.value = false
    showSnackbar(`Successfully deleted backup from ${selectedBackup.value.datetime}`)
    selectedBackup.value = null
  } catch (error) {
    console.error('Error deleting backup:', error)
  }
}

const saveBackupSettings = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Saving backup settings:', {
      frequency: backupFrequency.value,
      time: backupTime.value,
      includeProjects: includeProjects.value,
      includeFiles: includeFiles.value,
      includeSettings: includeSettings.value
    })
    
    showSnackbar('Backup settings saved successfully')
  } catch (error) {
    console.error('Error saving backup settings:', error)
  }
}

const exportData = () => {
  console.log('Exporting data:', {
    format: exportFormat.value,
    dataType: exportDataType.value
  })
  
  showSnackbar(`Started exporting ${exportDataType.value.toLowerCase()} in ${exportFormat.value} format`)
}

const clearTemporaryData = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Clearing temporary data:', {
      clearCache: clearCache.value,
      clearTempFiles: clearTempFiles.value,
      clearLogs: clearLogs.value
    })
    
    showDataClearDialog.value = false
    showSnackbar('Temporary data cleared successfully')
    
    // Update storage usage for demo
    storageUsed.value = 55
    storageBreakdown.value[2].usage = '0.4 GB'
    storageBreakdown.value[2].percentage = '2%'
  } catch (error) {
    console.error('Error clearing temporary data:', error)
  }
}

const showSnackbar = (message) => {
  snackbarMessage.value = message
  successSnackbar.value = true
  setTimeout(() => {
    successSnackbar.value = false
  }, 3000)
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

/* Container adjustments */
.container-full-width {
  max-width: none !important;
  width: 100%;
  padding-left: 24px !important;
  padding-right: 24px !important;
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

/* Backup Status Card */
.backup-status-card {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
}

.status-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.status-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-info {
  flex: 1;
}

.status-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.status-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.status-badge {
  flex-shrink: 0;
}

.status-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.status-actions {
  display: flex;
  justify-content: flex-end;
}

/* Backup Table */
.backup-table {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  background: #f8fafc;
  border-bottom: 1px solid #f3f4f6;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
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

.backup-datetime {
  display: flex;
  align-items: center;
  color: #4b5563;
}

.backup-size {
  font-weight: 500;
  color: #374151;
}

/* Status Indicator */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
}

.status-dot.success {
  background: #10b981;
}

.status-text {
  font-size: 14px;
  color: #6b7280;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.settings-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

/* Form Styles */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
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

/* Checkbox Styles */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checkbox-item {
  position: relative;
}

.custom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  transition: all 0.2s ease;
}

.checkbox-label:hover {
  border-color: #d1d5db;
  background: #f9fafb;
}

.custom-checkbox:checked + .checkbox-label {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.05);
}

.checkbox-icon {
  width: 32px;
  height: 32px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.custom-checkbox:checked + .checkbox-label .checkbox-icon {
  background: rgba(12, 156, 141, 0.1);
}

.checkbox-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.checkbox-text span {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.checkbox-text small {
  font-size: 12px;
  color: #6b7280;
}

/* Storage Overview */
.storage-overview {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.storage-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.storage-info {
  flex: 1;
}

.storage-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.storage-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.storage-progress {
  margin-bottom: 24px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0C9C8D, #10b981);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
}

.storage-breakdown {
  margin-bottom: 24px;
}

.breakdown-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.breakdown-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.breakdown-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.breakdown-type {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.breakdown-stats {
  display: flex;
  gap: 16px;
  align-items: center;
}

.breakdown-usage {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.breakdown-percentage {
  font-size: 12px;
  color: #6b7280;
}

.storage-actions {
  display: flex;
  justify-content: flex-end;
}

/* Export Controls */
.export-controls {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.export-form {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 16px;
  align-items: end;
}

.export-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
}

.info-card {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1e40af;
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

.btn-danger-outline {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.btn-danger-outline:hover {
  background: #ef4444;
  color: white;
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
.backup-dialog {
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
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.warning-icon.restore {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.warning-icon.delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.warning-icon.clear {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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

.clear-options {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  
  .settings-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .export-form {
    grid-template-columns: 1fr;
    gap: 16px;
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
  
  .storage-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .status-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .status-details {
    grid-template-columns: 1fr;
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
  
  .backup-status-card,
  .settings-section,
  .storage-overview {
    padding: 20px;
  }
  
  .status-icon,
  .warning-icon {
    width: 40px;
    height: 40px;
  }
  
  .checkbox-icon {
    width: 28px;
    height: 28px;
  }
}
</style>