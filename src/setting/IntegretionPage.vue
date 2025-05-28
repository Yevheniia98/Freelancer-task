<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      сlass="left-menu-component"
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
        <!-- Integrations Title -->
        <div class="integrations-container">
          <h1 class="text-h4 font-weight-bold mb-8">
            Integrations
          </h1>
            
          <!-- Available Integrations Section -->
          <div class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-3">
              Available Integrations
            </h2>
            <p class="text-body-1 mb-6">
              Connect powerful tools to enhance your experience.
            </p>
              
            <div class="d-flex gap-6 mb-8">
              <v-text-field
                v-model="searchIntegrations"
                placeholder="Search Integrations"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="flex-grow-1"
              />
                
              <v-select
                v-model="selectedCategory"
                :items="categories"
                placeholder="Category"
                variant="outlined"
                hide-details
                class="flex-grow-0"
                style="width: 200px;"
                append-icon="mdi-chevron-down"
              />
            </div>
          </div>
            
          <!-- Featured Integrations Section -->
          <div class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-6">
              Featured Integrations
            </h2>
              
            <v-table class="rounded-lg">
              <thead class="table-header bg-teal-lighten-3">
                <tr>
                  <th>Integration</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(integration, index) in featuredIntegrations"
                  :key="index"
                >
                  <td>{{ integration.name }}</td>
                  <td>{{ integration.description }}</td>
                  <td>
                    <v-btn
                      variant="text"
                      :color="integration.connected ? 'error' : 'primary'"
                      @click="toggleConnection(integration)"
                    >
                      {{ integration.connected ? 'Disconnect' : 'Connect' }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
            
          <!-- Integration Cards Section -->
          <div class="mb-8">
            <h2 class="text-h5 font-weight-bold mb-6">
              Integration Cards
            </h2>
              
            <v-table class="rounded-lg">
              <thead class="table-header bg-teal-lighten-3">
                <tr>
                  <th>Logo</th>
                  <th>Integration Name</th>
                  <th>Short Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(card, index) in integrationCards"
                  :key="index"
                >
                  <td class="text-center">
                    <v-img
                      :src="card.logo"
                      width="24"
                      height="24"
                      class="mx-auto"
                    />
                  </td>
                  <td>{{ card.name }}</td>
                  <td>{{ card.description }}</td>
                  <td>
                    <span :class="card.connected ? 'text-primary' : 'text-grey'">
                      {{ card.connected ? 'Connected' : 'Disconnected' }}
                    </span>
                  </td>
                  <td>
                    <v-btn
                      variant="text"
                      :color="card.connected ? 'error' : 'primary'"
                      @click="toggleCardConnection(card)"
                    >
                      {{ card.connected ? 'Disconnect' : 'Connect' }}
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
            
          <!-- Connection & Setup Guide Section -->
          <div>
            <h2 class="text-h5 font-weight-bold mb-6">
              Connection & Setup Guide
            </h2>
              
            <v-table class="rounded-lg">
              <thead class="table-header bg-teal-lighten-3">
                <tr>
                  <th>Step-by-Step Guide</th>
                  <th>Troubleshooting Help</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1. Click Connect</td>
                  <td>Common Issues FAQ</td>
                </tr>
                <tr>
                  <td>2. Sign into [Integration]</td>
                  <td>- Can't connect? Check permissions.</td>
                </tr>
                <tr>
                  <td>3. Allow permissions</td>
                  <td>- Data not syncing? Reconnect</td>
                </tr>
                <tr>
                  <td>4. Adjust settings in Settings</td>
                  <td>
                    Support: <a
                      href="#"
                      class="text-primary"
                    >Contact Us</a>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </div>
          
        <!-- Connection Dialog -->
        <v-dialog
          v-model="connectionDialog"
          max-width="500"
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold">
              {{ dialogAction === 'connect' ? 'Connect to' : 'Disconnect from' }} {{ selectedIntegration?.name }}
            </v-card-title>
              
            <v-card-text class="pt-4">
              <p v-if="dialogAction === 'connect'">
                You are about to connect to {{ selectedIntegration?.name }}. This will allow the application to access your {{ selectedIntegration?.name }} data according to the permissions you approve.
              </p>
              <p v-else>
                You are about to disconnect from {{ selectedIntegration?.name }}. This will revoke all permissions and stop syncing data. You can reconnect at any time.
              </p>
            </v-card-text>
              
            <v-card-actions class="pt-4">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="connectionDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                :color="dialogAction === 'connect' ? 'primary' : 'error'"
                variant="flat"
                @click="confirmConnection"
              >
                {{ dialogAction === 'connect' ? 'Connect' : 'Disconnect' }}
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
    name: 'IntegrationsPage',
    components: {
      LeftMenu,
      SearchBar 
    },
    data() {
      return {
        sidebarExpanded: true,
        searchIntegrations: '',
        selectedCategory: '',
        
        categories: [
          'All',
          'Productivity',
          'Communication',
          'Project Management',
          'Cloud Storage',
          'CRM'
        ],
        
        // Featured integrations
        featuredIntegrations: [
          {
            id: 1,
            name: 'Slack',
            description: 'Streamline team communication.',
            connected: true
          },
          {
            id: 2,
            name: 'Google Drive',
            description: 'Access files from anywhere.',
            connected: false
          },
          {
            id: 3,
            name: 'Trello',
            description: 'Manage projects and tasks effectively.',
            connected: false
          }
        ],
        
        // Integration cards
        integrationCards: [
          {
            id: 1,
            name: 'Slack',
            description: 'Streamline team communication.',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
            connected: true
          }
        ],
        
        // Dialog controls
        connectionDialog: false,
        dialogAction: 'connect',
        selectedIntegration: null,
        
        // Snackbar
        successSnackbar: false,
        snackbarMessage: ''
      }
    },
    watch: {
      searchIntegrations() {
        this.filterIntegrations();
      },
      selectedCategory() {
        this.filterIntegrations();
      }
    },
    methods: {
      toggleConnection(integration) {
        this.selectedIntegration = integration;
        this.dialogAction = integration.connected ? 'disconnect' : 'connect';
        this.connectionDialog = true;
      },
      
      toggleCardConnection(card) {
        this.selectedIntegration = card;
        this.dialogAction = card.connected ? 'disconnect' : 'connect';
        this.connectionDialog = true;
      },
      
      confirmConnection() {
        // Here you would implement actual connection/disconnection logic
        // For example:
        // if (this.dialogAction === 'connect') {
        //   this.$api.integrations.connect(this.selectedIntegration.id)
        //     .then(response => {
        //       this.selectedIntegration.connected = true;
        //     });
        // } else {
        //   this.$api.integrations.disconnect(this.selectedIntegration.id)
        //     .then(response => {
        //       this.selectedIntegration.connected = false;
        //     });
        // }
        
        // For demo, we'll just toggle the connected property
        if (this.dialogAction === 'connect') {
          this.selectedIntegration.connected = true;
          this.snackbarMessage = `Successfully connected to ${this.selectedIntegration.name}`;
        } else {
          this.selectedIntegration.connected = false;
          this.snackbarMessage = `Successfully disconnected from ${this.selectedIntegration.name}`;
        }
        
        // Close dialog and show success message
        this.connectionDialog = false;
        this.successSnackbar = true;
      },
      
      filterIntegrations() {
        // Here you would implement filtering logic based on search term and category
        console.log('Filtering integrations:', {
          search: this.searchIntegrations,
          category: this.selectedCategory
        });
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

  :deep(.left-menu-component),
  :deep(.v-navigation-drawer) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    z-index: 999 !important;
    overflow-y: hidden !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
 :deep(.v-navigation-drawer--rail) {
    width: 72px !important;
  }
  
  :deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
    width: 240px !important;
  }
  
  /* Button styling */
  :deep(.v-btn) {
    text-transform: none;
    font-weight: 500;
  }
  
  /* Rounded search field */
  :deep(.v-text-field .v-field__outline__start) {
    border-radius: 8px 0 0 8px;
  }
  
  :deep(.v-text-field .v-field__outline__end) {
    border-radius: 0 8px 8px 0;
  }
  </style>