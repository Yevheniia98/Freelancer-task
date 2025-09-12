#!/bin/bash

# Task API Test Script
# Make sure the server is running on port 3002 before executing this script

BASE_URL="http://localhost:3002/api"
TASKS_URL="$BASE_URL/tasks"
PROJECTS_URL="$BASE_URL/projects"

echo "🧪 Testing Task CRUD API"
echo "================================"

# First, we need a project to associate tasks with
echo -e "\n0. Creating a test project for tasks..."
PROJECT_RESPONSE=$(curl -s -X POST $PROJECTS_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Testing Project",
    "description": "A project created for testing task API endpoints",
    "priority": "high"
  }')

echo "Project Response: $PROJECT_RESPONSE"

# Extract project ID
PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"id":"[^"]*"' | grep -o '[^"]*$' | head -1)
echo "Created Project ID: $PROJECT_ID"

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Failed to create test project. Exiting..."
  exit 1
fi

# Test 1: Create a task
echo -e "\n1. Creating a test task..."
CREATE_RESPONSE=$(curl -s -X POST $TASKS_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Implement user authentication\",
    \"description\": \"Add JWT-based authentication system with login and registration functionality\",
    \"projectId\": \"$PROJECT_ID\",
    \"priority\": \"high\",
    \"status\": \"todo\",
    \"dueDate\": \"2025-12-31T10:00:00.000Z\"
  }")

echo "Response: $CREATE_RESPONSE"

# Extract task ID
TASK_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | grep -o '[^"]*$' | head -1)
echo "Created Task ID: $TASK_ID"

# Test 2: Create another task
echo -e "\n2. Creating another test task..."
CREATE_RESPONSE_2=$(curl -s -X POST $TASKS_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Design database schema\",
    \"description\": \"Create the database schema for user management and task tracking\",
    \"projectId\": \"$PROJECT_ID\",
    \"priority\": \"medium\",
    \"status\": \"todo\"
  }")

echo "Response: $CREATE_RESPONSE_2"

TASK_ID_2=$(echo $CREATE_RESPONSE_2 | grep -o '"id":"[^"]*"' | grep -o '[^"]*$' | head -1)
echo "Created Task ID 2: $TASK_ID_2"

# Test 3: Get all tasks
echo -e "\n3. Getting all tasks..."
GET_ALL_RESPONSE=$(curl -s -X GET $TASKS_URL)
echo "Response: $GET_ALL_RESPONSE"

# Test 4: Get tasks by project
echo -e "\n4. Getting tasks by project ID..."
GET_PROJECT_TASKS_RESPONSE=$(curl -s -X GET "$TASKS_URL/project/$PROJECT_ID")
echo "Response: $GET_PROJECT_TASKS_RESPONSE"

# Test 5: Get single task
if [ ! -z "$TASK_ID" ]; then
  echo -e "\n5. Getting single task by ID..."
  GET_SINGLE_RESPONSE=$(curl -s -X GET "$TASKS_URL/$TASK_ID")
  echo "Response: $GET_SINGLE_RESPONSE"

  # Test 6: Update task
  echo -e "\n6. Updating task status and priority..."
  UPDATE_RESPONSE=$(curl -s -X PUT "$TASKS_URL/$TASK_ID" \
    -H "Content-Type: application/json" \
    -d '{
      "status": "in_progress",
      "priority": "urgent"
    }')
  echo "Response: $UPDATE_RESPONSE"
fi

# Test 7: Get task statistics
echo -e "\n7. Getting task statistics..."
STATS_RESPONSE=$(curl -s -X GET "$TASKS_URL/stats")
echo "Response: $STATS_RESPONSE"

# Test 8: Get project-specific statistics
echo -e "\n8. Getting project-specific task statistics..."
PROJECT_STATS_RESPONSE=$(curl -s -X GET "$TASKS_URL/stats?projectId=$PROJECT_ID")
echo "Response: $PROJECT_STATS_RESPONSE"

