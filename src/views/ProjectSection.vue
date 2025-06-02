<!-- ProjectSection.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
      
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container fluid class="px-6 py-8">
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                Project <span class="gradient-text">Dashboard</span>
              </h1>
              <p class="hero-subtitle">
                Manage and track your team's projects efficiently
              </p>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
                @click="navigateToProjectCreate"
              >
                <v-icon class="mr-2">mdi-plus</v-icon>
                Add New Project
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container fluid class="content-container px-6 pb-8">
        <!-- Project Overview Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="primary">mdi-chart-donut</v-icon>
              <h2 class="section-heading">Project Overview</h2>
            </div>
            <div class="section-actions">
              <v-menu>
                <template #activator="{ props }">
                  <v-btn 
                    v-bind="props"
                    variant="outlined"
                    rounded="lg"
                    size="small"
                  >
                    Yesterday
                    <v-icon class="ml-1">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item value="today">Today</v-list-item>
                  <v-list-item value="yesterday">Yesterday</v-list-item>
                  <v-list-item value="week">This Week</v-list-item>
                  <v-list-item value="month">This Month</v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
          
          <div class="project-overview-grid">
            <!-- New Tasks Card -->
            <div class="overview-item">
              <div class="overview-card new-tasks-card">
                <div class="overview-icon-wrapper new-tasks-icon">
                  <v-icon class="overview-icon" color="white">mdi-clipboard-list</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">New Tasks</h3>
                  <div class="overview-amount">{{ newTasks.length }}</div>
                  <div class="overview-description">Ready to start</div>
                </div>
              </div>
            </div>
            
            <!-- In Progress Card -->
            <div class="overview-item">
              <div class="overview-card progress-card">
                <div class="overview-icon-wrapper progress-icon">
                  <v-icon class="overview-icon" color="white">mdi-progress-clock</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">In Progress</h3>
                  <div class="overview-amount">{{ inProgressTasks.length }}</div>
                  <div class="overview-description">Active projects</div>
                </div>
              </div>
            </div>
            
            <!-- Completed Card -->
            <div class="overview-item">
              <div class="overview-card completed-card">
                <div class="overview-icon-wrapper completed-icon">
                  <v-icon class="overview-icon" color="white">mdi-check-circle</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Completed</h3>
                  <div class="overview-amount">{{ completedTasks.length }}</div>
                  <div class="overview-description">Finished projects</div>
                </div>
              </div>
            </div>
            
            <!-- Total Team Members Card -->
            <div class="overview-item">
              <div class="overview-card team-card">
                <div class="overview-icon-wrapper team-icon">
                  <v-icon class="overview-icon" color="white">mdi-account-group</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Team Members</h3>
                  <div class="overview-amount">{{ teamMembers.length }}</div>
                  <div class="overview-description">Active collaborators</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Board Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="warning">mdi-view-column</v-icon>
              <h2 class="section-heading">Project Board</h2>
            </div>
          </div>
          
          <div class="project-board">
            <v-row>
              <!-- New Tasks Column -->
              <v-col cols="12" md="4">
                <div class="board-column">
                  <div class="column-header new-tasks-header">
                    <div class="column-title">
                      <v-icon class="column-icon">mdi-clipboard-list</v-icon>
                      New Tasks
                    </div>
                    <v-chip size="small" color="primary" variant="tonal">{{ newTasks.length }}</v-chip>
                  </div>
                  
                  <div class="column-content">
                    <div
                      v-for="task in newTasks"
                      :key="task.id"
                      class="project-card"
                      :class="{ 'cursor-pointer': task.id === 1 }"
                      @click="task.id === 1 ? $router.push('/project-task') : null"
                    >
                      <div class="card-header-section">
                        <div class="project-icon-wrapper" :style="{ background: task.iconBg }">
                          <v-icon :color="task.iconColor">{{ task.icon }}</v-icon>
                        </div>
                        <div class="project-info">
                          <h4 class="project-title">{{ task.title }}</h4>
                          <p class="project-description">{{ task.description }}</p>
                        </div>
                      </div>

                      <div class="progress-section">
                        <div class="progress-info">
                          <span class="progress-text">{{ task.progress }} of {{ task.total }} tasks</span>
                          <span class="progress-percentage">{{ Math.round((task.progress / task.total) * 100) }}%</span>
                        </div>
                        <v-progress-linear
                          :model-value="(task.progress / task.total) * 100"
                          color="primary"
                          height="8"
                          rounded
                          class="progress-bar"
                        />
                      </div>

                      <div class="team-section">
                        <div class="team-avatars">
                          <v-avatar
                            v-for="memberId in task.teamMembers.slice(0, 3)"
                            :key="memberId"
                            size="32"
                            class="team-avatar"
                          >
                            <v-img :src="getTeamMemberAvatar(memberId)" />
                          </v-avatar>
                          <v-avatar
                            v-if="task.teamMembers.length > 3"
                            size="32"
                            color="grey-lighten-2"
                            class="team-avatar overflow-avatar"
                          >
                            <span class="overflow-text">+{{ task.teamMembers.length - 3 }}</span>
                          </v-avatar>
                        </div>
                        <div class="due-date">
                          <div class="due-label">Due date</div>
                          <div class="due-value">{{ task.date }}</div>
                        </div>
                      </div>

                      <div class="card-footer">
                        <v-btn
                          variant="text"
                          size="small"
                          color="grey-darken-1"
                          class="comment-btn"
                        >
                          <v-icon size="small" class="mr-1">mdi-comment-outline</v-icon>
                          Comments
                        </v-btn>
                        <span class="last-update">{{ task.lastUpdate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- In Progress Column -->
              <v-col cols="12" md="4">
                <div class="board-column">
                  <div class="column-header progress-header">
                    <div class="column-title">
                      <v-icon class="column-icon">mdi-progress-clock</v-icon>
                      In Progress
                    </div>
                    <v-chip size="small" color="warning" variant="tonal">{{ inProgressTasks.length }}</v-chip>
                  </div>
                  
                  <div class="column-content">
                    <div
                      v-for="task in inProgressTasks"
                      :key="task.id"
                      class="project-card"
                    >
                      <div class="card-header-section">
                        <div class="project-icon-wrapper" :style="{ background: task.iconBg }">
                          <v-icon :color="task.iconColor">{{ task.icon }}</v-icon>
                        </div>
                        <div class="project-info">
                          <h4 class="project-title">{{ task.title }}</h4>
                          <p class="project-description">{{ task.description }}</p>
                        </div>
                      </div>

                      <div class="progress-section">
                        <div class="progress-info">
                          <span class="progress-text">{{ task.progress }} of {{ task.total }} tasks</span>
                          <span class="progress-percentage">{{ Math.round((task.progress / task.total) * 100) }}%</span>
                        </div>
                        <v-progress-linear
                          :model-value="(task.progress / task.total) * 100"
                          color="warning"
                          height="8"
                          rounded
                          class="progress-bar"
                        />
                      </div>

                      <div class="team-section">
                        <div class="team-avatars">
                          <v-avatar
                            v-for="memberId in task.teamMembers.slice(0, 3)"
                            :key="memberId"
                            size="32"
                            class="team-avatar"
                          >
                            <v-img :src="getTeamMemberAvatar(memberId)" />
                          </v-avatar>
                          <v-avatar
                            v-if="task.teamMembers.length > 3"
                            size="32"
                            color="grey-lighten-2"
                            class="team-avatar overflow-avatar"
                          >
                            <span class="overflow-text">+{{ task.teamMembers.length - 3 }}</span>
                          </v-avatar>
                        </div>
                        <div class="due-date">
                          <div class="due-label">Due date</div>
                          <div class="due-value">{{ task.date }}</div>
                        </div>
                      </div>

                      <div class="card-footer">
                        <v-btn
                          variant="text"
                          size="small"
                          color="grey-darken-1"
                          class="comment-btn"
                        >
                          <v-icon size="small" class="mr-1">mdi-comment-outline</v-icon>
                          Comments
                        </v-btn>
                        <span class="last-update">{{ task.lastUpdate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Completed Column -->
              <v-col cols="12" md="4">
                <div class="board-column">
                  <div class="column-header completed-header">
                    <div class="column-title">
                      <v-icon class="column-icon">mdi-check-circle</v-icon>
                      Completed
                    </div>
                    <v-chip size="small" color="success" variant="tonal">{{ completedTasks.length }}</v-chip>
                  </div>
                  
                  <div class="column-content">
                    <div
                      v-for="task in completedTasks"
                      :key="task.id"
                      class="project-card completed-project"
                    >
                      <div class="card-header-section">
                        <div class="project-icon-wrapper completed-icon">
                          <v-icon color="success">mdi-check-circle</v-icon>
                        </div>
                        <div class="project-info">
                          <h4 class="project-title">{{ task.title }}</h4>
                          <div class="project-status">
                            <v-chip
                              size="small"
                              :color="getStatusColor(task.status)"
                              variant="tonal"
                            >
                              {{ task.status }}
                            </v-chip>
                          </div>
                        </div>
                      </div>

                      <div class="progress-section">
                        <div class="progress-info">
                          <span class="progress-text">Progress</span>
                          <span class="progress-percentage">{{ task.progress }}%</span>
                        </div>
                        <v-progress-linear
                          :model-value="task.progress"
                          :color="getProgressColor(task.progress)"
                          height="8"
                          rounded
                          class="progress-bar"
                        />
                      </div>

                      <div class="team-section">
                        <div class="team-avatars">
                          <v-avatar
                            v-for="memberId in task.teamMembers.slice(0, 3)"
                            :key="memberId"
                            size="32"
                            class="team-avatar"
                          >
                            <v-img :src="getTeamMemberAvatar(memberId)" />
                          </v-avatar>
                          <v-avatar
                            v-if="task.teamMembers.length > 3"
                            size="32"
                            color="grey-lighten-2"
                            class="team-avatar overflow-avatar"
                          >
                            <span class="overflow-text">+{{ task.teamMembers.length - 3 }}</span>
                          </v-avatar>
                        </div>
                        <div class="due-date">
                          <div class="due-label">Deadline</div>
                          <div class="due-value">{{ task.deadline }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>

        <!-- Pagination Section -->
        <div class="pagination-section">
          <div class="pagination-container">
            <v-btn
              variant="outlined"
              rounded="lg"
              size="small"
              class="pagination-btn"
            >
              <v-icon class="mr-1">mdi-chevron-left</v-icon>
              Previous
            </v-btn>
            
            <div class="page-numbers">
              <v-btn
                v-for="page in 4"
                :key="page"
                :color="page === 1 ? 'primary' : 'grey'"
                :variant="page === 1 ? 'elevated' : 'text'"
                size="small"
                rounded="lg"
                class="page-btn"
              >
                {{ page }}
              </v-btn>
            </div>
            
            <v-btn
              color="primary"
              variant="elevated"
              rounded="lg"
              size="small"
              class="pagination-btn"
            >
              Next
              <v-icon class="ml-1">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-main>
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
    
    // Responsive state
    const isMobile = ref(false);
    const isTablet = ref(false);
    
    // Update responsive state based on screen size
    const updateResponsiveState = () => {
      isMobile.value = window.innerWidth < 600;
      isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
    };
    
    // Window resize handler
    const handleResize = () => {
      updateResponsiveState();
    };
    
    // Member avatars mapping
    const memberAvatars = {
      1: 'https://i.pravatar.cc/150?img=1',
      2: 'https://i.pravatar.cc/150?img=2',
      3: 'https://i.pravatar.cc/150?img=3',
      4: 'https://i.pravatar.cc/150?img=4'
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });

    const teamMembers = [
      { id: 1, name: 'John', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: 3, name: 'Mike', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: 4, name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=4' },
    ];
    
    const newTasks = [
      {
        id: 1,
        route: "/project-task",
        title: 'Slack brand logo design',
        description: 'Create a brand logo design for admin',
        icon: 'mdi-pound',
        iconBg: 'rgba(233, 30, 99, 0.1)',
        iconColor: 'pink-darken-1',
        progress: 22,
        total: 56,
        teamMembers: [1, 2, 3],
        date: '10 Jul, 2024',
        lastUpdate: '3hrs ago'
      },
      {
        id: 2,
        title: 'Redesign - Landing page',
        description: 'Make new design system. Improve user experience',
        icon: 'mdi-penguin',
        iconBg: 'rgba(255, 193, 7, 0.1)',
        iconColor: 'amber-darken-1',
        progress: 10,
        total: 20,
        teamMembers: [2, 3, 4],
        date: '19 Jul, 2024',
        lastUpdate: '8 May'
      },
      {
        id: 3,
        title: 'Chat Application',
        description: 'Create a Chat application for business communication',
        icon: 'mdi-paypal',
        iconBg: 'rgba(33, 150, 243, 0.1)',
        iconColor: 'blue-darken-1',
        progress: 5,
        total: 36,
        teamMembers: [1, 2, 4],
        date: '2 Aug, 2024',
        lastUpdate: '5hrs ago'
      },
      {
        id: 4,
        title: 'Project App',
        description: 'Create a responsive design for 2 devices',
        icon: 'mdi-diamond-stone',
        iconBg: 'rgba(76, 175, 80, 0.1)',
        iconColor: 'green-darken-1',
        progress: 35,
        total: 42,
        teamMembers: [1, 3, 4],
        date: '9 Jun, 2024',
        lastUpdate: '1 June'
      }
    ];
    
    const inProgressTasks = [
      {
        id: 5,
        title: 'Mobile App Redesign',
        description: 'Update mobile interface with modern design',
        icon: 'mdi-cellphone',
        iconBg: 'rgba(156, 39, 176, 0.1)',
        iconColor: 'purple-darken-1',
        progress: 45,
        total: 60,
        teamMembers: [1, 2, 3],
        date: '15 Aug, 2024',
        lastUpdate: '2hrs ago'
      },
      {
        id: 6,
        title: 'E-commerce Platform',
        description: 'Build complete online shopping platform',
        icon: 'mdi-shopping',
        iconBg: 'rgba(255, 87, 34, 0.1)',
        iconColor: 'deep-orange-darken-1',
        progress: 75,
        total: 100,
        teamMembers: [2, 3, 4],
        date: '25 Aug, 2024',
        lastUpdate: '1 day ago'
      },
      {
        id: 7,
        title: 'Analytics Dashboard',
        description: 'Create comprehensive data visualization dashboard',
        icon: 'mdi-chart-line',
        iconBg: 'rgba(0, 188, 212, 0.1)',
        iconColor: 'cyan-darken-1',
        progress: 30,
        total: 50,
        teamMembers: [1, 2, 4],
        date: '5 Sep, 2024',
        lastUpdate: '4hrs ago'
      }
    ];
    
    const completedTasks = [
      {
        id: 9,
        title: 'Multipurpose landing template',
        status: 'completed',
        deadline: '18 Oct, 2024',
        teamMembers: [1, 2, 3, 4],
        progress: 100
      },
      {
        id: 10,
        title: 'Dashboard UI Kit',
        status: 'completed',
        deadline: '1 Sep, 2024',
        teamMembers: [1, 2, 3],
        progress: 100
      },
      {
        id: 11,
        title: 'Vector Icon Set',
        status: 'in progress',
        deadline: '1 Sep, 2024',
        teamMembers: [1, 2, 3, 4],
        progress: 85
      },
      {
        id: 12,
        title: 'Authentication System',
        status: 'completed',
        deadline: '2 Dec, 2024',
        teamMembers: [1, 4],
        progress: 100
      }
    ];
    
    // Methods
    const getTeamMemberAvatar = (memberId) => {
      const member = teamMembers.find(m => m.id === memberId);
      return member ? member.avatar : '';
    };
    
    const handleTaskClick = (task) => {
      if (task.id === 1) {
        router.push('/project-task');
      }
    };
    
    const navigateToProjectCreate = () => {
      router.push({ name: 'ProjectCreate' });
    };

    const getStatusColor = (status) => {
      const colors = {
        'new': 'primary',
        'planning': 'info',
        'in progress': 'warning',
        'completed': 'success',
        'on hold': 'grey'
      };
      return colors[status.toLowerCase()] || 'primary';
    };
    
    const getProgressColor = (progress) => {
      if (progress >= 75) return 'success';
      if (progress >= 50) return 'warning';
      if (progress >= 25) return 'info';
      return 'error';
    };

    return {
      isMobile,
      isTablet,
      teamMembers,
      newTasks,
      inProgressTasks,
      completedTasks,
      memberAvatars,
      getTeamMemberAvatar,
      handleTaskClick,
      navigateToProjectCreate,
      getStatusColor,
      getProgressColor
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

.new-tasks-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.progress-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.completed-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.team-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
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

/* Project Board */
.project-board {
  width: 100%;
}

.board-column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.column-header {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.column-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.column-icon {
  font-size: 1.25rem;
}

.new-tasks-header {
  border-left: 4px solid #0D7C66;
}

.progress-header {
  border-left: 4px solid #F59E0B;
}

.completed-header {
  border-left: 4px solid #10B981;
}

.column-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 500px;
}

/* Project Cards */
.project-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(13, 124, 102, 0.03) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.project-card:hover::before {
  opacity: 1;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  border-color: #0D7C66;
  box-shadow: 0 15px 35px rgba(13, 124, 102, 0.15);
}

.completed-project {
  opacity: 0.9;
}

.completed-project:hover {
  opacity: 1;
}

.card-header-section {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.project-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.completed-icon {
  background: rgba(16, 185, 129, 0.1) !important;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.project-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.project-status {
  margin-top: 0.5rem;
}

.progress-section {
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 1;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.progress-text {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.progress-percentage {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

.progress-bar {
  border-radius: 0.5rem;
}

.team-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.team-avatars {
  display: flex;
  align-items: center;
}

.team-avatar {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-right: -8px;
}

.team-avatar:last-child {
  margin-right: 0;
}

.overflow-avatar {
  background: #f1f5f9 !important;
}

.overflow-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.due-date {
  text-align: right;
}

.due-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.due-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.comment-btn {
  font-size: 0.875rem;
  text-transform: none;
  font-weight: 500;
}

.last-update {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Pagination Section */
.pagination-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-btn {
  font-weight: 600;
}

.page-btn {
  min-width: 40px;
  font-weight: 600;
}

/* Animation */
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

.project-card {
  animation: fadeInUp 0.6s ease-out;
}

.project-card:nth-child(2) {
  animation-delay: 0.1s;
}

.project-card:nth-child(3) {
  animation-delay: 0.2s;
}

.project-card:nth-child(4) {
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
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .column-content {
    min-height: 400px;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-numbers {
    order: 2;
  }
  
  .pagination-btn:first-child {
    order: 1;
  }
  
  .pagination-btn:last-child {
    order: 3;
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
  
  .project-card {
    padding: 1rem;
  }
  
  .card-header-section {
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .project-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .progress-section {
    margin-bottom: 1rem;
  }
  
  .team-section {
    margin-bottom: 0.75rem;
  }
  
  .team-avatar {
    width: 28px;
    height: 28px;
  }
  
  .column-header {
    padding: 1rem;
  }
  
  .column-title {
    font-size: 1rem;
  }
  
  .column-content {
    min-height: 350px;
  }
}

/* Hover effects for better UX */
@media (hover: hover) {
  .project-card:hover .project-title {
    color: #0D7C66;
  }
  
  .overview-card:hover .overview-title {
    color: #0D7C66;
  }
}

/* Touch-friendly improvements */
@media (max-width: 600px) {
  .project-card {
    min-height: 200px;
  }
  
  .comment-btn {
    padding: 0.5rem;
  }
  
  .team-avatars {
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .team-avatar {
    margin-right: 0;
  }
}

/* Column responsive behavior */
@media (max-width: 960px) and (min-width: 768px) {
  .board-column:nth-child(3) {
    margin-top: 2rem;
  }
}

/* Improved spacing for different screen sizes */
@media (min-width: 1200px) {
  .project-overview-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .column-content {
    min-height: 600px;
  }
}

/* Dark mode support preparation */
@media (prefers-color-scheme: dark) {
  /* Can be implemented later for dark theme support */
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

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  }
  </style>