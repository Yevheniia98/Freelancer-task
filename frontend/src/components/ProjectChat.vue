<template>
  <div class="project-chat">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="section-title">
        <v-icon class="section-icon" color="primary">
          mdi-chat
        </v-icon>
        <h2 class="section-heading">
          Project Chat
        </h2>
        <v-chip
          v-if="messages.length > 0"
          size="small"
          color="primary"
          variant="flat"
          class="ml-2"
        >
          {{ messages.length }}
        </v-chip>
      </div>
    </div>

    <!-- Chat Messages Container -->
    <div ref="chatContainer" class="chat-messages">
      <!-- Empty State -->
      <div v-if="messages.length === 0 && !loading" class="empty-chat">
        <v-icon size="64" color="grey-lighten-1">
          mdi-message-outline
        </v-icon>
        <h3 class="empty-state-title">No messages yet</h3>
        <p class="empty-state-text">
          Start the conversation by sending a message below
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <v-progress-circular
          indeterminate
          color="primary"
          size="40"
        />
      </div>

      <!-- Messages -->
      <div
        v-for="message in messages"
        :key="message._id"
        :class="['message', { 'message-own': isOwnMessage(message) }]"
      >
        <div class="message-bubble">
          <div class="message-header">
            <span class="message-author">{{ message.userName }}</span>
            <span class="message-time">{{ formatTime(message.createdAt) }}</span>
          </div>
          <div class="message-content">
            {{ message.message }}
          </div>
          <!-- File Attachment -->
          <div v-if="message.fileUrl" class="message-file">
            <v-chip
              :prepend-icon="getFileIcon(message.fileType)"
              color="primary"
              variant="tonal"
              size="small"
              :href="`http://localhost:3002${message.fileUrl}`"
              target="_blank"
              class="file-chip"
            >
              {{ message.fileName }}
              <span v-if="message.fileSize" class="file-size">
                ({{ formatFileSize(message.fileSize) }})
              </span>
            </v-chip>
          </div>
          <!-- Delete button for own messages -->
          <v-btn
            v-if="isOwnMessage(message)"
            icon="mdi-delete"
            size="x-small"
            variant="text"
            color="error"
            class="message-delete"
            @click="deleteMessage(message._id)"
          />
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="typingUsers.length > 0" class="typing-indicator">
        <span class="typing-text">{{ typingUsers.join(', ') }} {{ typingUsers.length === 1 ? 'is' : 'are' }} typing...</span>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input-container">
      <!-- File Preview -->
      <div v-if="selectedFile" class="file-preview">
        <v-chip
          :prepend-icon="getFileIcon(selectedFile.type)"
          color="primary"
          variant="tonal"
          closable
          @click:close="selectedFile = null"
        >
          {{ selectedFile.name }}
          <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
        </v-chip>
      </div>

      <!-- Error Alert -->
      <v-alert
        v-if="error"
        type="error"
        closable
        density="compact"
        class="mb-2"
        @click:close="error = null"
      >
        {{ error }}
      </v-alert>

      <!-- Input Form -->
      <div class="chat-input">
        <v-file-input
          ref="fileInput"
          v-model="fileInputModel"
          style="display: none"
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
          @change="handleFileSelect"
        />
        
        <v-btn
          icon="mdi-paperclip"
          variant="text"
          size="small"
          color="primary"
          @click="openFileDialog"
        />
        
        <v-textarea
          v-model="newMessage"
          placeholder="Type a message..."
          rows="2"
          auto-grow
          variant="outlined"
          density="compact"
          hide-details
          class="message-input"
          @input="handleTyping"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact="newMessage += '\n'"
        />
        
        <v-btn
          icon="mdi-send"
          color="primary"
          :disabled="!canSend"
          :loading="sending"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
});

// State
const messages = ref([]);
const newMessage = ref('');
const selectedFile = ref(null);
const fileInputModel = ref(null);
const loading = ref(false);
const sending = ref(false);
const error = ref(null);
const chatContainer = ref(null);
const fileInput = ref(null);
const socket = ref(null);
const typingUsers = ref([]);

// Current user info
const currentUser = ref(null);

// Computed
const canSend = computed(() => {
  return (newMessage.value.trim() || selectedFile.value) && !sending.value;
});

// Methods
const loadMessages = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const token = localStorage.getItem('auth_token');
    // eslint-disable-next-line no-unused-vars
    const response = await axios.get(
      `http://localhost:3002/api/projects/${props.projectId}/chat/messages`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    messages.value = response.data.data || [];
    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error('Error loading messages:', err);
    error.value = err.response?.data?.message || 'Failed to load messages';
  } finally {
    loading.value = false;
  }
};

