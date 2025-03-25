import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const collaboratorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
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
    type: {
        type: String,
        enum: ['collaborator'],
        default: 'collaborator'
    },
    status: { 
        type: String,
         enum: ['active', 'inactive'],
          default: 'active'
         },

         rewardsVerified: { type: Number, default: 0 },
         totalUsersVerified: { type: Number, default: 0 },
    
}, { timestamps: true, collection: 'collaborators' });

// ✅ Hash password before saving
collaboratorSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// ✅ Compare password for login
collaboratorSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// ✅ Generate Access Token with role
collaboratorSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.COLLAB_ACCESS_TOKEN_SECRET, // ✅ Use the correct secret here
        { expiresIn: process.env.COLLAB_ACCESS_TOKEN_EXPIRY }
    );
};

// ✅ Generate Refresh Token
collaboratorSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const Collaborator = mongoose.model("Collaborator", collaboratorSchema);


