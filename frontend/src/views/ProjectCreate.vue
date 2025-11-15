<!-- ProjectManagement.vue -->
<template>
  <v-app>
    <!-- Left Sidebar -->
    <LeftMenu />
    <SearchBar />

    <!-- Main Content -->
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
                Create New <span class="gradient-text">Project</span>
              </h1>
              <p class="hero-subtitle">
                Build something amazing with your team
              </p>
            </div>
            <div class="hero-actions">
            </div>
          </div>
        </v-container>
      </div>

      <v-container
        fluid
        class="content-container px-6 pb-8"
      >
        <!-- Project Overview Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="primary"
              >
                mdi-view-dashboard
              </v-icon>
              <h2 class="section-heading">
                Project Overview
              </h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              Draft Project
            </v-chip>
          </div>
          
          <div class="project-overview-grid">
            <!-- Priority Card -->
            <div class="overview-item">
              <div class="overview-card priority-card">
                <div class="overview-icon-wrapper priority-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-flag
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Priority
                  </h3>
                  <div class="overview-amount">
                    {{ priority }}
                  </div>
                  <div class="overview-description">
                    Project importance
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Status Card -->
            <div class="overview-item">
              <div class="overview-card status-card">
                <div class="overview-icon-wrapper status-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-progress-check
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Status
                  </h3>
                  <div class="overview-amount">
                    {{ status }}
                  </div>
                  <div class="overview-description">
                    Current state
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Team Size Card -->
            <div class="overview-item">
              <div class="overview-card team-card">
                <div class="overview-icon-wrapper team-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-account-group
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Team Size
                  </h3>
                  <div class="overview-amount">
                    {{ teamMembers.length + 1 }}
                  </div>
                  <div class="overview-description">
                    Including team lead
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Category Card -->
            <div class="overview-item">
              <div class="overview-card category-card">
                <div class="overview-icon-wrapper category-icon">
                  <v-icon
                    class="overview-icon"
                    color="white"
                  >
                    mdi-tag
                  </v-icon>
                </div>
                <div class="overview-info">
                  <h3 class="overview-title">
                    Category
                  </h3>
                  <div class="overview-amount">
                    {{ category }}
                  </div>
                  <div class="overview-description">
                    Project type
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Details Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="warning"
              >
                mdi-clipboard-text
              </v-icon>
              <h2 class="section-heading">
                Project Details
              </h2>
            </div>
          </div>
          
          <v-form @submit.prevent="submitProject">
            <v-row>
              <!-- Left Column -->
              <v-col
                cols="12"
                md="8"
              >
                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Basic Information
                    </h3>
                  </div>
                  
                  <div class="card-content">
                    <div class="form-group">
                      <h4 class="field-label">
                        Project Title
                      </h4>
                      <v-text-field
                        v-model="projectTitle"
                        placeholder="Enter an engaging project title"
                        variant="outlined"
                        hide-details
                        class="custom-field"
                      />
                    </div>

                    <div class="form-group">
                      <h4 class="field-label">
                        Thumbnail Image
                      </h4>
                      <div
                        class="file-upload-area"
                        @click="() => thumbnailInput.click()"
                      >
                        <div
                          v-if="!thumbnailFile"
                          class="upload-placeholder"
                        >
                          <v-icon
                            size="48"
                            color="primary"
                          >
                            mdi-image-plus
                          </v-icon>
                          <div class="upload-text">
                            Click to upload thumbnail
                          </div>
                          <div class="upload-hint">
                            PNG, JPG up to 10MB
                          </div>
                        </div>
                        <div
                          v-else
                          class="upload-success"
                        >
                          <v-icon
                            size="48"
                            color="success"
                          >
                            mdi-check-circle
                          </v-icon>
                          <div class="upload-text">
                            {{ thumbnailFile.name }}
                          </div>
                          <div class="upload-hint">
                            Click to change
                          </div>
                        </div>
                      </div>
                      <input
                        ref="thumbnailInput"
                        type="file"
                        accept="image/*"
                        style="display: none"
                        @change="handleThumbnailChange"
                      >
                    </div>

                    <div class="form-group">
                      <h4 class="field-label">
                        Project Description
                      </h4>
                      <div class="editor-container">
                        <div class="editor-toolbar">
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            @click="formatText('bold')"
                          >
                            <v-icon>mdi-format-bold</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            @click="formatText('italic')"
                          >
                            <v-icon>mdi-format-italic</v-icon>
                          </v-btn>
                        </div>
                        <div
                          ref="descriptionTextarea"
                          class="rich-text-editor"
                          contenteditable="true"
                          @input="handleRichTextInput"
                          @focus="onEditorFocus"
                          @blur="onEditorBlur"
                          :data-placeholder="editorFocused || description ? '' : 'Describe your project goals, requirements, and expectations...'"
                        >
                        </div>
                      </div>
                    </div>

                    <v-row>
                      <v-col
                        cols="12"
                        sm="4"
                      >
                        <div class="form-group">
                          <h4 class="field-label">
                            Priority
                          </h4>
                          <v-select
                            v-model="priority"
                            :items="priorityOptions"
                            variant="outlined"
                            hide-details
                            class="custom-field"
                          />
                        </div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                      >
                        <div class="form-group">
                          <h4 class="field-label">
                            Status
                          </h4>
                          <v-select
                            v-model="status"
                            :items="statusOptions"
                            variant="outlined"
                            hide-details
                            class="custom-field"
                          />
                        </div>
                      </v-col>
                      <v-col
                        cols="12"
                        sm="4"
                      >
                        <div class="form-group">
                          <h4 class="field-label">
                            Deadline
                          </h4>
                          <v-text-field
                            v-model="deadline"
                            type="date"
                            variant="outlined"
                            hide-details
                            class="custom-field"
                          />
                        </div>
                      </v-col>
                    </v-row>
                  </div>
                </div>

                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Attached files
                    </h3>
                    <p class="card-subtitle">
                      Add Attached files here.
                    </p>
                  </div>
                  
                  <div class="card-content">
                    <div
                      class="file-drop-zone"
                      @drop="handleFileDrop"
                      @dragover.prevent
                      @dragenter="handleDragEnter"
                      @dragleave="handleDragLeave"
                      style="min-height: 200px; border: 3px dashed #2196F3; border-radius: 12px; transition: all 0.3s ease;"
                    >
                      <div class="drop-zone-content">
                        <v-icon
                          size="64"
                          color="primary"
                        >
                          mdi-cloud-upload
                        </v-icon>
                        <h4 class="drop-title">
                          Drop files here or click to upload.
                        </h4>
                        <p class="drop-subtitle">
                          
                        </p>
                        
                        <div class="upload-actions">
                          <v-btn 
                            color="primary"
                            variant="outlined"
                            rounded="lg"
                            class="mr-3"
                            @click="triggerFileInput"
                          >
                            <v-icon class="mr-2">
                              mdi-laptop
                            </v-icon>
                            Upload from Computer
                          </v-btn>
                        </div>
                      </div>
                    </div>

                    <!-- Uploaded Files List -->
                    <div
                      v-if="uploadedFiles.length > 0"
                      class="uploaded-files"
                    >
                      <h4 class="files-title">
                        Uploaded Files
                      </h4>
                      <div class="files-list">
                        <div
                          v-for="(file, index) in uploadedFiles"
                          :key="index"
                          class="file-item"
                        >
                          <div class="file-info">
                            <v-icon class="file-icon">
                              {{ getFileIcon(file.type) }}
                            </v-icon>
                            <div class="file-details">
                              <div class="file-name">
                                {{ file.name }}
                              </div>
                              <div class="file-size">
                                {{ formatFileSize(file.size) }}
                              </div>
                            </div>
                          </div>
                          <v-btn
                            icon
                            size="small"
                            variant="text"
                            color="error"
                            @click="removeFile(index)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </div>

                    <input
                      ref="computerFileInput"
                      type="file"
                      style="display: none"
                      multiple
                      @change="handleFileChange"
                    >
                    <input
                      ref="driveFileInput"
                      type="file"
                      style="display: none"
                      multiple
                      @change="handleDriveFileChange"
                    >
                  </div>
                </div>
              </v-col>

              <!-- Right Column -->
              <v-col
                cols="12"
                md="4"
              >
                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Project Settings
                    </h3>
                  </div>
                  
                  <div class="card-content">
                    <div class="form-group">
                      <h4 class="field-label">
                        Privacy
                      </h4>
                      <v-select
                        v-model="privacy"
                        :items="privacyOptions"
                        variant="outlined"
                        hide-details
                        class="custom-field"
                      />
                    </div>
                  </div>
                </div>

                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Tags & Categories
                    </h3>
                  </div>
                  
                  <div class="card-content">
                    <div class="form-group">
                      <h4 class="field-label">
                        Category
                      </h4>
                      <v-select
                        v-model="category"
                        :items="categoryOptions"
                        variant="outlined"
                        hide-details
                        class="custom-field"
                      />
                    </div>

                    <div class="form-group">
                      <h4 class="field-label">
                        Skills Required
                      </h4>
                      <div class="skills-container">
                        <v-chip
                          v-for="skill in skills"
                          :key="skill"
                          size="small"
                          color="primary"
                          variant="tonal"
                          closable
                          class="skill-chip"
                          @click:close="removeSkill(skill)"
                        >
                          {{ skill }}
                        </v-chip>
                      </div>
                      <div class="add-skill-form">
                        <v-text-field
                          v-model="newSkill"
                          placeholder="Add new skill"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="skill-input"
                          @keyup.enter="addSkill"
                        >
                          <template #append-inner>
                            <v-btn
                              icon
                              size="small"
                              color="primary"
                              variant="text"
                              @click="addSkill"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </template>
                        </v-text-field>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="project-card">
                  <div class="card-header">
                    <h3 class="card-title">
                      Team Management
                    </h3>
                  </div>
                  
                  <div class="card-content">
                    <div class="form-group">
                      <h4 class="field-label">
                        Team Lead
                      </h4>
                      <v-combobox
                        v-model="teamLead"
                        :items="teamLeadOptions"
                        variant="outlined"
                        hide-details
                        class="custom-field"
                        placeholder="Type name or select from team members"
                        clearable
                        :hint="teamMembers.length > 0 ? 'You can select from existing team members or type a name' : 'Add team members below to select from them'"
                        persistent-hint
                      />
                    </div>

                    <div class="form-group">
                      <h4 class="field-label">
                        Team Members
                      </h4>
                      <div class="team-members-section">
                        <div class="members-avatars">
                          <div
                            v-for="(member, index) in teamMembers"
                            :key="index"
                            class="member-wrapper"
                            :class="{ 'team-lead-member': member.name === teamLead }"
                          >
                            <v-avatar
                              size="40"
                              class="member-avatar"
                              :style="getDefaultAvatarStyle(member)"
                            >
                              <v-img 
                                v-if="member.profilePicture" 
                                :src="member.profilePicture" 
                                :alt="member.name"
                              />
                              <span v-else class="avatar-initials">
                                {{ getAvatarContent(member) }}
                              </span>
                            </v-avatar>
                            
                            <!-- Team Lead Crown Icon -->
                            <v-icon
                              v-if="member.name === teamLead"
                              size="16"
                              color="#FFD700"
                              class="team-lead-crown"
                            >
                              mdi-crown
                            </v-icon>
                            
                            <v-btn
                              icon
                              size="16"
                              color="error"
                              variant="elevated"
                              class="delete-member-btn"
                              @click="removeTeamMember(index)"
                            >
                              <v-icon size="12">mdi-close</v-icon>
                            </v-btn>
                          </div>
                          <v-btn
                            icon
                            size="40"
                            color="primary"
                            variant="outlined"
                            class="add-member-btn"
                            @click="showAddMemberForm = true"
                          >
                            <v-icon>mdi-plus</v-icon>
                          </v-btn>
                        </div>

                        <v-expand-transition>
                          <div
                            v-if="showAddMemberForm"
                            class="add-member-form"
                          >
                            <v-text-field
                              v-model="newMemberEmail"
                              label="Enter email to invite"
                              variant="outlined"
                              density="compact"
                              hide-details
                              class="member-email-field"
                            />
                            <div class="member-form-actions">
                              <v-btn 
                                size="small" 
                                color="grey" 
                                variant="text" 
                                @click="showAddMemberForm = false"
                              >
                                Cancel
                              </v-btn>
                              <v-btn 
                                size="small" 
                                color="primary" 
                                @click="addTeamMember"
                              >
                                Invite
                              </v-btn>
                            </div>
                          </div>
                        </v-expand-transition>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>

            <!-- Action Buttons -->
            <div class="action-section">
              <div class="action-buttons">
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="large"
                  rounded="lg"
                  type="submit"
                  class="action-btn create-btn"
                >
                  <v-icon class="mr-2">
                    mdi-rocket-launch
                  </v-icon>
                  Create Project
                </v-btn>
              </div>
            </div>
          </v-form>
        </div>
      </v-container>
    </v-main>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessPopup"
      :timeout="4000"
      color="success"
      location="top"
    >
      🎉 Project created successfully and added to your workspace!
      <template #actions>
        <v-btn
          variant="text"
          @click="showSuccessPopup = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
