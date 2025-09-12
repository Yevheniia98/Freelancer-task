"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventController = void 0;
const express_validator_1 = require("express-validator");
const calendar_event_service_1 = require("../services/calendar-event.service");
class CalendarEventController {
    constructor() {
        // Create calendar event
        this.createEvent = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                    return;
                }
                const event = await this.calendarEventService.create(req.body);
                res.status(201).json({
                    success: true,
                    message: 'Calendar event created successfully',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to create calendar event',
                    error: error.message
                });
            }
        };
        // Get all calendar events
        this.getEvents = async (req, res) => {
            try {
                const options = {
                    page: parseInt(req.query.page) || 1,
                    limit: parseInt(req.query.limit) || 10,
                    sortBy: req.query.sortBy || 'date',
                    sortOrder: req.query.sortOrder || 'asc',
                    search: req.query.search,
                    eventType: req.query.eventType,
                    projectId: req.query.projectId,
                    isCompleted: req.query.isCompleted ? req.query.isCompleted === 'true' : undefined,
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    reminder: req.query.reminder,
                    location: req.query.location,
                    hasAttendees: req.query.hasAttendees ? req.query.hasAttendees === 'true' : undefined
                };
                const result = await this.calendarEventService.findAll(options);
                res.status(200).json({
                    success: true,
                    message: 'Calendar events retrieved successfully',
                    data: result.events,
                    pagination: {
                        total: result.total,
                        page: result.page,
                        totalPages: result.totalPages,
                        hasNextPage: result.hasNextPage,
                        hasPrevPage: result.hasPrevPage
                    }
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve calendar events',
                    error: error.message
                });
            }
        };
        // Get calendar event by ID
        this.getEventById = async (req, res) => {
            try {
                const event = await this.calendarEventService.findById(req.params.id);
                if (!event) {
                    res.status(404).json({
                        success: false,
                        message: 'Calendar event not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Calendar event retrieved successfully',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to retrieve calendar event',
                    error: error.message
                });
            }
        };
        // Update calendar event
        this.updateEvent = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                    return;
                }
                const event = await this.calendarEventService.update(req.params.id, req.body);
                if (!event) {
                    res.status(404).json({
                        success: false,
                        message: 'Calendar event not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Calendar event updated successfully',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to update calendar event',
                    error: error.message
                });
            }
        };
        // Delete calendar event
        this.deleteEvent = async (req, res) => {
            try {
                const event = await this.calendarEventService.delete(req.params.id);
                if (!event) {
                    res.status(404).json({
                        success: false,
                        message: 'Calendar event not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Calendar event deleted successfully',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to delete calendar event',
                    error: error.message
                });
            }
        };
        // Get events by project
        this.getEventsByProject = async (req, res) => {
            try {
                const events = await this.calendarEventService.findByProjectId(req.params.projectId);
                res.status(200).json({
                    success: true,
                    message: 'Project events retrieved successfully',
                    data: events
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to retrieve project events',
                    error: error.message
                });
            }
        };
        // Mark event as completed
        this.markCompleted = async (req, res) => {
            try {
                const event = await this.calendarEventService.markCompleted(req.params.id);
                if (!event) {
                    res.status(404).json({
                        success: false,
                        message: 'Calendar event not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Event marked as completed',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to mark event as completed',
                    error: error.message
                });
            }
        };
        // Mark event as incomplete
        this.markIncomplete = async (req, res) => {
            try {
                const event = await this.calendarEventService.markIncomplete(req.params.id);
                if (!event) {
                    res.status(404).json({
                        success: false,
                        message: 'Calendar event not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Event marked as incomplete',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to mark event as incomplete',
                    error: error.message
                });
            }
        };
        // Reschedule event
        this.rescheduleEvent = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                    return;
                }
                const { newDate } = req.body;
                const event = await this.calendarEventService.reschedule(req.params.id, newDate);
                if (!event) {
                    res.status(404).json({
                        success: false,
                        message: 'Calendar event not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Event rescheduled successfully',
                    data: event
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to reschedule event',
                    error: error.message
                });
            }
        };
        // Get upcoming events
        this.getUpcomingEvents = async (req, res) => {
            try {
                const days = parseInt(req.query.days) || 7;
                const events = await this.calendarEventService.getUpcomingEvents(days);
                res.status(200).json({
                    success: true,
                    message: `Upcoming events for next ${days} days retrieved successfully`,
                    data: events
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve upcoming events',
                    error: error.message
                });
            }
        };
        // Get overdue events
        this.getOverdueEvents = async (req, res) => {
            try {
                const events = await this.calendarEventService.getOverdueEvents();
                res.status(200).json({
                    success: true,
                    message: 'Overdue events retrieved successfully',
                    data: events
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve overdue events',
                    error: error.message
                });
            }
        };
        // Get today's events
        this.getTodayEvents = async (req, res) => {
            try {
                const events = await this.calendarEventService.getTodayEvents();
                res.status(200).json({
                    success: true,
                    message: "Today's events retrieved successfully",
                    data: events
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to retrieve today's events",
                    error: error.message
                });
            }
        };
        // Get events in date range
        this.getEventsInRange = async (req, res) => {
            try {
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res.status(400).json({
                        success: false,
                        message: 'Both startDate and endDate are required'
                    });
                    return;
                }
                const events = await this.calendarEventService.getEventsInRange(startDate, endDate);
                res.status(200).json({
                    success: true,
                    message: 'Events in date range retrieved successfully',
                    data: events
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to retrieve events in date range',
                    error: error.message
                });
            }
        };
        // Get calendar event statistics
        this.getStats = async (req, res) => {
            try {
                const stats = await this.calendarEventService.getStats();
                res.status(200).json({
                    success: true,
                    message: 'Calendar event statistics retrieved successfully',
                    data: stats
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve calendar event statistics',
                    error: error.message
                });
            }
        };
        // Search calendar events
        this.searchEvents = async (req, res) => {
            try {
                const searchTerm = req.query.q;
                const limit = parseInt(req.query.limit) || 10;
                if (!searchTerm) {
                    res.status(400).json({
                        success: false,
                        message: 'Search term is required'
                    });
                    return;
                }
                const events = await this.calendarEventService.search(searchTerm, { limit });
                res.status(200).json({
                    success: true,
                    message: 'Search completed successfully',
                    data: events
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to search calendar events',
                    error: error.message
                });
            }
        };
        // Get events by attendee
        this.getEventsByAttendee = async (req, res) => {
            try {
                const email = req.params.email;
                const events = await this.calendarEventService.findByAttendee(email);
                res.status(200).json({
                    success: true,
                    message: 'Events for attendee retrieved successfully',
                    data: events
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to retrieve events for attendee',
                    error: error.message
                });
            }
        };
        // Bulk update event status
        this.bulkUpdateStatus = async (req, res) => {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        success: false,
                        message: 'Validation failed',
                        errors: errors.array()
                    });
                    return;
                }
                const { eventIds, isCompleted } = req.body;
                await this.calendarEventService.bulkUpdateStatus(eventIds, isCompleted);
                res.status(200).json({
                    success: true,
                    message: 'Bulk status update completed successfully'
                });
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to bulk update event status',
                    error: error.message
                });
            }
        };
        // Get events needing reminders
        this.getEventsNeedingReminders = async (req, res) => {
            try {
                const events = await this.calendarEventService.getEventsNeedingReminders();
                res.status(200).json({
                    success: true,
                    message: 'Events needing reminders retrieved successfully',
                    data: events
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve events needing reminders',
                    error: error.message
                });
            }
        };
        this.calendarEventService = calendar_event_service_1.CalendarEventService.getInstance();
    }
}
exports.CalendarEventController = CalendarEventController;
