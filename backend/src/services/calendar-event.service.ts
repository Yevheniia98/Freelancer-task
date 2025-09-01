import mongoose from 'mongoose';
import { CalendarEventEntity, ICalendarEventEntity, EventType, ReminderType } from '../models/calendar-event.entity';

export interface CreateCalendarEventDto {
  eventTitle: string;
  eventType: EventType;
  date: Date | string;
  reminder?: ReminderType;
  projectId?: string;
  description?: string;
  duration?: number;
  location?: string;
  attendees?: string[];
}

export interface UpdateCalendarEventDto {
  eventTitle?: string;
  eventType?: EventType;
  date?: Date | string;
  reminder?: ReminderType;
  projectId?: string;
  description?: string;
  duration?: number;
  location?: string;
  attendees?: string[];
  isCompleted?: boolean;
}

export interface CalendarEventFilters {
  eventType?: EventType;
  projectId?: string;
  isCompleted?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  reminder?: ReminderType;
  location?: string;
  hasAttendees?: boolean;
  search?: string;
}

export interface CalendarEventListOptions extends CalendarEventFilters {
  page?: number;
  limit?: number;
  sortBy?: keyof ICalendarEventEntity;
  sortOrder?: 'asc' | 'desc';
}

export class CalendarEventService {
  private static instance: CalendarEventService;

  public static getInstance(): CalendarEventService {
    if (!CalendarEventService.instance) {
      CalendarEventService.instance = new CalendarEventService();
    }
    return CalendarEventService.instance;
  }

  // Create a new calendar event
  async create(eventData: CreateCalendarEventDto): Promise<ICalendarEventEntity> {
    try {
      // Convert string date to Date object if needed
      const processedData = {
        ...eventData,
        date: typeof eventData.date === 'string' ? new Date(eventData.date) : eventData.date,
        projectId: eventData.projectId ? new mongoose.Types.ObjectId(eventData.projectId) : undefined
      };

      const event = new CalendarEventEntity(processedData);
      return await event.save();
    } catch (error: any) {
      throw error;
    }
  }

  // Find all calendar events with filtering, pagination, and sorting
  async findAll(options: CalendarEventListOptions = {}): Promise<{
    events: ICalendarEventEntity[];
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'asc',
      search,
      eventType,
      projectId,
      isCompleted,
      startDate,
      endDate,
      reminder,
      location,
      hasAttendees
    } = options;

    // Build query
    const query: any = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (eventType) {
      query.eventType = eventType;
    }

    if (projectId) {
      if (mongoose.Types.ObjectId.isValid(projectId)) {
        query.projectId = new mongoose.Types.ObjectId(projectId);
      } else {
        throw new Error('Invalid project ID format');
      }
    }

    if (isCompleted !== undefined) {
      query.isCompleted = isCompleted;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (reminder) {
      query.reminder = reminder;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (hasAttendees !== undefined) {
      if (hasAttendees) {
        query.attendees = { $exists: true, $ne: [] };
      } else {
        query.$or = [
          { attendees: { $exists: false } },
          { attendees: { $size: 0 } }
        ];
      }
    }

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Sort configuration
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [events, total] = await Promise.all([
      CalendarEventEntity.find(query)
        .populate('projectId', 'title status')
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .exec(),
      CalendarEventEntity.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      events,
      total,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };
  }

  // Find calendar event by ID
  async findById(id: string): Promise<ICalendarEventEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar event ID format');
    }
    return await CalendarEventEntity.findById(id).populate('projectId', 'title status');
  }

