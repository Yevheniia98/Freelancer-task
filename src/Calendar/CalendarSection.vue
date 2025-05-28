<!-- Calendar.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
        
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <div class="d-flex justify-space-between align-center mb-6 flex-wrap">
          <h1 class="text-h4 text-h5-sm font-weight-bold">
            Calendar
          </h1>
          <v-btn 
            color="teal" 
            class="text-white mt-2 mt-sm-0" 
            elevation="0" 
            @click="openNewEventModal()"
          >
            Create New Event
          </v-btn>
        </div>
          
        <!-- Calendar creation area -->
        <v-card
          class="mb-4"
          elevation="1"
          rounded="lg"
        >
          <v-card-text class="pa-4">
            <p class="text-body-1 text-medium-emphasis mb-4">
              Drag and drop your event or click in the calendar.
            </p>
              
            <!-- Sample event types -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-sheet
                  color="cyan-lighten-4"
                  rounded
                  class="pa-3 text-center"
                >
                  New event planning
                </v-sheet>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-sheet
                  color="green-lighten-4"
                  rounded
                  class="pa-3 text-center"
                >
                  Meeting
                </v-sheet>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-sheet
                  color="amber-lighten-4"
                  rounded
                  class="pa-3 text-center"
                >
                  Generating reports
                </v-sheet>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="3"
              >
                <v-sheet
                  color="orange-lighten-4"
                  rounded
                  class="pa-3 text-center"
                >
                  Create new theme
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
          
        <!-- Calendar view -->
        <v-card
          class="mb-4"
          elevation="1"
          rounded="lg"
        >
          <v-card-text class="px-2 py-4">
            <!-- Calendar header with month navigation -->
            <div class="d-flex justify-space-between align-center mb-4 px-2">
              <div class="d-flex">
                <v-btn
                  icon
                  variant="flat"
                  color="grey-lighten-3"
                  class="mr-2"
                  @click="previousMonth"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  icon
                  variant="flat"
                  color="grey-lighten-3"
                  @click="nextMonth"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
                
              <div class="text-h6 font-weight-bold">
                {{ monthNames[currentMonth] }}
              </div>
                
              <v-select
                v-model="currentYear"
                :items="availableYears"
                variant="outlined"
                density="compact"
                hide-details
                bg-color="white"
                class="year-select"
                menu-props="auto"
              />
            </div>
              
            <!-- Calendar table -->
            <table class="calendar-table">
              <thead>
                <tr>
                  <th
                    v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                    :key="day" 
                    class="text-center calendar-header"
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
                    class="calendar-day"
                    :class="{ 'non-current-month': !day.isCurrentMonth }"
                    @click="openDateDetails(day)"
                  >
                    <div
                      class="font-weight-medium day-number"
                      :class="{ 'text-medium-emphasis': !day.isCurrentMonth }"
                    >
                      {{ day.date }}
                    </div>
                      
                    <!-- Event indicators -->
                    <div
                      v-if="day.events.length > 0"
                      class="mt-1"
                    >
                      <div 
                        v-for="(event, eventIndex) in day.events" 
                        :key="eventIndex"
                        class="event-pill text-center mb-1"
                        :class="getEventClass(event.type)"
                        @click.stop="openEventEditModal(event)"
                      >
                        {{ event.title }}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
          
        <!-- Upcoming Events section -->
        <div>
          <h2 class="text-h5 text-h6-sm font-weight-bold mb-2">
            Upcoming Events
          </h2>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Don't miss scheduled events
          </p>
            
          <div class="upcoming-events">
            <v-card
              v-for="(event, index) in upcomingEvents"
              :key="index"
              class="mb-3"
              elevation="1"
              rounded="lg"
              @click="openEventEditModal(event)"
            >
              <v-card-text class="pa-3">
                <div class="d-flex align-center">
                  <div
                    class="rounded-circle mr-2"
                    style="width: 8px; height: 8px; background-color: #10b981;"
                  />
                  <div class="text-body-2 text-medium-emphasis">
                    {{ formatDate(event.date) }}
                  </div>
                  <div class="ml-auto time-tag">
                    {{ event.startTime }} - {{ event.endTime }}
                  </div>
                </div>
                <div class="font-weight-medium mt-2">
                  {{ event.title }}
                </div>
              </v-card-text>
            </v-card>
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
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          {{ editingEvent.id ? 'Edit Event' : 'Create New Event' }}
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <v-form
            ref="form"
            v-model="isFormValid"
          >
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="editingEvent.title"
                    label="Title"
                    required
                    :rules="[v => !!v || 'Title is required']"
                  />
                </v-col>
                  
                <v-col cols="12">
                  <v-text-field
                    v-model="editingEvent.date"
                    label="Date"
                    type="date"
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
                    required
                    :rules="[v => !!v || 'End time is required']"
                  />
                </v-col>
                  
                <v-col cols="12">
                  <v-select
                    v-model="editingEvent.type"
                    label="Event Type"
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
                    rows="3"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-btn 
            v-if="editingEvent.id"
            color="red" 
            variant="text" 
            class="flex-grow-1 flex-sm-grow-0"
            @click="confirmDeleteDialog"
          >
            Delete
          </v-btn>
            
          <v-spacer class="d-none d-sm-block" />
            
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            class="flex-grow-1 flex-sm-grow-0"
            @click="eventModal = false"
          >
            Cancel
          </v-btn>
            
          <v-btn 
            color="teal" 
            class="text-white flex-grow-1 flex-sm-grow-0"
            :disabled="!isFormValid"
            @click="saveEvent"
          >
            Save
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
      <v-card>
        <v-card-title class="text-h5 bg-teal text-white pa-4">
          Events on {{ formatDetailDate(selectedDate) }}
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          <div
            v-if="eventsOnSelectedDate.length === 0"
            class="text-medium-emphasis"
          >
            No events scheduled for this date.
          </div>
            
          <v-list
            v-else
            lines="two"
          >
            <v-list-item
              v-for="(event, index) in eventsOnSelectedDate"
              :key="index"
              class="mb-3 pa-0"
              @click="openEventEditModal(event)"
            >
              <div class="pa-3 w-100">
                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">
                    {{ event.title }}
                  </div>
                  <div class="text-medium-emphasis">
                    {{ event.startTime }} - {{ event.endTime }}
                  </div>
                </div>
                  
                <div 
                  class="event-pill-small d-inline-block mt-1" 
                  :class="getEventClass(event.type)"
                >
                  {{ getEventTypeLabel(event.type) }}
                </div>
                  
                <div class="mt-2 text-body-2 text-medium-emphasis">
                  {{ event.description }}
                </div>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>
          
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn 
            color="teal" 
            class="text-white"
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
      <v-card>
        <v-card-title class="text-h5 bg-red text-white pa-4">
          Delete Event
        </v-card-title>
          
        <v-card-text class="pa-4 pt-6">
          Are you sure you want to delete "{{ editingEvent.title }}"? This action cannot be undone.
        </v-card-text>
          
        <v-card-actions class="pa-4 flex-wrap gap-2">
          <v-spacer class="d-none d-sm-block" />
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            class="flex-grow-1 flex-sm-grow-0"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="red" 
            class="text-white flex-grow-1 flex-sm-grow-0"
            @click="deleteEvent"
          >
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
  import  SearchBar from '@/dashboard/SearchBar.vue';
  
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
    width: 72px ;
  }
  
  :deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
    width: 240px !important;
  }

  /* Calendar table styling */
  .calendar-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
  }
  
  .calendar-header {
    background-color: #e0f2f1; /* Light teal background */
    padding: 12px;
    border: 1px solid #e0e0e0;
    font-weight: 500;
  }
  
  .calendar-day {
    height: 100px;
    vertical-align: top;
    text-align: left;
    padding: 8px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: background-color 0.15s ease;
    background-color: white;
  }
  
  .non-current-month {
    background-color: #fafafa;
  }
  
  .day-number {
    font-size: 14px;
    font-weight: 500;
  }
  
  /* Event styling */
  .event-pill {
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
    display: inline-block;
    cursor: pointer;
  }
  
  .event-pill-small {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 4px;
  }
  
  .event-meeting {
    background-color: #d1fae5;
    color: #065f46;
  }
  
  .event-planning {
    background-color: #cffafe;
    color: #155e75;
  }
  
  .event-report {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .event-theme {
    background-color: #ffedd5;
    color: #9a3412;
  }
  
  .event-default {
    background-color: #f3f4f6;
    color: #4b5563;
  }
  
  /* Year select styling */
  .year-select {
    max-width: 120px;
  }
  
  /* Upcoming events styling */
  .upcoming-events {
    max-height: 500px;
    overflow-y: auto;
  }
  
  .time-tag {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: #e0f2f1;
    color: #0d9488;
  }
  
  /* Responsive styles */
  @media (max-width: 600px) {
    .calendar-day {
      height: 80px;
      padding: 4px;
    }
    
    .day-number {
      font-size: 12px;
    }
    
    .event-pill {
      font-size: 10px;
      padding: 1px 4px;
    }
  }
  
  /* Dialog responsiveness */
  .gap-2 {
    gap: 8px;
  }
  
  /* Full width item */
  .w-100 {
    width: 100%;
  }
  
  /* Dialog animation */
  .v-dialog {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
  </style>