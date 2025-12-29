import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from "fs";
import { ApiError } from "../utils/apiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    log("Uploading file to cloudinary from path:", localFilePath);

    //upload the fileon cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("cloudinary response: ", response);

    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);

    // file has been uploaded successfully
    console.log("file uploaded successfully on cloudinary", response.url);

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    console.error("Full cloudinary error:", error);

    // delete only if file exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    } else {
      console.log("File not found for deletion:", localFilePath);
    }

    return null;
  }
};

const deleteFromCloudinary = async (url) => {
  try {
    if (!url) {
      throw new ApiError(400, "Image URL is required");
    }

    console.log(url);

    // Extract publicId from the URL
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.split(".")[0]; // Remove file extension

    if (!publicId) {
      throw new ApiError(400, "publicId is required");
    }

    console.log(`publicId : ${publicId}`);

    const result = await cloudinary.uploader.destroy(publicId);

    console.log(`result: ${result.result}`);

    if (result.result !== "ok") {
      throw new ApiError(500, "Failed to delete file from Cloudinary");
    }

    return result; // { result: 'ok' }
  } catch (error) {
    // Optional: console.log(error);
    throw new ApiError(500, error.message || "Cloudinary delete failed");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
