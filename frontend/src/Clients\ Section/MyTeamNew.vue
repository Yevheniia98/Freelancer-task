<template>
  <v-app>
    <LeftMenu class="left-menu-component" />
    <SearchBar />
      
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container fluid class="px-6 py-8">
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Team</span> Contacts
              </h1>
              <p class="hero-subtitle">
                Manage your freelance team with contact info, rates, and skills
              </p>
            </div>
          </div>
        </v-container>
      </div>

      <v-container fluid class="content-container px-6 pb-8">
        <!-- Team Contacts Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="info">
                mdi-account-multiple
              </v-icon>
              <h2 class="section-heading">Team Members</h2>
            </div>
            <div class="section-actions">
              <v-btn
                color="primary"
                variant="elevated"
                size="small"
                rounded="lg"
                @click="openAddMemberDialog"
              >
                <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                Add Team Member
              </v-btn>
            </div>
          </div>
          
          <!-- Team Members Grid -->
          <v-container fluid class="pa-0">
            <v-row v-if="teamMembers.length > 0" class="team-grid">
              <v-col
                v-for="member in teamMembers"
                :key="member.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card
                  class="team-member-card h-100"
                  :class="{ 'selected-card': selectedMember?.id === member.id }"
                  @click="selectTeamMember(member)"
                  rounded="lg"
                  hover
                >
                  <div class="card-header" :style="{ backgroundColor: getColorForRole(member.role) }">
                    <div class="member-avatar-large">
                      <img
                        v-if="member.avatar"
                        :src="member.avatar"
                        :alt="member.name"
                        class="avatar-image"
                      >
                      <div v-else class="avatar-placeholder">
                        {{ member.name.charAt(0).toUpperCase() }}
                      </div>
                    </div>
                  </div>
                  
                  <v-card-text class="pt-6">
                    <h3 class="text-h6 font-weight-bold mb-1">
                      {{ member.name }}
                    </h3>
                    <p class="text-caption text-medium-emphasis mb-3">
                      {{ member.role }}
                    </p>
                    
                    <div class="divider mb-3" />
                    
                    <!-- Contact Info -->
                    <div class="contact-section mb-3">
                      <div class="contact-item">
                        <v-icon size="18" class="text-primary mr-2">
                          mdi-email-outline
                        </v-icon>
                        <span class="text-caption">{{ member.email }}</span>
                      </div>
                      <div class="contact-item">
                        <v-icon size="18" class="text-primary mr-2">
                          mdi-phone-outline
                        </v-icon>
                        <span class="text-caption">{{ member.phone }}</span>
                      </div>
                    </div>
                    
                    <div class="divider mb-3" />
                    
                    <!-- Payment Info -->
                    <div class="payment-section mb-3">
                      <div class="payment-label text-caption text-medium-emphasis">
                        Monthly Rate
                      </div>
                      <div class="payment-amount">
                        ${{ member.payment }}
                      </div>
                    </div>
                    
                    <!-- Project Info -->
                    <div class="project-section mb-3">
                      <div class="project-label text-caption text-medium-emphasis">
                        Current Project
                      </div>
                      <div class="project-name text-caption">
                        {{ member.currentProject }}
                      </div>
                    </div>
                    
                    <!-- Skills -->
                    <div v-if="member.skills && member.skills.length > 0" class="skills-section mb-3">
                      <div class="text-caption text-medium-emphasis mb-2">Skills</div>
                      <div class="skills-chips">
                        <v-chip
                          v-for="(skill, idx) in member.skills.slice(0, 2)"
                          :key="idx"
                          size="x-small"
                          variant="tonal"
                          color="primary"
                          class="mr-1"
                        >
                          {{ skill }}
                        </v-chip>
                        <span v-if="member.skills.length > 2" class="text-caption text-medium-emphasis">
                          +{{ member.skills.length - 2 }} more
                        </span>
                      </div>
                    </div>
                  </v-card-text>
                  
                  <v-card-actions class="pt-0">
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      @click.stop="startPrivateChat(member)"
                    >
                      <v-icon size="18" class="mr-1">
                        mdi-message
                      </v-icon>
                      Message
                    </v-btn>
                    <v-spacer />
                    <v-menu>
                      <template #activator="{ props }">
                        <v-btn
                          icon
                          size="small"
                          variant="text"
                          v-bind="props"
                          @click.stop
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="openEditMemberDialog(member)">
                          <template #prepend>
                            <v-icon>mdi-pencil</v-icon>
                          </template>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item 
                          v-if="member.role !== 'owner'"
                          @click="confirmRemoveMember(member)"
                          class="text-error"
                        >
                          <template #prepend>
                            <v-icon color="error">mdi-delete</v-icon>
                          </template>
                          <v-list-item-title>Remove</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Empty State -->
            <div v-else class="empty-state-container">
              <v-icon size="80" color="grey-lighten-1" class="mb-4">
                mdi-account-multiple-outline
              </v-icon>
              <h3 class="text-h5 font-weight-bold mb-2">
                No team members yet
              </h3>
              <p class="text-medium-emphasis mb-6">
                Start building your team by adding members. Add contacts, set payment rates, and track their work.
              </p>
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                rounded="lg"
                @click="openAddMemberDialog"
              >
                <v-icon class="mr-2">mdi-plus</v-icon>
                Add Your First Team Member
              </v-btn>
            </div>
          </v-container>
        </div>
      </v-container>
    </v-main>

    <!-- Add Member Dialog -->
    <v-dialog
      v-model="addMemberDialog"
      max-width="600px"
      fullscreen-breakpoint="sm"
    >
      <v-card rounded="xl" flat border>
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon class="mr-3" color="white">
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
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newMember.name"
                  label="Full Name"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Name is required']"
                />
              </v-col>
                
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newMember.role"
                  label="Role (e.g., Designer, Developer)"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Role is required']"
                />
              </v-col>
                
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newMember.email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  required
                  :rules="[
                    v => !!v || 'Email is required',
                    v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Email must be valid'
                  ]"
                />
              </v-col>
                
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="newMember.phone"
                  label="Phone"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Phone is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-text-field
                  v-model.number="newMember.payment"
                  label="Monthly Payment ($)"
                  variant="outlined"
                  type="number"
                  required
                  :rules="[
                    v => v !== '' && v !== null || 'Payment is required',
                    v => v > 0 || 'Payment must be greater than 0'
                  ]"
                />
              </v-col>
                
              <v-col cols="12">
                <v-combobox
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
            <v-icon class="mr-2">mdi-account-plus</v-icon>
            Add Member
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

