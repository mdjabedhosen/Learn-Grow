import { Types } from "mongoose";
import { Batch, IBatch } from "../model/batch.model";
import { Course } from "../../course/model/course.model";
import { Enrollment } from "../../enrollment/model/enrollment.model";
import { User } from "../../user/model/user.model";

/**
 * Automatically assign a student to an active batch of a course.
 * Follows the 15-student limit rule:
 * - 1st to 15th enrolled student -> Batch 1
 * - 16th to 30th enrolled student -> Batch 2, and so on.
 * If multiple teachers are assigned to the course, batches can be balanced across them.
 */
export const autoAssignStudentToBatch = async (
  courseId: string | Types.ObjectId,
  studentId: string | Types.ObjectId
) => {
  try {
    const courseObjId = new Types.ObjectId(courseId);
    const studentObjId = new Types.ObjectId(studentId);

    // 1. Check if student is already in a batch for this course
    const existingBatch = await Batch.findOne({
      courseId: courseObjId,
      enrolledStudents: studentObjId,
    });

    if (existingBatch) {
      // Update enrollment reference just in case
      await Enrollment.findOneAndUpdate(
        { studentId: studentObjId, courseId: courseObjId },
        {
          $set: {
            batchId: existingBatch._id,
            batchNumber: existingBatch.batchNumber,
            assignedInstructorId: existingBatch.instructorId,
          },
        }
      );
      return existingBatch;
    }

    // 2. Fetch Course to determine batch size and assigned teachers
    const course = await Course.findById(courseObjId);
    if (!course) {
      throw new Error("Course not found");
    }

    const maxBatchSize = course.maxBatchSize && course.maxBatchSize > 0 ? course.maxBatchSize : 15;

    // 3. Find an open batch that still has capacity (< maxBatchSize)
    const openBatches = await Batch.find({
      courseId: courseObjId,
      status: { $in: ["upcoming", "ongoing"] },
    }).sort({ batchNumber: 1 });

    const availableBatch = openBatches.find(
      (b) => (b.enrolledStudents || []).length < (b.maxStudents || maxBatchSize)
    );

    if (availableBatch) {
      // Add student to this batch
      availableBatch.enrolledStudents.push(studentObjId);
      await availableBatch.save();

      // Update enrollment
      await Enrollment.findOneAndUpdate(
        { studentId: studentObjId, courseId: courseObjId },
        {
          $set: {
            batchId: availableBatch._id,
            batchNumber: availableBatch.batchNumber,
            assignedInstructorId: availableBatch.instructorId,
          },
        }
      );

      return availableBatch;
    }

    // 4. No batch with space exists. Create a new batch!
    const allBatches = await Batch.find({ courseId: courseObjId }).sort({ batchNumber: -1 });
    const nextBatchNumber = allBatches.length > 0 ? (allBatches[0].batchNumber || 0) + 1 : 1;

    // Determine teacher for this new batch:
    // If course has multiple teachers (instructorIds array), balance batches among them!
    const candidateTeachers: Types.ObjectId[] = [];
    if (Array.isArray(course.instructorIds) && course.instructorIds.length > 0) {
      course.instructorIds.forEach((id) => candidateTeachers.push(new Types.ObjectId(id)));
    }
    if (course.instructorId && !candidateTeachers.some((id) => id.equals(course.instructorId))) {
      candidateTeachers.push(new Types.ObjectId(course.instructorId));
    }

    let selectedTeacherId = candidateTeachers[0] || course.instructorId;

    if (candidateTeachers.length > 1) {
      // Find teacher with lowest active batch count
      const teacherBatchCounts = await Promise.all(
        candidateTeachers.map(async (teacherId) => {
          const count = await Batch.countDocuments({
            instructorId: teacherId,
            status: { $ne: "completed" },
          });
          return { teacherId, count };
        })
      );

      teacherBatchCounts.sort((a, b) => a.count - b.count);
      selectedTeacherId = teacherBatchCounts[0].teacherId;
    }

    const newBatch = await Batch.create({
      courseId: courseObjId,
      batchNumber: nextBatchNumber,
      batchName: `Batch ${nextBatchNumber}`,
      instructorId: selectedTeacherId,
      maxStudents: maxBatchSize,
      enrolledStudents: [studentObjId],
      status: "ongoing",
      schedule: "Sat & Tue 7:00 PM - 8:00 PM",
      startDate: new Date(),
    });

    // Update enrollment
    await Enrollment.findOneAndUpdate(
      { studentId: studentObjId, courseId: courseObjId },
      {
        $set: {
          batchId: newBatch._id,
          batchNumber: newBatch.batchNumber,
          assignedInstructorId: newBatch.instructorId,
        },
      }
    );

    return newBatch;
  } catch (error: any) {
    console.error("[Batch Auto-Assign Error]:", error);
    throw error;
  }
};

