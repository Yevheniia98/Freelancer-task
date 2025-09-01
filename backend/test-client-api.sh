#!/bin/bash

# Client API Test Script
# This script tests all Client API endpoints with various scenarios

BASE_URL="http://localhost:3001/api/clients"
CONTENT_TYPE="Content-Type: application/json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print test section headers
print_section() {
    echo -e "\n${BLUE}==== $1 ====${NC}"
}

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Function to extract client ID from response
extract_client_id() {
    echo "$1" | grep -o '"id":"[^"]*"' | cut -d'"' -f4
}

# Check if server is running
print_section "Checking Server Connection"
curl -s -f "$BASE_URL" > /dev/null
if [ $? -eq 0 ]; then
    print_result 0 "Server is running"
else
    print_result 1 "Server is not running. Please start the server first."
    exit 1
fi

# Variables to store created client IDs
CLIENT_ID_1=""
CLIENT_ID_2=""
CLIENT_ID_3=""

print_section "1. Creating Clients"

# Test 1.1: Create valid client
echo -e "\n${YELLOW}Creating client 1 (John Doe)...${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -H "$CONTENT_TYPE" \
    -d '{
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "notes": "High-value client from tech industry"
    }')

echo "$RESPONSE" | jq '.'
CLIENT_ID_1=$(extract_client_id "$RESPONSE")

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Client 1 created successfully (ID: $CLIENT_ID_1)"
else
    print_result 1 "Failed to create client 1"
fi

# Test 1.2: Create client with earnings
echo -e "\n${YELLOW}Creating client 2 (Jane Smith) with initial earnings...${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -H "$CONTENT_TYPE" \
    -d '{
        "name": "Jane Smith",
        "email": "jane.smith@business.com",
        "phone": "+1987654321",
        "totalEarned": 2500.50,
        "notes": "Regular client, pays monthly retainer"
    }')

echo "$RESPONSE" | jq '.'
CLIENT_ID_2=$(extract_client_id "$RESPONSE")

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Client 2 created successfully (ID: $CLIENT_ID_2)"
else
    print_result 1 "Failed to create client 2"
fi

# Test 1.3: Create premium client
echo -e "\n${YELLOW}Creating client 3 (Premium Corp) with high earnings...${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -H "$CONTENT_TYPE" \
    -d '{
        "name": "Premium Corp",
        "email": "contact@premiumcorp.com",
        "phone": "+1555000123",
        "totalEarned": 15000.00,
        "notes": "Enterprise client with multiple projects"
    }')

echo "$RESPONSE" | jq '.'
CLIENT_ID_3=$(extract_client_id "$RESPONSE")

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Client 3 created successfully (ID: $CLIENT_ID_3)"
else
    print_result 1 "Failed to create client 3"
fi

# Test 1.4: Test duplicate email validation
echo -e "\n${YELLOW}Testing duplicate email validation...${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -H "$CONTENT_TYPE" \
    -d '{
        "name": "John Duplicate",
        "email": "john.doe@example.com"
    }')

echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":false'* ]] && [[ "$RESPONSE" == *"already exists"* ]]; then
    print_result 0 "Duplicate email validation working"
else
    print_result 1 "Duplicate email validation not working properly"
fi

# Test 1.5: Test validation errors
echo -e "\n${YELLOW}Testing validation errors...${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL" \
    -H "$CONTENT_TYPE" \
    -d '{
        "name": "",
        "email": "invalid-email"
    }')

echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":false'* ]] && [[ "$RESPONSE" == *"Validation failed"* ]]; then
    print_result 0 "Validation errors handled correctly"
else
    print_result 1 "Validation errors not handled properly"
fi

print_section "2. Reading Clients"

# Test 2.1: Get all clients
echo -e "\n${YELLOW}Getting all clients...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Retrieved all clients successfully"
else
    print_result 1 "Failed to retrieve all clients"
fi

