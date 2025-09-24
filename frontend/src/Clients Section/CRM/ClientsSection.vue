<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4">Clients</h2>
        <v-btn
          color="primary"
          @click="openClientDialog()"
          prepend-icon="mdi-plus"
        >
          Add Client
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search and Filter -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Search clients..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Status Filter"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="priorityFilter"
          :items="priorityOptions"
          label="Priority Filter"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
    </v-row>

    <!-- Clients Data Table -->
    <v-data-table
      :headers="headers"
      :items="filteredClients"
      :loading="loading"
      item-value="_id"
      class="elevation-1"
    >
      <!-- Company Name Column -->
      <template #item.name="{ item }">
        <div class="d-flex align-center">
          <v-avatar
            :color="getAvatarColor(item.name)"
            size="32"
            class="mr-3"
          >
            <span class="text-white text-caption">
              {{ getInitials(item.name) }}
            </span>
          </v-avatar>
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-caption text-grey">{{ item.email }}</div>
          </div>
        </div>
      </template>

      <!-- Status Column -->
      <template #item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="flat"
        >
          {{ item.status }}
        </v-chip>
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

      <!-- Contact Info Column -->
      <template #item.contact="{ item }">
        <div>
          <div v-if="item.phone" class="d-flex align-center mb-1">
            <v-icon size="small" class="mr-1">mdi-phone</v-icon>
            <span class="text-caption">{{ item.phone }}</span>
          </div>
          <div v-if="item.address" class="d-flex align-center">
            <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
            <span class="text-caption">{{ item.address.city }}, {{ item.address.country }}</span>
          </div>
        </div>
      </template>

      <!-- Last Contact Column -->
      <template #item.lastContact="{ item }">
        <div v-if="item.lastContact">
          <div class="text-caption">{{ formatDate(item.lastContact) }}</div>
          <div class="text-caption text-grey">{{ getTimeSince(item.lastContact) }}</div>
        </div>
        <span v-else class="text-grey">Never</span>
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
            <v-list-item @click="openClientDialog(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-pencil</v-icon>
                Edit
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="viewClientDetails(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-eye</v-icon>
                View Details
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="addCommunication(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-message-plus</v-icon>
                Add Communication
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="createInvoice(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-file-plus</v-icon>
                Create Invoice
              </v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="deleteClient(item)" class="text-error">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-delete</v-icon>
                Delete
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Client Dialog -->
    <v-dialog v-model="clientDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingClient ? 'Edit Client' : 'Add New Client' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.name"
                  label="Company/Client Name*"
                  variant="outlined"
                  :rules="[v => !!v || 'Name is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.email"
                  label="Email*"
                  type="email"
                  variant="outlined"
                  :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.phone"
                  label="Phone"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.website"
                  label="Website"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="clientForm.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="clientForm.priority"
                  :items="priorityOptions"
                  label="Priority"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="clientForm.type"
                  :items="typeOptions"
                  label="Client Type"
                  variant="outlined"
                />
              </v-col>
              <!-- Address Fields -->
              <v-col cols="12">
                <v-divider class="my-2" />
                <h3 class="text-h6 mb-2">Address Information</h3>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.address.street"
                  label="Street Address"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="clientForm.address.city"
                  label="City"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.address.state"
                  label="State/Province"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.address.zipCode"
                  label="ZIP/Postal Code"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="clientForm.address.country"
                  label="Country"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="clientForm.notes"
                  label="Notes"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeClientDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveClient">
            {{ editingClient ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ clientToDelete?.name }}"? This action cannot be undone.
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
import { useRouter } from 'vue-router'
import { clientService } from '../../services/crmService.js'

const router = useRouter()

// Data
const clients = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Dialogs
const clientDialog = ref(false)
const deleteDialog = ref(false)
const editingClient = ref(null)
const clientToDelete = ref(null)

// Form
const clientForm = ref({
  name: '',
  email: '',
  phone: '',
  website: '',
  status: 'active',
  priority: 'medium',
  type: 'individual',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  },
  notes: ''
})

