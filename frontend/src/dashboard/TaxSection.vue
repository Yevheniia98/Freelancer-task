<template>
  <div class="tax-calculator-container">
    <div class="tax-calculator-card">
      <h2 class="card-title">
        Tax calculator
      </h2>
        
      <div class="form-group">
        <label>Which country do you live in?</label>
        <div class="select-container">
          <select
            v-model="country"
            class="form-select"
          >
            <option value="Germany">
              Germany
            </option>
            <option value="France">
              France
            </option>
            <option value="Spain">
              Spain
            </option>
            <option value="Italy">
              Italy
            </option>
          </select>
          <span class="select-arrow">&#9662;</span>
        </div>
      </div>
        
      <div
        v-if="country === 'Germany'"
        class="form-group"
      >
        <label>What state do you live in?</label>
        <div class="select-container">
          <select
            v-model="state"
            class="form-select"
          >
            <option value="Thuringia">
              Thuringia
            </option>
            <option value="Schleswig-H.">
              Schleswig-H.
            </option>
            <option value="Sachsen-Anh.">
              Sachsen-Anh.
            </option>
            <option value="Sachsen">
              Sachsen
            </option>
            <option value="Saarland">
              Saarland
            </option>
            <option value="Rheinl.-Pfalz">
              Rheinl.-Pfalz
            </option>
            <option value="Nord.-Westf.">
              Nord.-Westf.
            </option>
            <option value="Niedersachsen">
              Niedersachsen
            </option>
            <option value="Hessen">
              Hessen
            </option>
            <option value="Hamburg">
              Hamburg
            </option>
            <option value="Bremen">
              Bremen
            </option>
            <option value="Brandenburg">
              Brandenburg
            </option>
            <option value="Berlin">
              Berlin
            </option>
            <option value="Bayern">
              Bayern
            </option>
            <option value="Baden-Württ.">
              Baden-Württ.
            </option>
          </select>
          <span class="select-arrow">&#9662;</span>
        </div>
      </div>
        
      <div class="form-group">
        <label>Tax Category:</label>
        <div class="select-container">
          <select
            v-model="taxCategory"
            class="form-select"
          >
            <option value="Category 1">
              Category 1
            </option>
            <option value="Category 2">
              Category 2
            </option>
            <option value="Category 3">
              Category 3
            </option>
            <option value="Category 4">
              Category 4
            </option>
            <option value="Category 5">
              Category 5
            </option>
            <option value="Category 6">
              Category 6
            </option>
          </select>
          <span class="select-arrow">&#9662;</span>
        </div>
      </div>
    </div>
      
    <div class="tax-breakdown-card">
      <div class="salary-input">
        <label>Salary:</label>
        <div class="input-group">
          <input
            v-model="salary"
            type="number"
            class="form-input"
          >
          <span class="currency">$</span>
          <div class="select-container period-select">
            <select
              v-model="salaryPeriod"
              class="form-select"
            >
              <option value="month">
                month
              </option>
              <option value="year">
                year
              </option>
            </select>
            <span class="select-arrow">&#9662;</span>
          </div>
        </div>
      </div>
        
      <!-- Tax Visualization - Pie Chart -->
      <div class="tax-visualization">
        <svg viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="#f5f5f5"
            stroke="#ddd"
            stroke-width="1"
          />
          <path 
            v-for="(slice, index) in pieSlices" 
            :key="index" 
            :d="slice.path" 
            :fill="slice.color"
          />
        </svg>
      </div>

      <!-- Tax Breakdown Legend -->
      <div class="tax-breakdown-legend">
        <div
          v-for="(tax, key) in filteredTaxBreakdown"
          :key="key"
          class="legend-item"
        >
          <span
            class="legend-color"
            :style="{ backgroundColor: colors[key], borderRadius: '50%', width: '10px', height: '10px', display: 'inline-block' }"
          />
          <span class="legend-label">{{ getTaxLabel(key) }} {{ tax.percentage.toFixed(2) }}%</span>
          <span class="legend-dot" />
        </div>
      </div>
      
        
      <!-- Net Salary Display -->
      <div class="net-salary-result">
        <div class="net-label">
          Net Salary:
        </div>
        <div class="net-amount">
          {{ formatCurrency(taxBreakdown.netSalary.amount) }} €
        </div>
      </div>
    </div>

      
    <div class="balance-card">
      <h2 class="card-title">
        My balance
      </h2>
      
      <!-- Loading state -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading financial data...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadFinancialData" class="retry-button">
          Retry
        </button>
      </div>

      <!-- Balance display -->
      <div v-else>
        <div class="balance-amount">
          <span class="currency-symbol">$</span>
          <span class="amount">{{ totalBalance.toLocaleString() }}</span>
        </div>
        <div class="balance-period">
          Income in this month: ${{ monthlyEarnings.toLocaleString() }}
        </div>
        
        <!-- Real platform earnings -->
        <div class="income-sources">
          <div 
            v-for="platform in platformEarnings" 
            :key="platform.name"
            class="income-source"
          >
            <div
              class="source-logo"
              :style="{ backgroundColor: platform.color }"
            >
              <span>{{ platform.logo }}</span>
            </div>
            <div class="source-details">
              <div class="source-name">
                {{ platform.name }}
              </div>
              <div class="source-progress-container">
                <div
                  class="source-progress"
                  :style="{ width: platform.percentage + '%' }"
                />
              </div>
            </div>
            <div class="source-amount">
              ${{ platform.amount.toLocaleString() }}
            </div>
          </div>

          <!-- Show message if no platforms connected -->
          <div v-if="platformEarnings.length === 0" class="no-platforms">
            <p>No platforms connected</p>
            <small>Connect your freelance platforms to see real earnings data</small>
            
            <!-- Platform connection buttons -->
            <div class="platform-connect-buttons">
              <button 
                @click="connectPlatform('upwork')"
                class="connect-button upwork"
                :disabled="syncing"
              >
                <span class="button-icon">💼</span>
                Connect Upwork
              </button>
              <button 
                @click="connectPlatform('freelancer')"
                class="connect-button freelancer"
                :disabled="syncing"
              >
                <span class="button-icon">👔</span>
                Connect Freelancer
              </button>
              <button 
                @click="connectPlatform('fiverr')"
                class="connect-button fiverr"
                :disabled="syncing"
              >
                <span class="button-icon">🛍️</span>
                Connect Fiverr
              </button>
            </div>
          </div>

          <!-- Sync button if platforms connected -->
          <div v-if="platformEarnings.length > 0" class="sync-section">
            <button 
              @click="syncAllPlatforms" 
              class="sync-button"
              :disabled="syncing"
            >
              <span v-if="!syncing">🔄 Sync Earnings</span>
              <span v-else>⏳ Syncing...</span>
            </button>
            <small v-if="financialSummary?.platforms?.[0]?.lastSynced" class="last-synced">
              Last synced: {{ formatDate(financialSummary.platforms[0].lastSynced) }}
            </small>
          </div>
        </div>

        <!-- Financial statistics -->
        <div v-if="financialSummary" class="financial-stats">
          <div class="stat-item">
            <span class="stat-label">Total Projects:</span>
            <span class="stat-value">{{ financialSummary.statistics?.totalProjects || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Projects:</span>
            <span class="stat-value">{{ financialSummary.statistics?.activeProjects || 0 }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Monthly Growth:</span>
            <span class="stat-value" :class="{ positive: (financialSummary.statistics?.monthlyGrowth || 0) > 0, negative: (financialSummary.statistics?.monthlyGrowth || 0) < 0 }">
              {{ (financialSummary.statistics?.monthlyGrowth || 0).toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
    


<script>
import { ref, onMounted, computed } from 'vue';
import financialService from '@/services/financialService';

export default {
  name: "TaxCalculator",
  setup() {
    // Tax calculator data
    const country = ref("Germany");
    const state = ref("");
    const taxCategory = ref(1);
    const salary = ref(0);
    const salaryPeriod = ref("month");

    // Financial data
    const financialSummary = ref(null);
    const loading = ref(false);
    const error = ref(null);
    const syncing = ref(false);

    // Colors for tax breakdown
    const colors = {
      incomeTax: "#e74c3c",
      pension: "#f1c40f",
      unemployment: "#3498db",
      health: "#9b59b6",
      care: "#795548",
      netSalary: "#009688",
    };

    // Load financial data
    const loadFinancialData = async () => {
      try {
        loading.value = true;
        error.value = null;
        financialSummary.value = await financialService.getFinancialSummary();
      } catch (err) {
        console.error('Failed to load financial data:', err);
        error.value = 'Failed to load financial data. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    // Connect platform via OAuth
    const connectPlatform = async (platform) => {
      try {
        const authUrl = await financialService.connectPlatform(platform);
        // Open OAuth flow in popup or redirect
        window.location.href = authUrl;
      } catch (err) {
        console.error(`Failed to connect ${platform}:`, err);
        alert(`Failed to connect ${platform}. Please try again.`);
      }
    };

    // Sync all platforms
    const syncAllPlatforms = async () => {
      try {
        syncing.value = true;
        await financialService.syncAllPlatforms();
        // Reload financial data
        await loadFinancialData();
      } catch (err) {
        console.error('Failed to sync platforms:', err);
        alert('Failed to sync earnings. Please try again.');
      } finally {
        syncing.value = false;
      }
    };

    // Format date helper
    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleString();
    };

    // Check for OAuth callback success
    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const connected = urlParams.get('connected');
      const error = urlParams.get('error');
      
      if (connected) {
        alert(`Successfully connected to ${connected}!`);
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        // Trigger sync
        syncAllPlatforms();
      } else if (error) {
        alert(`Connection failed: ${error}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      loadFinancialData();
    });

    // Computed properties for financial display
    const totalBalance = computed(() => {
      return financialSummary.value?.totalBalance || 0;
    });

    const monthlyEarnings = computed(() => {
      return financialSummary.value?.totalEarnings?.thisMonth || 0;
    });

    const platformEarnings = computed(() => {
      if (!financialSummary.value?.platforms) return [];
      
      return financialSummary.value.platforms.map(platform => {
        const platformInfo = financialService.getPlatformInfo(platform.platform);
        const maxEarnings = Math.max(...financialSummary.value.platforms.map(p => p.earnings.thisMonth));
        const percentage = maxEarnings > 0 ? (platform.earnings.thisMonth / maxEarnings) * 100 : 0;
        
        return {
          name: platformInfo.name,
          amount: platform.earnings.thisMonth,
          percentage: Math.round(percentage),
          color: platformInfo.color,
          logo: platform.platform.charAt(0).toUpperCase()
        };
      }).filter(p => p.amount > 0);
    });

    // Load data on mount
    onMounted(() => {
      loadFinancialData();
    });

    return {
      // Tax calculator
      country,
      state,
      taxCategory,
      salary,
      salaryPeriod,
      colors,
      
      // Financial data
      financialSummary,
      loading,
      error,
      syncing,
      totalBalance,
      monthlyEarnings,
      platformEarnings,
      loadFinancialData,
      connectPlatform,
      syncAllPlatforms,
      formatDate
    };
  },
  data() {
    return {
      colors: {
        incomeTax: "#e74c3c",
        pension: "#f1c40f",
        unemployment: "#3498db",
        health: "#9b59b6",
        care: "#795548",
        netSalary: "#009688",
      },
      taxRules: {
        Germany: {
          incomeTaxBrackets: [
            { limit: 10908, rate: 0 },
            { limit: 15260, rate: 0.14, base: 0 },
            { limit: 58596, rate: 0.24, base: 200, previous: 15260 },
            { limit: 277825, rate: 0.42, base: 8000, previous: 58596 },
            { limit: Infinity, rate: 0.45, base: 120000, previous: 277825 }
          ],
          pensionRate: 0.093,
          pensionMax: 7050,
          unemploymentRate: 0.012,
          unemploymentMax: 912,
          healthRate: 0.073,
          healthMax: 5550,
          careRate: 0.015,
          careMax: 1140
        },
        Italy: {
          incomeTaxBrackets: [
            { limit: 15000, rate: 0.23 },
            { limit: 28000, rate: 0.27, base: 3450, previous: 15000 },
            { limit: 55000, rate: 0.38, base: 7035, previous: 28000 },
            { limit: Infinity, rate: 0.43, base: 17290, previous: 55000 }
          ],
          pensionRate: 0.10,
          pensionMax: 8000,
          unemploymentRate: 0.015,
          unemploymentMax: 1000,
          healthRate: 0.065,
          healthMax: 5000,
          careRate: 0.005,
          careMax: 500
        },
        France: {
          incomeTaxBrackets: [
            { limit: 10084, rate: 0 },
            { limit: 25710, rate: 0.11, base: 0 },
            { limit: 73516, rate: 0.30, base: 1770, previous: 25710 },
            { limit: 158122, rate: 0.41, base: 17922, previous: 73516 },
            { limit: Infinity, rate: 0.45, base: 38515, previous: 158122 }
          ],
          pensionRate: 0.11,
          pensionMax: 8000,
          unemploymentRate: 0.021,
          unemploymentMax: 1500,
          healthRate: 0.08,
          healthMax: 6000,
          careRate: 0.006,
          careMax: 600
        },
        Spain: {
          incomeTaxBrackets: [
            { limit: 12450, rate: 0.19 },
            { limit: 20200, rate: 0.24, base: 2365.50, previous: 12450 },
            { limit: 35200, rate: 0.30, base: 4377.50, previous: 20200 },
            { limit: 60000, rate: 0.37, base: 7472.50, previous: 35200 },
            { limit: Infinity, rate: 0.45, base: 17472.50, previous: 60000 }
          ],
          pensionRate: 0.067,
          pensionMax: 6000,
          unemploymentRate: 0.016,
          unemploymentMax: 1200,
          healthRate: 0.055,
          healthMax: 5500,
          careRate: 0.004,
          careMax: 400
        }
      },
      taxBreakdown: {
        incomeTax: { amount: 0, percentage: 0 },
        pension: { amount: 0, percentage: 0 },
        unemployment: { amount: 0, percentage: 0 },
        health: { amount: 0, percentage: 0 },
        care: { amount: 0, percentage: 0 },
        netSalary: { amount: 0, percentage: 0 },
        total: 0
      },
      pieSlices: []
    };
  },
  mounted() {
    this.calculateTaxes();
    this.loadFinancialData();
  },
        computed: {
        filteredTaxBreakdown() {
            // Create a new object with only the tax components (excluding netSalary and total)
            const taxComponents = ['incomeTax', 'pension', 'unemployment', 'health', 'care'];
            return taxComponents.reduce((acc, key) => {
              acc[key] = this.taxBreakdown[key];
              return acc;
            }, {});
          }
        },
  watch: {
    country() {
      this.calculateTaxes();
    },
    salary() {
      this.calculateTaxes();
    },
    salaryPeriod() {
      this.calculateTaxes();
    },
    taxBreakdown: {
      deep: true,
      handler() {
        this.generatePieChart();
      }
    }
  },


  methods: {
    calculateIncomeTax(annualSalary, country) {
      const rules = this.taxRules[country];
      if (!rules) {
        console.error(`No tax rules found for ${country}`);
        return 0;
      }

      let tax = 0;
      for (const bracket of rules.incomeTaxBrackets) {
        if (annualSalary <= bracket.limit) {
          if (bracket.previous !== undefined) {
            tax = bracket.base + (annualSalary - bracket.previous) * bracket.rate;
          } else {
            tax = annualSalary * bracket.rate;
          }
          break;
        }
      }

      return tax;
    },

    calculateTaxes() {
      // Convert salary to annual if monthly
      const annualSalary = this.salaryPeriod === "month" ? this.salary * 12 : this.salary;
      const rules = this.taxRules[this.country];

      if (!rules) {
        console.error(`No tax rules found for ${this.country}`);
        return;
      }

      // Calculate individual tax components
      const incomeTaxAmount = this.calculateIncomeTax(annualSalary, this.country);
      const pensionAmount = Math.min(annualSalary * rules.pensionRate, rules.pensionMax);
      const unemploymentAmount = Math.min(annualSalary * rules.unemploymentRate, rules.unemploymentMax);
      const healthAmount = Math.min(annualSalary * rules.healthRate, rules.healthMax);
      const careAmount = Math.min(annualSalary * rules.careRate, rules.careMax);

      const totalDeductions = incomeTaxAmount + pensionAmount + unemploymentAmount + healthAmount + careAmount;
      const netSalaryAmount = annualSalary - totalDeductions;

      // Adjust for monthly/annual display
      const factor = this.salaryPeriod === "month" ? 12 : 1;

      // Update tax breakdown
      this.taxBreakdown = {
        incomeTax: { 
          amount: incomeTaxAmount / factor, 
          percentage: (incomeTaxAmount / annualSalary) * 100 
        },
        pension: { 
          amount: pensionAmount / factor, 
          percentage: (pensionAmount / annualSalary) * 100 
        },
        unemployment: { 
          amount: unemploymentAmount / factor, 
          percentage: (unemploymentAmount / annualSalary) * 100 
        },
        health: { 
          amount: healthAmount / factor, 
          percentage: (healthAmount / annualSalary) * 100 
        },
        care: { 
          amount: careAmount / factor, 
          percentage: (careAmount / annualSalary) * 100 
        },
        netSalary: { 
          amount: netSalaryAmount / factor, 
          percentage: (netSalaryAmount / annualSalary) * 100 
        },
        total: annualSalary / factor
      };
      
      this.generatePieChart();
    },

    generatePieChart() {
      const radius = 45;
      const cx = 50;
      const cy = 50;
      
      let startAngle = 0;
      this.pieSlices = [];
      
      // Calculate slices for all tax components (except netSalary)
      const components = ['incomeTax', 'pension', 'unemployment', 'health', 'care'];
      
      components.forEach(key => {
        const percentage = this.taxBreakdown[key].percentage;
        if (percentage > 0) {
          const slice = this.calculatePieSlice(cx, cy, radius, startAngle, percentage, this.colors[key]);
          this.pieSlices.push(slice);
          startAngle += (percentage / 100) * 360;
        }
      });
      
      // Add net salary slice
      const netPercentage = this.taxBreakdown.netSalary.percentage;
      if (netPercentage > 0) {
        const netSlice = this.calculatePieSlice(cx, cy, radius, startAngle, netPercentage, this.colors.netSalary);
        this.pieSlices.push(netSlice);
      }
    },

    calculatePieSlice(cx, cy, radius, startAngle, percentage, color) {
      const angleInDegrees = (percentage / 100) * 360;
      const endAngle = startAngle + angleInDegrees;
      
      // Convert angles to radians
      const startRad = (startAngle - 90) * Math.PI / 180;
      const endRad = (endAngle - 90) * Math.PI / 180;
      
      // Calculate the path
      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);
      
      // Determine if the arc is large (≥180°) or small (<180°)
      const largeArcFlag = angleInDegrees > 180 ? 1 : 0;
      
      // Create the SVG path
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      return { path, color };
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },

    getTaxLabel(key) {
      const labels = {
        incomeTax: "Income Tax",
        pension: "Pension Insurance",
        unemployment: "Unemployment Insurance",
        health: "Health Insurance",
        care: "Care Insurance",
        netSalary: "Net Salary"
      };
      return labels[key] || key;
    }
  }
};
</script>
  
    <style scoped>
    .tax-calculator-container {
      display: flex;
      gap: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Poppins, Oxygen, Ubuntu, sans-serif;
      color: #333;
      margin-top: 50px;
      margin-bottom: 50px;
      height: 400px ;
      margin-left: 0px;
    }
    
    .tax-calculator-card, .tax-breakdown-card, .balance-card {
      background-color: white;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    
    .tax-calculator-card {
      flex: 1;
      max-width: 300px;
    }
    
    .tax-breakdown-card {
      flex: 2;
      max-width: 670px !important;
    }
    
    .balance-card {
      flex: 1;
      max-width: 300px;
    }
    
    .card-title {
      font-size: 18px;
      font-weight: 500;
      color: #555;
      margin-top: 0;
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-group label {
      display: block;
      color: #777;
      font-size: 14px;
      margin-bottom: 8px;
      text-align: left  !important;
    }

    /* Loading and error states */
    .loading-state, .error-state {
      text-align: center;
      padding: 20px;
    }

    .loading-spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #0D7C66;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .retry-button {
      background: #0D7C66;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .retry-button:hover {
      background: #0a6b57;
    }

    .no-platforms {
      text-align: center;
      color: #666;
      padding: 20px;
    }

    .no-platforms small {
      display: block;
      margin-top: 5px;
      color: #999;
    }

    /* Financial statistics */
    .financial-stats {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #e0e0e0;
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
    }

    .stat-value {
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    .stat-value.positive {
      color: #10B981;
    }

    .stat-value.negative {
      color: #EF4444;
    }
    
    .select-container {
      position: relative;
    }
    
    .label {
      text-align: left;
    }

    .form-select {
      width: 100%;
      padding: 10px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background-color: white;
      appearance: none;
      font-size: 14px;
    }
    
    .select-arrow {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #777;
      pointer-events: none;
    }
    
    .salary-input {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .salary-input label {
      margin-right: 16px;
      white-space: nowrap;
      font-size: 14px;
      color: #555;
    }
    
    .input-group {
      display: flex;
      flex: 1;
    }
    
    .form-input {
      flex: 1;
      padding: 10px 16px;
      border: 1px solid #ddd;
      border-radius: 6px 0 0 6px;
      font-size: 14px;
    }
    
    .currency {
      display: flex;
      align-items: center;
      padding: 0 10px;
      background-color: #f5f5f5;
      border: 1px solid #ddd;
      border-left: none;
      font-size: 14px;
    }
    
    .period-select {
      width: 120px;
    }
    
    .period-select .form-select {
      border-radius: 0 6px 6px 0;
      border-left: none;
    }
    
    .tax-visualization {
      display: flex;
      margin-top: 20px;
      width: 200px;
      height: 200px;
    }
    
    .pie-chart {
      width: 180px;
      height: 180px;
    }
    
    .tax-breakdown-list {
      flex: 1;
      padding-left: 20px;
    }
    
    .tax-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    
    .tax-label {
      font-size: 14px;
      color: #555;
    }
    
    .net-salary-result {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 0px;
      padding-top: 0px;
      border-top: 1px solid #eee;
      transform: translate(0px, -150px);
    }
    
    .net-label {
      font-size: 16px;
      color: #555;
      margin-right: 16px;
    }
    
    .net-amount {
      font-size: 18px;
      font-weight: 600;
    }
    
    .balance-amount {
      font-size: 32px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .currency-symbol {
      margin-right: 4px;
    }
    
    .balance-period {
      font-size: 14px;
      color: #777;
      margin-bottom: 24px;
    }
    
    .income-sources {
      margin-top: 24px;
    }
    
    .income-source {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .legend-item {
      text-align: left;
      margin-left: 450px;
      transform: translate(0px, -180px);
    }

    .legend-label {
        flex: 1;
        color: #555;
    }

    
    .legend-color {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        margin-right: 8px;
    }
    
    
    .source-logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 12px;
    }
    
    .source-details {
      flex: 1;
    }
    
    .source-name {
      font-size: 14px;
      margin-bottom: 6px;
    }
    
    .source-progress-container {
      height: 8px;
      background-color: #eee;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .source-progress {
      height: 100%;
      background-color: #2ecc71;
      border-radius: 4px;
    }
    
    .source-amount {
      font-size: 14px;
      font-weight: 600;
      margin-left: 12px;
    }

    /* Platform connection styles */
    .no-platforms {
      text-align: center;
      padding: 32px 16px;
      color: #777;
    }

    .no-platforms p {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 500;
    }

    .no-platforms small {
      display: block;
      margin-bottom: 24px;
      color: #999;
    }

    .platform-connect-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 300px;
      margin: 0 auto;
    }

    .connect-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .connect-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .connect-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .connect-button.upwork {
      background: linear-gradient(135deg, #6fda44 0%, #5fb836 100%);
    }

    .connect-button.freelancer {
      background: linear-gradient(135deg, #29b2fe 0%, #1a8fd9 100%);
    }

    .connect-button.fiverr {
      background: linear-gradient(135deg, #1dbf73 0%, #19a463 100%);
    }

    .button-icon {
      font-size: 20px;
    }

    .sync-section {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .sync-button {
      padding: 10px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .sync-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .sync-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .last-synced {
      display: block;
      margin-top: 8px;
      font-size: 12px;
      color: #999;
    }

    .loading-state, .error-state {
      text-align: center;
      padding: 32px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .retry-button {
      margin-top: 16px;
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }

    .retry-button:hover {
      background: #5568d3;
    }

    .financial-stats {
      display: flex;
      justify-content: space-around;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #eee;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
    }

    .stat-value {
      display: block;
      font-size: 18px;
      font-weight: 600;
    }

    .stat-value.positive {
      color: #2ecc71;
    }

    .stat-value.negative {
      color: #e74c3c;
    }
    </style>
    