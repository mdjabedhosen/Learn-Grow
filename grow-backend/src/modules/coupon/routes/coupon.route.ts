import { publicFormRateLimiter } from "@/middleware/security.middleware";
import { Router } from "express";
import * as controller from "../controller/coupon.controller.js";
import { requireAuth, requireRoles } from "../../../middleware/auth.js";

const router = Router();

// Public validation endpoint for checkout
router.post("/validate", publicFormRateLimiter, controller.validateCoupon);

// Protected routes for Admin and Manager
router.use(requireAuth);
router.use(requireRoles("admin", "manager"));

router.get("/", controller.getAllCoupons);
router.get("/:id", controller.getCouponById);
router.post("/", controller.createCoupon);
router.patch("/:id", controller.updateCoupon);
router.delete("/:id", controller.deleteCoupon);

export default router;
