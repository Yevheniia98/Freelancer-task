<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      @update:rail="sidebarExpanded = !$event"
    />
    <SearchBar />
    
    <v-main
      :class="{ 'ml-60': sidebarExpanded, 'ml-14': !sidebarExpanded }"
      class="transition-all duration-300"
    >
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Header -->
        <div class="mb-8 d-flex justify-space-between align-center">
          <h1 class="text-h4 font-weight-bold">
            Account Settings
          </h1>
          
          <div class="d-flex">
            <v-text-field
              variant="outlined"
              placeholder="Search"
              hide-details
              density="compact"
              class="mr-3"
              style="max-width: 180px;"
              prepend-inner-icon="mdi-magnify"
            />
            
            <v-btn
              icon
              variant="text"
              color="primary"
              class="mr-2"
            >
              <v-icon>mdi-earth</v-icon>
            </v-btn>
            
            <v-btn
              icon
              variant="text"
              color="warning"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div class="mb-10">
          <div class="d-flex tabs-wrapper">
            <div 
              class="tab-item px-6 py-3 cursor-pointer"
              :class="{'active-tab': tab === 'profile'}"
              @click="tab = 'profile'; router.push('/profile')"
            >
              PROFILE INFORMATION
            </div>
            
            <div 
              class="tab-item px-6 py-3 cursor-pointer"
              :class="{'active-tab': tab === 'password1'}"
              @click="tab = 'password1'; router.push('/password1')"
            >
              PASSWORD AND SECURITY
            </div>
            
            <div 
              class="tab-item px-6 py-3 cursor-pointer"
              :class="{'active-tab': tab === 'notifications'}"
              @click="tab = 'notification'; router.push('/notification')"
            >
              NOTIFICATIONS
            </div>
            
            <div 
              class="tab-item px-6 py-3 cursor-pointer"
              :class="{'active-tab': tab === 'data-export'}"
              @click="tab = 'data-export'; router.push('/data-export')"
            >
              DATA EXPORT
            </div>
            
            <div 
              class="tab-item px-6 py-3 cursor-pointer"
              :class="{'active-tab': tab === 'log-out'}"
              @click="tab = 'log-out'; router.push('/log-out')"
            >
              LOGOUT
            </div>
          </div>
          <v-divider />
        </div>
        
        <!-- Profile Content -->
        <div v-if="tab === 'profile'">
          <div class="mb-6">
            <h2 class="text-subtitle-1 font-weight-medium mb-4">
              Your profile picture
            </h2>
            <div class="d-flex align-center mb-4">
              <v-avatar
                size="100"
                class="mr-6"
              >
                <v-img
                  v-if="profileImage"
                  :src="profileImage"
                  cover
                />
                <v-img
                  v-else
                  src="https://cdn.vuetifyjs.com/images/john.jpg"
                  cover
                />
              </v-avatar>
              
              <div class="d-flex gap-2">
                <v-btn
                  color="primary"
                  class="text-none rounded-md px-4 py-2"
                  variant="tonal"
                  @click="$refs.fileInput.click()"
                >
                  Upload New
                </v-btn>
                
                <v-btn
                  color="grey-lighten-3"
                  class="text-none rounded-md px-4 py-2 text-medium-emphasis"
                  @click="removeProfilePicture"
                >
                  Remove Profile Picture
                </v-btn>
                
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
          
          <!-- Profile Form -->
          <v-form
            ref="profileForm"
            @submit.prevent="saveProfile"
          >
            <div class="d-flex flex-wrap mb-4">
              <div class="w-50 pr-3 mb-4">
                <div class="mb-2 text-body-1">
                  Full name
                </div>
                <v-text-field
                  v-model="formData.fullName"
                  placeholder="Enter your full name"
                  variant="outlined"
                  hide-details="auto"
                  class="rounded-lg"
                  bg-color="white"
                />
              </div>
              
              <div class="w-50 pl-3 mb-4">
                <div class="mb-2 text-body-1">
                  Email address
                </div>
                <v-text-field
                  v-model="formData.email"
                  placeholder="Enter your email"
                  type="email"
                  variant="outlined"
                  hide-details="auto"
                  class="rounded-lg"
                  bg-color="white"
                />
              </div>
              
              <div class="w-50 pr-3 mb-4">
                <div class="mb-2 text-body-1">
                  Phone number
                </div>
                <v-text-field
                  v-model="formData.phoneNumber"
                  placeholder="Enter your phone number"
                  type="tel"
                  variant="outlined"
                  hide-details="auto"
                  class="rounded-lg"
                  bg-color="white"
                />
              </div>
              
              <div class="w-50 pl-3 mb-4">
                <div class="mb-2 text-body-1">
                  Country
                </div>
                <v-text-field
                  v-model="formData.country"
                  placeholder="Enter your country"
                  variant="outlined"
                  hide-details="auto"
                  class="rounded-lg"
                  bg-color="white"
                />
              </div>
            </div>
            
            <div class="mb-4">
              <v-btn
                color="primary"
                type="submit"
                class="text-none rounded-md px-6 py-2"
                :loading="saving"
              >
                Update Profile
              </v-btn>
            </div>
          </v-form>
        </div>
        
        <!-- Password Security Content -->
        <div v-else-if="tab === 'password'">
          <router-view />
        </div>
        
        <!-- Other tab contents -->
        <div v-else-if="tab === 'notifications'">
          <router-view />
        </div>
        
        <div v-else-if="tab === 'export'">
          <router-view />
        </div>
        
        <div v-else-if="tab === 'logout'">
          <router-view />
        </div>
        
        <!-- Success Dialog -->
        <v-snackbar
          v-model="snackbar"
          :timeout="3000"
          color="success"
        >
          Profile updated successfully!
          <template #actions>
            <v-btn
              variant="text"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue';
  

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

