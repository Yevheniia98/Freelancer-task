"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const calendar_event_routes_1 = __importDefault(require("../routes/calendar-event.routes"));
const calendar_event_entity_1 = require("../models/calendar-event.entity");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/calendar-events', calendar_event_routes_1.default);
describe('Calendar Event API', () => {
    let createdEventIds = [];
    beforeAll(async () => {
        // Use existing connection from setup
    });
    afterAll(async () => {
        // Cleanup handled by setup
    });
    beforeEach(async () => {
        // Events will be cleaned up by setup.ts
        createdEventIds = [];
    });
    // Clean up created events after tests
    afterEach(async () => {
        if (createdEventIds.length > 0) {
            await calendar_event_entity_1.CalendarEventEntity.deleteMany({ _id: { $in: createdEventIds } });
        }
    });
    describe('POST /api/calendar-events', () => {
        it('should create a new calendar event with required fields', async () => {
            const eventData = {
                eventTitle: 'Client Meeting',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: '2025-08-25T14:30:00.000Z'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/calendar-events')
                .send(eventData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.eventTitle).toBe(eventData.eventTitle);
            expect(response.body.data.eventType).toBe(eventData.eventType);
            expect(response.body.data.isCompleted).toBe(false);
            createdEventIds.push(response.body.data.id);
        });
        it('should create a calendar event with all optional fields', async () => {
            const eventData = {
                eventTitle: 'Comprehensive Meeting',
                eventType: calendar_event_entity_1.EventType.PRESENTATION,
                date: '2025-08-26T16:00:00.000Z',
                reminder: calendar_event_entity_1.ReminderType.ONE_HOUR,
                description: 'Product demo for stakeholders',
                duration: 90,
                location: 'Conference Room B',
                attendees: ['stakeholder1@company.com', 'stakeholder2@company.com']
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/calendar-events')
                .send(eventData)
                .expect(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.reminder).toBe(eventData.reminder);
            expect(response.body.data.description).toBe(eventData.description);
            expect(response.body.data.duration).toBe(eventData.duration);
            expect(response.body.data.location).toBe(eventData.location);
            expect(response.body.data.attendees).toEqual(eventData.attendees);
            createdEventIds.push(response.body.data.id);
        });
        it('should fail to create calendar event without required fields', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/calendar-events')
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Validation failed');
            expect(response.body.errors).toBeDefined();
        });
        it('should fail to create calendar event with invalid date format', async () => {
            const eventData = {
                eventTitle: 'Invalid Date Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: 'invalid-date'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/calendar-events')
                .send(eventData)
                .expect(400);
            expect(response.body.success).toBe(false);
        });
        it('should fail to create calendar event with invalid event type', async () => {
            const eventData = {
                eventTitle: 'Invalid Type Event',
                eventType: 'invalid-type',
                date: '2025-08-25T14:00:00.000Z'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/calendar-events')
                .send(eventData)
                .expect(400);
            expect(response.body.success).toBe(false);
        });
        it('should fail to create calendar event with invalid attendee emails', async () => {
            const eventData = {
                eventTitle: 'Invalid Attendees Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: '2025-08-25T14:00:00.000Z',
                attendees: ['valid@email.com', 'invalid-email']
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/calendar-events')
                .send(eventData)
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('GET /api/calendar-events', () => {
        beforeEach(async () => {
            // Create test events
            const events = [
                {
                    eventTitle: 'Meeting 1',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-25T10:00:00.000Z'),
                    isCompleted: false
                },
                {
                    eventTitle: 'Deadline 1',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date('2025-08-26T23:59:59.000Z'),
                    isCompleted: true
                },
                {
                    eventTitle: 'Review 1',
                    eventType: calendar_event_entity_1.EventType.REVIEW,
                    date: new Date('2025-08-27T14:00:00.000Z'),
                    isCompleted: false
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get all calendar events with default pagination', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBe(3);
            expect(response.body.pagination).toBeDefined();
            expect(response.body.pagination.total).toBe(3);
        });
        it('should filter events by type', async () => {
            const response = await (0, supertest_1.default)(app)
                .get(`/api/calendar-events?eventType=${calendar_event_entity_1.EventType.MEETING}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].eventType).toBe(calendar_event_entity_1.EventType.MEETING);
        });
        it('should filter events by completion status', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events?isCompleted=true')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].isCompleted).toBe(true);
        });
        it('should sort events by date', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events?sortBy=date&sortOrder=asc')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(3);
            const dates = response.body.data.map((event) => new Date(event.date));
            for (let i = 1; i < dates.length; i++) {
                expect(dates[i] >= dates[i - 1]).toBe(true);
            }
        });
        it('should paginate events correctly', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events?page=1&limit=2')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.totalPages).toBe(2);
            expect(response.body.pagination.hasNextPage).toBe(true);
        });
    });
    describe('GET /api/calendar-events/:id', () => {
        let eventId;
        beforeEach(async () => {
            const event = new calendar_event_entity_1.CalendarEventEntity({
                eventTitle: 'Test Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z'),
                description: 'Test description',
                location: 'Test location'
            });
            await event.save();
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should get calendar event by valid ID', async () => {
            const response = await (0, supertest_1.default)(app)
                .get(`/api/calendar-events/${eventId}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(eventId);
            expect(response.body.data.eventTitle).toBe('Test Event');
        });
        it('should return 404 for non-existent event ID', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app)
                .get(`/api/calendar-events/${fakeId}`)
                .expect(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Calendar event not found');
        });
        it('should return 400 for invalid event ID format', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/invalid-id')
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('PUT /api/calendar-events/:id', () => {
        let eventId;
        beforeEach(async () => {
            const event = new calendar_event_entity_1.CalendarEventEntity({
                eventTitle: 'Original Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            await event.save();
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should update calendar event with valid data', async () => {
            const updateData = {
                eventTitle: 'Updated Event',
                reminder: calendar_event_entity_1.ReminderType.ONE_HOUR,
                description: 'Updated description'
            };
            const response = await (0, supertest_1.default)(app)
                .put(`/api/calendar-events/${eventId}`)
                .send(updateData)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.eventTitle).toBe(updateData.eventTitle);
            expect(response.body.data.reminder).toBe(updateData.reminder);
            expect(response.body.data.description).toBe(updateData.description);
        });
        it('should return 404 for non-existent event ID', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app)
                .put(`/api/calendar-events/${fakeId}`)
                .send({ eventTitle: 'Updated' })
                .expect(404);
            expect(response.body.success).toBe(false);
        });
        it('should fail to update with invalid data', async () => {
            const response = await (0, supertest_1.default)(app)
                .put(`/api/calendar-events/${eventId}`)
                .send({ eventType: 'invalid-type' })
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('DELETE /api/calendar-events/:id', () => {
        let eventId;
        beforeEach(async () => {
            const event = new calendar_event_entity_1.CalendarEventEntity({
                eventTitle: 'Event to Delete',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            await event.save();
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should delete calendar event by valid ID', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/calendar-events/${eventId}`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(eventId);
            // Verify deletion
            const deletedEvent = await calendar_event_entity_1.CalendarEventEntity.findById(eventId);
            expect(deletedEvent).toBeNull();
            // Remove from cleanup list since it's already deleted
            createdEventIds = createdEventIds.filter(id => id !== eventId);
        });
        it('should return 404 for non-existent event ID', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app)
                .delete(`/api/calendar-events/${fakeId}`)
                .expect(404);
            expect(response.body.success).toBe(false);
        });
    });
    describe('GET /api/calendar-events/upcoming', () => {
        beforeEach(async () => {
            const now = new Date();
            const events = [
                {
                    eventTitle: 'Tomorrow Event',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                    isCompleted: false
                },
                {
                    eventTitle: 'Next Week Event',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // Next week
                    isCompleted: false
                },
                {
                    eventTitle: 'Past Event',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
                    isCompleted: false
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get upcoming events within default 7 days', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/upcoming')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1); // Only tomorrow's event
        });
        it('should get upcoming events within specified days', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/upcoming?days=10')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2); // Tomorrow and next week
        });
    });
    describe('GET /api/calendar-events/overdue', () => {
        beforeEach(async () => {
            const now = new Date();
            const events = [
                {
                    eventTitle: 'Overdue Event',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
                    isCompleted: false
                },
                {
                    eventTitle: 'Completed Past Event',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
                    isCompleted: true
                },
                {
                    eventTitle: 'Future Event',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
                    isCompleted: false
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get only overdue uncompleted events', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/overdue')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].eventTitle).toBe('Overdue Event');
        });
    });
    describe('GET /api/calendar-events/today', () => {
        beforeEach(async () => {
            const today = new Date();
            const todayEvent = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0);
            const yesterdayEvent = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            const events = [
                {
                    eventTitle: "Today's Event",
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: todayEvent
                },
                {
                    eventTitle: "Yesterday's Event",
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: yesterdayEvent
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it("should get only today's events", async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/today')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].eventTitle).toBe("Today's Event");
        });
    });
    describe('GET /api/calendar-events/range', () => {
        beforeEach(async () => {
            const events = [
                {
                    eventTitle: 'Event in Range',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-25T14:00:00.000Z')
                },
                {
                    eventTitle: 'Event Outside Range',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-09-01T14:00:00.000Z')
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get events within date range', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/range?startDate=2025-08-20T00:00:00.000Z&endDate=2025-08-30T23:59:59.000Z')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].eventTitle).toBe('Event in Range');
        });
        it('should require both startDate and endDate', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/range?startDate=2025-08-20T00:00:00.000Z')
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Both startDate and endDate are required');
        });
    });
    describe('GET /api/calendar-events/search', () => {
        beforeEach(async () => {
            const events = [
                {
                    eventTitle: 'Client Meeting',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-25T14:00:00.000Z'),
                    description: 'Quarterly review with client'
                },
                {
                    eventTitle: 'Team Standup',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-26T09:00:00.000Z'),
                    description: 'Daily team synchronization'
                },
                {
                    eventTitle: 'Project Deadline',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date('2025-08-30T23:59:59.000Z'),
                    location: 'Client office'
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should search events by title', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/search?q=meeting')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2);
        });
        it('should search events by description', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/search?q=client')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2); // One in title, one in location
        });
        it('should require search term', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/search')
                .expect(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Search term is required');
        });
    });
    describe('GET /api/calendar-events/stats', () => {
        beforeEach(async () => {
            const now = new Date();
            const events = [
                {
                    eventTitle: 'Meeting 1',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                    isCompleted: false
                },
                {
                    eventTitle: 'Meeting 2',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() - 24 * 60 * 60 * 1000),
                    isCompleted: true
                },
                {
                    eventTitle: 'Deadline 1',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date(now.getTime() - 48 * 60 * 60 * 1000),
                    isCompleted: false
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get calendar event statistics', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/stats')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.totalEvents).toBe(3);
            expect(response.body.data.completedEvents).toBe(1);
            expect(response.body.data.upcomingEvents).toBe(1);
            expect(response.body.data.overdueEvents).toBe(1);
            expect(response.body.data.eventsByType).toBeDefined();
            expect(response.body.data.eventsByType.meeting).toBe(2);
            expect(response.body.data.eventsByType.deadline).toBe(1);
        });
    });
    describe('PATCH /api/calendar-events/:id/complete', () => {
        let eventId;
        beforeEach(async () => {
            const event = new calendar_event_entity_1.CalendarEventEntity({
                eventTitle: 'Event to Complete',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z'),
                isCompleted: false
            });
            await event.save();
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should mark event as completed', async () => {
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/calendar-events/${eventId}/complete`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isCompleted).toBe(true);
        });
    });
    describe('PATCH /api/calendar-events/:id/incomplete', () => {
        let eventId;
        beforeEach(async () => {
            const event = new calendar_event_entity_1.CalendarEventEntity({
                eventTitle: 'Completed Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z'),
                isCompleted: true
            });
            await event.save();
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should mark event as incomplete', async () => {
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/calendar-events/${eventId}/incomplete`)
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.isCompleted).toBe(false);
        });
    });
    describe('PATCH /api/calendar-events/:id/reschedule', () => {
        let eventId;
        beforeEach(async () => {
            const event = new calendar_event_entity_1.CalendarEventEntity({
                eventTitle: 'Event to Reschedule',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            await event.save();
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should reschedule event to new date', async () => {
            const newDate = '2025-08-26T16:00:00.000Z';
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/calendar-events/${eventId}/reschedule`)
                .send({ newDate })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.date).toBe(newDate);
        });
        it('should fail to reschedule without new date', async () => {
            const response = await (0, supertest_1.default)(app)
                .patch(`/api/calendar-events/${eventId}/reschedule`)
                .send({})
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('PATCH /api/calendar-events/bulk/status', () => {
        let eventIds;
        beforeEach(async () => {
            const events = [
                {
                    eventTitle: 'Event 1',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-25T14:00:00.000Z'),
                    isCompleted: false
                },
                {
                    eventTitle: 'Event 2',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date('2025-08-26T14:00:00.000Z'),
                    isCompleted: false
                }
            ];
            eventIds = [];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                eventIds.push(event.id);
                createdEventIds.push(event.id);
            }
        });
        it('should bulk update event status', async () => {
            const response = await (0, supertest_1.default)(app)
                .patch('/api/calendar-events/bulk/status')
                .send({ eventIds, isCompleted: true })
                .expect(200);
            expect(response.body.success).toBe(true);
            // Verify updates
            for (const eventId of eventIds) {
                const event = await calendar_event_entity_1.CalendarEventEntity.findById(eventId);
                expect(event?.isCompleted).toBe(true);
            }
        });
        it('should fail bulk update with invalid event IDs', async () => {
            const response = await (0, supertest_1.default)(app)
                .patch('/api/calendar-events/bulk/status')
                .send({ eventIds: ['invalid-id'], isCompleted: true })
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('GET /api/calendar-events/attendee/:email', () => {
        beforeEach(async () => {
            const events = [
                {
                    eventTitle: 'Meeting with John',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-25T14:00:00.000Z'),
                    attendees: ['john@example.com', 'jane@example.com']
                },
                {
                    eventTitle: 'Meeting with Jane',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-26T14:00:00.000Z'),
                    attendees: ['jane@example.com']
                },
                {
                    eventTitle: 'Solo Meeting',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-27T14:00:00.000Z'),
                    attendees: []
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get events by attendee email', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/attendee/jane@example.com')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(2);
        });
        it('should return empty array for non-existent attendee', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/attendee/nonexistent@example.com')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(0);
        });
        it('should fail with invalid email format', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/attendee/invalid-email')
                .expect(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('GET /api/calendar-events/reminders', () => {
        beforeEach(async () => {
            const now = new Date();
            const events = [
                {
                    eventTitle: 'Event with Reminder',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                    reminder: calendar_event_entity_1.ReminderType.ONE_HOUR,
                    isCompleted: false
                },
                {
                    eventTitle: 'Event without Reminder',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 48 * 60 * 60 * 1000),
                    reminder: calendar_event_entity_1.ReminderType.NONE,
                    isCompleted: false
                },
                {
                    eventTitle: 'Completed Event with Reminder',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 72 * 60 * 60 * 1000),
                    reminder: calendar_event_entity_1.ReminderType.FIFTEEN_MINUTES,
                    isCompleted: true
                }
            ];
            for (const eventData of events) {
                const event = new calendar_event_entity_1.CalendarEventEntity(eventData);
                await event.save();
                createdEventIds.push(event.id);
            }
        });
        it('should get events needing reminders', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/calendar-events/reminders')
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(1);
            expect(response.body.data[0].eventTitle).toBe('Event with Reminder');
        });
    });
});
