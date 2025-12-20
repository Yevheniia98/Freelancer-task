<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    @click:outside="closeDialog"
  >
    <template #activator="{ props }">
      <v-btn
        color="primary"
        variant="elevated"
        v-bind="props"
      >
        <v-icon left>
          mdi-share-variant
        </v-icon>
        Share
      </v-btn>
    </template>

    <v-card class="share-dialog">
      <v-card-title class="d-flex justify-space-between align-center pa-6">
        <span class="text-h5">Share "{{ projectName }}"</span>
        <v-btn
          icon
          variant="text"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <!-- Add people section -->
        <div class="mb-6">
          <div class="d-flex gap-2 align-center">
            <v-text-field
              v-model="inviteEmail"
              placeholder="Add people by email"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :error-messages="emailError"
              @keyup.enter="inviteMember"
              class="flex-grow-1"
            />
            <v-select
              v-model="invitePermission"
              :items="permissionOptions"
              variant="outlined"
              density="comfortable"
              hide-details
              class="permission-select flex-shrink-0"
              style="min-width: 140px; max-width: 160px;"
            />
            <v-btn
              color="primary"
              variant="flat"
              size="large"
              :disabled="!inviteEmail || inviting"
              :loading="inviting"
              @click="inviteMember"
            >
              Invite
            </v-btn>
          </div>
        </div>

        <!-- Who has access -->
        <div>
          <h4 class="text-subtitle-1 mb-3">
            Who has access
          </h4>

          <!-- Project owner -->
          <div class="member-item d-flex align-center pa-3 mb-2">
            <v-avatar
              size="40"
              color="primary"
              class="mr-3"
            >
              <span class="text-white">{{ getInitials(ownerName) }}</span>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-body-1 font-weight-medium">
                {{ ownerName }} (you)
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ ownerEmail }}
              </div>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="flat"
            >
              Owner
            </v-chip>
          </div>

          <!-- Team members -->
          <div
            v-for="member in teamMembers"
            :key="member.userId || member.email"
            class="member-item d-flex align-center pa-3 mb-2"
          >
            <v-avatar
              size="40"
              :color="member.status === 'pending' ? 'grey-lighten-1' : getAvatarColor(member.name)"
              class="mr-3"
            >
              <v-icon v-if="member.status === 'pending'" color="white">mdi-account-outline</v-icon>
              <span v-else class="text-white">{{ getInitials(member.name) }}</span>
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-body-1 font-weight-medium">
                {{ member.name }}
                <v-chip
                  v-if="member.status === 'pending'"
                  size="x-small"
                  color="warning"
                  variant="flat"
                  class="ml-2"
                >
                  Invite sent
                </v-chip>
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ member.email }}
              </div>
            </div>
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  variant="text"
                  size="small"
                  v-bind="props"
                  :disabled="member.status === 'pending' || member.role === 'owner'"
                >
                  {{ getRoleDisplay(member.role || member.permission) }}
                  <v-icon right>
                    mdi-chevron-down
                  </v-icon>
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  @click="updatePermission(member, 'edit')"
                >
                  <v-list-item-title>Can edit</v-list-item-title>
                </v-list-item>
                <v-list-item
                  @click="updatePermission(member, 'view')"
                >
                  <v-list-item-title>Can view</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item
                  class="text-error"
                  @click="removeMember(member)"
                >
                  <v-list-item-title>Remove</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Empty state -->
          <div
            v-if="!teamMembers || teamMembers.length === 0"
            class="text-center py-6 text-medium-emphasis"
          >
            <v-icon
              size="48"
              class="mb-2"
            >
              mdi-account-multiple-outline
            </v-icon>
            <div>No team members yet</div>
            <div class="text-caption">
              Invite people to collaborate on this project
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Success/Error Snackbar -->
      <v-snackbar
        v-model="showSnackbar"
        :color="snackbarColor"
        :timeout="3000"
      >
        {{ snackbarMessage }}
      </v-snackbar>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  projectId: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  teamMembers: {
    type: Array,
    default: () => []
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['member-added', 'member-removed', 'permission-updated']);

