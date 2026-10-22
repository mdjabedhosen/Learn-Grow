import { Request, Response } from "express";
import * as service from "../service/siteContent.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const getByPage = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const result = await service.getSiteContent(page);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to load content") });
  }
};

export const upsert = async (req: Request, res: Response) => {
  try {
    const { page } = req.params;
    const { content } = req.body as { content: any };
    const result = await service.upsertSiteContent(page, content);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to save content") });
  }
};

export const upsertFromBody = async (req: Request, res: Response) => {
  try {
    const { page, content } = req.body as { page: string; content: any };
    const result = await service.upsertSiteContent(page, content);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({ success: false, message: publicErrorMessage(error, "Failed to save content") });
  }
};
