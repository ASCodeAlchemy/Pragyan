import { Router } from "express";
import { createTrip , myTrips } from "../controller/trip.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create').post(
    verifyJWT, createTrip
)

 router.route('/mytrips').get(verifyJWT , myTrips)

export default router;

   
 