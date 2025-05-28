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
    >
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Current Subscription Section -->
        <div class="mb-10">
          <h1 class="text-h4 font-weight-bold mb-6">
            Current subscription
          </h1>
          
          <div class="mb-8">
            <div class="text-h6 font-weight-bold mb-1">
              Starter
            </div>
            <div class="text-subtitle-1">
              Free trial 7-days
            </div>
          </div>
          
          <div class="mb-4">
            <div class="d-flex align-center mb-1">
              <div class="text-h6 font-weight-bold">
                Monthly subscription
              </div>
              <div class="text-h6 font-weight-bold ml-2">
                15$
              </div>
            </div>
            <div class="pol text-body-1">
              You're on free trial that ends on October 28. You can manage your payment methods, upgrade plans or cancel your subscription.
            </div>
          </div>
        </div>
        
        <!-- Payment Methods Section -->
        <div class="mb-10">
          <h2 class="text-h5 font-weight-bold mb-6">
            Payment methods
          </h2>
          
          <v-card class="payment-methods-card pa-6">
            <div class="d-flex justify-space-between align-center mb-6">
              <div class="text-body-1 font-weight-medium">
                Current payment method
              </div>
              <v-btn
                color="primary"
                variant="outlined"
                rounded="lg"
                class="px-6"
                @click="openPaymentDialog"
              >
                Change payment method
              </v-btn>
            </div>

            <div class="current-payment-method d-flex align-center pa-4 rounded-lg">
              <v-img
                :src="currentPaymentMethod.image"
                width="40"
                height="40"
                class="mr-4"
              />
              <div>
                <div class="text-subtitle-1 font-weight-medium">
                  {{ currentPaymentMethod.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Expires {{ currentPaymentMethod.expiry }}
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Payment Method Dialog -->
        <v-dialog
          v-model="showPaymentDialog"
          max-width="600"
          persistent
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold mb-6">
              Change Payment Method
            </v-card-title>

            <v-card-text>
              <div class="payment-options mb-6">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="payment-option mb-4"
                  :class="{ 'selected': selectedPaymentMethod === method.id }"
                  @click="selectedPaymentMethod = method.id"
                >
                  <div class="d-flex align-center">
                    <v-img
                      :src="method.image"
                      width="40"
                      height="40"
                      class="mr-4"
                    />
                    <div class="text-subtitle-1">
                      {{ method.name }}
                    </div>
                  </div>
                  <v-radio
                    v-model="selectedPaymentMethod"
                    :value="method.id"
                    color="primary"
                    hide-details
                  />
                </div>
              </div>

              <v-expand-transition>
                <div v-if="selectedPaymentMethod === 'card'">
                  <v-text-field
                    v-model="cardNumber"
                    label="Card number"
                    variant="outlined"
                    placeholder="1234 5678 9012 3456"
                    class="mb-4"
                    :rules="[rules.required, rules.cardNumber]"
                  />
                  <div class="d-flex gap-4 mb-4">
                    <v-text-field
                      v-model="cardExpiry"
                      label="MM/YY"
                      variant="outlined"
                      placeholder="MM/YY"
                      class="flex-grow-0"
                      style="width: 100px;"
                      :rules="[rules.required, rules.expiry]"
                    />
                    <v-text-field
                      v-model="cardCvv"
                      label="CVV"
                      variant="outlined"
                      placeholder="123"
                      type="password"
                      class="flex-grow-0"
                      style="width: 100px;"
                      :rules="[rules.required, rules.cvv]"
                    />
                  </div>
                  <v-text-field
                    v-model="cardName"
                    label="Name on card"
                    variant="outlined"
                    placeholder="John Doe"
                    :rules="[rules.required]"
                  />
                </div>
              </v-expand-transition>
            </v-card-text>

            <v-card-actions class="pt-4">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="showPaymentDialog = false"
              >
                Cancel
              </v-btn>
              <v-btn
                color="primary"
                :loading="updating"
                @click="updatePaymentMethod"
              >
                Update Payment Method
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <!-- Subscription Plans Section -->
        <div class="mb-10">
          <h2 class="text-h5 font-weight-bold mb-6">
            Choose Your Plan
          </h2>
          
          <div class="ws d-flex gap-4 justify-center">
            <v-card
              width="400"
              elevation="0"
              class="plan-card"
              :class="{ 'plan-card-selected': selectedPlan === 'monthly' }"
              @click="selectedPlan = 'monthly'"
            >
              <div class="plan-badge">
                Popular Choice
              </div>
              
              <v-card-item class="ws">
                <div class="d-flex flex-column align-center text-center">
                  <v-icon
                    size="64"
                    color="primary"
                    class="mb-4"
                  >
                    mdi-rocket-launch
                  </v-icon>
                  <div class="text-h5 font-weight-bold mb-2">
                    Monthly plan
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Perfect for getting started
                  </div>
                  
                  <div class="mt-6 price-display">
                    <span class="currency">$</span>
                    <span class="amount">15</span>
                    <span class="period">/month</span>
                  </div>
                </div>
              </v-card-item>
              
              <v-divider class="my-4" />
              
              <v-card-text>
                <div class="features-list">
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-folder-multiple
                    </v-icon>
                    <span>Unlimited projects</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-shield-check
                    </v-icon>
                    <span>Full access to features</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-headphones
                    </v-icon>
                    <span>Priority support</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-update
                    </v-icon>
                    <span>Regular updates</span>
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions class="pa-6">
                <v-btn
                  color="primary"
                  block
                  rounded="lg"
                  height="48"
                  :variant="selectedPlan === 'monthly' ? 'flat' : 'outlined'"
                >
                  Start Monthly Plan
                </v-btn>
              </v-card-actions>
            </v-card>
            
            <v-card
              width="400"
              elevation="0"
              class="plan-card"
              :class="{ 'plan-card-selected': selectedPlan === 'biannual' }"
              @click="selectedPlan = 'biannual'"
            >
              <div class="plan-badge bg-success">
                Save 33%
              </div>
              
              <v-card-item>
                <div class="d-flex flex-column align-center text-center">
                  <v-icon
                    size="64"
                    color="success"
                    class="mb-4"
                  >
                    mdi-diamond-stone
                  </v-icon>
                  <div class="text-h5 font-weight-bold mb-2">
                    6-Months plan
                  </div>
                  <div class="text-body-2 text-medium-emphasis">
                    Best value for professionals
                  </div>
                  
                  <div class="mt-6 price-display">
                    <span class="currency">$</span>
                    <span class="amount">60</span>
                    <span class="period">/6 months</span>
                  </div>
                </div>
              </v-card-item>
              
              <v-divider class="my-4" />
              
              <v-card-text>
                <div class="features-list">
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-check-decagram
                    </v-icon>
                    <span>Everything in Monthly</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-chart-bell-curve
                    </v-icon>
                    <span>Advanced analytics</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-puzzle
                    </v-icon>
                    <span>Custom integrations</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-account-group
                    </v-icon>
                    <span>Dedicated support team</span>
                  </div>
                  <div class="feature-item">
                    <v-icon
                      color="success"
                      size="20"
                    >
                      mdi-star
                    </v-icon>
                    <span>Early access to features</span>
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions class="pa-6">
                <v-btn
                  color="success"
                  block
                  rounded="lg"
                  height="48"
                  :variant="selectedPlan === 'biannual' ? 'flat' : 'outlined'"
                >
                  Start 6-Month Plan
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
        
        <!-- Billing History Section -->
        <div class="billing-history-container mt-12">
          <h2 class="text-h5 font-weight-bold mb-6">
            Billing History
          </h2>

          <v-card
            elevation="0"
            class="billing-table"
          >
            <v-table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aug 1, 2023</td>
                  <td>6-Month Subscription</td>
                  <td>$60.00</td>
                  <td>
                    <v-chip
                      color="success"
                      size="small"
                      variant="flat"
                      class="status-chip"
                    >
                      Paid
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      variant="text"
                      density="comfortable"
                      color="primary"
                      prepend-icon="mdi-download"
                      class="download-btn"
                    >
                      Download
                    </v-btn>
                  </td>
                </tr>
                <tr>
                  <td>Jul 1, 2023</td>
                  <td>Monthly Subscription</td>
                  <td>$15.00</td>
                  <td>
                    <v-chip
                      color="success"
                      size="small"
                      variant="flat"
                      class="status-chip"
                    >
                      Paid
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      variant="text"
                      density="comfortable"
                      color="primary"
                      prepend-icon="mdi-download"
                      class="download-btn"
                    >
                      Download
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </div>
        
        <!-- Cancel Subscription Section -->
        <div class="mb-10">
          <h2 class="text-h5 font-weight-bold mb-6">
            Manage subscription
          </h2>
          
          <v-card class="payment-methods-card pa-6">
            <div class="d-flex justify-space-between align-center mb-6">
              <div>
                <div class="text-h6 font-weight-medium mb-2">
                  Cancel or pause subscription
                </div>
                <div class="text-body-2 text-medium-emphasis">
                  By canceling your subscription, you will lose access to premium features after your current billing period ends.
                </div>
              </div>
              
              <div class="d-flex gap-4">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  rounded="lg"
                  class="px-6"
                >
                  Pause subscription
                </v-btn>
                <v-btn
                  color="error"
                  variant="flat"
                  rounded="lg"
                  class="px-6"
                  @click="confirmCancelSubscription"
                >
                  Cancel subscription
                </v-btn>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="text-body-2 text-medium-emphasis">
              <v-icon
                color="warning"
                class="mr-2"
                size="small"
              >
                mdi-information
              </v-icon>
              Your data will be securely stored for 30 days after cancellation.
            </div>
          </v-card>
        </div>
        
        <!-- Initial Cancel Confirmation Dialog -->
        <v-dialog
          v-model="cancelDialog"
          max-width="500"
          persistent
        >
          <v-card class="pa-6">
            <div class="d-flex align-center mb-6">
              <v-icon
                color="error"
                size="32"
                class="mr-4"
              >
                mdi-alert-circle
              </v-icon>
              <v-card-title class="text-h5 font-weight-bold pa-0">
                Cancel subscription?
              </v-card-title>
            </div>
            
            <v-card-text class="text-body-1 pa-0 mb-6">
              <p class="mb-4">
                Are you sure you want to cancel your subscription? You will:
              </p>
              <ul class="cancel-impacts">
                <li class="mb-2">
                  Lose access to premium features after current billing period
                </li>
                <li class="mb-2">
                  Keep access to your data for 30 days after cancellation
                </li>
                <li>Be able to reactivate your subscription at any time</li>
              </ul>
            </v-card-text>
            
            <v-card-actions class="pa-0">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="outlined"
                rounded="lg"
                class="px-6 mr-4"
                @click="cancelDialog = false"
              >
                Keep Subscription
              </v-btn>
              <v-btn
                color="error"
                variant="flat"
                rounded="lg"
                class="px-6"
                @click="showCancelReasonDialog"
              >
                Continue Cancellation
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <!-- Cancellation Reason Dialog -->
        <v-dialog
          v-model="cancelReasonDialog"
          max-width="500"
          persistent
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold mb-6">
              Help us improve
            </v-card-title>
            
            <v-card-text class="pa-0">
              <p class="text-body-1 mb-6">
                What's the main reason for canceling your subscription?
              </p>
              <div class="cancellation-reasons">
                <v-radio-group
                  v-model="cancellationReason"
                  class="cancel-reason-group"
                >
                  <div
                    v-for="(reason, index) in cancellationReasons"
                    :key="index"
                    class="cancel-reason-option mb-4"
                  >
                    <v-radio
                      :value="reason"
                      color="primary"
                      hide-details
                    >
                      <template #label>
                        <span class="ml-2 text-body-1">{{ reason }}</span>
                      </template>
                    </v-radio>
                  </div>
                </v-radio-group>
              </div>
            </v-card-text>
            
            <v-card-actions class="pt-6 pa-0">
              <v-btn
                color="grey-darken-1"
                variant="outlined"
                rounded="lg"
                class="px-6 mr-4"
                @click="cancelReasonDialog = false"
              >
                Back
              </v-btn>
              <v-btn
                color="error"
                variant="flat"
                rounded="lg"
                class="px-6"
                :disabled="!cancellationReason"
                @click="finalizeCancel"
              >
                Confirm Cancellation
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        
        <!-- Success Snackbar -->
        <v-snackbar
          v-model="cancellationSuccessful"
          color="success"
          timeout="5000"
        >
          Your subscription has been successfully canceled.
          <template #actions>
            <v-btn
              color="white"
              variant="text"
              @click="cancellationSuccessful = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import LeftMenu from '@/dashboard/LeftMenu.vue'
import SearchBar from '@/dashboard/SearchBar.vue';

export default {
  name: 'SubscriptionPage',
  components: {
    LeftMenu,
    SearchBar
  },
  data() {
    return {
      sidebarExpanded: true,
      cancelDialog: false,
      cancelReasonDialog: false,
      cancellationSuccessful: false,
      cancellationReason: '',
      selectedPlan: 'monthly',
      showPaymentDialog: false,
      selectedPaymentMethod: 'card',
      updating: false,
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      cardName: '',
      currentPaymentMethod: {
        name: 'Visa ending in 4242',
        image: '/card-visa.png',
        expiry: '12/25'
      },
      paymentMethods: [
        {
          id: 'card',
          name: 'Credit / Debit Card',
          image: '/card-generic.png'
        },
        {
          id: 'paypal',
          name: 'PayPal',
          image: '/paypal.png'
        },
        {
          id: 'revolut',
          name: 'Revolut',
          image: '/revolut.png'
        }
      ],
      rules: {
        required: v => !!v || 'This field is required',
        cardNumber: v => /^[\d\s]{16,19}$/.test(v.replace(/\s/g, '')) || 'Invalid card number',
        expiry: v => /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(v) || 'Invalid expiry date',
        cvv: v => /^[0-9]{3,4}$/.test(v) || 'Invalid CVV'
      },
      cancellationReasons: [
        'I no longer need the service for my freelancing work.',
        'I\'m not using the platform as much as I expected.',
        'The features don\'t meet my expectations.',
        'I\'m taking a break from freelancing.',
        'I experienced technical issues or bugs.'
      ],
      billingHistory: [
        {
          date: 'Aug 8, 2020',
          type: 'Monthly plan',
          status: 'Completed',
          price: '15',
          invoiceId: '001'
        },
        {
          date: 'Juli 8, 2020',
          type: 'Monthly plan',
          status: 'Completed',
          price: '15',
          invoiceId: '002'
        },
        {
          date: 'Juny 8, 2020',
          type: 'Monthly plan',
          status: 'Completed',
          price: '15',
          invoiceId: '003'
        }
      ]
    }
  },
  methods: {
    confirmCancelSubscription() {
      this.cancelDialog = true;
    },
    showCancelReasonDialog() {
      // Close the first dialog and show the reason dialog
      this.cancelDialog = false;
      this.cancelReasonDialog = true;
    },
    finalizeCancel() {
      // Implement cancellation logic here with the reason
      console.log('Canceling subscription with reason:', this.cancellationReason);
      
      // API call example:
      // try {
      //   await this.$api.subscriptions.cancel({
      //     userId: this.currentUser.id,
      //     reason: this.cancellationReason,
      //     timestamp: new Date().toISOString()
      //   });
      
      //   // Analytics tracking
      //   this.$analytics.track('Subscription Canceled', {
      //     reason: this.cancellationReason,
      //     subscriptionType: 'Monthly subscription',
      //     userType: 'Trial'
      //   });
      // } catch (error) {
      //   console.error('Error canceling subscription:', error);
      //   this.showError = true;
      //   return;
      // }
      
      // Close the reason dialog
      this.cancelReasonDialog = false;
      
      // Show success message
      this.cancellationSuccessful = true;
      
      // Redirect after a delay
      setTimeout(() => {
        this.$router.push({ name: 'Home' });
      }, 2000);
    },
    downloadInvoice(item) {
      console.log('Downloading invoice:', item.invoiceId);
      // Implementation remains the same
    },

    openPaymentDialog() {
      this.showPaymentDialog = true;
      this.selectedPaymentMethod = 'card';
      this.cardNumber = '';
      this.cardExpiry = '';
      this.cardCvv = '';
      this.cardName = '';
    },

    async updatePaymentMethod() {
      if (this.selectedPaymentMethod === 'card') {
        // Validate card inputs
        if (!this.cardNumber || !this.cardExpiry || !this.cardCvv || !this.cardName) {
          // Show error message
          return;
        }
      }

      this.updating = true;

      try {
        // Example API call to update payment method
        // await this.$api.payments.updateMethod({
        //   type: this.selectedPaymentMethod,
        //   data: this.selectedPaymentMethod === 'card' ? {
        //     number: this.cardNumber.replace(/\s/g, ''),
        //     expiry: this.cardExpiry,
        //     cvv: this.cardCvv,
        //     name: this.cardName
        //   } : {}
        // });

        // Update the current payment method display
        this.currentPaymentMethod = {
          name: this.selectedPaymentMethod === 'card' 
            ? `Card ending in ${this.cardNumber.slice(-4)}` 
            : this.paymentMethods.find(m => m.id === this.selectedPaymentMethod).name,
          image: this.paymentMethods.find(m => m.id === this.selectedPaymentMethod).image,
          expiry: this.cardExpiry || 'N/A'
        };

        this.showPaymentDialog = false;
        // Show success message
        // this.$toast.success('Payment method updated successfully');
      } catch (error) {
        console.error('Error updating payment method:', error);
        // Show error message
        // this.$toast.error('Failed to update payment method');
      } finally {
        this.updating = false;
      }
    },

    formatCardNumber(e) {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      if (v.length > 16) v = v.slice(0, 16);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.slice(i, i + 4));
      }
      e.target.value = parts.join(' ');
    }
  }
}
</script>

