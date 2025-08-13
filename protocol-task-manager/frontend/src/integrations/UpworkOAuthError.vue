<template>
  <div class="oauth-error">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <v-card class="text-center pa-8">
            <v-icon color="error" size="64" class="mb-4">
              mdi-alert-circle
            </v-icon>
            
            <v-card-title class="text-h4 mb-4">
              Connection Failed
            </v-card-title>
            
            <v-card-text>
              <p class="text-h6 mb-4">
                {{ errorMessage || 'There was an error connecting your Upwork account.' }}
              </p>
              
              <v-expansion-panels v-if="errorDetails" class="mb-6">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <v-icon left>mdi-information</v-icon>
                    Error Details
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <pre class="text-left">{{ errorDetails }}</pre>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-alert type="info" variant="tonal" class="mb-6">
                <v-alert-title>Troubleshooting Tips</v-alert-title>
                <ul class="text-left mt-2">
                  <li>Make sure you have a valid Upwork account</li>
                  <li>Ensure you granted all required permissions</li>
                  <li>Check your internet connection</li>
                  <li>Try clearing your browser cache and cookies</li>
                </ul>
              </v-alert>
              
              <div class="d-flex justify-center gap-4">
                <v-btn
                  color="primary"
                  variant="elevated"
                  @click="retryConnection"
                >
                  <v-icon left>mdi-refresh</v-icon>
                  Try Again
                </v-btn>
                
                <v-btn
                  color="secondary"
                  variant="outlined"
                  @click="closeWindow"
                >
                  Close Window
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const errorMessage = ref('')
const errorDetails = ref('')

const closeWindow = () => {
  // Send error message to parent window
  if (window.opener) {
    window.opener.postMessage({
      type: 'UPWORK_OAUTH_ERROR',
      error: errorMessage.value
    }, window.location.origin)
  }
  
  // Close the popup window
  window.close()
}

const retryConnection = () => {
  // Close this window and let parent retry
  closeWindow()
}

onMounted(() => {
  // Get error details from URL params
  errorMessage.value = route.query.error || 'Unknown error occurred'
  errorDetails.value = route.query.error_description || ''
})
</script>

<style scoped>
.oauth-error {
  padding-top: 2rem;
}

pre {
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
}

.gap-4 {
  gap: 1rem;
}
</style>
