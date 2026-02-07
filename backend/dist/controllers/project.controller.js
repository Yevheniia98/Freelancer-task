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
exports.ProjectController = void 0;
const express_validator_1 = require("express-validator");
const project_service_1 = require("../services/project.service");
const project_invitation_service_1 = require("../services/project-invitation.service");
const user_model_1 = require("../models/user.model");
class ProjectController {
    constructor() {
        /**
         * Create a new project
         */
        this.create = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const currentUserId = req.user?._id?.toString() || req.user?.id;
                if (!currentUserId) {
                    res.status(401).json({
                        success: false,
                        message: 'User not authenticated'
                    });
                    return;
                }
                const createProjectDto = {
                    title: req.body.title,
                    name: req.body.name,
                    description: req.body.description,
                    status: req.body.status,
                    priority: req.body.priority,
                    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
                    privacy: req.body.privacy,
                    category: req.body.category,
                    skills: req.body.skills,
                    teamLead: req.body.teamLead,
                    teamMembers: req.body.teamMembers
                };
                const project = await this.projectService.create(createProjectDto);
                // Set project owner - convert string back to ObjectId
                project.projectOwner = currentUserId;
                await project.save();
                res.status(201).json({
                    success: true,
                    message: 'Project created successfully',
                    data: project
                });
            }
            catch (error) {
                console.error('Create project error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to create project'
                });
            }
        };
        /**
         * Get all projects with filtering, pagination, and sorting
         */
        this.findAll = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const query = {
                    page: req.query.page ? parseInt(req.query.page) : undefined,
                    limit: req.query.limit ? parseInt(req.query.limit) : undefined,
                    status: req.query.status,
                    priority: req.query.priority,
                    search: req.query.search,
                    sortBy: req.query.sortBy,
                    sortOrder: req.query.sortOrder
                };
                const result = await this.projectService.findAll(query);
                res.json({
                    success: true,
                    message: 'Projects retrieved successfully',
                    data: result.data,
                    pagination: result.pagination
                });
            }
            catch (error) {
                console.error('Get projects error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to retrieve projects'
                });
            }
        };
        /**
         * Get project statistics
         */
        this.getStats = async (req, res) => {
            try {
                const stats = await this.projectService.getStats();
                res.json({
                    success: true,
                    message: 'Project statistics retrieved successfully',
                    data: stats
                });
            }
            catch (error) {
                console.error('Get project stats error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to retrieve project statistics'
                });
            }
        };
        /**
         * Search projects by text
         */
        this.search = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const searchTerm = req.query.q;
                const limit = req.query.limit ? parseInt(req.query.limit) : 10;
                const projects = await this.projectService.search(searchTerm, limit);
                res.json({
                    success: true,
                    message: 'Search completed successfully',
                    data: projects,
                    count: projects.length
                });
            }
            catch (error) {
                console.error('Search projects error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to search projects'
                });
            }
        };
        /**
         * Get a single project by ID
         */
        this.findById = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const project = await this.projectService.findById(req.params.id);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Get user's role in this project
                const currentUserId = req.user?._id?.toString() || req.user?.id;
                const { getUserRoleInProject } = await Promise.resolve().then(() => __importStar(require('../utils/rbac.util')));
                const userRole = getUserRoleInProject(project, currentUserId);
                res.json({
                    success: true,
                    message: 'Project retrieved successfully',
                    data: project,
                    userRole: userRole // Include user's role
                });
            }
            catch (error) {
                console.error('Get project error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to retrieve project'
                });
            }
        };
        /**
         * Update a project by ID
         */
        this.update = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                // Check user permissions
                const currentUserId = req.user?._id?.toString() || req.user?.id;
                const project = await this.projectService.findById(req.params.id);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                const { getUserRoleInProject, canEditProject } = await Promise.resolve().then(() => __importStar(require('../utils/rbac.util')));
                const userRole = getUserRoleInProject(project, currentUserId);
                if (!canEditProject(userRole)) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied. You do not have permission to edit this project.'
                    });
                    return;
                }
                const updateProjectDto = {};
                // Only include fields that were provided
                if (req.body.title !== undefined)
                    updateProjectDto.title = req.body.title;
                if (req.body.description !== undefined)
                    updateProjectDto.description = req.body.description;
                if (req.body.status !== undefined)
                    updateProjectDto.status = req.body.status;
                if (req.body.priority !== undefined)
                    updateProjectDto.priority = req.body.priority;
                if (req.body.deadline !== undefined) {
                    updateProjectDto.deadline = req.body.deadline ? new Date(req.body.deadline) : undefined;
                }
                const updatedProject = await this.projectService.update(req.params.id, updateProjectDto);
                if (!updatedProject) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Project updated successfully',
                    data: updatedProject
                });
            }
            catch (error) {
                console.error('Update project error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to update project'
                });
            }
        };
        /**
         * Bulk update project status
         */
        this.bulkUpdateStatus = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                const { ids, status } = req.body;
                const modifiedCount = await this.projectService.bulkUpdateStatus(ids, status);
                res.json({
                    success: true,
                    message: `${modifiedCount} projects updated successfully`,
                    data: { modifiedCount }
                });
            }
            catch (error) {
                console.error('Bulk update error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to bulk update projects'
                });
            }
        };
        /**
         * Delete a project by ID
         */
        this.delete = async (req, res) => {
            try {
                if (this.handleValidationErrors(req, res))
                    return;
                // Check user permissions - only OWNER can delete
                const currentUserId = req.user?._id?.toString() || req.user?.id;
                const project = await this.projectService.findById(req.params.id);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                const { getUserRoleInProject, canDeleteProject } = await Promise.resolve().then(() => __importStar(require('../utils/rbac.util')));
                const userRole = getUserRoleInProject(project, currentUserId);
                if (!canDeleteProject(userRole)) {
                    res.status(403).json({
                        success: false,
                        message: 'Access denied. Only the project owner can delete this project.'
                    });
                    return;
                }
                const deleted = await this.projectService.delete(req.params.id);
                if (!deleted) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                res.json({
                    success: true,
                    message: 'Project deleted successfully'
                });
            }
            catch (error) {
                console.error('Delete project error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to delete project'
                });
            }
        };
        /**
         * Upload file to project
         */
        this.uploadFile = async (req, res) => {
            try {
                const projectId = req.params.id;
                if (!req.file) {
                    res.status(400).json({
                        success: false,
                        message: 'No file uploaded'
                    });
                    return;
                }
                // Verify project exists
                const project = await this.projectService.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Create file information
                const fileInfo = {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size,
                    path: `/uploads/${req.file.filename}`,
                    uploadedAt: new Date(),
                    uploadedBy: req.user.id
                };
                // Add file to project's files array
                if (!project.files) {
                    project.files = [];
                }
                project.files.push(fileInfo);
                await project.save();
                res.status(200).json({
                    success: true,
                    message: 'File uploaded successfully',
                    data: fileInfo
                });
            }
            catch (error) {
                console.error('Upload file error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to upload file'
                });
            }
        };
        /**
         * Add team member to project by email (sends invitation)
         */
        this.addTeamMember = async (req, res) => {
            try {
                const projectId = req.params.id;
                const { email, permission } = req.body;
                const currentUserId = req.user.id;
                const currentUser = req.user;
                if (!email) {
                    res.status(400).json({
                        success: false,
                        message: 'Email is required'
                    });
                    return;
                }
                const project = await this.projectService.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if user is project owner
                if (project.projectOwner?.toString() !== currentUserId) {
                    res.status(403).json({
                        success: false,
                        message: 'Only project owner can add team members'
                    });
                    return;
                }
                // Check if user exists
                const invitedUser = await user_model_1.User.findOne({ email: email.toLowerCase() });
                if (!invitedUser) {
                    // User doesn't exist - add as pending member and send invitation email
                    const inviterName = currentUser.firstName && currentUser.lastName
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser.email;
                    // Add as pending team member immediately (like Figma)
                    const pendingMember = {
                        userId: null, // No userId yet since user doesn't exist
                        name: email.split('@')[0], // Use email prefix as temporary name
                        email: email.toLowerCase(),
                        role: 'Pending',
                        permission: permission || 'view_only',
                        addedAt: new Date(),
                        addedBy: currentUserId,
                        status: 'pending' // Mark as pending invitation
                    };
                    if (!project.teamMembers) {
                        project.teamMembers = [];
                    }
                    project.teamMembers.push(pendingMember);
                    await project.save();
                    // Send invitation email
                    const invitationService = project_invitation_service_1.ProjectInvitationService.getInstance();
                    const invitationSent = await invitationService.sendInvitation({
                        projectId: project.id,
                        projectName: project.title,
                        inviterName: inviterName,
                        inviterEmail: currentUser.email,
                        inviteeEmail: email,
                        permission: permission || 'view_only'
                    });
                    if (invitationSent) {
                        res.status(200).json({
                            success: true,
                            message: 'Invitation sent successfully. User will be added once they sign up and accept.',
                            pending: true,
                            data: pendingMember
                        });
                    }
                    else {
                        res.status(500).json({
                            success: false,
                            message: 'Failed to send invitation email'
                        });
                    }
                    return;
                }
                // Check if member already exists
                const existingMember = project.teamMembers?.find((member) => member.userId?.toString() === invitedUser._id.toString());
                if (existingMember) {
                    res.status(400).json({
                        success: false,
                        message: 'User is already a team member'
                    });
                    return;
                }
                // Add team member directly (user exists)
                const memberName = invitedUser.firstName && invitedUser.lastName
                    ? `${invitedUser.firstName} ${invitedUser.lastName}`
                    : invitedUser.email.split('@')[0];
                const newMember = {
                    userId: invitedUser._id,
                    name: memberName,
                    email: invitedUser.email,
                    role: 'Member',
                    permission: permission || 'view_only',
                    status: 'active',
                    addedAt: new Date(),
                    addedBy: currentUserId
                };
                if (!project.teamMembers) {
                    project.teamMembers = [];
                }
                project.teamMembers.push(newMember);
                await project.save();
                // Send notification email
                const inviterName = currentUser.firstName && currentUser.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.email;
                const invitationService = project_invitation_service_1.ProjectInvitationService.getInstance();
                await invitationService.sendInvitation({
                    projectId: project.id,
                    projectName: project.title,
                    inviterName: inviterName,
                    inviterEmail: currentUser.email,
                    inviteeEmail: email,
                    permission: permission || 'view_only'
                });
                res.status(200).json({
                    success: true,
                    message: 'Team member added successfully',
                    data: newMember
                });
            }
            catch (error) {
                console.error('Add team member error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to add team member'
                });
            }
        };
        /**
         * Update team member permission
         */
        this.updateTeamMemberPermission = async (req, res) => {
            try {
                const { projectId, memberId } = req.params;
                const { permission } = req.body;
                const currentUserId = req.user.id;
                const project = await this.projectService.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if user is project owner
                if (project.projectOwner?.toString() !== currentUserId) {
                    res.status(403).json({
                        success: false,
                        message: 'Only project owner can update permissions'
                    });
                    return;
                }
                // Find and update team member
                const member = project.teamMembers?.find((m) => m.userId.toString() === memberId);
                if (!member) {
                    res.status(404).json({
                        success: false,
                        message: 'Team member not found'
                    });
                    return;
                }
                member.permission = permission;
                await project.save();
                res.status(200).json({
                    success: true,
                    message: 'Team member permission updated successfully',
                    data: member
                });
            }
            catch (error) {
                console.error('Update team member permission error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to update permission'
                });
            }
        };
        /**
         * Remove team member from project
         */
        this.removeTeamMember = async (req, res) => {
            try {
                const { projectId, memberId } = req.params;
                const currentUserId = req.user.id;
                const project = await this.projectService.findById(projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if user is project owner
                if (project.projectOwner?.toString() !== currentUserId) {
                    res.status(403).json({
                        success: false,
                        message: 'Only project owner can remove team members'
                    });
                    return;
                }
                // Remove team member
                project.teamMembers = project.teamMembers?.filter((m) => m.userId.toString() !== memberId);
                await project.save();
                res.status(200).json({
                    success: true,
                    message: 'Team member removed successfully'
                });
            }
            catch (error) {
                console.error('Remove team member error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to remove team member'
                });
            }
        };
        /**
         * Accept project invitation
         */
        this.acceptInvitation = async (req, res) => {
            try {
                const { token } = req.body;
                const currentUserId = req.user.id;
                const invitationService = project_invitation_service_1.ProjectInvitationService.getInstance();
                const memberData = await invitationService.acceptInvitation(token, currentUserId);
                const project = await this.projectService.findById(memberData.projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                // Check if member already exists
                const existingMember = project.teamMembers?.find((member) => member.userId?.toString() === currentUserId);
                if (existingMember) {
                    res.status(400).json({
                        success: false,
                        message: 'You are already a team member of this project'
                    });
                    return;
                }
                // Add team member
                const newMember = {
                    userId: memberData.userId,
                    name: memberData.name,
                    email: memberData.email,
                    role: 'Member',
                    permission: memberData.permission,
                    addedAt: new Date(),
                    addedBy: project.projectOwner
                };
                if (!project.teamMembers) {
                    project.teamMembers = [];
                }
                project.teamMembers.push(newMember);
                await project.save();
                res.status(200).json({
                    success: true,
                    message: 'Invitation accepted successfully',
                    data: {
                        project: {
                            id: project.id,
                            title: project.title,
                            description: project.description
                        },
                        member: newMember
                    }
                });
            }
            catch (error) {
                console.error('Accept invitation error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Failed to accept invitation'
                });
            }
        };
        /**
         * Verify project invitation token
         */
        this.verifyInvitation = async (req, res) => {
            try {
                const { token } = req.params;
                const invitationService = project_invitation_service_1.ProjectInvitationService.getInstance();
                const invitation = await invitationService.verifyInvitation(token);
                const project = await this.projectService.findById(invitation.projectId);
                if (!project) {
                    res.status(404).json({
                        success: false,
                        message: 'Project not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Invitation verified successfully',
                    data: {
                        projectId: project.id,
                        projectName: project.title,
                        projectDescription: project.description,
                        email: invitation.email,
                        permission: invitation.permission
                    }
                });
            }
            catch (error) {
                console.error('Verify invitation error:', error);
                res.status(400).json({
                    success: false,
                    message: error.message || 'Invalid or expired invitation'
                });
            }
        };
        this.projectService = project_service_1.ProjectService.getInstance();
    }
    // Helper method to handle validation errors
    handleValidationErrors(req, res) {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
            return true;
        }
        return false;
    }
}
exports.ProjectController = ProjectController;
