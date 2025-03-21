<template>
  <v-layout>
    <v-row>
      <v-col
        v-for="stat in stats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card class="custom-card">
          <v-card-title class="card-title">
            <div class="icon-circle">
              <v-icon class="card-icon">{{ stat.icon }}</v-icon>
            </div>
            {{ stat.title }}
          </v-card-title>
          <v-card-text class="card-value">
            {{ stat.value }}
          </v-card-text>

          <!-- ✅ Dropdown Menu -->
          <v-menu
            v-model="dropdowns[stat.title]"
            :close-on-content-click="false"
            attach="body"
          >
            <template #activator="{ props }">
              <div
                class="dropdown-btn"
                v-bind="props"
              >
                <span>{{ selectedOptions[stat.title] || 'From last week' }}</span>
                <v-icon>{{ dropdowns[stat.title] ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </div>
            </template>

            <!-- ✅ Dropdown List -->
            <v-list class="dropdown-list">
              <v-list-item
                v-for="option in timeOptions"
                :key="option"
                class="dropdown-option"
                @click="selectTime(stat.title, option)"
              >
                <v-list-item-title>{{ option }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const stats = ref([
      { title: 'Active Projects', value: 5, icon: 'mdi-clipboard-text' },
      { title: 'New Tasks', value: 35, icon: 'mdi-format-list-checkbox' },
      { title: 'Customers', value: 109, icon: 'mdi-account-group' },
      { title: 'Revenue', value: '+1369', icon: 'mdi-currency-usd' }
    ]);

    const timeOptions = ref(['From last week', 'From last month', 'From last year']);
    const dropdowns = ref({});
    const selectedOptions = ref({});

    const selectTime = (title, option) => {
      selectedOptions.value[title] = option;
      dropdowns.value[title] = false;
    };

    return {
      stats,
      timeOptions,
      dropdowns,
      selectedOptions,
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
  margin-right: 30px !important;
  justify-content: center;
  width: 300px !important;
  margin-left: 20px !important;
  padding: 16px;
  margin-top: 50px;
  margin-bottom: 50px;
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
  display: flex;
  align-items: center;
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
  font-size: 28px;
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
  width: 100%;
  color: #757575;
}

.dropdown-btn:hover {
  background-color: #e0e0e0;
}

.dropdown-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  z-index: 1000;
}

.dropdown-option {
  font-size: 14px;
}
</style>
