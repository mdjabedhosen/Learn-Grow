"use client";

import React, { useMemo, useState, useEffect } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Skeleton,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useGetAdminDashboardStatsQuery } from "@/redux/api/userApi";
import { useGetCoursesCountQuery } from "@/redux/api/courseApi";
import { useGetTicketStatsQuery } from "@/redux/features/ticketApi";
import { useGetTrialBookingsQuery } from "@/redux/api/trialBookingApi";
import {
  Users,
  BookOpen,
  TrendingUp,
  LifeBuoy,
  UserCheck,
  Video,
  GraduationCap,
  Clock,
  ShieldCheck,
  CreditCard,
  Layers,
  Settings,
  Package,
  Activity,
  ArrowUpRight,
  Server,
  Database,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CalendarCheck,
} from "lucide-react";

function AdminDashboardContent() {
  const router = useRouter();

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

  // Fetch dashboard stats
  const { data: statsData, isLoading: statsLoading } = useGetAdminDashboardStatsQuery(undefined);
  const { data: countData } = useGetCoursesCountQuery({});
  const { data: ticketStatsData } = useGetTicketStatsQuery(undefined);
  const { data: trialBookingsData } = useGetTrialBookingsQuery();

  const totalTrials = trialBookingsData?.count ?? trialBookingsData?.data?.length ?? 0;
  const pendingTrials = (trialBookingsData?.data || []).filter((t: any) => t.status === "pending").length;

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalUsers = statsData?.data?.totalUsers ?? 0;
    const totalStudents = statsData?.data?.students ?? 0;
    const totalInstructors = statsData?.data?.instructors ?? 0;
    const totalCourses = countData?.data?.total ?? 0;
    const openTickets = ticketStatsData?.data?.open ?? 0;

    return {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      openTickets,
    };
  }, [statsData, countData, ticketStatsData]);

  const quickActions = [
    {
      title: isBn ? "ফ্রি ট্রায়াল রিকোয়েস্ট" : "Free Trial Leads",
      description: isBn ? "অভিভাবকদের ট্রায়াল ক্লাস আবেদন ও ফলো-আপ" : "Review & nurture trial bookings",
      icon: <CalendarCheck className="w-5 h-5" />,
      color: "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
      badge: pendingTrials,
      badgeColor: "bg-amber-500",
      href: "/admin/trials",
    },
    {
      title: isBn ? "সাপোর্ট টিকিট" : "Support Tickets",
      description: isBn ? "শিক্ষার্থী ও অভিভাবকদের সহায়তা" : "Manage help desk tickets",
      icon: <LifeBuoy className="w-5 h-5" />,
      color: "text-rose-600 bg-rose-50 border-rose-100 group-hover:bg-rose-600 group-hover:text-white",
      badge: stats.openTickets,
      badgeColor: "bg-rose-500",
      href: "/admin/tickets",
    },
    {
      title: isBn ? "শিক্ষার্থী তালিকা" : "Student Registry",
      description: isBn ? "শিক্ষার্থী অ্যাকাউন্ট ও অগ্রগতি" : "View enrolled students",
      icon: <GraduationCap className="w-5 h-5" />,
      color: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
      badge: stats.totalStudents,
      badgeColor: "bg-blue-500",
      href: "/admin/students",
    },
    {
      title: isBn ? "শিক্ষক ও মেন্টর" : "Instructors",
      description: isBn ? "শিক্ষক আবেদন ও অনুমোদন" : "Review & approve instructors",
      icon: <UserCheck className="w-5 h-5" />,
      color: "text-amber-600 bg-amber-50 border-amber-100 group-hover:bg-amber-600 group-hover:text-white",
      badge: stats.totalInstructors,
      badgeColor: "bg-amber-500",
      href: "/admin/instructors",
    },
    {
      title: isBn ? "কোর্স ম্যানেজমেন্ট" : "Courses & Curriculum",
      description: isBn ? "কোর্স অনুমোদন ও মডিউল আপডেট" : "Publish & manage courses",
      icon: <BookOpen className="w-5 h-5" />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white",
      badge: stats.totalCourses,
      badgeColor: "bg-emerald-500",
      href: "/admin/courses",
    },
    {
      title: isBn ? "লাইভ ক্লাস শিডিউল" : "Live Classes",
      description: isBn ? "Google Meet / Zoom সেশন মনিটরিং" : "Schedule & manage live sessions",
      icon: <Video className="w-5 h-5" />,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white",
      href: "/admin/live-classes",
    },
    {
      title: isBn ? "অর্ডার ও পেমেন্ট" : "Orders & Billing",
      description: isBn ? "bKash / Nagad পেমেন্ট ও কিট ডেলিভারি" : "Review orders & hardware kits",
      icon: <Package className="w-5 h-5" />,
      color: "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
      href: "/admin/orders",
    },
    {
      title: isBn ? "কম্বো ও বান্ডেল" : "Bundles & Combos",
      description: isBn ? "স্পেশাল প্যাকেজ ও ছাড় নির্ধারণ" : "Manage course bundle offers",
      icon: <Layers className="w-5 h-5" />,
      color: "text-cyan-600 bg-cyan-50 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white",
      href: "/admin/combos",
    },
    {
      title: isBn ? "প্ল্যাটফর্ম অ্যানালিটিক্স" : "Analytics & Reports",
      description: isBn ? "রেভিনিউ, এনগেজমেন্ট ও গ্রোথ" : "Platform growth & revenue trends",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-teal-600 bg-teal-50 border-teal-100 group-hover:bg-teal-600 group-hover:text-white",
      href: "/admin/analytics",
    },
    {
      title: isBn ? "টিম ও অ্যাডমিন" : "Team & Security",
      description: isBn ? "রোল, পারমিশন ও এক্সেস কন্ট্রোল" : "Roles & system permissions",
      icon: <ShieldCheck className="w-5 h-5" />,
      color: "text-slate-700 bg-slate-100 border-slate-200 group-hover:bg-slate-800 group-hover:text-white",
      href: "/admin/team-management",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Ambient Platform Command Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  {isBn ? "অ্যাডমিন কমান্ড সেন্টার" : "Admin Command Center"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isBn ? "সার্ভার অনলাইন" : "Server Online"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {isBn ? "প্ল্যাটফর্ম ওভারভিউ ও পরিচালনা" : "Platform Administration & Control"}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {isBn 
                  ? "লার্ন অ্যান্ড গ্রো-এর লাইভ ব্যাচ, শিক্ষার্থী তালিকা, পেমেন্ট ও ইনস্ট্রাক্টর অনুমোদন রিয়েল-টাইমে নিয়ন্ত্রণ করুন।"
                  : "Monitor live batches, verify tuition orders, approve educator courses, and manage global platform operations."}
              </p>
            </div>

            {/* Header Action Shortcuts */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                color="warning"
                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/25 bg-amber-500 hover:bg-amber-400 text-white"
                onPress={() => router.push("/admin/trials")}
                startContent={<CalendarCheck className="w-4 h-4" />}
              >
                {isBn ? `ফ্রি ট্রায়াল লিডস (${pendingTrials || 0})` : `Trial Leads (${pendingTrials || 0})`}
              </Button>
              <Button
                color="primary"
                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-500"
                onPress={() => router.push("/admin/orders")}
                startContent={<Package className="w-4 h-4" />}
              >
                {isBn ? "অর্ডার ম্যানেজমেন্ট" : "Manage Orders"}
              </Button>
              <Button
                variant="bordered"
                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                onPress={() => router.push("/admin/tickets")}
                startContent={<LifeBuoy className="w-4 h-4 text-rose-400" />}
              >
                {isBn ? "সাপোর্ট ডেস্ক" : "Support Desk"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-20">
        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Users */}
          <div 
            onClick={() => router.push("/admin/users")}
            className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {isBn ? "মোট নিবন্ধিত ইউজার" : "Total Users"}
              </p>
              <Skeleton isLoaded={!statsLoading} className="rounded-lg">
                <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                  {stats.totalUsers}
                </p>
              </Skeleton>
              <p className="text-[11px] font-medium text-slate-400">
                {stats.totalStudents} {isBn ? "জন শিক্ষার্থী অন্তর্ভুক্ত" : "students"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-blue-50 border-blue-100 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Courses */}
          <div 
            onClick={() => router.push("/admin/courses")}
            className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {isBn ? "প্রকাশিত কোর্সসমূহ" : "Active Courses"}
              </p>
              <Skeleton isLoaded={!statsLoading} className="rounded-lg">
                <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                  {stats.totalCourses}
                </p>
              </Skeleton>
              <p className="text-[11px] font-medium text-slate-400">
                {isBn ? "লাইভ মাইক্রো-ব্যাচ কারিকুলাম" : "Micro-batch curriculum"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-100 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Instructors */}
          <div 
            onClick={() => router.push("/admin/instructors")}
            className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {isBn ? "শিক্ষক ও মেন্টর" : "Instructors"}
              </p>
              <Skeleton isLoaded={!statsLoading} className="rounded-lg">
                <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                  {stats.totalInstructors}
                </p>
              </Skeleton>
              <p className="text-[11px] font-medium text-slate-400">
                {isBn ? "যাচাইকৃত বিশেষজ্ঞ শিক্ষক" : "Verified educators"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-100 text-amber-600">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Open Tickets */}
          <div 
            onClick={() => router.push("/admin/tickets")}
            className="cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-between gap-4"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                {isBn ? "ওপেন সাপোর্ট টিকিট" : "Open Tickets"}
              </p>
              <Skeleton isLoaded={!statsLoading} className="rounded-lg">
                <p className="text-2xl sm:text-3xl font-black text-rose-600">
                  {stats.openTickets}
                </p>
              </Skeleton>
              <p className="text-[11px] font-medium text-slate-400">
                {isBn ? "প্রয়োজনীয় সমাধান" : "Awaiting response"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-rose-50 border-rose-100 text-rose-600">
              <LifeBuoy className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Section 2: Command Action Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#2C2C2C]">
                {isBn ? "প্ল্যাটফর্ম কন্ট্রোল ও ম্যানেজমেন্ট" : "Platform Modules & Management"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {isBn ? "সরাসরি যেকোনো মডিউলে প্রবেশ করে তথ্য আপডেট করুন" : "Quick access shortcuts to core management surfaces"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => router.push(action.href)}
                className="group cursor-pointer rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm hover:border-blue-400/60 hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-colors ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-extrabold text-sm text-[#2C2C2C] group-hover:text-blue-600 transition-colors truncate">
                      {action.title}
                    </h3>
                    {action.badge !== undefined && action.badge > 0 && (
                      <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${action.badgeColor}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all self-center" />
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: System Status & Recent Platform Pulse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Pulse */}
          <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <CardHeader className="py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-[#2C2C2C]">
                  {isBn ? "লাইভ প্ল্যাটফর্ম সামারি" : "Live Platform Summary"}
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Real-Time
              </span>
            </CardHeader>
            <CardBody className="p-5 space-y-3">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-[#2C2C2C]">
                    {isBn ? `মোট ${stats.totalStudents} জন শিক্ষার্থী পোর্টালে যুক্ত আছেন` : `${stats.totalStudents} Students registered on platform`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isBn ? "১০-১৫ জনের মাইক্রো-ব্যাচে লাইভ ক্লাস করছেন" : "Engaging in live hands-on micro-batches"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-[#2C2C2C]">
                    {isBn ? `মোট ${stats.totalCourses}টি লাইভ কোর্স ও বান্ডেল সক্রিয়` : `${stats.totalCourses} Active courses and bundles`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isBn ? "রোবোটিক্স কিট ও পাইথন এআই কারিকুলাম অন্তর্ভুক্ত" : "Includes robotics hardware kit & Python AI curriculum"}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-[#2C2C2C]">
                    {isBn ? `মোট ${stats.totalInstructors} জন বিশেষজ্ঞ শিক্ষক ও মেন্টর যুক্ত` : `${stats.totalInstructors} Verified instructors mentoring`}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isBn ? "সার্বক্ষণিক কোয়ালিটি গ্যারান্টি বজায় রাখছেন" : "Maintaining 100% interactive live teaching standards"}
                  </p>
                </div>
              </div>

              <div 
                onClick={() => router.push("/admin/trials")}
                className="cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-orange-50/80 hover:from-amber-100/90 hover:to-orange-100/80 border border-amber-200/80 flex items-center gap-3 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-[#2C2C2C]">
                      {isBn ? `মোট ${totalTrials}টি ফ্রি ট্রায়াল ক্লাস রিকোয়েস্ট প্রাপ্ত` : `${totalTrials} Free trial requests received`}
                    </p>
                    {pendingTrials > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white">
                        {pendingTrials} {isBn ? "নতুন" : "New"}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isBn ? "অভিভাবকদের সাথে হোয়াটসঅ্যাপ ও কলে যোগাযোগের জন্য ক্লিক করুন" : "Click to view requests & contact parents via WhatsApp/Call"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* System Health & Operations Card */}
          <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <CardHeader className="py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-[#2C2C2C]">
                  {isBn ? "সিস্টেম স্বাস্থ্য ও সার্ভিস স্ট্যাটাস" : "System Health & Infrastructure"}
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {isBn ? "সব সার্ভিস সক্রিয়" : "Healthy"}
              </span>
            </CardHeader>
            <CardBody className="p-5 space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-slate-700">{isBn ? "Next.js ও API সার্ভার" : "Application & API Server"}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isBn ? "অনলাইন" : "Online"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-xs text-slate-700">{isBn ? "MongoDB ডাটাবেস" : "MongoDB Cluster"}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isBn ? "কানেক্টেড" : "Connected"}
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-xs text-slate-700">{isBn ? "পেমেন্ট গেটওয়ে (bKash/Nagad)" : "Payment Gateway Verification"}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {isBn ? "সক্রিয়" : "Active"}
                </span>
              </div>

              <div className="pt-2">
                <Button
                  fullWidth
                  color="primary"
                  className="font-bold text-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 h-10"
                  onPress={() => router.push("/admin/orders")}
                  startContent={<Package className="w-4 h-4" />}
                >
                  {isBn ? "পেন্ডিং অর্ডার ও কিট ডেলিভারি চেক করুন" : "View Orders & Kit Deliveries"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <RequireAuth allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </RequireAuth>
  );
}
