<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      class="left-menu-fixed"
      :class="{ 'expanded': sidebarExpanded }"
      @update:rail="sidebarExpanded = !$event"
    />
    <SearchBar />
    
    <v-main
      :class="{ 'main-expanded': sidebarExpanded, 'main-collapsed': !sidebarExpanded }"
      class="transition-all duration-300"
      style="background-color: #fafafa;"
    >
      <v-container
        fluid
        class="pa-6 container-full-width"
      >
        <!-- Header -->
        <div class="mb-10">
          <h1
            class="text-h3 font-weight-bold mb-3"
            style="color: #1a1a1a;"
          >
            Subscription Management
          </h1>
          <p
            class="text-body-1"
            style="color: #6b7280;"
          >
            Manage your subscription, payment methods, and billing preferences
          </p>
        </div>
        
        <!-- Current Subscription Section -->
        <div class="content-card mb-8">
          <div class="subscription-header mb-6">
            <div class="subscription-info">
              <h3 class="section-title mb-2">
                Current Subscription
              </h3>
              <div class="subscription-details">
                <div class="plan-badge-current mb-3">
                  <v-icon
                    color="white"
                    size="16"
                    class="mr-2"
                  >
                    mdi-rocket-launch
                  </v-icon>
                  Starter Plan
                </div>
                <p class="subscription-description mb-4">
                  Free trial - 7 days remaining
                </p>
                <div class="price-info">
                  <span class="price-amount">$15</span>
                  <span class="price-period">/month</span>
                  <span class="price-note">after trial ends</span>
                </div>
              </div>
            </div>
            <div class="trial-status">
              <div class="trial-indicator">
                <div class="trial-progress">
                  <div
                    class="trial-progress-bar"
                    style="width: 71%;"
                  />
                </div>
                <p class="trial-text">
                  Trial ends October 28, 2024
                </p>
              </div>
            </div>
          </div>
          
          <div class="subscription-note">
            <v-icon
              color="#0C9C8D"
              size="20"
              class="mr-3"
            >
              mdi-information
            </v-icon>
            <span>You can manage your payment methods, upgrade plans or cancel your subscription at any time.</span>
          </div>
        </div>

        <!-- Payment Methods Section -->
        <div class="content-card mb-8">
          <div class="section-header mb-6">
            <h3 class="section-title">
              Payment Methods
            </h3>
            <button 
              class="btn btn-secondary"
              @click="openPaymentDialog"
            >
              <v-icon
                size="16"
                class="mr-2"
              >
                mdi-credit-card-plus
              </v-icon>
              Change Method
            </button>
          </div>

          <div class="current-payment-method">
            <div class="payment-card">
              <div class="payment-icon">
                <v-icon
                  color="#0C9C8D"
                  size="24"
                >
                  mdi-credit-card
                </v-icon>
              </div>
              <div class="payment-info">
                <h4 class="payment-title">
                  {{ currentPaymentMethod.name }}
                </h4>
                <p class="payment-detail">
                  Expires {{ currentPaymentMethod.expiry }}
                </p>
              </div>
              <div class="payment-status">
                <v-chip
                  color="success"
                  size="small"
                  variant="flat"
                >
                  Active
                </v-chip>
              </div>
            </div>
          </div>
        </div>

        <!-- Subscription Plans Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Choose Your Plan
          </h3>
          <p class="section-description mb-8">
            Select the plan that best fits your needs. You can change or cancel anytime.
          </p>
          
          <div class="plans-grid">
            <!-- Monthly Plan -->
            <div 
              class="plan-card"
              :class="{ 'plan-selected': selectedPlan === 'monthly' }"
              @click="selectedPlan = 'monthly'"
            >
              <div class="plan-badge popular">
                Popular Choice
              </div>
              
              <div class="plan-content">
                <div class="plan-icon monthly">
                  <v-icon
                    color="white"
                    size="32"
                  >
                    mdi-rocket-launch
                  </v-icon>
                </div>
                
                <h4 class="plan-name">
                  Monthly Plan
                </h4>
                <p class="plan-subtitle">
                  Perfect for getting started
                </p>
                
                <div class="plan-price">
                  <span class="currency">$</span>
                  <span class="amount">15</span>
                  <span class="period">/month</span>
                </div>
                
                <div class="plan-features">
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Unlimited projects</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Full access to features</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Priority support</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Regular updates</span>
                  </div>
                </div>
                
                <button 
                  class="btn plan-btn"
                  :class="selectedPlan === 'monthly' ? 'btn-primary' : 'btn-outline'"
                >
                  Start Monthly Plan
                </button>
              </div>
            </div>
            
            <!-- 6-Month Plan -->
            <div 
              class="plan-card"
              :class="{ 'plan-selected': selectedPlan === 'biannual' }"
              @click="selectedPlan = 'biannual'"
            >
              <div class="plan-badge savings">
                Save 33%
              </div>
              
              <div class="plan-content">
                <div class="plan-icon biannual">
                  <v-icon
                    color="white"
                    size="32"
                  >
                    mdi-diamond-stone
                  </v-icon>
                </div>
                
                <h4 class="plan-name">
                  6-Month Plan
                </h4>
                <p class="plan-subtitle">
                  Best value for professionals
                </p>
                
                <div class="plan-price">
                  <span class="currency">$</span>
                  <span class="amount">60</span>
                  <span class="period">/6 months</span>
                </div>
                
                <div class="plan-features">
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Everything in Monthly</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Advanced analytics</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Custom integrations</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Dedicated support team</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="#10b981"
                      size="16"
                    >
                      mdi-check
                    </v-icon>
                    <span>Early access to features</span>
                  </div>
                </div>
                
                <button 
                  class="btn plan-btn"
                  :class="selectedPlan === 'biannual' ? 'btn-success' : 'btn-outline-success'"
                >
                  Start 6-Month Plan
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Billing History Section -->
        <div class="content-card mb-8">
          <h3 class="section-title mb-6">
            Billing History
          </h3>
          
          <div class="billing-table-container">
            <div class="billing-table">
              <div class="table-header">
                <div class="table-cell">
                  Date
                </div>
                <div class="table-cell">
                  Description
                </div>
                <div class="table-cell">
                  Amount
                </div>
                <div class="table-cell">
                  Status
                </div>
                <div class="table-cell">
                  Invoice
                </div>
              </div>
              
              <div class="table-row">
                <div class="table-cell">
                  Aug 1, 2023
                </div>
                <div class="table-cell">
                  6-Month Subscription
                </div>
                <div class="table-cell font-weight-600">
                  $60.00
                </div>
                <div class="table-cell">
                  <v-chip
                    color="success"
                    size="small"
                    variant="flat"
                    class="status-chip"
                  >
                    Paid
                  </v-chip>
                </div>
                <div class="table-cell">
                  <button class="btn btn-text">
                    <v-icon
                      size="16"
                      class="mr-2"
                    >
                      mdi-download
                    </v-icon>
                    Download
                  </button>
                </div>
              </div>
              
              <div class="table-row">
                <div class="table-cell">
                  Jul 1, 2023
                </div>
                <div class="table-cell">
                  Monthly Subscription
                </div>
                <div class="table-cell font-weight-600">
                  $15.00
                </div>
                <div class="table-cell">
                  <v-chip
                    color="success"
                    size="small"
                    variant="flat"
                    class="status-chip"
                  >
                    Paid
                  </v-chip>
                </div>
                <div class="table-cell">
                  <button class="btn btn-text">
                    <v-icon
                      size="16"
                      class="mr-2"
                    >
                      mdi-download
                    </v-icon>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Manage Subscription Section -->
        <div class="content-card">
          <h3 class="section-title mb-6">
            Manage Subscription
          </h3>
          
          <div class="manage-subscription">
            <div class="manage-info">
              <h4 class="manage-title">
                Cancel or Pause Subscription
              </h4>
              <p class="manage-description">
                By canceling your subscription, you will lose access to premium features after your current billing period ends.
              </p>
            </div>
            
            <div class="manage-actions">
              <button class="btn btn-secondary mr-3">
                <v-icon
                  size="16"
                  class="mr-2"
                >
                  mdi-pause
                </v-icon>
                Pause Subscription
              </button>
              <button 
                class="btn btn-danger"
                @click="confirmCancelSubscription"
              >
                <v-icon
                  size="16"
                  class="mr-2"
                >
                  mdi-cancel
                </v-icon>
                Cancel Subscription
              </button>
            </div>
          </div>
          
          <div class="manage-note">
            <v-icon
              color="#f59e0b"
              size="20"
              class="mr-3"
            >
              mdi-information
            </v-icon>
            <span>Your data will be securely stored for 30 days after cancellation.</span>
          </div>
        </div>

        <!-- Payment Method Dialog -->
        <v-dialog
          v-model="showPaymentDialog"
          max-width="600"
          persistent
        >
          <v-card class="payment-dialog">
            <div class="dialog-header">
              <h3 class="dialog-title">
                Change Payment Method
              </h3>
              <button
                class="btn-close"
                @click="showPaymentDialog = false"
              >
                <v-icon size="20">
                  mdi-close
                </v-icon>
              </button>
            </div>

            <div class="dialog-content">
              <div class="payment-options">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="payment-option"
                  :class="{ 'selected': selectedPaymentMethod === method.id }"
                  @click="selectedPaymentMethod = method.id"
                >
                  <div class="option-content">
                    <div class="option-icon">
                      <v-icon
                        size="24"
                        :color="selectedPaymentMethod === method.id ? '#0C9C8D' : '#6b7280'"
                      >
                        {{ method.icon }}
                      </v-icon>
                    </div>
                    <span class="option-name">{{ method.name }}</span>
                  </div>
                  <div class="option-radio">
                    <div
                      class="radio-button"
                      :class="{ 'active': selectedPaymentMethod === method.id }"
                    >
                      <div class="radio-dot" />
                    </div>
                  </div>
                </div>
              </div>

              <div
                v-if="selectedPaymentMethod === 'card'"
                class="card-form"
              >
                <div class="form-group">
                  <label class="form-label">Card Number</label>
                  <v-text-field
                    v-model="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Expiry Date</label>
                    <v-text-field
                      v-model="cardExpiry"
                      placeholder="MM/YY"
                      variant="outlined"
                      hide-details
                      class="modern-input"
                      density="comfortable"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">CVV</label>
                    <v-text-field
                      v-model="cardCvv"
                      placeholder="123"
                      type="password"
                      variant="outlined"
                      hide-details
                      class="modern-input"
                      density="comfortable"
                    />
                  </div>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Name on Card</label>
                  <v-text-field
                    v-model="cardName"
                    placeholder="John Doe"
                    variant="outlined"
                    hide-details
                    class="modern-input"
                    density="comfortable"
                  />
                </div>
              </div>
            </div>

            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="showPaymentDialog = false"
              >
                Cancel
              </button>
              <button 
                class="btn btn-primary"
                :disabled="updating"
                @click="updatePaymentMethod"
              >
                <span v-if="updating">Updating...</span>
                <span v-else>Update Payment Method</span>
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Cancel Confirmation Dialog -->
        <v-dialog
          v-model="cancelDialog"
          max-width="500"
          persistent
        >
          <v-card class="cancel-dialog">
            <div class="dialog-header">
              <div class="cancel-icon">
                <v-icon
                  color="white"
                  size="24"
                >
                  mdi-alert-circle
                </v-icon>
              </div>
              <h3 class="dialog-title">
                Cancel Subscription?
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="cancel-message">
                Are you sure you want to cancel your subscription? You will:
              </p>
              <ul class="cancel-impacts">
                <li>Lose access to premium features after current billing period</li>
                <li>Keep access to your data for 30 days after cancellation</li>
                <li>Be able to reactivate your subscription at any time</li>
              </ul>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="cancelDialog = false"
              >
                Keep Subscription
              </button>
              <button
                class="btn btn-danger"
                @click="showCancelReasonDialog"
              >
                Continue Cancellation
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Cancel Reason Dialog -->
        <v-dialog
          v-model="cancelReasonDialog"
          max-width="500"
          persistent
        >
          <v-card class="reason-dialog">
            <div class="dialog-header">
              <h3 class="dialog-title">
                Help Us Improve
              </h3>
            </div>
            
            <div class="dialog-content">
              <p class="reason-message">
                What's the main reason for canceling your subscription?
              </p>
              <div class="reason-options">
                <div
                  v-for="(reason, index) in cancellationReasons"
                  :key="index"
                  class="reason-option"
                  :class="{ 'selected': cancellationReason === reason }"
                  @click="cancellationReason = reason"
                >
                  <div class="reason-radio">
                    <div
                      class="radio-button"
                      :class="{ 'active': cancellationReason === reason }"
                    >
                      <div class="radio-dot" />
                    </div>
                  </div>
                  <span class="reason-text">{{ reason }}</span>
                </div>
              </div>
            </div>
            
            <div class="dialog-actions">
              <button
                class="btn btn-secondary mr-3"
                @click="cancelReasonDialog = false"
              >
                Back
              </button>
              <button 
                class="btn btn-danger"
                :disabled="!cancellationReason"
                @click="finalizeCancel"
              >
                Confirm Cancellation
              </button>
            </div>
          </v-card>
        </v-dialog>
        
        <!-- Success Notification -->
        <div
          v-if="cancellationSuccessful"
          class="success-notification"
        >
          <div class="d-flex align-center">
            <div class="success-icon mr-3">
              ✓
            </div>
            <span>Your subscription has been successfully canceled.</span>
            <button
              class="close-btn ml-auto"
              @click="cancellationSuccessful = false"
            >
              ×
            </button>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue'

