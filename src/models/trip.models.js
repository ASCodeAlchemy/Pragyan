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
    kilometers:
     { 
        type: Number,
         required: true 
        },

    tripPoints: {
        type: Number, 
        default : 0
     },

     Date : { 
        type : Date, 
        default : Date.now()
     }
},{timestamps: true})

export const Trip = mongoose.model("Trip",tripSchema)

  