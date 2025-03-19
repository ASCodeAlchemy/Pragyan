import { Router } from "express"; 
import { getAllRewards, getUserRewards, addReward, deleteReward, claimReward } from "../controller/rewards.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";


const router = Router();

router.route('/claim').post(verifyJWT,claimReward)
router.route('/myrewards').get(verifyJWT, getUserRewards);
router.route('/add').post(verifyJWT,adminMiddleware,addReward)
router.route('/all').get(getAllRewards)
router.route('/delete').delete(verifyJWT,adminMiddleware,deleteReward)


export default router
