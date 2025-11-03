/**
 * Real-time Notification Service
 * Manages notifications for projects, reminders, meetings, and team chat
 */

import { ref, computed } from 'vue'

// Notification types
export const NOTIFICATION_TYPES = {
  PROJECT: 'project',
  REMINDER: 'reminder',
  MEETING: 'meeting',
  TEAM_CHAT: 'team_chat',
  TASK: 'task',
  BILLING: 'billing',
  PAYMENT: 'payment',
  GENERAL: 'general'
}

// Reactive notification store
const notifications = ref([])
const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: true,
  inAppNotifications: true,
  teamChatNotifications: true,
  projectNotifications: true,
  reminderNotifications: true,
  meetingNotifications: true,
  billingNotifications: true,
  paymentReminders: true
})

class NotificationService {
  constructor() {
    this.loadFromStorage()
  }

  /**
   * Load notifications and settings from localStorage
   */
  loadFromStorage() {
    try {
      const savedNotifications = localStorage.getItem('app_notifications')
      const savedSettings = localStorage.getItem('notification_settings')
      
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications)
        notifications.value = parsed.map(n => ({
          ...n,
          time: new Date(n.time) // Convert back to Date object
        }))
      }
      
      if (savedSettings) {
        notificationSettings.value = { ...notificationSettings.value, ...JSON.parse(savedSettings) }
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error)
    }
  }

  /**
   * Save notifications and settings to localStorage
   */
  saveToStorage() {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(notifications.value))
      localStorage.setItem('notification_settings', JSON.stringify(notificationSettings.value))
    } catch (error) {
      console.error('Error saving notifications to storage:', error)
    }
  }

  /**
   * Add a new notification
   */
  addNotification(notification) {
    const newNotification = {
      id: Date.now() + Math.random(),
      time: new Date(),
      read: false,
      ...notification
    }

    // Check if notification type is enabled
    const typeEnabled = this.isNotificationTypeEnabled(notification.type)
    if (!typeEnabled) {
      console.log(`Notification type ${notification.type} is disabled`)
      return
    }

    notifications.value.unshift(newNotification)
    
    // Keep only last 50 notifications
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
    
    this.saveToStorage()
    
    console.log('📢 New notification added:', newNotification)
    return newNotification
  }

  /**
   * Check if a notification type is enabled
   */
  isNotificationTypeEnabled(type) {
    switch (type) {
      case NOTIFICATION_TYPES.PROJECT:
        return notificationSettings.value.projectNotifications
      case NOTIFICATION_TYPES.REMINDER:
      case NOTIFICATION_TYPES.MEETING:
        return notificationSettings.value.reminderNotifications && notificationSettings.value.meetingNotifications
      case NOTIFICATION_TYPES.TEAM_CHAT:
        return notificationSettings.value.teamChatNotifications
      case NOTIFICATION_TYPES.TASK:
        return notificationSettings.value.projectNotifications // Tasks are part of projects
      case NOTIFICATION_TYPES.BILLING:
      case NOTIFICATION_TYPES.PAYMENT:
        return notificationSettings.value.billingNotifications
      default:
        return notificationSettings.value.inAppNotifications
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId) {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveToStorage()
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    notifications.value.forEach(n => n.read = true)
    this.saveToStorage()
  }

  /**
   * Get all notifications
   */
  getNotifications() {
    return notifications.value
  }

  /**
   * Get unread notification count
   */
  getUnreadCount() {
    return notifications.value.filter(n => !n.read).length
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index > -1) {
      notifications.value.splice(index, 1)
      this.saveToStorage()
    }
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    notifications.value = []
    this.saveToStorage()
  }

  /**
   * Clean up test notifications for production
   */
  cleanupTestNotifications() {
    const testKeywords = ['$19.99', '$49.99', '$29.99', 'Premium Features', 'Monthly Subscription']
    const cleanedNotifications = notifications.value.filter(notification => 
      !testKeywords.some(keyword => 
        notification.message?.includes(keyword) || 
        notification.title?.includes(keyword)
      )
    )
    
    if (cleanedNotifications.length !== notifications.value.length) {
      notifications.value = cleanedNotifications
      this.saveToStorage()
      return true
    }
    return false
  }

  /**
   * Update notification settings
   */
  updateSettings(newSettings) {
    notificationSettings.value = { ...notificationSettings.value, ...newSettings }
    this.saveToStorage()
  }

  /**
   * Get notification settings
   */
  getSettings() {
    return notificationSettings.value
  }

  // Specific notification creators
  
  /**
   * Add project notification
   */
  addProjectNotification(projectTitle, action = 'created') {
    return this.addNotification({
      type: NOTIFICATION_TYPES.PROJECT,
      title: 'New Project Created',
      message: `Project "${projectTitle}" has been ${action}`,
      icon: 'mdi-folder-plus',
      category: 'project'
    })
  }

  /**
   * Add reminder notification
   */
  addReminderNotification(reminderTitle, reminderDate) {
    const dateStr = new Date(reminderDate).toLocaleDateString()
    return this.addNotification({
      type: NOTIFICATION_TYPES.REMINDER,
      title: 'New Reminder Set',
      message: `Reminder "${reminderTitle}" scheduled for ${dateStr}`,
      icon: 'mdi-bell-plus',
      category: 'reminder'
    })
  }

  /**
   * Add meeting notification
   */
  addMeetingNotification(meetingTitle, meetingDate, attendees = []) {
    const dateStr = new Date(meetingDate).toLocaleString()
    const attendeeCount = attendees.length
    return this.addNotification({
      type: NOTIFICATION_TYPES.MEETING,
      title: 'New Meeting Scheduled',
      message: `Meeting "${meetingTitle}" scheduled for ${dateStr}${attendeeCount > 0 ? ` with ${attendeeCount} attendees` : ''}`,
      icon: 'mdi-calendar-plus',
      category: 'meeting'
    })
  }

  /**
   * Add team chat notification
   */
  addTeamChatNotification(senderName, chatName, messagePreview) {
    return this.addNotification({
      type: NOTIFICATION_TYPES.TEAM_CHAT,
      title: 'New Team Message',
      message: `${senderName} in ${chatName}: ${messagePreview.substring(0, 50)}${messagePreview.length > 50 ? '...' : ''}`,
      icon: 'mdi-message-text',
      category: 'chat'
    })
  }

  /**
   * Add task notification
   */
  addTaskNotification(taskTitle, action = 'created') {
    return this.addNotification({
      type: NOTIFICATION_TYPES.TASK,
      title: 'Task Update',
      message: `Task "${taskTitle}" has been ${action}`,
      icon: 'mdi-check-circle',
      category: 'task'
    })
  }

  /**
   * Add billing notification
   */
  addBillingNotification(amount, dueDate, description = '') {
    const dueDateStr = new Date(dueDate).toLocaleDateString()
    return this.addNotification({
      type: NOTIFICATION_TYPES.BILLING,
      title: 'Upcoming Payment',
      message: `Payment of $${amount} is due on ${dueDateStr}${description ? ` for ${description}` : ''}`,
      icon: 'mdi-credit-card-clock',
      category: 'billing'
    })
  }



  /**
   * Check and create payment reminders for upcoming payments
   */
  checkUpcomingPayments(payments = []) {
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000))
    
    payments.forEach(payment => {
      const dueDate = new Date(payment.dueDate)
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
      
      // Send reminder 3 days before due date
      if (daysUntilDue === 3) {
        this.addPaymentReminder(payment.amount, payment.dueDate, payment.description)
      }
      
      // Send urgent reminder on due date
      if (daysUntilDue === 0) {
        this.addBillingNotification(payment.amount, payment.dueDate, payment.description)
      }
    })
  }
}

// Create singleton instance
const notificationService = new NotificationService()

// Export reactive refs and service
export { notifications, notificationSettings }
export default notificationService

// Computed properties for easy use in components
export const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
export const hasUnreadNotifications = computed(() => unreadCount.value > 0)