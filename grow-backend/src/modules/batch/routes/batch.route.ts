import express from "express";
import * as controller from "../controller/batch.controller";
import { requireAuth, requireRoles } from "@/middleware/auth";

const router = express.Router();

// ===== ADMIN & MANAGER ROUTES =====
router.get(
  "/admin/all",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.getAllBatchesAdmin
);

router.post(
  "/admin/create",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.createBatchAdmin
);

router.patch(
  "/admin/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.updateBatchAdmin
);

router.post(
  "/admin/:id/assign-student",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.assignStudentAdmin
);

router.delete(
  "/admin/:id/remove-student/:studentId",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.removeStudentAdmin
);

router.delete(
  "/admin/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.deleteBatchAdmin
);

router.post(
  "/admin/sync",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.syncBatches
);

// ===== INSTRUCTOR ROUTES =====
router.get(
  "/instructor/my-batches",
  requireAuth,
  requireRoles("instructor", "admin", "manager"),
  controller.getInstructorBatches
);

router.patch(
  "/instructor/:id",
  requireAuth,
  requireRoles("instructor", "admin", "manager"),
  controller.updateBatchInstructor
);

// ===== STUDENT ROUTES =====
router.get(
  "/student/my-batch/:courseId",
  requireAuth,
  controller.getStudentBatch
);

export const batchRoutes = router;
export default router;