const sendMessage = async () => {
  if (!canSend.value) return;
  
  sending.value = true;
  error.value = null;
  
  try {
    const token = localStorage.getItem('auth_token');
    const formData = new FormData();
    
    if (newMessage.value.trim()) {
      formData.append('message', newMessage.value.trim());
    }
    
    if (selectedFile.value) {
      formData.append('file', selectedFile.value);
    }
    
    await axios.post(
      `http://localhost:3002/api/projects/${props.projectId}/chat/messages`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    // Message will be received via Socket.IO, no need to add manually
    
    // Clear inputs
    newMessage.value = '';
    selectedFile.value = null;
    fileInputModel.value = null;
    
    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error('Error sending message:', err);
    error.value = err.response?.data?.message || 'Failed to send message';
  } finally {
    sending.value = false;
  }
};

const deleteMessage = async (messageId) => {
  if (!confirm('Are you sure you want to delete this message?')) return;
  
  try {
    const token = localStorage.getItem('auth_token');
    await axios.delete(
      `http://localhost:3002/api/projects/${props.projectId}/chat/messages/${messageId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    // Remove message from list
    messages.value = messages.value.filter(m => m._id !== messageId);
  } catch (err) {
    console.error('Error deleting message:', err);
    error.value = err.response?.data?.message || 'Failed to delete message';
  }
};

const openFileDialog = () => {
  fileInput.value.$el.querySelector('input[type="file"]').click();
};

const handleFileSelect = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    const file = files[0];
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'File size must be less than 10MB';
      fileInputModel.value = null;
      return;
    }
    
    selectedFile.value = file;
  }
};

const isOwnMessage = (message) => {
  return message.userId === currentUser.value?._id;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // More than 24 hours
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (fileType) => {
  if (!fileType) return 'mdi-file';
  if (fileType.startsWith('image/')) return 'mdi-image';
  if (fileType.startsWith('video/')) return 'mdi-video';
  if (fileType.includes('pdf')) return 'mdi-file-pdf-box';
  if (fileType.includes('word') || fileType.includes('document')) return 'mdi-file-word';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'mdi-file-excel';
  if (fileType.includes('zip') || fileType.includes('rar')) return 'mdi-folder-zip';
  return 'mdi-file';
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const loadCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      currentUser.value = JSON.parse(userStr);
    }
  } catch (err) {
    console.error('Error loading current user:', err);
  }
};

// Initialize Socket.IO connection
const initSocket = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return;

  socket.value = io('http://localhost:3002', {
    auth: { token },
    transports: ['websocket', 'polling']
  });

  // Join the project room
  socket.value.emit('join:project', props.projectId);

  // Listen for new messages
  socket.value.on('message:new', (message) => {
    // Add message if not already in list
    if (!messages.value.find(m => m._id === message._id)) {
      messages.value.push(message);
      nextTick(() => scrollToBottom());
    }
  });

  // Listen for typing indicators
  // eslint-disable-next-line no-unused-vars
  socket.value.on('user:typing', ({ userId, userName }) => {
    if (userId !== currentUser.value?._id && !typingUsers.value.includes(userName)) {
      typingUsers.value.push(userName);
    }
  });

  socket.value.on('user:stopped-typing', () => {
    typingUsers.value = []; // Clear all typing indicators
  });

  // Handle connection errors
  socket.value.on('connect_error', (err) => {
    console.error('Socket connection error:', err);
  });
};

// Handle typing indicator
let typingTimeout = null;
const handleTyping = () => {
  if (!socket.value) return;
  
  socket.value.emit('typing:start', { projectId: props.projectId });
  
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.value.emit('typing:stop', { projectId: props.projectId });
  }, 1000);
};

// Auto-refresh messages every 5 seconds (backup for socket)
let refreshInterval = null;

onMounted(() => {
  loadCurrentUser();
  loadMessages();
  initSocket();
  
  // Fallback polling in case Socket.IO fails
  refreshInterval = setInterval(() => {
    if (!socket.value || !socket.value.connected) {
      loadMessages();
    }
  }, 10000);
});

// Clean up on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  if (socket.value) {
    socket.value.disconnect();
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
});

// Clean up interval on unmount
watch(() => props.projectId, () => {
  if (socket.value) {
    socket.value.emit('leave:project', props.projectId);
    socket.value.emit('join:project', props.projectId);
  }
  loadMessages();
});
</script>

<style scoped>
.project-chat {
  display: flex;
  flex-direction: column;
  height: 600px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chat-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 28px !important;
}

.section-heading {
  font-size: 20px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f5f5f5;
}

.empty-chat,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
  padding: 40px;
}

.empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: #666;
  margin-top: 16px;
  margin-bottom: 8px;
}

.empty-state-text {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.message {
  display: flex;
  justify-content: flex-start;
  animation: slideIn 0.2s ease-out;
}

.message-own {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.message-own .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.message-author {
  font-weight: 600;
  font-size: 13px;
  color: #667eea;
}

.message-own .message-author {
  color: rgba(255, 255, 255, 0.9);
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-own .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.message-content {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-file {
  margin-top: 8px;
}

.file-chip {
  cursor: pointer;
}

.file-size {
  font-size: 11px;
  margin-left: 4px;
  opacity: 0.8;
}

.message-delete {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-bubble:hover .message-delete {
  opacity: 1;
}

.chat-input-container {
  padding: 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.typing-indicator {
  padding: 8px 12px;
  font-size: 12px;
  color: #666;
  font-style: italic;
  background: #f0f0f0;
  border-radius: 8px;
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease-in;
}

.typing-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.file-preview {
  margin-bottom: 12px;
}

.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.message-input {
  flex: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar Styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
