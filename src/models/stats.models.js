import mongoose,{Schema} from "mongoose";

const profileSchema = new mongoose.Schema({

    totalUsers: {
         type: Number, 
         default: 0
         },
  totalCO2Reduced: {
     type: Number, 
     default: 0 
    },
  totalRewardsRedeemed: { 
    type: Number, 
    default: 0 
}


},{timestamps: true})

export const Profile = mongoose.model("Profile", profileSchema)