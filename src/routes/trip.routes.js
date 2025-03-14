import { Router } from "express";
import { recordTrip } from "../controller/trip.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route('/api/v1/users/trip').post(
    verifyJWT, recordTrip
)

export default router;
