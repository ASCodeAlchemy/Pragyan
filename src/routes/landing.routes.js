import { Router } from "express";
import { getStats } from "../controller/stats.controller.js";


const router = Router();

router.route('/stats').get(getStats)

export default router;