<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4">Sales Pipeline</h2>
        <v-btn
          color="primary"
          @click="openDealDialog()"
          prepend-icon="mdi-plus"
        >
          Add Deal
        </v-btn>
      </v-col>
    </v-row>

    <!-- Pipeline Stats -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card color="primary" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ pipelineStats.totalDeals }}</div>
            <div class="text-white">Total Deals</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="success" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">${{ formatCurrency(pipelineStats.totalValue) }}</div>
            <div class="text-white">Pipeline Value</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ pipelineStats.avgProbability }}%</div>
            <div class="text-white">Avg. Probability</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="info" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">${{ formatCurrency(pipelineStats.expectedValue) }}</div>
            <div class="text-white">Expected Value</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Search deals..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-select
          v-model="stageFilter"
          :items="stageOptions"
          label="Stage"
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
        <v-btn-toggle v-model="viewMode" mandatory>
          <v-btn value="kanban" size="small">
            <v-icon>mdi-view-column</v-icon>
          </v-btn>
          <v-btn value="table" size="small">
            <v-icon>mdi-table</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'">
      <v-row class="kanban-board">
        <v-col
          v-for="stage in stages"
          :key="stage.value"
          cols="12"
          md="2"
          class="kanban-column"
        >
          <v-card class="h-100" variant="outlined">
            <v-card-title class="text-center pa-2">
              <div class="d-flex align-center justify-center">
                <v-chip
                  :color="getStageColor(stage.value)"
                  size="small"
                  class="mr-2"
                >
                  {{ getDealsByStage(stage.value).length }}
                </v-chip>
                {{ stage.title }}
              </div>
            </v-card-title>
            <v-card-text class="pa-2 kanban-cards">
              <v-card
                v-for="deal in getDealsByStage(stage.value)"
                :key="deal._id"
                class="mb-2 deal-card"
                variant="outlined"
                @click="openDealDialog(deal)"
              >
                <v-card-text class="pa-3">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <div class="text-body-2 font-weight-medium">{{ deal.title }}</div>
                    <v-menu>
                      <template #activator="{ props }">
                        <v-btn
                          icon="mdi-dots-vertical"
                          variant="text"
                          size="x-small"
                          v-bind="props"
                          @click.stop
                        />
                      </template>
                      <v-list density="compact">
                        <v-list-item @click="openDealDialog(deal)">
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteDeal(deal)">
                          <v-list-item-title class="text-error">Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <div class="text-caption text-grey mb-2">{{ getClientName(deal.clientId) }}</div>
                  <div class="d-flex align-center justify-space-between">
                    <div class="text-h6 font-weight-bold">${{ formatCurrency(deal.value) }}</div>
                    <v-chip
                      :color="getProbabilityColor(deal.probability)"
                      size="x-small"
                      variant="outlined"
                    >
                      {{ deal.probability }}%
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey mt-1">
                    Expected close: {{ formatDate(deal.expectedCloseDate) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Table View -->
    <v-data-table
      v-else
      :headers="headers"
      :items="filteredDeals"
      :loading="loading"
      item-value="_id"
      class="elevation-1"
    >
      <template #item.title="{ item }">
        <div>
          <div class="font-weight-medium">{{ item.title }}</div>
          <div class="text-caption text-grey">{{ item.description }}</div>
        </div>
      </template>

      <template #item.client="{ item }">
        {{ getClientName(item.clientId) }}
      </template>

      <template #item.stage="{ item }">
        <v-chip
          :color="getStageColor(item.stage)"
          size="small"
        >
          {{ item.stage }}
        </v-chip>
      </template>

      <template #item.value="{ item }">
        <div class="font-weight-bold">${{ formatCurrency(item.value) }}</div>
      </template>

      <template #item.probability="{ item }">
        <div class="d-flex align-center">
          <v-progress-linear
            :model-value="item.probability"
            :color="getProbabilityColor(item.probability)"
            height="6"
            class="mr-2"
            style="min-width: 60px;"
          />
          <span class="text-caption">{{ item.probability }}%</span>
        </div>
      </template>

      <template #item.expectedValue="{ item }">
        ${{ formatCurrency(item.value * item.probability / 100) }}
      </template>

      <template #item.expectedCloseDate="{ item }">
        {{ formatDate(item.expectedCloseDate) }}
      </template>

      <template #item.status="{ item }">
        <v-chip
          :color="getStatusColor(item.status)"
          size="small"
          variant="outlined"
        >
          {{ item.status }}
        </v-chip>
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
            <v-list-item @click="openDealDialog(item)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="markAsWon(item)">
              <v-list-item-title class="text-success">Mark as Won</v-list-item-title>
            </v-list-item>
            <v-list-item @click="markAsLost(item)">
              <v-list-item-title class="text-error">Mark as Lost</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="deleteDeal(item)">
              <v-list-item-title class="text-error">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Deal Dialog -->
    <v-dialog v-model="dealDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingDeal ? 'Edit Deal' : 'Add New Deal' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="dealForm.title"
                  label="Deal Title*"
                  variant="outlined"
                  :rules="[v => !!v || 'Title is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="dealForm.clientId"
                  :items="clientOptions"
                  label="Client*"
                  variant="outlined"
                  :rules="[v => !!v || 'Client is required']"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="dealForm.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="dealForm.value"
                  label="Deal Value*"
                  type="number"
                  prefix="$"
                  variant="outlined"
                  :rules="[v => !!v || 'Value is required', v => v > 0 || 'Value must be positive']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="dealForm.stage"
                  :items="stageOptions"
                  label="Stage*"
                  variant="outlined"
                  :rules="[v => !!v || 'Stage is required']"
                  @update:model-value="updateProbabilityFromStage"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-slider
                  v-model="dealForm.probability"
                  label="Probability"
                  min="0"
                  max="100"
                  step="5"
                  thumb-label
                  show-ticks="always"
                  tick-size="2"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="dealForm.expectedCloseDate"
                  label="Expected Close Date*"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Expected close date is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="dealForm.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-divider class="my-2" />
                <h3 class="text-h6 mb-2">Activities</h3>
                <div v-if="dealForm.activities.length === 0" class="text-grey text-center py-4">
                  No activities yet
                </div>
                <v-card
                  v-for="(activity, index) in dealForm.activities"
                  :key="index"
                  variant="outlined"
                  class="mb-2"
                >
                  <v-card-text class="pa-3">
                    <div class="d-flex justify-space-between align-center">
                      <div>
                        <div class="font-weight-medium">{{ activity.type }}</div>
                        <div class="text-caption text-grey">{{ formatDateTime(activity.date) }}</div>
                        <div class="text-body-2 mt-1">{{ activity.description }}</div>
                      </div>
                      <v-btn
                        icon="mdi-delete"
                        variant="text"
                        size="small"
                        color="error"
                        @click="removeActivity(index)"
                      />
                    </div>
                  </v-card-text>
                </v-card>
                <v-btn
                  prepend-icon="mdi-plus"
                  variant="outlined"
                  @click="openActivityDialog"
                >
                  Add Activity
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeDealDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveDeal">
            {{ editingDeal ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Activity Dialog -->
    <v-dialog v-model="activityDialog" max-width="500px">
      <v-card>
        <v-card-title>Add Activity</v-card-title>
        <v-card-text>
          <v-select
            v-model="activityForm.type"
            :items="activityTypes"
            label="Activity Type"
            variant="outlined"
            class="mb-3"
          />
          <v-textarea
            v-model="activityForm.description"
            label="Description"
            variant="outlined"
            rows="3"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="activityDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="addActivity">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ dealToDelete?.title }}"? This action cannot be undone.
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
import { dealService, clientService } from '../../services/crmService.js'

// Data
const deals = ref([])
const clients = ref([])
const loading = ref(false)
const viewMode = ref('kanban')
const searchQuery = ref('')
const stageFilter = ref('')
const statusFilter = ref('')
const clientFilter = ref('')

// Dialogs
const dealDialog = ref(false)
const activityDialog = ref(false)
const deleteDialog = ref(false)
const editingDeal = ref(null)
const dealToDelete = ref(null)

// Forms
const dealForm = ref({
  title: '',
  clientId: '',
  description: '',
  value: 0,
  stage: 'lead',
  probability: 10,
  expectedCloseDate: '',
  status: 'open',
  activities: []
})

const activityForm = ref({
  type: 'call',
  description: ''
})

// Options
const stages = [
  { title: 'Lead', value: 'lead' },
  { title: 'Qualified', value: 'qualified' },
  { title: 'Proposal', value: 'proposal' },
  { title: 'Negotiation', value: 'negotiation' },
  { title: 'Closed Won', value: 'closed_won' },
  { title: 'Closed Lost', value: 'closed_lost' }
]

const stageOptions = stages.map(s => s.value)
const statusOptions = ['open', 'won', 'lost', 'on_hold']
const activityTypes = ['call', 'email', 'meeting', 'proposal_sent', 'demo', 'follow_up']

// Table headers
const headers = [
  { title: 'Deal', key: 'title', sortable: true },
  { title: 'Client', key: 'client', sortable: true },
  { title: 'Stage', key: 'stage', sortable: true },
  { title: 'Value', key: 'value', sortable: true },
  { title: 'Probability', key: 'probability', sortable: true },
  { title: 'Expected Value', key: 'expectedValue', sortable: true },
  { title: 'Close Date', key: 'expectedCloseDate', sortable: true },
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

const filteredDeals = computed(() => {
  let filtered = deals.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(deal =>
      deal.title.toLowerCase().includes(query) ||
      deal.description?.toLowerCase().includes(query)
    )
  }

  if (stageFilter.value) {
    filtered = filtered.filter(deal => deal.stage === stageFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(deal => deal.status === statusFilter.value)
  }

  if (clientFilter.value) {
    filtered = filtered.filter(deal => deal.clientId === clientFilter.value)
  }

  return filtered
})

const pipelineStats = computed(() => {
  const openDeals = deals.value.filter(d => d.status === 'open')
  const totalValue = openDeals.reduce((sum, deal) => sum + deal.value, 0)
  const avgProbability = openDeals.length > 0 
    ? Math.round(openDeals.reduce((sum, deal) => sum + deal.probability, 0) / openDeals.length)
    : 0
  const expectedValue = openDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)

  return {
    totalDeals: openDeals.length,
    totalValue,
    avgProbability,
    expectedValue
  }
})

// Methods
const loadDeals = async () => {
  loading.value = true
  try {
    const response = await dealService.getDeals()
    deals.value = response.data || response
  } catch (error) {
    console.error('Error loading deals:', error)
    // Fallback to demo data
    deals.value = [
      {
        _id: '1',
        title: 'Website Redesign Project',
        clientId: '1',
        description: 'Complete website redesign with modern UI/UX',
        value: 15000,
        stage: 'proposal',
        probability: 70,
        expectedCloseDate: new Date('2024-02-15'),
        status: 'open',
        activities: [
          { type: 'call', description: 'Initial consultation call', date: new Date('2024-01-10') },
          { type: 'proposal_sent', description: 'Sent detailed proposal', date: new Date('2024-01-12') }
        ]
      },
      {
        _id: '2',
        title: 'Mobile App Development',
        clientId: '2',
        description: 'iOS and Android app for startup',
        value: 25000,
        stage: 'lead',
        probability: 30,
        expectedCloseDate: new Date('2024-03-01'),
        status: 'open',
        activities: []
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

const getDealsByStage = (stage) => {
  return filteredDeals.value.filter(deal => deal.stage === stage)
}

const openDealDialog = (deal = null) => {
  editingDeal.value = deal
  if (deal) {
    dealForm.value = {
      ...deal,
      expectedCloseDate: new Date(deal.expectedCloseDate).toISOString().slice(0, 10)
    }
  } else {
    dealForm.value = {
      title: '',
      clientId: '',
      description: '',
      value: 0,
      stage: 'lead',
      probability: 10,
      expectedCloseDate: '',
      status: 'open',
      activities: []
    }
  }
  dealDialog.value = true
}

const closeDealDialog = () => {
  dealDialog.value = false
  editingDeal.value = null
}

const saveDeal = async () => {
  try {
    const formData = {
      ...dealForm.value,
      expectedCloseDate: new Date(dealForm.value.expectedCloseDate)
    }
    
    if (editingDeal.value) {
      await dealService.updateDeal(editingDeal.value._id, formData)
    } else {
      await dealService.createDeal(formData)
    }
    await loadDeals()
    closeDealDialog()
  } catch (error) {
    console.error('Error saving deal:', error)
  }
}

const deleteDeal = (deal) => {
  dealToDelete.value = deal
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await dealService.deleteDeal(dealToDelete.value._id)
    await loadDeals()
    deleteDialog.value = false
    dealToDelete.value = null
  } catch (error) {
    console.error('Error deleting deal:', error)
  }
}

const markAsWon = async (deal) => {
  try {
    await dealService.updateDeal(deal._id, { 
      status: 'won', 
      stage: 'closed_won',
      probability: 100 
    })
    await loadDeals()
  } catch (error) {
    console.error('Error marking deal as won:', error)
  }
}

const markAsLost = async (deal) => {
  try {
    await dealService.updateDeal(deal._id, { 
      status: 'lost', 
      stage: 'closed_lost',
      probability: 0 
    })
    await loadDeals()
  } catch (error) {
    console.error('Error marking deal as lost:', error)
  }
}

const updateProbabilityFromStage = (stage) => {
  const stageProbabilities = {
    lead: 10,
    qualified: 25,
    proposal: 50,
    negotiation: 75,
    closed_won: 100,
    closed_lost: 0
  }
  dealForm.value.probability = stageProbabilities[stage] || 50
}

const openActivityDialog = () => {
  activityForm.value = { type: 'call', description: '' }
  activityDialog.value = true
}

const addActivity = () => {
  dealForm.value.activities.push({
    ...activityForm.value,
    date: new Date()
  })
  activityDialog.value = false
}

const removeActivity = (index) => {
  dealForm.value.activities.splice(index, 1)
}

// Utility functions
const getClientName = (clientId) => {
  const client = clients.value.find(c => c._id === clientId)
  return client ? client.name : 'Unknown Client'
}

const getStageColor = (stage) => {
  const colors = {
    lead: 'blue-grey',
    qualified: 'blue',
    proposal: 'orange',
    negotiation: 'purple',
    closed_won: 'success',
    closed_lost: 'error'
  }
  return colors[stage] || 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    open: 'primary',
    won: 'success',
    lost: 'error',
    on_hold: 'warning'
  }
  return colors[status] || 'grey'
}

const getProbabilityColor = (probability) => {
  if (probability >= 75) return 'success'
  if (probability >= 50) return 'warning'
  if (probability >= 25) return 'orange'
  return 'error'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const formatDateTime = (date) => {
  return new Date(date).toLocaleString()
}

// Lifecycle
onMounted(() => {
  loadClients()
  loadDeals()
})
</script>

<style scoped>
.kanban-board {
  min-height: 600px;
}

.kanban-column {
  height: 100%;
}

.kanban-cards {
  max-height: 500px;
  overflow-y: auto;
}

.deal-card {
  cursor: pointer;
  transition: all 0.2s;
}

.deal-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-slider {
  margin-top: 20px;
}
</style>
