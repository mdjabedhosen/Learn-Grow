/**
 * Restores the parts of the 2026-10-16 MongoDB backup that the current
 * `learn-grow` database is missing, adapted to the current schema.
 *
 * Rules:
 *  - Only collections that are actually missing/partial are touched.
 *  - Documents keep their original `_id` so the references inside the backup
 *    keep resolving (orders -> paymentmethods, emaillogs -> jobapplications,
 *    enrollments -> lessons).
 *  - Course ids changed between the old and the new database, so they are
 *    remapped by slug.
 *  - A document whose required reference cannot be resolved is skipped
 *    rather than restored as an orphan.
 *  - Mongoose's `strict` mode drops the fields the current schema no longer
 *    has, so the new structure is respected automatically.
 *
 * Usage: node --import tsx scripts/restoreFromBackup.ts [--apply]
 */
import fs from "fs";
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";

import { Course } from "../src/modules/course/model/course.model.js";
import { Combo } from "../src/modules/course/model/combo.model.js";
import { Lesson } from "../src/modules/course/model/lesson.model.js";
import { Module } from "../src/modules/course/model/module.model.js";
import { Enrollment } from "../src/modules/enrollment/model/enrollment.model.js";
import { JobPost } from "../src/modules/job/model/jobPost.model.js";
import { JobApplication } from "../src/modules/job/model/jobApplication.model.js";
import { EmailLog } from "../src/modules/job/model/emailLog.model.js";
import { LiveClass } from "../src/modules/liveClass/model/liveClass.model.js";
import { Order } from "../src/modules/order/model/order.model.js";
import { PaymentMethod } from "../src/modules/payment/model/payment-method.model.js";
import { Contact } from "../src/modules/contact/model/contact.model.js";
import { EventRegistration } from "../src/modules/event/model/event-registration.model.js";
import { TeamMember } from "../src/modules/team/model/team.model.js";
import { SMTPConfig } from "../src/modules/settings/model/smtpConfig.model.js";

const BACKUP_DIR = "/Users/mjabed3834/Downloads/mongodb-backup-2026-10-16";
const APPLY = process.argv.includes("--apply");

