/*
import jwt from 'jsonwebtoken';
import { AddReward } from '../models/addRewards.models.js';
import { asyncHandler } from '../utilis/asyncHandler.js';
const verifyRewardToken = asyncHandler(async (req, res) => {
    const { username, rewardId, OTP } = req.body;

    if (!username || !rewardId || !OTP) {
        throw new ApiError(400, 'Username, Reward ID, and OTP are required');
    }

  
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

   
    if (user.lastClaimedToken !== OTP) {
        throw new ApiError(401, 'Invalid OTP');
    }

   
    const reward = await AddReward.findById(rewardId);
    if (!reward) {
        throw new ApiError(404, 'Reward not found');
    }

   
    if (reward.lastClaimedToken !== OTP) {
        throw new ApiError(401, 'Invalid OTP');
    }

  
    reward.lastClaimedToken = null;
    await reward.save();

    res.status(200).json({ message: 'Reward verified successfully!' });
});

export { verifyRewardToken };

*/