import { ProjectApiService } from '@/services/projectApi.service.js';
import notificationService from '@/services/notificationService.js';

const router = useRouter();

// Form data
const projectTitle = ref('');
const thumbnailFile = ref(null);
const description = ref('');
const priority = ref('high');
const status = ref('pending');
const deadline = ref('');
const privacy = ref('Private');
const category = ref('Designing');
const skills = ref(['UI/UX', 'CSS', 'HTML', 'Figma']);
const newSkill = ref('');
const teamLead = ref('');
const teamMembers = ref([]);
const newMemberEmail = ref('');
const showAddMemberForm = ref(false);
const showSuccessPopup = ref(false);
const uploadedFiles = ref([]);

// Options
const priorityOptions = [
  { title: 'High Priority', value: 'high' },
  { title: 'Medium Priority', value: 'medium' },
  { title: 'Low Priority', value: 'low' },
  { title: 'Urgent Priority', value: 'urgent' }
];

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
];

const privacyOptions = [
  { title: 'Private - Only team members', value: 'Private' },
  { title: 'Public - Anyone can view', value: 'Public' },
  { title: 'Team Only - Organization members', value: 'Team Only' }
];

const categoryOptions = [
  { title: 'UI/UX Designing', value: 'Designing' },
  { title: 'Web Development', value: 'Development' },
  { title: 'Digital Marketing', value: 'Marketing' },
  { title: 'Research & Analysis', value: 'Research' },
  { title: 'Content Creation', value: 'Content' }
];

