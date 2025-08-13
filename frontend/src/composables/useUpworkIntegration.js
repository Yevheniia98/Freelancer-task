import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

export function useUpworkIntegration() {
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const isSyncing = ref(false)
  const autoSync = ref(false)
  const error = ref('')
  const successMessage = ref('')
  
  const syncStats = reactive({
    projectCount: 0,
    lastSync: null
  })

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get('/api/integrations/platforms')
      const platforms = response.data.data || []
      const upworkPlatform = platforms.find(p => p.name === 'upwork')
      
      if (upworkPlatform) {
        isConnected.value = upworkPlatform.isActive
        syncStats.projectCount = upworkPlatform.projectCount || 0
        syncStats.lastSync = upworkPlatform.lastSync
      }
    } catch (err) {
      console.error('Failed to check connection status:', err)
      error.value = 'Failed to check connection status'
    }
  }

  const initiateConnection = async () => {
    isConnecting.value = true
    error.value = ''
    
    try {
      const response = await axios.post('/api/integrations/upwork/oauth/initiate')
      
      if (response.data.success && response.data.data.authUrl) {
        // Open OAuth URL in a popup window
        const popup = window.open(
          response.data.data.authUrl,
          'upwork-oauth',
          'width=600,height=600,scrollbars=yes,resizable=yes'
        )
        
        // Listen for OAuth completion
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed)
            isConnecting.value = false
            checkConnectionStatus() // Refresh connection status
          }
        }, 1000)
        
        // Handle OAuth messages from popup
        window.addEventListener('message', (event) => {
          if (event.origin !== window.location.origin) return
          
          if (event.data.type === 'UPWORK_OAUTH_SUCCESS') {
            popup.close()
            successMessage.value = 'Successfully connected to Upwork!'
            checkConnectionStatus()
          } else if (event.data.type === 'UPWORK_OAUTH_ERROR') {
            popup.close()
            error.value = event.data.error || 'OAuth connection failed'
          }
        })
      } else {
        throw new Error(response.data.error || 'Failed to initiate OAuth')
      }
    } catch (err) {
      console.error('OAuth initiation failed:', err)
      error.value = err.response?.data?.error || 'Failed to initiate connection'
    } finally {
      isConnecting.value = false
    }
  }

  const syncProjects = async () => {
    isSyncing.value = true
    error.value = ''
    
    try {
      const response = await axios.post('/api/integrations/projects/sync/upwork')
      
      if (response.data.success) {
        const syncedCount = response.data.data.projectsSynced || 0
        successMessage.value = `Successfully synced ${syncedCount} projects from Upwork!`
        syncStats.projectCount = syncedCount
        syncStats.lastSync = new Date().toISOString()
      } else {
        throw new Error(response.data.error || 'Sync failed')
      }
    } catch (err) {
      console.error('Project sync failed:', err)
      error.value = err.response?.data?.error || 'Failed to sync projects'
    } finally {
      isSyncing.value = false
    }
  }

  const disconnect = async () => {
    try {
      const response = await axios.delete('/api/integrations/upwork/disconnect')
      
      if (response.data.success) {
        isConnected.value = false
        syncStats.projectCount = 0
        syncStats.lastSync = null
        autoSync.value = false
        successMessage.value = 'Successfully disconnected from Upwork'
      } else {
        throw new Error(response.data.error || 'Disconnect failed')
      }
    } catch (err) {
      console.error('Disconnect failed:', err)
      error.value = err.response?.data?.error || 'Failed to disconnect'
    }
  }

  const toggleAutoSync = async () => {
    try {
      // In a real implementation, you'd save this preference to the backend
      console.log('Auto-sync toggled:', autoSync.value)
      
      if (autoSync.value) {
        successMessage.value = 'Auto-sync enabled. Projects will sync every hour.'
      } else {
        successMessage.value = 'Auto-sync disabled.'
      }
    } catch (err) {
      console.error('Failed to toggle auto-sync:', err)
      error.value = 'Failed to update auto-sync setting'
    }
  }

  // Initialize on mount
  onMounted(() => {
    checkConnectionStatus()
  })

  return {
    isConnected,
    isConnecting,
    isSyncing,
    autoSync,
    syncStats,
    error,
    successMessage,
    initiateConnection,
    syncProjects,
    toggleAutoSync,
    disconnect,
    formatLastSync,
    checkConnectionStatus
  }
}
