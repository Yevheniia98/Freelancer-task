"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePlatformService = void 0;
const axios_1 = __importDefault(require("axios"));
const project_model_1 = require("../models/project.model");
class BasePlatformService {
    constructor(platform) {
        this.platform = platform;
        this.setupHttpClient();
    }
    setupHttpClient() {
        this.httpClient = axios_1.default.create({
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'FreelancerTaskManager/1.0'
            }
        });
    }
    isConnected() {
        return this.platform.isActive && !!this.platform.accessToken;
    }
    async disconnect() {
        this.platform.isActive = false;
        this.platform.accessToken = undefined;
        this.platform.refreshToken = undefined;
    }
    mapStatusToLocal(externalStatus) {
        const statusMap = {
            'active': project_model_1.ProjectStatus.IN_PROGRESS,
            'in_progress': project_model_1.ProjectStatus.IN_PROGRESS,
            'completed': project_model_1.ProjectStatus.COMPLETED,
            'cancelled': project_model_1.ProjectStatus.CANCELLED,
            'on_hold': project_model_1.ProjectStatus.ON_HOLD,
            'draft': project_model_1.ProjectStatus.DRAFT,
            'published': project_model_1.ProjectStatus.IN_PROGRESS,
            'awarded': project_model_1.ProjectStatus.IN_PROGRESS,
            'closed': project_model_1.ProjectStatus.COMPLETED
        };
        return statusMap[externalStatus.toLowerCase()] || project_model_1.ProjectStatus.DRAFT;
    }
    mapPriorityToLocal(externalPriority) {
        if (!externalPriority)
            return project_model_1.ProjectPriority.MEDIUM;
        const priorityMap = {
            'urgent': project_model_1.ProjectPriority.HIGH,
            'high': project_model_1.ProjectPriority.HIGH,
            'medium': project_model_1.ProjectPriority.MEDIUM,
            'normal': project_model_1.ProjectPriority.MEDIUM,
            'low': project_model_1.ProjectPriority.LOW
        };
        return priorityMap[externalPriority.toLowerCase()] || project_model_1.ProjectPriority.MEDIUM;
    }
}
exports.BasePlatformService = BasePlatformService;
