<template>
  <div>
    <!-- Pass true to hide the Get Started button -->
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Welcome Back!</h1>
        <p>Sign in to your account to access your project management dashboard.</p>
          
        <form @submit.prevent="submitForm" @submit="submitForm" method="post" novalidate>
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
          />
  
          <label>Enter your password</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              :disabled="isLoading"
              autocomplete="current-password"
            />
            <img 
              :src="showPassword ? '/eye-open.svg' : '/eye-close.svg'" 
              class="eye-icon" 
              alt="Toggle password visibility" 
              @click="togglePassword"
            />
          </div>

          <div class="forgot-password">
            <router-link to="/forgot-password">
              Forgot your password?
            </router-link>
          </div>
  
          <button 
            type="submit" 
            :disabled="isLoading"
            @click.prevent="submitForm"
          >
            <span v-if="isLoading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
  
        <p class="signup-text">
          Don't have an account? 
          <router-link to="/create-account">
            Create Account
          </router-link>
        </p>
      </div>
  
      <div class="image-container">
        <img
          src="/sign.png"
          alt="Login illustration"
        />
      </div>
    </div>
  
    <FooterSection />
  </div>
</template>
  
<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { authAPI, apiUtils } from '../services/api.js';
import FooterSection from '../components/FooterSection.vue'; 
import HeaderSection from '../components/HeaderSection.vue';

export default {
  name: 'LoginPage',
  components: {
    FooterSection,
    HeaderSection,
  },
  setup() {
    const router = useRouter();
    
    // Form data
    const email = ref("");
    const password = ref("");
    const showPassword = ref(false);
    
    // UI state
    const isLoading = ref(false);
    const errors = ref([]);
    const successMessage = ref("");
    
    // Toggle password visibility
    const togglePassword = () => (showPassword.value = !showPassword.value);

    const submitForm = async (event) => {
      // Explicitly prevent form submission
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      // Reset previous state
      errors.value = [];
      successMessage.value = "";
      
      // Basic validation
      if (!email.value || !password.value) {
        errors.value = ["Please fill in all fields."];
        return false;
      }

      isLoading.value = true;

      try {
        // Call login API
        const response = await authAPI.login({
          email: email.value.trim(),
          password: password.value
        });

        // Handle successful login
        if (response.success) {
          // Handle 2FA requirement
          if (response.data.requiresTwoFactor) {
            // Store temp token and redirect to 2FA page
            localStorage.setItem('temp_token', response.data.tempToken);
            router.push('/two-factor-auth');
            return false;
          }

          // Save authentication data
          apiUtils.saveAuthData(response.data.token, response.data.user);
          
          successMessage.value = "Login successful! Redirecting to dashboard...";
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
        }

      } catch (error) {
        console.error('Login error:', error);
        
        // Handle API errors with improved error display
        if (error.errors && Array.isArray(error.errors)) {
          errors.value = error.errors;
        } else if (error.message) {
          errors.value = [error.message];
        } else {
          errors.value = ["Invalid email or password. Please check your credentials and try again."];
        }
      } finally {
        isLoading.value = false;
      }
      
      return false;
    };

    return { 
      email, 
      password, 
      showPassword, 
      togglePassword, 
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

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #007b5e;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
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
  min-height: auto;
  z-index: 1000;
  position: relative;
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
  position: relative;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
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
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #48bb78;
  margin-bottom: 15px;
  font-size: 14px;
}

.signup-text {
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
}

.signup-text a {
  color: #007b5e;
  text-decoration: none;
}

.signup-text a:hover {
  text-decoration: underline;
}

.image-container img {
  border-radius: 10px;
  height: 600px;
  width: auto;
  margin-top: 80px;
}
</style>
