require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: 'daq7v0wmf',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function upload() {
  try {
    const filePath = "/private/tmp/claude-501/-Users-mjabed3834-Documents-web-app-learn-grow-fullstack-learn-grow/70321f1a-4292-451f-a1bc-87d763fd3dc0/images/16.jpg";
    
    if (!fs.existsSync(filePath)) {
      console.error("Banner image file not found at:", filePath);
      process.exit(1);
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'courses/thumbnails',
      public_id: 'python-ai-banner-2026',
    });

    console.log(JSON.stringify({ url: result.secure_url }));
    process.exit(0);
  } catch (err) {
    console.error("Upload failed:", err);
    process.exit(1);
  }
}

upload();
