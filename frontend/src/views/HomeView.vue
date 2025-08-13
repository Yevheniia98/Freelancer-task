<template>
  <div class="home">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <v-card-title class="text-h4 text-center mb-4">
            Welcome to Freelancer Task Manager
          </v-card-title>
          
          <v-card-text class="text-center">
            <p class="text-h6 mb-4">
              Manage your freelance projects efficiently and stay organized
            </p>
            
            <v-row justify="center" class="mt-8">
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="feature-card">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-folder-multiple</v-icon>
                    <h3>Project Management</h3>
                    <p>Organize your projects and track progress efficiently</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="feature-card">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-clock-outline</v-icon>
                    <h3>Time Tracking</h3>
                    <p>Track time spent on tasks and projects automatically</p>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col cols="12" sm="6" md="4">
                <v-card variant="outlined" class="feature-card">
                  <v-card-text class="text-center">
                    <v-icon size="48" color="primary" class="mb-2">mdi-view-dashboard</v-icon>
                    <h3>Dashboard</h3>
                    <p>View all your projects and tasks in one place</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <div class="mt-8">
              <v-btn 
                color="primary" 
                size="large" 
                to="/dashboard"
                variant="elevated"
              >
                <v-icon left>mdi-view-dashboard</v-icon>
                Go to Dashboard
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
