# Upwork API Integration Guide

## Overview
This guide provides step-by-step instructions for integrating and testing the Upwork API with your freelancer task manager.

## Prerequisites
1. **Upwork Developer Account**: Sign up at [https://developers.upwork.com/](https://developers.upwork.com/)
2. **API Keys**: Obtain Consumer Key and Consumer Secret from Upwork
3. **Node.js Environment**: Ensure backend server is running

## Step 1: Register Your Application

### 1.1 Create Upwork Developer Account
1. Visit [https://developers.upwork.com/](https://developers.upwork.com/)
2. Sign in with your Upwork account or create a new one
3. Navigate to "My Apps" section

### 1.2 Create New Application
1. Click "Create a New App"
2. Fill in application details:
   - **App Name**: "Freelancer Task Manager"
   - **Description**: "Task management system for freelancers"
   - **Company/Organization**: Your company name
   - **App URL**: Your application URL (e.g., `http://localhost:3000`)
   - **Callback URLs**: Add your callback URLs:
     - `http://localhost:5000/api/integrations/upwork/callback`
     - `http://localhost:3000/integrations/upwork/callback`

### 1.3 Get API Credentials
After creating the app, you'll receive:
- **Consumer Key** (Public Key)
- **Consumer Secret** (Private Key)

## Step 2: Environment Configuration

### 2.1 Update Backend Environment Variables
Add the following to your `.env` file in the backend directory:

```bash
# Upwork API Configuration
UPWORK_CONSUMER_KEY=your_consumer_key_here
UPWORK_CONSUMER_SECRET=your_consumer_secret_here
UPWORK_CALLBACK_URL=http://localhost:5000/api/integrations/upwork/callback

# Base URLs
UPWORK_API_BASE_URL=https://www.upwork.com/api
UPWORK_OAUTH_BASE_URL=https://www.upwork.com/api/auth/v1/oauth

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### 2.2 Update Frontend Configuration
Add Upwork integration configuration to your frontend environment:

```javascript
// frontend/src/config/integrations.js
export const INTEGRATIONS = {
  upwork: {
    name: 'Upwork',
    baseUrl: 'https://www.upwork.com',
    authUrl: '/api/integrations/platforms/connect',
    logo: '/icons/upwork-logo.png',
    color: '#14a800',
    features: ['projects', 'contracts', 'earnings']
  }
};
```

## Step 3: Testing the Integration

### 3.1 Start the Application
```bash
# Terminal 1: Start Backend
cd protocol-task-manager/backend
npm run dev

# Terminal 2: Start Frontend  
cd protocol-task-manager/frontend
npm run serve
```

### 3.2 Test API Endpoints

#### Test 1: Check Integration Status
```bash
curl -X GET "http://localhost:5000/api/integrations/platforms" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "platforms": [
      {
        "name": "upwork",
        "connected": false,
        "lastSync": null,
        "projectCount": 0
      }
    ]
  }
}
```

#### Test 2: Connect to Upwork
```bash
curl -X POST "http://localhost:5000/api/integrations/platforms/connect" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "upwork",
    "credentials": {
      "consumerKey": "your_consumer_key",
      "consumerSecret": "your_consumer_secret"
    }
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Successfully connected to upwork platform",
  "data": {
    "platform": "upwork",
    "authUrl": "https://www.upwork.com/api/auth/v1/oauth/token/request?oauth_callback=...",
    "requestToken": "oauth_token_value"
  }
}
```

#### Test 3: Fetch Projects (After Authentication)
```bash
curl -X GET "http://localhost:5000/api/integrations/projects?platform=upwork" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

#### Test 4: Sync Projects
```bash
curl -X POST "http://localhost:5000/api/integrations/projects/sync" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"platforms": ["upwork"]}'
```

### 3.3 Run Automated Tests
```bash
# Run all integration tests
cd protocol-task-manager/backend
npm test

# Run specific Upwork tests
npm test -- --testNamePattern="UpworkService"

# Run integration tests only
npm run test:integration
```

## Step 4: OAuth Flow Implementation

### 4.1 OAuth 1.0a Flow Steps

The Upwork API uses OAuth 1.0a authentication. Here's the complete flow:

1. **Request Token**: Get temporary credentials
2. **User Authorization**: Redirect user to Upwork for authorization
3. **Access Token**: Exchange authorized request token for access token
4. **API Calls**: Use access token for authenticated API requests

### 4.2 Complete OAuth Flow Example

```javascript
// Example: Complete OAuth flow
async function authenticateWithUpwork() {
  try {
    // Step 1: Connect to platform (get request token)
    const connectResponse = await fetch('/api/integrations/platforms/connect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        platform: 'upwork',
        credentials: {
          consumerKey: 'your_key',
          consumerSecret: 'your_secret'
        }
      })
    });

    const { authUrl } = await connectResponse.json();

    // Step 2: Redirect user to Upwork (opens in new window)
    window.open(authUrl, 'upwork-auth', 'width=600,height=600');

    // Step 3: Handle callback (implement callback handler)
    // This would be handled by your callback endpoint
    
  } catch (error) {
    console.error('Authentication failed:', error);
  }
}
```

## Step 5: Frontend Integration

### 5.1 Create Integration Component

