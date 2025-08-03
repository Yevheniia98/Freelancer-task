<template>
  <div class="subscription-container">
    <!-- Header -->
    <div class="header">
      <div class="logo-container">
        <div class="logo">
          FT
        </div>
        <span class="company-name">Freelancer Tasks</span>
      </div>
      <p class="subtitle">
        Choose the perfect plan for your freelance journey
      </p>
    </div>

    <!-- Main Card -->
    <div class="main-card">
      <!-- Left Section -->
      <div class="left-section">
        <!-- User Info -->
        <div class="user-info">
          <div class="avatar">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <span class="user-email">test@example.com</span>
        </div>

        <!-- Plan Selection -->
        <div class="section">
          <h3 class="section-title">
            Choose Your Plan
          </h3>
          <div class="plan-grid">
            <div 
              v-for="plan in plans" 
              :key="plan.id"
              class="plan-card"
              :class="{ 'selected': selectedPlan === plan.id }"
              @click="selectPlan(plan.id)"
            >
              <div class="plan-header">
                <div
                  class="radio-button"
                  :class="{ 'active': selectedPlan === plan.id }"
                >
                  <div
                    v-if="selectedPlan === plan.id"
                    class="radio-dot"
                  />
                </div>
                <div class="plan-info">
                  <h4 class="plan-name">
                    {{ plan.name }}
                  </h4>
                  <div class="plan-price">
                    <span class="currency">€</span>
                    <span class="amount">{{ plan.price }}</span>
                    <span class="period">/month</span>
                  </div>
                </div>
              </div>
              <div
                v-if="plan.popular"
                class="plan-badge"
              >
                Most Popular
              </div>
            </div>
          </div>
        </div>

        <!-- Storage Add-on -->
        <div class="section">
          <h3 class="section-title">
            Additional Storage
          </h3>
          <div class="storage-card">
            <div class="storage-header">
              <span class="storage-label">Storage</span>
              <span class="storage-price">{{ storageSize }}GB - €{{ storagePrice }}</span>
            </div>
            <div class="storage-slider">
              <input
                v-model="storageSize"
                type="range"
                min="0"
                max="100"
                step="1"
                class="slider"
                @input="updateStoragePrice"
              >
              <div class="slider-labels">
                <span>0GB</span>
                <span>100GB</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="section">
          <h3 class="section-title">
            Order Summary
          </h3>
          <div class="summary-card">
            <div class="summary-item">
              <span>{{ selectedPlanData.name }}</span>
              <span>€{{ selectedPlanData.price }}/month</span>
            </div>
            <div
              v-if="storageSize > 0"
              class="summary-item"
            >
              <span>{{ storageSize }}GB Storage</span>
              <span>€{{ storagePrice }}/month</span>
            </div>
            <div class="summary-divider" />
            <div class="summary-total">
              <span>Total</span>
              <span>€{{ totalPrice }}/month</span>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="section">
          <h3 class="section-title">
            Payment Method
          </h3>
          <div class="payment-methods">
            <div class="card-input-group">
              <input
                v-model="cardNumber"
                type="text"
                class="payment-input"
                placeholder="Card number"
              >
              <div class="input-row">
                <input
                  v-model="expiryDate"
                  type="text"
                  class="payment-input"
                  placeholder="MM/YY"
                >
                <input
                  v-model="cvv"
                  type="text"
                  class="payment-input"
                  placeholder="CVV"
                >
              </div>
            </div>
            
            <div class="divider">
              <span>or</span>
            </div>

            <div class="payment-buttons">
              <button class="payment-btn stripe-btn">
                <span>Pay with Stripe</span>
              </button>
              <button class="payment-btn paypal-btn">
                <span>Pay with PayPal</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Upgrade Button -->
        <button
          class="upgrade-btn"
          @click="handleUpgrade"
        >
          <span>Subscribe Now</span>
          <svg
            class="btn-icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="features-card">
          <h3 class="features-title">
            {{ selectedPlanData.name }} Features
          </h3>
          
          <div class="features-list">
            <div 
              v-for="(feature, index) in selectedPlanData.features" 
              :key="index"
              class="feature-item"
            >
              <svg
                class="feature-icon"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ feature }}</span>
            </div>
          </div>

          <div class="security-section">
            <h4 class="security-title">
              Secure Payment
            </h4>
            <p class="security-text">
              We accept all major payment methods
            </p>
            <div class="payment-logos">
              <div class="payment-logo visa">
                VISA
              </div>
              <div class="payment-logo mastercard">
                MC
              </div>
              <div class="payment-logo stripe">
                Stripe
              </div>
              <div class="payment-logo paypal">
                PayPal
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'SubscriptionPage',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const selectedPlan = ref(1)
    const storageSize = ref(0)
    const cardNumber = ref('')
    const expiryDate = ref('')
    const cvv = ref('')
    
    // Plans data
    const plans = [
      {
        id: 1,
        name: 'Basic Plan',
        price: 20,
        popular: false,
        features: [
          'Project Management (Max 5 active projects)',
          'Basic Task Management',
          'Client Management',
          'Income & Expense Tracking',
          'Limited Tools Access',
          'Time Tracking (150 hours/month)',
          'Platform Integration (3 platforms)',
          'Tax Calculator',
          'Meeting Reminders',
          'Basic Collaboration (1 member)'
        ]
      },
      {
        id: 2,
        name: 'Business Plan',
        price: 85,
        popular: true,
        features: [
          'Unlimited Project Management',
          'Advanced Task Management',
          'Client Management',
          'Income & Expense Tracking',
          'All Tools Available',
          'Unlimited Time Tracking',
          'Gantt Chart Timeline',
          'Unlimited Platform Integration',
          'Tax Calculator',
          'Meeting Reminders',
          'Team Collaboration (3 users)',
          'Priority Support'
        ]
      }
    ]
    
    // Computed properties
    const selectedPlanData = computed(() => {
      return plans.find(plan => plan.id === selectedPlan.value) || plans[0]
    })
    
    const storagePrice = computed(() => {
      return (storageSize.value * 0.1).toFixed(2)
    })
    
    const totalPrice = computed(() => {
      return (selectedPlanData.value.price + parseFloat(storagePrice.value)).toFixed(2)
    })
    
    // Methods
    const selectPlan = (planId) => {
      selectedPlan.value = planId
    }
    
    const updateStoragePrice = () => {
      // This is handled by the computed property
    }
    
    const handleUpgrade = () => {
      // Add your upgrade logic here
      console.log('Upgrading to:', selectedPlanData.value.name)
      console.log('Total price:', totalPrice.value)
      
      // Navigate to dashboard or success page
      router.push('/dashboard')
    }
    
    return {
      selectedPlan,
      storageSize,
      cardNumber,
      expiryDate,
      cvv,
      plans,
      selectedPlanData,
      storagePrice,
      totalPrice,
      selectPlan,
      updateStoragePrice,
      handleUpgrade
    }
  }
}
</script>

