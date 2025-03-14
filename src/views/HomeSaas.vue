<template>
  <v-app>
    <v-container>
      <v-navigation-drawer
        expand-on-hover
        rail
        app
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
            class="list"
            prepend-icon="mdi-home"
            title="Dashboard"
          />
          <v-list-item
            class="list"
            prepend-icon="mdi-briefcase"
            title="Projects"
          />
          <v-list-item
            class="list"
            prepend-icon="mdi-account-multiple"
            title="Clients"
          />
          <v-list-item
            class="list"
            prepend-icon="mdi-format-list-checkbox"
            title="Tasks"
          />
          <v-list-item
            class="list"
            prepend-icon="mdi-currency-usd"
            title="Finance"
          />
          <v-list-item
            class="list"
            prepend-icon="mdi-calendar"
            title="Calendar"
          />
          <v-list-item
            class="list"
            prepend-icon="mdi-tools"
            title="Tools"
          />
          <v-list-item
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

      <v-main>
        <div class="search-container">
          <v-text-field
            v-model="searchQuery"
            label="Search..."
            variant="outlined"
            dense
            hide-details
            class="search-input"
            prepend-inner-icon="mdi-magnify"
          />
        </div>

        <div class="language-icon">
          <v-icon size="30">
            mdi-web
          </v-icon>
        </div>
      </v-main>

      <v-row>
        <v-col cols="8">
          <v-container fluid>
            <v-row>
              <v-col cols="4">
                <v-row>
                  <v-col
                    v-for="meeting in meetings"
                    :key="meeting.id"
                    cols="12"
                  >
                    <v-card class="meeting-card pa-4">
                      <div class="d-flex align-center">
                        <v-sheet class="date-badge pa-2">
                          <div class="date-month">
                            {{ formatMonth(meeting.date) }}
                          </div>
                          <div class="date-day">
                            {{ formatDay(meeting.date) }}
                          </div>
                        </v-sheet>
                        <div class="ml-3">
                          <div class="event-type">
                            Live event
                          </div>
                          <div class="meeting-title">
                            {{ meeting.title }}
                          </div>
                        </div>
                      </div>
                      <div class="time-container d-flex justify-space-between my-4">
                        <div class="time-text">
                          {{ meeting.startTime }}
                        </div>
                        <div class="time-separator">
                          >
                        </div>
                        <div class="time-text">
                          {{ meeting.endTime }}
                        </div>
                      </div>
                      <div class="d-flex mt-3">
                        <v-avatar
                          v-for="(user, index) in meeting.attendees"
                          :key="index"
                          size="40"
                          class="mr-2"
                        >
                          <v-img :src="user" />
                        </v-avatar>
                      </div>
                      <v-btn
                        block
                        class="join-btn mt-4"
                      >
                        <v-icon class="mr-2">
                          mdi-video
                        </v-icon> Join Meeting
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-card class="pa-4">
                  <v-text-field
                    v-model="newMeeting.title"
                    label="Meeting Title"
                    dense
                    outlined
                  />
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="newMeeting.date"
                        label="Date"
                        readonly
                        v-bind="attrs"
                        dense
                        outlined
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="newMeeting.date"
                      @input="menu = false"
                    />
                  </v-menu>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="newMeeting.startTime"
                        label="From"
                        type="time"
                        dense
                        outlined
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="newMeeting.endTime"
                        label="To"
                        type="time"
                        dense
                        outlined
                      />
                    </v-col>
                  </v-row>
                  <v-btn
                    block
                    outlined
                    class="mb-2"
                    @click="addMeeting"
                  >
                    Create Meeting
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="4">
          <v-date-picker show-adjacent-months />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>





<script>
import { ref } from 'vue';
import { format } from 'date-fns';

export default {
  setup() {
    const drawerExpanded = ref(false);
    const searchQuery = ref("");

    // Card stats data
    const stats = ref([
      { title: 'Active Projects', value: 5, icon: 'mdi-clipboard-text' },
      { title: 'New Tasks', value: 35, icon: 'mdi-format-list-checkbox' },
      { title: 'Customers', value: 109, icon: 'mdi-account-group' },
      { title: 'Revenue', value: '+1369', icon: 'mdi-currency-usd' }
    ]);

    // Dropdown functionality
    const timeOptions = ['From last week', 'From last month', 'From last year'];
    const dropdowns = ref({});
    const selectedOptions = ref({});

    const toggleMenu = (title) => {
      dropdowns.value = { ...dropdowns.value, [title]: !dropdowns.value[title] };
    };

    const selectTime = (title, option) => {
      selectedOptions.value[title] = option;
      dropdowns.value[title] = false;
    };

    // Meeting attendees data
    const attendees = ref([
      'https://randomuser.me/api/portraits/women/1.jpg',
      'https://randomuser.me/api/portraits/men/2.jpg'
    ]);

    // Meeting Data
    const meetings = ref([]);
    const newMeeting = ref({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      attendees: attendees.value
    });

    const menu = ref(false);

    // Function to add a new meeting
    const addMeeting = () => {
      meetings.value.push({
        ...newMeeting.value,
        id: Date.now()
      });
    };

    // Formatting functions
    const formatMonth = (date) => format(new Date(date), 'MMM');
    const formatDay = (date) => format(new Date(date), 'd');

    return {
      drawerExpanded,
      searchQuery,
      stats,
      timeOptions,
      dropdowns,
      selectedOptions,
      toggleMenu,
      selectTime,
      attendees,
      meetings,
      newMeeting,
      menu,
      addMeeting,
      formatMonth,
      formatDay
    };
  }
};
</script>




