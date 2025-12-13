import { z } from 'zod';

const lessonValidationSchema = z.object({
    title: z.string({ required_error: 'Lesson title is required' }),
    type: z.enum(['video', 'pdf', 'quiz']),
    contentUrl: z.string({ required_error: 'Content URL is required' }),
    duration: z.number().optional(),
    isFreePreview: z.boolean().optional(),
});

const moduleValidationSchema = z.object({
    title: z.string({ required_error: 'Module title is required' }),
    orderIndex: z.number(),
    lessons: z.array(lessonValidationSchema).optional(),
});

const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }),
        description: z.string({ required_error: 'Description is required' }),
        category: z.string({ required_error: 'Category is required' }),
        price: z.number({ required_error: 'Price is required' }).min(0),
        thumbnail: z.string({ required_error: 'Thumbnail is required' }),
        level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
        instructorId: z.string({ required_error: 'Instructor ID is required' }),
        modules: z.array(moduleValidationSchema).optional(),
        isPublished: z.boolean().optional(),
    }),
});

const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        price: z.number().min(0).optional(),
        thumbnail: z.string().optional(),
        level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
        modules: z.array(moduleValidationSchema).optional(),
        isPublished: z.boolean().optional(),
        instructorId: z.string().optional(),
    }),
});

export const CourseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
};
