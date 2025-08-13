# Email Service Setup Guide

## 🏢 Production Email Configuration

In real-world applications, you need a **dedicated service email account** to send emails to customers.

### ✅ Correct Approach: Service Email Account

```
Service Email: noreply@yourcompany.com
Purpose: Sends password reset codes TO customers
Configuration: Business Gmail or dedicated email service
```

### ❌ Incorrect Approach: Customer Email Credentials
Never use customer email credentials in your backend configuration.

## 🚀 Setup Options

### Option 1: Business Gmail Account (Recommended for Development)

1. **Create a business Gmail account**:
   ```
   Example: freelancertask.noreply@gmail.com
   ```

2. **Enable 2-Factor Authentication**

3. **Generate App Password**:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" → Generate password
   - Copy the 16-character password

4. **Update .env file**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=freelancertask.noreply@gmail.com
   SMTP_PASS=your-16-character-app-password
   ```

### Option 2: Professional Email Services (Production)

**SendGrid** (Recommended for production):
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Mailgun**:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-user
SMTP_PASS=your-mailgun-password
```

**Amazon SES**:
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key
SMTP_PASS=your-aws-secret-key
```

## 🔧 Testing

### Test Configuration:
```bash
cd /Users/evgenya/freelancer-task/backend
node test-email.js
```

### Test Forgot Password:
1. Use frontend forgot password form
2. Enter customer email: `vickyjosh94@gmail.com`
3. Customer receives email FROM: `freelancertask.noreply@gmail.com`
4. Customer enters verification code to reset password

## 📋 Email Flow

```
1. Customer clicks "Forgot Password"
2. Customer enters: vickyjosh94@gmail.com
3. System sends email FROM: freelancertask.noreply@gmail.com
4. System sends email TO: vickyjosh94@gmail.com
5. Customer receives reset code in their inbox
6. Customer enters code to reset password
```

## 🔒 Security Best Practices

- ✅ Use service account credentials in backend
- ✅ Never store customer email passwords
- ✅ Use environment variables for credentials
- ✅ Use App Passwords (not regular passwords)
- ✅ Validate email addresses before sending
- ✅ Rate limit forgot password requests
- ✅ Expire verification codes (15 minutes)

## 🚨 Common Issues

1. **"Authentication failed"** → Check App Password is correct
2. **"Connection refused"** → Check SMTP host/port settings
3. **"Mock mode active"** → Credentials not configured properly
4. **"Gmail blocks sign-in"** → Enable 2FA and use App Password
