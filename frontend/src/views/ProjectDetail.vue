<template>
  <v-app>
    <!-- Left Sidebar -->
    <LeftMenu 
      class="left-menu-component"
      :style="{ position: 'fixed !important', zIndex: 1000 }"
    />
    <SearchBar />

    <!-- Main Content -->
    <v-main class="main-content">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <v-container fluid class="px-6 py-8">
          <div class="loading-content">
            <v-progress-circular
              :size="70"
              :width="7"
              color="primary"
              indeterminate
            />
            <h2 class="loading-text">Loading project details...</h2>
          </div>
        </v-container>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <v-container fluid class="px-6 py-8">
          <div class="error-content">
            <v-icon size="64" color="error">mdi-alert-circle</v-icon>
            <h2 class="error-title">{{ error }}</h2>
            <v-btn 
              color="primary" 
              variant="elevated" 
              @click="$router.push('/projects')"
              class="mt-4"
            >
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
              Back to Projects
            </v-btn>
          </div>
        </v-container>
      </div>

      <!-- Project Details -->
      <div v-else-if="project" class="project-detail-container">
        <!-- Hero Section -->
        <div class="hero-section">
          <v-container fluid class="px-6 py-8">
            <div class="hero-content">
              <div class="title-section">
                <div class="breadcrumb">
                  <v-btn 
                    variant="text" 
                    color="white" 
                    @click="$router.push('/projects')"
                    class="breadcrumb-btn"
                  >
                    <v-icon class="mr-2">mdi-arrow-left</v-icon>
                    Projects
                  </v-btn>
                  <span class="breadcrumb-divider">/</span>
                  <span class="breadcrumb-current">{{ project.title }}</span>
                </div>
                <h1 class="hero-title">
                  {{ project.title }}
                </h1>
                <p class="hero-subtitle">
                  {{ project.description }}
                </p>
                <div class="project-meta">
                  <v-chip 
                    :color="getStatusColor(project.status)" 
                    variant="elevated" 
                    class="status-chip"
                  >
                    <v-icon class="mr-2">{{ getStatusIcon(project.status) }}</v-icon>
                    {{ formatStatus(project.status) }}
                  </v-chip>
                  <v-chip 
                    :color="getPriorityColor(project.priority)" 
                    variant="elevated" 
                    class="priority-chip"
                  >
                    <v-icon class="mr-2">mdi-flag</v-icon>
                    {{ formatPriority(project.priority) }}
                  </v-chip>
                  <v-chip v-if="project.deadline" variant="outlined" color="white" class="deadline-chip">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    Due {{ formatDeadline(project.deadline) }}
                  </v-chip>
                </div>
              </div>
              <div class="hero-actions">
                <v-btn 
                  color="white"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  class="hero-btn"
                  @click="editProject"
                >
                  <v-icon class="mr-2">mdi-pencil</v-icon>
                  Edit Project
                </v-btn>
                <v-btn 
                  color="white"
                  variant="outlined"
                  size="large"
                  rounded="lg"
                  class="hero-btn-outline ml-3"
                  @click="deleteProject"
                >
                  <v-icon class="mr-2">mdi-delete</v-icon>
                  Delete
                </v-btn>
              </div>
            </div>
          </v-container>
        </div>

        <v-container fluid class="content-container px-6 pb-8">
          <!-- Project Overview Cards -->
          <div class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon class="section-icon" color="primary">mdi-chart-donut</v-icon>
                <h2 class="section-heading">Project Overview</h2>
              </div>
            </div>
            
            <div class="project-overview-grid">
              <!-- Status Card -->
              <div class="overview-item">
                <div class="overview-card status-card">
                  <div class="overview-icon-wrapper status-icon">
                    <v-icon class="overview-icon" color="white">
                      {{ getStatusIcon(project.status) }}
                    </v-icon>
                  </div>
                  <div class="overview-info">
                    <h3 class="overview-title">Status</h3>
                    <div class="overview-amount">{{ formatStatus(project.status) }}</div>
                    <div class="overview-description">Current state</div>
                  </div>
                </div>
              </div>
              
              <!-- Priority Card -->
              <div class="overview-item">
                <div class="overview-card priority-card">
                  <div class="overview-icon-wrapper priority-icon">
                    <v-icon class="overview-icon" color="white">mdi-flag</v-icon>
                  </div>
                  <div class="overview-info">
                    <h3 class="overview-title">Priority</h3>
                    <div class="overview-amount">{{ formatPriority(project.priority) }}</div>
                    <div class="overview-description">Project importance</div>
                  </div>
                </div>
              </div>
              
              <!-- Created Date Card -->
              <div class="overview-item">
                <div class="overview-card created-card">
                  <div class="overview-icon-wrapper created-icon">
                    <v-icon class="overview-icon" color="white">mdi-calendar-plus</v-icon>
                  </div>
                  <div class="overview-info">
                    <h3 class="overview-title">Created</h3>
                    <div class="overview-amount">{{ formatDate(project.createdAt) }}</div>
                    <div class="overview-description">Project start date</div>
                  </div>
                </div>
              </div>
              
              <!-- Deadline Card -->
              <div class="overview-item">
                <div class="overview-card deadline-card">
                  <div class="overview-icon-wrapper deadline-icon">
                    <v-icon class="overview-icon" color="white">mdi-calendar-clock</v-icon>
                  </div>
                  <div class="overview-info">
                    <h3 class="overview-title">Deadline</h3>
                    <div class="overview-amount">
                      {{ project.deadline ? formatDate(project.deadline) : 'No deadline' }}
                    </div>
                    <div class="overview-description">
                      {{ project.deadline && project.isOverdue ? 'Overdue!' : 'Target completion' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Project Details Section -->
          <div class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon class="section-icon" color="warning">mdi-clipboard-text</v-icon>
                <h2 class="section-heading">Project Details</h2>
              </div>
            </div>
            
            <v-row>
              <!-- Main Details -->
              <v-col cols="12" md="8">
                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">Description</h3>
                  </div>
                  <div class="card-content">
                    <div class="description-content">
                      {{ project.description }}
                    </div>
                  </div>
                </div>

                <!-- Project Timeline -->
                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">Timeline</h3>
                  </div>
                  <div class="card-content">
                    <div class="timeline-item">
                      <div class="timeline-icon created">
                        <v-icon color="white">mdi-calendar-plus</v-icon>
                      </div>
                      <div class="timeline-content">
                        <h4 class="timeline-title">Project Created</h4>
                        <p class="timeline-date">{{ formatFullDate(project.createdAt) }}</p>
                      </div>
                    </div>
                    
                    <div class="timeline-item">
                      <div class="timeline-icon updated">
                        <v-icon color="white">mdi-pencil</v-icon>
                      </div>
                      <div class="timeline-content">
                        <h4 class="timeline-title">Last Updated</h4>
                        <p class="timeline-date">{{ formatFullDate(project.updatedAt) }}</p>
                      </div>
                    </div>
                    
                    <div v-if="project.deadline" class="timeline-item">
                      <div class="timeline-icon deadline">
                        <v-icon color="white">mdi-calendar-clock</v-icon>
                      </div>
                      <div class="timeline-content">
                        <h4 class="timeline-title">Deadline</h4>
                        <p class="timeline-date">{{ formatFullDate(project.deadline) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Sidebar Information -->
              <v-col cols="12" md="4">
                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">Project Information</h3>
                  </div>
                  <div class="card-content">
                    <div class="info-item">
                      <div class="info-label">Project ID</div>
                      <div class="info-value">{{ project.id }}</div>
                    </div>
                    
                    <div class="info-item">
                      <div class="info-label">Status</div>
                      <div class="info-value">
                        <v-chip :color="getStatusColor(project.status)" size="small" variant="tonal">
                          {{ formatStatus(project.status) }}
                        </v-chip>
                      </div>
                    </div>
                    
                    <div class="info-item">
                      <div class="info-label">Priority</div>
                      <div class="info-value">
                        <v-chip :color="getPriorityColor(project.priority)" size="small" variant="tonal">
                          {{ formatPriority(project.priority) }}
                        </v-chip>
                      </div>
                    </div>
                    
                    <div class="info-item">
                      <div class="info-label">Created</div>
                      <div class="info-value">{{ formatDate(project.createdAt) }}</div>
                    </div>
                    
                    <div class="info-item">
                      <div class="info-label">Last Modified</div>
                      <div class="info-value">{{ formatDate(project.updatedAt) }}</div>
                    </div>
                    
                    <div v-if="project.deadline" class="info-item">
                      <div class="info-label">Deadline</div>
                      <div class="info-value">{{ formatDate(project.deadline) }}</div>
                    </div>
                  </div>
                </div>

                <!-- Actions Card -->
                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">Actions</h3>
                  </div>
                  <div class="card-content">
                    <div class="action-buttons">
                      <v-btn 
                        color="primary" 
                        variant="elevated" 
                        block 
                        class="mb-3"
                        @click="editProject"
                      >
                        <v-icon class="mr-2">mdi-pencil</v-icon>
                        Edit Project
                      </v-btn>
                      
                      <v-btn 
                        color="success" 
                        variant="outlined" 
                        block 
                        class="mb-3"
                        @click="changeStatus('completed')"
                        :disabled="project.status === 'completed'"
                      >
                        <v-icon class="mr-2">mdi-check</v-icon>
                        Mark Complete
                      </v-btn>
                      
                      <v-btn 
                        color="error" 
                        variant="outlined" 
                        block
                        @click="deleteProject"
                      >
                        <v-icon class="mr-2">mdi-delete</v-icon>
                        Delete Project
                      </v-btn>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Project Files Section -->
          <div v-if="project.files && project.files.length > 0" class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon class="section-icon" color="info">mdi-file-multiple</v-icon>
                <h2 class="section-heading">Project Files</h2>
              </div>
            </div>
            
            <div class="files-grid">
              <div 
                v-for="file in project.files" 
                :key="file.id" 
                class="file-card"
              >
                <div class="file-preview">
                  <div v-if="isImage(file.mimetype)" class="image-preview">
                    <img 
                      :src="`http://localhost:3001${file.path}`" 
                      :alt="file.originalName"
                      class="preview-image"
                    />
                  </div>
                  <div v-else class="file-icon-preview">
                    <v-icon :color="getFileIconColor(file.mimetype)" size="48">
                      {{ getFileIcon(file.mimetype) }}
                    </v-icon>
                  </div>
                </div>
                
                <div class="file-info">
                  <h4 class="file-name">{{ file.originalName }}</h4>
                  <p class="file-size">{{ formatFileSize(file.size) }}</p>
                  <p class="file-date">{{ formatFileDate(file.uploadedAt) }}</p>
                </div>
                
                <div class="file-actions">
                  <v-btn 
                    :href="`http://localhost:3001${file.path}`" 
                    target="_blank"
                    color="primary" 
                    variant="outlined" 
                    size="small"
                    class="mr-2"
                  >
                    <v-icon class="mr-1">mdi-download</v-icon>
                    Download
                  </v-btn>
                  <v-btn 
                    :href="`http://localhost:3001${file.path}`" 
                    target="_blank"
                    color="secondary" 
                    variant="text" 
                    size="small"
                  >
                    <v-icon class="mr-1">mdi-eye</v-icon>
                    View
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </div>
    </v-main>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Delete Project</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ project?.title }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Status Update Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      :color="snackbarColor"
      location="top right"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbarIcon }}</v-icon>
        {{ snackbarText }}
      </div>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
import { ProjectApiService } from '@/services/projectApi.service.js';

const route = useRoute();
const router = useRouter();

// Reactive data
const project = ref(null);
const loading = ref(true);
const error = ref(null);
const deleteDialog = ref(false);
const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');
const snackbarIcon = ref('mdi-check');

// Fetch project details
const fetchProject = async () => {
  try {
    loading.value = true;
    error.value = null;
    const projectId = route.params.id;
    
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    const response = await ProjectApiService.getById(projectId);
    project.value = response;
    
  } catch (err) {
    console.error('Error fetching project:', err);
    error.value = err.message || 'Failed to load project details';
  } finally {
    loading.value = false;
  }
};

// Status and priority helpers
const getStatusColor = (status) => {
  const colorMap = {
    'pending': 'orange',
    'in_progress': 'blue', 
    'completed': 'green',
    'cancelled': 'red'
  };
  return colorMap[status] || 'grey';
};

const getStatusIcon = (status) => {
  const iconMap = {
    'pending': 'mdi-clock-outline',
    'in_progress': 'mdi-progress-clock',
    'completed': 'mdi-check-circle',
    'cancelled': 'mdi-cancel'
  };
  return iconMap[status] || 'mdi-help-circle';
};

const getPriorityColor = (priority) => {
  const colorMap = {
    'low': 'green',
    'medium': 'orange',
    'high': 'red',
    'urgent': 'purple'
  };
  return colorMap[priority] || 'grey';
};

const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  };
  return statusMap[status] || status;
};

