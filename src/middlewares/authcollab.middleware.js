import jwt from 'jsonwebtoken';
import { Collaborator } from '../models/collab.models.js';// ✅ Import Collaborator model

const authenticateCollaborator = async (req, res, next) => {
    let token = req.cookies?.collabAccessToken; // ✅ Read from cookies directly

    if (token) {
        try {
            // ✅ Use the correct secret
            const decoded = jwt.verify(token, process.env.COLLAB_ACCESS_TOKEN_SECRET);

            // ✅ Attach collaborator to request object
            req.collaborator = await Collaborator.findById(decoded.id).select('-password');

            if (req.collaborator) {
                next(); // ✅ Continue to next middleware
            } else {
                return res.status(403).json({ message: 'Not authorized as collaborator' });
            }
        } catch (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};

const verifyCollaboratorRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.COLLAB_REFRESH_TOKEN_SECRET);
    } catch (error) {
        console.error("Invalid refresh token:", error);
        return null;
    }
};

export { authenticateCollaborator,verifyCollaboratorRefreshToken };

