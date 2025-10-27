<template>
  <div class="metrics-container">
    <div class="metrics-grid">
      <div
        v-for="(stat, index) in stats"
        :key="stat.title"
        class="metric-card"
        :class="`metric-card-${index + 1}`"
        @click="selectCard(index)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="icon-container" :class="`icon-${index + 1}`">
            <v-icon class="metric-icon">{{ stat.icon }}</v-icon>
          </div>
          <div class="trend-indicator" :class="stat.trend">
            <v-icon class="trend-icon">{{ getTrendIcon(stat.trend) }}</v-icon>
            <span class="trend-text">{{ stat.change }}</span>
          </div>
        </div>

        <!-- Card Content -->
        <div class="card-content">
          <h3 class="metric-title">{{ stat.title }}</h3>
          <div class="metric-value-container">
            <span class="metric-value">{{ stat.value }}</span>
            <span class="metric-unit" v-if="stat.unit">{{ stat.unit }}</span>
          </div>
          <p class="metric-description">{{ stat.description }}</p>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <div class="time-period">
            <v-icon class="period-icon">mdi-calendar-clock</v-icon>
            <span>{{ selectedOptions[stat.title] || 'Last 7 days' }}</span>
          </div>
          
          <!-- Enhanced Dropdown -->
          <v-menu
            v-model="dropdowns[stat.title]"
            location="bottom"
            :close-on-content-click="false"
          >
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                size="small"
                class="period-btn"
                :ripple="false"
              >
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>

            <v-card class="dropdown-card" elevation="12">
              <v-card-title class="dropdown-title">
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                Time Period
              </v-card-title>
              <v-list class="dropdown-list">
                <v-list-item
                  v-for="option in timeOptions"
                  :key="option.value"
                  class="dropdown-option"
                  :class="{ active: selectedOptions[stat.title] === option.value }"
                  @click="selectTime(stat.title, option.value)"
                >
                  <template #prepend>
                    <v-icon class="option-icon">{{ option.icon }}</v-icon>
                  </template>
                  <v-list-item-title class="option-text">{{ option.label }}</v-list-item-title>
                  <template #append v-if="selectedOptions[stat.title] === option.value">
                    <v-icon color="primary">mdi-check-circle</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </div>

        <!-- Animated Background Elements -->
        <div class="card-bg-pattern"></div>
        <div class="card-glow" :class="`glow-${index + 1}`"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    // Initial stats structure
    const stats = ref([
      { 
        title: 'Active Projects', 
        value: '0', 
        unit: '',
        icon: 'mdi-briefcase-variant', 
        trend: 'neutral',
        change: '0%',
        description: 'Projects currently in progress'
      },
      { 
        title: 'Total Tasks', 
        value: '0', 
        unit: '',
        icon: 'mdi-format-list-checks', 
        trend: 'neutral',
        change: '0%',
        description: 'Tasks completed this period'
      },
      { 
        title: 'Team Members', 
        value: '1', 
        unit: '',
        icon: 'mdi-account-group', 
        trend: 'neutral',
        change: '0%',
        description: 'Active team members'
      },
      { 
        title: 'Revenue', 
        value: '0', 
        unit: '',
        icon: 'mdi-trending-up', 
        trend: 'neutral',
        change: '0%',
        description: 'Total earnings this period'
      }
    ]);
    
    // Load user data and calculate real metrics
    const loadUserMetrics = () => {
      try {
        // Get user data
        const userData = localStorage.getItem('user_data');
        const projectsData = localStorage.getItem('projects_data');
        const tasksData = localStorage.getItem('tasks_data');
        const teamData = localStorage.getItem('team_data');
        const financeData = localStorage.getItem('finance_data');
        
        let activeProjects = 0;
        let totalTasks = 0;
        let teamMembers = 1; // At least the user themselves
        let revenue = 0;
        
        // Calculate active projects
        if (projectsData) {
          try {
            const projects = JSON.parse(projectsData);
            activeProjects = Array.isArray(projects) ? projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length : 0;
          } catch (e) {
            console.warn('Error parsing projects data:', e);
          }
        }
        
        // Calculate total tasks
        if (tasksData) {
          try {
            const tasks = JSON.parse(tasksData);
            totalTasks = Array.isArray(tasks) ? tasks.length : 0;
          } catch (e) {
            console.warn('Error parsing tasks data:', e);
          }
        }
        
        // Calculate team members
        if (teamData) {
          try {
            const team = JSON.parse(teamData);
            teamMembers = Array.isArray(team) ? team.length + 1 : 1; // +1 for the user
          } catch (e) {
            console.warn('Error parsing team data:', e);
          }
        }
        
        // Calculate revenue
        if (financeData) {
          try {
            const finance = JSON.parse(financeData);
            if (finance.totalIncome) {
              revenue = parseFloat(finance.totalIncome) || 0;
            } else if (finance.revenue) {
              revenue = parseFloat(finance.revenue) || 0;
            }
          } catch (e) {
            console.warn('Error parsing finance data:', e);
          }
        }
        
        // Update stats with real data
        stats.value[0].value = activeProjects.toString();
        stats.value[0].trend = activeProjects > 0 ? 'up' : 'neutral';
        stats.value[0].change = activeProjects > 0 ? `${activeProjects} active` : 'No active projects';
        
        stats.value[1].value = totalTasks > 999 ? `${(totalTasks/1000).toFixed(1)}k` : totalTasks.toString();
        stats.value[1].trend = totalTasks > 0 ? 'up' : 'neutral';
        stats.value[1].change = totalTasks > 0 ? `${totalTasks} total` : 'No tasks yet';
        
        stats.value[2].value = teamMembers.toString();
        stats.value[2].trend = teamMembers > 1 ? 'up' : 'neutral';
        stats.value[2].change = teamMembers > 1 ? `+${teamMembers - 1} members` : 'Just you';
        
        if (revenue > 0) {
          if (revenue >= 1000000) {
            stats.value[3].value = (revenue / 1000000).toFixed(1);
            stats.value[3].unit = 'M';
          } else if (revenue >= 1000) {
            stats.value[3].value = (revenue / 1000).toFixed(1);
            stats.value[3].unit = 'K';
          } else {
            stats.value[3].value = revenue.toFixed(0);
            stats.value[3].unit = '';
          }
          stats.value[3].trend = 'up';
          stats.value[3].change = `$${revenue.toFixed(0)} earned`;
        } else {
          stats.value[3].value = '0';
          stats.value[3].unit = '';
          stats.value[3].trend = 'neutral';
          stats.value[3].change = 'No revenue yet';
        }
        
        console.log('Metrics updated:', {
          activeProjects,
          totalTasks,
          teamMembers,
          revenue
        });
        
      } catch (error) {
        console.error('Error loading user metrics:', error);
      }
    };
    
    // Listen for data updates
    const handleDataUpdate = () => {
      loadUserMetrics();
    };
    
    // Initialize sample data if none exists
    const initializeSampleData = () => {
      // Only add sample data if user has no existing data
      if (!localStorage.getItem('projects_data')) {
        const today = new Date();
        const formatDate = (date) => date.toISOString().split('T')[0];
        
        const sampleProjects = [
          {
            id: 1,
            name: 'Website Redesign',
            status: 'active',
            progress: 75,
            client: 'TechCorp Inc.',
            startDate: formatDate(new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)), // 2 weeks ago
            endDate: formatDate(new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000)), // 3 weeks from now
            priority: 'High',
            assigneeId: 0
          },
          {
            id: 2,
            name: 'Mobile App Development',
            status: 'active',
            progress: 45,
            client: 'StartupXYZ',
            startDate: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)), // 1 week ago
            endDate: formatDate(new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000)), // 5 weeks from now
            priority: 'Critical',
            assigneeId: 1
          },
          {
            id: 3,
            name: 'Brand Identity Design',
            status: 'completed',
            progress: 100,
            client: 'Creative Agency',
            startDate: formatDate(new Date(today.getTime() - 21 * 24 * 60 * 60 * 1000)), // 3 weeks ago
            endDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)), // 3 days ago
            priority: 'Normal',
            assigneeId: 2
          },
          {
            id: 4,
            name: 'E-commerce Platform',
            status: 'planning',
            progress: 15,
            client: 'RetailCorp',
            startDate: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)), // 1 week from now
            endDate: formatDate(new Date(today.getTime() + 70 * 24 * 60 * 60 * 1000)), // 10 weeks from now
            priority: 'Normal',
            assigneeId: 0
          }
        ];
        localStorage.setItem('projects_data', JSON.stringify(sampleProjects));
      }
      
      if (!localStorage.getItem('tasks_data')) {
        const sampleTasks = [
          { id: 1, title: 'Design homepage mockup', status: 'completed', projectId: 1 },
          { id: 2, title: 'Develop user authentication', status: 'in-progress', projectId: 2 },
          { id: 3, title: 'Create brand guidelines', status: 'completed', projectId: 3 },
          { id: 4, title: 'Setup database schema', status: 'in-progress', projectId: 2 },
          { id: 5, title: 'Design mobile screens', status: 'todo', projectId: 2 },
          { id: 6, title: 'Write API documentation', status: 'in-progress', projectId: 2 },
          { id: 7, title: 'User testing sessions', status: 'todo', projectId: 1 },
          { id: 8, title: 'Deploy to staging', status: 'todo', projectId: 1 }
        ];
        localStorage.setItem('tasks_data', JSON.stringify(sampleTasks));
      }
      
      if (!localStorage.getItem('team_data')) {
        const sampleTeam = [
          { id: 1, name: 'Alice Johnson', role: 'UI/UX Designer', email: 'alice@company.com' },
          { id: 2, name: 'Bob Smith', role: 'Frontend Developer', email: 'bob@company.com' },
          { id: 3, name: 'Carol Martinez', role: 'Backend Developer', email: 'carol@company.com' }
        ];
        localStorage.setItem('team_data', JSON.stringify(sampleTeam));
      }
      
      if (!localStorage.getItem('finance_data')) {
        const sampleFinance = {
          totalIncome: 45750,
          monthlyRevenue: 15250,
          expenses: 8500,
          profit: 37250
        };
        localStorage.setItem('finance_data', JSON.stringify(sampleFinance));
      }
    };

    const timeOptions = ref([
      { label: 'Last 7 days', value: 'Last 7 days', icon: 'mdi-calendar-week' },
      { label: 'Last 30 days', value: 'Last 30 days', icon: 'mdi-calendar-month' },
      { label: 'Last 3 months', value: 'Last 3 months', icon: 'mdi-calendar-range' },
      { label: 'Last 6 months', value: 'Last 6 months', icon: 'mdi-calendar-multiple' },
      { label: 'This year', value: 'This year', icon: 'mdi-calendar' },
      { label: 'All time', value: 'All time', icon: 'mdi-infinity' }
    ]);

    const dropdowns = ref({});
    const selectedOptions = ref({});

    const selectTime = (title, option) => {
      selectedOptions.value[title] = option;
      dropdowns.value[title] = false;
    };

    const selectCard = (index) => {
      console.log(`Card ${index + 1} selected:`, stats.value[index].title);
      // Add card selection logic here
    };

    const getTrendIcon = (trend) => {
      switch (trend) {
        case 'up': return 'mdi-trending-up';
        case 'down': return 'mdi-trending-down';
        case 'neutral': return 'mdi-trending-neutral';
        default: return 'mdi-trending-up';
      }
    };
    
    // Initialize data on component mount
    onMounted(() => {
      // Initialize sample data if none exists
      initializeSampleData();
      
      // Load and display metrics
      loadUserMetrics();
      
      // Listen for data updates from other components
      window.addEventListener('projectsUpdated', handleDataUpdate);
      window.addEventListener('tasksUpdated', handleDataUpdate);
      window.addEventListener('teamUpdated', handleDataUpdate);
      window.addEventListener('financeUpdated', handleDataUpdate);
      window.addEventListener('userDataUpdated', handleDataUpdate);
    });
    
    // Cleanup event listeners
    onUnmounted(() => {
      window.removeEventListener('projectsUpdated', handleDataUpdate);
      window.removeEventListener('tasksUpdated', handleDataUpdate);
      window.removeEventListener('teamUpdated', handleDataUpdate);
      window.removeEventListener('financeUpdated', handleDataUpdate);
      window.removeEventListener('userDataUpdated', handleDataUpdate);
    });

    return {
      stats,
      timeOptions,
      dropdowns,
      selectedOptions,
      selectTime,
      selectCard,
      getTrendIcon,
      loadUserMetrics
    };
  }
};
</script>

