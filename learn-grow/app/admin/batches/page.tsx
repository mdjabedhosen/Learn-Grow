"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
  Progress,
  Avatar,
  Spinner,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Video,
  Phone,
  Mail,
  Trash2,
  Edit3,
  UserCheck,
  GraduationCap,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  BookOpen,
  UserPlus,
  CheckCircle2,
  ArrowRightLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

import {
  useGetAllBatchesAdminQuery,
  useCreateBatchAdminMutation,
  useUpdateBatchAdminMutation,
  useAssignStudentAdminMutation,
  useRemoveStudentAdminMutation,
  useDeleteBatchAdminMutation,
  useSyncBatchesAdminMutation,
} from "@/redux/api/batchApi";
import { useGetAllCoursesQuery, useGetPublishedCoursesQuery } from "@/redux/api/courseApi";
import {
  useGetApprovedInstructorsPublicQuery,
  useGetAllInstructorsQuery,
  useGetUsersAdminQuery,
} from "@/redux/api/userApi";
import RequireAuth from "@/components/Auth/RequireAuth";

export default function AdminBatchesPage() {
  return (
    <RequireAuth allowedRoles={["admin", "manager"]}>
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        }
      >
        <BatchesContent />
      </React.Suspense>
    </RequireAuth>
  );
}

