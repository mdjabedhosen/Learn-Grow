import { Router } from "express";
import roleController from "../controller/role.controller";
import { requireAuth, requireRoles } from "../../../middleware/auth";

const router = Router();

// Public routes
router.get("/", roleController.getAllRoles);

// Admin routes
router.post("/", requireAuth, requireRoles("admin", "manager"), roleController.createRole);
router.patch("/:id", requireAuth, requireRoles("admin", "manager"), roleController.updateRole);
router.post("/reorder", requireAuth, requireRoles("admin", "manager"), roleController.reorderRoles);
router.delete("/:id", requireAuth, requireRoles("admin", "manager"), roleController.deleteRole);
router.post("/seed", requireAuth, requireRoles("admin", "manager"), roleController.seedDefaultRoles);

export default router;
