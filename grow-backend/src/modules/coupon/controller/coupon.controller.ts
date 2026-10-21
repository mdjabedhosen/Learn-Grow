import { Request, Response } from "express";
import * as service from "../service/coupon.service.js";

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id;
    const coupon = await service.createCoupon(req.body, userId);
    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create coupon",
    });
  }
};

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await service.getAllCoupons(req.query);
    res.status(200).json({
      success: true,
      message: "Coupons retrieved successfully",
      data: coupons,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve coupons",
    });
  }
};

export const getCouponById = async (req: Request, res: Response) => {
  try {
    const coupon = await service.getCouponById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }
    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to get coupon",
    });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const updated = await service.updateCoupon(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update coupon",
    });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const result = await service.deleteCoupon(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to delete coupon",
    });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code, orderAmount, courseId } = req.body;
    const amount = Number(orderAmount) || 0;
    const result = await service.validateCoupon(code, amount, courseId);
    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Invalid coupon",
    });
  }
};
