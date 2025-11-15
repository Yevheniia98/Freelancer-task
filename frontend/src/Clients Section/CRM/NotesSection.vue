<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4">Notes & Reminders</h2>
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            @click="openNoteDialog()"
            prepend-icon="mdi-note-plus"
          >
            Add Note
          </v-btn>
          <v-btn
            color="warning"
            @click="openReminderDialog()"
            prepend-icon="mdi-alarm-plus"
          >
            Add Reminder
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Quick Stats -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card color="primary" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ noteStats.totalNotes }}</div>
            <div class="text-white">Total Notes</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ noteStats.activeReminders }}</div>
            <div class="text-white">Active Reminders</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="error" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ noteStats.overdueReminders }}</div>
            <div class="text-white">Overdue Reminders</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="success" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ noteStats.todayReminders }}</div>
            <div class="text-white">Due Today</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-text-field
          v-model="searchQuery"
          label="Search notes..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="typeFilter"
          :items="typeOptions"
          label="Type"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="priorityFilter"
          :items="priorityOptions"
          label="Priority"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="clientFilter"
          :items="clientOptions"
          label="Client"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="1">
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="cards" size="small">
            <v-icon>mdi-view-grid</v-icon>
          </v-btn>
          <v-btn value="list" size="small">
            <v-icon>mdi-view-list</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Upcoming Reminders Banner -->
    <v-alert
      v-if="upcomingReminders.length > 0"
      type="warning"
      variant="tonal"
      class="mb-4"
    >
      <template #title>
        <v-icon class="mr-2">mdi-alarm</v-icon>
        Upcoming Reminders
      </template>
      <div class="d-flex flex-wrap gap-2 mt-2">
        <v-chip
          v-for="reminder in upcomingReminders.slice(0, 3)"
          :key="reminder._id"
          :color="getReminderUrgencyColor(reminder)"
          size="small"
          @click="viewNote(reminder)"
        >
          <v-icon start size="small">mdi-clock</v-icon>
          {{ reminder.title }} - {{ formatReminderTime(reminder.reminderDate) }}
        </v-chip>
        <v-chip
          v-if="upcomingReminders.length > 3"
          size="small"
          variant="outlined"
        >
          +{{ upcomingReminders.length - 3 }} more
        </v-chip>
      </div>
    </v-alert>

    <!-- Cards View -->
    <div v-if="viewMode === 'cards'">
      <v-row>
        <v-col
          v-for="note in filteredNotes"
          :key="note._id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            class="note-card h-100"
            :class="{ 'reminder-card': note.isReminder }"
            variant="outlined"
            @click="viewNote(note)"
          >
            <v-card-title class="d-flex align-center justify-space-between pa-3">
              <div class="d-flex align-center">
                <v-icon
                  :color="note.isReminder ? 'warning' : 'primary'"
                  class="mr-2"
                >
                  {{ note.isReminder ? 'mdi-alarm' : 'mdi-note-text' }}
                </v-icon>
                <span class="text-truncate">{{ note.title }}</span>
              </div>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    v-bind="props"
                    @click.stop
                  />
                </template>
                <v-list density="compact">
                  <v-list-item @click="editNote(note)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="note.isReminder" @click="markReminderComplete(note)">
                    <v-list-item-title>Mark Complete</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteNote(note)">
                    <v-list-item-title class="text-error">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
            
            <v-card-text class="pa-3">
              <!-- Priority and Status Chips -->
              <div class="d-flex gap-1 mb-2">
                <v-chip
                  :color="getPriorityColor(note.priority)"
                  size="x-small"
                  variant="flat"
                >
                  {{ note.priority }}
                </v-chip>
                <v-chip
                  v-if="note.isReminder"
                  :color="getStatusColor(note.status)"
                  size="x-small"
                  variant="outlined"
                >
                  {{ note.status }}
                </v-chip>
              </div>

              <!-- Content Preview -->
              <div class="text-body-2 mb-3" style="min-height: 60px;">
                {{ truncateText(note.content, 120) }}
              </div>

              <!-- Client Info -->
              <div v-if="note.clientId" class="text-caption text-grey mb-2">
                <v-icon size="small" class="mr-1">mdi-account</v-icon>
                {{ getClientName(note.clientId) }}
              </div>

              <!-- Reminder Date -->
              <div v-if="note.isReminder && note.reminderDate" class="text-caption mb-2">
                <v-icon 
                  size="small" 
                  class="mr-1"
                  :color="isReminderOverdue(note) ? 'error' : 'warning'"
                >
                  mdi-clock
                </v-icon>
                <span :class="{ 'text-error': isReminderOverdue(note) }">
                  {{ formatDateTime(note.reminderDate) }}
                </span>
              </div>

              <!-- Tags -->
              <div v-if="note.tags && note.tags.length" class="mb-2">
                <v-chip
                  v-for="tag in note.tags.slice(0, 3)"
                  :key="tag"
                  size="x-small"
                  variant="outlined"
                  class="mr-1"
                >
                  {{ tag }}
                </v-chip>
              </div>

              <!-- Created Date -->
              <div class="text-caption text-grey">
                <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                {{ formatDate(note.createdAt) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- List View -->
    <v-data-table
      v-else
      :headers="headers"
      :items="filteredNotes"
      :loading="loading"
      item-value="_id"
      class="elevation-1"
    >
      <!-- Type Column -->
      <template #item.type="{ item }">
        <v-chip
          :color="item.isReminder ? 'warning' : 'primary'"
          size="small"
          variant="flat"
        >
          <v-icon start size="small">
            {{ item.isReminder ? 'mdi-alarm' : 'mdi-note-text' }}
          </v-icon>
          {{ item.isReminder ? 'Reminder' : 'Note' }}
        </v-chip>
      </template>

      <!-- Title Column -->
      <template #item.title="{ item }">
        <div>
          <div class="font-weight-medium">{{ item.title }}</div>
          <div class="text-caption text-grey">{{ truncateText(item.content, 60) }}</div>
        </div>
      </template>

      <!-- Priority Column -->
      <template #item.priority="{ item }">
        <v-chip
          :color="getPriorityColor(item.priority)"
          size="small"
          variant="outlined"
        >
          {{ item.priority }}
        </v-chip>
      </template>

      <!-- Client Column -->
      <template #item.client="{ item }">
        {{ getClientName(item.clientId) }}
      </template>

      <!-- Reminder Date Column -->
      <template #item.reminderDate="{ item }">
        <div v-if="item.isReminder && item.reminderDate">
          <div class="text-body-2" :class="{ 'text-error': isReminderOverdue(item) }">
            {{ formatDateTime(item.reminderDate) }}
          </div>
          <div v-if="isReminderOverdue(item)" class="text-caption text-error">
            Overdue
          </div>
        </div>
        <span v-else class="text-grey">-</span>
      </template>

      <!-- Status Column -->
      <template #item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="outlined"
        >
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Actions Column -->
      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              icon="mdi-dots-vertical"
              variant="text"
              size="small"
              v-bind="props"
            />
          </template>
          <v-list density="compact">
            <v-list-item @click="viewNote(item)">
              <v-list-item-title>View</v-list-item-title>
            </v-list-item>
            <v-list-item @click="editNote(item)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item v-if="item.isReminder" @click="markReminderComplete(item)">
              <v-list-item-title>Mark Complete</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteNote(item)">
              <v-list-item-title class="text-error">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Note/Reminder Dialog -->
    <v-dialog v-model="noteDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">
            {{ editingNote ? 'Edit' : 'Add New' }} 
            {{ noteForm.isReminder ? 'Reminder' : 'Note' }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="noteForm.title"
                  label="Title*"
                  variant="outlined"
                  :rules="[v => !!v || 'Title is required']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="noteForm.priority"
                  :items="priorityOptions"
                  label="Priority"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="noteForm.content"
                  label="Content*"
                  variant="outlined"
                  rows="6"
                  :rules="[v => !!v || 'Content is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="noteForm.clientId"
                  :items="clientOptions"
                  label="Associated Client"
                  variant="outlined"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="noteForm.category"
                  :items="categoryOptions"
                  label="Category"
                  variant="outlined"
                />
              </v-col>
              
              <!-- Reminder specific fields -->
              <template v-if="noteForm.isReminder">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="noteForm.reminderDate"
                    label="Reminder Date & Time*"
                    type="datetime-local"
                    variant="outlined"
                    :rules="noteForm.isReminder ? [v => !!v || 'Reminder date is required'] : []"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="noteForm.status"
                    :items="statusOptions"
                    label="Status"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12">
                  <v-switch
                    v-model="noteForm.emailReminder"
                    label="Send email reminder"
                    color="primary"
                  />
                </v-col>
              </template>

              <!-- Tags -->
              <v-col cols="12">
                <v-text-field
                  v-model="tagInput"
                  label="Add Tags"
                  variant="outlined"
                  append-inner-icon="mdi-plus"
                  @click:append-inner="addTag"
                  @keyup.enter="addTag"
                />
                <div v-if="noteForm.tags.length" class="mt-2">
                  <v-chip
                    v-for="(tag, index) in noteForm.tags"
                    :key="index"
                    closable
                    @click:close="removeTag(index)"
                    class="mr-1 mb-1"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-col>

              <!-- Color Picker -->
              <v-col cols="12" md="6">
                <div class="mb-2">Color</div>
                <div class="d-flex gap-2">
                  <v-btn
                    v-for="color in colorOptions"
                    :key="color.value"
                    :color="color.value"
                    :variant="noteForm.color === color.value ? 'flat' : 'outlined'"
                    size="small"
                    @click="noteForm.color = color.value"
                  >
                    {{ color.name }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeNoteDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveNote">
            {{ editingNote ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Note View Dialog -->
    <v-dialog v-model="viewNoteDialog" max-width="600px">
      <v-card v-if="selectedNote">
        <v-card-title class="d-flex align-center">
          <v-icon
            :color="selectedNote.isReminder ? 'warning' : 'primary'"
            class="mr-2"
          >
            {{ selectedNote.isReminder ? 'mdi-alarm' : 'mdi-note-text' }}
          </v-icon>
          {{ selectedNote.title }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="viewNoteDialog = false"
          />
        </v-card-title>
        <v-card-text>
          <!-- Priority and Status -->
          <div class="d-flex gap-2 mb-3">
            <v-chip
              :color="getPriorityColor(selectedNote.priority)"
              size="small"
              variant="flat"
            >
              {{ selectedNote.priority }} Priority
            </v-chip>
            <v-chip
              v-if="selectedNote.isReminder"
              :color="getStatusColor(selectedNote.status)"
              size="small"
              variant="outlined"
            >
              {{ selectedNote.status }}
            </v-chip>
          </div>

          <!-- Content -->
          <div class="mb-4" style="white-space: pre-wrap;">{{ selectedNote.content }}</div>

          <!-- Client Info -->
          <div v-if="selectedNote.clientId" class="mb-3">
            <strong>Client:</strong> {{ getClientName(selectedNote.clientId) }}
          </div>

          <!-- Reminder Date -->
          <div v-if="selectedNote.isReminder && selectedNote.reminderDate" class="mb-3">
            <strong>Reminder Date:</strong>
            <span :class="{ 'text-error': isReminderOverdue(selectedNote) }">
              {{ formatDateTime(selectedNote.reminderDate) }}
            </span>
          </div>

          <!-- Category -->
          <div v-if="selectedNote.category" class="mb-3">
            <strong>Category:</strong> {{ selectedNote.category }}
          </div>

          <!-- Tags -->
          <div v-if="selectedNote.tags && selectedNote.tags.length" class="mb-3">
            <strong>Tags:</strong>
            <div class="mt-1">
              <v-chip
                v-for="tag in selectedNote.tags"
                :key="tag"
                size="small"
                variant="outlined"
                class="mr-1"
              >
                {{ tag }}
              </v-chip>
            </div>
          </div>

          <!-- Created Date -->
          <div class="text-caption text-grey">
            Created: {{ formatDateTime(selectedNote.createdAt) }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="editNote(selectedNote)">
            Edit
          </v-btn>
          <v-btn
            v-if="selectedNote.isReminder && selectedNote.status !== 'completed'"
            color="success"
            variant="flat"
            @click="markReminderComplete(selectedNote)"
          >
            Mark Complete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ noteToDelete?.title }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { noteService, clientService } from '../../services/crmService.js'

// Data
const notes = ref([])
const clients = ref([])
const loading = ref(false)
const viewMode = ref('cards')
const searchQuery = ref('')
const typeFilter = ref('')
const priorityFilter = ref('')
const clientFilter = ref('')
const statusFilter = ref('')
const tagInput = ref('')

// Dialogs
const noteDialog = ref(false)
const viewNoteDialog = ref(false)
const deleteDialog = ref(false)
const editingNote = ref(null)
const selectedNote = ref(null)
const noteToDelete = ref(null)

// Form
const noteForm = ref({
  title: '',
  content: '',
  isReminder: false,
  reminderDate: '',
  priority: 'medium',
  status: 'pending',
  clientId: '',
  category: 'general',
  tags: [],
  color: 'blue',
  emailReminder: false
})

// Options
const typeOptions = ['note', 'reminder']
const priorityOptions = ['low', 'medium', 'high', 'urgent']
const statusOptions = ['pending', 'in_progress', 'completed', 'cancelled']
const categoryOptions = ['general', 'meeting', 'follow_up', 'project', 'personal', 'important']
const colorOptions = [
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Orange', value: 'orange' },
  { name: 'Purple', value: 'purple' },
  { name: 'Red', value: 'red' },
  { name: 'Teal', value: 'teal' }
]

// Table headers
const headers = [
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Title', key: 'title', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Client', key: 'client', sortable: true },
  { title: 'Reminder Date', key: 'reminderDate', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
]

// Computed
const clientOptions = computed(() => {
  return clients.value.map(client => ({
    title: client.name,
    value: client._id
  }))
})

const filteredNotes = computed(() => {
  let filtered = notes.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(note =>
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (typeFilter.value) {
    const isReminder = typeFilter.value === 'reminder'
    filtered = filtered.filter(note => note.isReminder === isReminder)
  }

  if (priorityFilter.value) {
    filtered = filtered.filter(note => note.priority === priorityFilter.value)
  }

  if (clientFilter.value) {
    filtered = filtered.filter(note => note.clientId === clientFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(note => note.status === statusFilter.value)
  }

  return filtered.sort((a, b) => {
    // Sort reminders by date, then by priority
    if (a.isReminder && b.isReminder) {
      const dateA = new Date(a.reminderDate)
      const dateB = new Date(b.reminderDate)
      return dateA - dateB
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
})

const upcomingReminders = computed(() => {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return notes.value
    .filter(note => 
      note.isReminder && 
      note.status !== 'completed' &&
      new Date(note.reminderDate) <= tomorrow
    )
    .sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate))
})

const noteStats = computed(() => {
  const stats = {
    totalNotes: notes.value.length,
    activeReminders: 0,
    overdueReminders: 0,
    todayReminders: 0
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  notes.value.forEach(note => {
    if (note.isReminder && note.status !== 'completed') {
      stats.activeReminders++
      
      const reminderDate = new Date(note.reminderDate)
      if (reminderDate < today) {
        stats.overdueReminders++
      } else if (reminderDate >= today && reminderDate < tomorrow) {
        stats.todayReminders++
      }
    }
  })

  return stats
})

// Methods
const loadNotes = async () => {
  loading.value = true
  try {
    const response = await noteService.getNotes()
    notes.value = response.data
  } catch (error) {
    console.error('Error loading notes:', error)
    // Fallback to demo data
    notes.value = [
      {
        _id: '1',
        title: 'Follow up with Tech Solutions',
        content: 'Need to discuss the project timeline and deliverables. They mentioned wanting to add new features.',
        isReminder: true,
        reminderDate: new Date('2024-01-20T14:00:00'),
        priority: 'high',
        status: 'pending',
        clientId: '1',
        category: 'follow_up',
        tags: ['project', 'timeline'],
        color: 'orange',
        createdAt: new Date('2024-01-15T10:00:00')
      },
      {
        _id: '2',
        title: 'Meeting Notes - StartupXYZ',
        content: 'Discussed mobile app requirements:\n- iOS and Android\n- User authentication\n- Push notifications\n- Offline functionality',
        isReminder: false,
        priority: 'medium',
        status: 'completed',
        clientId: '2',
        category: 'meeting',
        tags: ['mobile', 'requirements'],
        color: 'blue',
        createdAt: new Date('2024-01-12T16:30:00')
      }
    ]
  } finally {
    loading.value = false
  }
}

const loadClients = async () => {
  try {
    const response = await clientService.getClients()
    clients.value = response.data
  } catch (error) {
    console.error('Error loading clients:', error)
    // Fallback to demo data
    clients.value = [
      { _id: '1', name: 'Tech Solutions Inc' },
      { _id: '2', name: 'StartupXYZ' }
    ]
  }
}

const openNoteDialog = () => {
  editingNote.value = null
  noteForm.value = {
    title: '',
    content: '',
    isReminder: false,
    reminderDate: '',
    priority: 'medium',
    status: 'pending',
    clientId: '',
    category: 'general',
    tags: [],
    color: 'blue',
    emailReminder: false
  }
  noteDialog.value = true
}

const openReminderDialog = () => {
  editingNote.value = null
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  
  noteForm.value = {
    title: '',
    content: '',
    isReminder: true,
    reminderDate: tomorrow.toISOString().slice(0, 16),
    priority: 'medium',
    status: 'pending',
    clientId: '',
    category: 'general',
    tags: [],
    color: 'warning',
    emailReminder: true
  }
  noteDialog.value = true
}

const editNote = (note) => {
  editingNote.value = note
  noteForm.value = {
    ...note,
    reminderDate: note.reminderDate ? new Date(note.reminderDate).toISOString().slice(0, 16) : ''
  }
  viewNoteDialog.value = false
  noteDialog.value = true
}

const closeNoteDialog = () => {
  noteDialog.value = false
  editingNote.value = null
  tagInput.value = ''
}

const saveNote = async () => {
  try {
    const formData = {
      ...noteForm.value,
      reminderDate: noteForm.value.reminderDate ? new Date(noteForm.value.reminderDate) : null
    }
    
    if (editingNote.value) {
      await noteService.updateNote(editingNote.value._id, formData)
    } else {
      await noteService.createNote(formData)
    }
    await loadNotes()
    closeNoteDialog()
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

const viewNote = (note) => {
  selectedNote.value = note
  viewNoteDialog.value = true
}

const markReminderComplete = async (reminder) => {
  try {
    await noteService.completeNote(reminder._id)
    await loadNotes()
    viewNoteDialog.value = false
  } catch (error) {
    console.error('Error marking reminder complete:', error)
  }
}

const deleteNote = (note) => {
  noteToDelete.value = note
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await noteService.deleteNote(noteToDelete.value._id)
    await loadNotes()
    deleteDialog.value = false
    noteToDelete.value = null
    viewNoteDialog.value = false
  } catch (error) {
    console.error('Error deleting note:', error)
  }
}

const addTag = () => {
  if (tagInput.value.trim() && !noteForm.value.tags.includes(tagInput.value.trim())) {
    noteForm.value.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  noteForm.value.tags.splice(index, 1)
}

// Utility functions
const getClientName = (clientId) => {
  if (!clientId) return 'No Client'
  const client = clients.value.find(c => c._id === clientId)
  return client ? client.name : 'Unknown Client'
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'success',
    medium: 'primary',
    high: 'warning',
    urgent: 'error'
  }
  return colors[priority] || 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    in_progress: 'blue',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

const getReminderUrgencyColor = (reminder) => {
  if (isReminderOverdue(reminder)) return 'error'
  
  const now = new Date()
  const reminderDate = new Date(reminder.reminderDate)
  const hoursUntil = (reminderDate - now) / (1000 * 60 * 60)
  
  if (hoursUntil <= 2) return 'error'
  if (hoursUntil <= 24) return 'warning'
  return 'info'
}

const isReminderOverdue = (reminder) => {
  return reminder.isReminder && new Date(reminder.reminderDate) < new Date()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString()
}

const formatReminderTime = (date) => {
  const now = new Date()
  const reminderDate = new Date(date)
  const diffMs = reminderDate - now
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  
  if (diffHours < 0) return 'Overdue'
  if (diffHours === 0) return 'Now'
  if (diffHours < 24) return `${diffHours}h`
  
  const diffDays = Math.round(diffHours / 24)
  return `${diffDays}d`
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Lifecycle
onMounted(() => {
  loadClients()
  loadNotes()
})
</script>

<style scoped>
.note-card {
  cursor: pointer;
  transition: all 0.2s;
}

.note-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.reminder-card {
  border-left: 4px solid #ff9800;
}

.v-data-table {
  background: transparent;
}

.text-caption {
  font-size: 0.75rem !important;
}
</style>