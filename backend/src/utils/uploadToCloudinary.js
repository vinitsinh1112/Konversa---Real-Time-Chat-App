import cloudinary from "../config/cloudinary.js";
import streamifier from 'streamifier';

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "konversa-profile-pics",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);

    });
}

export default uploadToCloudinary;