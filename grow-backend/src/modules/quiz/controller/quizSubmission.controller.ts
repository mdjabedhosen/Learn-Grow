import { Request, Response } from "express";

import * as submissionService from "../service/quizSubmission.service";
import { publicErrorMessage, publicErrorStatus } from "@/utils/publicError";

export const submit = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { answers } = req.body || {};

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    const result = await submissionService.submitQuiz({
      quizId: req.params.id,
      studentId: userId,
      answers,
    });

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({
      success: false,
      message: publicErrorMessage(error, "Failed to submit quiz"),
    });
  }
};

export const mySubmissions = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const result = await submissionService.getMyQuizSubmissions(
      req.params.id,
      userId
    );

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(publicErrorStatus(error)).json({
      success: false,
      message: publicErrorMessage(error, "Failed to fetch submissions"),
    });
  }
};
