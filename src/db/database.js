import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_Name } from "../constants.js";
dotenv.config();

const connectDB = async () => { 
    try {
        const conn = await mongoose.connect(`${process.env.DB_URL}/${DB_Name}`, {
           
            w: 'majority' 
        });
        console.log(`MongoDB Connected DB Host : ${conn.connection.host}`);
    } catch (error) { 
        console.log(error);
    }
};

export { connectDB };
 