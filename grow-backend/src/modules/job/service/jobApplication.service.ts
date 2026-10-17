import { Types } from "mongoose";
import { JobApplication, IJobApplication } from "../model/jobApplication.model";
import { JobPost } from "../model/jobPost.model";
import { parsePagination } from "@/utils/pagination";
import { TrackingService } from "../../tracking/service/tracking.service.js";

interface GetApplicationsQuery {
  jobId?: string;
  status?: string;
  applicationType?: string;
  search?: string;
  page?: string;
  limit?: string;
}

export const applyForJob = async (data: Partial<IJobApplication> & { req?: any; eventId?: string }) => {
  const req = data.req;
  const eventId = data.eventId;
  delete data.req;
  delete data.eventId;

  let isSpecificJob = false;

  // Check if a valid 24-char ObjectId for jobId was provided
  if (data.jobId && Types.ObjectId.isValid(data.jobId.toString()) && data.jobId.toString() !== "000000000000000000000000") {
    const job = await JobPost.findById(data.jobId);
    if (job) {
      isSpecificJob = true;
      data.applicationType = "job";
      data.positionOfInterest = data.positionOfInterest || job.title;

      // Check if user already applied for this specific job
      const existingApplication = await JobApplication.findOne({
        jobId: data.jobId,
        email: data.email,
      });

      if (existingApplication) {
        throw new Error("You have already applied for this job");
      }
    }
  }

  // If not a specific job post, treat as direct CV / General Application
  if (!isSpecificJob) {
    data.jobId = undefined;
    data.applicationType = "general_cv";
    if (!data.positionOfInterest) {
      data.positionOfInterest = "Direct CV / General Application";
    }
  }

  const createdApplication = await JobApplication.create(data);

  // Trigger asynchronous server-side tracking (Meta CAPI, TikTok, GA4, LinkedIn)
  try {
    TrackingService.trackLead({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      trackInterest: data.positionOfInterest || "Career / Job Application",
      source: isSpecificJob ? "job_post_application" : "direct_cv_careers_page",
      eventId: eventId || `job_app_${createdApplication._id}`,
      req,
    }).catch(() => {});
  } catch (err) {
    // Ignore tracking errors to never block candidate submissions
  }

  return createdApplication;
};

export const getApplications = async (query: GetApplicationsQuery = {}) => {
  try {
    const filter: any = {};

    if (query.jobId && Types.ObjectId.isValid(query.jobId)) {
      filter.jobId = query.jobId;
    }

    if (query.status && query.status !== "all") {
      filter.status = query.status;
    }

    if (query.applicationType && query.applicationType !== "all") {
      filter.applicationType = query.applicationType;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), "i");
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { positionOfInterest: searchRegex },
      ];
    }

    const { page, limit, skip } = parsePagination(query, { defaultLimit: 50, maxLimit: 200 });

    const applications = await JobApplication.find(filter)
      .populate("jobId", "title department jobType location")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await JobApplication.countDocuments(filter);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};

export const getApplicationById = async (id: string) => {
  return JobApplication.findById(id).populate(
    "jobId",
    "title department jobType location description"
  );
};

export const getApplicationsByJobId = async (jobId: string) => {
  return JobApplication.find({ jobId: jobId as any })
    .populate("jobId", "title department")
    .sort({ appliedAt: -1 })
    .lean();
};

export const updateApplicationStatus = async (
  id: string,
  status: string
) => {
  return JobApplication.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
};

export const deleteApplication = async (id: string) => {
  return JobApplication.findByIdAndDelete(id);
};

export const getApplicationStats = async () => {
  const stats = await JobApplication.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const typeStats = await JobApplication.aggregate([
    {
      $group: {
        _id: "$applicationType",
        count: { $sum: 1 },
      },
    },
  ]);

  return { statusStats: stats, typeStats };
};
