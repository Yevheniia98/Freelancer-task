<template>
  <v-app>
    <LeftMenu />
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
                Welcome to your <span class="gradient-text">Dashboard</span>
              </h1>
              <p class="hero-subtitle">
                Monitor your projects, track progress, and manage your team efficiently
              </p>
              <div class="hero-stats">
                <div class="stat-item">
                  <div class="stat-value">
                    {{ heroStats.activeProjects }}
                  </div>
                  <div class="stat-label">
                    Active Projects
                  </div>
                </div>
                <div class="stat-divider" />
                <div class="stat-item">
                  <div class="stat-value">
                    {{ heroStats.completionRate }}%
                  </div>
                  <div class="stat-label">
                    Completion Rate
                  </div>
                </div>
                <div class="stat-divider" />
                <div class="stat-item">
                  <div class="stat-value">
                    {{ heroStats.teamMembers }}
                  </div>
                  <div class="stat-label">
                    Team Members
                  </div>
                </div>
              </div>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
              >
                <v-icon class="mr-2">
                  mdi-plus
                </v-icon>
                New Project
              </v-btn>
              <v-btn 
                color="white"
                variant="outlined"
                size="large"
                rounded="lg"
                class="hero-btn-outline"
              >
                <v-icon class="mr-2">
                  mdi-view-dashboard
                </v-icon>
                Analytics
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <div class="content-container">
        <v-container
          fluid
          class="px-6 pb-8"
        >
          <!-- Dashboard Overview Section -->
          <div class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon
                  class="section-icon"
                  color="primary"
                >
                  mdi-view-grid
                </v-icon>
                <h2 class="section-heading">
                  Dashboard Overview
                </h2>
              </div>
              <div class="section-actions">
                <v-btn
                  variant="outlined"
                  rounded="lg"
                  size="small"
                  prepend-icon="mdi-refresh"
                >
                  Refresh
                </v-btn>
              </div>
            </div>
            
            <!-- Cards Line Section -->
            <div class="dashboard-component-wrapper cards-section">
              <div class="component-header">
                <h3 class="component-title">
                  Key Metrics
                </h3>
                <p class="component-subtitle">
                  Overview of your most important statistics
                </p>
              </div>
              <div class="component-content">
                <CardsLine />
              </div>
            </div>
          </div>

          <!-- Productivity Section -->
          <div class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon
                  class="section-icon"
                  color="warning"
                >
                  mdi-clock-outline
                </v-icon>
                <h2 class="section-heading">
                  Productivity Hub
                </h2>
              </div>
            </div>
            
            <!-- Meetings & Reminders - Full Width -->
            <div class="dashboard-component-wrapper meetings-section">
              <div class="component-header">
                <h3 class="component-title">
                  Upcoming Meetings
                </h3>
                <p class="component-subtitle">
                  Your scheduled meetings and reminders
                </p>
              </div>
              <div class="component-content">
                <ReminderMeeting />
              </div>
            </div>

            <!-- Gantt Chart - Full Width -->
            <div class="dashboard-component-wrapper gantt-section">
              <div class="component-header">
                <h3 class="component-title">
                  Project Timeline
                </h3>
                <p class="component-subtitle">
                  Visual overview of project schedules and milestones
                </p>
              </div>
              <div class="component-content">
                <GranttChart />
              </div>
            </div>

            <!-- Chat Section - Full Width -->
            <div class="dashboard-component-wrapper chat-section">
              <div class="component-header">
                <h3 class="component-title">
                  Team Chat
                </h3>
                <p class="component-subtitle">
                  Recent conversations and updates
                </p>
              </div>
              <div class="component-content">
                <ChatSection />
              </div>
            </div>

            <!-- Tax Section - Full Width -->
            <div class="dashboard-component-wrapper tax-section">
              <div class="component-header">
                <h3 class="component-title">
                  Financial Overview
                </h3>
                <p class="component-subtitle">
                  Tax information and financial data
                </p>
              </div>
              <div class="component-content">
                <TaxSection />
              </div>
            </div>
          </div>

          <!-- Quick Actions Section -->
          <div class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon
                  class="section-icon"
                  color="success"
                >
                  mdi-lightning-bolt
                </v-icon>
                <h2 class="section-heading">
                  Quick Actions
                </h2>
              </div>
            </div>
            
            <div class="quick-actions-grid">
              <div class="quick-action-card">
                <div class="action-icon-wrapper create-icon">
                  <v-icon
                    color="white"
                    size="large"
                  >
                    mdi-plus-circle
                  </v-icon>
                </div>
                <div class="action-info">
                  <h4 class="action-title">
                    Create Project
                  </h4>
                  <p class="action-description">
                    Start a new project with your team
                  </p>
                </div>
                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  class="action-btn"
                >
                  Create
                  <v-icon class="ml-1">
                    mdi-arrow-right
                  </v-icon>
                </v-btn>
              </div>

              <div class="quick-action-card">
                <div class="action-icon-wrapper team-icon">
                  <v-icon
                    color="white"
                    size="large"
                  >
                    mdi-account-group
                  </v-icon>
                </div>
                <div class="action-info">
                  <h4 class="action-title">
                    Invite Team
                  </h4>
                  <p class="action-description">
                    Add new members to your workspace
                  </p>
                </div>
                <v-btn
                  color="info"
                  variant="text"
                  size="small"
                  class="action-btn"
                >
                  Invite
                  <v-icon class="ml-1">
                    mdi-arrow-right
                  </v-icon>
                </v-btn>
              </div>

              <div class="quick-action-card">
                <div class="action-icon-wrapper report-icon">
                  <v-icon
                    color="white"
                    size="large"
                  >
                    mdi-chart-line
                  </v-icon>
                </div>
                <div class="action-info">
                  <h4 class="action-title">
                    Generate Report
                  </h4>
                  <p class="action-description">
                    Create detailed analytics reports
                  </p>
                </div>
                <v-btn
                  color="warning"
                  variant="text"
                  size="small"
                  class="action-btn"
                >
                  Generate
                  <v-icon class="ml-1">
                    mdi-arrow-right
                  </v-icon>
                </v-btn>
              </div>

              <div class="quick-action-card">
                <div class="action-icon-wrapper settings-icon">
                  <v-icon
                    color="white"
                    size="large"
                  >
                    mdi-cog
                  </v-icon>
                </div>
                <div class="action-info">
                  <h4 class="action-title">
                    Settings
                  </h4>
                  <p class="action-description">
                    Configure your workspace preferences
                  </p>
                </div>
                <v-btn
                  color="grey-darken-1"
                  variant="text"
                  size="small"
                  class="action-btn"
                >
                  Configure
                  <v-icon class="ml-1">
                    mdi-arrow-right
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </div>

          <!-- Recent Activity Section -->
          <div class="tool-section">
            <div class="section-header">
              <div class="section-title">
                <v-icon
                  class="section-icon"
                  color="info"
                >
                  mdi-history
                </v-icon>
                <h2 class="section-heading">
                  Recent Activity
                </h2>
              </div>
              <div class="section-actions">
                <v-btn
                  variant="text"
                  rounded="lg"
                  size="small"
                  color="primary"
                >
                  View All
                  <v-icon class="ml-1">
                    mdi-arrow-right
                  </v-icon>
                </v-btn>
              </div>
            </div>
            
            <div class="activity-timeline">
              <div class="activity-item">
                <div class="activity-icon success-activity">
                  <v-icon
                    color="white"
                    size="small"
                  >
                    mdi-check
                  </v-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="activity-title">Project "Mobile App" completed</span>
                    <span class="activity-time">2 hours ago</span>
                  </div>
                  <div class="activity-description">
                    The mobile application project has been successfully delivered and approved by the client.
                  </div>
                </div>
              </div>

              <div class="activity-item">
                <div class="activity-icon info-activity">
                  <v-icon
                    color="white"
                    size="small"
                  >
                    mdi-account-plus
                  </v-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="activity-title">New team member joined</span>
                    <span class="activity-time">4 hours ago</span>
                  </div>
                  <div class="activity-description">
                    Sarah Johnson has joined the design team and started working on the brand refresh project.
                  </div>
                </div>
              </div>

              <div class="activity-item">
                <div class="activity-icon warning-activity">
                  <v-icon
                    color="white"
                    size="small"
                  >
                    mdi-alert
                  </v-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="activity-title">Deadline approaching</span>
                    <span class="activity-time">6 hours ago</span>
                  </div>
                  <div class="activity-description">
                    The "E-commerce Platform" project deadline is in 2 days. Please review the final deliverables.
                  </div>
                </div>
              </div>

              <div class="activity-item">
                <div class="activity-icon primary-activity">
                  <v-icon
                    color="white"
                    size="small"
                  >
                    mdi-file-document
                  </v-icon>
                </div>
                <div class="activity-content">
                  <div class="activity-header">
                    <span class="activity-title">New task created</span>
                    <span class="activity-time">8 hours ago</span>
                  </div>
                  <div class="activity-description">
                    "UI/UX Review" task has been assigned to the design team for the upcoming product launch.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </div>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