/**
 * Get all batches for Admin & Manager
 */
export const getAllBatchesAdmin = async (filters: {
  courseId?: string;
  instructorId?: string;
  status?: string;
  search?: string;
}) => {
  const query: any = {};

  if (filters.courseId) query.courseId = new Types.ObjectId(filters.courseId);
  if (filters.instructorId) query.instructorId = new Types.ObjectId(filters.instructorId);
  if (filters.status) query.status = filters.status;

  const batches = await Batch.find(query)
    .populate("courseId", "title thumbnail price instructorId instructorIds maxBatchSize")
    .populate(
      "instructorId",
      "name email profileImage phone role qualification institution bio expertise yearsOfExperience"
    )
    .populate("enrolledStudents", "name email phone profileImage createdAt")
    .sort({ courseId: 1, batchNumber: 1 })
    .lean();

  if (filters.search) {
    const s = filters.search.toLowerCase();
    return batches.filter((b: any) => {
      const matchBatchName = (b.batchName || "").toLowerCase().includes(s);
      const matchCourseTitle = (b.courseId?.title || "").toLowerCase().includes(s);
      const matchTeacher = (b.instructorId?.name || "").toLowerCase().includes(s);
      const matchStudent = (b.enrolledStudents || []).some(
        (st: any) =>
          (st.name || "").toLowerCase().includes(s) ||
          (st.email || "").toLowerCase().includes(s)
      );
      return matchBatchName || matchCourseTitle || matchTeacher || matchStudent;
    });
  }

  return batches;
};

/**
 * Create a new batch manually (Admin / Manager)
 */
export const createBatchAdmin = async (data: {
  courseId: string;
  batchNumber?: number;
  batchName?: string;
  instructorId: string;
  maxStudents?: number;
  schedule?: string;
  startDate?: Date;
  zoomLink?: string;
  whatsappGroupUrl?: string;
  notes?: string;
  status?: "upcoming" | "ongoing" | "completed";
}) => {
  const courseObjId = new Types.ObjectId(data.courseId);

  let batchNumber = data.batchNumber;
  if (!batchNumber) {
    const lastBatch = await Batch.findOne({ courseId: courseObjId }).sort({ batchNumber: -1 });
    batchNumber = lastBatch ? lastBatch.batchNumber + 1 : 1;
  }

  const batchName = data.batchName?.trim() || `Batch ${batchNumber}`;

  const newBatch = await Batch.create({
    courseId: courseObjId,
    batchNumber,
    batchName,
    instructorId: new Types.ObjectId(data.instructorId),
    maxStudents: data.maxStudents || 15,
    enrolledStudents: [],
    status: data.status || "ongoing",
    schedule: data.schedule || "Sat & Tue 7:00 PM - 8:00 PM",
    startDate: data.startDate || new Date(),
    zoomLink: data.zoomLink || "",
    whatsappGroupUrl: data.whatsappGroupUrl || "",
    notes: data.notes || "",
  });

  // Ensure this instructor is also included in course.instructorIds
  await Course.findByIdAndUpdate(courseObjId, {
    $addToSet: { instructorIds: new Types.ObjectId(data.instructorId) },
  });

  return await Batch.findById(newBatch._id)
    .populate("courseId", "title thumbnail")
    .populate(
      "instructorId",
      "name email profileImage phone role qualification institution bio expertise yearsOfExperience"
    )
    .populate("enrolledStudents", "name email phone profileImage");
};

