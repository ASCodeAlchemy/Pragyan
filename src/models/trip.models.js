import mongoose from "mongoose";
const tripSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
     },
    startLocation:
     { 
        type: String,
         required: true
         },
    endLocation: 
    {
         type: String, 
         required: true 
        },
    distance:
     { 
        type: Number,
         required: true 
        },
    co2Reduced: {
         type: Number, 
         required: true
         },
    rewardPointsEarned: {
         type: Number,
          required: true
         },
    startLocation:
     { 
        type: String, 
        required: true
    },

    endLocation: { 
        type: String,
        required: true
    },

    startTime: { 
        type: Date,
        required: true
    }, 

    endTime: { 
        type: Date , 
        required: true
    },

    tripPoints: {
        type: Number, 
        required: true
     },
     

     


},{timestamps: true})

export const Trip = mongoose.model("Trip",tripSchema)