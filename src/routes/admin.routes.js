import { Router } from "express";
import { getAllUsers, promoteToAdmin } from "../controller/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { addReward } from "../models/addRewards.models.js";
import { getAllForms } from "../controller/form.controller.js";

const router = new Router()

router.route('/promote').post(verifyJWT,adminMiddleware,promoteToAdmin)


router.route('/getform').get(verifyJWT,adminMiddleware,getAllForms)


export default router