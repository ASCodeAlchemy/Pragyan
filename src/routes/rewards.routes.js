import { Router } from "express"; 
import { getAllRewards, getUserRewards,addReward } from "../controller/rewards.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

router.route('/myrewards').get(verifyJWT, getUserRewards);
router.route('/add').post(verifyJWT,adminMiddleware,addReward)
router.route('/all').get(getAllRewards)

export default router
