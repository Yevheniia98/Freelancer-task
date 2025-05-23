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
            value="export"
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
          
        <!-- Data Export Section -->
        <div class="data-export-section">
          <h2 class="text-h5 font-weight-bold mb-6">
            Data Export
          </h2>
            
          <!-- Export Controls -->
          <div class="export-controls d-flex align-center mb-10 ga-4">
            <v-select
              v-model="selectedData"
              :items="dataOptions"
              label="Choose data"
              variant="outlined"
              density="comfortable"
              class="select-field"
              hide-details
            />
              
            <v-select
              v-model="selectedFormat"
              :items="formatOptions"
              label="Choose file format"
              variant="outlined"
              density="comfortable"
              class="select-field"
              hide-details
            />
              
            <v-select
              v-model="dateRange"
              :items="dateRangeOptions"
              label="Date range"
              variant="outlined"
              density="comfortable"
              class="select-field"
              hide-details
            />
              
            <v-btn
              color="primary"
              class="mt-1"
              height="40"
              @click="exportData"
            >
              Export
            </v-btn>
          </div>
            
          <!-- Automated Exports Section -->
          <h3 class="text-h6 font-weight-bold mb-4">
            Automated Exports
          </h3>
            
          <div class="d-flex ga-6 mb-10">
            <v-select
              v-model="weeklyExport"
              :items="exportFrequencyOptions"
              label="Export data every week"
              variant="outlined"
              density="comfortable"
              class="select-field"
              hide-details
            />
              
            <v-select
              v-model="monthlyExport"
              :items="exportFrequencyOptions"
              label="Export data every month"
              variant="outlined"
              density="comfortable"
              class="select-field"
              hide-details
            />
          </div>
            
          <!-- Data Retention Policy Section -->
          <h3 class="text-h6 font-weight-bold mb-4">
            Data Retention Policy
          </h3>
            
          <v-card
            flat
            class="pa-6 bg-grey-lighten-5"
          >
            <p class="mb-6">
              At Pro-Tasker, we take data privacy and security seriously. Below is our policy regarding data retention, archiving, and deletion:
            </p>
              
            <ul class="retention-list pl-4">
              <li class="mb-4">
                <span class="font-weight-bold">Data Retention Period</span>. We retain your account data, including project details, financial records, and task history, for 12 months after the cancellation of your subscription. After this period, all data will be permanently deleted.
              </li>
                
              <li class="mb-4">
                <span class="font-weight-bold">Archived Data</span>. After cancellation, your data may be archived for up to 3 months. During this time, you can request access to your archived data by reactivating your account.
              </li>
                
              <li class="mb-4">
                <span class="font-weight-bold">Permanent Deletion</span>. If you do not reactivate your account within the archival period, all associated data will be permanently deleted. This includes all project files, task logs, and financial reports.
              </li>
                
              <li>
                <span class="font-weight-bold">Export Your Data</span>. Before canceling, please export any important information using the Data Export feature to avoid losing access to your project and financial data.
              </li>
            </ul>
          </v-card>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  import SearchBar from '@/dashboard/SearchBar.vue';
  
  export default {
    name: 'DataExport',
    components: {
      LeftMenu,
      SearchBar
    },
    data() {
      return {
        sidebarExpanded: true,
        tab: 'export',
        selectedData: '',
        dataOptions: [
          'All Data',
          'Projects Only',
          'Financial Records',
          'Task History',
          'User Profiles'
        ],
        selectedFormat: '',
        formatOptions: [
          'CSV',
          'JSON',
          'Excel (XLSX)',
          'PDF'
        ],
        dateRange: '',
        dateRangeOptions: [
          'Last 30 days',
          'Last 90 days',
          'Last 6 months',
          'Last Year',
          'All Time'
        ],
        weeklyExport: '',
        monthlyExport: '',
        exportFrequencyOptions: [
          'Disabled',
          'Email',
          'Download to Cloud Storage',
          'FTP Transfer'
        ]
      }
    },
    methods: {
      navigateTo(routeName) {
        this.$router.push({ name: routeName });
      },
      exportData() {
        console.log('Exporting data...', {
          selectedData: this.selectedData,
          selectedFormat: this.selectedFormat,
          dateRange: this.dateRange
        });
        // Add your export logic here
      }
    }
  }
  </script>
  
  <style scoped>
  .data-export-section {
    max-width: 1200px;
  }
  
  .export-controls {
    flex-wrap: wrap;
  }
  
  .select-field {
    min-width: 200px;
    flex: 0 0 auto;
  }
  
  .retention-list {
    list-style-type: disc;
  }
  
  .retention-list li {
    line-height: 1.6;
  }
  
  /* Override Vuetify select field height */
  :deep(.v-text-field .v-field--density-default) {
    --v-field-height: 40px;
  }
  
  :deep(.v-select .v-field--density-comfortable) {
    --v-field-height: 40px;
  }
  </style>