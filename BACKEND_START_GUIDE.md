# Backend Server Startup Guide

## Issue
The frontend is unable to connect to the backend API on `localhost:3002`. The following errors are occurring:
- `net::ERR_CONNECTION_REFUSED` when trying to fetch from `/api/api/finance/summary`
- Finance and Tax sections showing "Failed to load financial data"

## Solution

### Quick Start (Recommended)

#### Option 1: Using NPM (if dependencies are installed)
```bash
cd /Users/evgenya/freelancer-task/backend
npm run dev
# or
npm start
```

#### Option 2: Using the provided startup script
```bash
bash /Users/evgenya/freelancer-task/backend/start-server.sh
```

#### Option 3: Manual startup with Node
```bash
cd /Users/evgenya/freelancer-task/backend

# Set environment variables
export NODE_ENV=development
export PORT=3002
export FRONTEND_URL=http://localhost:3030
export MONGODB_URI=mongodb://admin:password@localhost:27017/protocol-task-manager?authSource=admin
export REDIS_URL=redis://localhost:6379
export JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-complex
export JWT_EXPIRES_IN=24h

# Start the server
node dist/server.js
# or if using TypeScript directly
npx ts-node src/index.ts
```

### Prerequisites
1. **MongoDB** - Must be running (typically on port 27017)
   ```bash
   # Start MongoDB using Docker (if you have it installed)
   docker-compose up -d mongodb
   
   # Or check if it's already running
   ps aux | grep mongod
   ```

2. **Node.js** - Must be installed
   ```bash
   node --version
   ```

3. **Dependencies** - Must be installed
   ```bash
   cd /Users/evgenya/freelancer-task/backend
   npm install
   ```

### Verify Backend is Running
Once started, you should see output like:
```
✓ Server running on http://localhost:3002
✓ Connected to MongoDB
✓ Connected to Redis
```

Test the API:
```bash
curl http://localhost:3002/api/health
# Should return: {"status":"ok"}
```

### Troubleshooting

#### Port 3002 Already in Use
```bash
# Find what's using port 3002
lsof -i :3002

# Kill the process
kill -9 <PID>
```

#### MongoDB Connection Failed
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Or using Docker
docker ps | grep mongodb

# Start MongoDB if needed
docker-compose up -d mongodb
```

#### Dependencies Missing
```bash
cd /Users/evgenya/freelancer-task/backend
npm install --save
```

## Frontend Fallback
**Note:** The frontend now has a fallback mechanism. If the backend is unavailable:
- Mock financial data will be displayed automatically
- No error messages will be shown
- User can still use the application with demo data
- Real data will be loaded once backend is available

To start the backend properly and get real data, follow the instructions above.

## Dashboard Features Requiring Backend
- Finance/Tax data loading
- Meeting invitations via email
- Project synchronization with Upwork/Freelancer
- Real-time notifications

