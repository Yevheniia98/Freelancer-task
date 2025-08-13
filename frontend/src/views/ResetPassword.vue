<template>
  <div>
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Reset Your Password</h1>
        <p>Enter the verification code sent to <strong>{{ email }}</strong> and choose what you'd like to do.</p>
          
        <form @submit.prevent="submitForm">
          <!-- Error Messages -->
          <div v-if="errors.length > 0" class="error-messages">
            <div 
              v-for="error in errors" 
              :key="error" 
              class="error-message"
            >
              {{ error }}
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <label>Verification Code</label>
          <input
            v-model="verificationCode"
            type="text"
            placeholder="Enter the 6-digit code from your email"
            :disabled="isLoading"
            maxlength="6"
            required
          />

          <!-- Password Options -->
          <div class="password-options">
            <h3>Choose an option:</h3>
            
            <div class="option-card" :class="{ 'selected': selectedOption === 'keep' }">
              <label class="option-label">
                <input 
                  type="radio" 
                  v-model="selectedOption" 
                  value="keep"
                  :disabled="isLoading"
                />
                <div class="option-content">
                  <strong>Keep Current Password</strong>
                  <p>Continue using your existing password</p>
                </div>
              </label>
            </div>

            <div class="option-card" :class="{ 'selected': selectedOption === 'change' }">
              <label class="option-label">
                <input 
                  type="radio" 
                  v-model="selectedOption" 
                  value="change"
                  :disabled="isLoading"
                />
                <div class="option-content">
                  <strong>Create New Password</strong>
                  <p>Set a new password for your account</p>
                </div>
              </label>
            </div>
          </div>

          <!-- New Password Fields (shown only if changing password) -->
          <div v-if="selectedOption === 'change'" class="new-password-section">
            <label>New Password</label>
            <div class="password-field">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter your new password"
                :disabled="isLoading"
                autocomplete="new-password"
                required
              />
              <img 
                :src="showNewPassword ? '/eye-open.svg' : '/eye-close.svg'" 
                class="eye-icon" 
                alt="Toggle password visibility" 
                @click="toggleNewPassword"
              />
            </div>

            <label>Confirm New Password</label>
            <div class="password-field">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm your new password"
                :disabled="isLoading"
                autocomplete="new-password"
                required
              />
              <img 
                :src="showConfirmPassword ? '/eye-open.svg' : '/eye-close.svg'" 
                class="eye-icon" 
                alt="Toggle password visibility" 
                @click="toggleConfirmPassword"
              />
            </div>
          </div>
  
          <button 
            type="submit" 
            :disabled="isLoading || !verificationCode || !selectedOption || (selectedOption === 'change' && (!newPassword || !confirmPassword))"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else-if="selectedOption === 'keep'">Verify & Keep Password</span>
            <span v-else>Reset Password</span>
          </button>
        </form>

        <div class="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            type="button" 
            class="resend-btn"
            @click="resendCode"
            :disabled="isLoading || resendCooldown > 0"
          >
            <span v-if="resendCooldown > 0">Resend in {{ resendCooldown }}s</span>
            <span v-else>Resend Code</span>
          </button>
        </div>
  
        <p class="back-to-login">
          <router-link to="/login">
            Back to Login
          </router-link>
        </p>
      </div>
  
      <div class="image-container">
        <img
          src="/sign.png"
          alt="Reset password illustration"
        />
      </div>
    </div>
  
    <FooterSection />
  </div>
</template>
  
<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { authAPI } from '../services/api.js';
import FooterSection from '../components/FooterSection.vue'; 
import HeaderSection from '../components/HeaderSection.vue';

