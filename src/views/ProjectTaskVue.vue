<template>
  <v-app>
    <LeftMenu
      сlass="left-menu-component"
      :style="{ position: 'fixed !important', zIndex: 1000 }"
    />
    <SearchBar />
    
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container fluid class="px-6 py-8">
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Slack</span> Brand Logo Design
              </h1>
              <p class="hero-subtitle">
                Create a modern, vibrant logo for team collaboration
              </p>
              <div class="hero-chips">
                <v-chip color="success" variant="elevated" size="small" class="mr-2">
                  <v-icon size="small" class="mr-1">mdi-circle</v-icon>
                  New
                </v-chip>
                <v-chip color="error" variant="elevated" size="small">
                  <v-icon size="small" class="mr-1">mdi-flag</v-icon>
                  High Priority
                </v-chip>
              </div>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
              >
                <v-icon class="mr-2">mdi-star</v-icon>
                Add to Favorites
              </v-btn>
              <v-btn 
                color="white"
                variant="outlined"
                size="large"
                rounded="lg"
                class="hero-btn-outline"
              >
                <v-icon class="mr-2">mdi-share-variant</v-icon>
                Share
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container fluid class="content-container px-6 pb-8">
        <!-- Project Overview Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="primary">mdi-information</v-icon>
              <h2 class="section-heading">Project Overview</h2>
            </div>
            <div class="project-meta">
              <span class="meta-item">Created: 10 Jul, 2024</span>
              <span class="meta-divider">•</span>
              <span class="meta-item">Due: 20 Jul, 2024</span>
              <span class="meta-divider">•</span>
              <span class="meta-item">Themes brand</span>
            </div>
          </div>
          
          <div class="project-overview-grid">
            <!-- Create Date Card -->
            <div class="overview-item">
              <div class="overview-card create-date-card">
                <div class="overview-icon-wrapper create-date-icon">
                  <v-icon class="overview-icon" color="white">mdi-calendar-plus</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Create Date</h3>
                  <div class="overview-amount">10 Jul, 2024</div>
                  <div class="overview-description">Project started</div>
                </div>
              </div>
            </div>
            
            <!-- Due Date Card -->
            <div class="overview-item">
              <div class="overview-card due-date-card">
                <div class="overview-icon-wrapper due-date-icon">
                  <v-icon class="overview-icon" color="white">mdi-calendar-clock</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Due Date</h3>
                  <div class="overview-amount">20 Jul, 2024</div>
                  <div class="overview-description">Deadline approaching</div>
                </div>
              </div>
            </div>
            
            <!-- Priority Card -->
            <div class="overview-item">
              <div class="overview-card priority-card">
                <div class="overview-icon-wrapper priority-icon">
                  <v-icon class="overview-icon" color="white">mdi-flag</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Priority</h3>
                  <div class="overview-amount">High</div>
                  <div class="overview-description">Critical task</div>
                </div>
              </div>
            </div>
            
            <!-- Status Card -->
            <div class="overview-item">
              <div class="overview-card status-card">
                <div class="overview-icon-wrapper status-icon">
                  <v-icon class="overview-icon" color="white">mdi-progress-clock</v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">Status</h3>
                  <div class="overview-amount">In Progress</div>
                  <div class="overview-description">Active development</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Details Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="warning">mdi-clipboard-text</v-icon>
              <h2 class="section-heading">Project Details</h2>
            </div>
          </div>
          
          <v-row>
            <!-- Left Column -->
            <v-col cols="12" md="8">
              <div class="project-card">
                <div class="card-header">
                  <h3 class="card-title">Summary</h3>
                  <p class="card-subtitle">Project requirements and specifications</p>
                </div>
                
                <div class="card-content">
                  <div class="summary-text">
                    <p class="main-description">
                      Create a logo that reflects the brand's identity using Slack's modern, clean, and
                      vibrant design principles as inspiration.
                    </p>
                    
                    <div class="requirements-section">
                      <h4 class="requirements-title">Key Requirements</h4>
                      <ul class="requirements-list">
                        <li class="requirement-item">
                          <v-icon size="small" color="primary" class="requirement-icon">mdi-check-circle</v-icon>
                          <span>The logo should convey collaboration, innovation, and inclusivity. Consider the values of connectivity, communication, and approachability.</span>
                        </li>
                        <li class="requirement-item">
                          <v-icon size="small" color="primary" class="requirement-icon">mdi-check-circle</v-icon>
                          <span>The target audience is tech-savvy professionals and teams looking for a seamless communication tool.</span>
                        </li>
                        <li class="requirement-item">
                          <v-icon size="small" color="primary" class="requirement-icon">mdi-check-circle</v-icon>
                          <span>Use vibrant yet harmonious colors, similar to Slack's multi-color design but unique to the brand.</span>
                        </li>
                        <li class="requirement-item">
                          <v-icon size="small" color="primary" class="requirement-icon">mdi-check-circle</v-icon>
                          <span>Explore clean, sans-serif fonts that are legible and modern.</span>
                        </li>
                        <li class="requirement-item">
                          <v-icon size="small" color="primary" class="requirement-icon">mdi-check-circle</v-icon>
                          <span>Integrate shapes that evoke connection (e.g., intersecting shapes, dots, or patterns symbolizing team synergy).</span>
                        </li>
                      </ul>
                    </div>

                    <div class="file-formats-section">
                      <h4 class="requirements-title">File Formats</h4>
                      <ul class="requirements-list">
                        <li class="requirement-item">
                          <v-icon size="small" color="success" class="requirement-icon">mdi-file-check</v-icon>
                          <span>Editable vector files (AI, EPS).</span>
                        </li>
                        <li class="requirement-item">
                          <v-icon size="small" color="success" class="requirement-icon">mdi-file-check</v-icon>
                          <span>High-resolution PNG and SVG.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="project-card">
                <div class="card-header">
                  <h3 class="card-title">Resources</h3>
                  <p class="card-subtitle">Project files and documentation</p>
                </div>
                
                <div class="card-content">
                  <div class="resources-grid">
                    <div
                      v-for="file in files"
                      :key="file.id"
                      class="resource-item"
                    >
                      <div class="resource-icon-wrapper">
                        <v-icon color="primary">mdi-file-document</v-icon>
                      </div>
                      <div class="resource-info">
                        <div class="resource-name">{{ file.name }}</div>
                        <div class="resource-size">{{ file.size }}</div>
                      </div>
                      <div class="resource-actions">
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="primary"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="grey"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="project-card">
                <div class="card-header">
                  <h3 class="card-title">Comments</h3>
                  <p class="card-subtitle">Team discussion and updates</p>
                </div>
                
                <div class="card-content">
                  <div class="comments-section">
                    <div class="comment-item">
                      <div class="comment-avatar">
                        <v-avatar size="40">
                          <v-img src="https://i.pravatar.cc/40?img=1" />
                        </v-avatar>
                      </div>
                      <div class="comment-content">
                        <div class="comment-header">
                          <span class="comment-author">Nico W.</span>
                          <span class="comment-time">20 Sep 2024 | 08:25 AM</span>
                        </div>
                        <div class="comment-text">
                          Hi, everyone! I'll be taking care of the design system.
                        </div>
                      </div>
                    </div>

                    <div class="comment-item reply-comment">
                      <div class="comment-avatar">
                        <v-avatar size="40">
                          <v-img src="https://i.pravatar.cc/40?img=2" />
                        </v-avatar>
                      </div>
                      <div class="comment-content">
                        <div class="comment-header">
                          <span class="comment-author">Anna F.</span>
                          <span class="comment-time">20 Sep 2024 | 09:01 AM</span>
                        </div>
                        <div class="comment-text">
                          Hi, Nico! That's great—now I can focus on the illustrations
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="comment-form">
                    <h4 class="form-title">Leave a comment</h4>
                    <v-textarea
                      v-model="comment"
                      variant="outlined"
                      placeholder="Enter your comment"
                      rows="3"
                      hide-details
                      class="comment-input"
                    />
                    <div class="form-actions">
                      <v-btn
                        icon
                        variant="text"
                        color="grey"
                      >
                        <v-icon>mdi-paperclip</v-icon>
                      </v-btn>
                      <v-btn
                        color="primary"
                        variant="elevated"
                        rounded="lg"
                        @click="submitComment"
                      >
                        <v-icon class="mr-2">mdi-send</v-icon>
                        Send
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>

            <!-- Right Column -->
            <v-col cols="12" md="4">
              <div class="project-card">
                <div class="card-header">
                  <h3 class="card-title">Skills</h3>
                  <p class="card-subtitle">Required expertise</p>
                </div>
                
                <div class="card-content">
                  <div class="skills-container">
                    <v-chip
                      v-for="(skill, index) in skills"
                      :key="index"
                      closable
                      color="primary"
                      variant="tonal"
                      size="small"
                      class="skill-chip"
                      @click:close="removeSkill(skill)"
                    >
                      {{ skill }}
                    </v-chip>
                    
                    <div v-if="showSkillInput" class="add-skill-form">
                      <v-text-field
                        v-model="newSkill"
                        density="compact"
                        variant="outlined"
                        hide-details
                        class="skill-input"
                        @keyup.enter="addSkill"
                      />
                      <v-btn
                        size="small"
                        color="primary"
                        variant="text"
                        @click="addSkill"
                      >
                        Add
                      </v-btn>
                    </div>
                    
                    <v-chip
                      v-else
                      variant="outlined"
                      size="small"
                      class="add-skill-chip"
                      @click="showSkillInput = true"
                    >
                      <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                      Add Skill
                    </v-chip>
                  </div>
                </div>
              </div>

              <div class="project-card">
                <div class="card-header">
                  <h3 class="card-title">Team Members</h3>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                    @click="showInviteModal = true"
                  >
                    <v-icon size="small" class="mr-1">mdi-account-plus</v-icon>
                    Invite
                  </v-btn>
                </div>
                
                <div class="card-content">
                  <div class="members-list">
                    <div
                      v-for="member in members"
                      :key="member.id"
                      class="member-item"
                    >
                      <div class="member-avatar">
                        <v-avatar size="40">
                          <v-img :src="member.avatar" />
                        </v-avatar>
                      </div>
                      <div class="member-info">
                        <div class="member-name">{{ member.name }}</div>
                      </div>
                      <div class="member-actions">
                        <v-btn
                          size="small"
                          color="warning"
                          variant="tonal"
                          rounded="lg"
                          class="mr-2"
                        >
                          Message
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="grey"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="project-card">
                <div class="card-header">
                  <h3 class="card-title">Attachments</h3>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                    @click="showUploadModal = true"
                  >
                    <v-icon size="small" class="mr-1">mdi-upload</v-icon>
                    Upload
                  </v-btn>
                </div>
                
                <div class="card-content">
                  <div class="attachments-list">
                    <div
                      v-for="attachment in attachments"
                      :key="attachment.id"
                      class="attachment-item"
                    >
                      <div class="attachment-icon-wrapper">
                        <v-icon color="primary">mdi-file-document</v-icon>
                      </div>
                      <div class="attachment-info">
                        <div class="attachment-name">{{ attachment.name }}</div>
                        <div class="attachment-size">{{ attachment.size }}</div>
                      </div>
                      <div class="attachment-actions">
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="primary"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          color="grey"
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>

    <!-- Upload Modal -->
    <v-dialog
      v-model="showUploadModal"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card rounded="xl" flat border>
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon class="mr-3" color="white">mdi-upload</v-icon>
            Upload File
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <div class="upload-options">
            <div
              class="upload-option"
              @click="uploadFile('computer')"
            >
              <div class="upload-icon-wrapper">
                <v-icon size="large" color="primary">mdi-laptop</v-icon>
              </div>
              <div class="upload-text">Upload from your computer</div>
            </div>
            
            <div
              class="upload-option"
              @click="uploadFile('drive')"
            >
              <div class="upload-icon-wrapper">
                <v-icon size="large" color="primary">mdi-google-drive</v-icon>
              </div>
              <div class="upload-text">Upload from Google Drive</div>
            </div>
          </div>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showUploadModal = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Invite Modal -->
    <v-dialog
      v-model="showInviteModal"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card rounded="xl" flat border>
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon class="mr-3" color="white">mdi-account-plus</v-icon>
            Invite Member
          </div>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-tabs v-model="inviteTab" color="primary">
            <v-tab value="email">Email</v-tab>
            <v-tab value="gmail">Gmail</v-tab>
            <v-tab value="app">App Users</v-tab>
          </v-tabs>
          
          <v-window v-model="inviteTab" class="mt-4">
            <v-window-item value="email">
              <v-text-field
                v-model="inviteEmail"
                label="Email Address"
                placeholder="Enter email address"
                variant="outlined"
                type="email"
              />
            </v-window-item>
            
            <v-window-item value="gmail">
              <div class="d-flex justify-center py-6">
                <v-btn
                  color="primary"
                  variant="outlined"
                  rounded="lg"
                >
                  <v-icon class="mr-2">mdi-google</v-icon>
                  Connect with Google
                </v-btn>
              </div>
            </v-window-item>
            
            <v-window-item value="app">
              <v-text-field
                placeholder="Search users..."
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                density="compact"
                class="mb-3"
              />
              
              <div class="users-list">
                <div
                  v-for="i in 5"
                  :key="i"
                  class="user-item"
                >
                  <v-avatar size="36" class="mr-3">
                    <v-img :src="`https://i.pravatar.cc/36?img=${i + 10}`" />
                  </v-avatar>
                  <div class="user-info">
                    <div class="user-name">User Name {{ i }}</div>
                    <div class="user-email">user{{ i }}@example.com</div>
                  </div>
                  <v-btn
                    size="small"
                    color="primary"
                    variant="text"
                  >
                    Add
                  </v-btn>
                </div>
              </div>
            </v-window-item>
          </v-window>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showInviteModal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            @click="inviteMember"
          >
            <v-icon class="mr-2">mdi-send</v-icon>
            Invite
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

