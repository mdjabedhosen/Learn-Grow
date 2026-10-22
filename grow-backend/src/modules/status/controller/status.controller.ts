import { Request, Response } from "express";
import { getSystemStatus } from "../service/status.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const status = async (_req: Request, res: Response) => {
  try {
    const result = await getSystemStatus();
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to get status") });
  }
};
