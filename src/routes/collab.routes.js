import { Router } from 'express';
import { changeCollaboratorPassword, getCollaboratorProfile, loginCollaborator, logoutCollaborator, registerCollaborator, updateCollaboratorProfile, verifyReward } from '../controller/collab.controller.js';
import { refreshToken } from '../controller/token.controller.js';
import { createForm } from '../controller/form.controller.js';
import { authenticateCollaborator } from '../middlewares/authcollab.middleware.js';

const router = Router();


router.post('/register', registerCollaborator);


router.post('/login', loginCollaborator);


router.route('/logout').post(authenticateCollaborator,logoutCollaborator)


router.post('/verify', authenticateCollaborator, verifyReward);


router.post('/refresh-token', refreshToken);

router.route('/form').post(authenticateCollaborator,createForm)

router.route('/getprofile').get(authenticateCollaborator,getCollaboratorProfile)
router.route('/update').post(authenticateCollaborator, updateCollaboratorProfile)
router.route('/changepass').post(authenticateCollaborator,changeCollaboratorPassword)


export default router;
