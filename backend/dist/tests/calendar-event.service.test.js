"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calendar_event_service_1 = require("../services/calendar-event.service");
const calendar_event_entity_1 = require("../models/calendar-event.entity");
const mongoose_1 = __importDefault(require("mongoose"));
describe('CalendarEventService', () => {
    let service;
    let createdEventIds = [];
    beforeAll(() => {
        service = calendar_event_service_1.CalendarEventService.getInstance();
    });
    afterEach(async () => {
        // Clean up created events
        if (createdEventIds.length > 0) {
            await calendar_event_entity_1.CalendarEventEntity.deleteMany({ _id: { $in: createdEventIds } });
            createdEventIds = [];
        }
    });
    describe('create', () => {
        it('should create a new calendar event', async () => {
            const eventData = {
                eventTitle: 'Test Meeting',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            };
            const createdEvent = await service.create(eventData);
            createdEventIds.push(createdEvent.id);
            expect(createdEvent.eventTitle).toBe(eventData.eventTitle);
            expect(createdEvent.eventType).toBe(eventData.eventType);
            expect(createdEvent.date).toEqual(eventData.date);
            expect(createdEvent.isCompleted).toBe(false);
            expect(createdEvent.id).toBeDefined();
        });
        it('should create event with all optional fields', async () => {
            const eventData = {
                eventTitle: 'Comprehensive Meeting',
                eventType: calendar_event_entity_1.EventType.PRESENTATION,
                date: new Date('2025-08-26T16:00:00.000Z'),
                reminder: calendar_event_entity_1.ReminderType.ONE_HOUR,
                description: 'Product demo for stakeholders',
                duration: 90,
                location: 'Conference Room B',
                attendees: ['stakeholder1@company.com', 'stakeholder2@company.com']
            };
            const createdEvent = await service.create(eventData);
            createdEventIds.push(createdEvent.id);
            expect(createdEvent.reminder).toBe(eventData.reminder);
            expect(createdEvent.description).toBe(eventData.description);
            expect(createdEvent.duration).toBe(eventData.duration);
            expect(createdEvent.location).toBe(eventData.location);
            expect(createdEvent.attendees).toEqual(eventData.attendees);
        });
    });
    describe('findAll', () => {
        beforeEach(async () => {
            // Create test events
            const events = [
                {
                    eventTitle: 'Meeting 1',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date('2025-08-25T10:00:00.000Z')
                },
                {
                    eventTitle: 'Deadline 1',
                    eventType: calendar_event_entity_1.EventType.DEADLINE,
                    date: new Date('2025-08-26T23:59:59.000Z')
                },
                {
                    eventTitle: 'Review 1',
                    eventType: calendar_event_entity_1.EventType.REVIEW,
                    date: new Date('2025-08-27T14:00:00.000Z')
                }
            ];
            for (const eventData of events) {
                const event = await service.create(eventData);
                createdEventIds.push(event.id);
            }
        });
        it('should return all events with default options', async () => {
            const result = await service.findAll();
            expect(result.events).toHaveLength(3);
            expect(result.total).toBe(3);
            expect(result.page).toBe(1);
            expect(result.totalPages).toBe(1);
            expect(result.hasNextPage).toBe(false);
            expect(result.hasPrevPage).toBe(false);
        });
        it('should filter events by type', async () => {
            const result = await service.findAll({ eventType: calendar_event_entity_1.EventType.MEETING });
            expect(result.events).toHaveLength(1);
            expect(result.events[0].eventType).toBe(calendar_event_entity_1.EventType.MEETING);
        });
        it('should filter events by completion status', async () => {
            const result = await service.findAll({ isCompleted: true });
            expect(result.events).toHaveLength(1);
            expect(result.events[0].isCompleted).toBe(true);
        });
        it('should paginate results correctly', async () => {
            const result = await service.findAll({ page: 1, limit: 2 });
            expect(result.events).toHaveLength(2);
            expect(result.total).toBe(3);
            expect(result.page).toBe(1);
            expect(result.totalPages).toBe(2);
            expect(result.hasNextPage).toBe(true);
            expect(result.hasPrevPage).toBe(false);
        });
        it('should sort events by date ascending', async () => {
            const result = await service.findAll({ sortBy: 'date', sortOrder: 'asc' });
            expect(result.events).toHaveLength(3);
            const dates = result.events.map(event => event.date);
            for (let i = 1; i < dates.length; i++) {
                expect(dates[i] >= dates[i - 1]).toBe(true);
            }
        });
    });
    describe('findById', () => {
        let eventId;
        beforeEach(async () => {
            const event = await service.create({
                eventTitle: 'Test Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should find event by valid ID', async () => {
            const event = await service.findById(eventId);
            expect(event).toBeDefined();
            expect(event?.id).toBe(eventId);
            expect(event?.eventTitle).toBe('Test Event');
        });
        it('should return null for non-existent ID', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId().toString();
            const event = await service.findById(fakeId);
            expect(event).toBeNull();
        });
    });
    describe('update', () => {
        let eventId;
        beforeEach(async () => {
            const event = await service.create({
                eventTitle: 'Original Event',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should update event with valid data', async () => {
            const updateData = {
                eventTitle: 'Updated Event',
                reminder: calendar_event_entity_1.ReminderType.ONE_HOUR,
                description: 'Updated description'
            };
            const updatedEvent = await service.update(eventId, updateData);
            expect(updatedEvent).toBeDefined();
            expect(updatedEvent?.eventTitle).toBe(updateData.eventTitle);
            expect(updatedEvent?.reminder).toBe(updateData.reminder);
            expect(updatedEvent?.description).toBe(updateData.description);
        });
        it('should return null for non-existent event ID', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId().toString();
            const updatedEvent = await service.update(fakeId, { eventTitle: 'Updated' });
            expect(updatedEvent).toBeNull();
        });
    });
    describe('delete', () => {
        let eventId;
        beforeEach(async () => {
            const event = await service.create({
                eventTitle: 'Event to Delete',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should delete event by valid ID', async () => {
            const deletedEvent = await service.delete(eventId);
            expect(deletedEvent).toBeDefined();
            expect(deletedEvent?.id).toBe(eventId);
            // Verify deletion
            const event = await service.findById(eventId);
            expect(event).toBeNull();
            // Remove from cleanup list since it's deleted
            createdEventIds = createdEventIds.filter(id => id !== eventId);
        });
        it('should return null for non-existent event ID', async () => {
            const fakeId = new mongoose_1.default.Types.ObjectId().toString();
            const deletedEvent = await service.delete(fakeId);
            expect(deletedEvent).toBeNull();
        });
    });
    describe('getUpcomingEvents', () => {
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
                const event = await service.create(eventData);
                createdEventIds.push(event.id);
            }
        });
        it('should get upcoming events within default 7 days', async () => {
            const upcomingEvents = await service.getUpcomingEvents();
            expect(upcomingEvents).toHaveLength(1);
            expect(upcomingEvents[0].eventTitle).toBe('Tomorrow Event');
        });
        it('should get upcoming events within specified days', async () => {
            const upcomingEvents = await service.getUpcomingEvents(10);
            expect(upcomingEvents).toHaveLength(2);
            expect(upcomingEvents.some(event => event.eventTitle === 'Tomorrow Event')).toBe(true);
            expect(upcomingEvents.some(event => event.eventTitle === 'Next Week Event')).toBe(true);
        });
    });
    describe('getOverdueEvents', () => {
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
                const event = await service.create(eventData);
                createdEventIds.push(event.id);
            }
        });
        it('should get only overdue uncompleted events', async () => {
            const overdueEvents = await service.getOverdueEvents();
            expect(overdueEvents).toHaveLength(1);
            expect(overdueEvents[0].eventTitle).toBe('Overdue Event');
            expect(overdueEvents[0].isCompleted).toBe(false);
        });
    });
    describe('getTodayEvents', () => {
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
                const event = await service.create(eventData);
                createdEventIds.push(event.id);
            }
        });
        it("should get only today's events", async () => {
            const todayEvents = await service.getTodayEvents();
            expect(todayEvents).toHaveLength(1);
            expect(todayEvents[0].eventTitle).toBe("Today's Event");
        });
    });
    describe('markCompleted', () => {
        let eventId;
        beforeEach(async () => {
            const event = await service.create({
                eventTitle: 'Event to Complete',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should mark event as completed', async () => {
            const completedEvent = await service.markCompleted(eventId);
            expect(completedEvent).toBeDefined();
            expect(completedEvent?.isCompleted).toBe(true);
        });
        it('should mark event as incomplete', async () => {
            // First mark as completed
            await service.markCompleted(eventId);
            // Then check that it was marked as completed
            const completedEvent = await service.findById(eventId);
            expect(completedEvent?.isCompleted).toBe(true);
            // Now manually update it to incomplete using update method
            const incompleteEvent = await service.update(eventId, { isCompleted: false });
            expect(incompleteEvent?.isCompleted).toBe(false);
        });
    });
    describe('reschedule', () => {
        let eventId;
        beforeEach(async () => {
            const event = await service.create({
                eventTitle: 'Event to Reschedule',
                eventType: calendar_event_entity_1.EventType.MEETING,
                date: new Date('2025-08-25T14:00:00.000Z')
            });
            eventId = event.id;
            createdEventIds.push(eventId);
        });
        it('should reschedule event to new date', async () => {
            const newDate = new Date('2025-08-26T16:00:00.000Z');
            const rescheduledEvent = await service.reschedule(eventId, newDate);
            expect(rescheduledEvent).toBeDefined();
            expect(rescheduledEvent?.date).toEqual(newDate);
        });
    });
    describe('getStats', () => {
        beforeEach(async () => {
            const now = new Date();
            const events = [
                {
                    eventTitle: 'Meeting 1',
                    eventType: calendar_event_entity_1.EventType.MEETING,
                    date: new Date(now.getTime() + 24 * 60 * 60 * 1000)
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
                const event = await service.create(eventData);
                createdEventIds.push(event.id);
            }
        });
        it('should get calendar event statistics', async () => {
            const stats = await service.getStats();
            expect(stats.totalEvents).toBe(3);
            expect(stats.completedEvents).toBe(1);
            expect(stats.upcomingEvents).toBe(1);
            expect(stats.overdueEvents).toBe(1);
            expect(stats.eventsByType).toBeDefined();
            expect(stats.eventsByType.meeting).toBe(2);
            expect(stats.eventsByType.deadline).toBe(1);
        });
    });
});