```vue
<!-- frontend/src/components/UpworkIntegration.vue -->
<template>
  <div class="upwork-integration">
    <div class="integration-header">
      <img src="/icons/upwork-logo.png" alt="Upwork" class="platform-logo">
      <h3>Upwork Integration</h3>
      <span :class="['status', connectionStatus]">
        {{ connectionStatus === 'connected' ? 'Connected' : 'Not Connected' }}
      </span>
    </div>

    <div class="integration-actions">
      <button 
        v-if="!isConnected" 
        @click="connectToUpwork"
        class="btn btn-primary"
      >
        Connect to Upwork
      </button>
      
      <div v-else class="connected-actions">
        <button @click="syncProjects" class="btn btn-secondary">
          Sync Projects
        </button>
        <button @click="disconnect" class="btn btn-danger">
          Disconnect
        </button>
      </div>
    </div>

    <div v-if="isConnected" class="sync-status">
      <p>Last sync: {{ lastSync || 'Never' }}</p>
      <p>Projects synced: {{ projectCount }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpworkIntegration',
  data() {
    return {
      isConnected: false,
      lastSync: null,
      projectCount: 0,
      loading: false
    }
  },
  computed: {
    connectionStatus() {
      return this.isConnected ? 'connected' : 'disconnected';
    }
  },
  methods: {
    async connectToUpwork() {
      this.loading = true;
      try {
        const response = await this.$api.post('/integrations/platforms/connect', {
          platform: 'upwork',
          credentials: {
            consumerKey: process.env.VUE_APP_UPWORK_CONSUMER_KEY,
            consumerSecret: process.env.VUE_APP_UPWORK_CONSUMER_SECRET
          }
        });

        if (response.data.success) {
          // Open OAuth authorization window
          window.open(response.data.data.authUrl, 'upwork-auth', 'width=600,height=600');
        }
      } catch (error) {
        console.error('Connection failed:', error);
      } finally {
        this.loading = false;
      }
    },

    async syncProjects() {
      this.loading = true;
      try {
        await this.$api.post('/integrations/projects/sync', {
          platforms: ['upwork']
        });
        this.checkConnectionStatus();
      } catch (error) {
        console.error('Sync failed:', error);
      } finally {
        this.loading = false;
      }
    },

    async disconnect() {
      try {
        await this.$api.delete('/integrations/platforms/upwork/disconnect');
        this.isConnected = false;
        this.lastSync = null;
        this.projectCount = 0;
      } catch (error) {
        console.error('Disconnect failed:', error);
      }
    },

    async checkConnectionStatus() {
      try {
        const response = await this.$api.get('/integrations/platforms');
        const upworkPlatform = response.data.data.platforms.find(p => p.name === 'upwork');
        
        if (upworkPlatform) {
          this.isConnected = upworkPlatform.connected;
          this.lastSync = upworkPlatform.lastSync;
          this.projectCount = upworkPlatform.projectCount;
        }
      } catch (error) {
        console.error('Status check failed:', error);
      }
    }
  },
  mounted() {
    this.checkConnectionStatus();
  }
}
</script>
```

## Step 6: Testing Checklist

### ✅ API Connection Tests
- [ ] Environment variables configured
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Database connection established

### ✅ Authentication Tests
- [ ] Upwork developer account created
- [ ] Consumer Key and Secret obtained
- [ ] OAuth request token generation
- [ ] User authorization flow
- [ ] Access token exchange
- [ ] Token refresh mechanism

### ✅ Data Sync Tests
- [ ] Project fetching from Upwork API
- [ ] Data mapping and transformation
- [ ] Database storage of external projects
- [ ] Status synchronization
- [ ] Error handling and logging

### ✅ Integration Tests
- [ ] Platform connection/disconnection
- [ ] Project sync triggers
- [ ] Real-time status updates
- [ ] User interface updates
- [ ] Error messages and notifications

## Step 7: Production Deployment

### 7.1 Environment Configuration
```bash
# Production environment variables
UPWORK_CONSUMER_KEY=prod_consumer_key
UPWORK_CONSUMER_SECRET=prod_consumer_secret
UPWORK_CALLBACK_URL=https://yourdomain.com/api/integrations/upwork/callback
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### 7.2 Security Considerations
- Store API credentials securely (environment variables)
- Use HTTPS for all API calls
- Implement rate limiting
- Add request validation and sanitization
- Monitor API usage and errors

## Troubleshooting

### Common Issues

1. **"Invalid Consumer Key"**
   - Verify consumer key in Upwork developer console
   - Check environment variable spelling
   - Ensure API app is approved by Upwork

2. **"Callback URL Mismatch"**
   - Verify callback URL in Upwork app settings
   - Check URL encoding in OAuth flow
   - Ensure exact match including protocol (http/https)

3. **"Access Token Expired"**
   - Implement token refresh logic
   - Check token expiration times
   - Handle 401 errors gracefully

4. **"Rate Limit Exceeded"**
   - Implement exponential backoff
   - Cache API responses when possible
   - Monitor API usage limits

### Debug Mode
Enable debug logging by setting:
```bash
DEBUG=upwork:*
LOG_LEVEL=debug
```

## Support Resources

- **Upwork API Documentation**: [https://developers.upwork.com/](https://developers.upwork.com/)
- **OAuth 1.0a Specification**: [https://tools.ietf.org/html/rfc5849](https://tools.ietf.org/html/rfc5849)
- **API Rate Limits**: [https://developers.upwork.com/api-tos](https://developers.upwork.com/api-tos)

---

## 🎯 **Next Steps**

After completing this guide, you'll have:
- ✅ Full Upwork API integration
- ✅ OAuth authentication flow
- ✅ Project synchronization
- ✅ Real-time status updates
- ✅ Error handling and logging

You can then extend this pattern to add other freelancer platforms like Freelancer.com, Fiverr, Guru, etc.
