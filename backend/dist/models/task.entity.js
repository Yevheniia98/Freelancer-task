"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEntity = exports.TaskPriority = exports.TaskStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Task entity similar to TypeORM style
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["IN_REVIEW"] = "in_review";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["CANCELLED"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["LOW"] = "low";
    TaskPriority["MEDIUM"] = "medium";
    TaskPriority["HIGH"] = "high";
    TaskPriority["URGENT"] = "urgent";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
const TaskEntitySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Task description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    dueDate: {
        type: Date,
        required: false
    },
    priority: {
        type: String,
        enum: Object.values(TaskPriority),
        default: TaskPriority.MEDIUM,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.TODO,
        required: true
    },
    assigneeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    projectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProjectEntity',
        required: [true, 'Project ID is required']
    }
}, {
    timestamps: true, // This automatically adds createdAt and updatedAt
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});
// Indexes for better performance
TaskEntitySchema.index({ projectId: 1, status: 1 });
TaskEntitySchema.index({ assigneeId: 1, status: 1 });
TaskEntitySchema.index({ priority: 1, status: 1 });
TaskEntitySchema.index({ dueDate: 1 });
TaskEntitySchema.index({ createdAt: -1 });
TaskEntitySchema.index({ title: 'text', description: 'text' }); // For text search
// Virtual for checking if task is overdue
TaskEntitySchema.virtual('isOverdue').get(function () {
    return this.dueDate && new Date() > this.dueDate && this.status !== TaskStatus.COMPLETED;
});
// Virtual for checking if task is due soon (within 24 hours)
TaskEntitySchema.virtual('isDueSoon').get(function () {
    if (!this.dueDate || this.status === TaskStatus.COMPLETED)
        return false;
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return this.dueDate <= tomorrow && this.dueDate > now;
});
// Pre-save middleware
TaskEntitySchema.pre('save', function (next) {
    // Validate due date if provided
    if (this.dueDate && this.dueDate <= new Date()) {
        // Allow setting due date in the past for completed tasks
        if (this.status !== TaskStatus.COMPLETED && this.isNew) {
            const error = new Error('Due date must be in the future for new tasks');
            return next(error);
        }
    }
    next();
});
exports.TaskEntity = mongoose_1.default.model('TaskEntity', TaskEntitySchema);
