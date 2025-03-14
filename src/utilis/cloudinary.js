import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

cloudinary.config({ 
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret: process.env.API_SECRET
}) 

const uploadOnCloud = async(path)=> {
try{ 
    if(!path) return null
    const response = await cloudinary.uploader.upload(path,{ 
        resource_type: "auto"
    })
    console.log("File Is Uploded successfully",response.url)
    return response

}catch(error){ 
    fs.unlinkSync(path) // Remove the Locally Saved Temp File as the upload operation got failed
    return null
}
}

export { uploadOnCloud }