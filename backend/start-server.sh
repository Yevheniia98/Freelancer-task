#!/bin/bash

echo "🚀 Starting Freelancer Task Manager Backend Server"
echo "================================================="

# Navigate to correct backend directory
cd /Users/evgenya/freelancer-task/backend

# Check if Docker containers are running
echo "🐳 Checking Docker containers..."
docker-compose ps

# Kill any existing server processes
echo "🛑 Stopping existing server processes..."
pkill -f "node.*server.js" 2>/dev/null || true

# Wait a moment
sleep 2

# Start the server with correct environment
echo "🏁 Starting backend server..."
echo "📍 Working directory: $(pwd)"

export NODE_ENV=development
export PORT=3002
export FRONTEND_URL=http://localhost:3030
export MONGODB_URI=mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex
export JWT_EXPIRES_IN=24h

node dist/server.js
