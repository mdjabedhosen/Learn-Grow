"use client";

import React, { useMemo, useState, useEffect } from "react";
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Button, 
    Chip, 
    Avatar, 
    Spinner, 
    Divider, 
    Pagination 
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useGetMyOrdersQuery, useGetUserPurchasedCoursesQuery } from "@/redux/api/orderApi";
import { 
    BookOpen, 
    CheckCircle2, 
    Clock, 
    Award, 
    Sparkles, 
    Rocket, 
    ShoppingBag, 
    User, 
    GraduationCap, 
    Compass, 
    Package, 
    LifeBuoy, 
    PenLine, 
    ArrowRight, 
    MessageCircle, 
    ShieldCheck, 
    Layers, 
    Calendar,
    ChevronRight,
    Headphones,
    Star,
    Users,
    Check
} from "lucide-react";
import StudentLiveClasses from "./StudentLiveClasses";

export default function StudentDashboard() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const { data: ordersData, isLoading: ordersLoading } = useGetMyOrdersQuery();
    const { data: purchasedData, isLoading: coursesLoading } = useGetUserPurchasedCoursesQuery(currentPage);

    const [user, setUser] = useState<any>(null);
    const [language, setLanguage] = useState<"bn" | "en">("bn");

    // Load user & listen for language change
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user:", e);
            }
        }

        const savedLang = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
        setLanguage(savedLang);

        const handleLangChange = (e: any) => {
            setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
        };
        window.addEventListener("languageChange", handleLangChange);
        return () => window.removeEventListener("languageChange", handleLangChange);
    }, []);

    const isBn = language === "bn";

    const orders = ordersData?.orders || [];
    const purchasedCourses = purchasedData?.courses || [];
    const totalPurchasedCourses = purchasedData?.pagination?.total || 0;
    const totalPages = purchasedData?.pagination?.totalPages || 1;

    // Check if user has active quarterly (all access) subscription
    const hasAllAccess = useMemo(() => {
        const now = new Date();
        return orders.some(
            order =>
                order.planType === "quarterly" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                order.endDate &&
                new Date(order.endDate) > now
        );
    }, [orders]);

    // Count approved single purchases (if no quarterly)
    const singlePurchaseCount = useMemo(() => {
        if (hasAllAccess) return 0;
        return orders.filter(
            order =>
                order.planType === "single" &&
                order.paymentStatus === "approved" &&
                order.isActive &&
                order.courseId
        ).length;
    }, [hasAllAccess, orders]);

    // Get active subscription info
    const activeSubscription = useMemo(() => {
        if (!hasAllAccess) return null;

        const quarterlyOrder = orders.find(
            order =>
                order.planType === "quarterly" &&
                order.paymentStatus === "approved" &&
                order.isActive
        );

        if (!quarterlyOrder || !quarterlyOrder.endDate) return null;

        const now = new Date();
        const end = new Date(quarterlyOrder.endDate);
        const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        return {
            startDate: quarterlyOrder.startDate,
            endDate: quarterlyOrder.endDate,
            daysRemaining,
        };
    }, [hasAllAccess, orders]);

    // Fallback banner helper to avoid broken thumbnails
    const resolveCourseBanner = (course: any) => {
        if (!course) return "/courses/robotics-course-banner.jpg";
        const thumb = course.thumbnail || "";
        const title = (course.title || "").toLowerCase();
        if (thumb.includes("course-69ca5603e9e96ed80529474a") || thumb.includes("res.cloudinary.com") || !thumb) {
            if (title.includes("python")) return "/courses/python-course-banner.jpg";
            return "/courses/robotics-course-banner.jpg";
        }
        return thumb;
    };

    const stats = [
        { 
            label: isBn ? "কোর্স তালিকা" : "Enrolled Courses", 
            value: totalPurchasedCourses, 
            subText: isBn ? "সক্রিয় প্র্যাকটিক্যাল কোর্স" : "Active courses",
            icon: <BookOpen className="w-5 h-5" />, 
            color: "text-blue-600",
            bg: "bg-blue-50 border-blue-100",
            clickable: true,
            onClick: () => router.push("/student/my-courses")
        },
        { 
            label: isBn ? "অনুমোদিত অর্ডার" : "Total Orders", 
            value: orders.filter(o => o.paymentStatus === "approved").length, 
            subText: isBn ? "যাচাইকৃত পেমেন্ট" : "Verified payments",
            icon: <CheckCircle2 className="w-5 h-5" />, 
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-100",
            clickable: true, 
            onClick: () => router.push("/student/orders") 
        },
        { 
            label: isBn ? "পেন্ডিং অর্ডার" : "Pending Orders", 
            value: orders.filter(o => o.paymentStatus === "pending").length, 
            subText: isBn ? "যাচাই প্রক্রিয়াধীন" : "In review",
            icon: <Clock className="w-5 h-5" />, 
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-100",
            clickable: true,
            onClick: () => router.push("/student/orders")
        },
        { 
            label: isBn ? "অ্যাক্সেস মেম্বারশিপ" : "Access Tier", 
            value: hasAllAccess ? (isBn ? "অল অ্যাক্সেস" : "All Access") : (singlePurchaseCount > 0 ? (isBn ? `${singlePurchaseCount}টি কোর্স` : `${singlePurchaseCount} Single`) : (isBn ? "রেগুলার" : "Standard")), 
            subText: isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-batch",
            icon: <Award className="w-5 h-5" />, 
            color: hasAllAccess ? "text-purple-600" : "text-indigo-600",
            bg: hasAllAccess ? "bg-purple-50 border-purple-100" : "bg-indigo-50 border-indigo-100",
            clickable: false,
        },
    ];

    const quickActions = [
        {
            title: isBn ? "আমার প্রোফাইল" : "My Profile",
            desc: isBn ? "ব্যক্তিগত তথ্য ও সেটিংস" : "Account & profile",
            icon: <User className="w-5 h-5" />,
            color: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
            path: "/profile"
        },
        {
            title: isBn ? "আমার কোর্সসমূহ" : "My Courses",
            desc: isBn ? "ভর্তিকৃত লাইভ ব্যাচ" : "Enrolled classes",
            icon: <GraduationCap className="w-5 h-5" />,
            color: "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
            path: "/student/my-courses"
        },
        {
            title: isBn ? "নতুন কোর্স খুঁজুন" : "Browse Courses",
            desc: isBn ? "রোবোটিক্স ও কোডিং" : "Explore catalog",
            icon: <Compass className="w-5 h-5" />,
            color: "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
            path: "/courses"
        },
        {
            title: isBn ? "অর্ডার ও রসিদ" : "My Orders",
            desc: isBn ? "পেমেন্ট হিস্ট্রি" : "Billing & receipts",
            icon: <Package className="w-5 h-5" />,
            color: "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
            path: "/student/orders"
        },
        {
            title: isBn ? "সহায়তা টিকিট" : "Support Tickets",
            desc: isBn ? "২৪/৭ স্টুডেন্ট হেল্প" : "Student help desk",
            icon: <LifeBuoy className="w-5 h-5" />,
            color: "text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-600 group-hover:text-white",
            path: "/student/tickets"
        },
        {
            title: isBn ? "ব্লগ লিখুন" : "Write Blog",
            desc: isBn ? "লার্নিং অভিজ্ঞতা শেয়ার" : "Share learning story",
            icon: <PenLine className="w-5 h-5" />,
            color: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white",
            path: "/blog/create"
        },
    ];

    if (ordersLoading || coursesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <Spinner size="lg" label={isBn ? "ড্যাশবোর্ড লোড হচ্ছে..." : "Loading dashboard..."} />
            </div>
        );
    }

    const studentName = user?.name || user?.student_name || "Student";

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Ambient Ed-Tech Welcome Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
                {/* Ambient Glow Orbs */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <Avatar
                                    src={user?.img}
                                    name={studentName}
                                    className="w-20 h-20 text-2xl font-black bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-4 ring-white/10 ring-offset-2 ring-offset-[#0F172A]"
                                />
                                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0F172A] shadow" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md">
                                        <Sparkles className="w-3 h-3 text-amber-400" />
                                        {isBn ? "লার্ন অ্যান্ড গ্রো শিক্ষার্থী পোর্টাল" : "Student Learning Portal"}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                        <Users className="w-3 h-3 text-amber-300" />
                                        {isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-Batch"}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                    {isBn ? `স্বাগতম, ${studentName}!` : `Welcome back, ${studentName}!`}
                                </h1>
                                
                                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                                    {hasAllAccess 
                                        ? (isBn ? "আপনার সকল কোর্সে অল-অ্যাক্সেস সক্রিয় রয়েছে! নতুন লাইভ ব্যাচ ও প্রোজেক্ট অন্বেষণ করুন।" : "You have full All Access to all interactive live courses & projects!")
                                        : (isBn ? "আপনার ভবিষ্যৎ কোডিং ও রোবোটিক্স স্কিল তৈরির যাত্রা সফল হোক।" : "Empower your future with hands-on coding, robotics & AI skills.")}
                                </p>
                            </div>
                        </div>

                        {/* Top Hero Quick CTAs */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                color="primary"
                                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-500"
                                onPress={() => router.push("/courses")}
                                startContent={<Compass className="w-4 h-4" />}
                            >
                                {isBn ? "কোর্স খুঁজুন" : "Browse Catalog"}
                            </Button>
                            <Button
                                variant="bordered"
                                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                startContent={<MessageCircle className="w-4 h-4 text-emerald-400" />}
                            >
                                {isBn ? "মেন্টর হেল্পলাইন" : "Mentor Helpline"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-20">
                {/* 4 Interactive Metric / Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            onClick={stat.clickable ? stat.onClick : undefined}
                            className={`rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm transition-all duration-300 flex items-center justify-between gap-4 ${
                                stat.clickable 
                                    ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-blue-400/50" 
                                    : ""
                            }`}
                        >
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    {stat.label}
                                </p>
                                <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] font-medium text-slate-400">
                                    {stat.subText}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column (Span 2): Live Classes & Enrolled Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Live Classes Component */}
                        <StudentLiveClasses />

                        {/* Subscription Banner (if quarterly active) */}
                        {activeSubscription && (
                            <Card className="rounded-[24px] border-none bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-md overflow-hidden">
                                <CardBody className="p-6">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                                                    <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                                                </span>
                                                <h3 className="text-lg font-black">
                                                    {isBn ? "প্রিমিয়াম অল অ্যাক্সেস সদস্য" : "Premium All Access Member"}
                                                </h3>
                                            </div>
                                            <p className="text-xs sm:text-sm text-purple-100 max-w-md">
                                                {isBn 
                                                    ? `মেয়াদ শেষ হবে: ${new Date(activeSubscription.endDate).toLocaleDateString("bn-BD")}`
                                                    : `Valid until ${new Date(activeSubscription.endDate).toLocaleDateString()}`}
                                            </p>
                                            <Chip color="warning" variant="solid" size="sm" className="font-bold text-xs">
                                                {activeSubscription.daysRemaining} {isBn ? "দিন বাকি রয়েছে" : "days remaining"}
                                            </Chip>
                                        </div>
                                        <div className="text-4xl sm:text-5xl opacity-80 shrink-0 text-white">
                                            <GraduationCap className="w-12 h-12" />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        )}

                        {/* My Purchased Courses */}
                        <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="font-extrabold text-base text-[#2C2C2C]">
                                                {hasAllAccess 
                                                    ? (isBn ? "প্ল্যাটফর্মের সকল কোর্স" : "All Available Courses") 
                                                    : (isBn ? "আমার ভর্তিকৃত কোর্সসমূহ" : "My Purchased Courses")}
                                            </h2>
                                            {hasAllAccess && (
                                                <Chip size="sm" color="success" variant="flat" className="text-xs font-bold">
                                                    {isBn ? "অল অ্যাক্সেস" : "All Access"}
                                                </Chip>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {isBn ? "লাইভ ক্লাস, প্রজেক্ট ফাইল ও অ্যাসাইনমেন্ট" : "Live classes, project files & assignments"}
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    className="font-bold text-xs rounded-xl"
                                    onPress={() => router.push("/courses")}
                                    startContent={<Rocket className="w-3.5 h-3.5" />}
                                >
                                    {isBn ? "আরও কোর্স এক্সপ্লোর করুন" : "Explore More"}
                                </Button>
                            </CardHeader>

                            <CardBody className="p-6">
                                {purchasedCourses.length === 0 ? (
                                    /* Inspiring Ed-Tech Empty State with Course Showcase */
                                    <div className="space-y-6">
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-6 text-center">
                                            <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center mx-auto mb-3 text-blue-600">
                                                <GraduationCap className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-black text-[#2C2C2C] mb-1">
                                                {isBn ? "আপনি এখনো কোনো কোর্সে ভর্তি হননি" : "You haven't enrolled in any courses yet"}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-4">
                                                {isBn 
                                                    ? "১০-১৫ জনের মাইক্রো-ব্যাচে হাতে-কলমে রোবোটিক্স ও পাইথন প্রোগ্রামিং শেখা শুরু করুন। ১০০% লাইভ ক্লাস ও পূর্ণাঙ্গ হার্ডওয়্যার কিট সাপোর্ট।"
                                                    : "Start learning hands-on coding & robotics in live micro-batches (10-15 students). Includes 1-on-1 mentorship & live feedback."}
                                            </p>
                                            <Button
                                                color="primary"
                                                className="font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 px-6"
                                                onPress={() => router.push("/courses")}
                                                endContent={<ArrowRight className="w-4 h-4" />}
                                            >
                                                {isBn ? "সকল কোর্স দেখুন" : "Explore Courses"}
                                            </Button>
                                        </div>

                                        {/* Recommended Courses Showcase */}
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                    {isBn ? "জনপ্রিয় লাইভ ব্যাচসমূহ" : "Popular Live Batches"}
                                                </h4>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {isBn ? "ভর্তি চলছে" : "Enrolling Now"}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Card 1: Junior Robotics */}
                                                <div 
                                                    onClick={() => router.push("/courses/junior-robotics-with-arduino")}
                                                    className="group cursor-pointer rounded-2xl border border-slate-200 hover:border-blue-400/60 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                                                        <img
                                                            src="/courses/robotics-course-banner.jpg"
                                                            alt="Junior Robotics with Arduino"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0F172A]/80 text-white backdrop-blur-md">
                                                            {isBn ? "বয়স: ১০-১৪ বছর" : "Age: 10-14"}
                                                        </span>
                                                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow">
                                                            {isBn ? "হার্ডওয়্যার কিট সহ" : "Kit Included"}
                                                        </span>
                                                    </div>
                                                    <div className="p-4 space-y-2">
                                                        <h5 className="font-extrabold text-sm text-[#2C2C2C] group-hover:text-blue-600 transition-colors line-clamp-1">
                                                            Junior Robotics with Arduino
                                                        </h5>
                                                        <p className="text-xs text-slate-500 line-clamp-2">
                                                            {isBn 
                                                                ? "সেন্সর, আর্দুইনো ও সার্কিট দিয়ে বাস্তব রোবট গাড়ি ও উদ্ভাবন তৈরি।"
                                                                : "Build intelligent robots with Arduino, ultrasonic sensors & motor drivers."}
                                                        </p>
                                                        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                                                            <span className="text-slate-500 font-medium inline-flex items-center gap-1.5">
                                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>10-15 Micro-Batch</span>
                                                            </span>
                                                            <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                                                                {isBn ? "বিস্তারিত দেখুন" : "View Details"} →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Card 2: Python for Teens */}
                                                <div 
                                                    onClick={() => router.push("/courses/python-programming-for-teens")}
                                                    className="group cursor-pointer rounded-2xl border border-slate-200 hover:border-purple-400/60 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                                                        <img
                                                            src="/courses/python-course-banner.jpg"
                                                            alt="Python Programming & AI for Teens"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0F172A]/80 text-white backdrop-blur-md">
                                                            {isBn ? "বয়স: ১২-১৭ বছর" : "Age: 12-17"}
                                                        </span>
                                                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-600 text-white shadow">
                                                            {isBn ? "গেম ও এআই প্রজেক্ট" : "Games & AI"}
                                                        </span>
                                                    </div>
                                                    <div className="p-4 space-y-2">
                                                        <h5 className="font-extrabold text-sm text-[#2C2C2C] group-hover:text-purple-600 transition-colors line-clamp-1">
                                                            Python Programming & AI for Teens
                                                        </h5>
                                                        <p className="text-xs text-slate-500 line-clamp-2">
                                                            {isBn 
                                                                ? "পাইথন প্রোগ্রামিং, গেম ডেভেলপমেন্ট ও রিয়েল চ্যাটবট তৈরির লাইভ প্র্যাকটিস।"
                                                                : "Master Python fundamentals, build arcade games & deploy intelligent chatbots."}
                                                        </p>
                                                        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                                                            <span className="text-slate-500 font-medium inline-flex items-center gap-1.5">
                                                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                                                <span>10-15 Micro-Batch</span>
                                                            </span>
                                                            <span className="text-purple-600 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                                                                {isBn ? "বিস্তারিত দেখুন" : "View Details"} →
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Enrolled Courses Grid */
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {purchasedCourses.map((item: any) => {
                                                const bannerImg = resolveCourseBanner(item?.course);
                                                return (
                                                    <div
                                                        key={`${item?.accessType}-${item?.course?._id}-${item?.comboId || 'single'}`}
                                                        onClick={() => router.push(`/student/course/${item?.course?._id}/dashboard`)}
                                                        className="group cursor-pointer rounded-2xl border border-slate-200/90 hover:border-blue-400 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                                    >
                                                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                                                            <img
                                                                src={bannerImg}
                                                                alt={item?.course?.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                                onError={(e: any) => {
                                                                    e.currentTarget.src = "/courses/robotics-course-banner.jpg";
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                                            
                                                            <div className="absolute top-2.5 right-2.5">
                                                                {item?.accessType === "combo" ? (
                                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-600 text-white shadow inline-flex items-center gap-1">
                                                                        <Package className="w-3 h-3" />
                                                                        <span>{isBn ? "বান্ডেল" : "Bundle"}</span>
                                                                    </span>
                                                                ) : item?.accessType === "quarterly" ? (
                                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow inline-flex items-center gap-1">
                                                                        <Star className="w-3 h-3" />
                                                                        <span>{isBn ? "অল অ্যাক্সেস" : "All Access"}</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow inline-flex items-center gap-1">
                                                                        <BookOpen className="w-3 h-3" />
                                                                        <span>{isBn ? "সিঙ্গেল" : "Single"}</span>
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="absolute bottom-2 left-2.5 right-2.5">
                                                                <span className="text-[11px] font-bold text-white/90 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                                                                    {item?.course?.level || "Beginner"} • {item?.course?.instructor?.name || "Expert Mentor"}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="p-4 space-y-2">
                                                            {item?.accessType === "combo" && item?.comboName && (
                                                                <div className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                                                                    {item.comboName}
                                                                </div>
                                                            )}
                                                            <h3 className="font-extrabold text-sm sm:text-base text-[#2C2C2C] group-hover:text-blue-600 transition-colors line-clamp-1">
                                                                {item?.course?.title}
                                                            </h3>

                                                            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                                                <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1">
                                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span>{isBn ? "১০-১৫ জন ব্যাচ" : "10-15 Batch"}</span>
                                                                </span>
                                                                <Button
                                                                    size="sm"
                                                                    color="primary"
                                                                    className="font-bold text-xs rounded-xl px-3 bg-blue-600 text-white"
                                                                    onPress={() => router.push(`/student/course/${item?.course?._id}/dashboard`)}
                                                                    endContent={<ArrowRight className="w-3.5 h-3.5" />}
                                                                >
                                                                    {isBn ? "ক্লাসরুম" : "Classroom"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Pagination */}
                                        {totalPages > 1 && (
                                            <div className="flex flex-col items-center gap-2 mt-6 pt-4 border-t border-slate-100">
                                                <Pagination
                                                    total={totalPages}
                                                    page={currentPage}
                                                    onChange={setCurrentPage}
                                                    showControls
                                                    color="primary"
                                                    size="sm"
                                                    radius="lg"
                                                />
                                                <p className="text-xs text-slate-500 text-center">
                                                    {isBn 
                                                        ? `দেখানো হচ্ছে ${purchasedCourses.length}টি (মোট ${totalPurchasedCourses}টি) • পৃষ্ঠা ${currentPage} / ${totalPages}`
                                                        : `Showing ${purchasedCourses.length} of ${totalPurchasedCourses} courses • Page ${currentPage} of ${totalPages}`}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column: Quick Actions, Mentorship Widget & Recent Orders */}
                    <div className="space-y-6">
                        {/* Quick Actions Panel */}
                        <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                            <CardHeader className="py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center justify-between">
                                <h3 className="font-extrabold text-base text-[#2C2C2C]">
                                    {isBn ? "কুইক অ্যাকশন" : "Quick Actions"}
                                </h3>
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                                    Shortcuts
                                </span>
                            </CardHeader>

                            <CardBody className="p-4 grid grid-cols-2 gap-3">
                                {quickActions.map((action, i) => (
                                    <div
                                        key={i}
                                        onClick={() => router.push(action.path)}
                                        className="group cursor-pointer rounded-2xl border border-slate-100 hover:border-blue-300 p-3.5 bg-white hover:bg-slate-50/80 transition-all duration-300 flex flex-col items-start gap-2 shadow-sm hover:shadow"
                                    >
                                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${action.color}`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-[#2C2C2C] group-hover:text-blue-600 transition-colors">
                                                {action.title}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                                                {action.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardBody>
                        </Card>

                        {/* Dedicated Micro-Batch Mentorship & WhatsApp Helpline */}
                        <div className="rounded-[24px] border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white p-5 shadow-sm space-y-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                                    <Headphones className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-sm text-[#2C2C2C]">
                                        {isBn ? "মেন্টর ও ব্যাচ হেল্পলাইন" : "Batch Mentor Helpline"}
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                        {isBn ? "সরাসরি শিক্ষকের সাথে সংযোগ" : "Direct Teacher Support"}
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                {isBn 
                                    ? "প্রতি ব্যাচে মাত্র ১০-১৫ জন শিক্ষার্থী থাকায় আপনি পাচ্ছেন সার্বক্ষণিক মেন্টর সহায়তা। ক্লাস, হোমওয়ার্ক বা কিট সংক্রান্ত যেকোনো প্রয়োজনে WhatsApp-এ মেসেজ করুন।"
                                    : "With only 10-15 students per batch, your mentor provides personalized guidance. Connect via WhatsApp for any class or kit queries."}
                            </p>

                            <Button
                                size="sm"
                                className="w-full font-bold text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                startContent={<MessageCircle className="w-4 h-4" />}
                            >
                                {isBn ? "WhatsApp-এ কথা বলুন" : "Chat on WhatsApp"}
                            </Button>

                            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                                <span className="inline-flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>{isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-batch"}</span>
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>{isBn ? "১০০% লাইভ ক্লাস" : "100% Live Classes"}</span>
                                </span>
                            </div>
                        </div>

                        {/* Recent Orders List */}
                        <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                            <CardHeader className="py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex justify-between items-center">
                                <h3 className="font-extrabold text-sm text-[#2C2C2C]">
                                    {isBn ? "সাম্প্রতিক অর্ডার" : "Recent Orders"}
                                </h3>
                                <Button
                                    size="sm"
                                    variant="light"
                                    className="text-xs font-bold text-blue-600 min-w-0 px-2"
                                    onPress={() => router.push("/student/orders")}
                                >
                                    {isBn ? "সব দেখুন" : "View All"} →
                                </Button>
                            </CardHeader>

                            <CardBody className="p-4">
                                {orders.length === 0 ? (
                                    <div className="text-center py-6 text-slate-400">
                                        <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs font-medium">
                                            {isBn ? "এখনো কোনো অর্ডার নেই" : "No orders yet"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orders.slice(0, 3).map((order) => (
                                            <div 
                                                key={order._id} 
                                                className="border-b border-slate-100 last:border-b-0 pb-3 last:pb-0"
                                            >
                                                <div className="flex items-start justify-between mb-1 gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-xs text-[#2C2C2C] truncate">
                                                            {order.planType === "single" && order.courseId
                                                                ? order.courseId.title
                                                                : order.planType === "quarterly"
                                                                    ? (isBn ? "কোয়ার্টারলি অল অ্যাক্সেস" : "Quarterly All Access")
                                                                    : order.planType === "combo" && order.comboId
                                                                        ? (order.comboId.name || (isBn ? "কোর্স বান্ডেল" : "Course Bundle"))
                                                                        : order.planType === "kit"
                                                                            ? (isBn ? "রোবোটিক্স কিট" : "Robotics Kit")
                                                                            : "Order"}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-medium">
                                                            {new Date(order.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        order.paymentStatus === "approved"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : order.paymentStatus === "pending"
                                                                ? "bg-amber-100 text-amber-700"
                                                                : "bg-rose-100 text-rose-700"
                                                    }`}>
                                                        {order.paymentStatus === "approved" 
                                                            ? (isBn ? "অনুমোদিত" : "Approved")
                                                            : order.paymentStatus === "pending" 
                                                                ? (isBn ? "পেন্ডিং" : "Pending")
                                                                : (isBn ? "বাতিল" : "Failed")}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-black text-blue-600">
                                                    ৳{order.price?.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
