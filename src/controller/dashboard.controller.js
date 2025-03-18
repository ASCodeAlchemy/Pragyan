import { User } from "../models/users.models.js";
import { setLeague } from '../utilis/league.js';
import { getRewardsByLeague } from '../utilis/rewards.js';

const dashboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedLeague = setLeague(user.TripPoints);
        if (user.currentLeague !== updatedLeague) {
            user.currentLeague = updatedLeague;
            await user.save();
        }

        const rewards = getRewardsByLeague(user.currentLeague);

        return res.status(200).json({
            name: user.name,
            email: user.email,
            noOfTrips: user.totalTrips,
            totalTripPoints: user.TripPoints,
            currentLeague: user.currentLeague,
            rewards: rewards
        });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { dashboard }




