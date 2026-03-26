#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Freelancer Task Manager...${NC}"

# Start backend
echo -e "${GREEN}Starting backend server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${GREEN}Starting frontend server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo -e "${BLUE}Servers started!${NC}"
echo -e "Backend PID: $BACKEND_PID"
echo -e "Frontend PID: $FRONTEND_PID"
echo -e "${GREEN}Backend: http://localhost:3002${NC}"
echo -e "${GREEN}Frontend: http://localhost:3030${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
wait
