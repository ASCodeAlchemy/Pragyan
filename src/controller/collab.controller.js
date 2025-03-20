import { Collab } from "../models/collab.models.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ApiError } from "../utilis/ApiError.js";
import { ApiResponse } from "../utilis/ApiResponse.js";


const generateAccessAndRefreshTokens = async(collabId) => {
    try {
        console.log("Generating tokens for user:", collabId);
        const accessToken = jwt.sign({ _id: collabId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = jwt.sign({ _id: collabId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
        console.log("Tokens generated successfully");
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw error;
    }
}

const registerCollaborator = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingCollaborator = await Collab.findOne({ email });
        if (existingCollaborator) {
            return res.status(400).json({ message: 'Collaborator already exists' });
        }

        const collaborator = await Collab.create({ name, email, password });

        res.status(201).json({ message: 'Collaborator registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
    
};


const loginCollaborator = async (req, res) => {
    try {
        const { email, password } = req.body;
        const collaborator = await Collab.findOne({ email });

        if (!collaborator || !(await bcrypt.compare(password, collaborator.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log("User authenticated successfully:", collaborator._id);
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(collaborator._id);

        const loggedInCollab = await Collab.findById(collaborator._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { collaborator: loggedInCollab, accessToken, refreshToken }, "Collaborator logged In Successfully"));
    } catch (error) {
        console.error("Error during login:", error);
        throw new ApiError(500, "Error generating tokens");
    }
};

export {registerCollaborator,loginCollaborator}