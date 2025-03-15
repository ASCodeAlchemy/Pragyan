
import userRoutes from './routes/user.routes.js';
import tripRoutes from './routes/trip.routes.js';
import { app } from "./app.js";
import { connectDB } from "./db/database.js";

import dotenv from 'dotenv';
dotenv.config();

connectDB()
.then(() => {
    app.use('/api/users', userRoutes);
    app.use('/api/trips', tripRoutes);

    app.listen(process.env.PORT , () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});