export default {
  name: 'ProjectTask',
  components: { 
    LeftMenu,
    SearchBar
  },

  data() {
    return {
      skills: ['UI/UX', 'Adobe Ilustration', 'Figma', 'Adobe Photoshop', 'HTML', 'CSS'],
      newSkill: '',
      showSkillInput: false,
      
      members: [
        { id: 1, name: 'Maria K.', avatar: 'https://i.pravatar.cc/40?img=1' },
        { id: 2, name: 'Alex L.', avatar: 'https://i.pravatar.cc/40?img=2' },
        { id: 3, name: 'Lila N.', avatar: 'https://i.pravatar.cc/40?img=3' },
        { id: 4, name: 'Martin B.', avatar: 'https://i.pravatar.cc/40?img=4' },
        { id: 5, name: 'Niko W.', avatar: 'https://i.pravatar.cc/40?img=5' },
        { id: 6, name: 'Anna F.', avatar: 'https://i.pravatar.cc/40?img=6' },
        { id: 7, name: 'Maria H.', avatar: 'https://i.pravatar.cc/40?img=7' },
      ],
      
      files: [
        { id: 1, name: 'App pages.zip', size: '2.2MB' },
        { id: 2, name: 'Label Project', size: '2.4MB' },
      ],
      
      attachments: [
        { id: 1, name: 'App pages.zip', size: '2.2MB' },
        { id: 2, name: 'Design specs.pdf', size: '1.8MB' },
        { id: 3, name: 'Brand guidelines.ai', size: '3.1MB' },
        { id: 4, name: 'Logo variations.png', size: '856KB' },
      ],
      
      comment: '',
      
      showUploadModal: false,
      showInviteModal: false,
      inviteTab: 'email',
      inviteEmail: ''
    }
  },
  
  methods: {
    addSkill() {
      if (this.newSkill.trim()) {
        this.skills.push(this.newSkill.trim());
        this.newSkill = '';
        this.showSkillInput = false;
      }
    },
    
    removeSkill(skill) {
      this.skills = this.skills.filter(s => s !== skill);
    },
    
    uploadFile(source) {
      if (source === 'computer') {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (file) {
            this.attachments.push({
              id: this.attachments.length + 1,
              name: file.name,
              size: this.formatFileSize(file.size)
            });
          }
        };
        input.click();
      } else if (source === 'drive') {
        console.log('Google Drive upload');
      }
      
      this.showUploadModal = false;
    },
    
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + 'KB';
      return Math.round(bytes / (1024 * 1024) * 10) / 10 + 'MB';
    },
    
    inviteMember() {
      if (this.inviteTab === 'email' && this.inviteEmail.trim()) {
        console.log('Inviting via email:', this.inviteEmail);
        this.members.push({
          id: this.members.length + 1,
          name: this.inviteEmail.split('@')[0],
          avatar: `https://i.pravatar.cc/40?img=${this.members.length + 10}`
        });
        this.inviteEmail = '';
      }
      
      this.showInviteModal = false;
    },
    
    submitComment() {
      if (this.comment.trim()) {
        console.log('New comment:', this.comment);
        this.comment = '';
      }
    }
  }
}
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
.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0;
  font-weight: 400;
}

