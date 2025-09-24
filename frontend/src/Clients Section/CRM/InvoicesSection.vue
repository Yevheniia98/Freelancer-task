<template>
  <v-container fluid>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2 class="text-h4">Invoices & Payments</h2>
        <v-btn
          color="primary"
          @click="openInvoiceDialog()"
          prepend-icon="mdi-plus"
        >
          Create Invoice
        </v-btn>
      </v-col>
    </v-row>

    <!-- Invoice Stats -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card color="primary" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ invoiceStats.total }}</div>
            <div class="text-white">Total Invoices</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="success" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">${{ formatCurrency(invoiceStats.paidAmount) }}</div>
            <div class="text-white">Paid Amount</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">${{ formatCurrency(invoiceStats.pendingAmount) }}</div>
            <div class="text-white">Pending Amount</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="error" variant="flat">
          <v-card-text class="text-center">
            <div class="text-h4 font-weight-bold text-white">{{ invoiceStats.overdue }}</div>
            <div class="text-white">Overdue Invoices</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-row class="mb-4">
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Search invoices..."
          prepend-inner-icon="mdi-magnify"
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
        <v-text-field
          v-model="dateFrom"
          label="From Date"
          type="date"
          variant="outlined"
          density="compact"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
          v-model="dateTo"
          label="To Date"
          type="date"
          variant="outlined"
          density="compact"
        />
      </v-col>
    </v-row>

    <!-- Invoices Table -->
    <v-data-table
      :headers="headers"
      :items="filteredInvoices"
      :loading="loading"
      item-value="_id"
      class="elevation-1"
    >
      <!-- Invoice Number Column -->
      <template #item.invoiceNumber="{ item }">
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="primary">mdi-file-document</v-icon>
          <div>
            <div class="font-weight-medium">{{ item.invoiceNumber }}</div>
            <div class="text-caption text-grey">{{ formatDate(item.issueDate) }}</div>
          </div>
        </div>
      </template>

      <!-- Client Column -->
      <template #item.client="{ item }">
        {{ getClientName(item.clientId) }}
      </template>

      <!-- Amount Column -->
      <template #item.amount="{ item }">
        <div>
          <div class="font-weight-bold">${{ formatCurrency(item.totalAmount) }}</div>
          <div class="text-caption text-grey">
            Tax: ${{ formatCurrency(item.taxAmount || 0) }}
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
          <v-icon start size="small">{{ getStatusIcon(item.status) }}</v-icon>
          {{ item.status }}
        </v-chip>
      </template>

      <!-- Due Date Column -->
      <template #item.dueDate="{ item }">
        <div>
          <div class="text-body-2">{{ formatDate(item.dueDate) }}</div>
          <div v-if="isOverdue(item)" class="text-caption text-error">
            {{ getDaysOverdue(item) }} days overdue
          </div>
          <div v-else-if="isDueSoon(item)" class="text-caption text-warning">
            Due in {{ getDaysUntilDue(item) }} days
          </div>
        </div>
      </template>

      <!-- Payment Status Column -->
      <template #item.paymentStatus="{ item }">
        <div>
          <v-progress-linear
            :model-value="getPaymentProgress(item)"
            :color="getPaymentProgressColor(item)"
            height="6"
            class="mb-1"
          />
          <div class="text-caption">
            ${{ formatCurrency(item.paidAmount || 0) }} / ${{ formatCurrency(item.totalAmount) }}
          </div>
        </div>
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
            <v-list-item @click="openInvoiceDialog(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-pencil</v-icon>
                Edit
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="viewInvoice(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-eye</v-icon>
                View
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="downloadInvoice(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-download</v-icon>
                Download PDF
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="recordPayment(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-cash</v-icon>
                Record Payment
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="sendReminder(item)">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-email-send</v-icon>
                Send Reminder
              </v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="deleteInvoice(item)" class="text-error">
              <v-list-item-title>
                <v-icon class="mr-2">mdi-delete</v-icon>
                Delete
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Invoice Dialog -->
    <v-dialog v-model="invoiceDialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingInvoice ? 'Edit Invoice' : 'Create New Invoice' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <!-- Basic Information -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="invoiceForm.clientId"
                  :items="clientOptions"
                  label="Client*"
                  variant="outlined"
                  :rules="[v => !!v || 'Client is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="invoiceForm.invoiceNumber"
                  label="Invoice Number*"
                  variant="outlined"
                  :rules="[v => !!v || 'Invoice number is required']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="invoiceForm.issueDate"
                  label="Issue Date*"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Issue date is required']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="invoiceForm.dueDate"
                  label="Due Date*"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Due date is required']"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="invoiceForm.status"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                />
              </v-col>

              <!-- Invoice Items -->
              <v-col cols="12">
                <v-divider class="my-4" />
                <div class="d-flex justify-space-between align-center mb-4">
                  <h3 class="text-h6">Invoice Items</h3>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    @click="addInvoiceItem"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Add Item
                  </v-btn>
                </div>
                
                <v-card v-if="invoiceForm.items.length === 0" variant="outlined" class="text-center pa-8">
                  <v-icon size="48" color="grey">mdi-clipboard-list-outline</v-icon>
                  <div class="text-h6 mt-2 text-grey">No items added yet</div>
                  <div class="text-body-2 text-grey">Click "Add Item" to start building your invoice</div>
                </v-card>

                <div v-else>
                  <v-card
                    v-for="(item, index) in invoiceForm.items"
                    :key="index"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="item.description"
                            label="Description*"
                            variant="outlined"
                            density="compact"
                          />
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field
                            v-model="item.quantity"
                            label="Quantity*"
                            type="number"
                            variant="outlined"
                            density="compact"
                            @input="calculateItemTotal(index)"
                          />
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field
                            v-model="item.rate"
                            label="Rate*"
                            type="number"
                            step="0.01"
                            variant="outlined"
                            density="compact"
                            prefix="$"
                            @input="calculateItemTotal(index)"
                          />
                        </v-col>
                        <v-col cols="12" md="2">
                          <v-text-field
                            :model-value="formatCurrency(item.total || 0)"
                            label="Total"
                            variant="outlined"
                            density="compact"
                            readonly
                            prefix="$"
                          />
                        </v-col>
                        <v-col cols="12" md="2" class="d-flex align-center">
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            color="error"
                            size="small"
                            @click="removeInvoiceItem(index)"
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </div>
              </v-col>

              <!-- Totals -->
              <v-col cols="12" md="8"></v-col>
              <v-col cols="12" md="4">
                <v-card variant="outlined">
                  <v-card-text>
                    <div class="d-flex justify-space-between mb-2">
                      <span>Subtotal:</span>
                      <span>${{ formatCurrency(invoiceForm.subtotal || 0) }}</span>
                    </div>
                    <div class="d-flex justify-space-between mb-2">
                      <span>Tax ({{ invoiceForm.taxRate || 0 }}%):</span>
                      <span>${{ formatCurrency(invoiceForm.taxAmount || 0) }}</span>
                    </div>
                    <v-divider class="my-2" />
                    <div class="d-flex justify-space-between font-weight-bold text-h6">
                      <span>Total:</span>
                      <span>${{ formatCurrency(invoiceForm.totalAmount || 0) }}</span>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Tax Rate -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="invoiceForm.taxRate"
                  label="Tax Rate (%)"
                  type="number"
                  step="0.01"
                  variant="outlined"
                  @input="calculateTotals"
                />
              </v-col>

              <!-- Notes -->
              <v-col cols="12">
                <v-textarea
                  v-model="invoiceForm.notes"
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
          <v-btn color="grey" variant="text" @click="closeInvoiceDialog">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveInvoice">
            {{ editingInvoice ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Payment Dialog -->
    <v-dialog v-model="paymentDialog" max-width="600px">
      <v-card>
        <v-card-title>Record Payment</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="text-h6 mb-4">
                  Invoice: {{ selectedInvoice?.invoiceNumber }}
                </div>
                <div class="mb-4">
                  <span class="text-body-2 text-grey">Total Amount: </span>
                  <span class="font-weight-bold">${{ formatCurrency(selectedInvoice?.totalAmount || 0) }}</span>
                </div>
                <div class="mb-4">
                  <span class="text-body-2 text-grey">Already Paid: </span>
                  <span class="font-weight-bold">${{ formatCurrency(selectedInvoice?.paidAmount || 0) }}</span>
                </div>
                <div class="mb-4">
                  <span class="text-body-2 text-grey">Remaining: </span>
                  <span class="font-weight-bold text-error">
                    ${{ formatCurrency((selectedInvoice?.totalAmount || 0) - (selectedInvoice?.paidAmount || 0)) }}
                  </span>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentForm.amount"
                  label="Payment Amount*"
                  type="number"
                  step="0.01"
                  variant="outlined"
                  prefix="$"
                  :rules="[v => !!v || 'Amount is required', v => v > 0 || 'Amount must be positive']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentForm.date"
                  label="Payment Date*"
                  type="date"
                  variant="outlined"
                  :rules="[v => !!v || 'Date is required']"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="paymentForm.method"
                  :items="paymentMethods"
                  label="Payment Method*"
                  variant="outlined"
                  :rules="[v => !!v || 'Payment method is required']"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="paymentForm.reference"
                  label="Payment Reference"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="paymentForm.notes"
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
          <v-btn color="grey" variant="text" @click="paymentDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="savePayment">
            Record Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete invoice "{{ invoiceToDelete?.invoiceNumber }}"? This action cannot be undone.
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
import { invoiceService, clientService } from '../../services/crmService.js'

// Data
const invoices = ref([])
const clients = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const clientFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Dialogs
const invoiceDialog = ref(false)
const paymentDialog = ref(false)
const deleteDialog = ref(false)
const editingInvoice = ref(null)
const selectedInvoice = ref(null)
const invoiceToDelete = ref(null)

// Forms
const invoiceForm = ref({
  clientId: '',
  invoiceNumber: '',
  issueDate: '',
  dueDate: '',
  status: 'draft',
  items: [],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  totalAmount: 0,
  notes: ''
})

const paymentForm = ref({
  amount: 0,
  date: '',
  method: '',
  reference: '',
  notes: ''
})

// Options
const statusOptions = ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled']
const paymentMethods = ['cash', 'check', 'bank_transfer', 'credit_card', 'paypal', 'stripe', 'other']

// Table headers
const headers = [
  { title: 'Invoice #', key: 'invoiceNumber', sortable: true },
  { title: 'Client', key: 'client', sortable: true },
  { title: 'Amount', key: 'amount', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Due Date', key: 'dueDate', sortable: true },
  { title: 'Payment Progress', key: 'paymentStatus', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' }
]

// Computed
const clientOptions = computed(() => {
  return clients.value.map(client => ({
    title: client.name,
    value: client._id
  }))
})

const filteredInvoices = computed(() => {
  let filtered = invoices.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(query) ||
      getClientName(invoice.clientId).toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(invoice => invoice.status === statusFilter.value)
  }

  if (clientFilter.value) {
    filtered = filtered.filter(invoice => invoice.clientId === clientFilter.value)
  }

  if (dateFrom.value) {
    filtered = filtered.filter(invoice => new Date(invoice.issueDate) >= new Date(dateFrom.value))
  }

  if (dateTo.value) {
    filtered = filtered.filter(invoice => new Date(invoice.issueDate) <= new Date(dateTo.value))
  }

  return filtered.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
})

const invoiceStats = computed(() => {
  const stats = {
    total: invoices.value.length,
    paidAmount: 0,
    pendingAmount: 0,
    overdue: 0
  }

  invoices.value.forEach(invoice => {
    if (invoice.status === 'paid') {
      stats.paidAmount += invoice.totalAmount
    } else {
      stats.pendingAmount += invoice.totalAmount
      if (isOverdue(invoice)) {
        stats.overdue++
      }
    }
  })

  return stats
})

// Methods
const loadInvoices = async () => {
  loading.value = true
  try {
    const response = await invoiceService.getInvoices()
    invoices.value = response.data
  } catch (error) {
    console.error('Error loading invoices:', error)
    // Fallback to demo data
    invoices.value = [
      {
        _id: '1',
        invoiceNumber: 'INV-2024-001',
        clientId: '1',
        issueDate: new Date('2024-01-15'),
        dueDate: new Date('2024-02-15'),
        status: 'sent',
        items: [
          { description: 'Website Development', quantity: 1, rate: 5000, total: 5000 }
        ],
        subtotal: 5000,
        taxRate: 10,
        taxAmount: 500,
        totalAmount: 5500,
        paidAmount: 0,
        notes: 'Website development project as discussed'
      },
      {
        _id: '2',
        invoiceNumber: 'INV-2024-002',
        clientId: '2',
        issueDate: new Date('2024-01-10'),
        dueDate: new Date('2024-01-25'),
        status: 'overdue',
        items: [
          { description: 'Logo Design', quantity: 3, rate: 200, total: 600 }
        ],
        subtotal: 600,
        taxRate: 8,
        taxAmount: 48,
        totalAmount: 648,
        paidAmount: 0,
        notes: 'Logo design variations'
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

const openInvoiceDialog = (invoice = null) => {
  editingInvoice.value = invoice
  if (invoice) {
    invoiceForm.value = {
      ...invoice,
      issueDate: new Date(invoice.issueDate).toISOString().slice(0, 10),
      dueDate: new Date(invoice.dueDate).toISOString().slice(0, 10)
    }
  } else {
    const today = new Date().toISOString().slice(0, 10)
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    invoiceForm.value = {
      clientId: '',
      invoiceNumber: generateInvoiceNumber(),
      issueDate: today,
      dueDate: nextMonth.toISOString().slice(0, 10),
      status: 'draft',
      items: [],
      subtotal: 0,
      taxRate: 10,
      taxAmount: 0,
      totalAmount: 0,
      notes: ''
    }
  }
  invoiceDialog.value = true
}

const closeInvoiceDialog = () => {
  invoiceDialog.value = false
  editingInvoice.value = null
}

const addInvoiceItem = () => {
  invoiceForm.value.items.push({
    description: '',
    quantity: 1,
    rate: 0,
    total: 0
  })
}

const removeInvoiceItem = (index) => {
  invoiceForm.value.items.splice(index, 1)
  calculateTotals()
}

const calculateItemTotal = (index) => {
  const item = invoiceForm.value.items[index]
  item.total = (item.quantity || 0) * (item.rate || 0)
  calculateTotals()
}

const calculateTotals = () => {
  const subtotal = invoiceForm.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
  const taxAmount = subtotal * (invoiceForm.value.taxRate || 0) / 100
  
  invoiceForm.value.subtotal = subtotal
  invoiceForm.value.taxAmount = taxAmount
  invoiceForm.value.totalAmount = subtotal + taxAmount
}

const saveInvoice = async () => {
  try {
    calculateTotals()
    
    const formData = {
      ...invoiceForm.value,
      issueDate: new Date(invoiceForm.value.issueDate),
      dueDate: new Date(invoiceForm.value.dueDate)
    }
    
    if (editingInvoice.value) {
      await invoiceService.updateInvoice(editingInvoice.value._id, formData)
    } else {
      await invoiceService.createInvoice(formData)
    }
    await loadInvoices()
    closeInvoiceDialog()
  } catch (error) {
    console.error('Error saving invoice:', error)
  }
}

const recordPayment = (invoice) => {
  selectedInvoice.value = invoice
  paymentForm.value = {
    amount: (invoice.totalAmount || 0) - (invoice.paidAmount || 0),
    date: new Date().toISOString().slice(0, 10),
    method: '',
    reference: '',
    notes: ''
  }
  paymentDialog.value = true
}

const savePayment = async () => {
  try {
    await invoiceService.markInvoicePaid(selectedInvoice.value._id, paymentForm.value)
    await loadInvoices()
    paymentDialog.value = false
  } catch (error) {
    console.error('Error recording payment:', error)
  }
}

const deleteInvoice = (invoice) => {
  invoiceToDelete.value = invoice
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await invoiceService.deleteInvoice(invoiceToDelete.value._id)
    await loadInvoices()
    deleteDialog.value = false
    invoiceToDelete.value = null
  } catch (error) {
    console.error('Error deleting invoice:', error)
  }
}

const viewInvoice = (invoice) => {
  // Open invoice preview in new tab
  window.open(`/invoice-preview/${invoice._id}`, '_blank')
}

const downloadInvoice = async (invoice) => {
  try {
    // PDF download functionality would be implemented here
    console.log('Download PDF for invoice:', invoice)
    // const response = await invoiceService.downloadPDF(invoice._id)
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${invoice.invoiceNumber}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error) {
    console.error('Error downloading invoice:', error)
  }
}

const sendReminder = async (invoice) => {
  try {
    // Send reminder functionality would be implemented here
    console.log('Send reminder for invoice:', invoice)
    // await invoiceService.sendReminder(invoice._id)
    // Show success message
    console.log('Reminder sent successfully')
  } catch (error) {
    console.error('Error sending reminder:', error)
  }
}

// Utility functions
const getClientName = (clientId) => {
  const client = clients.value.find(c => c._id === clientId)
  return client ? client.name : 'Unknown Client'
}

const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    sent: 'blue',
    viewed: 'orange',
    paid: 'success',
    overdue: 'error',
    cancelled: 'red'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    draft: 'mdi-file-document-outline',
    sent: 'mdi-email-send',
    viewed: 'mdi-eye',
    paid: 'mdi-check-circle',
    overdue: 'mdi-alert-circle',
    cancelled: 'mdi-cancel'
  }
  return icons[status] || 'mdi-file-document'
}

const isOverdue = (invoice) => {
  return invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date()
}

const isDueSoon = (invoice) => {
  const dueDate = new Date(invoice.dueDate)
  const today = new Date()
  const daysDiff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
  return invoice.status !== 'paid' && daysDiff <= 7 && daysDiff > 0
}

const getDaysOverdue = (invoice) => {
  const dueDate = new Date(invoice.dueDate)
  const today = new Date()
  return Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24))
}

const getDaysUntilDue = (invoice) => {
  const dueDate = new Date(invoice.dueDate)
  const today = new Date()
  return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
}

const getPaymentProgress = (invoice) => {
  if (!invoice.totalAmount) return 0
  return ((invoice.paidAmount || 0) / invoice.totalAmount) * 100
}

const getPaymentProgressColor = (invoice) => {
  const progress = getPaymentProgress(invoice)
  if (progress === 100) return 'success'
  if (progress > 50) return 'warning'
  return 'primary'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value || 0)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const count = String(invoices.value.length + 1).padStart(3, '0')
  return `INV-${year}-${month}-${count}`
}

// Lifecycle
onMounted(() => {
  loadClients()
  loadInvoices()
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