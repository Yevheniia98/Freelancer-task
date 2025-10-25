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
            <div class="event-type-container">
              <span class="event-type">{{ event.type }}</span>
              <v-chip
                v-if="event.platform && event.meetingLink"
                size="x-small"
                :color="getMeetingButtonColor(event)"
                variant="elevated"
                class="platform-chip"
              >
                <v-icon size="x-small" class="mr-1">{{ getMeetingIcon(event) }}</v-icon>
                {{ event.platform.toUpperCase() }}
              </v-chip>
            </div>
            <div class="event-title">
              {{ event.title }}
            </div>
          </div>
          </div>

          <!-- Meeting Description -->
          <div v-if="event.description" class="meeting-description">
            <p class="description-text">{{ event.description }}</p>
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
          <v-tooltip
            v-if="event.type !== 'Task'"
            location="top"
            :text="getMeetingTooltip(event)"
          >
            <template #activator="{ props }">
              <a
                v-if="event.meetingLink"
                :href="event.meetingLink"
                class="meeting-link-wrapper"
                @click="joinMeeting(event)"
              >
                <v-btn
                  v-bind="props"
                  block
                  :color="getMeetingButtonColor(event)"
                  class="join-btn text-white"
                  :loading="joiningMeeting === event.id"
                  tag="div"
                >
                  <v-icon
                    size="small"
                    class="mr-1"
                  >
                    {{ getMeetingIcon(event) }}
                  </v-icon>
                  {{ getMeetingButtonText(event) }}
                </v-btn>
              </a>
              <v-btn
                v-else
                v-bind="props"
                block
                :color="getMeetingButtonColor(event)"
                class="join-btn text-white"
                disabled
              >
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  {{ getMeetingIcon(event) }}
                </v-icon>
                {{ getMeetingButtonText(event) }}
              </v-btn>
            </template>
          </v-tooltip>
          <v-btn
            v-else
            block
            color="success"
            class="join-btn text-white"
            @click="completeTask(event)"
          >
            <v-icon
              size="small"
              class="mr-1"
            >
              mdi-check
            </v-icon>
            Complete Task
          </v-btn>
          
          <!-- Delete Button for All Event Types -->
          <v-btn
            icon
            size="small"
            color="error"
            variant="text"
            class="delete-btn"
            @click="deleteEvent(event.id)"
          >
            <v-icon size="small">mdi-delete</v-icon>
            <v-tooltip
              activator="parent"
              location="top"
            >
              Delete reminder
            </v-tooltip>
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
      <!-- User Info Box -->
      <div class="user-info-box">
        <div class="user-info d-flex align-center">
          <v-avatar
            size="48"
            class="mr-3"
          >
            <v-img :src="userAvatar" />
          </v-avatar>
          <span class="user-name text-h6 font-weight-medium">me ({{ userName }})</span>
        </div>
      </div>

      <!-- Event Type Selection Box -->
      <div class="event-type-box">
        <v-btn-toggle
          v-model="eventType"
          mandatory
          class="event-type-buttons"
          color="teal"
        >
          <v-btn
            value="event"
            class="event-type-btn"
            :class="{ 'active': eventType === 'event' }"
          >
            Event
          </v-btn>
          <v-btn
            value="task"
            class="event-type-btn"
            :class="{ 'active': eventType === 'task' }"
          >
            Task
          </v-btn>
          <v-btn
            value="meet"
            class="event-type-btn"
            :class="{ 'active': eventType === 'meet' }"
          >
            Meet
          </v-btn>
        </v-btn-toggle>
      </div>

      <!-- Title Input Box -->
      <div class="input-box title-box">
        <input
          v-model="newEvent.title"
          placeholder="Add title"
          class="title-input"
        />
      </div>

      <!-- Date and Time Section -->
      <div class="input-box datetime-box">
        <div class="datetime-header">
          <v-icon class="datetime-icon">mdi-clock-outline</v-icon>
          <span class="datetime-title">Date and time</span>
        </div>

        <!-- Date Selection Row -->
        <div class="datetime-row">
          <span class="datetime-label">On</span>
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template #activator="{ props }">
              <input
                :value="formattedDate || 'Select the day'"
                readonly
                class="datetime-input"
                v-bind="props"
                placeholder="Select the day"
              />
            </template>
            <v-date-picker
              v-model="newEvent.date"
              @update:model-value="dateMenu = false"
            />
          </v-menu>
        </div>

        <!-- Time From Row -->
        <div class="datetime-row">
          <span class="datetime-label">From</span>
          <v-menu
            v-model="timeFromMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template #activator="{ props }">
              <input
                :value="formattedTimeFrom || 'Select the time'"
                readonly
                class="datetime-input"
                v-bind="props"
                placeholder="Select the time"
              />
            </template>
            <v-time-picker
              v-model="newEvent.timeFrom"
              @update:model-value="timeFromMenu = false"
            />
          </v-menu>
        </div>

        <!-- Time To Row -->
        <div class="datetime-row">
          <span class="datetime-label">To</span>
          <v-menu
            v-model="timeToMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            location="bottom"
          >
            <template #activator="{ props }">
              <input
                :value="formattedTimeTo || 'Select the time'"
                readonly
                class="datetime-input"
                v-bind="props"
                placeholder="Select the time"
              />
            </template>
            <v-time-picker
              v-model="newEvent.timeTo"
              @update:model-value="timeToMenu = false"
            />
          </v-menu>
        </div>
      </div>

      <!-- Add People Section -->
      <div 
        v-if="eventType !== 'task'"
        class="input-box people-box"
      >
        <div class="people-header">
          <v-icon class="people-icon">mdi-account-multiple-plus</v-icon>
          <span class="people-title">Add people</span>
        </div>

        <!-- Invitation Type Toggle -->
        <div class="invitation-type-toggle mb-3">
          <v-btn-toggle
            v-model="invitationType"
            mandatory
            density="compact"
            color="primary"
            class="invitation-toggle"
          >
            <v-btn
              value="app-users"
              variant="outlined"
              class="invitation-btn"
            >
              <v-icon class="mr-1">mdi-account-circle</v-icon>
              App Users
            </v-btn>
            <v-btn
              value="email"
              variant="outlined"
              class="invitation-btn"
            >
              <v-icon class="mr-1">mdi-email</v-icon>
              Email
            </v-btn>
          </v-btn-toggle>
        </div>

        <!-- App Users Selection -->
        <div v-if="invitationType === 'app-users'" class="d-flex align-center px-3 py-2">
          <v-text-field
            v-model="peopleSearch"
            placeholder="Search app users"
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
                width="300"
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
                <v-card class="people-dropdown" elevation="8">
                  <v-card-title class="pa-3">
                    <v-icon class="mr-2">mdi-account-search</v-icon>
                    Available Users
                  </v-card-title>
                  <v-list density="compact" max-height="200" class="overflow-y-auto">
                    <v-list-item
                      v-for="person in filteredPeople"
                      :key="person.id"
                      @click="addPerson(person)"
                      class="person-option"
                    >
                      <template #prepend>
                        <v-avatar size="32">
                          <v-img :src="person.avatar" />
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ person.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ person.email }}</v-list-item-subtitle>
                      <template #append>
                        <v-icon color="success">mdi-plus-circle</v-icon>
                      </template>
                    </v-list-item>
                    <v-list-item v-if="filteredPeople.length === 0" disabled>
                      <v-list-item-title class="text-center text-grey">
                        No users found
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>
          </v-text-field>
        </div>

        <!-- Email Invitation -->
        <div v-else class="email-invitation px-3 py-2">
          <v-text-field
            v-model="emailInviteInput"
            placeholder="Enter email addresses (comma separated)"
            variant="plain"
            density="compact"
            hide-details
            class="email-input"
            @keyup.enter="addEmailInvitees"
          >
            <template #append>
              <v-btn
                icon="mdi-plus"
                size="small"
                variant="text"
                @click="addEmailInvitees"
                :disabled="!emailInviteInput.trim()"
              />
            </template>
          </v-text-field>
          

          <div class="email-hint mt-1">
            <v-icon size="small" class="mr-1">mdi-information-outline</v-icon>
            <span class="text-caption text-grey">Press Enter or click + to add emails</span>
          </div>
          

        </div>
        
        <!-- Selected People and Email Invitees -->
        <div
          v-if="selectedPeople.length > 0 || emailInvitees.length > 0"
          class="selected-people px-3 py-2"
        >
          <!-- App Users -->
          <div
            v-for="(person, index) in selectedPeople"
            :key="`user-${person.id}`"
            class="selected-person app-user"
          >
            <v-avatar
              size="24"
              class="mr-2"
            >
              <v-img :src="person.avatar" />
            </v-avatar>
            <div class="person-info">
              <span class="person-name">{{ person.name }}</span>
              <span class="person-type">App User</span>
            </div>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              @click="removePerson(index)"
            />
          </div>

          <!-- Email Invitees -->
          <div
            v-for="(email, index) in emailInvitees"
            :key="`email-${index}`"
            class="selected-person email-invitee"
          >
            <v-avatar
              size="24"
              class="mr-2"
              color="grey-lighten-2"
            >
              <v-icon size="16">mdi-email</v-icon>
            </v-avatar>
            <div class="person-info">
              <span class="person-name">{{ email }}</span>
              <span class="person-type">Email Invite</span>
            </div>
            <v-btn
              icon="mdi-close"
              size="x-small"
              variant="text"
              @click="removeEmailInvitee(index)"
            />
          </div>
        </div>

        <!-- Invitation Summary -->
        <div v-if="selectedPeople.length > 0 || emailInvitees.length > 0" class="invitation-summary px-3 py-2">
          <v-divider class="mb-2"></v-divider>
          <div class="summary-text">
            <v-icon size="small" class="mr-1" color="success">mdi-check-circle</v-icon>
            <span class="text-caption">
              {{ selectedPeople.length + emailInvitees.length }} participant(s) will be invited
            </span>
          </div>
        </div>
      </div>

      <!-- Add Meeting Link Section -->
      <div 
        v-if="eventType !== 'task'"
        class="input-box meeting-link-box"
      >
        <div class="meeting-link-header">
          <v-icon class="meeting-link-icon">mdi-link</v-icon>
          <span class="meeting-link-title">Add meeting link</span>
        </div>

          <!-- Enhanced Platform Selection -->
          <div class="platform-selection-enhanced mb-4">
            <h4 class="text-subtitle-1 font-weight-medium mb-3 text-green-darken-1">Choose Platform</h4>
            <v-btn-toggle
              v-model="selectedPlatform"
              mandatory
              class="platform-toggle-enhanced justify-center"
              style="background: rgba(76, 175, 80, 0.1); border-radius: 15px; padding: 8px; width: 100%;"
            >
              <v-btn
                value="zoom"
                class="platform-btn-enhanced mx-1"
                style="border-radius: 12px; min-width: 110px;"
                color="blue"
              >
                <v-icon left size="small">mdi-video</v-icon>
                Zoom
              </v-btn>
              <v-btn
                value="meet"
                class="platform-btn-enhanced mx-1"
                style="border-radius: 12px; min-width: 110px;"
                color="green"
              >
                <v-icon left size="small">mdi-google</v-icon>
                Meet
              </v-btn>
              <v-btn
                value="custom"
                class="platform-btn-enhanced mx-1"
                style="border-radius: 12px; min-width: 110px;"
                color="purple"
              >
                <v-icon left size="small">mdi-link</v-icon>
                Custom
              </v-btn>
            </v-btn-toggle>
          </div>

        <!-- Auto-generate or custom link -->
        <div v-if="selectedPlatform === 'zoom'" class="d-flex align-center px-3 py-2">
          <v-btn
            variant="outlined"
            color="primary"
            @click="generateZoomLink"
            :disabled="!!newEvent.meetingLink"
            class="generate-btn"
          >
            <v-icon class="mr-1">mdi-plus</v-icon>
            Generate Zoom Link
          </v-btn>
          <v-text-field
            v-if="newEvent.meetingLink"
            v-model="newEvent.meetingLink"
            readonly
            variant="plain"
            density="compact"
            hide-details
            class="link-input ml-2"
          >
            <template #append>
              <v-btn
                icon="mdi-content-copy"
                size="small"
                variant="text"
                @click="copyToClipboard(newEvent.meetingLink)"
              />
            </template>
          </v-text-field>
        </div>

        <div v-else-if="selectedPlatform === 'meet'" class="d-flex align-center px-3 py-2">
          <v-btn
            variant="outlined"
            color="primary"
            @click="generateMeetLink"
            :disabled="!!newEvent.meetingLink"
            class="generate-btn"
          >
            <v-icon class="mr-1">mdi-plus</v-icon>
            Generate Meet Link
          </v-btn>
          <v-text-field
            v-if="newEvent.meetingLink"
            v-model="newEvent.meetingLink"
            readonly
            variant="plain"
            density="compact"
            hide-details
            class="link-input ml-2"
          >
            <template #append>
              <v-btn
                icon="mdi-content-copy"
                size="small"
                variant="text"
                @click="copyToClipboard(newEvent.meetingLink)"
              />
            </template>
          </v-text-field>
        </div>

        <div v-else class="d-flex align-center px-3 py-2">
          <v-text-field
            v-model="newEvent.meetingLink"
            placeholder="Enter custom meeting link"
            variant="plain"
            density="compact"
            hide-details
            class="link-input"
          >
            <template #append>
              <v-btn
                icon="mdi-content-copy"
                size="small"
                variant="text"
                @click="copyToClipboard(newEvent.meetingLink)"
                :disabled="!newEvent.meetingLink"
              />
            </template>
          </v-text-field>
        </div>
      </div>

      <!-- Repeat Section -->
      <div class="input-box repeat-box">
        <div class="repeat-header">
          <v-icon class="repeat-icon">mdi-repeat</v-icon>
          <span class="repeat-title">Repeat</span>
        </div>

        <!-- Repeat Frequency Row -->
        <div class="repeat-row">
          <span class="repeat-label">Every</span>
          <v-select
            v-model="newEvent.repeatEvery"
            :items="repeatOptions"
            density="compact"
            variant="outlined"
            hide-details
            class="repeat-select"
          />
        </div>

        <!-- Repeat Days Row -->
        <div
          v-if="newEvent.repeatEvery === 'Weekly'"
          class="repeat-row days-row"
        >
          <span class="repeat-label">On</span>
          <div class="weekdays-container">
            <v-btn-toggle
              v-model="newEvent.repeatDays"
              multiple
              class="weekdays-toggle"
            >
              <v-btn
                v-for="day in weekDays" 
                :key="day.value"
                :value="day.value"
                size="small"
                class="weekday-btn"
                variant="outlined"
              >
                {{ day.label }}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </div>

      <!-- Create Button -->
      <v-btn 
        block 
        size="large"
        color="success"
        class="create-btn text-white font-weight-bold mb-4"
        style="border-radius: 12px; height: 50px; font-size: 16px;"
        :disabled="!newEvent.title"
        @click="createEvent"
      >
        <v-icon left class="mr-2">mdi-plus</v-icon>
        {{ eventType === 'task' ? 'Create Task' : eventType === 'meet' ? 'Schedule Meeting' : 'Create Event' }}
      </v-btn>
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
            <div
              v-if="hasEvent(day.date)"
              class="event-indicator"
            />
          </div>
        </div>

        <!-- Events for Selected Day (New) -->
        <div
          v-if="eventsForSelectedDay.length > 0"
          class="selected-day-events"
        >
          <h4>Events on {{ formattedSelectedDate }}</h4>
          <div
            v-for="event in eventsForSelectedDay"
            :key="event.id"
            class="selected-day-event"
          >
            <div class="event-time">
              {{ formatTime(event.timeFrom) }} {{ getTimePeriod(event.timeFrom) }}
            </div>
            <div class="event-title">
              {{ event.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-toast"
          :class="`notification-${notification.type}`"
        >
          <v-icon class="notification-icon">
            {{ getNotificationIcon(notification.type) }}
          </v-icon>
          <span class="notification-message">{{ notification.message }}</span>
          <v-btn
            icon="mdi-close"
            size="x-small"
            variant="text"
            @click="removeNotification(notification.id)"
            class="notification-close"
          />
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
// Remove this import since you're defining your own implementation
// import { isSameDay } from 'vuetify/lib/util/dateTimeUtils' 


// State
const eventType = ref('event');
const peopleMenu = ref(false);
const peopleSearch = ref('');
const selectedPeople = ref([]);
const userName = ref('Isabella');
const userAvatar = ref('https://randomuser.me/api/portraits/women/85.jpg');

// Enhanced meeting functionality
const selectedPlatform = ref('zoom');
const invitationType = ref('app-users');
const emailInviteInput = ref('');
const emailInvitees = ref([]);
const notifications = ref([]);
const joiningMeeting = ref(null); // Track which meeting is being joined

// For date and time menus
const dateMenu = ref(false);
const timeFromMenu = ref(false);
const timeToMenu = ref(false);
const endDateMenu = ref(false);

// Calculate today's date once
const todayDate = new Date();
const todayISOString = todayDate.toISOString().slice(0, 10);

// Set default time values
const defaultTimeFrom = '09:00';
const defaultTimeTo = '10:00';

// Initialize newEvent with default values
const newEvent = ref({
  title: '',
  description: '', // New field
  date: todayISOString,
  timeFrom: defaultTimeFrom,
  timeTo: defaultTimeTo,
  meetingLink: '',
  repeatEvery: 'On',
  repeatDays: [],
  endRepeatDate: '', // New field
  attendees: []
});

// Define your own isSameDay function
function isSameDay(date, comparing) {
  // Check if both are valid dates
  if (!(date instanceof Date) || !(comparing instanceof Date) || isNaN(date) || isNaN(comparing)) {
    return false;
  }
  
  // Compare year, month, and day
  return date.getDate() === comparing.getDate() && 
         date.getMonth() === comparing.getMonth() && 
         date.getFullYear() === comparing.getFullYear();
}

// Helper function to convert Date objects to ISO string format
function dateToISO(date) {
  if (!date) return '';
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10);
  }
  return String(date);
}