// Options
const statusOptions = ['active', 'inactive', 'potential', 'archived']
const priorityOptions = ['low', 'medium', 'high', 'critical']
const typeOptions = ['individual', 'small_business', 'enterprise', 'non_profit']

// Table headers
const headers = [
  { title: 'Client', key: 'name', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'Contact Info', key: 'contact', sortable: false },
  { title: 'Last Contact', key: 'lastContact', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
]

// Computed
const filteredClients = computed(() => {
  let filtered = clients.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(client =>
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      (client.phone && client.phone.includes(query))
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(client => client.status === statusFilter.value)
  }

  if (priorityFilter.value) {
    filtered = filtered.filter(client => client.priority === priorityFilter.value)
  }

  return filtered
})

// Methods
const loadClients = async () => {
  loading.value = true
  try {
    const response = await clientService.getClients()
    clients.value = response.data || response
  } catch (error) {
    console.error('Error loading clients:', error)
    // Fallback to demo data
    clients.value = [
      {
        _id: '1',
        name: 'Tech Solutions Inc',
        email: 'contact@techsolutions.com',
        phone: '+1-555-0123',
        website: 'https://techsolutions.com',
        status: 'active',
        priority: 'high',
        type: 'enterprise',
        address: {
          city: 'San Francisco',
          state: 'CA',
          country: 'USA'
        },
        lastContact: new Date('2024-01-15'),
        notes: 'Important client for ongoing web development projects'
      },
      {
        _id: '2',
        name: 'StartupXYZ',
        email: 'hello@startupxyz.com',
        phone: '+1-555-0456',
        status: 'potential',
        priority: 'medium',
        type: 'small_business',
        address: {
          city: 'Austin',
          state: 'TX',
          country: 'USA'
        },
        lastContact: new Date('2024-01-10'),
        notes: 'Interested in mobile app development'
      }
    ]
  } finally {
    loading.value = false
  }
}

const openClientDialog = (client = null) => {
  editingClient.value = client
  if (client) {
    clientForm.value = { ...client }
    if (!clientForm.value.address) {
      clientForm.value.address = {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  } else {
    clientForm.value = {
      name: '',
      email: '',
      phone: '',
      website: '',
      status: 'active',
      priority: 'medium',
      type: 'individual',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      notes: ''
    }
  }
  clientDialog.value = true
}

const closeClientDialog = () => {
  clientDialog.value = false
  editingClient.value = null
}

const saveClient = async () => {
  try {
    if (editingClient.value) {
      await clientService.updateClient(editingClient.value._id, clientForm.value)
    } else {
      await clientService.createClient(clientForm.value)
    }
    await loadClients()
    closeClientDialog()
  } catch (error) {
    console.error('Error saving client:', error)
  }
}

const deleteClient = (client) => {
  clientToDelete.value = client
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await clientService.deleteClient(clientToDelete.value._id)
    await loadClients()
    deleteDialog.value = false
    clientToDelete.value = null
  } catch (error) {
    console.error('Error deleting client:', error)
  }
}

const viewClientDetails = (client) => {
  // Navigate to client detail view or open detailed dialog
  console.log('View client details:', client)
}

const addCommunication = (client) => {
  // Open communication dialog for this client
  console.log('Add communication for:', client)
}

const createInvoice = (client) => {
  // Open invoice creation dialog for this client
  console.log('Create invoice for:', client)
}

// Utility functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getAvatarColor = (name) => {
  const colors = ['primary', 'secondary', 'accent', 'info', 'success', 'warning']
  const index = name.length % colors.length
  return colors[index]
}

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'grey',
    potential: 'warning',
    archived: 'error'
  }
  return colors[status] || 'grey'
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'info',
    medium: 'warning',
    high: 'orange',
    critical: 'error'
  }
  return colors[priority] || 'grey'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getTimeSince = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffTime = Math.abs(now - past)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

// Lifecycle
onMounted(() => {
  loadClients()
})
</script>

<style scoped>
.v-data-table {
  background: transparent;
}

.text-caption {
  font-size: 0.75rem !important;
}
</style>
