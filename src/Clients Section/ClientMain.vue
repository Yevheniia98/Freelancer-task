<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
      
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container fluid class="px-6 py-8">
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Client</span> Management
              </h1>
              <p class="hero-subtitle">
                Manage your client relationships and track project success
              </p>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
                @click="openClientDialog()"
              >
                <v-icon class="mr-2">mdi-plus</v-icon>
                Create Client
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container fluid class="content-container px-6 pb-8">
        <!-- Client Overview Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="primary">mdi-account-group</v-icon>
              <h2 class="section-heading">Client Overview</h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              {{ clients.length }} clients
            </v-chip>
          </div>
          
          <div class="clients-overview-grid">
            <!-- Total Clients Card -->
            <div class="overview-item">
              <div class="overview-card total-clients-card">
                <div class="overview-icon-wrapper total-clients-icon">
                  <v-icon class="overview-icon" color="white">mdi-account-multiple</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Total Clients</h3>
                  <div class="overview-amount">{{ clients.length }}</div>
                  <div class="overview-description">Active relationships</div>
                </div>
              </div>
            </div>
            
            <!-- Total Projects Card -->
            <div class="overview-item">
              <div class="overview-card total-projects-card">
                <div class="overview-icon-wrapper total-projects-icon">
                  <v-icon class="overview-icon" color="white">mdi-briefcase</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Total Projects</h3>
                  <div class="overview-amount">{{ totalProjects }}</div>
                  <div class="overview-description">Completed projects</div>
                </div>
              </div>
            </div>
            
            <!-- Total Earnings Card -->
            <div class="overview-item">
              <div class="overview-card total-earnings-card">
                <div class="overview-icon-wrapper total-earnings-icon">
                  <v-icon class="overview-icon" color="white">mdi-currency-usd</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Total Earnings</h3>
                  <div class="overview-amount">${{ totalEarnings.toLocaleString() }}</div>
                  <div class="overview-description">Revenue generated</div>
                </div>
              </div>
            </div>
            
            <!-- Top Platform Card -->
            <div class="overview-item">
              <div class="overview-card top-platform-card">
                <div class="overview-icon-wrapper top-platform-icon">
                  <v-icon class="overview-icon" color="white">mdi-star</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Top Platform</h3>
                  <div class="overview-amount">{{ topPlatform }}</div>
                  <div class="overview-description">Most active platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Directory Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="warning">mdi-folder-account</v-icon>
              <h2 class="section-heading">Client Directory</h2>
            </div>
            <div class="section-actions">
              <v-btn
                color="warning"
                variant="outlined"
                size="small"
                rounded="lg"
                @click="openClientDialog()"
              >
                <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                Add Client
              </v-btn>
            </div>
          </div>
          
          <div class="clients-directory">
            <div 
              v-for="client in clients"
              :key="client.id"
              class="client-item"
            >
              <div class="client-card">
                <!-- Client Header -->
                <div class="client-header">
                  <div class="client-avatar">
                    <v-icon size="24" color="white">mdi-account</v-icon>
                  </div>
                  <div class="client-basic-info">
                    <h3 class="client-name">{{ client.name }}</h3>
                    <div class="client-platform">
                      <v-chip
                        size="small"
                        :color="getPlatformColor(client.platform)"
                        variant="tonal"
                      >
                        {{ client.platform }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="client-actions">
                    <v-btn
                      icon
                      size="small"
                      color="primary"
                      variant="text"
                      class="action-btn"
                      @click="openClientDialog(client)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      color="error"
                      variant="text"
                      class="action-btn"
                      @click="confirmDeleteDialog(client)"
                    >
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Client Details Grid -->
                <div class="client-details">
                  <div class="client-detail-item">
                    <div class="detail-label">Contact</div>
                    <div class="detail-value">{{ client.email }}</div>
                    <div class="detail-secondary">{{ client.phone }}</div>
                  </div>
                  
                  <div class="client-detail-item">
                    <div class="detail-label">Projects</div>
                    <div class="detail-value">{{ client.projects }}</div>
                    <div class="detail-secondary">Completed</div>
                  </div>
                  
                  <div class="client-detail-item">
                    <div class="detail-label">Earnings</div>
                    <div class="detail-value">${{ client.earn.toLocaleString() }}</div>
                    <div class="detail-secondary">Total revenue</div>
                  </div>
                </div>

                <!-- Client Review -->
                <div v-if="client.review" class="client-review">
                  <div class="review-label">My Review</div>
                  <div class="review-content">{{ client.review }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- Client Dialog -->
    <v-dialog
      v-model="clientDialog"
      max-width="600px"
      fullscreen-breakpoint="sm"
    >
      <v-card rounded="xl" flat border>
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon class="mr-3" color="white">mdi-account-edit</v-icon>
            {{ editingClient.id ? 'Edit Client' : 'Create New Client' }}
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form ref="form" v-model="isFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editingClient.name"
                  label="Client Name"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Name is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-select
                  v-model="editingClient.platform"
                  label="Platform"
                  variant="outlined"
                  :items="['Fiverr', 'UpWork', 'Freelancer.com', 'Direct Client', 'Other']"
                  required
                  :rules="[v => !!v || 'Platform is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-text-field
                  v-model="editingClient.email"
                  label="Email Address"
                  variant="outlined"
                  type="email"
                  required
                  :rules="[
                    v => !!v || 'Email is required',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
                  ]"
                />
              </v-col>
                
              <v-col cols="12">
                <v-text-field
                  v-model="editingClient.phone"
                  label="Phone Number"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Phone is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-textarea
                  v-model="editingClient.review"
                  label="My Review"
                  variant="outlined"
                  rows="3"
                  placeholder="Add your review or notes about this client"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="clientDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isFormValid"
            @click="saveClient"
          >
            <v-icon class="mr-2">mdi-content-save</v-icon>
            {{ editingClient.id ? 'Update Client' : 'Create Client' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card rounded="xl" flat border>
        <v-card-title class="error-modal-header pa-6">
          <div class="modal-title">
            <v-icon class="mr-3" color="white">mdi-delete-alert</v-icon>
            Delete Client
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon size="64" color="error">mdi-account-remove</v-icon>
            <p class="text-body-1 mt-4">
              Are you sure you want to delete <strong>{{ clientToDelete?.name }}</strong>?
            </p>
            <p class="text-body-2 text-medium-emphasis">
              This action cannot be undone and will remove all client data.
            </p>
          </div>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
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
            variant="elevated"
            rounded="lg"
            @click="deleteClient"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Delete Client
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

export default defineComponent({
  name: 'ClientsPage',
  components: {
    LeftMenu,
    SearchBar
  },
  setup() {
    // Responsive state
    const isMobile = ref(false);
    const isTablet = ref(false);
    
    // Update responsive state based on screen size
    const updateResponsiveState = () => {
      isMobile.value = window.innerWidth < 600;
      isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
    };
    
    // Window resize handler
    const handleResize = () => {
      updateResponsiveState();
    };
    
    // Data
    const clients = ref([
      {
        id: 1,
        name: 'Jane Smith',
        platform: 'Fiverr',
        email: 'jane.29@gmail.com',
        phone: '+987654321',
        projects: 10,
        earn: 9420,
        review: 'Nice client, easy to work'
      },
      {
        id: 2,
        name: 'Arina Kalom',
        platform: 'UpWork',
        email: 'kalom185@gmail.com',
        phone: '+970316937',
        projects: 2,
        earn: 895,
        review: "I'm waiting for big project"
      },
      {
        id: 3,
        name: 'Nayla Masood',
        platform: 'Freelancer.com',
        email: 'masood@gmail.com',
        phone: '+970316937',
        projects: 5,
        earn: 3106,
        review: 'good to work, but problem with communication (take time to explain my design)'
      },
      {
        id: 4,
        name: 'John Doe',
        platform: 'Direct Client',
        email: 'john.doe@example.com',
        phone: '+987654321',
        projects: 0,
        earn: 0,
        review: 'New client, middle project'
      }
    ]);

    const clientDialog = ref(false);
    const deleteDialog = ref(false);
    const isFormValid = ref(true);
    const form = ref(null);
    const clientToDelete = ref(null);

    // Default empty client
    const defaultClient = {
      id: null,
      name: '',
      platform: '',
      email: '',
      phone: '',
      projects: 0,
      earn: 0,
      review: ''
    };

    // Client being edited
    const editingClient = reactive({...defaultClient});

    // Computed properties
    const totalProjects = computed(() => {
      return clients.value.reduce((total, client) => total + client.projects, 0);
    });

    const totalEarnings = computed(() => {
      return clients.value.reduce((total, client) => total + client.earn, 0);
    });

    const topPlatform = computed(() => {
      const platformCounts = {};
      clients.value.forEach(client => {
        platformCounts[client.platform] = (platformCounts[client.platform] || 0) + 1;
      });
      
      return Object.keys(platformCounts).reduce((a, b) => 
        platformCounts[a] > platformCounts[b] ? a : b, 'None'
      );
    });

    // Methods
    const getPlatformColor = (platform) => {
      switch(platform) {
        case 'Fiverr':
          return 'success';
        case 'UpWork':
          return 'primary';
        case 'Freelancer.com':
          return 'warning';
        case 'Direct Client':
          return 'info';
        default:
          return 'grey';
      }
    };

    const openClientDialog = (client = null) => {
      if (client) {
        // Editing existing client
        Object.assign(editingClient, client);
      } else {
        // Creating new client
        Object.assign(editingClient, defaultClient);
      }
      clientDialog.value = true;
    };

    const saveClient = () => {
      if (editingClient.id) {
        // Update existing client
        const index = clients.value.findIndex(c => c.id === editingClient.id);
        if (index !== -1) {
          // Preserve the projects and earn values as they are automatically calculated
          const projects = clients.value[index].projects;
          const earn = clients.value[index].earn;
          
          clients.value[index] = {
            ...editingClient,
            projects,
            earn
          };
        }
      } else {
        // Create new client
        const newId = Math.max(0, ...clients.value.map(c => c.id)) + 1;
        
        const newClient = {
          id: newId,
          name: editingClient.name,
          platform: editingClient.platform,
          email: editingClient.email,
          phone: editingClient.phone,
          projects: 0, // New clients start with 0 projects
          earn: 0, // New clients start with 0 earnings
          review: editingClient.review || ''
        };
        
        clients.value.push(newClient);
      }
      
      // Close dialog
      clientDialog.value = false;
    };

    const confirmDeleteDialog = (client) => {
      clientToDelete.value = client;
      deleteDialog.value = true;
    };

    const deleteClient = () => {
      if (clientToDelete.value) {
        const index = clients.value.findIndex(c => c.id === clientToDelete.value.id);
        
        if (index !== -1) {
          clients.value.splice(index, 1);
        }
        
        deleteDialog.value = false;
        clientToDelete.value = null;
      }
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });

    return {
      isMobile,
      isTablet,
      clients,
      clientDialog,
      deleteDialog,
      isFormValid,
      form,
      clientToDelete,
      editingClient,
      totalProjects,
      totalEarnings,
      topPlatform,
      getPlatformColor,
      openClientDialog,
      saveClient,
      confirmDeleteDialog,
      deleteClient
    };
  }
});
</script>

<style scoped>
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
  width: 72px;
}

:deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
  width: 240px !important;
}

