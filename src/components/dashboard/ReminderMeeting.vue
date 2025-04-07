<template>
  <div class="reminder-container">
    <!-- Left Column - Meeting Cards -->
    <div class="reminder-list">
      <h3 class="list-title">
        Your Reminders
      </h3>
      
      <!-- Meeting Cards -->
      <div
        v-if="events.length > 0"
        class="meeting-cards"
      >
        <div
          v-for="event in events"
          :key="event.id"
          class="meeting-card"
        >
          <!-- Date Badge -->
          <div class="meeting-header">
            <div class="date-badge">
              <div class="date-month">
                {{ formatMonthShort(event.date) }}
              </div>
              <div class="date-day">
                {{ formatDay(event.date) }}
              </div>
            </div>
            <div class="meeting-info">
              <div class="event-type">
                {{ event.type }}
              </div>
              <div class="event-title">
                {{ event.title }}
              </div>
            </div>
          </div>
          
          <!-- Time Info -->
          <div class="meeting-time">
            <div class="time-slot">
              <div class="time-from">
                {{ formatTime(event.timeFrom) }}
                <span class="time-period">{{ getTimePeriod(event.timeFrom) }}</span>
              </div>
              <v-icon size="small">
                mdi-chevron-right
              </v-icon>
              <div class="time-to">
                {{ formatTime(event.timeTo) }}
                <span class="time-period">{{ getTimePeriod(event.timeTo) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Attendees -->
          <div class="meeting-attendees">
            <v-avatar
              v-for="(person, index) in event.attendees"
              :key="index"
              size="28"
              class="attendee-avatar"
            >
              <v-img :src="person.avatar" />
            </v-avatar>
          </div>
          
          <!-- Join Button -->
          <v-btn
            v-if="event.type !== 'Task'"
            block
            color="black"
            class="join-btn text-white"
          >
            <v-icon
              size="small"
              class="mr-1"
            >
              mdi-video
            </v-icon>
            Join Meeting
          </v-btn>
          <v-btn
            v-else
            block
            color="black"
            class="join-btn text-white"
          >
            <v-icon
              size="small"
              class="mr-1"
            >
              mdi-check
            </v-icon>
            Complete Task
          </v-btn>
        </div>
      </div>
      
      <!-- Empty State -->
      <div
        v-else
        class="empty-state"
      >
        <v-icon
          size="large"
          color="grey-lighten-1"
        >
          mdi-calendar-blank-outline
        </v-icon>
        <p>No reminders created yet</p>
      </div>
    </div>

    <!-- Middle Column - Create Reminder -->
    <div class="reminder-create">
      <!-- User Info -->
      <div class="user-info">
        <v-avatar
          size="36"
          class="mr-2"
        >
          <v-img :src="userAvatar" />
        </v-avatar>
        <span class="user-name">me ({{ userName }})</span>
      </div>

      <!-- Event Type Selection -->
      <div class="event-type-toggle">
        <v-btn-toggle
          v-model="eventType"
          mandatory
          rounded="pill"
          density="comfortable"
          color="teal"
        >
          <v-btn
            value="event"
            variant="text"
            class="event-btn"
          >
            Event
          </v-btn>
          <v-btn
            value="task"
            variant="text"
            class="event-btn"
          >
            Task
          </v-btn>
          <v-btn
            value="meet"
            variant="text"
            class="event-btn"
          >
            Meet
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Title Input -->
      <v-text-field
        v-model="newEvent.title"
        placeholder="Add title"
        variant="outlined"
        density="compact"
        hide-details
        class="title-input"
      />

      <!-- Date and Time Section -->
      <v-card class="reminder-section" variant="outlined">
        <div class="section-header">
          <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
          <span class="section-title">Date and time</span>
        </div>

        <!-- Date Selection -->
        <div class="input-row">
          <div class="input-label">On</div>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedDate"
                density="compact"
                variant="outlined"
                readonly
                hide-details
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="newEvent.date"
              @update:model-value="dateMenu = false"
            />
          </v-menu>
        </div>

        <!-- Time From -->
        <div class="input-row">
          <div class="input-label">From</div>
          <v-menu
            v-model="timeFromMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedTimeFrom"
                density="compact"
                variant="outlined"
                readonly
                hide-details
                v-bind="props"
              />
            </template>
            <v-time-picker
              v-model="newEvent.timeFrom"
              @update:model-value="timeFromMenu = false"
            />
          </v-menu>
        </div>

        <!-- Time To -->
        <div class="input-row">
          <div class="input-label">To</div>
          <v-menu
            v-model="timeToMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedTimeTo"
                density="compact"
                variant="outlined"
                readonly
                hide-details
                v-bind="props"
              />
            </template>
            <v-time-picker
              v-model="newEvent.timeTo"
              @update:model-value="timeToMenu = false"
            />
          </v-menu>
        </div>
      </v-card>

      <!-- People Section -->
      <v-card
        v-if="eventType !== 'task'"
        class="reminder-section mb-4"
        variant="outlined"
      >
        <div class="d-flex align-center px-3 py-2">
          <v-icon
            size="small"
            class="mr-2"
          >
            mdi-account-outline
          </v-icon>
          <v-text-field
            v-model="peopleSearch"
            placeholder="Add people"
            variant="plain"
            density="compact"
            hide-details
            class="people-input"
          >
            <template #append>
              <v-menu
                v-model="peopleMenu"
                :close-on-content-click="false"
                location="bottom"
              >
                <template #activator="{ props }">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    v-bind="props"
                  >
                    <v-icon size="small">
                      mdi-chevron-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    v-for="person in filteredPeople"
                    :key="person.id"
                    @click="addPerson(person)"
                  >
                    <template #prepend>
                      <v-avatar size="32">
                        <v-img :src="person.avatar" />
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ person.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </div>
        
        <!-- Selected People -->
        <div
          v-if="selectedPeople.length > 0"
          class="selected-people px-3 py-2"
        >
          <div
            v-for="(person, index) in selectedPeople"
            :key="person.id"
            class="selected-person"
          >
            <v-avatar
              size="24"
              class="mr-1"
            >
              <v-img :src="person.avatar" />
            </v-avatar>
            <span class="person-name">{{ person.name }}</span>
            <v-btn
              icon
              size="x-small"
              variant="text"
              @click="removePerson(index)"
            >
              <v-icon size="small">
                mdi-close
              </v-icon>
            </v-btn>
          </div>
        </div>
      </v-card>

      <!-- Meeting Link Section -->
      <v-card
        v-if="eventType !== 'task'"
        class="reminder-section mb-4"
        variant="outlined"
      >
        <div class="d-flex align-center px-3 py-2">
          <v-icon
            size="small"
            class="mr-2"
          >
            mdi-link
          </v-icon>
          <v-text-field
            v-model="newEvent.meetingLink"
            placeholder="Add meeting link"
            variant="plain"
            density="compact"
            hide-details
            class="link-input"
          />
        </div>
      </v-card>

      <!-- Description Section (New) -->
      <v-card
        class="reminder-section mb-4"
        variant="outlined"
      >
        <div class="d-flex align-center px-3 py-2">
          <v-icon
            size="small"
            class="mr-2"
          >
            mdi-text-box-outline
          </v-icon>
          <v-textarea
            v-model="newEvent.description"
            placeholder="Add description"
            variant="plain"
            density="compact"
            hide-details
            auto-grow
            rows="2"
            class="description-input"
          />
        </div>
      </v-card>

      <!-- Repeat Section -->
      <v-card
        class="reminder-section"
        variant="outlined"
      >
        <div class="section-header">
          <v-icon
            size="small"
            class="mr-2"
          >
            mdi-repeat
          </v-icon>
          <span class="section-title">Repeat</span>
        </div>

        <!-- Repeat Frequency -->
        <div class="input-row">
          <div class="input-label">
            Every
          </div>
          <v-select
            v-model="newEvent.repeatEvery"
            :items="repeatOptions"
            density="compact"
            variant="outlined"
            hide-details
          />
        </div>

        <!-- Repeat Days -->
        <div class="input-row" v-if="newEvent.repeatEvery === 'Weekly'">
          <div class="input-label">
            On
          </div>
          <div class="day-toggles">
            <v-btn-toggle
              v-model="newEvent.repeatDays"
              multiple
              density="comfortable"
              class="day-toggle-group"
            >
              <v-btn
                v-for="day in weekDays" 
                :key="day.value"
                :value="day.value"
                size="x-small"
                class="day-btn"
                variant="text"
              >
                {{ day.label }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
        
        <!-- End Repeat (New) -->
        <div class="input-row" v-if="newEvent.repeatEvery !== 'On'">
          <div class="input-label">
            Until
          </div>
          <v-menu
            v-model="endDateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="formattedEndDate"
                density="compact"
                variant="outlined"
                readonly
                hide-details
                v-bind="props"
              />
            </template>
            <v-date-picker
              v-model="newEvent.endRepeatDate"
              @update:model-value="endDateMenu = false"
            />
          </v-menu>
        </div>
      </v-card>
    </div>

    <!-- Right Column - Calendar -->
    <div class="calendar-section">
      <!-- Calendar Container -->
      <div class="calendar-container">
        <!-- Calendar Header -->
        <div class="calendar-header">
          <div class="month-display">
            <span class="month-name">{{ currentMonthText }}</span>
          </div>
          <div class="month-navigation">
            <v-btn
              icon="mdi-chevron-left"
              size="small"
              variant="text"
              @click="previousMonth"
            />
            <v-btn
              text
              size="small"
              variant="text"
              @click="goToToday"
            >
              Today
            </v-btn>
            <v-btn
              icon="mdi-chevron-right"
              size="small"
              variant="text"
              @click="nextMonth"
            />
          </div>
        </div>

        <!-- Calendar Days Header -->
        <div class="calendar-days-header">
          <div
            v-for="day in daysOfWeek"
            :key="day"
            class="day-header"
          >
            {{ day }}
          </div>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <div
            v-for="(day, index) in calendarDays"
            :key="index"
            class="calendar-day"
            :class="{
              'current-month': day.currentMonth,
              'other-month': !day.currentMonth,
              'selected-day': isSelectedDate(day.date),
              'today': isToday(day.date),
              'has-event': hasEvent(day.date)
            }"
            @click="selectDateFromCalendar(day.date)"
          >
            <div class="day-number">
              {{ day.dayNumber }}
            </div>
            <div v-if="hasEvent(day.date)" class="event-indicator"></div>
          </div>
        </div>

        <!-- Events for Selected Day (New) -->
        <div v-if="eventsForSelectedDay.length > 0" class="selected-day-events">
          <h4>Events on {{ formattedSelectedDate }}</h4>
          <div v-for="event in eventsForSelectedDay" :key="event.id" class="selected-day-event">
            <div class="event-time">{{ formatTime(event.timeFrom) }} {{ getTimePeriod(event.timeFrom) }}</div>
            <div class="event-title">{{ event.title }}</div>
          </div>
        </div>

        <!-- Create Button -->
        <v-btn 
          block 
          color="teal" 
          class="create-btn text-white"
          @click="createEvent"
          :disabled="!newEvent.title"
        >
          Create
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// State
const eventType = ref('event');
const peopleMenu = ref(false);
const peopleSearch = ref('');
const selectedPeople = ref([]);
const userName = ref('Isabella');
const userAvatar = ref('https://randomuser.me/api/portraits/women/85.jpg');

// For date and time menus
const dateMenu = ref(false);
const timeFromMenu = ref(false);
const timeToMenu = ref(false);
const endDateMenu = ref(false);

// Calculate today's date once
const todayDate = new Date();
const todayISOString = todayDate.toISOString().slice(0, 10);

// Initialize newEvent with default values
const newEvent = ref({
  title: '',
  description: '', // New field
  date: todayISOString,
  timeFrom: '09:00',
  timeTo: '10:00',
  meetingLink: '',
  repeatEvery: 'On',
  repeatDays: [],
  endRepeatDate: '', // New field
  attendees: []
});

// Set end repeat date to 1 month from start date by default
const setDefaultEndDate = () => {
  const endDate = new Date(newEvent.value.date);
  endDate.setMonth(endDate.getMonth() + 1);
  newEvent.value.endRepeatDate = endDate.toISOString().slice(0, 10);
};

// Call this when repeat option changes
watch(() => newEvent.value.repeatEvery, (newValue) => {
  if (newValue !== 'On' && !newEvent.value.endRepeatDate) {
    setDefaultEndDate();
  }
});

// Formatted dates for display
const formattedDate = computed(() => formatDateForDisplay(newEvent.value.date));
const formattedTimeFrom = computed(() => formatTimeForDisplay(newEvent.value.timeFrom));
const formattedTimeTo = computed(() => formatTimeForDisplay(newEvent.value.timeTo));
const formattedEndDate = computed(() => formatDateForDisplay(newEvent.value.endRepeatDate));
const formattedSelectedDate = computed(() => formatDateForDisplay(newEvent.value.date, { includeDay: true }));

// Get events for the selected day
const eventsForSelectedDay = computed(() => {
  return events.value.filter(event => event.date === newEvent.value.date);
});

const weekDays = [
  { label: 'M', value: 'M' },
  { label: 'T', value: 'T1' },
  { label: 'W', value: 'W' },
  { label: 'T', value: 'T2' },
  { label: 'F', value: 'F' },
  { label: 'S', value: 'S1' },
  { label: 'S', value: 'S2' }
];

const repeatOptions = ['On', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

const events = ref([
  {
    id: 1,
    title: 'Meeting with Company',
    description: 'Quarterly review with stakeholders',
    date: '2025-04-05',
    timeFrom: '10:00',
    timeTo: '11:30',
    type: 'Live event',
    meetingLink: 'https://meet.zoom.com/123456',
    attendees: [
      { id: 1, name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: 2, name: 'Emma Johnson', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 3, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 4, name: 'Sarah Davis', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
    ],
    repeatEvery: 'Monthly',
    repeatDays: [],
    endRepeatDate: '2025-10-05'
  }
]);

const people = [
  { id: 1, name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Emma Johnson', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Sarah Davis', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 5, name: 'David Wilson', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 6, name: 'Jennifer Taylor', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' }
];

// Initialize calendar with current month
const currentMonth = ref(todayDate.getMonth());
const currentYear = ref(todayDate.getFullYear());
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const nextEventId = ref(2);

// Select date from calendar
function selectDateFromCalendar(date) {
  if (!date) return;
  newEvent.value.date = date;
}

// Helper function for date formatting
function formatDateForDisplay(dateString, options = {}) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const formatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (options.includeDay) {
      formatOptions.weekday = 'long';
    }
    
    return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
}

// Helper function for time formatting
function formatTimeForDisplay(timeString) {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    if (isNaN(h)) return '';
    
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
}

const currentMonthText = computed(() => {
  try {
    const date = new Date(currentYear.value, currentMonth.value, 1);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Month formatting error:', error);
    return '';
  }
});

// Calendar days computation with memoization
const calendarDays = computed(() => {
  try {
    const days = [];
    const firstDay = new Date(currentYear.value, currentMonth.value, 1);
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
    
    // Get day of week of first day (0 is Sunday, so we adjust for Monday start)
    let firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    
    // Add days from previous month
    const prevLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonth = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
      const prevYear = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
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
        date: `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    
    // Add days from next month to complete the grid (6 rows * 7 days = 42 cells)
    const daysNeeded = 42 - days.length;
    
    for (let i = 1; i <= daysNeeded; i++) {
      const nextMonth = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
      const nextYear = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
      days.push({
        dayNumber: i,
        currentMonth: false,
        date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }
    
    return days;
  } catch (error) {
    console.error('Calendar generation error:', error);
    return [];
  }
});

const filteredPeople = computed(() => {
  if (!peopleSearch.value) return people;
  
  const search = peopleSearch.value.toLowerCase();
  // Filter out people already selected
  return people.filter(person => 
    person.name.toLowerCase().includes(search) && 
    !selectedPeople.value.some(p => p.id === person.id)
  );
});

// Calendar navigation methods
function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

// Go to today function
function goToToday() {
  const today = new Date();
  currentMonth.value = today.getMonth();
  currentYear.value = today.getFullYear();
  newEvent.value.date = todayISOString;
}

// Check if a day has events
function hasEvent(date) {
  if (!date) return false;
  return events.value.some(event => event.date === date);
}

// Check if a date is today
function isToday(date) {
  if (!date) return false;
  
  try {
    return date === todayISOString;
  } catch (error) {
    console.error('Date comparison error:', error);
    return false;
  }
}

// Check if a date is selected in the form
function isSelectedDate(date) {
  if (!date || !newEvent.value.date) return false;
  return date === newEvent.value.date;
}

// People selection functions
function addPerson(person) {
  if (!selectedPeople.value.some(p => p.id === person.id)) {
    selectedPeople.value.push(person);
  }
  peopleSearch.value = '';
  peopleMenu.value = false;
}

function removePerson(index) {
  selectedPeople.value.splice(index, 1);
}

// Date and time formatting functions
function formatMonthShort(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
  } catch (error) {
    console.error('Month formatting error:', error);
    return '';
  }
}

function formatDay(dateString) {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.getDate();
  } catch (error) {
    console.error('Day formatting error:', error);
    return '';
  }
}

function formatTime(timeString) {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    if (isNaN(h)) return '';
    
    const hour = h % 12 || 12;
    return `${hour}:${minutes}`;
  } catch (error) {
    console.error('Time formatting error:', error);
    return '';
  }
}

function getTimePeriod(timeString) {
  if (!timeString) return '';
  
  try {
    const hours = parseInt(timeString.split(':')[0]);
    if (isNaN(hours)) return '';
    
    return hours >= 12 ? 'PM' : 'AM';
  } catch (error) {
    console.error('Time period error:', error);
    return '';
  }
}

// Reset form function
function resetForm() {
  newEvent.value = {
    title: '',
    description: '',
    date: todayISOString,
    timeFrom: '09:00',
    timeTo: '10:00',
    meetingLink: '',
    repeatEvery: 'On',
    repeatDays: [],
    endRepeatDate: ''
  };
  
  // Close any open menus
  dateMenu.value = false;
  timeFromMenu.value = false;
  timeToMenu.value = false;
  endDateMenu.value = false;
  
  selectedPeople.value = [];
  eventType.value = 'event';
}

// Form validation
const isFormValid = computed(() => {
  return !!newEvent.value.title;
});

// Create event function
function createEvent() {
  if (!isFormValid.value) {
    // Add user notification here if needed
    return;
  }
  
  // Create a new event
  const createdEvent = {
    id: nextEventId.value++,
    title: newEvent.value.title,
    description: newEvent.value.description,
    date: newEvent.value.date,
    timeFrom: newEvent.value.timeFrom,
    timeTo: newEvent.value.timeTo,
    type: eventType.value === 'event' ? 'Live event' : 
          eventType.value === 'meet' ? 'Meeting' : 'Task',
    meetingLink: newEvent.value.meetingLink,
    attendees: [...selectedPeople.value],
    repeatEvery: newEvent.value.repeatEvery,
    repeatDays: [...newEvent.value.repeatDays],
    endRepeatDate: newEvent.value.endRepeatDate
  };

  // Add to events array and sort by date and time
  events.value.push(createdEvent);
  events.value.sort((a, b) => {
    // Sort by date first
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    
    // If same date, sort by time
    return a.timeFrom < b.timeFrom ? -1 : 1;
  });
  
  // Generate recurring events if needed
  if (newEvent.value.repeatEvery !== 'On' && newEvent.value.endRepeatDate) {
    generateRecurringEvents(createdEvent);
  }
  
  // Reset form
  resetForm();
}

// Generate recurring events based on repeat settings
function generateRecurringEvents(sourceEvent) {
  const startDate = new Date(sourceEvent.date);
  const endDate = new Date(sourceEvent.endRepeatDate);
  let currentDate = new Date(startDate);
  currentDate.setDate(currentDate.getDate() + 1); // Start from next day
  
  // Create recurring events based on repeat type
  while (currentDate <= endDate) {
    let shouldAddEvent = false;
    
    switch(sourceEvent.repeatEvery) {
      case 'Daily':
        shouldAddEvent = true;
        break;
        
      case 'Weekly':
        // If specific days are selected, check if current day matches
        if (sourceEvent.repeatDays.length > 0) {
          const dayIndex = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayMapping = {
            0: 'S2', // Sunday
            1: 'M',  // Monday
            2: 'T1', // Tuesday
            3: 'W',  // Wednesday
            4: 'T2', // Thursday
            5: 'F',  // Friday
            6: 'S1'  // Saturday
          };
          shouldAddEvent = sourceEvent.repeatDays.includes(dayMapping[dayIndex]);
        } else {
          // If no specific days, repeat on same day of week
          shouldAddEvent = currentDate.getDay() === startDate.getDay();
        }
        break;
        
      case 'Monthly':
        // Same day of month
        shouldAddEvent = currentDate.getDate() === startDate.getDate();
        break;
        
      case 'Yearly':
        // Same day and month
        shouldAddEvent = 
          currentDate.getDate() === startDate.getDate() && 
          currentDate.getMonth() === startDate.getMonth();
        break;
    }
    
    if (shouldAddEvent) {
      const newEvent = {
        ...sourceEvent,
        id: nextEventId.value++,
        date: currentDate.toISOString().slice(0, 10),
        isRecurring: true,
        parentEventId: sourceEvent.id
      };
      events.value.push(newEvent);
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sort events again after adding recurring ones
  events.value.sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.timeFrom < b.timeFrom ? -1 : 1;
  });
}

// Initialize when component is mounted
onMounted(() => {
  // Default to today's date
  goToToday();
});
</script>

<style scoped>
.reminder-container {
  display: flex;
  width: 1000px;
  height: 700px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
}

/* Left Column - Meeting Cards */
.reminder-list {
  width: 300px;
  height: 100%;
  padding: 16px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.list-title {
  font-size: 16px;
  margin-bottom: 16px;
  color: #424242;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #9e9e9e;
}

.meeting-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meeting-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  background-color: white;
}

.meeting-header {
  display: flex;
  margin-bottom: 12px;
}

.date-badge {
  background-color: #ffebee;
  border-radius: 4px;
  padding: 4px;
  width: 40px;
  text-align: center;
  margin-right: 10px;
}

.date-month {
  color: #f44336;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.date-day {
  color: #f44336;
  font-size: 18px;
  font-weight: 700;
}

.meeting-info {
  display: flex;
  flex-direction: column;
}

.event-type {
  font-size: 12px;
  color: #757575;
  margin-bottom: 4px;
}

.event-title {
  font-size: 14px;
  font-weight: 500;
}

.meeting-time {
  display: flex;
  margin-bottom: 12px;
}

.time-slot {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 8px;
  width: 100%;
  justify-content: space-between;
}

.time-from, .time-to {
  font-size: 14px;
  font-weight: 500;
}

.time-period {
  font-size: 12px;
  color: #757575;
}

.meeting-attendees {
  display: flex;
  margin-bottom: 12px;
}

.attendee-avatar {
  margin-right: -10px;
  border: 2px solid white;
}

.join-btn {
  text-transform: none;
  letter-spacing: 0;
}

/* Middle Column - Create Reminder */
.reminder-create {
  width: 300px;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.event-type-toggle {
  margin-bottom: 16px;
}

.event-btn {
  min-width: 64px !important;
  letter-spacing: 0 !important;
  font-weight: 500 !important;
}

.title-input {
  margin-bottom: 16px;
}

.reminder-section {
  margin-bottom: 16px;
  padding: 8px 12px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.section-title {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.87);
}

.input-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
}

.input-label {
  width: 40px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.people-input, .link-input {
  margin: 0;
  padding: 0;
}

.day-toggles {
  display: flex;
  flex-grow: 1;
}

.day-toggle-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.day-btn {
  min-width: 28px !important;
  width: 28px !important;
  padding: 0 !important;
  height: 28px !important;
  margin-right: 4px;
}

/* Right Column - Calendar */
.calendar-section {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* Calendar Section - Updated position */
.calendar-container {
  width: 350px;
  margin: 24px auto 0;
  transform: none; /* Remove transform property */
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.month-name {
  font-size: 14px;
  font-weight: 500;
}

.month-display {
  display: flex;
  align-items: center;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
}

.day-header {
  text-align: center;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
  padding: 2px 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(5, 1fr);
  height: 200px;
  gap: 1px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.calendar-day {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
}

.day-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
}

.calendar-day:hover .day-number {
  background-color: #f5f5f5;
}

.other-month {
  color: #bdbdbd;
}

.today .day-number {
  background-color: #00897b;
  color: white;
}

.selected-day .day-number {
  background-color: #b2dfdb;
  color: #00695c;
}

.has-event .day-number {
  position: relative;
}

.has-event .day-number::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: #00897b;
  border-radius: 50%;
}

.has-event.today .day-number::after {
  background-color: white;
}

.create-btn {
  height: 40px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  margin-top: 16px;
}

/* Selected people chips */
.selected-people {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
}

.selected-person {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 12px;
}

</style>