// Setup router
const router = useRouter()

// States
const sidebarExpanded = ref(true)
const selectedPlan = ref('monthly')
const showPaymentDialog = ref(false)
const selectedPaymentMethod = ref('card')
const updating = ref(false)
const cancelDialog = ref(false)
const cancelReasonDialog = ref(false)
const cancellationSuccessful = ref(false)
const cancellationReason = ref('')

// Form data
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const cardName = ref('')

// Data
const currentPaymentMethod = ref({
  name: 'Visa ending in 4242',
  expiry: '12/25'
})

const paymentMethods = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: 'mdi-credit-card'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'mdi-paypal'
  },
  {
    id: 'revolut',
    name: 'Revolut',
    icon: 'mdi-bank'
  }
]

const cancellationReasons = [
  'I no longer need the service for my freelancing work.',
  'I\'m not using the platform as much as I expected.',
  'The features don\'t meet my expectations.',
  'I\'m taking a break from freelancing.',
  'I experienced technical issues or bugs.'
]

// Methods
const openPaymentDialog = () => {
  showPaymentDialog.value = true
  selectedPaymentMethod.value = 'card'
  cardNumber.value = ''
  cardExpiry.value = ''
  cardCvv.value = ''
  cardName.value = ''
}

const updatePaymentMethod = async () => {
  if (selectedPaymentMethod.value === 'card') {
    if (!cardNumber.value || !cardExpiry.value || !cardCvv.value || !cardName.value) {
      return
    }
  }

  updating.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    currentPaymentMethod.value = {
      name: selectedPaymentMethod.value === 'card' 
        ? `Card ending in ${cardNumber.value.slice(-4)}` 
        : paymentMethods.find(m => m.id === selectedPaymentMethod.value).name,
      expiry: cardExpiry.value || 'N/A'
    }

    showPaymentDialog.value = false
  } catch (error) {
    console.error('Error updating payment method:', error)
  } finally {
    updating.value = false
  }
}

