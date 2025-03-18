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
    rewardName: {
        type: String,
        required: true
    },
    rewardDescription: {
        type: String,
        required: true
    },
    rewardValue: {
        type: Number,
        required: true
    },
  
},{timestamps: true})

export const Reward = mongoose.model("Reward",rewardSchema)