import CardsLine from '@/dashboard/CardsLine.vue';
import ReminderMeeting from '@/dashboard/ReminderMeeting.vue';
import ChatSection from '@/dashboard/ChatSection.vue';
import TaxSection from '@/dashboard/TaxSection.vue';
import GranttChart from '@/dashboard/GranttChart.vue';

export default {
  name: 'DashboardPage',
  components: {
    LeftMenu,
    SearchBar,
    CardsLine,
    ReminderMeeting,
    ChatSection,
    TaxSection,
    GranttChart
  },
  setup() {
    // Reactive hero stats
    const heroStats = ref({
      activeProjects: 0,
      completionRate: 0,
      teamMembers: 1
    });
    
    // Load real dashboard statistics
    const loadDashboardStats = () => {
      try {
        // Get data from localStorage
        const projectsData = localStorage.getItem('projects_data');
        const tasksData = localStorage.getItem('tasks_data');
        const teamData = localStorage.getItem('team_data');
        
        let activeProjects = 0;
        let completionRate = 0;
        let teamMembers = 1;
        
        // Calculate active projects
        if (projectsData) {
          try {
            const projects = JSON.parse(projectsData);
            if (Array.isArray(projects)) {
              activeProjects = projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length;
            }
          } catch (e) {
            console.warn('Error parsing projects data:', e);
          }
        }
        
        // Calculate completion rate from tasks
        if (tasksData) {
          try {
            const tasks = JSON.parse(tasksData);
            if (Array.isArray(tasks) && tasks.length > 0) {
              const completedTasks = tasks.filter(t => t.status === 'completed').length;
              completionRate = Math.round((completedTasks / tasks.length) * 100);
            }
          } catch (e) {
            console.warn('Error parsing tasks data:', e);
          }
        }
        
        // Calculate team members
        if (teamData) {
          try {
            const team = JSON.parse(teamData);
            if (Array.isArray(team)) {
              teamMembers = team.length + 1; // +1 for the user
            }
          } catch (e) {
            console.warn('Error parsing team data:', e);
          }
        }
        
        // Update reactive data
        heroStats.value = {
          activeProjects,
          completionRate,
          teamMembers
        };
        
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    };
    
    // Handle data updates
    const handleStatsUpdate = () => {
      loadDashboardStats();
    };
    
    // Initialize on mount
    onMounted(() => {
      loadDashboardStats();
      
      // Listen for data updates
      window.addEventListener('projectsUpdated', handleStatsUpdate);
      window.addEventListener('tasksUpdated', handleStatsUpdate);
      window.addEventListener('teamUpdated', handleStatsUpdate);
    });
    
    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('projectsUpdated', handleStatsUpdate);
      window.removeEventListener('tasksUpdated', handleStatsUpdate);
      window.removeEventListener('teamUpdated', handleStatsUpdate);
    });
    
    return {
      heroStats
    };
  }
}
</script>

