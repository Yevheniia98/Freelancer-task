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
exports.Project = exports.ProjectType = exports.ProjectPriority = exports.ProjectStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "draft";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["IN_PROGRESS"] = "in_progress";
    ProjectStatus["ON_HOLD"] = "on_hold";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
    ProjectStatus["ARCHIVED"] = "archived";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectPriority;
(function (ProjectPriority) {
    ProjectPriority["LOW"] = "low";
    ProjectPriority["MEDIUM"] = "medium";
    ProjectPriority["HIGH"] = "high";
    ProjectPriority["URGENT"] = "urgent";
})(ProjectPriority || (exports.ProjectPriority = ProjectPriority = {}));
var ProjectType;
(function (ProjectType) {
    ProjectType["INTERNAL"] = "internal";
    ProjectType["CLIENT"] = "client";
    ProjectType["FREELANCE"] = "freelance";
    ProjectType["EXTERNAL"] = "external";
})(ProjectType || (exports.ProjectType = ProjectType = {}));
const BudgetSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    type: { type: String, enum: ['fixed', 'hourly'], required: true },
    spent: { type: Number, default: 0, min: 0 },
    remaining: { type: Number, min: 0 }
});
const ClientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String },
    company: { type: String },
    rating: { type: Number, min: 0, max: 5 },
    country: { type: String },
    platformId: { type: String },
    platform: { type: String }
});
const ExternalSourceSchema = new mongoose_1.Schema({
    platform: { type: String, required: true },
    externalId: { type: String, required: true },
    url: { type: String, required: true },
    lastSynced: { type: Date, default: Date.now },
    syncStatus: {
        type: String,
        enum: ['pending', 'synced', 'error'],
        default: 'pending'
    },
    syncError: { type: String }
});
const ProjectSchema = new mongoose_1.Schema({
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
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    status: {
        type: String,
        enum: Object.values(ProjectStatus),
        default: ProjectStatus.DRAFT,
        required: true
    },
    priority: {
        type: String,
        enum: Object.values(ProjectPriority),
        default: ProjectPriority.MEDIUM,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(ProjectType),
        default: ProjectType.INTERNAL,
        required: true
    },
    budget: {
        type: BudgetSchema,
        required: true
    },
    client: {
        type: ClientSchema,
        required: true
    },
    startDate: { type: Date },
    endDate: { type: Date },
    deadline: { type: Date },
    assignedTo: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    teamMembers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    skills: [{
            type: String,
            trim: true
        }],
    tags: [{
            type: String,
            trim: true
        }],
    externalSource: ExternalSourceSchema,
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes for better query performance
ProjectSchema.index({ userId: 1, status: 1 });
ProjectSchema.index({ 'externalSource.platform': 1, 'externalSource.externalId': 1 });
ProjectSchema.index({ deadline: 1 });
ProjectSchema.index({ priority: 1, status: 1 });
ProjectSchema.index({ skills: 1 });
ProjectSchema.index({ tags: 1 });
ProjectSchema.index({ createdAt: -1 });
// Virtual for calculating budget remaining
ProjectSchema.virtual('budgetRemaining').get(function () {
    if (this.budget.type === 'fixed') {
        return Math.max(0, this.budget.amount - (this.budget.spent || 0));
    }
    return null;
});
// Virtual for project duration
ProjectSchema.virtual('duration').get(function () {
    if (this.startDate && this.endDate) {
        return Math.ceil((this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return null;
});
// Pre-save middleware
ProjectSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.lastModifiedBy = this.userId;
    }
    // Calculate remaining budget for fixed projects
    if (this.budget.type === 'fixed') {
        this.budget.remaining = Math.max(0, this.budget.amount - (this.budget.spent || 0));
    }
    next();
});
// Methods
ProjectSchema.methods.isOverdue = function () {
    return this.deadline && new Date() > this.deadline;
};
ProjectSchema.methods.isOverBudget = function () {
    return this.budget.type === 'fixed' && (this.budget.spent || 0) > this.budget.amount;
};
ProjectSchema.methods.getProgress = function () {
    // This would be calculated based on tasks/milestones completion
    // For now, return a simple status-based progress
    const progressMap = {
        [ProjectStatus.DRAFT]: 0,
        [ProjectStatus.ACTIVE]: 10,
        [ProjectStatus.IN_PROGRESS]: 50,
        [ProjectStatus.ON_HOLD]: 50,
        [ProjectStatus.COMPLETED]: 100,
        [ProjectStatus.CANCELLED]: 0,
        [ProjectStatus.ARCHIVED]: 100
    };
    return progressMap[this.status] || 0;
};
exports.Project = mongoose_1.default.model('Project', ProjectSchema);