const confirmCancelSubscription = () => {
  cancelDialog.value = true
}

const showCancelReasonDialog = () => {
  cancelDialog.value = false
  cancelReasonDialog.value = true
}

const finalizeCancel = async () => {
  try {
    // Simulate cancellation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Canceling subscription with reason:', cancellationReason.value)
    
    cancelReasonDialog.value = false
    cancellationSuccessful.value = true
    
    setTimeout(() => {
      router.push({ name: 'Home' })
    }, 2000)
  } catch (error) {
    console.error('Error canceling subscription:', error)
  }
}
</script>

<style scoped>

/* Layout - Centered content with equal margins */
.ml-60 { 
  margin-left: 50px !important; /* sidebar width (240px) + 30px margin */
  margin-right: 30px !important; 
}
.ml-14 { 
  margin-left: 102px !important; /* collapsed sidebar width (72px) + 30px margin */
  margin-right: 30px !important; 
}
.transition-all { transition: all 0.3s ease; }

.container-full-width { 
  max-width: 1000px !important;
  margin: 0 auto !important;
  width: 90%;
  padding-left: 30px !important;
  padding-right: 30px !important;
}


/* Container adjustments */
.container-full-width {
  max-width: none !important;
  width: 100%;
  padding-left: 24px !important;
  padding-right: 24px !important;
}

