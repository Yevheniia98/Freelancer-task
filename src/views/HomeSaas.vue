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
      </v-main>

      
        
          
      <v-row>
        <v-col cols="12" md="4">
          <!-- Event Creation Card -->
          <v-card class="mb-4 rounded-lg elevation-2">
            <v-card-text>
              <div class="d-flex align-center mb-4">
                <v-avatar size="40" class="mr-3">
                  <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                </v-avatar>
                <div>me (Isabella)</div>
              </div>
              
              <!-- Event Type Selection -->
              <v-btn-toggle
                v-model="eventType"
                mandatory
                class="mb-4 rounded-pill"
                background-color="grey lighten-3"
                dense
              >
                <v-btn value="event" class="px-6 rounded-pill" :color="eventType === 'event' ? 'teal' : ''" text-color="white">
                  Event
                </v-btn>
                <v-btn value="task" class="px-6 rounded-pill" :color="eventType === 'task' ? 'teal' : ''" text>
                  Task
                </v-btn>
                <v-btn value="meet" class="px-6 rounded-pill" :color="eventType === 'meet' ? 'teal' : ''" text>
                  Meet
                </v-btn>
              </v-btn-toggle>
              
              <!-- Event Title -->
              <v-text-field
                v-model="newEvent.title"
                placeholder="Add title"
                outlined
                dense
                hide-details
                class="mb-4 rounded-lg"
              ></v-text-field>
              
              <!-- Date and Time -->
              <v-card outlined class="mb-4 rounded-lg">
                <v-card-text class="pa-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-clock-outline</v-icon>
                    <span class="text-subtitle-2">Date and time</span>
                  </div>
                </v-card-text>
              </v-card>
              
              <!-- Date selection -->
              <div class="d-flex align-center mb-3">
                <div class="mr-4 text-subtitle-2" style="width: 50px">On</div>
                <v-menu
                  ref="dateMenu"
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formattedDate"
                      dense
                      outlined
                      readonly
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="newEvent.date"
                    no-title
                    @input="dateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </div>
              
              <!-- Time selection -->
              <div class="d-flex align-center mb-3">
                <div class="mr-4 text-subtitle-2" style="width: 50px">From</div>
                <v-menu
                  ref="timeFromMenu"
                  v-model="timeFromMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newEvent.timeFrom"
                      dense
                      outlined
                      readonly
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="newEvent.timeFrom"
                    format="24hr"
                    @input="timeFromMenu = false"
                  ></v-time-picker>
                </v-menu>
              </div>
              
              <div class="d-flex align-center mb-4">
                <div class="mr-4 text-subtitle-2" style="width: 50px">To</div>
                <v-menu
                  ref="timeToMenu"
                  v-model="timeToMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="newEvent.timeTo"
                      dense
                      outlined
                      readonly
                      hide-details
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="newEvent.timeTo"
                    format="24hr"
                    @input="timeToMenu = false"
                  ></v-time-picker>
                </v-menu>
              </div>
              
              <!-- People -->
              <v-card outlined class="mb-4 rounded-lg">
                <v-card-text class="pa-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-account-outline</v-icon>
                    <span class="text-subtitle-2">Add people</span>
                  </div>
                </v-card-text>
              </v-card>
              
              <!-- Meeting Link -->
              <v-card outlined class="mb-4 rounded-lg">
                <v-card-text class="pa-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-link</v-icon>
                    <span class="text-subtitle-2">Add meeting link</span>
                  </div>
                </v-card-text>
              </v-card>
              
              <!-- Repeat -->
              <v-card outlined class="mb-4 rounded-lg">
                <v-card-text class="pa-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-2">mdi-repeat</v-icon>
                    <span class="text-subtitle-2">Repeat</span>
                  </div>
                </v-card-text>
              </v-card>
              
              <!-- Repeat Options -->
              <div class="d-flex align-center mb-3">
                <div class="mr-4 text-subtitle-2" style="width: 50px">Every</div>
                <v-select
                  v-model="newEvent.repeatEvery"
                  :items="repeatOptions"
                  dense
                  outlined
                  hide-details
                ></v-select>
              </div>
              
              <div class="d-flex align-center mb-3">
                <div class="mr-4 text-subtitle-2" style="width: 50px">On</div>
                <v-btn-toggle
                  v-model="newEvent.repeatDays"
                  multiple
                  class="rounded-lg"
                  dense
                >
                  <v-btn value="M" class="px-2" small>M</v-btn>
                  <v-btn value="T" class="px-2" small>T</v-btn>
                  <v-btn value="W" class="px-2" small>W</v-btn>
                  <v-btn value="T" class="px-2" small>T</v-btn>
                  <v-btn value="F" class="px-2" small>F</v-btn>
                  <v-btn value="S" class="px-2" small>S</v-btn>
                  <v-btn value="S" class="px-2" small>S</v-btn>
                </v-btn-toggle>
              </div>
              
              <!-- Create Event Button (hidden in the UI but functional) -->
              <v-btn
                color="teal"
                class="white--text"
                @click="createEvent"
                style="display: none"
              >
                Create
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- Existing Events -->
          <v-card 
            v-for="event in events" 
            :key="event.id" 
            class="mb-4 rounded-lg elevation-2 event-card"
            :class="{'recent-event': event.isRecent}"
          >
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <div class="text-h6">{{ event.title }}</div>
                <v-btn icon small @click="deleteEvent(event.id)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              
              <div class="mb-3 text-subtitle-2 grey--text">
                {{ formatEventDate(event.date) }} • {{ event.timeFrom }} - {{ event.timeTo }}
              </div>
              
              <div class="d-flex align-center">
                <v-avatar size="28" class="mr-2">
                  <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                </v-avatar>
                <span class="text-caption">Isabella</span>
                
                <v-spacer></v-spacer>
                
                <v-chip
                  x-small
                  :color="getEventTypeColor(event.type)"
                  text-color="white"
                  class="px-2"
                >
                  {{ event.type }}
                </v-chip>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="8">
          <!-- Calendar -->
          <v-card class="rounded-lg elevation-2">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>{{ currentMonthText }}</span>
              <div>
                <v-btn icon @click="previousMonth">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn icon @click="nextMonth">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </v-card-title>
            
            <v-card-text>
              <!-- Days of week -->
              <div class="d-flex justify-space-between mb-4">
                <div 
                  v-for="day in daysOfWeek" 
                  :key="day" 
                  class="text-center text-subtitle-2 grey--text text--darken-1"
                  style="width: 14.28%"
                >
                  {{ day }}
                </div>
              </div>
              
              <!-- Calendar grid -->
              <div class="d-flex flex-wrap">
                <div 
                  v-for="(day, index) in calendarDays" 
                  :key="index"
                  class="calendar-day text-center"
                  :class="{
                    'current-month': day.currentMonth,
                    'other-month': !day.currentMonth,
                    'has-event': hasEvent(day.date),
                    'today': isToday(day.date)
                  }"
                  @click="selectDate(day.date)"
                >
                  <div class="day-number">{{ day.dayNumber }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        
      
    
        </v-col>
        
      </v-row>
    </v-container>
  </v-app>
</template>





<script>
export default {
  data() {
    return {
      // Navigation drawer state
      drawerExpanded: false,
      searchQuery: '',
      
      // Stats for cards section
      stats: [
        { title: 'Total Tasks', value: '42', icon: 'mdi-format-list-bulleted' },
        { title: 'Completed', value: '24', icon: 'mdi-check-circle' },
        { title: 'Pending', value: '18', icon: 'mdi-clock-outline' },
        { title: 'Upcoming', value: '7', icon: 'mdi-calendar-clock' }
      ],
      
      // Dropdown states
      dropdowns: {},
      selectedOptions: {},
      timeOptions: ['From last week', 'From last month', 'From last year', 'All time'],
      
      // Calendar and events
      eventType: 'event',
      dateMenu: false,
      timeFromMenu: false,
      timeToMenu: false,
      
      newEvent: {
        title: '',
        date: new Date().toISOString().substr(0, 10),
        timeFrom: '14:00',
        timeTo: '15:00',
        type: 'event',
        repeatEvery: 'On',
        repeatDays: []
      },
      
      repeatOptions: ['On', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
      
      events: [
        {
          id: 1,
          title: 'Team Meeting',
          date: '2025-02-15',
          timeFrom: '10:00',
          timeTo: '11:30',
          type: 'meet',
          isRecent: false
        },
        {
          id: 2,
          title: 'Project Review',
          date: '2025-02-21',
          timeFrom: '14:00',
          timeTo: '15:00',
          type: 'event',
          isRecent: false
        }
      ],
      
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      nextEventId: 3
    };
  },
  
  computed: {
    formattedDate() {
      if (!this.newEvent.date) return '';
      const date = new Date(this.newEvent.date);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },
    
    currentMonthText() {
      const date = new Date(this.currentYear, this.currentMonth, 1);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long'
      }).format(date);
    },
    
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      
      // Get day of week of first day (0 is Sunday, so we adjust for Monday start)
      let firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      
      // Add days from previous month
      const prevLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        days.push({
          dayNumber: prevLastDay - i,
          currentMonth: false,
          date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevLastDay - i).padStart(2, '0')}`
        });
      }
      
      // Add days of current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({
          dayNumber: i,
          currentMonth: true,
          date: `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
      }
      
      // Add days from next month if needed to complete the grid (6 rows x 7 days)
      const remainingDays = 42 - days.length; // 6 rows of 7 days each
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
        const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
        days.push({
          dayNumber: i,
          currentMonth: false,
          date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        });
      }
      
      return days;
    }
  },
  
  methods: {
    // Dropdown methods for stats cards
    toggleMenu(title) {
      this.$set(this.dropdowns, title, !this.dropdowns[title]);
    },
    
    selectTime(title, option) {
      this.$set(this.selectedOptions, title, option);
      this.$set(this.dropdowns, title, false);
    },
    
    // Calendar navigation
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    
    // Event handling
    hasEvent(date) {
      return this.events.some(event => event.date === date);
    },
    
    isToday(date) {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      return date === todayString;
    },
    
    selectDate(date) {
      this.newEvent.date = date;
      this.dateMenu = false;
    },
    
    formatEventDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    },
    
    getEventTypeColor(type) {
      const colors = {
        event: 'teal',
        task: 'orange',
        meet: 'purple'
      };
      return colors[type] || 'gray';
    },
    
    createEvent() {
      // Create a new event
      const newEvent = {
        id: this.nextEventId++,
        title: this.newEvent.title || 'Untitled Event',
        date: this.newEvent.date,
        timeFrom: this.newEvent.timeFrom,
        timeTo: this.newEvent.timeTo,
        type: this.eventType,
        isRecent: true
      };
      
      // Add to events array
      this.events.unshift(newEvent);
      
      // Reset form
      this.newEvent = {
        title: '',
        date: new Date().toISOString().substr(0, 10),
        timeFrom: '14:00',
        timeTo: '15:00',
        type: 'event',
        repeatEvery: 'On',
        repeatDays: []
      };
      
      // Reset event type
      this.eventType = 'event';
      
      // After a short delay, remove the 'recent' highlight
      setTimeout(() => {
        const index = this.events.findIndex(e => e.id === newEvent.id);
        if (index !== -1) {
          this.$set(this.events[index], 'isRecent', false);
        }
      }, 3000);
    },
    
    deleteEvent(id) {
      const index = this.events.findIndex(event => event.id === id);
      if (index !== -1) {
        this.events.splice(index, 1);
      }
    }
  }
};
</script>




