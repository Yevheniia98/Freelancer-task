<template>
  <v-app>
    <LeftMenu />
      
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <div class="d-flex justify-space-between align-center mb-6 flex-wrap">
          <h1 class="text-h4 text-h5-sm font-weight-bold">
            My Team
          </h1>
          <div class="d-flex align-center mt-2 mt-sm-0">
            <v-btn 
              color="teal" 
              class="text-white" 
              elevation="0" 
              @click="openNewChatDialog()"
            >
              Create new chat
            </v-btn>
          </div>
        </div>
  
        <v-row>
          <!-- Left sidebar - Chats and Contacts -->
          <v-col
            cols="12"
            md="4"
            lg="3"
          >
            <v-card
              class="sidebar-card"
              elevation="1"
              rounded="lg"
            >
              <div class="card-header">
                <div class="d-flex justify-space-between align-center px-4 py-3">
                  <h2 class="text-h6">
                    Chats
                  </h2>
                </div>
                
                <v-text-field
                  placeholder="Search here ..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  density="compact"
                  class="mx-4 mb-3"
                />

                <!-- Custom tabs that look like in your image -->
                <div class="custom-tabs d-flex px-4">
                  <div 
                    class="custom-tab py-2 px-3" 
                    :class="{ active: activeTab === 'chats' }"
                    @click="activeTab = 'chats'"
                  >
                    Chats
                  </div>
                  <div 
                    class="custom-tab py-2 px-3" 
                    :class="{ active: activeTab === 'contacts' }"
                    @click="activeTab = 'contacts'"
                  >
                    Contacts
                  </div>
                </div>
                <v-divider />
              </div>    
              
              <v-card-text class="pa-0">
                <v-window v-model="activeTab">
                  <!-- Chats Tab -->
                  <v-window-item value="chats">
                    <v-list
                      lines="two"
                      class="py-0"
                    >
                      <v-list-item
                        v-for="chat in chats"
                        :key="chat.id"
                        :active="selectedChat && chat.id === selectedChat.id"
                        class="chat-item"
                        @click="selectChat(chat)"
                      >
                        <template #prepend>
                          <v-avatar
                            color="teal"
                            size="40"
                          >
                            <span class="text-caption text-white">{{ getChatInitials(chat) }}</span>
                          </v-avatar>
                        </template>
                          
                        <v-list-item-title class="font-weight-medium">
                          {{ chat.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                          {{ chat.lastMessage || 'No messages yet' }}
                        </v-list-item-subtitle>
                          
                        <template #append>
                          <div class="text-caption text-grey d-none d-sm-block">
                            {{ formatTime(chat.lastMessageTime) }}
                          </div>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-window-item>
  
                  <!-- Contacts Tab -->
                  <v-window-item value="contacts">
                    <v-list
                      lines="two"
                      class="py-0"
                    >
                      <v-list-item
                        v-for="contact in teamMembers"
                        :key="contact.id"
                        :active="selectedMember && contact.id === selectedMember.id"
                        class="contact-item"
                        @click="selectTeamMember(contact)"
                      >
                        <template #prepend>
                          <v-avatar
                            :image="contact.avatar"
                            size="40"
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
                      </v-list-item>
                    </v-list>
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-card>
          </v-col>
  
          <!-- Main content area -->
          <v-col
            cols="12"
            md="8"
            lg="9"
          >
            <!-- Chat Area -->
            <v-card
              v-if="activeTab === 'chats' && selectedChat"
              class="chat-card"
              elevation="1"
              rounded="lg"
            >
              <v-card-title class="chat-header d-flex align-center">
                <v-avatar
                  color="teal"
                  size="40"
                  class="mr-3"
                >
                  <span class="text-caption text-white">{{ getChatInitials(selectedChat) }}</span>
                </v-avatar>
                <span class="text-truncate">{{ selectedChat.name }}</span>
                <v-spacer />
                <v-btn
                  icon
                  variant="text"
                  @click="openChatSettingsDialog(selectedChat)"
                >
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </v-card-title>
  
              <v-divider />
  
              <div
                ref="messagesContainer"
                class="chat-messages"
              >
                <div
                  v-for="(message, index) in selectedChatMessages"
                  :key="index" 
                  :class="['message-wrapper', message.senderId === currentUserId ? 'message-sent' : 'message-received']"
                >
                  <div class="message-bubble">
                    <div
                      v-if="message.senderId !== currentUserId"
                      class="message-sender text-caption text-primary font-weight-medium mb-1"
                    >
                      {{ getSenderName(message.senderId) }}
                    </div>
                    <div class="message-text">
                      {{ message.text }}
                    </div>
                    <div class="message-time text-caption text-right">
                      {{ formatTime(message.timestamp) }}
                    </div>
                  </div>
                </div>
              </div>
  
              <v-divider />
  
              <v-card-actions class="chat-input">
                <v-text-field 
                  v-model="newMessage" 
                  hide-details 
                  placeholder="Type a message" 
                  variant="outlined"
                  density="comfortable"
                  append-inner-icon="mdi-send"
                  @click:append-inner="sendMessage"
                  @keyup.enter="sendMessage"
                />
              </v-card-actions>
            </v-card>
  
            <!-- No Chat Selected State -->
            <v-card
              v-else-if="activeTab === 'chats' && !selectedChat"
              class="d-flex flex-column align-center justify-center empty-state"
              elevation="1"
              rounded="lg"
            >
              <v-icon
                size="64"
                color="grey-lighten-1"
                class="mb-4"
              >
                mdi-chat-outline
              </v-icon>
              <div class="text-h6 mb-2 text-center">
                No chat selected
              </div>
              <div class="text-body-2 text-center mb-4 px-3">
                Select a chat from the sidebar or create a new one
              </div>
              <v-btn
                color="teal"
                class="text-white"
                @click="openNewChatDialog"
              >
                Create New Chat
              </v-btn>
            </v-card>
  
            <!-- Team Member Details -->
            <v-card
              v-if="activeTab === 'contacts' && selectedMember"
              class="member-details"
              elevation="1"
              rounded="lg"
            >
              <v-card-title class="member-header">
                <v-avatar
                  :image="selectedMember.avatar"
                  size="64"
                  class="mr-md-3 mb-3 mb-md-0"
                >
                  <v-icon
                    v-if="!selectedMember.avatar"
                    size="40"
                  >
                    mdi-account
                  </v-icon>
                </v-avatar>
                <div class="flex-grow-1 text-center text-md-left">
                  <div class="text-h5">
                    {{ selectedMember.name }}
                  </div>
                  <div class="text-subtitle-1 text-medium-emphasis">
                    {{ selectedMember.role }}
                  </div>
                </div>
                <v-spacer class="d-none d-md-block" />
                <v-btn
                  color="teal"
                  class="text-white flex-grow-1 flex-md-grow-0 mt-3 mt-md-0"
                  @click="startPrivateChat(selectedMember)"
                >
                  Message
                </v-btn>
              </v-card-title>
  
              <v-divider />
  
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      Contact Information
                    </div>
                    <v-list
                      lines="two"
                      density="compact"
                    >
                      <v-list-item prepend-icon="mdi-email">
                        <v-list-item-title>Email</v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                          {{ selectedMember.email }}
                        </v-list-item-subtitle>
                      </v-list-item>
  
                      <v-list-item prepend-icon="mdi-phone">
                        <v-list-item-title>Phone</v-list-item-title>
                        <v-list-item-subtitle>{{ selectedMember.phone }}</v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-col>
  
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <div class="text-subtitle-1 font-weight-bold mb-2">
                      Payment Information
                    </div>
                    <v-list
                      lines="two"
                      density="compact"
                    >
                      <v-list-item prepend-icon="mdi-cash">
                        <v-list-item-title>Monthly Pay</v-list-item-title>
                        <v-list-item-subtitle>${{ selectedMember.payment }}/month</v-list-item-subtitle>
                        <template #append>
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            @click="openEditPaymentDialog(selectedMember)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
  
                      <v-list-item prepend-icon="mdi-briefcase">
                        <v-list-item-title>Current Project</v-list-item-title>
                        <v-list-item-subtitle class="text-truncate">
                          {{ selectedMember.currentProject }}
                        </v-list-item-subtitle>
                        <template #append>
                          <v-btn
                            icon
                            variant="text"
                            size="small"
                            @click="openEditProjectDialog(selectedMember)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
  
                <v-divider class="my-4" />
  
                <div class="text-subtitle-1 font-weight-bold mb-2">
                  Skills
                </div>
                <div class="skills-container">
                  <v-chip
                    v-for="(skill, index) in selectedMember.skills"
                    :key="index"
                    class="mr-2 mb-2"
                    color="teal-lighten-5"
                    text-color="teal-darken-1"
                  >
                    {{ skill }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
  
            <!-- No Member Selected State -->
            <v-card
              v-else-if="activeTab === 'contacts' && !selectedMember"
              class="d-flex flex-column align-center justify-center empty-state"
              elevation="1"
              rounded="lg" 
            >
              <v-icon
                size="64"
                color="grey-lighten-1"
                class="mb-4"
              >
                mdi-account-group-outline
              </v-icon>
              <div class="text-h6 mb-2 text-center">
                No team member selected
              </div>
              <div class="text-body-2 text-center mb-4 px-3">
                Select a team member from the sidebar to view details
              </div>
              <v-btn
                color="teal"
                class="text-white"
                @click="openAddMemberDialog"
              >
                Add New Member
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  
    <!-- New Chat Dialog -->
    <v-dialog
      v-model="newChatDialog"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          Create New Chat
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <v-form
            ref="chatForm"
            v-model="isFormValid"
          >
            <v-text-field
              v-model="newChatName"
              label="Chat Name"
              required
              :rules="[v => !!v || 'Chat name is required']"
            />
  
            <div class="text-subtitle-1 font-weight-bold mb-2">
              Select Members
            </div>
            <v-list class="member-selection">
              <v-list-item
                v-for="member in teamMembers"
                :key="member.id"
                @click="toggleMemberSelection(member)"
              >
                <template #prepend>
                  <v-checkbox
                    v-model="selectedMembers"
                    :value="member.id"
                    hide-details
                    class="member-checkbox"
                  />
                </template>
                <v-list-item-title>{{ member.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ member.role }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            class="flex-grow-1 flex-sm-grow-0"
            @click="newChatDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal" 
            class="flex-grow-1 flex-sm-grow-0 text-white"
            :disabled="!isFormValid || selectedMembers.length === 0"
            @click="createNewChat"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Edit Payment Dialog -->
    <v-dialog
      v-model="editPaymentDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          Update Payment
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <v-form
            ref="paymentForm"
            v-model="isPaymentFormValid"
          >
            <v-text-field
              v-model="editedPayment"
              label="Monthly Payment ($)"
              type="number"
              required
              :rules="[
                v => !!v || 'Payment amount is required',
                v => v > 0 || 'Payment must be greater than 0'
              ]"
            />
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            class="flex-grow-1 flex-sm-grow-0"
            @click="editPaymentDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal"
            class="flex-grow-1 flex-sm-grow-0 text-white"
            :disabled="!isPaymentFormValid"
            @click="updatePayment"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Edit Project Dialog -->
    <v-dialog
      v-model="editProjectDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          Change Project
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <v-form
            ref="projectForm"
            v-model="isProjectFormValid"
          >
            <v-select
              v-model="editedProject"
              label="Select Project"
              :items="availableProjects"
              required
              :rules="[v => !!v || 'Project is required']"
            />
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            class="flex-grow-1 flex-sm-grow-0"
            @click="editProjectDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal"
            class="flex-grow-1 flex-sm-grow-0 text-white"
            :disabled="!isProjectFormValid"
            @click="updateProject"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
    <!-- Add Member Dialog -->
    <v-dialog
      v-model="addMemberDialog"
      max-width="600px"
      fullscreen-breakpoint="sm"
    >
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          Add New Team Member
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <v-form
            ref="memberForm"
            v-model="isMemberFormValid"
          >
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newMember.name"
                  label="Full Name"
                  required
                  :rules="[v => !!v || 'Name is required']"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newMember.role"
                  label="Role"
                  required
                  :rules="[v => !!v || 'Role is required']"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newMember.email"
                  label="Email"
                  required
                  :rules="[
                    v => !!v || 'Email is required',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
                  ]"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newMember.phone"
                  label="Phone"
                  required
                  :rules="[v => !!v || 'Phone is required']"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="newMember.payment"
                  label="Monthly Payment ($)"
                  type="number"
                  required
                  :rules="[
                    v => !!v || 'Payment is required',
                    v => v > 0 || 'Payment must be greater than 0'
                  ]"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="newMember.currentProject"
                  label="Current Project"
                  :items="availableProjects"
                  required
                  :rules="[v => !!v || 'Project is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-combobox
                  v-model="newMember.skills"
                  label="Skills"
                  multiple
                  chips
                  hint="Enter skills and press Enter"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn 
            color="grey-darken-1" 
            variant="text"
            class="flex-grow-1 flex-sm-grow-0"
            @click="addMemberDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="teal"
            class="flex-grow-1 flex-sm-grow-0 text-white"
            :disabled="!isMemberFormValid"
            @click="addTeamMember"
          >
            Add Member
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
  <script>
  import { defineComponent, ref, computed, nextTick, onMounted, watch } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
  
export default defineComponent({
  name: 'MyTeamPage',
  components: {
    LeftMenu
  },
  setup() {
    // Responsive handling
    const isMobile = ref(false);
    const isTablet = ref(false);
    
    // Update responsive state based on screen size
    const updateResponsiveState = () => {
      isMobile.value = window.innerWidth < 600;
      isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
    };
    
    // Menu items for navigation
    const menuItems = [
      { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
      { title: 'My Team', icon: 'mdi-account-group', to: '/team' },
      { title: 'Projects', icon: 'mdi-briefcase', to: '/projects' },
      { title: 'Tasks', icon: 'mdi-check-circle', to: '/tasks' },
      { title: 'Calendar', icon: 'mdi-calendar', to: '/calendar' },
      { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
    ];
    
    // Current user
    const currentUserId = 0; // Assuming 0 is the current user's ID
    
    // Tabs
    const activeTab = ref('chats');
    
    // Chats
    const chats = ref([
      {
        id: 1,
        name: 'Design Team',
        members: [0, 1, 3, 5],
        lastMessage: 'Let\'s discuss the new homepage layout',
        lastMessageTime: new Date(2025, 3, 15, 14, 30)
      },
      {
        id: 2,
        name: 'Development Team',
        members: [0, 2, 4, 6],
        lastMessage: 'The API integration is complete',
        lastMessageTime: new Date(2025, 3, 15, 11, 45)
      },
      {
        id: 3,
        name: 'Project Alpha',
        members: [0, 1, 2, 3, 4],
        lastMessage: 'Client meeting scheduled for tomorrow',
        lastMessageTime: new Date(2025, 3, 14, 16, 20)
      },
      {
        id: 4,
        name: 'Marketing Campaign',
        members: [0, 5, 6],
        lastMessage: 'Social media assets are ready for review',
        lastMessageTime: new Date(2025, 3, 13, 9, 15)
      }
    ]);
    
    const messages = ref([
      // Chat 1 messages
      {
        chatId: 1,
        senderId: 1,
        text: 'Hey team, I\'ve updated the mockups for the hero section',
        timestamp: new Date(2025, 3, 15, 10, 15)
      },
      {
        chatId: 1,
        senderId: 3,
        text: 'Looks great! I especially like the new color scheme',
        timestamp: new Date(2025, 3, 15, 10, 22)
      },
      {
        chatId: 1,
        senderId: 0,
        text: 'Thanks everyone. Let\'s discuss the new homepage layout',
        timestamp: new Date(2025, 3, 15, 14, 30)
      },
      
      // Chat 2 messages
      {
        chatId: 2,
        senderId: 2,
        text: 'Hey, I\'ve pushed the latest changes to the repo',
        timestamp: new Date(2025, 3, 15, 9, 10)
      },
      {
        chatId: 2,
        senderId: 4,
        text: 'Great! I\'ll pull and test it',
        timestamp: new Date(2025, 3, 15, 9, 45)
      },
      {
        chatId: 2,
        senderId: 0,
        text: 'The API integration is complete',
        timestamp: new Date(2025, 3, 15, 11, 45)
      },
      
      // Chat 3 messages
      {
        chatId: 3,
        senderId: 3,
        text: 'Has the client approved the final designs?',
        timestamp: new Date(2025, 3, 14, 14, 5)
      },
      {
        chatId: 3,
        senderId: 1,
        text: 'Yes, they loved it!',
        timestamp: new Date(2025, 3, 14, 15, 30)
      },
      {
        chatId: 3,
        senderId: 0,
        text: 'Client meeting scheduled for tomorrow',
        timestamp: new Date(2025, 3, 14, 16, 20)
      },
      
      // Chat 4 messages
      {
        chatId: 4,
        senderId: 5,
        text: 'I\'ve prepared all the assets for Facebook and Instagram',
        timestamp: new Date(2025, 3, 13, 8, 40)
      },
      {
        chatId: 4,
        senderId: 0,
        text: 'Social media assets are ready for review',
        timestamp: new Date(2025, 3, 13, 9, 15)
      }
    ]);
    
    // Team members
    const teamMembers = ref([
      {
        id: 1,
        name: 'Emily Johnson',
        role: 'UI/UX Designer',
        email: 'emily.j@example.com',
        phone: '+1 234 567 8901',
        payment: 3500,
        currentProject: 'Website Redesign',
        skills: ['UI Design', 'Wireframing', 'Figma', 'User Research'],
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: 2,
        name: 'Michael Chen',
        role: 'Frontend Developer',
        email: 'michael.c@example.com',
        phone: '+1 234 567 8902',
        payment: 4200,
        currentProject: 'E-commerce Platform',
        skills: ['Vue.js', 'React', 'CSS', 'JavaScript'],
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      {
        id: 3,
        name: 'Sophia Martinez',
        role: 'Product Manager',
        email: 'sophia.m@example.com',
        phone: '+1 234 567 8903',
        payment: 5000,
        currentProject: 'Website Redesign',
        skills: ['Product Strategy', 'Agile', 'User Stories', 'Roadmapping'],
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      {
        id: 4,
        name: 'James Wilson',
        role: 'Backend Developer',
        email: 'james.w@example.com',
        phone: '+1 234 567 8904',
        payment: 4800,
        currentProject: 'API Development',
        skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      {
        id: 5,
        name: 'Olivia Lee',
        role: 'Marketing Specialist',
        email: 'olivia.l@example.com',
        phone: '+1 234 567 8905',
        payment: 3800,
        currentProject: 'Product Launch',
        skills: ['Social Media', 'Content Creation', 'SEO', 'Analytics'],
        avatar: 'https://i.pravatar.cc/150?img=5'
      },
      {
        id: 6,
        name: 'William Brown',
        role: 'QA Engineer',
        email: 'william.b@example.com',
        phone: '+1 234 567 8906',
        payment: 3900,
        currentProject: 'E-commerce Platform',
        skills: ['Testing', 'Automation', 'Selenium', 'JIRA'],
        avatar: 'https://i.pravatar.cc/150?img=6'
      }
    ]);
    
    // Available projects
    const availableProjects = [
      'Website Redesign',
      'E-commerce Platform',
      'Mobile App Development',
      'API Development',
      'Product Launch',
      'CRM Integration'
    ];
    
    // Selected items
    const selectedChat = ref(null);
    const selectedMember = ref(null);
    const messagesContainer = ref(null);
    
    // Forms
    const isFormValid = ref(true);
    const chatForm = ref(null);
    const newChatName = ref('');
    const selectedMembers = ref([]);
    const newMessage = ref('');
    
    // Payment dialog
    const editPaymentDialog = ref(false);
    const isPaymentFormValid = ref(true);
    const paymentForm = ref(null);
    const editedPayment = ref(0);
    const memberToEditPayment = ref(null);
    
    // Project dialog
    const editProjectDialog = ref(false);
    const isProjectFormValid = ref(true);
    const projectForm = ref(null);
    const editedProject = ref('');
    const memberToEditProject = ref(null);
    
    // Add member dialog
    const addMemberDialog = ref(false);
    const isMemberFormValid = ref(true);
    const memberForm = ref(null);
    const newMember = ref({
      name: '',
      role: '',
      email: '',
      phone: '',
      payment: 0,
      currentProject: '',
      skills: []
    });
    
    // New chat dialog
    const newChatDialog = ref(false);
    
    // Computed
    const selectedChatMessages = computed(() => {
      if (!selectedChat.value) return [];
      return messages.value
        .filter(message => message.chatId === selectedChat.value.id)
        .sort((a, b) => a.timestamp - b.timestamp);
    });
    
    // Methods
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    };
    
    const getChatInitials = (chat) => {
      if (!chat || !chat.name) return '';
      return chat.name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    };
    
    const getSenderName = (senderId) => {
      if (senderId === currentUserId) return 'You';
      const sender = teamMembers.value.find(member => member.id === senderId);
      return sender ? sender.name : 'Unknown User';
    };
    
    const selectChat = (chat) => {
      selectedChat.value = chat;
      // On mobile or tablet, when selecting a chat, adjust the view if needed
      if (isMobile.value || isTablet.value) {
        activeTab.value = 'chats';
      }
      nextTick(() => {
        scrollToBottom();
      });
    };
    
    const selectTeamMember = (member) => {
      selectedMember.value = member;
      // On mobile or tablet, when selecting a member, adjust the view if needed
      if (isMobile.value || isTablet.value) {
        activeTab.value = 'contacts';
      }
    };

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };
    
    const sendMessage = () => {
      if (!newMessage.value.trim() || !selectedChat.value) return;
      
      const message = {
        chatId: selectedChat.value.id,
        senderId: currentUserId,
        text: newMessage.value,
        timestamp: new Date()
      };
      
      // Add message to the messages array
      messages.value.push(message);
      
      // Update last message in chat
      const chatIndex = chats.value.findIndex(c => c.id === selectedChat.value.id);
      if (chatIndex !== -1) {
        chats.value[chatIndex].lastMessage = newMessage.value;
        chats.value[chatIndex].lastMessageTime = new Date();
      }
      
      // Clear input
      newMessage.value = '';
      
      // Scroll to bottom
      nextTick(() => {
        scrollToBottom();
      });
    };
    
    const openNewChatDialog = () => {
      newChatName.value = '';
      selectedMembers.value = [currentUserId]; // Include current user by default
      newChatDialog.value = true;
    };
    
    const toggleMemberSelection = (member) => {
      const index = selectedMembers.value.indexOf(member.id);
      if (index === -1) {
        selectedMembers.value.push(member.id);
      } else {
        selectedMembers.value.splice(index, 1);
      }
    };
    
    const createNewChat = () => {
      if (!newChatName.value.trim() || selectedMembers.value.length === 0) {
        return;
      }
      
      // Create new chat
      const newChatId = Math.max(0, ...chats.value.map(c => c.id)) + 1;
      const newChat = {
        id: newChatId,
        name: newChatName.value,
        members: [...selectedMembers.value],
        lastMessage: '',
        lastMessageTime: new Date()
      };
      
      // Add new chat to chats array
      chats.value.push(newChat);
      
      // Select the new chat
      selectChat(newChat);
      
      // Close dialog
      newChatDialog.value = false;
    };
    
    const startPrivateChat = (member) => {
      // Check if private chat already exists
      const existingChat = chats.value.find(chat => 
        chat.members.length === 2 && 
        chat.members.includes(currentUserId) && 
        chat.members.includes(member.id)
      );
      
      if (existingChat) {
        // Select existing chat
        selectChat(existingChat);
        activeTab.value = 'chats';
      } else {
        // Create new private chat
        const newChatId = Math.max(0, ...chats.value.map(c => c.id)) + 1;
        const newChat = {
          id: newChatId,
          name: member.name, // Use member name for private chat
          members: [currentUserId, member.id],
          lastMessage: '',
          lastMessageTime: new Date()
        };
        
        // Add new chat to chats array
        chats.value.push(newChat);
        
        // Select the new chat
        selectChat(newChat);
        activeTab.value = 'chats';
      }
    };
    
    const openChatSettingsDialog = (chat) => {
      // This would open a dialog to manage chat settings
      // For this demo, we'll just print to console
      console.log('Chat settings for:', chat.name);
    };
    
    const openEditPaymentDialog = (member) => {
      memberToEditPayment.value = member;
      editedPayment.value = member.payment;
      editPaymentDialog.value = true;
    };
    
    const updatePayment = () => {
      if (!memberToEditPayment.value || !isPaymentFormValid.value) return;
      
      const index = teamMembers.value.findIndex(m => m.id === memberToEditPayment.value.id);
      if (index !== -1) {
        teamMembers.value[index].payment = Number(editedPayment.value);
        
        // If this is the currently selected member, update that too
        if (selectedMember.value && selectedMember.value.id === memberToEditPayment.value.id) {
          selectedMember.value = {...teamMembers.value[index]};
        }
      }
      
      editPaymentDialog.value = false;
    };
    
    const openEditProjectDialog = (member) => {
      memberToEditProject.value = member;
      editedProject.value = member.currentProject;
      editProjectDialog.value = true;
    };
    
    const updateProject = () => {
      if (!memberToEditProject.value || !isProjectFormValid.value) return;
      
      const index = teamMembers.value.findIndex(m => m.id === memberToEditProject.value.id);
      if (index !== -1) {
        teamMembers.value[index].currentProject = editedProject.value;
        
        // If this is the currently selected member, update that too
        if (selectedMember.value && selectedMember.value.id === memberToEditProject.value.id) {
          selectedMember.value = {...teamMembers.value[index]};
        }
      }
      
      editProjectDialog.value = false;
    };
    
    const openAddMemberDialog = () => {
      newMember.value = {
        name: '',
        role: '',
        email: '',
        phone: '',
        payment: 0,
        currentProject: '',
        skills: []
      };
      addMemberDialog.value = true;
    };
    
    const addTeamMember = () => {
      if (!isMemberFormValid.value) return;
      
      // Create new member with ID
      const newMemberId = Math.max(0, ...teamMembers.value.map(m => m.id)) + 1;
      const memberToAdd = {
        ...newMember.value,
        id: newMemberId,
        avatar: `https://i.pravatar.cc/150?img=${newMemberId + 10}` // Random avatar
      };
      
      // Add to team members
      teamMembers.value.push(memberToAdd);
      
      // Select the new member
      selectTeamMember(memberToAdd);
      
      // Close dialog
      addMemberDialog.value = false;
    };
    
    // Window resize handler for responsive layout
    const handleResize = () => {
      updateResponsiveState();
      adjustViewForScreenSize();
    };
    
    // Adjust view based on screen size
    const adjustViewForScreenSize = () => {
      // On mobile, if sidebar is open, we might want to close it
      // This would depend on your specific implementation
      
      // Adjust heights of messages container based on screen size
      if (messagesContainer.value) {
        if (isMobile.value) {
          messagesContainer.value.style.height = '350px';
        } else if (isTablet.value) {
          messagesContainer.value.style.height = '400px';
        } else {
          messagesContainer.value.style.height = 'calc(100% - 130px)';
        }
      }
    };
    
    // Watch for responsive changes and update UI
    watch([isMobile, isTablet], () => {
      adjustViewForScreenSize();
    });
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Initialize with first chat selected
      if (chats.value.length > 0 && !selectedChat.value) {
        selectChat(chats.value[0]);
      }
      
      // Initial adjustment
      adjustViewForScreenSize();
    });
    
    return {
      // Data
      isMobile,
      isTablet,
      menuItems,
      activeTab,
      chats,
      messages,
      teamMembers,
      availableProjects,
      selectedChat,
      selectedMember,
      messagesContainer,
      currentUserId,
      
      // Forms
      isFormValid,
      chatForm,
      newChatName,
      selectedMembers,
      newMessage,
      
      // Payment dialog
      editPaymentDialog,
      isPaymentFormValid,
      paymentForm,
      editedPayment,
      memberToEditPayment,
      
      // Project dialog
      editProjectDialog,
      isProjectFormValid,
      projectForm,
      editedProject,
      memberToEditProject,
      
      // Add member dialog
      addMemberDialog,
      isMemberFormValid,
      memberForm,
      newMember,
      
      // New chat dialog
      newChatDialog,
      
      // Computed
      selectedChatMessages,
      
      // Methods
      formatTime,
      getChatInitials,
      getSenderName,
      selectChat,
      selectTeamMember,
      scrollToBottom,
      sendMessage,
      openNewChatDialog,
      toggleMemberSelection,
      createNewChat,
      startPrivateChat,
      openChatSettingsDialog,
      openEditPaymentDialog,
      updatePayment,
      openEditProjectDialog,
      updateProject,
      openAddMemberDialog,
      addTeamMember
    };
  }
});
</script> 

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.content-container {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.my-team-page {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

/* Cards */
.sidebar-card, .chat-card, .member-details, .empty-state {
  border-radius: 8px;
  overflow: hidden;
  height: 650px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1) !important;
}

@media (max-width: 960px) {
  .sidebar-card, .chat-card, .member-details, .empty-state {
    height: auto;
    min-height: 400px;
    margin-bottom: 16px;
  }
}

.sidebar-card {
  width: 100%;
}

/* Chat List */
.chat-item, .contact-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.chat-item:hover, .contact-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.chat-item.v-list-item--active {
  background-color: rgba(0, 128, 128, 0.05);
}

/* Chat Messages */
.chat-messages {
  padding: 16px;
  overflow-y: auto;
  height: calc(100% - 130px);
  background-color: #f9f9f9;
}

@media (max-width: 960px) {
  .chat-messages {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .chat-messages {
    height: 300px;
  }
}

.message-wrapper {
  margin-bottom: 16px;
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
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 600px) {
  .message-bubble {
    max-width: 90%;
  }
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
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 4px;
}

/* Chat Input */
.chat-input {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

/* Empty States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #fafafa;
}

/* Member Details */
.member-header {
  display: flex;
  align-items: center;
  padding: 16px;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .member-header {
    justify-content: center;
    text-align: center;
  }
  
  .member-header .v-avatar {
    margin-bottom: 16px;
  }
  
  .member-header .v-btn {
    margin-top: 16px;
    width: 100%;
  }
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
}

.v-chip {
  background-color: #e0f2f1 !important;
  color: #00897b !important;
  margin-right: 8px;
  margin-bottom: 8px;
  font-weight: 500;
}

/* Dialogs */
.member-selection {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 8px;
}

.member-checkbox {
  margin-right: 8px;
}

/* Main Layout */
.content-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Custom styling to match the image */
.v-navigation-drawer {
  border-right: none !important;
}

.v-card {
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: none !important;
}

.custom-tabs {
  border-bottom: 1px solid transparent;
  width: 100%;
}

.custom-tab {
  cursor: pointer;
  font-size: 16px;
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

.custom-tab:hover:not(.active) {
  color: #424242;
}

/* Mobile header adjustments */
@media (max-width: 600px) {
  .my-team-page .d-flex.justify-space-between {
    flex-direction: column;
  }
  
  .my-team-page h1 {
    margin-bottom: 16px;
  }
  
  .my-team-page .v-btn {
    width: 100%;
  }
}

/* Responsive card layout */
@media (max-width: 960px) {
  .my-team-page {
    margin-left: 0;
  }
  
  .sidebar-card {
    margin-bottom: 16px;
  }
  
  .chat-card, .member-details {
    margin-top: 16px;
  }
}

/* Responsive dialog tweaks */
@media (max-width: 600px) {
  .v-dialog {
    margin: 16px;
    width: calc(100% - 32px) !important;
  }
  
  .v-card-actions {
    flex-direction: column;
  }
  
  .v-card-actions .v-btn {
    margin: 4px 0;
    width: 100%;
  }
  
  .v-spacer {
    display: none;
  }
}

/* Responsive buttons */
@media (max-width: 600px) {
  .v-btn.v-btn--density-default {
    height: 40px;
  }
}

/* User profiles section */
.user-profiles {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 600px) {
  .user-profiles {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .user-profiles .v-avatar {
    margin: 0 8px 8px 0;
  }
}

/* Menu adjustments for mobile */
@media (max-width: 960px) {
  .app-container {
    flex-direction: column;
  }
  
  .left-menu {
    width: 100%;
    height: auto;
    flex-direction: row;
    overflow-x: auto;
    justify-content: flex-start;
    padding: 8px;
  }
  
  .left-menu .v-list {
    display: flex;
    flex-direction: row;
  }
  
  .left-menu .v-list-item {
    margin: 0 8px;
  }
}
</style>