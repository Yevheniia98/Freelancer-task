<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-card
      width="1300"
      class="whatsapp-container mx-auto"
      elevation="3"
    >
      <!-- WhatsApp-like layout -->
      <div class="whatsapp-layout">
        <!-- Left Sidebar - Chat List -->
        <div class="chat-sidebar">
          <!-- Sidebar Header -->
          <div class="sidebar-header">
            <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar
              size="40"
              class="mr-3"
              :class="{ 'default-user-avatar': !currentUser.avatar }"
            >
              <v-img
                v-if="currentUser.avatar"
                :src="currentUser.avatar"
              />
              <div 
                v-else 
                class="default-user-icon"
              >
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
              </div>
            </v-avatar>
            <div>
                  <div class="text-h6 font-weight-medium">
                    {{ currentUser.name }}
              </div>
              <div class="text-caption text-medium-emphasis">
                    {{ currentUser.status }}
              </div>
            </div>
          </div>
              <div class="d-flex">
                <v-btn
                  icon="mdi-message-plus"
                  variant="tonal"
                  size="small"
                  color="green"
                  @click="openNewChatDialog"
                  title="Invite team member"
                />
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
                  size="small"
          />
        </div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="search-bar">
            <v-text-field
              id="chatSearch"
              v-model="searchQuery"
              label="Search chats"
              placeholder="Search or start new chat"
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-magnify"
              bg-color="grey-lighten-4"
              @input="filterChats"
            />
          </div>

          <!-- Chat List -->
          <div class="chat-list">
            <div
              v-for="chat in filteredChats"
              :key="chat.id"
              class="chat-item"
              :class="{ active: selectedChatId === chat.id }"
              @click="selectChat(chat.id)"
            >
              <div class="d-flex align-center pa-3">
                <div class="position-relative mr-3">
                  <v-avatar
                    size="48"
                    :class="{ 'default-user-avatar': !chat.contact.avatar }"
                  >
                    <v-img
                      v-if="chat.contact.avatar"
                      :src="chat.contact.avatar"
                    />
                    <div 
                      v-else 
                      class="default-user-icon"
                    >
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                      </svg>
                    </div>
                  </v-avatar>
                  <div
                    v-if="chat.contact.isOnline"
                    class="online-indicator"
                  ></div>
                </div>
                
                <div class="flex-grow-1 min-width-0">
                  <div class="d-flex align-center justify-space-between mb-1">
                    <div class="text-subtitle-2 font-weight-medium text-truncate">
                      {{ chat.contact.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ formatChatTime(chat.lastMessage?.timestamp) }}
        </div>
      </div>
      
                  <div class="d-flex align-center justify-space-between">
                    <div class="text-body-2 text-medium-emphasis text-truncate mr-2">
                      <v-icon
                        v-if="chat.lastMessage?.senderId === currentUserId"
                        :icon="getMessageStatusIcon(chat.lastMessage)"
                        :color="getMessageStatusColor(chat.lastMessage)"
                        size="16"
                        class="mr-1"
                      />
                      {{ getLastMessagePreview(chat.lastMessage) }}
                    </div>
              <v-badge
                      v-if="chat.unreadCount > 0"
                      :content="chat.unreadCount"
                      color="green"
                      inline
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty state when no chats -->
            <div v-if="!chats || chats.length === 0" class="empty-chat-state text-center pa-4">
              <v-icon
                size="48"
                color="grey-lighten-2"
                class="mb-3"
              >
                mdi-account-group-outline
              </v-icon>
              <h4 class="text-subtitle-1 mb-2 text-medium-emphasis">No team chats yet</h4>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Start by inviting team members to collaborate
              </p>
              <v-btn
                color="green"
                variant="outlined"
                @click="openNewChatDialog"
                prepend-icon="mdi-account-plus"
              >
                Invite Team Member
              </v-btn>
            </div>
          </div>
            
            <!-- Floating Action Button for Invite -->
            <div style="position: relative;">
              <v-btn
                fab
                color="green"
                style="position: absolute; bottom: 16px; right: 16px; z-index: 10;"
                @click="openNewChatDialog"
                title="Invite new team member"
                size="small"
              >
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </div>
          </div>
            
        <!-- Right Side - Chat Window -->
        <div class="chat-window">
          <!-- Chat not selected state -->
            <div
            v-if="!selectedChatId"
            class="no-chat-selected"
            >
            <div class="text-center">
                <v-icon
                size="80"
                color="grey-lighten-2"
                class="mb-4"
                >
                mdi-chat-outline
                </v-icon>
              <h3 class="text-h6 text-medium-emphasis mb-2">
                Team Chat
              </h3>
              <p class="text-body-2 text-medium-emphasis">
                Send messages, share photos and documents with your team.<br>
                Select a conversation to start chatting.
              </p>
            </div>
          </div>

          <!-- Active Chat -->
          <div
            v-else
            class="active-chat"
          >
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="d-flex align-center justify-space-between pa-3">
                <div class="d-flex align-center">
                  <v-avatar
                    size="40"
                    class="mr-3"
                    :class="{ 'default-user-avatar': !selectedChat?.contact.avatar }"
                  >
                    <v-img
                      v-if="selectedChat?.contact.avatar"
                      :src="selectedChat?.contact.avatar"
                    />
                    <div 
                      v-else 
                      class="default-user-icon"
                    >
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                      </svg>
                    </div>
                  </v-avatar>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">
                      {{ selectedChat?.contact.name }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      {{ selectedChat?.contact.isOnline ? 'online' : `last seen ${formatLastSeen(selectedChat?.contact.lastSeen)}` }}
                    </div>
                  </div>
                </div>
                <div class="d-flex">
                <v-btn
                    icon="mdi-dots-vertical"
                  variant="text"
                    size="small"
                  />
                </div>
              </div>
            </div>
            
            <!-- Messages Container -->
            <div 
              ref="messagesContainer" 
              class="whatsapp-messages"
              @scroll="handleScroll"
            >
              <!-- Date separator -->
              <div
                v-for="(group, dateKey) in groupedMessages"
                :key="dateKey"
                class="message-date-group"
              >
                <div class="date-separator">
                  <div class="date-chip">
                    {{ formatDateSeparator(dateKey) }}
                  </div>
                </div>
                
                <!-- Messages for this date -->
                <div
                  v-for="(message, index) in group"
                  :key="message.id"
                :class="['message-wrapper', message.senderId === currentUserId ? 'message-sent' : 'message-received']"
              >
                <div
                  class="message-bubble"
                  :class="{'message-editing': editingMessageId === message.id}"
                >
                    <!-- Message Content -->
                    <div
                      v-if="editingMessageId !== message.id"
                      class="message-content"
                    >
                      <!-- Voice message -->
                      <div
                        v-if="message.type === 'voice'"
                        class="voice-message"
                      >
                        <v-btn
                          icon="mdi-play"
                          size="small"
                          variant="text"
                          class="mr-2"
                        />
                        <div class="voice-waveform">
                          <div class="waveform-bars">
                            <div
                              v-for="n in 12"
                              :key="n"
                              class="waveform-bar"
                              :style="{ height: Math.random() * 20 + 5 + 'px' }"
                            ></div>
                          </div>
                        </div>
                        <span class="voice-duration">0:{{ Math.floor(Math.random() * 60).toString().padStart(2, '0') }}</span>
                  </div>
                  
                      <!-- Image message -->
                      <div
                        v-else-if="message.type === 'image'"
                        class="image-message"
                      >
                        <v-img
                          :src="message.imageUrl"
                          :alt="message.fileName || 'Uploaded image'"
                          max-width="300"
                          max-height="200"
                          class="rounded cursor-pointer"
                          @click="openImagePreview(message.imageUrl, message.fileName)"
                        />
                        <div class="image-info mt-1">
                          <div class="text-caption text-medium-emphasis">
                            {{ message.fileName }}
                  </div>
                          <div
                            v-if="message.fileSize"
                            class="text-caption text-medium-emphasis"
                          >
                            {{ message.fileSize }}
                          </div>
                        </div>
                        <div
                          v-if="message.text"
                          class="image-caption mt-2"
                  >
                    {{ message.text }}
                        </div>
                  </div>
                  
                      <!-- File message -->
                      <div
                        v-else-if="message.type === 'file'"
                        class="file-message cursor-pointer"
                        @click="downloadFile(message)"
                      >
                        <div class="d-flex align-center">
                          <v-icon
                            :color="getFileIconColor(message.fileName)"
                            class="mr-3"
                            size="32"
                          >
                            {{ getFileIcon(message.fileName) }}
                          </v-icon>
                          <div class="flex-grow-1">
                            <div class="text-body-2 font-weight-medium">
                              {{ message.fileName }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                              {{ message.fileSize }}
                            </div>
                          </div>
                      <v-btn
                            icon="mdi-download"
                        variant="text"
                            size="small"
                            color="primary"
                            @click.stop="downloadFile(message)"
                          />
                    </div>
                  </div>
                  
                      <!-- Regular text message -->
                      <div
                        v-else
                        class="text-message"
                      >
                        {{ message.text }}
                    </div>
                    </div>
                    
                    <!-- Message footer -->
                    <div class="message-footer">
                      <div class="d-flex align-center justify-end">
                        <span class="message-time">
                          {{ formatMessageTime(message.timestamp) }}
                        </span>
                        <div
                          v-if="message.senderId === currentUserId"
                          class="message-status ml-1"
                        >
                          <v-icon
                            :icon="getMessageStatusIcon(message)"
                            :color="getMessageStatusColor(message)"
                            size="16"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
              <!-- Typing Indicator -->
              <div
              v-if="selectedChat?.contact.isTyping"
              class="typing-indicator-container"
            >
              <div class="typing-bubble">
                <div class="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              </div>
              
            <!-- WhatsApp Input Area -->
            <div class="whatsapp-input">
              <div class="d-flex align-center pa-2">
                <!-- SIMPLE UPLOAD BUTTON -->
                <input
                  id="uploadBtn"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleFileUpload"
                />
                <label for="uploadBtn" style="background: #25d366; color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; margin-right: 8px;">
                  📎 Upload
                </label>
                
                <!-- Message Input -->
                <v-text-field 
                  id="messageInput"
                  v-model="newMessage" 
                  label="Type a message"
                  placeholder="Type a message"
                  variant="outlined"
                  density="compact"
                  hide-details
                  bg-color="white"
                  rounded
                  class="flex-grow-1 mx-2"
                  @keyup.enter="sendMessage"
                  @input="handleTyping"
                />
                


                <!-- Voice/Send button -->
                <v-btn
                  v-if="newMessage.trim()"
                  icon="mdi-send"
                  color="green"
                  size="small"
                  @click="sendMessage"
                />
                <v-btn
                  v-else
                  icon="mdi-microphone"
                  variant="text"
                  size="small"
                  @click="recordVoice"
                />
            </div>
                </div>
              </div>
            </div>
          </div>
          
        <!-- New Chat Dialog -->
      <v-dialog
        v-model="showNewChatDialog"
        max-width="500"
      >
        <v-card>
          <v-card-title>Start New Chat</v-card-title>
          <v-card-text>
            <!-- Invite by Email or Phone -->
            <div class="mb-4">
              <h4 class="text-subtitle-1 mb-2">Invite New Team Member</h4>
              <p class="text-body-2 text-medium-emphasis mb-3">
                Send an invitation via email or phone to add someone to your team chat
              </p>
              
              <v-text-field
                v-model="newMemberName"
                label="Full Name*"
                placeholder="Enter full name"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                density="compact"
                class="mb-2"
                required
              />
              <v-text-field
                v-model="newMemberEmail"
                label="Email Address*"
                placeholder="Enter email address"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                density="compact"
                class="mb-2"
                type="email"
                required
              />
              <v-text-field
                v-model="newMemberPhone"
                label="Phone Number (optional)"
                placeholder="Enter phone number"
                prepend-inner-icon="mdi-phone"
                variant="outlined"
                density="compact"
                class="mb-3"
              />
              <v-btn
                color="green"
                @click="inviteNewMember"
                :disabled="!newMemberEmail.trim() || !newMemberName.trim() || sendingInvitation"
                :loading="sendingInvitation"
                block
                size="large"
              >
                <v-icon left>mdi-account-plus</v-icon>
                {{ sendingInvitation ? 'Sending...' : 'Send Invitation' }}
              </v-btn>
            </div>
            
            <v-divider class="mb-4" />
            
            <!-- Existing Team Members -->
            <div>
              <h4 class="text-subtitle-1 mb-2">Existing Team Members</h4>
              <v-text-field
                v-model="newChatSearch"
                label="Search team members"
                placeholder="Search team members"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                class="mb-3"
              />
              <v-list v-if="filteredAvailableContacts.length > 0">
                <v-list-item
                  v-for="contact in filteredAvailableContacts"
                  :key="contact.id"
                  @click="startNewChat(contact)"
                >
                  <template #prepend>
                    <v-avatar 
                      size="40"
                      :class="{ 'default-user-avatar': !contact.avatar }"
                    >
                      <v-img
                        v-if="contact.avatar"
                        :src="contact.avatar"
                      />
                      <div 
                        v-else 
                        class="default-user-icon"
                      >
                        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
                          <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                        </svg>
                      </div>
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ contact.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ contact.email }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <div v-else class="text-center text-medium-emphasis py-4">
                <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-account-group-outline</v-icon>
                <p>No team members yet. Invite someone to start chatting!</p>
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="showNewChatDialog = false"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Image Preview Dialog -->
      <v-dialog
        v-model="showImagePreview"
        max-width="80vw"
        max-height="80vh"
      >
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ previewImage.fileName || 'Image Preview' }}</span>
                <v-btn 
              icon="mdi-close"
                  variant="text" 
              @click="showImagePreview = false"
            />
          </v-card-title>
          <v-card-text class="pa-0">
            <v-img
              :src="previewImage.url"
              :alt="previewImage.fileName"
              max-height="70vh"
              contain
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              prepend-icon="mdi-download"
              @click="downloadImage"
            >
              Download
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- Upload Progress Snackbar -->
      <v-snackbar
        v-model="uploadProgress.show"
        :timeout="-1"
        color="primary"
        location="bottom"
      >
        <div class="d-flex align-center">
          <v-progress-circular
            v-if="uploadProgress.uploading"
            indeterminate
            size="20"
            class="mr-3"
          />
          <v-icon
            v-else
            class="mr-3"
          >
            mdi-check-circle
          </v-icon>
          {{ uploadProgress.message }}
        </div>
        <template #actions>
          <v-btn
            variant="text"
            @click="uploadProgress.show = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import notificationService from '@/services/notificationService.js';

