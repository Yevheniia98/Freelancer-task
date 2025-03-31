<template>
    <v-container fluid class="pa-0">
      <v-card>
        <v-card-title class="d-flex align-center">
          <h2>Project Management Dashboard</h2>
          <v-spacer />
          
          <!-- Toolbar from your original code -->
          <v-btn-toggle v-model="viewMode" mandatory>
            <v-btn value="day">Day</v-btn>
            <v-btn value="week">Week</v-btn>
            <v-btn value="month">Month</v-btn>
          </v-btn-toggle>
  
          <v-btn color="primary" class="ml-3" @click="openTaskCreationDialog">
            <v-icon left>mdi-plus</v-icon>
            Create Task
          </v-btn>
        </v-card-title>
  
        <!-- Resizable columns layout -->
        <div class="resizable-container">
          <!-- Left column (data table) -->
          <div class="left-column" :style="{ width: leftColumnWidth + 'px' }">
            <v-data-table
              :headers="headers"
              :items="tasks"
              class="elevation-1"
            >
              <template #[`item.type`]="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="getTaskTypeColor(item.type)" class="mr-2">
                    {{ getTaskTypeIcon(item.type) }}
                  </v-icon>
                  {{ item.type }}
                </div>
              </template>
              
              <template #[`item.assignee`]="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-2">
                    <img :src="item.assignee.avatar" :alt="item.assignee.name">
                  </v-avatar>
                  {{ item.assignee.name }}
                </div>
              </template>
              
              <template #[`item.progress`]="{ item }">
                <v-progress-linear
                  :value="item.progress"
                  height="20"
                  color="primary"
                >
                  <template #default="{ value }">
                    {{ Math.round(value) }}%
                  </template>
                </v-progress-linear>
              </template>
            </v-data-table>
          </div>
          
          <!-- Resizer handle -->
          <div 
            class="resizer" 
            @mousedown="startResize"
            @touchstart="startResize"
          ></div>
          
          <!-- Right column (timeline) -->
          <div class="right-column">
            <!-- Timeline Header -->
            <div class="timeline-header">
              <div 
                v-for="(date, index) in timelineDates" 
                :key="index" 
                class="timeline-date"
              >
                {{ formatDate(date) }}
              </div>
            </div>
  
            <!-- Task Timeline Rows -->
            <div class="timeline-body">
              <div 
                v-for="task in tasks" 
                :key="task.id" 
                class="task-timeline-row"
              >
                <div 
                  class="task-bar" 
                  :style="calculateTaskBarStyle(task)"
                  @click="openTaskEditDialog(task)"
                >
                  <v-tooltip location="bottom">
                    <template #activator="{ props }">
                      <span v-bind="props">
                        {{ task.name }}
                      </span>
                    </template>
                    <span>
                      Start: {{ formatDate(task.startDate) }}<br>
                      End: {{ formatDate(task.endDate) }}<br>
                      Progress: {{ task.progress }}%
                    </span>
                  </v-tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
  
      <!-- Task Creation/Edit Dialog -->
      <v-dialog v-model="taskDialog" max-width="600px">
        <v-card>
          <v-card-title>
            {{ isEditing ? 'Edit Task' : 'Create New Task' }}
          </v-card-title>
          <v-card-text>
            <v-form ref="taskForm">
              <v-text-field 
                v-model="currentTask.name" 
                label="Task Name" 
                required
              />
                
              <v-select
                v-model="currentTask.type"
                :items="taskTypes"
                label="Task Type"
              />
                
              <v-select
                v-model="currentTask.assignee"
                :items="teamMembers"
                item-title="name"
                item-value="id"
                label="Assignee"
              />
                
              <v-slider
                v-model="currentTask.progress"
                label="Progress"
                min="0"
                max="100"
              />
                
              <v-row>
                <v-col cols="6">
                  <v-date-picker 
                    v-model="currentTask.startDate"
                    label="Start Date"
                  />
                </v-col>
                <v-col cols="6">
                  <v-date-picker 
                    v-model="currentTask.endDate"
                    label="End Date"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="taskDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="saveTask"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, computed, onUnmounted } from 'vue'
  
  // Initial column width
  const MIN_COLUMN_WIDTH = 250
  const MAX_COLUMN_WIDTH = 800
  const leftColumnWidth = ref(350)
  const isResizing = ref(false)
  
  // Data table headers
  const headers = [
    { title: 'Task Name', key: 'name' },
    { title: 'Type', key: 'type' },
    { title: 'Assignee', key: 'assignee' },
    { title: 'Progress', key: 'progress' },
    { title: 'Start Date', key: 'startDate' },
    { title: 'End Date', key: 'endDate' },
  ]
  
  // Task Types
  const taskTypes = [
    'Development', 
    'Design', 
    'Testing', 
    'Deployment', 
    'Meeting'
  ]
  
  // Team Members
  const teamMembers = [
    { 
      id: 1, 
      name: 'John Doe', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg' 
    }
  ]
  
  // Initial Tasks
  const tasks = ref([
    {
      id: 1,
      name: 'Frontend Development',
      type: 'Development',
      assignee: teamMembers[0],
      startDate: '2024-03-01',
      endDate: '2024-04-15',
      progress: 60,
    },
    {
      id: 2,
      name: 'Backend API',
      type: 'Development',
      assignee: teamMembers[1],
      startDate: '2024-04-01',
      endDate: '2024-05-20',
      progress: 40,
    }
  ])
  
  // View and Dialog State
  const viewMode = ref('week')
  const taskDialog = ref(false)
  const isEditing = ref(false)
  
  // Current Task for Dialog
  const currentTask = reactive({
    name: '',
    type: '',
    assignee: null,
    startDate: null,
    endDate: null,
    progress: 0
  })
  
  // Timeline Generation
  const timelineDates = computed(() => {
    const dates = []
    const startDate = new Date('2024-03-01')
    const endDate = new Date('2024-06-30')
    
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      
      if (viewMode.value === 'day') {
        currentDate.setDate(currentDate.getDate() + 1)
      } else if (viewMode.value === 'week') {
        currentDate.setDate(currentDate.getDate() + 7)
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1)
      }
    }
    
    return dates
  })
  
  // Resize functionality
  function startResize(event) {
    isResizing.value = true
    
    // Prevent text selection during resize
    document.body.style.userSelect = 'none'
    
    // Store initial mouse/touch position
    const clientX = event.touches ? event.touches[0].clientX : event.clientX
    const initialX = clientX
    const initialWidth = leftColumnWidth.value
    
    function onResize(e) {
      if (isResizing.value) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX
        const newWidth = initialWidth + (clientX - initialX)
        
        // Apply min/max constraints
        leftColumnWidth.value = Math.max(MIN_COLUMN_WIDTH, Math.min(MAX_COLUMN_WIDTH, newWidth))
      }
    }
    
    function stopResize() {
      isResizing.value = false
      document.body.style.userSelect = ''
      
      document.removeEventListener('mousemove', onResize)
      document.removeEventListener('touchmove', onResize)
      document.removeEventListener('mouseup', stopResize)
      document.removeEventListener('touchend', stopResize)
    }
    
    document.addEventListener('mousemove', onResize)
    document.addEventListener('touchmove', onResize)
    document.addEventListener('mouseup', stopResize)
    document.addEventListener('touchend', stopResize)
  }
  
  // Clean up event listeners
  onUnmounted(() => {
    document.body.style.userSelect = ''
    document.removeEventListener('mousemove', () => {})
    document.removeEventListener('touchmove', () => {})
    document.removeEventListener('mouseup', () => {})
    document.removeEventListener('touchend', () => {})
  })
  
  // Utility Functions
  function getTaskTypeColor(type) {
    const colorMap = {
      'Development': 'blue',
      'Design': 'green',
      'Testing': 'orange',
      'Deployment': 'purple',
      'Meeting': 'red'
    }
    return colorMap[type] || 'grey'
  }
  
  function getTaskTypeIcon(type) {
    const iconMap = {
      'Development': 'mdi-code-tags',
      'Design': 'mdi-palette',
      'Testing': 'mdi-bug',
      'Deployment': 'mdi-cloud-upload',
      'Meeting': 'mdi-calendar-multiple'
    }
    return iconMap[type] || 'mdi-checkbox-blank-circle'
  }
  
  function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }
  
  function calculateTaskBarStyle(task) {
    const startDate = new Date(task.startDate)
    const endDate = new Date(task.endDate)
    const totalProjectDuration = new Date('2024-06-30') - new Date('2024-03-01')
    const taskDuration = endDate - startDate
    
    const left = (startDate - new Date('2024-03-01')) / totalProjectDuration * 100
    const width = (taskDuration / totalProjectDuration) * 100
    
    return {
      left: `${left}%`,
      width: `${width}%`,
      backgroundColor: getTaskTypeColor(task.type),
      opacity: 0.7 + (task.progress / 300) // Make higher progress tasks slightly more opaque
    }
  }
  
  // Dialog Methods
  function openTaskCreationDialog() {
    resetCurrentTask()
    isEditing.value = false
    taskDialog.value = true
  }
  
  function openTaskEditDialog(task) {
    Object.assign(currentTask, { ...task })
    isEditing.value = true
    taskDialog.value = true
  }
  
  function resetCurrentTask() {
    currentTask.name = ''
    currentTask.type = ''
    currentTask.assignee = null
    currentTask.startDate = null
    currentTask.endDate = null
    currentTask.progress = 0
  }
  
  function saveTask() {
    if (isEditing.value) {
      // Update existing task
      const index = tasks.value.findIndex(t => t.id === currentTask.id)
      if (index !== -1) {
        tasks.value[index] = { ...currentTask }
      }
    } else {
      // Create new task
      tasks.value.push({
        id: tasks.value.length + 1,
        ...currentTask
      })
    }
    taskDialog.value = false
  }
  </script>
  
  <style scoped>
  .resizable-container {
    display: flex;
    overflow: hidden;
    height: calc(100vh - 150px);
    min-height: 500px;
    position: relative;
  }
  
  .left-column {
    overflow-y: auto;
    background-color: #f5f5f5;
    transition: width 0.05s ease;
  }
  
  .right-column {
    flex: 1;
    overflow-x: auto;
    background-color: #fafafa;
    min-width: 400px;
  }
  
  .resizer {
    width: 8px;
    background-color: #e0e0e0;
    cursor: col-resize;
    position: relative;
    z-index: 2;
  }
  
  .resizer:hover, .resizer:active {
    background-color: #bbdefb;
  }
  
  .resizer::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 30px;
    width: 2px;
    background-color: #90a4ae;
  }
  
  .timeline-header {
    display: flex;
    background-color: #e0e0e0;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .timeline-date {
    flex: 1;
    padding: 10px;
    text-align: center;
    border-right: 1px solid #d0d0d0;
    min-width: 100px;
  }
  
  .timeline-body {
    position: relative;
  }
  
  .task-timeline-row {
    height: 50px;
    position: relative;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .task-bar {
    position: absolute;
    height: 30px;
    margin-top: 10px;
    border-radius: 4px;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 10px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .task-bar:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    transform: translateY(-1px);
  }
  </style>