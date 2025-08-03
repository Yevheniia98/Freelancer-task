<!-- Calendar.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
        
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container
          fluid
          class="px-6 py-8"
        >
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Calendar</span> Management
              </h1>
              <p class="hero-subtitle">
                Organize your schedule and never miss an important event
              </p>
            </div>
            <div class="hero-actions">
              <v-btn 
                color="white"
                variant="elevated"
                size="large"
                rounded="lg"
                class="hero-btn"
                @click="openNewEventModal()"
              >
                <v-icon class="mr-2">
                  mdi-plus
                </v-icon>
                Create New Event
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container
        fluid
        class="content-container px-6 pb-8"
      >
        <!-- Event Types Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="primary"
              >
                mdi-calendar-multiple
              </v-icon>
              <h2 class="section-heading">
                Event Types
              </h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              4 types
            </v-chip>
          </div>
          
          <div class="event-types-grid">
            <div class="event-type-item">
              <div class="event-type-card planning-card">
                <div class="event-type-icon-wrapper planning-icon">
                  <v-icon
                    class="event-type-icon"
                    color="white"
                  >
                    mdi-lightbulb
                  </v-icon>
                </div>
                <div class="event-type-info">
                  <h3 class="event-type-title">
                    New Event Planning
                  </h3>
                  <p class="event-type-description">
                    Plan and organize new events
                  </p>
                </div>
              </div>
            </div>
            
            <div class="event-type-item">
              <div class="event-type-card meeting-card">
                <div class="event-type-icon-wrapper meeting-icon">
                  <v-icon
                    class="event-type-icon"
                    color="white"
                  >
                    mdi-account-group
                  </v-icon>
                </div>
                <div class="event-type-info">
                  <h3 class="event-type-title">
                    Meeting
                  </h3>
                  <p class="event-type-description">
                    Team meetings and discussions
                  </p>
                </div>
              </div>
            </div>
            
            <div class="event-type-item">
              <div class="event-type-card report-card">
                <div class="event-type-icon-wrapper report-icon">
                  <v-icon
                    class="event-type-icon"
                    color="white"
                  >
                    mdi-chart-line
                  </v-icon>
                </div>
                <div class="event-type-info">
                  <h3 class="event-type-title">
                    Generating Reports
                  </h3>
                  <p class="event-type-description">
                    Create and review reports
                  </p>
                </div>
              </div>
            </div>
            
            <div class="event-type-item">
              <div class="event-type-card theme-card">
                <div class="event-type-icon-wrapper theme-icon">
                  <v-icon
                    class="event-type-icon"
                    color="white"
                  >
                    mdi-palette
                  </v-icon>
                </div>
                <div class="event-type-info">
                  <h3 class="event-type-title">
                    Create New Theme
                  </h3>
                  <p class="event-type-description">
                    Design and development tasks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar View Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="warning"
              >
                mdi-calendar
              </v-icon>
              <h2 class="section-heading">
                Calendar View
              </h2>
            </div>
            <div class="calendar-controls">
              <v-btn-group
                variant="outlined"
                density="compact"
              >
                <v-btn @click="previousMonth">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn @click="nextMonth">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-btn-group>
              <v-select
                v-model="currentYear"
                :items="availableYears"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 120px"
                class="ml-2"
              />
            </div>
          </div>
          
          <div class="calendar-container">
            <div class="calendar-card">
              <div class="calendar-header">
                <h3 class="calendar-month-title">
                  {{ monthNames[currentMonth] }} {{ currentYear }}
                </h3>
              </div>
              
              <table class="calendar-table">
                <thead>
                  <tr>
                    <th
                      v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                      :key="day" 
                      class="calendar-day-header"
                    >
                      {{ day }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="week in calendarWeeks"
                    :key="week[0].date"
                  >
                    <td 
                      v-for="day in week" 
                      :key="day.date"
                      class="calendar-day-cell"
                      :class="{ 'non-current-month': !day.isCurrentMonth }"
                      @click="openDateDetails(day)"
                    >
                      <div class="calendar-day-content">
                        <div
                          class="day-number"
                          :class="{ 'text-medium-emphasis': !day.isCurrentMonth }"
                        >
                          {{ day.date }}
                        </div>
                        
                        <div
                          v-if="day.events.length > 0"
                          class="events-container"
                        >
                          <div 
                            v-for="(event, eventIndex) in day.events" 
                            :key="eventIndex"
                            class="event-indicator"
                            :class="getEventClass(event.type)"
                            @click.stop="openEventEditModal(event)"
                          >
                            {{ event.title }}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Upcoming Events Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon
                class="section-icon"
                color="success"
              >
                mdi-clock-outline
              </v-icon>
              <h2 class="section-heading">
                Upcoming Events
              </h2>
            </div>
            <v-chip
              size="small"
              color="success"
              variant="outlined"
              class="count-chip"
            >
              {{ upcomingEvents.length }} events
            </v-chip>
          </div>
          
          <div class="upcoming-events-grid">
            <div 
              v-for="(event, index) in upcomingEvents" 
              :key="index"
              class="upcoming-event-item"
            >
              <div
                class="upcoming-event-card"
                @click="openEventEditModal(event)"
              >
                <div class="upcoming-event-icon-wrapper">
                  <v-icon
                    class="upcoming-event-icon"
                    color="white"
                  >
                    {{ getEventIcon(event.type) }}
                  </v-icon>
                </div>
                <div class="upcoming-event-info">
                  <h3 class="upcoming-event-title">
                    {{ event.title }}
                  </h3>
                  <div class="upcoming-event-date">
                    {{ formatDate(event.date) }}
                  </div>
                  <div class="upcoming-event-time">
                    {{ event.startTime }} - {{ event.endTime }}
                  </div>
                </div>
                <div class="upcoming-event-type">
                  <v-chip
                    size="small"
                    :color="getEventTypeColor(event.type)"
                    variant="tonal"
                  >
                    {{ getEventTypeLabel(event.type) }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
      
    <!-- Modal for creating/editing events -->
    <v-dialog
      v-model="eventModal"
      max-width="600px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-calendar-edit
            </v-icon>
            {{ editingEvent.id ? 'Edit Event' : 'Create New Event' }}
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <v-form
            ref="form"
            v-model="isFormValid"
          >
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editingEvent.title"
                  label="Event Title"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Title is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-text-field
                  v-model="editingEvent.date"
                  label="Date"
                  type="date"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Date is required']"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="editingEvent.startTime"
                  label="Start Time"
                  type="time"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'Start time is required']"
                />
              </v-col>
                
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="editingEvent.endTime"
                  label="End Time"
                  type="time"
                  variant="outlined"
                  required
                  :rules="[v => !!v || 'End time is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-select
                  v-model="editingEvent.type"
                  label="Event Type"
                  variant="outlined"
                  :items="[
                    { title: 'Meeting', value: 'meeting' },
                    { title: 'New event planning', value: 'planning' },
                    { title: 'Generating reports', value: 'report' },
                    { title: 'Create new theme', value: 'theme' }
                  ]"
                  item-title="title"
                  item-value="value"
                  required
                  :rules="[v => !!v || 'Event type is required']"
                />
              </v-col>
                
              <v-col cols="12">
                <v-textarea
                  v-model="editingEvent.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-btn 
            v-if="editingEvent.id"
            color="error" 
            variant="outlined" 
            @click="confirmDeleteDialog"
          >
            <v-icon class="mr-2">
              mdi-delete
            </v-icon>
            Delete
          </v-btn>
            
          <v-spacer />
            
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="eventModal = false"
          >
            Cancel
          </v-btn>
            
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!isFormValid"
            @click="saveEvent"
          >
            <v-icon class="mr-2">
              mdi-content-save
            </v-icon>
            Save Event
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      
    <!-- Date details dialog -->
    <v-dialog
      v-model="dateDetailsModal"
      max-width="500px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="hero-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-calendar-month
            </v-icon>
            Events on {{ formatDetailDate(selectedDate) }}
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <div
            v-if="eventsOnSelectedDate.length === 0"
            class="text-center py-8"
          >
            <v-icon
              size="64"
              color="grey-lighten-2"
            >
              mdi-calendar-blank
            </v-icon>
            <p class="text-body-1 mt-4 text-medium-emphasis">
              No events scheduled for this date.
            </p>
          </div>
            
          <div
            v-else
            class="events-list"
          >
            <div
              v-for="(event, index) in eventsOnSelectedDate"
              :key="index"
              class="event-detail-card"
              @click="openEventEditModal(event)"
            >
              <div class="event-detail-icon">
                <v-icon color="white">
                  {{ getEventIcon(event.type) }}
                </v-icon>
              </div>
              <div class="event-detail-content">
                <div class="event-detail-header">
                  <h4 class="event-detail-title">
                    {{ event.title }}
                  </h4>
                  <v-chip
                    size="small"
                    :color="getEventTypeColor(event.type)"
                    variant="tonal"
                  >
                    {{ getEventTypeLabel(event.type) }}
                  </v-chip>
                </div>
                <div class="event-detail-time">
                  {{ event.startTime }} - {{ event.endTime }}
                </div>
                <div
                  v-if="event.description"
                  class="event-detail-description"
                >
                  {{ event.description }}
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="primary"
            variant="elevated"
            rounded="lg"
            @click="dateDetailsModal = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      
    <!-- Delete confirmation dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400px"
      fullscreen-breakpoint="sm"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="error-modal-header pa-6">
          <div class="modal-title">
            <v-icon
              class="mr-3"
              color="white"
            >
              mdi-delete-alert
            </v-icon>
            Delete Event
          </div>
        </v-card-title>
          
        <v-card-text class="pa-6">
          <div class="text-center">
            <v-icon
              size="64"
              color="error"
            >
              mdi-delete-circle
            </v-icon>
            <p class="text-body-1 mt-4">
              Are you sure you want to delete "<strong>{{ editingEvent.title }}</strong>"?
            </p>
            <p class="text-body-2 text-medium-emphasis">
              This action cannot be undone.
            </p>
          </div>
        </v-card-text>
          
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="error"
            variant="elevated"
            rounded="lg"
            @click="deleteEvent"
          >
            <v-icon class="mr-2">
              mdi-delete
            </v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>
  