export default {
  name: 'WhatsAppChat',
  data() {
    return {
      // Current user info
      currentUser: {
        id: 0,
        name: 'You',
        avatar: null, // Start with null, let template handle fallback to account icon
        status: 'online'
      },
      currentUserId: 0,
      
      // Chat state
      selectedChatId: null,
      searchQuery: '',
      newMessage: '',
      showNewChatDialog: false,
      newChatSearch: '',
      
      // Invite new member data
      newMemberEmail: '',
      newMemberPhone: '',
      newMemberName: '',
      sendingInvitation: false,
      
      // Editing
      editingMessageId: null,
      editedMessageText: '',
      
      // Typing simulation
      typingTimeout: null,
      
      // File upload
      showImagePreview: false,
      previewImage: {
        url: '',
        fileName: ''
      },
      uploadProgress: {
        show: false,
        uploading: false,
        message: ''
      },
      
      // File upload state
      uploadStatus: null, // null, 'uploading', 'success', 'error'
      previewImage: null,
      selectedFile: null,
      
      // Available contacts for new chats - starts empty, populated from real team data
      availableContacts: [],
      
      // Chats data (individual conversations) - starts empty, populated when users invite team members
      chats: []
    };
  },
  
  computed: {
    selectedChat() {
      return (this.chats || []).find(chat => chat.id === this.selectedChatId);
    },
    
    filteredChats() {
      if (!this.searchQuery) return this.chats || [];
      return (this.chats || []).filter(chat => 
        chat.contact && chat.contact.name && 
        chat.contact.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    
    filteredAvailableContacts() {
      if (!this.newChatSearch) return this.availableContacts || [];
      return (this.availableContacts || []).filter(contact => 
        contact.name.toLowerCase().includes(this.newChatSearch.toLowerCase()) ||
        (contact.email && contact.email.toLowerCase().includes(this.newChatSearch.toLowerCase()))
      );
    },
    
    groupedMessages() {
      if (!this.selectedChat || !this.selectedChat.messages) return {};
      
      const groups = {};
      (this.selectedChat.messages || []).forEach(message => {
        const dateKey = new Date(message.timestamp).toDateString();
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(message);
      });
      
      return groups;
    }
  },
  
  mounted() {
    // Load user data from localStorage
    this.loadUserData();
    
    // Listen for profile updates
    window.addEventListener('profileImageUpdated', this.handleProfileUpdate);
    window.addEventListener('userNameUpdated', this.handleProfileUpdate);
    
    // Listen for team data updates
    window.addEventListener('teamUpdated', this.handleTeamUpdate);
    
    // Initialize last messages for chats
    this.chats.forEach(chat => {
      if (chat.messages.length > 0) {
        chat.lastMessage = chat.messages[chat.messages.length - 1];
      }
    });
    
    // Simulate random online status changes
    setInterval(() => {
      this.availableContacts.forEach(contact => {
        if (Math.random() < 0.1) { // 10% chance to change status
          contact.isOnline = !contact.isOnline;
          if (!contact.isOnline) {
            contact.lastSeen = new Date();
          }
        }
      });
      
      this.chats.forEach(chat => {
        if (Math.random() < 0.1) {
          chat.contact.isOnline = !chat.contact.isOnline;
          if (!chat.contact.isOnline) {
            chat.contact.lastSeen = new Date();
          }
        }
      });
    }, 10000);
  },
  
  beforeDestroy() {
    // Remove event listeners
    window.removeEventListener('profileImageUpdated', this.handleProfileUpdate);
    window.removeEventListener('userNameUpdated', this.handleProfileUpdate);
    window.removeEventListener('teamUpdated', this.handleTeamUpdate);
  },
  
  methods: {
    // Load user data from localStorage
    loadUserData() {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedData = JSON.parse(userData);
        this.currentUser = {
          ...this.currentUser,
          name: parsedData.fullName || parsedData.name || 'You',
          avatar: parsedData.profileImage || null // Set to null if no image, let the template handle the fallback
        };
      } else {
        // Set to null if no user data, let the template handle the fallback
        this.currentUser.avatar = null;
      }
      
      // Load team members for contacts
      this.loadTeamMembers();
    },
    
    // Load team members from localStorage
    loadTeamMembers() {
      let teamData = localStorage.getItem('teamData');
      
      if (!teamData) {
        // Start with empty team data - no fake members
        const emptyTeam = [];
        localStorage.setItem('teamData', JSON.stringify(emptyTeam));
        teamData = JSON.stringify(emptyTeam);
      }
      
      const parsedTeam = JSON.parse(teamData);
      
      // Update available contacts with real team data only
      this.availableContacts = parsedTeam.map((member, index) => ({
        id: member.id || index + 1,
        name: member.name,
        role: member.role || 'Team Member',
        email: member.email,
        phone: member.phone,
        avatar: member.avatar || null,
        isOnline: member.isOnline || false,
        lastSeen: member.lastSeen || new Date()
      }));
      
      // Start with empty chats - no fake conversations
      this.chats = [];
    },
    
    // Handle profile updates (both image and name)
    handleProfileUpdate(event) {
      // Always reload user data for consistency
      this.loadUserData();
    },
    
    // Handle team data updates
    handleTeamUpdate(event) {
      console.log('🔄 Team data updated, refreshing chat contacts');
      this.loadTeamMembers();
    },
    
    selectChat(chatId) {
      this.selectedChatId = chatId;
      const chat = this.chats.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
      }
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
    filterChats() {
      // Method is computed automatically
    },
    
    sendMessage() {
      if (!this.newMessage.trim() || !this.selectedChatId) return;
      
      const chat = this.selectedChat;
      const newMsg = {
        id: this.getNextMessageId(),
        senderId: this.currentUserId,
        text: this.newMessage,
        timestamp: new Date(),
        type: 'text',
        status: 'sent'
      };
      
      chat.messages.push(newMsg);
      chat.lastMessage = newMsg;
      
      // Add notification for team chat message
      notificationService.addTeamChatNotification(this.currentUser.name, chat.name, this.newMessage);
      
      this.newMessage = '';
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
      
      // Simulate message status updates
      setTimeout(() => {
        newMsg.status = 'delivered';
      }, 1000);
      
      setTimeout(() => {
        if (Math.random() > 0.3) { // 70% chance of being read
          newMsg.status = 'read';
        }
      }, 3000);
      
      // Simulate response
      this.simulateResponse(chat);
    },
    
    simulateResponse(chat) {
      if (Math.random() < 0.6) { // 60% chance of response
        // Show typing indicator
        chat.contact.isTyping = true;
        
        setTimeout(() => {
          chat.contact.isTyping = false;
          
          const responses = [
            'Thanks for letting me know! 👍',
            'Got it! 😊',
            'Sounds good to me!',
            'Will check it out',
            'Perfect timing!',
            'Let me know if you need anything',
            'Great work! 🎉',
            'I agree completely',
            'Absolutely! 💯',
            'Will do right away'
          ];
          
          const response = {
            id: this.getNextMessageId(),
            senderId: chat.contact.id,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: 'text',
            status: 'read'
          };
          
          chat.messages.push(response);
          chat.lastMessage = response;
          
          if (this.selectedChatId !== chat.id) {
            chat.unreadCount++;
          }
          
      this.$nextTick(() => {
            if (this.selectedChatId === chat.id) {
        this.scrollToBottom();
            }
          });
        }, 1000 + Math.random() * 3000);
      }
    },
    
    handleTyping() {
      const chat = this.selectedChat;
      if (!chat) return;
      
      // Clear existing timeout
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }
      
      // Show that current user is typing (in real app this would be sent to other users)
      this.typingTimeout = setTimeout(() => {
        // Stop typing indicator
      }, 2000);
    },
    
    recordVoice() {
      // Simulate voice recording
      const chat = this.selectedChat;
      if (!chat) return;
      
      const voiceMsg = {
            id: this.getNextMessageId(),
        senderId: this.currentUserId,
        text: '',
            timestamp: new Date(),
        type: 'voice',
        status: 'sent'
      };
      
      chat.messages.push(voiceMsg);
      chat.lastMessage = voiceMsg;
      
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    
        // SIMPLE FILE UPLOAD
    handleFileUpload(event) {
      const file = event.target.files[0];
      console.log('🔥 FILE SELECTED:', file);
      
      if (!file) return;
      
      // Upload immediately
      this.uploadFile(file);
    },
    
    async uploadFile(file) {
      console.log('📤 UPLOADING:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://localhost:3002/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        console.log('✅ UPLOAD SUCCESS:', result);
        
        // Add to chat
        this.addFileToChat(file, result);
        
      } catch (error) {
        console.error('❌ UPLOAD FAILED:', error);
      }
    },
    
    addFileToChat(file, serverResponse) {
      if (!this.selectedChat) return;
      
      const message = {
        id: Date.now(),
        text: `📎 ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sent: true
      };
      
      this.selectedChat.messages.push(message);
      console.log('💬 FILE ADDED TO CHAT');
    },
    
    createImagePreview(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    async uploadFileToServer(file) {
      console.log(`📤 Uploading ${file.name} to server...`);
      this.uploadStatus = 'uploading';
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('http://localhost:3002/upload', {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        console.log('📥 Server response:', result);
        
        if (response.ok && result.success) {
          this.uploadStatus = 'success';
          
          // Create message based on file type (like WhatsApp)
          if (file.type.startsWith('image/')) {
            this.createImageMessage(file, result.filePath, result);
          } else {
            this.createDocumentMessage(file, result.filePath, result);
          }
          
          // Clear status after 2 seconds (like WhatsApp)
          setTimeout(() => {
            this.uploadStatus = null;
            this.clearPreview();
          }, 2000);
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        this.uploadStatus = 'error';
        this.showErrorMessage(error.message);
        
        // Clear error after 3 seconds
        setTimeout(() => {
          this.uploadStatus = null;
        }, 3000);
      }
    },
    
    clearPreview() {
      this.previewImage = null;
      this.selectedFile = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    showErrorMessage(message) {
      console.error('Upload error:', message);
      setTimeout(() => {
        this.uploadStatus = null;
      }, 3000);
    },
    
    triggerDocumentUpload() {
      console.log('📄 Triggering document upload... Button clicked!');
      console.log('🔍 Checking refs:', this.$refs);
      console.log('🔍 Document input ref:', this.$refs.documentInput);
      
      if (this.$refs.documentInput) {
        console.log('✅ Document input found, triggering click...');
        this.$refs.documentInput.click();
        console.log('✅ Document input clicked - file dialog should open now');
      } else {
        console.error('❌ Document input ref not found');
        console.log('🔍 Available refs:', Object.keys(this.$refs));
      }
    },
    

    
    handleImageUpload(event) {
      console.log('🖼️ Image upload handler called');
      console.log('📁 Event target:', event.target);
      console.log('📁 Files from event:', event.target.files);
      
      const files = event.target.files;
      console.log(`📊 Selected ${files ? files.length : 0} image file(s)`);
      
      if (!files || files.length === 0) {
        console.log('⚠️ No files selected');
        return;
      }
      
      this.showUploadProgress(`Uploading ${files.length} image(s)...`, true);
      
      Array.from(files).forEach((file, index) => {
        console.log(`🔄 Processing image file ${index + 1}/${files.length}:`, {
          name: file.name,
          type: file.type,
          size: file.size
        });
        this.processImageFile(file);
      });
      
      // Clear the input
      event.target.value = '';
      console.log('🧹 Cleared file input');
    },
    
    handleDocumentUpload(event) {
      console.log('📄 Document upload handler called');
      console.log('📁 Event target:', event.target);
      console.log('📁 Files from event:', event.target.files);
      
      const files = event.target.files;
      console.log(`📊 Selected ${files ? files.length : 0} document file(s)`);
      
      if (!files || files.length === 0) {
        console.log('⚠️ No files selected');
        return;
      }
      
      this.showUploadProgress(`Uploading ${files.length} document(s)...`, true);
      
      Array.from(files).forEach((file, index) => {
        console.log(`🔄 Processing document file ${index + 1}/${files.length}:`, {
          name: file.name,
          type: file.type,
          size: file.size
        });
        this.processDocumentFile(file);
      });
      
      // Clear the input
      event.target.value = '';
      console.log('🧹 Cleared file input');
    },
    
    async processImageFile(file) {
      console.log('Processing image file:', file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('Invalid image file type:', file.type);
        this.showUploadProgress(`Invalid image file type: ${file.type}`, false);
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.error('Image file too large:', file.size);
        this.showUploadProgress(`Image file too large: ${this.formatFileSize(file.size)} (max 10MB)`, false);
        return;
      }
      
      try {
        console.log('Uploading image file to server...');
        const uploadResult = await this.uploadFileToServer(file);
        
        if (uploadResult.success) {
          console.log('Image uploaded successfully:', uploadResult);
          this.createImageMessage(file, uploadResult.files[0].url, uploadResult.files[0]);
          this.showUploadProgress(`${file.name} uploaded successfully!`, false);
        } else {
          throw new Error(uploadResult.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Error uploading image file:', error);
        this.showUploadProgress(`Error uploading ${file.name}: ${error.message}`, false);
      }
    },
    
    async processDocumentFile(file) {
      console.log('Processing document file:', file.name, file.type, file.size);
      
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        console.error('Document file too large:', file.size);
        this.showUploadProgress(`Document file too large: ${this.formatFileSize(file.size)} (max 50MB)`, false);
        return;
      }
      
      try {
        console.log('Uploading document file to server...');
        const uploadResult = await this.uploadFileToServer(file);
        
        if (uploadResult.success) {
          console.log('Document uploaded successfully:', uploadResult);
          this.createDocumentMessage(file, uploadResult.files[0].url, uploadResult.files[0]);
          this.showUploadProgress(`${file.name} uploaded successfully!`, false);
        } else {
          throw new Error(uploadResult.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Error uploading document file:', error);
        this.showUploadProgress(`Error uploading ${file.name}: ${error.message}`, false);
      }
    },
    
    // Upload file to server
    async uploadFileToServer(file) {
      console.log('🌐 Starting file upload to server:', file.name);
      
      const formData = new FormData();
      formData.append('files', file);
      console.log('📦 FormData created, appended file with key "files"');
      
      console.log('🚀 Making POST request to: http://localhost:3002/api/upload');
      
      const response = await fetch('http://localhost:3002/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload successful:', result);
      return result;
    },
    
        createImageMessage(file, imageUrl, serverFileInfo) {
      console.log('💬 Creating image message for file:', file.name);
      console.log('🔍 Server file info:', serverFileInfo);
      
      const chat = this.selectedChat;
      console.log('💬 Selected chat:', chat ? chat.contact.name : 'none');
      
      if (!chat) {
        console.error('❌ No chat selected, cannot create image message');
        this.showUploadProgress('Please select a chat first', false);
        return;
      }
      
      const imageMsg = {
        id: this.getNextMessageId(),
        senderId: this.currentUserId,
        text: '',
        timestamp: new Date(),
        type: 'image',
        imageUrl: `http://localhost:3002${serverFileInfo ? serverFileInfo.url : imageUrl}`,
        fileName: serverFileInfo ? serverFileInfo.originalName : file.name,
        fileSize: this.formatFileSize(serverFileInfo ? serverFileInfo.size : file.size),
        fileData: `http://localhost:3002${serverFileInfo ? serverFileInfo.url : imageUrl}`, // Store for download
        status: 'sent'
      };
      
      console.log('📝 Created image message object:', imageMsg);
      console.log(`📊 Chat had ${chat.messages.length} messages before adding`);
      
      chat.messages.push(imageMsg);
      chat.lastMessage = imageMsg;
      
      console.log(`📊 Chat now has ${chat.messages.length} messages after adding`);
      console.log('✅ Image message added to chat successfully');
      
      this.$nextTick(() => {
        console.log('📜 Scrolling to bottom');
        this.scrollToBottom();
      });
      
      this.simulateMessageStatus(imageMsg);
      console.log('🎯 Image message creation completed');
    },
    
    createDocumentMessage(file, fileUrl, serverFileInfo) {
      console.log('📄 Creating document message for file:', file.name);
      console.log('🔍 Server file info:', serverFileInfo);
      
      const chat = this.selectedChat;
      console.log('💬 Selected chat:', chat ? chat.contact.name : 'none');
      
      if (!chat) {
        console.error('❌ No chat selected, cannot create document message');
        this.showUploadProgress('Please select a chat first', false);
        return;
      }
      
      const docMsg = {
        id: this.getNextMessageId(),
        senderId: this.currentUserId,
        text: '',
        timestamp: new Date(),
        type: 'file',
        fileName: serverFileInfo ? serverFileInfo.originalName : file.name,
        fileSize: this.formatFileSize(serverFileInfo ? serverFileInfo.size : file.size),
        fileData: `http://localhost:3002${serverFileInfo ? serverFileInfo.url : fileUrl}`, // Store for download
        status: 'sent'
      };
      
      console.log('📝 Created document message object:', docMsg);
      console.log(`📊 Chat had ${chat.messages.length} messages before adding`);
      
      chat.messages.push(docMsg);
      chat.lastMessage = docMsg;
      
      console.log(`📊 Chat now has ${chat.messages.length} messages after adding`);
      console.log('✅ Document message added to chat successfully');
      
      this.$nextTick(() => {
        console.log('📜 Scrolling to bottom');
        this.scrollToBottom();
      });
      
      this.simulateMessageStatus(docMsg);
      console.log('🎯 Document message creation completed');
    },
    
    simulateMessageStatus(message) {
      // Simulate message status updates
      setTimeout(() => {
        message.status = 'delivered';
      }, 1000);
      
      setTimeout(() => {
        if (Math.random() > 0.3) { // 70% chance of being read
          message.status = 'read';
        }
      }, 3000);
    },
    
    showUploadProgress(message, uploading) {
      this.uploadProgress.message = message;
      this.uploadProgress.uploading = uploading;
      this.uploadProgress.show = true;
      
      if (!uploading) {
        setTimeout(() => {
          this.uploadProgress.show = false;
        }, 3000);
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // File preview and download methods
    openImagePreview(imageUrl, fileName) {
      this.previewImage.url = imageUrl;
      this.previewImage.fileName = fileName;
      this.showImagePreview = true;
    },
    
    downloadImage() {
      if (this.previewImage.url && this.previewImage.fileName) {
        this.downloadFileFromUrl(this.previewImage.url, this.previewImage.fileName);
      }
    },
    
    downloadFile(message) {
      if (message.fileData) {
        this.downloadFileFromUrl(message.fileData, message.fileName);
      }
    },
    
    downloadFileFromUrl(dataUrl, fileName) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    
    // File icon helpers
    getFileIcon(fileName) {
      if (!fileName) return 'mdi-file-document';
      
      const extension = fileName.split('.').pop().toLowerCase();
      
      switch (extension) {
        case 'pdf':
          return 'mdi-file-pdf-box';
        case 'doc':
        case 'docx':
          return 'mdi-file-word-box';
        case 'xls':
        case 'xlsx':
          return 'mdi-file-excel-box';
        case 'ppt':
        case 'pptx':
          return 'mdi-file-powerpoint-box';
        case 'txt':
          return 'mdi-file-document-outline';
        case 'zip':
        case 'rar':
          return 'mdi-folder-zip';
        default:
          return 'mdi-file-document';
      }
    },
    
    getFileIconColor(fileName) {
      if (!fileName) return 'blue';
      
      const extension = fileName.split('.').pop().toLowerCase();
      
      switch (extension) {
        case 'pdf':
          return 'red';
        case 'doc':
        case 'docx':
          return 'blue';
        case 'xls':
        case 'xlsx':
          return 'green';
        case 'ppt':
        case 'pptx':
          return 'orange';
        case 'txt':
          return 'grey';
        case 'zip':
        case 'rar':
          return 'purple';
        default:
          return 'blue';
      }
    },
    
    startNewChat(contact) {
      // Check if chat already exists
      const existingChat = this.chats.find(chat => chat.contact.id === contact.id);
      
      if (existingChat) {
        this.selectChat(existingChat.id);
      } else {
        // Create new chat
        const newChat = {
          id: this.chats.length + 1,
          contact: {
            ...contact,
            isTyping: false
          },
          messages: [],
          unreadCount: 0,
          lastMessage: null
        };
        
        this.chats.unshift(newChat);
        this.selectChat(newChat.id);
      }
      
      this.showNewChatDialog = false;
    },
    
    getNextMessageId() {
      let maxId = 0;
      this.chats.forEach(chat => {
        chat.messages.forEach(msg => {
          if (msg.id > maxId) maxId = msg.id;
        });
      });
      return maxId + 1;
    },
    
    formatChatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        
        if (isYesterday) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      }
    },
    
    formatMessageTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    formatDateSeparator(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return 'Today';
      } else {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();
        
        if (isYesterday) {
          return 'Yesterday';
        } else {
          return date.toLocaleDateString([], { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      }
    },
    
    formatLastSeen(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    },
    
    getLastMessagePreview(message) {
      if (!message) return 'No messages yet';
      
      if (message.type === 'voice') return '🎵 Voice message';
      if (message.type === 'image') return '📷 Photo';
      if (message.type === 'file') return '📎 Document';
      
      return message.text.length > 40 ? message.text.substring(0, 40) + '...' : message.text;
    },
    
    getMessageStatusIcon(message) {
      if (!message || message.senderId !== this.currentUserId) return '';
      
      switch (message.status) {
        case 'sent': return 'mdi-check';
        case 'delivered': return 'mdi-check-all';
        case 'read': return 'mdi-check-all';
        default: return 'mdi-clock-outline';
      }
    },
    
    getMessageStatusColor(message) {
      if (!message || message.senderId !== this.currentUserId) return 'grey';
      
      switch (message.status) {
        case 'sent': return 'grey';
        case 'delivered': return 'grey';
        case 'read': return 'blue';
        default: return 'grey';
      }
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    
    handleScroll() {
      // Handle scroll events if needed
    },

    // Invite new team member via email or phone
    async inviteNewMember() {
      console.log('🚀 inviteNewMember called');
      console.log('📝 Form data:', {
        name: this.newMemberName,
        email: this.newMemberEmail,
        phone: this.newMemberPhone
      });

      // Set loading state
      this.sendingInvitation = true;
      
      // Validate input
      if (!this.newMemberName.trim()) {
        alert('Please enter a name for the team member');
        return;
      }

      if (!this.newMemberEmail.trim() && !this.newMemberPhone.trim()) {
        alert('Please provide either an email or phone number');
        return;
      }

      // Email validation if provided
      if (this.newMemberEmail.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.newMemberEmail.trim())) {
          alert('Please enter a valid email address');
          return;
        }
      }

      // Phone validation if provided (basic check)
      if (this.newMemberPhone.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(this.newMemberPhone.replace(/[\s\-\(\)]/g, ''))) {
          alert('Please enter a valid phone number');
          return;
        }
      }

      // Create new team member
      const newMember = {
        id: Date.now(), // Simple ID generation
        name: this.newMemberName.trim(),
        email: this.newMemberEmail.trim() || null,
        phone: this.newMemberPhone.trim() || null,
        role: 'Team Member',
        avatar: null,
        isOnline: false,
        lastSeen: new Date(),
        dateInvited: new Date()
      };

      // Save to team data
      const currentTeam = JSON.parse(localStorage.getItem('teamData') || '[]');
      currentTeam.push(newMember);
      localStorage.setItem('teamData', JSON.stringify(currentTeam));

      // Update local contacts
      this.availableContacts.push({
        ...newMember,
        role: newMember.role || 'Team Member'
      });

      // Create initial chat with welcome message
      const welcomeChat = {
        id: newMember.id,
        contact: newMember,
        messages: [
          {
            id: Date.now(),
            senderId: 0, // System/current user
            text: `Welcome to the team, ${newMember.name}! 👋`,
            timestamp: new Date(),
            type: 'text',
            status: 'sent'
          }
        ],
        unreadCount: 0,
        lastMessage: null
      };

      this.chats.push(welcomeChat);

      // Generate invitation link
      const invitationLink = `${window.location.origin}/dashboard?invite=${encodeURIComponent(newMember.name)}&team=freelancer-task`;

      // Send invitation email if email provided
      if (newMember.email) {
        this.sendInvitationEmail(newMember, invitationLink);
      }

      // Copy invitation link to clipboard
      this.copyInvitationLink(invitationLink, newMember);

      // Clear form and reset loading state
      this.newMemberName = '';
      this.newMemberEmail = '';
      this.newMemberPhone = '';
      this.sendingInvitation = false;
      this.showNewChatDialog = false;

      // Show success message with link
      if (newMember.email) {
        this.showSuccessDialog(
          `Invitation Sent! ✅`,
          `${newMember.name} has been invited to join your team!\n\n📧 Email sent to: ${newMember.email}\n🔗 Invitation link copied to clipboard\n\nThey can click the link in the email or you can share the clipboard link directly.`,
          invitationLink
        );
      } else {
        this.showSuccessDialog(
          `Team Member Added! ✅`,
          `${newMember.name} has been added to your team!\n\n🔗 Invitation link copied to clipboard\n\nShare this link with them via phone or any messaging app.`,
          invitationLink
        );
      }

      // Emit event for other components to update
      window.dispatchEvent(new CustomEvent('teamUpdated', { 
        detail: { 
          type: 'member_added', 
          member: newMember 
        } 
      }));

      console.log('✅ New team member invited:', newMember);
      console.log('🔗 Invitation link:', invitationLink);
    },

    // Open new chat dialog
    openNewChatDialog() {
      console.log('🔥 Opening new chat dialog');
      this.showNewChatDialog = true;
      this.newMemberName = '';
      this.newMemberEmail = '';
      this.newMemberPhone = '';
    },

    // Close new chat dialog
    closeNewChatDialog() {
      this.showNewChatDialog = false;
      this.newMemberName = '';
      this.newMemberEmail = '';
      this.newMemberPhone = '';
    },

    // Send invitation email
    async sendInvitationEmail(member, invitationLink) {
      try {
        const emailData = {
          to: member.email,
          subject: '🎉 You\'re invited to join our Team Chat!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
              <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #00796b; margin: 0;">Team Chat Invitation</h1>
                  <p style="color: #666; font-size: 16px;">You've been invited to collaborate!</p>
                </div>
                
                <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h2 style="color: #2e7d32; margin: 0 0 10px 0;">Hello ${member.name}! 👋</h2>
                  <p style="color: #333; line-height: 1.6; margin: 10px 0;">
                    You've been invited to join our team collaboration workspace. 
                    Click the button below to access the Team Chat and start collaborating with us!
                  </p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="${invitationLink}" 
                     style="background: #25d366; color: white; padding: 15px 30px; 
                            text-decoration: none; border-radius: 25px; font-weight: bold; 
                            display: inline-block; font-size: 16px;">
                    🚀 Join Team Chat
                  </a>
                </div>

                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    <strong>Direct link:</strong><br>
                    <a href="${invitationLink}" style="color: #00796b; word-break: break-all;">
                      ${invitationLink}
                    </a>
                  </p>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    This invitation was sent from our Team Chat application<br>
                    If you have any questions, please contact the team administrator.
                  </p>
                </div>
              </div>
            </div>
          `
        };

        console.log('📧 Sending invitation email to:', member.email);
        
        const response = await fetch('http://localhost:3002/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        });

        if (response.ok) {
          console.log('✅ Invitation email sent successfully');
        } else {
          console.warn('⚠️ Email service unavailable, but invitation link created');
        }
      } catch (error) {
        console.warn('⚠️ Could not send email:', error.message);
        console.log('📋 Invitation link available for manual sharing');
      }
    },

    // Copy invitation link to clipboard
    async copyInvitationLink(link, member) {
      try {
        await navigator.clipboard.writeText(link);
        console.log('📋 Invitation link copied to clipboard');
      } catch (error) {
        console.warn('Could not copy to clipboard:', error);
        // Fallback: show the link in a prompt
        prompt('Copy this invitation link to share:', link);
      }
    },

    // Show success dialog with invitation details
    showSuccessDialog(title, message, link) {
      const fullMessage = `${message}\n\n📋 Link: ${link}`;
      alert(fullMessage);
      
      // Also log for debugging
      console.log('🎉 ' + title);
      console.log('📝 ' + message);
      console.log('🔗 ' + link);
    }
  }
};
</script>

<style scoped>
/* WhatsApp-like Layout */
.whatsapp-container {
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

.whatsapp-layout {
  display: flex;
  height: 100%;
}

/* Left Sidebar */
.chat-sidebar {
  width: 400px;
  border-right: 1px solid #e0e0e0;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  background: #00796b;
  color: white;
  padding: 16px;
}

.search-bar {
  padding: 8px 12px;
  background: #f0f2f5;
}

.chat-list {
  flex-grow: 1;
  overflow-y: auto;
}

.chat-item {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background: #f5f5f5;
}

.chat-item.active {
  background: #e3f2fd;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
}

/* Right Chat Window */
.chat-window {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: #e5ddd5;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.no-chat-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: white;
}

.active-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  background: #00796b;
  color: white;
}

/* Messages */
.whatsapp-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  background: #e5ddd5;
}

.message-date-group {
  margin-bottom: 20px;
}

.date-separator {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.date-chip {
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.message-wrapper {
  margin-bottom: 8px;
  display: flex;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-bubble {
  max-width: 400px;
  padding: 8px 12px;
  border-radius: 8px;
  position: relative;
  word-wrap: break-word;
}

.message-sent .message-bubble {
  background: #dcf8c6;
  border-bottom-right-radius: 2px;
}

.message-received .message-bubble {
  background: white;
  border-bottom-left-radius: 2px;
}

.message-footer {
  margin-top: 4px;
}

.message-time {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
}

.message-status {
  margin-left: 4px;
}

/* Voice Message */
.voice-message {
  display: flex;
  align-items: center;
  min-width: 200px;
}

.voice-waveform {
  flex-grow: 1;
  margin: 0 8px;
}

.waveform-bars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.waveform-bar {
  width: 3px;
  background: #4caf50;
  border-radius: 2px;
  transition: height 0.3s;
}

.voice-duration {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

/* File Message */
.file-message {
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  transition: background-color 0.2s;
  min-width: 250px;
}

.file-message:hover {
  background: rgba(255, 255, 255, 1);
}

.cursor-pointer {
  cursor: pointer;
}

/* Image Message */
.image-message .image-caption {
  margin-top: 8px;
  font-size: 14px;
}

/* Typing Indicator */
.typing-indicator-container {
  padding: 8px 20px;
}

.typing-bubble {
  background: white;
  border-radius: 18px;
  padding: 8px 16px;
  display: inline-block;
  border-bottom-left-radius: 4px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #999;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Input Area */
.whatsapp-input {
  background: white;
  border-top: 1px solid #e0e0e0;
}

/* Scrollbar */
.chat-list::-webkit-scrollbar,
.whatsapp-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-list::-webkit-scrollbar-track,
.whatsapp-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-list::-webkit-scrollbar-thumb,
.whatsapp-messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-list::-webkit-scrollbar-thumb:hover,
.whatsapp-messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* WhatsApp-Style Attachment Button */
.whatsapp-attachment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #25d366;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;
  box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);
}

.whatsapp-attachment-btn:hover {
  background: #128c7e;
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(37, 211, 102, 0.4);
}

.whatsapp-attachment-btn:active {
  transform: scale(0.95);
}

.attachment-icon {
  color: white !important;
  font-size: 20px !important;
  transform: rotate(-45deg);
}

/* WhatsApp-Style Upload Status */
.whatsapp-upload-status {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.status-icon {
  font-size: 18px !important;
}

.status-icon.spinning {
  animation: spin 1s linear infinite;
  color: #25d366 !important;
}

.whatsapp-upload-status.success .status-icon {
  color: #25d366 !important;
}

.whatsapp-upload-status.error .status-icon {
  color: #e74c3c !important;
}

/* WhatsApp-Style Image Preview */
.whatsapp-image-preview {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  border: 2px solid #25d366;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
}

.whatsapp-image-preview .preview-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
}

.whatsapp-image-preview .preview-close {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.6) !important;
  color: white !important;
}

.upload-icon {
  font-size: 16px;
}

.upload-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.upload-status {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 10;
}

.upload-status.uploading {
  background: #3498db;
  color: white;
}

.upload-status.success {
  background: #27ae60;
  color: white;
}

.upload-status.error {
  background: #e74c3c;
  color: white;
}

.image-preview {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 10;
}

.preview-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  display: block;
}

.preview-close {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0,0,0,0.5) !important;
  color: white !important;
}

/* Responsive */
@media (max-width: 768px) {
  .whatsapp-layout {
    flex-direction: column;
  }
  
  .chat-sidebar {
    width: 100%;
    height: 200px;
  }
  
  .message-bubble {
    max-width: 300px;
  }
  
  .upload-button {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .preview-img {
    width: 80px;
    height: 80px;
  }
}

/* Default User Avatar Styles */
.default-user-avatar {
  background: #f5f5f5 !important;
  border: 2px solid #e0e0e0;
}

.default-user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #9e9e9e;
}

.default-user-icon svg {
  width: 60%;
  height: 60%;
}
</style>