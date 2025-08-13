<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
// Main App component
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Poppins, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Ensure full-width layout */
.v-main {
  padding: 0 !important;
}
</style>

<style>
/* Global styles for full-width layout */
body, html {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  overflow-x: hidden;
}

.v-application {
  width: 100vw !important;
  max-width: 100vw !important;
}

.v-main {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
