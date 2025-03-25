import { User } from "../models/users.models.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { Collaborator } from "../models/collab.models.js";

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
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, 'username firstname TripPoints currentLeague');

    if (!users || users.length === 0) {
        return res.status(404).json({ success: false, message: 'No users found' });
    }

    res.status(200).json({
        success: true,
        data: users,
        message: 'Users fetched successfully'
    });
});

const getAllCollab = asyncHandler(async(req,res)=>{ 
    const collabs = await Collaborator.find({}, 'ShopName , username , email, status')

    if(!collabs || collabs.length ===0){ 
        return res.status(404).json({sucess:false, message :'no collaborator found'})

    }

    res.status(200).json({
        sucess: true, 
        data: collabs,
        message: 'Collaborators fetched successfully'
    })
})

export { promoteToAdmin, demoteFromAdmin ,getAllUsers,getAllCollab}