// Team Members
const teamMembers = ref([
  {
    id: 1,
    name: 'Yevheniia Suprun',
    role: 'Designer',
    email: 'suprunjen@gmail.com',
    phone: '+1 (354) 1568 8950',
    payment: 4500,
    currentProject: 'Website Redesign',
    skills: ['UI/UX', 'Figma', 'Prototyping'],
    avatar: 'https://i.pravatar.cc/150?img=1'
  }
]);

// Selected member
const selectedMember = ref(null);

// Add member dialog
const addMemberDialog = ref(false);
const isMemberFormValid = ref(false);
const memberForm = ref(null);
const newMember = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  payment: null,
  currentProject: '',
  skills: []
});

// Available projects
const availableProjects = ref([
  'Website Redesign',
  'Mobile App',
  'Landing page',
  'App design',
  'Backend API'
]);

// Color mapping for roles
const getColorForRole = (role) => {
  const colors = {
    'Designer': '#7C3AED',
    'Developer': '#2563EB',
    'Manager': '#DC2626',
    'Default': '#6B7280'
  };
  return colors[role] || colors['Default'];
};

// Select team member
const selectTeamMember = (member) => {
  selectedMember.value = member;
};

// Open add member dialog
const openAddMemberDialog = () => {
  newMember.value = {
    name: '',
    role: '',
    email: '',
    phone: '',
    payment: null,
    currentProject: '',
    skills: []
  };
  isMemberFormValid.value = false;
  addMemberDialog.value = true;
};

// Add team member
const addTeamMember = async () => {
  if (!memberForm.value) return;
  const { valid } = await memberForm.value.validate();
  if (!valid) return;

  const newMemberId = Math.max(0, ...teamMembers.value.map(m => m.id), 0) + 1;
  const memberToAdd = {
    ...newMember.value,
    id: newMemberId,
    avatar: `https://i.pravatar.cc/150?img=${newMemberId + 10}`
  };

  teamMembers.value.push(memberToAdd);
  selectTeamMember(memberToAdd);
  addMemberDialog.value = false;
};

// Edit member
const openEditMemberDialog = (member) => {
  console.log('Edit member:', member);
  // TODO: Implement edit functionality
};

// Remove member
const confirmRemoveMember = (member) => {
  if (confirm(`Remove ${member.name} from team?`)) {
    teamMembers.value = teamMembers.value.filter(m => m.id !== member.id);
    if (selectedMember.value?.id === member.id) {
      selectedMember.value = null;
    }
  }
};

// Start private chat
const startPrivateChat = (member) => {
  console.log('Start chat with:', member.name);
  // TODO: Implement chat functionality
};

onMounted(() => {
  if (teamMembers.value.length > 0) {
    selectTeamMember(teamMembers.value[0]);
  }
});
</script>

<style scoped>
/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
  border-radius: 0 0 1.5rem 1.5rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
}

/* Tool Section */
.tool-section {
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-icon {
  font-size: 1.75rem;
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

/* Team Grid Styles */
.team-grid {
  gap: 1.5rem;
}

.team-member-card {
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.team-member-card:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.team-member-card.selected-card {
  border-color: #2563EB;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
}

.card-header {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-radius: 0.75rem 0.75rem 0 0;
}

.member-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
  font-size: 1.75rem;
}

.divider {
  height: 1px;
  background: #E5E7EB;
}

.contact-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.payment-section,
.project-section {
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 0.5rem;
}

.payment-label,
.project-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.payment-amount {
  font-size: 1.5rem;
  font-weight: bold;
  color: #059669;
  margin-top: 0.25rem;
}

.project-name {
  margin-top: 0.25rem;
  font-weight: 500;
}

.skills-section {
  padding: 0.75rem;
  background: #F9FAFB;
  border-radius: 0.5rem;
}

.skills-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  min-height: 400px;
}

.empty-state-container h3 {
  margin: 1rem 0;
}

.empty-state-container p {
  max-width: 400px;
  margin-bottom: 2rem;
  color: #6B7280;
}

/* Modal Header */
.hero-modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-title {
    font-size: 2rem;
  }

  .team-member-card {
    max-width: 100%;
  }
}
</style>
