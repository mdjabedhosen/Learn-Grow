"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveClassValidations = void 0;
const zod_1 = require("zod");
const createLiveClassValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        courseId: zod_1.z.string({ required_error: 'Course ID is required' }),
        date: zod_1.z.string({ required_error: 'Date is required' }),
        duration: zod_1.z.number().optional(),
        platform: zod_1.z.enum(['zoom', 'meet']),
        meetingLink: zod_1.z.string().url({ message: 'Invalid URL' }),
    }),
});
const updateLiveClassValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        date: zod_1.z.string().optional(),
        duration: zod_1.z.number().optional(),
        status: zod_1.z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).optional(),
    }),
});
exports.LiveClassValidations = {
    createLiveClassValidationSchema,
    updateLiveClassValidationSchema,
};
