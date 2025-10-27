/**
 * Dashboard Metrics Utility
 * Helper functions for managing dashboard metrics and triggering updates
 */

/**
 * Trigger dashboard metrics update across all components
 */
export function updateDashboardMetrics() {
  // Dispatch events that dashboard components listen for
  window.dispatchEvent(new CustomEvent('projectsUpdated'));
  window.dispatchEvent(new CustomEvent('tasksUpdated'));
  window.dispatchEvent(new CustomEvent('teamUpdated'));
  window.dispatchEvent(new CustomEvent('financeUpdated'));
  window.dispatchEvent(new CustomEvent('userDataUpdated'));
  
  console.log('Dashboard metrics and Gantt chart update triggered');
}

/**
 * Update projects data and trigger metrics refresh
 * @param {Array} projects - Array of project objects
 */
export function updateProjectsData(projects) {
  try {
    localStorage.setItem('projects_data', JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent('projectsUpdated'));
    console.log('Projects data updated:', projects.length, 'projects');
  } catch (error) {
    console.error('Error updating projects data:', error);
  }
}

/**
 * Update tasks data and trigger metrics refresh
 * @param {Array} tasks - Array of task objects
 */
export function updateTasksData(tasks) {
  try {
    localStorage.setItem('tasks_data', JSON.stringify(tasks));
    window.dispatchEvent(new CustomEvent('tasksUpdated'));
    console.log('Tasks data updated:', tasks.length, 'tasks');
  } catch (error) {
    console.error('Error updating tasks data:', error);
  }
}

/**
 * Update team data and trigger metrics refresh
 * @param {Array} team - Array of team member objects
 */
export function updateTeamData(team) {
  try {
    localStorage.setItem('team_data', JSON.stringify(team));
    window.dispatchEvent(new CustomEvent('teamUpdated'));
    console.log('Team data updated:', team.length, 'members');
  } catch (error) {
    console.error('Error updating team data:', error);
  }
}

/**
 * Update finance data and trigger metrics refresh
 * @param {Object} finance - Finance data object
 */
export function updateFinanceData(finance) {
  try {
    localStorage.setItem('finance_data', JSON.stringify(finance));
    window.dispatchEvent(new CustomEvent('financeUpdated'));
    console.log('Finance data updated:', finance);
  } catch (error) {
    console.error('Error updating finance data:', error);
  }
}

/**
 * Get current metrics data from localStorage
 * @returns {Object} Current metrics data
 */
export function getCurrentMetrics() {
  try {
    const projects = JSON.parse(localStorage.getItem('projects_data') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks_data') || '[]');
    const team = JSON.parse(localStorage.getItem('team_data') || '[]');
    const finance = JSON.parse(localStorage.getItem('finance_data') || '{}');
    
    return {
      activeProjects: projects.filter(p => p.status !== 'completed' && p.status !== 'cancelled').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      teamMembers: team.length + 1, // +1 for user
      revenue: finance.totalIncome || finance.revenue || 0
    };
  } catch (error) {
    console.error('Error getting current metrics:', error);
    return {
      activeProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      teamMembers: 1,
      revenue: 0
    };
  }
}