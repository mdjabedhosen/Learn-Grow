import { Course } from "../../course/model/course.model";
import { User } from "../../user/model/user.model";
import { Enrollment } from "../../enrollment/model/enrollment.model";
import { Certificate } from "../../certificate/model/certificate.model";
import QRCode from "qrcode";
import crypto from "crypto";
import { Request } from "express";

/** A course must be at least this complete before a certificate is issued. */
const COMPLETION_THRESHOLD = 95;

const getBaseUrl = (req: Request): string => {
  // Try to get base URL from request headers (for proper proxy/deployment support)
  const protocol = req.get("x-forwarded-proto") || req.protocol || "http";
  const host = req.get("x-forwarded-host") || req.get("host") || "localhost:5000";
  return `${protocol}://${host}`;
};

/**
 * The completion percentage of an enrollment.
 *
 * `progress` is a LESSON COUNT, not a percentage - a 12-lesson course
 * finished 100% stores `progress: 12`. The percentage lives in
 * `completionPercentage`, which is what a completion check must use.
 */
const completionPercentageOf = (enrollment: any): number => {
  if (!enrollment) return 0;

  const stored = Number(enrollment.completionPercentage);
  if (Number.isFinite(stored) && stored > 0) return stored;

  // Fall back to the lesson count when the percentage was never written.
  const completed = Array.isArray(enrollment.completedLessons)
    ? enrollment.completedLessons.length
    : 0;
  const total = Number(enrollment.totalLessons) || 0;

  if (total > 0) return Math.round((completed / total) * 100);
  return completed > 0 ? 100 : 0;
};

/**
 * Flat result shape (this repo compiles with `strict: false`, which disables
 * the narrowing a discriminated union would give us).
 */
interface EnrollmentEligibility {
  ok: boolean;
  enrollment?: any;
  message?: string;
}

/**
 * Load the enrollment and confirm the course is actually finished.
 *
 * The old check was:
 *   const progress = enrollment?.progress ?? 100;
 *   if (!enrollment || progress < 95) { }        // <- empty block
 * so it never rejected anything, and a missing enrollment defaulted to 100%.
 */
const requireCompletedEnrollment = async (
  studentId: string,
  courseId: string
): Promise<EnrollmentEligibility> => {
  const enrollment = await Enrollment.findOne({ studentId, courseId });

  if (!enrollment) {
    return {
      ok: false,
      message:
        "No enrollment found for this course. Enroll and complete the course before requesting a certificate.",
    };
  }

  const percentage = completionPercentageOf(enrollment);

  if (percentage < COMPLETION_THRESHOLD) {
    return {
      ok: false,
      message: `Course not completed (${percentage}%). A certificate requires at least ${COMPLETION_THRESHOLD}% completion.`,
    };
  }

  return { ok: true, enrollment };
};

/** An unguessable certificate id - the old scheme leaked the last 6 chars of
 *  the student and course ids and was enumerable. */
const buildCertificateId = (): string =>
  `CERT-${Date.now()}-${crypto.randomUUID().split("-")[0].toUpperCase()}`;

export const generateCertificate = async (
  studentId: string,
  courseId: string,
  req: Request
) => {
  try {
    // SECURITY: the completion check used to be an empty `if` block, so any
    // authenticated user could mint a valid-looking certificate for a course
    // they never enrolled in or never finished.
    const eligibility = await requireCompletedEnrollment(studentId, courseId);
    if (!eligibility.ok) {
      return { success: false, message: eligibility.message || "Course not completed" };
    }
    const { enrollment } = eligibility;

    // Fetch course and student details
    const course = await Course.findById(courseId).populate("instructorId", "name");
    const student = await User.findById(studentId);

    if (!course || !student) {
      return {
        success: false,
        message: "Course or student not found",
      };
    }

    // Generate unique certificate ID
    const certificateId = buildCertificateId();

    // Generate verification URL with dynamic base URL
    const baseUrl = getBaseUrl(req);
    const verificationUrl = `${baseUrl}/certificate/verify/${certificateId}`;

    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
    });

    // PERSIST the certificate. Verification used to match a 6-character
    // suffix of the student and course ids, which made it guessable; it now
    // looks the issued certificate up by its exact id.
    const issuedAt = enrollment.updatedAt || new Date();

    const certificateData = {
      certificateId,
      studentId,
      courseId,
      completionDate: issuedAt,
      qrCode: qrCodeData,
      verificationUrl,
      studentName: student.name,
      courseName: course.title,
      courseInstructor: (course.instructorId as any)?.name || "Learn & Grow",
      issuedAt,
      isValid: true,
    };

    await Certificate.findOneAndUpdate(
      { studentId, courseId },
      { $set: certificateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      success: true,
      message: "Certificate generated successfully",
      data: certificateData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to generate certificate",
    };
  }
};

