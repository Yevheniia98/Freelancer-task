<template>
    <v-app>
      <LeftMenu
        :rail="!sidebarExpanded"
        @update:rail="sidebarExpanded = !$event"
      />
      
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
          
          <!-- Security & Privacy Title -->
          <div class="security-container mb-10">
            <h1 class="text-h4 font-weight-bold mb-8">Security & Privacy</h1>
            
            <!-- Connected Devices Section -->
            <div class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-3">Connected Devices</h2>
              
              <div class="mb-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Active Sessions</h3>
                <p class="text-body-2 mb-4 text-grey">
                  Displays all devices currently logged into the user's account, including information like device type, location, and last active time.
                </p>
                
                <v-table class="rounded-lg">
                  <thead class="table-header bg-teal-lighten-4">
                    <tr>
                      <th>Device</th>
                      <th>Location</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(device, index) in activeDevices" :key="index">
                      <td>{{ device.name }}</td>
                      <td>{{ device.location }}</td>
                      <td>{{ device.lastActive }}</td>
                      <td>
                        <v-btn
                          variant="text"
                          color="error"
                          density="compact"
                          @click="signOutDevice(device)"
                        >
                          Sign Out
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            
            <!-- App Permissions Section -->
            <div class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-3">App Permissions & Integrations</h2>
              
              <div class="mb-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Connected Third-Party Apps</h3>
                <p class="text-body-2 mb-4 text-grey">
                  Here you can see all the apps and services connected to your account. Each one shows what type of access it has (like your profile or files) and when it was connected. If you no longer use an app, you can easily remove its access with the 'Revoke Access' button next to it.
                </p>
                
                <v-table class="rounded-lg">
                  <thead class="table-header bg-teal-lighten-4">
                    <tr>
                      <th>App Name</th>
                      <th>Access Granted</th>
                      <th>Connected Since</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(app, index) in connectedApps" :key="index">
                      <td>{{ app.name }}</td>
                      <td>{{ app.access }}</td>
                      <td>{{ app.connectedSince }}</td>
                      <td>
                        <v-btn
                          variant="text"
                          color="error"
                          density="compact"
                          @click="revokeAccess(app)"
                        >
                          Revoke Access
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </div>
            
            <!-- Security Notifications Section -->
            <div>
              <h2 class="text-h5 font-weight-bold mb-3">Security Notifications</h2>
              
              <div>
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Email Alerts for Suspicious Activity</h3>
                <p class="text-body-2 mb-4 text-grey">
                  Toggle to receive notifications about suspicious login attempts or changes to account security settings.
                </p>
                
                <div class="d-flex align-center">
                  <v-switch
                    v-model="securityNotifications"
                    color="primary"
                    hide-details
                    class="custom-switch mr-4"
                  >
                    <template v-slot:label>
                      <span :class="{ 'text-grey': !securityNotifications }">
                        {{ securityNotifications ? 'On' : 'Off' }}
                      </span>
                    </template>
                  </v-switch>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Confirmation Dialogs -->
          <v-dialog
            v-model="confirmSignOutDialog"
            max-width="500"
          >
            <v-card class="pa-6">
              <v-card-title class="text-h5 font-weight-bold">
                Sign Out Device
              </v-card-title>
              
              <v-card-text class="pt-4">
                Are you sure you want to sign out of {{ selectedDevice?.name }} in {{ selectedDevice?.location }}?
              </v-card-text>
              
              <v-card-actions class="pt-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey-darken-1"
                  variant="text"
                  @click="confirmSignOutDialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="error"
                  variant="flat"
                  @click="confirmSignOut"
                >
                  Sign Out
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          
          <v-dialog
            v-model="confirmRevokeDialog"
            max-width="500"
          >
            <v-card class="pa-6">
              <v-card-title class="text-h5 font-weight-bold">
                Revoke Access
              </v-card-title>
              
              <v-card-text class="pt-4">
                Are you sure you want to revoke access for {{ selectedApp?.name }}? This app will no longer have access to your {{ selectedApp?.access.toLowerCase() }}.
              </v-card-text>
              
              <v-card-actions class="pt-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="grey-darken-1"
                  variant="text"
                  @click="confirmRevokeDialog = false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="error"
                  variant="flat"
                  @click="confirmRevoke"
                >
                  Revoke Access
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
            <template v-slot:actions>
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
  import LeftMenu from '@/dashboard/LeftMenu.vue'
  
  export default {
    name: 'SecurityPrivacyPage',
    components: {
      LeftMenu
    },
    data() {
      return {
        sidebarExpanded: true,
        securityNotifications: false,
        
        // Active devices
        activeDevices: [
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
        ],
        
        // Connected apps
        connectedApps: [
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
        ],
        
        // Dialog controls
        confirmSignOutDialog: false,
        confirmRevokeDialog: false,
        selectedDevice: null,
        selectedApp: null,
        
        // Snackbar
        successSnackbar: false,
        snackbarMessage: ''
      }
    },
    methods: {
      signOutDevice(device) {
        this.selectedDevice = device;
        this.confirmSignOutDialog = true;
      },
      
      confirmSignOut() {
        // Here you would implement actual sign out logic
        // Example API call:
        // this.$api.security.signOutDevice(this.selectedDevice.id)
        //   .then(response => {
        //     // Handle success
        //     this.activeDevices = this.activeDevices.filter(device => device.id !== this.selectedDevice.id);
        //   })
        //   .catch(error => {
        //     console.error('Error signing out device:', error);
        //   });
        
        // For demo, we'll just remove it from the array
        this.activeDevices = this.activeDevices.filter(device => device.id !== this.selectedDevice.id);
        
        // Close dialog and show success message
        this.confirmSignOutDialog = false;
        this.snackbarMessage = `Successfully signed out of ${this.selectedDevice.name}`;
        this.successSnackbar = true;
        this.selectedDevice = null;
      },
      
      revokeAccess(app) {
        this.selectedApp = app;
        this.confirmRevokeDialog = true;
      },
      
      confirmRevoke() {
        // Here you would implement actual revoke access logic
        // Example API call:
        // this.$api.security.revokeAccess(this.selectedApp.id)
        //   .then(response => {
        //     // Handle success
        //     this.connectedApps = this.connectedApps.filter(app => app.id !== this.selectedApp.id);
        //   })
        //   .catch(error => {
        //     console.error('Error revoking access:', error);
        //   });
        
        // For demo, we'll just remove it from the array
        this.connectedApps = this.connectedApps.filter(app => app.id !== this.selectedApp.id);
        
        // Close dialog and show success message
        this.confirmRevokeDialog = false;
        this.snackbarMessage = `Successfully revoked access for ${this.selectedApp.name}`;
        this.successSnackbar = true;
        this.selectedApp = null;
      },
      
      toggleSecurityNotifications() {
        // Here you would save the user's preference
        console.log('Security notifications:', this.securityNotifications);
        
        // Example API call:
        // this.$api.user.updateSecuritySettings({
        //   emailAlerts: this.securityNotifications
        // });
      }
    },
    watch: {
      securityNotifications() {
        this.toggleSecurityNotifications();
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
  
  /* Switch styling */
  :deep(.v-switch) {
    min-width: 100px;
  }
  
  :deep(.v-switch .v-selection-control__wrapper) {
    margin-inline-end: 6px;
  }
  
  :deep(.v-switch .v-selection-control) {
    min-height: 24px;
  }
  
  :deep(.v-switch .v-label) {
    font-size: 14px;
    opacity: 1;
  }
  
  /* Rounded search field */
  :deep(.v-text-field .v-field__outline__start) {
    border-radius: 20px 0 0 20px;
  }
  
  :deep(.v-text-field .v-field__outline__end) {
    border-radius: 0 20px 20px 0;
  }
  </style>