<template>
  <div class="integrations-page">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card class="pa-6">
          <v-card-title class="text-h4 text-center mb-6">
            Platform Integrations
          </v-card-title>
          
          <v-card-text>
            <p class="text-center text-h6 mb-8">
              Connect your freelance platform accounts to automatically sync projects
            </p>
            
            <v-row justify="center">
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="integration-card">
                  <v-card-text class="text-center pa-6">
                    <v-img
                      src="/upwork-logo.svg"
                      alt="Upwork"
                      height="60"
                      width="120"
                      class="mx-auto mb-4"
                      contain
                    />
                    <h3 class="mb-3">Upwork</h3>
                    <p class="mb-4">Connect your Upwork account to sync all your projects</p>
                    <UpworkIntegration />
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="integration-card">
                  <v-card-text class="text-center pa-6">
                    <v-img
                      src="/freelancer-logo.svg"
                      alt="Freelancer"
                      height="60"
                      width="120"
                      class="mx-auto mb-4"
                      contain
                    />
                    <h3 class="mb-3">Freelancer</h3>
                    <p class="mb-4">Connect your Freelancer account (Coming Soon)</p>
                    <v-btn variant="outlined" disabled>
                      Coming Soon
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="integration-card">
                  <v-card-text class="text-center pa-6">
                    <v-img
                      src="/fiverr-logo.svg"
                      alt="Fiverr"
                      height="60"
                      width="120"
                      class="mx-auto mb-4"
                      contain
                    />
                    <h3 class="mb-3">Fiverr</h3>
                    <p class="mb-4">Connect your Fiverr account (Coming Soon)</p>
                    <v-btn variant="outlined" disabled>
                      Coming Soon
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Integration Stats -->
            <v-row v-if="stats" class="mt-8" justify="center">
              <v-col cols="12" md="8">
                <v-card variant="outlined">
                  <v-card-title class="text-center">Integration Statistics</v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="4" class="text-center">
                        <div class="stat-number text-primary">{{ stats.connectedPlatforms }}</div>
                        <div class="stat-label">Connected Platforms</div>
                      </v-col>
                      <v-col cols="4" class="text-center">
                        <div class="stat-number text-primary">{{ stats.syncedProjects }}</div>
                        <div class="stat-label">Synced Projects</div>
                      </v-col>
                      <v-col cols="4" class="text-center">
                        <div class="stat-number text-primary">{{ stats.lastSyncTime ? formatLastSync(stats.lastSyncTime) : 'Never' }}</div>
                        <div class="stat-label">Last Sync</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UpworkIntegration from './UpworkIntegration.vue'
import axios from 'axios'

const stats = ref(null)

const loadStats = async () => {
  try {
    const response = await axios.get('/api/integrations/projects/stats')
    stats.value = response.data.data
  } catch (error) {
    console.error('Failed to load integration stats:', error)
  }
}

const formatLastSync = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.integration-card {
  height: 100%;
  transition: transform 0.2s;
}

.integration-card:hover {
  transform: translateY(-4px);
}

.integrations-page {
  padding-top: 2rem;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  display: block;
}
</style>
