<template>
  <header>
    <div class="container">
      <div class="logo-container">
        <div class="ft-logo">
          <svg
            width="50"
            height="50"
            viewBox="0 0 80 80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <!-- Background circle with gradient -->
            <defs>
              <linearGradient
                id="bgGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color:#ffffff;stop-opacity:1"
                />
                <stop
                  offset="100%"
                  style="stop-color:#f8fafc;stop-opacity:1"
                />
              </linearGradient>
              <linearGradient
                id="textGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  style="stop-color:#0A7668;stop-opacity:1"
                />
                <stop
                  offset="100%"
                  style="stop-color:#0D9488;stop-opacity:1"
                />
              </linearGradient>
              <filter
                id="shadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="2"
                  stdDeviation="4"
                  flood-color="#000000"
                  flood-opacity="0.1"
                />
              </filter>
            </defs>
            
            <!-- Main circle background -->
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="url(#bgGradient)"
              stroke="#0A7668"
              stroke-width="2"
              filter="url(#shadow)"
            />
            
            <!-- Inner accent circle -->
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="#0A7668"
              stroke-width="1"
              stroke-opacity="0.2"
            />
            
            <!-- Letter F -->
            <g transform="translate(18, 25)">
              <path
                d="M0 0 L0 30 M0 0 L14 0 M0 15 L10 15" 
                stroke="url(#textGradient)" 
                stroke-width="4" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                fill="none"
              />
            </g>
            
            <!-- Letter T -->
            <g transform="translate(46, 25)">
              <path
                d="M0 0 L16 0 M8 0 L8 30" 
                stroke="url(#textGradient)" 
                stroke-width="4" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                fill="none"
              />
            </g>
            
            <!-- Decorative task/freelancer icons -->
            <circle
              cx="25"
              cy="15"
              r="1"
              fill="#0A7668"
              fill-opacity="0.4"
            />
            <circle
              cx="55"
              cy="15"
              r="1"
              fill="#0A7668"
              fill-opacity="0.4"
            />
            <circle
              cx="25"
              cy="65"
              r="1"
              fill="#0A7668"
              fill-opacity="0.4"
            />
            <circle
              cx="55"
              cy="65"
              r="1"
              fill="#0A7668"
              fill-opacity="0.4"
            />
          </svg>
        </div>
        <span class="company-name" />
      </div>

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
        <a
          href="#"
          class="nav-link"
          @click.prevent="isOverlayOpen = true"
        >
          Price
        </a> 
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
  components: { 
    WarningDesktop
  },
  data() {
    return {
      isOverlayOpen: false,
    };
  }
};
</script>

<style scoped>
header {
  background: linear-gradient(135deg, #10b981 0%, #059669 25%, #047857 75%, #065f46 100%);
  color: white;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid rgba(5, 150, 105, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
}

.ft-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.ft-logo:hover {
  transform: scale(1.05);
}

.ft-logo svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.company-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.nav {
  display: flex;
  gap: 40px;
}

.nav a, .nav .nav-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav a:hover, .nav .nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav a.router-link-active, .nav .nav-link.router-link-active {
  color: white;
  background-color: rgba(255, 255, 255, 0.15);
  font-weight: 600;
}

.auth-buttons {
  display: flex;
  gap: 15px;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  color: #047857;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #065f46;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.btn-secondary:active {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>