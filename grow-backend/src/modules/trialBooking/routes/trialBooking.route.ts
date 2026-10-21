import { publicFormRateLimiter } from "@/middleware/security.middleware";
import express from "express";
import { requireAuth, requireRoles } from "../../../middleware/auth.js";
import {
  createTrialBooking,
  getTrialBookings,
  updateTrialBookingStatus,
  deleteTrialBooking,
} from "../controller/trialBooking.controller.js";

const router = express.Router();

// Public: Submit a free trial booking
router.post("/", publicFormRateLimiter, createTrialBooking);

// Admin / Manager / Instructor: List bookings (instructors filtered to their assigned sessions)
router.get("/", requireAuth, requireRoles("admin", "manager", "instructor"), getTrialBookings);
router.put("/:id", requireAuth, requireRoles("admin", "manager", "instructor"), updateTrialBookingStatus);
router.delete("/:id", requireAuth, requireRoles("admin", "manager"), deleteTrialBooking);

export default router;
