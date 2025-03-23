import { User } from "../models/users.models.js";


const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .select('name username TripPoints currentLeague')
            .sort({ TripPoints: -1 }); 

        const rankedLeaderboard = leaderboard.map((user, index) => ({
            rank: index + 1,
            
            username: user.username,
            TripPoints: user.TripPoints, 
            currentLeague: user.currentLeague
        }));


        res.status(200).json(rankedLeaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
};

export { getLeaderboard };

