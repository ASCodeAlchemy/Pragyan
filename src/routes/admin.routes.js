import { Router } from "express";
import { promoteToAdmin } from "../controller/admin.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = new Router()

router.route('/promote').post(verifyJWT,adminMiddleware,promoteToAdmin)

export default router