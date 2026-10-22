import { Request, Response } from "express";
import * as smtpService from "../service/smtp.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const getSMTPConfig = async (req: Request, res: Response) => {
  try {
    const result = await smtpService.getSMTPConfig();
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to get SMTP config") });
  }
};

export const updateSMTPConfig = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await smtpService.updateSMTPConfig(data);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to update SMTP config") });
  }
};

export const testSMTPConnection = async (req: Request, res: Response) => {
  try {
    const { testEmail } = req.body;
    const result = await smtpService.testSMTPConnection(testEmail);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "SMTP test failed") });
  }
};