export default {
  name: 'ResetPassword',
  components: {
    FooterSection,
    HeaderSection,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    
    // Form data
    const email = ref(route.query.email || "");
    const verificationCode = ref("");
    const selectedOption = ref("keep");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);
    
    // UI state
    const isLoading = ref(false);
    const errors = ref([]);
    const successMessage = ref("");
    const resendCooldown = ref(0);
    
    let cooldownInterval = null;

    // Toggle password visibility
    const toggleNewPassword = () => (showNewPassword.value = !showNewPassword.value);
    const toggleConfirmPassword = () => (showConfirmPassword.value = !showConfirmPassword.value);

    const validateForm = () => {
      errors.value = [];

      if (!verificationCode.value) {
        errors.value.push("Please enter the verification code.");
        return false;
      }

      if (verificationCode.value.length !== 6) {
        errors.value.push("Verification code must be 6 digits.");
        return false;
      }

      if (selectedOption.value === 'change') {
        if (!newPassword.value) {
          errors.value.push("Please enter a new password.");
          return false;
        }

        if (newPassword.value.length < 8) {
          errors.value.push("Password must be at least 8 characters long.");
          return false;
        }

        if (newPassword.value !== confirmPassword.value) {
          errors.value.push("Passwords do not match.");
          return false;
        }
      }

      return true;
    };

    const submitForm = async () => {
      // Reset previous state
      errors.value = [];
      successMessage.value = "";
      
      if (!validateForm()) {
        return;
      }

      isLoading.value = true;

      try {
        const payload = {
          email: email.value,
          verificationCode: verificationCode.value,
          action: selectedOption.value
        };

        if (selectedOption.value === 'change') {
          payload.newPassword = newPassword.value;
        }

        // Call reset password API
        const response = await authAPI.resetPassword(payload);

        // Handle successful request
        if (response.success) {
          if (selectedOption.value === 'keep') {
            successMessage.value = "Password verification successful! Your existing password remains unchanged.";
          } else {
            successMessage.value = "Password successfully updated! You can now login with your new password.";
          }
          
          // Redirect to login after success
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        }

      } catch (error) {
        console.error('Reset password error:', error);
        
        // Handle API errors
        if (error.errors && Array.isArray(error.errors)) {
          errors.value = error.errors;
        } else if (error.message) {
          errors.value = [error.message];
        } else {
          errors.value = ["Failed to process request. Please try again."];
        }
      } finally {
        isLoading.value = false;
      }
    };

    const resendCode = async () => {
      if (!email.value) {
        errors.value = ["Email address is required to resend code."];
        return;
      }

      try {
        await authAPI.forgotPassword({ email: email.value });
        successMessage.value = "Verification code sent again! Check your email.";
        
        // Start cooldown
        resendCooldown.value = 60;
        cooldownInterval = setInterval(() => {
          resendCooldown.value--;
          if (resendCooldown.value <= 0) {
            clearInterval(cooldownInterval);
          }
        }, 1000);

      } catch (error) {
        errors.value = ["Failed to resend code. Please try again."];
      }
    };

    onMounted(() => {
      // Redirect if no email provided
      if (!email.value) {
        router.push('/forgot-password');
      }
    });

    onUnmounted(() => {
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
      }
    });

    return { 
      email,
      verificationCode,
      selectedOption,
      newPassword,
      confirmPassword,
      showNewPassword,
      showConfirmPassword,
      toggleNewPassword,
      toggleConfirmPassword,
      submitForm,
      resendCode,
      isLoading,
      errors,
      successMessage,
      resendCooldown
    };
  },
};
</script>
  
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 50px;
  margin-left: 100px;
  margin-right: 100px;
  padding: 20px 0;
}

.form-container {
  width: 500px;
  height: auto;
  padding: 0px;
}

h1 {
  margin-top: 50px;
  font-size: 24px;
  color: #000;
  text-align: left;
  font-weight: 600;
}

p {
  font-size: 16px;
  color: #555;
  text-align: left;
  margin-bottom: 30px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 16px;
  margin-top: 10px;
  text-align: left;
  font-weight: 500;
}

input[type="text"], input[type="password"] {
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
}

.password-field {
  display: flex;
  align-items: center;
  position: relative;
}

.eye-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  right: 10px;
}

.password-options {
  margin: 20px 0;
}

.password-options h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.option-card {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: #007b5e;
  background-color: #f8fffe;
}

.option-card.selected {
  border-color: #007b5e;
  background-color: #f0fff4;
}

.option-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  width: 100%;
}

.option-label input[type="radio"] {
  margin-right: 12px;
  margin-top: 2px;
  width: auto;
}

.option-content {
  flex: 1;
}

.option-content strong {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.option-content p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.new-password-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8fffe;
  border-radius: 8px;
  border: 1px solid #d1fae5;
}

button[type="submit"] {
  margin-top: 30px;
  padding: 12px;
  border: none;
  background-color: #007b5e;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #005f47;
}

button[type="submit"]:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.resend-section {
  margin-top: 20px;
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.resend-section p {
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.resend-btn {
  background: none;
  border: 1px solid #007b5e;
  color: #007b5e;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.resend-btn:hover:not(:disabled) {
  background-color: #007b5e;
  color: white;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Error and Success Messages */
.error-messages {
  margin-bottom: 15px;
  animation: slideIn 0.3s ease-out;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  border-left: 4px solid #dc2626;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.error-message::before {
  content: "⚠️";
  margin-right: 8px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message {
  background-color: #f0fff4;
  color: #38a169;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 500;
}

.back-to-login {
  margin-top: 20px;
  font-size: 16px;
  text-align: center;
}

.back-to-login a {
  color: #007b5e;
  text-decoration: none;
}

.back-to-login a:hover {
  text-decoration: underline;
}

.image-container img {
  border-radius: 10px;
  height: 600px;
  width: auto;
  margin-top: 80px;
}
</style>