const formatPriority = (priority) => {
  const priorityMap = {
    'low': 'Low',
    'medium': 'Medium', 
    'high': 'High',
    'urgent': 'Urgent'
  };
  return priorityMap[priority] || priority;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatFullDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDeadline = (deadline) => {
  if (!deadline) return 'No deadline';
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `in ${diffDays} days`;
  }
};

// File helpers
const isImage = (mimetype) => {
  return mimetype && mimetype.startsWith('image/');
};

const getFileIcon = (mimetype) => {
  if (!mimetype) return 'mdi-file';
  
  if (mimetype.startsWith('image/')) return 'mdi-file-image';
  if (mimetype.includes('pdf')) return 'mdi-file-pdf-box';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'mdi-file-word';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'mdi-file-excel';
  if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'mdi-file-powerpoint';
  if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('7z')) return 'mdi-folder-zip';
  if (mimetype.includes('video')) return 'mdi-file-video';
  if (mimetype.includes('audio')) return 'mdi-file-music';
  if (mimetype.includes('text')) return 'mdi-file-document';
  
  return 'mdi-file';
};

const getFileIconColor = (mimetype) => {
  if (!mimetype) return 'grey';
  
  if (mimetype.startsWith('image/')) return 'green';
  if (mimetype.includes('pdf')) return 'red';
  if (mimetype.includes('word') || mimetype.includes('document')) return 'blue';
  if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'green';
  if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'orange';
  if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('7z')) return 'purple';
  if (mimetype.includes('video')) return 'red';
  if (mimetype.includes('audio')) return 'purple';
  
  return 'grey';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatFileDate = (dateString) => {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Actions
const editProject = () => {
  router.push(`/project-create?edit=${project.value.id}`);
};

const changeStatus = async (newStatus) => {
  try {
    await ProjectApiService.update(project.value.id, { status: newStatus });
    project.value.status = newStatus;
    showSnackbar(`Project status updated to ${formatStatus(newStatus)}`, 'success', 'mdi-check');
  } catch (err) {
    console.error('Error updating status:', err);
    showSnackbar('Failed to update project status', 'error', 'mdi-alert');
  }
};

const deleteProject = () => {
  deleteDialog.value = true;
};

const confirmDelete = async () => {
  try {
    await ProjectApiService.delete(project.value.id);
    deleteDialog.value = false;
    showSnackbar('Project deleted successfully', 'success', 'mdi-check');
    setTimeout(() => {
      router.push('/projects');
    }, 1000);
  } catch (err) {
    console.error('Error deleting project:', err);
    showSnackbar('Failed to delete project', 'error', 'mdi-alert');
  }
};

const showSnackbar = (text, color, icon) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbarIcon.value = icon;
  snackbar.value = true;
};

