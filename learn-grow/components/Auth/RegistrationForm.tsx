"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { sendOTP, verifyOTP, register, loginWithGoogle } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Clock,
} from "lucide-react";

type Step = "contact" | "otp" | "details";

export default function RegistrationForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  // Sync language with Navbar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = (localStorage.getItem("language") || localStorage.getItem("preferredLanguage")) as "bn" | "en";
      if (stored) setLanguage(stored);

      const handleLangChange = (e: any) => {
        const newLang = (e.detail?.language || localStorage.getItem("language") || localStorage.getItem("preferredLanguage") || "bn") as "bn" | "en";
        setLanguage(newLang);
      };
      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendOTP = async () => {
    setError("");

    if (!formData.email) {
      setError(language === "bn" ? "অনুগ্রহ করে ইমেইল লিখুন" : "Email is required");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setError(language === "bn" ? "সঠিক ইমেইল ফরম্যাট দিন" : "Invalid email format");
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendOTP(formData.email, undefined);

      if (result.success) {
        setStep("otp");
        setTimer(300); // 5 minutes

        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        toast.success(
          language === "bn"
            ? "আপনার ইমেইলে ওটিপি (OTP) পাঠানো হয়েছে!"
            : "OTP sent successfully to your email!"
        );
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err: any) {
      const errorMsg = err.message || (language === "bn" ? "ওটিপি পাঠানো যায়নি" : "Failed to send OTP");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");

    if (!formData.otp) {
      setError(language === "bn" ? "ওটিপি কোড দিন" : "OTP is required");
      return;
    }

    if (formData.otp.length !== 6) {
      setError(language === "bn" ? "ওটিপি অবশ্যই ৬ ডিজিটের হতে হবে" : "OTP must be 6 digits");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyOTP(formData.otp, formData.email, undefined);

      if (result.success) {
        setStep("details");
        toast.success(language === "bn" ? "ওটিপি সফলভাবে যাচাই করা হয়েছে!" : "OTP verified successfully!");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err: any) {
      const errorMsg = err.message || (language === "bn" ? "ওটিপি যাচাই করা যায়নি" : "Failed to verify OTP");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError(language === "bn" ? "আপনার পুরো নাম লিখুন" : "Name is required");
      return;
    }

    if (!formData.password) {
      setError(language === "bn" ? "পাসওয়ার্ড লিখুন" : "Password is required");
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError(
        language === "bn"
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
          : "Password must be at least 6 characters"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(language === "bn" ? "উভয় পাসওয়ার্ড একই হতে হবে" : "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: "student",
      };

      const result = await register(userData as any);

      if (result.success) {
        toast.success(
          language === "bn"
            ? "রেজিস্ট্রেশন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..."
            : "Registration successful! Redirecting..."
        );
        router.push("/student");
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err: any) {
      const errorMsg = err.message || (language === "bn" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : "Registration failed");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleGoogleSignup = () => {
    try {
      loginWithGoogle();
    } catch (err: any) {
      toast.error(
        language === "bn"
          ? "গুগল সাইন-আপ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
          : "Google sign up failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#F8F9FA] via-[#EAF4FB]/40 to-[#F5F0FF]/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Card */}
      <div className="max-w-5xl w-full mx-auto bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Column: Visual Ed-Tech Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-wide text-white mb-6">
              <Sparkles size={14} className="text-amber-400" />
              <span>{language === "bn" ? "লার্ন অ্যান্ড গ্রো একাডেমি" : "Learn & Grow Academy"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-3">
              {language === "bn"
                ? "নতুন শতাব্দীর কোডিং ও রোবোটিক্স প্ল্যাটফর্ম"
                : "Future-Ready STEM Learning for Kids"}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {language === "bn"
                ? "আজই ফ্রি রেজিস্ট্রেশন করে আপনার সন্তানের প্রযুক্তি শেখার আধুনিক যাত্রা শুরু করুন।"
                : "Create your student account in minutes and get instant access to live batches & STEM kits."}
            </p>
          </div>

          {/* Middle: Visual Preview */}
          <div className="my-6 relative z-10">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-700/80 bg-slate-800">
              <Image
                src="/courses/robotics-course-banner.jpg"
                alt="Junior Robotics Learning"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {language === "bn" ? "স্টুডেন্ট এনরোলমেন্ট" : "Student Enrollment"}
                  </span>
                  <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                    {language === "bn" ? "লাইভ ক্লাস ও হ্যান্ডস-অন প্রজেক্ট" : "Live Classes & Hands-on Projects"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Perks */}
          <div className="relative z-10 space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span>{language === "bn" ? "১০০% লাইভ ইন্টারঅ্যাক্টিভ ব্যাচ" : "100% Live Interactive Batches"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
              <span>{language === "bn" ? "১০-১৫ জনের ছোট মাইক্রো-ব্যাচ" : "Micro-Batches of 10-15 Students"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-amber-400 flex-shrink-0" />
              <span>{language === "bn" ? "৭ দিনের ১০০% মানি-ব্যাক গ্যারান্টি" : "7-Day Money-Back Guarantee"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Steps Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>{language === "bn" ? "নতুন অ্যাকাউন্ট" : "New Account"}</span>
                </span>

                {/* Step indicator */}
                <span className="text-xs font-bold text-slate-400">
                  {step === "contact" && (language === "bn" ? "ধাপ ১ / ৩" : "Step 1 of 3")}
                  {step === "otp" && (language === "bn" ? "ধাপ ২ / ৩" : "Step 2 of 3")}
                  {step === "details" && (language === "bn" ? "ধাপ ৩ / ৩" : "Step 3 of 3")}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight leading-tight">
                {step === "contact" && (language === "bn" ? "অ্যাকাউন্ট তৈরি করুন" : "Create Your Account")}
                {step === "otp" && (language === "bn" ? "ইমেইল ওটিপি যাচাই" : "Verify Your Email")}
                {step === "details" && (language === "bn" ? "প্রোফাইল তথ্য দিন" : "Complete Profile")}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {step === "contact" && (language === "bn" ? "আপনার ইমেইল দিয়ে শুরু করুন" : "Start with your email to join as a student")}
                {step === "otp" && (language === "bn" ? `${formData.email} এ পাঠানো ৬ ডিজিটের কোডটি লিখুন` : `Enter the 6-digit code sent to ${formData.email}`)}
                {step === "details" && (language === "bn" ? "আপনার নাম ও পাসওয়ার্ড সেট করুন" : "Set your full name and secure password")}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Step 1: Contact (Email) */}
            {step === "contact" && (
              <div>
                {/* Google Sign up */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer mb-5 disabled:opacity-60"
                >
                  <FcGoogle size={20} />
                  <span>{language === "bn" ? "গুগল দিয়ে সাইন-আপ করুন" : "Sign up with Google"}</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {language === "bn" ? "অথবা ইমেইল দিয়ে" : "Or with email"}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={language === "bn" ? "example@email.com" : "you@example.com"}
                        disabled={isLoading}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{language === "bn" ? "ওটিপি পাঠানো হচ্ছে..." : "Sending OTP..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === "bn" ? "ওটিপি কোড পাঠান" : "Continue with OTP"}</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === "bn" ? "৬ ডিজিটের ওটিপি কোড" : "6-Digit OTP Code"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      name="otp"
                      maxLength={6}
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="000000"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-base font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {timer > 0 ? (
                      <span className="font-semibold text-blue-600 inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 inline text-blue-600" />
                        <span>{language === "bn" ? `মেয়াদ: ${formatTimer()}` : `Expires in: ${formatTimer()}`}</span>
                      </span>
                    ) : (
                      <span className="font-semibold text-red-500">
                        {language === "bn" ? "ওটিপির মেয়াদ শেষ" : "OTP expired"}
                      </span>
                    )}
                  </span>
                  {timer === 0 && (
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      className="font-bold text-[#3B82F6] hover:underline cursor-pointer"
                    >
                      {language === "bn" ? "পুনরায় পাঠান" : "Resend OTP"}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || timer === 0 || formData.otp.length !== 6}
                  className="w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === "bn" ? "যাচাই করা হচ্ছে..." : "Verifying..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === "bn" ? "ওটিপি নিশ্চিত করুন" : "Verify OTP"}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("contact");
                    setFormData({ ...formData, otp: "" });
                    setError("");
                  }}
                  className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                >
                  {language === "bn" ? "← ইমেইল পরিবর্তন করুন" : "← Change Email"}
                </button>
              </div>
            )}

            {/* Step 3: Account Details */}
            {step === "details" && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === "bn" ? "পুরো নাম" : "Full Name"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={language === "bn" ? "আপনার নাম লিখুন" : "Your full name"}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === "bn" ? "মোবাইল নম্বর (ঐচ্ছিক)" : "Phone Number (Optional)"}
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === "bn" ? "পাসওয়ার্ড" : "Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={language === "bn" ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters"}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {language === "bn" ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder={language === "bn" ? "পুনরায় পাসওয়ার্ড লিখুন" : "Re-enter password"}
                      disabled={isLoading}
                      required
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === "bn" ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === "bn" ? "অ্যাকাউন্ট তৈরি সম্পন্ন করুন" : "Complete Registration"}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Login Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {language === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে? " : "Already have an account? "}
                <Link
                  href="/login"
                  className="font-black text-[#3B82F6] hover:text-blue-700 hover:underline"
                >
                  {language === "bn" ? "লগইন করুন" : "Sign in here"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