  // Find events by project ID
  async findByProjectId(projectId: string): Promise<ICalendarEventEntity[]> {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new Error('Invalid project ID format');
    }
    return await CalendarEventEntity.find({ projectId: new mongoose.Types.ObjectId(projectId) })
      .sort({ date: 1 })
      .populate('projectId', 'title status');
  }

  // Update calendar event
  async update(id: string, updateData: UpdateCalendarEventDto): Promise<ICalendarEventEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar event ID format');
    }

    const processedData: any = { ...updateData };

    // Convert string date to Date object if needed
    if (processedData.date) {
      processedData.date = typeof processedData.date === 'string' ? new Date(processedData.date) : processedData.date;
    }

    // Convert projectId string to ObjectId if provided
    if (processedData.projectId) {
      if (mongoose.Types.ObjectId.isValid(processedData.projectId)) {
        processedData.projectId = new mongoose.Types.ObjectId(processedData.projectId);
      } else {
        throw new Error('Invalid project ID format');
      }
    }

    return await CalendarEventEntity.findByIdAndUpdate(
      id,
      processedData,
      { new: true, runValidators: true }
    ).populate('projectId', 'title status');
  }

  // Delete calendar event
  async delete(id: string): Promise<ICalendarEventEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar event ID format');
    }
    return await CalendarEventEntity.findByIdAndDelete(id);
  }

  // Mark event as completed
  async markCompleted(id: string): Promise<ICalendarEventEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar event ID format');
    }

    return await CalendarEventEntity.findByIdAndUpdate(
      id,
      { isCompleted: true },
      { new: true }
    ).populate('projectId', 'title status');
  }

  // Mark event as incomplete
  async markIncomplete(id: string): Promise<ICalendarEventEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar event ID format');
    }

    return await CalendarEventEntity.findByIdAndUpdate(
      id,
      { isCompleted: false },
      { new: true }
    ).populate('projectId', 'title status');
  }

  // Reschedule event
  async reschedule(id: string, newDate: Date | string): Promise<ICalendarEventEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid calendar event ID format');
    }

    const date = typeof newDate === 'string' ? new Date(newDate) : newDate;

    return await CalendarEventEntity.findByIdAndUpdate(
      id,
      { date },
      { new: true, runValidators: true }
    ).populate('projectId', 'title status');
  }

  // Get upcoming events
  async getUpcomingEvents(days: number = 7): Promise<ICalendarEventEntity[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);

    return await CalendarEventEntity.find({
      date: { $gte: now, $lte: futureDate },
      isCompleted: false
    })
      .sort({ date: 1 })
      .populate('projectId', 'title status');
  }

  // Get overdue events
  async getOverdueEvents(): Promise<ICalendarEventEntity[]> {
    const now = new Date();

    return await CalendarEventEntity.find({
      date: { $lt: now },
      isCompleted: false
    })
      .sort({ date: -1 })
      .populate('projectId', 'title status');
  }

  // Get events for today
  async getTodayEvents(): Promise<ICalendarEventEntity[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    return await CalendarEventEntity.find({
      date: { $gte: startOfDay, $lt: endOfDay }
    })
      .sort({ date: 1 })
      .populate('projectId', 'title status');
  }

  // Get events for a specific date range
  async getEventsInRange(startDate: Date | string, endDate: Date | string): Promise<ICalendarEventEntity[]> {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    return await CalendarEventEntity.find({
      date: { $gte: start, $lte: end }
    })
      .sort({ date: 1 })
      .populate('projectId', 'title status');
  }

  // Get calendar event statistics
  async getStats(): Promise<{
    totalEvents: number;
    completedEvents: number;
    upcomingEvents: number;
    overdueEvents: number;
    todayEvents: number;
    eventsByType: Record<EventType, number>;
    eventsByMonth: Array<{ month: string; count: number }>;
  }> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    const [
      totalEvents,
      completedEvents,
      upcomingEvents,
      overdueEvents,
      todayEvents,
      eventsByType,
      eventsByMonth
    ] = await Promise.all([
      CalendarEventEntity.countDocuments({}),
      CalendarEventEntity.countDocuments({ isCompleted: true }),
      CalendarEventEntity.countDocuments({ date: { $gte: now }, isCompleted: false }),
      CalendarEventEntity.countDocuments({ date: { $lt: now }, isCompleted: false }),
      CalendarEventEntity.countDocuments({ date: { $gte: startOfDay, $lt: endOfDay } }),
      CalendarEventEntity.aggregate([
        { $group: { _id: '$eventType', count: { $sum: 1 } } }
      ]),
      CalendarEventEntity.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$date' },
              year: { $year: '$date' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    // Format event types
    const eventTypeStats: Record<EventType, number> = {} as Record<EventType, number>;
    Object.values(EventType).forEach(type => {
      eventTypeStats[type] = 0;
    });
    eventsByType.forEach((item: any) => {
      if (Object.values(EventType).includes(item._id)) {
        eventTypeStats[item._id as EventType] = item.count;
      }
    });

    // Format monthly stats
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthlyStats = eventsByMonth.map((item: any) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count
    }));

    return {
      totalEvents,
      completedEvents,
      upcomingEvents,
      overdueEvents,
      todayEvents,
      eventsByType: eventTypeStats,
      eventsByMonth: monthlyStats
    };
  }

  // Search calendar events by text
  async search(searchTerm: string, options: { limit?: number } = {}): Promise<ICalendarEventEntity[]> {
    const { limit = 10 } = options;

    return await CalendarEventEntity.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .populate('projectId', 'title status')
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .exec();
  }

  // Get events requiring reminders
  async getEventsNeedingReminders(): Promise<ICalendarEventEntity[]> {
    const now = new Date();
    
    return await CalendarEventEntity.find({
      date: { $gte: now },
      isCompleted: false,
      reminder: { $ne: ReminderType.NONE }
    })
      .sort({ date: 1 })
      .populate('projectId', 'title status');
  }

  // Bulk update event status
  async bulkUpdateStatus(eventIds: string[], isCompleted: boolean): Promise<void> {
    const objectIds = eventIds.map(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid event ID: ${id}`);
      }
      return new mongoose.Types.ObjectId(id);
    });

    await CalendarEventEntity.updateMany(
      { _id: { $in: objectIds } },
      { isCompleted }
    );
  }

  // Get events by attendee email
  async findByAttendee(email: string): Promise<ICalendarEventEntity[]> {
    return await CalendarEventEntity.find({
      attendees: { $in: [email.toLowerCase()] }
    })
      .sort({ date: 1 })
      .populate('projectId', 'title status');
  }
}
