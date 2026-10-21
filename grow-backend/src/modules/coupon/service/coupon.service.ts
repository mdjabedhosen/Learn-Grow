import { escapeRegex } from "@/utils/sanitizeSearch";
import { Coupon, ICoupon } from "../model/coupon.model.js";
import { Types } from "mongoose";

export const createCoupon = async (data: Partial<ICoupon>, userId?: string) => {
  const cleanCode = data.code?.trim().toUpperCase();
  if (!cleanCode) throw new Error("Coupon code is required");

  const existing = await Coupon.findOne({ code: cleanCode });
  if (existing) throw new Error(`Coupon with code "${cleanCode}" already exists`);

  const coupon = await Coupon.create({
    ...data,
    code: cleanCode,
    createdBy: userId ? new Types.ObjectId(userId) : undefined,
  });

  return coupon;
};

export const getAllCoupons = async (query: any = {}) => {
  const filter: any = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === "true" || query.isActive === true;
  }

  if (query.search) {
    // SECURITY: the raw search string was used as a $regex, so a crafted
    // pattern could cause catastrophic backtracking (ReDoS). escapeRegex
    // escapes the metacharacters and caps the length.
    const safeSearch = escapeRegex(query.search);
    if (safeSearch) {
      filter.$or = [
        { code: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }
  }

  const coupons = await Coupon.find(filter)
    .populate("applicableCourses", "title price thumbnail")
    .sort({ createdAt: -1 });

  return coupons;
};

export const getCouponById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Coupon ID");
  return Coupon.findById(id).populate("applicableCourses", "title price thumbnail");
};

export const updateCoupon = async (id: string, data: Partial<ICoupon>) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Coupon ID");

  if (data.code) {
    data.code = data.code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: data.code, _id: { $ne: id } });
    if (existing) throw new Error(`Coupon code "${data.code}" is already in use by another coupon`);
  }

  const updated = await Coupon.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!updated) throw new Error("Coupon not found");
  return updated;
};

export const deleteCoupon = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Coupon ID");
  const deleted = await Coupon.findByIdAndDelete(id);
  if (!deleted) throw new Error("Coupon not found");
  return { success: true, message: "Coupon deleted successfully" };
};

export const validateCoupon = async (code: string, orderAmount: number, courseId?: string) => {
  if (!code) throw new Error("Please enter a coupon code");
  const cleanCode = code.trim().toUpperCase();

  const coupon = await Coupon.findOne({ code: cleanCode });
  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (!coupon.isActive) {
    throw new Error("This coupon is currently inactive");
  }

  // SECURITY/CORRECTNESS: the expiry was compared as an instant, so a
  // date-only expiry died at 00:00 UTC on its LAST day - a coupon that says
  // "valid until 2026-10-21" was already dead at the start of that day.
  // A date-only value now covers the whole day (until 23:59:59.999 local
  // time of that date).
  if (coupon.expiryDate) {
    const expiry = new Date(coupon.expiryDate);
    if (isNaN(expiry.getTime())) {
      throw new Error("This coupon has an invalid expiry date");
    }

    // A date that was stored as midnight (no time component) means "valid
    // through the end of that day".
    const isDateOnly =
      expiry.getHours() === 0 &&
      expiry.getMinutes() === 0 &&
      expiry.getSeconds() === 0 &&
      expiry.getMilliseconds() === 0;
    const effectiveExpiry = isDateOnly
      ? new Date(expiry.getTime() + 24 * 60 * 60 * 1000 - 1)
      : expiry;

    if (effectiveExpiry < new Date()) {
      throw new Error("This coupon has expired");
    }
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    throw new Error("This coupon has reached its maximum usage limit");
  }

  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount of ৳${coupon.minOrderAmount} required for this coupon`);
  }

  if (coupon.applicableCourses && coupon.applicableCourses.length > 0 && courseId) {
    const isApplicable = coupon.applicableCourses.some(
      (cId) => cId.toString() === courseId.toString()
    );
    if (!isApplicable) {
      throw new Error("This coupon is not valid for this specific course");
    }
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((orderAmount * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    discountAmount = Math.min(coupon.discountValue, orderAmount);
  }

  const finalAmount = Math.max(0, orderAmount - discountAmount);

  return {
    isValid: true,
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    originalAmount: orderAmount,
    finalAmount,
  };
};

export const recordCouponUsage = async (code: string) => {
  if (!code) return;
  const cleanCode = code.trim().toUpperCase();
  // Atomic guard: only increment while the coupon is still under its usage
  // limit, so concurrent approvals cannot push usedCount past maxUses.
  const result = await Coupon.updateOne(
    {
      code: cleanCode,
      $or: [
        { maxUses: null },
        { maxUses: { $exists: false } },
        { $expr: { $lt: ["$usedCount", "$maxUses"] } },
      ],
    },
    { $inc: { usedCount: 1 } }
  );

  if (result.modifiedCount === 0) {
    throw new Error("This coupon has reached its maximum usage limit");
  }
};