// Form data
const formData = ref({
  fullName: '',
  email: '',
  phoneNumber: '',
  country: ''
})

// File upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Remove profile picture
const removeProfilePicture = () => {
  profileImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Save profile
const saveProfile = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Saving profile:', formData.value)
    snackbar.value = true
  } catch (error) {
    console.error('Error saving profile:', error)
    // Show error snackbar here
  } finally {
    saving.value = false
  }
}

// Watch for route changes to update the active tab
watch(
  () => route.path,
  (newPath) => {
    const pathSegment = newPath.split('/').pop()
    if (['profile', 'password', 'notifications', 'export', 'logout'].includes(pathSegment)) {
      tab.value = pathSegment
    }
  },
  { immediate: true }
)

// Initialize from current route
onMounted(() => {
  const pathSegment = route.path.split('/').pop()
  if (pathSegment && ['profile', 'password', 'notifications', 'export', 'logout'].includes(pathSegment)) {
    tab.value = pathSegment
  }
})
</script>

<style scoped>
/* Custom styles if needed */
.ml-60 {
  margin-left: 240px;
}

.ml-14 {
  margin-left: 56px;
}

.transition-all {
  transition: all 0.3s ease;
}

.gap-2 {
  gap: 8px;
}

.w-50 {
  width: 50%;
}

@media (max-width: 768px) {
  .w-50 {
    width: 100%;
  }
  
  .w-50.pr-3 {
    padding-right: 0;
  }
  
  .w-50.pl-3 {
    padding-left: 0;
  }
}

.tabs-wrapper {
  position: relative;
}

.tab-item {
  font-size: 14px;
  font-weight: 500;
  position: relative;
  color: #666;
  transition: color 0.2s ease;
}

.tab-item:hover {
  color: #333;
}

.active-tab {
  color: #1976d2;
  font-weight: 600;
  border-bottom: 2px solid #1976d2;
}

.cursor-pointer {
  cursor: pointer;
}
</style>