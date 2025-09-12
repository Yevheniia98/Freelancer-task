"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calendar_event_service_1 = require("../services/calendar-event.service");
const calendar_event_entity_1 = require("../models/calendar-event.entity");
describe('CalendarEventService', () => {
    let service;
    let createdEventIds = [];
    beforeAll(() => {
        service = calendar_event_service_1.CalendarEventService.getInstance();
    });
    afterEach(async () => {
        // Clean up created events
        if (createdEventIds.length > 0) {
            for (const eventId of createdEventIds) {
                try {
                    await service.delete(eventId);
                }
                catch (error) {
                    // Ignore errors during cleanup
                }
            }
            createdEventIds = [];
        }
    });
    describe('create', () => {
        it('should create a new calendar event with required fields', async () => {
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
        it('should create event with optional fields', async () => {
            const eventData = {
                eventTitle: 'Meeting with Details',
                eventType: calendar_event_entity_1.EventType.PRESENTATION,
                date: new Date('2025-08-26T16:00:00.000Z'),
                reminder: calendar_event_entity_1.ReminderType.ONE_HOUR,
                description: 'Product demo',
                duration: 90,
                location: 'Conference Room B',
                attendees: ['user@example.com']
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
            const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
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
});
