<template>
  <div
    class="modern-topbar"
    :class="{ 'sidebar-expanded': !props.isRailMode, 'sidebar-rail': props.isRailMode }"
  >
    <div class="topbar-content">
      <!-- Search Section -->
      <div
        class="search-section"
        :class="{ 'search-shifted-expanded': !props.isRailMode, 'search-shifted-rail': props.isRailMode }"
      >
        <div
          class="search-container"
          :class="{ 'search-focused': isSearchFocused }"
        >
          <div class="search-icon">
            <Search :size="20" />
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t('general.search')"
            class="search-input"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            @keyup.enter="performSearch"
          >
          <button 
            v-if="searchQuery" 
            class="search-clear"
            @click="clearSearch"
          >
            <X :size="16" />
          </button>
        </div>
      </div>

      <!-- Actions Section -->
      <div class="actions-section">
        <!-- Language Selector -->
        <div
          ref="languageRef"
          class="action-item"
        >
          <button 
            class="action-button"
            :class="{ 'active': showLanguageMenu }"
            @click="toggleLanguageMenu"
          >
            <div class="language-indicator">
              <Globe :size="18" />
              <span class="language-code">{{ currentLanguage.toUpperCase() }}</span>
            </div>
          </button>
          
          <!-- Language Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="showLanguageMenu"
              class="dropdown-menu language-dropdown"
            >
              <div class="dropdown-header">
                <h3>{{ t('general.selectLanguage') }}</h3>
              </div>
              <div class="dropdown-content">
                <button
                  v-for="language in availableLanguages"
                  :key="language.code"
                  class="dropdown-item"
                  :class="{ 'active': currentLanguage === language.code }"
                  @click="changeLanguage(language.code)"
                >
                  <span class="language-flag">{{ language.flag }}</span>
                  <span class="language-name">{{ language.name }}</span>
                  <Check
                    v-if="currentLanguage === language.code"
                    :size="16"
                  />
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Notifications -->
        <div
          ref="notificationRef"
          class="action-item"
        >
          <button 
            class="action-button"
            :class="{ 'active': showNotificationMenu }"
            @click="toggleNotificationMenu"
          >
            <div class="notification-indicator">
              <Bell :size="18" />
              <div
                v-if="unreadCount > 0"
                class="notification-badge"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </div>
            </div>
          </button>

          <!-- Notifications Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="showNotificationMenu"
              class="dropdown-menu notification-dropdown"
            >
              <div class="dropdown-header">
                <h3>{{ t('notifications.title') }}</h3>
                <button 
                  v-if="unreadCount > 0"
                  class="mark-all-read"
                  @click="markAllAsRead"
                >
                  {{ t('notifications.markAllRead') }}
                </button>
              </div>
              
              <div class="dropdown-content notifications-list">
                <div
                  v-if="notifications.length === 0"
                  class="empty-state"
                >
                  <Bell
                    :size="48"
                    stroke-width="1.5"
                  />
                  <p>{{ t('notifications.empty') }}</p>
                </div>
                
                <button
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                  @click="readNotification(notification)"
                >
                  <div
                    class="notification-icon"
                    :class="`type-${notification.type}`"
                  >
                    <component
                      :is="getNotificationIcon(notification.type)"
                      :size="16"
                    />
                  </div>
                  <div class="notification-content">
                    <h4>{{ notification.title }}</h4>
                    <p>{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.time) }}</span>
                  </div>
                </button>
              </div>
              
              <div class="dropdown-footer">
                <button
                  class="view-all-btn"
                  @click="viewAllNotifications"
                >
                  {{ t('notifications.viewAll') }}
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- User Menu -->
        <div
          ref="userRef"
          class="action-item"
        >
          <button 
            class="action-button user-button"
            :class="{ 'active': showUserMenu }"
            @click="toggleUserMenu"
          >
            <div class="user-avatar" :class="{ 'default-avatar': !user.avatar }">
              <img 
                v-if="user.avatar"
                :src="user.avatar" 
                :alt="user.name"
                class="avatar-image"
              >
              <div 
                v-else 
                class="default-avatar-icon"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </div>
              <div class="status-indicator online" />
            </div>
          </button>

          <!-- User Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="showUserMenu"
              class="dropdown-menu user-dropdown"
            >
              <div class="dropdown-header user-header" @click="navigateTo('/account')">
                <div class="user-info">
                  <img
                    v-if="user.avatar"
                    :src="user.avatar"
                    :alt="user.name"
                    class="user-profile-image"
                  >
                  <div 
                    v-else 
                    class="user-profile-image default-profile-icon"
                  >
                    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                  </div>
                  <div class="user-details">
                    <h3>{{ user.name }}</h3>
                    <p>{{ user.email }}</p>
                  </div>
                </div>
              </div>
              
              <div class="dropdown-content">
                <button
                  class="dropdown-item"
                  @click="navigateTo('/account')"
                >
                  <User :size="18" />
                  <span>{{ t('user.profile') }}</span>
                </button>
                
                <button
                  class="dropdown-item"
                  @click="navigateTo('/account')"
                >
                  <Settings :size="18" />
                  <span>{{ t('user.settings') }}</span>
                </button>
                
                <div class="dropdown-divider" />
                
                <button
                  class="dropdown-item logout-item"
                  @click="logout"
                >
                  <LogOut :size="18" />
                  <span>{{ t('user.logout') }}</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/api.js'
