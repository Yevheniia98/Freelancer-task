<!-- Tasks.vue -->
<template>
  <v-app>
    <LeftMenu
      ref="leftMenuRef" 
      сlass="left-menu-component"
    />
    <SearchBar />
      
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container
          fluid
          class="px-6 py-8"
        >
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Task</span> Management
              </h1>
              <p class="hero-subtitle">
                Organize and track your tasks efficiently to boost productivity
              </p>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
                @click="openCreateDialog"
              >
                <v-icon class="mr-2">
                  mdi-plus
                </v-icon>
                Create Task
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container
        fluid
        class="content-container px-6 pb-8"
      >
        <!-- Task Statistics Section -->
        <div class="tool-section">
          <!-- Error Message -->
          <v-alert
            v-if="errorMessage"
            type="error"
            class="mb-4"
            closable
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>
          
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="primary"
              >
                mdi-chart-box
              </v-icon>
              <h2 class="section-heading">
                Task Statistics
              </h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              4 metrics
            </v-chip>
          </div>
          
          <div class="stats-grid">
            <!-- Total Tasks Card -->
            <div class="stat-item">
              <div class="stat-card total-tasks-card">
                <div class="stat-icon-wrapper total-tasks-icon">
                  <v-icon
                    class="stat-icon"
                    color="white"
                  >
                    mdi-file-document-outline
                  </v-icon>
                </div>
                <div class="stat-info">
                  <h3 class="stat-title">
                    Total Tasks
                  </h3>
                  <div class="stat-amount">
                    {{ isLoadingStats ? '...' : statistics.totalTasks.toLocaleString() }}
                  </div>
                  <div class="stat-change positive">
                    <v-icon size="small">
                      mdi-arrow-up
                    </v-icon>
                    Total tasks in your account
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Pending Tasks Card -->
            <div class="stat-item">
              <div class="stat-card pending-tasks-card">
                <div class="stat-icon-wrapper pending-tasks-icon">
                  <v-icon
                    class="stat-icon"
                    color="white"
                  >
                    mdi-timer-sand
                  </v-icon>
                </div>
                <div class="stat-info">
                  <h3 class="stat-title">
                    Pending Tasks
                  </h3>
                  <div class="stat-amount">
                    {{ isLoadingStats ? '...' : statistics.pendingTasks.toLocaleString() }}
                  </div>
                  <div class="stat-change negative">
                    <v-icon size="small">
                      mdi-clock-outline
                    </v-icon>
                    Tasks awaiting progress
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Completed Tasks Card -->
            <div class="stat-item">
              <div class="stat-card completed-tasks-card">
                <div class="stat-icon-wrapper completed-tasks-icon">
                  <v-icon
                    class="stat-icon"
                    color="white"
                  >
                    mdi-check-circle
                  </v-icon>
                </div>
                <div class="stat-info">
                  <h3 class="stat-title">
                    Completed Tasks
                  </h3>
                  <div class="stat-amount">
                    {{ isLoadingStats ? '...' : statistics.completedTasks.toLocaleString() }}
                  </div>
                  <div class="stat-change positive">
                    <v-icon size="small">
                      mdi-check
                    </v-icon>
                    Successfully finished tasks
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Completion Rate Card -->
            <div class="stat-item">
              <div class="stat-card deleted-tasks-card">
                <div class="stat-icon-wrapper deleted-tasks-icon">
                  <v-icon
                    class="stat-icon"
                    color="white"
                  >
                    mdi-chart-line
                  </v-icon>
                </div>
                <div class="stat-info">
                  <h3 class="stat-title">
                    Completion Rate
                  </h3>
                  <div class="stat-amount">
                    {{ isLoadingStats ? '...' : statistics.completionRate.toFixed(1) }}%
                  </div>
                  <div class="stat-change positive">
                    <v-icon size="small">
                      mdi-trending-up
                    </v-icon>
                    Your productivity metric
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Management Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="warning"
              >
                mdi-format-list-checks
              </v-icon>
              <h2 class="section-heading">
                All Tasks
              </h2>
            </div>
            <div class="section-actions">
              <v-chip
                size="small"
                color="warning"
                variant="outlined"
                class="count-chip"
              >
                {{ filteredTasks.length }} tasks
              </v-chip>
              <v-btn
                color="warning"
                variant="outlined"
                size="small"
                rounded="lg"
                class="ml-2"
                @click="openCreateDialog"
              >
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  mdi-plus
                </v-icon>
                Add Task
              </v-btn>
            </div>
          </div>
          
          <div class="task-management-container">
            <div class="task-management-card">
              <!-- Search and Filters -->
              <div class="task-filters">
                <v-text-field
                  v-model="taskSearch"
                  label="Search for task"
                  variant="outlined"
                  density="comfortable"
                  prepend-inner-icon="mdi-magnify"
                  hide-details
                  class="search-field"
                />
                
                <v-menu>
                  <template #activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      label="Select date range"
                      variant="outlined"
                      density="comfortable"
                      readonly
                      hide-details
                      append-inner-icon="mdi-calendar"
                      class="date-field"
                    />
                  </template>
                  <v-date-picker range />
                </v-menu>
              </div>
              
              <!-- Tasks Table -->
              <div class="tasks-table-container">
                <v-data-table
                  :headers="responsiveHeaders"
                  :items="filteredTasks"
                  :search="taskSearch"
                  hover
                  class="tasks-table"
                  :items-per-page="isMobile ? 5 : 10"
                  :mobile-breakpoint="0"
                >
                  <template #[`item.status`]="{ item }">
                    <v-chip
                      :color="getStatusColor(item.status).color"
                      :text-color="getStatusColor(item.status).textColor"
                      :size="isMobile ? 'x-small' : 'small'"
                      variant="tonal"
                    >
                      {{ item.status }}
                    </v-chip>
                  </template>
                    
                  <template #[`item.priority`]="{ item }">
                    <v-chip
                      :color="getPriorityColor(item.priority).color"
                      :text-color="getPriorityColor(item.priority).textColor"
                      :size="isMobile ? 'x-small' : 'small'"
                      variant="tonal"
                    >
                      {{ item.priority }}
                    </v-chip>
                  </template>
                    
                  <template #[`item.actions`]="{ item }">
                    <div class="action-buttons">
                      <v-btn
                        icon
                        size="small"
                        color="primary"
                        variant="text"
                        class="action-btn"
                        @click="editTask(item)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        color="error" 
                        variant="text"
                        class="action-btn"
                        @click="deleteTask(item.id)"
                      >
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </div>
                  </template>

                  <template #[`item.dueDate`]="{ item }">
                    <span class="due-date">{{ formatDate(item.dueDate) }}</span>
                  </template>
                </v-data-table>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- Create/Edit Task Dialog -->
    <v-dialog
      v-model="taskDialog"
      max-width="600px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-clipboard-edit
            </v-icon>
            {{ editingTask ? 'Edit Task' : 'Create New Task' }}
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form
            ref="form"
            v-model="isFormValid"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="currentTask.title"
                  label="Title"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Title is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-textarea
                  v-model="currentTask.description"
                  label="Description"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Description is required']"
                  rows="3"
                />
              </v-col>
              
              <v-col cols="12">
                <v-select
                  v-model="currentTask.clientId"
                  :items="clients.map(c => ({ title: c.name, value: c.id }))"
                  label="Client (Optional)"
                  variant="outlined"
                  clearable
                  @update:model-value="updateClientName"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-menu
                  ref="menuRef"
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="currentTask.dueDate"
                      label="Due Date"
                      variant="outlined"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="props"
                    />
                  </template>
                  <v-date-picker
                    v-model="currentTask.dueDate"
                    @input="dateMenu = false"
                  />
                </v-menu>
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="currentTask.status"
                  :items="['New', 'Inprogress', 'Completed']"
                  label="Status"
                  variant="outlined"
                  required
                />
              </v-col>
                
              <v-col cols="12">
                <v-select
                  v-model="currentTask.priority"
                  :items="['Low', 'Medium', 'High']"
                  label="Priority"
                  variant="outlined"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="taskDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isFormValid"
            @click="saveTask"
          >
            <v-icon class="mr-2">
              mdi-content-save
            </v-icon>
            {{ editingTask ? 'Update Task' : 'Create Task' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="error-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-delete-alert
            </v-icon>
            Delete Task
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon
              size="64"
              color="error"
            >
              mdi-delete-circle
            </v-icon>
            <p class="text-body-1 mt-4">
              Are you sure you want to delete this task?
            </p>
            <p class="text-body-2 text-medium-emphasis">
              This action cannot be undone.
            </p>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            rounded="lg"
            @click="confirmDelete"
          >
            <v-icon class="mr-2">
              mdi-delete
            </v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { defineComponent, ref, computed, onMounted, nextTick } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
import { taskService } from '@/services/taskService.js';

export default defineComponent({
  name: 'TasksPage',
  components: {
    LeftMenu,
    SearchBar,
  },
  setup() {
    // Responsive state
    const isMobile = ref(false);
    const isTablet = ref(false);
    const isMenuOpen = ref(false);
    const leftMenuRef = ref(null);
    
    // Update responsive state based on screen size
    const updateResponsiveState = () => {
      isMobile.value = window.innerWidth < 600;
      isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
    };
    
    // Window resize handler
    const handleResize = () => {
      updateResponsiveState();
      checkMenuState();
    };

    // Check menu state by polling the LeftMenu component
    const checkMenuState = () => {
      if (leftMenuRef.value && leftMenuRef.value.drawer !== undefined) {
        isMenuOpen.value = leftMenuRef.value.drawer;
      }
    };

    // Computed class for main content based on menu state and screen size
    const mainContentClass = computed(() => {
      if (isMobile.value) {
        return 'main-content-mobile';
      }
      return isMenuOpen.value ? 'main-content-with-sidebar' : 'main-content-full';
    });

    // Data
    const taskSearch = ref('');
    const taskDialog = ref(false);
    const deleteDialog = ref(false);
    const dateMenu = ref(false);
    const isFormValid = ref(false);
    const form = ref(null);
    const editingTask = ref(false);
    const taskToDeleteId = ref(null);
    
    // Client data (should match ClientMain.vue)
    const clients = ref([
      {
        id: 1,
        name: 'TechFlow Solutions',
        platform: 'Upwork'
      },
      {
        id: 2,
        name: 'Digital Marketing Pro',
        platform: 'Fiverr'
      },
      {
        id: 3,
        name: 'StartupBridge Inc',
        platform: 'Freelancer.com'
      },
      {
        id: 4,
        name: 'Creative Studios',
        platform: 'Direct Client'
      },
      {
        id: 5,
        name: 'E-commerce Solutions Ltd',
        platform: 'Upwork'
      }
    ]);

    // Statistics data from API
    const statistics = ref({
      totalTasks: 0,
      completedTasks: 0,
      inProgressTasks: 0,
      pendingTasks: 0,
      completionRate: 0,
      overdueCount: 0,
      priorityBreakdown: {
        high: 0,
        medium: 0,
        low: 0
      }
    });

    // Loading states
    const isLoadingStats = ref(false);
    const isLoadingTasks = ref(false);
    const errorMessage = ref('');

    // Tasks data from API
    const tasks = ref([]);
    const totalTasksCount = ref(0);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const emptyTask = {
      _id: null,
      title: '',
      description: '',
      dueDate: new Date().toISOString().substr(0, 10),
      status: 'TODO',
      priority: 'medium',
      clientId: null,
      clientName: ''
    };

    const currentTask = ref({...emptyTask});

    const baseHeaders = [
      { title: 'Title', key: 'title', sortable: true },
      { title: 'Description', key: 'description', sortable: true },
      { title: 'Due Date', key: 'dueDate', sortable: true },
      { title: 'Status', key: 'status', sortable: true },
      { title: 'Priority', key: 'priority', sortable: true },
      { title: '', key: 'actions', sortable: false, align: 'end' },
    ];

    // Responsive headers
    const responsiveHeaders = computed(() => {
      if (isMobile.value) {
        return [
          { title: 'Title', key: 'title', sortable: true },
          { title: 'Status', key: 'status', sortable: true },
          { title: 'Priority', key: 'priority', sortable: true },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ];
      } else if (isTablet.value) {
        return [
          { title: 'Title', key: 'title', sortable: true },
          { title: 'Due Date', key: 'dueDate', sortable: true },
          { title: 'Status', key: 'status', sortable: true },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ];
      }
      return baseHeaders;
    });

    // Computed
    const filteredTasks = computed(() => {
      return tasks.value.filter(task => {
        if (!taskSearch.value) return true;
        const searchTerm = taskSearch.value.toLowerCase();
        return (
          (task.title || '').toLowerCase().includes(searchTerm) ||
          (task.description || '').toLowerCase().includes(searchTerm) ||
          (task.status || '').toLowerCase().includes(searchTerm) ||
          (task.priority || '').toLowerCase().includes(searchTerm)
        );
      });
    });

    // Methods
    const fetchStatistics = async () => {
      isLoadingStats.value = true;
      errorMessage.value = '';
      
      try {
        const data = await taskService.getTaskStatistics();
        statistics.value = {
          totalTasks: data.totalTasks || 0,
          completedTasks: data.completedTasks || 0,
          inProgressTasks: data.inProgressTasks || 0,
          pendingTasks: data.pendingTasks || 0,
          completionRate: data.completionRate || 0,
          overdueCount: data.overdueCount || 0,
          priorityBreakdown: data.priorityBreakdown || { high: 0, medium: 0, low: 0 }
        };
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        errorMessage.value = 'Failed to load task statistics. Please check your connection.';
      } finally {
        isLoadingStats.value = false;
      }
    };

    const fetchTasks = async (page = 1) => {
      isLoadingTasks.value = true;
      errorMessage.value = '';
      
      try {
        const options = {
          page: page,
          limit: itemsPerPage.value,
          search: taskSearch.value || undefined
        };
        
        const data = await taskService.getUserTasks(options);
        tasks.value = data.tasks || [];
        totalTasksCount.value = data.totalCount || 0;
        currentPage.value = data.currentPage || 1;
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        errorMessage.value = 'Failed to load tasks. Please check your connection.';
        tasks.value = [];
      } finally {
        isLoadingTasks.value = false;
      }
    };

    const refreshData = async () => {
      await Promise.all([
        fetchStatistics(),
        fetchTasks(currentPage.value)
      ]);
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'COMPLETED':
        case 'Completed':
          return { color: 'success', textColor: 'success' };
        case 'IN_PROGRESS':
        case 'Inprogress':
          return { color: 'primary', textColor: 'primary' };
        case 'TODO':
        case 'New':
          return { color: 'warning', textColor: 'warning' };
        case 'IN_REVIEW':
          return { color: 'info', textColor: 'info' };
        case 'CANCELLED':
          return { color: 'error', textColor: 'error' };
        default:
          return { color: 'grey', textColor: 'grey' };
      }
    };

    const getPriorityColor = (priority) => {
      const priorityLower = (priority || '').toLowerCase();
      switch (priorityLower) {
        case 'high':
          return { color: 'error', textColor: 'error' };
        case 'medium':
          return { color: 'warning', textColor: 'warning' };
        case 'low':
          return { color: 'info', textColor: 'info' };
        default:
          return { color: 'grey', textColor: 'grey' };
      }
    };

    const formatDate = (dateString) => {
      if (isMobile.value) {
        // Shorter format for mobile
        return new Date(dateString).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
      return new Date(dateString).toLocaleDateString();
    };

    const updateClientName = (clientId) => {
      const client = clients.value.find(c => c.id === clientId);
      currentTask.value.clientName = client ? client.name : '';
    };

    const openCreateDialog = () => {
      editingTask.value = false;
      currentTask.value = {...emptyTask};
      taskDialog.value = true;
    };

    const editTask = (task) => {
      editingTask.value = true;
      currentTask.value = {...task};
      taskDialog.value = true;
    };

    const saveTask = async () => {
      if (!isFormValid.value) return;
      
      try {
        console.log('📝 Saving task with data:', currentTask.value);
        
        if (editingTask.value) {
          // Update existing task
          await taskService.updateTask(currentTask.value._id, currentTask.value);
        } else {
          // Create new task
          await taskService.createTask(currentTask.value);
        }
        
        taskDialog.value = false;
        // Refresh data after save
        await refreshData();
      } catch (error) {
        console.error('Failed to save task:', error);
        errorMessage.value = 'Failed to save task. Please try again.';
      }
    };

    const deleteTask = (task) => {
      taskToDeleteId.value = task._id || task.id;
      deleteDialog.value = true;
    };

    const confirmDelete = async () => {
      try {
        await taskService.deleteTask(taskToDeleteId.value);
        deleteDialog.value = false;
        // Refresh data after delete
        await refreshData();
      } catch (error) {
        console.error('Failed to delete task:', error);
        errorMessage.value = 'Failed to delete task. Please try again.';
      }
    };

    // Lifecycle hooks
    onMounted(async () => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Set up interval to check menu state
      const menuCheckInterval = setInterval(() => {
        checkMenuState();
      }, 100);
      
      // Initial check after next tick
      nextTick(() => {
        checkMenuState();
      });
      
      // Load initial data
      try {
        console.log('✅ Loading data...');
        // Fetch initial data
        await refreshData();
      } catch (error) {
        console.error('❌ Error loading data:', error);
        errorMessage.value = 'Authentication error. Please refresh the page.';
      }
      
      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(menuCheckInterval);
      };
    });

    return {
      // Responsive state
      isMobile,
      isTablet,
      isMenuOpen,
      mainContentClass,
      leftMenuRef,
      
      // Data
      taskSearch,
      taskDialog,
      deleteDialog,
      dateMenu,
      isFormValid,
      form,
      editingTask,
      taskToDeleteId,
      tasks,
      currentTask,
      responsiveHeaders,
      clients,
      
      // API data
      statistics,
      isLoadingStats,
      isLoadingTasks,
      errorMessage,
      totalTasksCount,
      currentPage,
      itemsPerPage,
      
      // Computed
      filteredTasks,
      
      // Methods
      getStatusColor,
      getPriorityColor,
      formatDate,
      updateClientName,
      openCreateDialog,
      editTask,
      saveTask,
      deleteTask,
      confirmDelete,
      fetchStatistics,
      fetchTasks,
      refreshData
    };
  }
});
</script>

