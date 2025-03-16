import { User } from '../models/users.models.js';
import { Trip } from '../models/trip.models.js';
import { updateStats } from './stats.controller.js';
import { ApiError } from '../utilis/ApiError.js';
import { ApiResponse } from '../utilis/ApiResponse.js';


const createTrip = async (req, res) => {
    try {
        const { startLocation, endLocation, kilometers } = req.body;
        const userId = req.user.id;

       
        const tripPoints = Math.floor(kilometers / 2);

        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.totalTrips += 1;
 
       
        const trip = new Trip({
            userId,
            startLocation,
            endLocation,
            kilometers,
            tripPoints
        });

        await trip.save();

        user.TripPoints += tripPoints;

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

        const trips = await Trip.find({ userId });

        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: "Trips not found" });
        }

        return res.status(200).json(trips);
    } catch (error) {
        console.log("Error Fetching Trip Details", error);
        return res.status(500).json({ message: "Server Error" });
    }
}

export { createTrip, myTrips };

