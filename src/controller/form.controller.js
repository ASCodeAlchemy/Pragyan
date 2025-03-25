import { Form } from "../models/form.models.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { Collaborator } from "../models/collab.models.js";

const createForm = asyncHandler(async (req, res) => {
    const { ShopName , name, description, Address } = req.body;

    
    if (!name || !description || !ShopName || !Address) {
        throw new ApiError(400, "All Fields are required");
    }

    const collab = await Collaborator.findOne();

    if (!collab) {
        throw new ApiError(400, "Collaborator information is missing");
    }

    if (!collab._id) {
        throw new ApiError(400, "Collaborator ID is missing");
    }

    const form = new Form({
        ShopName,
        name,
        description,
        Address,
        createdBy: collab._id
    });

    await form.save();

    res.status(201).json({
        success: true,
        message: "Form submitted successfully",
        data: form
    });
});

const getAllForms = asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
        throw new ApiError(403, "Unauthorized: Only admins can access this endpoint");
    }

    const forms = await Form.find().populate("createdBy", "username email");

    res.status(200).json({
        success: true,
        data: forms
    });
});

export { createForm, getAllForms }
