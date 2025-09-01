# Calendar Event API Documentation

## Overview
The Calendar Event API provides comprehensive CRUD operations for managing calendar events in the freelancer task management system. It includes features for event scheduling, reminders, project associations, attendee management, and advanced filtering.

## Base URL
```
/api/calendar-events
```

## Calendar Event Entity

### Schema
```typescript
interface ICalendarEventEntity {
  id: string;
  eventTitle: string;
  eventType: EventType;
  date: Date;
  reminder: ReminderType;
  projectId?: string;
  description?: string;
  duration?: number; // Duration in minutes
  location?: string;
  attendees?: string[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Event Types
- `meeting` - General meetings
- `deadline` - Project deadlines
- `milestone` - Project milestones
- `call` - Phone/video calls
- `presentation` - Presentations
- `review` - Reviews and evaluations
- `personal` - Personal events
- `other` - Other event types

### Reminder Types
- `none` - No reminder
- `5min` - 5 minutes before
- `15min` - 15 minutes before
- `30min` - 30 minutes before
- `1hour` - 1 hour before
- `2hours` - 2 hours before
- `1day` - 1 day before
- `1week` - 1 week before

### Virtual Fields
- `isUpcoming`: Boolean indicating if event is in the future and not completed
- `isOverdue`: Boolean indicating if event is in the past and not completed
- `isToday`: Boolean indicating if event is today
- `formattedDate`: Human-readable date format
- `reminderTime`: Calculated reminder date/time
- `reminderMinutes`: Reminder time in minutes

## API Endpoints

### 1. Create Calendar Event
**POST** `/api/calendar-events`

Creates a new calendar event.

**Request Body:**
```json
{
  "eventTitle": "Client Meeting",
  "eventType": "meeting",
  "date": "2025-08-25T14:30:00.000Z",
  "reminder": "15min",
  "projectId": "64f8b2a1d1f2c3b4a5e6f7g8",
  "description": "Quarterly review meeting",
  "duration": 60,
  "location": "Conference Room A",
  "attendees": ["client@example.com", "manager@company.com"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar event created successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Client Meeting",
    "eventType": "meeting",
    "date": "2025-08-25T14:30:00.000Z",
    "reminder": "15min",
    "projectId": "64f8b2a1d1f2c3b4a5e6f7g8",
    "description": "Quarterly review meeting",
    "duration": 60,
    "location": "Conference Room A",
    "attendees": ["client@example.com", "manager@company.com"],
    "isCompleted": false,
    "isUpcoming": true,
    "formattedDate": "Sunday, August 25, 2025 at 02:30 PM"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/calendar-events \
  -H "Content-Type: application/json" \
  -d '{
    "eventTitle": "Client Meeting",
    "eventType": "meeting",
    "date": "2025-08-25T14:30:00.000Z",
    "reminder": "15min",
    "description": "Quarterly review meeting",
    "duration": 60,
    "location": "Conference Room A"
  }'
```

### 2. Get All Calendar Events
**GET** `/api/calendar-events`

Retrieves all calendar events with pagination, filtering, and sorting options.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field (eventTitle, eventType, date, isCompleted, createdAt, updatedAt)
- `sortOrder` (string): Sort direction (asc, desc)
- `search` (string): Text search in title, description, and location
- `eventType` (string): Filter by event type
- `projectId` (string): Filter by project ID
- `isCompleted` (boolean): Filter by completion status
- `startDate` (string): Filter events from this date
- `endDate` (string): Filter events to this date
- `reminder` (string): Filter by reminder type
- `location` (string): Filter by location (case-insensitive)
- `hasAttendees` (boolean): Filter events with/without attendees

**Response:**
```json
{
  "success": true,
  "message": "Calendar events retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Client Meeting",
      "eventType": "meeting",
      "date": "2025-08-25T14:30:00.000Z",
      "isCompleted": false,
      "isUpcoming": true,
      "formattedDate": "Sunday, August 25, 2025 at 02:30 PM"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**cURL Examples:**
```bash
# Get all events (default pagination)
curl "http://localhost:5000/api/calendar-events"

# Get upcoming meetings
curl "http://localhost:5000/api/calendar-events?eventType=meeting&isCompleted=false&sortBy=date&sortOrder=asc"

# Get events for specific date range
curl "http://localhost:5000/api/calendar-events?startDate=2025-08-20T00:00:00.000Z&endDate=2025-08-30T23:59:59.000Z"

# Search events
curl "http://localhost:5000/api/calendar-events?search=client&limit=5"
```

### 3. Get Calendar Event by ID
**GET** `/api/calendar-events/:id`

Retrieves a specific calendar event by ID.

**Response:**
```json
{
  "success": true,
  "message": "Calendar event retrieved successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Client Meeting",
    "eventType": "meeting",
    "date": "2025-08-25T14:30:00.000Z",
    "projectId": {
      "id": "64f8b2a1d1f2c3b4a5e6f7g8",
      "title": "Website Redesign",
      "status": "active"
    },
    "attendees": ["client@example.com"],
    "isUpcoming": true,
    "reminderTime": "2025-08-25T14:15:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/calendar-events/64f8b2a1d1f2c3b4a5e6f7g9"
```

### 4. Update Calendar Event
**PUT** `/api/calendar-events/:id`

Updates an existing calendar event.

**Request Body:**
```json
{
  "eventTitle": "Updated Client Meeting",
  "date": "2025-08-25T15:00:00.000Z",
  "reminder": "30min",
  "description": "Updated meeting description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calendar event updated successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Updated Client Meeting",
    "date": "2025-08-25T15:00:00.000Z",
    "reminder": "30min",
    "reminderTime": "2025-08-25T14:30:00.000Z"
  }
}
```

### 5. Delete Calendar Event
**DELETE** `/api/calendar-events/:id`

Deletes a calendar event.

**Response:**
```json
{
  "success": true,
  "message": "Calendar event deleted successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Client Meeting"
  }
}
```

### 6. Search Calendar Events
**GET** `/api/calendar-events/search`

Performs text search across event titles, descriptions, and locations.

**Query Parameters:**
- `q` (string, required): Search term (minimum 2 characters)
- `limit` (number): Maximum results (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Client Meeting",
      "eventType": "meeting",
      "date": "2025-08-25T14:30:00.000Z"
    }
  ]
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/calendar-events/search?q=meeting&limit=5"
```

### 7. Get Calendar Event Statistics
**GET** `/api/calendar-events/stats`

Retrieves comprehensive calendar event statistics.

**Response:**
```json
{
  "success": true,
  "message": "Calendar event statistics retrieved successfully",
  "data": {
    "totalEvents": 45,
    "completedEvents": 20,
    "upcomingEvents": 15,
    "overdueEvents": 10,
    "todayEvents": 3,
    "eventsByType": {
      "meeting": 15,
      "deadline": 8,
      "milestone": 5,
      "call": 12,
      "presentation": 3,
      "review": 2
    },
    "eventsByMonth": [
      {"month": "August 2025", "count": 12},
      {"month": "July 2025", "count": 18}
    ]
  }
}
```

### 8. Get Upcoming Events
**GET** `/api/calendar-events/upcoming`

Retrieves upcoming events within specified number of days.

**Query Parameters:**
- `days` (number): Number of days ahead (default: 7, max: 365)

**Response:**
```json
{
  "success": true,
  "message": "Upcoming events for next 7 days retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Client Meeting",
      "date": "2025-08-25T14:30:00.000Z",
      "isUpcoming": true,
      "reminderTime": "2025-08-25T14:15:00.000Z"
    }
  ]
}
```

### 9. Get Overdue Events
**GET** `/api/calendar-events/overdue`

Retrieves events that are past due and not completed.

**Response:**
```json
{
  "success": true,
  "message": "Overdue events retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7h0",
      "eventTitle": "Project Deadline",
      "date": "2025-08-20T23:59:59.000Z",
      "isOverdue": true,
      "isCompleted": false
    }
  ]
}
```

### 10. Get Today's Events
**GET** `/api/calendar-events/today`

Retrieves events scheduled for today.

**Response:**
```json
{
  "success": true,
  "message": "Today's events retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7h1",
      "eventTitle": "Team Standup",
      "date": "2025-08-22T09:00:00.000Z",
      "isToday": true
    }
  ]
}
```

### 11. Get Events in Date Range
**GET** `/api/calendar-events/range`

Retrieves events within a specific date range.

**Query Parameters:**
- `startDate` (string, required): Start date in ISO 8601 format
- `endDate` (string, required): End date in ISO 8601 format

**Response:**
```json
{
  "success": true,
  "message": "Events in date range retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Client Meeting",
      "date": "2025-08-25T14:30:00.000Z"
    }
  ]
}
```

### 12. Get Events by Project
**GET** `/api/calendar-events/project/:projectId`

Retrieves events associated with a specific project.

**Response:**
```json
{
  "success": true,
  "message": "Project events retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Project Kickoff",
      "projectId": {
        "id": "64f8b2a1d1f2c3b4a5e6f7g8",
        "title": "Website Redesign"
      }
    }
  ]
}
```

### 13. Get Events by Attendee
**GET** `/api/calendar-events/attendee/:email`

Retrieves events where a specific email is an attendee.

**Response:**
```json
{
  "success": true,
  "message": "Events for attendee retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Client Meeting",
      "attendees": ["client@example.com", "manager@company.com"]
    }
  ]
}
```

### 14. Mark Event as Completed
**PATCH** `/api/calendar-events/:id/complete`

Marks an event as completed.

**Response:**
```json
{
  "success": true,
  "message": "Event marked as completed",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Client Meeting",
    "isCompleted": true
  }
}
```

### 15. Mark Event as Incomplete
**PATCH** `/api/calendar-events/:id/incomplete`

Marks an event as incomplete.

**Response:**
```json
{
  "success": true,
  "message": "Event marked as incomplete",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Client Meeting",
    "isCompleted": false
  }
}
```

### 16. Reschedule Event
**PATCH** `/api/calendar-events/:id/reschedule`

Reschedules an event to a new date/time.

**Request Body:**
```json
{
  "newDate": "2025-08-26T14:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event rescheduled successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g9",
    "eventTitle": "Client Meeting",
    "date": "2025-08-26T14:30:00.000Z",
    "reminderTime": "2025-08-26T14:15:00.000Z"
  }
}
```

### 17. Bulk Update Event Status
**PATCH** `/api/calendar-events/bulk/status`

Updates completion status for multiple events.

**Request Body:**
```json
{
  "eventIds": [
    "64f8b2a1d1f2c3b4a5e6f7g9",
    "64f8b2a1d1f2c3b4a5e6f7h0"
  ],
  "isCompleted": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk status update completed successfully"
}
```

### 18. Get Events Needing Reminders
**GET** `/api/calendar-events/reminders`

Retrieves events that have reminders set and are not completed.

**Response:**
```json
{
  "success": true,
  "message": "Events needing reminders retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g9",
      "eventTitle": "Client Meeting",
      "date": "2025-08-25T14:30:00.000Z",
      "reminder": "15min",
      "reminderTime": "2025-08-25T14:15:00.000Z"
    }
  ]
}
```

## Validation Rules

### Event Creation/Update
- **eventTitle**: Required, 1-200 characters
- **eventType**: Must be valid EventType enum value
- **date**: Required, valid ISO 8601 date format
- **reminder**: Optional, must be valid ReminderType enum value
- **projectId**: Optional, valid MongoDB ObjectId
- **description**: Optional, max 1000 characters
- **duration**: Optional, 5-1440 minutes
- **location**: Optional, max 200 characters
- **attendees**: Optional array of valid email addresses

### Query Parameters
- **page**: Positive integer (min: 1)
- **limit**: Integer between 1 and 100
- **sortBy**: Must be valid entity field
- **sortOrder**: Must be 'asc' or 'desc'
- **dates**: Must be valid ISO 8601 format
- **eventType**: Must be valid EventType enum value
- **reminder**: Must be valid ReminderType enum value

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Event title is required",
      "param": "eventTitle",
      "location": "body"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Calendar event not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve calendar events",
  "error": "Database connection error"
}
```

