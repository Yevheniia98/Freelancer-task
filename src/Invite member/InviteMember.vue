<template>
  <v-dialog
    v-model="dialog"
    max-width="450px"
  >
    <template #activator="{ props }">
      <v-btn
        color="teal"
        class="text-white"
        v-bind="props"
      >
        Invite members
      </v-btn>
    </template>
      
    <v-card>
      <div class="d-flex justify-space-between align-center pa-4">
        <div class="d-flex align-center">
          <v-avatar
            color="teal"
            size="36"
            class="mr-3"
          >
            <span class="text-white font-weight-bold">FT</span>
          </v-avatar>
          <span class="text-h6">Freelance Task</span>
        </div>
        <v-btn
          icon
          variant="text"
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
        
      <v-card-text class="text-center pt-6 bg-gradient">
        <h2 class="text-h5 font-weight-bold mb-2">
          Invite people to your Workspace:
        </h2>
          
        <div class="mt-8 d-flex justify-center flex-wrap gap-4 pb-6">
          <v-btn
            variant="outlined"
            color="teal"
            min-width="150px"
            @click="inviteViaPlatform"
            to="/invite-app"
          >
            Invite via platform
          </v-btn>
            
          <v-btn
            color="teal"
            class="text-white"
            min-width="150px"
            @click="inviteViaEmail"
            to="/invite-email"
          >
            Invite via email
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
  <script>
  export default {
    name: 'InviteMember',
    data() {
      return {
        dialog: false
      };
    },
    methods: {
      inviteViaPlatform() {
        // Handle platform invitation
        console.log('Invite via platform clicked');
        this.dialog = false;
      },
      inviteViaEmail() {
        // Handle email invitation
        console.log('Invite via email clicked');
        this.dialog = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .bg-gradient {
    position: relative;
    z-index: 1;
    overflow: hidden;
  }
  
  .bg-gradient::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(
      circle at 25% 70%,
      rgba(255, 247, 212, 0.4) 0%,
      rgba(255, 247, 212, 0) 50%
    ), radial-gradient(
      circle at 80% 80%,
      rgba(255, 220, 220, 0.4) 0%,
      rgba(255, 220, 220, 0) 50%
    ), radial-gradient(
      circle at 50% 50%,
      rgba(212, 250, 250, 0.4) 0%,
      rgba(212, 250, 250, 0) 50%
    );
    z-index: -1;
  }
  
  .gap-4 {
    gap: 1rem;
  }
  </style>