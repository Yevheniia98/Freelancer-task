<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      class="left-menu-fixed"
      :class="{ 'expanded': sidebarExpanded }"
      @update:rail="sidebarExpanded = !$event"
    />
    <SearchBar />
    
    <v-main
      :class="{ 'main-expanded': sidebarExpanded, 'main-collapsed': !sidebarExpanded }"
      class="transition-all duration-300"
      style="background-color: #fafafa;"
    >
      <v-container
        fluid
        class="pa-6 container-full-width"
      >
        <!-- Header -->
        <div class="mb-10">
          <h1
            class="text-h3 font-weight-bold mb-3"
            style="color: #1a1a1a;"
          >
            Account Settings
          </h1>
          <p
            class="text-body-1"
            style="color: #6b7280;"
          >
            Manage your profile information and account preferences
          </p>
        </div>
        
        <!-- Clean Tab Navigation -->
        <div class="mb-8">
          <div class="tab-container">
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'profile'}"
              @click="tab = 'profile'; router.push('/profile')"
            >
              Profile
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'password1'}"
              @click="tab = 'password1'; router.push('/password1')"
            >
              Security
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'notifications'}"
              @click="tab = 'notification'; router.push('/notification')"
            >
              Notifications
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'data-export'}"
              @click="tab = 'data-export'; router.push('/data-export')"
            >
              Data Export
            </div>
            <div 
              class="tab-item"
              :class="{'tab-active': tab === 'log-out'}"
              @click="tab = 'log-out'; router.push('/log-out')"
            >
              Logout
            </div>
          </div>
        </div>
        
        <!-- Profile Content -->
        <div
          v-if="tab === 'profile'"
          class="profile-content"
        >
          <!-- Profile Picture Section -->
          <div class="content-card mb-8">
            <h3 class="section-title mb-6">
              Profile Picture
            </h3>
            
            <div class="d-flex align-center mb-6 profile-picture-section">
              <div class="avatar-wrapper mr-8">
                <v-avatar
                  size="100"
                  class="profile-avatar"
                  :class="{ 'default-avatar': !profileImage }"
                >
                  <v-img
                    v-if="profileImage"
                    :src="profileImage"
                    cover
                  />
                  <div 
                    v-else 
                    class="default-account-icon"
                  >
                    <svg viewBox="0 0 24 24" width="60" height="60" fill="currentColor">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                    </svg>
                  </div>
                </v-avatar>
              </div>
              
              <div class="d-flex gap-3">
                <button 
                  class="btn btn-primary"
                  @click="$refs.fileInput.click()"
                >
                  Upload new
                </button>
                <button 
                  class="btn btn-secondary"
                  @click="removeProfilePicture"
                >
                  Remove
                </button>
                
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleFileUpload"
                >
              </div>
            </div>
          </div>
          
          <!-- Personal Information -->
          <div class="content-card">
            <h3 class="section-title mb-6">
              Personal Information
            </h3>
            
            <v-form
              ref="profileForm"
              @submit.prevent="saveProfile"
            >
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Full Name</label>
                  <v-text-field
                    v-model="formData.fullName"
                    placeholder="Enter your full name"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Email Address</label>
                  <v-text-field
                    v-model="formData.email"
                    placeholder="Enter your email"
                    type="email"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <v-text-field
                    v-model="formData.phoneNumber"
                    placeholder="Enter your phone number"
                    type="tel"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Country</label>
                  <v-text-field
                    v-model="formData.country"
                    placeholder="Enter your country"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
              </div>
              
              <div class="mt-8">
                <button 
                  type="submit"
                  class="btn btn-primary btn-large"
                  :disabled="saving"
                >
                  <span v-if="saving">Updating...</span>
                  <span v-else>Update Profile</span>
                </button>
              </div>
            </v-form>
          </div>
        </div>
        
        <!-- Other tab contents -->
        <div v-else-if="tab === 'password1'">
          <router-view />
        </div>
        
        <div v-else-if="tab === 'notifications'">
          <router-view />
        </div>
        
        <div v-else-if="tab === 'data-export'">
          <router-view />
        </div>
        
        <div v-else-if="tab === 'log-out'">
          <router-view />
        </div>
        
        <!-- Success Notification -->
        <div
          v-if="snackbar"
          class="success-notification"
        >
          <div class="d-flex align-center">
            <div class="success-icon mr-3">
              ✓
            </div>
            <span>Profile updated successfully!</span>
            <button
              class="close-btn ml-auto"
              @click="snackbar = false"
            >
              ×
            </button>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// Get router and route