// Set end repeat date to 1 month from start date by default
const setDefaultEndDate = () => {
  const endDate = new Date(newEvent.value.date);
  endDate.setMonth(endDate.getMonth() + 1);
  newEvent.value.endRepeatDate = endDate.toISOString().slice(0, 10);
};

function formatDateString(year, month, day) {
  const adjustedMonth = month < 0 ? 11 : month > 11 ? 0 : month;
  const adjustedYear = month < 0 ? year - 1 : month > 11 ? year + 1 : year;

  return `${adjustedYear}-${String(adjustedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
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

// Reset form function
function resetForm() {
  newEvent.value = {
    title: '',
    description: '',
    date: todayISOString,
    timeFrom: defaultTimeFrom, // Use default time values when resetting
    timeTo: defaultTimeTo,     // Use default time values when resetting
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
  emailInvitees.value = [];
  emailInviteInput.value = '';
  selectedPlatform.value = 'zoom';
  invitationType.value = 'app-users';
  eventType.value = 'event';
  joiningMeeting.value = null;
}

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

const todayISO = dateToISO(new Date());
newEvent.value.date = todayISO;

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
    date: '2025-09-10',
    timeFrom: '09:00',
    timeTo: '10:00',
    type: 'Live event',
    platform: 'zoom',
    meetingLink: 'https://meet.google.com/sic-bhis-jpu',
    attendees: [
      { id: 1, name: 'John Smith', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: 2, name: 'Emma Johnson', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 3, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 4, name: 'Sarah Davis', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' }
    ],
    emailInvitees: ['client@company.com'],
    repeatEvery: 'Monthly',
    repeatDays: [],
    endRepeatDate: '2025-10-05',
    organizer: {
      name: 'Isabella',
      avatar: 'https://randomuser.me/api/portraits/women/85.jpg'
    }
  },
  {
    id: 2,
    title: 'Project Planning Session',
    description: 'Weekly planning and sprint review',
    date: '2025-09-12',
    timeFrom: '14:00',
    timeTo: '15:30',
    type: 'Meeting',
    platform: 'meet',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    attendees: [
      { id: 3, name: 'Michael Brown', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 5, name: 'David Wilson', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' }
    ],
    emailInvitees: ['external@partner.com', 'consultant@agency.com'],
    repeatEvery: 'Weekly',
    repeatDays: ['F'],
    endRepeatDate: '2025-12-12',
    organizer: {
      name: 'Isabella',
      avatar: 'https://randomuser.me/api/portraits/women/85.jpg'
    }
  },
  {
    id: 3,
    title: 'Complete Project Documentation',
    description: 'Finish writing user manuals and API docs',
    date: '2025-09-15',
    timeFrom: '09:00',
    timeTo: '17:00',
    type: 'Task',
    platform: null,
    meetingLink: null,
    attendees: [],
    emailInvitees: [],
    repeatEvery: 'On',
    repeatDays: [],
    endRepeatDate: null,
    organizer: {
      name: 'Isabella',
      avatar: 'https://randomuser.me/api/portraits/women/85.jpg'
    }
  }
]);

const people = [
  { id: 1, name: 'John Smith', email: 'john.smith@company.com', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, name: 'Emma Johnson', email: 'emma.johnson@company.com', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@company.com', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
  { id: 4, name: 'Sarah Davis', email: 'sarah.davis@company.com', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { id: 5, name: 'David Wilson', email: 'david.wilson@company.com', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
  { id: 6, name: 'Jennifer Taylor', email: 'jennifer.taylor@company.com', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { id: 7, name: 'Alex Rodriguez', email: 'alex.rodriguez@company.com', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
  { id: 8, name: 'Lisa Chen', email: 'lisa.chen@company.com', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' }
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
        date: formatDateString(prevYear, prevMonth, prevLastDay - i)
      });
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        dayNumber: i,
        currentMonth: true,
        date: formatDateString(currentYear.value, currentMonth.value, i)
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
        date: formatDateString(nextYear, nextMonth, i)
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
    // Use the isSameDay function to compare with today's date
    const today = new Date();
    const dateObj = new Date(date);
    return isSameDay(today, dateObj);
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
  console.log('🔥 addPerson called with:', person);
  console.log('🔥 selectedPeople.value before:', selectedPeople.value);
  if (!selectedPeople.value.some(p => p.id === person.id)) {
    selectedPeople.value.push(person);
    console.log('🔥 Person added! selectedPeople.value after:', selectedPeople.value);
  } else {
    console.log('🔥 Person already exists in selectedPeople');
  }
  peopleSearch.value = '';
  peopleMenu.value = false;
}

function removePerson(index) {
  selectedPeople.value.splice(index, 1);
}

// Enhanced meeting functionality
function generateZoomLink() {
  // Generate a realistic Zoom meeting link
  const meetingId = Math.floor(Math.random() * 1000000000);
  const password = Math.random().toString(36).substring(2, 8);
  newEvent.value.meetingLink = `https://zoom.us/j/${meetingId}?pwd=${password}`;
  showNotification('Zoom meeting link generated!', 'success');
}