<style scoped>


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

.search-container {
  display: flex;
  justify-content: flex-end;
  padding: 10px 24px;
}

.search-input {
  max-width: 300px;
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
  
}

.language-icon v-icon {
  color: #871F8D; /* Icon color */
  
}

.language-icon {
  position: absolute;
  top: 20px;
  right: 20px;
}

.custom-card {
  border-radius: 12px;
  transition: all 0.3s;
  position: relative;
}

.custom-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #424242;
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
  font-size: 20px;
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
  font-size: 14px;
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

/* Calendar Styles */
.calendar-day {
  width: 14.28%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.other-month {
  opacity: 0.4;
}

.today .day-number {
  background-color: #00897b;
  color: white;
}

.has-event .day-number {
  color: white;
  background-color: #26a69a;
}

.has-event.today .day-number {
  background-color: #00695c;
}

/* Event card styles */
.event-card {
  transition: all 0.5s;
}

.recent-event {
  background-color: #e0f2f1;
  animation: pulse 2s ease-in-out;
}

.meeting-card {
  border-radius: 12px;
  overflow: hidden;
}

.date-badge {
  background-color: #e0f2f1;
  border-radius: 8px;
  text-align: center;
  width: 50px;
}

.date-month {
  font-size: 12px;
  color: #00897b;
  text-transform: uppercase;
}

.date-day {
  font-size: 18px;
  font-weight: 700;
  color: #00897b;
}

.event-type {
  font-size: 12px;
  color: #00897b;
  text-transform: uppercase;
  font-weight: 500;
}

.meeting-title {
  font-size: 16px;
  font-weight: 600;
}

.time-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 8px 12px;
}

.time-text {
  font-size: 14px;
  font-weight: 500;
}

.time-separator {
  color: #9e9e9e;
}

.join-btn {
  background-color: #00897b !important;
  color: white !important;
  text-transform: none;
}

@keyframes pulse {
  0% {
    background-color: #e0f2f1;
  }
  50% {
    background-color: #b2dfdb;
  }
  100% {
    background-color: #e0f2f1;
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .custom-card {
    margin-bottom: 16px;
  }
}
</style>