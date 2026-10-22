/**
 * Finds and repairs reference fields that were imported as strings instead of
 * ObjectIds.
 *
 * The JSON backup stored ids as strings, so after the database switch every
 * `Lesson.find({ moduleId })` query silently matched nothing - the course
 * page showed "No course content available yet" while the rows were there.
 *
 * A Mongo query never matches a string against an ObjectId, so each field
 * has to be converted in place.
 *
 * Usage: node --import tsx scripts/fixStringRefs.ts [--apply]
 */
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";

const APPLY = process.argv.includes("--apply");

const OBJECT_ID = /^[a-fA-F0-9]{24}$/;

/** collection -> the fields that must be ObjectIds */
const REF_FIELDS: Record<string, string[]> = {
  lessons: ["moduleId", "courseId"],
  modules: ["courseId"],
  enrollments: [
    "studentId",
    "courseId",
    "completedLessons",
    "completedModules",
    "completedAssignments",
    "completedQuizzes",
    "completedProjects",
    "comboId",
    "batchId",
    "assignedInstructorId",
  ],
  orders: ["userId", "courseId", "comboId", "paymentMethodId"],
  eventguests: ["userId"],
  events: ["guests", "createdBy"],
  eventregistrations: ["event"],
  teammembers: ["userId"],
  liveclasses: ["courseId", "instructorId"],
  combos: ["courses", "createdBy"],
  jobapplications: ["jobId", "userId"],
  emaillogs: ["applicationId"],
  jobposts: [],
  courses: ["instructorId", "instructors"],
  modulesLessons: [],
  batches: ["courseId", "instructorId", "createdBy"],
  coupons: [],
  quizzes: ["courseId", "moduleId", "createdBy"],
  assignments: ["courseId", "moduleId", "createdBy"],
  assessments: ["courseId", "moduleId", "createdBy"],
  certificates: ["userId", "courseId", "enrollmentId"],
  trialbookings: ["courseId"],
  sitecontents: ["createdBy"],
  studentprofiles: ["userId", "guardianId"],
  guardianprofiles: ["userId", "studentId"],
  paymentmethods: [],
  smtpconfigs: [],
  roles: [],
  settings: [],
  contacts: [],
  ticket: [],
  tickets: ["userId", "assignedTo"],
};

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const db = mongoose.connection.db!;
  const existing = new Set(
    (await db.listCollections().toArray()).map((c: any) => c.name)
  );

  let totalFixed = 0;

  for (const [coll, fields] of Object.entries(REF_FIELDS)) {
    if (!existing.has(coll) || fields.length === 0) continue;

    const types = await db
      .collection(coll)
      .aggregate([
        { $project: { t: { $type: "$__none" } } },
      ])
      .toArray()
      .catch(() => []);

    for (const field of fields) {
      // how many rows hold a string in this field?
      const stringRows = await db
        .collection(coll)
        .countDocuments({
          [field]: { $type: "string", $ne: "" },
        });

      if (!stringRows) continue;

      // how many of those strings are not already an ObjectId?
      const candidates = await db
        .collection(coll)
        .find({ [field]: { $type: "string", $ne: "" } })
        .project({ [field]: 1 })
        .toArray();

      let convertible = 0;
      let skipped = 0;
      for (const row of candidates) {
        const v = row[field];
        if (typeof v === "string" && OBJECT_ID.test(v)) convertible++;
        else skipped++;
      }

      if (!convertible) {
        console.log(
          `  ${coll}.${field}: ${stringRows} string(s), none look like ObjectIds -> skipped`
        );
        continue;
      }

      console.log(
        `  ${coll}.${field}: ${stringRows} string(s) -> ${convertible} convertible, ${skipped} not ObjectId-shaped`
      );

      if (!APPLY) continue;

      // convert the ObjectId-shaped ones, leave the rest alone
      const result = await db.collection(coll).updateMany(
        { [field]: { $type: "string" } },
        [
          {
            $set: {
              [field]: {
                $cond: [
                  { $regexMatch: { input: `$${field}`, regex: "^[a-fA-F0-9]{24}$" } },
                  { $convert: { input: `$${field}`, to: "objectId", onError: `$${field}`, onNull: `$${field}` } },
                  `$${field}`,
                ],
              },
            },
          },
        ]
      );
      totalFixed += result.modifiedCount || 0;
      console.log(`    converted ${result.modifiedCount}`);
    }
  }

  console.log(
    `\n  ${APPLY ? "APPLIED" : "DRY RUN"}: ${totalFixed} field(s) converted`
  );
  if (!APPLY) console.log("  re-run with --apply to convert");
  await mongoose.disconnect();
})();
