<template>
  <v-app>
    <LeftMenu
      :rail="!sidebarExpanded"
      @update:rail="sidebarExpanded = !$event"
    />
    
    <v-main
      :class="{ 'ml-60': sidebarExpanded, 'ml-14': !sidebarExpanded }"
      class="transition-all duration-300"
    >
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Header with Search -->
        <div class="d-flex justify-space-between align-center mb-10">
          <div class="logo">
            <!-- You can add your logo here if needed -->
          </div>
          
          <div class="d-flex align-center gap-4">
            <div class="search-container">
              <v-text-field
                density="compact"
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                class="rounded-pill"
                style="max-width: 240px;"
              />
            </div>
            
            <v-btn
              icon
              class="bg-purple-lighten-4"
              color="purple"
            >
              <v-icon>mdi-earth</v-icon>
            </v-btn>
            
            <v-btn
              icon
              class="bg-amber-lighten-4"
              color="amber"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Current Subscription Section -->
        <div class="subscription-container mb-10">
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
            <div class="text-body-1">
              You're on free trial that ends on October 28. You can manage your payment methods, upgrade plans or cancel your subscription.
            </div>
          </div>
        </div>
        
        <!-- Payment Methods Section -->
        <div class="payment-methods-container mb-10">
          <h2 class="text-h5 font-weight-bold mb-6">
            Payment methods
          </h2>
          
          <div class="d-flex justify-space-between align-center">
            <div class="text-body-1">
              Modify your payment method for future payments
            </div>
            
            <v-btn
              color="primary"
              rounded="lg"
              class="px-6"
            >
              Change payment method
            </v-btn>
          </div>
        </div>
        
        <!-- Subscription Plans Section -->
        <div class="subscription-plans-container mb-10">
          <h2 class="text-h5 font-weight-bold mb-6">
            Subscription Plans
          </h2>
          
          <div class="d-flex gap-6">
            <!-- Monthly Plan Card -->
            <v-card
              width="400"
              class="pa-6"
              variant="outlined"
              rounded="lg"
            >
              <h3 class="text-h5 font-weight-bold text-center mb-6">
                Monthly plan
              </h3>
              
              <ul class="plan-features pl-6">
                <li class="mb-2">
                  15$ per month
                </li>
                <li>Full access.</li>
              </ul>
            </v-card>
            
            <!-- 6-Month Plan Card -->
            <v-card
              width="400"
              class="pa-6"
              variant="outlined"
              rounded="lg"
            >
              <h3 class="text-h5 font-weight-bold text-center mb-6">
                6-Months plan
              </h3>
              
              <ul class="plan-features pl-6">
                <li class="mb-2">
                  60$ per month
                </li>
                <li class="mb-2">
                  Full access
                </li>
                <li>Save 30%</li>
              </ul>
            </v-card>
          </div>
        </div>
        
        <!-- Billing History Section -->
        <div class="billing-history-container mb-10">
          <h2 class="text-h5 font-weight-bold mb-6">
            Billing History
          </h2>
          
          <v-table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in billingHistory"
                :key="index"
              >
                <td>{{ item.date }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.status }}</td>
                <td>${{ item.price }}</td>
                <td>
                  <v-btn
                    variant="text"
                    color="primary"
                    density="compact"
                    @click="downloadInvoice(item)"
                  >
                    Download
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
        
        <!-- Cancel Subscription Section -->
        <div class="cancel-subscription-container">
          <h2 class="text-h5 font-weight-bold mb-4">
            Pause or cancel subscription
          </h2>
          
          <div class="d-flex justify-space-between align-center">
            <div class="text-body-1">
              By canceling your account you will lose all your data.
            </div>
            
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
        
        <!-- Initial Cancel Confirmation Dialog -->
        <v-dialog
          v-model="cancelDialog"
          max-width="500"
          persistent
        >
          <v-card class="pa-6">
            <v-card-title class="text-h5 font-weight-bold">
              Are you sure you want to cancel?
            </v-card-title>
            
            <v-card-text class="pt-4">
              Canceling your subscription will end all services and your data will be removed after 30 days.
            </v-card-text>
            
            <v-card-actions class="pt-4">
              <v-spacer />
              <v-btn
                color="grey-darken-1"
                variant="text"
                @click="cancelDialog = false"
              >
                Keep Subscription
              </v-btn>
              <v-btn
                color="error"
                variant="flat"
                @click="showCancelReasonDialog"
              >
                Yes, Cancel
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
            <v-card-title class="text-h5 font-weight-bold text-center mb-8">
              Why are you canceling?
            </v-card-title>
            
            <v-card-text>
              <div class="cancellation-reasons">
                <v-radio-group v-model="cancellationReason">
                  <div
                    v-for="(reason, index) in cancellationReasons"
                    :key="index"
                    class="mb-4"
                  >
                    <v-radio
                      :value="reason"
                      color="primary"
                      class="pa-0 ma-0"
                    >
                      <template #label>
                        <span class="ml-2">{{ reason }}</span>
                      </template>
                    </v-radio>
                  </div>
                </v-radio-group>
              </div>
            </v-card-text>
            
            <v-card-actions class="pt-6">
              <v-btn
                color="#ff9999"
                variant="flat"
                rounded="lg"
                block
                height="48"
                @click="finalizeCancel"
              >
                Finalize canceling
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

export default {
  name: 'SubscriptionPage',
  components: {
    LeftMenu
  },
  data() {
    return {
      sidebarExpanded: true,
      cancelDialog: false,
      cancelReasonDialog: false,
      cancellationSuccessful: false,
      cancellationReason: '',
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
      // Implement download logic here
      // Example:
      // this.$api.invoices.download(item.invoiceId)
      //   .then(response => {
      //     // Create blob from response and trigger download
      //     const blob = new Blob([response.data], { type: 'application/pdf' });
      //     const link = document.createElement('a');
      //     link.href = window.URL.createObjectURL(blob);
      //     link.download = `invoice-${item.invoiceId}.pdf`;
      //     link.click();
      //   })
      //   .catch(error => {
      //     console.error('Error downloading invoice:', error);
      //     this.$toast.error('Failed to download invoice');
      //   });
    }
  }
}
</script>

<style scoped>
.plan-features {
  list-style-type: disc;
}

/* Table styling */
:deep(.v-table) {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-table th) {
  font-weight: 600;
  background-color: #f5f5f5;
  text-transform: none;
  font-size: 14px;
}

/* Radio button styling */
:deep(.v-radio) {
  margin-top: 0;
  margin-bottom: 0;
}

:deep(.v-radio .v-selection-control) {
  min-height: 32px;
}

:deep(.v-radio .v-label) {
  font-size: 16px;
  opacity: 1;
  color: rgba(0, 0, 0, 0.87);
}

/* Button styling */
:deep(.v-btn) {
  text-transform: none;
  font-weight: 500;
}

/* Rounded search field */
:deep(.v-text-field .v-field__outline__start) {
  border-radius: 20px 0 0 20px;
}

:deep(.v-text-field .v-field__outline__end) {
  border-radius: 0 20px 20px 0;
}
</style>