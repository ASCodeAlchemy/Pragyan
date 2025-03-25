import jwt from 'jsonwebtoken';
import { AddReward } from '../models/addRewards.models.js';
import { asyncHandler } from '../utilis/asyncHandler.js';
const verifyRewardToken = asyncHandler(async (req, res) => {
    const { username, rewardId, OTP } = req.body;

    if (!username || !rewardId || !OTP) {
        throw new ApiError(400, 'Username, Reward ID, and OTP are required');
    }

    // ✅ Find user by username
    const user = await User.findOne({ username });
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // ✅ Check last claimed token
    if (user.lastClaimedToken !== OTP) {
        throw new ApiError(401, 'Invalid OTP');
    }

    // ✅ Find reward by ID
    const reward = await AddReward.findById(rewardId);
    if (!reward) {
        throw new ApiError(404, 'Reward not found');
    }

    // ✅ Check if OTP matches last claimed token
    if (reward.lastClaimedToken !== OTP) {
        throw new ApiError(401, 'Invalid OTP');
    }

    // ✅ Clear OTP after successful verification
    reward.lastClaimedToken = null;
    await reward.save();

    res.status(200).json({ message: 'Reward verified successfully!' });
});

export { verifyRewardToken };
