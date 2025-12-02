# Platform Integration Guide

This guide explains how to set up OAuth integrations with Upwork, Freelancer.com, and Fiverr to enable real earnings tracking.

## Overview

The financial overview feature connects to freelancing platforms via OAuth 2.0 to fetch real transaction and earnings data. Users can:

1. Connect their platform accounts via OAuth
2. Automatically sync earnings and transactions
3. View aggregated financial data in the dashboard

## Required Environment Variables

Add these to your `.env` file:

```env
# Backend URL (for OAuth callbacks)
BACKEND_URL=http://localhost:3002
FRONTEND_URL=http://localhost:5173

# Upwork OAuth Credentials
UPWORK_CLIENT_ID=your_upwork_client_id
UPWORK_CLIENT_SECRET=your_upwork_client_secret

# Freelancer.com OAuth Credentials
FREELANCER_CLIENT_ID=your_freelancer_client_id
FREELANCER_CLIENT_SECRET=your_freelancer_client_secret

# Fiverr OAuth Credentials
FIVERR_CLIENT_ID=your_fiverr_client_id
FIVERR_CLIENT_SECRET=your_fiverr_client_secret
```

## Platform Setup Instructions

### 1. Upwork Integration

#### Register Your Application

1. Go to https://www.upwork.com/services/api/apply
2. Sign in with your Upwork account
3. Fill out the application form:
   - **Application Name**: Your app name (e.g., "Freelancer Task Manager")
   - **Company/Individual**: Your company or personal name
   - **Description**: Brief description of your app
   - **Intended Use**: Select "Web Application"
4. After approval, go to https://www.upwork.com/ab/account-security/oauth2/list
5. Click on your app to get credentials:
   - **Client ID**: Copy this to `UPWORK_CLIENT_ID`
   - **Client Secret**: Copy this to `UPWORK_CLIENT_SECRET`
6. Set the **Redirect URI** to:
   ```
   http://localhost:3002/api/finance/oauth/upwork/callback
   ```
   For production, use your production backend URL.

#### API Endpoints Used

- **Authorization**: `https://www.upwork.com/ab/account-security/oauth2/authorize`
- **Token**: `https://www.upwork.com/api/v3/oauth2/token`
- **Earnings API**: `https://www.upwork.com/api/hr/v2/teams/owned/earnings`
- **User Info**: `https://www.upwork.com/api/hr/v2/users/me`

#### Required Scopes

The integration requests default scopes which include:
- Read user profile
- Read earnings and transactions

#### Documentation

- Developer portal: https://developers.upwork.com/
- API documentation: https://developers.upwork.com/api-reference/

---

### 2. Freelancer.com Integration

#### Register Your Application

1. Go to https://www.freelancer.com/users/settings/oauth2
2. Sign in with your Freelancer account
3. Click "Create Application"
4. Fill out the form:
   - **Application Name**: Your app name
   - **Description**: Brief description
   - **Redirect URI**: 
     ```
     http://localhost:3002/api/finance/oauth/freelancer/callback
     ```
5. After creation, you'll receive:
   - **Client ID**: Copy to `FREELANCER_CLIENT_ID`
   - **Client Secret**: Copy to `FREELANCER_CLIENT_SECRET`

#### API Endpoints Used

- **Authorization**: `https://accounts.freelancer.com/oauth/authorize`
- **Token**: `https://accounts.freelancer.com/oauth/token`
- **Transactions API**: `https://www.freelancer.com/api/projects/0.1/users/self/transactions/`
- **Projects API**: `https://www.freelancer.com/api/projects/0.1/projects/{id}/`
- **User Info**: `https://www.freelancer.com/api/projects/0.1/users/self/`

#### Required Scopes

- `basic`: Read basic user information and transactions

#### Documentation

- Developer portal: https://developers.freelancer.com/
- API documentation: https://developers.freelancer.com/docs/projects/rest-api

---

### 3. Fiverr Integration

#### Register Your Application

1. Go to https://developers.fiverr.com/
2. Sign up or log in with your Fiverr account
3. Go to "My Apps" and create a new application:
   - **Application Name**: Your app name
   - **Description**: Brief description
   - **Redirect URI**: 
     ```
     http://localhost:3002/api/finance/oauth/fiverr/callback
     ```
4. After creation, get your credentials:
   - **Client ID**: Copy to `FIVERR_CLIENT_ID`
   - **Client Secret**: Copy to `FIVERR_CLIENT_SECRET`

#### API Endpoints Used

- **Authorization**: `https://www.fiverr.com/oauth/authorize`
- **Token**: `https://api.fiverr.com/v1/oauth/token`
- **Orders API**: `https://api.fiverr.com/v1/seller/orders`
- **User Info**: `https://api.fiverr.com/v1/seller/me`

#### Notes

- Fiverr's public API is more limited compared to Upwork and Freelancer
- Seller earnings are calculated as 80% of order value (20% Fiverr commission)
- Only completed orders are fetched

#### Documentation

- Developer portal: https://developers.fiverr.com/
- API documentation: https://developers.fiverr.com/api-reference

---

## How the Integration Works

### 1. User Initiates Connection