// Team Lead options - dynamically generated from existing team members
const teamLeadOptions = computed(() => {
  const options = [];
  
  // Add existing team members as options
  teamMembers.value.forEach(member => {
    options.push({
      title: `${member.name} (${member.email})`,
      value: member.name
    });
  });
  
  // If there's a custom teamLead value that's not in team members, keep it
  if (teamLead.value && !options.find(opt => opt.value === teamLead.value)) {
    options.push({
      title: `${teamLead.value} (Custom)`,
      value: teamLead.value
    });
  }
  
  return options;
});

// File input refs
const thumbnailInput = ref(null);
const computerFileInput = ref(null);
const driveFileInput = ref(null);
const descriptionTextarea = ref(null);
const editorFocused = ref(false);

const triggerFileInput = () => {
  console.log('Triggering file input');
  
  if (computerFileInput.value) {
    // Reset the input first to allow re-selecting the same file
    computerFileInput.value.value = '';
    
    // Create a synthetic click event (some browsers prefer this)
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    computerFileInput.value.dispatchEvent(event);
    console.log('File input triggered successfully');
  } else {
    console.error('computerFileInput not found');
  }
};

// Component mounted
onMounted(() => {
  console.log('ProjectCreate component loaded and upload functionality ready');
  
  // Initialize rich text editor content
  if (descriptionTextarea.value && description.value) {
    descriptionTextarea.value.innerHTML = description.value;
  }
});

