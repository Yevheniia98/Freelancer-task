<template>
  <v-app>
    <!-- Only include the LeftMenu component, no other sidebar -->
    <LeftMenu />
    
    <!-- Adjust main content to properly account for sidebar -->
    <v-main style="padding-left: 80px !important;">
      <!-- Header -->
      <v-card class="mb-4 mt-4 mx-4">
        <v-card-item>
          <div class="d-flex align-center">
            <div class="mr-4 bg-white rounded-circle pa-2">
              <div
                class="bg-black rounded d-flex flex-column pa-2"
                style="width: 32px; height: 32px;"
              >
                <div class="d-flex">
                  <div
                    class="white rounded-sm mr-1"
                    style="width: 8px; height: 8px;"
                  />
                  <div
                    class="white rounded-sm"
                    style="width: 8px; height: 8px;"
                  />
                </div>
                <div class="d-flex mt-1">
                  <div
                    class="white rounded-sm mr-1"
                    style="width: 8px; height: 8px;"
                  />
                  <div
                    class="white rounded-sm"
                    style="width: 8px; height: 8px;"
                  />
                </div>
              </div>
            </div>
            
            <div class="flex-grow-1">
              <h1 class="text-h5 font-weight-bold">
                Slack brand logo design
              </h1>
              <div class="d-flex align-center text-caption text-grey">
                <span class="mr-4">Themes brand</span>
                <span class="mr-4">Create Date: 10 Jul, 2024</span>
                <span>Due date: 20 Jul, 2024</span>
                <v-chip
                  class="ml-4"
                  color="light-green"
                  size="small"
                  label
                >
                  New
                </v-chip>
                <v-chip
                  class="ml-2"
                  color="pink-lighten-4"
                  size="small"
                  label
                >
                  High
                </v-chip>
              </div>
            </div>
            
            <div class="d-flex">
              <v-btn
                icon="mdi-star-outline"
                variant="text"
                color="grey"
              />
              <v-btn
                icon="mdi-share-variant-outline"
                variant="text"
                color="grey"
              />
            </div>
          </div>
        </v-card-item>
      </v-card>
      
      <v-row class="mx-2">
        <v-col
          cols="12"
          md="8"
        >
          <!-- Summary -->
          <v-card class="mb-4">
            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold">
                SUMMARY
              </v-card-title>
              
              <v-card-text>
                <p class="text-body-1 mb-4">
                  Create a logo that reflects the brand's identity using Slack's modern, clean, and
                  vibrant design principles as inspiration.
                </p>
                
                <ul class="pa-0">
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>The logo should convey collaboration, innovation, and inclusivity.
                      Consider the values of connectivity, communication, and approachability.</span>
                  </li>
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>The target audience is tech-savvy professionals and teams looking for a
                      seamless communication tool.</span>
                  </li>
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>Use vibrant yet harmonious colors, similar to Slack's multi-color design but
                      unique to the brand.</span>
                  </li>
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>Explore clean, sans-serif fonts that are legible and modern.</span>
                  </li>
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>Integrate shapes that evoke connection (e.g., intersecting shapes, dots, or
                      patterns symbolizing team synergy).</span>
                  </li>
                </ul>
                
                <h3 class="text-h6 font-weight-medium mt-6 mb-2">
                  File Formats
                </h3>
                <ul class="pa-0">
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>Editable vector files (AI, EPS).</span>
                  </li>
                  <li class="d-flex mb-2">
                    <span class="mr-2">•</span>
                    <span>High-resolution PNG and SVG.</span>
                  </li>
                </ul>
                
                <v-row class="mt-6">
                  <v-col
                    cols="12"
                    sm="3"
                  >
                    <div class="text-caption text-grey">
                      CREATE DATE:
                    </div>
                    <div class="text-body-2">
                      10 Jul, 2024
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="3"
                  >
                    <div class="text-caption text-grey">
                      DUE DATE:
                    </div>
                    <div class="text-body-2">
                      20 Jul, 2024
                    </div>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="3"
                  >
                    <div class="text-caption text-grey">
                      PRIORITY:
                    </div>
                    <v-chip
                      class="mt-1"
                      color="pink-lighten-4"
                      size="small"
                      label
                    >
                      High
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="3"
                  >
                    <div class="text-caption text-grey">
                      STATUS:
                    </div>
                    <v-chip
                      class="mt-1"
                      color="amber-lighten-3"
                      size="small"
                      label
                    >
                      In progress
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-item>
          </v-card>
          
          <!-- Resources -->
          <v-card class="mb-4">
            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold">
                RESOURCES
              </v-card-title>
              
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="file in files"
                    :key="file.id"
                    cols="12"
                    sm="6"
                  >
                    <v-card
                      variant="outlined"
                      class="d-flex align-center pa-3"
                    >
                      <div class="bg-grey-lighten-3 pa-2 rounded mr-3">
                        <v-icon>mdi-file-outline</v-icon>
                      </div>
                      <div class="flex-grow-1">
                        <div class="font-weight-medium">
                          {{ file.name }}
                        </div>
                        <div class="text-caption text-grey">
                          {{ file.size }}
                        </div>
                      </div>
                      <div>
                        <v-btn
                          icon="mdi-download"
                          variant="text"
                          density="comfortable"
                          color="grey"
                        />
                        <v-btn
                          icon="mdi-dots-vertical"
                          variant="text"
                          density="comfortable"
                          color="grey"
                        />
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card-item>
          </v-card>
          
          <!-- Comments -->
          <v-card>
            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold">
                Comments
              </v-card-title>
              
              <v-card-text>
                <div class="mb-6">
                  <div class="d-flex mb-6">
                    <v-avatar
                      class="mr-3"
                      size="40"
                    >
                      <v-img
                        src="https://i.pravatar.cc/40?img=1"
                        alt="User"
                      />
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="d-flex align-center mb-1">
                        <span class="font-weight-medium mr-2">Nico W.</span>
                        <span class="text-caption text-grey">20 Sep 2024 | 08:25 AM</span>
                      </div>
                      <p class="text-body-2 text-grey-darken-1">
                        Hi, everyone! I'll be taking care of the design system.
                      </p>
                    </div>
                  </div>
                  
                  <div class="d-flex ml-12">
                    <v-avatar
                      class="mr-3"
                      size="40"
                    >
                      <v-img
                        src="https://i.pravatar.cc/40?img=2"
                        alt="User"
                      />
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="d-flex align-center mb-1">
                        <span class="font-weight-medium mr-2">Anna F.</span>
                        <span class="text-caption text-grey">20 Sep 2024 | 09:01 AM</span>
                      </div>
                      <p class="text-body-2 text-grey-darken-1">
                        Hi, Nico! That's great—now I can focus on the illustrations
                      </p>
                    </div>
                  </div>
                </div>
                
                <h3 class="text-subtitle-1 font-weight-medium mb-2">
                  Leave a comment
                </h3>
                <v-textarea
                  v-model="comment"
                  variant="outlined"
                  placeholder="Enter your comment"
                  rows="3"
                  class="mb-3"
                  hide-details
                />
                
                <div class="d-flex justify-end">
                  <v-btn
                    icon="mdi-paperclip"
                    variant="text"
                    class="mr-2"
                  />
                  <v-btn
                    color="teal"
                    prepend-icon="mdi-send"
                    @click="submitComment"
                  >
                    Send
                  </v-btn>
                </div>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
        
        <v-col
          cols="12"
          md="4"
        >
          <!-- Skills -->
          <v-card class="mb-4">
            <v-card-item>
              <v-card-title class="text-h6 font-weight-bold">
                Skills
              </v-card-title>
              
              <v-card-text>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="(skill, index) in skills"
                    :key="index"
                    closable
                    color="teal-lighten-4"
                    variant="flat"
                    @click:close="removeSkill(skill)"
                  >
                    {{ skill }}
                  </v-chip>
                  
                  <div v-if="showSkillInput">
                    <v-text-field
                      v-model="newSkill"
                      density="compact"
                      variant="outlined"
                      class="skill-input"
                      hide-details
                      style="width: 120px;"
                      @keyup.enter="addSkill"
                    />
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      class="ml-1"
                      @click="addSkill"
                    >
                      Add
                    </v-btn>
                  </div>
                  
                  <v-chip
                    v-else
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    @click="showSkillInput = true"
                  >
                    Add
                  </v-chip>
                </div>
              </v-card-text>
            </v-card-item>
          </v-card>
          
          <!-- Members -->
          <v-card class="mb-4">
            <v-card-item>
              <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h6 font-weight-bold">
                  Members
                </v-card-title>
                <v-btn
                  prepend-icon="mdi-account-plus"
                  color="primary"
                  variant="text"
                  @click="showInviteModal = true"
                >
                  Invite Member
                </v-btn>
              </div>
              
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="member in members"
                    :key="member.id"
                    :title="member.name"
                  >
                    <template #prepend>
                      <v-avatar size="40">
                        <v-img
                          :src="member.avatar"
                          alt="Member"
                        />
                      </v-avatar>
                    </template>
                    
                    <template #append>
                      <v-btn
                        color="amber-lighten-3"
                        variant="flat"
                        size="small"
                        class="mr-2"
                      >
                        Message
                      </v-btn>
                      <v-btn
                        icon="mdi-dots-vertical"
                        variant="text"
                        density="comfortable"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card-item>
          </v-card>
          
          <!-- Attachments -->
          <v-card>
            <v-card-item>
              <div class="d-flex justify-space-between align-center">
                <v-card-title class="text-h6 font-weight-bold">
                  Attachments
                </v-card-title>
                <v-btn
                  prepend-icon="mdi-upload"
                  color="teal"
                  variant="text"
                  @click="showUploadModal = true"
                >
                  Upload
                </v-btn>
              </div>
              
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="attachment in attachments"
                    :key="attachment.id"
                    :title="attachment.name"
                    :subtitle="attachment.size"
                  >
                    <template #prepend>
                      <v-avatar
                        color="teal-lighten-4"
                        class="rounded"
                      >
                        <v-icon color="teal">
                          mdi-file-outline
                        </v-icon>
                      </v-avatar>
                    </template>
                    
                    <template #append>
                      <v-btn
                        icon="mdi-download"
                        variant="text"
                        density="comfortable"
                      />
                      <v-btn
                        icon="mdi-dots-vertical"
                        variant="text"
                        density="comfortable"
                      />
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
    
    <!-- Upload Modal -->
    <v-dialog
      v-model="showUploadModal"
      max-width="500"
    >
      <v-card>
        <v-card-title>Upload File</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-btn
                block
                height="120"
                variant="outlined"
                color="grey"
                class="text-center border-dashed d-flex flex-column justify-center"
                @click="uploadFile('computer')"
              >
                <v-icon
                  size="large"
                  class="mb-2"
                >
                  mdi-upload
                </v-icon>
                <span>Upload from your computer</span>
              </v-btn>
            </v-col>
            
            <v-col cols="12">
              <v-btn
                block
                height="120"
                variant="outlined"
                color="grey"
                class="text-center border-dashed d-flex flex-column justify-center"
                @click="uploadFile('drive')"
              >
                <v-icon
                  size="large"
                  class="mb-2"
                  color="primary"
                >
                  mdi-google-drive
                </v-icon>
                <span>Upload from Google Drive</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
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
      max-width="500"
    >
      <v-card>
        <v-card-title>Invite Member</v-card-title>
        <v-card-text>
          <v-tabs v-model="inviteTab">
            <v-tab value="email">
              Email
            </v-tab>
            <v-tab value="gmail">
              Gmail
            </v-tab>
            <v-tab value="app">
              App Users
            </v-tab>
          </v-tabs>
          
          <v-window
            v-model="inviteTab"
            class="mt-4"
          >
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
                  prepend-icon="mdi-google"
                  variant="outlined"
                >
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
                class="mb-2"
              />
              
              <v-list
                class="overflow-y-auto"
                max-height="220"
                bg-color="grey-lighten-5"
              >
                <v-list-item
                  v-for="i in 5"
                  :key="i"
                  :title="`User Name ${i}`"
                  :subtitle="`user${i}@example.com`"
                >
                  <template #prepend>
                    <v-avatar size="36">
                      <v-img
                        src="https://i.pravatar.cc/36"
                        alt="User"
                      />
                    </v-avatar>
                  </template>
                  
                  <template #append>
                    <v-btn
                      color="primary"
                      variant="text"
                      size="small"
                    >
                      Add
                    </v-btn>
                  </template>
                </v-list-item>
              </v-list>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            @click="showInviteModal = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="inviteMember"
          >
            Invite
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import LeftMenu from '@/components/dashboard/LeftMenu.vue';

export default {
  name: 'ProjectManagementUI',
  components: { 
    LeftMenu
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
        { id: 2, name: 'App pages.zip', size: '2.2MB' },
        { id: 3, name: 'App pages.zip', size: '2.2MB' },
        { id: 4, name: 'App pages.zip', size: '2.2MB' },
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
      // In a real app, this would handle file upload from computer or Google Drive
      if (source === 'computer') {
        // Trigger file input
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
        // Google Drive integration would go here
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
        // In a real app, this would send an invitation email
        console.log('Inviting via email:', this.inviteEmail);
        // Add new member to the list
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
        // In a real app, this would add the comment to the database
        console.log('New comment:', this.comment);
        this.comment = '';
      }
    }
  }
}
</script>

<style>
.border-dashed {
  border-style: dashed !important;
}

/* Custom margin and padding for this page */
.v-main {
  padding-left: 80px !important;
}

@media (min-width: 1264px) {
  .v-navigation-drawer--expand-on-hover:hover + .v-main {
    padding-left: 256px !important;
    transition: padding-left 0.3s;
  }
}
</style>