import { asyncHandler } from '../utilis/asyncHandler.js';
import { ApiError } from '../utilis/ApiError.js';
import { User } from '../models/users.models.js';
import { ApiResponse } from '../utilis/ApiResponse.js';
import jwt from 'jsonwebtoken'; 


const generateAccessAndRefreshTokens = async(userId) => {
    try {
        console.log("Generating tokens for user:", userId);
        const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
        console.log("Tokens generated successfully");
        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw error;
    }
}

const registerUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

const loginUser = async (loginData) => {
    const user = await User.findOne({ email: loginData.email });
    if (!user || !user.comparePassword(loginData.password)) {
        throw new Error('Invalid credentials');
    }
    return user;
};

 const registerUserHandler = async (req, res, next) => {
    try {
        const { username, firstname, lastname, email, password} = req.body;

        if ([username, firstname, lastname, email, password].some((field) => !field || field.trim() === "")) {
            throw new ApiError(400, "All Fields are Required");
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            throw new ApiError(400, "User Already Exists");
        }

        try {
            const user = await registerUser({
                username,
                firstname,
                lastname,
                email,
                password,
            });

            const createdUser = await User.findById(user._id).select("-password -refreshToken");

            if (!createdUser) {
                throw new ApiError(500, "Failed to Register User");
            }

            return res.status(201).json(new ApiResponse(201, createdUser, "User Registered Successfully"));
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ApiError(400, error.message);
            }
            throw new ApiError(500, "Error creating user");
        }
    } catch (error) {
        next(error);
    }
};

const loginUserHandler = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    try {
        console.log("User authenticated successfully:", user._id);
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged In Successfully"));
    } catch (error) {
        console.error("Error during login:", error);
        throw new ApiError(500, "Error generating tokens");
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(400, "User not authenticated");
    }

    await User.findByIdAndUpdate(
        req.user._id, {
            $unset: {
                refreshToken: 1
            }
        }, {
            new: true,
            writeConcern: {
                w: "majority",
              
        }
    }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out Successfully")); 
});

const changePassword = asyncHandler(async(req,res)=> { 
    const{oldPassword , newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){ 
        throw new ApiError(400,"Inavlid Old Password")
    
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res 
    .status(200)
    .json(new ApiResponse(200,{},"Password Changes Successfully"))
})

const getCurrentUser = asyncHandler(async(req,res)=> { 
    return res 
    .status(200)
    .json(new ApiResponse(200,req.user, "User Fetched Successfully"))
})

const accountDetails = asyncHandler(async(req,res)=>{ 
    const{firstname,lastname,email} = req.body

    if(!firstname || !lastname|| !email){ 
        throw new ApiError(400,"All Fields are Required")
    }

    const user = await User.findByIdAndUpdate( 
        req.user?._id, { 
            $set :{ 
                firstname ,
                lastname, 
                email :email
            }
        },
        {new : true,
            writeConcern: {
                w: "majority",
              
        }
        }
    ).select("-password")

    return res 
    .status(200)
    .json(new ApiResponse(200,user,"Details Updated Successfully"))
})

const getUserProfile = async (req, res) => {
    try {
        const leaderboard = await User.find({})
            .select('firstname lastname username TripPoints currentLeague')
            .sort({ TripPoints: -1 });

        const rankedLeaderboard = leaderboard.map((user, index) => {
            user.rank = index + 1;
            return user;
        });

        const user = rankedLeaderboard.find(user => user._id.toString() === req.user._id.toString());

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        user.rank = rankedLeaderboard.find(u => u._id.toString() === user._id.toString()).rank;

        res.status(200).json({
            _id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            TripPoints: user.TripPoints,
            currentLeague: user.currentLeague,
            rank: user.rank 
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
};


export { loginUserHandler, logoutUser, changePassword, getCurrentUser, accountDetails, getUserProfile, registerUserHandler, loginUser };
