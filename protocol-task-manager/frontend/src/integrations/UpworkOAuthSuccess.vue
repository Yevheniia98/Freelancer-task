<template>
  <div class="oauth-success">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="text-center pa-8">
            <v-icon color="success" size="64" class="mb-4">
              mdi-check-circle
            </v-icon>
            
            <v-card-title class="text-h4 mb-4">
              Connection Successful!
            </v-card-title>
            
            <v-card-text>
              <p class="text-h6 mb-4">
                Your Upwork account has been successfully connected.
              </p>
              <p class="mb-6">
                You can now sync your Upwork projects with the task manager.
                This window will close automatically.
              </p>
              
              <v-btn
                color="primary"
                variant="elevated"
                @click="closeWindow"
              >
                Close Window
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const closeWindow = () => {
  // Send success message to parent window
  if (window.opener) {
    window.opener.postMessage({
      type: 'UPWORK_OAUTH_SUCCESS'
    }, window.location.origin)
  }
  
  // Close the popup window
  window.close()
}

onMounted(() => {
  // Auto-close after 3 seconds
  setTimeout(() => {
    closeWindow()
  }, 3000)
})
</script>

<style scoped>
.oauth-success {
  padding-top: 2rem;
}
</style>
