"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidations = void 0;
const zod_1 = require("zod");
const lessonValidationSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Lesson title is required' }),
    type: zod_1.z.enum(['video', 'pdf', 'quiz']),
    contentUrl: zod_1.z.string({ required_error: 'Content URL is required' }),
    duration: zod_1.z.number().optional(),
    isFreePreview: zod_1.z.boolean().optional(),
});
const moduleValidationSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Module title is required' }),
    orderIndex: zod_1.z.number(),
    lessons: zod_1.z.array(lessonValidationSchema).optional(),
});
const createCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        description: zod_1.z.string({ required_error: 'Description is required' }),
        category: zod_1.z.string({ required_error: 'Category is required' }),
        price: zod_1.z.number({ required_error: 'Price is required' }).min(0),
        thumbnail: zod_1.z.string({ required_error: 'Thumbnail is required' }),
        level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']),
        instructorId: zod_1.z.string({ required_error: 'Instructor ID is required' }),
        modules: zod_1.z.array(moduleValidationSchema).optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const updateCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        category: zod_1.z.string().optional(),
        price: zod_1.z.number().min(0).optional(),
        thumbnail: zod_1.z.string().optional(),
        level: zod_1.z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
        modules: zod_1.z.array(moduleValidationSchema).optional(),
        isPublished: zod_1.z.boolean().optional(),
        instructorId: zod_1.z.string().optional(),
    }),
});
exports.CourseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
};
