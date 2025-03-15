import { Router } from "express";
import { loginUser,
     registerUser,
      logoutUser,
       changePassword,
        getCurrentUser,
        accountDetails, 
        getUserProfile} from "../controller/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/register').post(
    async (req, res, next) => {
        try {
            await registerUser(req, res, next);
            return res.status(201).send("User Registered Successfully"); 
        } catch (error) {
            if (error.name === 'MongoWriteConcernError') {
                console.error("MongoWriteConcernError:", error.message);
                return res.status(500).send("Database write concern error");
            }
            res.status(500).send("Error registering user"); 
        }
    }
);

// Secure Routes

router.route('/login').post((req, res, next) => {
    console.log(`Request body: ${JSON.stringify(req.body)}`); 
    next();
}, loginUser);

router.route("/logout").post(
    verifyJWT, logoutUser)

router.route('/changepassword').post(
    verifyJWT, async (req, res, next) => {
        try {
            await changePassword(req, res, next);
            return res.status(200).send("Password changed successfully");
        } catch (error) {
            if (error.name === 'MongoWriteConcernError') {
                console.error("MongoWriteConcernError:", error.message);
                return res.status(500).send("Database write concern error");
            }
            res.status(500).send("Error changing password");
        }
    }
) 

router.route('/getuser').post(verifyJWT, getCurrentUser)
router.route('/changedetails').post(verifyJWT,accountDetails)
router.route('/profile').get(verifyJWT,getUserProfile)

export default router;