import { Request, Response } from "express";
import { Types } from "mongoose";
import { TrialBooking } from "../model/trialBooking.model.js";
import { TrackingService } from "../../tracking/service/tracking.service.js";
import { escapeRegex } from "@/utils/sanitizeSearch";

// Public: Submit a new free trial booking
export const createTrialBooking = async (req: Request, res: Response) => {
  try {
    const { parentName, parentPhone, parentEmail, studentAge, trackInterest, source, eventId } = req.body || {};

    if (!parentName || !parentPhone || !parentEmail || !studentAge || !trackInterest) {
      return res.status(400).json({
        success: false,
        message: "Parent name, phone, email, child age, and program are required",
      });
    }

    const booking = await TrialBooking.create({
      parentName,
      parentPhone,
      parentEmail,
      studentAge,
      trackInterest,
      source: source || "website",
    });

    // Fire Server-Side Tracking Event (Meta CAPI, TikTok Events API, GA4) asynchronously
    TrackingService.trackLead({
      name: parentName,
      email: parentEmail,
      phone: parentPhone,
      trackInterest,
      source: source || "website",
      eventId: eventId || `lead_${booking._id}`,
      req,
    }).catch(() => {});

    return res.status(201).json({
      success: true,
      message: "Free trial booking submitted successfully!",
      data: booking,
      eventId: eventId || `lead_${booking._id}`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create free trial booking",
    });
  }
};

// Admin / Manager / Instructor: Get trial bookings with filters
export const getTrialBookings = async (req: Request, res: Response) => {
  try {
    const { status, search, instructorId } = req.query as { status?: string; search?: string; instructorId?: string };
    const query: any = {};

    const effectiveRole = req.userRole || (req as any).user?.role;
    const effectiveUserId = req.userId || (req as any).user?.id || (req as any).user?._id;

    // Strict privacy rule: An instructor can ONLY and STRICTLY see trial bookings explicitly assigned to them.
    // They must NEVER see another teacher's trial class even if they teach the same course or track.
    if (effectiveRole === "instructor") {
      if (!effectiveUserId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const instructorObjId = Types.ObjectId.isValid(effectiveUserId)
        ? new Types.ObjectId(effectiveUserId)
        : effectiveUserId;

      query.assignedInstructorId = instructorObjId;
    } else if (effectiveRole === "admin" || effectiveRole === "manager") {
      // Admins & managers have oversight over all bookings or can filter by specific instructorId
      if (instructorId && Types.ObjectId.isValid(instructorId)) {
        query.assignedInstructorId = new Types.ObjectId(instructorId);
      }
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const safeSearch = escapeRegex(search);
      if (safeSearch) {
        query.$or = [
          { parentName: { $regex: safeSearch, $options: "i" } },
          { parentPhone: { $regex: safeSearch, $options: "i" } },
          { parentEmail: { $regex: safeSearch, $options: "i" } },
          { trackInterest: { $regex: safeSearch, $options: "i" } },
        ];
      }
    }

    const bookings = await TrialBooking.find(query)
      .populate("assignedInstructorId", "name email phone avatar profileImage")
      .populate("assignedBatchId", "batchName schedule zoomLink")
      .sort({ createdAt: -1 })
      .lean();
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch trial bookings",
    });
  }
};

// Admin, Manager & Instructor: Update booking status, schedule, assigned instructor, or notes
export const updateTrialBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      status,
      notes,
      isRead,
      assignedInstructorId,
      scheduledDate,
      scheduledTime,
      meetingLink,
      assignedBatchId,
      assignedBatchName,
    } = req.body || {};

    const effectiveRole = req.userRole || (req as any).user?.role;
    const effectiveUserId = req.userId || (req as any).user?.id || (req as any).user?._id;

    if (effectiveRole === "instructor") {
      const existing = await TrialBooking.findById(id).lean();
      if (!existing || existing.assignedInstructorId?.toString() !== effectiveUserId?.toString()) {
        return res.status(403).json({ success: false, message: "You can only update your assigned trial sessions" });
      }
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (notes !== undefined) updateFields.notes = notes;
    if (isRead !== undefined) updateFields.isRead = isRead;
    if (assignedInstructorId !== undefined && effectiveRole !== "instructor") {
      updateFields.assignedInstructorId = assignedInstructorId || null;
    }
    if (scheduledDate !== undefined && effectiveRole !== "instructor") updateFields.scheduledDate = scheduledDate;
    if (scheduledTime !== undefined && effectiveRole !== "instructor") updateFields.scheduledTime = scheduledTime;
    if (meetingLink !== undefined) updateFields.meetingLink = meetingLink;
    if (assignedBatchId !== undefined && effectiveRole !== "instructor") updateFields.assignedBatchId = assignedBatchId || null;
    if (assignedBatchName !== undefined && effectiveRole !== "instructor") updateFields.assignedBatchName = assignedBatchName;

    if ((assignedInstructorId || scheduledDate) && !status) {
      updateFields.status = "scheduled";
    }

    const updated = await TrialBooking.findByIdAndUpdate(id, updateFields, { new: true })
      .populate("assignedInstructorId", "name email phone avatar profileImage")
      .populate("assignedBatchId", "batchName schedule zoomLink")
      .lean();
    if (!updated) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Trial booking updated",
      data: updated,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update trial booking",
    });
  }
};

// Admin: Delete a trial booking
export const deleteTrialBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await TrialBooking.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    return res.status(200).json({ success: true, message: "Trial booking deleted" });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete trial booking",
    });
  }
};
