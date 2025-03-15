import mongoose from "mongoose";

const dashSchema = new mongoose.Schema({

    redemtionDate: { 
        type: Date, 
        required: true,

    },

    totalTrips: { 
        type: Number,
        required: true,

    },

    redemedRewards: { 
        type: Number, 
        required: true
    },

    rewardpoints: { 
        type: Number,
        required: true
    },

 
    rewardExpiry: {
        type: Number,
        required: true
    },

  
    tier: { 
        type: String,
        enum: ["Bronze","Silver","Gold"],
        default: "Bronze"
    }, 

    tripdetails: { 
        type: mongoose.Schema.Types.ObjectId,
        ref : "Trip"
    }


})

export const Dashboard = mongoose.model("Dashboard",dashSchema)