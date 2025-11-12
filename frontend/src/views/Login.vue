<template>
  <div>
    <!-- Pass true to hide the Get Started button -->
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Welcome Back!</h1>
        <p>Sign in to your account to access your project management dashboard.</p>
          
        <form @submit.prevent="submitForm" method="post" novalidate>
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
            console.log('Attempting to redirect to dashboard...');
            router.push({ name: 'DashboardPage' });
          }, 500);
        }

      } catch (error) {
        console.error('Login error:', error);
        
        // Handle API errors with improved error display
        if (error.response && error.response.data && error.response.data.errors && Array.isArray(error.response.data.errors)) {
          errors.value = error.response.data.errors;
        } else if (error.response && error.response.data && error.response.data.message) {
          errors.value = [error.response.data.message];
        } else if (error.errors && Array.isArray(error.errors)) {
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
  width: 460px;
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

input {
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

.forgot-password {
  text-align: right;
  margin-bottom: 24px;
  margin-top: 12px;
}

.forgot-password a {
  color: #10b981;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-password a:hover {
  color: #059669;
  text-decoration: underline;
}

button {
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

button:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  color: #9ca3af;
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

.signup-text {
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
  color: #6b7280;
  line-height: 1.5;
}

.signup-text a {
  color: #10b981;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.signup-text a:hover {
  color: #059669;
  text-decoration: underline;
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
}
</style>