# Test 2.2: Get client by ID
echo -e "\n${YELLOW}Getting client by ID...${NC}"
if [ -n "$CLIENT_ID_1" ]; then
    RESPONSE=$(curl -s -X GET "$BASE_URL/$CLIENT_ID_1")
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":true'* ]]; then
        print_result 0 "Retrieved client by ID successfully"
    else
        print_result 1 "Failed to retrieve client by ID"
    fi
else
    print_result 1 "No client ID available for testing"
fi

# Test 2.3: Get clients with pagination
echo -e "\n${YELLOW}Testing pagination...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL?page=1&limit=2")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]] && [[ "$RESPONSE" == *'"pagination"'* ]]; then
    print_result 0 "Pagination working correctly"
else
    print_result 1 "Pagination not working properly"
fi

# Test 2.4: Test filtering by status
echo -e "\n${YELLOW}Testing status filtering...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL?status=platinum")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Status filtering working"
else
    print_result 1 "Status filtering not working"
fi

# Test 2.5: Test earnings range filtering
echo -e "\n${YELLOW}Testing earnings range filtering...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL?minEarnings=1000&maxEarnings=5000")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Earnings range filtering working"
else
    print_result 1 "Earnings range filtering not working"
fi

print_section "3. Specialized Endpoints"

# Test 3.1: Get client statistics
echo -e "\n${YELLOW}Getting client statistics...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/stats")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]] && [[ "$RESPONSE" == *'"totalClients"'* ]]; then
    print_result 0 "Client statistics retrieved successfully"
else
    print_result 1 "Failed to retrieve client statistics"
fi

# Test 3.2: Search clients
echo -e "\n${YELLOW}Testing client search...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/search?q=john&limit=5")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Client search working"
else
    print_result 1 "Client search not working"
fi

# Test 3.3: Get clients by status
echo -e "\n${YELLOW}Getting clients by status (platinum)...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/status/platinum")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":true'* ]]; then
    print_result 0 "Get clients by status working"
else
    print_result 1 "Get clients by status not working"
fi

print_section "4. Earnings Management"

# Test 4.1: Add earnings to client
if [ -n "$CLIENT_ID_1" ]; then
    echo -e "\n${YELLOW}Adding earnings to client...${NC}"
    RESPONSE=$(curl -s -X PATCH "$BASE_URL/$CLIENT_ID_1/earnings/add" \
        -H "$CONTENT_TYPE" \
        -d '{"amount": 1500.75}')
    
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":true'* ]]; then
        print_result 0 "Added earnings successfully"
    else
        print_result 1 "Failed to add earnings"
    fi
fi

# Test 4.2: Bulk update earnings
if [ -n "$CLIENT_ID_1" ] && [ -n "$CLIENT_ID_2" ]; then
    echo -e "\n${YELLOW}Testing bulk earnings update...${NC}"
    RESPONSE=$(curl -s -X PATCH "$BASE_URL/bulk/earnings" \
        -H "$CONTENT_TYPE" \
        -d '{
            "updates": [
                {"id": "'$CLIENT_ID_1'", "amount": 500},
                {"id": "'$CLIENT_ID_2'", "amount": 750}
            ]
        }')
    
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":true'* ]]; then
        print_result 0 "Bulk earnings update successful"
    else
        print_result 1 "Bulk earnings update failed"
    fi
fi

# Test 4.3: Reset client earnings
if [ -n "$CLIENT_ID_2" ]; then
    echo -e "\n${YELLOW}Resetting client earnings...${NC}"
    RESPONSE=$(curl -s -X PATCH "$BASE_URL/$CLIENT_ID_2/earnings/reset")
    
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":true'* ]]; then
        print_result 0 "Earnings reset successful"
    else
        print_result 1 "Earnings reset failed"
    fi
fi

print_section "5. Updating Clients"

# Test 5.1: Update client information
if [ -n "$CLIENT_ID_1" ]; then
    echo -e "\n${YELLOW}Updating client information...${NC}"
    RESPONSE=$(curl -s -X PUT "$BASE_URL/$CLIENT_ID_1" \
        -H "$CONTENT_TYPE" \
        -d '{
            "name": "John Doe Jr.",
            "phone": "+1234567899",
            "notes": "Updated client information - name change"
        }')
    
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":true'* ]]; then
        print_result 0 "Client updated successfully"
    else
        print_result 1 "Failed to update client"
    fi
