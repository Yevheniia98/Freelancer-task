/**
 * Financial Service
 * Handles financial calculations and tax-related operations
 */

export interface TaxBreakdown {
  incomeTax: { amount: number; percentage: number };
  pension: { amount: number; percentage: number };
  unemployment: { amount: number; percentage: number };
  health: { amount: number; percentage: number };
  care: { amount: number; percentage: number };
  netSalary: { amount: number; percentage: number };
  total: number;
}

export interface FinancialSummary {
  totalBalance: number;
  income: number;
  expenses: number;
  currency: string;
}

class FinancialService {
  private readonly STORAGE_KEY = 'financial_data';

  /**
   * Get financial summary from localStorage
   */
  getFinancialSummary(): FinancialSummary {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    }
    
    // Return default values
    return {
      totalBalance: 0,
      income: 0,
      expenses: 0,
      currency: 'EUR'
    };
  }

  /**
   * Save financial summary to localStorage
   */
  saveFinancialSummary(summary: FinancialSummary): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(summary));
    } catch (error) {
      console.error('Error saving financial data:', error);
    }
  }

  /**
   * Calculate tax breakdown for a given salary
   * @param salary - Annual or monthly salary amount
   * @param country - Country for tax calculations (currently uses default rates)
   */
  calculateTaxBreakdown(salary: number, country: string = 'Germany'): TaxBreakdown {
    // Return zero breakdown if salary is 0 or negative to avoid division by zero
    if (salary <= 0) {
      return {
        incomeTax: { amount: 0, percentage: 0 },
        pension: { amount: 0, percentage: 0 },
        unemployment: { amount: 0, percentage: 0 },
        health: { amount: 0, percentage: 0 },
        care: { amount: 0, percentage: 0 },
        netSalary: { amount: 0, percentage: 0 },
        total: 0
      };
    }

    // Tax rates by country (simplified - default rates based on Germany)
    // Future enhancement: Add country-specific tax rates
    const taxRatesByCountry: Record<string, typeof defaultRates> = {
      Germany: { incomeTax: 0.20, pension: 0.093, unemployment: 0.012, health: 0.073, care: 0.015 },
      France: { incomeTax: 0.22, pension: 0.11, unemployment: 0.021, health: 0.08, care: 0.006 },
      Spain: { incomeTax: 0.19, pension: 0.067, unemployment: 0.016, health: 0.055, care: 0.004 },
      Italy: { incomeTax: 0.23, pension: 0.10, unemployment: 0.015, health: 0.065, care: 0.005 }
    };

    const defaultRates = { incomeTax: 0.20, pension: 0.093, unemployment: 0.012, health: 0.073, care: 0.015 };
    const taxRates = taxRatesByCountry[country] || defaultRates;

    const incomeTaxAmount = salary * taxRates.incomeTax;
    const pensionAmount = salary * taxRates.pension;
    const unemploymentAmount = salary * taxRates.unemployment;
    const healthAmount = salary * taxRates.health;
    const careAmount = salary * taxRates.care;

    const totalDeductions = incomeTaxAmount + pensionAmount + unemploymentAmount + healthAmount + careAmount;
    const netSalary = salary - totalDeductions;

    return {
      incomeTax: { 
        amount: incomeTaxAmount, 
        percentage: (incomeTaxAmount / salary) * 100 
      },
      pension: { 
        amount: pensionAmount, 
        percentage: (pensionAmount / salary) * 100 
      },
      unemployment: { 
        amount: unemploymentAmount, 
        percentage: (unemploymentAmount / salary) * 100 
      },
      health: { 
        amount: healthAmount, 
        percentage: (healthAmount / salary) * 100 
      },
      care: { 
        amount: careAmount, 
        percentage: (careAmount / salary) * 100 
      },
      netSalary: { 
        amount: netSalary, 
        percentage: (netSalary / salary) * 100 
      },
      total: salary
    };
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency
    }).format(value);
  }
}

// Create singleton instance
const financialService = new FinancialService();

export default financialService;
