"use client";

import React, { useMemo, useState, useEffect } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
  Card,
  CardBody,
  Button,
  Spinner,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useGetUsersAdminQuery } from "@/redux/api/userApi";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllOrdersQuery } from "@/redux/api/orderApi";
import {
  Users,
  BookOpen,
  TrendingUp,
  Package,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertCircle,
  Truck,
  CalendarCheck,
} from "lucide-react";

function ManagerDashboardContent() {
  const router = useRouter();

  // Bilingual state & listener
  const [lang, setLang] = useState<"en" | "bn">("bn");
  useEffect(() => {
    const currentLang = (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn";
    setLang(currentLang);
    const handleLangChange = (e: any) => {
      setLang(e.detail?.language || (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  // Fetch real platform metrics
  const { data: usersData, isLoading: usersLoading } = useGetUsersAdminQuery({ page: 1, limit: 100 });
  const { data: coursesData, isLoading: coursesLoading } = useGetAllCoursesQuery({ skip: 0, limit: 1 });
  const { data: ordersData } = useGetAllOrdersQuery({ planType: "kit" });
  const { data: allOrdersData } = useGetAllOrdersQuery({ status: "pending" });

  const stats = useMemo(() => {
    const totalUsers = usersData?.counts?.totalUsers ?? 0;
    const totalStudents = usersData?.counts?.students ?? 0;
    const totalInstructors = usersData?.counts?.instructors ?? 0;
    const totalCourses = coursesData?.meta?.total ?? coursesData?.data?.courses?.length ?? 0;
    const pendingOrders = (allOrdersData?.orders || allOrdersData?.data || []).length;
    const kitCount = (ordersData?.orders || ordersData?.data || []).length;

    return {
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      activeEnrollments: totalStudents,
      kitCount,
      pendingOrders,
    };
  }, [usersData, coursesData, allOrdersData, ordersData]);

  const quickActions = [
    {
      titleEn: "Free Trial Bookings",
      titleBn: "ফ্রি ট্রায়াল ক্লাস ও লিড",
      descEn: "Assign instructors and schedule incoming free trial classes",
      descBn: "অভিভাবকদের ট্রায়াল বুকিংয়ে শিক্ষক ও শিডিউল বরাদ্দ করুন",
      icon: CalendarCheck,
      color: "from-purple-600 to-indigo-600",
      bgLight: "bg-purple-50 text-purple-600",
      href: "/manager/trials",
    },
    {
      titleEn: "Batches & Cohorts",
      titleBn: "কোর্স ব্যাচ ও শিক্ষার্থী বরাদ্দ",
      descEn: "Manage micro-batches (15 students) & assign teachers",
      descBn: "১৫ জনের মাইক্রো-ব্যাচ তৈরি, শিক্ষক ও শিক্ষার্থী বরাদ্দ",
      icon: Users,
      color: "from-blue-600 to-cyan-600",
      bgLight: "bg-blue-50 text-blue-600",
      href: "/manager/batches",
    },
    {
      titleEn: "Manage Users",
      titleBn: "ব্যবহারকারী পরিচালনা",
      descEn: "Oversee students, parents, and platform members",
      descBn: "শিক্ষার্থী, অভিভাবক ও মেম্বারদের তথ্য ও স্ট্যাটাস",
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50 text-blue-600",
      href: "/manager/users",
    },
    {
      titleEn: "Approve Instructors",
      titleBn: "শিক্ষক ও মেন্টর অনুমোদন",
      descEn: "Review credentials and activate verified educators",
      descBn: "মেন্টরদের সিভিসমূহ যাচাই ও প্রোফাইল অ্যাক্টিভেশন",
      icon: UserCheck,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-600",
      href: "/manager/instructors",
    },
    {
      titleEn: "Course Curriculum",
      titleBn: "কোর্স ও ব্যাচ মডিউল",
      descEn: "Audit course syllabus, pricing, and 10-15 batch limits",
      descBn: "কোর্স কনটেন্ট, ফি এবং মাইক্রো-ব্যাচ ক্যাপাসিটি",
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-600",
      href: "/manager/courses",
    },
    {
      titleEn: "Hardware Kit Orders",
      titleBn: "রোবোটিক্স কিট ও অর্ডার",
      descEn: "Verify bKash/Nagad payments and dispatch packages",
      descBn: "পেমেন্ট ভেরিফিকেশন ও কুরিয়ার ট্র্যাকিং",
      icon: Truck,
      color: "from-rose-500 to-pink-600",
      bgLight: "bg-rose-50 text-rose-600",
      href: "/manager/orders",
      badge: stats.pendingOrders > 0 ? stats.pendingOrders : undefined,
    },
    {
      titleEn: "Live Class Schedule",
      titleBn: "লাইভ ক্লাস শিডিউলিং",
      descEn: "Monitor Friday & Saturday live video sessions",
      descBn: "সাপ্তাহিক লাইভ ক্লাস সেশন ও জুম/মিট লিংক অডিট",
      icon: Calendar,
      color: "from-purple-500 to-indigo-600",
      bgLight: "bg-purple-50 text-purple-600",
      href: "/manager/live-classes",
    },
    {
      titleEn: "Team & Faculty Profiles",
      titleBn: "টিম ও শিক্ষক প্রোফাইল",
      descEn: "Manage domain specializations, experience years, and skills",
      descBn: "ডোমেইন, অভিজ্ঞতা ও প্রযুক্তিগত স্কিল পরিচালনা",
      icon: ShieldCheck,
      color: "from-cyan-500 to-blue-600",
      bgLight: "bg-cyan-50 text-cyan-600",
      href: "/manager/team-management",
    },
  ];

  const isLoading = usersLoading || coursesLoading;

  return (
    <div className="space-y-8">
      {/* Ambient Kodland Operations Hero */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#047857] p-6 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {lang === "bn" ? "অপারেশনাল কন্ট্রোল হাব" : "Operations Command"}
              </span>
              <span className="text-xs text-white/50 font-medium">
                {lang === "bn" ? "১০-১৫ জন মাইক্রো-ব্যাচ মনিটরিং" : "10-15 Micro-Batches Monitoring"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {lang === "bn" ? "ম্যানেজার ড্যাশবোর্ড ও অপারেশনস" : "Operations Manager Dashboard"}
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/80 max-w-2xl">
              {lang === "bn"
                ? "শিক্ষার্থীদের ব্যাচ, শিক্ষক অনুমোদন, শুক্রবার ও শনিবারের লাইভ ক্লাস শিডিউল এবং হার্ডওয়্যার কিট ডেলিভারি তদারকি করুন।"
                : "Coordinate student micro-batches, instructor accreditations, weekend live sessions, and hardware kit fulfillment."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onPress={() => router.push("/manager/orders")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg min-h-[44px]"
              startContent={<Truck className="w-4 h-4" />}
            >
              {lang === "bn" ? `অর্ডার যাচাই (${stats.pendingOrders})` : `Pending Orders (${stats.pendingOrders})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" label={lang === "bn" ? "পরিসংখ্যান লোড হচ্ছে..." : "Loading operational metrics..."} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Users */}
          <Card className="rounded-[24px] border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "মোট ব্যবহারকারী" : "Total Platform Users"}
                  </p>
                  <p className="text-3xl font-black text-[#2C2C2C]">{stats.totalUsers}</p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-1">
                    {stats.totalStudents} {lang === "bn" ? "জন শিক্ষার্থী" : "Students"}
                  </p>
                </div>
                <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Card 2: Courses */}
          <Card className="rounded-[24px] border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "সক্রিয় কোর্স ও ব্যাচ" : "Active Live Courses"}
                  </p>
                  <p className="text-3xl font-black text-emerald-600">{stats.totalCourses}</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">
                    {lang === "bn" ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 per batch"}
                  </p>
                </div>
                <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Card 3: Instructors */}
          <Card className="rounded-[24px] border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "অনুমোদিত শিক্ষক" : "Verified Instructors"}
                  </p>
                  <p className="text-3xl font-black text-purple-600">{stats.totalInstructors}</p>
                  <p className="text-[11px] text-purple-500 font-medium mt-1">
                    {lang === "bn" ? "লাইভ ক্লাস মেন্টর" : "Classroom mentors"}
                  </p>
                </div>
                <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Card 4: Kit Orders */}
          <Card className="rounded-[24px] border border-rose-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                    {lang === "bn" ? "পেন্ডিং অর্ডার" : "Pending Orders"}
                  </p>
                  <p className="text-3xl font-black text-rose-600">{stats.pendingOrders}</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">
                    {lang === "bn" ? "যাচাই ও ডেলিভারি প্রয়োজন" : "Awaiting approval"}
                  </p>
                </div>
                <div className="p-3.5 bg-rose-50 text-rose-600 rounded-2xl">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Operational Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C]">
              {lang === "bn" ? "দ্রুত অপারেশনাল একশন" : "Operational Management Tools"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {lang === "bn" ? "দৈনন্দিন পরিচালনার প্রধান টুলস ও মডিউল" : "Core operational workflows and oversight modules"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Card
                key={idx}
                isPressable
                onPress={() => router.push(action.href)}
                className="rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group p-1"
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3.5 rounded-2xl ${action.bgLight} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {action.badge && (
                      <Chip color="danger" variant="solid" size="sm" className="font-black animate-pulse">
                        {action.badge}
                      </Chip>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-[#2C2C2C] mb-1 group-hover:text-emerald-600 transition-colors">
                    {lang === "bn" ? action.titleBn : action.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {lang === "bn" ? action.descBn : action.descEn}
                  </p>
                  <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    <span>{lang === "bn" ? "ম্যানেজ করুন" : "Access Workspace"}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Status & Operational Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Checklist */}
        <div className="lg:col-span-2">
          <Card className="rounded-[28px] border border-gray-100 shadow-sm bg-white">
            <CardBody className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-[#2C2C2C]">
                      {lang === "bn" ? "অপারেশনস স্বাস্থ্য ও চেকলিস্ট" : "Operations Checklist & Live Feeds"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {lang === "bn" ? "দৈনন্দিন ডেলিভারি ও ক্লাস সেশন আপডেট" : "Daily delivery and micro-batch metrics"}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {lang === "bn" ? "সক্রিয় মনিটরিং" : "Active"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-bold text-[#2C2C2C]">
                        {lang === "bn" ? "১০-১৫ জন মাইক্রো-ব্যাচ লিমিট" : "10-15 Micro-Batch Cap"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lang === "bn" ? "সকল ব্যাচে ব্যক্তিগত মেন্টরিং নিশ্চিত" : "Ensures 1-on-1 mentor guidance"}
                      </p>
                    </div>
                  </div>
                  <Chip size="sm" color="success" variant="flat" className="font-bold">
                    {lang === "bn" ? "সক্রিয়" : "Enforced"}
                  </Chip>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-bold text-[#2C2C2C]">
                        {lang === "bn" ? "শুক্রবার ও শনিবার লাইভ ক্লাস" : "Weekend Live Classes"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lang === "bn" ? "মিট/জুম লিংক ও সময়সূচি নিয়মিত তদারকি" : "Meet/Zoom link verified before broadcast"}
                      </p>
                    </div>
                  </div>
                  <Chip size="sm" color="warning" variant="flat" className="font-bold">
                    {lang === "bn" ? "মনিটর হচ্ছে" : "Tracking"}
                  </Chip>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-bold text-[#2C2C2C]">
                        {lang === "bn" ? "রোবোটিক্স কিট কুরিয়ার ডিসপ্যাচ" : "Robotics Kit Courier Dispatch"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lang === "bn" ? "বিকাশ/নগদ পেমেন্ট অনুমোদনের পর ডেলিভারি" : "Dispatched upon payment verification"}
                      </p>
                    </div>
                  </div>
                  <Chip size="sm" color="primary" variant="flat" className="font-bold">
                    {stats.pendingOrders} {lang === "bn" ? "অপেক্ষমাণ" : "Pending"}
                  </Chip>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Server Health Status Card */}
        <div>
          <Card className="rounded-[28px] border border-gray-100 shadow-sm bg-white">
            <CardBody className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-lg text-[#2C2C2C]">
                  {lang === "bn" ? "গেটওয়ে ও সিস্টেম হেলথ" : "Platform Connectivity"}
                </h3>
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-medium text-gray-600">
                    {lang === "bn" ? "এপিআই সার্ভার" : "API Services"}
                  </span>
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-medium text-gray-600">
                    {lang === "bn" ? "ডাটাবেজ কানেকশন" : "Database Cluster"}
                  </span>
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                    ● Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                  <span className="font-medium text-gray-600">
                    {lang === "bn" ? "বিকাশ ও নগদ গেটওয়ে" : "bKash & Nagad"}
                  </span>
                  <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                    ● Active
                  </span>
                </div>
              </div>

              <Button
                color="success"
                className="w-full rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md min-h-[44px]"
                onPress={() => router.push("/manager/orders")}
              >
                {lang === "bn" ? "পেন্ডিং অর্ডারসমূহ দেখুন" : "Process Pending Orders"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ManagerDashboard() {
  return (
    <RequireAuth allowedRoles={["admin", "manager"]}>
      <ManagerDashboardContent />
    </RequireAuth>
  );
}
