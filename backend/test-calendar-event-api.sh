#!/bin/bash

# Calendar Event API Test Script
# This script demonstrates all Calendar Event API endpoints with practical examples

BASE_URL="http://localhost:3002/api/calendar-events"
TEMP_FILE="/tmp/calendar_event_test_$$"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Test variables
EVENT_IDS=()

# Function to extract event ID from response
extract_event_id() {
    echo "$1" | jq -r '.data.id // empty'
}

# Function to check if server is running
check_server() {
    print_header "Checking Server Status"
    if curl -s "$BASE_URL" > /dev/null 2>&1; then
        print_success "Server is running"
        return 0
    else
        print_error "Server is not running. Please start the server first with 'npm run dev'"
        exit 1
    fi
}

# Test 1: Create Calendar Events
test_create_events() {
    print_header "Testing Calendar Event Creation"
    
    # Create multiple test events with different types and dates
    events=(
        '{"eventTitle":"Client Meeting","eventType":"meeting","date":"2025-08-25T14:30:00.000Z","reminder":"15min","description":"Quarterly review meeting","duration":60,"location":"Conference Room A","attendees":["client@example.com"]}'
        '{"eventTitle":"Project Deadline","eventType":"deadline","date":"2025-08-30T23:59:59.000Z","reminder":"1day","description":"Final submission deadline","duration":60}'
        '{"eventTitle":"Team Standup","eventType":"meeting","date":"2025-08-23T09:00:00.000Z","reminder":"5min","description":"Daily team synchronization","duration":30,"location":"Virtual Meeting"}'
        '{"eventTitle":"Product Demo","eventType":"presentation","date":"2025-08-27T16:00:00.000Z","reminder":"1hour","description":"Demo for stakeholders","duration":90,"attendees":["stakeholder1@company.com","stakeholder2@company.com"]}'
        '{"eventTitle":"Code Review","eventType":"review","date":"2025-08-24T10:00:00.000Z","reminder":"30min","description":"Review pull requests","duration":45}'
        '{"eventTitle":"Personal Appointment","eventType":"personal","date":"2025-08-26T12:00:00.000Z","reminder":"none","description":"Doctor appointment","duration":60}'
    )
    
    for i in "${!events[@]}"; do
        event_data="${events[$i]}"
        response=$(curl -s -X POST "$BASE_URL" \
            -H "Content-Type: application/json" \
            -d "$event_data")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            event_id=$(extract_event_id "$response")
            EVENT_IDS+=("$event_id")
            title=$(echo "$response" | jq -r '.data.eventTitle')
            event_type=$(echo "$response" | jq -r '.data.eventType')
            date=$(echo "$response" | jq -r '.data.formattedDate // .data.date')
            print_success "Created event: $title ($event_type) - $date"
        else
            error_msg=$(echo "$response" | jq -r '.message')
            print_error "Failed to create event $((i+1)): $error_msg"
        fi
    done
    
    print_info "Created ${#EVENT_IDS[@]} calendar events"
}

# Test 2: Get All Calendar Events
test_get_events() {
    print_header "Testing Get All Calendar Events"
    
    response=$(curl -s "$BASE_URL")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        total=$(echo "$response" | jq -r '.pagination.total')
        print_success "Retrieved $total calendar events"
        
        # Display event summary
        echo "$response" | jq -r '.data[] | "• \(.eventTitle) - \(.eventType) - \(.date[0:10])"'
    else
        print_error "Failed to get calendar events"
    fi
}

