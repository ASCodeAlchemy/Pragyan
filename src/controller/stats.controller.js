import { User } from "../models/users.models.js";
import { Trip } from "../models/trip.models.js";
import { Stats } from "../models/stats.models.js";

const updateStats = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTrips = await Trip.countDocuments();
        const totalKilometers = await Trip.aggregate([
            { $group: { _id: null, totalKm: { $sum: "$kilometers" } } }
        ]);

        const totalKm = totalKilometers.length > 0 ? totalKilometers[0].totalKm : 0;

        const totalTripPoints = await User.aggregate([
            { $group: { _id: null, totalPoints: { $sum: "$totalTripPoints" } } }
        ]);

        const totalPoints = totalTripPoints.length > 0 ? totalTripPoints[0].totalPoints : 0;

        const totalCO2Reduced = totalKm * 0.2;

        const stats = await Stats.findOneAndUpdate(
            {},
            {
                totalTrips,
                totalKilometers: totalKm,
                totalUsers,
                totalCO2Reduced,
                totalTripPoints: totalPoints
            },
            { upsert: true, new: true }
        );

        console.log('Stats updated:', stats);
    } catch (error) {
        console.error('Error updating stats:', error);
    }
};

const getStats = async (req, res) => {
    try {
        await updateStats(); 
        const stats = await Stats.findOne();
        if (!stats) return res.status(404).json({ message: 'Stats not found' });

        return res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { getStats, updateStats }