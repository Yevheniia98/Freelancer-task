<template>
  <header>
    <div class="container">
      <img
        src="/Logo5.png"
        alt="My Logo"
        class="logo"
      >

      <nav class="nav">
        <router-link
          to="/"
          class="nav-link"
        >
          Home
        </router-link>
        <router-link
          to="/about"
          class="nav-link"
        >
          About
        </router-link>
        <!-- Clicking this sets isOverlayOpen to true -->
        <a
          href="#"
          class="nav-link"
          @click.prevent="isOverlayOpen = true"
        >Price</a> 
      </nav>

      <div class="auth-buttons">
        <router-link
          to="/login"
          class="btn-secondary"
        >
          Log in
        </router-link>
        <router-link
          to="/create-account"
          class="btn-primary"
        >
          Register
        </router-link>
      </div>
    </div>

    <!-- Bind isOpen prop and handle close event -->
    <WarningDesktop
      :is-open="isOverlayOpen"
      @close="isOverlayOpen = false"
    />
  </header>
</template>

<script>
import WarningDesktop from "@/views/WarningDesktop.vue";

export default {
  name: "HeaderSection",
  components: { WarningDesktop },
  data() {
    return {
      isOverlayOpen: false, // Overlay is closed by default
    };
  }
};
</script>

<style scoped>
header {
  background-color: #0A7668;
  color: white;
  height: 100px; /* Set a fixed height */
  display: flex;
  align-items: center;
  justify-content: center; /* Center content horizontally */
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space elements evenly */
  width: 80%; /* Adjust width */
  max-width: 1200px; /* Limit maximum width */
}

.logo {
  width: 80px;
  height: 80px;
}

.nav {
  display: flex;
  gap: 50px;
}

.nav a, .nav .nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
}


.auth-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Register button */
.btn-primary {
  background-color: white;
  color: #0A7668;
}

.btn-primary:hover {
  background-color: #B0B0B0; /* Light grey on hover */
}

.btn-primary:active {
  background-color: #505050; /* Dark grey when clicked */
  color: white;
}
/* Login button */
.btn-secondary {
  background: none;
  color: white;
  border: none;
  transition: color 0.3s ease;
}

.btn-secondary:hover {
  color: #B0B0B0; /* Grey text on hover */
}

.btn-secondary:active {
  color: #505050; /* Dark grey text when clicked */
}
</style>