function generateMeetLink() {
  // Generate a realistic Google Meet link
  const meetingId = Math.random().toString(36).substring(2, 12);
  newEvent.value.meetingLink = `https://meet.google.com/${meetingId}`;
  showNotification('Google Meet link generated!', 'success');
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Link copied to clipboard!', 'success');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      showNotification('Failed to copy link', 'error');
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showNotification('Failed to copy link', 'error');
    }
    document.body.removeChild(textArea);
  }
}

function addEmailInvitees() {
  console.log('🔥 addEmailInvitees called with input:', emailInviteInput.value);
  const emails = emailInviteInput.value
    .split(',')
    .map(email => email.trim())
    .filter(email => email && isValidEmail(email));
  
  console.log('🔥 Processed emails:', emails);
  console.log('🔥 emailInvitees.value before:', emailInvitees.value);
  
  if (emails.length > 0) {
    // Add unique emails only
    emails.forEach(email => {
      if (!emailInvitees.value.includes(email)) {
        emailInvitees.value.push(email);
      }
    });
    console.log('🔥 emailInvitees.value after:', emailInvitees.value);
    emailInviteInput.value = '';
    showNotification(`${emails.length} email(s) added to invitees`, 'success');
  } else {
    showNotification('Please enter valid email addresses', 'warning');
  }
}

