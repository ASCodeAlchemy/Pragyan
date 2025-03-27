import { Form } from "../models/form.models.js";
import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { Collaborator } from "../models/collab.models.js";
import { ApiResponse } from "../utilis/ApiResponse.js";
const createForm = asyncHandler(async (req, res) => {
    const { ShopName , name, description, Address , RewardValue } = req.body;

    
    if (!name || !description || !ShopName || !Address||!RewardValue) {
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
        RewardValue,
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

    const getForms = asyncHandler(async (req, res) => {
        const forms = await Form.find().populate('submittedBy', 'fullname email');
        
        res.status(200).json(new ApiResponse(200, forms, 'Forms fetched successfully'));
    });
    
});

const approveForm = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const form = await Form.findById(id);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    form.status = 'approved';
    await form.save();

    res.status(200).json(new ApiResponse(200, form, 'Form approved successfully'));
});

const rejectForm = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const form = await Form.findById(id);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    form.status = 'rejected';
    await form.save();

    res.status(200).json(new ApiResponse(200, form, 'Form rejected successfully'));
});

export { createForm, getAllForms , approveForm ,rejectForm}
