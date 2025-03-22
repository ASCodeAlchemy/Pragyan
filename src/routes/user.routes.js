import { Router } from "express";
import { loginUserHandler, registerUserHandler, logoutUser, changePassword, getCurrentUser, accountDetails, getUserProfile } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { dashboard } from "../controller/dashboard.controller.js";
import { getLeaderboard } from '../controller/leaderboard.controller.js'

const router = Router();

router.route('/register').post(registerUserHandler);

// Secure Routes

router.route('/login').post((req, res, next) => {
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    next();
}, loginUserHandler);

router.route("/logout").post(verifyJWT, logoutUser);

router.route('/changepassword').post(verifyJWT, changePassword);

router.route('/getuser').post(verifyJWT, getCurrentUser);
router.route('/changedetails').post(verifyJWT, accountDetails);
router.route('/profile').get(verifyJWT, getUserProfile);

router.route('/dashboard').get(verifyJWT,dashboard)

router.route('/leaderboard').get(verifyJWT,getLeaderboard)

export default router;