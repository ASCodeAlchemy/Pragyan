import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    totalTrips: { 
        type: Number, 
        default: 0
    }, 
    totalKilometers: { 
        type: Number, 
        default: 0
    },
    totalUsers: { 
        type: Number, 
        default: 0
    },
    totalTripPoints: { 
        type: Number, 
        default: 0
    },
    totalCO2Reduced: { 
        type: Number, 
        default: 0
    }
}, { timestamps: true });

export const Stats = mongoose.model("Stats", profileSchema);