<style scoped>
/* Container Styles */
.metrics-container {
  padding: 0;
  width: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* Card Styles */
.metric-card {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 24px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(59, 130, 246, 0.3);
}

.metric-card:active {
  transform: translateY(-4px) scale(1.01);
}

/* Card Specific Colors */
.metric-card-1 {
  background: linear-gradient(145deg, #fefffe 0%, #f0f9ff 100%);
  border-color: rgba(56, 189, 248, 0.2);
}

.metric-card-1:hover {
  box-shadow: 0 20px 25px -5px rgba(56, 189, 248, 0.15);
  border-color: rgba(56, 189, 248, 0.4);
}

.metric-card-2 {
  background: linear-gradient(145deg, #fefffe 0%, #f0fdf4 100%);
  border-color: rgba(34, 197, 94, 0.2);
}

.metric-card-2:hover {
  box-shadow: 0 20px 25px -5px rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
}

.metric-card-3 {
  background: linear-gradient(145deg, #fefffe 0%, #fdf4ff 100%);
  border-color: rgba(168, 85, 247, 0.2);
}

.metric-card-3:hover {
  box-shadow: 0 20px 25px -5px rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.4);
}

.metric-card-4 {
  background: linear-gradient(145deg, #fefffe 0%, #fefbf0 100%);
  border-color: rgba(245, 158, 11, 0.2);
}

.metric-card-4:hover {
  box-shadow: 0 20px 25px -5px rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.4);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.icon-container {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.metric-card:hover .icon-container::before {
  opacity: 1;
}

.icon-1 {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.25);
}

.icon-2 {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.25);
}

.icon-3 {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  box-shadow: 0 8px 16px rgba(139, 92, 246, 0.25);
}

.icon-4 {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 8px 16px rgba(245, 158, 11, 0.25);
}

.metric-icon {
  color: white;
  font-size: 28px;
  z-index: 1;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.trend-indicator.up {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.trend-indicator.down {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
  color: #991b1b;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.trend-indicator.neutral {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #475569;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

.trend-icon {
  font-size: 16px;
}

.trend-text {
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Card Content */
.card-content {
  flex: 1;
  margin-bottom: 20px;
}

.metric-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  line-height: 1.4;
  letter-spacing: -0.025em;
}

.metric-value-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.05em;
}

.metric-unit {
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
  margin-left: 2px;
}

.metric-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(226, 232, 240, 0.5);
}

.time-period {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.period-icon {
  font-size: 16px;
  color: #9ca3af;
}

.period-btn {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 8px;
  color: #6b7280;
  transition: all 0.3s ease;
}

.period-btn:hover {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

/* Enhanced Dropdown */
.dropdown-card {
  min-width: 220px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}

.dropdown-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  padding: 16px 20px 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.dropdown-list {
  padding: 8px;
}

.dropdown-option {
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  padding: 12px 16px;
}

.dropdown-option:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  transform: translateX(4px);
}

.dropdown-option.active {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  font-weight: 600;
}

.option-icon {
  color: #6b7280;
  margin-right: 8px;
  font-size: 18px;
}

.dropdown-option.active .option-icon {
  color: #3b82f6;
}

.option-text {
  font-size: 14px;
  font-weight: 500;
}

/* Background Effects */
.card-bg-pattern {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 198, 255, 0.3) 0%, transparent 50%);
  border-radius: 24px;
  pointer-events: none;
}

.card-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 26px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: -1;
}

.metric-card:hover .card-glow {
  opacity: 1;
}

.glow-1 {
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.15), rgba(147, 197, 253, 0.15));
}

.glow-2 {
  background: linear-gradient(45deg, rgba(34, 197, 94, 0.15), rgba(134, 239, 172, 0.15));
}

.glow-3 {
  background: linear-gradient(45deg, rgba(168, 85, 247, 0.15), rgba(196, 181, 253, 0.15));
}

.glow-4 {
  background: linear-gradient(45deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15));
}

/* Responsive Design */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .metric-card {
    padding: 20px;
    min-height: 180px;
  }
  
  .metric-value {
    font-size: 28px;
  }
  
  .icon-container {
    width: 56px;
    height: 56px;
  }
  
  .metric-icon {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .metric-card {
    padding: 16px;
    border-radius: 16px;
  }
  
  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
  
  .metric-icon {
    font-size: 20px;
  }
  
  .metric-value {
    font-size: 24px;
  }
}

/* Animation Keyframes */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-4px);
  }
}

.metric-card:hover .metric-icon {
  animation: pulse 2s infinite;
}

.metric-card:hover .card-bg-pattern {
  animation: float 3s ease-in-out infinite;
}
</style>
