import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema({
    rewardName: { type: String, required: true },
    rewardDescription: { type: String, required: true },
    rewardValue: { type: Number, required: true },
    league: { 
        type: String, 
        enum: ['Bronze_I', 'Bronze_II', 'Bronze_III', 'Silver_I', 'Silver_II', 'Silver_III', 'Gold_I', 'Gold_II', 'Gold_III'],
        required: true 
    }
});
export const Reward = mongoose.model("Reward",rewardSchema)