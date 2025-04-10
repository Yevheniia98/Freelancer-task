<template>
  <v-navigation-drawer
    class="custom-rail-background"
    permanent
    expand-on-hover
    rail
    elevation="4"
    @mouseenter="drawerExpanded = true"
    @mouseleave="drawerExpanded = false"
  >
    <!-- Top Logo Section -->
    <v-list>
      <v-list-item :class="drawerExpanded ? 'expanded' : 'collapsed'" class="logo-container">
        <template v-slot:prepend>
          <div class="logo-circle">
            <span class="logo-text">FT</span>
          </div>
        </template>
        <v-list-item-title v-show="drawerExpanded" class="title-text">
          Freelance Task
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <!-- Main Navigation -->
    <v-list density="compact" nav>
      <v-list-item
        to="/"
        class="menu-list-item"
        active-class="active-menu-item"
      >
        <template v-slot:prepend>
          <v-icon class="menu-icon">mdi-view-dashboard-outline</v-icon>
        </template>
        <v-list-item-title>Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-group class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item
            class="menu-list-item"
            v-bind="props"
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon">mdi-folder-outline</v-icon>
            </template>
            <v-list-item-title>Projects</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item class="submenu-item">
          <v-list-item-title>Projects list</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Create projects</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-group class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item
            class="menu-list-item"
            v-bind="props"
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon">mdi-account-outline</v-icon>
            </template>
            <v-list-item-title>Clients</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item class="submenu-item">
          <v-list-item-title>Clients</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Invite freelancer</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>My team</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-item class="menu-list-item">
        <template v-slot:prepend>
          <v-icon class="menu-icon">mdi-clipboard-text-outline</v-icon>
        </template>
        <v-list-item-title>Tasks</v-list-item-title>
      </v-list-item>

      <v-list-item class="menu-list-item">
        <template v-slot:prepend>
          <v-icon class="menu-icon">mdi-chart-line</v-icon>
        </template>
        <v-list-item-title>Finance</v-list-item-title>
      </v-list-item>

      <v-list-item class="menu-list-item">
        <template v-slot:prepend>
          <v-icon class="menu-icon">mdi-calendar-blank-outline</v-icon>
        </template>
        <v-list-item-title>Calendar</v-list-item-title>
      </v-list-item>

      <v-list-item class="menu-list-item">
        <template v-slot:prepend>
          <v-icon class="menu-icon">mdi-tools</v-icon>
        </template>
        <v-list-item-title>Tools</v-list-item-title>
      </v-list-item>

      <v-list-group class="menu-group">
        <template v-slot:activator="{ props }">
          <v-list-item
            class="menu-list-item"
            v-bind="props"
          >
            <template v-slot:prepend>
              <v-icon class="menu-icon">mdi-cog-outline</v-icon>
            </template>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item class="submenu-item">
          <v-list-item-title>Account Settings</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Subscription & Billing</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Customization</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Security & Privacy</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Integrations</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Backup & Data M.</v-list-item-title>
        </v-list-item>
        <v-list-item class="submenu-item">
          <v-list-item-title>Support & Feedback</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>

    <!-- User Profiles Section -->
    <template v-slot:append>
      <div class="user-profiles">
        <v-list>
          <v-list-item class="user-item">
            <template v-slot:prepend>
              <v-avatar size="40" class="user-avatar">
                <v-img src="https://randomuser.me/api/portraits/men/32.jpg" />
                <div class="status-dot online"></div>
              </v-avatar>
            </template>
            <div v-if="drawerExpanded" class="user-info">
              <v-list-item-title>Daniele</v-list-item-title>
              <v-list-item-subtitle class="user-email">dan.109@gmail.com</v-list-item-subtitle>
            </div>
          </v-list-item>
          
          <v-list-item class="user-item">
            <template v-slot:prepend>
              <v-avatar size="40" class="user-avatar">
                <v-img src="https://randomuser.me/api/portraits/women/32.jpg" />
                <div class="status-dot offline"></div>
              </v-avatar>
            </template>
            <div v-if="drawerExpanded" class="user-info">
              <v-list-item-title>Bella</v-list-item-title>
              <v-list-item-subtitle class="user-email">ella_5@gmail.com</v-list-item-subtitle>
            </div>
          </v-list-item>
          
          <v-list-item class="user-item">
            <template v-slot:prepend>
              <v-avatar size="40" class="user-avatar">
                <v-img src="https://randomuser.me/api/portraits/men/41.jpg" />
                <div class="status-dot online"></div>
              </v-avatar>
            </template>
            <div v-if="drawerExpanded" class="user-info">
              <v-list-item-title>Ali</v-list-item-title>
              <v-list-item-subtitle class="user-email">it.smart@gmail.com</v-list-item-subtitle>
            </div>
          </v-list-item>
          
          <v-list-item class="user-item">
            <template v-slot:prepend>
              <v-avatar size="40" class="user-avatar">
                <v-img src="https://randomuser.me/api/portraits/men/22.jpg" />
                <div class="status-dot online"></div>
              </v-avatar>
            </template>
            <div v-if="drawerExpanded" class="user-info">
              <v-list-item-title>Jack</v-list-item-title>
              <v-list-item-subtitle class="user-email">jack.j@gmail.com</v-list-item-subtitle>
            </div>
          </v-list-item>
          
          <v-list-item class="user-item">
            <template v-slot:prepend>
              <v-avatar size="40" class="user-avatar">
                <v-img src="https://randomuser.me/api/portraits/women/42.jpg" />
                <div class="status-dot online"></div>
              </v-avatar>
            </template>
            <div v-if="drawerExpanded" class="user-info">
              <v-list-item-title>me (Isabella)</v-list-item-title>
              <v-list-item-subtitle class="user-email"></v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-list>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'LeftMenuBar',
  data() {
    return {
      drawerExpanded: false,
    };
  },
};
</script>

<style scoped>
.custom-rail-background {
  background-color: #064E47;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}

/* Logo styling */
.logo-container {
  min-height: 64px;
  display: flex;
  align-items: center;
  padding: 16px;
}

.logo-circle {
  width: 32px;
  height: 32px;
  background-color: #064E47;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.title-text {
  color: white;
  font-weight: 600;
  font-size: 18px;
  margin-left: 12px;
}

/* Menu items styling */
.menu-list-item {
  color: #e5e5e5;
  height: 44px;
  margin: 4px 0;
}

.menu-icon {
  color: #e5e5e5;
  margin-right: 8px;
}

.submenu-item {
  padding-left: 56px;
  color: #e5e5e5;
  height: 36px;
  font-size: 14px;
}

.active-menu-item {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-list-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-group {
  margin: 0;
  padding: 0;
}

/* User profiles section */
.user-profiles {
  margin-top: auto;
}

.user-item {
  height: 56px;
  color: #e5e5e5;
  padding: 8px 16px;
}

.user-avatar {
  position: relative;
}

.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #064E47;
}

.online {
  background-color: #4CAF50;
}

.offline {
  background-color: #FF5252;
}

.user-info {
  margin-left: 12px;
}

.user-email {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}
</style>