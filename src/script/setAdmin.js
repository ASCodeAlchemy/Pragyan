import mongoose from "mongoose";
import { User } from "../models/users.models.js";

import dotenv from "dotenv";

dotenv.config()

const makeAdmin = async () => {
    try {
     
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const result = await User.updateOne(
            { email: 'ads@204' },
            { $set: { isAdmin: true } }
        );

        console.log('User updated:', result);
        mongoose.connection.close(); 
    } catch (error) {
        console.error('Error updating user:', error);
    }
};

makeAdmin();