import mongoose from "mongoose";
import { config } from "@/config";

/**
 * Global UTC & Cleanup Transformation
 */
const outputOptions = {
  transform: (_: any, ret: any) => {
    delete ret.__v; // Remove version key
    
    // Ensure all Date objects are returned as UTC ISO strings
    for (const key in ret) {
      if (ret[key] instanceof Date) {
        ret[key] = ret[key].toISOString();
      }
    }
    return ret;
  },
};

mongoose.set("toJSON", outputOptions);
mongoose.set("toObject", outputOptions);

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
  } catch (error: any) {
    process.exit(1);
  }
};