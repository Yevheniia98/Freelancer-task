<template>
  <v-card> 
    <v-layout>
      <v-navigation-drawer
        expand-on-hover
        rail
        class="custom-rail-background"
        @mouseenter="drawerExpanded = true"
        @mouseleave="drawerExpanded = false"
      >
        <v-list>
          <v-list-item :class="drawerExpanded ? 'expanded' : 'collapsed'">
            <v-avatar
              :size="drawerExpanded ? 40 : 25"
              class="logo-avatar"
            >
              <v-img
                src="logo.png"
                contain
              />
            </v-avatar>
            <span
              v-show="drawerExpanded"
              class="title-text"
            >Freelancer Tasks</span>
          </v-list-item>
          <v-divider class="custom-divider" />
          <v-list-item
            to="/"
            class="list"
            prepend-icon="mdi-home"
            title="Dashboard"
          />
          <v-list-item
            to="/projects"
            class="list"
            prepend-icon="mdi-briefcase"
            title="Projects"
          />
          <v-list-item
            to="/clients"
            class="list"
            prepend-icon="mdi-account-multiple"
            title="Clients"
          />
          <v-list-item
            to="/tasks"
            class="list"
            prepend-icon="mdi-format-list-checkbox"
            title="Tasks"
          />
          <v-list-item
            to="/finance"
            class="list"
            prepend-icon="mdi-currency-usd"
            title="Finance"
          />
          <v-list-item
            to="/calendar"
            class="list"
            prepend-icon="mdi-calendar"
            title="Calendar"
          />
          <v-list-item
            to="/tools"
            class="list"
            prepend-icon="mdi-tools"
            title="Tools"
          />
          <v-list-item
            to="/settings"
            class="list"
            prepend-icon="mdi-cog"
            title="Settings"
          />
          <v-divider class="custom-divider1" />
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            subtitle="sandra_a88@gmail.com"
            title="Sandra Adams"
          />
        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      drawerExpanded: false,
      searchQuery: '',
    };
  },
};
</script>


<style scoped>

.v-app {
  margin: 0px;
  height: 0px;
}
.custom-rail-background {
  background-color: #064E47;
}

.v-list-item {
  color: #e5e5e5;
  text-align: left;
}
.list:hover {
  background-color: #ffffff;
  color: rgb(65, 65, 65);
}

.logo-avatar {
  transition: all 0.3s;
}

.title-text {
  font-weight: 600;
  margin-left: 10px;
  opacity: 0;
  font-size: 18px;
  transition: opacity 0.3s;
  color: white;
}

.expanded .title-text {
  opacity: 1;
  
}
.expanded {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align logo and text to the left */
  padding: 10px;
  transition: all 0.3s ease;
}

.custom-divider {
  color: white;
  margin-bottom: 20px;
  margin-top: 20px;
}

.custom-divider1 {
  color: white;
  margin-bottom: 20px;
  margin-top: 200px;
}
</style>