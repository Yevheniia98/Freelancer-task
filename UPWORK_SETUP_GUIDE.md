# Steps to Configure Upwork OAuth Integration

## 1. Create Upwork Developer App
1. Go to https://developers.upwork.com/
2. Sign in with your Upwork account
3. Navigate to "My Apps" or "API Keys"
4. Click "Create New App"

## 2. App Configuration
- App Name: Freelancer Task Manager
- App Description: Integration for project and task management
- Callback URL: http://localhost:3002/api/integrations/upwork/callback
- App Type: Web Application

## 3. Update .env File
Replace these placeholder values in backend/.env:
```
UPWORK_CONSUMER_KEY=your_actual_consumer_key_from_upwork
UPWORK_CONSUMER_SECRET=your_actual_consumer_secret_from_upwork
```

## 4. Restart Backend Server
After updating the credentials:
```bash
cd backend
npm run dev
```

## 5. Test the Integration
1. Go to your frontend integration page
2. Click on Upwork
3. You should be redirected to Upwork's OAuth authorization page
4. After authorization, you'll be redirected back and the integration should be connected

## Troubleshooting
- Make sure the callback URL in your Upwork app exactly matches: http://localhost:3002/api/integrations/upwork/callback
- Ensure your Upwork account has the necessary permissions for API access
- Check that your backend server is running on port 3002
