<!-- FinanceDashboard.vue -->
<template>
  <v-app>
    <LeftMenu 
      сlass="left-menu-component"
    />
    <SearchBar />
    
    <v-main class="main-content">
      <!-- Hero Section -->
      <div class="hero-section">
        <v-container fluid class="px-6 py-8">
          <div class="hero-content">
            <div class="title-section">
              <h1 class="hero-title">
                <span class="gradient-text">Finance</span> Overview
              </h1>
              <p class="hero-subtitle">
                Track your financial performance and manage your expenses
              </p>
            </div>
          </div>
        </v-container>
      </div>

      <v-container fluid class="content-container px-6 pb-8">
        <!-- Summary Cards Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="primary">mdi-chart-line</v-icon>
              <h2 class="section-heading">Financial Summary</h2>
            </div>
            <v-chip
              size="small"
              color="primary"
              variant="outlined"
              class="count-chip"
            >
              3 metrics
            </v-chip>
          </div>
          
          <div class="summary-grid">
            <!-- Total Balance Card -->
            <div class="summary-item">
              <div class="summary-card">
                <div class="summary-icon-wrapper">
                  <v-icon class="summary-icon" color="white">mdi-wallet</v-icon>
                </div>
                <div class="summary-info">
                  <h3 class="summary-title">Total Balance</h3>
                  <div class="summary-amount">32,363.75€</div>
                  <div class="summary-change positive">
                    <v-icon size="small">mdi-arrow-up-thin</v-icon>
                    +3.3% than last month
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Income Card -->
            <div class="summary-item">
              <div class="summary-card income-card">
                <div class="summary-icon-wrapper income-icon">
                  <v-icon class="summary-icon" color="white">mdi-trending-up</v-icon>
                </div>
                <div class="summary-info">
                  <h3 class="summary-title">Income</h3>
                  <div class="summary-amount income-amount">+30,645€</div>
                  <div class="summary-change positive">
                    <v-icon size="small">mdi-arrow-up-thin</v-icon>
                    +1.2% than last month
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Expenses Card -->
            <div class="summary-item">
              <div class="summary-card expense-card">
                <div class="summary-icon-wrapper expense-icon">
                  <v-icon class="summary-icon" color="white">mdi-trending-down</v-icon>
                </div>
                <div class="summary-info">
                  <h3 class="summary-title">Expenses</h3>
                  <div class="summary-amount expense-amount">-21,465.90€</div>
                  <div class="summary-change negative">
                    <v-icon size="small">mdi-arrow-down-thin</v-icon>
                    -8.3% than last month
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="warning">mdi-chart-bar</v-icon>
              <h2 class="section-heading">Financial Charts</h2>
            </div>
            <v-chip
              size="small"
              color="warning"
              variant="outlined"
              class="count-chip"
            >
              2 charts
            </v-chip>
          </div>
          
          <div class="charts-grid">
            <!-- Income & Expenses Chart -->
            <div class="chart-item">
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">Income & Expenses</h3>
                  <v-select
                    v-model="selectedTimeframe"
                    :items="timeframes"
                    label="Time Period"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="max-width: 150px"
                    bg-color="surface"
                    class="chart-select"
                  />
                </div>
                <div class="chart-container" style="position: relative; height: 320px;">
                  <bar-chart 
                    v-if="chartDataLoaded"
                    :data="incomeExpenseData" 
                    :options="barChartOptions"
                  />
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-dot income-dot"></div>
                    <span>Income</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-dot expense-dot"></div>
                    <span>Expenses</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Expenses by Category Chart -->
            <div class="chart-item">
              <div class="chart-card">
                <div class="chart-header">
                  <h3 class="chart-title">Expenses by Categories</h3>
                  <v-select
                    v-model="selectedExpenseView"
                    :items="expenseViews"
                    label="View"
                    variant="outlined"
                    density="compact"
                    hide-details
                    style="max-width: 150px"
                    bg-color="surface"
                    class="chart-select"
                  />
                </div>
                <div class="chart-container" style="position: relative; height: 320px;">
                  <doughnut-chart 
                    v-if="chartDataLoaded"
                    :data="expensesByCategoryData" 
                    :options="doughnutOptions"
                  />
                  <div class="chart-center-text">
                    <div class="center-label">Food</div>
                    <div class="center-amount">-7,654.57€</div>
                  </div>
                </div>
                <div class="category-legend">
                  <div
                    v-for="(category, index) in expenseCategories"
                    :key="index"
                    class="category-item"
                  >
                    <div class="category-dot" :style="{ backgroundColor: category.color }"></div>
                    <span class="category-name">{{ category.name }}</span>
                    <span class="category-percentage">{{ category.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="success">mdi-credit-card</v-icon>
              <h2 class="section-heading">Recent Transactions</h2>
            </div>
            <div class="section-actions">
              <v-chip
                size="small"
                color="success"
                variant="outlined"
                class="count-chip"
              >
                {{ recentTransactions.length }} transactions
              </v-chip>
              <v-btn
                color="success"
                variant="outlined"
                size="small"
                rounded="lg"
                class="ml-2"
                @click="openAddExpenseDialog"
              >
                <v-icon size="small" class="mr-1">mdi-plus</v-icon>
                Add Transaction
              </v-btn>
            </div>
          </div>
          
          <div class="transactions-grid">
            <div 
              v-for="(transaction, index) in recentTransactions" 
              :key="index"
              class="transaction-item"
            >
              <div class="transaction-card">
                <div class="transaction-icon-wrapper">
                  <v-icon class="transaction-icon" color="white">
                    {{ transaction.icon }}
                  </v-icon>
                </div>
                <div class="transaction-info">
                  <h3 class="transaction-title">{{ transaction.category }}</h3>
                  <div class="transaction-date">{{ transaction.date }}</div>
                </div>
                <div class="transaction-actions">
                  <div class="transaction-amount" :class="transaction.amount.startsWith('-') ? 'negative' : 'positive'">
                    {{ transaction.amount }}€
                  </div>
                  <v-btn
                    icon
                    size="small"
                    color="error"
                    variant="text"
                    class="delete-btn"
                    @click="deleteTransaction(index)"
                  >
                    <v-icon size="small">mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info Section -->
        <div class="tool-section">
          <div class="section-header">
            <div class="section-title">
              <v-icon class="section-icon" color="info">mdi-information</v-icon>
              <h2 class="section-heading">Financial Management</h2>
            </div>
            <v-chip
              size="small"
              color="info"
              variant="outlined"
              class="count-chip"
            >
              2 sections
            </v-chip>
          </div>
          
          <div class="management-grid">
            <!-- Spending Limits -->
            <div class="management-item">
              <div class="management-card">
                <div class="management-header">
                  <h3 class="management-title">Spending Limits</h3>
                  <v-btn icon size="small" color="primary" variant="text">
                    <v-icon>mdi-cog</v-icon>
                  </v-btn>
                </div>
                <div class="limits-list">
                  <div
                    v-for="(limit, index) in spendingLimits"
                    :key="index"
                    class="limit-item"
                  >
                    <div class="limit-info">
                      <span class="limit-category">{{ limit.category }}</span>
                      <span class="limit-amount">
                        <span class="current">{{ formatNumber(limit.current) }}</span>
                        <span class="max">of {{ formatNumber(limit.max) }}€</span>
                      </span>
                    </div>
                    <div class="limit-progress">
                      <v-progress-linear
                        :model-value="(limit.current / limit.max) * 100"
                        height="8"
                        rounded
                        :color="(limit.current / limit.max) > 0.8 ? 'error' : 'primary'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Upcoming Payments -->
            <div class="management-item">
              <div class="management-card">
                <div class="management-header">
                  <h3 class="management-title">Upcoming Payments</h3>
                </div>
                <div class="payments-list">
                  <div
                    v-for="(payment, index) in upcomingPayments"
                    :key="index"
                    class="payment-item"
                  >
                    <div class="payment-icon-wrapper">
                      <v-icon class="payment-icon" color="white">{{ payment.icon }}</v-icon>
                    </div>
                    <div class="payment-info">
                      <h4 class="payment-service">{{ payment.service }}</h4>
                      <div class="payment-date">{{ payment.date }}</div>
                    </div>
                    <div class="payment-amount">{{ payment.amount }}€</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>
    
    <!-- Add Expense Dialog -->
    <v-dialog
      v-model="showAddExpenseDialog"
      max-width="500px"
    >
      <v-card rounded="xl" flat border>
        <v-card-title class="text-h5 font-weight-medium pt-6 pb-2 px-6">
          Add New Expense
        </v-card-title>
        
        <v-card-text class="px-6">
          <v-form ref="expenseForm" @submit.prevent="addNewExpense">
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
  width: 72px;
}

:deep(.v-navigation-drawer:not(.v-navigation-drawer--rail)) {
  width: 240px !important;
}

/* Main Layout - Same as Design Tools */
.main-content {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  min-height: 100vh;
}

/* Hero Section - Same as Design Tools */
.hero-section {
  background: linear-gradient(135deg, #064E47 0%, #0D7C66 50%, #41B3A2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><circle cx="30" cy="30" r="2"/></g></svg>');
  pointer-events: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.title-section {
  flex: 1;
  min-width: 300px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA726);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 1rem 0 0 0;
  font-weight: 400;
}

/* Content Container - Same as Design Tools */
.content-container {
  background: #f8fafc;
  margin-top: -2rem;
  border-radius: 2rem 2rem 0 0;
  position: relative;
  z-index: 2;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
}

/* Tool Sections - Same as Design Tools */
.tool-section {
  margin-bottom: 3rem;
}

.tool-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.8rem;
}

.section-heading {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.01em;
}

.count-chip {
  font-weight: 600;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Summary Cards Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.summary-item {
  position: relative;
}

.summary-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.summary-card:hover::before {
  opacity: 1;
}

.summary-icon-wrapper {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  transition: all 0.3s ease;
}

.income-icon {
  background: linear-gradient(135deg, #10B981, #34D399) !important;
}

.expense-icon {
  background: linear-gradient(135deg, #EF4444, #F87171) !important;
}

.summary-card:hover .summary-icon-wrapper {
  transform: scale(1.05);
}

.summary-icon {
  font-size: 1.5rem;
}

.summary-info {
  flex: 1;
  min-width: 0;
}

.summary-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.summary-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.income-amount {
  color: #10B981 !important;
}

.expense-amount {
  color: #EF4444 !important;
}

.summary-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.summary-change.positive {
  color: #10B981;
}

.summary-change.negative {
  color: #EF4444;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-item {
  position: relative;
}

.chart-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.chart-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.chart-card:hover::before {
  opacity: 1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.chart-select {
  min-width: 120px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #64748b;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.income-dot {
  background-color: #4B9E91;
}

.expense-dot {
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

.center-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.center-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #EF4444;
  margin-top: 0.25rem;
}

.category-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.category-name {
  font-weight: 500;
  color: #1e293b;
}

.category-percentage {
  color: #64748b;
}

/* Transactions Grid */
.transactions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.transaction-item {
  position: relative;
}

.transaction-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.transaction-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.transaction-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.transaction-card:hover::before {
  opacity: 1;
}

.transaction-icon-wrapper {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
  transition: all 0.3s ease;
}

.transaction-card:nth-child(1) .transaction-icon-wrapper {
  background: linear-gradient(135deg, #4B9E91, #41B3A2);
}

.transaction-card:nth-child(2) .transaction-icon-wrapper {
  background: linear-gradient(135deg, #C7D2FE, #A5B4FC);
}

.transaction-card:nth-child(3) .transaction-icon-wrapper {
  background: linear-gradient(135deg, #818CF8, #6366F1);
}

.transaction-card:nth-child(4) .transaction-icon-wrapper {
  background: linear-gradient(135deg, #3B75D9, #2563EB);
}

.transaction-card:hover .transaction-icon-wrapper {
  transform: scale(1.05);
}

.transaction-icon {
  font-size: 1.25rem;
}

.transaction-info {
  flex: 1;
  min-width: 0;
}

.transaction-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.transaction-date {
  font-size: 0.875rem;
  color: #64748b;
}

.transaction-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.transaction-amount {
  font-size: 1.125rem;
  font-weight: 700;
}

.transaction-amount.positive {
  color: #10B981;
}

.transaction-amount.negative {
  color: #EF4444;
}

.delete-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.transaction-card:hover .delete-btn {
  opacity: 1;
}

/* Management Grid */
.management-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.management-item {
  position: relative;
}

.management-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.management-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(6, 78, 71, 0.08) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.management-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #0D7C66;
}

.management-card:hover::before {
  opacity: 1;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.management-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* Spending Limits */
.limits-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.limit-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.limit-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.limit-category {
  font-weight: 600;
  color: #1e293b;
}

.limit-amount .current {
  font-weight: 700;
  color: #1e293b;
}

.limit-amount .max {
  color: #64748b;
  font-size: 0.875rem;
}

.limit-progress {
  width: 100%;
}

/* Upcoming Payments */
.payments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.payment-item:last-child {
  border-bottom: none;
}

.payment-icon-wrapper {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #0D7C66, #41B3A2);
}

.payment-item:nth-child(1) .payment-icon-wrapper {
  background: linear-gradient(135deg, #4B9E91, #41B3A2);
}

.payment-item:nth-child(2) .payment-icon-wrapper {
  background: linear-gradient(135deg, #C7D2FE, #A5B4FC);
}

.payment-item:nth-child(3) .payment-icon-wrapper {
  background: linear-gradient(135deg, #818CF8, #6366F1);
}

.payment-item:nth-child(4) .payment-icon-wrapper {
  background: linear-gradient(135deg, #3B75D9, #2563EB);
}

.payment-item:nth-child(5) .payment-icon-wrapper {
  background: linear-gradient(135deg, #65C7D9, #0891B2);
}

.payment-icon {
  font-size: 1.125rem;
}

.payment-info {
  flex: 1;
  min-width: 0;
}

.payment-service {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.payment-date {
  font-size: 0.75rem;
  color: #64748b;
}

.payment-amount {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
}

/* Animation - Same as Design Tools */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tool-section {
  animation: fadeInUp 0.6s ease-out;
}

.tool-section:nth-child(2) {
  animation-delay: 0.1s;
}

.tool-section:nth-child(3) {
  animation-delay: 0.2s;
}

.tool-section:nth-child(4) {
  animation-delay: 0.3s;
}

.tool-section:nth-child(5) {
  animation-delay: 0.4s;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .summary-grid,
  .charts-grid,
  .transactions-grid,
  .management-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .content-container {
    margin-top: -1rem;
    border-radius: 1.5rem 1.5rem 0 0;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .section-actions {
    align-self: stretch;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .summary-card,
  .chart-card,
  .transaction-card,
  .management-card {
    padding: 1rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .chart-select {
    min-width: auto;
  }
  
  .category-legend {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>