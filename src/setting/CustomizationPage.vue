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
        
        <!-- Customization Title -->
        <div class="customization-container mb-10">
          <h1 class="text-h4 font-weight-bold mb-8">Customization</h1>
          
          <!-- Theme & Appearance Section -->
          <div class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-6">Theme & Appearance</h2>
            
            <div class="mb-8">
              <h3 class="text-subtitle-1 font-weight-bold mb-4">Color Schemes</h3>
              
              <div class="d-flex gap-4">
                <v-btn
                  variant="outlined"
                  color="primary"
                  class="px-4 rounded-pill theme-btn"
                  :class="{ 'active-theme': theme === 'light' }"
                  @click="setTheme('light')"
                >
                  Light mode
                </v-btn>
                
                <v-btn
                  variant="outlined"
                  color="primary"
                  class="px-4 rounded-pill theme-btn"
                  :class="{ 'active-theme': theme === 'dark' }"
                  @click="setTheme('dark')"
                >
                  Dark mode
                </v-btn>
              </div>
            </div>
          </div>
          
          <!-- Notifications & Alerts Section -->
          <div class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-6">Notifications & Alerts</h2>
            
            <div class="mb-8">
              <h3 class="text-subtitle-1 font-weight-bold mb-2">Notification Preferences</h3>
              <p class="text-body-2 mb-6 text-grey">Manage how, when, and where you receive notifications.</p>
              
              <div class="notification-item d-flex justify-space-between align-center mb-4">
                <div class="notification-label">In-App Notifications</div>
                <v-switch
                  v-model="inAppNotifications"
                  color="primary"
                  hide-details
                  class="custom-switch"
                >
                  <template v-slot:label>
                    <span :class="{ 'text-grey': !inAppNotifications }">
                      {{ inAppNotifications ? 'On' : 'Off' }}
                    </span>
                  </template>
                </v-switch>
              </div>
              
              <div class="notification-item d-flex justify-space-between align-center mb-4">
                <div class="notification-label">Email Notifications</div>
                <v-switch
                  v-model="emailNotifications"
                  color="primary"
                  hide-details
                  class="custom-switch"
                >
                  <template v-slot:label>
                    <span :class="{ 'text-grey': !emailNotifications }">
                      {{ emailNotifications ? 'On' : 'Off' }}
                    </span>
                  </template>
                </v-switch>
              </div>
              
              <div class="notification-item d-flex justify-space-between align-center mb-4">
                <div class="notification-label">Push Notifications</div>
                <v-switch
                  v-model="pushNotifications"
                  color="primary"
                  hide-details
                  class="custom-switch"
                >
                  <template v-slot:label>
                    <span :class="{ 'text-grey': !pushNotifications }">
                      {{ pushNotifications ? 'On' : 'Off' }}
                    </span>
                  </template>
                </v-switch>
              </div>
            </div>
            
            <div>
              <h3 class="text-subtitle-1 font-weight-bold mb-2">Custom Alerts</h3>
              <p class="text-body-2 mb-6 text-grey">Set up alerts for specific events or updates.</p>
              
              <div class="d-flex flex-column gap-4">
                <div class="notification-item d-flex justify-space-between align-center">
                  <div class="notification-label">New Task Assigned</div>
                  <v-switch
                    v-model="newTaskAlert"
                    color="primary"
                    hide-details
                    class="custom-switch"
                  >
                    <template v-slot:label>
                      <span :class="{ 'text-grey': !newTaskAlert }">
                        {{ newTaskAlert ? 'On' : 'Off' }}
                      </span>
                    </template>
                  </v-switch>
                </div>
                
                <div class="notification-item d-flex justify-space-between align-center">
                  <div class="notification-label">Due Date Approaching</div>
                  <div class="d-flex align-center gap-4">
                    <v-switch
                      v-model="dueDateAlert"
                      color="primary"
                      hide-details
                      class="custom-switch"
                    >
                      <template v-slot:label>
                        <span :class="{ 'text-grey': !dueDateAlert }">
                          {{ dueDateAlert ? 'On' : 'Off' }}
                        </span>
                      </template>
                    </v-switch>
                    
                    <div class="d-flex align-center">
                      <span class="mr-3">Remind me</span>
                      <v-select
                        v-model="reminderTime"
                        :items="reminderOptions"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="reminder-select"
                        :disabled="!dueDateAlert"
                      />
                    </div>
                  </div>
                </div>
                
                <div class="notification-item d-flex justify-space-between align-center">
                  <div class="notification-label">Status Change on Important Tasks</div>
                  <v-switch
                    v-model="statusChangeAlert"
                    color="primary"
                    hide-details
                    class="custom-switch"
                  >
                    <template v-slot:label>
                      <span :class="{ 'text-grey': !statusChangeAlert }">
                        {{ statusChangeAlert ? 'On' : 'Off' }}
                      </span>
                    </template>
                  </v-switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LeftMenu from '@/dashboard/LeftMenu.vue'

