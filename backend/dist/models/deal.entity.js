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
exports.DealEntity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const DealEntitySchema = new mongoose_1.Schema({
    clientId: {
        type: String,
        required: [true, 'Client ID is required'],
        index: true
    },
    title: {
        type: String,
        required: [true, 'Deal title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    value: {
        type: Number,
        required: [true, 'Deal value is required'],
        min: [0, 'Deal value cannot be negative']
    },
    currency: {
        type: String,
        required: [true, 'Currency is required'],
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        uppercase: true
    },
    stage: {
        type: String,
        required: [true, 'Deal stage is required'],
        enum: ['lead', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'],
        default: 'lead',
        index: true
    },
    probability: {
        type: Number,
        required: [true, 'Probability is required'],
        min: [0, 'Probability cannot be less than 0'],
        max: [100, 'Probability cannot be more than 100'],
        default: 10
    },
    expectedCloseDate: {
        type: Date,
        index: true
    },
    actualCloseDate: {
        type: Date
    },
    source: {
        type: String,
        required: [true, 'Lead source is required'],
        trim: true,
        maxlength: [100, 'Source cannot exceed 100 characters'],
        enum: ['website', 'referral', 'linkedin', 'upwork', 'fiverr', 'freelancer', 'cold_email', 'networking', 'other']
    },
    priority: {
        type: String,
        required: [true, 'Priority is required'],
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }],
    notes: [{
            type: String,
            trim: true,
            maxlength: [500, 'Note cannot exceed 500 characters']
        }],
    activities: [{
            type: {
                type: String,
                required: true,
                enum: ['call', 'email', 'meeting', 'note', 'task']
            },
            description: {
                type: String,
                required: true,
                trim: true,
                maxlength: [300, 'Activity description cannot exceed 300 characters']
            },
            date: {
                type: Date,
                required: true
            },
            completed: {
                type: Boolean,
                default: false
            }
        }],
    documents: [{
            type: String,
            trim: true
        }],
    lostReason: {
        type: String,
        trim: true,
        maxlength: [200, 'Lost reason cannot exceed 200 characters']
    },
    competitorInfo: {
        type: String,
        trim: true,
        maxlength: [300, 'Competitor info cannot exceed 300 characters']
    },
    nextAction: {
        action: {
            type: String,
            trim: true,
            maxlength: [200, 'Next action cannot exceed 200 characters']
        },
        dueDate: {
            type: Date
        },
        completed: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
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
DealEntitySchema.index({ clientId: 1, stage: 1 });
DealEntitySchema.index({ stage: 1, expectedCloseDate: 1 });
DealEntitySchema.index({ priority: 1, expectedCloseDate: 1 });
DealEntitySchema.index({ value: -1 });
DealEntitySchema.index({ source: 1, stage: 1 });
DealEntitySchema.index({ tags: 1 });
DealEntitySchema.index({
    title: 'text',
    description: 'text',
    tags: 'text'
}); // For text search
// Virtual for formatted value
DealEntitySchema.virtual('formattedValue').get(function () {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency
    }).format(this.value);
});
// Virtual for weighted value (value * probability)
DealEntitySchema.virtual('weightedValue').get(function () {
    return (this.value * this.probability) / 100;
});
// Virtual for formatted weighted value
DealEntitySchema.virtual('formattedWeightedValue').get(function () {
    const weightedValue = (this.value * this.probability) / 100;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.currency
    }).format(weightedValue);
});
// Virtual for stage color (for UI)
DealEntitySchema.virtual('stageColor').get(function () {
    const colors = {
        lead: '#6B7280',
        contacted: '#3B82F6',
        qualified: '#8B5CF6',
        proposal: '#F59E0B',
        negotiation: '#EF4444',
        closed_won: '#10B981',
        closed_lost: '#6B7280'
    };
    return colors[this.stage] || '#6B7280';
});
// Virtual for stage display name
DealEntitySchema.virtual('stageDisplayName').get(function () {
    const names = {
        lead: 'Lead',
        contacted: 'Contacted',
        qualified: 'Qualified',
        proposal: 'Proposal Sent',
        negotiation: 'Negotiation',
        closed_won: 'Closed Won',
        closed_lost: 'Closed Lost'
    };
    return names[this.stage] || this.stage;
});
// Virtual for priority color
DealEntitySchema.virtual('priorityColor').get(function () {
    const colors = {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444',
        urgent: '#DC2626'
    };
    return colors[this.priority] || '#6B7280';
});
// Virtual for days to close
DealEntitySchema.virtual('daysToClose').get(function () {
    if (!this.expectedCloseDate)
        return null;
    const today = new Date();
    const diffTime = this.expectedCloseDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});