import { 
  Search, 
  X, 
  Globe, 
  Check, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  MessageSquare,
  Calendar,
  CheckCircle,
  Folder,
  CreditCard,
  DollarSign
} from 'lucide-vue-next'

// Router instance
const router = useRouter()

// Props to receive sidebar state from parent component
const props = defineProps({
  isRailMode: {
    type: Boolean,
    default: false
  }
})

// Reactive data
const searchQuery = ref('')
const isSearchFocused = ref(false)
const showLanguageMenu = ref(false)
const showNotificationMenu = ref(false)
const showUserMenu = ref(false)
const currentLanguage = ref('en')

// Sidebar state - this should be managed by parent component or store
// const sidebarOpen = ref(true) // Default to open, you can change this

// Refs for click outside detection
const languageRef = ref(null)
const notificationRef = ref(null)
const userRef = ref(null)

// Sidebar toggle function - removed since Vuetify handles this
// const toggleSidebar = () => {
//   sidebarOpen.value = !sidebarOpen.value
//   // You can emit this to parent component if needed
//   // emit('sidebar-toggle', sidebarOpen.value)
// }

// User data
const user = ref({
  name: 'Isabella Morgan',
  email: 'isabella@example.com',
  avatar: null
})

// Load user data from localStorage
const loadUserData = () => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    const parsedData = JSON.parse(userData);
    user.value = {
      name: parsedData.fullName || parsedData.name || 'User',
      email: parsedData.email || 'user@example.com',
      avatar: parsedData.profileImage || parsedData.avatar || null
    };
  }
}

// Listen for profile image updates
const handleProfileImageUpdate = (event) => {
  if (event.detail && event.detail.hasOwnProperty('profileImage')) {
    user.value.avatar = event.detail.profileImage;
  }
}

// Listen for user name updates
const handleUserNameUpdate = (event) => {
  if (event.detail && (event.detail.fullName || event.detail.name)) {
    user.value.name = event.detail.fullName || event.detail.name;
  }
}

// Handle all profile updates
const handleProfileUpdate = (event) => {
  // Reload all user data to ensure consistency
  loadUserData();
}

// Languages
const availableLanguages = ref([
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
])

// Import notification service
import notificationService, { notifications, unreadCount } from '@/services/notificationService.js'