const dialog = ref(false);
const inviteEmail = ref('');
const invitePermission = ref('view');
const inviting = ref(false);
const emailError = ref('');
const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('success');

const permissionOptions = [
  { title: 'Can view', value: 'view' },
  { title: 'Can edit', value: 'edit' }
];

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getAvatarColor = (name) => {
  const colors = ['#1976D2', '#388E3C', '#F57C00', '#7B1FA2', '#C2185B', '#0097A7'];
  const index = (name || '').length % colors.length;
  return colors[index];
};

const getRoleDisplay = (role) => {
  const roleMap = {
    'owner': 'Owner',
    'edit': 'Can edit',
    'view': 'Can view',
    'view_and_edit': 'Can edit',
    'view_only': 'Can view'
  };
  return roleMap[role] || 'Can view';
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const inviteMember = async () => {
  emailError.value = '';
  
  if (!inviteEmail.value) {
    emailError.value = 'Email is required';
    return;
  }

  if (!validateEmail(inviteEmail.value)) {
    emailError.value = 'Please enter a valid email';
    return;
  }

  inviting.value = true;

  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
    const authToken = localStorage.getItem('auth_token');
    
    console.log('Sending invitation:', {
      projectId: props.projectId,
      email: inviteEmail.value,
      role: invitePermission.value,
      hasToken: !!authToken,
      url: `${apiBaseUrl}/invites/send`
    });
    
    const response = await axios.post(
      `${apiBaseUrl}/invites/send`,
      {
        projectId: props.projectId,
        email: inviteEmail.value,
        role: invitePermission.value
      },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );

    console.log('Invitation response:', response.data);

    if (response.data.success) {
      snackbarMessage.value = `Invitation sent to ${inviteEmail.value}! They will receive an email with a link to join.`;
      snackbarColor.value = 'success';
      showSnackbar.value = true;

      emit('member-added');

      inviteEmail.value = '';
      invitePermission.value = 'view';
    }
  } catch (error) {
    console.error('Invite error:', error);
    console.error('Error response:', error.response?.data);
    emailError.value = error.response?.data?.message || 'Failed to invite member';
    snackbarMessage.value = error.response?.data?.message || 'Failed to invite member';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  } finally {
    inviting.value = false;
  }
};

const updatePermission = async (member, newPermission) => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
    const response = await axios.put(
      `${apiBaseUrl}/projects/${props.projectId}/team-members/${member.userId}/permission`,
      { permission: newPermission },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );

    if (response.data.success) {
      snackbarMessage.value = 'Permission updated successfully';
      snackbarColor.value = 'success';
      showSnackbar.value = true;
      emit('permission-updated', member.userId, newPermission);
    }
  } catch (error) {
    snackbarMessage.value = error.response?.data?.message || 'Failed to update permission';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const removeMember = async (member) => {
  if (!confirm(`Remove ${member.name} from this project?`)) {
    return;
  }

  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
    const response = await axios.delete(
      `${apiBaseUrl}/projects/${props.projectId}/team-members/${member.userId}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }
    );

    if (response.data.success) {
      snackbarMessage.value = 'Member removed successfully';
      snackbarColor.value = 'success';
      showSnackbar.value = true;
      emit('member-removed', member.userId);
    }
  } catch (error) {
    snackbarMessage.value = error.response?.data?.message || 'Failed to remove member';
    snackbarColor.value = 'error';
    showSnackbar.value = true;
  }
};

const closeDialog = () => {
  dialog.value = false;
  inviteEmail.value = '';
  invitePermission.value = 'view_only';
  emailError.value = '';
};
</script>

<style scoped>
.share-dialog {
  border-radius: 12px;
}

.member-item {
  border-radius: 8px;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.permission-select :deep(.v-field) {
  background-color: transparent !important;
}

.permission-select :deep(.v-field__input) {
  padding: 0;
  min-height: auto;
}
</style>
