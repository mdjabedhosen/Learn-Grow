import { Schema, model } from "mongoose";

export interface ITrialBooking {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  studentAge: string;
  trackInterest: string;
  status: "pending" | "contacted" | "scheduled" | "completed" | "cancelled";
  source?: string;
  notes?: string;
  isRead?: boolean;
  assignedInstructorId?: Schema.Types.ObjectId;
  scheduledDate?: string;
  scheduledTime?: string;
  meetingLink?: string;
  assignedBatchId?: Schema.Types.ObjectId;
  assignedBatchName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const trialBookingSchema = new Schema<ITrialBooking>(
  {
    parentName: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, trim: true, lowercase: true },
    studentAge: { type: String, required: true, trim: true },
    trackInterest: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "contacted", "scheduled", "completed", "cancelled"],
      default: "pending",
    },
    source: { type: String, default: "website" },
    notes: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
    assignedInstructorId: { type: Schema.Types.ObjectId, ref: "User" },
    scheduledDate: { type: String, default: "" },
    scheduledTime: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    assignedBatchId: { type: Schema.Types.ObjectId, ref: "Batch" },
    assignedBatchName: { type: String, default: "" },
  },
  { timestamps: true }
);

trialBookingSchema.index({ parentEmail: 1, createdAt: -1 });
trialBookingSchema.index({ parentPhone: 1 });
trialBookingSchema.index({ status: 1 });
trialBookingSchema.index({ assignedInstructorId: 1 });

export const TrialBooking = model<ITrialBooking>("TrialBooking", trialBookingSchema);
