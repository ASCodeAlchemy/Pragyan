import express from 'express';
import { claimReward  ,getAllRewards ,addReward} from '../controller/rewards.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { getAllCollab, getAllUsers } from '../controller/admin.controller.js';
import { authenticateCollaborator } from '../middlewares/authcollab.middleware.js';
import { approveForm, getAllForms, rejectForm } from '../controller/form.controller.js';
import { promoteToAdmin , demoteFromAdmin } from '../controller/admin.controller.js';
const router = express.Router();


router.post('/collaborator/login', authenticateCollaborator, (req, res) => {
    res.status(200).json({ message: 'Collaborator authenticated' });
});

router.route('/all').get(getAllRewards)
router.post('/claim', verifyJWT, claimReward);

router.route('/add').post(verifyJWT,adminMiddleware,addReward)
router.route('/getusers').get(verifyJWT,adminMiddleware,getAllUsers)
router.route('/getcollabs').get(verifyJWT,adminMiddleware,getAllCollab)
router.route('/getform').get(verifyJWT,adminMiddleware,getAllForms)
router.route('/approve/:id').post(verifyJWT,adminMiddleware,approveForm)
router.route('/reject/:id').post(verifyJWT,adminMiddleware,rejectForm)


router.route('/promote').post(verifyJWT,adminMiddleware,promoteToAdmin)
router.route('/demote').post(verifyJWT,adminMiddleware,demoteFromAdmin)



export default router;
