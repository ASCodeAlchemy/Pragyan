import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const LEAGUES = [
  'Bronze_I', 'Bronze_II', 'Bronze_III', 
  'Silver_I', 'Silver_II', 'Silver_III', 
  'Gold_I', 'Gold_II', 'Gold_III'
];

const rewardSchema = new mongoose.Schema({
    rewardName: { type: String, required: true },
    rewardDescription: { type: String },
    rewardValue: { type: Number, required: true }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    totalTrips: {
        type: Number,
        default: 0
    },
    TripPoints: {
        type: Number,
        default: 0
    },
    currentLeague: {
        type: String,
        enum: LEAGUES,
        default: 'Bronze_III'
    },
    myRewards: [rewardSchema],

    isAdmin: { 
        type: Boolean,
        default : false
     },

     rewardClaimed: { 
        type: String, 
        default: 0 },

        totalCO2Reduced:{
            type: Number,
            default :0
         },

         totalKM:{
            type: String,
            default :0
          },

          role: {
            type: String,
            enum: ['user', 'collaborator', 'admin'],
            default: 'user',
        },

        Rank : { 
            type: Number,
            default : 0
        },

        lastTripPoints: {
            type: Number ,
            default : 0
        } ,

      
        lastClaimedToken: { // Add this field
            type: Number,
            default: null
        }
},{timestamps: true})

userSchema.pre("save",async function(next){ 
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){ 
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            firstname: this.firstname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({ 
       _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
 )
}

export const User = mongoose.model("User",userSchema)

