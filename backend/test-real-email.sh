#!/bin/bash

echo "🚀 Starting Freelancer-Task Email Test..."
echo ""

# Check if .env is configured
if grep -q "your-email@gmail.com" /Users/evgenya/freelancer-task/backend/.env; then
    echo "⚠️  Please update your .env file first!"
    echo "📝 Edit: /Users/evgenya/freelancer-task/backend/.env"
    echo "✏️  Replace 'your-email@gmail.com' with your actual Gmail"
    echo "✏️  Replace 'your-app-password' with your Gmail App Password"
    echo ""
    echo "📖 See EMAIL_SETUP_GUIDE.md for detailed instructions"
    exit 1
fi

echo "📧 Building backend with updated email service..."
cd /Users/evgenya/freelancer-task/backend
npm run build

echo ""
echo "🧪 Testing email configuration..."
node check-email-config.js

echo ""
echo "🎯 If real email mode is active, you can now:"
echo "1. Open: http://localhost:8080/forgot-password-demo.html"
echo "2. Enter your email address"
echo "3. Check your inbox for the verification code!"
echo ""
echo "✅ Your personalized password reset emails are ready!"
