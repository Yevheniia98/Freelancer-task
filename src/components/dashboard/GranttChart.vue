<template>
    <v-container fluid class="gantt-chart-container">
      <v-card>
        <v-card-title class="d-flex align-center">
          <h2>Project Management Gantt Chart</h2>
          <v-spacer></v-spacer>
          
          <!-- Toolbar -->
          <v-btn-toggle v-model="viewMode" mandatory>
            <v-btn value="day">Day</v-btn>
            <v-btn value="week">Week</v-btn>
            <v-btn value="month">Month</v-btn>
          </v-btn-toggle>
  
          <v-btn 
            color="primary" 
            class="ml-3" 
            @click="openTaskCreationDialog"
          >
            <v-icon left>mdi-plus</v-icon>
            Create Task
          </v-btn>
        </v-card-title>
  
        <!-- Gantt Chart Container -->
        <div class="gantt-chart-wrapper">
          <!-- Columns and Timeline Container -->
          <div class="gantt-grid-container">
            <!-- Left Side: Task Details -->
            <div class="task-details-column">
              <div class="task-details-header">
                <div>Task Name</div>
                <div>Assignee</div>
                <div>Progress</div>
              </div>
              
              <!-- Task Detail Rows -->
              <div 
                v-for="task in tasks" 
                :key="task.id" 
                class="task-detail-row"
              >
                <div class="task-name">
                  <v-icon 
                    :color="getTaskTypeColor(task.type)"
                    class="mr-2"
                  >
                    {{ getTaskTypeIcon(task.type) }}
                  </v-icon>
                  {{ task.name }}
                </div>
                
                <div class="task-assignee">
                  <v-avatar size="32" class="mr-2">
                    <img :src="task.assignee.avatar" :alt="task.assignee.name">
                  </v-avatar>
                  {{ task.assignee.name }}
                </div>
                
                <div class="task-progress">
                  <v-progress-linear
                    :value="task.progress"
                    height="20"
                    color="primary"
                  >
                    <template v-slot:default="{ value }">
                      {{ Math.round(value) }}%
                    </template>
                  </v-progress-linear>
                </div>
              </div>
            </div>
  
            <!-- Right Side: Timeline and Task Bars -->
            <div class="timeline-container">
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
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">
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
              ></v-text-field>
              
              <v-select
                v-model="currentTask.type"
                :items="taskTypes"
                label="Task Type"
              ></v-select>
              
              <v-select
                v-model="currentTask.assignee"
                :items="teamMembers"
                item-title="name"
                item-value="id"
                label="Assignee"
              ></v-select>
              
              <v-slider
                v-model="currentTask.progress"
                label="Progress"
                min="0"
                max="100"
              ></v-slider>
              
              <v-row>
                <v-col cols="6">
                  <v-date-picker 
                    v-model="currentTask.startDate"
                    label="Start Date"
                  ></v-date-picker>
                </v-col>
                <v-col cols="6">
                  <v-date-picker 
                    v-model="currentTask.endDate"
                    label="End Date"
                  ></v-date-picker>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="taskDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="saveTask">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  
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
      opacity: task.progress / 100
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
  .gantt-chart-container {
    background-color: #f5f5f5;
  }
  
  .gantt-chart-wrapper {
    overflow-x: auto;
  }
  
  .gantt-grid-container {
    display: flex;
    min-width: 1200px;
  }
  
  .task-details-column {
    width: 300px;
    background-color: #f0f0f0;
    border-right: 1px solid #e0e0e0;
  }
  
  .task-details-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    font-weight: bold;
    padding: 10px;
    background-color: #e0e0e0;
  }
  
  .task-detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .timeline-container {
    flex-grow: 1;
    position: relative;
  }
  
  .timeline-header {
    display: flex;
    background-color: #e0e0e0;
  }
  
  .timeline-date {
    flex: 1;
    padding: 10px;
    text-align: center;
    border-right: 1px solid #d0d0d0;
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
  }
  </style>