# Client API Documentation

## Overview
The Client API provides comprehensive CRUD operations for managing clients in the freelancer task management system. It includes features for client status tracking based on earnings, search functionality, and advanced filtering options.

## Base URL
```
/api/clients
```

## Client Entity

### Schema
```typescript
interface IClientEntity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalEarned: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Client Status
Clients are automatically categorized based on their `totalEarned` amount:
- **new**: $0 earned
- **bronze**: $0.01 - $999.99 earned
- **silver**: $1,000 - $4,999.99 earned
- **gold**: $5,000 - $9,999.99 earned
- **platinum**: $10,000+ earned

### Virtual Fields
- `status`: Calculated client status (new, bronze, silver, gold, platinum)
- `formattedEarnings`: Currency-formatted earnings display

## API Endpoints

### 1. Create Client
**POST** `/api/clients`

Creates a new client.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
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
    "id": "64f8b2a1d1f2c3b4a5e6f7g8",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "totalEarned": 0,
    "notes": "New client from referral",
    "createdAt": "2025-08-22T10:30:00.000Z",
    "updatedAt": "2025-08-22T10:30:00.000Z",
    "status": "new",
    "formattedEarnings": "$0.00"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "notes": "New client from referral"
  }'
```

### 2. Get All Clients
**GET** `/api/clients`

Retrieves all clients with pagination, filtering, and sorting options.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sortBy` (string): Sort field (name, email, totalEarned, createdAt, updatedAt)
- `sortOrder` (string): Sort direction (asc, desc)
- `search` (string): Text search in name, email, and notes
- `name` (string): Filter by name (case-insensitive)
- `email` (string): Filter by email (case-insensitive)
- `status` (string): Filter by status (new, bronze, silver, gold, platinum)
- `minEarnings` (number): Minimum earnings filter
- `maxEarnings` (number): Maximum earnings filter

**Response:**
```json
{
  "success": true,
  "message": "Clients retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g8",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "totalEarned": 2500,
      "notes": "Regular client",
      "status": "silver",
      "formattedEarnings": "$2,500.00"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**cURL Examples:**
```bash
# Get all clients (default pagination)
curl "http://localhost:5000/api/clients"

# Get clients with filtering and sorting
curl "http://localhost:5000/api/clients?status=silver&sortBy=totalEarned&sortOrder=desc&limit=5"

# Search clients
curl "http://localhost:5000/api/clients?search=john&page=1&limit=10"

# Filter by earnings range
curl "http://localhost:5000/api/clients?minEarnings=1000&maxEarnings=5000"
```

### 3. Get Client by ID
**GET** `/api/clients/:id`

Retrieves a specific client by ID.

**Response:**
```json
{
  "success": true,
  "message": "Client retrieved successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g8",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "totalEarned": 2500,
    "notes": "Regular client",
    "status": "silver",
    "formattedEarnings": "$2,500.00"
  }
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/clients/64f8b2a1d1f2c3b4a5e6f7g8"
```

### 4. Update Client
**PUT** `/api/clients/:id`

Updates an existing client.

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321",
  "notes": "Updated contact information"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g8",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone": "1987654321",
    "totalEarned": 2500,
    "notes": "Updated contact information",
    "status": "silver",
    "formattedEarnings": "$2,500.00"
  }
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/clients/64f8b2a1d1f2c3b4a5e6f7g8 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+1987654321",
    "notes": "Updated contact information"
  }'
```

### 5. Delete Client
**DELETE** `/api/clients/:id`

Deletes a client.

**Response:**
```json
{
  "success": true,
  "message": "Client deleted successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g8",
    "name": "John Smith",
    "email": "john.doe@example.com"
  }
}
```

**cURL Example:**
```bash
curl -X DELETE "http://localhost:5000/api/clients/64f8b2a1d1f2c3b4a5e6f7g8"
```

### 6. Search Clients
**GET** `/api/clients/search`

Performs text search across client names, emails, and notes.

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
      "id": "64f8b2a1d1f2c3b4a5e6f7g8",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "status": "silver"
    }
  ]
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/clients/search?q=john&limit=5"
```

### 7. Get Client Statistics
**GET** `/api/clients/stats`

Retrieves comprehensive client statistics.

**Response:**
```json
{
  "success": true,
  "message": "Client statistics retrieved successfully",
  "data": {
    "totalClients": 150,
    "totalEarnings": 125000,
    "averageEarningsPerClient": 833.33,
    "statusBreakdown": {
      "new": 25,
      "bronze": 45,
      "silver": 35,
      "gold": 30,
      "platinum": 15
    },
    "topEarningClients": [
      {
        "id": "64f8b2a1d1f2c3b4a5e6f7g8",
        "name": "Premium Client",
        "totalEarned": 25000,
        "status": "platinum"
      }
    ]
  }
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/clients/stats"
```

### 8. Get Clients by Status
**GET** `/api/clients/status/:status`

