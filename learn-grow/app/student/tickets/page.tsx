"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Tabs,
  Tab,
  Skeleton,
  Pagination,
  useDisclosure,
} from "@nextui-org/react";
import {
  Plus,
  LifeBuoy,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import {
  useGetAllTicketsQuery,
  useGetTicketStatsQuery,
  useCreateTicketMutation,
} from "@/redux/features/ticketApi";
import TicketCard from "@/components/admin/TicketCard";
import CreateTicketModal from "@/components/admin/CreateTicketModal";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function StudentTicketsPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const { data: statsData, isLoading: statsLoading } = useGetTicketStatsQuery();
  const { data: ticketsData, isLoading: ticketsLoading } =
    useGetAllTicketsQuery({
      status: selectedStatus === "all" ? undefined : selectedStatus,
      page,
      limit,
    });
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  const stats = statsData?.data;
  const tickets = ticketsData?.data || [];
  const totalPages = ticketsData?.pagination?.totalPages || 1;

  const handleCreateTicket = async (data: any) => {
    try {
      await createTicket(data).unwrap();
      toast.success(isBn ? "টিকিট সফলভাবে তৈরি হয়েছে" : "Ticket created successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || (isBn ? "টিকিট তৈরি করতে ব্যর্থ হয়েছে" : "Failed to create ticket"));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Ambient Hero Header */}
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
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-400/30">
                    <LifeBuoy className="w-3.5 h-3.5" />
                    {isBn ? "স্টুডেন্ট হেল্প ডেস্ক" : "Student Help Desk"}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {isBn ? "আমার সাপোর্ট টিকিট ও সহায়তা" : "Support Tickets & Help Desk"}
                </h1>
                <p className="text-xs text-slate-300">
                  {isBn ? "ক্লাস, অ্যাসাইনমেন্ট, কিট বা পেমেন্ট সংক্রান্ত প্রশ্ন জমা দিন" : "Submit and track inquiries regarding classes, kits or payments"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                color="primary"
                className="font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 bg-blue-600 hover:bg-blue-500"
                onPress={onOpen}
                startContent={<Plus className="w-4 h-4" />}
              >
                {isBn ? "নতুন টিকিট তৈরি করুন" : "Create New Ticket"}
              </Button>
              <Button
                variant="bordered"
                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                startContent={<MessageCircle className="w-4 h-4 text-emerald-400" />}
              >
                {isBn ? "জরুরি WhatsApp হেল্প" : "WhatsApp Urgent"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-6 relative z-20 space-y-6">
        {/* Statistics Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "ওপেন টিকিট" : "Open"}</p>
                <p className="text-2xl font-black text-blue-600 mt-0.5">{stats?.open || 0}</p>
                <p className="text-[11px] text-slate-400">{isBn ? "উত্তরের অপেক্ষায়" : "Awaiting response"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "প্রক্রিয়াধীন" : "In Progress"}</p>
                <p className="text-2xl font-black text-amber-600 mt-0.5">{stats?.inProgress || 0}</p>
                <p className="text-[11px] text-slate-400">{isBn ? "টিম কাজ করছে" : "Being resolved"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "সমাধানকৃত" : "Solved"}</p>
                <p className="text-2xl font-black text-emerald-600 mt-0.5">{stats?.solved || 0}</p>
                <p className="text-[11px] text-slate-400">{isBn ? "সফলভাবে নিষ্পন্ন" : "Resolved"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "বন্ধকৃত" : "Closed"}</p>
                <p className="text-2xl font-black text-slate-600 mt-0.5">{stats?.closed || 0}</p>
                <p className="text-[11px] text-slate-400">{isBn ? "আর্কাইভ টিকিট" : "Archived"}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
          <Tabs
            selectedKey={selectedStatus}
            onSelectionChange={(key) => {
              setSelectedStatus(key as string);
              setPage(1);
            }}
            variant="solid"
            radius="lg"
            classNames={{
              tabList: "bg-slate-50 gap-2 p-1 rounded-xl",
              cursor: "bg-blue-600 text-white shadow-sm",
              tab: "h-9 px-4 font-bold text-xs text-slate-600",
            }}
          >
            <Tab key="all" title={isBn ? "সকল টিকিট" : "All Tickets"} />
            <Tab key="open" title={isBn ? "ওপেন" : "Open"} />
            <Tab key="in_progress" title={isBn ? "প্রক্রিয়াধীন" : "In Progress"} />
            <Tab key="solved" title={isBn ? "সমাধানকৃত" : "Solved"} />
            <Tab key="closed" title={isBn ? "বন্ধকৃত" : "Closed"} />
          </Tabs>
        </div>

        {/* Ticket List */}
        {ticketsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="rounded-2xl border border-slate-200">
                <CardBody className="p-6">
                  <Skeleton className="h-28 w-full rounded-xl" />
                </CardBody>
              </Card>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <Card className="rounded-[28px] border border-slate-200 shadow-sm bg-white">
            <CardBody className="text-center py-16 px-4">
              <LifeBuoy className="w-14 h-14 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 mb-1">
                {isBn ? "এই ফিল্টারে কোনো টিকিট নেই" : "No Tickets Found"}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {isBn ? "কোনো সমস্যা বা প্রশ্ন থাকলে নতুন টিকিট খুলুন।" : "Have a question? Create a ticket and our support team will assist you."}
              </p>
              <Button
                color="primary"
                size="sm"
                className="font-bold text-xs rounded-xl bg-blue-600"
                onPress={onOpen}
                startContent={<Plus className="w-4 h-4" />}
              >
                {isBn ? "নতুন টিকিট তৈরি করুন" : "Create Ticket"}
              </Button>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tickets.map((ticket: any) => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-6">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              showControls
              color="primary"
              size="sm"
              radius="lg"
            />
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateTicket}
        isLoading={isCreating}
      />
    </div>
  );
}