<style scoped>
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

/* Main Layout - Same as Design Tools */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Hero Section - Same as Design Tools */
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
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA726);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 0 0;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-btn {
  background: white !important;
  color: #0D7C66 !important;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

/* Content Container - Same as Design Tools */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections - Same as Design Tools */
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

.count-chip {
  font-weight: 600;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  position: relative;
}

.stat-card {
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

.stat-card::before {
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

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.total-tasks-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.pending-tasks-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.completed-tasks-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.deleted-tasks-icon {
  background: linear-gradient(135deg, #EF4444, #F87171);
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.05);
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.stat-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10B981;
}

.stat-change.negative {
  color: #EF4444;
}

/* Task Management Container */
.task-management-container {
  width: 100%;
}

.task-management-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.task-management-card::before {
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

.task-management-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.task-management-card:hover::before {
  opacity: 1;
}

/* Task Filters */
.task-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.search-field {
  flex: 1;
  min-width: 250px;
}

.date-field {
  flex-shrink: 0;
  min-width: 200px;
}

/* Tasks Table */
.tasks-table-container {
  position: relative;
  z-index: 1;
}

.tasks-table {
  background: transparent !important;
}

:deep(.tasks-table .v-data-table__wrapper) {
  background: transparent;
}

:deep(.tasks-table .v-data-table-header) {
  background: #f8fafc;
}

:deep(.tasks-table .v-data-table-header th) {
  background: #f8fafc !important;
  font-weight: 600 !important;
  color: #374151 !important;
  border-bottom: 2px solid #e5e7eb !important;
}

:deep(.tasks-table .v-data-table__td) {
  border-bottom: 1px solid #f1f5f9 !important;
}

:deep(.tasks-table tbody tr:hover) {
  background-color: #f8fafc !important;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.v-data-table tbody tr:hover) .action-btn {
  opacity: 1;
}

.due-date {
  font-weight: 500;
  color: #64748b;
}

/* Modal Headers */
.hero-modal-header {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
}

.error-modal-header {
  background: linear-gradient(135deg, #EF4444, #F87171);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Main content positioning for sidebar integration */
.main-content-full {
  margin-left: 0;
  transition: margin-left 0.3s ease;
}

.main-content-with-sidebar {
  margin-left: 280px; /* Adjust this value based on your LeftMenu width */
  transition: margin-left 0.3s ease;
}

.main-content-mobile {
  margin-left: 0;
  transition: none;
}

/* Animation - Same as Design Tools */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  animation: fadeInUp 0.6s ease-out;
}

.tool-section:nth-child(2) {
  animation-delay: 0.1s;
}

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

.tool-section:nth-child(4) {
  animation-delay: 0.3s;
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
  
  .stats-grid {
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
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .task-filters {
    flex-direction: column;
  }
  
  .search-field,
  .date-field {
    min-width: auto;
  }
  
  /* Ensure mobile always has no left margin */
  .main-content-mobile {
    margin-left: 0 !important;
  }
  
  :deep(.tasks-table .v-data-table__wrapper) {
    font-size: 0.875rem;
  }
  
  :deep(.tasks-table .v-data-table-header th) {
    padding: 8px 4px !important;
  }
  
  :deep(.tasks-table .v-data-table__td) {
    padding: 8px 4px !important;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .stat-card,
  .task-management-card {
    padding: 1rem;
  }
  
  .stat-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .stat-icon {
    font-size: 1.25rem;
  }
  
  .stat-amount {
    font-size: 1.5rem;
  }
}

/* Medium screens adjustments */
@media (max-width: 960px) and (min-width: 601px) {
  .main-content-with-sidebar {
    margin-left: 260px; /* Slightly smaller margin for tablets */
  }
}
</style>