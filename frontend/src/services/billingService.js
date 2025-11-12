/**
 * Billing Service
 * Manages payment reminders and billing notifications
 */

import notificationService from './notificationService.js'

class BillingService {
  constructor() {
    this.payments = []
    this.loadPayments()
    this.startPaymentReminders()
  }

  /**
   * Load payments from localStorage
   */
  loadPayments() {
    try {
      const savedPayments = localStorage.getItem('user_payments')
      if (savedPayments) {
        this.payments = JSON.parse(savedPayments).map(payment => ({
          ...payment,
          dueDate: new Date(payment.dueDate)
        }))
      } else {
        // Initialize with empty payments array
        this.payments = []
      }
    } catch (error) {
      console.error('Error loading payments:', error)
      this.payments = []
    }
  }

  /**
   * Save payments to localStorage
   */
  savePayments() {
    try {
      localStorage.setItem('user_payments', JSON.stringify(this.payments))
    } catch (error) {
      console.error('Error saving payments:', error)
    }
  }

  /**
   * Add a new payment
   */
  addPayment(payment) {
    const newPayment = {
      id: Date.now(),
      ...payment,
      dueDate: new Date(payment.dueDate),
      status: 'pending'
    }
    this.payments.push(newPayment)
    this.savePayments()
    return newPayment
  }

  /**
   * Mark payment as paid
   */
  markPaymentPaid(paymentId, transactionId = null) {
    const payment = this.payments.find(p => p.id === paymentId)
    if (payment) {
      payment.status = 'paid'
      payment.paidDate = new Date()
      payment.transactionId = transactionId
      this.savePayments()
      
      // Payment completed successfully
      console.log(`Payment of $${payment.amount} completed successfully`)
    }
  }

  /**
   * Mark payment as failed
   */
  markPaymentFailed(paymentId, reason = '') {
    const payment = this.payments.find(p => p.id === paymentId)
    if (payment) {
      payment.status = 'failed'
      payment.failureReason = reason
      this.savePayments()
      
      // Payment failed
      console.log(`Payment of $${payment.amount} failed: ${reason}`)
    }
  }

  /**
   * Get upcoming payments (next 30 days)
   */
  getUpcomingPayments() {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    return this.payments.filter(payment => 
      payment.status === 'pending' && 
      payment.dueDate >= now && 
      payment.dueDate <= thirtyDaysFromNow
    )
  }

  /**
   * Get overdue payments
   */
  getOverduePayments() {
    const now = new Date()
    return this.payments.filter(payment => 
      payment.status === 'pending' && 
      payment.dueDate < now
    )
  }

  /**
   * Check for payments that need reminders
   */
  checkPaymentReminders() {
    const now = new Date()
    const upcomingPayments = this.getUpcomingPayments()
    
    upcomingPayments.forEach(payment => {
      const daysUntilDue = Math.ceil((payment.dueDate - now) / (1000 * 60 * 60 * 24))
      
      // Send "Upcoming Payment" notification 3 days before due date
      if (daysUntilDue === 3 && !payment.reminderSent3Days) {
        notificationService.addBillingNotification(
          payment.amount, 
          payment.dueDate, 
          payment.description
        )
        payment.reminderSent3Days = true
        this.savePayments()
      }
    })
  }

  /**
   * Start automatic payment reminder checking
   */
  startPaymentReminders() {
    // Check once immediately
    this.checkPaymentReminders()
    
    // Then check every hour
    setInterval(() => {
      this.checkPaymentReminders()
    }, 60 * 60 * 1000) // 1 hour
  }

  /**
   * Simulate a payment processing
   */
  async processPayment(paymentId) {
    const payment = this.payments.find(p => p.id === paymentId)
    if (!payment) {
      throw new Error('Payment not found')
    }

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        this.markPaymentPaid(paymentId, `txn_${Date.now()}`)
        return { success: true, transactionId: `txn_${Date.now()}` }
      } else {
        this.markPaymentFailed(paymentId, 'Card declined')
        throw new Error('Payment failed: Card declined')
      }
    } catch (error) {
      this.markPaymentFailed(paymentId, error.message)
      throw error
    }
  }

  /**
   * Get payment history
   */
  getPaymentHistory() {
    return this.payments.filter(payment => 
      payment.status === 'paid' || payment.status === 'failed'
    ).sort((a, b) => new Date(b.paidDate || b.dueDate) - new Date(a.paidDate || a.dueDate))
  }

  /**
   * Get total amount due
   */
  getTotalAmountDue() {
    return this.payments
      .filter(payment => payment.status === 'pending')
      .reduce((total, payment) => total + payment.amount, 0)
  }
}

// Create singleton instance
const billingService = new BillingService()

export default billingService