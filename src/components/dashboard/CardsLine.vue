<template>
  <!-- Cards Section -->
  <v-row
    dense
    class="pa-3"
  >
    <v-col
      v-for="stat in stats"
      :key="stat.title"
      cols="3"
      class="mt-12"
    >
      <v-card class="mx-0 my-2 pa-4 custom-card">
        <v-card-title class="card-title">
          {{ stat.title }}
        </v-card-title>
        <v-card-subtitle class="card-subtitle d-flex align-center">
          <div class="icon-circle">
            <v-icon class="card-icon">
              {{ stat.icon }}
            </v-icon>
          </div>
          <span class="card-value">{{ stat.value }}</span>
        </v-card-subtitle>
  
        <!-- ✅ Dropdown Button -->
        <div
          class="dropdown-btn"
          @click="toggleMenu(stat.title)"
        >
          <span>{{ selectedOptions[stat.title] || 'From last week' }}</span>
          <v-icon>{{ dropdowns[stat.title] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </div>
  
        <!-- ✅ Dropdown List -->
        <v-expand-transition>
          <div
            v-show="dropdowns[stat.title]"
            class="dropdown-list"
          >
            <v-list>
              <v-list-item
                v-for="option in timeOptions"
                :key="option"
                class="dropdown-option"
                @click="selectTime(stat.title, option)"
              >
                <v-list-item-title>{{ option }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-expand-transition>
      </v-card>
    </v-col>
  </v-row>
</template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      // Card stats data
      const stats = ref([
        { title: 'Active Projects', value: 5, icon: 'mdi-clipboard-text' },
        { title: 'New Tasks', value: 35, icon: 'mdi-format-list-checkbox' },
        { title: 'Customers', value: 109, icon: 'mdi-account-group' },
        { title: 'Revenue', value: '+1369', icon: 'mdi-currency-usd' }
      ]);
  
      // Dropdown functionality
      const timeOptions = ref(['From last week', 'From last month', 'From last year']);
      const dropdowns = ref({});
      const selectedOptions = ref({});
  
      const toggleMenu = (title) => {
        dropdowns.value = { ...dropdowns.value, [title]: !dropdowns.value[title] };
      };
  
      const selectTime = (title, option) => {
        selectedOptions.value[title] = option;
        dropdowns.value[title] = false;
      };
  
      return {
        stats,
        timeOptions,
        dropdowns,
        selectedOptions,
        toggleMenu,
        selectTime
      };
    }
  };
  </script>
  



<style scoped>
.custom-card {
    border-radius: 12px;
    transition: all 0.3s;
    position: relative;
    gap: 10px;
    justify-content: flex-end;
  }
  
  .custom-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #424242;
    text-align: left;
  }
  
  .card-subtitle {
    margin-top: 8px;
  }
  
  .icon-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e0f2f1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
  }
  
  .card-icon {
    color: #00897b;
  }
  
  .card-value {
    font-size: 24px;
    font-weight: 700;
    color: #424242;
  }
  
  .dropdown-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding: 8px 12px;
    border-radius: 6px;
    background-color: #f5f5f5;
    cursor: pointer;
    font-size: 16px;
    width: 267px;
    transform: translate(-16px, 16px);
    color: #757575;
  }
  
  .dropdown-list {
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 10;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .dropdown-btn:hover {
    background-color: #E0E0E0;
  }
  
  /* Dropdown List */
  .dropdown-list {
    background-color: rgb(255, 255, 255);
    border-radius: 4px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    padding: 5px 0;
  }
  
  
  .dropdown-option {
    font-size: 14px;
  }
</style>