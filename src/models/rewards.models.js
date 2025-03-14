import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({

    name: {
         type: String,
          required: true
         },
    pointsRequired: {
         type: Number, 
         required: true 
        },
   
    description: {
         type: String
         },
    redeemedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]


},{timestamps: true})

export const Reward = mongoose.model("Reward",rewardSchema)