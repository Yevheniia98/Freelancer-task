<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4">Communications</h2>
        <v-btn
          color="primary"
          @click="openCommunicationDialog()"
          prepend-icon="mdi-plus"
        >
          Add Communication
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Search communications..."
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
          v-model="directionFilter"
          :items="directionOptions"
          label="Direction"
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
          v-model="importantFilter"
          :items="[{ title: 'Important Only', value: true }, { title: 'All', value: false }]"
          label="Importance"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
    </v-row>

    <!-- Communications Timeline -->
    <v-card class="mb-4">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-timeline</v-icon>
        Communication Timeline
        <v-spacer />
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="timeline" size="small">
            <v-icon>mdi-timeline</v-icon>
          </v-btn>
          <v-btn value="table" size="small">
            <v-icon>mdi-table</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-card-title>
      <v-card-text>
        <!-- Timeline View -->
        <div v-if="viewMode === 'timeline'" class="timeline-container">
          <v-timeline side="end" density="compact">
            <v-timeline-item
              v-for="comm in filteredCommunications"
              :key="comm._id"
              :dot-color="getTypeColor(comm.type)"
              size="small"
            >
              <template #icon>
                <v-icon size="small">{{ getTypeIcon(comm.type) }}</v-icon>
              </template>
              <template #opposite>
                <div class="text-caption text-grey">
                  {{ formatDateTime(comm.date) }}
                </div>
              </template>
              <v-card class="mb-2" elevation="1">
                <v-card-text class="pb-2">
                  <div class="d-flex align-center mb-2">
                    <v-chip
                      :color="getTypeColor(comm.type)"
                      size="small"
                      class="mr-2"
                    >
                      {{ comm.type }}
                    </v-chip>
                    <v-chip
                      :color="comm.direction === 'inbound' ? 'success' : 'info'"
                      size="small"
                      variant="outlined"
                      class="mr-2"
                    >
                      {{ comm.direction }}
                    </v-chip>
                    <v-icon
                      v-if="comm.isImportant"
                      color="warning"
                      size="small"
                      class="mr-2"
                    >
                      mdi-star
                    </v-icon>
                    <v-spacer />
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
                        <v-list-item @click="openCommunicationDialog(comm)">
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteCommunication(comm)">
                          <v-list-item-title class="text-error">Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div class="font-weight-medium mb-1">{{ comm.subject }}</div>
                  <div class="text-body-2 text-grey-darken-1 mb-2">
                    Client: {{ getClientName(comm.clientId) }}
                  </div>
                  <div class="text-body-2">{{ comm.content }}</div>
                  <div v-if="comm.attachments && comm.attachments.length" class="mt-2">
                    <v-chip
                      v-for="attachment in comm.attachments"
                      :key="attachment"
                      size="small"
                      variant="outlined"
                      class="mr-1"
                    >
                      <v-icon start>mdi-attachment</v-icon>
                      {{ attachment }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>

        <!-- Table View -->
        <v-data-table
          v-else
          :headers="headers"
          :items="filteredCommunications"
          :loading="loading"
          item-value="_id"
          class="elevation-0"
        >
          <template #item.type="{ item }">
            <v-chip
              :color="getTypeColor(item.type)"
              size="small"
              class="mr-1"
            >
              <v-icon start size="small">{{ getTypeIcon(item.type) }}</v-icon>
              {{ item.type }}
            </v-chip>
          </template>

          <template #item.direction="{ item }">
            <v-chip
              :color="item.direction === 'inbound' ? 'success' : 'info'"
              size="small"
              variant="outlined"
            >
              {{ item.direction }}
            </v-chip>
          </template>

          <template #item.client="{ item }">
            {{ getClientName(item.clientId) }}
          </template>

          <template #item.subject="{ item }">
            <div>
              {{ item.subject }}
              <v-icon
                v-if="item.isImportant"
                color="warning"
                size="small"
                class="ml-1"
              >
                mdi-star
              </v-icon>
            </div>
          </template>

          <template #item.date="{ item }">
            <div>
              <div class="text-body-2">{{ formatDate(item.date) }}</div>
              <div class="text-caption text-grey">{{ formatTime(item.date) }}</div>
            </div>
          </template>

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
                <v-list-item @click="openCommunicationDialog(item)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteCommunication(item)">
                  <v-list-item-title class="text-error">Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Communication Dialog -->
    <v-dialog v-model="communicationDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingCommunication ? 'Edit Communication' : 'Add New Communication' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="communicationForm.clientId"
                  :items="clientOptions"
                  label="Client*"
                  variant="outlined"
                  :rules="[v => !!v || 'Client is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="communicationForm.type"
                  :items="typeOptions"
                  label="Communication Type*"
                  variant="outlined"
                  :rules="[v => !!v || 'Type is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="communicationForm.direction"
                  :items="directionOptions"
                  label="Direction*"
                  variant="outlined"
                  :rules="[v => !!v || 'Direction is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="communicationForm.date"
                  label="Date & Time*"
                  type="datetime-local"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="communicationForm.subject"
                  label="Subject*"
                  variant="outlined"
                  :rules="[v => !!v || 'Subject is required']"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="communicationForm.content"
                  label="Content*"
                  variant="outlined"
                  rows="4"
                  :rules="[v => !!v || 'Content is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="communicationForm.contactPerson"
                  label="Contact Person"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="communicationForm.isImportant"
                  label="Mark as Important"
                  color="warning"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="attachmentInput"
                  label="Add Attachment"
                  variant="outlined"
                  append-inner-icon="mdi-plus"
                  @click:append-inner="addAttachment"
                  @keyup.enter="addAttachment"
                />
                <div v-if="communicationForm.attachments.length" class="mt-2">
                  <v-chip
                    v-for="(attachment, index) in communicationForm.attachments"
                    :key="index"
                    closable
                    @click:close="removeAttachment(index)"
                    class="mr-1 mb-1"
                  >
                    {{ attachment }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeCommunicationDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveCommunication">
            {{ editingCommunication ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this communication? This action cannot be undone.
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
import { communicationService, clientService } from '../../services/crmService.js'

// Data
const communications = ref([])
const clients = ref([])
const loading = ref(false)
const viewMode = ref('timeline')
const searchQuery = ref('')
const typeFilter = ref('')
const directionFilter = ref('')
const clientFilter = ref('')
const importantFilter = ref('')

// Dialogs
const communicationDialog = ref(false)
const deleteDialog = ref(false)
const editingCommunication = ref(null)
const communicationToDelete = ref(null)
const attachmentInput = ref('')

// Form
const communicationForm = ref({
  clientId: '',
  type: 'email',
  direction: 'outbound',
  date: '',
  subject: '',
  content: '',
  contactPerson: '',
  isImportant: false,
  attachments: []
})

// Options
const typeOptions = ['email', 'call', 'meeting', 'chat', 'note', 'sms', 'video_call']
const directionOptions = ['inbound', 'outbound']

// Table headers
const headers = [
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Direction', key: 'direction', sortable: true },
  { title: 'Client', key: 'client', sortable: true },
  { title: 'Subject', key: 'subject', sortable: true },
  { title: 'Date & Time', key: 'date', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
]

// Computed
const clientOptions = computed(() => {
  return clients.value.map(client => ({
    title: client.name,
    value: client._id
  }))
})

const filteredCommunications = computed(() => {
  let filtered = communications.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(comm =>
      comm.subject.toLowerCase().includes(query) ||
      comm.content.toLowerCase().includes(query) ||
      (comm.contactPerson && comm.contactPerson.toLowerCase().includes(query))
    )
  }

  if (typeFilter.value) {
    filtered = filtered.filter(comm => comm.type === typeFilter.value)
  }

  if (directionFilter.value) {
    filtered = filtered.filter(comm => comm.direction === directionFilter.value)
  }

  if (clientFilter.value) {
    filtered = filtered.filter(comm => comm.clientId === clientFilter.value)
  }

  if (importantFilter.value) {
    filtered = filtered.filter(comm => comm.isImportant === importantFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
})

// Methods
const loadCommunications = async () => {
  loading.value = true
  try {
    const response = await communicationService.getCommunications()
    communications.value = response.data || response
  } catch (error) {
    console.error('Error loading communications:', error)
    // Fallback to demo data
    communications.value = [
      {
        _id: '1',
        clientId: '1',
        type: 'email',
        direction: 'outbound',
        date: new Date('2024-01-15T10:30:00'),
        subject: 'Project Proposal Follow-up',
        content: 'Following up on the web development proposal we discussed last week.',
        contactPerson: 'John Smith',
        isImportant: true,
        attachments: ['proposal_v2.pdf']
      },
      {
        _id: '2',
        clientId: '2',
        type: 'call',
        direction: 'inbound',
        date: new Date('2024-01-10T14:15:00'),
        subject: 'Initial Consultation Call',
        content: 'Discussed requirements for mobile app development project.',
        contactPerson: 'Sarah Johnson',
        isImportant: false,
        attachments: []
      }
    ]
  } finally {
    loading.value = false
  }
}

const loadClients = async () => {
  try {
    const response = await clientService.getClients()
    clients.value = response.data || response
  } catch (error) {
    console.error('Error loading clients:', error)
    // Fallback to demo data
    clients.value = [
      { _id: '1', name: 'Tech Solutions Inc' },
      { _id: '2', name: 'StartupXYZ' }
    ]
  }
}

const openCommunicationDialog = (communication = null) => {
  editingCommunication.value = communication
  if (communication) {
    communicationForm.value = {
      ...communication,
      date: new Date(communication.date).toISOString().slice(0, 16)
    }
  } else {
    communicationForm.value = {
      clientId: '',
      type: 'email',
      direction: 'outbound',
      date: new Date().toISOString().slice(0, 16),
      subject: '',
      content: '',
      contactPerson: '',
      isImportant: false,
      attachments: []
    }
  }
  communicationDialog.value = true
}

const closeCommunicationDialog = () => {
  communicationDialog.value = false
  editingCommunication.value = null
  attachmentInput.value = ''
}

const saveCommunication = async () => {
  try {
    const formData = {
      ...communicationForm.value,
      date: new Date(communicationForm.value.date)
    }
    
    if (editingCommunication.value) {
      await communicationService.updateCommunication(editingCommunication.value._id, formData)
    } else {
      await communicationService.createCommunication(formData)
    }
    await loadCommunications()
    closeCommunicationDialog()
  } catch (error) {
    console.error('Error saving communication:', error)
  }
}

const deleteCommunication = (communication) => {
  communicationToDelete.value = communication
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await communicationService.deleteCommunication(communicationToDelete.value._id)
    await loadCommunications()
    deleteDialog.value = false
    communicationToDelete.value = null
  } catch (error) {
    console.error('Error deleting communication:', error)
  }
}

const addAttachment = () => {
  if (attachmentInput.value.trim()) {
    communicationForm.value.attachments.push(attachmentInput.value.trim())
    attachmentInput.value = ''
  }
}

const removeAttachment = (index) => {
  communicationForm.value.attachments.splice(index, 1)
}

// Utility functions
const getClientName = (clientId) => {
  const client = clients.value.find(c => c._id === clientId)
  return client ? client.name : 'Unknown Client'
}

const getTypeColor = (type) => {
  const colors = {
    email: 'blue',
    call: 'green',
    meeting: 'purple',
    chat: 'orange',
    note: 'grey',
    sms: 'teal',
    video_call: 'indigo'
  }
  return colors[type] || 'grey'
}

const getTypeIcon = (type) => {
  const icons = {
    email: 'mdi-email',
    call: 'mdi-phone',
    meeting: 'mdi-calendar-account',
    chat: 'mdi-chat',
    note: 'mdi-note-text',
    sms: 'mdi-message-text',
    video_call: 'mdi-video'
  }
  return icons[type] || 'mdi-message'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString()
}

// Lifecycle
onMounted(() => {
  loadClients()
  loadCommunications()
})
</script>

<style scoped>
.timeline-container {
  max-height: 600px;
  overflow-y: auto;
}

.v-timeline {
  padding-top: 0;
}

.v-card .v-card-text {
  padding: 12px 16px;
}
</style>
