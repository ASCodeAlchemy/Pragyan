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
    const { ShopName, username, email, fullname, password } = req.body;

    if (!username || !email || !fullname || !password ||!ShopName) {
        throw new ApiError(400, "All fields are required");
    }

    
    const existingCollaborator = await Collaborator.findOne({ email });
    if (existingCollaborator) {
        throw new ApiError(400, "Collaborator already exists");
    }

    
    const newCollaborator = new Collaborator({
        ShopName,
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
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    const collab = await Collaborator.findOne({
        $or: [{ username }, { email }],
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

    // ✅ Find user
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    console.log(`User's last claimed token: ${user.lastClaimedToken}`);
    
    // ✅ Validate OTP
    if (user.lastClaimedToken !== OTP) {
        throw new ApiError(401, 'Invalid OTP');
    }

    // ✅ Find reward
    const reward = await AddReward.findById(rewardId);
    if (!reward) {
        throw new ApiError(404, 'Reward not found');
    }

    // ✅ Find collaborator
    const collaborator = await Collaborator.findById(req.collaborator._id);
    if (!collaborator) {
        throw new ApiError(404, 'Collaborator not found');
    }

    // ✅ Check if ShopName matches
    if (reward.ShopName !== collaborator.ShopName) {
        throw new ApiError(403, 'ShopName does not match');
    }

    // ✅ Clear last claimed token after verification
    user.lastClaimedToken = null;
    await user.save();

    // ✅ Delete the reward after verification
    await AddReward.findByIdAndDelete(rewardId);

    // ✅ Update collaborator stats
    collaborator.rewardsVerified += 1;
    collaborator.totalUsersVerified += 1;
    await collaborator.save(); // ✅ Save updated stats

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
const getCollaboratorProfile = asyncHandler(async (req, res) => {
    const collaborator = await Collaborator.findById(req.collaborator._id).select('-password');

    if (!collaborator) {
        throw new ApiError(404, 'Collaborator not found');
    }

    res.status(200).json(new ApiResponse(200, collaborator, 'Collaborator profile fetched successfully'));
});
const updateCollaboratorProfile = asyncHandler(async (req, res) => {
    const { username, fullname, email, status } = req.body;

    const collaborator = await Collaborator.findById(req.collaborator._id);

    if (!collaborator) {
        throw new ApiError(404, 'Collaborator not found');
    }

    
    if (username) collaborator.username = username;
    if (fullname) collaborator.fullname = fullname;
    if (email) collaborator.email = email;
    if (status) collaborator.status = status;

    await collaborator.save();

    const updatedCollaborator = await Collaborator.findById(req.collaborator._id).select('-password');

    res.status(200).json(new ApiResponse(200, updatedCollaborator, 'Collaborator profile updated successfully'));
});

const changeCollaboratorPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, 'Old password and new password are required');
    }

    const collaborator = await Collaborator.findById(req.collaborator._id);

    if (!collaborator) {
        throw new ApiError(404, 'Collaborator not found');
    }

    const isPasswordValid = await collaborator.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
        throw new ApiError(401, 'Old password is incorrect');
    }

    collaborator.password = newPassword;
    await collaborator.save();

    res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export { 
    loginCollaborator, 
    logoutCollaborator, 
    registerCollaborator, 
    verifyReward, 
    refreshToken, 
    getCollaboratorProfile, 
    updateCollaboratorProfile,
    changeCollaboratorPassword 
};
