<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    persistent
    rounded="lg"
  >
    <v-card class="rounded-lg">
      <v-card-title class="d-flex align-center">
        <div class="d-flex align-center">
          <v-avatar
            size="36"
            color="black"
            class="mr-3"
          >
            <span class="text-h6 white--text">FT</span>
          </v-avatar>
          <span class="text-h6">Freelance Task</span>
        </div>
        <v-spacer />
        <v-btn
          icon
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        
      <v-card-text class="text-center py-6">
        <h2 class="text-h5 font-weight-bold mb-2">
          Invite people to your Workspace:
        </h2>
          
        <div class="invite-background my-6">
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="sendInvites"
          >
            <v-text-field
              v-model="emailAddresses"
              label="Enter email addresses"
              outlined
              class="my-6 mx-auto"
              placeholder="Enter email addresses"
              hint="Separate multiple emails with commas"
              :rules="[rules.required, rules.validEmails]"
              variant="outlined"
              style="max-width: 450px;"
              bg-color="white"
            />
          </v-form>
        </div>
      </v-card-text>
        
      <v-card-actions class="px-6 pb-6">
        <v-btn
          variant="text"
          color="error"
          @click="closeDialog"
        >
          Skip
        </v-btn>
        <v-spacer />
        <v-btn
          color="teal"
          min-width="100"
          :loading="loading"
          :disabled="!isFormValid || loading"
          @click="sendInvites"
        >
          Invite
        </v-btn>
      </v-card-actions>
    </v-card>
      
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-dialog>
</template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  
  const dialog = ref(true);
  const form = ref(null);
  const isFormValid = ref(false);
  const emailAddresses = ref('');
  const loading = ref(false);
  const showSnackbar = ref(false);
  const snackbarMessage = ref('');
  
  // Validation rules
  const rules = reactive({
    required: value => !!value || 'Required.',
    validEmails: value => {
      if (!value) return true;
      
      const emails = value.split(',').map(email => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          return `"${email}" is not a valid email address`;
        }
      }
      
      return true;
    }
  });
  
  // Send invites function
  const sendInvites = async () => {
    // Validate form
    const isValid = await form.value?.validate();
    
    if (!isValid.valid) {
      return;
    }
    
    loading.value = true;
    
    try {
      // Split emails by commas and trim whitespace
      const emails = emailAddresses.value.split(',').map(email => email.trim());
      
      // Mock API call - replace with your actual API endpoint
      // In a real application, you would call your backend service here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating network delay
      
      // For each email, send an invitation with a "Join" button in the email
      console.log('Sending invites to:', emails);
      
      // Example of what the backend would do:
      // await Promise.all(emails.map(email => 
      //   fetch('/api/invites', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       email,
      //       workspaceId: yourWorkspaceId,
      //       // The backend would generate a unique link for the "Join" button
      //     }),
      //   })
      // ));
      
      // Show success message
      snackbarMessage.value = `Invitations sent successfully to ${emails.length} recipient(s)!`;
      showSnackbar.value = true;
      
      // Reset form
      emailAddresses.value = '';
      form.value?.reset();
      
      // Optional: close dialog after success
      // dialog.value = false;
    } catch (error) {
      console.error('Error sending invites:', error);
      snackbarMessage.value = 'Failed to send invitations. Please try again.';
      showSnackbar.value = true;
    } finally {
      loading.value = false;
    }
  };
  
  // Close dialog function
  const closeDialog = () => {
    dialog.value = false;
  };
  </script>
  
  <style scoped>
  .invite-background {
    position: relative;
    min-height: 150px;
  }
  
  .invite-background::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 25% 60%, rgba(255, 236, 153, 0.3) 0%, transparent 50%), 
                radial-gradient(circle at 50% 30%, rgba(144, 238, 219, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 60%, rgba(255, 182, 193, 0.3) 0%, transparent 50%);
    z-index: -1;
    border-radius: 16px;
  }
  </style>