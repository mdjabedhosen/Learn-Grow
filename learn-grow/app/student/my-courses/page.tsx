"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner, Chip, Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useGetUserPurchasedCoursesQuery } from "@/redux/api/orderApi";
import { 
    BookOpen, 
    Crown, 
    Rocket, 
    Play, 
    Clock, 
    CheckCircle2, 
    Sparkles, 
    Compass, 
    ArrowRight,
    MessageCircle,
    GraduationCap
} from "lucide-react";

export default function MyCoursesPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, refetch } = useGetUserPurchasedCoursesQuery(currentPage);
    const courses = data?.courses || [];
    const safeCourses = courses.filter((item: any) => item && item.course);
    const pagination = data?.pagination || { total: 0, page: 1, limit: 9, totalPages: 1 };
    const hasQuarterlyAccess = data?.hasQuarterlyAccess || false;

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
        refetch();
    }, [currentPage, refetch]);

    const resolveBanner = (course: any) => {
        if (!course) return "/courses/robotics-course-banner.jpg";
        const thumb = course.thumbnail || "";
        const title = (course.title || "").toLowerCase();
        if (thumb.includes("course-69ca5603e9e96ed80529474a") || thumb.includes("res.cloudinary.com") || !thumb) {
            if (title.includes("python")) return "/courses/python-course-banner.jpg";
            return "/courses/robotics-course-banner.jpg";
        }
        return thumb;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <Spinner size="lg" label={isBn ? "কোর্স লোড হচ্ছে..." : "Loading courses..."} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Ambient Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                    <GraduationCap className="w-3.5 h-3.5 text-blue-300" />
                                    {isBn ? "আমার লার্নিং ক্লাসরুম" : "My Learning Classroom"}
                                </span>
                                {hasQuarterlyAccess && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                        ⭐ {isBn ? "প্রিমিয়াম অল অ্যাক্সেস" : "All Access Active"}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                {isBn ? "আমার ভর্তিকৃত কোর্সসমূহ" : "My Enrolled Courses"}
                            </h1>
                            <p className="text-sm text-slate-300 mt-1 max-w-xl">
                                {isBn 
                                    ? "১০-১৫ জনের মাইক্রো-ব্যাচে লাইভ ক্লাস, রেকর্ডিং ও হোমওয়ার্ক প্রজেক্ট সম্পন্ন করুন।"
                                    : "Access your 100% live micro-batch classes, homework feedback, and projects."}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                color="primary"
                                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-500"
                                onPress={() => router.push("/courses")}
                                startContent={<Compass className="w-4 h-4" />}
                            >
                                {isBn ? "কোর্স ক্যাটালগ" : "Browse Catalog"}
                            </Button>
                            <Button
                                variant="bordered"
                                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                startContent={<MessageCircle className="w-4 h-4 text-emerald-400" />}
                            >
                                {isBn ? "শিক্ষক সহায়তা" : "Mentor Support"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-20">
                {safeCourses.length === 0 ? (
                    <Card className="rounded-[28px] border border-slate-200/80 shadow-sm bg-white">
                        <CardBody className="p-12 text-center">
                            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-[#2C2C2C] mb-1">
                                {isBn ? "কোনো কোর্স এখনো পাওয়া যায়নি" : "No courses enrolled yet"}
                            </h3>
                            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                                {isBn 
                                    ? "আপনি এখনো কোনো লাইভ কোর্সে ভর্তি হননি। রোবোটিক্স বা পাইথন প্রোগ্রামিং ব্যাচে অংশ নিতে ক্যাটালগ দেখুন।"
                                    : "You haven't enrolled in any courses yet. Explore our interactive live micro-batches to begin."}
                            </p>
                            <Button
                                color="primary"
                                className="font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 px-6 bg-blue-600"
                                onPress={() => router.push("/courses")}
                                startContent={<Compass className="w-4 h-4" />}
                            >
                                {isBn ? "সকল কোর্স দেখুন" : "Browse Courses"}
                            </Button>
                        </CardBody>
                    </Card>
                ) : (
                    <div>
                        {hasQuarterlyAccess && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                                        <Crown className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-sm text-[#2C2C2C]">
                                            {isBn ? `🎓 আপনার প্রিমিয়াম সাবস্ক্রিপশন সক্রিয় রয়েছে (মোট ${pagination.total}টি কোর্স)` : `🎓 You have All Access to ${pagination.total} published courses`}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {isBn ? "সকল কোর্সের লাইভ ব্যাচ ও রিসোর্সে আনলিমিটেড এক্সেস" : "Unlimited access to all live batches, code repositories & recordings"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {safeCourses.map((item: any) => {
                                const bannerUrl = resolveBanner(item.course);

                                return (
                                    <div
                                        key={`${item.accessType}-${item.course._id}-${item.comboId || 'single'}`}
                                        className="group rounded-[24px] border border-slate-200/80 hover:border-blue-400/80 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
                                    >
                                        <div 
                                            className="relative aspect-video w-full overflow-hidden bg-slate-100 cursor-pointer"
                                            onClick={() => router.push(`/student/course/${item.course._id}/dashboard`)}
                                        >
                                            <img
                                                src={bannerUrl}
                                                alt={item.course?.title || "Course thumbnail"}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e: any) => {
                                                    e.currentTarget.src = "/courses/robotics-course-banner.jpg";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                            {/* Access Type Badges */}
                                            <div className="absolute top-3 right-3 z-10">
                                                {item.accessType === "quarterly" ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow">
                                                        ⭐ {isBn ? "অল এক্সেস" : "All Access"}
                                                    </span>
                                                ) : item.accessType === "combo" ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow">
                                                        🎁 {isBn ? "বান্ডেল" : "Bundle"}
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow">
                                                        📚 {isBn ? "সিঙ্গেল" : "Single"}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute bottom-2.5 left-3 right-3">
                                                <span className="text-[11px] font-bold text-white/95 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                                                    👥 10-15 Micro-Batch • {item.course?.level || "Beginner"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                            <div>
                                                {item.accessType === "combo" && item.comboName && (
                                                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                                                        {item.comboName}
                                                    </span>
                                                )}
                                                <h3 
                                                    className="font-extrabold text-base text-[#2C2C2C] group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
                                                    onClick={() => router.push(`/student/course/${item.course._id}/dashboard`)}
                                                >
                                                    {item.course.title}
                                                </h3>
                                                {item.batch ? (
                                                    <div className="mt-2 p-2 bg-blue-50/80 border border-blue-100 rounded-xl flex items-center justify-between gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-black text-[11px] shadow-xs">
                                                                {item.batch.batchName || `Batch ${item.batch.batchNumber}`}
                                                            </span>
                                                            {item.batch.schedule && (
                                                                <span className="text-[11px] text-slate-600 font-medium truncate max-w-[120px]">
                                                                    {item.batch.schedule}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.batch.assignedInstructor && (
                                                            <div className="flex items-center gap-1 text-xs text-slate-700 font-bold shrink-0">
                                                                <span className="text-slate-400 font-normal">👨‍🏫</span>
                                                                <span className="truncate max-w-[90px]">{item.batch.assignedInstructor.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                        👨‍🏫 {item.course.instructor?.name || "Expert Mentor"}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {isBn ? "এনরোল্ড" : "Enrolled"}
                                                </span>

                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    className="font-bold text-xs rounded-xl bg-blue-600 text-white px-4 shadow-sm shadow-blue-500/20"
                                                    onPress={() => router.push(`/student/course/${item.course._id}/dashboard`)}
                                                    endContent={<ArrowRight className="w-3.5 h-3.5" />}
                                                >
                                                    {isBn ? "ক্লাসরুমে যান" : "Enter Classroom"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex flex-col items-center gap-3 pt-6 border-t border-slate-200">
                                <Pagination
                                    total={pagination.totalPages}
                                    page={currentPage}
                                    onChange={setCurrentPage}
                                    showControls
                                    color="primary"
                                    size="sm"
                                    radius="lg"
                                />
                                <p className="text-xs text-slate-400">
                                    {isBn 
                                        ? `দেখানো হচ্ছে ${(currentPage - 1) * 9 + 1} - ${Math.min(currentPage * 9, pagination.total)} (মোট ${pagination.total}টি কোর্স)`
                                        : `Showing ${(currentPage - 1) * 9 + 1} - ${Math.min(currentPage * 9, pagination.total)} of ${pagination.total} courses`}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
