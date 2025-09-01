# Project API Documentation

This document provides examples of how to use the Project CRUD API endpoints.

## Base URL
```
http://localhost:5000/api/projects
```

## Endpoints

### 1. Create Project
**POST** `/api/projects`

Creates a new project with the specified details.

**Request Body:**
```json
{
  "title": "New Website Development",
  "description": "Develop a modern responsive website for the client",
  "status": "pending",
  "priority": "high",
  "deadline": "2025-12-31T23:59:59.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "66c123456789abcdef123456",
    "title": "New Website Development",
    "description": "Develop a modern responsive website for the client",
    "status": "pending",
    "priority": "high",
    "deadline": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-08-21T10:30:00.000Z",
    "updatedAt": "2025-08-21T10:30:00.000Z"
  }
}
```

### 2. Get All Projects
**GET** `/api/projects`

Retrieves all projects with optional filtering, pagination, and sorting.

**Query Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Number of items per page (default: 10, max: 100)
- `status` (string, optional): Filter by status (`pending`, `in_progress`, `completed`, `cancelled`)
- `priority` (string, optional): Filter by priority (`low`, `medium`, `high`, `urgent`)
- `search` (string, optional): Search in title and description
- `sortBy` (string, optional): Sort field (`createdAt`, `updatedAt`, `title`, `deadline`, `priority`)
- `sortOrder` (string, optional): Sort order (`asc`, `desc`)

**Example Requests:**
```bash
# Get all projects (first page)
GET /api/projects

# Get projects with pagination
GET /api/projects?page=2&limit=5

# Filter by status
GET /api/projects?status=in_progress

# Search projects
GET /api/projects?search=website

# Sort by priority (highest first)
GET /api/projects?sortBy=priority&sortOrder=desc

# Combined filters
GET /api/projects?status=pending&priority=high&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "66c123456789abcdef123456",
      "title": "New Website Development",
      "description": "Develop a modern responsive website for the client",
      "status": "pending",
      "priority": "high",
      "deadline": "2025-12-31T23:59:59.000Z",
      "createdAt": "2025-08-21T10:30:00.000Z",
      "updatedAt": "2025-08-21T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 3. Get Single Project
**GET** `/api/projects/:id`

Retrieves a specific project by its ID.

**Example Request:**
```bash
GET /api/projects/66c123456789abcdef123456
```

**Response:**
```json
{
  "success": true,
  "message": "Project retrieved successfully",
  "data": {
    "id": "66c123456789abcdef123456",
    "title": "New Website Development",
    "description": "Develop a modern responsive website for the client",
    "status": "pending",
    "priority": "high",
    "deadline": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-08-21T10:30:00.000Z",
    "updatedAt": "2025-08-21T10:30:00.000Z"
  }
}
```

### 4. Update Project
**PUT** `/api/projects/:id`

Updates an existing project. Only provided fields will be updated.

**Request Body:**
```json
{
  "title": "Updated Website Development",
  "status": "in_progress",
  "priority": "urgent"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "data": {
    "id": "66c123456789abcdef123456",
    "title": "Updated Website Development",
    "description": "Develop a modern responsive website for the client",
    "status": "in_progress",
    "priority": "urgent",
    "deadline": "2025-12-31T23:59:59.000Z",
    "createdAt": "2025-08-21T10:30:00.000Z",
    "updatedAt": "2025-08-21T11:45:00.000Z"
  }
}
```

### 5. Delete Project
**DELETE** `/api/projects/:id`

Deletes a specific project by its ID.

**Example Request:**
```bash
DELETE /api/projects/66c123456789abcdef123456
```

**Response:**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### 6. Get Project Statistics
**GET** `/api/projects/stats`

Retrieves project statistics including counts by status and priority.

**Response:**
```json
{
  "success": true,
  "message": "Project statistics retrieved successfully",
  "data": {
    "total": 25,
    "byStatus": {
      "pending": 8,
      "in_progress": 12,
      "completed": 4,
      "cancelled": 1
    },
    "byPriority": {
      "low": 5,
      "medium": 10,
      "high": 8,
      "urgent": 2
    },
    "overdue": 3
  }
}
```

### 7. Search Projects
**GET** `/api/projects/search`

Searches projects by text in title and description.

**Query Parameters:**
- `q` (string, required): Search query
- `limit` (number, optional): Maximum results (default: 10, max: 50)

**Example Request:**
```bash
GET /api/projects/search?q=website&limit=5
```

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "66c123456789abcdef123456",
      "title": "Website Development",
      "description": "Develop a modern responsive website",
      "status": "pending",
      "priority": "high",
      "deadline": "2025-12-31T23:59:59.000Z",
      "createdAt": "2025-08-21T10:30:00.000Z",
      "updatedAt": "2025-08-21T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### 8. Bulk Update Status
**PATCH** `/api/projects/bulk/status`

Updates the status of multiple projects at once.

**Request Body:**
```json
{
  "ids": ["66c123456789abcdef123456", "66c123456789abcdef123457"],
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 projects updated successfully",
  "data": {
    "modifiedCount": 2
  }
}
```

## Data Models

### Project Entity Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | auto | Unique identifier |
| title | string | yes | Project title (max 200 chars) |
| description | string | yes | Project description (max 1000 chars) |
| status | enum | no | Project status (default: 'pending') |
| priority | enum | no | Project priority (default: 'medium') |
| deadline | date | no | Project deadline |
| createdAt | date | auto | Creation timestamp |
| updatedAt | date | auto | Last update timestamp |

### Status Values
- `pending` - Project is pending/planned
- `in_progress` - Project is actively being worked on
- `completed` - Project has been completed
- `cancelled` - Project has been cancelled

### Priority Values
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority
- `urgent` - Urgent priority

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

- `200` - Success (GET, PUT, DELETE)
- `201` - Created successfully (POST)
- `400` - Bad request (validation errors)
- `404` - Resource not found
- `500` - Internal server error

## cURL Examples

### Create a project:
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mobile App Development",
    "description": "Create a mobile app for iOS and Android",
    "status": "pending",
    "priority": "high",
    "deadline": "2025-12-31T23:59:59.000Z"
  }'
```

### Get all projects:
```bash
curl -X GET "http://localhost:5000/api/projects?page=1&limit=10&status=pending"
```

### Update a project:
```bash
curl -X PUT http://localhost:5000/api/projects/66c123456789abcdef123456 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "priority": "urgent"
  }'
```

### Delete a project:
```bash
curl -X DELETE http://localhost:5000/api/projects/66c123456789abcdef123456
```
