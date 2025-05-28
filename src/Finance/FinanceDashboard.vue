<!-- FinanceDashboard.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
    
    <v-main class="bg-surface-subtle">
      <v-container
        fluid
        class="pa-6 pa-sm-8"
      >
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-8">
          <h1 class="text-h4 font-weight-bold text-primary">
            Finance Overview
          </h1>
        </div>
        
        <!-- Summary Cards -->
        <v-row class="mb-8">
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              rounded="xl"
              class="summary-card"
              flat
              border
            >
              <v-card-text class="pa-6">
                <div class="d-flex flex-column">
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-1 text-medium-emphasis font-weight-medium">Total Balance</span>
                    <span class="text-caption">
                      <v-icon
                        size="small"
                        color="success"
                        class="mb-1"
                      >mdi-arrow-up-thin</v-icon> 
                      <span class="text-success">+3.3%</span>
                      <span class="text-medium-emphasis ml-1">than last month</span>
                    </span>
                  </div>
                  <span class="text-h3 font-weight-bold mt-2">32 363.75€</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              rounded="xl"
              class="summary-card"
              flat
              border
            >
              <v-card-text class="pa-6">
                <div class="d-flex flex-column">
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-1 text-medium-emphasis font-weight-medium">Income</span>
                    <span class="text-caption">
                      <v-icon
                        size="small"
                        color="success"
                        class="mb-1"
                      >mdi-arrow-up-thin</v-icon> 
                      <span class="text-success">+1.2%</span>
                      <span class="text-medium-emphasis ml-1">than last month</span>
                    </span>
                  </div>
                  <span class="text-h3 font-weight-bold mt-2 text-success">+30 645€</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col
            cols="12"
            md="4"
          >
            <v-card
              rounded="xl"
              class="summary-card"
              flat
              border
            >
              <v-card-text class="pa-6">
                <div class="d-flex flex-column">
                  <div class="d-flex justify-space-between">
                    <span class="text-subtitle-1 text-medium-emphasis font-weight-medium">Expenses</span>
                    <span class="text-caption">
                      <v-icon
                        size="small"
                        color="error"
                        class="mb-1"
                      >mdi-arrow-down-thin</v-icon> 
                      <span class="text-error">-8.3%</span>
                      <span class="text-medium-emphasis ml-1">than last month</span>
                    </span>
                  </div>
                  <span class="text-h3 font-weight-bold mt-2 text-error">-21 465.90€</span>
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
            class="mb-8"
          >
            <v-card
              rounded="xl"
              flat
              border
              class="h-100"
            >
              <v-card-text class="pa-6">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-medium text-primary">
                    Income & Expenses
                  </h2>
                  <v-select
                    v-model="selectedTimeframe"
                    :items="timeframes"
                    label="Time Period"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="max-width: 150px"
                    bg-color="surface"
                    class="text-body-1"
                  />
                </div>
                
                <div
                  class="chart-container"
                  style="position: relative; height: 320px;"
                >
                  <bar-chart 
                    v-if="chartDataLoaded"
                    :data="incomeExpenseData" 
                    :options="barChartOptions"
                  />
                </div>
                
                <div class="d-flex mt-6">
                  <div class="d-flex align-center mr-6">
                    <div class="color-dot primary-dot mr-2" />
                    <span class="text-body-1 font-weight-medium">Income</span>
                  </div>
                  <div class="d-flex align-center">
                    <div class="color-dot light-blue-dot mr-2" />
                    <span class="text-body-1 font-weight-medium">Expenses</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Expenses by Category -->
          <v-col
            cols="12"
            lg="6"
            class="mb-8"
          >
            <v-card
              rounded="xl"
              flat
              border
              class="h-100"
            >
              <v-card-text class="pa-6">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-medium text-primary">
                    Expenses by Categories
                  </h2>
                  <v-select
                    v-model="selectedExpenseView"
                    :items="expenseViews"
                    label="View"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="max-width: 150px"
                    bg-color="surface"
                    class="text-body-1"
                  />
                </div>
                
                <div
                  class="chart-container"
                  style="position: relative; height: 320px;"
                >
                  <doughnut-chart 
                    v-if="chartDataLoaded"
                    :data="expensesByCategoryData" 
                    :options="doughnutOptions"
                  />
                  <div class="chart-center-text">
                    <div class="text-subtitle-1 font-weight-medium text-medium-emphasis">
                      Food
                    </div>
                    <div class="text-h4 font-weight-bold text-error">
                      -7 654.57€
                    </div>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap mt-6 justify-center">
                  <div
                    v-for="(category, index) in expenseCategories"
                    :key="index"
                    class="d-flex align-center mx-3 mb-3"
                  >
                    <div
                      class="color-dot mr-2"
                      :style="{ backgroundColor: category.color }"
                    />
                    <span class="text-body-1 font-weight-medium">{{ category.name }}</span>
                    <span class="text-body-1 ml-2 text-medium-emphasis">{{ category.percentage }}%</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Recent Transactions -->
          <v-col
            cols="12"
            lg="6"
            class="mb-8"
          >
            <v-card
              rounded="xl"
              flat
              border
              class="h-100"
            >
              <v-card-text class="pa-6">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-medium text-primary">
                    Recent Transactions
                  </h2>
                  <v-btn
                    icon
                    color="primary"
                    variant="text"
                    class="rounded-xl"
                    @click="openAddExpenseDialog"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </div>
                
                <div class="transaction-table">
                  <div class="transaction-header d-flex">
                    <div class="transaction-column-category font-weight-medium">
                      Category
                    </div>
                    <div class="transaction-column-date font-weight-medium">
                      Date
                    </div>
                    <div class="transaction-column-amount font-weight-medium">
                      Amount
                    </div>
                    <div class="transaction-column-actions" />
                  </div>
                  
                  <div
                    v-for="(transaction, index) in recentTransactions"
                    :key="index"
                    class="transaction-row d-flex"
                  >
                    <div class="transaction-column-category d-flex align-center">
                      <div class="transaction-icon-container mr-3">
                        <v-icon
                          size="20"
                          color="white"
                        >
                          {{ transaction.icon }}
                        </v-icon>
                      </div>
                      <span class="font-weight-medium">{{ transaction.category }}</span>
                    </div>
                    <div class="transaction-column-date">
                      {{ transaction.date }}
                    </div>
                    <div
                      class="transaction-column-amount font-weight-medium"
                      :class="transaction.amount.startsWith('-') ? 'text-error' : 'text-success'"
                    >
                      {{ transaction.amount }}€
                    </div>
                    <div class="transaction-column-actions">
                      <v-btn
                        icon
                        size="small"
                        color="error"
                        variant="text"
                        class="transaction-delete-btn"
                        @click="deleteTransaction(index)"
                      >
                        <v-icon size="small">
                          mdi-delete
                        </v-icon>
                      </v-btn>
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
              rounded="xl"
              flat
              border
              class="mb-8"
            >
              <v-card-text class="pa-6">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h2 class="text-h5 font-weight-medium text-primary">
                    Spending Limits
                  </h2>
                  <v-btn
                    icon
                    color="primary"
                    variant="text"
                    class="rounded-xl"
                  >
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </div>
                
                <div
                  v-for="(limit, index) in spendingLimits"
                  :key="index"
                  class="mb-6"
                >
                  <div class="d-flex justify-space-between mb-2">
                    <span class="text-subtitle-1 font-weight-medium">{{ limit.category }}</span>
                    <span class="text-subtitle-1">
                      <span class="font-weight-bold">{{ formatNumber(limit.current) }}</span>
                      <span class="text-medium-emphasis">of {{ formatNumber(limit.max) }}€</span>
                    </span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
            
            <!-- Upcoming Payments -->
            <v-card
              rounded="xl"
              flat
              border
            >
              <v-card-text class="pa-6">
                <h2 class="text-h5 font-weight-medium text-primary mb-6">
                  Upcoming Payments
                </h2>
                
                <div class="upcoming-payments">
                  <div
                    v-for="(payment, index) in upcomingPayments"
                    :key="index"
                    class="upcoming-payment-item d-flex align-center"
                  >
                    <div class="payment-icon-container mr-4">
                      <v-icon color="white">
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
                    <div class="payment-amount font-weight-bold">
                      {{ payment.amount }}€
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    
    <!-- Add Expense Dialog -->
    <v-dialog
      v-model="showAddExpenseDialog"
      max-width="500px"
    >
      <v-card
        rounded="xl"
        flat
        border
      >
        <v-card-title class="text-h5 font-weight-medium pt-6 pb-2 px-6">
          Add New Expense
        </v-card-title>
        
        <v-card-text class="px-6">
          <v-form
            ref="expenseForm"
            @submit.prevent="addNewExpense"
          >
            <v-select
              v-model="newExpense.category"
              :items="availableCategories"
              label="Category"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :rules="[v => !!v || 'Category is required']"
              required
            />
            
            <v-text-field
              v-model="newExpense.amount"
              label="Amount (€)"
              variant="outlined"
              density="comfortable"
              type="number"
              class="mb-4"
              :rules="[
                v => !!v || 'Amount is required',
                v => v > 0 || 'Amount must be greater than 0'
              ]"
              required
            />
            
            <v-text-field
              v-model="newExpense.date"
              label="Date"
              type="date"
              variant="outlined"
              density="comfortable"
              class="mb-4"
              :rules="[v => !!v || 'Date is required']"
              required
            />
          </v-form>
        </v-card-text>
        
        <v-card-actions class="px-6 pb-6">
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            class="mr-2"
            @click="showAddExpenseDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            rounded="lg"
            @click="addNewExpense"
          >
            Add Expense
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import LeftMenu from '@/dashboard/LeftMenu.vue';
import SearchBar from '@/dashboard/SearchBar.vue';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'vue-chartjs';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default defineComponent({
  name: 'FinanceDashboard',
  components: {
    LeftMenu,
    SearchBar,
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
          backgroundColor: '#4B9E91',
          data: incomeData,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
          borderRadius: 8
        },
        {
          label: 'Expenses',
          backgroundColor: '#95B5E0',
          data: expenseData,
          barPercentage: 0.5,
          categoryPercentage: 0.7,
          borderRadius: 8
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
          intersect: false,
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value / 1000 + 'k';
            },
            stepSize: 10000,
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.04)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 12
            }
          }
        }
      }
    };
    
    // Expense categories for doughnut chart
    const expenseCategories = [
      { name: 'Food', percentage: 37.5, color: '#4B9E91' },
      { name: 'Clothes', percentage: 16.7, color: '#C7D2FE' },
      { name: 'Transport', percentage: 16.7, color: '#818CF8' },
      { name: 'Subscriptions', percentage: 12.5, color: '#3B75D9' },
      { name: 'Bills', percentage: 8.3, color: '#65C7D9' },
      { name: 'Hobby', percentage: 8.3, color: '#1E6A85' }
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
          },
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            size: 13
          }
        }
      },
      cutout: '75%'
    };
    
    // Recent transactions
    const recentTransactions = ref([
      { 
        category: 'Food', 
        date: '1st December, 2023', 
        amount: '-245.00', 
        icon: 'mdi-food', 
        iconColor: '#4B9E91'
      },
      { 
        category: 'Cafe', 
        date: '30th November, 2023', 
        amount: '-665.12', 
        icon: 'mdi-coffee', 
        iconColor: '#C7D2FE'
      },
      { 
        category: 'Internet', 
        date: '29th November, 2023', 
        amount: '-235.12', 
        icon: 'mdi-web', 
        iconColor: '#818CF8'
      },
      { 
        category: 'Transport', 
        date: '27th November, 2023', 
        amount: '-336.12', 
        icon: 'mdi-car', 
        iconColor: '#3B75D9'
      }
    ]);
    
    // Spending limits
    const spendingLimits = [
      { category: 'Food & Cafe', current: 4832, max: 10000, color: '#4B9E91' },
      { category: 'Clothes', current: 2254, max: 3000, color: '#818CF8' },
      { category: 'Games', current: 2000, max: 2000, color: '#3B75D9' },
      { category: 'Board games', current: 1111, max: 4000, color: '#65C7D9' }
    ];
    
    // Upcoming payments
    const upcomingPayments = [
      { 
        service: 'Upwork', 
        date: '13th December', 
        amount: '235', 
        icon: 'mdi-briefcase-outline', 
        iconColor: '#4B9E91' 
      },
      { 
        service: 'Freelancer.com', 
        date: '21th December', 
        amount: '265', 
        icon: 'mdi-account-tie', 
        iconColor: '#C7D2FE' 
      },
      { 
        service: 'ChatGPT', 
        date: '26th December', 
        amount: '176', 
        icon: 'mdi-robot', 
        iconColor: '#818CF8' 
      },
      { 
        service: 'Claude', 
        date: '15th December', 
        amount: '147', 
        icon: 'mdi-message-assistant', 
        iconColor: '#3B75D9' 
      },
      { 
        service: 'Adobe', 
        date: '18th December', 
        amount: '547', 
        icon: 'mdi-adobe', 
        iconColor: '#65C7D9' 
      }
    ];
    
    // Format numbers with spaces for thousands
    const formatNumber = (value) => {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };
    
    // Add Expense Dialog
    const showAddExpenseDialog = ref(false);
    const expenseForm = ref(null);
    
    const newExpense = ref({
      category: '',
      amount: '',
      date: new Date().toISOString().substr(0, 10)
    });
    
    const availableCategories = [
      'Food',
      'Cafe',
      'Transport',
      'Internet',
      'Clothes',
      'Subscriptions',
      'Bills',
      'Hobby'
    ];
    
    // Format date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
      const year = date.getFullYear();
      
      const ordinal = (d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      return `${day}${ordinal(day)} ${month}, ${year}`;
    };
    
    // Open add expense dialog
    const openAddExpenseDialog = () => {
      newExpense.value = {
        category: '',
        amount: '',
        date: new Date().toISOString().substr(0, 10)
      };
      showAddExpenseDialog.value = true;
    };
    
    // Add new expense
    const addNewExpense = () => {
      // Basic validation
      if (!newExpense.value.category || !newExpense.value.amount || !newExpense.value.date) {
        return;
      }
      
      // Create new transaction
      const transaction = {
        category: newExpense.value.category,
        date: formatDate(newExpense.value.date),
        amount: `-${parseFloat(newExpense.value.amount).toFixed(2)}`,
        icon: getCategoryIcon(newExpense.value.category),
        iconColor: getCategoryColor(newExpense.value.category)
      };
      
      // Add to transactions
      recentTransactions.value.unshift(transaction);
      
      // Close dialog
      showAddExpenseDialog.value = false;
    };
    
    // Get category icon
    const getCategoryIcon = (category) => {
      const categoryIcons = {
        'Food': 'mdi-food',
        'Cafe': 'mdi-coffee',
        'Transport': 'mdi-car',
        'Internet': 'mdi-web',
        'Clothes': 'mdi-hanger',
        'Subscriptions': 'mdi-account-cash',
        'Bills': 'mdi-file-document',
        'Hobby': 'mdi-gamepad-variant'
      };
      
      return categoryIcons[category] || 'mdi-cash';
    };
    
    // Get category color
    const getCategoryColor = (category) => {
      const categoryColors = {
        'Food': '#4B9E91',
        'Cafe': '#C7D2FE',
        'Transport': '#818CF8',
        'Internet': '#3B75D9',
        'Clothes': '#65C7D9',
        'Subscriptions': '#1E6A85',
        'Bills': '#4B9E91',
        'Hobby': '#C7D2FE'
      };
      
      return categoryColors[category] || '#4B9E91';
    };
    
    // Delete transaction
    const deleteTransaction = (index) => {
      recentTransactions.value.splice(index, 1);
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
      formatNumber,
      showAddExpenseDialog,
      expenseForm,
      newExpense,
      availableCategories,
      openAddExpenseDialog,
      addNewExpense,
      deleteTransaction
    };
  }
});
</script>

