import { Router } from 'express';
import { loginCollaborator, logoutCollaborator, registerCollaborator, verifyReward } from '../controller/collab.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { refreshToken } from '../controller/token.controller.js';
import { createForm } from '../controller/form.controller.js';
import { authenticateCollaborator } from '../middlewares/authcollab.middleware.js';

const router = Router();

// ✅ Register Collaborator
router.post('/register', registerCollaborator);

// ✅ Login Collaborator
router.post('/login', loginCollaborator);

// ✅ Logout Collaborator
router.route('/logout').post(authenticateCollaborator,logoutCollaborator)

// ✅ Verify Reward (Only for collaborators)
router.post('/verify', authenticateCollaborator, verifyReward);

// ✅ Refresh Token
router.post('/refresh-token', refreshToken);

router.route('/form').post(authenticateCollaborator,createForm)



export default router;