// Virtual for deal age
DealEntitySchema.virtual('dealAge').get(function () {
    const today = new Date();
    const diffTime = today.getTime() - this.createdAt.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});
// Virtual for is overdue
DealEntitySchema.virtual('isOverdue').get(function () {
    if (!this.expectedCloseDate || this.stage === 'closed_won' || this.stage === 'closed_lost') {
        return false;
    }
    return this.expectedCloseDate < new Date();
});
// Pre-save middleware
DealEntitySchema.pre('save', function (next) {
    // Normalize tags
    if (this.tags) {
        this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    }
    // Auto-set probability based on stage
    if (this.isModified('stage')) {
        const stageProbabilities = {
            lead: 10,
            contacted: 20,
            qualified: 40,
            proposal: 60,
            negotiation: 80,
            closed_won: 100,
            closed_lost: 0
        };
        if (!this.isModified('probability')) {
            this.probability = stageProbabilities[this.stage] || this.probability;
        }
    }
    // Set actual close date when deal is closed
    if ((this.stage === 'closed_won' || this.stage === 'closed_lost') && !this.actualCloseDate) {
        this.actualCloseDate = new Date();
    }
    // Clear actual close date if deal is reopened
    if (this.stage !== 'closed_won' && this.stage !== 'closed_lost' && this.actualCloseDate) {
        this.actualCloseDate = undefined;
    }
    next();
});
// Instance methods
DealEntitySchema.methods.moveToStage = function (stage, probability) {
    this.stage = stage;
    if (probability !== undefined) {
        this.probability = probability;
    }
    return this.save();
};
DealEntitySchema.methods.addActivity = function (activity) {
    this.activities = this.activities || [];
    this.activities.push({
        ...activity,
        date: activity.date || new Date()
    });
    return this.save();
};
DealEntitySchema.methods.addNote = function (note) {
    this.notes = this.notes || [];
    this.notes.push(note);
    return this.save();
};
DealEntitySchema.methods.setNextAction = function (action, dueDate) {
    this.nextAction = {
        action,
        dueDate,
        completed: false
    };
    return this.save();
};
DealEntitySchema.methods.completeNextAction = function () {
    if (this.nextAction) {
        this.nextAction.completed = true;
    }
    return this.save();
};
DealEntitySchema.methods.closeWon = function () {
    return this.moveToStage('closed_won', 100);
};
DealEntitySchema.methods.closeLost = function (reason) {
    if (reason) {
        this.lostReason = reason;
    }
    return this.moveToStage('closed_lost', 0);
};
// Static methods
DealEntitySchema.statics.findByClient = function (clientId) {
    return this.find({ clientId }).sort({ updatedAt: -1 });
};
DealEntitySchema.statics.findByStage = function (stage) {
    return this.find({ stage }).sort({ expectedCloseDate: 1 });
};
DealEntitySchema.statics.findActiveDeals = function () {
    return this.find({
        stage: { $nin: ['closed_won', 'closed_lost'] }
    }).sort({ priority: 1, expectedCloseDate: 1 });
};
DealEntitySchema.statics.findOverdueDeals = function () {
    return this.find({
        stage: { $nin: ['closed_won', 'closed_lost'] },
        expectedCloseDate: { $lt: new Date() }
    }).sort({ expectedCloseDate: 1 });
};
DealEntitySchema.statics.getPipelineValue = function () {
    return this.aggregate([
        { $match: { stage: { $nin: ['closed_won', 'closed_lost'] } } },
        {
            $group: {
                _id: '$stage',
                totalValue: { $sum: '$value' },
                weightedValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id': 1 } }
    ]);
};
DealEntitySchema.statics.getConversionStats = function () {
    return this.aggregate([
        {
            $group: {
                _id: '$stage',
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id': 1 } }
    ]);
};
exports.DealEntity = mongoose_1.default.model('DealEntity', DealEntitySchema);
