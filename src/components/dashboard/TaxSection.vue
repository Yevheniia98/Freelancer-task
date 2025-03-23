<template>
  <div class="tax-calculator-container">
    <div class="tax-calculator-card">
      <h2 class="card-title">
        Tax Calculator
      </h2>
  
      <!-- Country Selection -->
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
  
      <!-- State Selection (only if Germany) -->
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
            <option value="Bavaria">
              Bavaria
            </option>
            <option value="Berlin">
              Berlin
            </option>
            <option value="Hesse">
              Hesse
            </option>
            <option value="Baden-Württemberg">
              Baden-Württemberg
            </option>
            <option value="North Rhine-Westphalia">
              North Rhine-Westphalia
            </option>
          </select>
          <span class="select-arrow">&#9662;</span>
        </div>
      </div>
  
      <!-- Tax Category Selection -->
      <div class="form-group">
        <label>Tax Category:</label>
        <div class="select-container">
          <select
            v-model="taxCategory"
            class="form-select"
          >
            <option
              v-for="n in 6"
              :key="n"
              :value="n"
            >
              Category {{ n }}
            </option>
          </select>
          <span class="select-arrow">&#9662;</span>
        </div>
      </div>
  
      <!-- Salary Input -->
      <div class="salary-input">
        <label>Salary:</label>
        <div class="input-group">
          <input
            v-model.number="salary"
            type="number"
            class="form-input"
            @input="calculateTaxes"
          >
          <span class="currency">€</span>
          <div class="select-container period-select">
            <select
              v-model="salaryPeriod"
              class="form-select"
              @change="calculateTaxes"
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
          :style="{ backgroundColor: colors[key] }"
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
</template>
  
  <script>
  export default {
    name: "TaxCalculator",
    data() {
      return {
        country: "Germany",
        state: "Thuringia",
        taxCategory: 3,
        salary: 11650,
        salaryPeriod: "month",
        colors: {
          incomeTax: "#e74c3c",
          pension: "#f1c40f",
          unemployment: "#3498db",
          health: "#9b59b6",
          care: "#795548",
          netSalary: "#009688",
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
    computed: {
      filteredTaxBreakdown() {
        // This computed property returns tax breakdown without the 'total' property
        const result = {};
        Object.keys(this.taxBreakdown).forEach(key => {
          if (key !== 'total') {
            result[key] = this.taxBreakdown[key];
          }
        });
        return result;
      }
    },
    watch: {
      country() {
        this.calculateTaxes();
      },
      state() {
        this.calculateTaxes();
      },
      taxCategory() {
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
    mounted() {
      this.calculateTaxes();
    },
    methods: {
      formatCurrency(value) {
        return new Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(value);
      },
      calculateTaxes() {
        const annualSalary = this.salaryPeriod === "month" ? this.salary * 12 : this.salary;
        let incomeTaxAmount = this.calculateIncomeTax(annualSalary, this.taxCategory);
        const pensionAmount = Math.min(annualSalary * 0.093, 7050);
        const unemploymentAmount = Math.min(annualSalary * 0.012, 912);
        const healthAmount = Math.min(annualSalary * 0.073, 5550);
        const careAmount = Math.min(annualSalary * 0.015, 1140);
  
        const totalSalary = annualSalary;
        const totalDeductions = incomeTaxAmount + pensionAmount + unemploymentAmount + healthAmount + careAmount;
        const netSalaryAmount = totalSalary - totalDeductions;
        const factor = this.salaryPeriod === "month" ? 12 : 1;
  
        this.taxBreakdown = {
          incomeTax: { amount: incomeTaxAmount / factor, percentage: (incomeTaxAmount / totalSalary) * 100 },
          pension: { amount: pensionAmount / factor, percentage: (pensionAmount / totalSalary) * 100 },
          unemployment: { amount: unemploymentAmount / factor, percentage: (unemploymentAmount / totalSalary) * 100 },
          health: { amount: healthAmount / factor, percentage: (healthAmount / totalSalary) * 100 },
          care: { amount: careAmount / factor, percentage: (careAmount / totalSalary) * 100 },
          netSalary: { amount: netSalaryAmount / factor, percentage: (netSalaryAmount / totalSalary) * 100 },
          total: totalSalary / factor
        };
        
        this.generatePieChart();
      },
      calculateIncomeTax(annualSalary, taxCategory) {
        const taxRates = { 1: 0.36, 2: 0.34, 3: 0.32, 4: 0.35, 5: 0.38, 6: 0.40 };
        let taxRate = taxRates[taxCategory] || 0.3;
        return annualSalary * taxRate;
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
    flex-direction: column;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .tax-calculator-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .card-title {
    font-size: 24px;
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #555;
  }
  
  .select-container {
    position: relative;
    width: 100%;
  }
  
  .form-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    appearance: none;
    background-color: white;
  }
  
  .select-arrow {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #777;
  }
  
  .salary-input {
    margin-top: 15px;
  }
  
  .input-group {
    display: flex;
    align-items: center;
  }
  
  .form-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px 0 0 4px;
  }
  
  .currency {
    background-color: #f5f5f5;
    padding: 9px 12px;
    border: 1px solid #ddd;
    border-left: none;
  }
  
  .period-select {
    width: 100px;
    margin-left: 10px;
  }
  
  .period-select .form-select {
    border-radius: 4px;
  }
  
  .tax-visualization {
    width: 200px;
    height: 200px;
    margin: 20px auto;
  }
  
  .tax-breakdown-legend {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .legend-color {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-right: 8px;
  }
  
  .legend-label {
    flex: 1;
    color: #555;
  }
  
  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #aaa;
    margin-left: 8px;
  }
  
  .net-salary-result {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .net-label {
    font-size: 18px;
    color: #555;
  }
  
  .net-amount {
    font-size: 22px;
    font-weight: bold;
    color: #009688;
  }
  
  @media (min-width: 768px) {
    .tax-calculator-container {
      flex-direction: row;
      flex-wrap: wrap;
    }
    
    .tax-calculator-card {
      flex: 1;
      margin-right: 20px;
    }
    
    .tax-visualization {
      width: 250px;
      height: 250px;
    }
    
    .tax-breakdown-legend {
      width: 300px;
    }
    
    .net-salary-result {
      width: 100%;
    }
  }
  </style>