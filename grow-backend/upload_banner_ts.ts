import 'dotenv/config';
import { uploadToCloudinary } from './src/utils/cloudinary';
import fs from 'fs';

async function run() {
  try {
    const filePath = "/private/tmp/claude-501/-Users-mjabed3834-Documents-web-app-learn-grow-fullstack-learn-grow/70321f1a-4292-451f-a1bc-87d763fd3dc0/images/16.jpg";
    const fileBuffer = fs.readFileSync(filePath);
    
    console.log("Attempting upload with current env config...");
    const result = await uploadToCloudinary(fileBuffer, 'python-ai-banner-2026', 'courses/thumbnails');
    
    console.log(JSON.stringify({ url: result.url }));
    process.exit(0);
  } catch (err: any) {
    console.error("Upload failed:", err.message || err);
    process.exit(1);
  }
}

run();
