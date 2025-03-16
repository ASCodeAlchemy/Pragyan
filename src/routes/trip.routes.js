import { Router } from "express";
import { createTrip } from "../controller/trip.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create').post(
    verifyJWT, createTrip
)

export default router;
