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
exports.ProjectEntity = exports.TeamMemberPermission = exports.ProjectPriority = exports.ProjectStatus = void 0;
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
var TeamMemberPermission;
(function (TeamMemberPermission) {
    TeamMemberPermission["VIEW_ONLY"] = "view";
    TeamMemberPermission["VIEW_AND_EDIT"] = "edit";
    TeamMemberPermission["OWNER"] = "owner";
})(TeamMemberPermission || (exports.TeamMemberPermission = TeamMemberPermission = {}));
const ProjectEntitySchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    name: {
        type: String,
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
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
    },
    privacy: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    skills: {
        type: [String],
        default: []
    },
    teamLead: {
        type: String,
        trim: true
    },
    teamMembers: {
        type: [{
                userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
                name: { type: String, required: true },
                email: { type: String, required: true },
                role: {
                    type: String,
                    enum: ['view', 'edit', 'owner'],
                    default: 'view',
                    required: true
                },
                status: {
                    type: String,
                    enum: ['active', 'pending'],
                    default: 'active'
                },
                addedAt: { type: Date, default: Date.now },
                addedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
            }],
        default: []
    },
    projectOwner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    files: {
        type: [{
                filename: { type: String, required: true },
                originalName: { type: String, required: true },
                path: { type: String, required: true },
                mimetype: { type: String, required: true },
                size: { type: Number, required: true },
                uploadedAt: { type: Date, default: Date.now },
                uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }
            }],
        default: []
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