function BatchesContent() {
  const searchParams = useSearchParams();
  const urlCourseId = searchParams.get("courseId");

  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>(urlCourseId || "all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  useEffect(() => {
    if (urlCourseId) {
      setSelectedCourseFilter(urlCourseId);
    }
  }, [urlCourseId]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferData, setTransferData] = useState<{ student: any; currentBatch: any; targetBatchId: string } | null>(null);
  const [activeBatch, setActiveBatch] = useState<any>(null);

  // Forms state
  const [formData, setFormData] = useState({
    courseId: "",
    batchName: "",
    instructorId: "",
    maxStudents: 15,
    schedule: "Sat & Tue 7:00 PM - 8:00 PM",
    zoomLink: "",
    whatsappGroupUrl: "",
    status: "ongoing",
    notes: "",
  });

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Bilingual listener
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

  // API Queries
  const {
    data: batchesData,
    isLoading: isBatchesLoading,
    refetch: refetchBatches,
  } = useGetAllBatchesAdminQuery({
    courseId: selectedCourseFilter !== "all" ? selectedCourseFilter : undefined,
    status: selectedStatusFilter !== "all" ? selectedStatusFilter : undefined,
    search: searchQuery || undefined,
  });

  const { data: coursesData } = useGetAllCoursesQuery({ limit: 100 });
  const { data: publishedCoursesData } = useGetPublishedCoursesQuery({ limit: 100 });
  const { data: allInstructorsData } = useGetAllInstructorsQuery({ limit: 100 });
  const { data: approvedInstructorsData } = useGetApprovedInstructorsPublicQuery();
  const { data: adminInstructorsData } = useGetUsersAdminQuery({ role: "instructor", limit: 100 });
  const { data: adminAdminsData } = useGetUsersAdminQuery({ role: "admin", limit: 50 });
  const { data: usersData } = useGetUsersAdminQuery({ role: "student", limit: 100 });

  // Mutations
  const [createBatch, { isLoading: isCreating }] = useCreateBatchAdminMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchAdminMutation();
  const [assignStudent, { isLoading: isAssigning }] = useAssignStudentAdminMutation();
  const [removeStudent] = useRemoveStudentAdminMutation();
  const [deleteBatch] = useDeleteBatchAdminMutation();
  const [syncBatches, { isLoading: isSyncing }] = useSyncBatchesAdminMutation();

  const batches = batchesData?.data || [];

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
          title: c.title || c.name || "Untitled Course",
        });
      }
    });

    // Also include any course populated from existing batches
    batches.forEach((b: any) => {
      if (b?.courseId && typeof b.courseId === "object" && (b.courseId._id || b.courseId.id)) {
        const id = (b.courseId._id || b.courseId.id).toString();
        if (!map.has(id)) {
          map.set(id, {
            ...b.courseId,
            _id: id,
            title: b.courseId.title || b.courseId.name || "Course",
          });
        }
      }
    });

    return Array.from(map.values());
  }, [coursesData, publishedCoursesData, batches]);

  const instructors = useMemo(() => {
    const listA = allInstructorsData?.data || [];
    const listB = approvedInstructorsData?.data || [];
    const listC = adminInstructorsData?.data?.users || adminInstructorsData?.data || [];
    const listD = adminAdminsData?.data?.users || adminAdminsData?.data || [];
    const map = new Map();

    [...listA, ...listB, ...listC, ...listD].forEach((ins: any) => {
      if (ins && ins._id) {
        map.set(ins._id.toString(), {
          ...ins,
          _id: ins._id.toString(),
        });
      }
    });

    return Array.from(map.values());
  }, [allInstructorsData, approvedInstructorsData, adminInstructorsData, adminAdminsData]);

  const students = usersData?.data?.users || usersData?.data || [];

  // Metrics
  const metrics = useMemo(() => {
    const totalBatches = batches.length;
    const totalStudentsEnrolled = batches.reduce(
      (sum: number, b: any) => sum + (b.enrolledStudents?.length || 0),
      0
    );
    const uniqueInstructors = new Set(
      batches.map((b: any) => b.instructorId?._id || b.instructorId).filter(Boolean)
    ).size;
    const fullBatches = batches.filter(
      (b: any) => (b.enrolledStudents?.length || 0) >= (b.maxStudents || 15)
    ).length;

    return { totalBatches, totalStudentsEnrolled, uniqueInstructors, fullBatches };
  }, [batches]);

  // Handlers
  const handleOpenCreate = () => {
    const defaultCourseId =
      (selectedCourseFilter !== "all" && selectedCourseFilter) ||
      urlCourseId ||
      courses[0]?._id ||
      "";

    setFormData({
      courseId: defaultCourseId,
      batchName: `Batch ${(batches.length || 0) + 1}`,
      instructorId: instructors[0]?._id || "",
      maxStudents: 15,
      schedule: "Sat & Tue 7:00 PM - 8:00 PM",
      zoomLink: "",
      whatsappGroupUrl: "",
      status: "ongoing",
      notes: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async () => {
    if (!formData.courseId) return toast.error(isBn ? "কোর্স নির্বাচন করুন" : "Select a course");
    if (!formData.instructorId) return toast.error(isBn ? "শিক্ষক নির্বাচন করুন" : "Select an instructor");

    try {
      await createBatch(formData).unwrap();
      toast.success(isBn ? "নতুন ব্যাচ তৈরি হয়েছে!" : "Batch created successfully!");
      setIsCreateModalOpen(false);
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || (isBn ? "ব্যাচ তৈরি ব্যর্থ হয়েছে" : "Failed to create batch"));
    }
  };

  const handleOpenEdit = (batch: any) => {
    setActiveBatch(batch);
    setFormData({
      courseId: batch.courseId?._id || batch.courseId || "",
      batchName: batch.batchName || "",
      instructorId: batch.instructorId?._id || batch.instructorId || "",
      maxStudents: batch.maxStudents || 15,
      schedule: batch.schedule || "Sat & Tue 7:00 PM - 8:00 PM",
      zoomLink: batch.zoomLink || "",
      whatsappGroupUrl: batch.whatsappGroupUrl || "",
      status: batch.status || "ongoing",
      notes: batch.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!activeBatch) return;
    try {
      await updateBatch({ id: activeBatch._id, ...formData }).unwrap();
      toast.success(isBn ? "ব্যাচের তথ্য আপডেট হয়েছে!" : "Batch updated successfully!");
      setIsEditModalOpen(false);
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || (isBn ? "আপডেট ব্যর্থ হয়েছে" : "Failed to update"));
    }
  };

  const handleOpenAddStudent = (batch: any) => {
    setActiveBatch(batch);
    setSelectedStudentId("");
    setStudentSearch("");
    setIsAddStudentModalOpen(true);
  };

  const handleAddStudentSubmit = async () => {
    if (!activeBatch || !selectedStudentId) {
      return toast.error(isBn ? "শিক্ষার্থী নির্বাচন করুন" : "Please select a student");
    }

    try {
      await assignStudent({ id: activeBatch._id, studentId: selectedStudentId }).unwrap();
      toast.success(isBn ? "শিক্ষার্থীকে ব্যাচে যুক্ত করা হয়েছে!" : "Student assigned to batch!");
      setIsAddStudentModalOpen(false);
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || (isBn ? "শিক্ষার্থী যুক্ত করা ব্যর্থ হয়েছে" : "Failed to assign student"));
    }
  };

  const handleRemoveStudent = async (batchId: string, studentId: string, studentName: string) => {
    if (!confirm(isBn ? `আপনি কি ${studentName}-কে এই ব্যাচ থেকে সরাতে চান?` : `Remove ${studentName} from this batch?`)) {
      return;
    }

    try {
      await removeStudent({ id: batchId, studentId }).unwrap();
      toast.success(isBn ? "শিক্ষার্থী সরানো হয়েছে" : "Student removed");
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove student");
    }
  };

  const handleOpenTransfer = (student: any, currentBatch: any) => {
    const targetBatches = batches.filter(
      (b: any) =>
        (b.courseId?._id === currentBatch.courseId?._id || b.courseId === currentBatch.courseId?._id) &&
        b._id !== currentBatch._id
    );

    if (targetBatches.length === 0) {
      return toast.error(
        isBn
          ? "এই কোর্সের অন্য কোনো ব্যাচ বিদ্যমান নেই। আগে একটি নতুন ব্যাচ তৈরি করুন।"
          : "No other batches found for this course. Please create another batch first."
      );
    }

    setTransferData({
      student,
      currentBatch,
      targetBatchId: targetBatches[0]._id,
    });
    setIsTransferModalOpen(true);
  };

  const handleTransferSubmit = async () => {
    if (!transferData || !transferData.targetBatchId) {
      return toast.error(isBn ? "স্থানান্তরের জন্য লক্ষ্য ব্যাচ নির্বাচন করুন" : "Please select target batch");
    }

    try {
      await assignStudent({
        id: transferData.targetBatchId,
        studentId: transferData.student._id,
      }).unwrap();
      toast.success(
        isBn
          ? `${transferData.student.name}-কে নতুন ব্যাচে সফলভাবে স্থানান্তর করা হয়েছে!`
          : `Student transferred to new batch successfully!`
      );
      setIsTransferModalOpen(false);
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || (isBn ? "স্থানান্তর ব্যর্থ হয়েছে" : "Transfer failed"));
    }
  };

  const handleDeleteBatch = async (batchId: string, batchName: string) => {
    if (!confirm(isBn ? `আপনি কি ${batchName} মুছে ফেলতে চান?` : `Are you sure you want to delete ${batchName}?`)) {
      return;
    }

    try {
      await deleteBatch(batchId).unwrap();
      toast.success(isBn ? "ব্যাচ মুছে ফেলা হয়েছে" : "Batch deleted");
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete batch");
    }
  };

  const handleSyncBatches = async () => {
    try {
      await syncBatches().unwrap();
      toast.success(
        isBn
          ? "সকল শিক্ষার্থীর এনরোলমেন্ট ১৫ জন করে ব্যাচে সফলভাবে সিঙ্ক হয়েছে!"
          : "All student enrollments synced to 15-student batches successfully!"
      );
      refetchBatches();
    } catch (err: any) {
      toast.error(err?.data?.message || (isBn ? "সিঙ্ক করতে ব্যর্থ হয়েছে" : "Failed to sync enrollments"));
    }
  };

  // Filtered students for add-modal
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students.slice(0, 15);
    const s = studentSearch.toLowerCase();
    return students.filter(
      (st: any) =>
        (st.name || "").toLowerCase().includes(s) || (st.email || "").toLowerCase().includes(s)
    );
  }, [students, studentSearch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Top Header Hero */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#2563EB] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
                {isBn ? "কোর্স ব্যাচ ও কোহোর্ট ম্যানেজমেন্ট" : "Course Batches & Cohort Control"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {isBn ? "ব্যাচ ও শিক্ষক বরাদ্দ ব্যবস্থাপনা" : "Batch & Multi-Teacher Allocation"}
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                {isBn
                  ? "একই কোর্সে একাধিক শিক্ষক বরাদ্দ করুন, প্রতি ১৫ জন শিক্ষার্থীর স্বয়ংক্রিয় ব্যাচ বণ্টন ট্র্যাক করুন এবং শিক্ষক-শিক্ষার্থী রিশিডিউল করুন।"
                  : "Assign multiple teachers per course, track automatic 15-student batch limits, and reassign mentors and students seamlessly."}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Button
                variant="flat"
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/30 font-bold"
                startContent={<RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />}
                onPress={handleSyncBatches}
                isLoading={isSyncing}
              >
                {isBn ? "১৫ জন ব্যাচে অটো-সিঙ্ক" : "Sync 15-Batch Cohorts"}
              </Button>
              <Button
                variant="flat"
                className="bg-white/10 hover:bg-white/20 text-white font-bold"
                startContent={<RefreshCw className="w-4 h-4" />}
                onPress={() => refetchBatches()}
              >
                {isBn ? "রিফ্রেশ" : "Refresh"}
              </Button>
              <Button
                className="bg-[#F59E0B] hover:bg-amber-500 text-slate-900 font-black shadow-lg hover:shadow-xl"
                startContent={<Plus className="w-5 h-5" />}
                onPress={handleOpenCreate}
              >
                {isBn ? "নতুন ব্যাচ তৈরি করুন" : "Create New Batch"}
              </Button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isBn ? "মোট সক্রিয় ব্যাচ" : "Total Active Batches"}
              </p>
              <p className="text-3xl font-black text-white mt-1">{metrics.totalBatches}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isBn ? "ব্যাচে মোট শিক্ষার্থী" : "Enrolled Students"}
              </p>
              <p className="text-3xl font-black text-amber-400 mt-1">{metrics.totalStudentsEnrolled}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isBn ? "ব্যাচ পরিচালনাকারী মেন্টর" : "Active Mentors"}
              </p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{metrics.uniqueInstructors}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {isBn ? "পূর্ণাঙ্গ ব্যাচ (১৫/১৫)" : "Full Batches (15/15)"}
              </p>
              <p className="text-3xl font-black text-blue-300 mt-1">{metrics.fullBatches}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder={
                isBn
                  ? "ব্যাচের নাম, কোর্স, শিক্ষক বা শিক্ষার্থীর নাম দিয়ে খুঁজুন..."
                  : "Search batch, course, instructor, or student..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              aria-label="Filter by Course"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isBn ? "সকল কোর্স" : "All Courses"}</option>
              {courses.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              aria-label="Filter by Status"
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isBn ? "সকল স্ট্যাটাস" : "All Status"}</option>
              <option value="ongoing">{isBn ? "চলমান (Ongoing)" : "Ongoing"}</option>
              <option value="upcoming">{isBn ? "আসন্ন (Upcoming)" : "Upcoming"}</option>
              <option value="completed">{isBn ? "সম্পন্ন (Completed)" : "Completed"}</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {isBatchesLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size="lg" color="primary" />
            <p className="text-slate-500 font-medium">
              {isBn ? "ব্যাচ লোড হচ্ছে..." : "Loading batches..."}
            </p>
          </div>
        ) : batches.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">
              {isBn ? "কোনো ব্যাচ পাওয়া যায়নি" : "No Batches Found"}
            </h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              {isBn
                ? "নতুন ব্যাচ তৈরি করুন অথবা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।"
                : "Create a new batch or adjust filters to view batches."}
            </p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              onPress={handleOpenCreate}
            >
              {isBn ? "নতুন ব্যাচ তৈরি করুন" : "Create New Batch"}
            </Button>
          </div>
        ) : (
          /* Batches Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {batches.map((batch: any) => {
              const enrolledCount = batch.enrolledStudents?.length || 0;
              const maxCount = batch.maxStudents || 15;
              const fillPercentage = Math.min(100, Math.round((enrolledCount / maxCount) * 100));
              const isFull = enrolledCount >= maxCount;
              const isExpanded = expandedBatchId === batch._id;

              return (
                <Card
                  key={batch._id}
                  className="border border-slate-200 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden bg-white"
                >
                  <CardBody className="p-6">
                    {/* Card Top: Batch Tag, Status, Actions */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-3 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-700 border border-blue-200">
                            {batch.batchName || `Batch ${batch.batchNumber}`}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase ${
                              batch.status === "ongoing"
                                ? "bg-emerald-100 text-emerald-700"
                                : batch.status === "upcoming"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {batch.status}
                          </span>
                          {isFull && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 text-red-700">
                              {isBn ? "পূর্ণাঙ্গ (Full)" : "Full"}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-1">
                          {batch.courseId?.title || (isBn ? "কোর্স শিরোনাম" : "Course Title")}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-slate-600 hover:text-blue-600"
                          onPress={() => handleOpenEdit(batch)}
                          aria-label="Edit Batch"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-slate-600 hover:text-red-600"
                          onPress={() => handleDeleteBatch(batch._id, batch.batchName)}
                          aria-label="Delete Batch"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Teacher Assignment Box */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={batch.instructorId?.profileImage || "/images/tutors/tutor-tanvir.png"}
                          name={batch.instructorId?.name || "Teacher"}
                          className="w-11 h-11 border-2 border-blue-400 shadow-sm flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              {isBn ? "বরাদ্দকৃত শিক্ষক" : "Assigned Mentor"}
                            </p>
                            {batch.instructorId?.qualification?.toLowerCase().includes("ceo") && (
                              <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.2 rounded-full">
                                Founder & CEO
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-black text-slate-900 truncate">
                            {batch.instructorId?.name || (isBn ? "শিক্ষক নির্ধারিত নেই" : "No Teacher Assigned")}
                          </p>
                          <p className="text-xs text-blue-700 font-semibold truncate">
                            {batch.instructorId?.qualification || batch.instructorId?.email || ""}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="bordered"
                        className="text-xs font-bold border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 flex-shrink-0"
                        onPress={() => handleOpenEdit(batch)}
                      >
                        {isBn ? "শিক্ষক পরিবর্তন" : "Change Teacher"}
                      </Button>
                    </div>

                    {/* Capacity Progress Bar (Max 15) */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-600 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          {isBn ? "শিক্ষার্থী ধারণক্ষমতা:" : "Student Capacity:"}{" "}
                          <span className="text-slate-900 font-black">
                            {enrolledCount} / {maxCount}
                          </span>
                        </span>
                        <span
                          className={`font-black ${
                            fillPercentage >= 100
                              ? "text-red-600"
                              : fillPercentage >= 80
                              ? "text-amber-600"
                              : "text-blue-600"
                          }`}
                        >
                          {fillPercentage}% {isBn ? "ভর্তি" : "Filled"}
                        </span>
                      </div>
                      <Progress
                        value={fillPercentage}
                        color={fillPercentage >= 100 ? "danger" : fillPercentage >= 80 ? "warning" : "primary"}
                        className="h-2.5 rounded-full"
                      />
                    </div>

                    {/* Schedule & Live Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50/50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{batch.schedule || "Sat & Tue 7:00 PM - 8:00 PM"}</span>
                      </div>
                      {batch.zoomLink ? (
                        <a
                          href={batch.zoomLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-blue-600 hover:underline truncate"
                        >
                          <Video className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{isBn ? "লাইভ ক্লাস লিঙ্ক" : "Zoom Class Link"}</span>
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5" />
                          {isBn ? "লিঙ্ক দেওয়া হয়নি" : "No live link"}
                        </span>
                      )}
                    </div>

                    {/* Enrolled Students Accordion Toggle */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="light"
                        className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                        onPress={() => setExpandedBatchId(isExpanded ? null : batch._id)}
                      >
                        <span>
                          {isExpanded
                            ? isBn
                              ? "শিক্ষার্থী তালিকা লুকান"
                              : "Hide Students List"
                            : isBn
                            ? `শিক্ষার্থী তালিকা দেখুন (${enrolledCount})`
                            : `View Students List (${enrolledCount})`}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>

                      <Button
                        size="sm"
                        className="bg-blue-50 text-blue-700 font-black hover:bg-blue-100 text-xs flex items-center gap-1"
                        onPress={() => handleOpenAddStudent(batch)}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{isBn ? "শিক্ষার্থী যুক্ত করুন" : "Add Student"}</span>
                      </Button>
                    </div>

                    {/* Expanded Enrolled Students Drawer */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                          {isBn ? "এই ব্যাচে ভর্তিকৃত শিক্ষার্থীগণ:" : "Students Enrolled in this Batch:"}
                        </h4>

                        {enrolledCount === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">
                            {isBn ? "এই ব্যাচে এখনও কোনো শিক্ষার্থী নেই।" : "No students in this batch yet."}
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {batch.enrolledStudents.map((st: any, i: number) => (
                              <div
                                key={st._id || i}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                                    {i + 1}
                                  </span>
                                  <Avatar
                                    src={st.profileImage || ""}
                                    name={st.name || "Student"}
                                    className="w-6 h-6 flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-800 truncate">{st.name}</p>
                                    <p className="text-[11px] text-slate-400 truncate">{st.email}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-slate-400 hover:text-blue-600 h-6 w-6 min-w-6"
                                    onPress={() => handleOpenTransfer(st, batch)}
                                    title={isBn ? "অন্য ব্যাচে স্থানান্তর করুন" : "Transfer to another batch"}
                                  >
                                    <ArrowRightLeft className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-slate-400 hover:text-red-600 h-6 w-6 min-w-6"
                                    onPress={() => handleRemoveStudent(batch._id, st._id, st.name)}
                                    title={isBn ? "ব্যাচ থেকে সরান" : "Remove from batch"}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE BATCH MODAL */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader className="font-black text-xl">
            {isBn ? "নতুন কোর্স ব্যাচ তৈরি করুন" : "Create New Course Batch"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "কোর্স নির্বাচন করুন *" : "Select Course *"}
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  aria-label="Select Course"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{isBn ? "কোর্স নির্বাচন করুন" : "Select a Course"}</option>
                  {courses.map((c: any) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "ব্যাচের নাম *" : "Batch Name *"}
                </label>
                <Input
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  placeholder="e.g. Batch 1"
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "বরাদ্দকৃত শিক্ষক / মেন্টর *" : "Assign Teacher / Mentor *"}
                </label>
                <select
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                  aria-label="Assign Teacher / Mentor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                >
                  <option value="">{isBn ? "শিক্ষক নির্বাচন করুন" : "Select an Instructor"}</option>
                  {instructors.map((ins: any) => (
                    <option key={ins._id} value={ins._id}>
                      {ins.name} ({ins.email})
                    </option>
                  ))}
                </select>
                {(() => {
                  const ins = instructors.find((i: any) => i._id === formData.instructorId);
                  if (!ins) return null;
                  return (
                    <div className="mt-2 p-2 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center gap-2.5">
                      <Avatar
                        src={ins.profileImage || "/images/tutors/tutor-tanvir.png"}
                        name={ins.name}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 leading-tight truncate">
                          {ins.name}
                          {ins.qualification?.toLowerCase().includes("ceo") && (
                            <span className="text-[10px] text-amber-800 font-black ml-1.5 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-full">
                              CEO
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-blue-700 font-semibold truncate">
                          {ins.qualification || ins.email}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "সর্বোচ্চ শিক্ষার্থী ধারণক্ষমতা (ডিফল্ট ১৫)" : "Max Students (Default 15)"}
                </label>
                <Input
                  type="number"
                  value={String(formData.maxStudents)}
                  onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) || 15 })}
                  placeholder="15"
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "ক্লাস শিডিউল" : "Class Schedule"}
                </label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="Sat & Tue 7:00 PM - 8:00 PM"
                  size="sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "স্ট্যাটাস" : "Status"}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  aria-label="Batch Status"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ongoing">{isBn ? "চলমান (Ongoing)" : "Ongoing"}</option>
                  <option value="upcoming">{isBn ? "আসন্ন (Upcoming)" : "Upcoming"}</option>
                  <option value="completed">{isBn ? "সম্পন্ন (Completed)" : "Completed"}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "জুম / মিট লিঙ্ক" : "Zoom / Meet Link"}
                </label>
                <Input
                  value={formData.zoomLink}
                  onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  size="sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "হোয়াটসঅ্যাপ গ্রুপ লিঙ্ক" : "WhatsApp Group Link"}
                </label>
                <Input
                  value={formData.whatsappGroupUrl}
                  onChange={(e) => setFormData({ ...formData, whatsappGroupUrl: e.target.value })}
                  placeholder="https://chat.whatsapp.com/..."
                  size="sm"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsCreateModalOpen(false)}>
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              className="bg-blue-600 text-white font-bold"
              isLoading={isCreating}
              onPress={handleCreateSubmit}
            >
              {isBn ? "ব্যাচ সংরক্ষণ করুন" : "Save Batch"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* EDIT BATCH MODAL */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader className="font-black text-xl">
            {isBn ? "ব্যাচের তথ্য ও শিক্ষক পরিবর্তন করুন" : "Edit Batch & Change Teacher"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "ব্যাচের নাম *" : "Batch Name *"}
                </label>
                <Input
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  placeholder="e.g. Batch 1"
                  size="sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "বরাদ্দকৃত শিক্ষক / মেন্টর *" : "Assigned Teacher / Mentor *"}
                </label>
                <select
                  value={formData.instructorId}
                  onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                  aria-label="Assigned Teacher / Mentor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-800"
                >
                  <option value="">{isBn ? "শিক্ষক নির্বাচন করুন" : "Select an Instructor"}</option>
                  {instructors.map((ins: any) => (
                    <option key={ins._id} value={ins._id}>
                      {ins.name} ({ins.email})
                    </option>
                  ))}
                </select>
                {(() => {
                  const ins = instructors.find((i: any) => i._id === formData.instructorId);
                  if (!ins) return null;
                  return (
                    <div className="mt-2 p-2 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center gap-2.5">
                      <Avatar
                        src={ins.profileImage || "/images/tutors/tutor-tanvir.png"}
                        name={ins.name}
                        className="w-8 h-8 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 leading-tight truncate">
                          {ins.name}
                          {ins.qualification?.toLowerCase().includes("ceo") && (
                            <span className="text-[10px] text-amber-800 font-black ml-1.5 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded-full">
                              CEO
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-blue-700 font-semibold truncate">
                          {ins.qualification || ins.email}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "ক্লাস শিডিউল" : "Class Schedule"}
                </label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="Sat & Tue 7:00 PM - 8:00 PM"
                  size="sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "সর্বোচ্চ শিক্ষার্থী ধারণক্ষমতা" : "Max Capacity"}
                </label>
                <Input
                  type="number"
                  value={String(formData.maxStudents)}
                  onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) || 15 })}
                  placeholder="15"
                  size="sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "জুম / মিট লিঙ্ক" : "Zoom / Meet Link"}
                </label>
                <Input
                  value={formData.zoomLink}
                  onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                  placeholder="https://zoom.us/j/..."
                  size="sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  {isBn ? "স্ট্যাটাস" : "Status"}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  aria-label="Batch Status"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ongoing">{isBn ? "চলমান (Ongoing)" : "Ongoing"}</option>
                  <option value="upcoming">{isBn ? "আসন্ন (Upcoming)" : "Upcoming"}</option>
                  <option value="completed">{isBn ? "সম্পন্ন (Completed)" : "Completed"}</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsEditModalOpen(false)}>
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              className="bg-blue-600 text-white font-bold"
              isLoading={isUpdating}
              onPress={handleEditSubmit}
            >
              {isBn ? "আপডেট সংরক্ষণ করুন" : "Update Batch"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ADD STUDENT TO BATCH MODAL */}
      <Modal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)}>
        <ModalContent>
          <ModalHeader className="font-black text-xl">
            {isBn ? "ব্যাচে শিক্ষার্থী যুক্ত করুন" : "Add Student to Batch"}
          </ModalHeader>
          <ModalBody className="space-y-3">
            <p className="text-xs text-slate-500">
              {isBn
                ? `নির্বাচিত ব্যাচ: ${activeBatch?.batchName} (${activeBatch?.courseId?.title})`
                : `Target Batch: ${activeBatch?.batchName} (${activeBatch?.courseId?.title})`}
            </p>

            <Input
              placeholder={isBn ? "শিক্ষার্থীর নাম বা ইমেইল দিয়ে খুঁজুন..." : "Search student by name or email..."}
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              size="sm"
              startContent={<Search className="w-4 h-4 text-slate-400" />}
            />

            <div className="max-h-60 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2">
              {filteredStudents.map((st: any) => (
                <div
                  key={st._id}
                  onClick={() => setSelectedStudentId(st._id)}
                  className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${
                    selectedStudentId === st._id
                      ? "bg-blue-50 border border-blue-500 text-blue-900"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar src={st.profileImage || ""} name={st.name} className="w-6 h-6 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{st.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{st.email}</p>
                    </div>
                  </div>
                  {selectedStudentId === st._id && <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsAddStudentModalOpen(false)}>
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              className="bg-blue-600 text-white font-bold"
              isLoading={isAssigning}
              onPress={handleAddStudentSubmit}
            >
              {isBn ? "যুক্ত করুন" : "Add to Batch"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* TRANSFER STUDENT MODAL */}
      <Modal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} size="md">
        <ModalContent>
          <ModalHeader className="font-black text-xl">
            {isBn ? "শিক্ষার্থীকে অন্য ব্যাচে স্থানান্তর করুন" : "Transfer Student to Another Batch"}
          </ModalHeader>
          <ModalBody className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-gray-500">{isBn ? "শিক্ষার্থী:" : "Student:"}</p>
              <p className="font-bold text-gray-900">{transferData?.student?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {isBn ? "বর্তমান ব্যাচ:" : "Current Batch:"}{" "}
                <span className="font-bold text-blue-700">{transferData?.currentBatch?.batchName}</span>{" "}
                ({transferData?.currentBatch?.courseId?.title})
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                {isBn ? "লক্ষ্য ব্যাচ নির্বাচন করুন (Target Batch)" : "Select Target Batch"}
              </label>
              <Select
                placeholder={isBn ? "ব্যাচ নির্বাচন করুন" : "Select Target Batch"}
                selectedKeys={transferData?.targetBatchId ? new Set([transferData.targetBatchId]) : new Set([])}
                onSelectionChange={(keys) => {
                  const val = Array.from(keys)[0] as string;
                  setTransferData((prev: any) => ({ ...prev, targetBatchId: val }));
                }}
                variant="bordered"
              >
                {batches
                  .filter(
                    (b: any) =>
                      (b.courseId?._id === transferData?.currentBatch?.courseId?._id ||
                        b.courseId === transferData?.currentBatch?.courseId?._id) &&
                      b._id !== transferData?.currentBatch?._id
                  )
                  .map((b: any) => {
                    const count = b.enrolledStudents?.length || 0;
                    const max = b.maxStudents || 15;
                    return (
                      <SelectItem key={b._id} textValue={`${b.batchName} (${count}/${max})`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs">{b.batchName}</span>
                          <span className="text-xs text-gray-500">
                            {count}/{max} {isBn ? "জন" : "students"} • {b.instructorId?.name || "No mentor"}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
              </Select>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsTransferModalOpen(false)}>
              {isBn ? "বাতিল" : "Cancel"}
            </Button>
            <Button
              color="primary"
              className="font-bold"
              onPress={handleTransferSubmit}
              isLoading={isAssigning}
            >
              {isBn ? "স্থানান্তর সম্পন্ন করুন" : "Complete Transfer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