// Watch for team lead changes to automatically add them to team members
watch(teamLead, (newTeamLead) => {
  if (newTeamLead && newTeamLead.trim()) {
    setTimeout(() => {
      ensureTeamLeadInMembers();
    }, 100); // Small delay to allow for proper selection
  }
});

// Methods
const formatText = (format) => {
  console.log(`Applying ${format} formatting to text`);
  
  if (!descriptionTextarea.value) {
    console.error('Editor ref not available');
    return;
  }

  const editor = descriptionTextarea.value;
  
  // Focus the editor first
  editor.focus();
  
  // Use document.execCommand for rich text formatting (like Telegram)
  if (format === 'bold') {
    document.execCommand('bold', false, null);
  } else if (format === 'italic') {
    document.execCommand('italic', false, null);
  }
  
  // Update our description model with plain text version
  setTimeout(() => {
    updateDescriptionFromEditor();
  }, 10);
};

const handleRichTextInput = () => {
  updateDescriptionFromEditor();
};

const updateDescriptionFromEditor = () => {
  if (descriptionTextarea.value) {
    // Get the plain text content for our model
    description.value = descriptionTextarea.value.textContent || descriptionTextarea.value.innerText || '';
  }
};

const onEditorFocus = () => {
  editorFocused.value = true;
};

