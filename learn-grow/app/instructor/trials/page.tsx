"use client";

import React, { useState, useEffect, useMemo } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Spinner,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import {
  useGetTrialBookingsQuery,
  useUpdateTrialBookingMutation,
} from "@/redux/api/trialBookingApi";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarCheck,
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaRobot,
  FaStickyNote,
  FaSync,
  FaVideo,
  FaExternalLinkAlt,
  FaUsers,
  FaGraduationCap,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-toastify";

function InstructorTrialsContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Bilingual support
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  useEffect(() => {
    const saved = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
    setLanguage(saved);
    const handleLang = (e: any) => {
      setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
    };
    window.addEventListener("languageChange", handleLang);
    return () => window.removeEventListener("languageChange", handleLang);
  }, []);
  const isBn = language === "bn";

  const [currentInstructorId, setCurrentInstructorId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const u = JSON.parse(userStr);
        setCurrentInstructorId(u._id || u.id || null);
      }
    } catch (e) {}
  }, []);

  // Backend automatically filters to assigned bookings when role is instructor
  const { data, isLoading, error, refetch } = useGetTrialBookingsQuery(
    currentInstructorId ? { instructorId: currentInstructorId } : undefined
  );
  const [updateBooking, { isLoading: isUpdating }] = useUpdateTrialBookingMutation();

  const allBookings = useMemo(() => {
    const raw = Array.isArray(data?.data) ? data.data : [];
    if (!currentInstructorId) return raw;
    // Strict isolation: only show trial classes where assignedInstructorId matches currentInstructorId
    return raw.filter((b: any) => {
      const assigned = b.assignedInstructorId?._id || b.assignedInstructorId?.id || b.assignedInstructorId;
      return assigned && assigned.toString() === currentInstructorId.toString();
    });
  }, [data, currentInstructorId]);

  // Notes & meeting link modal
  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [notes, setNotes] = useState("");

  const handleOpenEdit = (b: any) => {
    setActiveBooking(b);
    setMeetingLink(b.meetingLink || "");
    setNotes(b.notes || "");
    onOpenEdit();
  };

  const handleSaveEdit = async () => {
    if (!activeBooking) return;
    try {
      await updateBooking({
        id: activeBooking._id,
        meetingLink,
        notes,
      }).unwrap();
      toast.success(isBn ? "ক্লাস লিংক ও নোট সংরক্ষিত হয়েছে" : "Meeting link & notes updated");
      onCloseEdit();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update details");
    }
  };

  const handleMarkCompleted = async (b: any) => {
    try {
      await updateBooking({
        id: b._id,
        status: "completed",
      }).unwrap();
      toast.success(isBn ? "ট্রায়াল ক্লাস সম্পন্ন হিসেবে চিহ্নিত হয়েছে" : "Trial class marked as completed");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to mark as completed");
    }
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    let clean = (phone || "").replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "88" + clean;
    return clean;
  };

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return allBookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const pName = (b.parentName || "").toLowerCase();
        const pPhone = (b.parentPhone || "").toLowerCase();
        const track = (b.trackInterest || "").toLowerCase();
        return pName.includes(q) || pPhone.includes(q) || track.includes(q);
      }
      return true;
    });
  }, [allBookings, statusFilter, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    const total = allBookings.length;
    const scheduled = allBookings.filter((b) => b.status === "scheduled").length;
    const completed = allBookings.filter((b) => b.status === "completed").length;
    return { total, scheduled, completed };
  }, [allBookings]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                <FaGraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                {isBn ? "শিক্ষক ড্যাশবোর্ড" : "Instructor Workspace"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                <FaStar className="w-3 h-3 text-amber-600" />
                <span>{isBn ? "ফ্রি ট্রায়াল সেশন" : "Free Trial Sessions"}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
              {isBn ? "আমার নির্ধারিত ফ্রি ট্রায়াল ক্লাস" : "My Assigned Free Trial Classes"}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isBn
                ? "অভিভাবক ও শিক্ষার্থীদের সাথে লাইভ সেশন পরিচালনা করুন, ক্লাস লিংক সেট করুন এবং শিক্ষার্থীদের অগ্রগতি দেখুন।"
                : "Host 1-on-1 or small group trial sessions with parents and students, provide meeting links, and report status."}
            </p>
          </div>

          <Button
            size="sm"
            variant="flat"
            color="primary"
            className="font-bold rounded-xl self-start sm:self-auto"
            startContent={<FaSync className={isLoading ? "animate-spin" : ""} />}
            onPress={() => refetch()}
          >
            {isBn ? "রিফ্রেশ করুন" : "Refresh"}
          </Button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? "মোট নির্ধারিত সেশন" : "Total Assigned"}
              </p>
              <p className="text-3xl font-black text-[#2C2C2C] mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
              <FaUsers />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? "আসন্ন / শিডিউলকৃত" : "Scheduled / Upcoming"}
              </p>
              <p className="text-3xl font-black text-amber-600 mt-1">{stats.scheduled}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <FaCalendarCheck />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isBn ? "সম্পন্ন সেশন" : "Completed Sessions"}
              </p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{stats.completed}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <FaCheckCircle />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: "all", labelBn: "সকল", labelEn: "All" },
              { key: "scheduled", labelBn: "শিডিউলকৃত", labelEn: "Scheduled" },
              { key: "completed", labelBn: "সম্পন্ন", labelEn: "Completed" },
              { key: "pending", labelBn: "অপেক্ষারত", labelEn: "Pending" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isBn ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72">
            <Input
              size="sm"
              placeholder={isBn ? "অভিভাবক বা বিষয় দিয়ে খুঁজুন..." : "Search parent, student, track..."}
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<FaSearch className="text-slate-400 text-xs" />}
              isClearable
              onClear={() => setSearchTerm("")}
              className="w-full"
            />
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" color="primary" />
            <p className="text-sm font-semibold text-slate-500">
              {isBn ? "ট্রায়াল ক্লাসের তথ্য লোড হচ্ছে..." : "Loading assigned trial sessions..."}
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
              <FaRobot />
            </div>
            <h3 className="font-black text-lg text-slate-700">
              {isBn ? "কোনো নির্ধারিত ফ্রি ট্রায়াল ক্লাস পাওয়া যায়নি" : "No Assigned Trial Classes Found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isBn
                ? "অ্যাডমিন বা ম্যানেজার যখন কোনো ফ্রি ট্রায়াল ক্লাসে আপনাকে ইন্সট্রাক্টর হিসেবে অ্যাসাইন করবেন, তা এখানে দেখতে পাবেন।"
                : "When an Admin or Manager assigns a trial class cohort to you, it will appear here immediately."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBookings.map((booking) => {
              const waPhone = cleanPhoneForWhatsApp(booking.parentPhone);
              const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
                isBn
                  ? `আসসালামু আলাইকুম ${booking.parentName}! আমি Learn & Grow থেকে আপনার সন্তানের ফ্রি ট্রায়াল ক্লাসের শিক্ষক।`
                  : `Hello ${booking.parentName}! I am your Learn & Grow mentor for the upcoming Free Trial Class.`
              )}`;

              const isCompleted = booking.status === "completed";
              const isScheduled = booking.status === "scheduled";

              return (
                <Card
                  key={booking._id}
                  className="border border-slate-200/90 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden bg-white"
                >
                  <CardBody className="p-5 space-y-4">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {booking.trackInterest || "Coding & Robotics"}
                        </span>
                        <h3 className="font-extrabold text-base text-[#2C2C2C] mt-1">
                          {booking.parentName}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          {isBn ? "শিক্ষার্থীর বয়স:" : "Student Age:"} {booking.studentAge} {isBn ? "বছর" : "years"}
                        </p>
                      </div>

                      <Chip
                        size="sm"
                        variant="flat"
                        color={
                          isCompleted
                            ? "success"
                            : isScheduled
                            ? "warning"
                            : "default"
                        }
                        className="font-bold text-[11px]"
                      >
                        {booking.status?.toUpperCase()}
                      </Chip>
                    </div>

                    {/* Schedule box */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <FaClock className="text-indigo-600" />
                        <span>
                          {booking.scheduledDate || "Date TBD"}
                          {booking.scheduledTime ? ` • ${booking.scheduledTime}` : ""}
                        </span>
                      </div>
                      {booking.assignedBatchName && (
                        <p className="text-[11px] text-slate-500 font-medium">
                          {isBn ? "ব্যাচ:" : "Cohort:"} {booking.assignedBatchName}
                        </p>
                      )}
                      {booking.meetingLink ? (
                        <div className="pt-1">
                          <a
                            href={
                              booking.meetingLink.startsWith("http")
                                ? booking.meetingLink
                                : `https://${booking.meetingLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                          >
                            <FaVideo className="text-indigo-500" />
                            {isBn ? "লাইভ ক্লাস রুমে প্রবেশ করুন" : "Join Class Room"}
                            <FaExternalLinkAlt className="text-[10px]" />
                          </a>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-600 font-medium italic">
                          {isBn ? "এখনও কোনো মিটিং লিংক যোগ করা হয়নি" : "No meeting link assigned yet"}
                        </p>
                      )}
                    </div>

                    {/* Notes if any */}
                    {booking.notes && (
                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/80 text-[11px] text-slate-600">
                        <span className="font-bold text-amber-800">{isBn ? "নোট:" : "Note:"}</span>{" "}
                        {booking.notes}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp chat */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-colors"
                        >
                          <FaWhatsapp className="text-sm" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Call */}
                        {booking.parentPhone && (
                          <a
                            href={`tel:${booking.parentPhone}`}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Call Parent"
                          >
                            <FaPhoneAlt className="text-xs" />
                          </a>
                        )}

                        {/* Email */}
                        {booking.parentEmail && (
                          <a
                            href={`mailto:${booking.parentEmail}`}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Email Parent"
                          >
                            <FaEnvelope className="text-xs" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="flat"
                          color="secondary"
                          className="flex-1 font-bold rounded-xl text-xs"
                          startContent={<FaStickyNote />}
                          onPress={() => handleOpenEdit(booking)}
                        >
                          {isBn ? "লিংক ও নোট" : "Link & Notes"}
                        </Button>

                        {!isCompleted && (
                          <Button
                            size="sm"
                            color="success"
                            className="flex-1 font-bold rounded-xl text-xs text-white"
                            startContent={<FaCheckCircle />}
                            isLoading={isUpdating}
                            onPress={() => handleMarkCompleted(booking)}
                          >
                            {isBn ? "সম্পন্ন করুন" : "Complete"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Meeting Link and Notes Modal */}
      <Modal isOpen={isEditOpen} onClose={onCloseEdit} placement="center" radius="lg">
        <ModalContent>
          <ModalHeader className="font-black text-[#2C2C2C]">
            {isBn ? "ক্লাস লিংক ও শিক্ষক নোট আপডেট" : "Update Class Link & Session Notes"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <p className="text-xs text-slate-500">
              {isBn
                ? "অভিভাবকের সাথে শেয়ার করার জন্য Google Meet অথবা Zoom লিংক প্রদান করুন।"
                : "Provide Google Meet or Zoom meeting URL for the parent and student to join."}
            </p>

            <Input
              label={isBn ? "লাইভ ক্লাস মিটিং লিংক (Google Meet / Zoom)" : "Live Class Meeting Link"}
              placeholder="https://meet.google.com/xyz-abc-def"
              value={meetingLink}
              onValueChange={setMeetingLink}
              variant="bordered"
              size="sm"
            />

            <Textarea
              label={isBn ? "শিক্ষকের মন্তব্য / নোট" : "Teacher Notes / Feedback"}
              placeholder={isBn ? "ক্লাসের অগ্রগতি বা ফলোআপ তথ্য লিখুন..." : "Feedback or follow-up notes..."}
              value={notes}
              onValueChange={setNotes}
              variant="bordered"
              minRows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCloseEdit} className="font-bold">
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              color="primary"
              className="font-bold bg-indigo-600 text-white"
              isLoading={isUpdating}
              onPress={handleSaveEdit}
            >
              {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default function InstructorTrialsPage() {
  return (
    <RequireAuth allowedRoles={["instructor"]}>
      <InstructorTrialsContent />
    </RequireAuth>
  );
}
