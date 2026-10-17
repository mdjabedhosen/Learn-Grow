import express from "express";
import * as controller from "../controller/settings.controller";
import * as smtpController from "../controller/smtp.controller";
import * as backupController from "../controller/backup.controller";
import { requireAuth, requireRoles } from "@/middleware/auth";

const router = express.Router();

router.get("/commission", controller.getCommission);
router.patch("/commission", requireAuth, requireRoles("admin", "manager"), controller.updateCommission);

// SMTP settings (admin & manager)
router.get("/smtp", requireAuth, requireRoles("admin", "manager"), smtpController.getSMTPConfig);
router.put("/smtp", requireAuth, requireRoles("admin", "manager"), smtpController.updateSMTPConfig);
router.post("/smtp/test", requireAuth, requireRoles("admin", "manager"), smtpController.testSMTPConnection);

// Database backup (Super Admin only for data privacy and security)
router.post("/backup/database", requireAuth, requireRoles("admin"), backupController.backupDatabase);

export default router;