// Translation function
const translations = {
  en: {
    general: { search: 'Search anything...', selectLanguage: 'Select Language' },
    notifications: { title: 'Notifications', markAllRead: 'Mark all as read', empty: 'No notifications yet', viewAll: 'View all notifications' },
    user: { profile: 'Profile', settings: 'Settings', logout: 'Sign out' },
    time: { now: 'Just now', minutesAgo: 'min ago', hoursAgo: 'hr ago', today: 'Today', yesterday: 'Yesterday' }
  }
}

const t = (key) => {
  const keys = key.split('.')
  let result = translations[currentLanguage.value] || translations.en
  for (const k of keys) {
    result = result[k]
  }
  return result || key
}

// Methods
const performSearch = () => {
  if (!searchQuery.value) return
  console.log('Searching for:', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
  showNotificationMenu.value = false
  showUserMenu.value = false
}

const toggleNotificationMenu = () => {
  showNotificationMenu.value = !showNotificationMenu.value
  showLanguageMenu.value = false
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showLanguageMenu.value = false
  showNotificationMenu.value = false
}

const changeLanguage = (code) => {
  currentLanguage.value = code
  showLanguageMenu.value = false
}

const readNotification = (notification) => {
  notificationService.markAsRead(notification.id)
}

const markAllAsRead = () => {
  notificationService.markAllAsRead()
}

const viewAllNotifications = () => {
  showNotificationMenu.value = false
  router.push('/notification')
}

const navigateTo = (path) => {
  showUserMenu.value = false
  console.log('Navigate to:', path)
  router.push(path).catch(err => {
    console.error('Navigation error:', err)
  })
}

const logout = async () => {
  try {
    showUserMenu.value = false
    console.log('Logging out...')
    
    // Call logout API to clear server-side session
    authAPI.logout()
    
    // Clear any remaining data from localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    // Clear browser history to prevent back button issues
    router.replace('/')
    
    // Force reload to ensure complete state reset
    window.location.href = '/'
  } catch (error) {
    console.error('Logout error:', error)
    // Even if logout API fails, clear local data and redirect
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    window.location.href = '/'
  }
}

const getNotificationIcon = (type) => {
  const icons = {
    message: MessageSquare,
    team_chat: MessageSquare,
    calendar: Calendar,
    meeting: Calendar,
    reminder: Bell,
    task: CheckCircle,
    project: Folder,
    billing: CreditCard,
    payment: DollarSign
  }
  return icons[type] || Bell
}

const formatTime = (time) => {
  if (!time) return ''
  const now = new Date()
  const minutes = Math.floor((now - new Date(time)) / (1000 * 60))
  
  if (minutes < 1) return t('time.now')
  if (minutes < 60) return `${minutes} ${t('time.minutesAgo')}`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${t('time.hoursAgo')}`
  
  return new Date(time).toLocaleDateString()
}

// Click outside handler
const handleClickOutside = (event) => {
  if (languageRef.value && !languageRef.value.contains(event.target)) {
    showLanguageMenu.value = false
  }
  if (notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotificationMenu.value = false
  }
  if (userRef.value && !userRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadUserData()
  window.addEventListener('profileImageUpdated', handleProfileUpdate)
  window.addEventListener('userNameUpdated', handleProfileUpdate)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('profileImageUpdated', handleProfileUpdate)
  window.removeEventListener('userNameUpdated', handleProfileUpdate)
})
</script>

<style scoped>
.modern-topbar {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(6, 78, 71, 0.08);
  box-shadow: 0 1px 3px rgba(6, 78, 71, 0.05);
  position: relative;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Topbar positioning based on Vuetify navigation drawer state */
.modern-topbar.sidebar-expanded {
  margin-left: 240px; /* Width when drawer is expanded */
}

.modern-topbar.sidebar-rail {
  margin-left: 72px; /* Width when drawer is in rail mode */
}

.topbar-content {
  max-width: none; /* Remove max-width to allow full width */
  margin: 0;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Menu Toggle Button - Removed since Vuetify handles this */
/* .menu-toggle {
  display: flex;
  align-items: center;
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}

.menu-button:hover {
  background: rgba(6, 78, 71, 0.08);
  color: #064E47;
} */

/* Search Section */
.search-section {
  flex: 1;
  max-width: 500px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Search section positioning based on drawer state */
.search-section.search-shifted-expanded {
  margin-left: 16px; /* Additional margin when drawer is expanded */
}

.search-section.search-shifted-rail {
  margin-left: 8px; /* Small margin when drawer is in rail mode */
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 0 16px;
  height: 48px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-container.search-focused,
.search-container:hover {
  background: #ffffff;
  border-color: #064E47;
  box-shadow: 0 0 0 4px rgba(6, 78, 71, 0.08);
}

.search-icon {
  color: #64748b;
  margin-right: 12px;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.search-focused .search-icon {
  color: #064E47;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1e293b;
  outline: none;
  font-weight: 400;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-clear {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  margin-left: 8px;
  display: flex;
  align-items: center;
}

.search-clear:hover {
  background: #e2e8f0;
  color: #475569;
}

/* Actions Section */
.actions-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-item {
  position: relative;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
}

.action-button:hover,
.action-button.active {
  background: rgba(6, 78, 71, 0.08);
  color: #064E47;
}

/* Language Indicator */
.language-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.language-code {
  font-size: 12px;
  font-weight: 600;
  color: #064E47;
  background: rgba(6, 78, 71, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

/* Notification Indicator */
.notification-indicator {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  line-height: 1.2;
}

/* User Avatar */
.user-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.user-button.active .user-avatar,
.user-button:hover .user-avatar {
  border-color: #064E47;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar.default-avatar {
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

.default-avatar-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  background-color: #f9fafb;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-indicator.online {
  background: #10b981;
}

/* Dropdown Menus */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 1000;
  min-width: 280px;
  overflow: hidden;
}

.language-dropdown {
  min-width: 220px;
}

.notification-dropdown {
  min-width: 380px;
  max-width: 400px;
}

.user-dropdown {
  min-width: 260px;
}

.dropdown-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.mark-all-read {
  background: none;
  border: none;
  color: #064E47;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.mark-all-read:hover {
  background: rgba(6, 78, 71, 0.08);
}

/* User Header */
.user-header {
  background: linear-gradient(135deg, #064E47 0%, #047857 100%);
  color: white;
  border-bottom: none;
  cursor: pointer;
  transition: background 0.2s ease;
}

.user-header:hover {
  background: linear-gradient(135deg, #047857 0%, #065F46 100%);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.user-profile-image {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.default-profile-icon {
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-details h3 {
  color: white;
  margin: 0;
  font-size: 16px;
}

.user-details p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 4px 0 0;
}

/* Dropdown Content */
.dropdown-content {
  padding: 8px;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 0;
}

.dropdown-item {
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  font-size: 14px;
  margin-bottom: 2px;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #064E47;
}

.dropdown-item.active {
  background: rgba(6, 78, 71, 0.08);
  color: #064E47;
}

.language-flag {
  font-size: 18px;
}

.language-name {
  flex: 1;
  font-weight: 500;
}

/* Notification Items */
.notification-item {
  width: 100%;
  background: none;
  border: none;
  padding: 16px 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: rgba(6, 78, 71, 0.02);
  border-left: 3px solid #064E47;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.notification-icon.type-message {
  background: #3b82f6;
}

.notification-icon.type-calendar {
  background: #10b981;
}

.notification-icon.type-task {
  background: #f59e0b;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-content h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.notification-content p {
  margin: 0 0 8px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #94a3b8;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-state p {
  margin: 16px 0 0;
  font-size: 14px;
}

/* Footer */
.dropdown-footer {
  padding: 12px 20px 20px;
  border-top: 1px solid #f1f5f9;
}

.view-all-btn {
  width: 100%;
  background: none;
  border: 1px solid #e2e8f0;
  color: #064E47;
  font-size: 14px;
  font-weight: 500;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-all-btn:hover {
  background: #f8fafc;
  border-color: #064E47;
}

/* Divider */
.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}

/* Logout Item */
.logout-item {
  color: #dc2626 !important;
}

.logout-item:hover {
  background: #fef2f2 !important;
  color: #dc2626 !important;
}

/* Transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-topbar.sidebar-expanded,
  .modern-topbar.sidebar-rail {
    margin-left: 0; /* Remove margin on mobile */
  }
  
  .topbar-content {
    padding: 0 16px;
    height: 64px;
    gap: 16px;
  }

  .search-section {
    max-width: none;
    flex: 1;
  }

  .search-section.search-shifted-expanded,
  .search-section.search-shifted-rail {
    margin-left: 0; /* Remove additional margin on mobile */
  }

  .search-container {
    height: 44px;
    padding: 0 12px;
    border-radius: 12px;
  }

  .search-input {
    font-size: 16px;
  }

  .actions-section {
    gap: 4px;
  }

  .action-button {
    padding: 10px;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .dropdown-menu {
    min-width: 260px;
    right: -8px;
  }

  .notification-dropdown {
    min-width: 320px;
    max-width: 350px;
  }

  .language-dropdown {
    min-width: 200px;
  }

  .user-dropdown {
    min-width: 240px;
  }
}

@media (max-width: 480px) {
  .topbar-content {
    padding: 0 12px;
    gap: 12px;
  }

  .search-container {
    height: 40px;
    padding: 0 10px;
  }

  .search-icon {
    margin-right: 8px;
  }

  .action-button {
    padding: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  .dropdown-menu {
    right: 0;
    left: auto;
    min-width: 280px;
    max-width: calc(100vw - 24px);
  }

  .notification-dropdown {
    min-width: 300px;
    max-width: calc(100vw - 24px);
  }

  .dropdown-header {
    padding: 16px;
  }

  .notification-item {
    padding: 12px 16px;
  }

  .notification-content h4 {
    font-size: 13px;
  }

  .notification-content p {
    font-size: 12px;
  }
}

/* Custom Scrollbar */
.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus States for Accessibility */
.action-button:focus-visible {
  outline: 2px solid #064E47;
  outline-offset: 2px;
}

.search-input:focus-visible {
  outline: none;
}

.dropdown-item:focus-visible,
.notification-item:focus-visible {
  outline: 2px solid #064E47;
  outline-offset: -2px;
}

/* Loading States */
.notification-item.loading {
  opacity: 0.6;
  pointer-events: none;
}

.notification-item.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 20px;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #064E47;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translateY(-50%);
}

@keyframes spin {
  to {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .search-container {
    border: 2px solid #000;
  }

  .dropdown-menu {
    border: 2px solid #000;
  }

  .notification-badge {
    border: 2px solid #fff;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .search-container,
  .action-button,
  .dropdown-item,
  .notification-item {
    transition: none;
  }

  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: none;
  }

  .notification-item.loading::after {
    animation: none;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .modern-topbar {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .search-container {
    background: #334155;
    color: #e2e8f0;
  }

  .search-container.search-focused,
  .search-container:hover {
    background: #475569;
    border-color: #10b981;
  }

  .search-input {
    color: #e2e8f0;
  }

  .search-input::placeholder {
    color: #94a3b8;
  }

  .action-button {
    color: #cbd5e1;
  }

  .action-button:hover,
  .action-button.active {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  .dropdown-menu {
    background: #1e293b;
    border-color: #334155;
  }

  .dropdown-header {
    border-bottom-color: #334155;
  }

  .dropdown-header h3 {
    color: #e2e8f0;
  }

  .dropdown-item {
    color: #cbd5e1;
  }

  .dropdown-item:hover {
    background: #334155;
    color: #10b981;
  }

  .notification-item {
    border-bottom-color: #334155;
  }

  .notification-item:hover {
    background: #334155;
  }

  .notification-content h4 {
    color: #e2e8f0;
  }

  .notification-content p {
    color: #94a3b8;
  }
}
</style>