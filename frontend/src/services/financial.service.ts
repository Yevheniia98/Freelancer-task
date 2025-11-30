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
   */
  calculateTaxBreakdown(salary: number, country: string): TaxBreakdown {
    // Default tax rates (simplified)
    const taxRates = {
      incomeTax: 0.20,
      pension: 0.093,
      unemployment: 0.012,
      health: 0.073,
      care: 0.015
    };

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
