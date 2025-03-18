import mongoose from "mongoose";

const LEAGUES = [
  'Bronze_I', 'Bronze_II', 'Bronze_III', 
  'Silver_I', 'Silver_II', 'Silver_III', 
  'Gold_I', 'Gold_II', 'Gold_III'
];

const dashboardSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    totalTrips: { 
        type: Number,
        default: 0
    },
    totalPoints: { 
        type: Number,
        default: 0
    },
    currentLeague: { 
        type: String,
        enum: LEAGUES
    }
})

export const Dashboard = mongoose.model("Dashboard",dashboardSchema)