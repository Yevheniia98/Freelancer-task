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
      <v-list-item
        :class="drawerExpanded ? 'expanded' : 'collapsed'"
        class="logo-container"
      >
        <template #prepend>
          <div class="logo-circle">
            <span class="logo-text">FT</span>
          </div>
        </template>
        <v-list-item-title
          v-show="drawerExpanded"
          class="title-text"
        >
          Freelance Task
        </v-list-item-title>
      </v-list-item>
    </v-list>
  
    <!-- Main Navigation -->
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        to="/"
        link
        class="menu-list-item"
        active-class="active-menu-item"
      >
        <template #prepend>
          <v-icon class="menu-icon">
            mdi-view-dashboard-outline
          </v-icon>
        </template>
        <v-list-item-title class="d">
          Dashboard
        </v-list-item-title>
      </v-list-item>
  
      <v-list-group class="menu-group">
        <template #activator="{ props }">
          <v-list-item
            class="menu-list-item"
            v-bind="props"
          >
            <template #prepend>
              <v-icon class="menu-icon">
                mdi-folder-outline
              </v-icon>
            </template>
            <v-list-item-title class="p">
              Projects
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item 
          class="submenu-item" 
          link
          to="/projects"
        >
          <v-list-item-title class="l">
            Projects list
          </v-list-item-title>
        </v-list-item>
        <v-list-item 
          class="submenu-item" 
          link
          to="/project-create"
        >
          <v-list-item-title class="l">
            Create projects
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
  
      <v-list-group class="menu-group">
        <template #activator="{ props }">
          <v-list-item
            class="menu-list-item"
            v-bind="props"
          >
            <template #prepend>
              <v-icon class="menu-icon">
                mdi-account-outline
              </v-icon>
            </template>
            <v-list-item-title class="c">
              Clients
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item 
          class="submenu-item" 
          link
          to="/client-main"
        >
          <v-list-item-title class="l">
            Clients
          </v-list-item-title>
        </v-list-item>
        <v-list-item 
          class="submenu-item" 
          link
          to="/invite-member"
        >
          <v-list-item-title class="l">
            Invite freelancer
          </v-list-item-title>
        </v-list-item>
        <v-list-item 
          class="submenu-item" 
          link
          to="/my-team"
        >
          <v-list-item-title class="l">
            My team
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
  
      <v-list-item 
        class="menu-list-item" 
        link
        to="/task-dashboard"
      >
        <template #prepend>
          <v-icon class="menu-icon">
            mdi-clipboard-text-outline
          </v-icon>
        </template>
        <v-list-item-title class="t">
          Tasks
        </v-list-item-title>
      </v-list-item>
  
      <v-list-item 
        class="menu-list-item" 
        link
        to="/finance-dashboard"
      >
        <template #prepend>
          <v-icon class="menu-icon">
            mdi-chart-line
          </v-icon>
        </template>
        <v-list-item-title class="f">
          Finance
        </v-list-item-title>
      </v-list-item>
  
      <v-list-item 
        class="menu-list-item" 
        link
        to="/calendar"
      >
        <template #prepend>
          <v-icon class="menu-icon">
            mdi-calendar-blank-outline
          </v-icon>
        </template>
        <v-list-item-title class="c">
          Calendar
        </v-list-item-title>
      </v-list-item>
  
      <v-list-item 
        class="menu-list-item" 
        link
        to="/tools"
      >
        <template #prepend>
          <v-icon class="menu-icon">
            mdi-tools
          </v-icon>
        </template>
        <v-list-item-title class="t">
          Tools
        </v-list-item-title>
      </v-list-item>
  
      <v-list-group class="menu-group">
        <template #activator="{ props }">
          <v-list-item
            class="menu-list-item"
            v-bind="props"
          >
            <template #prepend>
              <v-icon class="menu-icon">
                mdi-cog-outline
              </v-icon>
            </template>
            <v-list-item-title class="s">
              Settings
            </v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          class="submenu-item"
          link
          to="/account"
        >
          <v-list-item-title class="l">
            Account Settings
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="submenu-item"
          link
          to="/sub"
        >
          <v-list-item-title class="l">
            Subscription & Billing
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="submenu-item"
          link
          to="/custom"
        >
          <v-list-item-title class="l">
            Customization
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="submenu-item"
          link
          to="/secure"
        >
          <v-list-item-title class="l">
            Security & Privacy
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="submenu-item"
          link
          to="/integrate"
        >
          <v-list-item-title>Integrations</v-list-item-title>
        </v-list-item>
        <v-list-item
          class="submenu-item"
          link
          to="/backup"
        >
          <v-list-item-title class="l">
            Backup & Data M.
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          class="submenu-item"
          link
          to="/support"
        >
          <v-list-item-title class="l">
            Support & Feedback
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  
    <!-- User Profiles Section -->
    <template #append>
      <div class="user-profiles">
        <v-list>
          <v-list-item class="user-item">
            <template #prepend>
              <v-avatar
                size="40"
                class="user-avatar"
              >
                <v-img src="https://randomuser.me/api/portraits/men/32.jpg" />
                <div class="status-dot online" />
              </v-avatar>
            </template>
            <div
              v-if="drawerExpanded"
              class="user-info"
            >
              <v-list-item-title>Daniele</v-list-item-title>
              <v-list-item-subtitle class="user-email">
                dan.109@gmail.com
              </v-list-item-subtitle>
            </div>
          </v-list-item>
            
          <v-list-item class="user-item">
            <template #prepend>
              <v-avatar
                size="40"
                class="user-avatar"
              >
                <v-img src="https://randomuser.me/api/portraits/women/32.jpg" />
                <div class="status-dot offline" />
              </v-avatar>
            </template>
            <div
              v-if="drawerExpanded"
              class="user-info"
            >
              <v-list-item-title>Bella</v-list-item-title>
              <v-list-item-subtitle class="user-email">
                ella_5@gmail.com
              </v-list-item-subtitle>
            </div>
          </v-list-item>
            
          <v-list-item class="user-item">
            <template #prepend>
              <v-avatar
                size="40"
                class="user-avatar"
              >
                <v-img src="https://randomuser.me/api/portraits/men/41.jpg" />
                <div class="status-dot online" />
              </v-avatar>
            </template>
            <div
              v-if="drawerExpanded"
              class="user-info"
            >
              <v-list-item-title>Ali</v-list-item-title>
              <v-list-item-subtitle class="user-email">
                it.smart@gmail.com
              </v-list-item-subtitle>
            </div>
          </v-list-item>
            
          <v-list-item class="user-item">
            <template #prepend>
              <v-avatar
                size="40"
                class="user-avatar"
              >
                <v-img src="https://randomuser.me/api/portraits/men/22.jpg" />
                <div class="status-dot online" />
              </v-avatar>
            </template>
            <div
              v-if="drawerExpanded"
              class="user-info"
            >
              <v-list-item-title>Jack</v-list-item-title>
              <v-list-item-subtitle class="user-email">
                jack.j@gmail.com
              </v-list-item-subtitle>
            </div>
          </v-list-item>
            
          <v-list-item class="user-item">
            <template #prepend>
              <v-avatar
                size="40"
                class="user-avatar"
              >
                <v-img src="https://randomuser.me/api/portraits/women/42.jpg" />
                <div class="status-dot online" />
              </v-avatar>
            </template>
            <div
              v-if="drawerExpanded"
              class="user-info"
            >
              <v-list-item-title>me (Isabella)</v-list-item-title>
              <v-list-item-subtitle class="user-email" />
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
    text-align: left;
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

  .d {
    text-align: left;
  }

  .t {
    text-align: left;
  }
  
  .c {
    text-align: left;
  }

  .f {
    text-align: left;
  }

  .p {
    text-align: left;
  }

  .s {
    text-align: left;
  }

  .l {
    text-align: left;
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