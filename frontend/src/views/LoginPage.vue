<template>
  <div>
    <!-- Pass true to hide the Get Started button -->
    <HeaderSection :hide-get-started="true" />
  
    <div class="container">
      <div class="form-container">
        <h1>Welcome back!</h1>
        <p> Please enter your credentials below to access your dashboard and continue managing your freelance projects.</p>
          
        <form @submit.prevent="submitForm">
          <label>Enter your email address</label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email address"
          >

          <label>Input your password</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Input your password"
            >
            <img
              :src="showPassword ? '/eye-open.svg' : '/eye-close.svg'"
              class="eye-icon"
              alt="Toggle password visibility"
              @click="togglePassword"
            >
          </div>

          <button type="submit">
            Log into your account
          </button>
        </form>
        <p class="login-text">
          Don’t have an account?<router-link to="/create-account">
            Create an account
          </router-link>
        </p> 
      </div>
  
      <div class="image-container">
        <img
          src="/work.png"
          alt="Workspace setup"
        >
      </div>
    </div>
  
    <FooterSection />
  </div>
</template>
  
  <script>
  import { ref } from "vue";
  import FooterSection from '../components/FooterSection.vue'; 
  import HeaderSection from '../components/HeaderSection.vue';
  
  export default {
    components: {
      FooterSection,
      HeaderSection,
    },
    setup() {
      const fullName = ref("");
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const showPassword = ref(false);
      const showConfirmPassword = ref(false);
  
      const togglePassword = () => (showPassword.value = !showPassword.value);
      const toggleConfirmPassword = () => (showConfirmPassword.value = !showConfirmPassword.value);
  
      const submitForm = () => {
        if (!fullName.value || !email.value || !password.value || !confirmPassword.value) {
          alert("Please fill in all fields.");
          return;
        }
        if (password.value !== confirmPassword.value) {
          alert("Passwords do not match!");
          return;
        }
        alert("Account created successfully!");
      };
  
      return { fullName, email, password, confirmPassword, showPassword, showConfirmPassword, togglePassword, toggleConfirmPassword, submitForm };
    },
  };
  </script>
  
  <style scoped>
  .container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 50px; /* Increased space between form and image */
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
  font-weight: 600; /* Semi-bold */
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
  text-align:left;
  
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
}

button:hover {
  background-color: #005f47;
}

.login-text {
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
}

.image-container img {
  border-radius: 10px;
  height: 600px;
  width: auto;
  margin-top: 80px;
}

  </style>
  