function removeEmailInvitee(index) {
  emailInvitees.value.splice(index, 1);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
  const notification = {
    id: Date.now(),
    message,
    type,
    timestamp: new Date()
  };
  notifications.value.push(notification);
  
  // Auto-remove notification after 3 seconds
  setTimeout(() => {
    const index = notifications.value.findIndex(n => n.id === notification.id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  }, 3000);
}

function sendInAppNotifications(event) {
  // Send notifications to app users
  selectedPeople.value.forEach(person => {
    const notification = {
      userId: person.id,
      type: 'meeting_invitation',
      title: 'Meeting Invitation',
      message: `You've been invited to "${event.title}" on ${formatDateForDisplay(event.date)}`,
      meetingId: event.id,
      timestamp: new Date()
    };
    console.log('Sending in-app notification to:', person.name, notification);
    // In a real app, this would make an API call to store the notification
  });
}

async function sendEmailInvitations(event) {
  try {
    console.log('🚀 Starting sendEmailInvitations with event:', event);
    
    // Import the meeting invitation API service
    const { meetingInvitationApi } = await import('../services/meetingInvitationApi.service.js');
    
    // Get organizer email (you may need to get this from user context)
    let organizerEmail = localStorage.getItem('userEmail');
    
    // If no organizer email is set, prompt for it or use a default
    if (!organizerEmail || organizerEmail === 'organizer@example.com') {
      // For demo purposes, let's set a default email. In production, this would come from user authentication
      organizerEmail = 'suprun.jen@gmail.com'; // Using your email for testing
      localStorage.setItem('userEmail', organizerEmail);
      console.log('📧 Using organizer email:', organizerEmail);
    }
    
    // Convert app users to expected format
    const appUsers = selectedPeople.value.map(person => ({
      email: person.email || `${person.name.toLowerCase().replace(' ', '.')}@company.com`, // fallback email
      name: person.name
    }));

    console.log('👥 Selected app users:', selectedPeople.value);
    console.log('📧 Converted app users:', appUsers);
    console.log('📮 Email invitees:', emailInvitees.value);

    // Only send to invited participants (no organizer confirmation email)
    const allRecipients = [...appUsers];
    
    // FORCE: Get emails from DOM if reactive value is empty
    let allEmailInvitees = [...emailInvitees.value];
    
    // Fallback: if reactive array is empty, try to get emails from displayed UI
    if (allEmailInvitees.length === 0) {
      const emailElements = document.querySelectorAll('.email-invitee .person-name');
      const domEmails = Array.from(emailElements).map(el => el.textContent.trim());
      allEmailInvitees = domEmails.filter(email => email && email.includes('@'));
      console.log('🔧 FALLBACK: Got emails from DOM:', domEmails);
    }

    console.log('📊 Recipients debug:', {
      appUsers: allRecipients.length,
      emailInvitees: allEmailInvitees.length,
      emailInviteesRaw: emailInvitees.value,
      fallbackEmails: allEmailInvitees
    });

    // Check if there are any recipients to send invitations to
    const totalRecipients = allRecipients.length + allEmailInvitees.length;
    console.log('📊 Total recipients:', totalRecipients, 'App users:', allRecipients.length, 'Email invitees:', allEmailInvitees.length);
    
    if (totalRecipients === 0) {
      console.log('⚠️ No email recipients to send invitations to');
      return;
    }
    
    console.log('✅ Recipients found! Proceeding with email sending...');

    console.log('📤 About to send invitations...');
    
    // Send invitations using the API
    console.log('📤 Sending with data:', {
      event: event.title,
      allRecipients,
      allEmailInvitees,
      userName: userName.value,
      organizerEmail
    });
    
    const result = await meetingInvitationApi.sendMeetingInvitations(
      event,
      allRecipients,
      allEmailInvitees,
      userName.value,
      organizerEmail
    );

    console.log('✅ Email invitations sent successfully:', result);
    
    // Show success notification with details
    const totalSent = result.data.sentSuccessfully;
    const totalFailed = result.data.failed;
    
    if (totalFailed > 0) {
      showNotification(
        `Invitations sent: ${totalSent} successful, ${totalFailed} failed`, 
        'warning'
      );
    } else {
      showNotification(
        `All ${totalSent} email invitations sent successfully!`, 
        'success'
      );
    }
    
  } catch (error) {
    console.error('❌ Failed to send email invitations:', error);
    showNotification(
      `Failed to send email invitations: ${error.message}`, 
      'error'
    );
  }
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

// Form validation
const isFormValid = computed(() => {
  return !!newEvent.value.title;
});

// Delete event function
function deleteEvent(eventId) {
  if (confirm('Are you sure you want to delete this reminder?')) {
    const index = events.value.findIndex(event => event.id === eventId);
    if (index > -1) {
      events.value.splice(index, 1);
      showNotification('Reminder deleted successfully!', 'success');
    }
  }
}

// Create event function
function createEvent() {
  console.log('🎯 createEvent function called!');
  console.log('🎯 Form valid?', isFormValid.value);
  console.log('🎯 Event type:', eventType.value);
  console.log('🎯 Selected people:', selectedPeople.value);
  console.log('🎯 Email invitees:', emailInvitees.value);
  
  if (!isFormValid.value) {
    showNotification('Please fill in all required fields', 'warning');
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
    platform: selectedPlatform.value,
    attendees: [...selectedPeople.value],
    emailInvitees: [...emailInvitees.value],
    repeatEvery: newEvent.value.repeatEvery,
    repeatDays: [...newEvent.value.repeatDays],
    endRepeatDate: newEvent.value.endRepeatDate,
    organizer: {
      name: userName.value,
      avatar: userAvatar.value
    }
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
  
  // Send notifications and invitations
  if (eventType.value !== 'task') {
    // Send in-app notifications to selected users
    if (selectedPeople.value.length > 0) {
      sendInAppNotifications(createdEvent);
    }
    
      // Send email invitations only if there are participants
  const totalInvitees = selectedPeople.value.length + emailInvitees.value.length;
  if (totalInvitees > 0) {
    // Wait for email sending to complete before resetting form
    sendEmailInvitations(createdEvent).then(() => {
      showNotification(`${eventType.value === 'event' ? 'Event' : 'Meeting'} created and ${totalInvitees} invitation(s) sent!`, 'success');
      // Reset form after emails are sent
      resetForm();
    }).catch((error) => {
      console.error('Email sending failed:', error);
      showNotification(`${eventType.value === 'event' ? 'Event' : 'Meeting'} created but email sending failed!`, 'warning');
      // Reset form even if email fails
      resetForm();
    });
  } else {
    showNotification(`${eventType.value === 'event' ? 'Event' : 'Meeting'} created successfully!`, 'success');
    // Reset form immediately if no emails to send
    resetForm();
  }
} else {
  showNotification('Task created successfully!', 'success');
  // Reset form immediately for tasks
  resetForm();
}

// Generate recurring events if needed
if (newEvent.value.repeatEvery !== 'On' && newEvent.value.endRepeatDate) {
  generateRecurringEvents(createdEvent);
}
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

  if (!newEvent.value.timeFrom) {
    newEvent.value.timeFrom = defaultTimeFrom;
  }
  
  if (!newEvent.value.timeTo) {
    newEvent.value.timeTo = defaultTimeTo;
  }
  
  // Set default end repeat date
  setDefaultEndDate();
  
  // Load user data from localStorage
  loadUserData();
  
  // Listen for profile updates
  window.addEventListener('profileImageUpdated', handleProfileUpdate);
  window.addEventListener('userNameUpdated', handleProfileUpdate);
});

// Load user data from localStorage
function loadUserData() {
  const userData = localStorage.getItem('user_data');
  if (userData) {
    const parsedData = JSON.parse(userData);
    userName.value = parsedData.fullName || parsedData.name || 'User';
    userAvatar.value = parsedData.profileImage || parsedData.avatar || 'https://randomuser.me/api/portraits/women/85.jpg';
  }
}

// Handle profile updates
function handleProfileUpdate(event) {
  if (event.detail) {
    if (event.detail.profileImage) {
      userAvatar.value = event.detail.profileImage;
    }
    if (event.detail.fullName || event.detail.name) {
      userName.value = event.detail.fullName || event.detail.name;
    }
    // Reload all user data to ensure consistency
    loadUserData();
  }
}

// Cleanup event listeners
onBeforeUnmount(() => {
  window.removeEventListener('profileImageUpdated', handleProfileUpdate);
  window.removeEventListener('userNameUpdated', handleProfileUpdate);
});

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'mdi-check-circle';
    case 'error': return 'mdi-alert-circle';
    case 'warning': return 'mdi-alert';
    case 'info':
    default: return 'mdi-information';
  }
}

function removeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
}

// Meeting button helpers
function getMeetingButtonColor(event) {
  if (!event.meetingLink) return 'grey';
  
  switch (event.platform) {
    case 'zoom': return 'blue';
    case 'meet': return 'green';
    case 'custom': return 'purple';
    default: return 'primary';
  }
}

function getMeetingIcon(event) {
  if (!event.meetingLink) return 'mdi-video-off';
  
  switch (event.platform) {
    case 'zoom': return 'mdi-video';
    case 'meet': return 'mdi-google';
    case 'custom': return 'mdi-link';
    default: return 'mdi-video';
  }
}

function getMeetingButtonText(event) {
  if (!event.meetingLink) return 'No Meeting Link';
  
  switch (event.platform) {
    case 'zoom': return 'Join Zoom';
    case 'meet': return 'Join Meet';
    case 'custom': return 'Join Meeting';
    default: return 'Join Meeting';
  }
}

function getMeetingTooltip(event) {
  if (!event.meetingLink) {
    return 'No meeting link available for this event';
  }
  
  const platformName = event.platform === 'zoom' ? 'Zoom' : 
                      event.platform === 'meet' ? 'Google Meet' : 
                      'Custom Platform';
  
  return `Click to go to ${platformName} meeting\n${event.meetingLink}`;
}

