<!-- Fixed Tasks Page with Proper Sidebar Integration -->
<template>
  <v-app>
    <LeftMenu ref="leftMenuRef" />
    <SearchBar />
      
    <v-main 
      class="bg-grey-lighten-4"
      :class="mainContentClass"
    >
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <!-- Header - Made responsive -->
        <div class="d-flex justify-space-between align-center mb-6 flex-wrap">
          <h1 class="text-h4 text-h5-sm font-weight-bold">
            Tasks
          </h1>
          <v-btn 
            color="teal" 
            variant="elevated" 
            class="text-white mt-2 mt-sm-0"
            elevation="0"
            @click="openCreateDialog"
          >
            Create Task
          </v-btn>
        </div>

        <!-- Stats Cards - Made responsive -->
        <v-row>
          <v-col
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              class="pa-4"
              rounded="lg"
              elevation="1"
            >
              <div class="d-flex justify-space-between mb-2">
                <div>
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Total Tasks
                  </div>
                  <div class="text-h3 text-h4-sm font-weight-bold">
                    103k
                  </div>
                </div>
                <v-avatar
                  color="light-blue-lighten-4"
                  :size="isMobile ? 48 : 56"
                >
                  <v-icon color="light-blue">
                    mdi-file-document-outline
                  </v-icon>
                </v-avatar>
              </div>
              <div class="d-flex align-center">
                <v-chip
                  color="light-blue-lighten-5"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon
                    size="small"
                    start
                    color="light-blue"
                  >
                    mdi-arrow-up
                  </v-icon>
                  15.03%
                </v-chip>
                <span class="ml-2 text-body-2 text-caption-sm">vs. previous month</span>
              </div>
            </v-card>
          </v-col>
            
          <v-col
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              class="pa-4"
              rounded="lg"
              elevation="1"
            >
              <div class="d-flex justify-space-between mb-2">
                <div>
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Pending Task
                  </div>
                  <div class="text-h3 text-h4-sm font-weight-bold">
                    5k
                  </div>
                </div>
                <v-avatar
                  color="amber-lighten-4"
                  :size="isMobile ? 48 : 56"
                >
                  <v-icon color="amber">
                    mdi-timer-sand
                  </v-icon>
                </v-avatar>
              </div>
              <div class="d-flex align-center">
                <v-chip
                  color="red-lighten-5"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon
                    size="small"
                    start
                    color="red"
                  >
                    mdi-arrow-down
                  </v-icon>
                  3.5%
                </v-chip>
                <span class="ml-2 text-body-2 text-caption-sm">vs. previous month</span>
              </div>
            </v-card>
          </v-col>
            
          <v-col
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              class="pa-4"
              rounded="lg"
              elevation="1"
            >
              <div class="d-flex justify-space-between mb-2">
                <div>
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Completed Tasks
                  </div>
                  <div class="text-h3 text-h4-sm font-weight-bold">
                    98k
                  </div>
                </div>
                <v-avatar
                  color="teal-lighten-4"
                  :size="isMobile ? 48 : 56"
                >
                  <v-icon color="teal">
                    mdi-check-circle
                  </v-icon>
                </v-avatar>
              </div>
              <div class="d-flex align-center">
                <v-chip
                  color="red-lighten-5"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon
                    size="small"
                    start
                    color="red"
                  >
                    mdi-arrow-down
                  </v-icon>
                  0.5%
                </v-chip>
                <span class="ml-2 text-body-2 text-caption-sm">vs. previous month</span>
              </div>
            </v-card>
          </v-col>
            
          <v-col
            cols="12"
            sm="6"
            lg="3"
          >
            <v-card
              class="pa-4"
              rounded="lg"
              elevation="1"
            >
              <div class="d-flex justify-space-between mb-2">
                <div>
                  <div class="text-subtitle-1 text-medium-emphasis">
                    Deleted Tasks
                  </div>
                  <div class="text-h3 text-h4-sm font-weight-bold">
                    12,8%
                  </div>
                </div>
                <v-avatar
                  color="red-lighten-4"
                  :size="isMobile ? 48 : 56"
                >
                  <v-icon color="red">
                    mdi-delete
                  </v-icon>
                </v-avatar>
              </div>
              <div class="d-flex align-center">
                <v-chip
                  color="light-blue-lighten-5"
                  size="small"
                  class="font-weight-medium"
                >
                  <v-icon
                    size="small"
                    start
                    color="light-blue"
                  >
                    mdi-arrow-up
                  </v-icon>
                  5.1%
                </v-chip>
                <span class="ml-2 text-body-2 text-caption-sm">vs. previous month</span>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Tasks Table Card - Made responsive -->
        <v-card
          class="mt-6"
          elevation="1"
          rounded="lg"
        >
          <v-card-title class="d-flex justify-space-between align-center pa-4 pa-sm-6 flex-wrap">
            <h2 class="text-h5 text-h6-sm">
              All Tasks
            </h2>
            <v-btn 
              color="teal" 
              variant="elevated" 
              class="text-white mt-2 mt-sm-0"
              elevation="0"
              @click="openCreateDialog"
            >
              Create Task
            </v-btn>
          </v-card-title>
            
          <v-card-text class="pa-0">
            <!-- Search and Filter Controls - Made responsive -->
            <div class="d-flex flex-column flex-sm-row pa-4 gap-4">
              <v-text-field
                v-model="taskSearch"
                label="Search for task"
                append-inner-icon="mdi-magnify"
                single-line
                hide-details
                outlined
                density="comfortable"
                class="flex-grow-1"
                style="max-width: none"
              />
                
              <v-menu>
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    label="Select date range"
                    readonly
                    hide-details
                    outlined
                    density="comfortable"
                    append-inner-icon="mdi-calendar"
                    class="flex-grow-1 flex-sm-grow-0"
                    :style="isMobile ? 'max-width: none' : 'max-width: 250px'"
                  />
                </template>
                <v-date-picker range />
              </v-menu>
            </div>
              
            <!-- Data Table - Made responsive -->
            <v-data-table
              :headers="responsiveHeaders"
              :items="filteredTasks"
              :search="taskSearch"
              hover
              class="elevation-0"
              :items-per-page="isMobile ? 5 : 10"
              :mobile-breakpoint="0"
            >
              <template #[`item.status`]="{ item }">
                <v-chip
                  :color="getStatusColor(item.status).color"
                  :text-color="getStatusColor(item.status).textColor"
                  :size="isMobile ? 'x-small' : 'small'"
                >
                  {{ item.status }}
                </v-chip>
              </template>
                
              <template #[`item.priority`]="{ item }">
                <v-chip
                  :color="getPriorityColor(item.priority).color"
                  :text-color="getPriorityColor(item.priority).textColor"
                  :size="isMobile ? 'x-small' : 'small'"
                >
                  {{ item.priority }}
                </v-chip>
              </template>
                
              <template #[`item.actions`]="{ item }">
                <div class="d-flex">
                  <v-btn
                    :icon="!isMobile"
                    :size="isMobile ? 'small' : 'default'"
                    color="blue"
                    variant="text"
                    @click="editTask(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <span
                      v-if="isMobile"
                      class="ml-1"
                    >Edit</span>
                  </v-btn>
                  <v-btn
                    :icon="!isMobile"
                    :size="isMobile ? 'small' : 'default'"
                    color="red" 
                    variant="text"
                    @click="deleteTask(item.id)"
                  >
                    <v-icon>mdi-delete-outline</v-icon>
                    <span
                      v-if="isMobile"
                      class="ml-1"
                    >Delete</span>
                  </v-btn>
                </div>
              </template>

              <!-- Mobile view customization -->
              <template #[`item.dueDate`]="{ item }">
                <span class="text-body-2">{{ formatDate(item.dueDate) }}</span>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Create/Edit Task Dialog -->
    <v-dialog
      v-model="taskDialog"
      max-width="600px"
      fullscreen-breakpoint="sm"
    >
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          {{ editingTask ? 'Edit Task' : 'Create New Task' }}
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <v-form
            ref="form"
            v-model="isFormValid"
          >
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="currentTask.project"
                    label="Project"
                    required
                    :rules="[v => !!v || 'Project is required']"
                  />
                </v-col>
                  
                <v-col
                  cols="12"
                  sm="6"
                >
                  <v-text-field
                    v-model="currentTask.clientName"
                    label="Client Name"
                    required
                    :rules="[v => !!v || 'Client name is required']"
                  />
                </v-col>
                  
                <v-col cols="12">
                  <v-text-field
                    v-model="currentTask.task"
                    label="Task"
                    required
                    :rules="[v => !!v || 'Task is required']"
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
                        prepend-icon="mdi-calendar"
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
                    required
                  />
                </v-col>
                  
                <v-col cols="12">
                  <v-select
                    v-model="currentTask.priority"
                    :items="['Low', 'Medium', 'High']"
                    label="Priority"
                    required
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn
            color="grey"
            variant="text"
            class="flex-grow-1 flex-sm-grow-0"
            @click="taskDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal" 
            variant="elevated" 
            class="text-white flex-grow-1 flex-sm-grow-0"
            :disabled="!isFormValid"
            @click="saveTask"
          >
            {{ editingTask ? 'Update' : 'Create' }}
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
      <v-card>
        <v-card-title class="text-h5 bg-red text-white pa-4">
          Delete Task
        </v-card-title>
        <v-card-text class="pa-4 pt-6">
          Are you sure you want to delete this task? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn
            color="grey"
            variant="text"
            class="flex-grow-1 flex-sm-grow-0"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            variant="elevated"
            class="text-white flex-grow-1 flex-sm-grow-0"
            @click="confirmDelete"
          >
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

    const tasks = ref([
      {
        id: 1,
        project: 'Symax v1.0.0',
        task: 'Add Dynamic Contact List',
        clientName: 'RH Nichols',
        dueDate: '2020-12-15',
        status: 'Inprogress',
        priority: 'Medium'
      },
      {
        id: 2,
        project: 'Doot - Chat App Template',
        task: 'Additional Calendar',
        clientName: 'Henry Baird',
        dueDate: '2019-01-11',
        status: 'Completed',
        priority: 'Low'
      },
      {
        id: 3,
        project: 'Dorshin - Landing Page',
        task: 'Brand Logo design',
        clientName: 'Nathan Cole',
        dueDate: '2021-10-23',
        status: 'New',
        priority: 'High'
      },
      {
        id: 4,
        project: 'Symax v1.0.0',
        task: 'Add Dynamic Contact List',
        clientName: 'RH Nichols',
        dueDate: '2020-12-15',
        status: 'Inprogress',
        priority: 'Medium'
      },
      {
        id: 5,
        project: 'Doot - Chat App Template',
        task: 'Additional Calendar',
        clientName: 'Henry Baird',
        dueDate: '2019-01-11',
        status: 'Completed',
        priority: 'Low'
      },
      {
        id: 6,
        project: 'Dorshin - Landing Page',
        task: 'Brand Logo design',
        clientName: 'Nathan Cole',
        dueDate: '2021-10-23',
        status: 'New',
        priority: 'High'
      }
    ]);

    const emptyTask = {
      id: null,
      project: '',
      task: '',
      clientName: '',
      dueDate: new Date().toISOString().substr(0, 10),
      status: 'New',
      priority: 'Medium'
    };

    const currentTask = ref({...emptyTask});

    const baseHeaders = [
      { title: 'Project', key: 'project', sortable: true },
      { title: 'Task', key: 'task', sortable: true },
      { title: 'Client Name', key: 'clientName', sortable: true },
      { title: 'Due Date', key: 'dueDate', sortable: true },
      { title: 'Status', key: 'status', sortable: true },
      { title: 'Priority', key: 'priority', sortable: true },
      { title: '', key: 'actions', sortable: false, align: 'end' },
    ];

    // Responsive headers
    const responsiveHeaders = computed(() => {
      if (isMobile.value) {
        return [
          { title: 'Task', key: 'task', sortable: true },
          { title: 'Status', key: 'status', sortable: true },
          { title: 'Priority', key: 'priority', sortable: true },
          { title: '', key: 'actions', sortable: false, align: 'end' },
        ];
      } else if (isTablet.value) {
        return [
          { title: 'Project', key: 'project', sortable: true },
          { title: 'Task', key: 'task', sortable: true },
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
        return (
          task.project.toLowerCase().includes(taskSearch.value.toLowerCase()) ||
          task.task.toLowerCase().includes(taskSearch.value.toLowerCase()) ||
          task.clientName.toLowerCase().includes(taskSearch.value.toLowerCase())
        );
      });
    });

    // Methods
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed':
          return { color: 'green-lighten-5', textColor: 'green' };
        case 'Inprogress':
          return { color: 'blue-lighten-5', textColor: 'blue' };
        case 'New':
          return { color: 'purple-lighten-5', textColor: 'purple' };
        default:
          return { color: 'grey-lighten-3', textColor: 'grey-darken-1' };
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'High':
          return { color: 'red-lighten-5', textColor: 'red' };
        case 'Medium':
          return { color: 'amber-lighten-5', textColor: 'amber-darken-2' };
        case 'Low':
          return { color: 'blue-lighten-5', textColor: 'blue' };
        default:
          return { color: 'grey-lighten-3', textColor: 'grey-darken-1' };
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

    const saveTask = () => {
      if (editingTask.value) {
        // Update existing task
        const index = tasks.value.findIndex(task => task.id === currentTask.value.id);
        if (index !== -1) {
          tasks.value[index] = {...currentTask.value};
        }
      } else {
        // Create new task
        const newId = Math.max(0, ...tasks.value.map(t => t.id)) + 1;
        tasks.value.push({
          ...currentTask.value,
          id: newId
        });
      }
      taskDialog.value = false;
    };

    const deleteTask = (id) => {
      taskToDeleteId.value = id;
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      tasks.value = tasks.value.filter(task => task.id !== taskToDeleteId.value);
      deleteDialog.value = false;
    };

    // Lifecycle hooks
    onMounted(() => {
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
      
      // Computed
      filteredTasks,
      
      // Methods
      getStatusColor,
      getPriorityColor,
      formatDate,
      openCreateDialog,
      editTask,
      saveTask,
      deleteTask,
      confirmDelete
    };
  }
});
</script>

<style scoped>
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

/* Data table responsiveness */
.v-data-table ::v-deep .v-data-table-header th {
  white-space: nowrap;
  font-weight: bold !important;
}

/* Responsive text sizes */
.text-h4-sm {
  font-size: 1.5rem !important;
}

.text-h5-sm {
  font-size: 1.25rem !important;
}

.text-h6-sm {
  font-size: 1.125rem !important;
}

.text-caption-sm {
  font-size: 0.75rem !important;
}

/* Gap utility for flexbox */
.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

/* Responsive styles */
@media (max-width: 600px) {
  .v-data-table ::v-deep .v-data-table__wrapper {
    font-size: 0.875rem;
  }
  
  .v-data-table ::v-deep .v-data-table-header th {
    padding: 8px 4px !important;
  }
  
  .v-data-table ::v-deep .v-data-table__td {
    padding: 8px 4px !important;
  }
  
  /* Ensure mobile always has no left margin */
  .main-content-mobile {
    margin-left: 0 !important;
  }
}

/* Medium screens adjustments */
@media (max-width: 960px) and (min-width: 601px) {
  .main-content-with-sidebar {
    margin-left: 260px; /* Slightly smaller margin for tablets */
  }
}

/* Dialog animation */
.v-dialog {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
</style>