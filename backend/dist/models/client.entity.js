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
exports.ClientEntity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ClientEntitySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ]
    },
    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters'],
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Please provide a valid phone number'
        ]
    },
    totalEarned: {
        type: Number,
        default: 0,
        min: [0, 'Total earned cannot be negative']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
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
ClientEntitySchema.index({ email: 1 }, { unique: true });
ClientEntitySchema.index({ name: 1 });
ClientEntitySchema.index({ totalEarned: -1 });
ClientEntitySchema.index({ createdAt: -1 });
ClientEntitySchema.index({ name: 'text', email: 'text', notes: 'text' }); // For text search
// Virtual for client status based on totalEarned
ClientEntitySchema.virtual('status').get(function () {
    if (this.totalEarned === 0)
        return 'new';
    if (this.totalEarned < 1000)
        return 'bronze';
    if (this.totalEarned < 5000)
        return 'silver';
    if (this.totalEarned < 10000)
        return 'gold';
    return 'platinum';
});
// Virtual for formatted earnings
ClientEntitySchema.virtual('formattedEarnings').get(function () {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(this.totalEarned);
});
// Pre-save middleware for email validation and normalization
ClientEntitySchema.pre('save', function (next) {
    // Normalize email
    if (this.email) {
        this.email = this.email.toLowerCase().trim();
    }
    // Normalize phone number (remove spaces and dashes)
    if (this.phone) {
        this.phone = this.phone.replace(/[\s\-\(\)]/g, '');
    }
    next();
});
// Instance methods
ClientEntitySchema.methods.addEarnings = function (amount) {
    this.totalEarned += amount;
    return this.save();
};
ClientEntitySchema.methods.resetEarnings = function () {
    this.totalEarned = 0;
    return this.save();
};
exports.ClientEntity = mongoose_1.default.model('ClientEntity', ClientEntitySchema);
