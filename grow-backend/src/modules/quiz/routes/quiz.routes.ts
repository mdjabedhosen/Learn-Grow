import express from "express";
import { validate } from "@/middleware/validate";
import { requireAuth, requireRoles } from "@/middleware/auth";
import * as schema from "../schema/quiz.schema";
import * as controller from "../controller/quiz.controller";
import * as submissionController from "../controller/quizSubmission.controller";

const router = express.Router();

// Create quiz
router.post(
  "/create",
  requireAuth,
  requireRoles("instructor", "admin"),
  validate(schema.createQuizSchema),
  controller.create
);

// Get quizzes by course
router.get(
  "/course/:courseId",
  requireAuth,
  validate(schema.courseIdSchema),
  controller.listByCourse
);

// Get quiz by ID
router.get(
  "/:id",
  requireAuth,
  validate(schema.quizIdSchema),
  controller.getById
);

// Update quiz
router.patch(
  "/:id",
  requireAuth,
  requireRoles("instructor", "admin"),
  validate(schema.updateQuizSchema),
  controller.update
);

// Publish/unpublish quiz
router.patch(
  "/:id/publish",
  requireAuth,
  requireRoles("instructor", "admin"),
  validate(schema.publishQuizSchema),
  controller.publish
);

// Delete quiz
router.delete(
  "/:id",
  requireAuth,
  requireRoles("instructor", "admin"),
  validate(schema.quizIdSchema),
  controller.remove
);

// Submit a quiz attempt.
// The quiz used to be scored entirely in the browser, so the student chose
// their own score and the server never learned that the quiz was completed.
router.post(
  "/:id/submit",
  requireAuth,
  validate(schema.quizIdSchema),
  submissionController.submit
);

// The student's own attempts for a quiz
router.get(
  "/:id/my-submissions",
  requireAuth,
  validate(schema.quizIdSchema),
  submissionController.mySubmissions
);

export default router;