export default {
  name: 'CustomizationPage',
  components: {
    LeftMenu
  },
  data() {
    return {
      sidebarExpanded: true,
      theme: 'light',
      // Notification Preferences
      inAppNotifications: false,
      emailNotifications: false,
      pushNotifications: false,
      // Custom Alerts
      newTaskAlert: false,
      dueDateAlert: false,
      statusChangeAlert: false,
      reminderTime: 'Select',
      reminderOptions: [
        'Select',
        '1 hour before',
        '3 hours before',
        '1 day before',
        '2 days before',
        '1 week before'
      ]
    }
  },
  methods: {
    setTheme(themeName) {
      this.theme = themeName;
      // Here you would implement actual theme change logic
      // For example:
      // document.documentElement.setAttribute('data-theme', themeName);
      // localStorage.setItem('theme', themeName);
      
      // You might also need to notify your app's state management
      // this.$store.dispatch('app/setTheme', themeName);
    },
    saveNotificationSettings() {
      // Here you would save notification settings to your backend
      console.log('Saving notification settings:', {
        inAppNotifications: this.inAppNotifications,
        emailNotifications: this.emailNotifications,
        pushNotifications: this.pushNotifications,
        newTaskAlert: this.newTaskAlert,
        dueDateAlert: this.dueDateAlert,
        statusChangeAlert: this.statusChangeAlert,
        reminderTime: this.reminderTime
      });
      
      // Example API call:
      // this.$api.user.updateSettings({
      //   notifications: {
      //     inApp: this.inAppNotifications,
      //     email: this.emailNotifications,
      //     push: this.pushNotifications,
      //   },
      //   alerts: {
      //     newTask: this.newTaskAlert,
      //     dueDate: {
      //       enabled: this.dueDateAlert,
      //       reminderTime: this.reminderTime
      //     },
      //     statusChange: this.statusChangeAlert
      //   }
      // });
    }
  },
  watch: {
    // Auto-save settings when any notification option changes
    inAppNotifications() { this.saveNotificationSettings(); },
    emailNotifications() { this.saveNotificationSettings(); },
    pushNotifications() { this.saveNotificationSettings(); },
    newTaskAlert() { this.saveNotificationSettings(); },
    dueDateAlert() { this.saveNotificationSettings(); },
    statusChangeAlert() { this.saveNotificationSettings(); },
    reminderTime() { 
      if (this.dueDateAlert) {
        this.saveNotificationSettings(); 
      }
    }
  }
}
</script>

<style scoped>
.notification-label {
  font-size: 16px;
}

.theme-btn {
  height: 40px;
  min-width: 120px;
}

.active-theme {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 500;
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

/* Reminder select styling */
.reminder-select {
  min-width: 150px;
}

:deep(.v-select .v-field) {
  min-height: 40px;
}

/* Rounded search field */
:deep(.v-text-field .v-field__outline__start) {
  border-radius: 20px 0 0 20px;
}

:deep(.v-text-field .v-field__outline__end) {
  border-radius: 0 20px 20px 0;
}
</style>