import { User } from '../models/user.model.js'; // Fix the import statement

const promoteToAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isAdmin = true;
        await user.save();

        return res.status(200).json({ message: `${user.name} is now an Admin.` });
    } catch (error) {
        console.error('Error promoting to admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ➡️ Demote a user from admin
const demoteFromAdmin = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isAdmin = false;
        await user.save();

        return res.status(200).json({ message: `${user.name} is no longer an Admin.` });
    } catch (error) {
        console.error('Error demoting from admin:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

export { promoteToAdmin, demoteFromAdmin }