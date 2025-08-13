<template>
  <div class="home">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <v-card-title class="text-h4 text-center mb-4">
            Welcome to Protocol Task Manager
          </v-card-title>
          
          <v-card-text class="text-center">
            <p class="text-h6 mb-4">
              Manage your freelance projects seamlessly with integrated platform connections
            </p>
            
            <v-row justify="center" class="mt-8">
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="feature-card">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-link</v-icon>
                    <h3>Platform Integration</h3>
                    <p>Connect your Upwork, Freelancer, and other platform accounts</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="feature-card">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-sync</v-icon>
                    <h3>Auto Sync</h3>
                    <p>Automatically sync your projects and keep everything up-to-date</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="feature-card">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-view-dashboard</v-icon>
                    <h3>Unified Dashboard</h3>
                    <p>View all your projects in one centralized location</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <div class="mt-8">
              <v-btn 
                color="primary" 
                size="large" 
                to="/integrations"
                variant="elevated"
              >
                <v-icon left>mdi-link</v-icon>
                Get Started with Integrations
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
// Home page component
</script>

<style scoped>
.feature-card {
  height: 100%;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.home {
  padding-top: 2rem;
}
</style>
