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
exports.ProjectEntity = exports.ProjectPriority = exports.ProjectStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Simple Project entity similar to TypeORM style
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["PENDING"] = "pending";
    ProjectStatus["IN_PROGRESS"] = "in_progress";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["LOW"] = "low";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["HIGH"] = "high";
    ProjectPriority["URGENT"] = "urgent";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
const ProjectEntitySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.PENDING,
        required: true
    },
    priority: {
        type: String,
        enum: Object.values(ProjectPriority),
        default: ProjectPriority.MEDIUM,
        required: true
    },
    deadline: {
        type: Date,
        required: false
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
// Index for better performance
ProjectEntitySchema.index({ status: 1 });
ProjectEntitySchema.index({ priority: 1 });
ProjectEntitySchema.index({ createdAt: -1 });
ProjectEntitySchema.index({ deadline: 1 });
// Virtual for checking if project is overdue
ProjectEntitySchema.virtual('isOverdue').get(function () {
    return this.deadline && new Date() > this.deadline;
});
exports.ProjectEntity = mongoose_1.default.model('ProjectEntity', ProjectEntitySchema);
