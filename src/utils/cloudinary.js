import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECR
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("localFilePath is null ok");
            return null;
        }
        const Response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        console.log("file is uploaded on Cloudinary  at", Response.url);
        // delete the file after uploading to Cloudinary
        fs.unlinkSync(localFilePath);
        return Response;
    }
    catch {
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
       
     }
}

export {uploadOnCloudinary}