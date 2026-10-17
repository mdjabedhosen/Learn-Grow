import express from "express";
import * as controller from "../controller/job.controller";
import * as applicationController from "../controller/jobApplication.controller";
import * as emailController from "../controller/emailController";
import * as schema from "../schema/job.schema";
import * as applicationSchema from "../schema/jobApplication.schema";
import { validate } from "@/middleware/validate";
import { requireAuth, requireRoles } from "@/middleware/auth";

const router = express.Router();

// ========== JOB POST ROUTES ==========

// Get all job posts with filters and pagination (Admin, Manager, and Public view)
router.get(
  "/get-all-jobs",
  validate(schema.getJobPostsQuerySchema),
  controller.getAllJobPosts
);

// Get only published job posts (Public)
router.get("/get-published-jobs", controller.getPublishedJobPosts);

// Get remote job posts (Public)
router.get("/get-remote-jobs", controller.getRemoteJobPosts);

// Get job posts by department (Public)
router.get("/get-jobs-by-department/:department", controller.getJobPostsByDepartment);

// Get single job post by ID (Public)
router.get(
  "/get-single-job/:id",
  validate(schema.jobPostIdSchema),
  controller.getJobPostById
);

// Create new job post (Admin & Manager)
router.post(
  "/create-job",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(schema.createJobPostSchema),
  controller.createJobPost
);

// Update job post (Admin & Manager)
router.patch(
  "/update-job/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(schema.updateJobPostSchema),
  controller.updateJobPost
);

// Publish job post (Admin & Manager)
router.patch(
  "/publish-job/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(schema.jobPostIdSchema),
  controller.publishJobPost
);

// Unpublish job post (Admin & Manager)
router.patch(
  "/unpublish-job/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(schema.jobPostIdSchema),
  controller.unpublishJobPost
);

// Delete job post (Admin & Manager)
router.delete(
  "/delete-job/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(schema.jobPostIdSchema),
  controller.deleteJobPost
);

// ========== JOB APPLICATION ROUTES ==========

// Apply for a job OR submit direct CV (Public for all applicants)
router.post(
  "/apply",
  validate(applicationSchema.applyForJobSchema),
  applicationController.applyForJob
);

// Get all applications with filters (Admin & Manager)
router.get(
  "/applications",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(applicationSchema.getApplicationsSchema),
  applicationController.getApplications
);

// Get applications for a specific job (Admin & Manager)
router.get(
  "/applications/by-job/:jobId",
  requireAuth,
  requireRoles("admin", "manager"),
  applicationController.getApplicationsByJobId
);

// Get single application by ID (Admin & Manager)
router.get(
  "/applications/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(applicationSchema.applicationIdSchema),
  applicationController.getApplicationById
);

// Update application status (Admin & Manager)
router.patch(
  "/applications/:id/status",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(applicationSchema.updateApplicationStatusSchema),
  applicationController.updateApplicationStatus
);

// Delete application (Admin & Manager)
router.delete(
  "/applications/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(applicationSchema.applicationIdSchema),
  applicationController.deleteApplication
);

// Get application statistics (Admin & Manager)
router.get(
  "/applications/stats/overview",
  requireAuth,
  requireRoles("admin", "manager"),
  applicationController.getApplicationStats
);

// ========== EMAIL ROUTES (Admin & Manager) ==========

// Send email to applicant
router.post(
  "/send-email",
  requireAuth,
  requireRoles("admin", "manager"),
  emailController.sendEmail
);

// Get email history for an application
router.get(
  "/email-history/:applicationId",
  requireAuth,
  requireRoles("admin", "manager"),
  emailController.getEmailHistory
);

// Get latest email for an application
router.get(
  "/email-latest/:applicationId",
  requireAuth,
  requireRoles("admin", "manager"),
  emailController.getLatestEmail
);

// Test email configuration
router.get(
  "/email/test",
  requireAuth,
  requireRoles("admin", "manager"),
  emailController.testConnection
);

export default router;
