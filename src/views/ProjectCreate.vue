<!-- ProjectManagement.vue -->
<template>
    <v-app>
      <!-- Left Sidebar -->
      <LeftMenu />
  
      <!-- Main Content -->
      <v-main>
        <v-container fluid>
          <!-- Header -->
          <v-row class="px-4 py-2">
            <v-col cols="6">
              <h1 class="text-h5 font-weight-bold">CREATE NEW PROJECT</h1>
            </v-col>
            <v-col cols="6" class="d-flex justify-end align-center">
              <v-text-field
                density="compact"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="mr-4"
                style="max-width: 200px"
              ></v-text-field>
              <v-btn icon variant="text" color="primary" class="mr-2">
                <v-icon>mdi-earth</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="amber">
                <v-icon>mdi-bell</v-icon>
              </v-btn>
            </v-col>
          </v-row>
  
          <v-form @submit.prevent="submitProject">
            <v-row>
              <!-- Left Column -->
              <v-col cols="12" md="8">
                <v-card class="mb-4 pa-4">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Project Title</h3>
                  <v-text-field
                    v-model="projectTitle"
                    placeholder="Enter Project Title"
                    variant="outlined"
                    hide-details
                    class="mb-4"
                  ></v-text-field>
  
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Thumbnail Image</h3>
                  <v-file-input
                    v-model="thumbnailFile"
                    placeholder="Choose file"
                    prepend-icon=""
                    variant="outlined"
                    hide-details
                    class="mb-4"
                    :hint="thumbnailFile ? thumbnailFile.name : 'No file chosen'"
                    persistent-hint
                  >
                    <template v-slot:selection="{ fileNames }">
                      <span>{{ fileNames[0] }}</span>
                    </template>
                  </v-file-input>
  
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Project description</h3>
                  <v-card class="mb-2">
                    <v-toolbar density="compact" color="grey-lighten-4">
                      <v-btn icon @click="formatText('bold')">
                        <v-icon>mdi-format-bold</v-icon>
                      </v-btn>
                      <v-btn icon @click="formatText('italic')">
                        <v-icon>mdi-format-italic</v-icon>
                      </v-btn>
                      <v-btn icon @click="insertLink">
                        <v-icon>mdi-link</v-icon>
                      </v-btn>
                      <v-btn icon @click="insertImage">
                        <v-icon>mdi-image</v-icon>
                      </v-btn>
                    </v-toolbar>
                    <v-textarea
                      v-model="description"
                      variant="plain"
                      hide-details
                      rows="8"
                      no-resize
                      placeholder="Enter project description"
                      class="pa-2"
                    ></v-textarea>
                  </v-card>
  
                  <v-row class="mt-4">
                    <v-col cols="4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">Priority</h3>
                      <v-select
                        v-model="priority"
                        :items="['High', 'Medium', 'Low']"
                        variant="outlined"
                        hide-details
                      ></v-select>
                    </v-col>
                    <v-col cols="4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">Status</h3>
                      <v-select
                        v-model="status"
                        :items="['Inprogress', 'Pending', 'Completed']"
                        variant="outlined"
                        hide-details
                      ></v-select>
                    </v-col>
                    <v-col cols="4">
                      <h3 class="text-subtitle-1 font-weight-bold mb-2">Deadline</h3>
                      <v-text-field
                        v-model="deadline"
                        type="date"
                        variant="outlined"
                        hide-details
                        placeholder="Enter due date"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
  
                <v-card class="pa-4">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Attached files</h3>
                  <p class="text-body-2 text-grey">Add Attached files here.</p>
                  
                  <v-card class="border-dashed pa-8 d-flex flex-column align-center justify-center" height="200" variant="outlined">
                    <v-icon size="48" color="grey">mdi-cloud-upload</v-icon>
                    <p class="text-body-1 mt-2">Drop files here or click to upload.</p>
                    <v-row class="mt-4">
                      <v-col cols="6">
                        <v-btn 
                          block 
                          variant="outlined" 
                          color="primary"
                          @click="triggerFileUpload('computer')"
                        >
                          Upload from Computer
                        </v-btn>
                        <input
                          ref="computerFileInput"
                          type="file"
                          style="display: none"
                          @change="handleFileChange"
                          multiple
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-btn 
                          block 
                          variant="outlined" 
                          color="primary"
                          @click="triggerFileUpload('drive')"
                        >
                          Upload from Google Drive
                        </v-btn>
                        <input
                          ref="driveFileInput"
                          type="file"
                          style="display: none"
                          @change="handleDriveFileChange"
                          multiple
                        />
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card>
              </v-col>
  
              <!-- Right Column -->
              <v-col cols="12" md="4">
                <v-card class="mb-4 pa-4">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Privacy</h3>
                  <v-select
                    v-model="privacy"
                    :items="['Private', 'Public', 'Team Only']"
                    variant="outlined"
                    hide-details
                    class="mb-4"
                  ></v-select>
                </v-card>
  
                <v-card class="mb-4 pa-4">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Tags</h3>
                  <h4 class="text-body-1 font-weight-medium mb-1">Categories</h4>
                  <v-select
                    v-model="category"
                    :items="['Designing', 'Development', 'Marketing', 'Research']"
                    variant="outlined"
                    hide-details
                    class="mb-4"
                  ></v-select>
  
                  <h4 class="text-body-1 font-weight-medium mb-1">Skills</h4>
                  <div class="d-flex flex-wrap mb-2">
                    <v-chip
                      v-for="skill in skills"
                      :key="skill"
                      class="ma-1"
                      closable
                      @click:close="removeSkill(skill)"
                    >
                      {{ skill }}
                    </v-chip>
                  </div>
                  <div class="d-flex">
                    <v-text-field
                      v-model="newSkill"
                      placeholder="Add new skill"
                      variant="outlined"
                      density="compact"
                      hide-details
                      class="flex-grow-1 mr-2"
                      @keyup.enter="addSkill"
                    ></v-text-field>
                    <v-btn color="primary" icon @click="addSkill">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </v-card>
  
                <v-card class="pa-4">
                  <h3 class="text-subtitle-1 font-weight-bold mb-2">Members</h3>
                  <h4 class="text-body-1 font-weight-medium mb-1">Team lead</h4>
                  <v-select
                    v-model="teamLead"
                    :items="['Ellen Smith', 'John Doe', 'Jane Smith']"
                    variant="outlined"
                    hide-details
                    class="mb-4"
                  ></v-select>
  
                  <h4 class="text-body-1 font-weight-medium mb-1">Team Members</h4>
                  <div class="d-flex align-center mb-2">
                    <v-avatar
                      v-for="(member, index) in teamMembers"
                      :key="index"
                      size="40"
                      class="mr-1"
                    >
                      <v-img :src="`https://randomuser.me/api/portraits/men/${index + 5}.jpg`"></v-img>
                    </v-avatar>
                    <v-btn size="small" icon variant="text" color="primary" @click="showAddMemberForm = true">
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
  
                  <v-expand-transition>
                    <div v-if="showAddMemberForm">
                      <v-text-field
                        v-model="newMemberEmail"
                        label="Enter email to invite"
                        variant="outlined"
                        density="compact"
                        hide-details
                        class="mb-2"
                      ></v-text-field>
                      <div class="d-flex justify-end">
                        <v-btn 
                          size="small" 
                          color="grey" 
                          variant="text" 
                          class="mr-2"
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
                </v-card>
              </v-col>
            </v-row>
  
            <v-row class="mt-4">
              <v-col cols="12" class="d-flex">
                <v-btn color="grey" variant="outlined" class="mr-4">Delete</v-btn>
                <v-btn color="teal" type="submit">Create</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-main>
  
      <!-- Success Popup -->
      <v-snackbar
        v-model="showSuccessPopup"
        timeout="3000"
        color="success"
        location="top"
      >
        Project created successfully and added to "New Task" column!
      </v-snackbar>
    </v-app>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import LeftMenu from './components/dashboard/LeftMenu.vue';
  
  // Form data
  const projectTitle = ref('');
  const thumbnailFile = ref(null);
  const description = ref('We are looking for a skilled UI/UX designer to redesign our landing page, focusing on creating a modern, visually appealing, and user-friendly experience. The design should enhance usability, highlight key elements effectively, and align with our brand identity. Your work should guide users smoothly to the call-to-action, improving engagement and conversions.\nRequirements:\n- Create a clean, responsive, and attractive design.\n- Focus on improving structure, usability, and interactivity.\n- Deliver wireframes/mockups and final design files (Figma or Adobe XD).\n- Experience with designing high-conversion landing pages is preferred.');
  const priority = ref('High');
  const status = ref('Inprogress');
  const deadline = ref('');
  const privacy = ref('Private');
  const category = ref('Designing');
  const skills = ref(['UI/UX', 'CSS', 'HTML']);
  const newSkill = ref('');
  const teamLead = ref('Ellen Smith');
  const teamMembers = ref([
    { id: 1, name: 'Team Member 1' },
    { id: 2, name: 'Team Member 2' },
    { id: 3, name: 'Team Member 3' }
  ]);
  const newMemberEmail = ref('');
  const showAddMemberForm = ref(false);
  const showSuccessPopup = ref(false);
  
  // File input refs
  const computerFileInput = ref(null);
  const driveFileInput = ref(null);
  
  // Methods
  const formatText = (format) => {
    // In a real app, this would format the text in the textarea
    console.log(`Applying ${format} formatting to text`);
    
    // Simple implementation example:
    if (format === 'bold') {
      description.value = `**${description.value}**`;
    } else if (format === 'italic') {
      description.value = `*${description.value}*`;
    }
  };
  
  const insertLink = () => {
    // In a real app, this would open a dialog to insert a link
    const url = prompt('Enter URL:');
    if (url) {
      description.value += ` [Link](${url})`;
    }
  };
  
  const insertImage = () => {
    // In a real app, this would open a dialog to insert an image
    const url = prompt('Enter image URL:');
    if (url) {
      description.value += ` ![Image](${url})`;
    }
  };
  
  const triggerFileUpload = (source) => {
    if (source === 'computer') {
      computerFileInput.value.click();
    } else if (source === 'drive') {
      // In a real app, this would open Google Drive picker
      // For demo purposes, we'll just use the file input
      driveFileInput.value.click();
    }
  };
  
  const handleFileChange = (event) => {
    // Handle file upload from computer
    const files = event.target.files;
    if (files.length > 0) {
      console.log('Files selected from computer:', Array.from(files).map(f => f.name));
      // In a real app, you would upload these files to your server
    }
  };
  
  const handleDriveFileChange = (event) => {
    // Handle file upload from Google Drive
    const files = event.target.files;
    if (files.length > 0) {
      console.log('Files selected from Google Drive:', Array.from(files).map(f => f.name));
      // In a real app, you would handle these files differently
    }
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
  
  const addTeamMember = () => {
    if (newMemberEmail.value) {
      // In a real app, you would send an invitation to this email
      const newMember = {
        id: teamMembers.value.length + 1,
        name: newMemberEmail.value // Using email as name for simplicity
      };
      teamMembers.value.push(newMember);
      newMemberEmail.value = '';
      showAddMemberForm.value = false;
    }
  };
  
  const submitProject = () => {
    // In a real app, you would save the project data to your backend
    console.log({
      projectTitle: projectTitle.value,
      thumbnailFile: thumbnailFile.value,
      description: description.value,
      priority: priority.value,
      status: status.value,
      deadline: deadline.value,
      privacy: privacy.value,
      category: category.value,
      skills: skills.value,
      teamLead: teamLead.value,
      teamMembers: teamMembers.value
    });
    
    // Show success popup
    showSuccessPopup.value = true;
    
    // Hide popup after 3 seconds
    setTimeout(() => {
      showSuccessPopup.value = false;
    }, 3000);
  };
  </script>
  
  <style>
  .border-dashed {
    border-style: dashed !important;
    border-width: 2px !important;
    border-color: rgba(0, 0, 0, 0.2) !important;
  }
  </style>