import { User } from "../models/users.models.js";
import { AddReward } from "../models/addRewards.models.js";
import { ApiError } from "../utilis/ApiError.js";

const getUserRewards = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ rewards: user.myRewards });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const addReward = async (req, res) => {
    try {
        const { ShopName, rewardName, rewardDescription, rewardValue, leagueRequirement } = req.body;

        if (!rewardName || !rewardDescription || !rewardValue || !leagueRequirement ||!ShopName) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newReward = new AddReward({
            ShopName,
            rewardName,
            rewardDescription,
            rewardValue,
            leagueRequirement
        });

        await newReward.save();

        return res.status(201).json({
            message: 'Reward added successfully',
            reward: newReward
        });
    } catch (error) {
        console.error('Error adding reward:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllRewards = async (req, res) => {
    try {
        const rewards = await AddReward.find();

        if (rewards.length === 0) {
            return res.status(404).json({ message: 'No rewards found.' });
        }

        return res.status(200).json({ rewards });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const generateRandomOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

const claimReward = async (req, res) => {
    try {
        const userId = req.user._id; 
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const reward = await AddReward.findOne({ leagueRequirement: user.currentLeague });
        if (!reward) {
            return res.status(404).json({ message: 'No rewards available for your current league' });
        }

        
        if (reward.lastClaimedToken) {
            return res.status(400).json({
                message: 'Reward already claimed',
                reward: {
                    rewardId: reward._id,
                    rewardName: reward.rewardName,
                    rewardDescription: reward.rewardDescription,
                    claimedAt: reward.claimedAt,
                    OTP: reward.lastClaimedToken
                }
            });
        }

        
        const OTP = generateRandomOTP();

        
        reward.lastClaimedToken = OTP;
        reward.claimedAt = new Date();
        await reward.save();

        
        user.lastClaimedToken = OTP;
        user.rewardClaimed += 1;
        await user.save();

        res.status(200).json({
            message: 'Reward claimed successfully!',
            reward: {
                rewardId: reward._id,
                rewardName: reward.rewardName,
                rewardDescription: reward.rewardDescription,
                claimedAt: reward.claimedAt,
                OTP
            }
        });
    } catch (error) {
        console.error('Error claiming reward:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export { getUserRewards, getAllRewards, addReward, claimReward };