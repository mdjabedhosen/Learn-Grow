import { Request, Response } from "express";
import * as batchService from "../service/batch.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const getAllBatchesAdmin = async (req: Request, res: Response) => {
  try {
    const { courseId, instructorId, status, search } = req.query;
    const batches = await batchService.getAllBatchesAdmin({
      courseId: courseId as string,
      instructorId: instructorId as string,
      status: status as string,
      search: search as string,
    });

    res.status(200).json({
      success: true,
      message: "Batches retrieved successfully",
      data: batches,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: publicErrorMessage(error, "Failed to retrieve batches"),
    });
  }
};

export const createBatchAdmin = async (req: Request, res: Response) => {
  try {
    const batch = await batchService.createBatchAdmin(req.body);
    res.status(201).json({
      success: true,
      message: "Batch created successfully",
      data: batch,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: publicErrorMessage(error, "Failed to create batch"),
    });
  }
};

export const updateBatchAdmin = async (req: Request, res: Response) => {
  try {
    const batch = await batchService.updateBatchAdmin(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Batch updated successfully",
      data: batch,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: publicErrorMessage(error, "Failed to update batch"),
    });
  }
};

export const assignStudentAdmin = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: "studentId is required" });
    }

    const batch = await batchService.assignStudentToBatchAdmin(req.params.id, studentId);
    res.status(200).json({
      success: true,
      message: "Student assigned to batch successfully",
      data: batch,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: publicErrorMessage(error, "Failed to assign student to batch"),
    });
  }
};

export const removeStudentAdmin = async (req: Request, res: Response) => {
  try {
    const { id, studentId } = req.params;
    const batch = await batchService.removeStudentFromBatchAdmin(id, studentId);
    res.status(200).json({
      success: true,
      message: "Student removed from batch successfully",
      data: batch,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: publicErrorMessage(error, "Failed to remove student from batch"),
    });
  }
};

export const deleteBatchAdmin = async (req: Request, res: Response) => {
  try {
    const result = await batchService.deleteBatchAdmin(req.params.id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: publicErrorMessage(error, "Failed to delete batch"),
    });
  }
};

export const getInstructorBatches = async (req: Request, res: Response) => {
  try {
    const userRole = (req as any).user?.role || (req as any).userRole;
    let instructorId = (req as any).user?._id || (req as any).user?.id || req.userId;

    // If admin or manager specifies a target instructorId in query
    if ((userRole === "admin" || userRole === "manager") && req.query.instructorId) {
      instructorId = req.query.instructorId as string;
    }

    if (!instructorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const batches = await batchService.getInstructorBatches(instructorId);
    res.status(200).json({
      success: true,
      message: "Instructor batches retrieved successfully",
      data: batches,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: publicErrorMessage(error, "Failed to retrieve instructor batches"),
    });
  }
};

export const updateBatchInstructor = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user?._id || (req as any).user?.id || req.userId;
    const { id } = req.params;

    if (!instructorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const batch = await batchService.updateBatchInstructor(id, instructorId, req.body);
    res.status(200).json({
      success: true,
      message: "Batch details updated successfully",
      data: batch,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: publicErrorMessage(error, "Failed to update batch details"),
    });
  }
};

export const getStudentBatch = async (req: Request, res: Response) => {
  try {
    const studentId = (req as any).user?._id || (req as any).user?.id || req.userId;
    const { courseId } = req.params;

    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const batch = await batchService.getStudentBatch(courseId, studentId);
    res.status(200).json({
      success: true,
      message: "Student batch info retrieved successfully",
      data: batch,
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: publicErrorMessage(error, "Failed to retrieve student batch"),
    });
  }
};

export const syncBatches = async (_req: Request, res: Response) => {
  try {
    await batchService.syncExistingEnrollmentsToBatches();
    res.status(200).json({
      success: true,
      message: "Existing enrollments synced into batches successfully",
    });
  } catch (error: any) {
    res.status(publicErrorStatus(error)).json({
      success: false,
      message: publicErrorMessage(error, "Failed to sync batches"),
    });
  }
};
