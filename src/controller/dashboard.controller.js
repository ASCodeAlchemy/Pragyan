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

        
        const { current, next, min, max } = setLeague(user.TripPoints);

        
        const progress = ((user.TripPoints - min) / (max - min)) * 100;

        
        if (user.currentLeague !== current) {
            user.currentLeague = current;
            await user.save();
        }

        const nextMilestone = next ? max : null;
        const pointsToNextMilestone = next ? nextMilestone - user.TripPoints : 0;

        
        const rewards = await AddReward.find({ leagueRequirement: user.currentLeague });

        return res.status(200).json({
            name: user.name,
            email: user.email,
            noOfTrips: user.totalTrips,
            totalTripPoints: user.TripPoints,
            currentLeague: current,
            nextLeague: next,
            tierProgress: Math.min(100, Math.max(0, progress)), 
            nextMilestone,
            pointsToNextMilestone,
            totalCO2Reduced: user.totalCO2Reduced,
            lastTripPoints: user.lastTripPoints,
            rewards
        });
    } catch (error) {
        console.error('Error fetching user dashboard:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { dashboard }




