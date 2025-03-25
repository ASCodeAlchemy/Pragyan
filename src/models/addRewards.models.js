import mongoose from "mongoose";

const addSchema = new mongoose.Schema({

    rewardId:{ 
        type:String
    },

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
        index: true 
    },

    ShopName: { 
        type:String,
        required: true
    },

    
})

export const AddReward= mongoose.model("AddReward",addSchema)