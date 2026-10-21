import { Schema, model, Types } from "mongoose";

/**
 * Single source of truth for the roles a user account can hold.
 * The Mongoose enum, the zod schemas and the admin services all read
 * from this list so a role can never be accepted by one layer and
 * rejected (or silently dropped) by another.
 */
export const USER_ROLES = [
  "admin",
  "manager",
  "instructor",
  "student",
  "guardian",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

/** Type guard for values arriving from request bodies. */
export const isValidUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);

export interface IUser {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  profileImage?: string;
  isBlocked?: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  /**
   * Each OTP flow gets its OWN field.
   *
   * They used to share `user.otp`, so a password-reset OTP could be consumed
   * by the email-verification endpoint (which also wiped it, breaking the
   * reset), and a verification OTP could be used to reset a password.
   */
  resetOtp?: string;
  resetOtpExpiresAt?: Date;
  /**
   * Single-use grant issued when a reset OTP is verified.
   *
   * The two-step reset flow needs the OTP twice (verify, then reset), so the
   * OTP cannot simply be consumed on verification. Instead verification
   * consumes the OTP and issues this grant, which `resetPassword` accepts.
   */
  resetToken?: string;
  resetTokenExpiresAt?: Date;
  passwordChangeOtp?: string;
  passwordChangeOtpExpiresAt?: Date;
  refreshToken?: string;
  /**
   * Access tokens issued BEFORE this timestamp are rejected.
   *
   * Set on logout, so logging out actually revokes the session instead of
   * leaving the access token valid until it expires. Unlike an in-memory
   * blacklist this survives a restart.
   */
  tokenValidAfter?: Date;
  googleId?: string;
  isNewGoogleUser?: boolean;
  isVerified?: boolean;
  verificationToken?: string;
  isApproved?: boolean; // For instructor approval by super admin
  bio?: string;
  expertise?: string[];
  qualification?: string;
  institution?: string;
  yearsOfExperience?: number;
  children?: Types.ObjectId[]; // Guardian's students
  guardians?: Types.ObjectId[]; // Student's guardians
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, sparse: true, index: true }, // Index but NOT unique
    email: { type: String, sparse: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "student",
      required: true,
    },
    profileImage: String,
    isBlocked: { type: Boolean, default: false },
    otp: String,
    otpExpiresAt: Date,
    resetOtp: String,
    resetOtpExpiresAt: Date,
    resetToken: String,
    resetTokenExpiresAt: Date,
    passwordChangeOtp: String,
    passwordChangeOtpExpiresAt: Date,
    refreshToken: String,
    tokenValidAfter: Date,
    googleId: { type: String, sparse: true, index: true }, // Index but NOT unique
    isNewGoogleUser: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    isApproved: {
      type: Boolean,
      default: function (this: any) {
        // Auto-approve for non-instructor roles; guard against null doc during upserts
        const role = this?.role ?? "student";
        return role !== "instructor";
      },
    },
    bio: String,
    expertise: [String],
    qualification: String,
    institution: String,
    yearsOfExperience: Number,
    children: [{ type: Schema.Types.ObjectId, ref: "User" }],
    guardians: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// unique: true on email field already creates the sparse unique index

export const User = model<IUser>("User", userSchema);
