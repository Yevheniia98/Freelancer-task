
<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      @update:rail="sidebarExpanded = !$event"
    />
    
    <v-main
      :class="{ 'ml-60': sidebarExpanded, 'ml-14': !sidebarExpanded }"
      class="transition-all duration-300"
    >
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h4 font-weight-bold">
            Account Settings
          </h1>
          
          <div class="d-flex align-center ga-4">
            <v-text-field
              density="compact"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              style="max-width: 240px;"
            />
            
            <v-btn
              icon
              class="bg-purple-lighten-5"
              color="purple"
            >
              <v-icon>mdi-earth</v-icon>
            </v-btn>
            
            <v-btn
              icon
              class="bg-amber-lighten-5"
              color="amber"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Tabs with router links -->
        <v-tabs
          v-model="tab"
          bg-color="white"
          color="primary"
          class="mb-6"
        >
          <v-tab
            value="profile"
            @click="navigateTo('AccountSetting')"
          >
            Profile Information
          </v-tab>
          <v-tab
            value="password"
            @click="navigateTo('PasswordSecurity')"
          >
            Password and security
          </v-tab>
          <v-tab
            value="notification"
            @click="navigateTo('NotificationPage')"
          >
            Notifications
          </v-tab>
          <v-tab
            value="data-export"
            @click="navigateTo('DataExport')"
          >
            Data Export
          </v-tab>
          <v-tab
            value="log-out"
            @click="navigateTo('LogOut')"
          >
            Logout
          </v-tab>
        </v-tabs>
        
        <!-- Password and Security Content -->
        <v-card class="pa-6">
          <!-- Info text -->
          <div class="text-grey-darken-1 mb-8">
            <p>Ensure your account is secure by regularly updating your password and managing your security settings.</p>
            <p>Strong passwords help protect your information from unauthorized access</p>
          </div>
          
          <!-- Change Password Section -->
          <div class="mb-8">
            <h2 class="text-h6 font-weight-bold mb-4">
              Change Password
            </h2>
            <p class="text-grey-darken-1 mb-6">
              To enhance your account security, please create a strong password.
            </p>
            
            <v-form
              ref="passwordFormRef"
              @submit.prevent="changePassword"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="passwordData.currentPassword"
                    label="Current Password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    variant="outlined"
                    :append-inner-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    hide-details="auto"
                    class="mb-4"
                    @click:append-inner="showCurrentPassword = !showCurrentPassword"
                  />
                </v-col>
                
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="passwordData.newPassword"
                    label="New Password"
                    :type="showNewPassword ? 'text' : 'password'"
                    variant="outlined"
                    :append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    hide-details="auto"
                    class="mb-4"
                    @click:append-inner="showNewPassword = !showNewPassword"
                  />
                </v-col>
                
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="passwordData.confirmPassword"
                    label="Confirm New Password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    hide-details="auto"
                    class="mb-4"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  />
                </v-col>
              </v-row>
            </v-form>
          </div>
          
          <!-- Account Recovery Section -->
          <div class="mb-8">
            <h2 class="text-h6 font-weight-bold mb-4">
              Account Recovery Options
            </h2>
            <p class="text-grey-darken-1 mb-6">
              Set up account recovery options in case you forget your password.
            </p>
            
            <v-form ref="recoveryFormRef">
              <h3 class="text-subtitle-1 font-weight-bold mb-4">
                Confirm recovery email address
              </h3>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="recoveryEmail"
                    type="email"
                    variant="outlined"
                    hide-details="auto"
                    placeholder="Enter your recovery email"
                  />
                </v-col>
              </v-row>
            </v-form>
          </div>
          
          <!-- Update Button -->
          <div class="mt-6">
            <v-btn
              color="green"
              :loading="saving"
              @click="updateProfile"
            >
              Update Profile
            </v-btn>
          </div>
        </v-card>
        
        <!-- Snackbar for notifications -->
        <v-snackbar
          v-model="snackbar"
          :timeout="3000"
          :color="snackbarColor"
        >
          {{ snackbarMessage }}
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LeftMenu from '@/dashboard/LeftMenu.vue'

// Setup router
const router = useRouter()

// States
const tab = ref('password')
const sidebarExpanded = ref(true)
const saving = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Form refs
const passwordFormRef = ref(null)
const recoveryFormRef = ref(null)

// Password visibility states
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const recoveryEmail = ref('')

// Set the correct tab on component mount
onMounted(() => {
  tab.value = 'password'
})

// Methods
const navigateTo = (componentName) => {
  router.push({ name: componentName })
}

const changePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    showSnackbar('New passwords do not match', 'error')
    return
  }
  
  try {
    saving.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSnackbar('Password changed successfully', 'success')
    // Clear form
    passwordData.value.currentPassword = ''
    passwordData.value.newPassword = ''
    passwordData.value.confirmPassword = ''
  } catch (error) {
    showSnackbar('Error changing password', 'error')
  } finally {
    saving.value = false
  }
}

const updateProfile = async () => {
  try {
    saving.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Updating profile:', {
      password: passwordData.value,
      recoveryEmail: recoveryEmail.value
    })
    showSnackbar('Profile updated successfully', 'success')
  } catch (error) {
    showSnackbar('Error updating profile', 'error')
  } finally {
    saving.value = false
  }
}

const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}
</script>

<style scoped>
.ml-60 {
  margin-left: 240px;
}

.ml-14 {
  margin-left: 56px;
}

.transition-all {
  transition: all 0.3s ease;
}

.ga-4 {
  gap: 16px;
}
</style>