#!/bin/bash

# Simple Calendar Event API Test

API_URL="http://localhost:3002/api/calendar-events"

echo "🚀 Testing Calendar Event API"
echo "================================"

# Test 1: Create a new calendar event
echo -e "\n📝 Test 1: Creating a new calendar event"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "eventTitle": "Test Meeting",
    "eventType": "meeting", 
    "date": "2025-08-25T14:00:00.000Z",
    "description": "Test meeting description",
    "duration": 60,
    "location": "Conference Room A"
  }')

echo "Response: $RESPONSE"

if [[ $RESPONSE == *"success"* ]]; then
    echo "✅ CREATE test passed"
    # Extract event ID from response (assuming JSON format)
    EVENT_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Created event ID: $EVENT_ID"
else
    echo "❌ CREATE test failed"
    exit 1
fi

# Test 2: Get all calendar events
echo -e "\n📋 Test 2: Getting all calendar events"
RESPONSE=$(curl -s -X GET "$API_URL")
echo "Response: $RESPONSE"

if [[ $RESPONSE == *"success"* ]]; then
    echo "✅ GET ALL test passed"
else
    echo "❌ GET ALL test failed"
fi

# Test 3: Get specific event (if we have an ID)
if [ ! -z "$EVENT_ID" ]; then
    echo -e "\n🔍 Test 3: Getting specific calendar event"
    RESPONSE=$(curl -s -X GET "$API_URL/$EVENT_ID")
    echo "Response: $RESPONSE"
    
    if [[ $RESPONSE == *"success"* ]]; then
        echo "✅ GET BY ID test passed"
    else
        echo "❌ GET BY ID test failed"
    fi
    
    # Test 4: Update the event
    echo -e "\n✏️  Test 4: Updating calendar event"
    RESPONSE=$(curl -s -X PUT "$API_URL/$EVENT_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "eventTitle": "Updated Test Meeting",
        "description": "Updated description"
      }')
    echo "Response: $RESPONSE"
    
    if [[ $RESPONSE == *"success"* ]]; then
        echo "✅ UPDATE test passed"
    else
        echo "❌ UPDATE test failed"
    fi
    
    # Test 5: Mark as completed
    echo -e "\n✅ Test 5: Marking event as completed"
    RESPONSE=$(curl -s -X PATCH "$API_URL/$EVENT_ID/complete")
    echo "Response: $RESPONSE"
    
    if [[ $RESPONSE == *"success"* ]]; then
        echo "✅ COMPLETE test passed"
    else
        echo "❌ COMPLETE test failed"
    fi
    
    # Test 6: Delete the event
    echo -e "\n🗑️  Test 6: Deleting calendar event"
    RESPONSE=$(curl -s -X DELETE "$API_URL/$EVENT_ID")
    echo "Response: $RESPONSE"
    
    if [[ $RESPONSE == *"success"* ]]; then
        echo "✅ DELETE test passed"
    else
        echo "❌ DELETE test failed"
    fi
fi

# Test 7: Get statistics
echo -e "\n📊 Test 7: Getting calendar statistics"
RESPONSE=$(curl -s -X GET "$API_URL/stats")
echo "Response: $RESPONSE"

if [[ $RESPONSE == *"success"* ]]; then
    echo "✅ STATS test passed"
else
    echo "❌ STATS test failed"
fi

echo -e "\n🎉 API tests completed!"