/* Left Menu Override */
:deep(.left-menu-fixed) {
  background: linear-gradient(180deg, #064E47 0%, #0a5751 100%) !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  width: 72px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.left-menu-fixed.expanded) {
  width: 240px !important;
}

/* Content width optimization */
.content-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  max-width: none;
  width: 100%;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.section-description {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Subscription Header */
.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.subscription-info {
  flex: 1;
}

.plan-badge-current {
  background: linear-gradient(135deg, #0C9C8D, #0a8a7e);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  width: fit-content;
}

.subscription-description {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-amount {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.price-period {
  font-size: 16px;
  color: #6b7280;
}

.price-note {
  font-size: 14px;
  color: #9ca3af;
  margin-left: 8px;
}

.trial-status {
  width: 200px;
}

.trial-indicator {
  text-align: right;
}

.trial-progress {
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.trial-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #0C9C8D, #10b981);
  transition: width 0.3s ease;
}

.trial-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.subscription-note {
  background: #f0fdfa;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #065f46;
}

/* Payment Methods */
.current-payment-method {
  max-width: 400px;
}

.payment-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.payment-icon {
  width: 48px;
  height: 48px;
  background: rgba(12, 156, 141, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-info {
  flex: 1;
}

.payment-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
}

.payment-detail {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Plans Grid */
.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 1024px) {
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

.plan-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 20px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.plan-selected {
  border-color: #0C9C8D;
  box-shadow: 0 0 0 1px #0C9C8D;
}

.plan-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  z-index: 1;
}

.plan-badge.popular {
  background: #0C9C8D;
}

.plan-badge.savings {
  background: #10b981;
}

.plan-content {
  padding: 32px 24px 24px;
  text-align: center;
}

.plan-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.plan-icon.monthly {
  background: linear-gradient(135deg, #0C9C8D, #0a8a7e);
}

.plan-icon.biannual {
  background: linear-gradient(135deg, #10b981, #059669);
}

.plan-name {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.plan-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
  margin-bottom: 32px;
}

.plan-price .currency {
  font-size: 20px;
  color: #6b7280;
}

.plan-price .amount {
  font-size: 48px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.plan-price .period {
  font-size: 16px;
  color: #6b7280;
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  text-align: left;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #4b5563;
}

.plan-btn {
  width: 100%;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 600;
}

/* Billing Table */
.billing-table-container {
  overflow-x: auto;
}

.billing-table {
  width: 100%;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  background: #f8fafc;
  border-bottom: 1px solid #f3f4f6;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr;
  border-bottom: 1px solid #f3f4f6;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.table-header .table-cell {
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.5px;
}

.table-row .table-cell {
  color: #4b5563;
}

.status-chip {
  min-width: 60px;
  text-align: center;
}

/* Manage Subscription */
.manage-subscription {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.manage-info {
  flex: 1;
  margin-right: 32px;
}

.manage-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.manage-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.manage-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.manage-note {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #92400e;
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-primary {
  background: #0C9C8D;
  color: white;
}

.btn-primary:hover {
  background: #0a8a7e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(12, 156, 141, 0.3);
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.btn-outline {
  background: transparent;
  color: #0C9C8D;
  border: 1px solid #0C9C8D;
}

.btn-outline:hover {
  background: #0C9C8D;
  color: white;
}

.btn-outline-success {
  background: transparent;
  color: #10b981;
  border: 1px solid #10b981;
}

.btn-outline-success:hover {
  background: #10b981;
  color: white;
}

.btn-text {
  background: transparent;
  color: #0C9C8D;
  padding: 8px 12px;
}

.btn-text:hover {
  background: rgba(12, 156, 141, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

.btn-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Dialog Styles */
.payment-dialog,
.cancel-dialog,
.reason-dialog {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
  margin-bottom: 24px;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.dialog-content {
  padding: 0 24px;
  margin-bottom: 24px;
}

.dialog-actions {
  padding: 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Payment Options */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.payment-option {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.05);
}

.payment-option.selected {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.05);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.option-icon {
  width: 40px;
  height: 40px;
  background: #f8fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.option-name {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.radio-button.active {
  border-color: #0C9C8D;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #0C9C8D;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.radio-button.active .radio-dot {
  opacity: 1;
}

/* Card Form */
.card-form {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  display: block;
}

.modern-input :deep(.v-field) {
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background: white;
  font-size: 15px;
}

.modern-input :deep(.v-field--focused) {
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

.modern-input :deep(.v-field:hover) {
  border-color: #9ca3af;
}

.modern-input :deep(.v-field__input) {
  padding: 12px 16px;
  min-height: 48px;
}

/* Cancel Dialog Specific */
.cancel-dialog .dialog-header {
  align-items: flex-start;
  gap: 16px;
}

.cancel-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cancel-message {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 16px 0;
}

.cancel-impacts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cancel-impacts li {
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
  color: #6b7280;
  font-size: 14px;
}

.cancel-impacts li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #ef4444;
  font-weight: bold;
}

/* Reason Dialog */
.reason-message {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 20px 0;
}

.reason-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reason-option {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  transition: all 0.2s ease;
}

.reason-option:hover {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.05);
}

.reason-option.selected {
  border-color: #0C9C8D;
  background: rgba(12, 156, 141, 0.05);
}

.reason-radio {
  margin-top: 2px;
}

.reason-text {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
}

/* Success Notification */
.success-notification {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #10b981;
  color: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.success-icon {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Utilities */
.d-flex { display: flex; }
.align-center { align-items: center; }
.justify-space-between { justify-content: space-between; }
.ml-auto { margin-left: auto; }
.mr-2 { margin-right: 8px; }
.mr-3 { margin-right: 12px; }
.font-weight-600 { font-weight: 600; }

/* Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-expanded, .main-collapsed {
    margin-left: 0 !important;
    padding-left: 16px !important;
  }
  
  .container-full-width {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
  
  .content-card {
    padding: 24px 20px;
    border-radius: 12px;
  }
  
  .subscription-header {
    flex-direction: column;
    gap: 24px;
  }
  
  .trial-status {
    width: 100%;
  }
  
  .trial-indicator {
    text-align: left;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .manage-subscription {
    flex-direction: column;
    gap: 20px;
  }
  
  .manage-info {
    margin-right: 0;
  }
  
  .manage-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-cell {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .table-header .table-cell {
    display: none;
  }
  
  .table-row .table-cell::before {
    content: attr(data-label);
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
  }
  
  .dialog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 20px 16px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .plan-btn {
    padding: 14px 20px;
    font-size: 15px;
  }
  
  .success-notification {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}
</style>