<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card
      width="1300"
      class="chat-container mx-auto"
      elevation="1"
    >
      <!-- Header -->
      <v-card-title class="chat-header px-3 py-2">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <v-avatar
              size="36"
              color="teal"
              class="mr-2"
            >
              <span class="text-caption text-white">DT</span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                Design Team
              </div>
              <div class="text-caption text-medium-emphasis">
                5 members
              </div>
            </div>
          </div>
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            density="comfortable"
          />
        </div>
      </v-card-title>
      
      <v-divider />
      
      <!-- Tabs -->
      <div class="custom-tabs d-flex px-3">
        <div
          class="custom-tab py-2 px-2"
          :class="{ active: activeTab === 'chats' }"
          @click="activeTab = 'chats'"
        >
          Chats
        </div>
        <div
          class="custom-tab py-2 px-2"
          :class="{ active: activeTab === 'contacts' }"
          @click="activeTab = 'contacts'"
        >
          Contacts
        </div>
      </div>
      
      <v-divider />
      
      <v-window v-model="activeTab">
        <!-- Chat Tab -->
        <v-window-item value="chats">
          <div class="chat-scroll-container">
            <!-- Scroll Position Indicator -->
            <div
              v-if="!atBottom"
              class="scroll-position-indicator"
            >
              <v-badge
                dot
                color="primary"
                :inline="true"
                offset-x="10"
                offset-y="5"
              >
                <span class="text-caption">{{ unreadCount }} new</span>
              </v-badge>
              <v-btn
                icon="mdi-chevron-down"
                size="small"
                color="primary"
                variant="text"
                class="ml-2"
                @click="scrollToBottomManually"
              />
            </div>
            
            <!-- Scroll Instructions -->
            <div
              v-if="showScrollHelp"
              class="scroll-instructions"
            >
              <div class="text-center py-2 text-caption bg-info-lighten-5">
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  mdi-gesture-swipe-vertical
                </v-icon>
                Scroll up and down to view messages
                <v-btn
                  size="x-small"
                  variant="text"
                  color="info"
                  class="ml-2"
                  @click="dismissScrollHelp"
                >
                  Got it
                </v-btn>
              </div>
            </div>
            
            <!-- Messages Container -->
            <div 
              ref="messagesContainer" 
              class="chat-messages"
              @scroll="handleScroll"
            >
              <div
                v-for="(message, index) in messages"
                :key="index" 
                :class="['message-wrapper', message.senderId === currentUserId ? 'message-sent' : 'message-received']"
              >
                <div
                  class="message-bubble"
                  :class="{'message-editing': editingMessageId === message.id}"
                >
                  <!-- Message Type Indicator -->
                  <div
                    v-if="message.type !== 'text'"
                    class="message-type-badge mb-1"
                  >
                    <v-chip
                      size="x-small"
                      color="primary"
                      :text="getMessageTypeLabel(message.type)"
                      variant="flat"
                      density="compact"
                    />
                  </div>
                  
                  <!-- Sender Name -->
                  <div
                    v-if="message.senderId !== currentUserId"
                    class="message-sender text-caption text-primary font-weight-medium mb-1"
                  >
                    {{ getSenderName(message.senderId) }}
                  </div>
                  
                  <!-- Message Content (normal view) -->
                  <div
                    v-if="editingMessageId !== message.id"
                    class="message-text"
                  >
                    {{ message.text }}
                  </div>
                  
                  <!-- Message Content (edit mode) -->
                  <div
                    v-else
                    class="edit-message-container"
                  >
                    <v-text-field
                      v-model="editedMessageText"
                      variant="outlined"
                      density="compact"
                      hide-details
                      autofocus
                      @keyup.enter="updateMessage"
                      @keyup.esc="cancelEdit"
                    />
                    <div class="d-flex mt-1">
                      <v-btn
                        size="x-small"
                        color="primary"
                        variant="text"
                        @click="updateMessage"
                      >
                        Save
                      </v-btn>
                      <v-btn
                        size="x-small"
                        variant="text"
                        @click="cancelEdit"
                      >
                        Cancel
                      </v-btn>
                    </div>
                  </div>
                  
                  <!-- Message Time and Actions -->
                  <div class="d-flex justify-space-between align-center mt-1">
                    <div
                      v-if="message.senderId === currentUserId && editingMessageId !== message.id"
                      class="message-actions"
                    >
                      <v-btn
                        size="x-small"
                        icon
                        variant="text"
                        @click="editMessage(message)"
                      >
                        <v-icon size="small">
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                      <v-btn
                        size="x-small"
                        icon
                        variant="text"
                        @click="deleteMessage(message.id)"
                      >
                        <v-icon size="small">
                          mdi-delete
                        </v-icon>
                      </v-btn>
                    </div>
                    <div
                      class="message-time text-caption"
                      :class="message.senderId === currentUserId ? 'text-right' : ''"
                    >
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Input Area -->
            <div class="chat-input px-2 py-2">
              <!-- Typing Indicator -->
              <div
                v-if="isTyping"
                class="typing-indicator text-caption text-medium-emphasis mb-1"
              >
                {{ typingUser }} is typing...
              </div>
              
              <div class="d-flex align-center gap-1">
                <!-- Message Type Selector -->
                <v-menu location="top">
                  <template #activator="{ props }">
                    <v-btn
                      icon
                      variant="text"
                      density="comfortable"
                      v-bind="props"
                    >
                      <v-icon>{{ getMessageTypeIcon() }}</v-icon>
                    </v-btn>
                  </template>
                  <v-list density="compact">
                    <v-list-item
                      v-for="type in messageTypes"
                      :key="type.value"
                      @click="setMessageType(type.value)"
                    >
                      <template #prepend>
                        <v-icon>{{ type.icon }}</v-icon>
                      </template>
                      <v-list-item-title>{{ type.label }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                
                <!-- Message Input Field -->
                <v-text-field 
                  v-model="newMessage" 
                  :placeholder="getInputPlaceholder()"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  bg-color="surface"
                  append-inner-icon="mdi-send"
                  @click:append-inner="sendMessage"
                  @keyup.enter="sendMessage"
                />
              </div>
            </div>
          </div>
        </v-window-item>
        
        <!-- Contacts Tab -->
        <v-window-item value="contacts">
          <!-- Group members section -->
          <div class="px-3 py-2">
            <div class="text-subtitle-2 font-weight-medium mb-2">
              Group Members
            </div>
            <div class="members-grid mb-3">
              <div
                v-for="member in members"
                :key="member.id"
                class="member-item text-center"
              >
                <v-avatar
                  :image="member.avatar"
                  size="40"
                  class="mb-1"
                >
                  <v-icon v-if="!member.avatar">
                    mdi-account
                  </v-icon>
                </v-avatar>
                <div class="text-caption">
                  {{ member.name.split(' ')[0] }}
                </div>
              </div>
            </div>
          </div>
          
          <v-divider />
          
          <!-- People you can chat with -->
          <div class="px-3 py-2">
            <div class="text-subtitle-2 font-weight-medium mb-2">
              People you can chat with
            </div>
          </div>
          <v-list
            lines="two"
            class="pa-0 contacts-list"
          >
            <v-list-item
              v-for="contact in contacts"
              :key="contact.id"
              :active="selectedContact && contact.id === selectedContact.id"
              class="contact-item"
              @click="startPrivateChat(contact)"
            >
              <template #prepend>
                <v-avatar
                  :image="contact.avatar"
                  size="36"
                >
                  <v-icon v-if="!contact.avatar">
                    mdi-account
                  </v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="font-weight-medium">
                {{ contact.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-truncate">
                {{ contact.role }}
              </v-list-item-subtitle>
              
              <template #append>
                <v-btn 
                  icon="mdi-message-outline" 
                  variant="text" 
                  density="comfortable" 
                  size="small"
                  @click.stop="startPrivateChat(contact)"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'CompactChat',
  data() {
    return {
      activeTab: 'chats',
      currentUserId: 0,
      selectedContact: null,
      newMessage: '',
      currentMessageType: 'text',
      editingMessageId: null,
      editedMessageText: '',
      isTyping: false,
      typingUser: 'Emily',
      resizeObserver: null,
      autoScroll: true, // Flag to control automatic scrolling
      atBottom: true, // Flag to track if user is at bottom of messages
      unreadCount: 0, // Counter for unread messages
      showScrollHelp: true, // Flag to show scroll instructions
      messageTypes: [
        { value: 'text', label: 'Text', icon: 'mdi-message-text-outline' },
        { value: 'announcement', label: 'Announcement', icon: 'mdi-bullhorn-outline' },
        { value: 'task', label: 'Task', icon: 'mdi-checkbox-marked-circle-outline' },
        { value: 'file', label: 'File', icon: 'mdi-file-outline' },
        { value: 'poll', label: 'Poll', icon: 'mdi-poll' }
      ],
      messages: [
        {
          id: 1,
          senderId: 1,
          text: 'Hey team, I\'ve updated the mockups for the hero section',
          timestamp: new Date(2025, 3, 15, 10, 15),
          type: 'text'
        },
        {
          id: 2,
          senderId: 3,
          text: 'Looks great! I especially like the new color scheme',
          timestamp: new Date(2025, 3, 15, 10, 22),
          type: 'text'
        },
        {
          id: 3,
          senderId: 0,
          text: 'Thanks everyone. Let\'s discuss the new homepage layout',
          timestamp: new Date(2025, 3, 15, 14, 30),
          type: 'text'
        },
        {
          id: 4,
          senderId: 2,
          text: 'When do we need to finalize these designs?',
          timestamp: new Date(2025, 3, 15, 14, 45),
          type: 'text'
        },
        {
          id: 5,
          senderId: 0,
          text: 'Client meeting is scheduled for tomorrow at 2pm',
          timestamp: new Date(2025, 3, 15, 15, 0),
          type: 'announcement'
        },
        // Generate more messages for testing scrolling
        ...[...Array(15)].map((_, i) => ({
          id: 100 + i,
          senderId: i % 2 === 0 ? 2 : 3,
          text: `This is message #${i+1} for testing scrolling functionality.`,
          timestamp: new Date(2025, 3, 15, 9, i),
          type: 'text'
        })),
      ],
      // Group members (people in current chat)
      members: [
        {
          id: 0,
          name: 'You',
          avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
        },
        {
          id: 1,
          name: 'Emily Johnson',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
          id: 2,
          name: 'Michael Chen',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        {
          id: 3,
          name: 'Sophia Martinez',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
        },
        {
          id: 4,
          name: 'James Wilson',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
        }
      ],
      // All available contacts for private chats
      contacts: [
        {
          id: 1,
          name: 'Emily Johnson',
          role: 'UI/UX Designer',
          avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
          id: 2,
          name: 'Michael Chen',
          role: 'Frontend Developer',
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        {
          id: 3,
          name: 'Sophia Martinez',
          role: 'Product Manager',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
        },
        {
          id: 4,
          name: 'James Wilson',
          role: 'Backend Developer',
          avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
        },
        {
          id: 5,
          name: 'Olivia Lee',
          role: 'Marketing Specialist',
          avatar: 'https://randomuser.me/api/portraits/women/5.jpg'
        }
      ]
    };
  },
  mounted() {
    // Scroll to bottom of messages on initial load
    this.$nextTick(() => {
      this.scrollToBottom();
    });
    
    // Set up a resize observer to handle scrolling when window size changes
    this.resizeObserver = new ResizeObserver(() => {
      if (this.autoScroll) {
        this.scrollToBottom();
      }
    });
    
    if (this.$refs.messagesContainer) {
      this.resizeObserver.observe(this.$refs.messagesContainer);
    }
  },
  beforeUnmount() {
    // Clean up resize observer if it exists
    if (this.resizeObserver && this.$refs.messagesContainer) {
      this.resizeObserver.unobserve(this.$refs.messagesContainer);
      this.resizeObserver.disconnect();
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      // Ensure timestamp is a Date object
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      const now = new Date();
      
      // Compare dates using toDateString() which ignores time
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    },
    
    getSenderName(senderId) {
      if (senderId === this.currentUserId) return 'You';
      const sender = this.contacts.find(contact => contact.id === senderId);
      return sender ? sender.name : 'Unknown User';
    },
    
    sendMessage() {
      if (!this.newMessage.trim()) return;
      
      // Create new message object
      const newMsg = {
        id: this.getNextMessageId(),
        senderId: this.currentUserId,
        text: this.newMessage,
        timestamp: new Date(),
        type: this.currentMessageType
      };
      
      // Add to messages array
      this.messages.push(newMsg);
      
      // If user isn't at the bottom, increment unread count
      if (!this.atBottom) {
        this.unreadCount++;
      }
      
      // Clear input
      this.newMessage = '';
      
      // Simulate typing from another user after sending message
      this.simulateTypingResponse();
      
      // Scroll to bottom after message is sent
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    getNextMessageId() {
      // Find the highest ID and increment by 1
      return Math.max(0, ...this.messages.map(m => m.id)) + 1;
    },
    
    editMessage(message) {
      this.editingMessageId = message.id;
      this.editedMessageText = message.text;
    },
    
    updateMessage() {
      if (!this.editedMessageText.trim()) return;
      
      const index = this.messages.findIndex(m => m.id === this.editingMessageId);
      if (index !== -1) {
        // Update the message
        this.messages[index].text = this.editedMessageText;
        // Add edited flag or timestamp if needed
        this.messages[index].edited = true;
      }
      
      // Clear editing state
      this.editingMessageId = null;
      this.editedMessageText = '';
    },
    
    cancelEdit() {
      this.editingMessageId = null;
      this.editedMessageText = '';
    },
    
    deleteMessage(messageId) {
      // Ask for confirmation
      if (confirm('Are you sure you want to delete this message?')) {
        const index = this.messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
          this.messages.splice(index, 1);
        }
      }
    },
    
    setMessageType(type) {
      this.currentMessageType = type;
    },
    
    getMessageTypeIcon() {
      const type = this.messageTypes.find(t => t.value === this.currentMessageType);
      return type ? type.icon : 'mdi-message-text-outline';
    },
    
    getMessageTypeLabel(type) {
      const messageType = this.messageTypes.find(t => t.value === type);
      return messageType ? messageType.label : 'Text';
    },
    
    getInputPlaceholder() {
      switch (this.currentMessageType) {
        case 'announcement':
          return 'Type an announcement...';
        case 'task':
          return 'Describe the task...';
        case 'file':
          return 'Add a file description...';
        case 'poll':
          return 'Create a poll question...';
        default:
          return 'Type a message...';
      }
    },
    
    simulateTypingResponse() {
      // Simulate someone typing a response
      setTimeout(() => {
        this.isTyping = true;
        // Find a random member who is not the current user
        const otherMembers = this.members.filter(m => m.id !== this.currentUserId);
        const randomMember = otherMembers[Math.floor(Math.random() * otherMembers.length)];
        this.typingUser = randomMember ? randomMember.name.split(' ')[0] : 'Someone';
        
        // After a delay, add the response
        setTimeout(() => {
          this.isTyping = false;
          
          // Random response messages
          const responses = [
            'Got it, thanks for the update!',
            'I\'ll take a look at this today.',
            'Sounds good to me.',
            'Thanks for sharing!',
            'Let me know if I can help with anything.'
          ];
          
          // Add a response message
          const responseMsg = {
            id: this.getNextMessageId(),
            senderId: randomMember ? randomMember.id : 1,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: 'text'
          };
          
          this.messages.push(responseMsg);
          
          // If user isn't at the bottom, increment unread count
          if (!this.atBottom) {
            this.unreadCount++;
          }
          
          // Scroll to bottom
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }, 2000);
      }, 1000);
    },
    
    scrollToBottom() {
      if (this.$refs.messagesContainer && this.autoScroll) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
      }
    },
    
    handleScroll() {
      if (this.$refs.messagesContainer) {
        const { scrollTop, scrollHeight, clientHeight } = this.$refs.messagesContainer;
        
        // Calculate if user is at the bottom (within 50px)
        const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
        this.atBottom = scrolledToBottom;
        
        // Auto-scroll only if user is at the bottom
        this.autoScroll = scrolledToBottom;
        
        // Reset unread count if scrolled to bottom
        if (scrolledToBottom) {
          this.unreadCount = 0;
        }
      }
    },
    
    scrollToBottomManually() {
      // Force scroll to bottom regardless of autoScroll setting
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
        this.autoScroll = true;
        this.atBottom = true;
        this.unreadCount = 0; // Reset unread count when scrolling to bottom
      }
    },
    
    dismissScrollHelp() {
      this.showScrollHelp = false;
    },
    
    startPrivateChat(contact) {
      this.selectedContact = contact;
      // In a real app, you would navigate to a private chat or open a new chat window
      // For demo purposes, we'll just show an alert
      alert(`Starting private chat with ${contact.name}`);
      
      // Switch to chats tab to simulate starting a chat
      this.activeTab = 'chats';
    },
  }
};
</script>

<style scoped>
.chat-container {
  height: 600px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  margin-top: 50px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translate(-8px, 0px);
}

.chat-header {
  background-color: white;
  z-index: 2;
}

.custom-tabs {
  background-color: white;
  z-index: 2;
}

.custom-tab {
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #757575;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.custom-tab.active {
  color: #00897b;
  border-bottom: 2px solid #00897b;
}

.chat-scroll-container {
  position: relative;
  height: calc(100% - 110px);
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: scroll;
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 420px;
  max-height: 420px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Scrollbar styling for Webkit browsers */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* Show scrollbar on hover */
.chat-messages:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
}

.message-wrapper {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.message-sent {
  align-items: flex-end;
}

.message-received {
  align-items: flex-start;
}

.message-bubble {
  max-width: 700px; /* Increased for wider chat */
  padding: 10px 14px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-editing {
  background-color: #fafafa;
  border: 1px dashed rgba(0, 0, 0, 0.2);
}

.message-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message-bubble:hover .message-actions {
  opacity: 1;
}

.message-sent .message-bubble {
  background-color: #e3f2fd;
  border-top-right-radius: 4px;
}

.message-received .message-bubble {
  background-color: white;
  border-top-left-radius: 4px;
}

.message-time {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.6);
}

.message-type-badge {
  margin-top: -2px;
}

.edit-message-container {
  min-width: 300px; /* Increased for wider chat */
}

.typing-indicator {
  height: 15px;
  padding-left: 6px;
}

.scroll-position-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3px 8px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
  display: flex;
  align-items: center;
}

.scroll-instructions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

.chat-input {
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 16px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr); /* Increased columns for wider layout */
  gap: 12px;
  padding: 10px;
}

.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contacts-list {
  height: calc(100% - 150px);
  overflow-y: auto;
}

.contact-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.contact-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.contact-item.v-list-item--active {
  background-color: rgba(0, 128, 128, 0.05);
}
</style>