# Test 9: Search tasks
echo -e "\n9. Searching tasks..."
SEARCH_RESPONSE=$(curl -s -X GET "$TASKS_URL/search?q=authentication&limit=5")
echo "Response: $SEARCH_RESPONSE"

# Test 10: Get tasks with filters
echo -e "\n10. Getting tasks with filters (status=todo, priority=high)..."
FILTER_RESPONSE=$(curl -s -X GET "$TASKS_URL?status=todo&priority=high&page=1&limit=10")
echo "Response: $FILTER_RESPONSE"

# Test 11: Get tasks with sorting
echo -e "\n11. Getting tasks sorted by creation date (newest first)..."
SORT_RESPONSE=$(curl -s -X GET "$TASKS_URL?sortBy=createdAt&sortOrder=desc&limit=5")
echo "Response: $SORT_RESPONSE"

# Test 12: Bulk update status
if [ ! -z "$TASK_ID" ] && [ ! -z "$TASK_ID_2" ]; then
  echo -e "\n12. Bulk updating task status..."
  BULK_UPDATE_RESPONSE=$(curl -s -X PATCH "$TASKS_URL/bulk/status" \
    -H "Content-Type: application/json" \
    -d "{
      \"ids\": [\"$TASK_ID\", \"$TASK_ID_2\"],
      \"status\": \"in_review\"
    }")
  echo "Response: $BULK_UPDATE_RESPONSE"
fi

# Test 13: Test task assignment (Note: This will fail if no users exist)
if [ ! -z "$TASK_ID" ]; then
  echo -e "\n13. Testing task assignment (will fail if no users exist)..."
  # First, let's try to unassign (this should work)
  UNASSIGN_RESPONSE=$(curl -s -X PATCH "$TASKS_URL/$TASK_ID/assign" \
    -H "Content-Type: application/json" \
    -d '{
      "assigneeId": null
    }')
  echo "Unassign Response: $UNASSIGN_RESPONSE"
fi

# Test 14: Test error handling - try to create invalid task
echo -e "\n14. Testing error handling with invalid task creation..."
ERROR_RESPONSE=$(curl -s -X POST $TASKS_URL \
  -H "Content-Type: application/json" \
  -d '{
    "title": "",
    "description": "This should fail due to empty title"
  }')
echo "Error Response: $ERROR_RESPONSE"

# Test 15: Test 404 handling - try to get non-existent task
echo -e "\n15. Testing 404 handling with non-existent task..."
NOT_FOUND_RESPONSE=$(curl -s -X GET "$TASKS_URL/507f1f77bcf86cd799439011")
echo "404 Response: $NOT_FOUND_RESPONSE"

# Test 16: Delete tasks (cleanup)
echo -e "\n16. Cleaning up - deleting test tasks..."
if [ ! -z "$TASK_ID" ]; then
  DELETE_RESPONSE_1=$(curl -s -X DELETE "$TASKS_URL/$TASK_ID")
  echo "Delete Task 1 Response: $DELETE_RESPONSE_1"
fi

if [ ! -z "$TASK_ID_2" ]; then
  DELETE_RESPONSE_2=$(curl -s -X DELETE "$TASKS_URL/$TASK_ID_2")
  echo "Delete Task 2 Response: $DELETE_RESPONSE_2"
fi

# Clean up the test project
echo -e "\n17. Cleaning up - deleting test project..."
if [ ! -z "$PROJECT_ID" ]; then
  DELETE_PROJECT_RESPONSE=$(curl -s -X DELETE "$PROJECTS_URL/$PROJECT_ID")
  echo "Delete Project Response: $DELETE_PROJECT_RESPONSE"
fi

echo -e "\n✅ Task API testing complete!"
echo "Check the responses above for any errors or unexpected behavior."
echo ""
echo "🔍 Key things to verify:"
echo "- Task creation returns proper task objects with populated project info"
echo "- Filtering and sorting work as expected"
echo "- Statistics show correct counts"
echo "- Search returns relevant results"
echo "- Bulk operations modify the expected number of tasks"
echo "- Error handling returns proper error messages"
echo "- Cleanup operations complete successfully"
