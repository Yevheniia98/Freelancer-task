import { createApp } from 'vue';
import App from './App.vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Vuetify styles
import '@mdi/font/css/materialdesignicons.css'; // Material Icons
import * as components from 'vuetify/components'; // ✅ Import Vuetify components
import * as directives from 'vuetify/directives'; // ✅ Import Vuetify directives

import router from './router'; // Import the router

const vuetify = createVuetify({
  components,  // ✅ Register all components
  directives,  // ✅ Register all directives
});

const app = createApp(App);
app.use(vuetify);
app.use(router);
app.mount('#app');









  