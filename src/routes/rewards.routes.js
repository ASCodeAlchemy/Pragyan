import express from 'express';
import { authenticateCollaborator } from '../middlewares/authCollab.middleware.js';
import { verifyRewardToken } from '../middlewares/verify.middleware.js';
import { claimReward  ,getAllRewards ,getUserRewards,addReward,deleteReward} from '../controller/rewards.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { getAllUsers } from '../controller/admin.controller.js';
const router = express.Router();

// ✅ Route for collaborator login (protected)
router.post('/collaborator/login', authenticateCollaborator, (req, res) => {
    res.status(200).json({ message: 'Collaborator authenticated' });
});

// ✅ Route for reward claiming (protected using reward token)
router.post('/claim', verifyJWT, claimReward);
router.route('/add').post(verifyJWT,adminMiddleware,addReward)
router.route('/getusers').get(verifyJWT,adminMiddleware,getAllUsers)
export default router;
