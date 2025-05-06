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
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4 font-weight-bold">
            Account Settings
          </h1>
          
          <div class="d-flex align-center ga-4">
            <v-text-field
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              style="max-width: 240px;"
            />
            
            <v-btn
              icon
              class="bg-purple-lighten-5"
              color="purple"
            >
              <v-icon>mdi-earth</v-icon>
            </v-btn>
            
            <v-btn
              icon
              class="bg-amber-lighten-5"
              color="amber"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Tabs with router links -->
        <v-tabs
          v-model="tab"
          bg-color="white"
          color="primary"
          class="mb-6"
        >
          <v-tab
            value="profile"
            @click="navigateTo('AccountSetting')"
          >
            Profile Information
          </v-tab>
          <v-tab
            value="password"
            @click="navigateTo('PasswordSecurity')"
          >
            Password and security
          </v-tab>
          <v-tab
            value="notification"
            @click="navigateTo('NotificationPage')"
          >
            Notifications
          </v-tab>
          <v-tab
            value="data-export"
            @click="navigateTo('DataExport')"
          >
            Data Export
          </v-tab>
          <v-tab
            value="log-out"
            @click="navigateTo('LogOut')"
          >
            Logout
          </v-tab>
        </v-tabs>
        
        <!-- Notification Settings Content -->
        <v-card
          flat
          class="pa-0"
        >
          <div class="notification-settings">
            <div class="notification-item">
              <div class="notification-info">
                <h3>Email Notifications</h3>
                <p>Project progress updates, Subscription renewals or reminders</p>
              </div>
              <div class="toggle-container">
                <v-btn
                  :color="emailNotifications ? 'primary' : 'grey'"
                  :class="{ 'text-white': true }"
                  rounded="pill"
                  min-width="70"
                  @click="toggleEmailNotifications"
                >
                  {{ emailNotifications ? 'On' : 'Off' }}
                </v-btn>
              </div>
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <h3>Push Notifications</h3>
                <p>Push notifications on mobile and desktop.</p>
              </div>
              <div class="toggle-container">
                <v-btn
                  :color="pushNotifications ? 'primary' : 'grey'"
                  :class="{ 'text-white': true }"
                  rounded="pill"
                  min-width="70"
                  @click="togglePushNotifications"
                >
                  {{ pushNotifications ? 'On' : 'Off' }}
                </v-btn>
              </div>
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <h3>Account Activity</h3>
                <p>Alerts about login from new devices, password changes, or security issues.</p>
              </div>
              <div class="toggle-container">
                <v-btn
                  :color="accountActivity ? 'primary' : 'grey'"
                  :class="{ 'text-white': true }"
                  rounded="pill"
                  min-width="70"
                  @click="toggleAccountActivity"
                >
                  {{ accountActivity ? 'On' : 'Off' }}
                </v-btn>
              </div>
            </div>
            
            <div class="notification-item">
              <div class="notification-info">
                <h3>Billing Alerts</h3>
                <p>Notifications for upcoming payments, failed transactions.</p>
              </div>
              <div class="toggle-container">
                <v-btn
                  :color="billingAlerts ? 'primary' : 'grey'"
                  :class="{ 'text-white': true }"
                  rounded="pill"
                  min-width="70"
                  @click="toggleBillingAlerts"
                >
                  {{ billingAlerts ? 'On' : 'Off' }}
                </v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LeftMenu from '@/dashboard/LeftMenu.vue'

export default {
  name: 'NotificationPage',
  components: {
    LeftMenu
  },
  data() {
    return {
      sidebarExpanded: true,
      tab: 'notification',
      emailNotifications: false,
      pushNotifications: false,
      accountActivity: false,
      billingAlerts: false
    }
  },
  mounted() {
    // Here you would typically load user settings from API
    // For demo purposes, we're setting them all to off initially
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName });
    },
    toggleEmailNotifications() {
      this.emailNotifications = !this.emailNotifications;
      this.saveNotificationSettings();
    },
    togglePushNotifications() {
      this.pushNotifications = !this.pushNotifications;
      this.saveNotificationSettings();
    },
    toggleAccountActivity() {
      this.accountActivity = !this.accountActivity;
      this.saveNotificationSettings();
    },
    toggleBillingAlerts() {
      this.billingAlerts = !this.billingAlerts;
      this.saveNotificationSettings();
    },
    saveNotificationSettings() {
      // Here you would implement logic to save settings to your backend
      console.log('Saving notification settings:', {
        emailNotifications: this.emailNotifications,
        pushNotifications: this.pushNotifications,
        accountActivity: this.accountActivity,
        billingAlerts: this.billingAlerts
      });
    }
  }
}
</script>

<style scoped>
.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 20px;
  border-bottom: 1px solid #e0e0e0;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-info h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.notification-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.toggle-container {
  display: flex;
  align-items: center;
  margin-left: 20px;
}

/* Override Vuetify button styles for consistency */
:deep(.v-btn.v-btn--density-default) {
  height: 36px;
}
</style>