<style scoped>
/* Sidebar Integration */
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
  margin: 1rem 0;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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

.hero-btn-outline {
  border: 2px solid white !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-btn-outline:hover {
  background: white !important;
  color: #0D7C66 !important;
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

/* Dashboard Component Wrappers */
.dashboard-component-wrapper {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dashboard-component-wrapper:hover {
  border-color: #0D7C66;
  box-shadow: 0 8px 25px rgba(13, 124, 102, 0.1);
}

.component-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.component-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.component-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.component-content {
  padding: 1.5rem;
}

/* Remove default margins from child components */
.component-content :deep(> *:first-child) {
  margin-top: 0;
}

.component-content :deep(> *:last-child) {
  margin-bottom: 0;
}

/* Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.quick-action-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quick-action-card::before {
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

.quick-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.quick-action-card:hover::before {
  opacity: 1;
}

.action-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.create-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.team-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.report-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.settings-icon {
  background: linear-gradient(135deg, #6B7280, #9CA3AF);
}

.action-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.action-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

.action-btn {
  align-self: flex-start;
  position: relative;
  z-index: 1;
  font-weight: 600;
}

/* Recent Activity Timeline */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.activity-item:hover {
  border-color: #0D7C66;
  box-shadow: 0 4px 15px rgba(13, 124, 102, 0.1);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.success-activity {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.info-activity {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.warning-activity {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.primary-activity {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.activity-time {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

.activity-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
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

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

.dashboard-component-wrapper {
  animation: fadeInUp 0.6s ease-out;
}

.quick-action-card {
  animation: fadeInUp 0.6s ease-out;
}

.quick-action-card:nth-child(2) {
  animation-delay: 0.1s;
}

.quick-action-card:nth-child(3) {
  animation-delay: 0.2s;
}

.quick-action-card:nth-child(4) {
  animation-delay: 0.3s;
}

.activity-item {
  animation: fadeInUp 0.6s ease-out;
}

.activity-item:nth-child(2) {
  animation-delay: 0.1s;
}

.activity-item:nth-child(3) {
  animation-delay: 0.2s;
}

.activity-item:nth-child(4) {
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
  
  .hero-actions {
    justify-content: center;
    width: 100%;
  }
  
  .hero-btn,
  .hero-btn-outline {
    flex: 1;
    min-width: 140px;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .stat-divider {
    display: none;
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
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .activity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .stat-item {
    padding: 0 1rem;
  }
  
  .component-header,
  .component-content {
    padding: 1rem;
  }
  
  .quick-action-card {
    padding: 1rem;
  }
  
  .activity-item {
    padding: 1rem;
  }
  
  .activity-icon {
    width: 36px;
    height: 36px;
  }
}

/* Hover effects for better UX */
@media (hover: hover) {
  .quick-action-card:hover .action-title {
    color: #0D7C66;
  }
  
  .activity-item:hover .activity-title {
    color: #0D7C66;
  }
}

/* Component-specific enhancements */
.cards-section .component-content {
  padding: 1rem;
}

.meetings-section .component-content,
.gantt-section .component-content {
  padding: 1rem;
}

.chat-section .component-content,
.tax-section .component-content {
  padding: 1rem;
}

/* Ensure child components have proper styling */
.dashboard-component-wrapper :deep(.v-card) {
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
}

.dashboard-component-wrapper :deep(.v-card-text) {
  padding: 0 !important;
}

.dashboard-component-wrapper :deep(.v-card-title) {
  padding: 0 !important;
  font-size: inherit !important;
  font-weight: inherit !important;
}

/* Grid responsive behavior */
@media (max-width: 1200px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}

/* Enhanced component integration */
.dashboard-component-wrapper :deep(.v-container) {
  padding: 0 !important;
  max-width: none !important;
}

.dashboard-component-wrapper :deep(.v-row) {
  margin: 0 !important;
}

.dashboard-component-wrapper :deep(.v-col) {
  padding: 0.5rem !important;
}

/* Better spacing for nested components */
.component-content > :deep(*) {
  width: 100%;
}

/* Ensure proper text rendering */
.hero-title,
.section-heading,
.component-title {
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Focus states for accessibility */
.hero-btn:focus,
.hero-btn-outline:focus,
.quick-action-card:focus {
  outline: 2px solid #0D7C66;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .hero-section {
    background: white !important;
    color: black !important;
  }
  
  .hero-title,
  .hero-subtitle {
    color: black !important;
  }
  
  .gradient-text {
    -webkit-text-fill-color: black !important;
    background: none !important;
  }
  
  .content-container {
    box-shadow: none !important;
    background: white !important;
  }
  
  .dashboard-component-wrapper,
  .quick-action-card,
  .activity-item {
    box-shadow: none !important;
    border: 1px solid #ccc !important;
  }
}

/* Dark mode preparation */
@media (prefers-color-scheme: dark) {
  /* Can be implemented later for dark theme support */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .dashboard-component-wrapper,
  .quick-action-card,
  .activity-item {
    border-width: 2px;
  }
  
  .hero-btn,
  .hero-btn-outline {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tool-section,
  .dashboard-component-wrapper,
  .quick-action-card,
  .activity-item {
    animation: none;
  }
  
  .hero-btn,
  .hero-btn-outline,
  .quick-action-card,
  .activity-item,
  .dashboard-component-wrapper {
    transition: none;
  }
  
  .quick-action-card:hover,
  .activity-item:hover,
  .dashboard-component-wrapper:hover {
    transform: none;
  }
}

/* Touch device optimizations */
@media (pointer: coarse) {
  .hero-btn,
  .hero-btn-outline {
    min-height: 48px;
    min-width: 48px;
  }
  
  .action-btn {
    min-height: 44px;
    min-width: 44px;
  }
  
  .quick-action-card {
    padding: 1.5rem;
  }
  
  .activity-item {
    padding: 1.25rem;
  }
}

/* Loading states preparation */
.dashboard-component-wrapper.loading {
  opacity: 0.7;
  pointer-events: none;
}

.dashboard-component-wrapper.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border: 2px solid #e2e8f0;
  border-top-color: #0D7C66;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Custom scrollbar for activity timeline */
.activity-timeline {
  max-height: 600px;
  overflow-y: auto;
}

.activity-timeline::-webkit-scrollbar {
  width: 6px;
}

.activity-timeline::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.activity-timeline::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.activity-timeline::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Performance optimizations */
.hero-section,
.content-container,
.dashboard-component-wrapper,
.quick-action-card,
.activity-item {
  will-change: transform, opacity;
}

/* Ensure full height layout */
html,
body,
#app,
.v-application {
  height: 100%;
  margin: 0;
  padding: 0;
}

.v-application {
  min-height: 100vh;
}

/* Better component spacing */
.tool-section:first-child {
  margin-top: 0;
}

.dashboard-component-wrapper:last-child {
  margin-bottom: 0;
}

/* Improved text selection */
::selection {
  background: rgba(13, 124, 102, 0.2);
  color: inherit;
}

::-moz-selection {
  background: rgba(13, 124, 102, 0.2);
  color: inherit;
}

/* Better focus indicators */
.quick-action-card:focus-visible,
.activity-item:focus-visible {
  outline: 2px solid #0D7C66;
  outline-offset: 2px;
  border-color: #0D7C66;
}

/* Enhance readability */
.activity-description,
.action-description,
.component-subtitle {
  line-height: 1.6;
}

/* Smooth state transitions */
.quick-action-card,
.activity-item,
.dashboard-component-wrapper {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Consistent border radius */
.hero-btn,
.hero-btn-outline,
.dashboard-component-wrapper,
.quick-action-card,
.activity-item {
  border-radius: 1rem;
}

/* Better visual hierarchy */
.section-heading {
  position: relative;
}

.section-heading::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 3rem;
  height: 3px;
  background: linear-gradient(90deg, #0D7C66, #41B3A2);
  border-radius: 2px;
}

/* Enhanced component shadows */
.dashboard-component-wrapper,
.quick-action-card,
.activity-item {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.dashboard-component-wrapper:hover,
.quick-action-card:hover,
.activity-item:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Ensure proper z-index stacking */
.hero-section {
  z-index: 1;
}

.content-container {
  z-index: 2;
}

.dashboard-component-wrapper {
  z-index: 3;
}

/* Better mobile touch targets */
@media (max-width: 768px) {
  .section-actions .v-btn {
    min-width: 48px;
    min-height: 48px;
  }
}
</style>