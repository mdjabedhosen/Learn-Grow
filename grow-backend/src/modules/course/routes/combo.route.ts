import express from "express";
import * as controller from "../controller/combo.controller";
import { requireAuth, requireRoles } from "@/middleware/auth";

const router = express.Router();

// ===== COMBO ROUTES (Admin & Manager) =====

/**
 * Create a new combo
 * POST /api/course/combo/create
 */
router.post(
  "/create",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.createCombo
);

/**
 * Get all active combos (Public)
 * GET /api/combo/list
 */
router.get("/list", controller.getActiveCombos);

/**
 * Get all combos (Admin & Manager panel - includes inactive)
 * GET /api/combo/all
 */
router.get("/all", requireAuth, requireRoles("admin", "manager"), controller.getAllCombos);

/**
 * Get combo by ID (Public)
 * GET /api/combo/:comboId
 */
router.get("/:comboId", controller.getComboById);

/**
 * Update combo (Admin & Manager)
 * PATCH /api/course/combo/:comboId
 */
router.patch(
  "/:comboId",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.updateCombo
);

/**
 * Disable/Delete combo (Admin & Manager)
 * DELETE /api/course/combo/:comboId
 */
router.delete(
  "/:comboId",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.disableCombo
);

/**
 * Toggle combo active status (Admin & Manager)
 * PATCH /api/combo/:comboId/toggle-status
 */
router.patch(
  "/:comboId/toggle-status",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.toggleComboStatus
);

/**
 * Delete combo permanently (Admin & Manager)
 * DELETE /api/combo/:comboId/permanent
 */
router.delete(
  "/:comboId/permanent",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.deleteCombo
);

/**
 * Enroll user in combo (triggered after payment approval)
 * POST /api/course/combo/enroll
 */
router.post(
  "/enroll",
  requireAuth,
  controller.enrollInCombo
);

/**
 * Extend user's combo access (Admin & Manager)
 * POST /api/course/combo/extend-access
 */
router.post(
  "/extend-access",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.extendComboAccess
);

/**
 * Get user's combo purchases
 * GET /api/course/combo/my/purchases
 */
router.get(
  "/my/purchases",
  requireAuth,
  controller.getUserComboPurchases
);

export default router;