/* Main Layout - Same as Design Tools */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Hero Section - Same as Design Tools */
.hero-section {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA726);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 0 0;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-btn {
  background: white !important;
  color: #0D7C66 !important;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

/* Content Container - Same as Design Tools */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections - Same as Design Tools */
.tool-section {
  margin-bottom: 3rem;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.8rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.count-chip {
  font-weight: 600;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Client Overview Grid */
.clients-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.overview-item {
  position: relative;
}

.overview-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.overview-card:hover::before {
  opacity: 1;
}

.overview-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.total-clients-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.total-projects-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.total-earnings-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.top-platform-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.overview-card:hover .overview-icon-wrapper {
  transform: scale(1.05);
}

.overview-icon {
  font-size: 1.5rem;
}

.overview-info {
  flex: 1;
  min-width: 0;
}

.overview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.overview-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.overview-description {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Client Directory */
.clients-directory {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.client-item {
  position: relative;
}

.client-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.client-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.client-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.client-card:hover::before {
  opacity: 1;
}

/* Client Header */
.client-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.client-avatar {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.client-basic-info {
  flex: 1;
  min-width: 0;
}

.client-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.client-platform {
  margin-bottom: 0.25rem;
}

.client-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.client-card:hover .client-actions {
  opacity: 1;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Client Details */
.client-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.client-detail-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.client-detail-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.detail-secondary {
  font-size: 0.8125rem;
  color: #94a3b8;
}

/* Client Review */
.client-review {
  position: relative;
  z-index: 1;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.review-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.review-content {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  font-style: italic;
}

/* Modal Headers */
.hero-modal-header {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
}

.error-modal-header {
  background: linear-gradient(135deg, #EF4444, #F87171);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Animation - Same as Design Tools */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  animation: fadeInUp 0.6s ease-out;
}

.tool-section:nth-child(2) {
  animation-delay: 0.1s;
}

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

.tool-section:nth-child(4) {
  animation-delay: 0.3s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .clients-overview-grid,
  .clients-directory {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .content-container {
    margin-top: -1rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .client-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .client-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .client-actions {
    opacity: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .overview-card,
  .client-card {
    padding: 1rem;
  }
  
  .overview-icon-wrapper,
  .client-avatar {
    width: 50px;
    height: 50px;
  }
  
  .overview-icon {
    font-size: 1.25rem;
  }
  
  .overview-amount {
    font-size: 1.5rem;
  }
  
  .client-name {
    font-size: 1.125rem;
  }
  
  .client-details {
    grid-template-columns: 1fr;
  }
  
  .client-detail-item {
    padding: 0.75rem;
  }
}

@media (max-width: 600px) {
  .clients-directory {
    grid-template-columns: 1fr;
  }
}

/* Mobile Layout Improvements */
@media (max-width: 599px) {
  .client-header {
    align-items: flex-start;
    text-align: left;
  }
  
  .client-basic-info {
    order: 1;
  }
  
  .client-avatar {
    order: 0;
    align-self: flex-start;
  }
  
  .client-actions {
    order: 2;
    opacity: 1;
    margin-left: auto;
  }
}

/* Touch-friendly action buttons on mobile */
@media (max-width: 600px) {
  .client-actions .action-btn {
    padding: 8px;
    min-width: 40px;
    min-height: 40px;
  }
}
</style>