<style scoped>
.v-container{
  margin-left: 100px;
}

/* Background color for the navigation drawer */
.custom-rail-background {
  background-color: #064E47 !important;
}

/* Divider style */
.custom-divider {
  color: white;
  margin-bottom: 20px;
  margin-top: 20px;
}

.custom-divider1{
  color: white;
  margin-bottom: 20px;
  margin-top: 200px;
}

/* Company item layout */
.expanded {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align logo and text to the left */
  padding: 10px;
  transition: all 0.3s ease;
}

.collapsed {
  display: flex;
  align-items: center;
  justify-content: center; /* Center logo when collapsed */
  padding: 10px;
  transition: all 0.3s ease;
}

/* Logo size transition */
.logo-avatar {
  transition: all 0.3s ease;
}

/* Title text styling */
.title-text {
  font-weight: bold;
  color: white;
  margin-left: 5px;
  transition: opacity 0.3s ease;
}

/* Search input container */
.search-container {
  width: 100%;
  display: flex;
  justify-content: flex-end; /* Align search input to the right */
  padding: 15px;
  margin-left: 120px;
  height: 50px;

}

/* Search input field */
.search-input {
  max-width: 250px; /* Limits width */
}

/* Language Icon Styling */
.language-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #EEBFFF; /* Circle background */
  color: #871F8D; /* Icon color */
  border-radius: 50%; /* Make it circular */
  width: 50px; /* Circle size */
  height: 50px;
  cursor: pointer;
  transform: translate(900px, -32px);
}

.language-icon v-icon {
  color: #871F8D; /* Icon color */
  
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px; /* Adds 20px space between cards */
  justify-content: space-between;
  
}


.v-list-item {
  color: white;
  text-align: left;
  
}

.list:hover {
  background-color: #ffffff;
  color: rgb(65, 65, 65);
}

.custom-card {
  font-family: 'Poppins', sans-serif;
}

/* Title - Grey Color, 16px */
.card-title {
  color: grey;
  font-size: 16px;
  font-weight: 300;
  text-align: left;
}

/* Value - Black, 32px */
.card-value {
  font-size: 32px;
  font-weight: bold;
  color: black;
  margin-left: 20px;
}

/* Icon - Inside a Circular Background */
.icon-circle {
  width: 40px;
  height: 40px;
  background-color: #CEEBE8; /* Circle Background */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icon - 24px */
.card-icon {
  font-size: 24px;
  color: #0C9C8D; /* Icon Color */
}

/* Dropdown Button */
.dropdown-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #EEEEEE;
  color: #8A8585;
  font-size: 16px;
  width: 280px;
  height: 40px;
  padding: 0 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  transform: translate(-16px, 15px);
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

.dropdown-text {
  color: #8A8585;
}

/* Dropdown Option */
.dropdown-option {
  font-size: 16px;
  padding: 10px;
  cursor: pointer;
  color: #535454;
}

.dropdown-option:hover {
  background-color: #f0f0f0;
}

/* Card Styles */
.meeting-card {
  width: 280px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Date Badge */
.date-badge {
  background-color: #ff6257;
  color: white;
  border-radius: 8px;
  text-align: center;
  min-width: 50px;
}

.date-month {
  font-size: 14px;
  font-weight: bold;
}

.date-day {
  font-size: 20px;
  font-weight: bold;
}

/* Meeting Info */
.event-type {
  font-size: 16px;
  text-align: left;
  color: gray;
}

.meeting-title {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
}

/* Time Section */
.time-container {
  font-size: 20px;
  text-align: left;
  font-weight: bold;
  color: black;
}

.time-separator {
  font-size: 20px;
  font-weight: bold;
  color: gray;
}

/* Join Button */
.join-btn {
  background-color: black;
  color: white;
  font-weight: bold;
  text-transform: none;
  border-radius: 8px;
}

.border-right {
  border-right: 1px solid #ddd;
}

/* Calendar styling */
.calendar-header {
  font-weight: bold;
  padding: 8px;
}

.calendar-day {
  cursor: pointer;
  text-align: center;
  padding: 8px;
}

.highlight-day {
  background-color: #CEEBE8;
  color: #0C9C8D;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

Version 2 of 2