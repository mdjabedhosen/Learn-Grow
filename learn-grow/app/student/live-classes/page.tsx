"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner, Chip, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { 
    Video, 
    Clock, 
    Calendar, 
    ArrowLeft, 
    ExternalLink, 
    BookOpen, 
    Users, 
    CheckCircle2, 
    GraduationCap,
    Sparkles
} from "lucide-react";
import { useGetAllLiveClassesQuery } from "@/redux/api/liveClassApi";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import RequireAuth from "@/components/Auth/RequireAuth";
import Cookies from "js-cookie";

export default function StudentLiveClassesPage() {
    const router = useRouter();
    const [isAuthed, setIsAuthed] = useState(false);

    // Bilingual support
    const [language, setLanguage] = useState<"bn" | "en">("bn");
    useEffect(() => {
        const saved = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
        setLanguage(saved);
        const handleLangChange = (e: any) => {
            setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
        };
        window.addEventListener("languageChange", handleLangChange);
        return () => window.removeEventListener("languageChange", handleLangChange);
    }, []);
    const isBn = language === "bn";

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || Cookies.get("accessToken") || Cookies.get("token") : null;
        setIsAuthed(!!token);
    }, []);

    const { data: classesData, isLoading: classesLoading } = useGetAllLiveClassesQuery({ skip: 0, limit: 100 }, { skip: !isAuthed });
    const { data: ordersData } = useGetMyOrdersQuery(undefined, { skip: !isAuthed });

    const orders = ordersData?.orders || [];
    const allClasses = classesData?.data || [];

    // Check if user has all access
    const hasAllAccess = useMemo(() => {
        const now = new Date();
        return orders.some(
            (order: any) =>
                order.planType === "quarterly" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
        );
    }, [orders]);

    // Get the courses student has access to
    const accessibleCourseIds = useMemo(() => {
        const now = new Date();
        const courseIds = new Set<string>();

        orders.forEach((order: any) => {
            if (
                order.planType === "single" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                order.courseId &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
            ) {
                const courseId = typeof order.courseId === "object" ? order.courseId._id : order.courseId;
                if (courseId) courseIds.add(courseId);
            }
        });

        return courseIds;
    }, [orders]);

    // Filter classes by accessible courses
    const accessibleClasses = useMemo(() => {
        if (hasAllAccess) {
            return allClasses;
        }

        return allClasses.filter((cls: any) => {
            const courseId = typeof cls.courseId === "object" ? cls.courseId._id : cls.courseId;
            return courseId && accessibleCourseIds.has(courseId);
        });
    }, [allClasses, hasAllAccess, accessibleCourseIds]);

    const upcomingClasses = accessibleClasses.filter((c: any) => {
        const classTime = new Date(c.scheduledAt);
        return classTime > new Date() && c.status === "Scheduled";
    });

    const pastClasses = accessibleClasses.filter((c: any) => {
        const classTime = new Date(c.scheduledAt);
        return classTime <= new Date() || c.status === "Completed";
    });

    if (!isAuthed) {
        return (
            <RequireAuth allowedRoles={["student"]}>
                <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
                    <Spinner size="lg" label={isBn ? "যাচাই করা হচ্ছে..." : "Checking authentication..."} />
                </div>
            </RequireAuth>
        );
    }

    return (
        <RequireAuth allowedRoles={["student"]}>
            <div className="min-h-screen bg-[#F8FAFC] pb-20">
                {/* Ambient Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="container mx-auto max-w-7xl relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        className="bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10"
                                        onPress={() => router.push("/student")}
                                        aria-label="Back to dashboard"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                        <Video className="w-3.5 h-3.5 text-blue-300" />
                                        {isBn ? "লাইভ ক্লাস রুম" : "Live Classroom"}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                    {isBn ? "সরাসরি লাইভ ক্লাস সেশন" : "Scheduled Live Classes"}
                                </h1>
                                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                                    {isBn 
                                        ? "আপনার কোর্স মেন্টরের সাথে সরাসরি গুগল মিট বা জুমে যুক্ত হয়ে প্রজেক্ট কোডিং করুন।"
                                        : "Join real-time interactive classes directly with your instructors on Google Meet/Zoom."}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    variant="flat"
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/10"
                                    onPress={() => router.push("/student/all-live-classes")}
                                >
                                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                                    {isBn ? "সকল লাইভ ক্লাস দেখুন" : "View All Classes"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto max-w-7xl px-6 -mt-6 relative z-20">
                    {classesLoading ? (
                        <div className="flex justify-center items-center py-24 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                            <Spinner size="lg" label={isBn ? "লাইভ ক্লাস লোড হচ্ছে..." : "Loading live classes..."} />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Upcoming Classes */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                            {isBn ? "আসন্ন লাইভ ক্লাসসমূহ" : "Upcoming Sessions"}
                                        </h2>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                            {upcomingClasses.length}
                                        </span>
                                    </div>
                                </div>

                                {upcomingClasses.length === 0 ? (
                                    <Card className="border border-slate-200/80 rounded-2xl shadow-sm bg-white">
                                        <CardBody className="text-center py-16 px-6">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                                                <Video className="w-7 h-7" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">
                                                {isBn ? "বর্তমানে কোনো আসন্ন লাইভ ক্লাস নেই" : "No Upcoming Live Classes Scheduled"}
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                                                {isBn
                                                    ? "আপনার মেন্টর পরবর্তী ক্লাস শিডিউল করলে এখানে স্বয়ংক্রিয়ভাবে লিংক চলে আসবে।"
                                                    : "Your instructor will schedule the next live session shortly. Please check back soon."}
                                            </p>
                                            <div className="mt-6 flex justify-center gap-3">
                                                <Button
                                                    color="primary"
                                                    className="font-bold text-xs rounded-xl shadow-sm"
                                                    onPress={() => router.push("/student/my-courses")}
                                                >
                                                    <BookOpen className="w-4 h-4 mr-1.5" />
                                                    {isBn ? "আমার কোর্সে যান" : "Go to My Courses"}
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {upcomingClasses.map((cls: any) => {
                                            const classDate = new Date(cls.scheduledAt);
                                            const courseName = typeof cls.courseId === "object" ? cls.courseId.title : "Course";
                                            const instructorName = typeof cls.instructorId === "object" ? cls.instructorId.name : "Instructor";

                                            return (
                                                <Card key={cls._id} className="border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
                                                    <CardBody className="p-6">
                                                        <div className="flex justify-between items-start gap-4 mb-3">
                                                            <div className="flex-1">
                                                                <h3 className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1">{cls.title}</h3>
                                                                <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">{courseName}</p>
                                                            </div>
                                                            <Chip size="sm" variant="flat" color="primary" className="font-bold text-xs uppercase tracking-wider shrink-0">
                                                                {cls.platform || "Live"}
                                                            </Chip>
                                                        </div>

                                                        <Divider className="my-3 bg-slate-100" />

                                                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                                                                <span className="font-medium truncate">
                                                                    {classDate.toLocaleDateString(isBn ? "bn-BD" : "en-US", { weekday: "short", month: "short", day: "numeric" })}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                                                                <span className="font-medium truncate">
                                                                    {classDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ({cls.duration || 60}m)
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {instructorName && (
                                                            <div className="flex items-center justify-between text-xs text-slate-600 mb-4 px-1">
                                                                <span className="text-slate-400">{isBn ? "মেন্টর:" : "Instructor:"}</span>
                                                                <span className="font-bold text-slate-800">{instructorName}</span>
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2">
                                                            <Button
                                                                color="primary"
                                                                className="flex-1 font-bold text-xs rounded-xl shadow-sm"
                                                                startContent={<Video className="w-4 h-4" />}
                                                                onPress={() => window.open(cls.meetingLink, "_blank")}
                                                            >
                                                                {isBn ? "সরাসরি ক্লাসে যোগ দিন" : "Join Live Class"}
                                                            </Button>
                                                            <Button
                                                                variant="flat"
                                                                className="font-bold text-xs rounded-xl border border-slate-200"
                                                                onPress={() =>
                                                                    router.push(
                                                                        `/courses/${typeof cls.courseId === "object" ? cls.courseId._id : cls.courseId}`
                                                                    )
                                                                }
                                                            >
                                                                <BookOpen className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Past Classes */}
                            {pastClasses.length > 0 && (
                                <div className="pt-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CheckCircle2 className="w-5 h-5 text-slate-500" />
                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                            {isBn ? "পূর্ববর্তী ক্লাস হিস্ট্রি" : "Past Class History"}
                                        </h2>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                            {pastClasses.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pastClasses.map((cls: any) => {
                                            const classDate = new Date(cls.scheduledAt);
                                            const courseName = typeof cls.courseId === "object" ? cls.courseId.title : "Course";

                                            return (
                                                <Card key={cls._id} className="border border-slate-200/80 rounded-xl shadow-none bg-white p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="font-bold text-sm text-slate-900 truncate">{cls.title}</h3>
                                                                <Chip size="sm" variant="flat" color="default" className="text-[11px] h-5">
                                                                    {cls.status || "Completed"}
                                                                </Chip>
                                                            </div>
                                                            <p className="text-xs text-slate-500 truncate">{courseName}</p>
                                                        </div>
                                                        <div className="text-right text-xs shrink-0">
                                                            <p className="font-bold text-slate-700">
                                                                {classDate.toLocaleDateString(isBn ? "bn-BD" : "en-US", { month: "short", day: "numeric" })}
                                                            </p>
                                                            <p className="text-slate-400 text-[11px]">
                                                                {classDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
}
