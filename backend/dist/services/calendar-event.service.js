"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarEventService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const calendar_event_entity_1 = require("../models/calendar-event.entity");
class CalendarEventService {
    static getInstance() {
        if (!CalendarEventService.instance) {
            CalendarEventService.instance = new CalendarEventService();
        }
        return CalendarEventService.instance;
    }
    // Create a new calendar event
    async create(eventData) {
        try {
            // Convert string date to Date object if needed
            const processedData = {
                ...eventData,
                date: typeof eventData.date === 'string' ? new Date(eventData.date) : eventData.date,
                projectId: eventData.projectId ? new mongoose_1.default.Types.ObjectId(eventData.projectId) : undefined
            };
            const event = new calendar_event_entity_1.CalendarEventEntity(processedData);
            return await event.save();
        }
        catch (error) {
            throw error;
        }
    }
    // Find all calendar events with filtering, pagination, and sorting
    async findAll(options = {}) {
        const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'asc', search, eventType, projectId, isCompleted, startDate, endDate, reminder, location, hasAttendees } = options;
        // Build query
        const query = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (eventType) {
            query.eventType = eventType;
        }
        if (projectId) {
            if (mongoose_1.default.Types.ObjectId.isValid(projectId)) {
                query.projectId = new mongoose_1.default.Types.ObjectId(projectId);
            }
            else {
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
            }
            else {
                query.$or = [
                    { attendees: { $exists: false } },
                    { attendees: { $size: 0 } }
                ];
            }
        }
        // Calculate skip value
        const skip = (page - 1) * limit;
        // Sort configuration
        const sortConfig = {};
        sortConfig[sortBy] = sortOrder === 'asc' ? 1 : -1;
        // Execute queries
        const [events, total] = await Promise.all([
            calendar_event_entity_1.CalendarEventEntity.find(query)
                .populate('projectId', 'title status')
                .sort(sortConfig)
                .skip(skip)
                .limit(limit)
                .exec(),
            calendar_event_entity_1.CalendarEventEntity.countDocuments(query)
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
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid calendar event ID format');
        }
        return await calendar_event_entity_1.CalendarEventEntity.findById(id).populate('projectId', 'title status');
    }
    // Find events by project ID
    async findByProjectId(projectId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            throw new Error('Invalid project ID format');
        }
        return await calendar_event_entity_1.CalendarEventEntity.find({ projectId: new mongoose_1.default.Types.ObjectId(projectId) })
            .sort({ date: 1 })
            .populate('projectId', 'title status');
    }
    // Update calendar event
    async update(id, updateData) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid calendar event ID format');
        }
        const processedData = { ...updateData };
        // Convert string date to Date object if needed
        if (processedData.date) {
            processedData.date = typeof processedData.date === 'string' ? new Date(processedData.date) : processedData.date;
        }
        // Convert projectId string to ObjectId if provided
        if (processedData.projectId) {
            if (mongoose_1.default.Types.ObjectId.isValid(processedData.projectId)) {
                processedData.projectId = new mongoose_1.default.Types.ObjectId(processedData.projectId);
            }
            else {
                throw new Error('Invalid project ID format');
            }
        }
        return await calendar_event_entity_1.CalendarEventEntity.findByIdAndUpdate(id, processedData, { new: true, runValidators: true }).populate('projectId', 'title status');
    }
    // Delete calendar event
    async delete(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid calendar event ID format');
        }
        return await calendar_event_entity_1.CalendarEventEntity.findByIdAndDelete(id);
    }
    // Mark event as completed
    async markCompleted(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid calendar event ID format');
        }
        return await calendar_event_entity_1.CalendarEventEntity.findByIdAndUpdate(id, { isCompleted: true }, { new: true }).populate('projectId', 'title status');
    }
    // Mark event as incomplete
    async markIncomplete(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid calendar event ID format');
        }
        return await calendar_event_entity_1.CalendarEventEntity.findByIdAndUpdate(id, { isCompleted: false }, { new: true }).populate('projectId', 'title status');
    }
    // Reschedule event
    async reschedule(id, newDate) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid calendar event ID format');
        }
        const date = typeof newDate === 'string' ? new Date(newDate) : newDate;
        return await calendar_event_entity_1.CalendarEventEntity.findByIdAndUpdate(id, { date }, { new: true, runValidators: true }).populate('projectId', 'title status');
    }
    // Get upcoming events
    async getUpcomingEvents(days = 7) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + days);
        return await calendar_event_entity_1.CalendarEventEntity.find({
            date: { $gte: now, $lte: futureDate },
            isCompleted: false
        })
            .sort({ date: 1 })
            .populate('projectId', 'title status');
    }
    // Get overdue events
    async getOverdueEvents() {
        const now = new Date();
        return await calendar_event_entity_1.CalendarEventEntity.find({
            date: { $lt: now },
            isCompleted: false
        })
            .sort({ date: -1 })
            .populate('projectId', 'title status');
    }
    // Get events for today
    async getTodayEvents() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        return await calendar_event_entity_1.CalendarEventEntity.find({
            date: { $gte: startOfDay, $lt: endOfDay }
        })
            .sort({ date: 1 })
            .populate('projectId', 'title status');
    }
    // Get events for a specific date range
    async getEventsInRange(startDate, endDate) {
        const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
        const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
        return await calendar_event_entity_1.CalendarEventEntity.find({
            date: { $gte: start, $lte: end }
        })
            .sort({ date: 1 })
            .populate('projectId', 'title status');
    }
    // Get calendar event statistics
    async getStats() {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const [totalEvents, completedEvents, upcomingEvents, overdueEvents, todayEvents, eventsByType, eventsByMonth] = await Promise.all([
            calendar_event_entity_1.CalendarEventEntity.countDocuments({}),
            calendar_event_entity_1.CalendarEventEntity.countDocuments({ isCompleted: true }),
            calendar_event_entity_1.CalendarEventEntity.countDocuments({ date: { $gte: now }, isCompleted: false }),
            calendar_event_entity_1.CalendarEventEntity.countDocuments({ date: { $lt: now }, isCompleted: false }),
            calendar_event_entity_1.CalendarEventEntity.countDocuments({ date: { $gte: startOfDay, $lt: endOfDay } }),
            calendar_event_entity_1.CalendarEventEntity.aggregate([
                { $group: { _id: '$eventType', count: { $sum: 1 } } }
            ]),
            calendar_event_entity_1.CalendarEventEntity.aggregate([
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
        const eventTypeStats = {};
        Object.values(calendar_event_entity_1.EventType).forEach(type => {
            eventTypeStats[type] = 0;
        });
        eventsByType.forEach((item) => {
            if (Object.values(calendar_event_entity_1.EventType).includes(item._id)) {
                eventTypeStats[item._id] = item.count;
            }
        });
        // Format monthly stats
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const monthlyStats = eventsByMonth.map((item) => ({
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
    async search(searchTerm, options = {}) {
        const { limit = 10 } = options;
        return await calendar_event_entity_1.CalendarEventEntity.find({ $text: { $search: searchTerm } }, { score: { $meta: 'textScore' } })
            .populate('projectId', 'title status')
            .sort({ score: { $meta: 'textScore' } })
            .limit(limit)
            .exec();
    }
    // Get events requiring reminders
    async getEventsNeedingReminders() {
        const now = new Date();
        return await calendar_event_entity_1.CalendarEventEntity.find({
            date: { $gte: now },
            isCompleted: false,
            reminder: { $ne: calendar_event_entity_1.ReminderType.NONE }
        })
            .sort({ date: 1 })
            .populate('projectId', 'title status');
    }
    // Bulk update event status
    async bulkUpdateStatus(eventIds, isCompleted) {
        const objectIds = eventIds.map(id => {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error(`Invalid event ID: ${id}`);
            }
            return new mongoose_1.default.Types.ObjectId(id);
        });
        await calendar_event_entity_1.CalendarEventEntity.updateMany({ _id: { $in: objectIds } }, { isCompleted });
    }
    // Get events by attendee email
    async findByAttendee(email) {
        return await calendar_event_entity_1.CalendarEventEntity.find({
            attendees: { $in: [email.toLowerCase()] }
        })
            .sort({ date: 1 })
            .populate('projectId', 'title status');
    }
}
exports.CalendarEventService = CalendarEventService;
