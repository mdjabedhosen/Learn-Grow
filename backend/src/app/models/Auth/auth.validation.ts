/* eslint-disable no-useless-escape */
import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: 'Phone is required.',
    }),
    password: z.string({ required_error: 'Password is required.' }),
  }),
});

const passwordMinLength = 8;

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required.',
    }),
    newPassword: z
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

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: 'Phone number is required.',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    phone: z.string({
      required_error: 'phone is required.',
    }),
    code: z.string({
      required_error: 'OTP code is required.',
    }),
    verifyServiceSid: z.string({
      required_error: 'OTP verifyServiceSid is required.',
    }),
    newPassword: z
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

export const authValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
