import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { CalendarEventService } from '../services/calendar-event.service';

export class CalendarEventController {
  private calendarEventService: CalendarEventService;

  constructor() {
    this.calendarEventService = CalendarEventService.getInstance();
  }

  // Create calendar event
  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create calendar event',
        error: error.message
      });
    }
  };

  // Get all calendar events
  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: (req.query.sortBy as keyof import('../models/calendar-event.entity').ICalendarEventEntity) || 'date',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        search: req.query.search as string,
        eventType: req.query.eventType as import('../models/calendar-event.entity').EventType,
        projectId: req.query.projectId as string,
        isCompleted: req.query.isCompleted ? req.query.isCompleted === 'true' : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        reminder: req.query.reminder as import('../models/calendar-event.entity').ReminderType,
        location: req.query.location as string,
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve calendar events',
        error: error.message
      });
    }
  };

  // Get calendar event by ID
  getEventById = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve calendar event',
        error: error.message
      });
    }
  };

  // Update calendar event
  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update calendar event',
        error: error.message
      });
    }
  };

  // Delete calendar event
  deleteEvent = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete calendar event',
        error: error.message
      });
    }
  };

  // Get events by project
  getEventsByProject = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.calendarEventService.findByProjectId(req.params.projectId);
      
      res.status(200).json({
        success: true,
        message: 'Project events retrieved successfully',
        data: events
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve project events',
        error: error.message
      });
    }
  };

  // Mark event as completed
  markCompleted = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark event as completed',
        error: error.message
      });
    }
  };

  // Mark event as incomplete
  markIncomplete = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark event as incomplete',
        error: error.message
      });
    }
  };

  // Reschedule event
  rescheduleEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reschedule event',
        error: error.message
      });
    }
  };

  // Get upcoming events
  getUpcomingEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const events = await this.calendarEventService.getUpcomingEvents(days);
      
      res.status(200).json({
        success: true,
        message: `Upcoming events for next ${days} days retrieved successfully`,
        data: events
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve upcoming events',
        error: error.message
      });
    }
  };

  // Get overdue events
  getOverdueEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.calendarEventService.getOverdueEvents();
      
      res.status(200).json({
        success: true,
        message: 'Overdue events retrieved successfully',
        data: events
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve overdue events',
        error: error.message
      });
    }
  };

  // Get today's events
  getTodayEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.calendarEventService.getTodayEvents();
      
      res.status(200).json({
        success: true,
        message: "Today's events retrieved successfully",
        data: events
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve today's events",
        error: error.message
      });
    }
  };

  // Get events in date range
  getEventsInRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'Both startDate and endDate are required'
        });
        return;
      }

      const events = await this.calendarEventService.getEventsInRange(
        startDate as string, 
        endDate as string
      );
      
      res.status(200).json({
        success: true,
        message: 'Events in date range retrieved successfully',
        data: events
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve events in date range',
        error: error.message
      });
    }
  };

  // Get calendar event statistics
  getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.calendarEventService.getStats();
      
      res.status(200).json({
        success: true,
        message: 'Calendar event statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve calendar event statistics',
        error: error.message
      });
    }
  };

  // Search calendar events
  searchEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchTerm = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to search calendar events',
        error: error.message
      });
    }
  };

  // Get events by attendee
  getEventsByAttendee = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = req.params.email;
      const events = await this.calendarEventService.findByAttendee(email);
      
      res.status(200).json({
        success: true,
        message: 'Events for attendee retrieved successfully',
        data: events
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to retrieve events for attendee',
        error: error.message
      });
    }
  };

  // Bulk update event status
  bulkUpdateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to bulk update event status',
        error: error.message
      });
    }
  };

  // Get events needing reminders
  getEventsNeedingReminders = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await this.calendarEventService.getEventsNeedingReminders();
      
      res.status(200).json({
        success: true,
        message: 'Events needing reminders retrieved successfully',
        data: events
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve events needing reminders',
        error: error.message
      });
    }
  };
}