# Test 3: Get Calendar Events with Filtering
test_filtering() {
    print_header "Testing Filtering and Date Queries"
    
    # Test 1: Get upcoming events
    print_info "Getting upcoming events for next 7 days"
    response=$(curl -s "$BASE_URL/upcoming?days=7")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        count=$(echo "$response" | jq -r '.data | length')
        print_success "Found $count upcoming events"
        echo "$response" | jq -r '.data[] | "• \(.eventTitle): \(.formattedDate // .date)"'
    fi
    
    # Test 2: Get today's events
    print_info "Getting today's events"
    response=$(curl -s "$BASE_URL/today")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        count=$(echo "$response" | jq -r '.data | length')
        print_success "Found $count events for today"
        echo "$response" | jq -r '.data[] | "• \(.eventTitle): \(.date)"'
    fi
    
    # Test 3: Get events by type
    print_info "Getting meeting events"
    response=$(curl -s "$BASE_URL?eventType=meeting&sortBy=date&sortOrder=asc")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        count=$(echo "$response" | jq -r '.data | length')
        print_success "Found $count meeting events"
        echo "$response" | jq -r '.data[] | "• \(.eventTitle): \(.date[0:16])"'
    fi
    
    # Test 4: Get events in date range
    print_info "Getting events in date range (Aug 24-27, 2025)"
    response=$(curl -s "$BASE_URL/range?startDate=2025-08-24T00:00:00.000Z&endDate=2025-08-27T23:59:59.000Z")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        count=$(echo "$response" | jq -r '.data | length')
        print_success "Found $count events in date range"
        echo "$response" | jq -r '.data[] | "• \(.eventTitle): \(.date[0:10])"'
    fi
}

