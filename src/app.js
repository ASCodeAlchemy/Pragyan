import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
app.use(cors({ 
    origin : process.env.CORS_ORIGIN,
    credentials : true
}));
app.use(express.json({limit : '50kb'}));
app.use(express.urlencoded({extended: true,limit: '16kb'}));
app.use(express.static('public'));


app.use(cookieParser());

import userRouter from './routes/user.routes.js';

import tripRouter from './routes/trip.routes.js'

import LandingRouter from './routes/landing.routes.js'

import rewardRouter from './routes/rewards.routes.js'

import collabRouter from './routes/collab.routes.js'






app.use("/api/v1/users", userRouter);
app.use("/api/v1/users/trips", tripRouter)
app.use("/api/v1/", LandingRouter)
app.use("/api/v1/users/",rewardRouter)
app.use("/api/v1/collab",collabRouter)







export { app }; 

   