function joinMeeting(event) {
  if (!event.meetingLink) {
    showNotification('No meeting link available', 'warning');
    return;
  }
  
  // Set loading state
  joiningMeeting.value = event.id;
  
  // Log meeting join for analytics/tracking
  console.log('Joining meeting:', {
    id: event.id,
    title: event.title,
    platform: event.platform,
    link: event.meetingLink
  });
  
  // Show success notification
  showNotification(`Redirecting to ${event.platform || 'meeting'}...`, 'info');
  
  // Brief loading state for visual feedback
  setTimeout(() => {
    joiningMeeting.value = null;
  }, 300);
  
  // Let the link handle the navigation naturally
  return true;
}

function completeTask(event) {
  // Mark task as completed
  const eventIndex = events.value.findIndex(e => e.id === event.id);
  if (eventIndex > -1) {
    events.value.splice(eventIndex, 1);
    showNotification(`Task "${event.title}" completed!`, 'success');
  }
}
</script>

<style scoped>
.reminder-container {
  display: flex;
  width: 1305px;
  height: 700px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-left: 0px;
}

/* New UI Box Styles */
.input-box {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 16px;
  padding: 16px;
}

/* User Info Box */
.user-info-box {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 16px;
  padding: 12px 16px;
}

.user-name {
  color: #333;
  font-weight: 500;
}

