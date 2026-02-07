/**
 * User roles in a project
 */
export enum ProjectRole {
  OWNER = 'OWNER',
  EDIT = 'EDIT',
  VIEW = 'VIEW',
  NONE = 'NONE' // User not part of project
}

/**
 * Get user's role in a project
 */
export function getUserRoleInProject(project: any, userId: string): ProjectRole {
  if (!project || !userId) {
    return ProjectRole.NONE;
  }

  // Check if user is the owner
  const ownerId = project.projectOwner?.toString();
  if (ownerId === userId) {
    return ProjectRole.OWNER;
  }

  // Check if user is a team member
  const member = project.teamMembers?.find(
    (m: any) => m.userId?.toString() === userId
  );

  if (member) {
    // Map member role to ProjectRole enum
    const role = member.role?.toUpperCase();
    if (role === 'EDIT') return ProjectRole.EDIT;
    if (role === 'VIEW') return ProjectRole.VIEW;
    return ProjectRole.VIEW; // Default to VIEW if role is unclear
  }

  return ProjectRole.NONE;
}

/**
 * Check if user can view project
 */
export function canViewProject(role: ProjectRole): boolean {
  return role === ProjectRole.OWNER || role === ProjectRole.EDIT || role === ProjectRole.VIEW;
}

/**
 * Check if user can edit project
 */
export function canEditProject(role: ProjectRole): boolean {
  return role === ProjectRole.OWNER || role === ProjectRole.EDIT;
}

/**
 * Check if user can delete project
 */
export function canDeleteProject(role: ProjectRole): boolean {
  return role === ProjectRole.OWNER;
}

/**
 * Check if user can share/invite to project
 */
export function canShareProject(role: ProjectRole): boolean {
  return role === ProjectRole.OWNER;
}

/**
 * Check if user can mark project complete
 */
export function canCompleteProject(role: ProjectRole): boolean {
  return role === ProjectRole.OWNER || role === ProjectRole.EDIT;
}

/**
 * Check if user can manage team members
 */
export function canManageTeam(role: ProjectRole): boolean {
  return role === ProjectRole.OWNER;
}
