<template>
  <div>
    <!-- Pass true to hide the Get Started button -->
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Welcome to Freelancer Task!</h1>
        <p>Create your account to access our all-in-one project management tools to streamline your freelancing journey.</p>
          
        <form @submit.prevent="submitForm">
          <!-- Error Messages -->
          <div v-if="errorMessage" class="error-container">
            <div class="error-header">
              <span class="error-icon">⚠️</span>
              <span class="error-title">{{ errorMessage.title }}</span>
            </div>
            <div v-if="errorMessage.details && errorMessage.details.length > 0" class="error-details">
              <ul>
                <li v-for="detail in errorMessage.details" :key="detail">{{ detail }}</li>
              </ul>
            </div>
            <div v-if="errorMessage.suggestions && errorMessage.suggestions.length > 0" class="error-suggestions">
              <div class="suggestions-header">💡 Suggestions:</div>
              <ul>
                <li v-for="suggestion in errorMessage.suggestions" :key="suggestion">{{ suggestion }}</li>
              </ul>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="successMessage" class="success-message">
            {{ successMessage }}
          </div>

          <label>Enter your full name</label>
          <input
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
            :disabled="isLoading"
          >
  
          <label>Enter your email address</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email address"
            :disabled="isLoading"
          >

          <label>Enter your phone number</label>
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            :disabled="isLoading"
          >

          <label>Enter your country</label>
          <input
            v-model="country"
            type="text"
            placeholder="Enter your country"
            :disabled="isLoading"
          >
  
          <label>Create your password</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create your password"
              :disabled="isLoading"
            >
            <img 
              :src="showPassword ? '/eye-open.svg' : '/eye-close.svg'" 
              class="eye-icon" 
              alt="Toggle password visibility" 
              @click="togglePassword"
            >
          </div>

          <!-- Password Strength Indicator -->
          <div v-if="showPasswordStrength" class="password-strength">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :style="{ 
                  width: `${getPasswordStrengthPercentage()}%`, 
                  backgroundColor: getPasswordStrengthColor() 
                }"
              ></div>
            </div>
            <div class="strength-text" :style="{ color: getPasswordStrengthColor() }">
              Password Strength: {{ getPasswordStrengthText() }}
            </div>
            <div v-if="passwordValidation && passwordValidation.suggestions.length > 0" class="password-suggestions">
              <div class="suggestions-title">💡 Password Tips:</div>
              <small v-for="suggestion in passwordValidation.suggestions" :key="suggestion">
                • {{ suggestion }}
              </small>
            </div>
            <div v-if="passwordValidation && passwordValidation.errors.length > 0" class="password-errors">
              <div class="errors-title">⚠️ Password Requirements:</div>
              <small v-for="error in passwordValidation.errors" :key="error" class="password-error">
                • {{ error }}
              </small>
            </div>
          </div>
  
          <label>Confirm your password</label>
          <div class="password-field">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm your password"
              :disabled="isLoading"
            >
            <img 
              :src="showConfirmPassword ? '/eye-open.svg' : '/eye-close.svg'" 
              class="eye-icon" 
              alt="Toggle confirm password visibility" 
              @click="toggleConfirmPassword"
            >
          </div>
  
          <button type="submit" :disabled="isLoading || isFormInvalid">
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create your account</span>
          </button>
        </form>
  
        <p class="login-text">
          Already have an account? <router-link to="/login">
            Login
          </router-link>
        </p>
      </div>
  
      <div class="image-container">
        <img
          src="/sign.png"
          alt="Workspace setup"
        >
      </div>
    </div>
  
    <FooterSection />
  </div>
