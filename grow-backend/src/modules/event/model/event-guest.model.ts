import { Schema, model, Types } from "mongoose";

export const EVENT_GUEST_ROLES = [
  "Guest",
  "Host",
  "Speaker",
  "Mentor",
  "Judge",
] as const;

export type EventGuestRole = (typeof EVENT_GUEST_ROLES)[number];

export interface IEventGuest {
  fullName: string;
  role: EventGuestRole;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
  organization?: string;
  designation?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  /**
   * Optional link to a platform account. Set when the guest is one of our
   * own instructors - it lets the admin panel offer "pick an instructor" and
   * keeps the guest tied to the real user.
   */
  userId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const eventGuestSchema = new Schema<IEventGuest>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: EVENT_GUEST_ROLES,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      // One guest row per email. Several servers can boot at the same time
      // and the seeder used to do findOne-then-create, which produced
      // duplicate rows for the same person. The unique index makes the
      // duplicate impossible; sparse still allows several guests without an
      // email.
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    profileImage: String,
    organization: String,
    designation: String,
    linkedinUrl: String,
    twitterUrl: String,
    websiteUrl: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // One guest row per linked instructor account.
      unique: true,
      sparse: true,
      default: undefined,
    },
  },
  { timestamps: true }
);

export const EventGuest = model<IEventGuest>("EventGuest", eventGuestSchema);
