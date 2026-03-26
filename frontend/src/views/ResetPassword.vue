<template>
  <div>
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Reset Your Password</h1>
        <p>Enter the verification code sent to <strong>{{ email }}</strong> and choose what you'd like to do.</p>
          
        <form @submit.prevent="submitForm">
          <!-- Error Messages -->
          <div
            v-if="errors.length > 0"
            class="error-messages"
          >
            <div 
              v-for="error in errors" 
              :key="error" 
              class="error-message"
            >
              {{ error }}
            </div>
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="success-message"
          >
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
          >

          <!-- Password Options -->
          <div class="password-options">
            <h3>Choose an option:</h3>
            
            <div
              class="option-card"
              :class="{ 'selected': selectedOption === 'keep' }"
            >
              <label class="option-label">
                <input 
                  v-model="selectedOption" 
                  type="radio" 
                  value="keep"
                  :disabled="isLoading"
                >
                <div class="option-content">
                  <strong>Keep Current Password</strong>
                  <p>Continue using your existing password</p>
                </div>
              </label>
            </div>

            <div
              class="option-card"
              :class="{ 'selected': selectedOption === 'change' }"
            >
              <label class="option-label">
                <input 
                  v-model="selectedOption" 
                  type="radio" 
                  value="change"
                  :disabled="isLoading"
                >
                <div class="option-content">
                  <strong>Create New Password</strong>
                  <p>Set a new password for your account</p>
                </div>
              </label>
            </div>
          </div>

          <!-- New Password Fields (shown only if changing password) -->
          <div
            v-if="selectedOption === 'change'"
            class="new-password-section"
          >
            <label>New Password</label>
            <div class="password-field">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter your new password"
                :disabled="isLoading"
                autocomplete="new-password"
                required
              >
              <img 
                :src="showNewPassword ? '/eye-open.svg' : '/eye-close.svg'" 
                class="eye-icon" 
                alt="Toggle password visibility" 
                @click="toggleNewPassword"
              >
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
              >
              <img 
                :src="showConfirmPassword ? '/eye-open.svg' : '/eye-close.svg'" 
                class="eye-icon" 
                alt="Toggle password visibility" 
                @click="toggleConfirmPassword"
              >
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
            :disabled="isLoading || resendCooldown > 0"
            @click="resendCode"
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
        >
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
          // Save authentication data if token is provided
          if (response.data && response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            if (response.data.user) {
              localStorage.setItem('user', JSON.stringify(response.data.user));
            }
          }

          if (selectedOption.value === 'keep') {
            successMessage.value = "Password verification successful! Redirecting to dashboard...";
          } else {
            successMessage.value = "Password successfully updated! Redirecting to dashboard...";
          }
          
          // Redirect to dashboard after success
          setTimeout(() => {
            router.push({ name: 'DashboardPage' });
          }, 1500);
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.form-container {
  width: 520px;
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

h1 {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #111827;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

p {
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.6;
  font-weight: 400;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  font-weight: 600;
  margin: 20px 0 8px 0;
  text-align: left;
  color: #374151;
}

input[type="text"], input[type="password"] {
  padding: 12px 16px;
  margin-bottom: 4px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  transition: all 0.2s ease;
  background: white;
  color: #111827;
  box-sizing: border-box;
}

input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

input:hover:not(:focus) {
  border-color: #9ca3af;
}

.password-field {
  display: flex;
  align-items: center;
  position: relative;
}

.password-field input {
  padding-right: 54px;
}

.eye-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  position: absolute;
  right: 18px;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.eye-icon:hover {
  opacity: 1;
}

.password-options {
  margin: 24px 0 0 0;
}

.password-options h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
}

.option-card {
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.option-card:hover {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.option-card.selected {
  border-color: #10b981;
  background-color: #f0fdf4;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
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
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #10b981;
}

.option-content {
  flex: 1;
}

.option-content strong {
  display: block;
  font-size: 15px;
  color: #111827;
  margin-bottom: 4px;
  font-weight: 600;
}

.option-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  text-align: left;
}

.new-password-section {
  margin-top: 24px;
  padding: 24px;
  background-color: #f0fdf4;
  border-radius: 10px;
  border: 1px solid #d1fae5;
}

button[type="submit"] {
  margin-top: 32px;
  padding: 14px 24px;
  border: none;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

button[type="submit"]:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

button[type="submit"]:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color: #9ca3af;
}

.resend-section {
  margin-top: 28px;
  text-align: center;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.resend-section p {
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.resend-btn {
  background: white;
  border: 1px solid #10b981;
  color: #10b981;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.resend-btn:hover:not(:disabled) {
  background-color: #10b981;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Error and Success Messages */
.error-messages {
  margin-bottom: 20px;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  padding: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.error-message::before {
  content: "⚠️";
  margin-right: 8px;
  font-size: 16px;
}

.success-message {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.back-to-login {
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
  color: #6b7280;
  line-height: 1.5;
}

.back-to-login a {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.back-to-login a:hover {
  color: #059669;
  text-decoration: underline;
}

/* Hide image container to match login page */
.image-container {
  display: none;
}

/* Responsive Design */
@media (max-width: 600px) {
  .container {
    padding: 20px;
  }
  
  .form-container {
    width: 100%;
    max-width: 400px;
    padding: 40px 32px;
  }
  
  h1 {
    font-size: 28px;
  }
  
  input {
    padding: 10px 14px;
  }
  
  button {
    padding: 12px 20px;
  }
  
  .password-options h3 {
    font-size: 15px;
  }
  
  .option-card {
    padding: 14px;
  }
  
  .new-password-section {
    padding: 20px;
  }
}
</style>
