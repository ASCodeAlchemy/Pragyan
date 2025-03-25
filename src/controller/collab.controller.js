import jwt from 'jsonwebtoken';
import { Collaborator } from '../models/collab.models.js';
import { asyncHandler } from '../utilis/asyncHandler.js';
import { ApiError } from '../utilis/ApiError.js';
import { ApiResponse } from '../utilis/ApiResponse.js';
import { AddReward } from '../models/addRewards.models.js';
import { User } from '../models/users.models.js';

const generateCollaboratorAccessAndRefreshTokens = async (collaborator) => {
    const accessToken = jwt.sign(
        { id: collaborator._id },
        process.env.COLLAB_ACCESS_TOKEN_SECRET, 
        { expiresIn: process.env.COLLAB_ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        { id: collaborator._id },
        process.env.COLLAB_REFRESH_TOKEN_SECRET, 
        { expiresIn: process.env.COLLAB_REFRESH_TOKEN_EXPIRY }
    );

    collaborator.refreshToken = refreshToken;
    await collaborator.save();

    return { accessToken, refreshToken };
};

const registerCollaborator = async (req, res) => {
    const { username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password) {
        throw new ApiError(400, "All fields are required");
    }

    
    const existingCollaborator = await Collaborator.findOne({ email });
    if (existingCollaborator) {
        throw new ApiError(400, "Collaborator already exists");
    }

    
    const newCollaborator = new Collaborator({
        username,
        email,
        fullname,
        password,
        role: 'collaborator' 
    });

    await newCollaborator.save();

    
    const token = newCollaborator.generateAccessToken();
    console.log("Generated Token:", token);

    
    res.status(201).json({
        success: true,
        message: "Collaborator registered successfully",
        token
    });
};


const loginCollaborator = asyncHandler(async (req, res) => {
    const { email, fullname, password } = req.body;

    if (!fullname && !email) {
        throw new ApiError(400, "fullname or email is required");
    }

    const collab = await Collaborator.findOne({
        $or: [{ fullname }, { email }],
    });

    if (!collab) {
        throw new ApiError(404, "Collaborator does not exist");
    }

    const isPasswordValid = await collab.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    try {
        console.log("Collaborator authenticated successfully:", collab._id);
        
        
        const { accessToken, refreshToken } = await generateCollaboratorAccessAndRefreshTokens(collab);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        };

        
        res.cookie("collabAccessToken", accessToken, options);
        res.cookie("collabRefreshToken", refreshToken, { ...options, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days expiry

        const loggedInCollab = await Collaborator.findById(collab._id).select("-password");

        return res
            .status(200)
            .json(new ApiResponse(200, { collab: loggedInCollab, accessToken, refreshToken }, "Collaborator logged in successfully"));
    } catch (error) {
        console.error("Error during login:", error);
        throw new ApiError(500, "Error generating tokens");
    }
});




const logoutCollaborator = asyncHandler(async (req, res) => {
    if (!req.collaborator || !req.collaborator._id) {
        throw new ApiError(400, "User not authenticated");
    }

    
    await Collaborator.findByIdAndUpdate(req.collaborator._id, {
        $unset: { refreshToken: 1 },
    });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    };

    
    res.clearCookie("collabAccessToken", options);
    res.clearCookie("collabRefreshToken", options);

    return res.status(200).json(new ApiResponse(200, {}, "Collaborator logged out successfully"));
});





const verifyReward = asyncHandler(async (req, res) => {
    const { username, rewardId, OTP } = req.body;

    if (!username || !rewardId || !OTP) {
        throw new ApiError(400, 'Username, Reward ID, and OTP are required');
    }

    
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    
    console.log(`User's last claimed token: ${user.lastClaimedToken}`);
    if (user.lastClaimedToken !== OTP) {
        throw new ApiError(401, 'Invalid OTP');
    }

    const reward = await AddReward.findById(rewardId);
    if (!reward) {
        throw new ApiError(404, 'Reward not found');
    }

    
    user.lastClaimedToken = null;
    await user.save();

    
    await AddReward.findByIdAndDelete(rewardId);

    res.status(200).json({ message: 'Reward verified successfully!' });
});


 const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided' });
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const collaborator = await Collaborator.findById(decoded.id);

        if (!collaborator) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { accessToken } = generateTokens(collaborator);

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};


export {loginCollaborator ,logoutCollaborator,registerCollaborator,verifyReward ,refreshToken}
