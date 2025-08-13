<template>
  <div>
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Forgot Your Password?</h1>
        <p>Enter your email address and we'll send you a verification code to reset your password.</p>
          
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

          <label>Enter your email address</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email address"
            :disabled="isLoading"
            autocomplete="email"
            required
          />
  
          <button 
            type="submit" 
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
  
      <div class="image-container">
        <img
          src="/sign.png"
          alt="Forgot password illustration"
        />
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
        console.error('Forgot password error:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);
        
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
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 50px;
  margin-left: 100px;
  margin-right: 100px;
}

.form-container {
  width: 500px;
  height: auto;
  padding: 0px;
}

h1 {
  margin-top: 100px;
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
}

input {
  padding: 10px;
  margin-top: 0px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

button {
  margin-top: 30px;
  padding: 10px;
  border: none;
  background-color: #007b5e;
  color: white;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #005f47;
}

button:disabled {
  background-color: #cccccc;
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
