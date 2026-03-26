"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_invite_controller_1 = require("../controllers/project-invite.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const permissions_middleware_1 = require("../middleware/permissions.middleware");
const router = (0, express_1.Router)();
const inviteController = new project_invite_controller_1.ProjectInviteController();
// Send invitation (simpler endpoint for frontend)
router.post('/invites/send', auth_middleware_1.authMiddleware, inviteController.createInvite);
// Create invite (owner only) - original endpoint
router.post('/projects/:id/invite', auth_middleware_1.authMiddleware, permissions_middleware_1.requireOwner, inviteController.createInvite);
// Accept invite (authenticated user)
router.get('/invites/accept', auth_middleware_1.authMiddleware, inviteController.acceptInvite);
exports.default = router;