/**
 * Update batch details (Admin / Manager)
 */
export const updateBatchAdmin = async (
  batchId: string,
  updates: Partial<IBatch> & { instructorId?: string }
) => {
  const updateData: any = { ...updates };

  if (updates.instructorId) {
    updateData.instructorId = new Types.ObjectId(updates.instructorId);
  }

  const updatedBatch = await Batch.findByIdAndUpdate(batchId, { $set: updateData }, { new: true })
    .populate("courseId", "title thumbnail instructorId instructorIds")
    .populate(
      "instructorId",
      "name email profileImage phone role qualification institution bio expertise yearsOfExperience"
    )
    .populate("enrolledStudents", "name email phone profileImage");

  if (!updatedBatch) {
    throw new Error("Batch not found");
  }

  // If instructor was changed, also update all associated enrollments for this batch!
  if (updates.instructorId) {
    await Enrollment.updateMany(
      { batchId: updatedBatch._id },
      { $set: { assignedInstructorId: updatedBatch.instructorId } }
    );

    // Also ensure new instructor is in course.instructorIds
    if (updatedBatch.courseId) {
      await Course.findByIdAndUpdate((updatedBatch.courseId as any)._id, {
        $addToSet: { instructorIds: updatedBatch.instructorId },
      });
    }
  }

  return updatedBatch;
};

/**
 * Assign or move a student to a specific batch
 */
export const assignStudentToBatchAdmin = async (batchId: string, studentId: string) => {
  const targetBatch = await Batch.findById(batchId);
  if (!targetBatch) {
    throw new Error("Target batch not found");
  }

  const studentObjId = new Types.ObjectId(studentId);

  // 1. Remove student from any other batch of this course
  await Batch.updateMany(
    {
      courseId: targetBatch.courseId,
      _id: { $ne: targetBatch._id },
      enrolledStudents: studentObjId,
    },
    { $pull: { enrolledStudents: studentObjId } }
  );

  // 2. Add student to target batch
  if (!targetBatch.enrolledStudents.some((id) => id.equals(studentObjId))) {
    targetBatch.enrolledStudents.push(studentObjId);
    await targetBatch.save();
  }

  // 3. Update Enrollment
  await Enrollment.findOneAndUpdate(
    { studentId: studentObjId, courseId: targetBatch.courseId },
    {
      $set: {
        batchId: targetBatch._id,
        batchNumber: targetBatch.batchNumber,
        assignedInstructorId: targetBatch.instructorId,
      },
    }
  );

  return await Batch.findById(batchId)
    .populate("courseId", "title thumbnail")
    .populate(
      "instructorId",
      "name email profileImage phone role qualification institution bio expertise yearsOfExperience"
    )
    .populate("enrolledStudents", "name email phone profileImage");
};

/**
 * Remove student from a batch
 */
export const removeStudentFromBatchAdmin = async (batchId: string, studentId: string) => {
  const studentObjId = new Types.ObjectId(studentId);

  const updatedBatch = await Batch.findByIdAndUpdate(
    batchId,
    { $pull: { enrolledStudents: studentObjId } },
    { new: true }
  )
    .populate("courseId", "title thumbnail")
    .populate(
      "instructorId",
      "name email profileImage phone role qualification institution bio expertise yearsOfExperience"
    )
    .populate("enrolledStudents", "name email phone profileImage");

  if (updatedBatch) {
    await Enrollment.findOneAndUpdate(
      { studentId: studentObjId, courseId: updatedBatch.courseId },
      {
        $unset: {
          batchId: 1,
          batchNumber: 1,
          assignedInstructorId: 1,
        },
      }
    );
  }

  return updatedBatch;
};

/**
 * Delete a batch
 */
