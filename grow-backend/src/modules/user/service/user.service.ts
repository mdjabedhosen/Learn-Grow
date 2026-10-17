import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../model/user.model";
import { StudentProfile } from "../model/studentProfile.model";
import { GuardianProfile } from "../model/guardianProfile.model";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyRefreshToken,
} from "@/utils/jwt";
import {
  generateOTP,
  sendOTPEmail,
  sendOTPSMS,
  getOTPExpirationTime,
  isOTPExpired,
  sendWelcomeEmail,
  sendInstructorApprovalEmail,
  sendGuardianCredentialsEmail,
} from "@/utils/otp";
import { escapeRegex } from "@/utils/sanitizeSearch";

interface RegisterInput {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role: "student" | "instructor" | "guardian";
}

interface LoginInput {
  email?: string;
  phone?: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
    relations?: any; // Guardian/student relationships
  };
  error?: string;
}

/**
 * Send OTP for authentication
 */
export const sendOtp = async (
  email?: string,
  phone?: string
): Promise<{ success: boolean; message: string; otp?: string }> => {
  try {
    // If email is provided and already verified, stop early
    if (email) {
      const existingEmailUser = await User.findOne({ email }).lean();
      if (existingEmailUser && existingEmailUser.isVerified) {
        return {
          success: false,
          message: "An account with this email already exists. Please login instead.",
        };
      }
    }

    const otp = generateOTP();
    const otpExpiresAt = getOTPExpirationTime();

    if (email) {
      await User.findOneAndUpdate(
        { email },
        { $set: { otp, otpExpiresAt }, $setOnInsert: { name: "Pending User", role: "student", isVerified: false } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const emailSent = await sendOTPEmail(email, otp);
      if (!emailSent) {
        return {
          success: false,
          message: "Failed to send OTP via email. Please try again.",
        };
      }

      return {
        success: true,
        message: "OTP sent to email successfully",
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      };
    }

    if (phone) {
      await User.findOneAndUpdate(
        { phone },
        { $set: { otp, otpExpiresAt }, $setOnInsert: { name: "Pending User", role: "student", isVerified: false } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const smsSent = await sendOTPSMS(phone, otp);
      if (!smsSent) {
        return {
          success: false,
          message: "Failed to send OTP via SMS. Please try again.",
        };
      }

      return {
        success: true,
        message: "OTP sent to phone successfully",
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      };
    }

    return {
      success: false,
      message: "Email or phone is required",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

/**
 * Verify OTP
 */
export const verifyOtp = async (
  email?: string,
  phone?: string,
  otp?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!otp) {
      return { success: false, message: "OTP is required" };
    }

    const query = email ? { email } : phone ? { phone } : null;

    if (!query) {
      return {
        success: false,
        message: "Email or phone is required",
      };
    }

    const user = await User.findOne(query);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (user.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    if (isOTPExpired(user.otpExpiresAt)) {
      return { success: false, message: "OTP has expired" };
    }

    // Clear OTP and mark as verified
    // Ensure required fields exist for legacy upserted records
    if (!user.name) {
      user.name = "Pending User";
    }
    if (!user.role) {
      user.role = "student" as any;
    }
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.isVerified = true;
    await user.save();

    return { success: true, message: "OTP verified successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify OTP",
    };
  }
};

/**
 * Register a new user
 */
export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  try {
    // Force student-only registration
    const { name, email, phone, password } = input;
    const role: "student" = "student";

    // Require at least one contact method
    if (!email && !phone) {
      return {
        success: false,
        message: "Email or phone is required",
      };
    }

    // If a user was upserted during OTP, upgrade that record instead of rejecting
    let user = null as any;
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        if (existingEmail.password) {
          return {
            success: false,
            message: "Email already registered. Please login or use another email.",
          };
        }
        user = existingEmail;
      }
    }

    if (!user && phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        if (existingPhone.password) {
          return {
            success: false,
            message: "Phone already registered. Please login or use another phone.",
          };
        }
        user = existingPhone;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or upgrade user
    if (!user) {
      user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        // isVerified set by OTP flow; default false if not verified
      });
    } else {
      // Upgrade the pending OTP user record
      user.name = user.name || name;
      user.email = user.email || email;
      user.phone = user.phone || phone;
      user.password = hashedPassword;
      user.role = role;
      await user.save();
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      role
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    // Send welcome email (don't fail registration if email fails)
    if (email) {
      sendWelcomeEmail(email, name, role);
    }

    // Auto-create guardian account for students (1:1 relationship)
    if (role === "student") {
      try {
        const guardianPasswordPlain = crypto.randomBytes(9).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12);
        const guardianPassword = await bcrypt.hash(guardianPasswordPlain, 10);

        const suffix = user._id.toString().slice(-6);
        const guardianEmail = email
          ? email.replace("@", `+guardian_${suffix}@`)
          : `guardian-${suffix}@learnandgrow.local`;

        // Create guardian account (without phone to avoid duplication)
        const guardian = await User.create({
          name: `${name}'s Guardian`,
          email: guardianEmail,
          password: guardianPassword,
          role: "guardian",
          isVerified: true,
        });

        // Create StudentProfile with guardianId link
        await StudentProfile.findOneAndUpdate(
          { userId: user._id },
          { $setOnInsert: { userId: user._id }, $set: { guardianId: guardian._id } },
          { upsert: true }
        );

        // Create GuardianProfile with studentId link
        await GuardianProfile.findOneAndUpdate(
          { userId: guardian._id },
          { $setOnInsert: { userId: guardian._id }, $set: { studentId: user._id } },
          { upsert: true }
        );

        // Add student to guardian's children array
        guardian.children = [user._id] as any;
        await guardian.save();

        // Send guardian credentials email
        if (email) {
          sendGuardianCredentialsEmail(email, name, guardianEmail, guardianPasswordPlain);
        }
      } catch (err) {
      }
    }

    return {
      success: true,
      message: `Registration successful as ${role}`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
        },
        accessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Registration failed",
      error: error.message,
    };
  }
};

/**
 * Login user
 */
export const login = async (input: LoginInput): Promise<AuthResponse> => {
  try {
    const { email, phone, password } = input;

    // Find user (case-insensitive email)
    const normalizedEmail = email?.trim().toLowerCase();
    const query = normalizedEmail
      ? { email: { $regex: new RegExp(`^${normalizedEmail.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i") } }
      : phone
      ? { phone: phone.trim() }
      : null;

    if (!query) {
      return {
        success: false,
        message: "Email or phone is required",
      };
    }

    const user = await User.findOne(query);

    if (!user) {
      return {
        success: false,
        message: "User not found. Please register first.",
      };
    }

    // Verify password
    if (!user.password) {
      return {
        success: false,
        message: "Invalid credentials. Please use Google login or reset password.",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email/phone or password",
      };
    }

    // Allow students, guardians, instructors, admins, managers, and super admins to login
    const allowedRoles = ["student", "guardian", "instructor", "admin", "manager", "super_admin"];
    if (!allowedRoles.includes(user.role)) {
      return {
        success: false,
        message: `User role '${user.role}' is not authorized to login.`,
      };
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.role
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      success: true,
      message: `Login successful as ${user.role}`,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          isApproved: user.isApproved,
        },
        accessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed",
      error: error.message,
    };
  }
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<AuthResponse> => {
  try {
    if (!refreshToken) {
      return {
        success: false,
        message: "Refresh token is required",
      };
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return {
        success: false,
        message: "Invalid or expired refresh token",
      };
    }

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Verify refresh token matches
    if (user.refreshToken !== refreshToken) {
      return {
        success: false,
        message: "Refresh token mismatch",
      };
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString(), user.role);

    return {
      success: true,
      message: "Access token refreshed",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        accessToken: newAccessToken,
        refreshToken,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to refresh token",
      error: error.message,
    };
  }
};

/**
 * Logout user
 */
export const logout = async (userId: string): Promise<{ success: boolean; message: string }> => {
  try {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Logout failed",
    };
  }
};

/**
 * Change password
 */
export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!user.password) {
      return {
        success: false,
        message: "Cannot change password for OAuth users",
      };
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Old password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true, message: "Password changed successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to change password",
    };
  }
};

/**
 * Send OTP for password change
 */
export const sendPasswordChangeOtp = async (
  userId: string,
  email?: string,
  phone?: string
): Promise<{ success: boolean; message: string; otp?: string }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    const otp = generateOTP();
    const otpExpiresAt = getOTPExpirationTime();

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    if (email || user.email) {
      const emailSent = await sendOTPEmail(email || user.email!, otp);
      if (!emailSent) {
        return {
          success: false,
          message: "Failed to send OTP via email. Please try again.",
        };
      }
      return {
        success: true,
        message: "OTP sent to email successfully",
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      };
    }

    if (phone || user.phone) {
      const smsSent = await sendOTPSMS(phone || user.phone!, otp);
      if (!smsSent) {
        return {
          success: false,
          message: "Failed to send OTP via SMS. Please try again.",
        };
      }
      return {
        success: true,
        message: "OTP sent to phone successfully",
        otp: process.env.NODE_ENV === "development" ? otp : undefined,
      };
    }

    return { success: false, message: "No email or phone found for user" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

/**
 * Verify OTP and change password
 */
export const verifyPasswordChangeOtp = async (
  userId: string,
  email: string | undefined,
  phone: string | undefined,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    if (!user.otp || !user.otpExpiresAt) {
      return { success: false, message: "No OTP found. Please request a new OTP" };
    }

    if (isOTPExpired(user.otpExpiresAt)) {
      return { success: false, message: "OTP has expired. Please request a new OTP" };
    }

    if (user.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return { success: true, message: "Password changed successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to change password",
    };
  }
};

/**
 * Update phone number
 */
export const updatePhoneNumber = async (
  userId: string,
  newPhone: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const existingUser = await User.findOne({ phone: newPhone, _id: { $ne: userId } });
    if (existingUser) {
      return { success: false, message: "Phone number already in use by another account" };
    }

    const user = await User.findById(userId);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    user.phone = newPhone;
    await user.save();

    return { success: true, message: "Phone number updated successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update phone number",
    };
  }
};

/**
 * Get all instructors with their approval status
 */
export const getAllInstructors = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: any[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const skip = (page - 1) * limit;

    // Build query
    const query: any = { role: "instructor" };

    // Search filter
    if (params?.search) {
      const safeSearch = escapeRegex(params.search);
      if (safeSearch) {
        query.$or = [
          { name: { $regex: safeSearch, $options: "i" } },
          { email: { $regex: safeSearch, $options: "i" } },
        ];
      }
    }

    // Status filter
    if (params?.status === "pending") {
      query.isApproved = false;
    } else if (params?.status === "approved") {
      query.isApproved = true;
    }

    const total = await User.countDocuments(query);
    const instructors = await User.find(query)
      .select("-password -otp -otpExpiresAt -refreshToken -verificationToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      message: "Instructors retrieved successfully",
      data: instructors,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get instructors",
    };
  }
};

/**
 * Get approved instructors (public)
 */
export const getApprovedInstructorsPublic = async (): Promise<{
  success: boolean;
  message: string;
  data?: any[];
}> => {
  try {
    const instructors = await User.find({ role: "instructor", isApproved: true })
      .select("_id name email role profileImage bio expertise qualification institution yearsOfExperience phone createdAt")
      .sort({ createdAt: 1 });

    return {
      success: true,
      message: "Approved instructors retrieved successfully",
      data: instructors,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get approved instructors",
    };
  }
};

/**
 * Approve instructor (super admin only)
 */
export const approveInstructor = async (
  instructorId: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return { success: false, message: "Instructor not found" };
    }

    if (instructor.role !== "instructor") {
      return {
        success: false,
        message: "User is not an instructor",
      };
    }

    instructor.isApproved = true;
    await instructor.save();

    // Send approval email
    if (instructor.email) {
      sendInstructorApprovalEmail(instructor.email, instructor.name, true);
    }

    return {
      success: true,
      message: "Instructor approved successfully",
      data: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        isApproved: instructor.isApproved,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to approve instructor",
    };
  }
};

/**
 * Reject/Unapprove instructor (super admin only)
 */
export const rejectInstructor = async (
  instructorId: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const instructor = await User.findById(instructorId);

    if (!instructor) {
      return { success: false, message: "Instructor not found" };
    }

    if (instructor.role !== "instructor") {
      return {
        success: false,
        message: "User is not an instructor",
      };
    }

    instructor.isApproved = false;
    await instructor.save();

    // Send rejection/revocation email
    if (instructor.email) {
      sendInstructorApprovalEmail(instructor.email, instructor.name, false);
    }

    return {
      success: true,
      message: "Instructor approval rejectedd successfully",
      data: {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        isApproved: instructor.isApproved,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reject instructor",
    };
  }
};

/**
 * Get user profile with related student/guardian info
 */
export const getUserProfile = async (userId: string): Promise<AuthResponse> => {
  try {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    let guardianInfo: any = null;
    let studentInfo: any = null;

    if (user.role === "student") {
      // Get student's guardian (1:1 relationship)
      const studentProfile = await StudentProfile.findOne({ userId }).populate({
        path: "guardianId",
        select: "name email phone role isVerified createdAt",
      });

      if (studentProfile?.guardianId) {
        guardianInfo = studentProfile.guardianId;
      }
    } else if (user.role === "guardian") {
      // Get guardian's student from GuardianProfile (authoritative source)
      // A guardian may have multiple students, but typically uses the first
      const guardianProfiles = await GuardianProfile.find({ userId })
        .populate({
          path: "studentId",
          select: "name email phone role isVerified createdAt",
        })
        .lean();

      if (guardianProfiles && guardianProfiles.length > 0) {
        // Return first student (most common case)
        studentInfo = guardianProfiles[0].studentId;
      }
    }

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user,
        relations: {
          guardian: guardianInfo, // For students
          student: studentInfo,    // For guardians
        },
        accessToken: "",
        refreshToken: "",
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to get profile",
      error: error.message,
    };
  }
};

/**
 * Guardian: link an existing student to the guardian account
 */
export const connectChildAsGuardian = async (
  guardianId: string,
  payload: { studentId?: string; studentEmail?: string; studentPhone?: string }
): Promise<{ success: boolean; message: string; data?: any; error?: string }> => {
  try {
    const guardian = await User.findById(guardianId);

    if (!guardian || guardian.role !== "guardian") {
      return { success: false, message: "Only guardians can connect students" };
    }

    const query: any = {};
    if (payload.studentId) {
      query._id = payload.studentId;
    } else if (payload.studentEmail) {
      query.email = payload.studentEmail;
    } else if (payload.studentPhone) {
      query.phone = payload.studentPhone;
    }

    if (Object.keys(query).length === 0) {
      return { success: false, message: "Student email, phone, or ID is required" };
    }

    const student = await User.findOne(query);
    if (!student || student.role !== "student") {
      return { success: false, message: "Student not found" };
    }

    // Link guardian to student (both directions)
    const guardianChildren = (guardian.children || []).map(id => id.toString());
    if (!guardianChildren.includes(student._id.toString())) {
      guardian.children = [...(guardian.children || []), student._id] as any;
    }

    const studentGuardians = (student.guardians || []).map(id => id.toString());
    if (!studentGuardians.includes(guardian._id.toString())) {
      student.guardians = [...(student.guardians || []), guardian._id] as any;
    }

    await Promise.all([guardian.save(), student.save()]);

    // Upsert student profile guardian pointer (non-blocking)
    StudentProfile.findOneAndUpdate(
      { userId: student._id },
      { $setOnInsert: { userId: student._id }, $set: { guardianId: guardian._id } },
      { upsert: true }
    )

    // Upsert guardian profile with studentId pointer (non-blocking)
    GuardianProfile.findOneAndUpdate(
      { userId: guardian._id },
      { $setOnInsert: { userId: guardian._id }, $set: { studentId: student._id } },
      { upsert: true }
    )

    return {
      success: true,
      message: "Student linked to guardian",
      data: {
        guardian: {
          id: guardian._id,
          name: guardian.name,
          email: guardian.email,
          children: guardian.children,
        },
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
        },
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to connect child", error: error.message };
  }
};

/**
 * Admin: List users with pagination, search, and role filter
 */
export const listUsersAdmin = async (params: { page?: number; limit?: number; search?: string; role?: string }) => {
  try {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(10, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (params.role && ["admin", "manager", "instructor", "student", "guardian"].includes(params.role)) {
      filter.role = params.role;
    }
    if (params.search) {
      const q = escapeRegex(params.search);
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
        ];
      }
    }

    const [total, users, totalsByRole] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select("-password -otp -otpExpiresAt -refreshToken -verificationToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]),
    ]);

    const counts: any = { totalUsers: 0, students: 0, instructors: 0, admins: 0, guardians: 0 };
    counts.totalUsers = totalsByRole.reduce((a: number, r: any) => a + r.count, 0);
    for (const r of totalsByRole) {
      if (r._id === "student") counts.students = r.count;
      if (r._id === "instructor") counts.instructors = r.count;
      if (r._id === "admin") counts.admins = r.count;
      if (r._id === "guardian") counts.guardians = r.count;
    }

    return {
      success: true,
      message: "Users retrieved",
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      counts,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to list users" };
  }
};

/** Admin: Create a user */
export const createUserAdmin = async (input: { name: string; email?: string; phone?: string; password: string; role: "student" | "instructor" | "guardian" | "admin" | "manager"; }) => {
  try {
    const { name, email, phone, password, role } = input;
    if (!email && !phone) {
      return { success: false, message: "Email or phone is required" };
    }
    const existing = await User.findOne({ $or: [ email ? { email } : undefined, phone ? { phone } : undefined ].filter(Boolean) as any });
    if (existing) {
      return { success: false, message: "User with provided email/phone already exists" };
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, phone, password: hashed, role, isVerified: true });
    const safe = await User.findById(user._id).select("-password -otp -otpExpiresAt -refreshToken -verificationToken");
    return { success: true, message: "User created", data: safe };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to create user" };
  }
};

/** Admin: Get user by id */
export const getUserByIdAdmin = async (id: string) => {
  try {
    const user = await User.findById(id).select("-password -otp -otpExpiresAt -refreshToken -verificationToken");
    if (!user) return { success: false, message: "User not found" };
    return { success: true, message: "User retrieved", data: user };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to get user" };
  }
};

/** Admin: Update user */
export const updateUserAdmin = async (id: string, updates: Partial<{ name: string; email: string; phone: string; password: string; role: string; isBlocked: boolean }>) => {
  try {
    const toSet: any = {};
    if (updates.name) toSet.name = updates.name;
    if (updates.email) toSet.email = updates.email;
    if (updates.phone) toSet.phone = updates.phone;
    if (updates.password) toSet.password = await bcrypt.hash(updates.password, 10);
    if (typeof updates.isBlocked === 'boolean') toSet.isBlocked = updates.isBlocked;
    const user = await User.findByIdAndUpdate(id, { $set: toSet }, { new: true });
    if (!user) return { success: false, message: "User not found" };
    const safe = await User.findById(id).select("-password -otp -otpExpiresAt -refreshToken -verificationToken");
    return { success: true, message: "User updated", data: safe };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update user" };
  }
};

/** Admin: Delete user */
export const deleteUserAdmin = async (id: string) => {
  try {
    await User.findByIdAndDelete(id);
    return { success: true, message: "User deleted" };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to delete user" };
  }
};

/** Admin: Update user role */
export const updateUserRoleAdmin = async (id: string, role: "student" | "instructor" | "guardian" | "admin") => {
  try {
    const user = await User.findByIdAndUpdate(id, { $set: { role } }, { new: true });
    if (!user) return { success: false, message: "User not found" };
    const safe = await User.findById(id).select("-password -otp -otpExpiresAt -refreshToken -verificationToken");
    return { success: true, message: "Role updated", data: safe };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update user role" };
  }
};

/** Instructor: Get enrolled students (by assigned Batches and Courses) */
export const getInstructorStudents = async (
  instructorId: string,
  params: { page?: number; limit?: number; search?: string; batchId?: string; courseId?: string }
) => {
  try {
    const { Types } = await import("mongoose");
    const { Course } = await import("../../course/model/course.model");
    const { Enrollment } = await import("../../enrollment/model/enrollment.model");
    const { Batch } = await import("../../batch/model/batch.model");

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 20;
    const skip = (page - 1) * limit;

    const instObjId = Types.ObjectId.isValid(instructorId) ? new Types.ObjectId(instructorId) : null;

    // 1. Find all Batches where this user is assigned as instructor
    const batchOrConditions: any[] = [{ instructorId: instructorId }];
    if (instObjId) {
      batchOrConditions.push({ instructorId: instObjId });
    }
    const batchFilter: any = { $or: batchOrConditions };
    if (params.batchId && Types.ObjectId.isValid(params.batchId)) {
      batchFilter._id = new Types.ObjectId(params.batchId);
    }
    const instructorBatches = await Batch.find(batchFilter)
      .populate("courseId", "_id title thumbnail price")
      .populate("instructorId", "name email phone profileImage qualification")
      .lean();

    const instructorBatchIds = instructorBatches.map((b) => b._id);
    const batchStudentIdSet = new Set<string>();
    instructorBatches.forEach((b) => {
      (b.enrolledStudents || []).forEach((st: any) => {
        const idStr = (st?._id || st)?.toString();
        if (idStr) batchStudentIdSet.add(idStr);
      });
    });

    // 2. Find all Courses where this user is primary or co-instructor
    const courseOrConditions: any[] = [
      { instructorId: instructorId },
      { instructorIds: instructorId },
    ];
    if (instObjId) {
      courseOrConditions.push({ instructorId: instObjId });
      courseOrConditions.push({ instructorIds: instObjId });
    }
    const courseFilter: any = { $or: courseOrConditions };
    if (params.courseId && Types.ObjectId.isValid(params.courseId)) {
      courseFilter._id = new Types.ObjectId(params.courseId);
    }
    const instructorCourses = await Course.find(courseFilter)
      .select("_id title thumbnail price")
      .lean();
    const instructorCourseIds = instructorCourses.map((c) => c._id);

    // 3. Find Enrollments strictly for this tutor's purview:
    // - assigned to this instructor's batches (batchId in instructorBatchIds)
    // - explicitly assigned to this instructor (assignedInstructorId == instructorId)
    // - or student is explicitly in batch's enrolledStudents
    // - or course enrollment has NO other batch assigned
    const enrollmentOr: any[] = [];
    if (instructorBatchIds.length > 0) {
      enrollmentOr.push({ batchId: { $in: instructorBatchIds } });
    }
    enrollmentOr.push({ assignedInstructorId: instructorId });
    if (instObjId) {
      enrollmentOr.push({ assignedInstructorId: instObjId });
    }
    if (instructorCourseIds.length > 0) {
      enrollmentOr.push({
        courseId: { $in: instructorCourseIds },
        $or: [
          { assignedInstructorId: { $in: [instObjId, instructorId].filter(Boolean) } },
          ...(instructorBatchIds.length > 0 ? [{ batchId: { $in: instructorBatchIds } }] : []),
          { batchId: { $exists: false } },
          { batchId: null },
        ],
      });
    }
    if (batchStudentIdSet.size > 0) {
      const studentObjIds = Array.from(batchStudentIdSet)
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
      if (studentObjIds.length > 0) {
        enrollmentOr.push({ studentId: { $in: studentObjIds } });
      }
    }

    let enrollments: any[] = [];
    if (enrollmentOr.length > 0) {
      enrollments = await Enrollment.find({ $or: enrollmentOr })
        .populate("courseId", "_id title thumbnail price")
        .populate("batchId", "_id batchName batchNumber schedule zoomLink whatsappGroupUrl status startDate")
        .sort({ updatedAt: -1 })
        .lean();
    }

    // Combine all unique student IDs from both batches and enrollments
    const allStudentIdSet = new Set<string>();
    batchStudentIdSet.forEach((id) => allStudentIdSet.add(id));
    enrollments.forEach((e) => {
      const sId = (e.studentId?._id || e.studentId)?.toString();
      if (sId) allStudentIdSet.add(sId);
    });

    const distinctStudentIds = Array.from(allStudentIdSet)
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));

    if (distinctStudentIds.length === 0) {
      return {
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 1,
        },
      };
    }

    // Build student query
    const searchQuery: any = {
      _id: { $in: distinctStudentIds },
    };

    if (params.search) {
      const safeSearch = escapeRegex(params.search);
      if (safeSearch) {
        searchQuery.$or = [
          { name: { $regex: safeSearch, $options: "i" } },
          { email: { $regex: safeSearch, $options: "i" } },
          { phoneNumber: { $regex: safeSearch, $options: "i" } },
        ];
      }
    }

    const total = await User.countDocuments(searchQuery);

    const students = await User.find(searchQuery)
      .select("-password -otp -otpExpiresAt -refreshToken -verificationToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Enrich each student with batch & course details
    const enrichedStudents = students.map((student: any) => {
      const stIdStr = student._id.toString();

      // Find enrollments for this student
      const stEnrollments = enrollments.filter(
        (e) => (e.studentId?._id || e.studentId)?.toString() === stIdStr
      );

      // Find batches for this student
      const stBatches = instructorBatches.filter((b) => {
        const inEnrolledList = (b.enrolledStudents || []).some(
          (st: any) => (st?._id || st)?.toString() === stIdStr
        );
        const inEnrollment = stEnrollments.some(
          (e) => (e.batchId?._id || e.batchId)?.toString() === b._id.toString()
        );
        return inEnrolledList || inEnrollment;
      });

      // Primary batch & course
      const primaryBatch =
        stBatches[0] ||
        stEnrollments.find((e) => e.batchId && typeof e.batchId === "object")?.batchId ||
        null;

      const primaryCourse =
        primaryBatch?.courseId && typeof primaryBatch.courseId === "object"
          ? primaryBatch.courseId
          : stEnrollments.find((e) => e.courseId && typeof e.courseId === "object")?.courseId || null;

      const latestEnrollment = stEnrollments[0] || null;

      return {
        ...student,
        batches: stBatches.map((b) => ({
          _id: b._id,
          batchName: b.batchName,
          batchNumber: b.batchNumber,
          schedule: b.schedule,
          zoomLink: b.zoomLink,
          whatsappGroupUrl: b.whatsappGroupUrl,
          status: b.status,
          course: b.courseId,
        })),
        primaryBatch: primaryBatch
          ? {
              _id: primaryBatch._id,
              batchName: primaryBatch.batchName,
              batchNumber: primaryBatch.batchNumber,
              schedule: primaryBatch.schedule,
              zoomLink: primaryBatch.zoomLink,
              whatsappGroupUrl: primaryBatch.whatsappGroupUrl,
              status: primaryBatch.status,
            }
          : null,
        primaryCourse: primaryCourse
          ? {
              _id: primaryCourse._id,
              title: primaryCourse.title,
              thumbnail: primaryCourse.thumbnail,
            }
          : null,
        progress: latestEnrollment?.progress ?? (latestEnrollment?.completionPercentage ?? 0),
        completionPercentage: latestEnrollment?.completionPercentage ?? (latestEnrollment?.progress ?? 0),
        isCompleted: latestEnrollment?.isCompleted || false,
        enrolledAt: latestEnrollment?.createdAt || student.createdAt,
      };
    });

    return {
      success: true,
      data: enrichedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error: any) {
    console.error("Error in getInstructorStudents:", error);
    return { success: false, message: error.message || "Failed to get students" };
  }
};

/** Instructor: Get individual student details */
export const getInstructorStudentById = async (instructorId: string, studentId: string) => {
  try {
    const { Types } = await import("mongoose");
    const { Course } = await import("../../course/model/course.model");
    const { Enrollment } = await import("../../enrollment/model/enrollment.model");
    const { Batch } = await import("../../batch/model/batch.model");

    const instObjId = Types.ObjectId.isValid(instructorId) ? new Types.ObjectId(instructorId) : null;
    const studentObjId = Types.ObjectId.isValid(studentId) ? new Types.ObjectId(studentId) : null;

    if (!studentObjId) {
      return { success: false, message: "Invalid student ID" };
    }

    // 1. Check if student is in any of instructor's batches
    const batchOrConditions: any[] = [{ instructorId: instructorId }];
    if (instObjId) batchOrConditions.push({ instructorId: instObjId });

    const instructorBatches = await Batch.find({
      $or: batchOrConditions,
      enrolledStudents: studentObjId,
    })
      .populate("courseId", "_id title thumbnail price")
      .lean();

    // 2. Check instructor's courses
    const courseOrConditions: any[] = [
      { instructorId: instructorId },
      { instructorIds: instructorId },
    ];
    if (instObjId) {
      courseOrConditions.push({ instructorId: instObjId });
      courseOrConditions.push({ instructorIds: instObjId });
    }
    const instructorCourses = await Course.find({ $or: courseOrConditions }).lean();
    const instructorCourseIds = instructorCourses.map((c) => c._id);

    // 3. Check enrollments
    const allInstructorBatches = await Batch.find({ $or: batchOrConditions }).lean();
    const allInstructorBatchIds = allInstructorBatches.map((b) => b._id);

    const enrollmentOr: any[] = [
      { assignedInstructorId: instructorId },
      ...(instObjId ? [{ assignedInstructorId: instObjId }] : []),
    ];
    if (allInstructorBatchIds.length > 0) {
      enrollmentOr.push({ batchId: { $in: allInstructorBatchIds } });
    }
    if (instructorCourseIds.length > 0) {
      enrollmentOr.push({ courseId: { $in: instructorCourseIds } });
    }

    const studentEnrollments = await Enrollment.find({
      studentId: studentObjId,
      $or: enrollmentOr,
    })
      .populate("courseId", "_id title thumbnail price level duration")
      .populate("batchId", "_id batchName batchNumber schedule zoomLink whatsappGroupUrl status startDate")
      .lean();

    const isAuthorized = instructorBatches.length > 0 || studentEnrollments.length > 0;

    if (!isAuthorized) {
      return {
        success: false,
        message: "Student not found or not enrolled in your batches/courses",
      };
    }

    // 4. Get student profile details
    const student = await User.findById(studentObjId)
      .select("-password -otp -otpExpiresAt -refreshToken -verificationToken")
      .lean();

    if (!student) {
      return { success: false, message: "Student not found" };
    }

    return {
      success: true,
      data: {
        ...student,
        batches: instructorBatches,
        enrollments: studentEnrollments,
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to get student details" };
  }
};

/**
 * Get instructor dashboard stats
 */
export const getInstructorDashboardStats = async (instructorId: string) => {
  try {
    const { Types } = await import("mongoose");
    const { Course } = await import("../../course/model/course.model");
    const { Enrollment } = await import("../../enrollment/model/enrollment.model");
    const { Batch } = await import("../../batch/model/batch.model");

    const instObjId = Types.ObjectId.isValid(instructorId) ? new Types.ObjectId(instructorId) : null;

    // 1. Batches taught by this instructor
    const batchOr: any[] = [{ instructorId: instructorId }];
    if (instObjId) batchOr.push({ instructorId: instObjId });
    const batches = await Batch.find({ $or: batchOr }).lean();
    const batchIds = batches.map((b) => b._id);
    const batchCourseIds = batches.map((b) => b.courseId).filter(Boolean);

    const batchStudentIds = new Set<string>();
    batches.forEach((b) => {
      (b.enrolledStudents || []).forEach((st: any) => {
        const id = (st?._id || st)?.toString();
        if (id) batchStudentIds.add(id);
      });
    });

    // 2. Courses (primary, co-instructor, or batch-associated)
    const courseOr: any[] = [
      { instructorId: instructorId },
      { instructorIds: instructorId },
    ];
    if (instObjId) {
      courseOr.push({ instructorId: instObjId });
      courseOr.push({ instructorIds: instObjId });
    }
    if (batchCourseIds.length > 0) {
      courseOr.push({ _id: { $in: batchCourseIds } });
    }
    const courses = await Course.find({ $or: courseOr }).lean();
    const courseIds = courses.map((c) => c._id);

    // 3. Enrollments under this instructor's purview
    const enrollmentOr: any[] = [];
    if (batchIds.length > 0) enrollmentOr.push({ batchId: { $in: batchIds } });
    enrollmentOr.push({ assignedInstructorId: instructorId });
    if (instObjId) enrollmentOr.push({ assignedInstructorId: instObjId });
    if (courseIds.length > 0) enrollmentOr.push({ courseId: { $in: courseIds } });
    if (batchStudentIds.size > 0) {
      const bObjIds = Array.from(batchStudentIds)
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));
      if (bObjIds.length > 0) {
        enrollmentOr.push({ studentId: { $in: bObjIds } });
      }
    }

    let enrollments: any[] = [];
    if (enrollmentOr.length > 0) {
      enrollments = await Enrollment.find({ $or: enrollmentOr }).lean();
    }

    // 4. Calculate stats
    const totalStudentIdSet = new Set<string>();
    batchStudentIds.forEach((id) => totalStudentIdSet.add(id));
    enrollments.forEach((e) => {
      const sId = (e.studentId?._id || e.studentId)?.toString();
      if (sId) totalStudentIdSet.add(sId);
    });

    const totalStudents = totalStudentIdSet.size;
    const totalRevenue = courses.reduce((sum, course) => {
      const count = enrollments.filter(
        (e) => (e.courseId?._id || e.courseId)?.toString() === course._id.toString()
      ).length;
      return sum + (course.price || 0) * count;
    }, 0);

    const completedStudents = enrollments.filter(
      (e) => (e.completionPercentage ?? e.progress ?? 0) >= 100
    ).length;
    const completionRate =
      enrollments.length > 0 ? Math.round((completedStudents / enrollments.length) * 100) : 0;
    const studentEngagement = Math.min(95, Math.max(70, completionRate || 85));

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthRevenue = courses.reduce((sum, course) => {
      const courseEnrollments = enrollments.filter((e) => {
        const enrollDate = e.createdAt ? new Date(e.createdAt) : new Date();
        return (
          (e.courseId?._id || e.courseId)?.toString() === course._id.toString() &&
          enrollDate >= monthStart
        );
      });
      return sum + (course.price || 0) * courseEnrollments.length;
    }, 0);

    return {
      success: true,
      message: "Instructor stats retrieved",
      data: {
        studentEngagement,
        completionRate,
        totalRevenue,
        thisMonthRevenue,
        totalStudents,
        totalBatches: batches.length,
        activeBatches: batches.filter((b) => b.status === "ongoing" || b.status === "upcoming").length,
        totalCourses: courses.length,
        publishedCourses: courses.filter((c) => c.isPublished).length,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch instructor stats",
    };
  }
};

/**
 * Select role for new Google OAuth user and generate tokens
 */
export const selectRoleForGoogleUser = async (
  userId: string,
  role: "student" | "instructor" | "guardian"
): Promise<{
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: any;
  };
}> => {
  try {
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Update user role
    user.role = role;
    user.isNewGoogleUser = false;
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(userId, role);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      success: true,
      message: "Role selected successfully",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to select role",
    };
  }
};

/**
 * Forgot password - Send OTP to email
 */
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: "If an account exists with this email, you will receive an OTP",
      };
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpirationTime();

    // Save OTP to user
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP via email
    await sendOTPEmail(email, otp, "password reset");

    return {
      success: true,
      message: "OTP sent to your email",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

/**
 * Verify OTP for password reset
 */
export const verifyForgotPasswordOtp = async (
  email: string,
  otp: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    if (!user.otp || user.otp !== otp) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    if (isOTPExpired(user.otpExpiresAt!)) {
      return {
        success: false,
        message: "OTP expired",
      };
    }

    return {
      success: true,
      message: "OTP verified",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to verify OTP",
    };
  }
};

/**
 * Reset password with OTP
 */
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Verify OTP
    if (!user.otp || user.otp !== otp) {
      return {
        success: false,
        message: "Invalid OTP",
      };
    }

    if (isOTPExpired(user.otpExpiresAt!)) {
      return {
        success: false,
        message: "OTP expired",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    // Send confirmation email
    await sendWelcomeEmail(email, user.name, "Password Reset Successful");

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to reset password",
    };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (
  userId: string,
  profileData: {
    name?: string;
    bio?: string;
    phone?: string;
    expertise?: string;
    qualification?: string;
    institution?: string;
    yearsOfExperience?: number;
  }
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // If phone is being updated, ensure it's not used by another user
    if (profileData.phone && profileData.phone !== user.phone) {
      console.log(`[updateProfile phone check] incoming: "${profileData.phone}", current user: id=${userId}, email=${user.email}, phone="${user.phone}"`);
      const existing = await User.findOne({ phone: profileData.phone.trim() });
      if (existing) {
        console.log(`[updateProfile phone check] found existing user: id=${existing._id}, email=${existing.email}, phone="${existing.phone}"`);
      }
      if (existing && existing._id.toString() !== userId) {
        console.log(`[updateProfile phone check] REJECTING: existing id ${existing._id} !== current user id ${userId}`);
        return {
          success: false,
          message: "Phone number already in use by another account",
        };
      }
      user.phone = profileData.phone.trim();
    }

    // Update allowed fields
    if (profileData.name) user.name = profileData.name;
    if (profileData.bio !== undefined) user.bio = profileData.bio;
    if (profileData.expertise !== undefined) {
      if (Array.isArray(profileData.expertise)) {
        user.expertise = profileData.expertise;
      } else if (typeof profileData.expertise === "string") {
        user.expertise = profileData.expertise
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    if (profileData.qualification !== undefined) user.qualification = profileData.qualification;
    if (profileData.institution !== undefined) user.institution = profileData.institution;
    if (profileData.yearsOfExperience !== undefined) {
      user.yearsOfExperience = profileData.yearsOfExperience;
    }

    await user.save();

    // If user is also in TeamMember (e.g. CEO / Lead Instructor), sync updates
    try {
      const { TeamMember } = await import("../../team/model/team.model.js");
      await TeamMember.updateMany(
        { 
          $or: [
            { userId: user._id.toString() },
            { name: { $regex: new RegExp(`^${user.name.trim()}$`, "i") } }
          ]
        },
        {
          $set: {
            bio: user.bio,
            qualification: user.qualification,
            institution: user.institution,
            yearsOfExperience: user.yearsOfExperience,
            expertise: user.expertise,
          }
        }
      );
    } catch (teamSyncErr) {
      // Non-blocking
    }

    return {
      success: true,
      message: "Profile updated successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
};
/**
 * Update profile photo
 */
export const updateProfilePhoto = async (
  userId: string,
  profileImage: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    user.profileImage = profileImage;
    await user.save();

    return {
      success: true,
      message: "Profile photo updated successfully",
      data: user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update profile photo",
    };
  }
};

// Aliases for compatibility
export const guardianConnectChild = async (
  guardianId: string,
  studentEmail?: string,
  studentPhone?: string
) => {
  return connectChildAsGuardian(guardianId, { studentEmail, studentPhone });
};

export const studentAcceptGuardian = async (studentId: string, guardianId: string) => {
  try {
    const student = await User.findById(studentId);
    const guardian = await User.findById(guardianId);

    if (!student || student.role !== "student") {
      return { success: false, message: "Student not found" };
    }

    if (!guardian || guardian.role !== "guardian") {
      return { success: false, message: "Guardian not found" };
    }

    // Link guardian to student (both directions)
    const guardianChildren = (guardian.children || []).map(id => id.toString());
    if (!guardianChildren.includes(student._id.toString())) {
      guardian.children = [...(guardian.children || []), student._id] as any;
    }

    const studentGuardians = (student.guardians || []).map(id => id.toString());
    if (!studentGuardians.includes(guardian._id.toString())) {
      student.guardians = [...(student.guardians || []), guardian._id] as any;
    }

    await Promise.all([guardian.save(), student.save()]);

    // Upsert student profile guardian pointer (non-blocking)
    StudentProfile.findOneAndUpdate(
      { userId: student._id },
      { $setOnInsert: { userId: student._id }, $set: { guardianId: guardian._id } },
      { upsert: true }
    )

    // Upsert guardian profile with studentId pointer (non-blocking)
    GuardianProfile.findOneAndUpdate(
      { userId: guardian._id },
      { $setOnInsert: { userId: guardian._id }, $set: { studentId: student._id } },
      { upsert: true }
    )

    return {
      success: true,
      message: "Guardian accepted",
      data: {
        guardian: {
          id: guardian._id,
          name: guardian.name,
          email: guardian.email,
        },
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
        },
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to accept guardian" };
  }
};

/**
 * Get lightweight admin dashboard stats (optimized)
 */
export const getAdminDashboardStats = async () => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          students: {
            $sum: { $cond: [{ $eq: ["$role", "student"] }, 1, 0] },
          },
          instructors: {
            $sum: { $cond: [{ $eq: ["$role", "instructor"] }, 1, 0] },
          },
          guardians: {
            $sum: { $cond: [{ $eq: ["$role", "guardian"] }, 1, 0] },
          },
          admins: {
            $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] },
          },
        },
      },
    ]);

    // Calculate revenue from approved orders
    const Order = require("../../order/model/order.model").Order;
    
    const revenueStats = await Order.aggregate([
      {
        $match: {
          paymentStatus: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    // Calculate this month's revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthRevenue = await Order.aggregate([
      {
        $match: {
          paymentStatus: "approved",
          createdAt: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$price" },
        },
      },
    ]);

    const revenue = revenueStats[0] || { totalRevenue: 0, totalOrders: 0 };
    const monthRevenue = thisMonthRevenue[0] || { revenue: 0 };

    return {
      success: true,
      message: "Dashboard stats retrieved",
      data: {
        ...(stats[0] || {
          totalUsers: 0,
          students: 0,
          instructors: 0,
          guardians: 0,
          admins: 0,
        }),
        totalRevenue: revenue.totalRevenue,
        totalOrders: revenue.totalOrders,
        thisMonthRevenue: monthRevenue.revenue,
      },
    };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to get stats" };
  }
};
