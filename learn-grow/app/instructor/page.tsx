"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Button, Chip, Avatar, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
    BookOpen,
    Users,
    TrendingUp,
    Wallet,
    Upload,
    Video,
    AlertTriangle,
    ClipboardCheck,
    FileText,
    LifeBuoy,
    PenLine,
    GraduationCap,
    CheckCircle2,
    Calendar,
    Sparkles,
    ChevronRight,
    ArrowUpRight,
    Clock,
    Award,
    CalendarCheck,
    MessageCircle,
    ExternalLink,
    Users,
    User
} from "lucide-react";
import { useGetInstructorCoursesQuery } from "@/redux/api/courseApi";
import { useGetInstructorStatsQuery } from "@/redux/api/userApi";
import { useGetInstructorBatchesQuery } from "@/redux/api/batchApi";
import { useGetTrialBookingsQuery } from "@/redux/api/trialBookingApi";

function InstructorDashboardContent() {
    const router = useRouter();
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [instructorId, setInstructorId] = useState<string | null>(null);

    // Bilingual support
    const [language, setLanguage] = useState<"bn" | "en">("bn");
    useEffect(() => {
        const savedLang = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
        setLanguage(savedLang);
        const handleLangChange = (e: any) => {
            setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
        };
        window.addEventListener("languageChange", handleLangChange);
        return () => window.removeEventListener("languageChange", handleLangChange);
    }, []);
    const isBn = language === "bn";

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setUserName(user.name || "Instructor");
                setInstructorId(user._id || user.id || null);
                setIsApproved(user.isApproved !== undefined ? user.isApproved : true);
            } catch (e) {
                console.error("Error reading instructor:", e);
            }
        }
    }, []);

    const { data: instructorCoursesResp, isLoading: coursesLoading } = useGetInstructorCoursesQuery(
        { instructorId: instructorId || "", page: 1, limit: 100 },
        { skip: !instructorId }
    );

    const { data: batchesResp, isLoading: batchesLoading } = useGetInstructorBatchesQuery();
    const batches = Array.isArray(batchesResp?.data) ? batchesResp.data : [];

    const { data: trialsResp, isLoading: trialsLoading } = useGetTrialBookingsQuery(
        instructorId ? { instructorId } : undefined
    );
    const rawTrials = Array.isArray(trialsResp?.data) ? trialsResp.data : [];
    const trialBookings = useMemo(() => {
        if (!instructorId) return rawTrials;
        return rawTrials.filter((b: any) => {
            const assigned = b.assignedInstructorId?._id || b.assignedInstructorId?.id || b.assignedInstructorId;
            return assigned && assigned.toString() === instructorId.toString();
        });
    }, [rawTrials, instructorId]);

    const { data: statsResp, isLoading: statsLoading } = useGetInstructorStatsQuery(undefined, {
        skip: !instructorId,
    });

    const courses = Array.isArray(instructorCoursesResp?.data) ? instructorCoursesResp!.data : [];

    const stats = useMemo(() => {
        const totalCourses = courses.length;
        const totalBatches = batches.length;
        const totalTrials = trialBookings.length;
        const scheduledTrials = trialBookings.filter((t: any) => t.status === "scheduled").length;

        // Count students from batches
        const batchStudentsCount = batches.reduce((sum: number, b: any) => {
            return sum + (Array.isArray(b.enrolledStudents) ? b.enrolledStudents.length : 0);
        }, 0);

        const courseStudents = courses.reduce((sum: number, c: any) => sum + (c.studentsEnrolled || c.enrolled || 0), 0);
        const totalStudents = Math.max(batchStudentsCount, courseStudents);

        if (statsResp?.success && statsResp?.data) {
            const { studentEngagement, completionRate, totalRevenue, thisMonthRevenue } = statsResp.data;
            return {
                totalCourses,
                totalBatches,
                totalTrials,
                scheduledTrials,
                totalStudents: statsResp.data.totalStudents || totalStudents,
                activeCourses: courses.filter((c: any) => c.isPublished).length,
                totalEarnings: totalRevenue,
                thisMonthEarnings: thisMonthRevenue,
                completionRate,
                avgRating: "0.0",
                studentEngagement,
            };
        }

        const totalEarnings = courses.reduce((sum: number, c: any) => sum + (c.revenue || 0), 0);
        const thisMonthEarnings = courses.reduce((sum: number, c: any) => sum + (c.revenueThisMonth || 0), 0);
        const ratedCourses = courses.filter((c: any) => c.rating);
        const completionRate = courses.length ? Math.round((courses.reduce((sum: number, c: any) => sum + (c.completionRate || 0), 0) / courses.length) || 0) : 0;

        return {
            totalCourses,
            totalBatches,
            totalTrials,
            scheduledTrials,
            totalStudents,
            activeCourses: courses.filter((c: any) => c.isPublished).length,
            totalEarnings,
            thisMonthEarnings,
            completionRate,
            avgRating: ratedCourses.length
                ? (ratedCourses.reduce((sum: number, c: any) => sum + (c.rating || 0), 0) / ratedCourses.length).toFixed(1)
                : "0.0",
            studentEngagement: completionRate,
        };
    }, [courses, batches, trialBookings, statsResp]);

    const quickActions = [
        {
            title: isBn ? "আমার কোর্সসমূহ" : "My Courses",
            description: isBn ? "কোর্স কারিকুলাম ও কন্টেন্ট আপডেট" : "Manage course curriculum",
            icon: <BookOpen className="w-5 h-5" />,
            color: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
            href: "/instructor/courses",
        },
        {
            title: isBn ? "আমার ব্যাচসমূহ" : "My Batches",
            description: isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ ও শিডিউল" : "Assigned cohorts & schedules",
            icon: <Users className="w-5 h-5" />,
            color: "text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white",
            href: "/instructor/batches",
        },
        {
            title: isBn ? "ফ্রি ট্রায়াল সেশন" : "Free Trial Sessions",
            description: isBn ? "অভিভাবকদের সাথে নির্ধারিত ট্রায়াল ক্লাস" : "Assigned 1-on-1 parent trial sessions",
            icon: <CalendarCheck className="w-5 h-5" />,
            color: "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
            href: "/instructor/trials",
        },
        {
            title: isBn ? "লাইভ ক্লাস সেশন" : "Live Classes",
            description: isBn ? "Google Meet ও Zoom ক্লাস শিডিউল" : "Schedule & host live batches",
            icon: <Video className="w-5 h-5" />,
            color: "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
            href: "/instructor/live-classes",
        },
        {
            title: isBn ? "অ্যাসাইনমেন্ট ও কুইজ" : "Assessments",
            description: isBn ? "শিক্ষার্থীদের হোমওয়ার্ক ও প্রজেক্ট মূল্যায়ন" : "Review homework & project tasks",
            icon: <ClipboardCheck className="w-5 h-5" />,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
            href: "/instructor/assessments",
        },
        {
            title: isBn ? "শিক্ষার্থী তালিকা" : "Enrolled Students",
            description: isBn ? "১০-১৫ জন মাইক্রো-ব্যাচের শিক্ষার্থী" : "Track micro-batch learners",
            icon: <Users className="w-5 h-5" />,
            color: "text-sky-600 bg-sky-50 border-sky-100 group-hover:bg-sky-600 group-hover:text-white",
            href: "/instructor/students",
        },
        {
            title: isBn ? "পারফরম্যান্স অ্যানালিটিক্স" : "Analytics & Trends",
            description: isBn ? "এনগেজমেন্ট ও কোর্স সমাপ্তির পরিসংখ্যান" : "Student completion analytics",
            icon: <TrendingUp className="w-5 h-5" />,
            color: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white",
            href: "/instructor/analytics",
        },
        {
            title: isBn ? "রিসোর্স ও লেকচার আপলোড" : "Upload Materials",
            description: isBn ? "স্লাইড, কোড ফাইল ও রেফারেন্স শিট" : "Upload slides, code & handouts",
            icon: <Upload className="w-5 h-5" />,
            color: "text-teal-600 bg-teal-50 border-teal-100 group-hover:bg-teal-600 group-hover:text-white",
            href: "/instructor/upload",
        },
        {
            title: isBn ? "ব্লগ ও আর্টিকেল" : "My Articles",
            description: isBn ? "আপনার প্রকাশিত শিক্ষামূলক পোস্ট" : "View your published articles",
            icon: <FileText className="w-5 h-5" />,
            color: "text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-600 group-hover:text-white",
            href: "/instructor/blogs",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Ambient Educator Studio Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#312E81] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#6366F1_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <Avatar
                                    name={userName}
                                    className="w-20 h-20 text-2xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 text-white ring-4 ring-white/10 ring-offset-2 ring-offset-[#0F172A]"
                                />
                                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0F172A] shadow" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 backdrop-blur-md">
                                        <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                                        {isBn ? "শিক্ষক ও মেন্টর স্টুডিও" : "Educator & Mentor Studio"}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                        <Users className="w-3 h-3 text-amber-300" />
                                        <span>{isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-Batch"}</span>
                                    </span>
                                    {isApproved !== null && (
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                            isApproved 
                                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" 
                                                : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                                        }`}>
                                            {isApproved ? (
                                                <>
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                                                    <span>{isBn ? "অনুমোদিত শিক্ষক" : "Verified Educator"}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-3 h-3 text-amber-300" />
                                                    <span>{isBn ? "অনুমোদন প্রক্রিয়াধীন" : "Pending Review"}</span>
                                                </>
                                            )}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                    {isBn ? `স্বাগতম, ${userName}!` : `Welcome, ${userName}!`}
                                </h1>
                                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                                    {isBn 
                                        ? "আপনার লাইভ ক্লাস ব্যাচ পরিচালনা করুন, শিক্ষার্থীদের প্রজেক্ট মূল্যায়ন করুন এবং নতুন শিক্ষণ সামগ্রী প্রকাশ করুন।"
                                        : "Host interactive live micro-batches, grade robotics projects, and empower the next generation of creators."}
                                </p>
                            </div>
                        </div>

                        {/* Top Instructor Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                color="primary"
                                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/25 bg-indigo-600 hover:bg-indigo-500"
                                onPress={() => router.push("/instructor/live-classes")}
                                startContent={<Video className="w-4 h-4" />}
                            >
                                {isBn ? "লাইভ ক্লাস শিডিউল" : "Host Live Class"}
                            </Button>
                            <Button
                                variant="bordered"
                                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                                onPress={() => router.push("/instructor/courses")}
                                startContent={<BookOpen className="w-4 h-4" />}
                            >
                                {isBn ? "আমার কোর্সসমূহ" : "My Courses"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-20">
                {/* Pending Approval Alert if applicable */}
                {isApproved === false && (
                    <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs sm:text-sm">
                            <p className="font-bold">
                                {isBn ? "আপনার শিক্ষক প্রোফাইল বর্তমানে অ্যাডমিন পর্যালোচনায় রয়েছে" : "Your Instructor Profile is Under Administrative Review"}
                            </p>
                            <p className="text-amber-700 mt-0.5">
                                {isBn 
                                    ? "অ্যাকাউন্ট ভেরিফিকেশন সম্পন্ন হলে আপনি পূর্ণাঙ্গ লাইভ ক্লাস শুরু করতে পারবেন। সাধারণত ২৪-৪৮ ঘণ্টার মধ্যে অনুমোদন দেওয়া হয়।"
                                    : "Once verified, you will be able to create live batches and publish courses. Verification typically completes within 24-48 hours."}
                            </p>
                        </div>
                    </div>
                )}

                {/* 4 Educator KPI Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div 
                        onClick={() => router.push("/instructor/courses")}
                        className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "আমার কোর্সসমূহ" : "My Courses"}
                            </p>
                            <Skeleton isLoaded={!coursesLoading} className="rounded-lg">
                                <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                                    {stats.totalCourses}
                                </p>
                            </Skeleton>
                            <p className="text-[11px] font-medium text-slate-400">
                                {stats.activeCourses} {isBn ? "টি সক্রিয় লাইভ কোর্স" : "active curricula"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-blue-50 border-blue-100 text-blue-600">
                            <BookOpen className="w-5 h-5" />
                        </div>
                    </div>

                    <div 
                        onClick={() => router.push("/instructor/batches")}
                        className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "সক্রিয় ব্যাচসমূহ" : "My Batches"}
                            </p>
                            <Skeleton isLoaded={!batchesLoading} className="rounded-lg">
                                <p className="text-2xl sm:text-3xl font-black text-indigo-600">
                                    {stats.totalBatches}
                                </p>
                            </Skeleton>
                            <p className="text-[11px] font-medium text-slate-400">
                                {isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-batch size"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-indigo-50 border-indigo-100 text-indigo-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>

                    <div 
                        onClick={() => router.push("/instructor/trials")}
                        className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "ফ্রি ট্রায়াল সেশন" : "Trial Sessions"}
                            </p>
                            <Skeleton isLoaded={!trialsLoading} className="rounded-lg">
                                <p className="text-2xl sm:text-3xl font-black text-amber-600">
                                    {stats.totalTrials}
                                </p>
                            </Skeleton>
                            <p className="text-[11px] font-medium text-slate-400">
                                {stats.scheduledTrials} {isBn ? "টি আসন্ন শিডিউল" : "scheduled cohorts"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-100 text-amber-600">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                    </div>

                    <div 
                        onClick={() => router.push("/instructor/students")}
                        className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
                    >
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "মোট শিক্ষার্থী" : "Total Students"}
                            </p>
                            <Skeleton isLoaded={!coursesLoading} className="rounded-lg">
                                <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                                    {stats.totalStudents}
                                </p>
                            </Skeleton>
                            <p className="text-[11px] font-medium text-slate-400">
                                {isBn ? "নিয়মিত শিক্ষার্থী" : "active enrolled learners"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-100 text-emerald-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Section: Assigned Free Trial Classes Showcase */}
                <div className="mb-8 rounded-[28px] bg-white p-6 border border-slate-200/90 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <CalendarCheck className="w-5 h-5" />
                                </span>
                                <h2 className="text-lg sm:text-xl font-extrabold text-[#2C2C2C]">
                                    {isBn ? "আমার নির্ধারিত ফ্রি ট্রায়াল ক্লাস" : "My Assigned Free Trial Classes"}
                                </h2>
                                <Chip size="sm" color="warning" variant="flat" className="font-bold text-xs">
                                    {trialBookings.length}
                                </Chip>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {isBn 
                                    ? "অভিভাবকদের সাথে ওয়ান-অন-ওয়ান বা ছোট গ্রুপের লাইভ ডেমো ক্লাস নিন এবং শিক্ষার্থীদের উৎসাহিত করুন।"
                                    : "Host interactive trial sessions with parents and students, share meeting links, and answer parent questions."}
                            </p>
                        </div>

                        <Button
                            size="sm"
                            variant="flat"
                            color="warning"
                            className="font-bold rounded-xl text-xs"
                            onPress={() => router.push("/instructor/trials")}
                            endContent={<ChevronRight className="w-4 h-4" />}
                        >
                            {isBn ? "সকল ট্রায়াল ক্লাস দেখুন" : "View All Trials"}
                        </Button>
                    </div>

                    {trialsLoading ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                            {isBn ? "ট্রায়াল সেশন লোড হচ্ছে..." : "Loading trial sessions..."}
                        </div>
                    ) : trialBookings.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                            <p className="text-sm font-bold text-slate-600">
                                {isBn ? "কোনো নির্ধারিত ফ্রি ট্রায়াল ক্লাস নেই" : "No Assigned Trial Classes"}
                            </p>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                {isBn 
                                    ? "অ্যাডমিন বা ম্যানেজার যখন আপনাকে নতুন কোনো ট্রায়াল বুকিংয়ে অ্যাসাইন করবেন, তা এখানে সরাসরি প্রদর্শিত হবে।"
                                    : "When an Admin or Manager assigns a trial booking to you, it will immediately appear here with meeting links and parent contact."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trialBookings.slice(0, 3).map((booking: any) => {
                                let waPhone = (booking.parentPhone || "").replace(/[^0-9]/g, "");
                                if (waPhone.startsWith("0")) waPhone = "88" + waPhone;
                                const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                                    isBn
                                        ? `আসসালামু আলাইকুম ${booking.parentName}! আমি Learn & Grow থেকে আপনার সন্তানের ফ্রি ট্রায়াল ক্লাসের শিক্ষক।`
                                        : `Hello ${booking.parentName}! I am your Learn & Grow mentor for the upcoming Free Trial Class.`
                                )}`;

                                return (
                                    <div
                                        key={booking._id}
                                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                    {booking.trackInterest || "Coding & Robotics"}
                                                </span>
                                                <h4 className="font-extrabold text-sm text-[#2C2C2C] mt-1">
                                                    {booking.parentName}
                                                </h4>
                                                <p className="text-[11px] font-semibold text-slate-500 inline-flex items-center gap-1">
                                                    <User className="w-3 h-3 text-slate-400" />
                                                    <span>{isBn ? "বয়স:" : "Age:"} {booking.studentAge} {isBn ? "বছর" : "yrs"}</span>
                                                </p>
                                            </div>
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={booking.status === "completed" ? "success" : booking.status === "scheduled" ? "warning" : "default"}
                                                className="text-[10px] font-bold uppercase"
                                            >
                                                {booking.status}
                                            </Chip>
                                        </div>

                                        <div className="text-xs text-slate-600 flex items-center gap-1.5 font-bold">
                                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>{booking.scheduledDate || "TBD"} {booking.scheduledTime ? `• ${booking.scheduledTime}` : ""}</span>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                            <a
                                                href={waUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <MessageCircle className="w-3.5 h-3.5" />
                                                <span>WhatsApp</span>
                                            </a>

                                            {booking.meetingLink ? (
                                                <a
                                                    href={booking.meetingLink.startsWith("http") ? booking.meetingLink : `https://${booking.meetingLink}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    <span>{isBn ? "জয়েন" : "Join"}</span>
                                                </a>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                    className="font-bold text-xs rounded-xl"
                                                    onPress={() => router.push("/instructor/trials")}
                                                >
                                                    {isBn ? "লিংক দিন" : "Set Link"}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Section: My Assigned Batches Showcase */}
                <div className="mb-8 rounded-[28px] bg-white p-6 border border-slate-200/90 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                    <Users className="w-5 h-5" />
                                </span>
                                <h2 className="text-lg sm:text-xl font-extrabold text-[#2C2C2C]">
                                    {isBn ? "আমার লাইভ ব্যাচসমূহ" : "My Active Cohort Batches"}
                                </h2>
                                <Chip size="sm" color="primary" variant="flat" className="font-bold text-xs">
                                    {batches.length}
                                </Chip>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                {isBn 
                                    ? "১০-১৫ জন শিক্ষার্থীর মাইক্রো-ব্যাচ, ক্লাসের শিডিউল ও লাইভ ভিডিও লিংক পরিচালনা করুন।"
                                    : "Assigned micro-batches (10-15 students each). Update meeting links, schedule, and view enrolled learners."}
                            </p>
                        </div>

                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="font-bold rounded-xl text-xs"
                            onPress={() => router.push("/instructor/batches")}
                            endContent={<ChevronRight className="w-4 h-4" />}
                        >
                            {isBn ? "সকল ব্যাচ দেখুন" : "View All Batches"}
                        </Button>
                    </div>

                    {batchesLoading ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                            {isBn ? "ব্যাচ লোড হচ্ছে..." : "Loading batches..."}
                        </div>
                    ) : batches.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                            <p className="text-sm font-bold text-slate-600">
                                {isBn ? "কোনো সক্রিয় ব্যাচ অ্যাসাইন করা নেই" : "No Active Batches Assigned"}
                            </p>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                {isBn 
                                    ? "অ্যাডমিন বা ম্যানেজার কোনো কোর্সের ব্যাচে আপনাকে শিক্ষক হিসেবে নির্ধারণ করলে তা এখানে দেখা যাবে।"
                                    : "When an Admin or Manager assigns you to a course cohort batch, it will immediately appear here."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {batches.slice(0, 3).map((b: any) => {
                                const enrolledCount = Array.isArray(b.enrolledStudents) ? b.enrolledStudents.length : 0;
                                const courseTitle = b.courseId?.title || b.courseName || "Live Course";
                                return (
                                    <div
                                        key={b._id}
                                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                                    {b.batchName}
                                                </span>
                                                <h4 className="font-extrabold text-sm text-[#2C2C2C] mt-1 line-clamp-1">
                                                    {courseTitle}
                                                </h4>
                                            </div>
                                            <Chip size="sm" variant="flat" color="success" className="text-[10px] font-bold">
                                                {enrolledCount} / {b.maxStudents || 15}
                                            </Chip>
                                        </div>

                                        <p className="text-xs text-slate-600 flex items-center gap-1.5 font-bold">
                                            <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                            <span>{b.schedule || "Sat & Tue 7:00 PM"}</span>
                                        </p>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="primary"
                                                className="flex-1 font-bold rounded-xl text-xs"
                                                onPress={() => router.push("/instructor/batches")}
                                            >
                                                {isBn ? "বিস্তারিত ও শিক্ষার্থী" : "Manage Batch"}
                                            </Button>

                                            {b.zoomLink && (
                                                <a
                                                    href={b.zoomLink.startsWith("http") ? b.zoomLink : `https://${b.zoomLink}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    <span>{isBn ? "লাইভ" : "Live"}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Section: Action Grid */}
                <div>
                    <div className="mb-4">
                        <h2 className="text-lg sm:text-xl font-extrabold text-[#2C2C2C]">
                            {isBn ? "মেন্টর কমান্ড ও কার্যাবলী" : "Instructor Workspace & Actions"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {isBn ? "কোর্স, অ্যাসাইনমেন্ট ও শিক্ষার্থী সহায়তা পরিচালনা করুন" : "Quick access shortcuts for your teaching workflow"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                onClick={() => router.push(action.href)}
                                className="group cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:border-indigo-400/60 hover:shadow-md transition-all duration-300 flex items-start gap-4"
                            >
                                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${action.color}`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-extrabold text-sm text-[#2C2C2C] group-hover:text-indigo-600 transition-colors truncate mb-1">
                                        {action.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {action.description}
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all self-center" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InstructorDashboard() {
    return (
        <RequireAuth allowedRoles={["instructor"]}>
            <InstructorDashboardContent />
        </RequireAuth>
    );
}
