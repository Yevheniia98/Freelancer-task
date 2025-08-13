# 📧 How to Setup Real Email Sending for Password Reset

## Step 1: Get Gmail App Password

### Option A: Gmail App Password (Recommended)
1. **Go to your Google Account settings**: https://myaccount.google.com/
2. **Click "Security"** in the left sidebar
3. **Enable 2-Step Verification** if not already enabled
4. **Click "App passwords"** (appears after 2-step verification is enabled)
5. **Select "Mail"** and **"Other (custom name)"**
6. **Enter "Freelancer-Task"** as the app name
7. **Copy the 16-character app password** (looks like: `abcd efgh ijkl mnop`)

### Option B: Other Email Providers
- **Outlook/Hotmail**: Use regular password (may need to enable "Less secure app access")
- **Yahoo**: Generate app password similar to Gmail
- **Custom SMTP**: Use your hosting provider's SMTP settings

## Step 2: Update Your .env File

Edit `/Users/evgenya/freelancer-task/backend/.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

**Replace:**
- `your-actual-email@gmail.com` with your Gmail address
- `your-16-character-app-password` with the app password from Step 1

## Step 3: Test Email Sending

1. **Build and start the backend:**
   ```bash
   cd /Users/evgenya/freelancer-task/backend
   npm run build
   node dist/server.js
   ```

2. **Test forgot password:**
   - Open: http://localhost:8080/forgot-password-demo.html
   - Enter your email address
   - Check your inbox for the verification code

## Example .env Configuration

```env
# Working Gmail Configuration Example:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
```

## Security Notes

⚠️ **Important Security Tips:**
- ✅ Use App Passwords (not your regular Gmail password)
- ✅ Keep your .env file private (never commit to git)
- ✅ App passwords are safer than regular passwords
- ✅ You can revoke app passwords anytime from Google Account settings

## Troubleshooting

**Common Issues:**
1. **"Authentication failed"** → Check app password is correct
2. **"Connection refused"** → Check SMTP_HOST and SMTP_PORT
3. **"Less secure app"** → Use app password instead
4. **Emails go to spam** → Normal for development, check spam folder

## Testing Other Email Providers

### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Yahoo:
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Ready to Test!

Once you update your .env file with real credentials:
1. The system will automatically switch from mock to real email sending
2. You'll receive actual emails in your inbox
3. The console will show "Real email sent successfully"

🎯 **Your personalized password reset emails are ready to send!**
