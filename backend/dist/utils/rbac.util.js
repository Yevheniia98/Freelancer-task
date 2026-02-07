"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectRole = void 0;
exports.getUserRoleInProject = getUserRoleInProject;
exports.canViewProject = canViewProject;
exports.canEditProject = canEditProject;
exports.canDeleteProject = canDeleteProject;
exports.canShareProject = canShareProject;
exports.canCompleteProject = canCompleteProject;
exports.canManageTeam = canManageTeam;
/**
 * User roles in a project
 */
var ProjectRole;
(function (ProjectRole) {
    ProjectRole["OWNER"] = "OWNER";
    ProjectRole["EDIT"] = "EDIT";
    ProjectRole["VIEW"] = "VIEW";
    ProjectRole["NONE"] = "NONE"; // User not part of project
})(ProjectRole || (exports.ProjectRole = ProjectRole = {}));
/**
 * Get user's role in a project
 */
function getUserRoleInProject(project, userId) {
    if (!project || !userId) {
        return ProjectRole.NONE;
    }
    // Check if user is the owner
    const ownerId = project.projectOwner?.toString();
    if (ownerId === userId) {
        return ProjectRole.OWNER;
    }
    // Check if user is a team member
    const member = project.teamMembers?.find((m) => m.userId?.toString() === userId);
    if (member) {
        // Map member role to ProjectRole enum
        const role = member.role?.toUpperCase();
        if (role === 'EDIT')
            return ProjectRole.EDIT;
        if (role === 'VIEW')
            return ProjectRole.VIEW;
        return ProjectRole.VIEW; // Default to VIEW if role is unclear
    }
    return ProjectRole.NONE;
}
/**
 * Check if user can view project
 */
function canViewProject(role) {
    return role === ProjectRole.OWNER || role === ProjectRole.EDIT || role === ProjectRole.VIEW;
}
/**
 * Check if user can edit project
 */
function canEditProject(role) {
    return role === ProjectRole.OWNER || role === ProjectRole.EDIT;
}
/**
 * Check if user can delete project
 */
function canDeleteProject(role) {
    return role === ProjectRole.OWNER;
}
/**
 * Check if user can share/invite to project
 */
function canShareProject(role) {
    return role === ProjectRole.OWNER;
}
/**
 * Check if user can mark project complete
 */
function canCompleteProject(role) {
    return role === ProjectRole.OWNER || role === ProjectRole.EDIT;
}
/**
 * Check if user can manage team members
 */
function canManageTeam(role) {
    return role === ProjectRole.OWNER;
}
