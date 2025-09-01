# Client API Documentation

## Overview
The Client API provides comprehensive CRUD operations for managing clients in the freelancer task management system. Each client has earnings tracking, status categorization, and advanced filtering capabilities.

## Base URL
```
/api/clients
```

## Client Entity Structure
```typescript
{
  id: string,              // Unique identifier
  name: string,            // Client name (required, max 100 chars)
  email: string,           // Client email (required, unique, validated)
  phone?: string,          // Phone number (optional, validated format)
  totalEarned: number,     // Total earnings from client (default: 0)
  notes?: string,          // Additional notes (optional, max 1000 chars)
  createdAt: Date,         // Creation timestamp
  updatedAt: Date,         // Last update timestamp
  status: string,          // Virtual field based on totalEarned
  formattedEarnings: string // Virtual field with currency formatting
}
```

## Client Status Categories
- **new**: $0 earnings
- **bronze**: $0.01 - $999.99
- **silver**: $1,000 - $4,999.99
- **gold**: $5,000 - $9,999.99
- **platinum**: $10,000+

## API Endpoints

### 1. Create Client
**POST** `/api/clients`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "totalEarned": 0,
  "notes": "New client from referral"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "totalEarned": 0,
    "notes": "New client from referral",
    "status": "new",
    "formattedEarnings": "$0.00",
    "createdAt": "2023-09-04T10:30:00.000Z",
    "updatedAt": "2023-09-04T10:30:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3001/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "notes": "New client from referral"
  }'
```

### 2. Get All Clients (with filtering and pagination)
**GET** `/api/clients`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field (name, email, totalEarned, createdAt, updatedAt)
- `sortOrder` (string): asc or desc (default: desc)
- `search` (string): Text search across name, email, notes
- `name` (string): Filter by name (partial match)
- `email` (string): Filter by email (partial match)
- `status` (string): Filter by status (new, bronze, silver, gold, platinum)
- `minEarnings` (number): Minimum earnings filter
- `maxEarnings` (number): Maximum earnings filter

**Response:**
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "data": [...clients],
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
# Get all clients
curl http://localhost:3001/api/clients

# Get clients with pagination
curl "http://localhost:3001/api/clients?page=1&limit=5"

# Filter by status
curl "http://localhost:3001/api/clients?status=gold"

# Search clients
curl "http://localhost:3001/api/clients?search=john"

# Filter by earnings range
curl "http://localhost:3001/api/clients?minEarnings=1000&maxEarnings=5000"
```

### 3. Get Client by ID
**GET** `/api/clients/:id`

**Response:**
```json
{
  "success": true,
  "message": "Client retrieved successfully",
  "data": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    // ... full client object
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/clients/64f5a1b2c3d4e5f6a7b8c9d0
```

### 4. Update Client
**PUT** `/api/clients/:id`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321",
  "notes": "Updated contact information"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3001/api/clients/64f5a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "notes": "Updated contact information"
  }'
```

### 5. Delete Client
**DELETE** `/api/clients/:id`

**Response:**
```json
{
  "success": true,
  "message": "Client deleted successfully",
  "data": {...deletedClient}
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3001/api/clients/64f5a1b2c3d4e5f6a7b8c9d0
```

### 6. Add Earnings
**PATCH** `/api/clients/:id/earnings/add`

**Request Body:**
```json
{
  "amount": 1500.00
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3001/api/clients/64f5a1b2c3d4e5f6a7b8c9d0/earnings/add \
  -H "Content-Type: application/json" \
  -d '{"amount": 1500.00}'
```

### 7. Reset Client Earnings
**PATCH** `/api/clients/:id/earnings/reset`

**cURL Example:**
```bash
curl -X PATCH http://localhost:3001/api/clients/64f5a1b2c3d4e5f6a7b8c9d0/earnings/reset
```

### 8. Get Client Statistics
**GET** `/api/clients/stats`

**Response:**
```json
{
  "success": true,
  "message": "Client statistics retrieved successfully",
  "data": {
    "totalClients": 25,
    "totalEarnings": 125000.00,
    "averageEarningsPerClient": 5000.00,
    "statusBreakdown": {
      "new": 5,
      "bronze": 8,
      "silver": 7,
      "gold": 3,
      "platinum": 2
    },
    "topEarningClients": [...top5Clients]
  }
}
```

**cURL Example:**
```bash
curl http://localhost:3001/api/clients/stats
```

### 9. Search Clients
**GET** `/api/clients/search`

**Query Parameters:**
- `q` (string, required): Search term
- `limit` (number): Max results (default: 10, max: 50)

**cURL Example:**
```bash
curl "http://localhost:3001/api/clients/search?q=john&limit=5"
```

### 10. Get Clients by Status
**GET** `/api/clients/status/:status`

**Parameters:**
- `status`: new, bronze, silver, gold, or platinum

**cURL Example:**
```bash
curl http://localhost:3001/api/clients/status/platinum
```

### 11. Bulk Update Earnings
**PATCH** `/api/clients/bulk/earnings`

**Request Body:**
```json
{
  "updates": [
    {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "amount": 500.00
    },
    {
      "id": "64f5a1b2c3d4e5f6a7b8c9d1",
      "amount": -200.00
    }
  ]
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:3001/api/clients/bulk/earnings \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"id": "64f5a1b2c3d4e5f6a7b8c9d0", "amount": 500},
      {"id": "64f5a1b2c3d4e5f6a7b8c9d1", "amount": 1000}
    ]
  }'
```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Client not found"
}
```

### Duplicate Email Error (400)
```json
{
  "success": false,
  "message": "Client with this email already exists"
}
```

## Validation Rules

### Client Creation/Update
- **name**: Required, 1-100 characters, trimmed
- **email**: Required, valid email format, unique, normalized to lowercase
- **phone**: Optional, valid phone format, normalized (removes spaces/dashes)
- **totalEarned**: Optional, non-negative number, defaults to 0
- **notes**: Optional, max 1000 characters, trimmed

### Query Parameters
- **page**: Positive integer, min 1
- **limit**: Integer between 1-100
- **sortBy**: Must be valid field name
- **sortOrder**: Must be 'asc' or 'desc'
- **status**: Must be valid status value
- **earnings filters**: Non-negative numbers

## Features

### Advanced Filtering
- Text search across name, email, and notes
- Status-based filtering with automatic earnings range mapping
- Earnings range filtering (min/max)
- Name and email partial matching

### Client Status System
- Automatic status calculation based on totalEarned
- Status-based filtering and statistics
- Virtual fields for formatted display

### Earnings Management
- Add earnings to existing total
- Reset earnings to zero
- Bulk earnings updates for multiple clients
- Earnings validation (non-negative)

### Analytics and Reporting
- Comprehensive statistics dashboard
- Status breakdown analysis
- Top earning clients identification
- Average earnings calculation

### Performance Optimizations
- Database indexes on key fields (email, name, totalEarned, createdAt)
- Text search indexes for full-text search
- Efficient aggregation pipelines for statistics
- Pagination support for large datasets

## Integration Notes

The Client API integrates seamlessly with the existing Project and Task APIs, providing a complete freelancer management system. Clients can be referenced in projects and tasks for comprehensive relationship tracking.
