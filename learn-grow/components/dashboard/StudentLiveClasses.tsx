"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Spinner, Chip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { 
    Video, 
    Clock, 
    Calendar, 
    Users, 
    ExternalLink, 
    Radio, 
    Sparkles, 
    MessageCircle, 
    CheckCircle2, 
    BookOpen,
    GraduationCap
} from "lucide-react";
import { useGetUpcomingClassesQuery } from "@/redux/api/liveClassApi";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";

export default function StudentLiveClasses() {
    const router = useRouter();
    const { data: classesData, isLoading: classesLoading } = useGetUpcomingClassesQuery(20);
    const { data: ordersData } = useGetMyOrdersQuery();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

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

    // Update current time every second for countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const orders = ordersData?.orders || [];
    const allClasses = classesData?.data || [];

    // Get the courses student has access to
    const accessibleCourseIds = useMemo(() => {
        const now = new Date();
        const courseIds = new Set<string>();

        orders.forEach((order: any) => {
            // Check quarterly all access (including lifetime)
            if (
                order.planType === "quarterly" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
            ) {
                return;
            }

            // Check single course purchases
            if (
                order.planType === "single" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                order.courseId &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
            ) {
                const courseId = typeof order.courseId === "object" ? order.courseId._id : order.courseId;
                courseIds.add(courseId);
            }

            // Check combo/bundle purchases
            if (
                order.planType === "combo" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                order.comboId &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
            ) {
                const combo = typeof order.comboId === "object" ? order.comboId : null;
                if (combo && combo.courses && Array.isArray(combo.courses)) {
                    combo.courses.forEach((course: any) => {
                        const courseId = typeof course === "object" ? course._id : course;
                        if (courseId) courseIds.add(courseId.toString());
                    });
                }
            }
        });

        return courseIds;
    }, [orders]);

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

    // Filter classes by accessible courses
    const accessibleClasses = useMemo(() => {
        if (hasAllAccess) {
            return allClasses;
        }

        return allClasses.filter((cls: any) => {
            const courseId = typeof cls.courseId === "object" ? cls.courseId._id : cls.courseId;
            return accessibleCourseIds.has(courseId);
        });
    }, [allClasses, hasAllAccess, accessibleCourseIds]);

    // Filter for next 7 days
    const next7DaysClasses = useMemo(() => {
        const now = new Date();
        const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        return accessibleClasses.filter((c: any) => {
            const classTime = new Date(c.scheduledAt);
            return classTime >= now && classTime <= sevenDaysLater && c.status === "Scheduled";
        }).sort((a: any, b: any) => {
            return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
        });
    }, [accessibleClasses]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(next7DaysClasses.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedClasses = next7DaysClasses.slice(startIndex, startIndex + itemsPerPage);
    const displayStart = next7DaysClasses.length === 0 ? 0 : startIndex + 1;
    const displayEnd = Math.min(startIndex + itemsPerPage, next7DaysClasses.length);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Function to get countdown time
    const getTimeStatus = (scheduledAt: string) => {
        const classTime = new Date(scheduledAt);
        const now = currentTime;
        const diffMs = classTime.getTime() - now.getTime();

        if (diffMs < 0) {
            return {
                status: "ended",
                display: isBn ? "ক্লাস সম্পন্ন হয়েছে" : "Class ended",
                color: "danger",
            };
        }

        const diffSecs = Math.floor(diffMs / 1000);
        const days = Math.floor(diffSecs / (24 * 60 * 60));
        const hours = Math.floor((diffSecs % (24 * 60 * 60)) / (60 * 60));
        const mins = Math.floor((diffSecs % (60 * 60)) / 60);
        const secs = diffSecs % 60;

        if (diffSecs < 3600) {
            return {
                status: "soon",
                display: isBn ? `${mins} মি. ${secs} সে.` : `${mins}m ${secs}s`,
                color: "warning",
            };
        }

        if (days === 0) {
            return {
                status: "today",
                display: isBn ? `${hours} ঘণ্টা ${mins} মি.` : `${hours}h ${mins}m`,
                color: "primary",
            };
        }

        return {
            status: "later",
            display: isBn ? `${days} দিন ${hours} ঘণ্টা` : `${days}d ${hours}h`,
            color: "default",
        };
    };

    if (classesLoading) {
        return (
            <Card className="rounded-[24px] border border-slate-200/80 shadow-sm">
                <CardBody className="flex justify-center py-12">
                    <Spinner size="lg" label={isBn ? "লাইভ ক্লাস লোড হচ্ছে..." : "Loading live classes..."} />
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 sm:py-4 px-4 sm:px-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/60 via-purple-50/30 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                        <Video className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-sm sm:text-base text-[#2C2C2C]">
                                {isBn ? "আসন্ন লাইভ ক্লাসসমূহ" : "Upcoming Live Classes"}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                {isBn ? "লাইভ" : "LIVE"}
                            </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                            {isBn ? "পরবর্তী ৭ দিনের সময়সূচী • ১০-১৫ জনের মাইক্রো-ব্যাচ" : "Next 7 Days Schedule • 10-15 Micro-Batch"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                    {next7DaysClasses.length > 0 && (
                        <Chip size="sm" color="primary" variant="flat" className="text-xs font-bold">
                            {next7DaysClasses.length} {isBn ? "টি ক্লাস" : `class${next7DaysClasses.length !== 1 ? 'es' : ''}`}
                        </Chip>
                    )}
                    <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="text-xs font-bold rounded-xl"
                        onPress={() => router.push("/student/all-live-classes")}
                    >
                        {isBn ? "সব ক্লাস দেখুন" : "View All"}
                    </Button>
                </div>
            </CardHeader>

            <CardBody className="p-3.5 sm:p-6 space-y-3 sm:space-y-4">
                {next7DaysClasses.length === 0 ? (
                    <div className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF]/40 to-[#FAF5FF]/50 p-6 sm:p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
                            <Radio className="w-7 h-7 text-blue-600 animate-pulse" />
                        </div>
                        
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{isBn ? "সাপ্তাহিক লাইভ ক্লাস সময়সূচী" : "Weekly Live Batch Schedule"}</span>
                        </span>

                        <h4 className="text-base sm:text-lg font-bold text-[#2C2C2C] mb-2">
                            {isBn ? "পরবর্তী ৭ দিনে কোনো নির্ধারিত ক্লাস নেই" : "No Live Classes in the Next 7 Days"}
                        </h4>
                        
                        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-5">
                            {isBn ? (
                                <>
                                    আমাদের লাইভ প্র্যাকটিক্যাল ক্লাস সাধারণত <strong>শুক্রবার ও শনিবার সন্ধ্যা ৭:০০টায়</strong> অনুষ্ঠিত হয়। ক্লাসের Zoom বা Google Meet লিংক ক্লাস শুরুর ২০ মিনিট আগে আপনার ড্যাশবোর্ডে সক্রিয় হবে এবং WhatsApp ব্যাচ গ্রুপে পৌঁছে যাবে।
                                </>
                            ) : (
                                <>
                                    Live practical sessions are typically held on <strong>Fridays & Saturdays at 7:00 PM</strong>. Your Zoom or Google Meet link activates 20 minutes before class and is also sent to your batch WhatsApp group.
                                </>
                            )}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button
                                size="sm"
                                color="primary"
                                className="font-bold text-xs rounded-xl shadow-md shadow-blue-500/20"
                                onPress={() => router.push("/student/all-live-classes")}
                                startContent={<Calendar className="w-3.5 h-3.5" />}
                            >
                                {isBn ? "সম্পূর্ণ ক্লাস রুটিন দেখুন" : "View Full Class Routine"}
                            </Button>
                            <Button
                                size="sm"
                                variant="bordered"
                                className="font-bold text-xs rounded-xl border-slate-300 text-slate-700 bg-white"
                                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                startContent={<MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
                            >
                                {isBn ? "WhatsApp ব্যাচ হেল্পলাইন" : "WhatsApp Batch Helpline"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="space-y-3">
                            {paginatedClasses.map((cls: any) => {
                                const classDate = new Date(cls.scheduledAt);
                                const courseName = typeof cls.courseId === "object" ? cls.courseId.title : "Course";
                                const instructorName = typeof cls.instructorId === "object" ? cls.instructorId.name : "Instructor";
                                const timeStatus = getTimeStatus(cls.scheduledAt);

                                return (
                                    <div 
                                        key={cls._id} 
                                        className="border border-slate-200/80 rounded-2xl p-4 hover:shadow-lg hover:border-blue-400/50 transition-all duration-300 bg-white group"
                                    >
                                        <div className="flex items-start justify-between mb-3 gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                                                        {cls.platform || "Google Meet"}
                                                    </span>
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500 font-medium truncate inline-flex items-center gap-1">
                                                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                                        {instructorName}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-sm text-[#2C2C2C] group-hover:text-blue-600 transition-colors line-clamp-1">
                                                    {cls.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                    {courseName}
                                                </p>
                                            </div>

                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color={timeStatus.color as any}
                                                className="font-bold text-xs whitespace-nowrap"
                                            >
                                                <span className="flex items-center gap-1.5">
                                                    {timeStatus.status === "soon" && (
                                                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                                                    )}
                                                    {timeStatus.display}
                                                </span>
                                            </Chip>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 rounded-xl p-2.5">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="font-semibold text-slate-700">
                                                    {classDate.toLocaleDateString(isBn ? "bn-BD" : "en-US", { 
                                                        weekday: "short", 
                                                        month: "short", 
                                                        day: "numeric" 
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                <span className="font-semibold text-slate-700">
                                                    {classDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {timeStatus.status === "ended" ? (
                                                <Button
                                                    size="sm"
                                                    color="default"
                                                    variant="flat"
                                                    className="flex-1 text-xs font-bold rounded-xl h-10 sm:h-9"
                                                    isDisabled
                                                >
                                                    {isBn ? "ক্লাস সমাপ্ত" : "Class Over"}
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    className="flex-1 text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-10 sm:h-9 active:scale-95 transition-transform"
                                                    onPress={() => window.open(cls.meetingLink, "_blank")}
                                                    startContent={<Video className="w-3.5 h-3.5" />}
                                                >
                                                    {isBn ? "এখনই ক্লাসে যোগ দিন" : "Join Class Now"}
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="text-xs font-bold rounded-xl border-slate-200 text-slate-700 h-10 sm:h-9 active:scale-95 transition-transform"
                                                onPress={() =>
                                                    router.push(
                                                        `/courses/${typeof cls.courseId === "object" ? cls.courseId._id : cls.courseId}`
                                                    )
                                                }
                                                startContent={<BookOpen className="w-3.5 h-3.5" />}
                                            >
                                                {isBn ? "কোর্স" : "Course"}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-slate-100">
                                <span className="text-xs text-slate-500 font-medium">
                                    {isBn ? `দেখানো হচ্ছে ${displayStart}-${displayEnd} (মোট ${next7DaysClasses.length}টি)` : `Showing ${displayStart}-${displayEnd} of ${next7DaysClasses.length}`}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Button
                                        size="sm"
                                        isDisabled={currentPage === 1}
                                        variant="flat"
                                        className="text-xs font-bold rounded-lg px-2.5 min-w-0"
                                        onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    >
                                        ←
                                    </Button>
                                    <span className="text-xs font-bold px-2 text-slate-700">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        size="sm"
                                        isDisabled={currentPage === totalPages}
                                        variant="flat"
                                        className="text-xs font-bold rounded-lg px-2.5 min-w-0"
                                        onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    >
                                        →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardBody>
        </Card>
    );
}
