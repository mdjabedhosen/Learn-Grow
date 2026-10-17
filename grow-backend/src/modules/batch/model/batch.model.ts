import { Schema, model, models, Model, Types } from "mongoose";

export interface IBatch {
  courseId: Types.ObjectId;
  batchNumber: number;
  batchName: string;
  instructorId: Types.ObjectId;
  maxStudents: number;
  enrolledStudents: Types.ObjectId[];
  status: "upcoming" | "ongoing" | "completed";
  schedule?: string;
  startDate?: Date;
  endDate?: Date;
  zoomLink?: string;
  whatsappGroupUrl?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const batchSchema = new Schema<IBatch>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    batchNumber: {
      type: Number,
      required: true,
    },
    batchName: {
      type: String,
      required: true,
      trim: true,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    maxStudents: {
      type: Number,
      required: true,
      default: 15,
    },
    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "ongoing",
      index: true,
    },
    schedule: {
      type: String,
      default: "Sat & Tue 7:00 PM - 8:00 PM",
    },
    startDate: {
      type: Date,
      default: () => new Date(),
    },
    endDate: {
      type: Date,
    },
    zoomLink: {
      type: String,
      trim: true,
      default: "",
    },
    whatsappGroupUrl: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

batchSchema.index({ courseId: 1, batchNumber: 1 }, { unique: true });
batchSchema.index({ instructorId: 1, status: 1 });

export const Batch = (models.Batch as Model<IBatch>) || model<IBatch>("Batch", batchSchema);