// Load project on component mount
onMounted(() => {
  fetchProject();
});
</script>

<style scoped>
/* Left Menu Styles */
:deep(.left-menu-component),
:deep(.v-navigation-drawer) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  overflow-y: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-navigation-drawer--rail) {
  width: 72px;
}

:deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
  width: 240px !important;
}

/* Main Layout */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Loading State */
.loading-container {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Error State */
.error-container {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-content {
  text-align: center;
  color: white;
}

.error-title {
  margin-top: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb-btn {
  margin-left: -8px;
  color: rgba(255, 255, 255, 0.8) !important;
}

.breadcrumb-divider {
  margin: 0 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.breadcrumb-current {
  color: white;
  font-weight: 600;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 1rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1.5rem 0;
  font-weight: 400;
  line-height: 1.5;
}

.project-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.status-chip, .priority-chip, .deadline-chip {
  font-weight: 600;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: flex-end;
}

.hero-btn {
  background: white !important;
  color: #0D7C66 !important;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  min-width: 150px;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.hero-btn-outline {
  border: 2px solid white !important;
  color: white !important;
  font-weight: 600;
  min-width: 150px;
}

/* Content Container */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections */
.tool-section {
  margin-bottom: 3rem;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.8rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

/* Project Overview Grid */
.project-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overview-item {
  position: relative;
}

.overview-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.overview-card:hover::before {
  opacity: 1;
}

.overview-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.status-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.priority-icon {
  background: linear-gradient(135deg, #EF4444, #F87171);
}

.created-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.deadline-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.overview-card:hover .overview-icon-wrapper {
  transform: scale(1.05);
}

.overview-icon {
  font-size: 1.5rem;
}

.overview-info {
  flex: 1;
  min-width: 0;
}

.overview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.overview-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.overview-description {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Project Cards */
.project-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: #0D7C66;
  box-shadow: 0 8px 25px rgba(13, 124, 102, 0.1);
}

.card-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-content {
  padding: 1.5rem;
}

/* Description Content */
.description-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
  white-space: pre-wrap;
}

/* Timeline */
.timeline-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.timeline-item:last-child {
  border-bottom: none;
}

.timeline-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-icon.created {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.timeline-icon.updated {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.timeline-icon.deadline {
  background: linear-gradient(135deg, #EF4444, #F87171);
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.timeline-date {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Info Items */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-actions {
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .project-overview-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .content-container {
    margin-top: -1rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  .project-meta {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .overview-card {
    padding: 1rem;
  }
  
  .overview-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .overview-icon {
    font-size: 1.25rem;
  }
  
  .overview-amount {
    font-size: 1.5rem;
  }
  
  .card-header,
  .card-content {
    padding: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .hero-btn, .hero-btn-outline {
    width: 100%;
    min-width: unset;
  }
}

/* Files Section */
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.file-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.file-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.file-preview {
  height: 150px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e2e8f0;
}

.image-preview {
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.file-info {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.file-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;
}

.file-date {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.file-actions {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .files-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .file-actions {
    flex-direction: column;
  }
  
  .file-actions .v-btn {
    width: 100%;
  }
}
</style>
