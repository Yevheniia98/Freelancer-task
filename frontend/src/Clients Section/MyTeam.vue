<template>
  <v-app>
    <LeftMenu 
      class="left-menu-component"
    />
    <SearchBar />
      
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container
          fluid
          class="px-6 py-8"
        >
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Team</span> Collaboration
              </h1>
              <p class="hero-subtitle">
                Connect, communicate, and collaborate with your team members
              </p>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
                @click="openNewChatDialog()"
              >
                <v-icon class="mr-2">
                  mdi-chat-plus
                </v-icon>
                Create Chat
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container
        fluid
        class="content-container px-6 pb-8"
      >
        <!-- Team Overview Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="primary"
              >
                mdi-chart-donut
              </v-icon>
              <h2 class="section-heading">
                Team Overview
              </h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              {{ teamMembers.length }} members
            </v-chip>
          </div>
          
          <div class="team-overview-grid">
            <!-- Active Chats Card -->
            <div class="overview-item">
              <div class="overview-card active-chats-card">
                <div class="overview-icon-wrapper active-chats-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-chat-processing
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Active Chats
                  </h3>
                  <div class="overview-amount">
                    {{ chats.length }}
                  </div>
                  <div class="overview-description">
                    Team conversations
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Team Members Card -->
            <div class="overview-item">
              <div class="overview-card team-members-card">
                <div class="overview-icon-wrapper team-members-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-account-group
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Team Members
                  </h3>
                  <div class="overview-amount">
                    {{ teamMembers.length }}
                  </div>
                  <div class="overview-description">
                    Active collaborators
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Total Payroll Card -->
            <div class="overview-item">
              <div class="overview-card total-payroll-card">
                <div class="overview-icon-wrapper total-payroll-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-currency-usd
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Monthly Payroll
                  </h3>
                  <div class="overview-amount">
                    ${{ totalPayroll.toLocaleString() }}
                  </div>
                  <div class="overview-description">
                    Team compensation
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Active Projects Card -->
            <div class="overview-item">
              <div class="overview-card active-projects-card">
                <div class="overview-icon-wrapper active-projects-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-briefcase-variant
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Active Projects
                  </h3>
                  <div class="overview-amount">
                    {{ uniqueProjects.length }}
                  </div>
                  <div class="overview-description">
                    Ongoing work
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Workspace Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="warning"
              >
                mdi-forum
              </v-icon>
              <h2 class="section-heading">
                Team Workspace
              </h2>
            </div>
            <div class="section-actions">
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                rounded="lg"
                @click="openInviteDialog"
              >
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  mdi-email-plus
                </v-icon>
                Invite Members
              </v-btn>
              <v-btn
                color="warning"
                variant="outlined"
                size="small"
                rounded="lg"
                @click="openAddMemberDialog"
              >
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  mdi-account-plus
                </v-icon>
                Add Member
              </v-btn>
            </div>
          </div>
          
          <div class="workspace-container">
            <v-row>
              <!-- Sidebar - Chats and Contacts -->
              <v-col
                cols="12"
                md="4"
                lg="3"
              >
                <div class="workspace-sidebar">
                  <div class="sidebar-header">
                    <div class="sidebar-tabs">
                      <div 
                        class="sidebar-tab" 
                        :class="{ active: activeTab === 'chats' }"
                        @click="activeTab = 'chats'"
                      >
                        <v-icon
                          size="small"
                          class="mr-1"
                        >
                          mdi-chat
                        </v-icon>
                        Chats
                      </div>
                      <div 
                        class="sidebar-tab" 
                        :class="{ active: activeTab === 'contacts' }"
                        @click="activeTab = 'contacts'"
                      >
                        <v-icon
                          size="small"
                          class="mr-1"
                        >
                          mdi-account-group
                        </v-icon>
                        Contacts
                      </div>
                    </div>
                    
                    <v-text-field
                      placeholder="Search..."
                      variant="outlined"
                      density="compact"
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      class="search-field mt-3"
                    />
                  </div>
                  
                  <div class="sidebar-content">
                    <!-- Chats List -->
                    <div
                      v-if="activeTab === 'chats'"
                      class="chats-list"
                    >
                      <div
                        v-for="chat in chats"
                        :key="chat.id"
                        class="chat-item"
                        :class="{ active: selectedChat && chat.id === selectedChat.id }"
                        @click="selectChat(chat)"
                      >
                        <div class="chat-avatar">
                          <span class="chat-initials">{{ getChatInitials(chat) }}</span>
                        </div>
                        <div class="chat-info">
                          <div class="chat-name">
                            {{ chat.name }}
                          </div>
                          <div class="chat-last-message">
                            {{ chat.lastMessage || 'No messages yet' }}
                          </div>
                        </div>
                        <div class="chat-time">
                          {{ formatTime(chat.lastMessageTime) }}
                        </div>
                      </div>
                    </div>
                    
                    <!-- Contacts List -->
                    <div
                      v-if="activeTab === 'contacts'"
                      class="contacts-list"
                    >
                      <div
                        v-for="contact in teamMembers"
                        :key="contact.id"
                        class="contact-item"
                        :class="{ active: selectedMember && contact.id === selectedMember.id }"
                        @click="selectTeamMember(contact)"
                      >
                        <div class="contact-avatar">
                          <img
                            v-if="contact.avatar"
                            :src="contact.avatar"
                            :alt="contact.name"
                          >
                          <v-icon
                            v-else
                            color="white"
                          >
                            mdi-account
                          </v-icon>
                        </div>
                        <div class="contact-info">
                          <div class="contact-name">
                            {{ contact.name }}
                          </div>
                          <div class="contact-role">
                            {{ contact.role }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>

              <!-- Main Content Area -->
              <v-col
                cols="12"
                md="8"
                lg="9"
              >
                <div class="workspace-main">
                  <!-- Chat Interface -->
                  <div
                    v-if="activeTab === 'chats' && selectedChat"
                    class="chat-interface"
                  >
                    <div class="chat-header">
                      <div class="chat-header-info">
                        <div class="chat-header-avatar">
                          <span class="chat-initials">{{ getChatInitials(selectedChat) }}</span>
                        </div>
                        <div class="chat-header-details">
                          <h3 class="chat-title">
                            {{ selectedChat.name }}
                          </h3>
                          <div class="chat-members">
                            {{ selectedChat.members.length }} members
                          </div>
                        </div>
                      </div>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click="openChatSettingsDialog(selectedChat)"
                      >
                        <v-icon>mdi-cog</v-icon>
                      </v-btn>
                    </div>
                    
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
                            class="message-sender"
                          >
                            {{ getSenderName(message.senderId) }}
                          </div>
                          <div class="message-text">
                            {{ message.text }}
                          </div>
                          <div class="message-time">
                            {{ formatTime(message.timestamp) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="chat-input">
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
                    </div>
                  </div>

                  <!-- No Chat Selected -->
                  <div
                    v-else-if="activeTab === 'chats' && !selectedChat"
                    class="empty-state"
                  >
                    <v-icon
                      size="64"
                      color="grey-lighten-1"
                    >
                      mdi-chat-outline
                    </v-icon>
                    <h3 class="empty-title">
                      No chat selected
                    </h3>
                    <p class="empty-description">
                      Select a chat from the sidebar or create a new one
                    </p>
                    <v-btn
                      color="primary"
                      rounded="lg"
                      @click="openNewChatDialog"
                    >
                      <v-icon class="mr-2">
                        mdi-chat-plus
                      </v-icon>
                      Create New Chat
                    </v-btn>
                  </div>

                  <!-- Team Member Details -->
                  <div
                    v-if="activeTab === 'contacts' && selectedMember"
                    class="member-details"
                  >
                    <div class="member-header">
                      <div class="member-avatar-large">
                        <img
                          v-if="selectedMember.avatar"
                          :src="selectedMember.avatar"
                          :alt="selectedMember.name"
                        >
                        <v-icon
                          v-else
                          size="40"
                          color="white"
                        >
                          mdi-account
                        </v-icon>
                      </div>
                      <div class="member-info">
                        <h3 class="member-name">
                          {{ selectedMember.name }}
                        </h3>
                        <div class="member-role">
                          {{ selectedMember.role }}
                        </div>
                        <v-btn
                          color="primary"
                          rounded="lg"
                          size="small"
                          class="mt-2"
                          @click="startPrivateChat(selectedMember)"
                        >
                          <v-icon
                            size="small"
                            class="mr-1"
                          >
                            mdi-message
                          </v-icon>
                          Message
                        </v-btn>
                      </div>
                    </div>
                    
                    <div class="member-details-content">
                      <div class="details-grid">
                        <div class="detail-section">
                          <h4 class="section-title">
                            Contact Information
                          </h4>
                          <div class="detail-item">
                            <v-icon
                              size="small"
                              color="primary"
                            >
                              mdi-email
                            </v-icon>
                            <span>{{ selectedMember.email }}</span>
                          </div>
                          <div class="detail-item">
                            <v-icon
                              size="small"
                              color="primary"
                            >
                              mdi-phone
                            </v-icon>
                            <span>{{ selectedMember.phone }}</span>
                          </div>
                        </div>
                        
                        <div class="detail-section">
                          <h4 class="section-title">
                            Work Information
                          </h4>
                          <div class="detail-item">
                            <v-icon
                              size="small"
                              color="success"
                            >
                              mdi-currency-usd
                            </v-icon>
                            <span>${{ selectedMember.payment }}/month</span>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click="openEditPaymentDialog(selectedMember)"
                            >
                              <v-icon size="small">
                                mdi-pencil
                              </v-icon>
                            </v-btn>
                          </div>
                          <div class="detail-item">
                            <v-icon
                              size="small"
                              color="warning"
                            >
                              mdi-briefcase
                            </v-icon>
                            <span>{{ selectedMember.currentProject }}</span>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click="openEditProjectDialog(selectedMember)"
                            >
                              <v-icon size="small">
                                mdi-pencil
                              </v-icon>
                            </v-btn>
                          </div>
                          <div class="detail-item">
                            <v-icon
                              size="small"
                              color="primary"
                            >
                              mdi-shield-account
                            </v-icon>
                            <span>{{ selectedMember.role || 'member' }}</span>
                            <v-btn
                              icon
                              size="x-small"
                              variant="text"
                              @click="openEditRoleDialog(selectedMember)"
                            >
                              <v-icon size="small">
                                mdi-pencil
                              </v-icon>
                            </v-btn>
                          </div>
                        </div>
                        
                        <div class="detail-section">
                          <h4 class="section-title">
                            Team Actions
                          </h4>
                          <div class="detail-item">
                            <v-btn
                              color="error"
                              variant="outlined"
                              size="small"
                              rounded="lg"
                              :disabled="selectedMember.role === 'owner'"
                              @click="confirmRemoveMember(selectedMember)"
                            >
                              <v-icon
                                size="small"
                                class="mr-1"
                              >
                                mdi-account-remove
                              </v-icon>
                              Remove from Team
                            </v-btn>
                          </div>
                        </div>
                      </div>
                      
                      <div class="skills-section">
                        <h4 class="section-title">
                          Skills
                        </h4>
                        <div class="skills-container">
                          <v-chip
                            v-for="(skill, index) in selectedMember.skills"
                            :key="index"
                            size="small"
                            color="primary"
                            variant="tonal"
                            class="mr-1 mb-1"
                          >
                            {{ skill }}
                          </v-chip>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- No Member Selected -->
                  <div
                    v-else-if="activeTab === 'contacts' && !selectedMember"
                    class="empty-state"
                  >
                    <v-icon
                      size="64"
                      color="grey-lighten-1"
                    >
                      mdi-account-group-outline
                    </v-icon>
                    <h3 class="empty-title">
                      No team member selected
                    </h3>
                    <p class="empty-description">
                      Select a team member from the sidebar to view details
                    </p>
                    <v-btn
                      color="primary"
                      rounded="lg"
                      @click="openAddMemberDialog"
                    >
                      <v-icon class="mr-2">
                        mdi-account-plus
                      </v-icon>
                      Add New Member
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-container>
    </v-main>

    <!-- New Chat Dialog -->
    <v-dialog
      v-model="newChatDialog"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-chat-plus
            </v-icon>
            Create New Chat
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form
            ref="chatForm"
            v-model="isFormValid"
          >
            <v-text-field
              v-model="newChatName"
              label="Chat Name"
              variant="outlined"
              required
              :rules="[v => !!v || 'Chat name is required']"
            />

            <div class="text-subtitle-1 font-weight-bold mb-3 mt-4">
              Select Members
            </div>
            <div class="member-selection">
              <div
                v-for="member in teamMembers"
                :key="member.id"
                class="member-select-item"
                @click="toggleMemberSelection(member)"
              >
                <v-checkbox
                  v-model="selectedMembers"
                  :value="member.id"
                  hide-details
                  class="member-checkbox"
                />
                <div class="member-select-info">
                  <div class="member-select-name">
                    {{ member.name }}
                  </div>
                  <div class="member-select-role">
                    {{ member.role }}
                  </div>
                </div>
              </div>
            </div>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="newChatDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isFormValid || selectedMembers.length === 0"
            @click="createNewChat"
          >
            <v-icon class="mr-2">
              mdi-check
            </v-icon>
            Create Chat
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Invite Members Dialog -->
    <v-dialog
      v-model="inviteDialog"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-email-plus
            </v-icon>
            Invite Team Members
          </div>
          <v-spacer />
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="inviteDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6 text-center invite-content">
          <div class="invite-background" />
          
          <h2 class="text-h5 font-weight-bold mb-6">
            Invite people to your Workspace
          </h2>

          <div class="invite-options">
            <v-btn
              color="primary"
              variant="elevated"
              size="large"
              rounded="lg"
              class="invite-option-btn mb-4"
              block
              @click="openEmailInviteDialog"
            >
              <v-icon class="mr-2">
                mdi-email
              </v-icon>
              Invite via Email
            </v-btn>

            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              rounded="lg"
              class="invite-option-btn"
              block
              @click="openPlatformInviteDialog"
            >
              <v-icon class="mr-2">
                mdi-account-search
              </v-icon>
              Search & Invite from Platform
            </v-btn>
          </div>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="inviteDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Email Invite Dialog -->
    <v-dialog
      v-model="emailInviteDialog"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-email
            </v-icon>
            Invite via Email
          </div>
          <v-spacer />
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="emailInviteDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <div class="invite-background-email" />
          
          <v-form
            ref="emailInviteForm"
            v-model="isEmailInviteFormValid"
          >
            <v-text-field
              v-model="emailAddresses"
              label="Enter email addresses"
              variant="outlined"
              placeholder="john@example.com, jane@example.com"
              hint="Separate multiple emails with commas"
              persistent-hint
              required
              :rules="[
                v => !!v || 'Email addresses are required',
                v => validateEmails(v) || 'Please enter valid email addresses'
              ]"
            />

            <v-textarea
              v-model="inviteMessage"
              label="Personal Message (Optional)"
              variant="outlined"
              rows="3"
              placeholder="Add a personal message to your invitation..."
              class="mt-4"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="emailInviteDialog = false"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :loading="sendingInvites"
            :disabled="!isEmailInviteFormValid || sendingInvites"
            @click="sendEmailInvites"
          >
            <v-icon class="mr-2">
              mdi-send
            </v-icon>
            Send Invites
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Platform Search Invite Dialog -->
    <v-dialog
      v-model="platformInviteDialog"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-account-search
            </v-icon>
            Search & Invite
          </div>
          <v-spacer />
          <v-btn
            icon
            size="small"
            variant="text"
            color="white"
            @click="platformInviteDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <div class="invite-background-platform" />
          
          <h3 class="text-h6 font-weight-bold mb-4 text-center">
            Find people to invite to your workspace
          </h3>

          <v-form
            ref="platformSearchForm"
            v-model="isPlatformSearchFormValid"
          >
            <div class="search-section mb-4">
              <div class="d-flex align-center mb-3">
                <div class="search-label">
                  Search by Name
                </div>
                <v-text-field
                  v-model="nameSearch"
                  variant="outlined"
                  hide-details
                  density="compact"
                  placeholder="Enter full name"
                  class="search-field"
                />
              </div>
              
              <div class="text-center my-3">
                <v-chip
                  size="small"
                  variant="outlined"
                >
                  or
                </v-chip>
              </div>
              
              <div class="d-flex align-center mb-4">
                <div class="search-label">
                  Search by Email
                </div>
                <v-text-field
                  v-model="emailSearch"
                  variant="outlined"
                  hide-details
                  density="compact"
                  placeholder="Enter email address"
                  class="search-field"
                />
              </div>
            </div>

            <!-- Search Results -->
            <div
              v-if="searchResults.length > 0"
              class="search-results"
            >
              <h4 class="text-subtitle-1 font-weight-bold mb-3">
                Search Results
              </h4>
              <div class="results-list">
                <div
                  v-for="user in searchResults"
                  :key="user.id"
                  class="result-item"
                >
                  <div class="d-flex align-items-center">
                    <v-avatar
                      size="40"
                      class="mr-3"
                    >
                      <img
                        v-if="user.avatar"
                        :src="user.avatar"
                        :alt="user.name"
                      >
                      <v-icon
                        v-else
                        color="white"
                      >
                        mdi-account
                      </v-icon>
                    </v-avatar>
                    <div class="user-info flex-grow-1">
                      <div class="user-name">
                        {{ user.name }}
                      </div>
                      <div class="user-email">
                        {{ user.email }}
                      </div>
                    </div>
                    <v-btn
                      size="small"
                      color="primary"
                      variant="outlined"
                      rounded="lg"
                      @click="inviteUser(user)"
                    >
                      Invite
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div
              v-else-if="hasSearched && searchResults.length === 0"
              class="no-results text-center"
            >
              <v-icon
                size="48"
                color="grey-lighten-1"
              >
                mdi-account-search-outline
              </v-icon>
              <div class="text-body-1 mt-2">
                No users found
              </div>
              <div class="text-body-2 text-grey">
                Try searching with a different name or email
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="platformInviteDialog = false"
          >
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :loading="searching"
            :disabled="(!nameSearch && !emailSearch) || searching"
            @click="searchUsers"
          >
            <v-icon class="mr-2">
              mdi-magnify
            </v-icon>
            Search
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="4000"
      color="success"
      location="top"
    >
      {{ snackbarMessage }}
      <template #actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Edit Payment Dialog -->
    <v-dialog
      v-model="editPaymentDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-currency-usd
            </v-icon>
            Update Payment
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form
            ref="paymentForm"
            v-model="isPaymentFormValid"
          >
            <v-text-field
              v-model="editedPayment"
              label="Monthly Payment ($)"
              variant="outlined"
              type="number"
              required
              :rules="[
                v => !!v || 'Payment amount is required',
                v => v > 0 || 'Payment must be greater than 0'
              ]"
            />
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="editPaymentDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isPaymentFormValid"
            @click="updatePayment"
          >
            <v-icon class="mr-2">
              mdi-content-save
            </v-icon>
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
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-briefcase
            </v-icon>
            Change Project
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form
            ref="projectForm"
            v-model="isProjectFormValid"
          >
            <v-select
              v-model="editedProject"
              label="Select Project"
              variant="outlined"
              :items="availableProjects"
              required
              :rules="[v => !!v || 'Project is required']"
            />
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="editProjectDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isProjectFormValid"
            @click="updateProject"
          >
            <v-icon class="mr-2">
              mdi-content-save
            </v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Role Dialog -->
    <v-dialog
      v-model="editRoleDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-shield-account
            </v-icon>
            Update Role
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form
            ref="roleForm"
            v-model="isRoleFormValid"
          >
            <v-select
              v-model="editedRole"
              label="Select Role"
              variant="outlined"
              :items="availableRoles"
              required
              :rules="[v => !!v || 'Role is required']"
            />
            <div class="role-descriptions mt-3">
              <v-card 
                variant="tonal" 
                color="info" 
                class="pa-3"
              >
                <div class="text-caption">
                  <strong>Admin:</strong> Can invite/remove members and manage projects<br>
                  <strong>Member:</strong> Can access assigned projects<br>
                  <strong>Viewer:</strong> Read-only access to assigned projects
                </div>
              </v-card>
            </div>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="editRoleDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isRoleFormValid"
            :loading="updatingRole"
            @click="updateRole"
          >
            <v-icon class="mr-2">
              mdi-content-save
            </v-icon>
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Remove Member Confirmation Dialog -->
    <v-dialog
      v-model="removeConfirmDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="pa-6">
          <div class="d-flex align-center">
            <v-icon
              class="mr-3"
              color="error"
            >
              mdi-alert-circle
            </v-icon>
            <span>Remove Team Member</span>
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <p>
            Are you sure you want to remove <strong>{{ memberToRemove?.name }}</strong> from the team?
          </p>
          <p class="text-caption text-error mt-3">
            This action cannot be undone. The member will lose access to all projects and team resources.
          </p>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="removeConfirmDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="error"
            variant="elevated"
            rounded="lg"
            :loading="removingMember"
            @click="removeMember"
          >
            <v-icon class="mr-2">
              mdi-account-remove
            </v-icon>
            Remove
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
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-account-plus
            </v-icon>
            Add New Team Member
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
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
                  variant="outlined"
                  :items="availableProjects"
                  required
                  :rules="[v => !!v || 'Project is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-combobox
                  v-model="newMember.skills"
                  label="Skills"
                  variant="outlined"
                  multiple
                  chips
                  hint="Enter skills and press Enter"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text"
            @click="addMemberDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isMemberFormValid"
            @click="addTeamMember"
          >
            <v-icon class="mr-2">
              mdi-account-plus
            </v-icon>
            Add Member
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
<script>
import { defineComponent, ref, computed, nextTick, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
  
export default defineComponent({
  name: 'MyTeamPage',
  components: {
    LeftMenu,
    SearchBar
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

    // Available roles
    const availableRoles = [
      { title: 'Admin', value: 'admin' },
      { title: 'Member', value: 'member' },
      { title: 'Viewer', value: 'viewer' }
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

    // Role dialog
    const editRoleDialog = ref(false);
    const isRoleFormValid = ref(true);
    const roleForm = ref(null);
    const editedRole = ref('');
    const memberToEditRole = ref(null);
    const updatingRole = ref(false);

    // Remove member dialog
    const removeConfirmDialog = ref(false);
    const memberToRemove = ref(null);
    const removingMember = ref(false);
    
    // New chat dialog
    const newChatDialog = ref(false);

    // Invite dialogs
    const inviteDialog = ref(false);
    const emailInviteDialog = ref(false);
    const platformInviteDialog = ref(false);
    
    // Email invite form
    const isEmailInviteFormValid = ref(false);
    const emailInviteForm = ref(null);
    const emailAddresses = ref('');
    const inviteMessage = ref('');
    const sendingInvites = ref(false);
    
    // Platform search form
    const isPlatformSearchFormValid = ref(false);
    const platformSearchForm = ref(null);
    const nameSearch = ref('');
    const emailSearch = ref('');
    const searching = ref(false);
    const hasSearched = ref(false);
    const searchResults = ref([]);
    
    // Snackbar
    const showSnackbar = ref(false);
    const snackbarMessage = ref('');
    
    // Computed properties
    const totalPayroll = computed(() => {
      return teamMembers.value.reduce((total, member) => total + member.payment, 0);
    });

    const uniqueProjects = computed(() => {
      const projects = teamMembers.value.map(member => member.currentProject);
      return [...new Set(projects)].filter(project => project);
    });
    
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
      nextTick(() => {
        scrollToBottom();
      });
    };
    
    const selectTeamMember = (member) => {
      selectedMember.value = member;
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

    const openInviteDialog = () => {
      inviteDialog.value = true;
    };

    const openEmailInviteDialog = () => {
      inviteDialog.value = false;
      emailInviteDialog.value = true;
    };

    const openPlatformInviteDialog = () => {
      inviteDialog.value = false;
      platformInviteDialog.value = true;
    };

    const validateEmails = (value) => {
      if (!value) return true;
      
      const emails = value.split(',').map(email => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      return emails.every(email => emailRegex.test(email));
    };

    const sendEmailInvites = async () => {
      if (!isEmailInviteFormValid.value) return;
      
      sendingInvites.value = true;
      
      try {
        // Split emails by commas and trim whitespace
        const emails = emailAddresses.value.split(',').map(email => email.trim());
        
        // Call the backend API
        const response = await fetch('http://localhost:3030/api/team/invitations/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emails: emails,
            message: inviteMessage.value || 'You have been invited to join our team workspace!'
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Show success message
          snackbarMessage.value = `Email invitations sent successfully to ${emails.length} recipient(s)!`;
          showSnackbar.value = true;
          
          // Log the invite links for testing
          console.log('📧 Invitation links generated:');
          data.summary.results.forEach(result => {
            console.log(`${result.email}: ${result.inviteLink}`);
          });
        } else {
          throw new Error(data.message || 'Failed to send invitations');
        }
        // Reset form
        emailAddresses.value = '';
        inviteMessage.value = '';
        emailInviteForm.value?.reset();
        
        // Close dialog
        emailInviteDialog.value = false;
        
      } catch (error) {
        console.error('Error sending invites:', error);
        snackbarMessage.value = error.message || 'Failed to send invitations. Please try again.';
        showSnackbar.value = true;
      } finally {
        sendingInvites.value = false;
      }
    };

    const searchUsers = async () => {
      if (!nameSearch.value && !emailSearch.value) return;
      
      searching.value = true;
      hasSearched.value = true;
      
      try {
        // Mock API call - replace with your actual search endpoint
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock search results
        const mockResults = [
          {
            id: 1,
            name: 'Alex Thompson',
            email: 'alex.thompson@example.com',
            avatar: 'https://i.pravatar.cc/150?img=7'
          },
          {
            id: 2,
            name: 'Sarah Wilson',
            email: 'sarah.wilson@example.com',
            avatar: 'https://i.pravatar.cc/150?img=8'
          }
        ];
        
        // Filter results based on search criteria
        searchResults.value = mockResults.filter(user => 
          (nameSearch.value && user.name.toLowerCase().includes(nameSearch.value.toLowerCase())) ||
          (emailSearch.value && user.email.toLowerCase().includes(emailSearch.value.toLowerCase()))
        );
        
      } catch (error) {
        console.error('Error searching users:', error);
        snackbarMessage.value = 'Failed to search users. Please try again.';
        showSnackbar.value = true;
      } finally {
        searching.value = false;
      }
    };

    const inviteUser = async (user) => {
      try {
        // Mock API call to invite specific user
        await new Promise(resolve => setTimeout(resolve, 500));
        
        snackbarMessage.value = `Invitation sent to ${user.name}!`;
        showSnackbar.value = true;
        
        // Remove user from search results
        searchResults.value = searchResults.value.filter(u => u.id !== user.id);
        
      } catch (error) {
        console.error('Error inviting user:', error);
        snackbarMessage.value = 'Failed to send invitation. Please try again.';
        showSnackbar.value = true;
      }
    };

    const openEditRoleDialog = (member) => {
      memberToEditRole.value = member;
      editedRole.value = member.role || 'member';
      editRoleDialog.value = true;
    };

    const updateRole = async () => {
      if (!memberToEditRole.value || !isRoleFormValid.value) return;
      
      updatingRole.value = true;
      
      try {
        // Call API to update member role
        const response = await fetch(`http://localhost:3030/api/team/members/${memberToEditRole.value.id}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if you have one
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            role: editedRole.value
          })
        });

        const data = await response.json();
        
        if (data.success) {
          // Update local data
          const index = teamMembers.value.findIndex(m => m.id === memberToEditRole.value.id);
          if (index !== -1) {
            teamMembers.value[index].role = editedRole.value;
            
            // If this is the currently selected member, update that too
            if (selectedMember.value && selectedMember.value.id === memberToEditRole.value.id) {
              selectedMember.value = {...teamMembers.value[index]};
            }
          }
          
          snackbarMessage.value = 'Member role updated successfully!';
          showSnackbar.value = true;
        } else {
          throw new Error(data.message || 'Failed to update role');
        }
      } catch (error) {
        console.error('Error updating member role:', error);
        snackbarMessage.value = error.message || 'Failed to update member role. Please try again.';
        showSnackbar.value = true;
      } finally {
        updatingRole.value = false;
        editRoleDialog.value = false;
      }
    };

    const confirmRemoveMember = (member) => {
      if (member.role === 'owner') {
        snackbarMessage.value = 'Cannot remove the team owner.';
        showSnackbar.value = true;
        return;
      }
      
      memberToRemove.value = member;
      removeConfirmDialog.value = true;
    };

    const removeMember = async () => {
      if (!memberToRemove.value) return;
      
      removingMember.value = true;
      
      try {
        // Call API to remove member
        const response = await fetch(`http://localhost:3030/api/team/members/${memberToRemove.value.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add auth token if you have one
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        
        if (data.success) {
          // Remove from local data
          teamMembers.value = teamMembers.value.filter(m => m.id !== memberToRemove.value.id);
          
          // Clear selected member if it was the removed one
          if (selectedMember.value && selectedMember.value.id === memberToRemove.value.id) {
            selectedMember.value = null;
          }
          
          snackbarMessage.value = 'Team member removed successfully!';
          showSnackbar.value = true;
        } else {
          throw new Error(data.message || 'Failed to remove member');
        }
      } catch (error) {
        console.error('Error removing member:', error);
        snackbarMessage.value = error.message || 'Failed to remove member. Please try again.';
        showSnackbar.value = true;
      } finally {
        removingMember.value = false;
        removeConfirmDialog.value = false;
      }
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
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Initialize with first chat selected
      if (chats.value.length > 0 && !selectedChat.value) {
        selectChat(chats.value[0]);
      }
    });
    
    return {
      // Data
      isMobile,
      isTablet,
      activeTab,
      chats,
      messages,
      teamMembers,
      availableProjects,
      selectedChat,
      selectedMember,
      messagesContainer,
      currentUserId,
      
      // Computed
      totalPayroll,
      uniqueProjects,
      selectedChatMessages,
      
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
      
      // Role dialog
      editRoleDialog,
      isRoleFormValid,
      roleForm,
      editedRole,
      memberToEditRole,
      updatingRole,
      
      // Remove member dialog
      removeConfirmDialog,
      memberToRemove,
      removingMember,
      
      // New chat dialog
      newChatDialog,

      // Invite dialogs
      inviteDialog,
      emailInviteDialog,
      platformInviteDialog,
      
      // Email invite form
      isEmailInviteFormValid,
      emailInviteForm,
      emailAddresses,
      inviteMessage,
      sendingInvites,
      
      // Platform search form
      isPlatformSearchFormValid,
      platformSearchForm,
      nameSearch,
      emailSearch,
      searching,
      hasSearched,
      searchResults,
      
      // Snackbar
      showSnackbar,
      snackbarMessage,
      
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
      addTeamMember,
      openInviteDialog,
      openEmailInviteDialog,
      openPlatformInviteDialog,
      validateEmails,
      sendEmailInvites,
      searchUsers,
      inviteUser,
      openEditRoleDialog,
      updateRole,
      confirmRemoveMember,
      removeMember,
      availableRoles
    };
  }
});
</script> 

<style scoped>
:deep(.left-menu-component),
:deep(.v-navigation-drawer) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  overflow-y: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-navigation-drawer--rail) {
  width: 72px;
}

:deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
  width: 240px !important;
}

/* Main Layout - Same as Design Tools */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Hero Section - Same as Design Tools */
.hero-section {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA726);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 0 0;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-btn {
  background: white !important;
  color: #0D7C66 !important;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

/* Content Container - Same as Design Tools */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections - Same as Design Tools */
.tool-section {
  margin-bottom: 3rem;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.8rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.count-chip {
  font-weight: 600;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Team Overview Grid */
.team-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.overview-item {
  position: relative;
}

.overview-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.overview-card:hover::before {
  opacity: 1;
}

.overview-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.active-chats-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.team-members-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.total-payroll-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.active-projects-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.overview-card:hover .overview-icon-wrapper {
  transform: scale(1.05);
}

.overview-icon {
  font-size: 1.5rem;
}

.overview-info {
  flex: 1;
  min-width: 0;
}

.overview-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.overview-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.overview-description {
  font-size: 0.875rem;
  color: #94a3b8;
}

/* Workspace Container */
.workspace-container {
  width: 100%;
}

/* Workspace Sidebar */
.workspace-sidebar {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.sidebar-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.sidebar-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid #e2e8f0;
}

.sidebar-tab.active {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
  border-color: #0D7C66;
}

.sidebar-tab:hover:not(.active) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.search-field {
  font-size: 0.875rem;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

/* Chats List */
.chats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.chat-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.chat-item.active {
  background: linear-gradient(135deg, rgba(13, 124, 102, 0.1), rgba(65, 179, 162, 0.1));
  border-color: #0D7C66;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-initials {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.chat-last-message {
  font-size: 0.8125rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 0.75rem;
  color: #94a3b8;
  flex-shrink: 0;
}

/* Contacts List */
.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.contact-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.contact-item.active {
  background: linear-gradient(135deg, rgba(13, 124, 102, 0.1), rgba(65, 179, 162, 0.1));
  border-color: #0D7C66;
}

.contact-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.contact-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.contact-role {
  font-size: 0.8125rem;
  color: #64748b;
}

/* Workspace Main */
.workspace-main {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
}

/* Chat Interface */
.chat-interface {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-header-avatar {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-header-details {
  flex: 1;
}

.chat-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.chat-members {
  font-size: 0.875rem;
  color: #64748b;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #f8fafc;
}

.message-wrapper {
  margin-bottom: 1rem;
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
  max-width: 70%;
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.message-sent .message-bubble {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
  border-color: #0D7C66;
}

.message-received .message-bubble {
  background: white;
  color: #1e293b;
}

.message-sender {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.25rem;
}

.message-text {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: right;
}

.chat-input {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: white;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 1rem 0 0.5rem 0;
}

.empty-description {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 2rem 0;
}

/* Member Details */
.member-details {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.member-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.member-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.member-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.member-role {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.member-details-content {
  flex: 1;
  padding: 2rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #475569;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.skills-section {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Modal Headers */
.hero-modal-header {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Member Selection */
.member-selection {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 0.5rem;
}

.member-select-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.member-select-item:hover {
  background: #f8fafc;
}

.member-checkbox {
  flex-shrink: 0;
}

.member-select-info {
  flex: 1;
}

.member-select-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.member-select-role {
  font-size: 0.8125rem;
  color: #64748b;
}

/* Animation - Same as Design Tools */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  animation: fadeInUp 0.6s ease-out;
}

.tool-section:nth-child(2) {
  animation-delay: 0.1s;
}

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .team-overview-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .content-container {
    margin-top: -1rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .workspace-sidebar,
  .workspace-main {
    height: 400px;
    margin-bottom: 1rem;
  }
  
  .sidebar-tabs {
    grid-template-columns: 1fr 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .member-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .member-avatar-large {
    width: 60px;
    height: 60px;
  }
  
  .member-name {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .overview-card {
    padding: 1rem;
  }
  
  .overview-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .overview-icon {
    font-size: 1.25rem;
  }
  
  .overview-amount {
    font-size: 1.5rem;
  }
  
  .workspace-sidebar,
  .workspace-main {
    height: 350px;
  }
  
  .sidebar-header {
    padding: 1rem;
  }
  
  .sidebar-content {
    padding: 0.75rem;
  }
  
  .chat-header {
    padding: 1rem;
  }
  
  .chat-messages {
    padding: 1rem;
  }
  
  .chat-input {
    padding: 1rem;
  }
  
  .member-details-content {
    padding: 1rem;
  }
  
  .detail-section,
  .skills-section {
    padding: 1rem;
  }
}

/* Invite Dialog Styles */
.invite-content {
  position: relative;
}

.invite-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 25% 60%, rgba(255, 236, 153, 0.3) 0%, transparent 50%), 
              radial-gradient(circle at 50% 30%, rgba(144, 238, 219, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 75% 60%, rgba(255, 182, 193, 0.3) 0%, transparent 50%);
  border-radius: 1rem;
  z-index: -1;
}

.invite-background-email {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 40%, rgba(13, 124, 102, 0.1) 0%, transparent 50%), 
              radial-gradient(circle at 70% 60%, rgba(65, 179, 162, 0.1) 0%, transparent 50%);
  border-radius: 1rem;
  z-index: -1;
}

.invite-background-platform {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 40% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), 
              radial-gradient(circle at 60% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
  border-radius: 1rem;
  z-index: -1;
}

.invite-options {
  position: relative;
  z-index: 1;
}

.invite-option-btn {
  font-weight: 600;
  height: 56px;
}

/* Search Section */
.search-section {
  position: relative;
  z-index: 1;
}

.search-label {
  width: 140px;
  text-align: right;
  margin-right: 1rem;
  font-weight: 500;
  color: #64748b;
  flex-shrink: 0;
}

.search-field {
  flex: 1;
}

/* Search Results */
.search-results {
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  background: white;
  transition: all 0.3s ease;
}

.result-item:hover {
  border-color: #0D7C66;
  box-shadow: 0 4px 12px rgba(13, 124, 102, 0.1);
}

.result-item:last-child {
  margin-bottom: 0;
}

.user-info {
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: #64748b;
}

.no-results {
  margin-top: 2rem;
  padding: 2rem;
  position: relative;
  z-index: 1;
}
@media (max-width: 600px) {
  .chat-item,
  .contact-item {
    padding: 1.25rem 1rem;
  }
  
  .sidebar-tab {
    padding: 1rem;
    font-size: 0.875rem;
  }
  
  .member-select-item {
    padding: 1rem;
  }
}
</style>