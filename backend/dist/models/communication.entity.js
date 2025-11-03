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
exports.CommunicationEntity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CommunicationEntitySchema = new mongoose_1.Schema({
    clientId: {
        type: String,
        required: [true, 'Client ID is required'],
        index: true
    },
    type: {
        type: String,
        required: [true, 'Communication type is required'],
        enum: ['email', 'call', 'meeting', 'chat', 'note'],
        index: true
    },
    direction: {
        type: String,
        required: [true, 'Communication direction is required'],
        enum: ['inbound', 'outbound']
    },
    subject: {
        type: String,
        trim: true,
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
        maxlength: [5000, 'Content cannot exceed 5000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Communication date is required'],
        index: true
    },
    duration: {
        type: Number,
        min: [0, 'Duration cannot be negative'],
        max: [1440, 'Duration cannot exceed 24 hours'] // 24 hours in minutes
    },
    platform: {
        type: String,
        trim: true,
        maxlength: [50, 'Platform cannot exceed 50 characters']
    },
    attachments: [{
            type: String,
            trim: true
        }],
    tags: [{
            type: String,
            trim: true,
            maxlength: [30, 'Tag cannot exceed 30 characters']
        }],
    isImportant: {
        type: Boolean,
        default: false
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
CommunicationEntitySchema.index({ clientId: 1, date: -1 });
CommunicationEntitySchema.index({ type: 1, date: -1 });
CommunicationEntitySchema.index({ isImportant: 1, date: -1 });
CommunicationEntitySchema.index({ tags: 1 });
CommunicationEntitySchema.index({
    subject: 'text',
    content: 'text',
    tags: 'text'
}); // For text search
// Virtual for formatted date
CommunicationEntitySchema.virtual('formattedDate').get(function () {
    return this.date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
});
// Virtual for communication summary
CommunicationEntitySchema.virtual('summary').get(function () {
    const maxLength = 100;
    return this.content.length > maxLength
        ? this.content.substring(0, maxLength) + '...'
        : this.content;
});
// Virtual for duration display
CommunicationEntitySchema.virtual('formattedDuration').get(function () {
    if (!this.duration)
        return null;
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
});
// Pre-save middleware
CommunicationEntitySchema.pre('save', function (next) {
    // Normalize tags
    if (this.tags) {
        this.tags = this.tags.map(tag => tag.toLowerCase().trim()).filter(tag => tag.length > 0);
    }
    // Set default subject for certain types
    if (!this.subject) {
        switch (this.type) {
            case 'call':
                this.subject = `${this.direction === 'inbound' ? 'Incoming' : 'Outgoing'} call`;
                break;
            case 'meeting':
                this.subject = 'Meeting';
                break;
            case 'chat':
                this.subject = 'Chat conversation';
                break;
            case 'note':
                this.subject = 'Note';
                break;
        }
    }
    next();
});
// Static methods
CommunicationEntitySchema.statics.findByClient = function (clientId) {
    return this.find({ clientId }).sort({ date: -1 });
};
CommunicationEntitySchema.statics.findByType = function (type) {
    return this.find({ type }).sort({ date: -1 });
};
CommunicationEntitySchema.statics.findImportant = function () {
    return this.find({ isImportant: true }).sort({ date: -1 });
};
exports.CommunicationEntity = mongoose_1.default.model('CommunicationEntity', CommunicationEntitySchema);
