import { Request, Response } from "express";
import * as service from "../service/settings.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const getCommission = async (_req: Request, res: Response) => {
  try {
    const result = await service.getCommission();
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to get commission") });
  }
};

export const updateCommission = async (req: Request, res: Response) => {
  try {
    const { platformCommissionPercent, kitPrice } = req.body as { platformCommissionPercent: number; kitPrice?: number };
    const result = await service.updateCommission(Number(platformCommissionPercent), kitPrice !== undefined ? Number(kitPrice) : undefined);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to update commission") });
  }
};
