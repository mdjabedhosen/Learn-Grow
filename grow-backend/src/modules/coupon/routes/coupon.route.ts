import { publicFormRateLimiter } from "@/middleware/security.middleware";
import { Router } from "express";
import * as controller from "../controller/coupon.controller.js";
import { verifyToken, authorize } from "../../../middleware/auth.middleware.js";

const router = Router();

// Public validation endpoint for checkout
router.post("/validate", publicFormRateLimiter, controller.validateCoupon);

// Protected routes for Admin and Manager
router.use(verifyToken);
router.use(authorize("admin", "manager"));

router.get("/", controller.getAllCoupons);
router.get("/:id", controller.getCouponById);
router.post("/", controller.createCoupon);
router.patch("/:id", controller.updateCoupon);
router.delete("/:id", controller.deleteCoupon);

export default router;