<style scoped>
.status-chip {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.status-chip.completed {
  background: #ecfdf5;
  color: #059669;
}

.status-chip.pending {
  background: #fff7ed;
  color: #c2410c;
}

:deep(.left-menu-fixed) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  z-index: 999 !important;
  width: 72px 
  /* other styles... */
}

.left-menu-fixed {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%);
  z-index: 1100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: none;
  padding: 12px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar styling */
.left-menu-fixed::-webkit-scrollbar {
  width: 4px;
}

.left-menu-fixed::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.left-menu-fixed::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.left-menu-fixed::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Firefox scrollbar */
.left-menu-fixed {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.1);
}

.left-menu-fixed.expanded {
  width: 240px;
}

.main-expanded {
  margin-left: 240px !important;
  width: calc(100% - 240px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-collapsed {
  margin-left: 72px !important;
  width: calc(100% - 72px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ws {
  margin-left:10px;
}

/* Adding to existing styles */
.billing-table {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

.status-chip {
  min-width: 80px;
  justify-content: center;
}

.download-btn {
  text-transform: none;
}

:deep(.v-table) {
  background: transparent;
}

:deep(.v-table th) {
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

:deep(.v-table td) {
  height: 60px;
  color: #475569;
}

/* Payment Methods Styles */
.payment-methods-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}

.current-payment-method {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.pol {
text-align: left; 
}

.ws {
  
}

.payment-option {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.payment-option:hover {
  border-color: var(--v-primary-base);
  background: rgba(var(--v-primary-base), 0.05);
}

.payment-option.selected {
  border-color: var(--v-primary-base);
  background: rgba(var(--v-primary-base), 0.05);
}

/* Cancellation Section Styles */
.cancel-impacts {
  list-style: none;
  padding-left: 24px;
}

.cancel-impacts li {
  position: relative;
  color: #475569;
}

.cancel-impacts li::before {
  content: "•";
  position: absolute;
  left: -20px;
  color: #ef4444;
}

.cancel-reason-group {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 0.5rem;
}

.cancel-reason-option {
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0.5rem;
}

.cancel-reason-option:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* Plan Cards Styles */
.plan-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.plan-card-selected {
  border: 2px solid var(--v-primary-base);
  background: linear-gradient(to bottom, rgba(var(--v-primary-base), 0.05), transparent);
}

.plan-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--v-primary-base);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.plan-badge.bg-success {
  background: var(--v-success-base);
}

.price-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}

.price-display .currency {
  font-size: 1.5rem;
  color: #64748b;
}

.price-display .amount {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.price-display .period {
  font-size: 1rem;
  color: #64748b;
  margin-left: 2px;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
}

.feature-item span {
  font-size: 0.9375rem;
}
</style>