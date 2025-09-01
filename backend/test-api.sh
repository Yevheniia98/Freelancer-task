#!/bin/bash

# Project API Test Script
# Make sure the server is running on port 3002 before executing this script

BASE_URL="http://localhost:3002/api/projects"

echo "🧪 Testing Project CRUD API"
echo "================================"

# Test 1: Create a project
echo -e "\n1. Creating a test project..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Website Redesign Project",
    "description": "Complete redesign of the company website with modern UI/UX",
    "status": "pending",
    "priority": "high",
    "deadline": "2025-12-31T23:59:59.000Z"
  }')

echo "Response: $CREATE_RESPONSE"

# Extract project ID from the response
PROJECT_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | grep -o '[^"]*$' | head -1)
echo "Created Project ID: $PROJECT_ID"

# Test 2: Get all projects
echo -e "\n2. Getting all projects..."
GET_ALL_RESPONSE=$(curl -s -X GET $BASE_URL)
echo "Response: $GET_ALL_RESPONSE"

# Test 3: Get single project
if [ ! -z "$PROJECT_ID" ]; then
  echo -e "\n3. Getting single project by ID..."
  GET_SINGLE_RESPONSE=$(curl -s -X GET "$BASE_URL/$PROJECT_ID")
  echo "Response: $GET_SINGLE_RESPONSE"

  # Test 4: Update project
  echo -e "\n4. Updating project status..."
  UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/$PROJECT_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "status": "in_progress",
      "priority": "urgent"
    }')
  echo "Response: $UPDATE_RESPONSE"
fi

# Test 5: Get project statistics
echo -e "\n5. Getting project statistics..."
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/stats")
echo "Response: $STATS_RESPONSE"

# Test 6: Search projects
echo -e "\n6. Searching projects..."
SEARCH_RESPONSE=$(curl -s -X GET "$BASE_URL/search?q=website&limit=5")
echo "Response: $SEARCH_RESPONSE"

# Test 7: Get projects with filters
echo -e "\n7. Getting projects with filters..."
FILTER_RESPONSE=$(curl -s -X GET "$BASE_URL?status=in_progress&priority=urgent&page=1&limit=10")
echo "Response: $FILTER_RESPONSE"

# Test 8: Delete project (uncomment if you want to test deletion)
# if [ ! -z "$PROJECT_ID" ]; then
#   echo -e "\n8. Deleting project..."
#   DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/$PROJECT_ID")
#   echo "Response: $DELETE_RESPONSE"
# fi

echo -e "\n✅ API testing complete!"
echo "Make sure to check the responses above for any errors."
