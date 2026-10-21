import express from "express";
import multer from "multer";
import * as controller from "../controller/course.controller";
import * as thumbnailController from "../controller/thumbnail.controller";
import * as schema from "../schema/course.schema";
import { validate } from "@/middleware/validate";
import { requireAuth, requireRoles, requireApprovedInstructor, optionalAuth } from "@/middleware/auth";
import { checkCourseAccess, checkContentAccess } from "@/middleware/course-access";

const router = express.Router();
/**
 * Only image uploads are accepted.
 *
 * SECURITY: multer had no `fileFilter`, so any file type could be uploaded
 * and then hosted on the organisation's Cloudinary account.
 */
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const imageFileFilter = (
  _req: any,
  file: { mimetype: string; originalname?: string },
  cb: (error: Error | null, acceptFile?: boolean) => void
) => {
  if (ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error(
      `Unsupported file type "${file.mimetype}". Only images (JPEG, PNG, WebP, GIF, AVIF) are allowed.`
    )
  );
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: imageFileFilter,
});

// ===== COURSE ROUTES =====

router.post(
  "/create-course",
  requireAuth,
  requireRoles("admin", "instructor"),
  requireApprovedInstructor,
  validate(schema.createCourseSchema),
  controller.createCourse
);

router.get("/get-all-courses", optionalAuth, controller.getAllCourses);

router.get("/get-courses-count", optionalAuth, controller.getCoursesCount);

router.get("/get-published-courses", controller.getPublishedCourses);

router.get("/get-featured-courses", controller.getFeaturedCourses);

router.get(
  "/get-course/:id",
  optionalAuth,
  validate(schema.courseIdSchema),
  controller.getCourseById
);

// Course statistics endpoint - optimized for instructor dashboard
router.get(
  "/get-course-stats/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.courseIdSchema),
  controller.getCourseStats
);

router.patch(
  "/update-course/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.updateCourseSchema),
  controller.updateCourse
);

router.delete(
  "/delete-course/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.courseIdSchema),
  controller.deleteCourse
);

router.get(
  "/get-instructor-courses/:instructorId",
  controller.getCoursesByInstructor
);

router.get(
  "/get-category-courses/:category",
  controller.getCoursesByCategory
);

// ===== MODULE ROUTES =====

router.post(
  "/create-module",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.createModuleSchema),
  controller.createModule
);

router.get(
  "/get-modules/:courseId",
  controller.getModulesByCourse
);

router.get(
  "/get-module/:id",
  validate(schema.moduleIdSchema),
  controller.getModuleById
);

router.patch(
  "/update-module/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.updateModuleSchema),
  controller.updateModule
);

router.delete(
  "/delete-module/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.moduleIdSchema),
  controller.deleteModule
);

// ===== LESSON ROUTES =====

router.post(
  "/create-lesson",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.createLessonSchema),
  controller.createLesson
);

// SECURITY: these returned lesson content URLs (video/PDF links) to
// anonymous callers. They are now behind an authentication + course-access
// check. Free-preview lessons stay reachable.
router.get(
  "/get-lessons/:moduleId",
  requireAuth,
  checkContentAccess,
  controller.getLessonsByModule
);

router.get(
  "/get-lesson/:id",
  requireAuth,
  checkContentAccess,
  validate(schema.lessonIdSchema),
  controller.getLessonById
);

router.patch(
  "/update-lesson/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.updateLessonSchema),
  controller.updateLesson
);

router.delete(
  "/delete-lesson/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.lessonIdSchema),
  controller.deleteLesson
);

router.post(
  "/complete-lesson/:id",
  requireAuth,
  validate(schema.lessonIdSchema),
  controller.completeLesson
);

router.get("/get-free-lessons", controller.getFreeLessons);

// ===== COURSE PUBLISHING & APPROVAL ROUTES =====

router.patch(
  "/publish-course/:id",
  requireAuth,
  requireRoles("instructor"),
  controller.publishCourse
);

router.patch(
  "/unpublish-course/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  controller.unpublishCourse
);

router.patch(
  "/approve-course/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.approveCourse
);

router.patch(
  "/reject-course/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.rejectCourseApproval
);

router.get(
  "/pending-approval-courses",
  requireAuth,
  requireRoles("admin", "manager"),
  controller.getPendingApprovalCourses
);

// ===== COURSE REGISTRATION ROUTES =====

router.patch(
  "/set-registration-open/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.setRegistrationOpenSchema),
  controller.setRegistrationOpen
);

router.patch(
  "/set-registration-deadline/:id",
  requireAuth,
  requireRoles("admin", "instructor"),
  validate(schema.setRegistrationDeadlineSchema),
  controller.setRegistrationDeadline
);

router.patch(
  "/admin/set-registration/:id",
  requireAuth,
  requireRoles("admin", "manager"),
  validate(schema.adminSetRegistrationSchema),
  controller.adminSetRegistration
);

// ===== COURSE THUMBNAIL ROUTES =====

router.post(
  "/upload-thumbnail/:courseId",
  requireAuth,
  requireRoles("admin", "instructor"),
  upload.single("thumbnail"),
  thumbnailController.uploadCourseThumbnail
);

router.delete(
  "/delete-thumbnail/:courseId",
  requireAuth,
  requireRoles("admin", "instructor"),
  thumbnailController.deleteCourseThumbnail
);

export default router;
