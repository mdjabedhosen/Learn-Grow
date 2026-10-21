import { publicFormRateLimiter } from "@/middleware/security.middleware";
import express from "express";
import { requireAuth, requireRoles } from "../../../middleware/auth.js";
import { createContact, getContacts, markContactRead, deleteContact } from "../controller/contact.controller.js";

const router = express.Router();

// Public: submit contact
router.post("/", publicFormRateLimiter, createContact);

// Admin: list, mark read, delete
router.get("/", requireAuth, requireRoles("admin"), getContacts);
router.put("/:id/read", requireAuth, requireRoles("admin"), markContactRead);
router.delete("/:id", requireAuth, requireRoles("admin"), deleteContact);

export default router;
