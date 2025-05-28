<template>
  <div class="app-container">
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
      
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
            @click="openAddClientDialog"
          >
            Create client
          </v-btn>
        </div>
  
        <!-- Client list (same as before) -->
        <v-card
          v-for="client in clients"
          :key="client.id"
          class="mb-4"
          elevation="0"
          variant="outlined"
        >
          <!-- Client card content remains the same -->
        </v-card>
      </div>
    </div>
  
    <!-- Add Client Dialog Popup -->
    <v-dialog
      v-model="addClientDialog"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5 py-4 px-6 bg-teal text-white d-flex justify-space-between align-center">
          Add Client
          <v-btn
            icon
            variant="text"
            color="white"
            @click="addClientDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
          
        <v-card-text class="pt-6">
          <v-form
            ref="form"
            v-model="isFormValid"
          >
            <div class="mb-4">
              <div class="text-subtitle-1 mb-2">
                Client name
              </div>
              <v-text-field
                v-model="newClient.name"
                placeholder="Enter name"
                variant="outlined"
                density="comfortable"
                required
                :rules="[v => !!v || 'Name is required']"
              />
            </div>
              
            <div class="mb-4">
              <div class="text-subtitle-1 mb-2">
                Email
              </div>
              <v-text-field
                v-model="newClient.email"
                placeholder="Enter email"
                variant="outlined"
                density="comfortable"
                required
                :rules="[
                  v => !!v || 'Email is required',
                  v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
                ]"
              />
            </div>
              
            <div class="mb-4">
              <div class="text-subtitle-1 mb-2">
                Phone
              </div>
              <v-text-field
                v-model="newClient.phone"
                placeholder="Enter phone no."
                variant="outlined"
                density="comfortable"
                required
                :rules="[v => !!v || 'Phone is required']"
              />
            </div>
              
            <div class="mb-4">
              <div class="text-subtitle-1 mb-2">
                Platform
              </div>
              <v-text-field
                v-model="newClient.platform"
                placeholder="Enter platform"
                variant="outlined"
                density="comfortable"
                required
                :rules="[v => !!v || 'Platform is required']"
              />
            </div>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 d-flex justify-end">
          <v-btn 
            color="teal" 
            class="text-white" 
            min-width="120"
            :disabled="!isFormValid"
            @click="saveNewClient"
          >
            Add client
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <script>
  import { defineComponent, ref, reactive } from 'vue';
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  import SearchBar from '@/dashboard/SearchBar.vue';
  
  export default defineComponent({
    name: 'ClientsPage',
    components: {
      LeftMenu,
      SearchBar
    },
    setup() {
      // Client data
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
        // Other clients...
      ]);
  
      // Add Client Dialog
      const addClientDialog = ref(false);
      const isFormValid = ref(true);
      const form = ref(null);
      
      // New client data
      const newClient = reactive({
        name: '',
        email: '',
        phone: '',
        platform: ''
      });
  
      // Open the add client dialog
      const openAddClientDialog = () => {
        // Reset form fields
        newClient.name = '';
        newClient.email = '';
        newClient.phone = '';
        newClient.platform = '';
        
        // Open dialog
        addClientDialog.value = true;
      };
  
      // Save the new client
      const saveNewClient = () => {
        if (!isFormValid.value) return;
        
        // Create a new client object
        const clientToAdd = {
          id: Date.now(), // Simple ID generation
          name: newClient.name,
          email: newClient.email,
          phone: newClient.phone,
          platform: newClient.platform,
          projects: 0,
          earn: 0,
          review: ''
        };
        
        // Add to the clients array
        clients.value.push(clientToAdd);
        
        // Close the dialog
        addClientDialog.value = false;
      };
  
      return {
        clients,
        addClientDialog,
        isFormValid,
        form,
        newClient,
        openAddClientDialog,
        saveNewClient
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
    width: 72px ;
  }
  
  :deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
    width: 240px !important;
  }


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
  </style>