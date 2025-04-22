<template>
  <div class="app-container">
    <LeftMenu />
      
    <div class="content-container">
      <div class="clients-page">
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4 font-weight-bold">
            Clients
          </h1>
          <v-btn 
            color="teal" 
            class="text-white" 
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
          elevation="0"
          variant="outlined"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
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
              cols="12"
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
              cols="12"
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
              cols="12"
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
        >
          <v-card>
            <v-card-title class="text-h5 pa-4">
              {{ editingClient.id ? 'Edit Client' : 'Create New Client' }}
            </v-card-title>
              
            <v-card-text>
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
              
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn 
                color="grey-darken-1" 
                variant="text" 
                @click="clientDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn 
                color="teal" 
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
        >
          <v-card>
            <v-card-title class="text-h5 pa-4">
              Delete Client
            </v-card-title>
              
            <v-card-text>
              Are you sure you want to delete {{ clientToDelete?.name }}? This action cannot be undone.
            </v-card-text>
              
            <v-card-actions class="pa-4">
              <v-spacer />
              <v-btn 
                color="grey-darken-1" 
                variant="text" 
                @click="deleteDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn 
                color="red" 
                @click="deleteClient"
              >
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import { defineComponent, ref, reactive } from 'vue';
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  
  export default defineComponent({
    name: 'ClientsPage',
    components: {
      LeftMenu
    },
    setup() {
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
  
      // Tasks relationship is simulated here - in a real app this would connect to a task store
      // We're simulating the connection between tasks and clients for this example
  
      return {
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
    color: #00BFA5;
  }
  </style>