fi

# Test 5.2: Test invalid update
if [ -n "$CLIENT_ID_1" ]; then
    echo -e "\n${YELLOW}Testing invalid email update...${NC}"
    RESPONSE=$(curl -s -X PUT "$BASE_URL/$CLIENT_ID_1" \
        -H "$CONTENT_TYPE" \
        -d '{
            "email": "jane.smith@business.com"
        }')
    
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":false'* ]] && [[ "$RESPONSE" == *"already exists"* ]]; then
        print_result 0 "Duplicate email validation on update working"
    else
        print_result 1 "Duplicate email validation on update not working"
    fi
fi

print_section "6. Error Handling"

# Test 6.1: Get non-existent client
echo -e "\n${YELLOW}Testing non-existent client retrieval...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/64f5a1b2c3d4e5f6a7b8c9d0")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":false'* ]] && [[ "$RESPONSE" == *"not found"* ]]; then
    print_result 0 "Non-existent client handling correct"
else
    print_result 1 "Non-existent client handling incorrect"
fi

# Test 6.2: Invalid client ID format
echo -e "\n${YELLOW}Testing invalid client ID format...${NC}"
RESPONSE=$(curl -s -X GET "$BASE_URL/invalid-id")
echo "$RESPONSE" | jq '.'

if [[ "$RESPONSE" == *'"success":false'* ]]; then
    print_result 0 "Invalid ID format handling correct"
else
    print_result 1 "Invalid ID format handling incorrect"
fi

# Test 6.3: Invalid earnings amount
if [ -n "$CLIENT_ID_1" ]; then
    echo -e "\n${YELLOW}Testing invalid earnings amount...${NC}"
    RESPONSE=$(curl -s -X PATCH "$BASE_URL/$CLIENT_ID_1/earnings/add" \
        -H "$CONTENT_TYPE" \
        -d '{"amount": -500}')
    
    echo "$RESPONSE" | jq '.'
    
    if [[ "$RESPONSE" == *'"success":false'* ]]; then
        print_result 0 "Invalid earnings amount validation working"
    else
        print_result 1 "Invalid earnings amount validation not working"
    fi
fi

print_section "7. Cleanup (Delete Clients)"

# Delete created clients
for CLIENT_ID in "$CLIENT_ID_1" "$CLIENT_ID_2" "$CLIENT_ID_3"; do
    if [ -n "$CLIENT_ID" ]; then
        echo -e "\n${YELLOW}Deleting client: $CLIENT_ID${NC}"
        RESPONSE=$(curl -s -X DELETE "$BASE_URL/$CLIENT_ID")
        echo "$RESPONSE" | jq '.'
        
        if [[ "$RESPONSE" == *'"success":true'* ]]; then
            print_result 0 "Client deleted successfully"
        else
            print_result 1 "Failed to delete client"
        fi
    fi
done

print_section "Test Summary"

echo -e "\n${GREEN}Client API testing completed!${NC}"
echo -e "${BLUE}All major endpoints and scenarios have been tested.${NC}"
echo -e "${YELLOW}Check the output above for any failed tests.${NC}"

echo -e "\n${BLUE}Available endpoints:${NC}"
echo "POST   /api/clients                    - Create client"
echo "GET    /api/clients                    - Get all clients (with filters)"
echo "GET    /api/clients/:id                - Get client by ID"
echo "PUT    /api/clients/:id                - Update client"
echo "DELETE /api/clients/:id                - Delete client"
echo "PATCH  /api/clients/:id/earnings/add   - Add earnings"
echo "PATCH  /api/clients/:id/earnings/reset - Reset earnings"
echo "GET    /api/clients/stats               - Get statistics"
echo "GET    /api/clients/search              - Search clients"
echo "GET    /api/clients/status/:status      - Get clients by status"
echo "PATCH  /api/clients/bulk/earnings       - Bulk update earnings"
