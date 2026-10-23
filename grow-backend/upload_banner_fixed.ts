import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'daq7v0wmf',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    const filePath = "/private/tmp/claude-501/-Users-mjabed3834-Documents-web-app-learn-grow-fullstack-learn-grow/70321f1a-4292-451f-a1bc-87d763fd3dc0/images/16.jpg";
    const fileBuffer = fs.readFileSync(filePath);
    
    console.log("Attempting upload with cloud_name: daq7v0wmf...");
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'courses/thumbnails', public_id: 'python-ai-banner-2026' },
        (err, res) => err ? reject(err) : resolve(res)
      );
      stream.end(fileBuffer);
    });
    
    console.log(JSON.stringify({ url: result.secure_url }));
    process.exit(0);
  } catch (err: any) {
    console.error("Upload failed:", err.message || err);
    process.exit(1);
  }
}

run();
