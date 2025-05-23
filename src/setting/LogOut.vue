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
          
        <!-- Navigation Tabs -->
        <v-tabs
          v-model="tab"
          bg-color="white"
          color="primary"
          class="mb-10"
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
            value="export"
            @click="navigateTo('DataExport')"
          >
            Data Export
          </v-tab>
          <v-tab
            value="logout"
            @click="navigateTo('LogoutPage')"
          >
            Logout
          </v-tab>
        </v-tabs>
          
        <!-- Logout Confirmation Section -->
        <div class="logout-section">
          <h2 class="text-h5 font-weight-bold mb-16">
            Logout Confirmation Page
          </h2>
            
          <div class="logout-confirmation d-flex flex-column align-center">
            <h3 class="text-h5 font-weight-bold mb-6 text-center">
              Are You Sure You Want to Log Out?
            </h3>
              
            <p
              class="text-body-1 text-center mb-10 text-grey"
              style="max-width: 400px;"
            >
              Logging out will end your current session, and you'll need to log in again to access your account.
            </p>
              
            <div class="d-flex ga-6">
              <v-btn
                color="error"
                width="160"
                height="48"
                rounded="lg"
                @click="logout"
              >
                Logout
              </v-btn>
                
              <v-btn
                color="white"
                width="160"
                height="48"
                rounded="lg"
                variant="outlined"
                class="border-grey"
                @click="cancel"
              >
                Cancel
              </v-btn>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  import  SearchBar from '@/dashboard/SearchBar.vue';
  
  export default {
    name: 'LogoutPage',
    components: {
      LeftMenu,
      SearchBar
    },
    data() {
      return {
        sidebarExpanded: true,
        tab: 'logout'
      }
    },
    methods: {
      navigateTo(routeName) {
        this.$router.push({ name: routeName });
      },
      logout() {
        // Implement logout logic here
        console.log('Logging out...');
        
        // Example logout implementation:
        try {
          // 1. Clear user token from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // 2. Clear session storage
          sessionStorage.clear();
          
          // 3. If using Vuex/Pinia, dispatch logout action
          // this.$store.dispatch('auth/logout').then(() => {
          //   this.$router.push({ name: 'Login' });
          // });
          
          // 4. Navigate to login page
          this.$router.push({ name: 'Login' });
          
          // 5. Optional: Show success message
          // this.$toast.success('You have been logged out successfully');
          
        } catch (error) {
          console.error('Logout error:', error);
          // Handle logout error
          // this.$toast.error('Error logging out');
        }
      },
      cancel() {
        // Navigate back to the previous page or dashboard
        this.$router.push({ name: 'Dashboard' });
      }
    }
  }
  </script>
  
  <style scoped>
  .logout-section {
    padding-top: 40px;
    max-width: 1200px;
  }
  
  .logout-confirmation {
    padding-top: 60px;
  }
  
  .border-grey {
    border-color: #e0e0e0 !important;
  }
  
  :deep(.v-btn) {
    text-transform: none;
    font-weight: 500;
  }
  
  :deep(.v-btn--density-default) {
    height: 48px;
  }
  </style>