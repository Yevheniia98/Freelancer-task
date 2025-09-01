# Task API Documentation

This document provides examples of how to use the Task CRUD API endpoints.

## Base URL
```
http://localhost:3002/api/tasks
```

## Endpoints Overview

The Task API provides comprehensive CRUD operations with additional features like task assignment, bulk operations, and advanced filtering.

### Task Entity Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Unique identifier |
| title | string | yes | Task title (max 200 chars) |
| description | string | yes | Task description (max 2000 chars) |
| dueDate | date | no | Task due date |
| priority | enum | no | Task priority (default: 'medium') |
| status | enum | no | Task status (default: 'todo') |
| assigneeId | string | no | ID of assigned user |
| projectId | string | yes | ID of associated project |
| createdAt | date | auto | Creation timestamp |
| updatedAt | date | auto | Last update timestamp |

### Status Values
- `todo` - Task is pending/not started
- `in_progress` - Task is actively being worked on
- `in_review` - Task is under review
- `completed` - Task has been completed
- `cancelled` - Task has been cancelled

### Priority Values
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority
- `urgent` - Urgent priority

## API Endpoints

### 1. Create Task
**POST** `/api/tasks`

Creates a new task with the specified details.

**Request Body:**
```json
{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication system with login/register functionality",
  "projectId": "66c123456789abcdef123456",
  "assigneeId": "66c123456789abcdef123457",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-09-01T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "66c123456789abcdef123458",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system with login/register functionality",
    "projectId": {
      "_id": "66c123456789abcdef123456",
      "title": "Website Development Project"
    },
    "assigneeId": {
      "_id": "66c123456789abcdef123457",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-09-01T10:00:00.000Z",
    "createdAt": "2025-08-21T12:30:00.000Z",
    "updatedAt": "2025-08-21T12:30:00.000Z"
  }
}
```

### 2. Get All Tasks
**GET** `/api/tasks`

Retrieves all tasks with optional filtering, pagination, and sorting.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 10, max: 100)
- `projectId` (string, optional): Filter by project ID
- `assigneeId` (string, optional): Filter by assignee ID
- `status` (string, optional): Filter by status
- `priority` (string, optional): Filter by priority
- `search` (string, optional): Search in title and description
- `overdue` (boolean, optional): Filter overdue tasks
- `dueSoon` (boolean, optional): Filter tasks due within 24 hours
- `sortBy` (string, optional): Sort field (`createdAt`, `updatedAt`, `title`, `dueDate`, `priority`, `status`)
- `sortOrder` (string, optional): Sort order (`asc`, `desc`)

**Example Requests:**
```bash
# Get all tasks
GET /api/tasks

# Get tasks with pagination
GET /api/tasks?page=2&limit=5

# Filter by project
GET /api/tasks?projectId=66c123456789abcdef123456

# Filter by assignee
GET /api/tasks?assigneeId=66c123456789abcdef123457

# Filter by status and priority
GET /api/tasks?status=in_progress&priority=high

# Get overdue tasks
GET /api/tasks?overdue=true

# Get tasks due soon
GET /api/tasks?dueSoon=true

# Search tasks
GET /api/tasks?search=authentication

# Sort by due date (earliest first)
GET /api/tasks?sortBy=dueDate&sortOrder=asc

# Combined filters
GET /api/tasks?projectId=66c123456789abcdef123456&status=todo&priority=high&page=1&limit=10
```

### 3. Get Single Task
**GET** `/api/tasks/:id`

Retrieves a specific task by its ID.

