<template>
  <v-app>
    <LeftMenu />
      
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <div class="d-flex justify-space-between align-center mb-6 flex-wrap">
          <h1 class="text-h4 text-h5-sm font-weight-bold">
            Clients
          </h1>
          <v-btn 
            color="teal" 
            class="text-white mt-2 mt-sm-0" 
            elevation="0" 
            @click="openClientDialog()"
          >
            Create client
          </v-btn>
        </div>
  
        <v-card
          v-for="client in clients"
          :key="client.id"
          class="mb-4"
          elevation="1"
          rounded="lg"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-4"
            >
              <div class="text-h6 font-weight-bold mb-1">
                {{ client.name }}
              </div>
              <div class="text-subtitle-2 text-teal mb-1">
                {{ client.platform }}
              </div>
              <div class="text-body-2 mb-1">
                {{ client.email }}
              </div>
              <div class="text-body-2">
                {{ client.phone }}
              </div>
            </v-col>
              
            <v-col
              cols="4"
              sm="2"
              md="2"
              class="pa-4 d-flex flex-column"
            >
              <div class="text-h6 font-weight-bold">
                Done
              </div>
              <div class="text-body-1 mt-2">
                {{ client.projects }} projects
              </div>
            </v-col>
              
            <v-col
              cols="4"
              sm="2"
              md="2"
              class="pa-4 d-flex flex-column"
            >
              <div class="text-h6 font-weight-bold">
                Earn
              </div>
              <div class="text-body-1 mt-2">
                {{ client.earn }} $
              </div>
            </v-col>
              
            <v-col
              cols="12"
              sm="6"
              md="3"
              class="pa-4 d-flex flex-column"
            >
              <div class="text-h6 font-weight-bold">
                My Review
              </div>
              <div class="text-body-2 mt-2">
                {{ client.review }}
              </div>
            </v-col>
              
            <v-col
              cols="4"
              sm="2"
              md="2"
              class="pa-4 d-flex align-center justify-center"
            >
              <v-btn
                icon
                variant="text"
                class="mr-2"
                color="teal"
                @click="openClientDialog(client)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
                
              <v-btn
                icon
                variant="text"
                color="red"
                @click="confirmDeleteDialog(client)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
  
        <!-- Client Dialog -->
        <v-dialog
          v-model="clientDialog"
          max-width="600px"
          fullscreen-breakpoint="sm"
        >
          <v-card>
            <v-card-title class="text-h5 bg-teal text-white pa-4">
              {{ editingClient.id ? 'Edit Client' : 'Create New Client' }}
            </v-card-title>
              
            <v-card-text class="pa-4 pt-6">
              <v-form
                ref="form"
                v-model="isFormValid"
              >
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editingClient.name"
                        label="Name"
                        required
                        :rules="[v => !!v || 'Name is required']"
                      />
                    </v-col>
                      
                    <v-col cols="12">
                      <v-text-field
                        v-model="editingClient.platform"
                        label="Platform (Fiverr, UpWork, etc.)"
                        required
                        :rules="[v => !!v || 'Platform is required']"
                      />
                    </v-col>
                      
                    <v-col cols="12">
                      <v-text-field
                        v-model="editingClient.email"
                        label="Email"
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
                        label="Phone"
                        required
                        :rules="[v => !!v || 'Phone is required']"
                      />
                    </v-col>
                      
                    <v-col cols="12">
                      <v-textarea
                        v-model="editingClient.review"
                        label="My Review"
                        rows="3"
                        placeholder="Add your review about this client"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
              
            <v-card-actions class="pa-4 flex-wrap gap-2">
              <v-spacer class="d-none d-sm-block" />
              <v-btn 
                color="grey-darken-1" 
                variant="text" 
                class="flex-grow-1 flex-sm-grow-0"
                @click="clientDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn 
                color="teal" 
                class="text-white flex-grow-1 flex-sm-grow-0"
                :disabled="!isFormValid"
                @click="saveClient"
              >
                Save
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
          <v-card>
            <v-card-title class="text-h5 bg-red text-white pa-4">
              Delete Client
            </v-card-title>
              
            <v-card-text class="pa-4 pt-6">
              Are you sure you want to delete {{ clientToDelete?.name }}? This action cannot be undone.
            </v-card-text>
              
            <v-card-actions class="pa-4 flex-wrap gap-2">
              <v-spacer class="d-none d-sm-block" />
              <v-btn 
                color="grey-darken-1" 
                variant="text" 
                class="flex-grow-1 flex-sm-grow-0"
                @click="deleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn 
                color="red" 
                class="text-white flex-grow-1 flex-sm-grow-0"
                @click="deleteClient"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>
  
  <script>
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import LeftMenu from '@/dashboard/LeftMenu.vue';

export default defineComponent({
  name: 'ClientsPage',
  components: {
    LeftMenu
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
        name: 'Jane Smith',
        platform: 'Fiverr',
        email: 'jane.29@gmail.com',
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

    // Methods
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
      openClientDialog,
      saveClient,
      confirmDeleteDialog,
      deleteClient
    };
  }
});
  </script>
  



  <style scoped>
  .app-container {
    display: flex;
    height: 100vh;
  }
  
  .content-container {
    flex: 1;
    padding: 20px;
    background-color: #f5f5f5;
    overflow-y: auto;
  }
  
  .clients-page {
    max-width: 1400px;
    margin: 0 auto;
  }

  .text-teal {
  color: #00BFA5 !important;
}

/* Client Card Responsiveness */
.v-card {
  transition: all 0.2s ease;
}

/* Responsive Typography */
@media (max-width: 600px) {
  .text-h5-sm {
    font-size: 1.25rem !important;
  }
  
  .text-h6 {
    font-size: 1rem !important;
  }
  
  .text-body-1 {
    font-size: 0.875rem !important;
  }
  
  .text-body-2 {
    font-size: 0.8125rem !important;
  }
}

/* Spacing adjustments for smaller screens */
@media (max-width: 600px) {
  .pa-sm-6 {
    padding: 24px !important;
  }
  
  .v-card {
    margin-bottom: 12px !important;
  }
  
  .v-col {
    padding: 12px !important;
  }
}

/* Improve readability on small screens */
@media (max-width: 600px) {
  .v-col {
    min-height: auto !important;
  }
}

/* Dialog adjustments for mobile */
@media (max-width: 600px) {
  .v-dialog {
    margin: 16px;
    width: calc(100% - 32px) !important;
  }
  
  .v-card-actions {
    flex-direction: column;
  }
  
  .v-card-actions .v-btn {
    margin: 4px 0;
    width: 100%;
  }
}

/* Prevent text overflow on small screens */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile layout improvements */
@media (max-width: 600px) {
  .justify-space-between {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .justify-space-between .v-btn {
    margin-top: 16px;
    width: 100%;
  }
}

/* Button spacing for better mobile UX */
@media (max-width: 600px) {
  .flex-grow-1 {
    flex-grow: 1 !important;
  }
}

/* Specific Client Grid Row Improvements */
@media (max-width: 960px) {
  .v-row {
    flex-direction: column !important;
  }
  
  .v-col[class*="cols-4"] {
    flex: 0 0 33.333333% !important;
    max-width: 33.333333% !important;
  }
}

@media (max-width: 599px) {
  .v-row .v-col[class*="cols-4"] {
    flex: 0 0 33.333333% !important;
    max-width: 33.333333% !important;
    display: inline-block !important;
  }
  
  .v-row .v-col[class*="cols-12"] {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}

/* Improve dialog action buttons */
.gap-2 {
  gap: 8px;
}
  </style>