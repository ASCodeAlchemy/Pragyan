import { asyncHandler } from '../utilis/asyncHandler.js';
import { ApiError } from '../utilis/ApiError.js';
import { User } from '../models/users.models.js';
import { ApiResponse } from '../utilis/ApiResponse.js';

export const recordTrip = asyncHandler(async (req, res) => {
    const { qrCodeData } = req.body;

    if (!qrCodeData) {
        throw new ApiError(400, "Trip details are required");
    }

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.trips.push({ qrCodeData });

    await user.save();

    return res.status(200).json(new ApiResponse(200, user, "Trip recorded successfully"));
});