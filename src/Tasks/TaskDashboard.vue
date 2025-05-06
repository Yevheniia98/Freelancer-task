<template>
  <v-app>
    <LeftMenu />
      
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-6"
      >
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4 font-weight-bold">
            Tasks
          </h1>
          <div class="d-flex align-center">
            <v-btn
              icon
              class="mr-2"
              color="primary"
            >
              <v-icon>mdi-translate</v-icon>
            </v-btn>
            <v-btn
              icon
              class="mr-2"
              color="warning"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-text-field
              v-model="search"
              label="Search"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              outlined
              dense
              class="mr-4"
              style="max-width: 200px"
            />
          </div>
        </div>
  
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
                  <div class="text-h3 font-weight-bold">
                    103k
                  </div>
                </div>
                <v-avatar
                  color="light-blue-lighten-4"
                  size="56"
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
                <span class="ml-2 text-body-2">vs. previous month</span>
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
                  <div class="text-h3 font-weight-bold">
                    5k
                  </div>
                </div>
                <v-avatar
                  color="amber-lighten-4"
                  size="56"
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
                <span class="ml-2 text-body-2">vs. previous month</span>
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
                  <div class="text-h3 font-weight-bold">
                    98k
                  </div>
                </div>
                <v-avatar
                  color="teal-lighten-4"
                  size="56"
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
                <span class="ml-2 text-body-2">vs. previous month</span>
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
                  <div class="text-h3 font-weight-bold">
                    12,8%
                  </div>
                </div>
                <v-avatar
                  color="red-lighten-4"
                  size="56"
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
                <span class="ml-2 text-body-2">vs. previous month</span>
              </div>
            </v-card>
          </v-col>
        </v-row>
  
        <v-card
          class="mt-6"
          elevation="1"
          rounded="lg"
        >
          <v-card-title class="d-flex justify-space-between align-center pa-6">
            <h2 class="text-h5">
              All Tasks
            </h2>
            <v-btn 
              color="teal" 
              variant="elevated" 
              class="text-white"
              @click="openCreateDialog"
            >
              Create Task
            </v-btn>
          </v-card-title>
            
          <v-card-text class="pa-0">
            <div class="d-flex flex-wrap pa-4 gap-4">
              <v-text-field
                v-model="taskSearch"
                label="Search for task"
                append-inner-icon="mdi-magnify"
                single-line
                hide-details
                outlined
                density="comfortable"
                class="flex-grow-1"
                style="max-width: 500px"
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
                    class="flex-grow-1"
                    style="max-width: 250px"
                  />
                </template>
                <v-date-picker range />
              </v-menu>
            </div>
              
            <v-data-table
              :headers="headers"
              :items="filteredTasks"
              :search="taskSearch"
              hover
              class="elevation-0"
            >
              <template #[`item.status`]="{ item }">
                <v-chip
                  :color="getStatusColor(item.status).color"
                  :text-color="getStatusColor(item.status).textColor"
                  size="small"
                >
                  {{ item.status }}
                </v-chip>
              </template>
                
              <template #[`item.priority`]="{ item }">
                <v-chip
                  :color="getPriorityColor(item.priority).color"
                  :text-color="getPriorityColor(item.priority).textColor"
                  size="small"
                >
                  {{ item.priority }}
                </v-chip>
              </template>
                
              <template #[`item.actions`]="{ item }">
                <v-btn
                  icon
                  color="red" 
                  variant="text"
                  @click="deleteTask(item.id)"
                >
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
                <v-btn
                  icon
                  color="blue"
                  variant="text"
                  @click="editTask(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
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
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="taskDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal" 
            variant="elevated" 
            class="text-white"
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
    >
      <v-card>
        <v-card-title class="text-h5">
          Delete Task
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this task? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="red"
            variant="elevated"
            class="text-white"
            @click="confirmDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import LeftMenu from '@/dashboard/LeftMenu.vue';
  
  // Data
  const search = ref('');
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
  
  const headers = ref([
    { title: 'Project', key: 'project', sortable: true },
    { title: 'Task', key: 'task', sortable: true },
    { title: 'Client Name', key: 'clientName', sortable: true },
    { title: 'Due Date', key: 'dueDate', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Priority', key: 'priority', sortable: true },
    { title: '', key: 'actions', sortable: false, align: 'end' },
  ]);
  
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
    // You could fetch tasks from an API here
  });
  </script>
  
  <style scoped>
  .v-data-table ::v-deep .v-data-table-header th {
    white-space: nowrap;
    font-weight: bold !important;
  }
  </style>