import { z } from "zod";

export const applyForJobSchema = z.object({
  body: z.object({
    jobId: z.string().optional().nullable(),
    applicationType: z.enum(["job", "general_cv"]).optional(),
    positionOfInterest: z.string().optional().nullable(),
    email: z.string().email("Invalid email"),
    fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
    phone: z.string().min(6, "Phone number is too short").max(25),
    resumeUrl: z.string().min(1, "Resume link is required"),
    linkedinProfile: z.string().optional().nullable(),
    additionalInfo: z.string().max(2500).optional().nullable(),
  }),
});

export const getApplicationsSchema = z.object({
  query: z.object({
    jobId: z.string().optional(),
    applicationType: z.enum(["job", "general_cv"]).optional(),
    status: z.enum(["pending", "reviewed", "shortlisted", "rejected", "accepted"]).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const updateApplicationStatusSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid application ID"),
  }),
  body: z.object({
    status: z.enum(["pending", "reviewed", "shortlisted", "rejected", "accepted"]),
  }),
});

export const applicationIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid application ID"),
  }),
});
