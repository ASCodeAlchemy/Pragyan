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
        type : String


    }
})

export const AddReward= mongoose.model("AddReward",addSchema)