**Response:**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "66c123456789abcdef123458",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication system",
    "projectId": {
      "_id": "66c123456789abcdef123456",
      "title": "Website Development Project"
    },
    "assigneeId": {
      "_id": "66c123456789abcdef123457",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-09-01T10:00:00.000Z",
    "createdAt": "2025-08-21T12:30:00.000Z",
    "updatedAt": "2025-08-21T12:30:00.000Z"
  }
}
```

### 4. Update Task
**PUT** `/api/tasks/:id`

Updates an existing task. Only provided fields will be updated.

**Request Body:**
```json
{
  "status": "in_progress",
  "priority": "urgent",
  "dueDate": "2025-08-25T10:00:00.000Z"
}
```

### 5. Delete Task
**DELETE** `/api/tasks/:id`

Deletes a specific task by its ID.

### 6. Get Tasks by Project
**GET** `/api/tasks/project/:projectId`

Retrieves all tasks for a specific project.

**Example:**
```bash
GET /api/tasks/project/66c123456789abcdef123456?status=todo&priority=high
```

### 7. Get Tasks by Assignee
**GET** `/api/tasks/assignee/:assigneeId`

Retrieves all tasks assigned to a specific user.

**Example:**
```bash
GET /api/tasks/assignee/66c123456789abcdef123457?status=in_progress
```

### 8. Get Task Statistics
**GET** `/api/tasks/stats`

Retrieves task statistics including counts by status and priority.

**Query Parameters:**
- `projectId` (string, optional): Get stats for specific project

**Response:**
```json
{
  "success": true,
  "message": "Task statistics retrieved successfully",
  "data": {
    "total": 50,
    "byStatus": {
      "todo": 15,
      "in_progress": 20,
      "in_review": 8,
      "completed": 5,
      "cancelled": 2
    },
    "byPriority": {
      "low": 10,
      "medium": 25,
      "high": 12,
      "urgent": 3
    },
    "overdue": 5,
    "dueSoon": 8,
    "completed": 5
  }
}
```

### 9. Search Tasks
**GET** `/api/tasks/search`

Searches tasks by text in title and description.

**Query Parameters:**
- `q` (string, required): Search query
- `projectId` (string, optional): Limit search to specific project
- `limit` (number, optional): Maximum results (default: 10, max: 50)

**Example:**
```bash
GET /api/tasks/search?q=authentication&projectId=66c123456789abcdef123456&limit=5
```

### 10. Assign Task
**PATCH** `/api/tasks/:id/assign`

Assigns or unassigns a task to/from a user.

**Request Body:**
```json
{
  "assigneeId": "66c123456789abcdef123457"
}
```

**To unassign:**
```json
{
  "assigneeId": null
}
```

### 11. Bulk Update Status
**PATCH** `/api/tasks/bulk/status`

Updates the status of multiple tasks at once.

**Request Body:**
```json
{
  "ids": ["66c123456789abcdef123458", "66c123456789abcdef123459"],
  "status": "completed"
}
```

## cURL Examples

### Create a task:
```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design database schema",
    "description": "Create the database schema for the user management system",
    "projectId": "66c123456789abcdef123456",
    "priority": "high",
    "dueDate": "2025-09-01T10:00:00.000Z"
  }'
```

### Get all tasks for a project:
```bash
curl -X GET "http://localhost:3002/api/tasks/project/66c123456789abcdef123456?status=todo&priority=high"
```

### Update task status:
```bash
curl -X PUT http://localhost:3002/api/tasks/66c123456789abcdef123458 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress"
  }'
```

### Assign task:
```bash
curl -X PATCH http://localhost:3002/api/tasks/66c123456789abcdef123458/assign \
  -H "Content-Type: application/json" \
  -d '{
    "assigneeId": "66c123456789abcdef123457"
  }'
```

### Get overdue tasks:
```bash
curl -X GET "http://localhost:3002/api/tasks?overdue=true&sortBy=dueDate&sortOrder=asc"
```

### Bulk update status:
```bash
curl -X PATCH http://localhost:3002/api/tasks/bulk/status \
  -H "Content-Type: application/json" \
  -d '{
    "ids": ["66c123456789abcdef123458", "66c123456789abcdef123459"],
    "status": "completed"
  }'
```

### Search tasks:
```bash
curl -X GET "http://localhost:3002/api/tasks/search?q=authentication&limit=10"
```

### Delete task:
```bash
curl -X DELETE http://localhost:3002/api/tasks/66c123456789abcdef123458
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

## HTTP Status Codes

- `200` - Success (GET, PUT, PATCH, DELETE)
- `201` - Created successfully (POST)
- `400` - Bad request (validation errors)
- `404` - Resource not found
- `500` - Internal server error

## Integration with Projects

Tasks are linked to projects via the `projectId` field. When creating tasks, ensure the project exists and you have proper permissions to add tasks to it.

## Real-time Updates

Consider implementing WebSocket connections for real-time task updates, especially useful for:
- Task status changes
- Task assignments
- Due date reminders
- Overdue notifications
