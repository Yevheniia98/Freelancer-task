<template>
  <v-app>
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" md="6" lg="4">
          <v-card class="pa-6">
            <v-card-title class="text-h4 text-center mb-4">
              <v-icon size="64" :color="statusColor">
                {{ statusIcon }}
              </v-icon>
            </v-card-title>

            <v-card-text class="text-center">
              <h2 class="text-h5 mb-4">{{ statusTitle }}</h2>
              <p class="text-body-1">{{ statusMessage }}</p>

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mt-4"
              >
                {{ error }}
              </v-alert>

              <div v-if="project && !error" class="mt-6">
                <v-divider class="mb-4" />
                <p class="text-body-2 text-medium-emphasis">
                  Project: <strong>{{ project.name }}</strong>
                </p>
                <p class="text-body-2 text-medium-emphasis">
                  Role: <strong>{{ getRoleDisplay(role) }}</strong>
                </p>
              </div>
            </v-card-text>

            <v-card-actions class="justify-center mt-4">
              <v-btn
                v-if="!loading && project"
                color="primary"
                size="large"
                @click="goToProject"
              >
                Go to Project
              </v-btn>
              <v-btn
                v-if="error"
                color="primary"
                variant="outlined"
                size="large"
                @click="goToHome"
              >
                Go to Home
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref(null);
const project = ref(null);
const role = ref(null);
const statusTitle = ref('Accepting Invitation...');
const statusMessage = ref('Please wait while we process your invitation.');
const statusIcon = ref('mdi-loading mdi-spin');
const statusColor = ref('primary');

const getRoleDisplay = (role) => {
  const roleMap = {
    'owner': 'Owner',
    'edit': 'Can edit',
    'view': 'Can view'
  };
  return roleMap[role] || 'Member';
};

const acceptInvite = async () => {
  try {
    const token = route.query.token;
    
    if (!token) {
      throw new Error('Invalid invitation link');
    }

    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
      // Redirect to login with return URL
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      });
      return;
    }

    const response = await axios.get(
      `${apiBaseUrl}/invites/accept?token=${token}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    if (response.data.success) {
      project.value = response.data.project;
      role.value = response.data.role;
      statusTitle.value = 'Invitation Accepted!';
      statusMessage.value = 'You have successfully joined the project.';
      statusIcon.value = 'mdi-check-circle';
      statusColor.value = 'success';
    }
  } catch (err) {
    console.error('Accept invite error:', err);
    error.value = err.response?.data?.message || 'Failed to accept invitation. The link may be invalid or expired.';
    statusTitle.value = 'Invitation Failed';
    statusMessage.value = error.value;
    statusIcon.value = 'mdi-alert-circle';
    statusColor.value = 'error';
  } finally {
    loading.value = false;
  }
};

const goToProject = () => {
  if (project.value?.id) {
    router.push(`/projects/${project.value.id}`);
  }
};

const goToHome = () => {
  router.push('/');
};

onMounted(() => {
  acceptInvite();
});
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
