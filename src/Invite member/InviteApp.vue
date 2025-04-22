<template>
    <v-dialog v-model="dialog" max-width="500" content-class="invite-dialog">
      <v-card class="invite-card">
        <div class="dialog-header d-flex align-center">
          <v-avatar size="36" color="#004D40" class="mr-2">
            <span class="text-h6 font-weight-bold white--text">FT</span>
          </v-avatar>
          <span class="text-h6">Freelance Task</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        
        <v-card-text class="invite-content text-center pa-6">
          <div class="gradient-background"></div>
          
          <h2 class="text-h5 font-weight-bold mb-8">
            Invite people to your<br>Workspace:
          </h2>
          
          <div class="d-flex align-center mb-4">
            <div class="text-subtitle-1 mr-4 invite-label">Search via Name</div>
            <v-text-field
              v-model="nameSearch"
              variant="outlined"
              hide-details
              bg-color="white"
              class="search-field"
            ></v-text-field>
          </div>
          
          <div class="text-subtitle-1 my-4">or</div>
          
          <div class="d-flex align-center mb-8">
            <div class="text-subtitle-1 mr-4 invite-label">Search by Email</div>
            <v-text-field
              v-model="emailSearch"
              variant="outlined"
              hide-details
              bg-color="white"
              class="search-field"
            ></v-text-field>
          </div>
          
          <div class="d-flex justify-space-between mt-8">
            <v-btn
              variant="outlined"
              color="#FF5252"
              text-color="#FF5252"
              class="skip-btn"
              @click="dialog = false"
            >
              Skip
            </v-btn>
            
            <v-btn
              color="teal"
              class="find-btn px-6"
              @click="findUsers"
            >
              Find
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dialog: true,
        nameSearch: '',
        emailSearch: ''
      }
    },
    methods: {
      findUsers() {
        // Implement your search functionality here
        console.log('Searching for:', { name: this.nameSearch, email: this.emailSearch });
        // After processing, you might want to close the dialog
        // this.dialog = false;
      }
    }
  }
  </script>
  
  <style scoped>
  .invite-dialog {
    border-radius: 12px;
    overflow: hidden;
  }
  
  .invite-card {
    position: relative;
    overflow: hidden;
  }
  
  .dialog-header {
    padding: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
  
  .invite-content {
    position: relative;
    z-index: 1;
  }
  
  .gradient-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(173, 216, 230, 0.3) 0%, rgba(255, 192, 203, 0.2) 50%, rgba(173, 216, 230, 0.3) 100%);
    z-index: -1;
    opacity: 0.7;
  }
  
  .invite-label {
    width: 150px;
    text-align: right;
    flex-shrink: 0;
  }
  
  .search-field {
    border-radius: 8px;
    background-color: white;
  }
  
  .search-field :deep(.v-field__outline) {
    color: rgba(0, 0, 0, 0.1) !important;
  }
  
  .skip-btn {
    border: 1px solid #FF5252;
    text-transform: none;
    letter-spacing: normal;
    font-weight: 400;
  }
  
  .find-btn {
    text-transform: none;
    letter-spacing: normal;
    font-weight: 500;
    font-size: 16px;
  }
  </style>