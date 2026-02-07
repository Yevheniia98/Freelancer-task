/**
 * Storage Service - Provides fallback storage mechanisms
 * Uses IndexedDB as primary, localStorage as secondary fallback
 */

class StorageService {
  constructor() {
    this.dbName = 'freelancer-task-db';
    this.storeName = 'events';
    this.db = null;
    this.initDB();
  }

  /**
   * Initialize IndexedDB
   */
  initDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not available, will use localStorage only');
        resolve(null);
        return;
      }

      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => {
        console.error('IndexedDB initialization failed');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Save events to storage (tries IndexedDB first, falls back to localStorage)
   */
  async saveEvents(events) {
    try {
      // Try IndexedDB first
      if (this.db) {
        return await this.saveToIndexedDB(events);
      }
    } catch (error) {
      console.warn('IndexedDB save failed, falling back to localStorage:', error);
    }

    // Fall back to localStorage
    return this.saveToLocalStorage(events);
  }

  /**
   * Load events from storage
   */
  async loadEvents() {
    try {
      // Try IndexedDB first
      if (this.db) {
        return await this.loadFromIndexedDB();
      }
    } catch (error) {
      console.warn('IndexedDB load failed, falling back to localStorage:', error);
    }

    // Fall back to localStorage
    return this.loadFromLocalStorage();
  }

  /**
   * Save to IndexedDB
   */
  saveToIndexedDB(events) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not available'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      
      // Clear existing data
      objectStore.clear();

      // Add all events
      events.forEach((event, index) => {
        objectStore.add({ ...event, id: index });
      });

      transaction.onerror = () => {
        reject(transaction.error);
      };

      transaction.oncomplete = () => {
        resolve({ success: true, storage: 'IndexedDB', count: events.length });
      };
    });
  }

  /**
   * Load from IndexedDB
   */
  loadFromIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('IndexedDB not available'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        const events = request.result.map(({ id, ...event }) => event);
        resolve({ data: events, storage: 'IndexedDB' });
      };
    });
  }

  /**
   * Save to localStorage with smart cleanup
   */
  saveToLocalStorage(events) {
    try {
      // Sort events and keep only recent ones
      const sortedEvents = [...events].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );

      // Keep only last 200 events to save space
      const limitedEvents = sortedEvents.slice(0, 200);

      localStorage.setItem('userEvents', JSON.stringify(limitedEvents));
      return { success: true, storage: 'localStorage', count: limitedEvents.length };
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Try to save minimal data
        try {
          const minimalEvents = events.slice(-50);
          localStorage.setItem('userEvents', JSON.stringify(minimalEvents));
          return { success: true, storage: 'localStorage', count: 50, warning: 'Limited to 50 events' };
        } catch (finalError) {
          throw new Error('Unable to save events - storage full');
        }
      }
      throw error;
    }
  }

  /**
   * Load from localStorage
   */
  loadFromLocalStorage() {
    try {
      const savedEvents = localStorage.getItem('userEvents');
      if (savedEvents) {
        return { data: JSON.parse(savedEvents), storage: 'localStorage' };
      }
      return { data: [], storage: 'localStorage' };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return { data: [], storage: 'localStorage', error };
    }
  }

  /**
   * Clear old events (older than specified days)
   */
  clearOldEvents(events, daysToKeep = 90) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffISO = cutoffDate.toISOString().split('T')[0];

    return events.filter(event => event.date >= cutoffISO);
  }

  /**
   * Get storage stats
   */
  async getStorageStats() {
    const stats = {
      indexedDB: null,
      localStorage: null
    };

    // Check IndexedDB size
    if (this.db && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        stats.indexedDB = {
          usage: estimate.usage,
          quota: estimate.quota,
          available: estimate.quota - estimate.usage
        };
      } catch (error) {
        console.warn('Could not get IndexedDB stats:', error);
      }
    }

    // Check localStorage size
    try {
      let size = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          size += localStorage[key].length + key.length;
        }
      }
      stats.localStorage = {
        usage: size,
        quota: 5 * 1024 * 1024, // 5MB typical
        available: Math.max(0, 5 * 1024 * 1024 - size)
      };
    } catch (error) {
      console.warn('Could not get localStorage stats:', error);
    }

    return stats;
  }
}

// Export singleton instance
export const storageService = new StorageService();
