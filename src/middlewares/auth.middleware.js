import { ApiError } from "../utilis/ApiError.js";
import jwt from 'jsonwebtoken';
import { User } from '../models/users.models.js';

export const verifyJWT = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        throw new ApiError(401, "Access token is required");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded._id).select('-password -refreshToken');
        if (!req.user) {
            throw new ApiError(401, "User not found");
        }
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
};