## Advanced Features

### Text Search
Full-text search across event titles, descriptions, and locations using MongoDB's text indexing.

### Project Integration
Events can be associated with projects for better organization and project timeline management.

### Smart Reminders
Multiple reminder options with calculated reminder times for notification systems.

### Attendee Management
Support for multiple attendees with email validation and attendee-specific queries.

### Date-based Filtering
Comprehensive date filtering including upcoming events, overdue events, today's events, and custom date ranges.

### Virtual Properties
Computed properties like `isUpcoming`, `isOverdue`, `isToday` for enhanced client-side logic.

## Usage Examples

### Complete Event Lifecycle
```bash
# 1. Create a new event
EVENT_ID=$(curl -s -X POST http://localhost:5000/api/calendar-events \
  -H "Content-Type: application/json" \
  -d '{
    "eventTitle": "Project Review",
    "eventType": "review",
    "date": "2025-08-25T14:00:00.000Z",
    "reminder": "1hour",
    "duration": 90,
    "location": "Meeting Room B"
  }' | jq -r '.data.id')

# 2. Get event details
curl "http://localhost:5000/api/calendar-events/$EVENT_ID"

# 3. Reschedule the event
curl -X PATCH "http://localhost:5000/api/calendar-events/$EVENT_ID/reschedule" \
  -H "Content-Type: application/json" \
  -d '{"newDate": "2025-08-26T14:00:00.000Z"}'

# 4. Mark as completed
curl -X PATCH "http://localhost:5000/api/calendar-events/$EVENT_ID/complete"
```

### Calendar Management Queries
```bash
# Get this week's events
curl "http://localhost:5000/api/calendar-events/upcoming?days=7"

# Get overdue events for follow-up
curl "http://localhost:5000/api/calendar-events/overdue"

# Get today's schedule
curl "http://localhost:5000/api/calendar-events/today"

# Get all meetings for a project
curl "http://localhost:5000/api/calendar-events/project/64f8b2a1d1f2c3b4a5e6f7g8"

# Get events needing reminders
curl "http://localhost:5000/api/calendar-events/reminders"

# Get calendar statistics
curl "http://localhost:5000/api/calendar-events/stats"
```

This API provides comprehensive calendar event management with advanced features for scheduling, reminders, project integration, and business intelligence to support freelancer workflow management.