.hero-chips {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
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

.hero-btn-outline {
  border: 2px solid white !important;
  color: white !important;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-btn-outline:hover {
  background: white !important;
  color: #0D7C66 !important;
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

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.meta-divider {
  color: #cbd5e1;
  font-weight: 600;
}

/* Project Overview Grid */
.project-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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

.create-date-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.due-date-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.priority-icon {
  background: linear-gradient(135deg, #EF4444, #F87171);
}

.status-icon {
  background: linear-gradient(135deg, #8B5CF6, #A78BFA);
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

/* Project Cards */
.project-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: #0D7C66;
  box-shadow: 0 8px 25px rgba(13, 124, 102, 0.1);
}

.card-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.card-content {
  padding: 1.5rem;
}

/* Summary Section */
.summary-text {
  line-height: 1.6;
}

.main-description {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 2rem;
  line-height: 1.7;
}

.requirements-section,
.file-formats-section {
  margin-bottom: 2rem;
}

.requirements-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirement-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border-left: 3px solid #0D7C66;
}

.requirement-item:last-child {
  margin-bottom: 0;
}

.requirement-icon {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.requirement-item span {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.5;
}

/* Resources Grid */
.resources-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.resource-item:hover {
  border-color: #0D7C66;
  background: #f0fdfa;
}

.resource-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(13, 124, 102, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resource-info {
  flex: 1;
  min-width: 0;
}

.resource-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.resource-size {
  font-size: 0.75rem;
  color: #64748b;
}

.resource-actions {
  display: flex;
  gap: 0.5rem;
}

/* Comments Section */
.comments-section {
  margin-bottom: 2rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.reply-comment {
  margin-left: 3rem;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.comment-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.comment-text {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}

.comment-form {
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.form-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.comment-input {
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Skills Container */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.skill-chip {
  font-weight: 500;
}

.add-skill-form {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
}

.skill-input {
  flex: 1;
  min-width: 120px;
}

.add-skill-chip {
  cursor: pointer;
}

/* Members List */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.member-item:hover {
  border-color: #0D7C66;
  background: #f0fdfa;
}

.member-avatar {
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Attachments List */
.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.attachment-item:hover {
  border-color: #0D7C66;
  background: #f0fdfa;
}

.attachment-icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(13, 124, 102, 0.1);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.attachment-info {
  flex: 1;
  min-width: 0;
}

.attachment-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.attachment-size {
  font-size: 0.75rem;
  color: #64748b;
}

.attachment-actions {
  display: flex;
  gap: 0.5rem;
}

/* Modal Styles */
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

/* Upload Options */
.upload-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.upload-option:hover {
  border-color: #0D7C66;
  background: #f0fdfa;
}

.upload-icon-wrapper {
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
}

/* Users List */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
}

/* Animation */
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

.project-card {
  animation: fadeInUp 0.6s ease-out;
}

.project-card:nth-child(2) {
  animation-delay: 0.1s;
}

.project-card:nth-child(3) {
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
  
  .hero-actions {
    justify-content: center;
    width: 100%;
  }
  
  .hero-btn,
  .hero-btn-outline {
    flex: 1;
    min-width: 140px;
  }
  
  .project-overview-grid {
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
  
  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .meta-divider {
    display: none;
  }
  
  .reply-comment {
    margin-left: 1rem;
  }
  
  .member-actions {
    flex-direction: column;
    gap: 0.5rem;
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
  
  .card-header,
  .card-content {
    padding: 1rem;
  }
  
  .requirement-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .resource-item,
  .member-item,
  .attachment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .resource-actions,
  .member-actions,
  .attachment-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .comment-item {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .reply-comment {
    margin-left: 0;
    padding-left: 1rem;
    border-left: 2px solid #e2e8f0;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}

/* Touch-friendly improvements */
@media (max-width: 600px) {
  .skill-chip,
  .add-skill-chip {
    margin: 0.25rem;
  }
  
  .upload-option {
    padding: 1.5rem;
  }
  
  .users-list {
    max-height: 250px;
  }
}-section {
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

</style>