<style scoped>


:deep(.left-menu-component),
  :deep(.v-navigation-drawer) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    height: 100vh !important;
    z-index: 999 !important;
    overflow-y: hidden !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  }
 :deep(.v-navigation-drawer--rail) {
    width: 72px ;
  }
  
  :deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
    width: 240px !important;
  }


.bg-surface-subtle {
  background-color: #f9fafb !important;
}

/* Summary cards styling */
.summary-card {
  background-color: white;
  border-radius: 16px;
  height: 100%;
  border-color: rgba(0, 0, 0, 0.08) !important;
}

/* Text color classes */
.text-success {
  color: #10B981 !important;
}

.text-error {
  color: #EF4444 !important;
}

.text-primary {
  color: #1E293B !important;
}

/* Chart and visualization components */
.chart-container {
  width: 100%;
  height: 100%;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}

.primary-dot {
  background-color: #4B9E91;
}

.light-blue-dot {
  background-color: #95B5E0;
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
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 12px;
}

.transaction-row {
  padding: 14px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
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
  width: 100px;
  text-align: right;
  font-weight: 500;
}

.transaction-column-actions {
  width: 60px;
  text-align: right;
}

.transaction-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: var(--v-primary-base);
}

.transaction-row:nth-child(1) .transaction-icon-container {
  background-color: #4B9E91;
}

