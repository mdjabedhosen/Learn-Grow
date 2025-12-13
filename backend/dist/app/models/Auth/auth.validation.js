"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string({
            required_error: 'Phone is required.',
        }),
        password: zod_1.z.string({ required_error: 'Password is required.' }),
    }),
});
const passwordMinLength = 8;
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current password is required.',
        }),
        newPassword: zod_1.z
            .string()
            .refine((data) => data.length >= passwordMinLength, {
            message: `Password must be at least ${passwordMinLength} characters long.`,
        })
            .refine((data) => /[a-z]/.test(data), {
            message: 'Password must contain at least one lowercase letter.',
        })
            .refine((data) => /[A-Z]/.test(data), {
            message: 'Password must contain at least one uppercase letter.',
        })
            .refine((data) => /\d/.test(data), {
            message: 'Password must contain at least one number.',
        })
            .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(data), {
            message: 'Password must contain at least one special character.',
        }),
    }),
});
const forgetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string({
            required_error: 'Phone number is required.',
        }),
    }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string({
            required_error: 'phone is required.',
        }),
        code: zod_1.z.string({
            required_error: 'OTP code is required.',
        }),
        verifyServiceSid: zod_1.z.string({
            required_error: 'OTP verifyServiceSid is required.',
        }),
        newPassword: zod_1.z
            .string({
            required_error: 'New Password is required.',
        })
            .refine((data) => data.length >= passwordMinLength, {
            message: `Password must be at least ${passwordMinLength} characters long.`,
        })
            .refine((data) => /[a-z]/.test(data), {
            message: 'Password must contain at least one lowercase letter.',
        })
            .refine((data) => /[A-Z]/.test(data), {
            message: 'Password must contain at least one uppercase letter.',
        })
            .refine((data) => /\d/.test(data), {
            message: 'Password must contain at least one number.',
        })
            .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(data), {
            message: 'Password must contain at least one special character.',
        }),
    }),
});
exports.authValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