/* Event Type Box */
.event-type-box {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 16px;
  padding: 8px;
}

.event-type-buttons {
  width: 100%;
  background-color: #e8e8e8;
  border-radius: 6px;
  padding: 2px;
}

.event-type-btn {
  flex: 1;
  border-radius: 4px !important;
  font-weight: 500;
  text-transform: none;
  color: #666;
  background-color: transparent !important;
  box-shadow: none !important;
}

.event-type-btn.active,
.event-type-btn.v-btn--active {
  background-color: #4db6ac !important;
  color: white !important;
}

/* Title Box */
.title-box {
  padding: 0;
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.title-input::placeholder {
  color: #999;
}

/* Date and Time Box */
.datetime-box {
  padding: 16px;
}

.datetime-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.datetime-icon {
  color: #666;
  margin-right: 8px;
}

.datetime-title {
  font-weight: 500;
  color: #333;
}

.datetime-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.datetime-label {
  min-width: 60px;
  font-weight: 500;
  color: #666;
  margin-right: 16px;
}

.datetime-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  padding: 8px 12px;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #ddd;
  cursor: pointer;
}

.datetime-input::placeholder {
  color: #999;
}

/* People Box */
.people-box {
  padding: 16px;
}

.people-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.people-icon {
  color: #666;
  margin-right: 8px;
}

.people-title {
  font-weight: 500;
  color: #333;
}

/* Meeting Link Box */
.meeting-link-box {
  padding: 16px;
}

.meeting-link-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.meeting-link-icon {
  color: #666;
  margin-right: 8px;
}

.meeting-link-title {
  font-weight: 500;
  color: #333;
}

/* Repeat Box */
.repeat-box {
  padding: 16px;
}

.repeat-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.repeat-icon {
  color: #666;
  margin-right: 8px;
}

.repeat-title {
  font-weight: 500;
  color: #333;
}

.repeat-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.repeat-label {
  min-width: 60px;
  font-weight: 500;
  color: #666;
  margin-right: 16px;
}

.repeat-select {
  flex: 1;
}

.days-row {
  align-items: flex-start;
}

.weekdays-container {
  flex: 1;
}

.weekdays-toggle {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.weekday-btn {
  min-width: 40px !important;
  width: 40px;
  height: 40px;
  border-radius: 50% !important;
  font-weight: 500;
  border: 1px solid #ddd !important;
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

.event-type-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.event-title {
  font-size: 14px;
  font-weight: 500;
}

.platform-chip {
  font-size: 10px;
  height: 20px;
  font-weight: 600;
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
  width: 400px;
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

.people-input {
  margin: 0;
  padding: 0;
  transform: translate(5px,5px);
  
}

.link-input{
  margin: 0;
  padding: 0;
  transform: translate(5px,-5px);
  
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
  width: 550px;
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
  grid-template-columns: repeat(7, 10fr);
  grid-template-rows: repeat(5, 1fr);
  height: 350px;
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
  font-size: 16px;
  
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
  padding: 8px 12px;
  font-size: 12px;
  margin-bottom: 8px;
  min-height: 40px;
}

.person-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 4px;
}

.person-name {
  font-weight: 500;
  color: #374151;
  font-size: 13px;
  line-height: 1.2;
}

.person-type {
  font-size: 11px;
  color: #6b7280;
  line-height: 1;
  margin-top: 2px;
}

.app-user {
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border: 1px solid rgba(3, 169, 244, 0.2);
}

.email-invitee {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%);
  border: 1px solid rgba(255, 152, 0, 0.2);
}

/* Platform Selection */
.platform-selection {
  padding: 0 16px;
}

.platform-toggle {
  width: 100%;
}

.platform-btn {
  flex: 1;
  font-size: 12px;
  padding: 8px 12px;
  min-width: 0;
}

.generate-btn {
  font-size: 12px;
  height: 32px;
  text-transform: none;
}

/* Invitation Type Toggle */
.invitation-type-toggle {
  padding: 0 16px;
}

.invitation-toggle {
  width: 100%;
}

.invitation-btn {
  flex: 1;
  font-size: 12px;
  padding: 8px 12px;
  min-width: 0;
}

/* Email Input */
.email-input {
  margin: 0;
  padding: 0;
}

.email-hint {
  padding: 0 16px;
}

/* People Dropdown */
.people-dropdown {
  max-width: 320px;
}

.person-option:hover {
  background-color: #f5f5f5;
}

/* Invitation Summary */
.invitation-summary {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  margin: 8px;
}

.summary-text {
  display: flex;
  align-items: center;
  color: #166534;
  font-weight: 500;
}

/* Notification System */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
}

