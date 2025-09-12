<!-- Copy of the template part from original file -->
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
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container
          fluid
          class="px-6 py-8"
        >
          <!-- Stats Cards -->
          <div class="stats-cards">
            <div class="stat-card new-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <v-icon
                    size="24"
                    color="blue-grey-400"
                  >
                    mdi-plus-circle
                  </v-icon>
                </div>
                <div class="stat-text">
                  <h3>{{ getTasksByStatus('new').length }}</h3>
                  <p>New Projects</p>
                </div>
              </div>
            </div>

            <div class="stat-card progress-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <v-icon
                    size="24"
                    color="orange-lighten-1"
                  >
                    mdi-progress-clock
                  </v-icon>
                </div>
                <div class="stat-text">
                  <h3>{{ getTasksByStatus('in-progress').length }}</h3>
                  <p>In Progress</p>
                </div>
              </div>
            </div>

            <div class="stat-card completed-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <v-icon
                    size="24"
                    color="green-lighten-1"
                  >
                    mdi-check-circle
                  </v-icon>
                </div>
                <div class="stat-text">
                  <h3>{{ getTasksByStatus('completed').length }}</h3>
                  <p>Completed</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Projects Grid -->
          <div class="projects-section">
            <!-- Section Header -->
            <div class="section-header">
              <h2 class="section-title">Project Overview</h2>
              <div class="section-actions">
                <v-btn 
                  color="white"
                  variant="elevated"
                  class="action-btn"
                  @click="navigateToProjectCreate"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Create Project
                </v-btn>
              </div>
            </div>

            <!-- Kanban Board -->
            <div class="kanban-board">
              <!-- New Column -->
              <div 
                class="kanban-column new-column"
                :class="{ 'drag-over': dragOverColumn === 'new' }"
                @dragover="onDragOver"
                @dragenter="(e) => onDragEnter(e, 'new')"
                @dragleave="onDragLeave"
                @drop="(e) => onDrop(e, 'new')"
              >
                <div class="column-header">
                  <div class="column-title">
                    <div class="title-icon new-icon">
                      <v-icon size="20">mdi-plus-circle</v-icon>
                    </div>
                    <h3>New</h3>
                    <div class="task-count">
                      {{ getTasksByStatus('new').length }}
                    </div>
                  </div>
                </div>

                <div class="tasks-container">
                  <div 
                    v-for="task in getTasksByStatus('new')"
                    :key="task.id"
                    class="task-card"
                    draggable="true"
                    @dragstart="(e) => onDragStart(e, task)"
                    @dragend="onDragEnd"
                  >
                    <div class="task-header">
                      <div 
                        class="task-icon"
                        :style="{ 
                          backgroundColor: task.iconBg,
                          color: `var(--v-theme-${task.iconColor})`
                        }"
                      >
                        <v-icon size="16">{{ task.icon }}</v-icon>
                      </div>
                      <div class="task-menu">
                        <v-menu>
                          <template #activator="{ props }">
                            <v-btn
                              icon="mdi-dots-horizontal"
                              size="small"
                              variant="text"
                              v-bind="props"
                            />
                          </template>
                          <v-list>
                            <v-list-item @click="() => router.push(task.route)">
                              <v-list-item-title>View Details</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </div>

                    <div class="task-content">
                      <h4 class="task-title">{{ task.title }}</h4>
                      <p class="task-description">{{ task.description }}</p>
                    </div>

                    <div class="task-progress">
                      <div class="progress-info">
                        <span class="progress-text">{{ task.progress }}%</span>
                        <span class="progress-total">{{ task.progress }}/{{ task.total }}</span>
                      </div>
                      <v-progress-linear
                        :model-value="task.progress"
                        height="4"
                        color="blue-darken-1"
                        bg-color="blue-grey-100"
                      />
                    </div>

                    <div class="task-footer">
                      <div class="task-team">
                        <div class="team-avatars">
                          <img 
                            v-for="memberId in task.teamMembers.slice(0, 3)"
                            :key="memberId"
                            :src="getTeamMemberAvatar(memberId)"
                            class="team-avatar"
                            :alt="`Team member ${memberId}`"
                          >
                          <div 
                            v-if="task.teamMembers.length > 3"
                            class="team-avatar more-members"
                          >
                            +{{ task.teamMembers.length - 3 }}
                          </div>
                        </div>
                      </div>
                      <div class="task-meta">
                        <span class="task-date">{{ task.date }}</span>
                        <span class="task-update">{{ task.lastUpdate }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div 
                    v-if="getTasksByStatus('new').length === 0"
                    class="empty-state"
                  >
                    <v-icon
                      size="48"
                      color="blue-grey-300"
                    >
                      mdi-plus-circle-outline
                    </v-icon>
                    <p>No new projects</p>
                    <v-btn
                      variant="text"
                      color="primary"
                      @click="navigateToProjectCreate"
                    >
                      Create your first project
                    </v-btn>
                  </div>
                </div>
              </div>

              <!-- In Progress Column -->
              <div 
                class="kanban-column progress-column"
                :class="{ 'drag-over': dragOverColumn === 'in-progress' }"
                @dragover="onDragOver"
                @dragenter="(e) => onDragEnter(e, 'in-progress')"
                @dragleave="onDragLeave"
                @drop="(e) => onDrop(e, 'in-progress')"
              >
                <div class="column-header">
                  <div class="column-title">
                    <div class="title-icon progress-icon">
                      <v-icon size="20">mdi-progress-clock</v-icon>
                    </div>
                    <h3>In Progress</h3>
                    <div class="task-count">
                      {{ getTasksByStatus('in-progress').length }}
                    </div>
                  </div>
                </div>

                <div class="tasks-container">
                  <div 
                    v-for="task in getTasksByStatus('in-progress')"
                    :key="task.id"
                    class="task-card"
                    draggable="true"
                    @dragstart="(e) => onDragStart(e, task)"
                    @dragend="onDragEnd"
                  >
                    <div class="task-header">
                      <div 
                        class="task-icon"
                        :style="{ 
                          backgroundColor: task.iconBg,
                          color: `var(--v-theme-${task.iconColor})`
                        }"
                      >
                        <v-icon size="16">{{ task.icon }}</v-icon>
                      </div>
                      <div class="task-menu">
                        <v-menu>
                          <template #activator="{ props }">
                            <v-btn
                              icon="mdi-dots-horizontal"
                              size="small"
                              variant="text"
                              v-bind="props"
                            />
                          </template>
                          <v-list>
                            <v-list-item @click="() => router.push(task.route)">
                              <v-list-item-title>View Details</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Edit</v-list-item-title>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-title>Delete</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </div>

                    <div class="task-content">
                      <h4 class="task-title">{{ task.title }}</h4>
                      <p class="task-description">{{ task.description }}</p>
                    </div>

                    <div class="task-progress">
                      <div class="progress-info">
                        <span class="progress-text">{{ task.progress }}%</span>
                        <span class="progress-total">{{ task.progress }}/{{ task.total }}</span>
                      </div>
                      <v-progress-linear
                        :model-value="task.progress"
                        height="4"
                        color="orange-darken-1"
                        bg-color="orange-lighten-5"
                      />
                    </div>

                    <div class="task-footer">
                      <div class="task-team">
                        <div class="team-avatars">
                          <img 
                            v-for="memberId in task.teamMembers.slice(0, 3)"
                            :key="memberId"
                            :src="getTeamMemberAvatar(memberId)"
                            class="team-avatar"
                            :alt="`Team member ${memberId}`"
                          >
                          <div 
                            v-if="task.teamMembers.length > 3"
                            class="team-avatar more-members"
                          >
                            +{{ task.teamMembers.length - 3 }}
                          </div>
                        </div>
                      </div>
                      <div class="task-meta">
                        <span class="task-date">{{ task.date }}</span>
                        <span class="task-update">{{ task.lastUpdate }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div 
                    v-if="getTasksByStatus('in-progress').length === 0"
                    class="empty-state"
                  >
                    <v-icon
                      size="48"
                      color="blue-grey-300"
                    >
                      mdi-progress-clock
                    </v-icon>
                    <p>No projects in progress</p>
                  </div>
                </div>
              </div>

              <!-- Completed Column -->
              <div 
                class="kanban-column completed-column"
                :class="{ 'drag-over': dragOverColumn === 'completed' }"
                @dragover="onDragOver"
                @dragenter="(e) => onDragEnter(e, 'completed')"
                @dragleave="onDragLeave"
                @drop="(e) => onDrop(e, 'completed')"
              >
                <div class="column-header">
                  <div class="column-title">
                    <div class="title-icon completed-icon">
                      <v-icon size="20">mdi-check-circle</v-icon>
                    </div>
                    <h3>Completed</h3>
                    <div class="task-count">
                      {{ getTasksByStatus('completed').length }}
                    </div>
                  </div>
                </div>

                <div class="tasks-container">
                  <div 
                    v-for="task in getTasksByStatus('completed')"
                    :key="task.id"
                    class="task-card completed-task"
                    draggable="true"
                    @dragstart="(e) => onDragStart(e, task)"
                    @dragend="onDragEnd"
                  >
                    <div class="task-header">
                      <div 
                        class="task-icon"
                        :style="{ 
                          backgroundColor: task.iconBg,
                          color: `var(--v-theme-${task.iconColor})`
                        }"
                      >
                        <v-icon size="16">{{ task.icon }}</v-icon>
                      </div>
                      <div class="completed-badge">
                        <v-icon
                          size="16"
                          color="green"
                        >
                          mdi-check-circle
                        </v-icon>
                      </div>
                    </div>

                    <div class="task-content">
                      <h4 class="task-title">{{ task.title }}</h4>
                      <p class="task-description">{{ task.description }}</p>
                    </div>

                    <div class="task-progress">
                      <div class="progress-info">
                        <span class="progress-text completed">100%</span>
                        <span class="progress-status">Completed</span>
                      </div>
                      <v-progress-linear
                        :model-value="100"
                        height="4"
                        color="green-darken-1"
                        bg-color="green-lighten-5"
                      />
                    </div>

                    <div class="task-footer">
                      <div class="task-team">
                        <div class="team-avatars">
                          <img 
                            v-for="memberId in task.teamMembers.slice(0, 3)"
                            :key="memberId"
                            :src="getTeamMemberAvatar(memberId)"
                            class="team-avatar"
                            :alt="`Team member ${memberId}`"
                          >
                          <div 
                            v-if="task.teamMembers.length > 3"
                            class="team-avatar more-members"
                          >
                            +{{ task.teamMembers.length - 3 }}
                          </div>
                        </div>
                      </div>
                      <div class="task-meta">
                        <span class="task-date">{{ task.date }}</span>
                        <span class="task-update completed">{{ task.lastUpdate }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div 
                    v-if="getTasksByStatus('completed').length === 0"
                    class="empty-state"
                  >
                    <v-icon
                      size="48"
                      color="blue-grey-300"
                    >
                      mdi-check-circle-outline
                    </v-icon>
                    <p>No completed projects yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </div>
    </v-main>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      :color="snackbarColor"
      location="top"
    >
      <v-icon
        :icon="snackbarIcon"
        class="mr-2"
      />
      {{ snackbarText }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

export default defineComponent({
  name: 'ProjectSection',
  components: {
    LeftMenu,
    SearchBar
  },
  setup() {
    const router = useRouter();
    
    // Drag and Drop State
    const draggedTask = ref(null);
    const dragOverColumn = ref(null);
    const dragActive = ref(false);
    
    // Snackbar State
    const snackbar = ref(false);
    const snackbarText = ref('');
    const snackbarColor = ref('success');
    const snackbarIcon = ref('mdi-check');

    // Team members data
    const teamMembers = ref([
      { id: 1, name: 'John', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 3, name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 4, name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=4' },
    ]);
    
    // Tasks data (will be loaded from API)
    const tasks = ref([]);

    // API Functions
    const loadProjects = async () => {
      try {
        // Dynamically import the API
        const { projectAPI } = await import('@/services/api.js');
        const response = await projectAPI.getAll();
        
        // Transform backend projects to frontend task format
        tasks.value = response.data.map(project => ({
          id: project._id,
          route: "/project-task",
          title: project.title,
          description: project.description,
          icon: getRandomIcon(),
          iconBg: getRandomIconBg(),
          iconColor: getRandomIconColor(),
          progress: calculateProgress(project.status),
          total: 100,
          teamMembers: [1, 2], // Default team members for now
          date: formatDate(project.createdAt),
          lastUpdate: formatLastUpdate(project.updatedAt),
          status: mapBackendStatusToFrontend(project.status),
          deadline: project.deadline ? formatDate(project.deadline) : null
        }));
        
        console.log(`Loaded ${tasks.value.length} projects from API`);
      } catch (error) {
        console.error('Error loading projects:', error);
        snackbarText.value = '❌ Failed to load projects';
        snackbarColor.value = 'error';
        snackbar.value = true;
      }
    };

    // Helper functions
    const mapBackendStatusToFrontend = (backendStatus) => {
      const statusMapping = {
        'pending': 'new',
        'in_progress': 'in-progress', 
        'completed': 'completed',
        'cancelled': 'new' // Map cancelled back to new
      };
      return statusMapping[backendStatus] || 'new';
    };

    const mapFrontendStatusToBackend = (frontendStatus) => {
      const statusMapping = {
        'new': 'pending',
        'in-progress': 'in_progress',
        'completed': 'completed'
      };
      return statusMapping[frontendStatus] || 'pending';
    };

    const calculateProgress = (status) => {
      switch (status) {
        case 'pending': return 10;
        case 'in_progress': return 50;
        case 'completed': return 100;
        case 'cancelled': return 0;
        default: return 10;
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    };

    const formatLastUpdate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      return formatDate(dateString);
    };

    const getRandomIcon = () => {
      const icons = [
        'mdi-pound', 'mdi-penguin', 'mdi-paypal', 'mdi-diamond-stone',
        'mdi-cellphone', 'mdi-shopping', 'mdi-chart-line', 'mdi-web'
      ];
      return icons[Math.floor(Math.random() * icons.length)];
    };

    const getRandomIconBg = () => {
      const backgrounds = [
        'rgba(233, 30, 99, 0.1)', 'rgba(255, 193, 7, 0.1)', 'rgba(33, 150, 243, 0.1)',
        'rgba(76, 175, 80, 0.1)', 'rgba(156, 39, 176, 0.1)', 'rgba(255, 87, 34, 0.1)'
      ];
      return backgrounds[Math.floor(Math.random() * backgrounds.length)];
    };

    const getRandomIconColor = () => {
      const colors = [
        'pink-darken-1', 'amber-darken-1', 'blue-darken-1', 'green-darken-1',
        'purple-darken-1', 'deep-orange-darken-1'
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Computed properties
    const getTasksByStatus = (status) => {
      return tasks.value.filter(task => task.status === status);
    };

    // Methods
    const getTeamMemberAvatar = (memberId) => {
      const member = teamMembers.value.find(m => m.id === memberId);
      return member ? member.avatar : '';
    };

    const navigateToProjectCreate = () => {
      router.push({ name: 'ProjectCreate' });
    };

    // Drag and Drop Methods
    const onDragStart = (event, task) => {
      draggedTask.value = task;
      dragActive.value = true;
      event.dataTransfer.setData('text/plain', task.id.toString());
      event.dataTransfer.effectAllowed = 'move';
      
      // Add visual feedback
      setTimeout(() => {
        if (event.target) {
          event.target.style.opacity = '0.5';
        }
      }, 0);
    };

    const onDragEnd = (event) => {
      draggedTask.value = null;
      dragActive.value = false;
      dragOverColumn.value = null;
      
      // Remove visual feedback
      if (event.target) {
        event.target.style.opacity = '1';
      }
    };

    const onDragOver = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    };

    const onDragEnter = (event, columnStatus) => {
      event.preventDefault();
      dragOverColumn.value = columnStatus;
    };

    const onDragLeave = (event) => {
      // Only clear if leaving the column entirely
      if (!event.currentTarget.contains(event.relatedTarget)) {
        dragOverColumn.value = null;
      }
    };

    const onDrop = async (event, newStatus) => {
      event.preventDefault();
      dragOverColumn.value = null;
      
      if (!draggedTask.value) return;
      
      const taskId = event.dataTransfer.getData('text/plain');
      const task = tasks.value.find(t => t.id === taskId);
      
      if (task && task.status !== newStatus) {
        const oldStatus = task.status;
        
        // Update UI optimistically
        task.status = newStatus;
        
        // Update progress for completed tasks
        if (newStatus === 'completed') {
          task.progress = task.total || 100;
          task.lastUpdate = 'Just completed';
        } else if (oldStatus === 'completed') {
          // Reset progress if moving out of completed
          task.progress = Math.floor(task.total * 0.7); // Set to 70% when moving back
          task.lastUpdate = 'Just updated';
        }
        
        try {
          // Save status change to backend
          const { projectAPI } = await import('@/services/api.js');
          await projectAPI.update(task.id, {
            status: mapFrontendStatusToBackend(newStatus)
          });
          
          // Show success message
          showStatusUpdate(task.title, oldStatus, newStatus);
        } catch (error) {
          // Revert UI changes on error
          task.status = oldStatus;
          if (oldStatus === 'completed') {
            task.progress = task.total || 100;
          }
          
          console.error('Failed to update project status:', error);
          snackbarText.value = `❌ Failed to update project status: ${error.message}`;
          snackbarColor.value = 'error';
          snackbar.value = true;
        }
      }
      
      draggedTask.value = null;
      dragActive.value = false;
    };

    const showStatusUpdate = (taskTitle, oldStatus, newStatus) => {
      const statusMap = {
        'new': 'New',
        'in-progress': 'In Progress',
        'completed': 'Completed'
      };
      
      snackbarText.value = `"${taskTitle}" moved from ${statusMap[oldStatus]} to ${statusMap[newStatus]}`;
      snackbarColor.value = newStatus === 'completed' ? 'success' : 'info';
      snackbarIcon.value = newStatus === 'completed' ? 'mdi-check-circle' : 'mdi-arrow-right';
      snackbar.value = true;
    };

    // Load projects on component mount
    onMounted(() => {
      loadProjects();
    });

    return {
      router,
      teamMembers,
      tasks,
      draggedTask,
      dragOverColumn,
      dragActive,
      snackbar,
      snackbarText,
      snackbarColor,
      snackbarIcon,
      getTasksByStatus,
      getTeamMemberAvatar,
      navigateToProjectCreate,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragEnter,
      onDragLeave,
      onDrop,
      loadProjects
    };
  }
});
</script>

<style scoped>
/* Add the same styles as the original file */
.main-content {
  margin-left: 280px;
  padding-top: 80px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-section {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
}

.stat-text h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: #2c3e50;
}

.stat-text p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.projects-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.action-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.kanban-column {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  min-height: 600px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.kanban-column.drag-over {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  transform: scale(1.02);
}

.column-header {
  margin-bottom: 1.5rem;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-icon.new-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.title-icon.progress-icon {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.title-icon.completed-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.column-title h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.task-count {
  background: #f1f5f9;
  color: #64748b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  cursor: grab;
  transition: all 0.3s ease;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.task-card:active {
  cursor: grabbing;
}

.task-card.completed-task {
  opacity: 0.9;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.task-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.completed-badge {
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-content {
  margin-bottom: 1rem;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.task-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.task-progress {
  margin-bottom: 1rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.progress-text.completed {
  color: #22c55e;
}

.progress-total {
  font-size: 0.75rem;
  color: #64748b;
}

.progress-status {
  font-size: 0.75rem;
  color: #22c55e;
  font-weight: 600;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-avatars {
  display: flex;
  align-items: center;
  gap: -0.5rem;
}

.team-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -0.25rem;
}

.team-avatar:first-child {
  margin-left: 0;
}

.team-avatar.more-members {
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-meta {
  text-align: right;
}

.task-date {
  font-size: 0.75rem;
  color: #64748b;
  display: block;
}

.task-update {
  font-size: 0.75rem;
  color: #94a3b8;
}

.task-update.completed {
  color: #22c55e;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #94a3b8;
}

.empty-state p {
  margin: 1rem 0;
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
    padding-top: 60px;
  }
  
  .kanban-board {
    grid-template-columns: 1fr;
  }
  
  .stats-cards {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .kanban-column {
    padding: 1rem;
  }
}
</style>
