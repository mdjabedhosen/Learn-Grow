import { z } from 'zod';

const createLiveClassValidationSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }),
        courseId: z.string({ required_error: 'Course ID is required' }),
        date: z.string({ required_error: 'Date is required' }),
        duration: z.number().optional(),
        platform: z.enum(['zoom', 'meet']),
        meetingLink: z.string().url({ message: 'Invalid URL' }),
    }),
});

const updateLiveClassValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        date: z.string().optional(),
        duration: z.number().optional(),
        status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).optional(),
    }),
});

export const LiveClassValidations = {
    createLiveClassValidationSchema,
    updateLiveClassValidationSchema,
};
