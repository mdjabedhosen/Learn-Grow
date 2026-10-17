"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, Chip, Button, Divider, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  Compass, 
  BookOpen, 
  Layers, 
  Bot, 
  Building2, 
  ShieldCheck, 
  MessageCircle,
  HelpCircle,
  Users,
  Gift
} from "lucide-react";

export default function StudentOrdersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetMyOrdersQuery({ page, limit: 8 });

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
  }, [page, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Spinner size="lg" label={isBn ? "অর্ডার লোড হচ্ছে..." : "Loading orders..."} />
      </div>
    );
  }

  const orders = data?.orders || [];
  const pagination = data?.pagination || { total: orders.length, page: 1, limit: 8, totalPages: 1 };

  const approvedCount = orders.filter((o: any) => o.paymentStatus === "approved").length;
  const pendingCount = orders.filter((o: any) => o.paymentStatus === "pending").length;
  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.price || 0), 0);

  const getPlanName = (plan: string) => {
    if (plan === "single") return isBn ? "সিঙ্গেল লাইভ কোর্স" : "Single Course";
    if (plan === "quarterly") return isBn ? "কোয়ার্টারলি অল অ্যাক্সেস" : "Quarterly All Access";
    if (plan === "kit") return isBn ? "রোবোটিক্স হার্ডওয়্যার কিট" : "Robotics Hardware Kit";
    if (plan === "combo") return isBn ? "কোর্স বান্ডেল প্যাকেজ" : "Course Bundle";
    if (plan === "school") return isBn ? "স্কুল প্রোগ্রাম" : "School Plan";
    return plan;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Ambient Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  <Package className="w-3.5 h-3.5 text-blue-300" />
                  {isBn ? "অর্ডার ও পেমেন্ট হিস্ট্রি" : "Billing & Orders"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {pagination.total} {isBn ? "টি অর্ডার" : "Total Orders"}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {isBn ? "আমার অর্ডারসমূহ ও রসিদ" : "My Orders & Receipts"}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                {isBn 
                  ? "আপনার কেনা সকল কোর্স, রোবোটিক্স কিট ও সাবস্ক্রিপশন স্ট্যাটাস ট্র্যাক করুন।"
                  : "Track all purchased live courses, robotics kits, and verification statuses."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                color="primary"
                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-500"
                onPress={() => router.push("/courses")}
                startContent={<Compass className="w-4 h-4" />}
              >
                {isBn ? "নতুন কোর্স দেখুন" : "Browse Courses"}
              </Button>
              <Button
                variant="bordered"
                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                startContent={<MessageCircle className="w-4 h-4 text-emerald-400" />}
              >
                {isBn ? "পেমেন্ট হেল্পলাইন" : "Billing Help"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl -mt-8 relative z-20">
        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "মোট অর্ডার" : "Total Orders"}</p>
            <p className="text-xl sm:text-2xl font-black text-[#2C2C2C] mt-0.5">{pagination.total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "অনুমোদিত" : "Approved"}</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">{approvedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "পেন্ডিং ভেরিফিকেশন" : "Pending"}</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600 mt-0.5">{pendingCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center sm:text-left">
            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "মোট খরচ" : "Total Spent"}</p>
            <p className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5">৳{totalSpent.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <Card className="rounded-[24px] border border-slate-200 shadow-sm bg-white">
            <CardBody className="p-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2C] mb-1">
                {isBn ? "এখনো কোনো অর্ডার পাওয়া যায়নি" : "No Orders Yet"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto">
                {isBn 
                  ? "রোবোটিক্স বা পাইথন প্রোগ্রামিং কোর্সে ভর্তি হয়ে আপনার লার্নিং জার্নি শুরু করুন।"
                  : "Explore our robotics & Python courses in small micro-batches of 10-15 students."}
              </p>
              <Button
                color="primary"
                className="font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 px-6 bg-blue-600"
                onPress={() => router.push("/courses")}
                startContent={<Compass className="w-4 h-4" />}
              >
                {isBn ? "কোর্স ক্যাটালগ দেখুন" : "Browse Courses"}
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const isActive = order.isActive && order.endDate && new Date(order.endDate) > new Date();

              return (
                <div 
                  key={order._id} 
                  className="rounded-[24px] border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        {order.planType === "kit" ? <Bot className="w-5 h-5" /> :
                         order.planType === "combo" ? <Layers className="w-5 h-5" /> :
                         order.planType === "quarterly" ? <ShieldCheck className="w-5 h-5" /> :
                         <BookOpen className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-[#2C2C2C]">
                          {getPlanName(order.planType)}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                          {order.transactionId && ` • TrxID: ${order.transactionId}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <p className="text-lg sm:text-xl font-black text-blue-600">
                        ৳{order.price?.toLocaleString()}
                      </p>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        order.paymentStatus === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.paymentStatus === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      }`}>
                        {order.paymentStatus === "approved" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {order.paymentStatus === "pending" && <Clock className="w-3.5 h-3.5" />}
                        {order.paymentStatus === "approved" ? (isBn ? "অনুমোদিত" : "Approved") :
                         order.paymentStatus === "pending" ? (isBn ? "যাচাই প্রক্রিয়াধীন" : "In Review") :
                         (isBn ? "বাতিল" : "Rejected")}
                      </span>
                    </div>
                  </div>

                  {/* Course or Combo Title */}
                  {order.courseId && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "কোর্স শিরোনাম" : "Course"}</p>
                        <p className="font-bold text-sm text-[#2C2C2C] truncate">{order.courseId.title}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 shrink-0">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        10-15 Batch
                      </span>
                    </div>
                  )}

                  {order.comboId && (
                    <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-purple-600 uppercase">{isBn ? "বান্ডেল শিরোনাম" : "Bundle"}</p>
                        <p className="font-bold text-sm text-purple-950 truncate">{order.comboId.name}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 shrink-0">
                        <Gift className="w-3.5 h-3.5 text-purple-600" />
                        All Included
                      </span>
                    </div>
                  )}

                  {/* Access validity or Kit delivery info */}
                  {order.startDate && order.endDate && (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          {new Date(order.startDate).toLocaleDateString(isBn ? "bn-BD" : "en-US", { month: 'short', day: 'numeric' })}
                          {" - "}
                          {new Date(order.endDate).toLocaleDateString(isBn ? "bn-BD" : "en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                          {Math.ceil((new Date(order.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} {isBn ? "দিন বাকি" : "days left"}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Delivery Address for Hardware Kit */}
                  {order.deliveryAddress && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600 space-y-1">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isBn ? "কিট ডেলিভারি ঠিকানা:" : "Hardware Kit Delivery Address:"}</span>
                      </p>
                      <p className="font-semibold text-[#2C2C2C]">{order.deliveryAddress.name} • {order.deliveryAddress.phone}</p>
                      <p className="text-slate-500">{order.deliveryAddress.city}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {order.paymentStatus === "approved" && (
                      <Button
                        size="sm"
                        color="primary"
                        className="font-bold text-xs rounded-xl bg-blue-600 text-white px-5 shadow-sm shadow-blue-500/20"
                        onPress={() => {
                          if (order.planType === "quarterly") {
                            router.push("/student");
                          } else if (order.planType === "single" && order.courseId) {
                            router.push(`/student/course/${order.courseId._id}/dashboard`);
                          } else if (order.planType === "combo") {
                            router.push("/student/my-courses");
                          } else {
                            router.push("/student");
                          }
                        }}
                        endContent={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        {isBn ? "ক্লাসরুমে যান" : "Go to Classroom"}
                      </Button>
                    )}

                    {order.paymentStatus === "pending" && (
                      <p className="text-xs text-amber-700 font-medium">
                        ⏳ {isBn ? "পেমেন্ট যাচাইয়ের পর আপনার কোর্স সক্রিয় হবে।" : "Your access will be activated upon verification."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-6">
                <Button
                  size="sm"
                  variant="flat"
                  className="font-bold text-xs rounded-xl"
                  onPress={() => setPage((prev) => Math.max(1, prev - 1))}
                  isDisabled={page <= 1}
                >
                  ← {isBn ? "পূর্ববর্তী" : "Previous"}
                </Button>
                <span className="text-xs font-bold px-3 text-slate-600">
                  {page} / {pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  className="font-bold text-xs rounded-xl"
                  onPress={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  isDisabled={page >= pagination.totalPages}
                >
                  {isBn ? "পরবর্তী" : "Next"} →
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}