const router = useRouter()
const route = useRoute()

// States
const tab = ref('profile')
const sidebarExpanded = ref(true)
const profileImage = ref(null)
const saving = ref(false)
const snackbar = ref(false)
const fileInput = ref(null)

// Load user data from localStorage
const loadUserData = () => {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    const user = JSON.parse(userData);
    return {
      fullName: user.fullName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      country: user.country || ''
    };
  }
  // Fallback to empty data if no user data found
  return {
    fullName: '',
    email: '',
    phoneNumber: '',
    country: ''
  };
};

// Form data - initialize with real user data
const formData = ref(loadUserData())

// File upload handler
// import axios from 'axios';

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  console.log('File selected:', file);
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Create a local URL for the image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result;
      
      console.log('Image loaded locally for preview');
      
      // Update localStorage with the image data
      const existingUserData = localStorage.getItem('user_data');
      if (existingUserData) {
        const userData = JSON.parse(existingUserData);
        userData.profileImage = profileImage.value;
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
      
      // Trigger a custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileImageUpdated', {
        detail: { profileImage: profileImage.value }
      }));
      
      alert('Profile picture updated successfully!');
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading the selected file. Please try again.');
    };
    
    // Read the file as data URL for preview
    reader.readAsDataURL(file);
  } else {
    console.log('No file selected');
  }
}

// Remove profile picture
const removeProfilePicture = () => {
  profileImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  
  // Update localStorage to remove profile image
  const existingUserData = localStorage.getItem('user_data');
  if (existingUserData) {
    const userData = JSON.parse(existingUserData);
    userData.profileImage = null;
    localStorage.setItem('user_data', JSON.stringify(userData));
  }
  
  // Trigger event to notify other components
  window.dispatchEvent(new CustomEvent('profileImageUpdated', {
    detail: { profileImage: null }
  }));
  
  console.log('Profile picture removed successfully');
}