# Test 4: Get Calendar Event by ID
test_get_event_by_id() {
    print_header "Testing Get Calendar Event by ID"
    
    if [[ ${#EVENT_IDS[@]} -gt 0 ]]; then
        event_id="${EVENT_IDS[0]}"
        response=$(curl -s "$BASE_URL/$event_id")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            title=$(echo "$response" | jq -r '.data.eventTitle')
            event_type=$(echo "$response" | jq -r '.data.eventType')
            date=$(echo "$response" | jq -r '.data.formattedDate // .data.date')
            location=$(echo "$response" | jq -r '.data.location // "No location"')
            is_upcoming=$(echo "$response" | jq -r '.data.isUpcoming // false')
            print_success "Retrieved event: $title ($event_type)"
            print_info "  Date: $date"
            print_info "  Location: $location"
            print_info "  Upcoming: $is_upcoming"
        else
            print_error "Failed to get calendar event by ID"
        fi
    else
        print_error "No event IDs available for testing"
    fi
}

# Test 5: Update Calendar Event
test_update_event() {
    print_header "Testing Calendar Event Update"
    
    if [[ ${#EVENT_IDS[@]} -gt 0 ]]; then
        event_id="${EVENT_IDS[0]}"
        update_data='{
            "eventTitle":"Updated Client Meeting",
            "reminder":"30min",
            "description":"Updated quarterly review meeting with extended agenda",
            "duration":90,
            "location":"Updated Conference Room B"
        }'
        
        response=$(curl -s -X PUT "$BASE_URL/$event_id" \
            -H "Content-Type: application/json" \
            -d "$update_data")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            title=$(echo "$response" | jq -r '.data.eventTitle')
            reminder=$(echo "$response" | jq -r '.data.reminder')
            duration=$(echo "$response" | jq -r '.data.duration')
            location=$(echo "$response" | jq -r '.data.location')
            print_success "Updated event: $title"
            print_info "  New reminder: $reminder"
            print_info "  New duration: $duration minutes"
            print_info "  New location: $location"
        else
            error_msg=$(echo "$response" | jq -r '.message')
            print_error "Failed to update calendar event: $error_msg"
        fi
    else
        print_error "No event IDs available for testing"
    fi
}

# Test 6: Event Status Management
test_event_status() {
    print_header "Testing Event Status Management"
    
    if [[ ${#EVENT_IDS[@]} -gt 1 ]]; then
        event_id="${EVENT_IDS[1]}"
        
        # Get current status
        current_response=$(curl -s "$BASE_URL/$event_id")
        title=$(echo "$current_response" | jq -r '.data.eventTitle')
        current_status=$(echo "$current_response" | jq -r '.data.isCompleted')
        
        print_info "Current status for '$title': completed = $current_status"
        
        # Mark as completed
        response=$(curl -s -X PATCH "$BASE_URL/$event_id/complete")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            new_status=$(echo "$response" | jq -r '.data.isCompleted')
            print_success "Marked event as completed: $new_status"
            
            # Mark as incomplete
            response=$(curl -s -X PATCH "$BASE_URL/$event_id/incomplete")
            
            if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
                final_status=$(echo "$response" | jq -r '.data.isCompleted')
                print_success "Marked event as incomplete: $final_status"
            fi
        else
            error_msg=$(echo "$response" | jq -r '.message')
            print_error "Failed to update event status: $error_msg"
        fi
    else
        print_error "Need at least 2 event IDs for status testing"
    fi
}

# Test 7: Reschedule Event
test_reschedule() {
    print_header "Testing Event Rescheduling"
    
    if [[ ${#EVENT_IDS[@]} -gt 2 ]]; then
        event_id="${EVENT_IDS[2]}"
        
        # Get current date
        current_response=$(curl -s "$BASE_URL/$event_id")
        title=$(echo "$current_response" | jq -r '.data.eventTitle')
        current_date=$(echo "$current_response" | jq -r '.data.date')
        
        print_info "Rescheduling '$title' from $current_date"
        
        # Reschedule to new date
        new_date="2025-08-28T11:00:00.000Z"
        response=$(curl -s -X PATCH "$BASE_URL/$event_id/reschedule" \
            -H "Content-Type: application/json" \
            -d "{\"newDate\":\"$new_date\"}")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            updated_date=$(echo "$response" | jq -r '.data.date')
            reminder_time=$(echo "$response" | jq -r '.data.reminderTime // "No reminder"')
            print_success "Rescheduled to: $updated_date"
            print_info "New reminder time: $reminder_time"
        else
            error_msg=$(echo "$response" | jq -r '.message')
            print_error "Failed to reschedule event: $error_msg"
        fi
    else
        print_error "Need at least 3 event IDs for rescheduling testing"
    fi
}

# Test 8: Calendar Event Statistics
test_event_stats() {
    print_header "Testing Calendar Event Statistics"
    
    response=$(curl -s "$BASE_URL/stats")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        total_events=$(echo "$response" | jq -r '.data.totalEvents')
        completed_events=$(echo "$response" | jq -r '.data.completedEvents')
        upcoming_events=$(echo "$response" | jq -r '.data.upcomingEvents')
        overdue_events=$(echo "$response" | jq -r '.data.overdueEvents')
        today_events=$(echo "$response" | jq -r '.data.todayEvents')
        
        print_success "Total Events: $total_events"
        print_success "Completed: $completed_events"
        print_success "Upcoming: $upcoming_events"
        print_success "Overdue: $overdue_events"
        print_success "Today: $today_events"
        
        print_info "Events by Type:"
        echo "$response" | jq -r '.data.eventsByType | to_entries[] | "  \(.key): \(.value)"'
        
        print_info "Events by Month:"
        echo "$response" | jq -r '.data.eventsByMonth[] | "  \(.month): \(.count)"'
    else
        print_error "Failed to get calendar event statistics"
    fi
}

# Test 9: Search Calendar Events
test_search() {
    print_header "Testing Calendar Event Search"
    
    search_terms=("meeting" "review" "client" "project")
    
    for term in "${search_terms[@]}"; do
        print_info "Searching for: '$term'"
        response=$(curl -s "$BASE_URL/search?q=$term&limit=3")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            count=$(echo "$response" | jq -r '.data | length')
            print_success "Found $count results for '$term'"
            echo "$response" | jq -r '.data[] | "  • \(.eventTitle) - \(.eventType)"'
        else
            error_msg=$(echo "$response" | jq -r '.message')
            print_error "Search failed for '$term': $error_msg"
        fi
    done
}

# Test 10: Attendee Management
test_attendee_management() {
    print_header "Testing Attendee Management"
    
    # Find events with attendees
    print_info "Getting events with attendees"
    response=$(curl -s "$BASE_URL?hasAttendees=true")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        count=$(echo "$response" | jq -r '.data | length')
        print_success "Found $count events with attendees"
        
        if [[ $count -gt 0 ]]; then
            # Get events by attendee email
            attendee_email="client@example.com"
            print_info "Getting events for attendee: $attendee_email"
            response=$(curl -s "$BASE_URL/attendee/$attendee_email")
            
            if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
                attendee_count=$(echo "$response" | jq -r '.data | length')
                print_success "Found $attendee_count events for $attendee_email"
                echo "$response" | jq -r '.data[] | "  • \(.eventTitle): \(.attendees | join(\", \"))"'
            fi
        fi
    fi
}

# Test 11: Bulk Operations
test_bulk_operations() {
    print_header "Testing Bulk Operations"
    
    if [[ ${#EVENT_IDS[@]} -ge 2 ]]; then
        # Prepare bulk status update
        bulk_data=$(cat << EOF
{
  "eventIds": ["${EVENT_IDS[0]}", "${EVENT_IDS[1]}"],
  "isCompleted": true
}
EOF
        )
        
        response=$(curl -s -X PATCH "$BASE_URL/bulk/status" \
            -H "Content-Type: application/json" \
            -d "$bulk_data")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            print_success "Bulk status update completed successfully"
            
            # Verify updates
            for i in {0..1}; do
                event_response=$(curl -s "$BASE_URL/${EVENT_IDS[$i]}")
                title=$(echo "$event_response" | jq -r '.data.eventTitle')
                status=$(echo "$event_response" | jq -r '.data.isCompleted')
                print_info "  $title: completed = $status"
            done
        else
            error_msg=$(echo "$response" | jq -r '.message')
            print_error "Bulk update failed: $error_msg"
        fi
    else
        print_error "Need at least 2 event IDs for bulk testing"
    fi
}

# Test 12: Reminder Management
test_reminders() {
    print_header "Testing Reminder Management"
    
    response=$(curl -s "$BASE_URL/reminders")
    
    if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
        count=$(echo "$response" | jq -r '.data | length')
        print_success "Found $count events needing reminders"
        
        echo "$response" | jq -r '.data[] | "• \(.eventTitle): \(.reminder) reminder at \(.reminderTime // "No reminder time")"'
    else
        print_error "Failed to get events needing reminders"
    fi
}

# Test 13: Error Handling
test_error_handling() {
    print_header "Testing Error Handling"
    
    # Test invalid event ID
    print_info "Testing invalid event ID"
    response=$(curl -s "$BASE_URL/invalid_id")
    
    if [[ $(echo "$response" | jq -r '.success') == "false" ]]; then
        error_msg=$(echo "$response" | jq -r '.message // .errors[0].msg')
        print_success "Correctly handled invalid ID: $error_msg"
    fi
    
    # Test invalid date format
    print_info "Testing invalid date format"
    invalid_data='{"eventTitle":"Invalid Date Event","eventType":"meeting","date":"invalid-date"}'
    response=$(curl -s -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d "$invalid_data")
    
    if [[ $(echo "$response" | jq -r '.success') == "false" ]]; then
        print_success "Correctly handled invalid date format"
    fi
    
    # Test invalid event type
    print_info "Testing invalid event type"
    invalid_data='{"eventTitle":"Invalid Type Event","eventType":"invalid-type","date":"2025-08-25T14:00:00.000Z"}'
    response=$(curl -s -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d "$invalid_data")
    
    if [[ $(echo "$response" | jq -r '.success') == "false" ]]; then
        print_success "Correctly handled invalid event type"
    fi
}

# Test 14: Delete Calendar Events (Cleanup)
test_delete_events() {
    print_header "Testing Calendar Event Deletion (Cleanup)"
    
    for event_id in "${EVENT_IDS[@]}"; do
        # Get event title before deletion
        event_response=$(curl -s "$BASE_URL/$event_id")
        title=$(echo "$event_response" | jq -r '.data.eventTitle // "Unknown"')
        
        response=$(curl -s -X DELETE "$BASE_URL/$event_id")
        
        if [[ $(echo "$response" | jq -r '.success') == "true" ]]; then
            print_success "Deleted event: $title"
        else
            print_error "Failed to delete event: $title"
        fi
    done
    
    # Verify cleanup
    response=$(curl -s "$BASE_URL")
    remaining=$(echo "$response" | jq -r '.pagination.total')
    print_info "Remaining events: $remaining"
}

# Main execution
main() {
    print_header "Calendar Event API Test Suite"
    print_info "Testing Calendar Event CRUD operations and advanced features"
    
    # Check dependencies
    if ! command -v jq &> /dev/null; then
        print_error "jq is required for JSON parsing. Please install it first."
        exit 1
    fi
    
    # Run tests
    check_server
    test_create_events
    test_get_events
    test_filtering
    test_get_event_by_id
    test_update_event
    test_event_status
    test_reschedule
    test_event_stats
    test_search
    test_attendee_management
    test_bulk_operations
    test_reminders
    test_error_handling
    test_delete_events
    
    print_header "Test Suite Complete"
    print_success "All Calendar Event API tests completed successfully!"
    print_info "Check the output above for any errors or issues."
}

# Run the tests
main
