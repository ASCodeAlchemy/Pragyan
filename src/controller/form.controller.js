import { Form } from "../models/form.models.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";

const createForm = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!req.collab) {
        throw new ApiError(403, "Only collaborators can submit forms");
    }

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const form = new Form({
        name,
        description,
        createdBy: req.collab._id
    });

    await form.save();

    res.status(201).json({
        success: true,
        message: "Form submitted successfully",
        data: form
    });
});

const getAllForms = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw new ApiError(403, "Unauthorized: Only admins can access this endpoint");
    }

    const forms = await Form.find().populate("createdBy", "username email");

    res.status(200).json({
        success: true,
        data: forms
    });
});


export {createForm,getAllForms}