export const deleteBatchAdmin = async (batchId: string) => {
  const batch = await Batch.findById(batchId);
  if (!batch) {
    throw new Error("Batch not found");
  }

  // Unlink enrollments
  await Enrollment.updateMany(
    { batchId: batch._id },
    { $unset: { batchId: 1, batchNumber: 1, assignedInstructorId: 1 } }
  );

  await Batch.findByIdAndDelete(batchId);
  return { success: true, message: "Batch deleted successfully" };
};

/**
 * Get batches for Teacher Dashboard
 */
export const getInstructorBatches = async (instructorId: string) => {
  const query: any = {};
  if (Types.ObjectId.isValid(instructorId)) {
    query.$or = [
      { instructorId: new Types.ObjectId(instructorId) },
      { instructorId: instructorId },
    ];
  } else {
    query.instructorId = instructorId;
  }

  const batches = await Batch.find(query)
    .populate("courseId", "title thumbnail price level duration")
    .populate(
      "instructorId",
      "name email phone profileImage role qualification institution bio expertise yearsOfExperience"
    )
    .populate("enrolledStudents", "name email phone profileImage createdAt")
    .sort({ courseId: 1, batchNumber: 1 })
    .lean();

  return batches;
};

/**
 * Update batch details by assigned Instructor (Schedule, Zoom Link, WhatsApp URL)
 */
export const updateBatchInstructor = async (
  batchId: string,
  instructorId: string,
  updates: { schedule?: string; zoomLink?: string; whatsappGroupUrl?: string; notes?: string }
) => {
  const batch = await Batch.findOne({
    _id: new Types.ObjectId(batchId),
    instructorId: new Types.ObjectId(instructorId),
  });

  if (!batch) {
    throw new Error("Batch not found or you are not authorized for this batch");
  }

  if (updates.schedule !== undefined) batch.schedule = updates.schedule;
  if (updates.zoomLink !== undefined) batch.zoomLink = updates.zoomLink;
  if (updates.whatsappGroupUrl !== undefined) batch.whatsappGroupUrl = updates.whatsappGroupUrl;
  if (updates.notes !== undefined) batch.notes = updates.notes;

  await batch.save();
  return batch;
};

/**
 * Get batch for Student Dashboard
 * Student only sees their own batch number, schedule, and assigned teacher!
 */
export const getStudentBatch = async (courseId: string, studentId: string) => {
  const courseObjId = new Types.ObjectId(courseId);
  const studentObjId = new Types.ObjectId(studentId);

  const batch = await Batch.findOne({
    courseId: courseObjId,
    enrolledStudents: studentObjId,
  })
    .populate("courseId", "title thumbnail")
    .populate("instructorId", "name email profileImage phone qualification institution bio")
    .lean();

  if (!batch) {
    return null;
  }

  return {
    batchId: batch._id,
    batchNumber: batch.batchNumber,
    batchName: batch.batchName,
    schedule: batch.schedule,
    startDate: batch.startDate,
    zoomLink: batch.zoomLink,
    whatsappGroupUrl: batch.whatsappGroupUrl,
    assignedInstructor: batch.instructorId
      ? {
          name: (batch.instructorId as any).name,
          email: (batch.instructorId as any).email,
          profileImage: (batch.instructorId as any).profileImage,
          qualification: (batch.instructorId as any).qualification,
          institution: (batch.instructorId as any).institution,
          bio: (batch.instructorId as any).bio,
        }
      : null,
  };
};

/**
 * Sync / Backfill existing enrollments into batches
 * Automatically groups enrolled students 15 by 15 into Batch 1, Batch 2...
 */
export const syncExistingEnrollmentsToBatches = async () => {
  try {
    const courses = await Course.find();

    for (const course of courses) {
      const enrollments = await Enrollment.find({ courseId: course._id }).sort({ createdAt: 1 });
      if (enrollments.length === 0) continue;

      for (const enr of enrollments) {
        if (!enr.batchId) {
          await autoAssignStudentToBatch(course._id, enr.studentId);
        }
      }
    }

    console.log("[Batch Sync] Finished syncing existing enrollments to batches.");
  } catch (error) {
    console.error("[Batch Sync Error]:", error);
  }
};
