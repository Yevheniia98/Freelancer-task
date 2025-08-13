<template>
  <div class="upwork-integration">
    <v-card variant="outlined">
      <v-card-title class="d-flex align-center">
        <v-img
          src="/upwork-logo.svg"
          alt="Upwork"
          height="40"
          width="80"
          class="mr-4"
          contain
        />
        <div>
          <h3>Upwork Integration</h3>
          <p class="text-caption mb-0">
            Connect your Upwork account to automatically sync your projects
          </p>
        </div>
      </v-card-title>

      <v-card-text>
        <!-- Connection Status -->
        <v-chip
          v-if="isConnected"
          color="success"
          variant="flat"
          class="mb-4"
        >
          <v-icon left>mdi-check-circle</v-icon>
          Connected
        </v-chip>
        <v-chip
          v-else
          color="warning"
          variant="flat"
          class="mb-4"
        >
          <v-icon left>mdi-alert-circle</v-icon>
          Not Connected
        </v-chip>

        <!-- Connect Section -->
        <div v-if="!isConnected">
          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            To sync your Upwork projects, you'll need to authorize this application
            to access your Upwork account. This is a secure OAuth process.
          </v-alert>
          
          <v-btn
            @click="initiateConnection"
            :loading="isConnecting"
            color="primary"
            size="large"
            variant="elevated"
          >
            <v-icon left>mdi-link</v-icon>
            Connect to Upwork
          </v-btn>
        </div>

        <!-- Connected Section -->
        <div v-else>
          <v-row>
            <v-col cols="12" md="6">
              <v-card variant="tonal">
                <v-card-title>
                  <v-icon left>mdi-sync</v-icon>
                  Project Sync
                </v-card-title>
                <v-card-text>
                  <p>Sync your projects to see them in your task manager.</p>
                  <v-btn
                    @click="syncProjects"
                    :loading="isSyncing"
                    color="primary"
                    variant="outlined"
                    class="mb-2"
                  >
                    <v-icon left>mdi-sync</v-icon>
                    {{ isSyncing ? 'Syncing...' : 'Sync Now' }}
                  </v-btn>
                  
                  <v-switch
                    v-model="autoSync"
                    @change="toggleAutoSync"
                    label="Auto-sync every hour"
                    color="primary"
                  />
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-card variant="tonal">
                <v-card-title>
                  <v-icon left>mdi-chart-line</v-icon>
                  Sync Stats
                </v-card-title>
                <v-card-text>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title>Projects Synced</v-list-item-title>
                      <v-list-item-subtitle>{{ syncStats.projectCount || 0 }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>Last Sync</v-list-item-title>
                      <v-list-item-subtitle>{{ formatLastSync(syncStats.lastSync) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mt-4">
            <v-col cols="12">
              <v-btn
                @click="disconnect"
                color="error"
                variant="outlined"
                size="small"
              >
                <v-icon left>mdi-link-off</v-icon>
                Disconnect
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- Error Messages -->
        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          dismissible
          @input="error = null"
          class="mt-4"
        >
          {{ error }}
        </v-alert>

        <!-- Success Messages -->
        <v-alert
          v-if="successMessage"
          type="success"
          variant="tonal"
          dismissible
          @input="successMessage = null"
          class="mt-4"
        >
          {{ successMessage }}
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useUpworkIntegration } from '../composables/useUpworkIntegration'

const {
  isConnected,
  isConnecting,
  isSyncing,
  autoSync,
  syncStats,
  error,
  successMessage,
  initiateConnection,
  syncProjects,
  toggleAutoSync,
  disconnect,
  formatLastSync
} = useUpworkIntegration()
</script>

<style scoped>
.upwork-integration {
  width: 100%;
}
</style>
