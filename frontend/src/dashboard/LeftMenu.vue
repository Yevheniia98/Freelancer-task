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
        to="/dashboard"
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
  
    <!-- Team Members Section -->
    <template #append>
      <div class="team-section">
        <!-- Team Header -->
        <div
          v-if="drawerExpanded"
          class="team-header"
        >
          <div class="team-title">
            <v-icon
              size="18"
              color="white"
            >
              mdi-account-group
            </v-icon>
            <span>Team</span>
          </div>
          <v-chip
            size="small"
            variant="tonal"
            color="success"
          >
            {{ onlineMembers }} online
          </v-chip>
        </div>

        <v-list class="team-list">
          <v-list-item 
            v-for="member in teamMembers" 
            :key="member.id"
            class="user-item"
            @click="openMessageDialog(member)"
          >
            <template #prepend>
              <v-avatar
                size="40"
                class="user-avatar"
              >
                <v-img :src="member.avatar" />
                <div 
                  class="status-dot" 
                  :class="member.status"
                />
              </v-avatar>
            </template>
            <div
              v-if="drawerExpanded"
              class="user-info"
            >
              <v-list-item-title class="user-name">
                {{ member.name }}
                <v-icon 
                  v-if="member.hasUnread" 
                  size="12" 
                  color="error"
                  class="unread-indicator"
                >
                  mdi-circle
                </v-icon>
              </v-list-item-title>
              <v-list-item-subtitle class="user-status">
                {{ member.statusText }}
              </v-list-item-subtitle>
            </div>
            
            <!-- Message Icon (visible on hover when expanded) -->
            <template
              v-if="drawerExpanded"
              #append
            >
              <v-btn
                icon
                size="small"
                variant="text"
                class="message-btn"
                @click.stop="openMessageDialog(member)"
              >
                <v-icon
                  size="16"
                  color="rgba(255,255,255,0.7)"
                >
                  mdi-message-text
                </v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </div>
    </template>
  </v-navigation-drawer>

  <!-- Message Dialog -->
  <v-dialog 
    v-model="messageDialog" 
    max-width="500"
    persistent
  >
    <v-card class="message-card">
      <!-- Dialog Header -->
      <v-card-title class="message-header">
        <div class="dialog-user-info">
          <v-avatar
            size="40"
            class="mr-3"
          >
            <v-img :src="selectedMember?.avatar" />
          </v-avatar>
          <div>
            <div class="dialog-user-name">
              {{ selectedMember?.name }}
            </div>
            <div class="dialog-user-status">
              <div 
                class="status-dot small" 
                :class="selectedMember?.status"
              />
              {{ selectedMember?.statusText }}
            </div>
          </div>
        </div>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="closeMessageDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- Message History -->
      <v-card-text class="message-history">
        <div
          v-for="message in messageHistory"
          :key="message.id"
          class="message-item"
          :class="{ 'own-message': message.isOwn }"
        >
          <div class="message-bubble">
            <div class="message-text">
              {{ message.text }}
            </div>
            <div class="message-time">
              {{ message.time }}
            </div>
          </div>
        </div>
        <div
          v-if="messageHistory.length === 0"
          class="no-messages"
        >
          <v-icon
            size="48"
            color="grey-lighten-1"
          >
            mdi-message-outline
          </v-icon>
          <p>No messages yet. Start a conversation!</p>
        </div>
      </v-card-text>

      <!-- Message Input -->
      <v-card-actions class="message-input-area">
        <v-text-field
          v-model="newMessage"
          placeholder="Type your message..."
          variant="outlined"
          density="compact"
          hide-details
          class="message-input"
          @keyup.enter="sendMessage"
        >
          <template #append-inner>
            <v-btn
              icon
              size="small"
              variant="text"
              color="primary"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Success Snackbar -->
  <v-snackbar
    v-model="snackbar"
    :timeout="3000"
    color="success"
    location="bottom right"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-2">
        mdi-check
      </v-icon>
      {{ snackbarText }}
    </div>
  </v-snackbar>
</template>
  
