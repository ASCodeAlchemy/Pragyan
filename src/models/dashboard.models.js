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

    exclusiveOffer: { 
        type: String, 
       
    },
    
    rewardExpiry: {
        type: Number,
        required: true
    },

    Ratings: { 
        type: String
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