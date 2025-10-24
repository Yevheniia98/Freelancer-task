<template>
  <div class="gantt-chart-container">
    <!-- Header and control area -->
    <div class="gantt-header">
      <h2>Gantt Chart</h2>
      
      <div class="controls">
        <!-- Timeline view controls -->
        <div class="view-controls">
          <button 
            class="view-button" 
            :class="{ active: viewMode === 'week' }"
            @click="setViewMode('week')"
          >
            Week
          </button>
          <button 
            class="view-button" 
            :class="{ active: viewMode === 'month' }"
            @click="setViewMode('month')"
          >
            Month
          </button>
          <button 
            class="view-button" 
            :class="{ active: viewMode === 'year' }"
            @click="setViewMode('year')"
          >
            Year
          </button>
        </div>
        
        <!-- Create task button -->
        <button
          class="create-button"
          @click="openCreateDialog"
        >
          <v-icon
            small
            class="mr-1"
          >
            mdi-plus
          </v-icon> Create Release
        </button>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-buttons">
        <button class="toolbar-button">
          <v-icon>mdi-file-document-outline</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-content-copy</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-magnify-plus-outline</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-magnify-minus-outline</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-arrow-expand-all</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-filter-outline</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-eye-outline</v-icon>
        </button>
        <button class="toolbar-button">
          <v-icon>mdi-export</v-icon>
        </button>
      </div>
    </div>

    <!-- Main gantt container -->
    <div class="gantt-table-container">
      <!-- Left side table -->
      <div 
        class="left-column" 
        :style="{ width: leftColumnWidth + 'px' }"
      >
        <table class="gantt-table">
          <thead>
            <tr class="header-row">
              <th class="column-header">
                Product Release
                <div class="column-actions">
                  <v-icon
                    small
                    @click="showColumnMenu('product', $event)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </th>
              <th class="column-header">
                Assignee
                <div class="column-actions">
                  <v-icon
                    small
                    @click="showColumnMenu('assignee', $event)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </th>
              <th class="column-header">
                Status
                <div class="column-actions">
                  <v-icon
                    small
                    @click="showColumnMenu('status', $event)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </th>
              <th class="column-header">
                Priority
                <div class="column-actions">
                  <v-icon
                    small
                    @click="showColumnMenu('priority', $event)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </th>
              <th class="column-header actions-header">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(task, index) in tasks"
              :key="index"
              class="task-row"
            >
              <td
                class="task-cell"
                @dblclick="openEditDialog(task)"
              >
                {{ task.name }}
              </td>
              <td class="task-cell">
                <div
                  v-if="task.assignee"
                  class="assignee"
                >
                  <img
                    :src="task.assignee.avatar"
                    class="avatar"
                  >
                  {{ task.assignee.name }}
                </div>
              </td>
              <td class="task-cell">
                <div
                  v-if="task.status"
                  class="status-badge"
                  :class="getStatusClass(task.status)"
                >
                  {{ task.status }}
                </div>
              </td>
              <td class="task-cell">
                <div
                  v-if="task.priority"
                  class="priority-badge"
                  :class="getPriorityClass(task.priority)"
                >
                  {{ task.priority }}
                </div>
              </td>
              <td class="task-cell actions-cell">
                <div class="row-actions">
                  <button
                    class="edit-btn"
                    @click="openEditDialog(task)"
                    title="Edit task"
                  >
                    <v-icon small>
                      mdi-pencil
                    </v-icon>
                  </button>
                  <button
                    class="delete-btn"
                    @click="deleteTask(task)"
                    title="Delete task"
                  >
                    <v-icon small>
                      mdi-delete
                    </v-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resizer handle -->
      <div 
        class="resizer" 
        @mousedown="startResize"
        @touchstart="startResize"
      />

      <!-- Right side timeline -->
      <div class="right-column">
        <div class="timeline-header">
          <div class="month-headers">
            <div
              v-for="month in visibleMonths"
              :key="month.id"
              class="month-column"
            >
              <div class="month-name">
                {{ month.name }} {{ month.year }}
              </div>
              <div class="date-columns">
                <div
                  v-for="date in month.dates"
                  :key="date"
                  class="date-column"
                >
                  {{ date }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="timeline-body">
          <div
            v-for="(task, index) in tasks"
            :key="index"
            class="timeline-row"
          >
            <div 
              v-for="bar in task.bars" 
              :key="bar.id" 
              class="task-bar" 
              :class="bar.colorClass"
              :style="getBarStyle(bar)"
              @mousedown.left="startBarResize($event, bar, 'left')"
              @mousedown.right="startBarResize($event, bar, 'right')"
              @dblclick="openEditDialog(task)"
            >
              <div
                class="progress-indicator"
                :style="{ width: bar.progress + '%' }"
              />
              <div class="bar-label">
                {{ bar.progress }}%
              </div>
              <div class="resize-handle left" />
              <div class="resize-handle right" />
            </div>
            <div
              v-if="task.assignee"
              class="assignee-name"
            >
              {{ task.assignee.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Column menu popup -->
    <div
      v-if="columnMenu.visible"
      class="column-menu"
      :style="columnMenu.position"
    >
      <div class="menu-item">
        <v-icon small>
          mdi-arrow-expand-horizontal
        </v-icon> Auto Fit all columns
      </div>
      <div class="menu-item">
        <v-icon small>
          mdi-arrow-expand
        </v-icon> Auto Fit this column
      </div>
      <div class="menu-item">
        <v-icon small>
          mdi-sort-ascending
        </v-icon> Sort Ascending
      </div>
      <div class="menu-item disabled">
        <v-icon small>
          mdi-sort-descending
        </v-icon> Sort Descending
      </div>
      <div class="menu-item">
        <v-icon small>
          mdi-view-column
        </v-icon> Columns
        <v-icon
          small
          class="ml-auto"
        >
          mdi-chevron-right
        </v-icon>
      </div>
      <div class="menu-item">
        <v-icon small>
          mdi-filter
        </v-icon> Filter
        <v-icon
          small
          class="ml-auto"
        >
          mdi-chevron-right
        </v-icon>
      </div>
    </div>
    
    <!-- Task Create/Edit Dialog -->
    <div
      v-if="taskDialog.visible"
      class="task-dialog"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ taskDialog.isEdit ? 'Edit Release' : 'Create New Release' }}</h3>
          <button
            class="close-button"
            @click="closeTaskDialog"
          >
            <v-icon>mdi-close</v-icon>
          </button>
        </div>
        
        <div class="dialog-form">
          <div class="form-group">
            <label>Release Name</label>
            <input
              v-model="taskDialog.task.name"
              type="text"
              placeholder="Enter release name"
            >
          </div>
          
          <div class="form-group">
            <label>Assignee</label>
            <select v-model="taskDialog.task.assigneeId">
              <option :value="null">
                -- No Assignee --
              </option>
              <option
                v-for="member in teamMembers"
                :key="member.id"
                :value="member.id"
              >
                {{ member.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Status</label>
            <select v-model="taskDialog.task.status">
              <option value="">
                -- No Status --
              </option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">
                Completed
              </option>
              <option value="Blocked">
                Blocked
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Priority</label>
            <select v-model="taskDialog.task.priority">
              <option value="">
                -- No Priority --
              </option>
              <option value="Normal">
                Normal
              </option>
              <option value="Critical">
                Critical
              </option>
              <option value="Low">
                Low
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Progress (%)</label>
            <input
              v-model="taskDialog.task.progress"
              type="number"
              min="0"
              max="100"
            >
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label>Start Date</label>
              <input
                v-model="taskDialog.task.startDate"
                type="date"
              >
            </div>
            
            <div class="form-group half">
              <label>End Date</label>
              <input
                v-model="taskDialog.task.endDate"
                type="date"
              >
            </div>
          </div>
          
          <div class="form-group">
            <label>Color</label>
            <select v-model="taskDialog.task.colorClass">
              <option value="bar-dark-gray">
                Dark Gray
              </option>
              <option value="bar-purple">
                Purple
              </option>
              <option value="bar-blue">
                Blue
              </option>
              <option value="bar-green">
                Green
              </option>
            </select>
          </div>
        </div>
        
        <div class="dialog-footer">
          <button
            class="cancel-button"
            @click="closeTaskDialog"
          >
            Cancel
          </button>
          <button
            class="save-button"
            @click="saveTask"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GranttChart',
  data() {
    return {
      viewMode: 'month',
      isResizing: false,
      resizingBar: null,
      resizingEdge: null,
      startX: 0,
      startWidth: 0,
      startLeft: 0,
      leftColumnWidth: 300,
      
      columnMenu: {
        visible: false,
        position: { top: '0px', left: '0px' },
        column: null
      },
      
      taskDialog: {
        visible: false,
        isEdit: false,
        task: {
          id: null,
          name: '',
          assigneeId: null,
          status: '',
          priority: '',
          progress: 0,
          startDate: '',
          endDate: '',
          colorClass: 'bar-dark-gray'
        },
        originalTask: null
      },
      
      teamMembers: [
        { id: 1, name: 'Rose Fuller', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
        { id: 2, name: 'Martin Tamer', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
        { id: 3, name: 'John Doe', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { id: 4, name: 'Jane Smith', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
      ],
      
      months: [
        {
          id: 'jul2024',
          name: 'Jul',
          year: 2024,
          dates: ['26', '30', '04', '08', '12', '16', '20', '24', '28']
        },
        {
          id: 'aug2024',
          name: 'Aug',
          year: 2024,
          dates: ['01', '05', '09', '13', '17', '21', '25', '29']
        },
        {
          id: 'sep2024',
          name: 'Sep',
          year: 2024,
          dates: ['02', '06', '10', '14', '18', '22', '26', '30']
        },
        {
          id: 'oct2024',
          name: 'Oct',
          year: 2024,
          dates: ['04', '08', '12', '16', '20', '24', '28']
        }
      ],
      
      tasks: [
        {
          id: 1,
          name: 'Release Roll-out',
          assigneeId: 1,
          status: 'In Progress',
          priority: 'Normal',
          startDate: '2024-07-04',
          endDate: '2024-08-25',
          progress: 47,
          colorClass: 'bar-dark-gray',
          bars: [
            {
              id: 'bar1',
              progress: 47,
              colorClass: 'bar-dark-gray',
              left: 100,
              width: 600
            }
          ]
        },
        {
          id: 2,
          name: 'Q-2 Release',
          assigneeId: null,
          status: '',
          priority: '',
          startDate: '2024-07-12',
          endDate: '2024-08-21',
          progress: 30,
          colorClass: 'bar-dark-gray',
          bars: [
            {
              id: 'bar2',
              progress: 30,
              colorClass: 'bar-dark-gray',
              left: 220,
              width: 400
            }
          ]
        },
        {
          id: 3,
          name: 'Testing',
          assigneeId: 1,
          status: 'In Progress',
          priority: 'Normal',
          startDate: '2024-07-24',
          endDate: '2024-08-17',
          progress: 20,
          colorClass: 'bar-purple',
          bars: [
            {
              id: 'bar3',
              progress: 20,
              colorClass: 'bar-purple',
              left: 340,
              width: 300
            }
          ]
        },
        {
          id: 4,
          name: 'Phase-2',
          assigneeId: 2,
          status: 'In Progress',
          priority: 'Critical',
          startDate: '2024-07-28',
          endDate: '2024-08-21',
          progress: 40,
          colorClass: 'bar-purple',
          bars: [
            {
              id: 'bar4',
              progress: 40,
              colorClass: 'bar-purple',
              left: 380,
              width: 320
            }
          ]
        },
        {
          id: 5,
          name: 'Phase-1',
          assigneeId: null,
          status: '',
          priority: '',
          startDate: '2024-07-16',
          endDate: '2024-08-01',
          progress: 34,
          colorClass: 'bar-dark-gray',
          bars: [
            {
              id: 'bar5',
              progress: 34,
              colorClass: 'bar-dark-gray',
              left: 260,
              width: 180
            }
          ]
        },
        {
          id: 6,
          name: 'Grid',
          assigneeId: 2,
          status: 'In Progress',
          priority: 'Normal',
          startDate: '2024-07-24',
          endDate: '2024-08-05',
          progress: 50,
          colorClass: 'bar-purple',
          bars: [
            {
              id: 'bar6',
              progress: 50,
              colorClass: 'bar-purple',
              left: 340,
              width: 140
            }
          ]
        }
      ],
      
      nextTaskId: 7
    };
  },
  computed: {
    visibleMonths() {
      // In a real implementation, this would filter months based on viewMode
      switch(this.viewMode) {
        case 'week':
          // For demo we'll just return the first month with fewer dates
          return [
            {
              ...this.months[0],
              dates: this.months[0].dates.slice(0, 4)
            }
          ];
        case 'year':
          // For demo we'll return all months
          return this.months;
        case 'month':
        default:
          // Default view shows the first two months
          return this.months.slice(0, 2);
      }
    }
  },
  mounted() {
    // Add event listeners for resizing
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.stopResize);
    document.addEventListener('click', this.closeColumnMenu);
    
    // Process tasks to add assignee objects
    this.processTasks();
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.stopResize);
    document.removeEventListener('click', this.closeColumnMenu);
  },
  methods: {
    processTasks() {
      // Add assignee objects to tasks based on assigneeId
      this.tasks.forEach(task => {
        if (task.assigneeId) {
          task.assignee = this.teamMembers.find(member => member.id === task.assigneeId);
        } else {
          task.assignee = null;
        }
      });
    },
    
    // View mode methods
    setViewMode(mode) {
      this.viewMode = mode;
    },
    
    // Column resizer methods
    startResize(event) {
      this.isResizing = true;
      this.resizingBar = null;
      
      // Get initial positions
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      this.startX = clientX;
      this.startWidth = this.leftColumnWidth;
      
      // Prevent default behaviors
      event.preventDefault();
      document.body.style.userSelect = 'none';
    },
    
    // Bar resizing methods
    startBarResize(event, bar, edge) {
      event.stopPropagation();
      this.isResizing = true;
      this.resizingBar = bar;
      this.resizingEdge = edge;
      
      // Get initial positions
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      this.startX = clientX;
      this.startWidth = bar.width;
      this.startLeft = bar.left;
      
      // Prevent default behaviors
      event.preventDefault();
      document.body.style.userSelect = 'none';
    },
    
    onMouseMove(event) {
      if (!this.isResizing) return;
      
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const deltaX = clientX - this.startX;
      
      if (this.resizingBar) {
        // Resizing a task bar
        if (this.resizingEdge === 'right') {
          // Resize the right edge (width)
          const newWidth = Math.max(30, this.startWidth + deltaX);
          this.resizingBar.width = newWidth;
        } else if (this.resizingEdge === 'left') {
          // Resize the left edge (position and width)
          const maxLeftDelta = this.startWidth - 30;
          const limitedDelta = Math.min(maxLeftDelta, Math.max(-this.startLeft, deltaX));
          
          this.resizingBar.left = this.startLeft + limitedDelta;
          this.resizingBar.width = this.startWidth - limitedDelta;
        }
      } else {
        // Resizing the column width
        const MIN_WIDTH = 200;
        const MAX_WIDTH = 600;
        this.leftColumnWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, this.startWidth + deltaX));
      }
    },
    
    stopResize() {
      this.isResizing = false;
      this.resizingBar = null;
      this.resizingEdge = null;
      document.body.style.userSelect = '';
    },
    
    // UI helpers
    getBarStyle(bar) {
      return {
        left: bar.left + 'px',
        width: bar.width + 'px'
      };
    },
    
    getStatusClass(status) {
      const map = {
        'In Progress': 'status-progress',
        'Completed': 'status-complete',
        'Blocked': 'status-blocked'
      };
      return map[status] || '';
    },
    
    getPriorityClass(priority) {
      const map = {
        'Normal': 'priority-normal',
        'Critical': 'priority-critical',
        'Low': 'priority-low'
      };
      return map[priority] || '';
    },
    
    // Column menu functions
    showColumnMenu(column, event) {
      if (event) {
        const rect = event.target.getBoundingClientRect();
        
        this.columnMenu.visible = true;
        this.columnMenu.column = column;
        this.columnMenu.position = {
          top: (rect.bottom + 8) + 'px', // Increased spacing from 5px to 8px
          left: (rect.left - 20) + 'px'  // Offset left by 20px to prevent overlap
        };
        
        event.stopPropagation();
      }
    },
    
    closeColumnMenu() {
      this.columnMenu.visible = false;
    },
    
    // Task CRUD operations
    openCreateDialog() {
      // Reset task dialog data
      this.taskDialog.task = {
        id: null,
        name: 'New Release',
        assigneeId: null,
        status: 'In Progress',
        priority: 'Normal',
        progress: 0,
        startDate: this.formatDateForInput(new Date()),
        endDate: this.formatDateForInput(new Date(Date.now() + 14*24*60*60*1000)), // +14 days
        colorClass: 'bar-dark-gray'
      };
      
      this.taskDialog.isEdit = false;
      this.taskDialog.visible = true;
    },
    
    openEditDialog(task) {
      // Clone the task to avoid direct mutation
      this.taskDialog.task = {
        id: task.id,
        name: task.name,
        assigneeId: task.assigneeId,
        status: task.status,
        priority: task.priority,
        progress: task.progress,
        startDate: task.startDate,
        endDate: task.endDate,
        colorClass: task.colorClass
      };
      
      this.taskDialog.isEdit = true;
      this.taskDialog.originalTask = task;
      this.taskDialog.visible = true;
    },
    
    closeTaskDialog() {
      this.taskDialog.visible = false;
    },
    
    saveTask() {
      const taskData = this.taskDialog.task;
      
      if (this.taskDialog.isEdit) {
        // Update existing task
        const task = this.taskDialog.originalTask;
        task.name = taskData.name;
        task.assigneeId = taskData.assigneeId;
        task.assignee = taskData.assigneeId ? 
          this.teamMembers.find(m => m.id === taskData.assigneeId) : null;
        task.status = taskData.status;
        task.priority = taskData.priority;
        task.progress = taskData.progress;
        task.startDate = taskData.startDate;
        task.endDate = taskData.endDate;
        task.colorClass = taskData.colorClass;
        
        // Update the bar data
        if (task.bars && task.bars.length > 0) {
          task.bars[0].progress = taskData.progress;
          task.bars[0].colorClass = taskData.colorClass;
        }
      } else {
        // Create new task
        const newTask = {
          id: this.nextTaskId++,
          name: taskData.name,
          assigneeId: taskData.assigneeId,
          assignee: taskData.assigneeId ? 
            this.teamMembers.find(m => m.id === taskData.assigneeId) : null,
          status: taskData.status,
          priority: taskData.priority,
          progress: taskData.progress,
          startDate: taskData.startDate,
          endDate: taskData.endDate,
          colorClass: taskData.colorClass,
          bars: [
            {
              id: 'bar' + this.nextTaskId,
              progress: taskData.progress,
              colorClass: taskData.colorClass,
              left: 200, // Default position - would calculate based on dates in real app
              width: 300  // Default width - would calculate based on date range in real app
            }
          ]
        };
        
        this.tasks.push(newTask);
      }
      
      this.closeTaskDialog();
    },
    
    deleteTask(task) {
      if (confirm('Are you sure you want to delete this release?')) {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }
      }
    },
    
    // Helper function to format date for input[type=date]
    formatDateForInput(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style scoped>
.gantt-chart-container {
  position: relative;
  max-width: 1300px;
  max-height: 1000px;
  margin-left: 0px;
  margin-bottom: 100px;
  margin-top: 50px;
  padding: 0;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Poppins, Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header area with controls */
.gantt-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.gantt-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.view-controls {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.view-button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: none;
  border-right: 1px solid #ddd;
  cursor: pointer;
}

.view-button:last-child {
  border-right: none;
}

.view-button.active {
  background: #0C9C8D;
  color: whitesmoke;
  font-weight: 500;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}

.create-button {
  background: #CEEBE8;
  border-color: #bfeae6;
  color: #0C9C8D;
}

.create-button:hover {
  background: #e6f2ff;
}

/* Toolbar */
.toolbar {
  padding: 6px 8px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.toolbar-buttons {
  display: flex;
  gap: 10px;
}

.toolbar-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: darkgrey;
}

.toolbar-button:hover {
  background-color: #85CDC6;
  color: white;
}

/* Gantt table container */
.gantt-table-container {
  display: flex;
  height: calc(100% - 100px); /* Subtract header and toolbar heights */
  min-height: 200px;
  max-height: 380px; /* Ensure it fits within the 500px container with headers */
  overflow: hidden;
}

/* Left column styles */
.left-column {
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  transition: width 0.05s ease;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100%;
}

.gantt-table {
  width: 100%;
  border-collapse: collapse;
}

.column-header {
  position: relative;
  padding: 12px 50px 12px 20px; /* Increased right padding to make room for menu */
  background-color: #f9f9f9;
  font-weight: 500;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.column-actions {
  position: absolute;
  right: 15px; /* Increased from 10px to 15px for more spacing */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 8px;
}

.column-actions i {
  cursor: pointer;
  opacity: 0.6;
  padding: 4px; /* Add padding for better clickable area */
  border-radius: 4px; /* Add border radius for better visual feedback */
  transition: all 0.2s ease; /* Smooth transition */
}

.column-actions i:hover {
  opacity: 1;
  background-color: rgba(12, 156, 141, 0.1); /* Light teal background on hover */
  color: #0C9C8D; /* Teal color on hover */
}

.task-row {
  border-bottom: 1px solid #f0f0f0;
}

.task-row:hover {
  background-color: #f9f9f9;
}

.task-cell {
  padding: 10px 16px;
  vertical-align: middle;
  position: relative;
  text-align: left;
}

/* Actions column styles */
.actions-header {
  width: 120px;
  min-width: 120px;
}

.actions-cell {
  width: 120px;
  min-width: 120px;
  text-align: center;
}

.row-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.edit-btn, .delete-btn {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  background-color: #0C9C8D;
  color: white;
  border-color: #0C9C8D;
  transform: translateY(-1px);
}

.delete-btn:hover {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
  transform: translateY(-1px);
}
 
.assignee {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.status-badge, .priority-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 12px;
}

.status-progress {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-complete {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-blocked {
  background-color: #ffebee;
  color: #c62828;
}

.priority-normal {
  background-color: #f3e5f5;
  color: #9c27b0;
}

.priority-critical {
  background-color: #ffebee;
  color: #d32f2f;
}

.priority-low {
  background-color: #e0f2f1;
  color: #00796b;
}

/* Resizer */
.resizer {
  width: 6px;
  background-color: #2196f3; /* Made blue by default to match the image */
  cursor: col-resize;
  transition: background-color 0.2s;
  flex-shrink: 0; /* Prevent shrinking */
}

.resizer:hover, .resizer:active {
  background-color: #1976d2; /* Darker blue on hover */
}

/* Right column styles */
.right-column {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  background-color: #fff;
  max-height: 100%;
  min-width: 500px; /* Ensure minimum width for timeline area */
}

.timeline-header {
  position: sticky;
  top: 0;
  z-index: 2;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  width: fit-content;
  min-width: 800px; /* Increased minimum width to ensure full timeline visibility */
}

.month-headers {
  display: flex;
}

.month-column {
  flex: 1;
  min-width: 300px; /* Add minimum width for better column display */
}

.month-name {
  padding: 8px;
  text-align: center;
  font-weight: 500;
  border-right: 1px solid #e0e0e0;
}

.date-columns {
  display: flex;
}

.date-column {
  flex: 1;
  min-width: 60px; /* Increased from 40px to 60px for better spacing */
  padding: 8px 0;
  text-align: center;
  border-right: 1px solid #e0e0e0;
  font-size: 12px;
  color: #666;
}

.timeline-body {
  position: relative;
  width: fit-content;
  min-width: 800px; /* Increased minimum width to match header */
}

.timeline-row {
  position: relative;
  height: 50px;
  border-bottom: 1px solid #f0f0f0;
}

.task-bar {
  position: absolute;
  height: 30px;
  top: 10px;
  border-radius: 4px;
  color: white;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: pointer;
}

.bar-dark-gray {
  background-color: #424242;
}

.bar-purple {
  background-color: #673ab7;
}

.bar-blue {
  background-color: #1976d2;
}

.bar-green {
  background-color: #388e3c;
}

.progress-indicator {
  position: absolute;
  height: 100%;
  left: 0;
  top: 0;
  background-color: rgba(255, 255, 255, 0.15);
  z-index: 1;
}

.bar-label {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: bold;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 100%;
  top: 0;
  cursor: ew-resize;
  z-index: 3;
}

.resize-handle.left {
  left: 0;
}

.resize-handle.right {
  right: 0;
}

.assignee-name {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #666;
}

/* Column menu popup */
.column-menu {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100; /* Increased z-index to ensure it appears above other content */
  min-width: 180px;
  margin-top: 5px; /* Add small margin to create space from the header */
}

.menu-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

.menu-item.disabled {
  opacity: 0.5;
  cursor: default;
}

.menu-item i {
  font-size: 14px;
  width: 18px;
  text-align: center;
}

.icon-chevron-right {
  margin-left: auto;
}

/* Task Dialog */
.task-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background-color: white;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.dialog-header h3 {
  margin: 0;
  font-weight: 500;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.dialog-form {
  padding: 16px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group.half {
  flex: 1;
}

.dialog-footer {
  padding: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
}

.cancel-button, .save-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
}

.save-button {
  background-color: #1976d2;
  border: 1px solid #0d47a1;
  color: white;
}
</style>