import { User } from "../models/users.models.js";
import { Reward } from "../models/rewards.models.js";

const getUserRewards = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return rewards directly from the user model
        return res.status(200).json({ rewards: user.myRewards });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

const addReward = async (req, res) => {
    try {
        const { rewardName, rewardDescription, rewardValue, leagueRequirement } = req.body;

        // Validate required fields
        if (!rewardName || !rewardDescription || !rewardValue || !leagueRequirement) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create new reward
        const newReward = new Reward({
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

// ➡️ Get all rewards (Open to all users)
const getAllRewards = async (req, res) => {
    try {
        const rewards = await Reward.find(); // Fetch all rewards

        if (rewards.length === 0) {
            return res.status(404).json({ message: 'No rewards found.' });
        }

        return res.status(200).json({ rewards });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { getUserRewards,getAllRewards ,addReward }