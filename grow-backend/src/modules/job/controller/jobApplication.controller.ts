import { Request, Response } from "express";
import * as service from "../service/jobApplication.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const application = await service.applyForJob({
      ...req.body,
      userId: req.userId,
      req,
      eventId: req.body?.eventId,
    });
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error: any) {
    if (error.message.includes("already applied")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to submit application",
      error: publicErrorMessage(error),
    });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const result = await service.getApplications(req.query as any);
    res.json({
      success: true,
      message: "Applications retrieved successfully",
      data: result.applications,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve applications",
      error: publicErrorMessage(error),
    });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const application = await service.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    res.json({
      success: true,
      message: "Application retrieved successfully",
      data: application,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve application",
      error: publicErrorMessage(error),
    });
  }
};

export const getApplicationsByJobId = async (req: Request, res: Response) => {
  try {
    const applications = await service.getApplicationsByJobId(req.params.jobId);
    res.json({
      success: true,
      message: "Applications retrieved successfully",
      data: applications,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve applications",
      error: publicErrorMessage(error),
    });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const application = await service.updateApplicationStatus(
      req.params.id,
      req.body.status
    );
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    res.json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to update application status",
      error: publicErrorMessage(error),
    });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await service.deleteApplication(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to delete application",
      error: publicErrorMessage(error),
    });
  }
};

export const getApplicationStats = async (_: Request, res: Response) => {
  try {
    const stats = await service.getApplicationStats();
    res.json({
      success: true,
      message: "Application stats retrieved successfully",
      data: stats,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: "Failed to retrieve application stats",
      error: publicErrorMessage(error),
    });
  }
};
