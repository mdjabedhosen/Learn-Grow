import { v2 as cloudinary } from 'cloudinary';
import config from '../config/config';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

// Upload image to Cloudinary
export const uploadToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'courses',
) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                },
            )
            .end(fileBuffer);
    });
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string) => {
    return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