.notification-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border-left: 4px solid;
  max-width: 100%;
  animation: slideIn 0.3s ease-out;
}

.notification-success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.notification-error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.notification-warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.notification-info {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.notification-icon {
  font-size: 20px;
}

.notification-success .notification-icon {
  color: #10b981;
}

.notification-error .notification-icon {
  color: #ef4444;
}

.notification-warning .notification-icon {
  color: #f59e0b;
}

.notification-info .notification-icon {
  color: #3b82f6;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.notification-close {
  opacity: 0.6;
}

.notification-close:hover {
  opacity: 1;
}

/* Notification Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Enhanced Meeting Cards */
.meeting-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.meeting-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.meeting-description {
  margin: 8px 0 12px 0;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  border-left: 3px solid #e3f2fd;
}

.description-text {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
  font-style: italic;
}

.join-btn {
  text-transform: none;
  letter-spacing: 0;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.join-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.join-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
}

.join-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Platform-specific button styles */
.join-btn.v-btn--variant-elevated.bg-blue {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.join-btn.v-btn--variant-elevated.bg-blue:hover {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
}

.join-btn.v-btn--variant-elevated.bg-green {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.join-btn.v-btn--variant-elevated.bg-green:hover {
  background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%);
}

.join-btn.v-btn--variant-elevated.bg-purple {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
}

.join-btn.v-btn--variant-elevated.bg-purple:hover {
  background: linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%);
}

.join-btn.v-btn--variant-elevated.bg-success {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
}

.join-btn.v-btn--variant-elevated.bg-success:hover {
  background: linear-gradient(135deg, #388E3C 0%, #2E7D32 100%);
}

.join-btn.v-btn--variant-elevated.bg-grey {
  background: linear-gradient(135deg, #9E9E9E 0%, #757575 100%);
}

/* Shimmer effect for active buttons */
.join-btn:not(:disabled)::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.join-btn:not(:disabled):hover::before {
  left: 100%;
}

/* Meeting Link Wrapper */
.meeting-link-wrapper {
  text-decoration: none;
  color: inherit;
  display: block;
}

.meeting-link-wrapper:hover {
  text-decoration: none;
  color: inherit;
}

/* Enhanced Form Styles */
.header-card {
  position: relative;
  overflow: hidden;
}

.header-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.user-info-enhanced .user-details {
  flex: 1;
}

.event-type-enhanced .v-btn-toggle {
  width: 100%;
}

.event-btn-enhanced {
  transition: all 0.3s ease;
  border: 2px solid rgba(255,255,255,0.3) !important;
}

.event-btn-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.event-btn-enhanced.v-btn--active {
  background: rgba(255,255,255,0.9) !important;
  color: #667eea !important;
  transform: scale(1.05);
}

.title-card {
  transition: all 0.3s ease;
}

.title-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.title-input-enhanced .v-field {
  border-radius: 12px !important;
}

.title-input-enhanced .v-field--focused {
  border-color: #667eea !important;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.input-label-enhanced {
  font-size: 14px;
  color: #424242;
  margin-bottom: 8px;
}

.date-section .v-field,
.time-input-group .v-field {
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.date-section .v-field:hover,
.time-input-group .v-field:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.time-inputs-container {
  gap: 16px;
}

.platform-selection-enhanced .v-btn-toggle {
  width: 100%;
}

.platform-btn-enhanced {
  transition: all 0.3s ease;
  border: 2px solid rgba(76, 175, 80, 0.3) !important;
}

.platform-btn-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.platform-btn-enhanced.v-btn--active {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.create-button-card {
  position: relative;
  overflow: hidden;
}

.create-button-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s;
}

.create-button-card:hover::before {
  left: 100%;
}

.create-btn-enhanced {
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.create-btn-enhanced:hover {
  transform: translateY(-3px);
}

.create-btn-enhanced:disabled {
  opacity: 0.6;
  transform: none !important;
}

/* Enhanced Card Hover Effects */
.reminder-section {
  transition: all 0.3s ease;
}

.reminder-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.15);
}

/* Form Enhancements */
.description-input {
  margin: 0;
  padding: 0;
  transform: translate(5px, -5px);
}

.title-input .v-field__input {
  font-weight: 500;
  font-size: 16px;
}

.reminder-section {
  transition: all 0.3s ease;
}

.reminder-section:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.create-btn {
  height: 48px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  margin-top: 24px;
  font-size: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(12, 156, 141, 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(12, 156, 141, 0.4);
}

.create-btn:disabled {
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

/* Delete Button Styles */
.meeting-card {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;
}

.meeting-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background-color: rgba(244, 67, 54, 0.1) !important;
}

</style>