<style scoped>
.subscription-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #2D3748 0%, #1A202C 100%);
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4A5568, #2D3748);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  border: 2px solid #0C9C8D;
}

.company-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.025em;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 400;
}

.main-card {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 400px;
  min-height: 600px;
}

.left-section {
  padding: 3rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #F7FAFC, #EDF2F7);
  border-radius: 16px;
  border: 1px solid #E2E8F0;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4A5568, #2D3748);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 2px solid #0C9C8D;
}

.user-email {
  font-weight: 500;
  color: #334155;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.plan-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.plan-card {
  position: relative;
  border: 2px solid #E2E8F0;
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #FFFFFF, #F7FAFC);
}

.plan-card:hover {
  border-color: #718096;
  box-shadow: 0 4px 20px rgba(113, 128, 150, 0.15);
  transform: translateY(-2px);
}

.plan-card.selected {
  border-color: #0C9C8D;
  background: linear-gradient(135deg, #F0FDF4, #ECFDF5);
  box-shadow: 0 4px 20px rgba(12, 156, 141, 0.15);
}

.plan-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.radio-button {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-top: 0.125rem;
}

.radio-button.active {
  border-color: #0c9c8d;
}

.radio-dot {
  width: 8px;
  height: 8px;
  background: #0c9c8d;
  border-radius: 50%;
}

.plan-info {
  flex: 1;
}

.plan-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.currency {
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
}

.amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
}

.period {
  font-size: 0.875rem;
  color: #64748b;
}

.plan-badge {
  position: absolute;
  top: -8px;
  right: 1rem;
  background: linear-gradient(135deg, #0C9C8D, #068A7B);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(12, 156, 141, 0.3);
}

.storage-card {
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #F7FAFC, #EDF2F7);
}

.storage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.storage-label {
  font-weight: 500;
  color: #334155;
}

.storage-price {
  font-weight: 600;
  color: #4A5568;
}

.storage-slider {
  position: relative;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  outline: none;
  appearance: none;
  margin-bottom: 0.5rem;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0C9C8D, #068A7B);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(12, 156, 141, 0.4);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0C9C8D, #068A7B);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(12, 156, 141, 0.4);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #64748b;
}

.summary-card {
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #F7FAFC, #EDF2F7);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #334155;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.125rem;
  color: #1e293b;
}

.payment-methods {
  space-y: 1rem;
}

.card-input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.payment-input:focus {
  outline: none;
  border-color: #0C9C8D;
  box-shadow: 0 0 0 3px rgba(12, 156, 141, 0.1);
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  padding: 0 1rem;
  color: #64748b;
  font-size: 0.875rem;
}

.payment-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.stripe-btn {
  background: linear-gradient(135deg, #FFFFFF, #F7FAFC);
  color: #4A5568;
  border-color: #CBD5E0;
}

.stripe-btn:hover {
  background: linear-gradient(135deg, #EDF2F7, #E2E8F0);
  border-color: #A0AEC0;
}

.paypal-btn {
  background: linear-gradient(135deg, #FFC439, #F6AD55);
  color: #2D3748;
  border-color: #FFC439;
}

.paypal-btn:hover {
  background: linear-gradient(135deg, #FFB700, #ED8936);
}

.upgrade-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #0C9C8D, #068A7B);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(12, 156, 141, 0.3);
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(12, 156, 141, 0.4);
  background: linear-gradient(135deg, #0D8B7A, #065D56);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.right-section {
  background: linear-gradient(135deg, #F7FAFC, #EDF2F7);
  padding: 3rem 2rem;
  border-left: 1px solid #E2E8F0;
}

.features-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.features-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 1.5rem;
  text-align: center;
}

.features-list {
  flex: 1;
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.feature-icon {
  width: 16px;
  height: 16px;
  color: #0C9C8D;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.feature-item span {
  font-size: 0.875rem;
  color: #4A5568;
  line-height: 1.5;
}

.security-section {
  border-top: 1px solid #e2e8f0;
  padding-top: 2rem;
  text-align: center;
}

.security-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 0.5rem;
}

.security-text {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.payment-logos {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.payment-logo {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4A5568;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-card {
    grid-template-columns: 1fr;
  }
  
  .right-section {
    border-left: none;
    border-top: 1px solid #e2e8f0;
  }
  
  .plan-grid {
    grid-template-columns: 1fr;
  }
  
  .left-section,
  .right-section {
    padding: 2rem 1.5rem;
  }
}
</style>