<script>
export default {
  name: 'LeftMenuBar',
  data() {
    return {
      drawerExpanded: false,
      messageDialog: false,
      selectedMember: null,
      newMessage: '',
      snackbar: false,
      snackbarText: '',
      
      // Team members data
      teamMembers: [
        {
          id: 1,
          name: 'Daniele',
          email: 'dan.109@gmail.com',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          status: 'online',
          statusText: 'Available',
          hasUnread: true
        },
        {
          id: 2,
          name: 'Bella',
          email: 'ella_5@gmail.com',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
          status: 'offline',
          statusText: 'Last seen 2h ago',
          hasUnread: false
        },
        {
          id: 3,
          name: 'Ali',
          email: 'it.smart@gmail.com',
          avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
          status: 'online',
          statusText: 'In a meeting',
          hasUnread: false
        },
        {
          id: 4,
          name: 'Jack',
          email: 'jack.j@gmail.com',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          status: 'online',
          statusText: 'Available',
          hasUnread: true
        }
      ],
      
      // Sample message history (in real app, this would come from API)
      messageHistory: []
    };
  },

  computed: {
    onlineMembers() {
      return this.teamMembers.filter(member => member.status === 'online').length;
    }
  },

  methods: {
    openMessageDialog(member) {
      this.selectedMember = member;
      this.messageDialog = true;
      this.loadMessageHistory(member.id);
      
      // Mark as read if had unread messages
      if (member.hasUnread) {
        member.hasUnread = false;
      }
    },

    closeMessageDialog() {
      this.messageDialog = false;
      this.selectedMember = null;
      this.newMessage = '';
      this.messageHistory = [];
    },

    loadMessageHistory(memberId) {
      // Simulate loading message history
      // In a real app, you would fetch this from your API
      const sampleMessages = {
        1: [ // Daniele
          {
            id: 1,
            text: "Hey! How's the project coming along?",
            time: "10:30 AM",
            isOwn: false
          },
          {
            id: 2,
            text: "Great! I just finished the dashboard design. Want to take a look?",
            time: "10:32 AM",
            isOwn: true
          },
          {
            id: 3,
            text: "Absolutely! Can you share the link?",
            time: "10:33 AM",
            isOwn: false
          }
        ],
        4: [ // Jack
          {
            id: 1,
            text: "Don't forget about our meeting at 3 PM",
            time: "2:45 PM",
            isOwn: false
          }
        ]
      };
      
      this.messageHistory = sampleMessages[memberId] || [];
    },

    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      // Add message to history
      const newMsg = {
        id: Date.now(),
        text: this.newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      
      this.messageHistory.push(newMsg);
      
      // Simulate sending message (in real app, you would send to API)
      console.log(`Sending message to ${this.selectedMember.name}: ${this.newMessage}`);
      
      // Show success message
      this.snackbarText = `Message sent to ${this.selectedMember.name}`;
      this.snackbar = true;
      
      // Clear input
      this.newMessage = '';
      
      // Simulate response after a delay
      setTimeout(() => {
        this.simulateResponse();
      }, 2000);
    },

    simulateResponse() {
      if (this.messageDialog && this.selectedMember) {
        const responses = [
          "Thanks for the message!",
          "Got it, will check that out.",
          "Sounds good!",
          "Let me get back to you on that.",
          "Perfect timing!"
        ];
        
        const response = {
          id: Date.now(),
          text: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false
        };
        
        this.messageHistory.push(response);
      }
    }
  }
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

.d, .t, .c, .f, .p, .s, .l {
  text-align: left;
}

/* Team Section */
.team-section {
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.team-header {
  padding: 8px 16px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 600;
}

.team-list {
  max-height: 300px;
  overflow-y: auto;
}

.user-item {
  height: 56px;
  color: #e5e5e5;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-item:hover .message-btn {
  opacity: 1;
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

.status-dot.small {
  width: 8px;
  height: 8px;
  border: 1px solid white;
  position: relative;
  bottom: auto;
  right: auto;
  display: inline-block;
  margin-right: 4px;
}

.online {
  background-color: #4CAF50;
}

.offline {
  background-color: #FF5252;
}

.user-info {
  margin-left: 12px;
  flex: 1;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.user-status {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
}

.unread-indicator {
  animation: pulse 2s infinite;
}

.message-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

/* Message Dialog Styles */
.message-card {
  border-radius: 12px;
  overflow: hidden;
}

.message-header {
  background: linear-gradient(135deg, #064E47, #0D7C66);
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-user-info {
  display: flex;
  align-items: center;
}

.dialog-user-name {
  font-weight: 600;
  font-size: 16px;
}

.dialog-user-status {
  font-size: 12px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.message-history {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
  background: #f8fafc;
}

.message-item {
  margin-bottom: 12px;
  display: flex;
}

.message-item.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.own-message .message-bubble {
  background: #064E47;
  color: white;
}

.message-text {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 4px;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}

.own-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.no-messages {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.no-messages p {
  margin-top: 12px;
  font-size: 14px;
}

.message-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.message-input {
  flex: 1;
}

/* Animations */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Scrollbar styling */
.team-list::-webkit-scrollbar,
.message-history::-webkit-scrollbar {
  width: 4px;
}

.team-list::-webkit-scrollbar-track,
.message-history::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.team-list::-webkit-scrollbar-thumb,
.message-history::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.team-list::-webkit-scrollbar-thumb:hover,
.message-history::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>