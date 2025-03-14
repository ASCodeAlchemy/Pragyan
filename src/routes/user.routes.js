import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { recordTrip } from "../controller/trip.controller.js";
const router = Router();

router.route('/register').post(
    async (req, res, next) => {
        try {
            await registerUser(req, res, next);
            res.status(201).send("User Registered Successfully"); 
        } catch (error) {
            res.status(500).send("Error registering user"); 
        }
    }
);

router.route('/login').post((req, res, next) => {
    console.log(`Request body: ${JSON.stringify(req.body)}`); 
    next();
}, loginUser);

router.route("/logout").post(
    verifyJWT, logoutUser)



export default router;

