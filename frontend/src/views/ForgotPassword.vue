<template>
  <div>
    <HeaderSection :hide-get-started="true" />
  
    <div class="main-container">
      <div class="form-card">
        <h1>Forgot Your Password?</h1>
        <p class="subtitle">Enter your email address and we'll send you a verification code to reset your password.</p>
          
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

          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email address"
              :disabled="isLoading"
              autocomplete="email"
              required
            />
          </div>
  
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading || !email"
          >
            <span v-if="isLoading">Sending...</span>
            <span v-else>Send Reset Code</span>
          </button>
        </form>
  
        <p class="back-to-login">
          Remember your password? 
          <router-link to="/login">
            Back to Login
          </router-link>
        </p>
      </div>
    </div>
  
    <FooterSection />
  </div>
</template>
  
<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { authAPI } from '../services/api.js';
import FooterSection from '../components/FooterSection.vue'; 
import HeaderSection from '../components/HeaderSection.vue';

export default {
  name: 'ForgotPassword',
  components: {
    FooterSection,
    HeaderSection,
  },
  setup() {
    const router = useRouter();
    
    // Form data
    const email = ref("");
    
    // UI state
    const isLoading = ref(false);
    const errors = ref([]);
    const successMessage = ref("");

    const submitForm = async () => {
      // Reset previous state
      errors.value = [];
      successMessage.value = "";
      
      // Basic validation
      if (!email.value) {
        errors.value = ["Please enter your email address."];
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        errors.value = ["Please enter a valid email address."];
        return;
      }

      isLoading.value = true;

      try {
        // Call forgot password API
        const response = await authAPI.forgotPassword({
          email: email.value.trim()
        });

        console.log('API Response:', response);

        // Handle successful request
        if (response.success) {
          successMessage.value = "Reset code sent! Check your email for verification code and password reset instructions.";
          
          // Redirect to verification page after a short delay
          setTimeout(() => {
            router.push(`/reset-password?email=${encodeURIComponent(email.value)}`);
          }, 2000);
        } else {
          console.log('Response success is false:', response);
          errors.value = [response.message || "Failed to send reset code"];
        }

      } catch (error) {
        console.error('Forgot password error:', error.message || error);
        
        // Handle API errors
        if (error.errors && Array.isArray(error.errors)) {
          errors.value = error.errors;
        } else if (error.message) {
          errors.value = [error.message];
        } else {
          errors.value = ["Unable to send reset code. Please try again later."];
        }
      } finally {
        isLoading.value = false;
      }
    };

    return { 
      email, 
      submitForm,
      isLoading,
      errors,
      successMessage
    };
  },
};
</script>
  
<style scoped>
* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.main-container {
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.form-card {
  background: white;
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 420px;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

h1 {
  color: #111827;
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  letter-spacing: -0.025em;
}

.subtitle {
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 400;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
}

input {
  width: 100%;
  padding: 16px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  color: #111827;
  background-color: #ffffff;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.08);
}

input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.submit-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.submit-btn:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Error and Success Messages */
.error-messages {
  margin-bottom: 20px;
  animation: slideIn 0.3s ease-out;
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 14px 16px;
  border-radius: 12px;
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
  background-color: #f0fdf4;
  color: #166534;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #16a34a;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.back-to-login {
  margin-top: 24px;
  font-size: 15px;
  text-align: center;
  color: #6b7280;
  font-weight: 400;
}

.back-to-login a {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-to-login a:hover {
  color: #059669;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .main-container {
    padding: 16px;
    min-height: calc(100vh - 120px);
  }
  
  .form-card {
    padding: 32px 24px;
    border-radius: 16px;
  }
  
  h1 {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: 24px 20px;
  }
  
  h1 {
    font-size: 24px;
  }
}
</style>