Retrieves clients filtered by their status category.

**Parameters:**
- `status`: Client status (new, bronze, silver, gold, platinum)

**Response:**
```json
{
  "success": true,
  "message": "silver clients retrieved successfully",
  "data": [
    {
      "id": "64f8b2a1d1f2c3b4a5e6f7g8",
      "name": "John Smith",
      "totalEarned": 2500,
      "status": "silver"
    }
  ]
}
```

**cURL Example:**
```bash
curl "http://localhost:5000/api/clients/status/silver"
```

### 9. Add Earnings to Client
**PATCH** `/api/clients/:id/earnings/add`

Adds earnings to a client's total.

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Earnings added successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g8",
    "name": "John Smith",
    "totalEarned": 3000,
    "status": "silver",
    "formattedEarnings": "$3,000.00"
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/clients/64f8b2a1d1f2c3b4a5e6f7g8/earnings/add \
  -H "Content-Type: application/json" \
  -d '{"amount": 500.00}'
```

### 10. Reset Client Earnings
**PATCH** `/api/clients/:id/earnings/reset`

Resets a client's total earnings to zero.

**Response:**
```json
{
  "success": true,
  "message": "Earnings reset successfully",
  "data": {
    "id": "64f8b2a1d1f2c3b4a5e6f7g8",
    "name": "John Smith",
    "totalEarned": 0,
    "status": "new",
    "formattedEarnings": "$0.00"
  }
}
```

**cURL Example:**
```bash
curl -X PATCH "http://localhost:5000/api/clients/64f8b2a1d1f2c3b4a5e6f7g8/earnings/reset"
```

### 11. Bulk Update Earnings
**PATCH** `/api/clients/bulk/earnings`

Updates earnings for multiple clients in a single request.

**Request Body:**
```json
{
  "updates": [
    {"id": "64f8b2a1d1f2c3b4a5e6f7g8", "amount": 500},
    {"id": "64f8b2a1d1f2c3b4a5e6f7g9", "amount": 1000},
    {"id": "64f8b2a1d1f2c3b4a5e6f7h0", "amount": -200}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk earnings update completed successfully"
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:5000/api/clients/bulk/earnings \
  -H "Content-Type: application/json" \
  -d '{
    "updates": [
      {"id": "64f8b2a1d1f2c3b4a5e6f7g8", "amount": 500},
      {"id": "64f8b2a1d1f2c3b4a5e6f7g9", "amount": 1000}
    ]
  }'
```

## Validation Rules

### Client Creation/Update
- **name**: Required, 1-100 characters, trimmed
- **email**: Required, valid email format, unique, normalized to lowercase
- **phone**: Optional, valid phone number format (international format supported)
- **totalEarned**: Optional, non-negative number (default: 0)
- **notes**: Optional, max 1000 characters

### Query Parameters
- **page**: Positive integer (min: 1)
- **limit**: Integer between 1 and 100
- **sortBy**: Must be a valid entity field
- **sortOrder**: Must be 'asc' or 'desc'
- **status**: Must be valid status value
- **minEarnings/maxEarnings**: Non-negative numbers

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Client not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Client with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to retrieve clients",
  "error": "Database connection error"
}
```

## Advanced Features

### Text Search
The API supports full-text search across client names, emails, and notes using MongoDB's text indexing for fast, relevant results.

### Status-based Filtering
Clients are automatically categorized by earnings levels, enabling easy segmentation for marketing, pricing, and relationship management.

### Bulk Operations
Support for bulk earnings updates enables efficient batch processing for invoice payments, refunds, or adjustments.

### Comprehensive Statistics
The stats endpoint provides business intelligence data including earnings distribution, client segmentation, and top performers.

## Usage Examples

### Complete Client Lifecycle
```bash
# 1. Create a new client
CLIENT_ID=$(curl -s -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}' \
  | jq -r '.data.id')

# 2. Add earnings after project completion
curl -X PATCH "http://localhost:5000/api/clients/$CLIENT_ID/earnings/add" \
  -H "Content-Type: application/json" \
  -d '{"amount": 1500}'

# 3. Update client information
curl -X PUT "http://localhost:5000/api/clients/$CLIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+1555123456","notes":"Upgraded to silver status"}'

# 4. Get updated client details
curl "http://localhost:5000/api/clients/$CLIENT_ID"
```

### Business Intelligence Queries
```bash
# Get high-value clients (gold and platinum)
curl "http://localhost:5000/api/clients?minEarnings=5000&sortBy=totalEarned&sortOrder=desc"

# Find clients needing attention (new status)
curl "http://localhost:5000/api/clients/status/new"

# Search for specific clients
curl "http://localhost:5000/api/clients/search?q=doe&limit=10"

# Get business overview
curl "http://localhost:5000/api/clients/stats"
```

This API provides a complete client management solution with advanced filtering, search capabilities, and business intelligence features to support freelancer client relationship management.