</template>
  
  <script>
  import { ref, watch, computed } from "vue";
  import { useRouter } from 'vue-router';
  import { authAPI, apiUtils } from '../services/api.js';
  import FooterSection from '../components/FooterSection.vue'; 
  import HeaderSection from '../components/HeaderSection.vue';
  
  export default {
    components: {
      FooterSection,
      HeaderSection,
    },
    setup() {
      const router = useRouter();
      
      // Form data
      const fullName = ref("");
      const email = ref("");
      const phoneNumber = ref("");
      const country = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const showPassword = ref(false);
      const showConfirmPassword = ref(false);
      
      // UI state
      const isLoading = ref(false);
      const errorMessage = ref(null);
      const successMessage = ref("");
      
      // Password validation
      const passwordValidation = ref(null);
      const showPasswordStrength = ref(false);
      
      // Toggle password visibility
      const togglePassword = () => (showPassword.value = !showPassword.value);
      const toggleConfirmPassword = () => (showConfirmPassword.value = !showConfirmPassword.value);
      
      // Real-time password validation
      const validatePasswordStrength = async () => {
        if (!password.value) {
          passwordValidation.value = null;
          showPasswordStrength.value = false;
          return;
        }
        
        try {
          const response = await authAPI.validatePassword(password.value, {
            email: email.value,
            firstName: fullName.value.split(' ')[0],
            lastName: fullName.value.split(' ').slice(1).join(' ')
          });
          
          passwordValidation.value = response.data;
          showPasswordStrength.value = true;
        } catch (error) {
          console.error('Password validation error:', error);
        }
      };
      
      // Watch password changes for real-time validation
      watch(password, (newPassword) => {
        if (newPassword) {
          // Debounce the validation
          clearTimeout(window.passwordValidationTimeout);
          window.passwordValidationTimeout = setTimeout(validatePasswordStrength, 500);
        } else {
          passwordValidation.value = null;
          showPasswordStrength.value = false;
        }
      });
      
      // Get password strength color
      const getPasswordStrengthColor = () => {
        if (!passwordValidation.value) return '#e0e0e0';
        return passwordValidation.value.color;
      };
      
      // Get password strength text
      const getPasswordStrengthText = () => {
        if (!passwordValidation.value) return '';
        return passwordValidation.value.strengthText;
      };
      
      // Get password strength percentage
      const getPasswordStrengthPercentage = () => {
        if (!passwordValidation.value) return 0;
        return passwordValidation.value.score;
      };

      const submitForm = async () => {
        // Reset previous state
        errorMessage.value = null;
        successMessage.value = "";
        isLoading.value = true;

        try {
          // Basic validation
          if (!fullName.value || !email.value || !phoneNumber.value || !country.value || !password.value || !confirmPassword.value) {
            errorMessage.value = {
              title: "Please fill in all fields",
              details: [],
              suggestions: []
            };
            isLoading.value = false;
            return;
          }

          if (password.value !== confirmPassword.value) {
            errorMessage.value = {
              title: "Passwords do not match",
              details: [],
              suggestions: ["Make sure both password fields contain the same value"]
            };
            isLoading.value = false;
            return;
          }

          // Check password strength if validation is available
          if (passwordValidation.value && !passwordValidation.value.isValid) {
            errorMessage.value = {
              title: "Password does not meet security requirements",
              details: passwordValidation.value.errors || [],
              suggestions: passwordValidation.value.suggestions || []
            };
            isLoading.value = false;
            return;
          }

          // Call registration API
          const response = await authAPI.register({
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            phoneNumber: phoneNumber.value.trim(),
            country: country.value.trim(),
            password: password.value,
            confirmPassword: confirmPassword.value
          });

          // Handle successful registration
          if (response.success) {
            // Save authentication data
            apiUtils.saveAuthData(response.data.token, response.data.user);
            
            successMessage.value = "Account created successfully! Redirecting to dashboard...";
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          }

        } catch (error) {
          console.error('Registration error:', error);
          
          // Handle API errors with improved structure
          let title = "Registration failed";
          let details = [];
          let suggestions = [];
          
          if (error.message) {
            title = error.message;
          }
          
          if (error.errors && Array.isArray(error.errors)) {
            details = error.errors;
          }
          
          if (error.suggestions && Array.isArray(error.suggestions)) {
            suggestions = error.suggestions;
          }
          
          // Handle specific error cases
          if (error.message && error.message.includes('email already exists')) {
            title = "Account already exists";
            details = ["An account with this email address is already registered"];
            suggestions = ["Try logging in instead", "Use a different email address", "Reset your password if you forgot it"];
          }
          
          errorMessage.value = {
            title,
            details,
            suggestions
          };
        } finally {
          isLoading.value = false;
        }
      };

      // Computed property to check if form is invalid
      const isFormInvalid = computed(() => {
        // Basic field validation
        if (!fullName.value || !email.value || !phoneNumber.value || !country.value || !password.value || !confirmPassword.value) {
          return true;
        }
        
        // Password confirmation check
        if (password.value !== confirmPassword.value) {
          return true;
        }
        
        // Password strength validation
        if (passwordValidation.value && !passwordValidation.value.isValid) {
          return true;
        }
        
        return false;
      });
  
      return { 
        fullName, 
        email,
        phoneNumber,
        country, 
        password, 
        confirmPassword, 
        showPassword, 
        showConfirmPassword, 
        togglePassword, 
        toggleConfirmPassword, 
        submitForm,
        isLoading,
        errorMessage,
        successMessage,
        passwordValidation,
        showPasswordStrength,
        getPasswordStrengthColor,
        getPasswordStrengthText,
        getPasswordStrengthPercentage,
        isFormInvalid
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
    gap: 80px;
    padding: 40px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    position: relative;
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
    position: relative;
    z-index: 1;
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
    transition: all 0.3s ease;
    filter: invert(1);
  }

  .eye-icon:hover {
    opacity: 1;
    transform: scale(1.1);
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
  .error-container {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .error-header {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }

  .error-icon {
    font-size: 16px;
    margin-right: 8px;
  }

  .error-title {
    font-weight: 600;
    color: #dc2626;
    font-size: 14px;
  }

  .error-details ul,
  .error-suggestions ul {
    margin: 8px 0;
    padding-left: 20px;
  }

  .error-details li,
  .error-suggestions li {
    color: #dc2626;
    margin-bottom: 4px;
    font-size: 13px;
    line-height: 1.4;
  }

  .suggestions-header {
    font-weight: 600;
    color: #059669;
    margin-bottom: 4px;
    font-size: 13px;
  }

  .error-suggestions li {
    color: #059669;
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

  /* Password Strength Indicator */
  .password-strength {
    margin-top: 8px;
    margin-bottom: 16px;
    padding: 16px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .strength-bar {
    width: 100%;
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .strength-fill {
    height: 100%;
    transition: width 0.3s ease, background-color 0.3s ease;
    border-radius: 3px;
  }

  .strength-text {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #374151;
  }

  .password-suggestions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }

  .suggestions-title {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }

  .password-suggestions small {
    color: #6b7280;
    font-size: 11px;
    line-height: 1.4;
  }

  .password-errors {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
  }

  .errors-title {
    font-size: 12px;
    font-weight: 600;
    color: #dc2626;
    margin-bottom: 4px;
  }

  .password-error {
    color: #dc2626 !important;
    font-size: 11px;
    line-height: 1.4;
  }

  .login-text {
    margin-top: 24px;
    font-size: 14px;
    text-align: center;
    color: #6b7280;
    line-height: 1.5;
  }

  .login-text a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
  }

  .login-text a:hover {
    color: #059669;
    text-decoration: underline;
  }

  .image-container {
    flex-shrink: 0;
  }

  .image-container img {
    border-radius: 16px;
    height: 600px;
    width: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .container {
      gap: 60px;
      padding: 30px 40px;
    }
    
    .form-container {
      width: 480px;
      padding: 40px;
    }
    
    .image-container img {
      height: 550px;
    }
  }

  @media (max-width: 900px) {
    .container {
      flex-direction: column;
      gap: 40px;
      padding: 20px;
    }
    
    .form-container {
      width: 100%;
      max-width: 500px;
      padding: 40px 32px;
    }
    
    .image-container img {
      height: 400px;
    }
  }

  @media (max-width: 600px) {
    .form-container {
      padding: 32px 24px;
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
    
    .image-container img {
      height: 300px;
    }
  }

  </style>
  