// Save profile
const saveProfile = async () => {
  saving.value = true
  try {
    // Update localStorage with new user data
    const existingUserData = localStorage.getItem('user_data');
    if (existingUserData) {
      const userData = JSON.parse(existingUserData);
      // Update user data with form data and profile image
      const updatedUserData = {
        ...userData,
        fullName: formData.value.fullName,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber,
        country: formData.value.country,
        profileImage: profileImage.value
      };
      localStorage.setItem('user_data', JSON.stringify(updatedUserData));
      
      // Dispatch events for real-time updates across the app
      window.dispatchEvent(new CustomEvent('userNameUpdated', {
        detail: { 
          fullName: formData.value.fullName,
          name: formData.value.fullName
        }
      }));
      
      window.dispatchEvent(new CustomEvent('profileImageUpdated', {
        detail: { profileImage: profileImage.value }
      }));
      
    } else {
      // Create new user data if none exists
      const newUserData = {
        ...formData.value,
        profileImage: profileImage.value
      };
      localStorage.setItem('user_data', JSON.stringify(newUserData));
      
      // Dispatch events for new user data
      window.dispatchEvent(new CustomEvent('userNameUpdated', {
        detail: { 
          fullName: formData.value.fullName,
          name: formData.value.fullName
        }
      }));
      
      window.dispatchEvent(new CustomEvent('profileImageUpdated', {
        detail: { profileImage: profileImage.value }
      }));
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Profile saved successfully:', formData.value)
    snackbar.value = true
    setTimeout(() => {
      snackbar.value = false
    }, 3000)
  } catch (error) {
    console.error('Error saving profile:', error)
  } finally {
    saving.value = false
  }
}

// Watch for route changes to update the active tab
watch(
  () => route.path,
  (newPath) => {
    const pathSegment = newPath.split('/').pop()
    if (['profile', 'password1', 'notifications', 'data-export', 'log-out'].includes(pathSegment)) {
      tab.value = pathSegment
    }
  },
  { immediate: true }
)

// Initialize from current route
onMounted(() => {
  const pathSegment = route.path.split('/').pop()
  if (pathSegment && ['profile', 'password1', 'notifications', 'data-export', 'log-out'].includes(pathSegment)) {
    tab.value = pathSegment
  }
  
  // Load user data from localStorage
  const userData = localStorage.getItem('user_data');
  if (userData) {
    const parsedData = JSON.parse(userData);
    
    // Set form data
    formData.value = {
      fullName: parsedData.fullName || '',
      email: parsedData.email || '',
      phoneNumber: parsedData.phoneNumber || '',
      country: parsedData.country || ''
    };
    
    // Set profile image
    if (parsedData.profileImage) {
      profileImage.value = parsedData.profileImage;
    }
  }
})
</script>

<style scoped>
/* Layout - Centered content with equal margins */
.main-expanded { 
  margin-left: 30px !important; /* sidebar width (240px) + 30px margin */
  margin-right: 30px !important; 
}
.main-collapsed { 
  margin-left: 102px !important; /* collapsed sidebar width (72px) + 30px margin */
  margin-right: 30px !important; 
}
.transition-all { transition: all 0.3s ease; }

/* Container adjustments - Centered with max width */
.container-full-width {
  max-width: 1200px !important;
  margin: 0 auto !important;
  width: 100%;
  padding-left: 30px !important;
  padding-right: 30px !important;
}

/* Left Menu Override */
:deep(.left-menu-fixed) {
  background: linear-gradient(180deg, #064E47 0%, #0a5751 100%) !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  width: 72px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.left-menu-fixed.expanded) {
  width: 240px !important;
}

/* Tab Navigation */
.tab-container {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  border-radius: 12px 12px 0 0;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.tab-item {
  flex: 1;
  padding: 20px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: none;
  background: white;
  position: relative;
}

.tab-item:hover {
  color: #0C9C8D;
  background: #f9fafb;
}

.tab-active {
  color: #0C9C8D !important;
  background: #f0fdfa !important;
  border-bottom: 3px solid #0C9C8D;
}

/* Content width optimization */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  max-width: none;
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

/* Profile Picture Section */
.profile-picture-section {
  align-items: flex-start;
}

.avatar-wrapper {
  position: relative;
}

.profile-avatar {
  border: 4px solid #f3f4f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-avatar.default-avatar {
  background-color: #f9fafb;
  border: 4px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-account-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #6b7280;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.modern-input :deep(.v-field) {
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: white;
  font-size: 15px;
}

.modern-input :deep(.v-field--focused) {
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

.modern-input :deep(.v-field:hover) {
  border-color: #9ca3af;
}

.modern-input :deep(.v-field__input) {
  padding: 12px 16px;
  min-height: 48px;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-primary {
  background: #0C9C8D;
  color: white;
}

.btn-primary:hover {
  background: #0a8a7e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(12, 156, 141, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #4b5563;
}

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Success Notification */
.success-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #10b981;
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.success-icon {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Utilities */
.gap-3 { gap: 12px; }
.d-flex { display: flex; }
.align-center { align-items: center; }
.ml-auto { margin-left: auto; }
.mr-3 { margin-right: 12px; }
.mr-8 { margin-right: 32px; }
.mb-3 { margin-bottom: 12px; }
.mb-6 { margin-bottom: 24px; }
.mb-8 { margin-bottom: 32px; }
.mb-10 { margin-bottom: 40px; }
.mt-8 { margin-top: 32px; }

/* Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-expanded, .main-collapsed {
    margin-left: 0 !important;
    padding-left: 16px !important;
  }
  
  .container-full-width {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .tab-container {
    border-radius: 8px 8px 0 0;
  }
  
  .tab-item {
    padding: 16px 12px;
    font-size: 13px;
  }
  
  .content-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .profile-picture-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-wrapper {
    margin-right: 0 !important;
    margin-bottom: 20px;
  }
  
  .success-notification {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}

@media (max-width: 480px) {
  .tab-item {
    padding: 12px 8px;
    font-size: 12px;
  }
  
  .content-card {
    padding: 20px 16px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .btn-large {
    padding: 14px 28px;
    font-size: 15px;
  }
}
</style>