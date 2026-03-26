/**
 * Logger Control Utility
 * Helps suppress repeated error messages while still allowing critical errors through
 */

class LogControl {
  constructor() {
    this.loggedErrors = new Map();
    this.errorThreshold = 5; // Only log the first N errors of the same type
  }

  /**
   * Log an error only if we haven't seen it too many times recently
   */
  logErrorOnce(key, message, error) {
    const count = this.loggedErrors.get(key) || 0;
    
    if (count < this.errorThreshold) {
      console.error(message, error);
      this.loggedErrors.set(key, count + 1);
      
      // Reset counter after 30 seconds
      setTimeout(() => {
        this.loggedErrors.delete(key);
      }, 30000);
    }
  }

  /**
   * Log a warning only if we haven't seen it too many times recently
   */
  logWarnOnce(key, message) {
    const count = this.loggedErrors.get(key) || 0;
    
    if (count < this.errorThreshold) {
      console.warn(message);
      this.loggedErrors.set(key, count + 1);
      
      // Reset counter after 30 seconds
      setTimeout(() => {
        this.loggedErrors.delete(key);
      }, 30000);
    }
  }

  /**
   * Silence all logging for a specific key
   */
  silence(key) {
    this.loggedErrors.set(key, this.errorThreshold);
    
    setTimeout(() => {
      this.loggedErrors.delete(key);
    }, 30000);
  }

  /**
   * Reset all logged errors
   */
  reset() {
    this.loggedErrors.clear();
  }
}

export const logControl = new LogControl();