const onEditorBlur = () => {
  editorFocused.value = false;
};

// Generate default avatar colors based on gender
const getDefaultAvatarStyle = (member) => {
  if (member.profilePicture) {
    return {}; // Use the real profile picture
  }
  
  // Determine gender and assign colors
  const isWoman = member.gender === 'female' || member.gender === 'woman';
  const colors = isWoman ? ['#FF69B4', '#FF8C69'] : ['#4169E1', '#32CD32']; // Pink/Orange for women, Blue/Green for men
  
  // Use member ID or name to consistently pick a color
  const colorIndex = (member.id || member.name.length) % colors.length;
  
  return {
    backgroundColor: colors[colorIndex],
    color: 'white',
    fontWeight: 'bold'
  };
};

// Get avatar display content
const getAvatarContent = (member) => {
  if (member.profilePicture) {
    return member.profilePicture;
  }
  
  // Show first letter of name for default avatar
  return member.name ? member.name.charAt(0).toUpperCase() : '?';
};



const handleThumbnailChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    thumbnailFile.value = file;
    console.log('Thumbnail file selected:', file.name);
  }
};

const handleFileChange = (event) => {
  console.log('handleFileChange triggered');
  console.log('Event:', event);
  console.log('Files from event:', event.target.files);
  
  const files = Array.from(event.target.files);
  console.log('Files selected:', files.length, files.map(f => `${f.name} (${f.type}, ${f.size} bytes)`));
  
  if (files.length === 0) {
    console.log('No files selected');
    return;
  }
  
  const validFiles = validateFiles(files);
  console.log('Valid files after validation:', validFiles.length, validFiles.map(f => f.name));
  
  if (validFiles.length > 0) {
    uploadedFiles.value = [...uploadedFiles.value, ...validFiles];
    console.log('Total files after adding:', uploadedFiles.value.length);
    alert(`Successfully added ${validFiles.length} file(s)`);
  } else {
    console.log('No valid files to add');
  }
  
  // Clear the input so the same file can be selected again
  event.target.value = '';
};

const handleDriveFileChange = (event) => {
  const files = Array.from(event.target.files);
  const validFiles = validateFiles(files);
  uploadedFiles.value.push(...validFiles);
  console.log('Files selected from Google Drive:', validFiles.map(f => f.name));
};

const handleFileDrop = (event) => {
  event.preventDefault();
  console.log('Files dropped:', event.dataTransfer.files);
  
  const files = Array.from(event.dataTransfer.files);
  console.log('Processing dropped files:', files.map(f => `${f.name} (${f.type})`));
  
  const validFiles = validateFiles(files);
  
  if (validFiles.length > 0) {
    uploadedFiles.value = [...uploadedFiles.value, ...validFiles];
    console.log('Files added to uploadedFiles:', validFiles.map(f => f.name));
    alert(`✅ Successfully added ${validFiles.length} file(s)!`);
  }
  
  // Remove drag styling
  event.target.style.backgroundColor = '';
  event.target.style.borderColor = '';
};

const handleDragEnter = (event) => {
  event.preventDefault();
  event.target.style.backgroundColor = '#e3f2fd';
  event.target.style.borderColor = '#2196F3';
  console.log('Drag enter detected');
};

const handleDragLeave = (event) => {
  event.preventDefault();
  event.target.style.backgroundColor = '';
  event.target.style.borderColor = '';
  console.log('Drag leave detected');
};

const validateFiles = (files) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const validFiles = [];
  
  files.forEach(file => {
    console.log('Validating file:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    if (file.size > maxSize) {
      alert(`File "${file.name}" is too large. Maximum size is 5MB.`);
      return;
    }
    
    // Accept all files for now - validation will happen on server
    validFiles.push(file);
    console.log('File accepted:', file.name);
  });
  
  return validFiles;
};

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
  console.log('File removed, remaining files:', uploadedFiles.value.length);
};

