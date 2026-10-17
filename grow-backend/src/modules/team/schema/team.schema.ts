import { z } from "zod";

export const createTeamMemberSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name is required and must be at least 2 characters"),
        role: z.string().min(2, "Role is required and must be at least 2 characters"),
        domain: z.string().optional().default(""),
        yearsOfExperience: z.union([z.number(), z.string()]).optional().default(""),
        expertise: z.union([z.array(z.string()), z.string()]).optional().default([]),
        image: z.string().min(1, "Image is required"),
        linkedIn: z.string().optional().default(""),
        twitter: z.string().optional().default(""),
        bio: z.string().optional().default(""),
    }),
});

export const updateTeamMemberSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters").optional(),
        role: z.string().min(2, "Role must be at least 2 characters").optional(),
        domain: z.string().optional(),
        yearsOfExperience: z.union([z.number(), z.string()]).optional(),
        expertise: z.union([z.array(z.string()), z.string()]).optional(),
        image: z.string().optional(),
        linkedIn: z.string().optional(),
        twitter: z.string().optional(),
        bio: z.string().optional(),
        showOnHome: z.boolean().optional(),
    }),
});

export const importInstructorSchema = z.object({
    body: z.object({
        instructorIds: z.array(z.string()).min(1, "At least one instructor ID is required"),
    }),
});

export const toggleShowHomeSchema = z.object({
    body: z.object({
        showOnHome: z.boolean(),
    }),
});