const read = (f: string): any[] => {
  const p = `${BACKUP_DIR}/${f}`;
  if (!fs.existsSync(p)) return [];
  try {
    const r = JSON.parse(fs.readFileSync(p, "utf-8"));
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
};

const oid = (v: any) =>
  typeof v === "string" && /^[a-fA-F0-9]{24}$/.test(v)
    ? new mongoose.Types.ObjectId(v)
    : null;

const log = (...a: any[]) => console.log("  ", ...a);

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const db = mongoose.connection.db!;

  // ---------- reference maps ----------
  const courses = await Course.find({}).lean();
  const courseById = new Map(courses.map((c: any) => [c._id.toString(), c]));
  const courseBySlug = new Map(courses.map((c: any) => [c.slug, c]));
  const courseByTitle = new Map(
    courses.map((c: any) => [String(c.title || "").toLowerCase(), c])
  );

  const users = await db.collection("users").find({}).toArray();
  const userIds = new Set(users.map((u: any) => u._id.toString()));

  const lessonIds = new Set(
    (await Lesson.find({}).lean()).map((l: any) => l._id.toString())
  );
  const moduleIds = new Set(
    (await Module.find({}).lean()).map((m: any) => m._id.toString())
  );

  // The old database used different course _ids for the same two courses.
  // Map the backup's ids onto the current ones by slug / title.
  const backupCourses = read("courses.json");
  const courseIdMap = new Map<string, string>();
  for (const bc of backupCourses) {
    const oldId = String(bc._id);
    let hit =
      courseBySlug.get(bc.slug) ||
      courseByTitle.get(String(bc.title || "").toLowerCase());
    if (!hit) {
      // The seeder already maps these two by hand.
      if (oldId === "69ca5603e9e96ed80529474a") hit = courseBySlug.get("junior-robotics");
      if (oldId === "69ce553ce9e96ed805295101")
        hit = courseBySlug.get("python-programming-for-teens");
    }
    if (hit) courseIdMap.set(oldId, hit._id.toString());
  }
  log("course id map:", [...courseIdMap.entries()].map(([a, b]) => `${a}->${b}`).join("  ") || "(none)");

  const remapCourse = (v: any): any => {
    if (!v) return v;
    const s = String(v);
    if (courseIdMap.has(s)) return oid(courseIdMap.get(s));
    return oid(v);
  };

  const report: any[] = [];
  const inserted: any[] = [];

  const restore = async (
    label: string,
    Model: any,
    docs: any[],
    transform: (d: any) => any | null,
    opts: { keepId?: boolean } = {}
  ) => {
    if (!APPLY) {
      // Dry run: report what would happen, write nothing.
      for (const raw of docs) {
        const doc = transform(raw);
        if (!doc) continue;
      }
      report.push({ label, restored: 0, skipped: 0, total: docs.length });
      return;
    }
    let restored = 0;
    let skipped = 0;
    for (const raw of docs) {
      const doc = transform(raw);
      if (!doc) {
        skipped++;
        continue;
      }
      try {
        if (opts.keepId !== false) doc._id = oid(raw._id);
        await Model.create(doc);
        restored++;
      } catch (err: any) {
        skipped++;
        log(`  ! ${label} ${raw._id ?? raw.name ?? ""} -> ${err.code || ""} ${String(err.message).slice(0, 90)}`);
      }
    }
    report.push({ label, restored, skipped, total: docs.length });
    log(
      `${label.padEnd(18)} restored=${restored} skipped=${skipped} of ${docs.length}`
    );
  };

  // ---------- 1. payment methods (orders point at these) ----------
  await restore(
    "paymentmethods",
    PaymentMethod,
    read("paymentmethods.json"),
    (d) => ({
      name: d.name,
      accountNumber: d.accountNumber,
      paymentNote: d.paymentNote,
      isActive: d.isActive !== false,
      order: d.order,
    })
  );

  // ---------- 2. job posts (the careers page is empty without them) ----------
  await restore(
    "jobposts",
    JobPost,
    read("jobposts.json"),
    (d) => {
      if (!d.title || !d.description) return null;
      return {
        title: d.title,
        jobType: d.jobType || "Internship",
        department: d.department || "General",
        location: d.location || "REMOTE",
        salaryRange: d.salaryRange,
        description: d.description,
        requirements: Array.isArray(d.requirements) ? d.requirements : [],
        isPublished: d.isPublished !== false,
        isRemote: d.isRemote ?? /remote/i.test(String(d.location || "")),
        postedAt: d.postedAt ? new Date(d.postedAt) : new Date(),
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : undefined,
      };
    }
  );

  // ---------- 3. job applications ----------
  await restore(
    "jobapplications",
    JobApplication,
    read("jobapplications.json"),
    (d) => {
      if (!d.email || !d.fullName || !d.resumeUrl) return null;
      return {
        jobId: oid(d.jobId),
        applicationType: d.applicationType || "job",
        positionOfInterest: d.positionOfInterest,
        userId: d.userId ? oid(d.userId) : undefined,
        email: d.email,
        fullName: d.fullName,
        phone: d.phone || "",
        resumeUrl: d.resumeUrl,
        linkedinProfile: d.linkedinProfile,
        additionalInfo: d.additionalInfo,
        status: d.status || "pending",
        appliedAt: d.appliedAt ? new Date(d.appliedAt) : new Date(),
        updatedAt: new Date(),
      };
    }
  );

  // ---------- 4. email logs (reference job applications) ----------
  await restore(
    "emaillogs",
    EmailLog,
    read("emaillogs.json"),
    (d) => {
      if (!d.applicationId || !d.recipientEmail) return null;
      return {
        applicationId: oid(d.applicationId),
        recipientEmail: d.recipientEmail,
        recipientName: d.recipientName || "",
        subject: d.subject || "",
        message: d.message || "",
        status: d.status || "sent",
        sentAt: d.sentAt ? new Date(d.sentAt) : undefined,
        error: d.error,
      };
    }
  );

  // ---------- 5. team members (the /team page shows 6 of the real 12) ----------
  const existingTeam = await TeamMember.find({}).lean();
  const existingNames = new Set(
    existingTeam.map((t: any) => String(t.name || "").trim().toLowerCase())
  );
  await restore(
    "teammembers",
    TeamMember,
    read("teammembers.json"),
    (d) => {
      if (!d.name) return null;
      const key = String(d.name).trim().toLowerCase();
      if (existingNames.has(key)) return null; // already there
      existingNames.add(key);
      return {
        name: d.name,
        role: d.role,
        image: d.image,
        imageSize: d.imageSize,
        linkedIn: d.linkedIn,
        twitter: d.twitter,
        bio: d.bio,
        ...(d.userId ? { userId: oid(d.userId) } : {}),
      };
    }
  );

  // ---------- 6. combo package ----------
  await restore(
    "combos",
    Combo,
    read("combos.json"),
    (d) => {
      if (!d.name) return null;
      const courseRefs = Array.isArray(d.courses) ? d.courses : [];
      const remapped = courseRefs.map(remapCourse).filter(Boolean);
      if (!remapped.length) return null; // no course survives -> not useful
      return {
        name: d.name,
        description: d.description,
        courses: remapped,
        price: d.price ?? d.discountPrice ?? 0,
        discountPrice: d.discountPrice,
        duration: d.duration || "3-months",
        featured: d.featured,
        isActive: d.isActive !== false,
        createdBy: d.createdBy ? oid(d.createdBy) : users[0]?._id,
        thumbnail: d.thumbnail,
      };
    }
  );

  // ---------- 7. live class ----------
  await restore(
    "liveclasses",
    LiveClass,
    read("liveclasses.json"),
    (d) => {
      const courseId = remapCourse(d.courseId);
      if (!courseId) return null;
      if (d.instructorId && !userIds.has(String(d.instructorId))) return null;
      return {
        title: d.title,
        courseId,
        instructorId: oid(d.instructorId),
        scheduledAt: d.scheduledAt ? new Date(d.scheduledAt) : new Date(),
        duration: d.duration ?? 60,
        platform: d.platform || "Meet",
        meetingLink: d.meetingLink || "",
        status: d.status || "Scheduled",
        isApproved: d.isApproved ?? false,
        recordedLink: d.recordedLink,
      };
    }
  );

  // ---------- 8. SMTP config ----------
  // The Gmail app password was rotated, so the stored one is stale. The
  // config is restored inactive: the admin sets the new password in
  // Admin -> Settings -> SMTP.
  await restore(
    "smtpconfigs",
    SMTPConfig,
    read("smtpconfigs.json"),
    (d) => {
      if (!d.host) return null;
      return {
        host: d.host,
        port: d.port ?? 465,
        secure: d.secure ?? true,
        user: d.user || "",
        password: d.password || "",
        fromName: d.fromName || "Learn & Grow",
        fromEmail: d.fromEmail || "",
        replyTo: d.replyTo,
        isActive: false,
      };
    }
  );

  // ---------- 9. contact submissions ----------
  await restore(
    "contacts",
    Contact,
    read("contacts.json"),
    (d) => {
      if (!d.email || !d.message) return null;
      return {
        firstName: d.firstName || "",
        lastName: d.lastName || "",
        email: d.email,
        phone: d.phone,
        subject: d.subject || "General enquiry",
        message: d.message,
        isRead: d.isRead ?? false,
      };
    }
  );

  // ---------- 10. orders (need their user + payment method) ----------
  const paymentMethodIds = new Set(
    (await PaymentMethod.find({}).lean()).map((p: any) => p._id.toString())
  );
  await restore(
    "orders",
    Order,
    read("orders.json"),
    (d) => {
      if (!d.userId || !userIds.has(String(d.userId))) return null; // orphan
      if (!d.paymentMethodId || !paymentMethodIds.has(String(d.paymentMethodId)))
        return null;
      return {
        userId: oid(d.userId),
        planType: d.planType || "single",
        courseId: d.courseId ? remapCourse(d.courseId) : undefined,
        paymentMethodId: oid(d.paymentMethodId),
        transactionId: d.transactionId || "",
        senderNumber: d.senderNumber || "",
        paymentStatus: d.paymentStatus || "pending",
        isActive: d.isActive ?? true,
        price: d.price ?? 0,
        originalPrice: d.originalPrice,
        discountAmount: d.discountAmount,
        couponCode: d.couponCode,
        createdAt: d.createdAt ? new Date(d.createdAt) : new Date(),
        updatedAt: new Date(),
      };
    }
  );

  // ---------- 11. enrollments (need their student + course) ----------
  await restore(
    "enrollments",
    Enrollment,
    read("enrollments.json"),
    (d) => {
      if (!d.studentId || !userIds.has(String(d.studentId))) return null; // orphan
      const courseId = remapCourse(d.courseId);
      if (!courseId) return null;
      return {
        studentId: oid(d.studentId),
        courseId,
        progress: d.progress ?? 0,
        completionPercentage: d.completionPercentage ?? 0,
        isCompleted: d.isCompleted ?? false,
        completedLessons: (d.completedLessons || [])
          .map((l: any) => oid(l))
          .filter((l: any) => l && lessonIds.has(l.toString())),
        completedModules: (d.completedModules || [])
          .map((m: any) => oid(m))
          .filter((m: any) => m && moduleIds.has(m.toString())),
        completedAssignments: [],
        completedQuizzes: [],
        completedProjects: [],
        accessDuration: d.accessDuration,
        accessStartDate: d.accessStartDate,
        accessEndDate: d.accessEndDate,
        purchaseType: d.purchaseType || "single",
      };
    }
  );

  // ---------- 12. event registrations (need their event) ----------
  const eventIds = new Set(
    (await db.collection("events").find({}).toArray()).map((e: any) =>
      e._id.toString()
    )
  );
  await restore(
    "eventregistrations",
    EventRegistration,
    read("eventregistrations.json"),
    (d) => {
      if (!d.event || !eventIds.has(String(d.event))) return null; // orphan
      return {
        event: oid(d.event),
        fullName: d.fullName,
        email: d.email,
        phoneNumber: d.phoneNumber,
        notificationSent: d.notificationSent ?? false,
        registeredAt: d.registeredAt ? new Date(d.registeredAt) : new Date(),
        emailHistory: d.emailHistory || [],
      };
    }
  );

  console.log("\n  === SUMMARY ===");
  for (const r of report) {
    console.log(
      `  ${r.label.padEnd(18)} restored=${String(r.restored).padStart(2)}  skipped=${String(r.skipped).padStart(2)}  of ${r.total}`
    );
  }

  console.log(
    "\n  intentionally NOT restored (their user accounts are not in the backup\n  or in the current database, so they would be orphans):"
  );
  console.log("    guardianprofiles  15  - 30 referenced user accounts missing");
  console.log("    studentprofiles   15  - 30 referenced user accounts missing");
  console.log("    blogcategories     2  - there are no blog posts to categorise");

  if (!APPLY) {
    console.log("\n  DRY RUN - nothing was written. Re-run with --apply to restore.");
  } else {
    console.log("\n  APPLIED.");
  }

  await mongoose.disconnect();
  if (!APPLY) process.exit(0);
})();
