import { User } from '../models/users.models.js';
import { Trip } from '../models/trip.models.js';


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

        return res.status(201).json({ message: 'Trip recorded successfully', trip });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


export { createTrip };

  