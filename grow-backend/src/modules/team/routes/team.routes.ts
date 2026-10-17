import { Router, Request, Response } from "express";
import teamController from "../controller/team.controller";
import { requireAuth, requireRoles } from "../../../middleware/auth";
import { validate } from "../../../middleware/validate";
import {
    createTeamMemberSchema,
    updateTeamMemberSchema,
    importInstructorSchema,
    toggleShowHomeSchema,
} from "../schema/team.schema";

const router = Router();

// Public routes
router.get("/home", teamController.getHomeTeamMembers);
router.get("/:id", teamController.getTeamMemberById);
router.get("/", teamController.getAllTeamMembers);

// Admin only routes
router.post(
    "/",
    requireAuth,
    requireRoles("admin", "manager"),
    validate(createTeamMemberSchema),
    teamController.createTeamMember
);

router.patch(
    "/:id",
    requireAuth,
    requireRoles("admin", "manager"),
    validate(updateTeamMemberSchema),
    teamController.updateTeamMember
);

router.patch(
    "/:id/toggle-home",
    requireAuth,
    requireRoles("admin", "manager"),
    validate(toggleShowHomeSchema),
    teamController.toggleShowHome
);

router.delete("/:id", requireAuth, requireRoles("admin", "manager"), teamController.deleteTeamMember);

// Import instructors route
router.post(
    "/import/instructors",
    requireAuth,
    requireRoles("admin", "manager"),
    validate(importInstructorSchema),
    teamController.importInstructors
);

// Get approved instructors for import preview
router.get("/import/approved/instructors", requireAuth, requireRoles("admin", "manager"), teamController.getApprovedInstructors);

// Position management routes
router.post("/reorder", requireAuth, requireRoles("admin", "manager"), teamController.reorderMembers);
router.patch("/:id/position", requireAuth, requireRoles("admin", "manager"), teamController.updateMemberPosition);

export default router;
