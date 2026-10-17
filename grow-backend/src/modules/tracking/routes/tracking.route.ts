import express from "express";
import { requireAuth, requireRoles } from "../../../middleware/auth.js";
import {
  getPublicConfig,
  getAdminConfig,
  updateAdminConfig,
  trackEvent,
  sendTestEvent,
} from "../controller/tracking.controller.js";

const router = express.Router();

// Public routes
router.get("/config", getPublicConfig);
router.post("/event", trackEvent);

// Admin-only routes
router.get("/admin/config", requireAuth, requireRoles("admin", "manager"), getAdminConfig);
router.put("/admin/config", requireAuth, requireRoles("admin", "manager"), updateAdminConfig);
router.post("/test", requireAuth, requireRoles("admin", "manager"), sendTestEvent);

export default router;
