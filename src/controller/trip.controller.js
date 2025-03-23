import { User } from '../models/users.models.js';
import { Trip } from '../models/trip.models.js';
import { updateStats } from './stats.controller.js';



const createTrip = async (req, res) => {
    try {
        const { startLocation, endLocation, kilometers } = req.body;
        const userId = req.user.id;

        const tripPoints = Math.floor(kilometers / 2);

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.totalTrips += 1;
        user.TripPoints += tripPoints;
        user.lastTripPoints = tripPoints; 
        user.totalKM += kilometers;
        user.totalCO2Reduced = user.totalKM * 0.2;

        const trip = new Trip({
            userId,
            startLocation,
            endLocation,
            kilometers,
            tripPoints
        });

        await trip.save();
        await user.save();
        await updateStats();

        return res.status(201).json({ message: 'Trip recorded successfully', trip });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


const myTrips = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query; 

        
        const trips = await Trip.find({ userId })
            .sort({ createdAt: -1 }) 
            .skip((page - 1) * limit)
            .limit(Number(limit));

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: "Trips not found" });
        }

    
        const totalTrips = await Trip.countDocuments({ userId });

        return res.status(200).json({
            totalTrips,
            currentPage: page,
            totalPages: Math.ceil(totalTrips / limit),
            trips,
        });
    } catch (error) {
        console.log("Error Fetching Trip Details", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


export { createTrip, myTrips };

