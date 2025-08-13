#!/bin/bash
cd /Users/evgenya/freelancer-task/protocol-task-manager/backend
export NODE_ENV=development
export PORT=3003
export FRONTEND_URL=http://localhost:3001
export MONGODB_URI=mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex
export JWT_EXPIRES_IN=24h
export UPWORK_CONSUMER_KEY=your_upwork_consumer_key_here
export UPWORK_CONSUMER_SECRET=your_upwork_consumer_secret_here
export UPWORK_CALLBACK_URL=http://localhost:3003/api/integrations/upwork/callback
export UPWORK_API_BASE_URL=https://www.upwork.com/api
export UPWORK_OAUTH_BASE_URL=https://www.upwork.com/api/auth/v1/oauth

node dist/server.js
