"use client";

import React, { useState, useEffect, useMemo } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Select,
  SelectItem,
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
  useDeleteTrialBookingMutation,
} from "@/redux/api/trialBookingApi";
import {
  useGetApprovedInstructorsPublicQuery,
  useGetAllInstructorsQuery,
  useGetUsersAdminQuery,
} from "@/redux/api/userApi";
import { useGetAllBatchesAdminQuery } from "@/redux/api/batchApi";
import { useGetAllCoursesQuery, useGetPublishedCoursesQuery } from "@/redux/api/courseApi";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaCalendarCheck,
  FaSearch,
  FaFileDownload,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaRobot,
  FaStickyNote,
  FaSync,
  FaChalkboardTeacher,
  FaVideo,
  FaUserCheck,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminTrialsPage() {
  return (
    <RequireAuth allowedRoles={["admin", "manager"]}>
      <TrialsContent />
    </RequireAuth>
  );
}

function TrialsContent() {
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [deleteConfirmBooking, setDeleteConfirmBooking] = useState<any>(null);

  // Schedule modal state
  const [selectedBookingForSchedule, setSelectedBookingForSchedule] = useState<any>(null);
  const [scheduleForm, setScheduleForm] = useState({
    courseId: "",
    trackInterest: "",
    assignedInstructorId: "",
    scheduledDate: "",
    scheduledTime: "07:00 PM - 08:00 PM",
    meetingLink: "",
    assignedBatchId: "",
    notes: "",
  });

  const {
    isOpen: isNoteModalOpen,
    onOpen: onOpenNoteModal,
    onClose: onCloseNoteModal,
  } = useDisclosure();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const {
    isOpen: isScheduleModalOpen,
    onOpen: onOpenScheduleModal,
    onClose: onCloseScheduleModal,
  } = useDisclosure();

  // Bilingual support
  useEffect(() => {
    const saved = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
    setLanguage(saved);
    const handler = (e: any) => {
      setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
    };
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const isBn = language === "bn";

  // RTK Query: Bookings
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetTrialBookingsQuery({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    search: searchQuery || undefined,
  });

  // RTK Query: Courses
  const { data: coursesData } = useGetAllCoursesQuery({ limit: 100 });
  const { data: publishedCoursesData } = useGetPublishedCoursesQuery({ limit: 100 });

  const courses = useMemo(() => {
    const rawA =
      (coursesData as any)?.data?.courses ||
      (coursesData as any)?.data ||
      (coursesData as any)?.courses ||
      [];
    const rawB =
      (publishedCoursesData as any)?.data?.courses ||
      (publishedCoursesData as any)?.data ||
      (publishedCoursesData as any)?.courses ||
      [];
    const listA = Array.isArray(rawA) ? rawA : [];
    const listB = Array.isArray(rawB) ? rawB : [];
    const map = new Map<string, any>();

    [...listA, ...listB].forEach((c: any) => {
      if (c && (c._id || c.id)) {
        const id = (c._id || c.id).toString();
        map.set(id, {
          ...c,
          _id: id,
          title: c.title || c.name || "Course",
        });
      }
    });

    return Array.from(map.values());
  }, [coursesData, publishedCoursesData]);

  // RTK Query: Instructors & Batches for scheduling
  const { data: allInstructorsData } = useGetAllInstructorsQuery({ limit: 100 });
  const { data: approvedInstructorsData } = useGetApprovedInstructorsPublicQuery();
  const { data: adminInstructorsData } = useGetUsersAdminQuery({ role: "instructor", limit: 100 });
  const { data: adminAdminsData } = useGetUsersAdminQuery({ role: "admin", limit: 50 });
  const { data: batchesData } = useGetAllBatchesAdminQuery({});

  const batches = batchesData?.data || [];

  // Categorize batches: prioritized for the course currently selected in schedule modal
  const { selectedCourseBatches, otherBatches } = useMemo(() => {
    if (!batches || !Array.isArray(batches)) {
      return { selectedCourseBatches: [], otherBatches: [] };
    }

    const selectedCourseId = scheduleForm.courseId;
    const selectedCourse = courses.find((c: any) => c._id === selectedCourseId);
    const selectedCourseTitle = (selectedCourse?.title || "").toLowerCase();

    const matching: any[] = [];
    const others: any[] = [];

    batches.forEach((b: any) => {
      const bCourseId = b.courseId?._id || b.courseId?.id || b.courseId;
      const bCourseTitle = (b.courseId?.title || "").toLowerCase();

      const isMatch =
        (selectedCourseId && bCourseId && bCourseId.toString() === selectedCourseId.toString()) ||
        (selectedCourseTitle && bCourseTitle && (bCourseTitle.includes(selectedCourseTitle) || selectedCourseTitle.includes(bCourseTitle)));

      if (isMatch) {
        matching.push(b);
      } else {
        others.push(b);
      }
    });

    return { selectedCourseBatches: matching, otherBatches: others };
  }, [batches, scheduleForm.courseId, courses]);

  const instructors = useMemo(() => {
    const listA = allInstructorsData?.data || [];
    const listB = approvedInstructorsData?.data || [];
    const listC = adminInstructorsData?.data?.users || adminInstructorsData?.data || [];
    const listD = adminAdminsData?.data?.users || adminAdminsData?.data || [];
    const map = new Map<string, any>();

    [...listA, ...listB, ...listC, ...listD].forEach((ins: any) => {
      if (ins && (ins._id || ins.id)) {
        const id = (ins._id || ins.id).toString();
        map.set(id, {
          ...ins,
          _id: id,
          name: ins.name || "Instructor",
          email: ins.email || "",
          phone: ins.phone || "",
        });
      }
    });

    return Array.from(map.values());
  }, [allInstructorsData, approvedInstructorsData, adminInstructorsData, adminAdminsData]);

  const [updateTrialBooking, { isLoading: isUpdating }] = useUpdateTrialBookingMutation();
  const [deleteTrialBooking, { isLoading: isDeleting }] = useDeleteTrialBookingMutation();

  const bookings = apiResponse?.data || [];

  // Metrics calculation
  const metrics = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const contacted = bookings.filter((b) => b.status === "contacted").length;
    const scheduled = bookings.filter((b) => b.status === "scheduled" || b.status === "completed").length;
    return { total, pending, contacted, scheduled };
  }, [bookings]);

  // Handle Status Update
  const handleStatusChange = async (id: string, newStatus: any) => {
    try {
      await updateTrialBooking({ id, status: newStatus }).unwrap();
      toast.success(
        isBn ? "বুকিং স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!" : "Trial booking status updated!"
      );
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update status");
    }
  };

  // Open Schedule Modal
  const handleOpenScheduleModal = (booking: any) => {
    setSelectedBookingForSchedule(booking);

    const interest = (booking.trackInterest || "").toLowerCase().trim();
    const bCourseId = booking.courseId?._id || booking.courseId || "";

    const matchedCourse = courses.find((c: any) => {
      const cId = (c._id || c.id || "").toString();
      const cTitle = (c.title || "").toLowerCase();
      const cSlug = (c.slug || "").toLowerCase();
      return (
        (bCourseId && cId === bCourseId.toString()) ||
        cTitle === interest ||
        cSlug === interest ||
        (interest && (cTitle.includes(interest) || interest.includes(cTitle))) ||
        (interest.includes("robot") && cTitle.includes("robot")) ||
        (interest.includes("python") && cTitle.includes("python")) ||
        (interest.includes("scratch") && cTitle.includes("scratch")) ||
        (interest.includes("math") && cTitle.includes("math")) ||
        (interest.includes("science") && cTitle.includes("science")) ||
        (interest.includes("web") && cTitle.includes("web"))
      );
    }) || courses[0];

    const courseInstructorId =
      matchedCourse?.instructorId?._id ||
      matchedCourse?.instructorId ||
      (Array.isArray(matchedCourse?.instructorIds) && matchedCourse.instructorIds[0]?._id) ||
      (Array.isArray(matchedCourse?.instructorIds) && matchedCourse.instructorIds[0]) ||
      "";

    const existingInstructorId =
      booking.assignedInstructorId?._id ||
      booking.assignedInstructorId ||
      courseInstructorId ||
      instructors[0]?._id ||
      "";

    setScheduleForm({
      courseId: matchedCourse?._id || "",
      trackInterest: matchedCourse?.title || booking.trackInterest || "Junior Robotics with Arduino",
      assignedInstructorId: existingInstructorId,
      scheduledDate: booking.scheduledDate || new Date().toISOString().split("T")[0],
      scheduledTime: booking.scheduledTime || "07:00 PM - 08:30 PM",
      meetingLink: booking.meetingLink || "https://meet.google.com/smr-qqhn-sox",
      assignedBatchId: booking.assignedBatchId?._id || booking.assignedBatchId || "",
      notes: booking.notes || "",
    });
    onOpenScheduleModal();
  };

  // Save Schedule & Assign Instructor
  const handleSaveSchedule = async () => {
    if (!selectedBookingForSchedule) return;
    if (!scheduleForm.assignedInstructorId) {
      toast.error(isBn ? "অনুগ্রহ করে শিক্ষক বা মেন্টর নির্বাচন করুন" : "Please select an instructor/mentor");
      return;
    }
    if (!scheduleForm.scheduledDate) {
      toast.error(isBn ? "ক্লাসের তারিখ নির্বাচন করুন" : "Please select class date");
      return;
    }

    try {
      const selectedBatch = batches.find((b: any) => b._id === scheduleForm.assignedBatchId);
      await updateTrialBooking({
        id: selectedBookingForSchedule._id,
        status: "scheduled",
        assignedInstructorId: scheduleForm.assignedInstructorId,
        scheduledDate: scheduleForm.scheduledDate,
        scheduledTime: scheduleForm.scheduledTime,
        meetingLink: scheduleForm.meetingLink,
        assignedBatchId: scheduleForm.assignedBatchId || null,
        assignedBatchName: selectedBatch?.batchName || "",
        notes: scheduleForm.notes,
      }).unwrap();

      toast.success(
        isBn
          ? "ফ্রি ট্রায়াল ক্লাস শিডিউল ও শিক্ষক সফলভাবে বরাদ্দ করা হয়েছে!"
          : "Trial class scheduled and instructor assigned successfully!"
      );
      onCloseScheduleModal();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to schedule trial class");
    }
  };

  // Handle Note Save
  const handleSaveNote = async () => {
    if (!selectedBookingForNotes) return;
    try {
      await updateTrialBooking({
        id: selectedBookingForNotes._id,
        notes: noteText,
      }).unwrap();
      toast.success(isBn ? "নোট সংরক্ষিত হয়েছে!" : "Note saved successfully!");
      onCloseNoteModal();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to save note");
    }
  };

  // Handle Delete
  const handleDeleteBooking = async () => {
    if (!deleteConfirmBooking) return;
    try {
      await deleteTrialBooking(deleteConfirmBooking._id).unwrap();
      toast.success(isBn ? "বুকিং মুছে ফেলা হয়েছে!" : "Booking removed successfully!");
      onCloseDeleteModal();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to delete booking");
    }
  };

  // Format phone for WhatsApp
  const cleanPhoneForWhatsApp = (phone: string) => {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "88" + clean;
    } else if (!clean.startsWith("88") && clean.length === 10) {
      clean = "880" + clean;
    }
    return clean;
  };

  // CSV Export
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      toast.info(isBn ? "ডাউনলোড করার মতো কোনো ডাটা নেই" : "No data to export");
      return;
    }

    const headers = [
      "Parent Name",
      "Phone",
      "Email",
      "Student Age",
      "Track Interest",
      "Status",
      "Assigned Instructor",
      "Scheduled Date",
      "Scheduled Time",
      "Meeting Link",
      "Batch Name",
      "Source",
      "Notes",
      "Date",
    ];

    const rows = bookings.map((b: any) => {
      const insName = b.assignedInstructorId?.name || "";
      return [
        `"${b.parentName || ""}"`,
        `"${b.parentPhone || ""}"`,
        `"${b.parentEmail || ""}"`,
        `"${b.studentAge || ""}"`,
        `"${b.trackInterest || ""}"`,
        `"${b.status || ""}"`,
        `"${insName}"`,
        `"${b.scheduledDate || ""}"`,
        `"${b.scheduledTime || ""}"`,
        `"${b.meetingLink || ""}"`,
        `"${b.assignedBatchName || ""}"`,
        `"${b.source || ""}"`,
        `"${(b.notes || "").replace(/"/g, '""')}"`,
        `"${new Date(b.createdAt).toLocaleDateString()}"`,
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `learn-grow-trial-bookings-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(isBn ? "CSV ফাইল ডাউনলোড সম্পন্ন হয়েছে!" : "CSV exported successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-[#F59E0B] border border-amber-200 rounded-full text-xs font-bold mb-2">
            <FaCalendarCheck />
            <span>{isBn ? "লিড নার্চারিং ও ট্রায়াল শিডিউলিং" : "Lead Pipeline & Trial Cohorts"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
            {isBn ? "ফ্রি ট্রায়াল ক্লাস বুকিং ও শিক্ষক বরাদ্দ" : "Free Trial Class Bookings"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn
              ? "অভিভাবকদের ট্রায়াল আবেদন পর্যালোচনা করুন, শিক্ষক বা মেন্টর বরাদ্দ দিন এবং শিডিউল সরাসরি হোয়াটসঅ্যাপে পাঠান।"
              : "Review incoming trial requests, assign mentors/instructors, schedule cohorts, and notify parents via WhatsApp."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={() => refetch()}
            isLoading={isFetching}
            startContent={<FaSync className={isFetching ? "animate-spin" : ""} />}
            className="font-bold text-xs rounded-xl"
          >
            {isBn ? "রিফ্রেশ" : "Refresh"}
          </Button>

          <Button
            size="sm"
            color="success"
            variant="flat"
            onPress={handleExportCSV}
            startContent={<FaFileDownload />}
            className="font-bold text-xs rounded-xl"
          >
            {isBn ? "এক্সেল / CSV এক্সপোর্ট" : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-blue-100 shadow-xs bg-white">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {isBn ? "মোট আবেদন" : "Total Requests"}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-blue-600">{metrics.total}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <FaCalendarCheck size={22} />
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl border border-amber-100 shadow-xs bg-white">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                {isBn ? "অপেক্ষমান ফলো-আপ" : "Pending Follow-up"}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600">{metrics.pending}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FaClock size={22} />
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl border border-purple-100 shadow-xs bg-white">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                {isBn ? "যোগাযোগকৃত" : "Contacted"}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-purple-600">{metrics.contacted}</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <FaPhoneAlt size={22} />
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl border border-emerald-100 shadow-xs bg-white">
          <CardBody className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                {isBn ? "শিডিউল্ড ও মেন্টর বরাদ্দ" : "Scheduled / Enrolled"}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">{metrics.scheduled}</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <FaCheckCircle size={22} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-xs bg-white">
        <CardBody className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder={isBn ? "অভিভাবকের নাম, ফোন, ইমেইল বা বিষয় খুঁজুন..." : "Search by parent, phone, email, or track..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<FaSearch className="text-slate-400 text-xs" />}
              variant="bordered"
              size="sm"
              isClearable
              onClear={() => setSearchQuery("")}
              className="md:col-span-2"
            />

            <Select
              placeholder="Filter by Status"
              selectedKeys={[selectedStatus]}
              onSelectionChange={(keys) => setSelectedStatus(Array.from(keys)[0] as string)}
              variant="bordered"
              size="sm"
              aria-label="Filter by Status"
            >
              <SelectItem key="all">{isBn ? "সকল স্ট্যাটাস (All)" : "All Statuses"}</SelectItem>
              <SelectItem key="pending">{isBn ? "নতুন রিকোয়েস্ট (Pending)" : "Pending"}</SelectItem>
              <SelectItem key="contacted">{isBn ? "যোগাযোগ সম্পন্ন (Contacted)" : "Contacted"}</SelectItem>
              <SelectItem key="scheduled">{isBn ? "শিডিউল্ড (Scheduled)" : "Scheduled"}</SelectItem>
              <SelectItem key="completed">{isBn ? "সম্পন্ন / ভর্তি (Completed)" : "Completed"}</SelectItem>
              <SelectItem key="cancelled">{isBn ? "বাতিল (Cancelled)" : "Cancelled"}</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Bookings List / Table */}
      <Card className="rounded-2xl border border-slate-200/80 shadow-xs bg-white overflow-hidden">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <Spinner size="lg" color="primary" />
              <p className="text-xs text-slate-400 font-bold">
                {isBn ? "ট্রায়াল বুকিং ডাটা লোড হচ্ছে..." : "Loading trial bookings..."}
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl mx-auto mb-3">
                <FaCalendarCheck />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">
                {isBn ? "কোনো ট্রায়াল বুকিং পাওয়া যায়নি" : "No trial bookings found"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery || selectedStatus !== "all"
                  ? isBn
                    ? "অনুসন্ধানের সাথে কোনো বুকিং মেলেনি। ফিল্টার রিসেট করে দেখুন।"
                    : "No bookings match your search filters. Try clearing your search."
                  : isBn
                  ? "নতুন কোনো অভিভাবক ট্রায়াল বুক করলে এখানে স্বয়ংক্রিয়ভাবে তালিকাভুক্ত হবে।"
                  : "When parents book free trials from the website, they will appear here in real time."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">{isBn ? "অভিভাবক ও শিক্ষার্থী" : "Parent & Student"}</th>
                    <th className="py-3.5 px-4">{isBn ? "যোগাযোগ ও হোয়াটসঅ্যাপ" : "Contact & WhatsApp"}</th>
                    <th className="py-3.5 px-4">{isBn ? "কোর্স ও ট্রায়াল শিডিউল" : "Track & Trial Schedule"}</th>
                    <th className="py-3.5 px-4">{isBn ? "বর্তমান অবস্থা" : "Status"}</th>
                    <th className="py-3.5 px-4">{isBn ? "আবেদনের তারিখ" : "Date"}</th>
                    <th className="py-3.5 px-4 text-right">{isBn ? "শিডিউল ও অ্যাকশন" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking: any) => {
                    const waPhone = cleanPhoneForWhatsApp(booking.parentPhone);

                    // Assigned instructor details
                    const assignedIns = instructors.find(
                      (i: any) => i._id === (booking.assignedInstructorId?._id || booking.assignedInstructorId)
                    );
                    const insName =
                      booking.assignedInstructorId?.name ||
                      assignedIns?.name ||
                      (booking.assignedInstructorId ? "Assigned Mentor" : "");
                    const insPhone = booking.assignedInstructorId?.phone || assignedIns?.phone || "";
                    const isScheduled = !!booking.scheduledDate || booking.status === "scheduled";

                    // Pre-filled WhatsApp message for general follow-up
                    const waGeneralMessage = encodeURIComponent(
                      isBn
                        ? `আসসালামু আলাইকুম ${booking.parentName}, Learn & Grow থেকে যোগাযোগ করছি। আপনার সন্তান (${booking.studentAge})-এর "${booking.trackInterest}" ফ্রি ট্রায়াল ক্লাসের বিষয়ে কথা বলতে চাচ্ছিলাম। আপনি কি কথা বলার সুবিধাজনক সময়ে আছেন?`
                        : `Hello ${booking.parentName}, contacting you from Learn & Grow regarding the free trial class for your child (${booking.studentAge}) in "${booking.trackInterest}". Are you available for a quick chat?`
                    );
                    const waGeneralUrl = `https://wa.me/${waPhone}?text=${waGeneralMessage}`;

                    // Pre-filled WhatsApp schedule confirmation to Parent
                    const waParentScheduleMsg = encodeURIComponent(
                      isBn
                        ? `আসসালামু আলাইকুম ${booking.parentName}, Learn & Grow-তে আপনার ফ্রি ট্রায়াল ক্লাস নিশ্চিত হয়েছে!\n\nবিষয়: ${booking.trackInterest}\nশিক্ষার্থী বয়স: ${booking.studentAge}\nক্লাসের তারিখ: ${booking.scheduledDate}\nসময়: ${booking.scheduledTime || "07:00 PM"}\nশিক্ষক/মেন্টর: ${insName || "Learn & Grow Expert"}\nক্লাস মিটিং লিংক: ${booking.meetingLink || "শীঘ্রই পাঠানো হবে"}\n\nক্লাস শুরুর ১০ মিনিট পূর্বে জয়েন করার অনুরোধ রইল। কোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে পারেন। ধন্যবাদ!`
                        : `Hello ${booking.parentName}, your free trial booking at Learn & Grow is confirmed!\n\nTrack: ${booking.trackInterest}\nStudent Age: ${booking.studentAge}\nDate: ${booking.scheduledDate}\nTime: ${booking.scheduledTime || "07:00 PM"}\nMentor: ${insName || "Learn & Grow Expert"}\nMeeting Link: ${booking.meetingLink || "Will be shared shortly"}\n\nPlease join 10 minutes prior to class time. Thank you!`
                    );
                    const waParentScheduleUrl = `https://wa.me/${waPhone}?text=${waParentScheduleMsg}`;

                    // Pre-filled WhatsApp notification to Instructor
                    const waInsPhoneClean = cleanPhoneForWhatsApp(insPhone);
                    const waInstructorScheduleMsg = encodeURIComponent(
                      isBn
                        ? `নোটিফিকেশন: নতুন ফ্রি ট্রায়াল ক্লাস বরাদ্দ!\n\nহ্যালো ${insName},\nআপনার একটি নতুন ফ্রি ট্রায়াল সেশন শিডিউল করা হয়েছে:\n\nবিষয়: ${booking.trackInterest}\nঅভিভাবক: ${booking.parentName} (${booking.parentPhone})\nশিক্ষার্থী বয়স: ${booking.studentAge}\nতারিখ: ${booking.scheduledDate}\nসময়: ${booking.scheduledTime || "07:00 PM"}\nক্লাস লিংক: ${booking.meetingLink || "N/A"}\n\nঅনুগ্রহ করে ক্লাসের প্রস্তুতি নিন। ধন্যবাদ!`
                        : `Notification: New Free Trial Class Assigned!\n\nHello ${insName},\nYou have been scheduled for a free trial class:\n\nTrack: ${booking.trackInterest}\nParent: ${booking.parentName} (${booking.parentPhone})\nAge: ${booking.studentAge}\nDate: ${booking.scheduledDate}\nTime: ${booking.scheduledTime || "07:00 PM"}\nLink: ${booking.meetingLink || "N/A"}\n\nPlease prepare accordingly. Thank you!`
                    );
                    const waInstructorScheduleUrl = waInsPhoneClean
                      ? `https://wa.me/${waInsPhoneClean}?text=${waInstructorScheduleMsg}`
                      : "";

                    return (
                      <tr key={booking._id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Parent & Child */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">{booking.parentName}</div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                            <span className="text-purple-600 font-bold">{isBn ? "বয়স/শ্রেণি:" : "Age:"}</span>
                            <span>{booking.studentAge || "10 years"}</span>
                          </div>
                          {booking.notes && (
                            <div className="mt-1.5 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1 max-w-xs">
                              <FaStickyNote className="text-amber-500 flex-shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{booking.notes}</span>
                            </div>
                          )}
                        </td>

                        {/* Contact details */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <a
                              href={`tel:${booking.parentPhone}`}
                              className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <FaPhoneAlt className="text-[10px]" />
                              <span>{booking.parentPhone}</span>
                            </a>

                            <Button
                              as="a"
                              href={waGeneralUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              className="h-6 px-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg shadow-2xs"
                              startContent={<FaWhatsapp className="text-xs" />}
                            >
                              WhatsApp
                            </Button>
                          </div>

                          <div className="text-slate-400 text-[11px] truncate max-w-[200px]">
                            <a href={`mailto:${booking.parentEmail}`} className="hover:underline flex items-center gap-1 text-slate-500">
                              <FaEnvelope className="text-[10px]" />
                              <span>{booking.parentEmail}</span>
                            </a>
                          </div>
                        </td>

                        {/* Track / Interest & Schedule */}
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200">
                            <FaRobot className="text-xs text-blue-600" />
                            <span>{booking.trackInterest}</span>
                          </div>

                          {/* Scheduled Instructor & Class info */}
                          {isScheduled ? (
                            <div className="mt-2 p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-1 text-[11px] max-w-xs shadow-2xs">
                              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                                <FaChalkboardTeacher className="text-emerald-600" />
                                <span>{isBn ? "শিক্ষক:" : "Mentor:"} {insName || "Assigned"}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                                <FaCalendarAlt className="text-emerald-500 text-[10px]" />
                                <span>{booking.scheduledDate}</span>
                                {booking.scheduledTime && (
                                  <span className="text-emerald-700 font-bold">({booking.scheduledTime})</span>
                                )}
                              </div>
                              {booking.meetingLink && (
                                <div className="pt-0.5 flex items-center gap-2">
                                  <a
                                    href={booking.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:underline font-bold text-[10px]"
                                  >
                                    <FaVideo className="text-[10px]" />
                                    <span>{isBn ? "ক্লাস লিংক" : "Class Link"}</span>
                                    <FaExternalLinkAlt className="text-[8px]" />
                                  </a>
                                </div>
                              )}
                              {(booking.assignedBatchName || booking.assignedBatchId?.batchName) && (
                                <div className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                                  <FaUsers className="text-purple-500 text-[10px]" />
                                  <span>{booking.assignedBatchName || booking.assignedBatchId?.batchName}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="mt-1 text-[11px] text-amber-600 font-semibold flex items-center gap-1.5">
                              <FaClock className="text-amber-500 text-[10px]" />
                              <span>{isBn ? "শিডিউল ও শিক্ষক প্রয়োজন" : "Schedule & mentor needed"}</span>
                            </div>
                          )}
                        </td>

                        {/* Status dropdown */}
                        <td className="py-3.5 px-4">
                          <Select
                            selectedKeys={[booking.status || "pending"]}
                            onSelectionChange={(keys) => {
                              const newStat = Array.from(keys)[0] as string;
                              if (newStat && newStat !== booking.status) {
                                handleStatusChange(booking._id, newStat);
                              }
                            }}
                            size="sm"
                            variant="bordered"
                            className="w-36"
                            classNames={{
                              trigger: "h-8 min-h-8 text-xs font-bold",
                            }}
                            aria-label="Change Status"
                          >
                            <SelectItem key="pending">Pending</SelectItem>
                            <SelectItem key="contacted">Contacted</SelectItem>
                            <SelectItem key="scheduled">Scheduled</SelectItem>
                            <SelectItem key="completed">Completed</SelectItem>
                            <SelectItem key="cancelled">Cancelled</SelectItem>
                          </Select>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 font-medium">
                          <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Primary Button: Schedule & Assign Instructor */}
                            <Button
                              size="sm"
                              className={`h-8 px-2.5 font-bold text-xs rounded-xl shadow-2xs ${
                                isScheduled
                                  ? "bg-slate-800 text-white hover:bg-slate-900"
                                  : "bg-purple-600 text-white hover:bg-purple-700 animate-pulse"
                              }`}
                              onPress={() => handleOpenScheduleModal(booking)}
                              startContent={<FaCalendarCheck className="text-xs" />}
                            >
                              {isScheduled
                                ? isBn ? "শিডিউল পরিবর্তন" : "Edit Schedule"
                                : isBn ? "শিডিউল ও শিক্ষক" : "Schedule Trial"}
                            </Button>

                            {/* WhatsApp share schedule to parent */}
                            {isScheduled && (
                              <Tooltip content={isBn ? "অভিভাবককে শিডিউল লিংক পাঠান" : "WhatsApp Schedule to Parent"}>
                                <Button
                                  as="a"
                                  href={waParentScheduleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  isIconOnly
                                  size="sm"
                                  className="w-8 h-8 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                                >
                                  <FaWhatsapp className="text-sm" />
                                </Button>
                              </Tooltip>
                            )}

                            {/* WhatsApp notify assigned instructor */}
                            {isScheduled && waInstructorScheduleUrl && (
                              <Tooltip content={isBn ? "শিক্ষককে নোটিফাই করুন" : "Notify Instructor via WhatsApp"}>
                                <Button
                                  as="a"
                                  href={waInstructorScheduleUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  isIconOnly
                                  size="sm"
                                  className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                >
                                  <FaUserCheck className="text-xs" />
                                </Button>
                              </Tooltip>
                            )}

                            {/* Notes Button */}
                            <Tooltip content={isBn ? "নোট যোগ/সম্পাদনা করুন" : "Add/Edit Note"}>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="warning"
                                className="w-8 h-8 rounded-lg"
                                onPress={() => {
                                  setSelectedBookingForNotes(booking);
                                  setNoteText(booking.notes || "");
                                  onOpenNoteModal();
                                }}
                              >
                                <FaStickyNote className="text-xs" />
                              </Button>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip content={isBn ? "মুছে ফেলুন" : "Delete"}>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="danger"
                                className="w-8 h-8 rounded-lg"
                                onPress={() => {
                                  setDeleteConfirmBooking(booking);
                                  onOpenDeleteModal();
                                }}
                              >
                                <FaTrash className="text-xs" />
                              </Button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* SCHEDULE TRIAL & ASSIGN INSTRUCTOR MODAL */}
      <Modal isOpen={isScheduleModalOpen} onClose={onCloseScheduleModal} size="2xl">
        <ModalContent>
          <ModalHeader className="font-black text-lg flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <FaCalendarCheck size={18} />
            </div>
            <div>
              <h3>{isBn ? "ফ্রি ট্রায়াল ক্লাস শিডিউল ও শিক্ষক বরাদ্দ" : "Schedule Trial Class & Assign Mentor"}</h3>
              <p className="text-xs font-normal text-slate-400 mt-0.5">
                {isBn
                  ? "তারিখ, সময় ও জুম/মিট লিংক সেট করুন এবং অভিজ্ঞ মেন্টরকে এই সেশনের জন্য দায়িত্ব দিন।"
                  : "Set date, time, meeting link, and assign an instructor for this session."}
              </p>
            </div>
          </ModalHeader>
          <ModalBody className="space-y-4 py-4">
            {selectedBookingForSchedule && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-black text-slate-800 text-sm">
                    {selectedBookingForSchedule.parentName}
                  </div>
                  <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{selectedBookingForSchedule.parentPhone}</span>
                    <span>•</span>
                    <span>{isBn ? "শিক্ষার্থী বয়স:" : "Student Age:"} {selectedBookingForSchedule.studentAge}</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-700 font-bold">
                  <FaRobot className="text-xs" />
                  <span>{selectedBookingForSchedule.trackInterest}</span>
                </div>
              </div>
            )}

            {/* Select Course / Program */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {isBn ? "কোর্স / প্রোগ্রাম নির্বাচন করুন *" : "Select Course / Program *"}
                </label>
                <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                  {courses.length} {isBn ? "টি কোর্স উপলব্ধ" : "courses available"}
                </span>
              </div>
              <select
                value={scheduleForm.courseId}
                onChange={(e) => {
                  const cId = e.target.value;
                  const foundCourse = courses.find((c: any) => c._id === cId);
                  const courseInstructorId =
                    foundCourse?.instructorId?._id ||
                    foundCourse?.instructorId ||
                    (Array.isArray(foundCourse?.instructorIds) && foundCourse.instructorIds[0]?._id) ||
                    (Array.isArray(foundCourse?.instructorIds) && foundCourse.instructorIds[0]) ||
                    "";
                  setScheduleForm((prev) => ({
                    ...prev,
                    courseId: cId,
                    trackInterest: foundCourse?.title || prev.trackInterest,
                    assignedBatchId: "",
                    assignedInstructorId: courseInstructorId ? courseInstructorId.toString() : prev.assignedInstructorId,
                  }));
                }}
                aria-label="Select Course"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              >
                <option value="">{isBn ? "-- কোর্স নির্বাচন করুন --" : "-- Select a Course --"}</option>
                {courses.map((c: any) => (
                  <option key={c._id} value={c._id}>
                    {c.title} ({c.level || "Beginner"}) • {c.duration || 8} Weeks • ৳{c.discountPrice || c.price || 4500}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Instructor */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "শিক্ষক / মেন্টর বরাদ্দ করুন *" : "Assign Teacher / Mentor *"}
                </label>
                <select
                  value={scheduleForm.assignedInstructorId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, assignedInstructorId: e.target.value })}
                  aria-label="Select Instructor"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">{isBn ? "-- শিক্ষক নির্বাচন করুন --" : "-- Select an Instructor --"}</option>
                  {instructors.map((ins: any) => (
                    <option key={ins._id} value={ins._id}>
                      {ins.name} ({ins.email}) {ins.phone ? `• ${ins.phone}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Date */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "ক্লাসের তারিখ *" : "Class Date *"}
                </label>
                <input
                  type="date"
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Class Time */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "ক্লাসের সময় *" : "Class Time *"}
                </label>
                <Input
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                  placeholder="e.g. 07:00 PM - 08:00 PM"
                  size="sm"
                  variant="bordered"
                />
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  {["05:00 PM - 06:00 PM", "07:00 PM - 08:00 PM", "08:30 PM - 09:30 PM"].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setScheduleForm({ ...scheduleForm, scheduledTime: slot })}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-purple-100 text-[10px] font-semibold text-slate-600 hover:text-purple-700 transition-colors"
                    >
                      {slot.split(" - ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    {isBn ? "গুগল মিট / জুম লিংক" : "Google Meet / Zoom Link"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setScheduleForm({ ...scheduleForm, meetingLink: "https://meet.google.com/new" })}
                    className="text-[10px] text-blue-600 font-bold hover:underline"
                  >
                    + Google Meet
                  </button>
                </div>
                <Input
                  value={scheduleForm.meetingLink}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                  placeholder="https://meet.google.com/... or https://zoom.us/..."
                  size="sm"
                  variant="bordered"
                />
              </div>
            </div>

            {/* Optional Cohort / Batch Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {isBn ? "কোর্স ব্যাচ / কোহোর্ট সংযুক্ত করুন (ঐচ্ছিক)" : "Link to Course Batch / Cohort (Optional)"}
                </label>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  {selectedCourseBatches.length > 0
                    ? (isBn ? `এই কোর্সে ${selectedCourseBatches.length}টি ব্যাচ (${batches.length}টি মোট)` : `${selectedCourseBatches.length} batches for this course (${batches.length} total)`)
                    : (isBn ? `${batches.length}টি ব্যাচ সক্রিয়` : `${batches.length} batches available`)}
                </span>
              </div>
              <select
                value={scheduleForm.assignedBatchId}
                onChange={(e) => {
                  const batchId = e.target.value;
                  const foundBatch = batches.find((b: any) => b._id === batchId);
                  setScheduleForm((prev) => {
                    const nextState = { ...prev, assignedBatchId: batchId };
                    if (foundBatch) {
                      const bCourseId = foundBatch.courseId?._id || foundBatch.courseId;
                      if (bCourseId && (!prev.courseId || prev.courseId !== bCourseId.toString())) {
                        nextState.courseId = bCourseId.toString();
                        nextState.trackInterest = foundBatch.courseId?.title || prev.trackInterest;
                      }
                      const bInstructorId = foundBatch.instructorId?._id || foundBatch.instructorId;
                      if (bInstructorId) {
                        nextState.assignedInstructorId = bInstructorId.toString();
                      }
                      if (foundBatch.zoomLink) {
                        nextState.meetingLink = foundBatch.zoomLink;
                      }
                      if (foundBatch.schedule) {
                        nextState.scheduledTime = foundBatch.schedule;
                      }
                    }
                    return nextState;
                  });
                }}
                aria-label="Link to Course Batch"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
              >
                <option value="">{isBn ? "-- কোনো নির্দিষ্ট ব্যাচ নয় / একক ট্রায়াল --" : "-- Standalone Trial (No Batch) --"}</option>
                {selectedCourseBatches.length > 0 && (
                  <optgroup label={isBn ? `নির্বাচিত কোর্সের সক্রিয় ব্যাচসমূহ (${selectedCourseBatches.length})` : `Batches for Selected Course (${selectedCourseBatches.length})`}>
                    {selectedCourseBatches.map((b: any) => (
                      <option key={b._id} value={b._id}>
                        {b.batchName} ({b.schedule || "Regular"}) • {b.enrolledStudents?.length || 0}/{b.maxStudents || 15} Students {b.instructorId?.name ? `• Mentor: ${b.instructorId.name}` : ""}
                      </option>
                    ))}
                  </optgroup>
                )}
                {otherBatches.length > 0 && (
                  <optgroup label={isBn ? `অন্যান্য সকল কোর্সের ব্যাচসমূহ (${otherBatches.length})` : `All Other Course Batches (${otherBatches.length})`}>
                    {otherBatches.map((b: any) => (
                      <option key={b._id} value={b._id}>
                        {b.courseId?.title ? `${b.courseId.title} - ` : ""}{b.batchName} ({b.schedule || "Regular"}) • {b.enrolledStudents?.length || 0}/{b.maxStudents || 15} Students {b.instructorId?.name ? `• Mentor: ${b.instructorId.name}` : ""}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1 block">
                {isBn ? "অভ্যন্তরীণ নোট / নির্দেশনা" : "Internal Notes / Mentor Briefing"}
              </label>
              <Textarea
                placeholder={isBn ? "যেমন: শিক্ষার্থী রোবোটিক্সে বেশ আগ্রহী, বেসিক সার্কিট বুঝিয়ে দিতে হবে..." : "e.g., Student is eager to learn robotics basics..."}
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                minRows={2}
                variant="bordered"
                size="sm"
              />
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-slate-100 pt-3">
            <Button variant="light" size="sm" onPress={onCloseScheduleModal}>
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs"
              size="sm"
              onPress={handleSaveSchedule}
              isLoading={isUpdating}
            >
              {isBn ? "শিডিউল ও শিক্ষক সংরক্ষণ করুন" : "Save Schedule & Assign"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Note Modal */}
      <Modal isOpen={isNoteModalOpen} onClose={onCloseNoteModal} size="md">
        <ModalContent>
          <ModalHeader className="font-black text-base flex items-center gap-2">
            <FaStickyNote className="text-amber-500" />
            <span>{isBn ? "ফলো-আপ নোট সংরক্ষণ" : "Lead Follow-up Note"}</span>
          </ModalHeader>
          <ModalBody className="space-y-3">
            {selectedBookingForNotes && (
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <div><span className="font-bold">{isBn ? "অভিভাবক:" : "Parent:"}</span> {selectedBookingForNotes.parentName} ({selectedBookingForNotes.parentPhone})</div>
                <div><span className="font-bold">{isBn ? "প্রোগ্রাম:" : "Track:"}</span> {selectedBookingForNotes.trackInterest}</div>
              </div>
            )}
            <Textarea
              label={isBn ? "অ্যাডমিন বা কলিং নোট" : "Internal Call / Follow-up Notes"}
              placeholder={isBn ? "যেমন: শুক্রবার বিকেল ৫টায় ফ্রি জুম ক্লাসের লিংক পাঠাতে বলা হয়েছে..." : "e.g., Parent requested Friday 5 PM Zoom session..."}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              minRows={4}
              variant="bordered"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" size="sm" onPress={onCloseNoteModal}>
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button color="primary" size="sm" onPress={handleSaveNote} isLoading={isUpdating} className="font-bold">
              {isBn ? "নোট সংরক্ষণ করুন" : "Save Note"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal} size="sm">
        <ModalContent>
          <ModalHeader className="font-black text-base text-rose-600">
            {isBn ? "বুকিং মুছে ফেলতে চান?" : "Delete Trial Booking?"}
          </ModalHeader>
          <ModalBody className="text-xs text-slate-600">
            {isBn
              ? `আপনি কি নিশ্চিতভাবে "${deleteConfirmBooking?.parentName}" এর ফ্রি ট্রায়াল বুকিং রেকর্ডটি মুছে ফেলতে চান? এটি পুনরায় ফিরিয়ে আনা সম্ভব নয়।`
              : `Are you sure you want to permanently delete the trial booking for "${deleteConfirmBooking?.parentName}"?`}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" size="sm" onPress={onCloseDeleteModal}>
              {isBn ? "না" : "Cancel"}
            </Button>
            <Button color="danger" size="sm" onPress={handleDeleteBooking} isLoading={isDeleting} className="font-bold">
              {isBn ? "হ্যাঁ, মুছে ফেলুন" : "Confirm Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