.transaction-row:nth-child(2) .transaction-icon-container {
  background-color: #C7D2FE;
}

.transaction-row:nth-child(3) .transaction-icon-container {
  background-color: #818CF8;
}

.transaction-row:nth-child(4) .transaction-icon-container {
  background-color: #3B75D9;
}

.transaction-delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.transaction-row:hover .transaction-delete-btn {
  opacity: 1;
}

/* Upcoming payments styling */
.upcoming-payments {
  width: 100%;
}

.upcoming-payment-item {
  padding: 14px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
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
  border-radius: 10px;
}

.upcoming-payment-item:nth-child(1) .payment-icon-container {
  background-color: #4B9E91;
}

.upcoming-payment-item:nth-child(2) .payment-icon-container {
  background-color: #C7D2FE;
}

.upcoming-payment-item:nth-child(3) .payment-icon-container {
  background-color: #818CF8;
}

.upcoming-payment-item:nth-child(4) .payment-icon-container {
  background-color: #3B75D9;
}

.upcoming-payment-item:nth-child(5) .payment-icon-container {
  background-color: #65C7D9;
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



/* Card styling */
:deep(.v-card) {
  transition: transform 0.2s ease;
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
}

:deep(.v-btn) {
  letter-spacing: 0.5px;
  font-weight: 500;
}

:deep(.v-btn--icon) {
  border-radius: 10px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .transaction-column-date {
    display: none;
  }
  
  .summary-card {
    margin-bottom: 16px;
  }
}

@media (max-width: 600px) {
  .text-h3 {
    font-size: 1.75rem !important;
  }
  
  .text-h4 {
    font-size: 1.5rem !important;
  }
  
  .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .pa-6 {
    padding: 16px !important;
  }
}
</style>