<script>
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';

export default defineComponent({
  name: 'CalendarPage',
  components: {
    LeftMenu,
    SearchBar,
  },
  setup() {
    // Responsive state
    const isMobile = ref(false);
    const isTablet = ref(false);
    
    // Update responsive state based on screen size
    const updateResponsiveState = () => {
      isMobile.value = window.innerWidth < 600;
      isTablet.value = window.innerWidth >= 600 && window.innerWidth < 960;
    };
    
    // Window resize handler
    const handleResize = () => {
      updateResponsiveState();
    };
    
    // Calendar data
    const currentMonth = ref(1); // February (0-indexed)
    const currentYear = ref(2025);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const availableYears = [2024, 2025, 2026, 2027, 2028];
    
    // Events data
    const events = ref([
      {
        id: 1,
        title: 'UX Presentation',
        date: '2025-02-05',
        startTime: '12:00',
        endTime: '12:30',
        type: 'meeting',
        description: 'Presentation about new design system'
      },
      {
        id: 2,
        title: 'International discussion',
        date: '2025-02-10',
        startTime: '10:00',
        endTime: '11:00',
        type: 'meeting',
        description: 'Discussion with international partners'
      },
      {
        id: 3,
        title: 'American customer, big project',
        date: '2025-02-25',
        startTime: '18:00',
        endTime: '20:30',
        type: 'meeting',
        description: 'Project planning with American customer'
      },
      {
        id: 4,
        title: 'Landing project',
        date: '2025-03-03',
        startTime: '14:00',
        endTime: '15:00',
        type: 'planning',
        description: 'Planning for new landing page'
      },
      {
        id: 5,
        title: 'Report',
        date: '2025-02-10',
        startTime: '09:00',
        endTime: '10:00',
        type: 'report',
        description: 'Monthly report generation'
      },
      {
        id: 6,
        title: 'Meeting',
        date: '2025-02-05',
        startTime: '15:00',
        endTime: '16:00',
        type: 'meeting',
        description: 'Team meeting'
      },
      {
        id: 7,
        title: 'Create',
        date: '2025-03-03',
        startTime: '10:00',
        endTime: '11:30',
        type: 'theme',
        description: 'Create new theme for website'
      },
      {
        id: 8,
        title: 'Meeting',
        date: '2025-02-26',
        startTime: '13:00',
        endTime: '14:30',
        type: 'meeting',
        description: 'Weekly progress meeting'
      }
    ]);
    
    // Dialog states
    const eventModal = ref(false);
    const dateDetailsModal = ref(false);
    const deleteDialog = ref(false);
    const selectedDate = ref(null);
    const isFormValid = ref(true);
    const form = ref(null);
    
    // Default empty event
    const defaultEvent = {
      id: null,
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      type: 'meeting',
      description: ''
    };

    // Event being edited/created
    const editingEvent = reactive({...defaultEvent});
    
    // Next event ID
    let nextId = 9;
    
    // Calendar days computation
    const calendarDays = computed(() => {
      const days = [];
      const firstDay = new Date(currentYear.value, currentMonth.value, 1);
      const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
      
      // Add days from previous month
      const firstDayOfWeek = firstDay.getDay();
      if (firstDayOfWeek > 0) {
        const prevMonthLastDay = new Date(currentYear.value, currentMonth.value, 0).getDate();
        for (let i = 0; i < firstDayOfWeek; i++) {
          const date = prevMonthLastDay - firstDayOfWeek + i + 1;
          days.push({
            date,
            isCurrentMonth: false,
            events: getEventsForDate(formatDateString(currentYear.value, currentMonth.value - 1, date))
          });
        }
      }
      
      // Add days from current month
      for (let date = 1; date <= lastDay.getDate(); date++) {
        days.push({
          date,
          isCurrentMonth: true,
          events: getEventsForDate(formatDateString(currentYear.value, currentMonth.value, date))
        });
      }
      
      // Add days from next month to fill the grid
      const remainingDays = 42 - days.length; // 6 rows of 7 days
      for (let date = 1; date <= remainingDays; date++) {
        days.push({
          date,
          isCurrentMonth: false,
          events: getEventsForDate(formatDateString(currentYear.value, currentMonth.value + 1, date))
        });
      }
      
      return days;
    });
    
    // Group days into weeks for the table display
    const calendarWeeks = computed(() => {
      const weeks = [];
      for (let i = 0; i < calendarDays.value.length; i += 7) {
        weeks.push(calendarDays.value.slice(i, i + 7));
      }
      return weeks;
    });
    
    // Upcoming events
    const upcomingEvents = computed(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return events.value
        .filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    // Events on selected date
    const eventsOnSelectedDate = computed(() => {
      if (!selectedDate.value) return [];
      return events.value.filter(event => event.date === selectedDate.value);
    });
    
    // Methods
    const previousMonth = () => {
      if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
      } else {
        currentMonth.value--;
      }
    };
    
    const nextMonth = () => {
      if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
      } else {
        currentMonth.value++;
      }
    };
    
    const formatDateString = (year, month, day) => {
      const adjustedMonth = month < 0 ? 11 : month > 11 ? 0 : month;
      const adjustedYear = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
      
      return `${adjustedYear}-${String(adjustedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };
    
    const getEventsForDate = (dateString) => {
      return events.value.filter(event => event.date === dateString);
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = monthNames[date.getMonth()].substring(0, 3);
      const year = date.getFullYear();
      
      return `${day} ${month} ${year}`;
    };
    
    const formatDetailDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const day = date.getDate();
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      
      return `${month} ${day}, ${year}`;
    };
    
    const getEventClass = (type) => {
      switch(type) {
        case 'meeting':
          return 'event-meeting';
        case 'planning':
          return 'event-planning';
        case 'report':
          return 'event-report';
        case 'theme':
          return 'event-theme';
        default:
          return 'event-default';
      }
    };
    
    const getEventTypeLabel = (type) => {
      switch(type) {
        case 'meeting':
          return 'Meeting';
        case 'planning':
          return 'Planning';
        case 'report':
          return 'Report';
        case 'theme':
          return 'Create';
        default:
          return type;
      }
    };

    const getEventIcon = (type) => {
      switch(type) {
        case 'meeting':
          return 'mdi-account-group';
        case 'planning':
          return 'mdi-lightbulb';
        case 'report':
          return 'mdi-chart-line';
        case 'theme':
          return 'mdi-palette';
        default:
          return 'mdi-calendar';
      }
    };

    const getEventTypeColor = (type) => {
      switch(type) {
        case 'meeting':
          return 'success';
        case 'planning':
          return 'primary';
        case 'report':
          return 'warning';
        case 'theme':
          return 'orange';
        default:
          return 'grey';
      }
    };
    
    const openNewEventModal = () => {
      // Set default date to today
      const today = new Date();
      Object.assign(editingEvent, {
        ...defaultEvent,
        date: formatDateString(today.getFullYear(), today.getMonth(), today.getDate()),
        startTime: '09:00',
        endTime: '10:00'
      });
      eventModal.value = true;
    };
    
    const openEventEditModal = (event) => {
      Object.assign(editingEvent, event);
      eventModal.value = true;
    };
    
    const saveEvent = () => {
      if (editingEvent.id) {
        // Update existing event
        const index = events.value.findIndex(e => e.id === editingEvent.id);
        if (index !== -1) {
          events.value[index] = { ...editingEvent };
        }
      } else {
        // Create new event
        const newEvent = {
          ...editingEvent,
          id: nextId++
        };
        events.value.push(newEvent);
      }
      
      eventModal.value = false;
    };
    
    const confirmDeleteDialog = () => {
      deleteDialog.value = true;
    };
    
    const deleteEvent = () => {
      if (editingEvent.id) {
        const index = events.value.findIndex(e => e.id === editingEvent.id);
        if (index !== -1) {
          events.value.splice(index, 1);
        }
      }
      
      deleteDialog.value = false;
      eventModal.value = false;
    };
    
    const openDateDetails = (day) => {
      if (!day.isCurrentMonth) return;
      selectedDate.value = formatDateString(currentYear.value, currentMonth.value, day.date);
      dateDetailsModal.value = true;
    };
    
    // Lifecycle hooks
    onMounted(() => {
      // Initialize window resize listener
      window.addEventListener('resize', handleResize);
      updateResponsiveState();
      
      // Remove event listener on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    });
    
    return {
      // Responsive state
      isMobile,
      isTablet,
      
      // Calendar data
      currentMonth,
      currentYear,
      monthNames,
      availableYears,
      calendarDays,
      calendarWeeks,
      
      // Events data
      events,
      upcomingEvents,
      eventsOnSelectedDate,
      
      // Dialog states
      eventModal,
      dateDetailsModal,
      deleteDialog,
      selectedDate,
      isFormValid,
      form,
      editingEvent,
      
      // Methods
      previousMonth,
      nextMonth,
      formatDate,
      formatDetailDate,
      getEventClass,
      getEventTypeLabel,
      getEventIcon,
      getEventTypeColor,
      openNewEventModal,
      openEventEditModal,
      saveEvent,
      confirmDeleteDialog,
      deleteEvent,
      openDateDetails
    };
  }
});
</script>

<style scoped>
:deep(.left-menu-component),
:deep(.v-navigation-drawer) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  overflow-y: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
}

:deep(.v-navigation-drawer--rail) {
  width: 72px;
}

:deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
  width: 240px !important;
}

/* Main Layout - Same as Design Tools */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Hero Section - Same as Design Tools */
.hero-section {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA726);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 0 0;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.hero-btn {
  background: white !important;
  color: #0D7C66 !important;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

/* Content Container - Same as Design Tools */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections - Same as Design Tools */
.tool-section {
  margin-bottom: 3rem;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.8rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.count-chip {
  font-weight: 600;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Event Types Grid */
.event-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.event-type-item {
  position: relative;
}

.event-type-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.event-type-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.event-type-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.event-type-card:hover::before {
  opacity: 1;
}

.event-type-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.planning-icon {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.meeting-icon {
  background: linear-gradient(135deg, #10B981, #34D399);
}

.report-icon {
  background: linear-gradient(135deg, #F59E0B, #FBBF24);
}

.theme-icon {
  background: linear-gradient(135deg, #F97316, #FB923C);
}

.event-type-card:hover .event-type-icon-wrapper {
  transform: scale(1.05);
}

.event-type-icon {
  font-size: 1.5rem;
}

.event-type-info {
  flex: 1;
  min-width: 0;
}

.event-type-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.event-type-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Calendar Container */
.calendar-container {
  width: 100%;
}

.calendar-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.calendar-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.calendar-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.calendar-card:hover::before {
  opacity: 1;
}

.calendar-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.calendar-month-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Calendar Table */
.calendar-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 2px;
  table-layout: fixed;
}

.calendar-day-header {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
  padding: 12px 8px;
  border-radius: 0.5rem;
  font-weight: 600;
  text-align: center;
  font-size: 0.875rem;
}

.calendar-day-cell {
  height: 100px;
  vertical-align: top;
  background: #f8fafc;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.calendar-day-cell:hover {
  background: #f1f5f9;
  transform: scale(1.02);
}

.non-current-month {
  background: #f1f5f9 !important;
  opacity: 0.5;
}

.calendar-day-content {
  padding: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  margin-bottom: 4px;
}

.events-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.event-indicator {
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-indicator:hover {
  transform: scale(1.05);
}

.event-meeting {
  background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
  color: #065F46;
}

.event-planning {
  background: linear-gradient(135deg, #DBEAFE, #BFDBFE);
  color: #1E40AF;
}

.event-report {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  color: #92400E;
}

.event-theme {
  background: linear-gradient(135deg, #FFEDD5, #FED7AA);
  color: #9A3412;
}

/* Upcoming Events Grid */
.upcoming-events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.upcoming-event-item {
  position: relative;
}

.upcoming-event-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.upcoming-event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upcoming-event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.upcoming-event-card:hover::before {
  opacity: 1;
}

.upcoming-event-icon-wrapper {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  transition: all 0.3s ease;
}

.upcoming-event-card:hover .upcoming-event-icon-wrapper {
  transform: scale(1.05);
}

.upcoming-event-icon {
  font-size: 1.25rem;
}

.upcoming-event-info {
  flex: 1;
  min-width: 0;
}

.upcoming-event-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upcoming-event-date {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.upcoming-event-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.upcoming-event-type {
  flex-shrink: 0;
}

/* Event Details in Date Dialog */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-detail-card {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.event-detail-card:hover {
  background: #f1f5f9;
  border-color: #0D7C66;
}

.event-detail-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.event-detail-content {
  flex: 1;
  min-width: 0;
}

.event-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.event-detail-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.event-detail-time {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.event-detail-description {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
}

/* Modal Headers */
.hero-modal-header {
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  color: white;
}

.error-modal-header {
  background: linear-gradient(135deg, #EF4444, #F87171);
  color: white;
}

.modal-title {
  display: flex;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Animation - Same as Design Tools */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  animation: fadeInUp 0.6s ease-out;
}

.tool-section:nth-child(2) {
  animation-delay: 0.1s;
}

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

.tool-section:nth-child(4) {
  animation-delay: 0.3s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .event-types-grid,
  .upcoming-events-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .content-container {
    margin-top: -1rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .calendar-controls {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .calendar-day-cell {
    height: 80px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .event-indicator {
    font-size: 9px;
    padding: 1px 3px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .event-type-card,
  .upcoming-event-card,
  .calendar-card {
    padding: 1rem;
  }
  
  .calendar-day-cell {
    height: 60px;
  }
  
  .calendar-day-content {
    padding: 4px;
  }
  
  .day-number {
    font-size: 11px;
    margin-bottom: 2px;
  }
  
  .event-indicator {
    font-size: 8px;
    padding: 1px 2px;
  }
  
  .upcoming-event-card {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .upcoming-event-info {
    text-align: center;
  }
  
  .upcoming-event-title {
    white-space: normal;
  }
}
</style>