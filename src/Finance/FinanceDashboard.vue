<template>
  <v-app>
    <LeftMenu />
    
    <v-main class="bg-grey-lighten-5">
      <v-container
        fluid
        class="pa-4 pa-sm-6"
      >
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <h1 class="text-h5 font-weight-bold">
            Finance
          </h1>
          <div class="d-flex align-center">
            <v-text-field
              v-model="search"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              class="mr-2"
              style="max-width: 200px"
              bg-color="white"
            />
            <v-btn
              icon
              color="primary"
              class="ml-2"
              variant="text"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              icon
              color="primary"
              class="ml-2"
              variant="text"
            >
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </div>
        </div>
        
        <!-- Summary Cards -->
        <v-row class="mb-6">
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              rounded="lg"
              class="summary-card"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <div class="d-flex flex-column">
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-1 text-medium-emphasis">Total Balance</span>
                    <span class="text-caption">
                      <v-icon
                        size="small"
                        color="success"
                      >mdi-arrow-up-thin</v-icon> 
                      <span class="text-success">+3.3%</span>
                      <span class="text-medium-emphasis ml-1">than last month</span>
                    </span>
                  </div>
                  <span class="text-h4 font-weight-bold mt-2">32 363.75₽</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              rounded="lg"
              class="summary-card"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <div class="d-flex flex-column">
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-1 text-medium-emphasis">Income</span>
                    <span class="text-caption">
                      <v-icon
                        size="small"
                        color="success"
                      >mdi-arrow-up-thin</v-icon> 
                      <span class="text-success">+1.2%</span>
                      <span class="text-medium-emphasis ml-1">than last month</span>
                    </span>
                  </div>
                  <span class="text-h4 font-weight-bold mt-2 text-success">+30 645₽</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              rounded="lg"
              class="summary-card"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <div class="d-flex flex-column">
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-1 text-medium-emphasis">Expenses</span>
                    <span class="text-caption">
                      <v-icon
                        size="small"
                        color="error"
                      >mdi-arrow-down-thin</v-icon> 
                      <span class="text-error">-8.3%</span>
                      <span class="text-medium-emphasis ml-1">than last month</span>
                    </span>
                  </div>
                  <span class="text-h4 font-weight-bold mt-2 text-error">-21 465.90₽</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <!-- Main Content -->
        <v-row>
          <!-- Income & Expenses Chart -->
          <v-col
            cols="12"
            lg="6"
            class="mb-6"
          >
            <v-card
              rounded="lg"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h6 font-weight-medium">
                    Income & Expenses
                  </h2>
                  <v-select
                    v-model="selectedTimeframe"
                    :items="timeframes"
                    label="Months"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="max-width: 150px"
                    bg-color="white"
                  />
                </div>
                
                <div
                  class="chart-container"
                  style="position: relative; height: 300px;"
                >
                  <bar-chart 
                    v-if="chartDataLoaded"
                    :data="incomeExpenseData" 
                    :options="barChartOptions"
                  />
                </div>
                
                <div class="d-flex mt-4">
                  <div class="d-flex align-center mr-4">
                    <div class="color-dot blue-dot mr-2" />
                    <span class="text-body-2">Income</span>
                  </div>
                  <div class="d-flex align-center">
                    <div class="color-dot light-blue-dot mr-2" />
                    <span class="text-body-2">Expenses</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Expenses by Category -->
          <v-col
            cols="12"
            lg="6"
            class="mb-6"
          >
            <v-card
              rounded="lg"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h6 font-weight-medium">
                    Expenses by categories
                  </h2>
                  <v-select
                    v-model="selectedExpenseView"
                    :items="expenseViews"
                    label="Expenses"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="max-width: 150px"
                    bg-color="white"
                  />
                </div>
                
                <div
                  class="chart-container"
                  style="position: relative; height: 300px;"
                >
                  <doughnut-chart 
                    v-if="chartDataLoaded"
                    :data="expensesByCategoryData" 
                    :options="doughnutOptions"
                  />
                  <div class="chart-center-text">
                    <div class="text-subtitle-1 font-weight-medium">
                      Food
                    </div>
                    <div class="text-h5 font-weight-bold text-error">
                      -7 654.57₽
                    </div>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap mt-4 justify-center">
                  <div
                    v-for="(category, index) in expenseCategories"
                    :key="index"
                    class="d-flex align-center mx-2 mb-2"
                  >
                    <div
                      class="color-dot mr-2"
                      :style="{ backgroundColor: category.color }"
                    />
                    <span class="text-body-2">{{ category.name }}</span>
                    <span class="text-body-2 ml-2 font-weight-medium">{{ category.percentage }}%</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Recent Transactions -->
          <v-col
            cols="12"
            lg="6"
            class="mb-6"
          >
            <v-card
              rounded="lg"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h6 font-weight-medium">
                    Recent Transactions
                  </h2>
                  <v-btn
                    icon
                    color="primary"
                    variant="text"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
                
                <div class="transaction-table">
                  <div class="transaction-header d-flex">
                    <div class="transaction-column-category">
                      Category name
                    </div>
                    <div class="transaction-column-date">
                      Date
                    </div>
                    <div class="transaction-column-amount">
                      Amount
                    </div>
                  </div>
                  
                  <div
                    v-for="(transaction, index) in recentTransactions"
                    :key="index"
                    class="transaction-row d-flex"
                  >
                    <div class="transaction-column-category d-flex align-center">
                      <v-icon
                        :color="transaction.iconColor"
                        size="24"
                        class="mr-3"
                      >
                        {{ transaction.icon }}
                      </v-icon>
                      {{ transaction.category }}
                    </div>
                    <div class="transaction-column-date">
                      {{ transaction.date }}
                    </div>
                    <div
                      class="transaction-column-amount"
                      :class="transaction.amount.startsWith('-') ? 'text-error' : 'text-success'"
                    >
                      {{ transaction.amount }}
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Combined column for Spending Limits and Upcoming Payments -->
          <v-col
            cols="12"
            lg="6"
          >
            <!-- Spending Limits -->
            <v-card
              rounded="lg"
              elevation="1"
              class="mb-6"
            >
              <v-card-text class="pa-4">
                <div class="d-flex justify-space-between align-center mb-4">
                  <h2 class="text-h6 font-weight-medium">
                    Spending limits
                  </h2>
                  <v-btn
                    icon
                    color="primary"
                    variant="text"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </div>
                
                <div
                  v-for="(limit, index) in spendingLimits"
                  :key="index"
                  class="mb-4"
                >
                  <div class="d-flex justify-space-between mb-1">
                    <span class="text-subtitle-1">{{ limit.category }}</span>
                    <span class="text-subtitle-1">
                      <span class="font-weight-medium">{{ formatNumber(limit.current) }}</span>
                      <span class="text-medium-emphasis">of {{ formatNumber(limit.max) }}₽</span>
                    </span>
                  </div>
                  <v-progress-linear
                    :model-value="(limit.current / limit.max) * 100"
                    height="10"
                    rounded
                    :color="limit.color"
                    bg-color="grey-lighten-3"
                  />
                </div>
              </v-card-text>
            </v-card>
            
            <!-- Upcoming Payments -->
            <v-card
              rounded="lg"
              elevation="1"
            >
              <v-card-text class="pa-4">
                <h2 class="text-h6 font-weight-medium mb-4">
                  Upcoming payments
                </h2>
                
                <div class="upcoming-payments">
                  <div
                    v-for="(payment, index) in upcomingPayments"
                    :key="index"
                    class="upcoming-payment-item d-flex align-center"
                  >
                    <div class="payment-icon-container mr-3">
                      <v-icon :color="payment.iconColor">
                        {{ payment.icon }}
                      </v-icon>
                    </div>
                    <div class="payment-details flex-grow-1">
                      <div class="payment-service font-weight-medium">
                        {{ payment.service }}
                      </div>
                      <div class="payment-date text-caption text-medium-emphasis">
                        {{ payment.date }}
                      </div>
                    </div>
                    <div class="payment-amount font-weight-medium">
                      {{ payment.amount }}₽
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default defineComponent({
  name: 'FinanceDashboard',
  components: {
    LeftMenu,
    'bar-chart': Bar,
    'doughnut-chart': Doughnut
  },
  setup() {
    // Search input
    const search = ref('');
    const chartDataLoaded = ref(false);
    
    // Timeframes for chart
    const timeframes = ['Months', 'Weeks', 'Days'];
    const selectedTimeframe = ref('Months');
    
    // Expense views
    const expenseViews = ['Expenses', 'Monthly', 'Yearly'];
    const selectedExpenseView = ref('Expenses');
    
    // Bar chart data
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomeData = [38000, 38000, 38000, 42000, 38000, 38000];
    const expenseData = [20000, 20000, 28000, 12000, 24000, 20000];
    
    const incomeExpenseData = ref({
      labels: months,
      datasets: [
        {
          label: 'Income',
          backgroundColor: '#4361EE',
          data: incomeData,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
          borderRadius: 4
        },
        {
          label: 'Expenses',
          backgroundColor: '#BFDBFE',
          data: expenseData,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
          borderRadius: 4
        }
      ]
    });
    
    const barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value / 1000 + 'k';
            },
            stepSize: 10000
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
    
    // Expense categories for doughnut chart with added Home category
    const expenseCategories = [
      { name: 'Food', percentage: 37.5, color: '#3730A3' },
      { name: 'Clothes', percentage: 16.7, color: '#C7D2FE' },
      { name: 'Transport', percentage: 16.7, color: '#818CF8' },
      { name: 'Home', percentage: 12.5, color: '#2563EB' },
      { name: 'Subscriptions', percentage: 8.3, color: '#1E3A8A' },
      { name: 'Bills', percentage: 4.15, color: '#22D3EE' },
      { name: 'Hobby', percentage: 4.15, color: '#0E7490' }
    ];
    
    const expensesByCategoryData = ref({
      labels: expenseCategories.map(cat => cat.name),
      datasets: [{
        data: expenseCategories.map(cat => cat.percentage),
        backgroundColor: expenseCategories.map(cat => cat.color),
        borderWidth: 0,
        cutout: '75%'
      }]
    });
    
    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.label}: ${context.raw}%`;
            }
          }
        }
      },
      cutout: '75%'
    };
    
    // Recent transactions
    const recentTransactions = [
      { 
        category: 'Food', 
        date: '1st December, 2023', 
        amount: '-245.00', 
        icon: 'mdi-food', 
        iconColor: 'blue'
      },
      { 
        category: 'Cafe', 
        date: '30th November, 2023', 
        amount: '-2665.12', 
        icon: 'mdi-coffee', 
        iconColor: 'blue'
      },
      { 
        category: 'Internet', 
        date: '29th November, 2023', 
        amount: '-2335.12', 
        icon: 'mdi-web', 
        iconColor: 'blue'
      },
      { 
        category: 'Transport', 
        date: '27th November, 2023', 
        amount: '-23336.12', 
        icon: 'mdi-car', 
        iconColor: 'blue'
      }
    ];
    
    // Spending limits
    const spendingLimits = [
      { category: 'Food & Cafe', current: 4832, max: 10000, color: 'primary' },
      { category: 'Clothes', current: 2254, max: 3000, color: 'primary' },
      { category: 'Games', current: 2000, max: 2000, color: 'primary' },
      { category: 'Board games', current: 1111, max: 4000, color: 'primary' }
    ];
    
    // Upcoming payments for freelancer websites
    const upcomingPayments = [
      { 
        service: 'Upwork', 
        date: '13th December', 
        amount: '235', 
        icon: 'mdi-briefcase-outline', 
        iconColor: 'primary' 
      },
      { 
        service: 'Fiverr', 
        date: '21th December', 
        amount: '265', 
        icon: 'mdi-currency-usd', 
        iconColor: 'primary' 
      },
      { 
        service: 'Freelancer.com', 
        date: '26th December', 
        amount: '176', 
        icon: 'mdi-account-tie', 
        iconColor: 'primary' 
      },
      { 
        service: 'Toptal', 
        date: '15th December', 
        amount: '547', 
        icon: 'mdi-professional-hexagon', 
        iconColor: 'primary' 
      }
    ];
    
    // Format numbers with spaces for thousands
    const formatNumber = (value) => {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    
    // Initialize when component is mounted
    onMounted(() => {
      console.log('Finance dashboard mounted');
      // Simulate chart data loading delay
      setTimeout(() => {
        chartDataLoaded.value = true;
      }, 100);
    });
    
    return {
      search,
      chartDataLoaded,
      timeframes,
      selectedTimeframe,
      expenseViews,
      selectedExpenseView,
      incomeExpenseData,
      barChartOptions,
      expenseCategories,
      expensesByCategoryData,
      doughnutOptions,
      recentTransactions,
      spendingLimits,
      upcomingPayments,
      formatNumber
    };
  }
});
</script>

<style scoped>
.bg-grey-lighten-5 {
  background-color: #f8fafc !important;
}

/* Summary cards styling */
.summary-card {
  background-color: white;
  border-radius: 12px;
  height: 100%;
}

/* Text color classes */
.text-success {
  color: #10B981 !important;
}

.text-error {
  color: #EF4444 !important;
}

/* Chart and visualization components */
.chart-container {
  width: 100%;
  height: 100%;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.blue-dot {
  background-color: #4361EE;
}

.light-blue-dot {
  background-color: #BFDBFE;
}

.chart-center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

/* Transaction table styling */
.transaction-table {
  width: 100%;
}

.transaction-header {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.transaction-row {
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.transaction-column-category {
  flex: 1;
  min-width: 100px;
}

.transaction-column-date {
  flex: 1;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.875rem;
}

.transaction-column-amount {
  width: 90px;
  text-align: right;
  font-weight: 500;
}

/* Upcoming payments styling */
.upcoming-payments {
  width: 100%;
}

.upcoming-payment-item {
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.upcoming-payment-item:last-child {
  border-bottom: none;
}

.payment-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(79, 70, 229, 0.1);
  border-radius: 8px;
}

.payment-service {
  font-size: 0.9375rem;
}

.payment-date {
  font-size: 0.75rem;
}

.payment-amount {
  font-size: 0.9375rem;
}

/* Progress bar styling */
:deep(.v-progress-linear) {
  border-radius: 10px !important;
  height: 10px !important;
}

:deep(.v-progress-linear__background) {
  opacity: 0.2 !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .transaction-column-date {
    display: none;
  }
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }
}
</style>