import { User } from "../models/users.models.js";
import { AddReward } from "../models/addRewards.models.js"; 
import { setLeague } from '../utilis/league.js';

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

        
        const totalKm = user.totalKM;
        const totalCO2Reduced = totalKm * 0.2;

        
        const leaderboard = await User.find({})
            .sort({ tripPoints: -1 });

        const rank = leaderboard.findIndex(u => u._id.toString() === user._id.toString()) + 1;
        user.rank = rank;
        await user.save();

        
        const rewards = await AddReward.find({ leagueRequirement: user.currentLeague });

        return res.status(200).json({
            name: user.name,
            email: user.email,
            noOfTrips: user.totalTrips,
            totalTripPoints: user.TripPoints,
            currentLeague: user.currentLeague,
            totalCO2Reduced: user.totalCO2Reduced, 
            rank: user.rank, 
            rewards: rewards
        });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { dashboard }




