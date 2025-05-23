<template>
  <div class="top-bar-container">
    <v-row
      no-gutters
      align="center"
      justify="end"
      class="top-bar-row"
    >
      <!-- Search Component -->
      <v-col
        cols="auto"
        class="search-wrapper"
      >
        <v-expand-transition>
          <v-text-field
            v-model="searchQuery"
            :label="$t('general.search')"
            variant="outlined"
            density="compact"
            hide-details
            class="search-input"
            bg-color="surface"
            prepend-inner-icon="mdi-magnify"
            clearable
            @keyup.enter="performSearch"
            @click:clear="clearSearch"
          />
        </v-expand-transition>
      </v-col>
      
      <!-- Language Selector -->
      <v-col
        cols="auto"
        class="ml-4"
      >
        <v-menu
          v-model="languageMenu"
          :close-on-content-click="false"
          location="bottom"
        >
          <template #activator="{ props }">
            <div
              class="language-icon"
              v-bind="props"
            >
              <v-badge
                :content="currentLanguage"
                color="primary"
                location="bottom end"
                offset-x="10"
                offset-y="10"
              >
                <v-icon
                  size="24"
                  color="#871F8D"
                >
                  mdi-web
                </v-icon>
              </v-badge>
            </div>
          </template>
          <v-card
            min-width="200"
            class="language-menu"
          >
            <v-list density="compact">
              <v-list-subheader>{{ $t('general.selectLanguage') }}</v-list-subheader>
              <v-list-item
                v-for="(language, i) in availableLanguages"
                :key="i"
                :value="language.code"
                :active="currentLanguage === language.code"
                :title="language.name"
                @click="changeLanguage(language.code)"
              >
                <template #prepend>
                  <v-icon
                    :icon="language.icon"
                    size="small"
                    class="mr-2"
                  />
                </template>
                
                <v-list-item-title>{{ language.name }}</v-list-item-title>
                
                <template #append>
                  <v-icon
                    v-if="currentLanguage === language.code"
                    color="primary"
                    icon="mdi-check"
                    size="small"
                  />
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </v-col>
      
      <!-- Notifications -->
      <v-col
        cols="auto"
        class="ml-4"
      >
        <v-menu
          v-model="notificationMenu"
          :close-on-content-click="false"
          location="bottom"
        >
          <template #activator="{ props }">
            <div
              class="notification-icon"
              v-bind="props"
            >
              <v-badge 
                :content="unreadNotifications.length.toString()" 
                :model-value="unreadNotifications.length > 0"
                color="error" 
                location="top start"
                offset-x="2"
                offset-y="2"
              >
                <v-icon
                  size="24"
                  color="#871F8D"
                >
                  mdi-bell-outline
                </v-icon>
              </v-badge>
            </div>
          </template>
          <v-card
            min-width="320"
            max-width="400"
            class="notification-menu"
          >
            <v-toolbar
              density="compact"
              color="primary"
              class="text-white"
            >
              <v-toolbar-title>{{ $t('notifications.title') }}</v-toolbar-title>
              <template #append>
                <v-btn 
                  v-if="unreadNotifications.length > 0" 
                  variant="text" 
                  density="compact"
                  @click="markAllAsRead"
                >
                  {{ $t('notifications.markAllRead') }}
                </v-btn>
              </template>
            </v-toolbar>
            
            <v-list
              lines="two"
              class="notification-list"
            >
              <template v-if="notifications.length > 0">
                <v-list-item
                  v-for="notification in notifications"
                  :key="notification.id"
                  :class="{ 'unread-notification': !notification.read }"
                  @click="readNotification(notification)"
                >
                  <template #prepend>
                    <v-avatar
                      :color="getNotificationColor(notification.type)"
                      size="36"
                    >
                      <v-icon
                        :icon="getNotificationIcon(notification.type)"
                        color="white"
                      />
                    </v-avatar>
                  </template>
                  
                  <v-list-item-title>{{ notification.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
                  
                  <template #append>
                    <div class="notification-time text-caption">
                      {{ formatNotificationTime(notification.time) }}
                    </div>
                  </template>
                </v-list-item>
              </template>
              
              <v-list-item v-if="notifications.length === 0">
                <div class="text-center py-4 text-medium-emphasis">
                  {{ $t('notifications.empty') }}
                </div>
              </v-list-item>
            </v-list>
            
            <v-divider />
            
            <v-card-actions>
              <v-btn 
                variant="text" 
                block 
                @click="viewAllNotifications"
              >
                {{ $t('notifications.viewAll') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
      
      <!-- User Menu (Optional) -->
      <v-col
        cols="auto"
        class="ml-4"
      >
        <v-menu
          v-model="userMenu"
          :close-on-content-click="false"
          location="bottom"
        >
          <template #activator="{ props }">
            <v-avatar
              class="user-avatar"
              size="40"
              v-bind="props"
            >
              <v-img
                src="https://randomuser.me/api/portraits/women/85.jpg"
                alt="User"
              />
            </v-avatar>
          </template>
          <v-card
            min-width="200"
            class="user-menu"
          >
            <v-list density="compact">
              <v-list-item>
                <template #prepend>
                  <v-avatar size="32">
                    <v-img
                      src="https://randomuser.me/api/portraits/women/85.jpg"
                      alt="User"
                    />
                  </v-avatar>
                </template>
                <v-list-item-title>{{ userName }}</v-list-item-title>
                <v-list-item-subtitle>{{ userEmail }}</v-list-item-subtitle>
              </v-list-item>
              
              <v-divider />
              
              <v-list-item
                prepend-icon="mdi-account-outline"
                :title="$t('user.profile')"
                @click="navigateTo('/profile')"
              />
              <v-list-item
                prepend-icon="mdi-cog-outline"
                :title="$t('user.settings')"
                @click="navigateTo('/settings')"
              />
              
              <v-divider />
              
              <v-list-item
                prepend-icon="mdi-logout"
                :title="$t('user.logout')"
                @click="logout"
              />
            </v-list>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  data() {
    return {
      searchQuery: '',
      languageMenu: false,
      notificationMenu: false,
      userMenu: false,
      currentLanguage: 'en',
      userName: 'Isabella Morgan',
      userEmail: 'isabella@example.com',
      availableLanguages: [
        { code: 'en', name: 'English', icon: 'mdi-flag-outline' },
        { code: 'es', name: 'Español', icon: 'mdi-flag-outline' },
        { code: 'fr', name: 'Français', icon: 'mdi-flag-outline' },
        { code: 'de', name: 'Deutsch', icon: 'mdi-flag-outline' },
        { code: 'ru', name: 'Русский', icon: 'mdi-flag-outline' },
      ],
      notifications: [
        {
          id: 1,
          title: 'New Message',
          message: 'You have received a new message from Emily Johnson',
          time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false,
          type: 'message'
        },
        {
          id: 2,
          title: 'Meeting Reminder',
          message: 'Your meeting with Design Team starts in 30 minutes',
          time: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
          read: false,
          type: 'calendar'
        },
        {
          id: 3,
          title: 'Task Completed',
          message: 'Michael Chen has completed the homepage design task',
          time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: true,
          type: 'task'
        },
        {
          id: 4,
          title: 'System Update',
          message: 'The system will undergo maintenance tomorrow at 2 AM',
          time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          read: true,
          type: 'system'
        }
      ]
    };
  },
  computed: {
    unreadNotifications() {
      return this.notifications.filter(notification => !notification.read);
    },
    $t() {
      // Simple translation function - in a real app, this would be provided by i18n
      const translations = {
        en: {
          general: {
            search: 'Search...',
            selectLanguage: 'Select Language'
          },
          notifications: {
            title: 'Notifications',
            markAllRead: 'Mark all as read',
            empty: 'No notifications',
            viewAll: 'View all notifications'
          },
          user: {
            profile: 'Profile',
            settings: 'Settings',
            logout: 'Log out'
          },
          time: {
            now: 'Just now',
            minutesAgo: 'min ago',
            hoursAgo: 'hr ago',
            today: 'Today',
            yesterday: 'Yesterday'
          }
        },
        es: {
          general: {
            search: 'Buscar...',
            selectLanguage: 'Seleccionar idioma'
          },
          notifications: {
            title: 'Notificaciones',
            markAllRead: 'Marcar todo como leído',
            empty: 'No hay notificaciones',
            viewAll: 'Ver todas las notificaciones'
          },
          user: {
            profile: 'Perfil',
            settings: 'Configuración',
            logout: 'Cerrar sesión'
          },
          time: {
            now: 'Ahora mismo',
            minutesAgo: 'min atrás',
            hoursAgo: 'h atrás',
            today: 'Hoy',
            yesterday: 'Ayer'
          }
        }
        // Additional languages would be added here
      };
      
      // Get translations for current language or fall back to English
      const currentTranslations = translations[this.currentLanguage] || translations.en;
      
      // Return function to access nested translations by key path
      return (path) => {
        const keys = path.split('.');
        let result = currentTranslations;
        
        for (const key of keys) {
          if (result && result[key] !== undefined) {
            result = result[key];
          } else {
            // Fall back to English if translation not found
            let fallback = translations.en;
            for (const k of keys) {
              if (fallback && fallback[k] !== undefined) {
                fallback = fallback[k];
              } else {
                return path; // Last resort fallback is the key itself
              }
            }
            return fallback;
          }
        }
        
        return result;
      };
    }
  },
  methods: {
    performSearch() {
      if (!this.searchQuery) return;
      console.log('Searching for:', this.searchQuery);
      // Implement search functionality here
      // this.$emit('search', this.searchQuery);
    },
    
    clearSearch() {
      this.searchQuery = '';
      // Clear search results
      // this.$emit('clear-search');
    },
    
    changeLanguage(code) {
      this.currentLanguage = code;
      this.languageMenu = false;
      // In a real app, you would update the app's locale
      // this.$i18n.locale = code;
      // localStorage.setItem('preferredLanguage', code);
    },
    
    readNotification(notification) {
      notification.read = true;
      // In a real app, you would send an API call to mark as read
      // this.$emit('notification-read', notification.id);
    },
    
    markAllAsRead() {
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      // In a real app, you would send an API call to mark all as read
      // this.$emit('mark-all-read');
    },
    
    viewAllNotifications() {
      this.notificationMenu = false;
      // Navigate to notifications page
      // this.$router.push('/notifications');
    },
    
    getNotificationColor(type) {
      const colors = {
        message: 'primary',
        calendar: 'success',
        task: 'warning',
        system: 'info',
        error: 'error'
      };
      return colors[type] || 'grey';
    },
    
    getNotificationIcon(type) {
      const icons = {
        message: 'mdi-message-outline',
        calendar: 'mdi-calendar-clock',
        task: 'mdi-check-circle-outline',
        system: 'mdi-information-outline',
        error: 'mdi-alert-circle-outline'
      };
      return icons[type] || 'mdi-bell-outline';
    },
    
    formatNotificationTime(time) {
      if (!time) return '';
      
      const now = new Date();
      const minutes = Math.floor((now - new Date(time)) / (1000 * 60));
      
      if (minutes < 1) return this.$t('time.now');
      if (minutes < 60) return `${minutes} ${this.$t('time.minutesAgo')}`;
      
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} ${this.$t('time.hoursAgo')}`;
      
      // Check if it's today or yesterday
      const timeDate = new Date(time);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (timeDate >= today) return this.$t('time.today');
      if (timeDate >= yesterday) return this.$t('time.yesterday');
      
      // Default to date format
      return timeDate.toLocaleDateString();
    },
    
    navigateTo(path) {
      // In a real app, use router
      // this.$router.push(path);
      console.log('Navigate to:', path);
      this.userMenu = false;
    },
    
    logout() {
      // Implement logout functionality
      console.log('Logging out...');
      // this.$store.dispatch('auth/logout');
      this.userMenu = false;
    }
  }
};
</script>

<style scoped>
/* Container for the top bar */
.top-bar-container {
  width: 100%;
  padding: 8px 16px;
  background-color: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.top-bar-row {
  height: 56px;
}

/* Search input styling */
.search-wrapper {
  transition: all 0.3s;
  max-width: 300px;
}

.search-input {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.search-input:focus-within {
  width: 320px;
  max-width: 100%;
}

/* Language Icon Styling */
.language-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EEBFFF;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.language-icon:hover {
  background-color: #FABFFF;
}

/* Notification Icon Styling */
.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EEBFFF;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-icon:hover {
  background-color: #FABFFF;
}

/* User Avatar Styling */
.user-avatar {
  cursor: pointer;
  border: 2px solid #EEBFFF;
  transition: border-color 0.2s;
}

.user-avatar:hover {
  border-color: #FABFFF;
}

/* Notification styles */
.notification-list {
  max-height: 350px;
  overflow-y: auto;
}

.unread-notification {
  background-color: rgba(238, 191, 255, 0.1);
  font-weight: 500;
}

.notification-time {
  white-space: nowrap;
  color: rgba(0, 0, 0, 0.54);
  font-size: 12px;
}

/* Menu adjustments */
.language-menu, .notification-menu, .user-menu {
  border-radius: 8px;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-wrapper {
    max-width: 200px;
  }
  
  .search-input:focus-within {
    width: 240px;
  }
}

@media (max-width: 600px) {
  .top-bar-container {
    padding: 8px;
  }
  
  .language-icon,
  .notification-icon {
    width: 36px;
    height: 36px;
  }
  
  .user-avatar {
    width: 36px;
    height: 36px;
  }
  
  .ml-4 {
    margin-left: 8px !important;
  }
}
</style>