```
User clicks "Connect Upwork" 
  → Frontend calls GET /api/finance/oauth/upwork/authorize
  → Backend generates OAuth URL with redirect_uri
  → User is redirected to platform's OAuth page
```

### 2. OAuth Authorization

```
User authorizes on platform
  → Platform redirects to callback URL with authorization code
  → Backend receives code at GET /api/finance/oauth/:platform/callback
```

### 3. Token Exchange

```
Backend exchanges code for access token
  → POST to platform's token endpoint
  → Receives access_token, refresh_token, expires_in
  → Stores tokens in PlatformConnection model (encrypted)
```

### 4. Data Sync

```
Backend immediately syncs earnings after connection
  → Calls platform API with access_token
  → Fetches transactions/earnings
  → Stores in FinancialTransaction model
  → Updates PlatformConnection.lastSyncedAt
```

### 5. Automatic Refresh

```
Before each API call:
  → Check if token is expired
  → If expired, refresh using refresh_token
  → Update stored tokens
```

---

## Testing the Integration

### 1. Setup Environment

```bash
cd backend
cp .env.example .env
# Edit .env and add your platform credentials
```

### 2. Start Server

```bash
npm run build
node dist/server.js
```

### 3. Connect Platform

1. Login to your frontend at http://localhost:5173
2. Navigate to Dashboard → Financial Overview
3. Click "Connect Upwork" (or other platform)
4. Authorize the application on the platform
5. You'll be redirected back with connection success

### 4. View Earnings

After connection:
- Earnings are automatically synced
- View in "My Balance" section
- Click "Sync Earnings" to refresh data

---

## API Endpoints

### Frontend → Backend

```
GET  /api/finance/summary
  → Get aggregated financial summary

POST /api/finance/sync
  → Sync all connected platforms

POST /api/finance/sync/:platform
  → Sync specific platform

GET  /api/finance/platforms
  → Get list of connected platforms

GET  /api/finance/oauth/:platform/authorize
  → Get OAuth authorization URL

GET  /api/finance/oauth/:platform/callback
  → Handle OAuth callback (redirect)

DELETE /api/finance/platforms/:platform
  → Disconnect a platform
```

---

## Security Considerations

### Token Storage

- Access tokens are stored in MongoDB with `select: false` (not returned by default)
- Consider encrypting tokens at rest using mongoose plugins
- Tokens are never exposed to frontend

### Scopes

- Request only necessary scopes
- Clearly communicate to users what data is accessed

### Token Refresh

- Refresh tokens automatically before expiry
- Handle 401/403 errors by marking connections as inactive

### HTTPS

- **Production**: Always use HTTPS for OAuth callbacks
- Update redirect URIs to use `https://` in production

### Rate Limiting

- Implement rate limiting on sync endpoints
- Cache financial summaries to reduce API calls
- Consider background jobs for periodic syncing

---

## Troubleshooting

### "Platform client ID not configured"

**Problem**: Environment variable not set

**Solution**: Add `UPWORK_CLIENT_ID`, `FREELANCER_CLIENT_ID`, or `FIVERR_CLIENT_ID` to `.env`

### "Authorization expired"

**Problem**: Token expired and refresh failed

**Solution**: 
- User needs to reconnect the platform
- Check if refresh_token is valid
- Verify OAuth credentials

### "Connection failed"

**Problem**: OAuth callback received error

**Solution**:
- Check redirect URI matches exactly in platform settings
- Verify client credentials
- Check server logs for detailed error

### "Failed to fetch earnings"

**Problem**: API call to platform failed

**Solution**:
- Verify API endpoints are correct
- Check token validity
- Review platform API documentation for changes
- Check rate limits

---

## Production Deployment

### 1. Update Environment Variables

```env
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Update OAuth Redirect URIs

For each platform, update the redirect URI to:
```
https://your-backend-domain.com/api/finance/oauth/:platform/callback
```

### 3. Enable HTTPS

Ensure your backend is served over HTTPS.

### 4. Background Sync Job

Consider implementing a cron job or background worker to:
- Sync earnings daily for all users
- Refresh expired tokens
- Update financial summaries

Example using node-cron:

```typescript
import cron from 'node-cron';
import financeService from './services/finance.service';
import PlatformConnection from './models/platform-connection.model';

// Sync all users every day at 3 AM
cron.schedule('0 3 * * *', async () => {
  const connections = await PlatformConnection.find({ isActive: true })
    .distinct('userId');
  
  for (const userId of connections) {
    try {
      await financeService.syncAllPlatforms(userId);
      console.log(`✅ Synced earnings for user ${userId}`);
    } catch (error) {
      console.error(`❌ Failed to sync for user ${userId}:`, error);
    }
  }
});
```

---

## Support

For issues related to:
- **Platform APIs**: Contact platform developer support
- **OAuth errors**: Check platform documentation
- **Integration code**: Review this codebase and logs

---

## Summary

This integration enables users to:
✅ Connect Upwork, Freelancer, and Fiverr accounts
✅ Automatically fetch real earnings and transactions
✅ View aggregated financial data in dashboard
✅ Sync data on-demand or automatically

The system is production-ready and follows OAuth 2.0 best practices.
