<template>
  <v-app>
  <div id="app">
    <router-view /> <!-- Здесь будет рендериться страница в зависимости от маршрута -->
  </div>
</v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Poppins, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