const getFileIcon = (fileType) => {
  if (fileType.startsWith('image/')) return 'mdi-file-image';
  if (fileType.includes('pdf')) return 'mdi-file-pdf-box';
  if (fileType.includes('word')) return 'mdi-file-word';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'mdi-file-excel';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'mdi-file-powerpoint';
  return 'mdi-file-document';
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const addSkill = () => {
  if (newSkill.value && !skills.value.includes(newSkill.value)) {
    skills.value.push(newSkill.value);
    newSkill.value = '';
  }
};

const removeSkill = (skillToRemove) => {
  skills.value = skills.value.filter(skill => skill !== skillToRemove);
};

const addTeamMember = async () => {
  if (newMemberEmail.value) {
    try {
      // Try to fetch real user data from backend
      const response = await fetch(`http://localhost:3030/api/users/by-email/${newMemberEmail.value}`);
      
      let newMember;
      if (response.ok) {
        const userData = await response.json();
        newMember = {
          id: teamMembers.value.length + 1,
          name: userData.name || userData.fullName || newMemberEmail.value.split('@')[0],
          email: newMemberEmail.value,
          profilePicture: userData.profilePicture || userData.avatar || null,
          gender: userData.gender || 'unknown'
        };
      } else {
        // If user not found, create with basic info
        newMember = {
          id: teamMembers.value.length + 1,
          name: newMemberEmail.value.split('@')[0],
          email: newMemberEmail.value,
          profilePicture: null,
          gender: 'unknown' // Will get random color
        };
      }
      
      teamMembers.value.push(newMember);
      newMemberEmail.value = '';
      showAddMemberForm.value = false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to basic member info
      const newMember = {
        id: teamMembers.value.length + 1,
        name: newMemberEmail.value.split('@')[0],
        email: newMemberEmail.value,
        profilePicture: null,
        gender: 'unknown'
      };
      teamMembers.value.push(newMember);
      newMemberEmail.value = '';
      showAddMemberForm.value = false;
    }
  }
};

const removeTeamMember = (index) => {
  if (confirm(`Are you sure you want to remove ${teamMembers.value[index].name} from the team?`)) {
    const removedMember = teamMembers.value[index];
    teamMembers.value.splice(index, 1);
    
    // If the removed member was the team lead, clear the team lead
    if (teamLead.value === removedMember.name) {
      teamLead.value = '';
    }
    
    console.log(`Team member at index ${index} removed`);
  }
};

// Add team lead to team members if not already present
const ensureTeamLeadInMembers = () => {
  if (teamLead.value && teamLead.value.trim()) {
    const isAlreadyMember = teamMembers.value.some(member => 
      member.name.toLowerCase() === teamLead.value.toLowerCase()
    );
    
    if (!isAlreadyMember) {
      const leadAsMember = {
        id: teamMembers.value.length + 1,
        name: teamLead.value,
        email: `${teamLead.value.toLowerCase().replace(/\s+/g, '.')}@company.com`, // Placeholder email
        profilePicture: null,
        gender: 'unknown',
        isTeamLead: true
      };
      teamMembers.value.unshift(leadAsMember); // Add at the beginning
    }
  }
};

const submitProject = async () => {
  try {
    if (!projectTitle.value.trim() || !description.value.trim()) {
      alert('Project title and description are required.');
      return;
    }
    
    // Create project first
    const projectData = {
      title: projectTitle.value.trim(),
      description: description.value.trim(),
      priority: priority.value || 'medium',
      status: status.value || 'pending',
      deadline: deadline.value ? deadline.value : undefined
    };
    
    const createdProject = await ProjectApiService.create(projectData);
    
    // Upload files if any
    if (uploadedFiles.value.length > 0 || thumbnailFile.value) {
      const filesToUpload = [...uploadedFiles.value];
      if (thumbnailFile.value) {
        filesToUpload.push(thumbnailFile.value);
      }
      
      // Upload each file
      for (const file of filesToUpload) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch(`http://localhost:3030/api/projects/${createdProject.id}/files`, {
            method: 'POST',
            body: formData
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            console.error(`Failed to upload ${file.name}:`, result.message);
            alert(`Failed to upload ${file.name}: ${result.message}`);
          } else {
            console.log(`✅ Successfully uploaded ${file.name}:`, result.message);
          }
        } catch (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          alert(`Error uploading ${file.name}. Please try again.`);
        }
      }
    }
    
    // Add notification for project creation
    notificationService.addProjectNotification(projectTitle.value.trim(), 'created');
    
    showSuccessPopup.value = true;
    setTimeout(() => {
      router.push('/projects');
    }, 2000);
  } catch (error) {
    alert(error.message || 'Failed to create project. Please try again.');
  }
};
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

