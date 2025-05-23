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
    >
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Header with Search -->
        <div class="d-flex justify-space-between align-center mb-10">
          <div class="logo">
            <!-- You can add your logo here if needed -->
          </div>
            
          <div class="d-flex align-center gap-4">
            <div class="search-container">
              <v-text-field
                density="compact"
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="rounded-pill"
                style="max-width: 240px;"
              />
            </div>
              
            <v-btn
              icon
              class="bg-purple-lighten-4"
              color="purple"
            >
              <v-icon>mdi-earth</v-icon>
            </v-btn>
              
            <v-btn
              icon
              class="bg-amber-lighten-4"
              color="amber"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
          
        <!-- Main Content -->
        <div class="backup-container">
          <h1 class="text-h4 font-weight-bold mb-8">
            Backup & Data Management
          </h1>
            
          <!-- Backup Status Section -->
          <div class="mb-10">
            <h2 class="text-h5 font-weight-bold mb-4">
              Backup Status
            </h2>
              
            <v-card
              class="pa-6 mb-6"
              variant="outlined"
            >
              <div class="d-flex justify-space-between align-center mb-4">
                <div>
                  <h3 class="text-h6 font-weight-medium mb-1">
                    Automatic Backups
                  </h3>
                  <p class="text-body-2 text-grey">
                    Your data is automatically backed up every day
                  </p>
                </div>
                <v-chip
                  color="success"
                  class="font-weight-medium"
                >
                  Active
                </v-chip>
              </div>
                
              <div class="d-flex justify-space-between align-center">
                <div>
                  <p class="text-body-2">
                    Last backup: <span class="font-weight-medium">Today, 4:30 AM</span>
                  </p>
                  <p class="text-body-2">
                    Backup frequency: <span class="font-weight-medium">Daily</span>
                  </p>
                </div>
                <v-btn
                  color="primary"
                  variant="flat"
                  prepend-icon="mdi-backup-restore"
                >
                  Run Manual Backup
                </v-btn>
              </div>
            </v-card>
              
            <!-- Backup History -->
            <v-table class="rounded-lg mb-8">
              <thead class="table-header bg-teal-lighten-3">
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(backup, index) in backupHistory"
                  :key="index"
                >
                  <td>{{ backup.datetime }}</td>
                  <td>{{ backup.type }}</td>
                  <td>{{ backup.size }}</td>
                  <td>
                    <v-chip
                      size="small"
                      :color="backup.status === 'Completed' ? 'success' : 'warning'"
                      class="font-weight-medium"
                    >
                      {{ backup.status }}
                    </v-chip>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <v-btn
                        variant="text"
                        color="primary"
                        density="compact"
                        icon
                        @click="downloadBackup(backup)"
                      >
                        <v-icon>mdi-download</v-icon>
                      </v-btn>
                      <v-btn
                        variant="text"
                        color="primary"
                        density="compact"
                        icon
                        @click="restoreBackup(backup)"
                      >
                        <v-icon>mdi-restore</v-icon>
                      </v-btn>
                      <v-btn
                        variant="text"
                        color="error"
                        density="compact"
                        icon
                        @click="deleteBackup(backup)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
            
          <!-- Backup Settings Section -->
          <div class="mb-10">
            <h2 class="text-h5 font-weight-bold mb-4">
              Backup Settings
            </h2>
              
            <v-card
              class="pa-6 mb-6"
              variant="outlined"
            >
              <h3 class="text-h6 font-weight-medium mb-6">
                Backup Schedule
              </h3>
                
              <div class="d-flex gap-6 mb-6">
                <v-select
                  v-model="backupFrequency"
                  :items="frequencyOptions"
                  label="Frequency"
                  variant="outlined"
                  hide-details
                  class="flex-grow-1"
                />
                  
                <v-select
                  v-model="backupTime"
                  :items="timeOptions"
                  label="Time"
                  variant="outlined"
                  hide-details
                  class="flex-grow-1"
                  :disabled="backupFrequency === 'Off'"
                />
              </div>
                
              <h3 class="text-h6 font-weight-medium mb-3">
                Data to Include
              </h3>
                
              <div class="mb-6">
                <v-checkbox
                  v-model="includeProjects"
                  label="Projects & Tasks"
                  hide-details
                  class="mb-2"
                />
                  
                <v-checkbox
                  v-model="includeFiles"
                  label="Files & Attachments"
                  hide-details
                  class="mb-2"
                />
                  
                <v-checkbox
                  v-model="includeSettings"
                  label="User Settings & Preferences"
                  hide-details
                />
              </div>
                
              <div class="d-flex justify-end">
                <v-btn
                  color="primary"
                  variant="flat"
                  @click="saveBackupSettings"
                >
                  Save Settings
                </v-btn>
              </div>
            </v-card>
          </div>
            
          <!-- Data Management Section -->
          <div class="mb-10">
            <h2 class="text-h5 font-weight-bold mb-4">
              Data Management
            </h2>
              
            <v-card
              class="pa-6 mb-6"
              variant="outlined"
            >
              <div class="d-flex justify-space-between align-center mb-6">
                <div>
                  <h3 class="text-h6 font-weight-medium mb-1">
                    Storage Usage
                  </h3>
                  <p class="text-body-2 text-grey">
                    Your account is using 12.4 GB of 20 GB (62%)
                  </p>
                </div>
                <v-btn
                  color="primary"
                  variant="outlined"
                >
                  Upgrade Storage
                </v-btn>
              </div>
                
              <v-progress-linear
                v-model="storageUsed"
                color="primary"
                height="12"
                rounded
                class="mb-6"
              />
                
              <v-table class="mb-4">
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Usage</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in storageBreakdown"
                    :key="index"
                  >
                    <td>{{ item.type }}</td>
                    <td>{{ item.usage }}</td>
                    <td>{{ item.percentage }}</td>
                  </tr>
                </tbody>
              </v-table>
                
              <div class="d-flex justify-end">
                <v-btn
                  color="error"
                  variant="text"
                  @click="showDataClearDialog = true"
                >
                  Clear Temporary Data
                </v-btn>
              </div>
            </v-card>
          </div>
            
          <!-- Data Export Section -->
          <div>
            <h2 class="text-h5 font-weight-bold mb-4">
              Data Export
            </h2>
              
            <v-card
              class="pa-6"
              variant="outlined"
            >
              <p class="mb-4">
                Export your data in various formats for use in other applications or as an additional backup measure.
              </p>
                
              <div class="d-flex gap-6 mb-6">
                <v-select
                  v-model="exportFormat"
                  :items="formatOptions"
                  label="Format"
                  variant="outlined"
                  hide-details
                  class="flex-grow-1"
                />
                  
                <v-select
                  v-model="exportDataType"
                  :items="dataTypeOptions"
                  label="Data Type"
                  variant="outlined"
                  hide-details
                  class="flex-grow-1"
                />
                  
                <v-btn
                  color="primary"
                  variant="flat"
                  class="mt-2"
                  @click="exportData"
                >
                  Export Data
                </v-btn>
              </div>
                
              <v-alert
                type="info"
                variant="tonal"
                class="mb-0"
              >
                Exports may take several minutes to process depending on the amount of data.
              </v-alert>
            </v-card>
          </div>
        </div>
          
        <!-- Dialogs -->
        <!-- Restore Backup Dialog -->
        <v-dialog
          v-model="restoreDialog"
          max-width="500"
          persistent
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold">
              Restore Backup
            </v-card-title>
              
            <v-card-text class="pt-4">
              Are you sure you want to restore the backup from {{ selectedBackup?.datetime }}? This will replace your current data with the backup data.
                
              <v-alert
                type="warning"
                variant="tonal"
                class="mt-4"
              >
                This action cannot be undone. We recommend creating a manual backup of your current data first.
              </v-alert>
            </v-card-text>
              
            <v-card-actions class="pt-4">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="restoreDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                @click="confirmRestore"
              >
                Restore
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
          
        <!-- Delete Backup Dialog -->
        <v-dialog
          v-model="deleteDialog"
          max-width="500"
          persistent
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold">
              Delete Backup
            </v-card-title>
              
            <v-card-text class="pt-4">
              Are you sure you want to delete the backup from {{ selectedBackup?.datetime }}? This action cannot be undone.
            </v-card-text>
              
            <v-card-actions class="pt-4">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="deleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="error"
                variant="flat"
                @click="confirmDelete"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
          
        <!-- Clear Data Dialog -->
        <v-dialog
          v-model="showDataClearDialog"
          max-width="500"
          persistent
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold">
              Clear Temporary Data
            </v-card-title>
              
            <v-card-text class="pt-4">
              This will clear cached files and temporary data to free up storage space. It won't affect your actual projects or files.
                
              <v-checkbox
                v-model="clearCache"
                label="Clear application cache"
                hide-details
                class="mt-4 mb-2"
              />
                
              <v-checkbox
                v-model="clearTempFiles"
                label="Clear temporary files"
                hide-details
                class="mb-2"
              />
                
              <v-checkbox
                v-model="clearLogs"
                label="Clear system logs older than 30 days"
                hide-details
              />
            </v-card-text>
              
            <v-card-actions class="pt-4">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="showDataClearDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                variant="flat"
                :disabled="!clearCache && !clearTempFiles && !clearLogs"
                @click="clearTemporaryData"
              >
                Clear Data
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
          
        <!-- Success Snackbar -->
        <v-snackbar
          v-model="successSnackbar"
          color="success"
          timeout="3000"
        >
          {{ snackbarMessage }}
          <template #actions>
            <v-btn
              color="white"
              variant="text"
              @click="successSnackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  import SearchBar from '@/dashboard/SearchBar.vue';
  
  
  export default {
    name: 'BackupDataManagementPage',
    components: {
      LeftMenu,
      SearchBar
    },
    data() {
      return {
        sidebarExpanded: true,
        
        // Backup history
        backupHistory: [
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
        ],
        
        // Backup settings
        backupFrequency: 'Daily',
        frequencyOptions: ['Off', 'Daily', 'Weekly', 'Monthly'],
        
        backupTime: '4:00 AM',
        timeOptions: [
          '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM',
          '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
          '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
          '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
        ],
        
        includeProjects: true,
        includeFiles: true,
        includeSettings: true,
        
        // Storage data
        storageUsed: 62,
        storageBreakdown: [
          { type: 'Project Files', usage: '7.8 GB', percentage: '39%' },
          { type: 'Attachments', usage: '3.4 GB', percentage: '17%' },
          { type: 'System Data', usage: '1.2 GB', percentage: '6%' }
        ],
        
        // Export settings
        exportFormat: 'ZIP',
        formatOptions: ['ZIP', 'JSON', 'CSV', 'PDF'],
        
        exportDataType: 'All Data',
        dataTypeOptions: ['All Data', 'Projects Only', 'Files Only', 'User Settings'],
        
        // Dialog controls
        restoreDialog: false,
        deleteDialog: false,
        showDataClearDialog: false,
        selectedBackup: null,
        
        // Data clearing options
        clearCache: true,
        clearTempFiles: true,
        clearLogs: false,
        
        // Snackbar
        successSnackbar: false,
        snackbarMessage: ''
      }
    },
    methods: {
      downloadBackup(backup) {
        // Implement download logic
        console.log('Downloading backup:', backup.id);
        this.showSnackbar(`Started downloading backup from ${backup.datetime}`);
        
        // Example code for actual download:
        // const url = `${API_URL}/backups/${backup.id}/download`;
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', `backup-${backup.datetime}.zip`);
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      },
      
      restoreBackup(backup) {
        this.selectedBackup = backup;
        this.restoreDialog = true;
      },
      
      confirmRestore() {
        // Implement restore logic
        console.log('Restoring backup:', this.selectedBackup.id);
        
        // Example API call:
        // this.$api.backups.restore(this.selectedBackup.id)
        //   .then(response => {
        //     this.showSnackbar(`Successfully restored backup from ${this.selectedBackup.datetime}`);
        //   })
        //   .catch(error => {
        //     console.error('Error restoring backup:', error);
        //   });
        
        this.restoreDialog = false;
        this.showSnackbar(`Started restoring backup from ${this.selectedBackup.datetime}`);
        this.selectedBackup = null;
      },
      
      deleteBackup(backup) {
        this.selectedBackup = backup;
        this.deleteDialog = true;
      },
      
      confirmDelete() {
        // Implement delete logic
        console.log('Deleting backup:', this.selectedBackup.id);
        
        // Remove from array (this would be replaced with an API call)
        this.backupHistory = this.backupHistory.filter(
          backup => backup.id !== this.selectedBackup.id
        );
        
        this.deleteDialog = false;
        this.showSnackbar(`Successfully deleted backup from ${this.selectedBackup.datetime}`);
        this.selectedBackup = null;
      },
      
      saveBackupSettings() {
        // Implement save settings logic
        console.log('Saving backup settings:', {
          frequency: this.backupFrequency,
          time: this.backupTime,
          includeProjects: this.includeProjects,
          includeFiles: this.includeFiles,
          includeSettings: this.includeSettings
        });
        
        // Example API call:
        // this.$api.backups.updateSettings({
        //   frequency: this.backupFrequency,
        //   time: this.backupTime,
        //   includeProjects: this.includeProjects,
        //   includeFiles: this.includeFiles,
        //   includeSettings: this.includeSettings
        // })
        //   .then(response => {
        //     this.showSnackbar('Backup settings saved successfully');
        //   })
        //   .catch(error => {
        //     console.error('Error saving backup settings:', error);
        //   });
        
        this.showSnackbar('Backup settings saved successfully');
      },
      
      exportData() {
        // Implement export logic
        console.log('Exporting data:', {
          format: this.exportFormat,
          dataType: this.exportDataType
        });
        
        this.showSnackbar(`Started exporting ${this.exportDataType.toLowerCase()} in ${this.exportFormat} format`);
      },
      
      clearTemporaryData() {
        // Implement data clearing logic
        console.log('Clearing temporary data:', {
          clearCache: this.clearCache,
          clearTempFiles: this.clearTempFiles,
          clearLogs: this.clearLogs
        });
        
        // Example API call:
        // this.$api.data.clearTemporary({
        //   clearCache: this.clearCache,
        //   clearTempFiles: this.clearTempFiles,
        //   clearLogs: this.clearLogs
        // })
        //   .then(response => {
        //     this.showSnackbar('Temporary data cleared successfully');
        //   })
        //   .catch(error => {
        //     console.error('Error clearing temporary data:', error);
        //   });
        
        this.showDataClearDialog = false;
        this.showSnackbar('Temporary data cleared successfully');
        
        // For demo purposes, update storage usage
        this.storageUsed = 55;
        this.storageBreakdown[2].usage = '0.4 GB';
        this.storageBreakdown[2].percentage = '2%';
      },
      
      showSnackbar(message) {
        this.snackbarMessage = message;
        this.successSnackbar = true;
      }
    }
  }
  </script>
  
  <style scoped>
  /* Table styling */
  :deep(.v-table) {
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .table-header {
    background-color: #80cbc4 !important;
  }
  
  :deep(.v-table th) {
    font-weight: 600;
    text-transform: none;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.87);
  }
  
  /* Button styling */
  :deep(.v-btn) {
    text-transform: none;
    font-weight: 500;
  }
  
  /* Progress bar styling */
  :deep(.v-progress-linear) {
    border-radius: 4px;
  }
  
  /* Rounded search field */
  :deep(.v-text-field .v-field__outline__start) {
    border-radius: 20px 0 0 20px;
  }
  
  :deep(.v-text-field .v-field__outline__end) {
    border-radius: 0 20px 20px 0;
  }
  </style>