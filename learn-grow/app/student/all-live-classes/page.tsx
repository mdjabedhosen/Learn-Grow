"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardBody, Button, Spinner, Chip, Input, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { 
    Video, 
    Clock, 
    Calendar, 
    ArrowLeft, 
    Search, 
    PlayCircle, 
    CheckCircle2, 
    BookOpen,
    Radio,
    Sparkles,
    MessageCircle
} from "lucide-react";
import { useGetAllLiveClassesQuery } from "@/redux/api/liveClassApi";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import RequireAuth from "@/components/Auth/RequireAuth";

export default function AllLiveClassesPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentTime, setCurrentTime] = useState(new Date());
    
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

    const itemsPerPage = 12;

    const { data: ordersData } = useGetMyOrdersQuery();
    const orders = ordersData?.orders || [];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const skip = (currentPage - 1) * itemsPerPage;
    const { data: classesData, isLoading: classesLoading } = useGetAllLiveClassesQuery({ skip, limit: itemsPerPage });
    const allClasses = (classesData?.data || []).filter((cls: any) => {
        if (!cls) return false;
        if (!cls.courseId) return false;
        if (typeof cls.courseId === "string") return true;
        return Boolean(cls.courseId?._id);
    });

    const accessibleClasses = useMemo(() => {
        const now = new Date();
        const hasQuarterly = orders.some(
            order =>
                order.planType === "quarterly" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
        );

        if (hasQuarterly) {
            return allClasses.filter((cls: any) => cls && cls.courseId);
        }

        const enrolledCourseIds = orders
            .filter(
                order =>
                    order.planType === "single" &&
                    order.paymentStatus === "approved" &&
                    order.isActive &&
                    order.courseId &&
                    (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
            )
            .map(order => {
                const id = typeof order.courseId === "object" && order.courseId ? order.courseId._id : order.courseId;
                return id;
            })
            .filter(id => id != null);

        const comboCourseIds: string[] = [];
        orders
            .filter(
                order =>
                    order.planType === "combo" &&
                    order.paymentStatus === "approved" &&
                    order.isActive &&
                    (order.endDate === null || (order.endDate && new Date(order.endDate) > now)) &&
                    order.comboId
            )
            .forEach(order => {
                const combo = typeof order.comboId === "object" ? order.comboId : null;
                if (combo && combo.courses && Array.isArray(combo.courses)) {
                    combo.courses.forEach((course: any) => {
                        const courseId = typeof course === "object" ? course._id : course;
                        if (courseId) comboCourseIds.push(courseId.toString());
                    });
                }
            });

        const allEnrolledCourseIds = [...enrolledCourseIds, ...comboCourseIds];

        return allClasses.filter((cls: any) => {
            const courseId = typeof cls.courseId === "object" && cls.courseId ? cls.courseId._id : cls.courseId;
            return allEnrolledCourseIds.includes(courseId?.toString());
        });
    }, [allClasses, orders]);

    const upcomingClasses = useMemo(() => {
        return accessibleClasses.filter((c: any) => {
            return new Date(c.scheduledAt) > currentTime && c.status === "Scheduled";
        });
    }, [accessibleClasses, currentTime]);

    const pastClasses = useMemo(() => {
        return accessibleClasses.filter((c: any) => {
            return new Date(c.scheduledAt) <= currentTime || c.status === "Completed";
        });
    }, [accessibleClasses, currentTime]);

    const filteredClasses = useMemo(() => {
        let result = accessibleClasses;

        if (statusFilter === "upcoming") {
            result = upcomingClasses;
        } else if (statusFilter === "past") {
            result = pastClasses;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((cls: any) => {
                const title = cls.title?.toLowerCase() || "";
                const course = typeof cls.courseId === "object" && cls.courseId ? cls.courseId.title?.toLowerCase() || "" : "";
                return title.includes(query) || course.includes(query);
            });
        }

        return result;
    }, [accessibleClasses, upcomingClasses, pastClasses, statusFilter, searchQuery]);

    const totalPages = Math.max(1, Math.ceil(filteredClasses.length / itemsPerPage));
    const paginatedClasses = filteredClasses.slice(skip, skip + itemsPerPage);

    const getTimeStatus = (scheduledAt: string) => {
        const classTime = new Date(scheduledAt);
        const diffMs = classTime.getTime() - currentTime.getTime();

        if (diffMs < 0) {
            return {
                status: "ended",
                display: isBn ? "ক্লাস সমাপ্ত" : "Class ended",
                color: "danger",
            };
        }

        const diffSecs = Math.floor(diffMs / 1000);
        const days = Math.floor(diffSecs / (24 * 60 * 60));
        const hours = Math.floor((diffSecs % (24 * 60 * 60)) / (60 * 60));
        const mins = Math.floor((diffSecs % (60 * 60)) / 60);

        if (diffSecs < 3600) {
            return {
                status: "soon",
                display: isBn ? `${mins} মি. বাকি` : `${mins}m left`,
                color: "warning",
            };
        }

        if (days === 0) {
            return {
                status: "today",
                display: isBn ? `${hours} ঘণ্টা বাকি` : `${hours}h left`,
                color: "primary",
            };
        }

        return {
            status: "later",
            display: isBn ? `${days} দিন ${hours} ঘণ্টা` : `${days}d ${hours}h`,
            color: "default",
        };
    };

    return (
        <RequireAuth allowedRoles={["student"]}>
            <div className="min-h-screen bg-[#F8FAFC] pb-20">
                {/* Ambient Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-8 pb-14 px-6 rounded-b-[36px] shadow-lg">
                    <div className="container mx-auto max-w-7xl relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Button
                                    isIconOnly
                                    variant="flat"
                                    className="bg-white/10 text-white rounded-xl hover:bg-white/20"
                                    size="sm"
                                    onPress={() => router.push("/student")}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-xl sm:text-2xl font-black text-white">
                                            {isBn ? "লাইভ ক্লাস রুটিন ও সময়সূচী" : "All Live Interactive Sessions"}
                                        </h1>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                                            LIVE
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300">
                                        {isBn ? "১০-১৫ জনের মাইক্রো-ব্যাচের আসন্ন ও সম্পন্ন সকল লাইভ ক্লাস" : "Upcoming and past sessions for your enrolled batches"}
                                    </p>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="bordered"
                                className="font-bold text-xs rounded-xl border-white/20 text-white hover:bg-white/10 self-start md:self-auto"
                                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                startContent={<MessageCircle className="w-3.5 h-3.5 text-emerald-400" />}
                            >
                                {isBn ? "ক্লাস লিংক সহায়তা" : "Meeting Link Help"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-6 relative z-20 space-y-6">
                    {/* 3 Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "আসন্ন লাইভ ক্লাস" : "Upcoming"}</p>
                                <p className="text-2xl font-black text-blue-600 mt-0.5">{upcomingClasses.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Radio className="w-5 h-5 animate-pulse" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "সম্পন্ন ক্লাস ও রেকর্ডিং" : "Completed"}</p>
                                <p className="text-2xl font-black text-emerald-600 mt-0.5">{pastClasses.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "মোট নির্ধারিত সেশন" : "Total Sessions"}</p>
                                <p className="text-2xl font-black text-[#2C2C2C] mt-0.5">{accessibleClasses.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Video className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 w-full">
                            <Input
                                isClearable
                                size="sm"
                                placeholder={isBn ? "ক্লাস বা কোর্সের নাম দিয়ে খুঁজুন..." : "Search class or course title..."}
                                startContent={<Search className="w-4 h-4 text-slate-400" />}
                                value={searchQuery}
                                onValueChange={setSearchQuery}
                                classNames={{ inputWrapper: "bg-slate-50 border border-slate-200 rounded-xl" }}
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <Select
                                size="sm"
                                label={isBn ? "ফিল্টার" : "Status"}
                                selectedKeys={[statusFilter]}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                classNames={{ trigger: "bg-slate-50 border border-slate-200 rounded-xl" }}
                            >
                                <SelectItem key="all">{isBn ? "সকল ক্লাস" : "All Classes"}</SelectItem>
                                <SelectItem key="upcoming">{isBn ? "আসন্ন ক্লাস" : "Upcoming"}</SelectItem>
                                <SelectItem key="past">{isBn ? "সম্পন্ন ক্লাস" : "Completed"}</SelectItem>
                            </Select>
                        </div>
                    </div>

                    {/* Classes Grid */}
                    {classesLoading ? (
                        <div className="flex justify-center py-20">
                            <Spinner size="lg" label={isBn ? "ক্লাস শিডিউল লোড হচ্ছে..." : "Loading schedule..."} />
                        </div>
                    ) : paginatedClasses.length === 0 ? (
                        <Card className="rounded-[28px] border border-slate-200 shadow-sm bg-white">
                            <CardBody className="text-center py-12 px-4">
                                <Video className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                                <h3 className="text-base font-bold text-slate-700 mb-1">
                                    {isBn ? "কোনো লাইভ ক্লাস পাওয়া যায়নি" : "No live classes found"}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    {isBn ? "নতুন ক্লাসের শিডিউল শীঘ্রই প্রকাশিত হবে।" : "Upcoming class schedule will be published shortly."}
                                </p>
                            </CardBody>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedClasses.map((cls: any) => {
                                const classDate = new Date(cls.scheduledAt);
                                const courseName = typeof cls.courseId === "object" && cls.courseId ? cls.courseId.title : "Course";
                                const instructorName = typeof cls.instructorId === "object" && cls.instructorId ? cls.instructorId.name : "Instructor";
                                const timeStatus = getTimeStatus(cls.scheduledAt);
                                const isUpcoming = classDate > currentTime && cls.status === "Scheduled";

                                return (
                                    <div
                                        key={cls._id}
                                        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all duration-300 space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold">
                                                        {cls.platform || "Google Meet"}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">•</span>
                                                    <span className="text-[11px] text-slate-500 font-medium truncate">
                                                        👨‍🏫 {instructorName}
                                                    </span>
                                                </div>
                                                <h4 className="font-extrabold text-sm text-[#2C2C2C] line-clamp-1">
                                                    {cls.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 line-clamp-1">
                                                    {courseName}
                                                </p>
                                            </div>

                                            <Chip size="sm" variant="flat" color={isUpcoming ? "warning" : "default"} className="font-bold text-[10px]">
                                                {isUpcoming ? (isBn ? "আসন্ন" : "Upcoming") : (isBn ? "সম্পন্ন" : "Done")}
                                            </Chip>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                <span className="font-semibold text-slate-700">
                                                    {classDate.toLocaleDateString(isBn ? "bn-BD" : "en-US", { month: "short", day: "numeric" })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                                <span className="font-semibold text-slate-700">
                                                    {classDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        </div>

                                        {isUpcoming && (
                                            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between text-xs">
                                                <span className="text-amber-800 font-bold">{isBn ? "শুরু হতে বাকি:" : "Starts in:"}</span>
                                                <span className="font-black text-amber-900">{timeStatus.display}</span>
                                            </div>
                                        )}

                                        <div className="pt-2 flex items-center gap-2">
                                            {isUpcoming ? (
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    className="flex-1 font-bold text-xs rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                                    onPress={() => window.open(cls.meetingLink, "_blank")}
                                                    startContent={<Video className="w-3.5 h-3.5" />}
                                                >
                                                    {isBn ? "যোগ দিন" : "Join Class"}
                                                </Button>
                                            ) : cls.recordedLink ? (
                                                <Button
                                                    size="sm"
                                                    color="success"
                                                    variant="flat"
                                                    className="flex-1 font-bold text-xs rounded-xl"
                                                    onPress={() => window.open(cls.recordedLink, "_blank")}
                                                    startContent={<PlayCircle className="w-3.5 h-3.5" />}
                                                >
                                                    {isBn ? "রেকর্ডিং দেখুন" : "Watch Recording"}
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    className="flex-1 font-bold text-xs rounded-xl"
                                                    isDisabled
                                                >
                                                    {isBn ? "ক্লাস সমাপ্ত" : "Session Over"}
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                className="font-bold text-xs rounded-xl border-slate-200 text-slate-700"
                                                onPress={() => {
                                                    const courseId = typeof cls.courseId === "object" && cls.courseId ? cls.courseId._id : cls.courseId;
                                                    if (courseId) router.push(`/courses/${courseId}`);
                                                }}
                                            >
                                                {isBn ? "কোর্স" : "Course"}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </RequireAuth>
    );
}