.priority-icon {
  background: linear-gradient(135deg, #EF4444, #F87171);
}

.status-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.team-icon {
  background: linear-gradient(135deg, #3B82F6, #60A5FA);
}

.category-icon {
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
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.card-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.card-content {
  padding: 1.5rem;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.field-label {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.custom-field {
  background: white;
}

.custom-field :deep(.v-field) {
  border-radius: 0.5rem;
}

.custom-textarea {
  background: white;
}

.custom-textarea :deep(.v-field) {
  border-radius: 0.5rem;
}

/* Rich Text Editor */
.rich-text-editor {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 16px;
  background: white;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
  transition: border-color 0.3s ease;
  position: relative;
}

.rich-text-editor:focus {
  border-color: #0D7C66;
  box-shadow: 0 0 0 2px rgba(13, 124, 102, 0.1);
}

.rich-text-editor:empty::before {
  content: attr(data-placeholder);
  color: #999;
  font-style: italic;
  pointer-events: none;
}

.rich-text-editor b,
.rich-text-editor strong {
  font-weight: bold;
}

.rich-text-editor i,
.rich-text-editor em {
  font-style: italic;
}

.rich-text-editor p {
  margin: 0;
  padding: 0;
}

.rich-text-editor br {
  line-height: 1.5;
}

/* File Upload Areas */
.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.file-upload-area:hover {
  border-color: #0D7C66;
  background: #f0fdfa;
}

.upload-placeholder,
.upload-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-text {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.upload-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Editor Container */
.editor-container {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

/* File Drop Zone */
.file-drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(13, 124, 102, 0.02), rgba(65, 179, 162, 0.02));
}

.file-drop-zone:hover {
  border-color: #0D7C66;
  background: linear-gradient(135deg, rgba(13, 124, 102, 0.05), rgba(65, 179, 162, 0.05));
}

.drop-zone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.drop-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.drop-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.upload-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

/* Uploaded Files */
.uploaded-files {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.files-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-icon {
  font-size: 1.5rem;
  color: #0D7C66;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.file-size {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Skills Container */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.skill-chip {
  font-weight: 500;
}

.add-skill-form {
  margin-top: 0.5rem;
}

.skill-input {
  background: white;
}

/* Team Members Section */
.team-members-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.members-avatars {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.member-wrapper {
  position: relative;
  display: inline-block;
}

.member-avatar {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.member-wrapper:hover .member-avatar {
  transform: scale(0.95);
  opacity: 0.8;
}

.delete-member-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 16px !important;
  width: 16px !important;
  height: 16px !important;
  background: #f44336 !important;
  color: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
}

.member-wrapper:hover .delete-member-btn {
  opacity: 1;
}

.delete-member-btn:hover {
  background: #d32f2f !important;
  transform: scale(1.1);
}

.team-lead-member .member-avatar {
  border: 2px solid #FFD700 !important;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3) !important;
}

.team-lead-crown {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 15;
}

.avatar-initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: bold;
}

.add-member-btn {
  border: 2px dashed #cbd5e1;
  background: #f8fafc !important;
}

.add-member-btn:hover {
  border-color: #0D7C66;
  background: #f0fdfa !important;
}

.add-member-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.member-email-field {
  background: white;
}

.member-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Action Section */
.action-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.action-btn {
  font-weight: 600;
  min-width: 140px;
}

.create-btn {
  background: linear-gradient(135deg, #0D7C66, #41B3A2) !important;
  color: white !important;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(13, 124, 102, 0.3);
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
  
  .upload-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-btn {
    min-width: unset;
    width: 100%;
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
  
  .file-drop-zone {
    padding: 2rem 1rem;
  }
  
  .drop-title {
    font-size: 1.125rem;
  }
  
  .upload-actions {
    gap: 0.5rem;
  }
  
  .members-avatars {
    justify-content: center;
  }
}
</style>