export const getCertificate = async (
  studentId: string,
  courseId: string,
  req: Request
) => {
  try {
    // Same completion gate as generateCertificate.
    const eligibility = await requireCompletedEnrollment(studentId, courseId);
    if (!eligibility.ok) {
      return { success: false, message: eligibility.message || "Course not completed" };
    }
    const { enrollment } = eligibility;

    // An already-issued certificate is returned as-is.
    const existing = await Certificate.findOne({ studentId, courseId }).lean();
    if (existing) {
      return {
        success: true,
        message: "Certificate retrieved",
        data: {
          certificateId: existing.certificateId,
          studentId: existing.studentId,
          courseId: existing.courseId,
          completionDate: existing.completionDate,
          qrCode: existing.qrCode,
          verificationUrl: existing.verificationUrl,
          studentName: existing.studentName,
          courseName: existing.courseName,
          courseInstructor: existing.courseInstructor,
          issuedAt: existing.issuedAt,
          isValid: true,
        },
      };
    }

    // Generate certificate data on-the-fly
    const course = await Course.findById(courseId).populate("instructorId", "name");
    const student = await User.findById(studentId);

    if (!course || !student) {
      return {
        success: false,
        message: "Course or student not found",
      };
    }

    const certificateId = buildCertificateId();
    const baseUrl = getBaseUrl(req);
    const verificationUrl = `${baseUrl}/certificate/verify/${certificateId}`;

    const qrCodeData = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      width: 300,
      margin: 2,
    });

    const issuedAt = enrollment.updatedAt || new Date();

    const certificateData = {
      certificateId,
      studentId,
      courseId,
      completionDate: issuedAt,
      qrCode: qrCodeData,
      verificationUrl,
      studentName: student.name,
      courseName: course.title,
      courseInstructor: (course.instructorId as any)?.name || "Learn & Grow",
      issuedAt,
      isValid: true,
    };

    await Certificate.findOneAndUpdate(
      { studentId, courseId },
      { $set: certificateData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      success: true,
      data: certificateData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch certificate",
    };
  }
};

export const verifyCertificate = async (certificateId: string) => {
  try {
    // SECURITY: the old implementation scanned every enrollment and matched
    // the last 6 characters of the student and course ids, so certificate ids
    // were guessable. Verification now looks up the issued certificate by its
    // exact id.
    const certificate = await Certificate.findOne({
      certificateId: String(certificateId || "").trim(),
    }).lean();

    if (!certificate) {
      return {
        success: false,
        message: "Certificate not found or invalid",
        data: { isValid: false },
      };
    }

    // The student must still be enrolled and the course still completed.
    const eligibility = await requireCompletedEnrollment(
      certificate.studentId.toString(),
      certificate.courseId.toString()
    );
    if (!eligibility.ok) {
      return {
        success: false,
        message: "Certificate not found or invalid",
        data: { isValid: false },
      };
    }

    const student = await User.findById(certificate.studentId)
      .select("name email")
      .lean();
    const course = await Course.findById(certificate.courseId)
      .populate("instructorId", "name")
      .lean();

    return {
      success: true,
      message: "Certificate is valid",
      data: {
        isValid: true,
        certificate: {
          certificateId: certificate.certificateId,
          studentId: certificate.studentId,
          studentName: certificate.studentName,
          studentEmail: (student as any)?.email,
          courseId: certificate.courseId,
          courseName: certificate.courseName,
          courseInstructor: certificate.courseInstructor,
          completionDate: certificate.completionDate,
          issuedAt: certificate.issuedAt,
          qrCode: certificate.qrCode,
          verificationUrl: certificate.verificationUrl,
        },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify certificate",
      data: { isValid: false },
    };
  }
};

/**
 * The certificates a student has earned.
 *
 * A certificate is issued for every COMPLETED enrollment. The old query
 * filtered on `progress: 100`, but `progress` is a lesson count - so a
 * 12-lesson course finished 100% stored `progress: 12` and never appeared,
 * while a 200-lesson course at 50% stored `progress: 100` and wrongly
 * qualified. The completion percentage lives in `completionPercentage`.
 */
export const getStudentCertificates = async (studentId: string) => {
  try {
    const enrollments = await Enrollment.find({ studentId })
      .populate("courseId", "title thumbnail")
      .sort({ updatedAt: -1 });

    const certificates = [];

    for (const enrollment of enrollments as any[]) {
      const percentage = completionPercentageOf(enrollment);
      if (percentage < COMPLETION_THRESHOLD) continue;

      const courseId = enrollment.courseId?._id || enrollment.courseId;
      if (!courseId) continue;

      // Reuse the issued certificate when there is one, so the id stays
      // stable and the verification link keeps working.
      let certificate = await Certificate.findOne({
        studentId,
        courseId,
      }).lean();

      if (!certificate) {
        const course = enrollment.courseId;
        const student = await User.findById(studentId).select("name").lean();

        const certificateId = buildCertificateId();
        const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const verificationUrl = `${baseUrl}/certificate/verify/${certificateId}`;

        const qrCodeData = await QRCode.toDataURL(verificationUrl, {
          errorCorrectionLevel: "H",
          width: 300,
          margin: 2,
        });

        const issuedAt = enrollment.updatedAt || new Date();

        await Certificate.findOneAndUpdate(
          { studentId, courseId },
          {
            $set: {
              certificateId,
              studentId,
              courseId,
              completionDate: issuedAt,
              qrCode: qrCodeData,
              verificationUrl,
              studentName: student?.name || "",
              courseName: course?.title || "",
              courseInstructor: "Learn & Grow",
              issuedAt,
              isValid: true,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        certificate = {
          certificateId,
          courseId,
          completionDate: issuedAt,
          qrCode: qrCodeData,
          verificationUrl,
          isValid: true,
        } as any;
      }

      certificates.push({
        certificateId: certificate.certificateId,
        courseId: enrollment.courseId,
        courseName: certificate.courseName,
        studentName: certificate.studentName,
        completionDate: certificate.completionDate,
        qrCode: certificate.qrCode,
        verificationUrl: certificate.verificationUrl,
        isValid: true,
      });
    }

    return {
      success: true,
      message: "Certificates retrieved",
      data: certificates,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch certificates",
    };
  }
};
