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
            Integrations
          </h1>
          <p
            class="text-body-1"
            style="color: #6b7280;"
          >
            Connect powerful tools and services to enhance your workflow and productivity
          </p>
        </div>
        
        <!-- Search and Filter Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Available Integrations
          </h3>
          <p class="section-description mb-6">
            Discover and connect with your favorite tools to streamline your workflow.
          </p>
          
          <div class="search-filter-section">
            <div class="search-input">
              <v-text-field
                v-model="searchIntegrations"
                placeholder="Search integrations..."
                variant="outlined"
                hide-details
                class="modern-input"
                density="comfortable"
                prepend-inner-icon="mdi-magnify"
              />
            </div>
            <div class="category-select">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                placeholder="All Categories"
                variant="outlined"
                hide-details
                class="modern-select"
                density="comfortable"
              />
            </div>
          </div>
        </div>
        
        <!-- Featured Integrations Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Featured Integrations
          </h3>
          <p class="section-description mb-8">
            Popular integrations that work seamlessly with your workflow.
          </p>
          
          <div class="integrations-grid">
            <div 
              v-for="(integration, index) in featuredIntegrations"
              :key="index"
              class="integration-card"
              :class="{ 'connected': integration.connected }"
            >
              <div class="integration-header">
                <div class="integration-icon">
                  <v-icon
                    :color="getIntegrationColor(integration.name)"
                    size="32"
                  >
                    {{ getIntegrationIcon(integration.name) }}
                  </v-icon>
                </div>
                <div class="connection-status">
                  <v-chip 
                    :color="integration.connected ? 'success' : 'grey'" 
                    size="small" 
                    variant="flat"
                  >
                    {{ integration.connected ? 'Connected' : 'Available' }}
                  </v-chip>
                </div>
              </div>
              
              <div class="integration-content">
                <h4 class="integration-name">
                  {{ integration.name }}
                </h4>
                <p class="integration-description">
                  {{ integration.description }}
                </p>
              </div>
              
              <div class="integration-actions">
                <button 
                  class="btn"
                  :class="integration.connected ? 'btn-danger-outline' : 'btn-primary'"
                  @click="toggleConnection(integration)"
                >
                  <v-icon
                    class="mr-2"
                    size="16"
                  >
                    {{ integration.connected ? 'mdi-link-off' : 'mdi-link' }}
                  </v-icon>
                  {{ integration.connected ? 'Disconnect' : 'Connect' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- All Integrations Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            All Integrations
          </h3>
          
          <div class="integrations-table">
            <div class="table-header">
              <div class="table-cell">
                Integration
              </div>
              <div class="table-cell">
                Description
              </div>
              <div class="table-cell">
                Category
              </div>
              <div class="table-cell">
                Status
              </div>
              <div class="table-cell">
                Actions
              </div>
            </div>
            
            <div 
              v-for="(integration, index) in allIntegrations"
              :key="index"
              class="table-row"
            >
              <div class="table-cell">
                <div class="integration-info">
                  <div class="integration-avatar">
                    <v-icon
                      :color="getIntegrationColor(integration.name)"
                      size="24"
                    >
                      {{ getIntegrationIcon(integration.name) }}
                    </v-icon>
                  </div>
                  <div class="integration-details">
                    <span class="integration-title">{{ integration.name }}</span>
                    <span class="integration-subtitle">{{ integration.company }}</span>
                  </div>
                </div>
              </div>
              <div class="table-cell">
                <span class="integration-desc">{{ integration.description }}</span>
              </div>
              <div class="table-cell">
                <v-chip
                  size="small"
                  variant="outlined"
                  color="primary"
                >
                  {{ integration.category }}
                </v-chip>
              </div>
              <div class="table-cell">
                <div class="status-indicator">
                  <div
                    class="status-dot"
                    :class="{ 'connected': integration.connected }"
                  />
                  <span class="status-text">{{ integration.connected ? 'Connected' : 'Available' }}</span>
                </div>
              </div>
              <div class="table-cell">
                <button 
                  class="btn btn-text"
                  :class="integration.connected ? 'btn-danger-text' : 'btn-primary-text'"
                  @click="toggleConnection(integration)"
                >
                  {{ integration.connected ? 'Disconnect' : 'Connect' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Setup Guide Section -->
        <div class="content-card">
          <h3 class="section-title mb-6">
            Connection & Setup Guide
          </h3>
          <p class="section-description mb-8">
            Follow these steps to connect your integrations and troubleshoot common issues.
          </p>
          
          <div class="guide-grid">
            <div class="guide-card">
              <div class="guide-icon">
                <v-icon
                  color="#0C9C8D"
                  size="24"
                >
                  mdi-numeric-1-circle
                </v-icon>
              </div>
              <div class="guide-content">
                <h4 class="guide-title">
                  Connect Integration
                </h4>
                <p class="guide-description">
                  Click the "Connect" button next to your desired integration
                </p>
              </div>
            </div>
            
            <div class="guide-card">
              <div class="guide-icon">
                <v-icon
                  color="#0C9C8D"
                  size="24"
                >
                  mdi-numeric-2-circle
                </v-icon>
              </div>
              <div class="guide-content">
                <h4 class="guide-title">
                  Authenticate
                </h4>
                <p class="guide-description">
                  Sign into the service and authorize the connection
                </p>
              </div>
            </div>
            
            <div class="guide-card">
              <div class="guide-icon">
                <v-icon
                  color="#0C9C8D"
                  size="24"
                >
                  mdi-numeric-3-circle
                </v-icon>
              </div>
              <div class="guide-content">
                <h4 class="guide-title">
                  Configure Settings
                </h4>
                <p class="guide-description">
                  Customize sync preferences and permissions
                </p>
              </div>
            </div>
            
            <div class="guide-card">
              <div class="guide-icon">
                <v-icon
                  color="#0C9C8D"
                  size="24"
                >
                  mdi-help-circle
                </v-icon>
              </div>
              <div class="guide-content">
                <h4 class="guide-title">
                  Need Help?
                </h4>
                <p class="guide-description">
                  Check our <a
                    href="#"
                    class="help-link"
                  >troubleshooting guide</a> or contact support
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Connection Dialog -->
        <v-dialog
          v-model="connectionDialog"
          max-width="500"
          persistent
        >
          <v-card class="connection-dialog">
            <div class="dialog-header">
              <div
                class="action-icon"
                :class="{ 'connect': dialogAction === 'connect', 'disconnect': dialogAction === 'disconnect' }"
              >
                <v-icon
                  color="white"
                  size="24"
                >
                  {{ dialogAction === 'connect' ? 'mdi-link' : 'mdi-link-off' }}
                </v-icon>
              </div>
              <h3 class="dialog-title">
                {{ dialogAction === 'connect' ? 'Connect to' : 'Disconnect from' }} {{ selectedIntegration?.name }}
              </h3>
            </div>
            
            <div class="dialog-content">
              <p
                v-if="dialogAction === 'connect'"
                class="dialog-message"
              >
                You are about to connect to <strong>{{ selectedIntegration?.name }}</strong>. This will allow the application to access your {{ selectedIntegration?.name }} data according to the permissions you approve.
              </p>
              <p
                v-else
                class="dialog-message"
              >
                You are about to disconnect from <strong>{{ selectedIntegration?.name }}</strong>. This will revoke all permissions and stop syncing data. You can reconnect at any time.
              </p>
              
              <div
                v-if="dialogAction === 'connect'"
                class="permission-note"
              >
                <v-icon
                  color="#0C9C8D"
                  size="20"
                  class="mr-3"
                >
                  mdi-information
                </v-icon>
                <span>You'll be redirected to {{ selectedIntegration?.name }} to authorize this connection.</span>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="connectionDialog = false"
              >
                Cancel
              </button>
              <button 
                class="btn"
                :class="dialogAction === 'connect' ? 'btn-primary' : 'btn-danger'"
                @click="confirmConnection"
              >
                <v-icon
                  class="mr-2"
                  size="16"
                >
                  {{ dialogAction === 'connect' ? 'mdi-link' : 'mdi-link-off' }}
                </v-icon>
                {{ dialogAction === 'connect' ? 'Connect' : 'Disconnect' }}
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
import { ref, onMounted } from 'vue'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// States
const sidebarExpanded = ref(true)
const searchIntegrations = ref('')
const selectedCategory = ref('')
const connectionDialog = ref(false)
const dialogAction = ref('connect')
const selectedIntegration = ref(null)
const successSnackbar = ref(false)
const snackbarMessage = ref('')

// Data
const categories = [
  'All Categories',
  'Freelance Platform',
  'Productivity',
  'Communication',
  'Project Management',
  'Cloud Storage',
  'CRM',
  'Development'
]

const featuredIntegrations = ref([
  {
    id: 1,
    name: 'Upwork',
    description: 'Connect your Upwork account to sync projects and contracts',
    connected: false,
    category: 'Freelance Platform'
  },
  {
    id: 2,
    name: 'Freelancer',
    description: 'Connect your Freelancer.com account to sync projects and manage bids',
    connected: false,
    category: 'Freelance Platform'
  },
  {
    id: 3,
    name: 'Slack',
    description: 'Streamline team communication and collaboration',
    connected: true,
    category: 'Communication'
  },
  {
    id: 4,
    name: 'Google Drive',
    description: 'Access and sync your files from anywhere',
    connected: false,
    category: 'Cloud Storage'
  },
  {
    id: 5,
    name: 'Trello',
    description: 'Manage projects and tasks effectively',
    connected: false,
    category: 'Project Management'
  },
  {
    id: 6,
    name: 'GitHub',
    description: 'Connect your repositories and track development',
    connected: true,
    category: 'Development'
  }
])

const allIntegrations = ref([
  {
    id: 1,
    name: 'Upwork',
    company: 'Upwork Inc.',
    description: 'Freelance platform for connecting with clients and managing projects',
    category: 'Freelance Platform',
    connected: false
  },
  {
    id: 2,
    name: 'Freelancer',
    company: 'Freelancer Technology Pty Limited',
    description: 'Global freelancing platform for finding work and hiring professionals',
    category: 'Freelance Platform',
    connected: false
  },
  {
    id: 3,
    name: 'Slack',
    company: 'Slack Technologies',
    description: 'Team collaboration and messaging platform',
    category: 'Communication',
    connected: true
  },
  {
    id: 4,
    name: 'Google Drive',
    company: 'Google',
    description: 'Cloud storage and file synchronization service',
    category: 'Cloud Storage',
    connected: false
  },
  {
    id: 5,
    name: 'Trello',
    company: 'Atlassian',
    description: 'Visual project management and organization tool',
    category: 'Project Management',
    connected: false
  },
  {
    id: 6,
    name: 'GitHub',
    company: 'Microsoft',
    description: 'Code repository hosting and version control',
    category: 'Development',
    connected: true
  },
  {
    id: 7,
    name: 'Zoom',
    company: 'Zoom Video',
    description: 'Video conferencing and virtual meetings',
    category: 'Communication',
    connected: false
  },
  {
    id: 7,
    name: 'Salesforce',
    company: 'Salesforce',
    description: 'Customer relationship management platform',
    category: 'CRM',
    connected: false
  }
])

// Methods
const getIntegrationIcon = (name) => {
  const icons = {
    'Upwork': 'mdi-briefcase-account',
    'Slack': 'mdi-slack',
    'Google Drive': 'mdi-google-drive',
    'Trello': 'mdi-trello',
    'GitHub': 'mdi-github',
    'Zoom': 'mdi-video',
    'Salesforce': 'mdi-salesforce'
  }
  return icons[name] || 'mdi-application'
}

const getIntegrationColor = (name) => {
  const colors = {
    'Upwork': '#14a800',
    'Slack': '#4a154b',
    'Google Drive': '#4285f4',
    'Trello': '#0079bf',
    'GitHub': '#333333',
    'Zoom': '#2d8cff',
    'Salesforce': '#00a1e0'
  }
  return colors[name] || '#0C9C8D'
}

const toggleConnection = (integration) => {
  if (integration.name === 'Upwork') {
    // Handle Upwork OAuth flow
    handleUpworkConnection(integration)
  } else if (integration.name === 'Freelancer') {
    // Handle Freelancer OAuth flow
    handleFreelancerConnection(integration)
  } else {
    // Handle other integrations with dialog
    selectedIntegration.value = integration
    dialogAction.value = integration.connected ? 'disconnect' : 'connect'
    connectionDialog.value = true
  }
}

const handleUpworkConnection = async (integration) => {
  if (integration.connected) {
    // Disconnect Upwork
    selectedIntegration.value = integration
    dialogAction.value = 'disconnect'
    connectionDialog.value = true
  } else {
    // Start Upwork OAuth flow
    try {
      const token = localStorage.getItem('auth_token')
      console.log('Token found:', !!token)
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'null')
      
      if (!token) {
        snackbarMessage.value = 'You need to be logged in to connect integrations.'
        successSnackbar.value = true
        return
      }
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'
      const response = await fetch(`${apiBaseUrl}/integrations/upwork/oauth/initiate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Success data:', data)
        // Redirect to Upwork OAuth
        window.location.href = data.data.authUrl
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        snackbarMessage.value = `Failed to connect to Upwork: ${errorData.message}`
        successSnackbar.value = true
      }
    } catch (error) {
      console.error('Error starting Upwork OAuth:', error)
      snackbarMessage.value = 'Failed to connect to Upwork. Please try again.'
      successSnackbar.value = true
    }
  }
}

const handleFreelancerConnection = async (integration) => {
  if (integration.connected) {
    // Disconnect Freelancer
    selectedIntegration.value = integration
    dialogAction.value = 'disconnect'
    connectionDialog.value = true
  } else {
    // Start Freelancer OAuth flow
    try {
      const token = localStorage.getItem('auth_token')
      console.log('Token found for Freelancer:', !!token)
      
      if (!token) {
        snackbarMessage.value = 'You need to be logged in to connect integrations.'
        successSnackbar.value = true
        return
      }
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'
      const response = await fetch(`${apiBaseUrl}/integrations/freelancer/oauth/initiate`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Freelancer response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Freelancer success data:', data)
        // Redirect to Freelancer OAuth (mock)
        window.location.href = data.data.authUrl
      } else {
        const errorData = await response.json()
        console.error('Freelancer error response:', errorData)
        snackbarMessage.value = `Failed to connect to Freelancer: ${errorData.message}`
        successSnackbar.value = true
      }
    } catch (error) {
      console.error('Error starting Freelancer OAuth:', error)
      snackbarMessage.value = 'Failed to connect to Freelancer. Please try again.'
      successSnackbar.value = true
    }
  }
}

const confirmConnection = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (dialogAction.value === 'connect') {
      selectedIntegration.value.connected = true
      snackbarMessage.value = `Successfully connected to ${selectedIntegration.value.name}`
    } else {
      selectedIntegration.value.connected = false
      snackbarMessage.value = `Successfully disconnected from ${selectedIntegration.value.name}`
    }
    
    // Update in both arrays if needed
    const featuredIndex = featuredIntegrations.value.findIndex(item => item.id === selectedIntegration.value.id)
    if (featuredIndex !== -1) {
      featuredIntegrations.value[featuredIndex].connected = selectedIntegration.value.connected
    }
    
    const allIndex = allIntegrations.value.findIndex(item => item.id === selectedIntegration.value.id)
    if (allIndex !== -1) {
      allIntegrations.value[allIndex].connected = selectedIntegration.value.connected
    }
    
    connectionDialog.value = false
    successSnackbar.value = true
    
    setTimeout(() => {
      successSnackbar.value = false
    }, 3000)
  } catch (error) {
    console.error('Error toggling connection:', error)
  }
}

const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const success = urlParams.get('success')
  const platform = urlParams.get('platform')
  const message = urlParams.get('message')
  
  // Handle OAuth success/error from backend redirect
  if (success === 'true') {
    // Update connection status for the specific platform
    const platformName = platform === 'upwork' ? 'Upwork' : platform === 'freelancer' ? 'Freelancer' : null
    
    if (platformName) {
      const featuredIntegration = featuredIntegrations.value.find(i => i.name === platformName)
      const allIntegration = allIntegrations.value.find(i => i.name === platformName)
      
      if (featuredIntegration) {
        featuredIntegration.connected = true
      }
      if (allIntegration) {
        allIntegration.connected = true
      }
      
      snackbarMessage.value = `Successfully connected to ${platformName}! Syncing your projects...`
      successSnackbar.value = true
      
      // Trigger automatic sync for the platform
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'
        const response = await fetch(`${apiBaseUrl}/integrations/sync/${platform}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          snackbarMessage.value = `Successfully connected to ${platformName} and synced ${data.data.projectsSynced || 0} projects!`
        }
      } catch (error) {
        console.error('Error syncing projects:', error)
        snackbarMessage.value = `Connected to ${platformName} but failed to sync projects. You can manually sync later.`
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  } else if (success === 'false') {
    snackbarMessage.value = message || 'Failed to connect to the platform'
    successSnackbar.value = true
    
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname)
  }
}

onMounted(() => {
  handleOAuthCallback()
})
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

/* Search and Filter Section */
.search-filter-section {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 16px;
}

@media (max-width: 768px) {
  .search-filter-section {
    grid-template-columns: 1fr;
  }
}

/* Form Styles */
.modern-input :deep(.v-field),
.modern-select :deep(.v-field) {
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: white;
  font-size: 15px;
}

.modern-input :deep(.v-field--focused),
.modern-select :deep(.v-field--focused) {
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

.modern-input :deep(.v-field:hover),
.modern-select :deep(.v-field:hover) {
  border-color: #9ca3af;
}

.modern-input :deep(.v-field__input),
.modern-select :deep(.v-field__input) {
  padding: 12px 16px;
  min-height: 48px;
}

/* Integration Cards Grid */
.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.integration-card {
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.integration-card:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.integration-card.connected {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.02);
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.integration-icon {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.integration-content {
  margin-bottom: 20px;
}

.integration-name {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.integration-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.integration-actions {
  display: flex;
  justify-content: flex-start;
}

/* Integration Table */
.integrations-table {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
  background: white;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
  background: #f8fafc;
  border-bottom: 1px solid #f3f4f6;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
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

/* Integration Info in Table */
.integration-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.integration-avatar {
  width: 36px;
  height: 36px;
  background: #f8fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.integration-details {
  display: flex;
  flex-direction: column;
}

.integration-title {
  font-weight: 600;
  color: #111827;
  font-size: 14px;
}

.integration-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.integration-desc {
  color: #4b5563;
  line-height: 1.4;
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

.status-dot.connected {
  background: #10b981;
}

.status-text {
  font-size: 14px;
  color: #6b7280;
}

/* Guide Grid */
.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.guide-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.guide-icon {
  width: 40px;
  height: 40px;
  background: rgba(12, 156, 141, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-content {
  flex: 1;
}

.guide-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.guide-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
}

.help-link {
  color: #0C9C8D;
  text-decoration: none;
  font-weight: 500;
}

.help-link:hover {
  text-decoration: underline;
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

.btn-text {
  background: transparent;
  padding: 8px 12px;
}

.btn-primary-text {
  color: #0C9C8D;
}

.btn-primary-text:hover {
  background: rgba(12, 156, 141, 0.1);
}

.btn-danger-text {
  color: #ef4444;
}

.btn-danger-text:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* Dialog Styles */
.connection-dialog {
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

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon.connect {
  background: linear-gradient(135deg, #0C9C8D, #0a8a7e);
}

.action-icon.disconnect {
  background: linear-gradient(135deg, #ef4444, #dc2626);
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

.permission-note {
  background: #f0fdfa;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #065f46;
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
  
  .integrations-grid {
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
  
  .table-row .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
  }
  
  .guide-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .guide-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
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
  
  .integration-card {
    padding: 20px;
  }
  
  .integration-icon {
    width: 40px;
    height: 40px;
  }
  
  .integration-name {
    font-size: 16px;
  }
  
  .integration-description {
    font-size: 13px;
  }
}
</style>