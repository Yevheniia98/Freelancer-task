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
exports.TeamInvitation = exports.InvitationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var InvitationStatus;
(function (InvitationStatus) {
    InvitationStatus["PENDING"] = "pending";
    InvitationStatus["ACCEPTED"] = "accepted";
    InvitationStatus["REJECTED"] = "rejected";
    InvitationStatus["EXPIRED"] = "expired";
})(InvitationStatus || (exports.InvitationStatus = InvitationStatus = {}));
const teamInvitationSchema = new mongoose_1.Schema({
    inviteEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    inviteeName: {
        type: String,
        required: true,
        trim: true
    },
    inviterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inviteeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    token: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(InvitationStatus),
        default: InvitationStatus.PENDING
    },
    expiresAt: {
        type: Date,
        required: true
    },
    acceptedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    collection: 'team_invitations'
});
// Indexes for better performance
teamInvitationSchema.index({ inviteEmail: 1, inviterId: 1 });
teamInvitationSchema.index({ token: 1 });
teamInvitationSchema.index({ expiresAt: 1 });
teamInvitationSchema.index({ status: 1 });
exports.TeamInvitation = mongoose_1.default.model('TeamInvitation', teamInvitationSchema);
