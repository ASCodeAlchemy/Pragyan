import mongoose from "mongoose";

const formSchema = new mongoose.Schema({

    ShopName:{ 
        type: String,
        required :true

    },

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Address: { 
         type: String,
        required :true

    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collaborator',
        required: true
    }


 },{timestamps: true})

 export const Form = mongoose.model("Form",formSchema)