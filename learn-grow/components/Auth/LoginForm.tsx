"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { login, loginWithGoogle } from "@/lib/auth";
import { FcGoogle } from "react-icons/fc";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Video,
  Target,
} from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  const sessionExpired = searchParams?.get("session_expired") === "true";
  const redirectParam = searchParams?.get("redirect");

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

  useEffect(() => {
    if (sessionExpired) {
      toast.warning(
        language === "bn"
          ? "আপনার সেশনের মেয়াদ শেষ হয়েছে। পুনরায় লগইন করুন।"
          : "Your session has expired. Please login again to continue."
      );
    }
  }, [sessionExpired, language]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      const msg = language === "bn" ? "অনুগ্রহ করে ইমেইল লিখুন" : "Email is required";
      setError(msg);
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      const msg = language === "bn" ? "সঠিক ইমেইল ফরম্যাট দিন" : "Invalid email format";
      setError(msg);
      return;
    }

    if (!password) {
      const msg = language === "bn" ? "পাসওয়ার্ড লিখুন" : "Password is required";
      setError(msg);
      return;
    }

    setIsLoading(true);

    try {
      const result = await login({ email: trimmedEmail, password });

      if (result.success) {
        toast.success(
          language === "bn"
            ? "লগইন সফল হয়েছে! ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে..."
            : "Login successful! Redirecting..."
        );

        // Check if there is a specific redirect query parameter
        if (redirectParam && redirectParam.startsWith("/")) {
          router.push(redirectParam);
          return;
        }

        // Redirect based on role
        const role = result.data?.user.role;
        if (role === "admin" || role === "super_admin") {
          router.push("/admin");
        } else if (role === "instructor") {
          router.push("/instructor");
        } else if (role === "guardian") {
          router.push("/guardian");
        } else if (role === "student") {
          router.push("/student");
        } else {
          router.push("/");
        }
      } else {
        const errorMsg =
          (result as any).errors && (result as any).errors.length > 0
            ? (result as any).errors.map((e: any) => e.message).join(", ")
            : result.message || (language === "bn" ? "লগইন ব্যর্থ হয়েছে" : "Login failed");
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg =
        err.message ||
        (language === "bn"
          ? "লগইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।"
          : "Login failed. Please try again.");
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      loginWithGoogle();
    } catch (err: any) {
      toast.error(
        language === "bn"
          ? "গুগল লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
          : "Google login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-[#F8F9FA] via-[#EAF4FB]/40 to-[#F5F0FF]/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background glowing ambient light orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Split Card */}
      <div className="max-w-5xl w-full mx-auto bg-white rounded-[32px] sm:rounded-[36px] shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        {/* Left Column: Visual Ed-Tech Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glow orb inside card */}
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
                ? "ভবিষ্যতের প্রযুক্তিতে আপনার সন্তানের যাত্রা"
                : "Empowering Young Innovators in STEM"}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              {language === "bn"
                ? "১০-১৫ জনের ছোট ব্যাচ, আসল রোবোটিক্স কিট এবং ১০০% লাইভ ক্লাসে প্রোগ্রামিং ও ইঞ্জিনিয়ারিংয়ের হাতেখড়ি।"
                : "Interactive live classes in small batches of 10-15 students with hands-on robotics kits & expert mentors."}
            </p>
          </div>

          {/* Middle: Course/Visual Preview */}
          <div className="my-6 relative z-10">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border border-slate-700/80 bg-slate-800">
              <Image
                src="/courses/robotics-course-banner.jpg"
                alt="STEM Robotics Learning"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {language === "bn" ? "রোবোটিক্স ও কোডিং ল্যাব" : "Robotics & Coding Lab"}
                  </span>
                  <p className="text-xs font-bold text-white mt-1 line-clamp-1">
                    Junior Robotics & Python AI for Teens
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Perks */}
          <div className="relative z-10 space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span>{language === "bn" ? "১০০% লাইভ ক্লাস — কোনো রেকর্ডেড ভিডিও নয়" : "100% Live Instructor-Led Classes"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-blue-400 flex-shrink-0" />
              <span>{language === "bn" ? "১০-১৫ জনের ছোট ব্যাচে ব্যক্তিগত যত্ন" : "Micro-Batches of 10-15 Students"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-amber-400 flex-shrink-0" />
              <span>{language === "bn" ? "৭ দিনের ১০০% মানি-ব্যাক গ্যারান্টি" : "7-Day Satisfaction Guarantee"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: High-Trust Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>{language === "bn" ? "স্বাগতম" : "Welcome Back"}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight leading-tight">
                {language === "bn" ? "লগইন করুন" : "Sign in to your account"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                {language === "bn"
                  ? "লাইভ ক্লাস, ড্যাশবোর্ড ও কোর্স সামগ্রী অ্যাক্সেস করতে প্রবেশ করুন"
                  : "Access your live classes, projects & learning portal"}
              </p>

              {/* Redirect notice pill */}
              {redirectParam && (
                <div className="mt-3 p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-2 text-xs text-blue-800 font-semibold">
                  <Target className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    {language === "bn"
                      ? "লগইন সম্পন্ন হওয়ার পর আপনাকে সরাসরি কোর্সে নিয়ে যাওয়া হবে।"
                      : "You will be automatically redirected to your course after sign-in."}
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            {/* Google One-Click Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer mb-5 disabled:opacity-60"
            >
              <FcGoogle size={20} />
              <span>{language === "bn" ? "গুগল দিয়ে প্রবেশ করুন" : "Continue with Google"}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === "bn" ? "অথবা ইমেইল দিয়ে" : "Or with email"}
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Field */}
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder={language === "bn" ? "example@email.com" : "you@example.com"}
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {language === "bn" ? "পাসওয়ার্ড" : "Password"} <span className="text-red-500">*</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#3B82F6] hover:text-blue-700 hover:underline"
                  >
                    {language === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
                  </Link>
                </div>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder={language === "bn" ? "আপনার পাসওয়ার্ড লিখুন" : "••••••••"}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl font-black text-sm sm:text-base text-white bg-[#3B82F6] hover:bg-blue-600 active:scale-[0.99] shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === "bn" ? "যাচাই করা হচ্ছে..." : "Signing in..."}</span>
                  </>
                ) : (
                  <>
                    <span>{language === "bn" ? "লগইন করুন" : "Sign In"}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Registration Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {language === "bn" ? "অ্যাকাউন্ট নেই? " : "Don't have an account? "}
                <Link
                  href="/register"
                  className="font-black text-[#3B82F6] hover:text-blue-700 hover:underline"
                >
                  {language === "bn" ? "নতুন অ্যাকাউন্ট খুলুন" : "Create one free"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
