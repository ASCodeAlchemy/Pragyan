import mongoose from "mongoose";

const addSchema = new mongoose.Schema({

    rewardName: { 
        type : String

    },
    rewardDescription: { 
        type : String

    },
    rewardValue: { 
        type : Number

    },
    leagueRequirement:{ 
        type : String,
        index: true // Add index for faster querying
    }

    
})

export const AddReward= mongoose.model("AddReward",addSchema)