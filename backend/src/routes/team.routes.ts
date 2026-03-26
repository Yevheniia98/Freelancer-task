import { Router, Request, Response } from 'express';
import { TeamManagementService } from '../services/team-management.service';
import { authMiddleware } from '../middleware/auth.middleware';
import mongoose from 'mongoose';

const router = Router();
const teamService = new TeamManagementService();

// Send team invitation
router.post('/invite', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    const result = await teamService.sendInvitation(userId, email, name);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Invitation sent successfully',
      inviteUrl: result.inviteUrl,
      invitation: {
        id: result.invitation?._id,
        email: result.invitation?.inviteEmail,
        name: result.invitation?.inviteeName,
        expiresAt: result.invitation?.expiresAt
      }
    });

  } catch (error: any) {
    console.error('Error sending invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Validate invitation token (public endpoint)
router.get('/invite/validate/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const result = await teamService.validateInvitationToken(token);

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: result.error || 'Invalid invitation'
      });
    }

    res.json({
      success: true,
      invitation: result.invitation
    });

  } catch (error: any) {
    console.error('Error validating invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Accept invitation and create account (public endpoint)
router.post('/invite/accept', async (req: Request, res: Response) => {
  try {
    const { token, email, password, firstName, lastName } = req.body;

    if (!token || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const result = await teamService.acceptInvitation(token, {
      email,
      password,
      firstName,
      lastName
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Account created and invitation accepted successfully',
      user: {
        id: result.user?._id,
        email: result.user?.email,
        firstName: result.user?.firstName,
        lastName: result.user?.lastName
      }
    });

  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept invitation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get team members
router.get('/members', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const members = await teamService.getTeamMembers(userId);

    res.json({
      success: true,
      count: members.length,
      members
    });

  } catch (error: any) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create team member directly (manual add)
router.post('/members', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { name, email, phone, role, gender, payment, currentProject, skills } = req.body;

    console.log('📝 Create team member request:', {
      userId,
      body: req.body,
      name,
      email
    });

    if (!name || !email) {
      console.log('❌ Validation failed: name or email missing');
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const result = await teamService.createTeamMember(userId, {
      name,
      email,
      phone,
      role,
      gender,
      payment,
      currentProject,
      skills
    });

    console.log('📝 Create team member result:', result);

    if (!result.success) {
      console.log('❌ Create team member failed:', result.error);
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Team member added successfully',
      member: result.member
    });

  } catch (error: any) {
    console.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create team member',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Search team members
router.get('/members/search', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const members = await teamService.searchTeamMembers(userId, q);

    res.json({
      success: true,
      count: members.length,
      members
    });

  } catch (error: any) {
    console.error('Error searching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search team members',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Remove team member
router.delete('/members/:memberId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user._id;
    const { memberId } = req.params;

    console.log('🗑️  Remove team member request:', {
      ownerId,
      memberId
    });

    if (!memberId) {
      console.log('❌ Member ID is missing');
      return res.status(400).json({
        success: false,
        message: 'Member ID is required'
      });
    }

    // The memberId from frontend is the TeamMember document's _id
    // We need to use removeByTeamMemberId instead
    const result = await teamService.removeByTeamMemberId(ownerId, new mongoose.Types.ObjectId(memberId));

    console.log('🗑️  Remove team member result:', result);

    if (!result.success) {
      console.log('❌ Remove failed:', result.error);
      return res.status(400).json(result);
    }

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error: any) {
    console.error('Error removing team member:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove team member',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get pending invitations
router.get('/invitations/pending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const invitations = await teamService.getPendingInvitations(userId);

    res.json({
      success: true,
      count: invitations.length,
      invitations: invitations.map(inv => ({
        id: inv._id,
        email: inv.inviteEmail,
        name: inv.inviteeName,
        status: inv.status,
        expiresAt: inv.expiresAt,
        createdAt: inv.createdAt
      }))
    });

  } catch (error: any) {
    console.error('Error fetching pending invitations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending invitations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
