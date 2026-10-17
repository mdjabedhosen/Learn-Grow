"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Button,
  Input,
  Skeleton,
  Pagination,
  Progress,
  Tooltip,
} from "@nextui-org/react";
import {
  Users,
  Search,
  BookOpen,
  Clock,
  CheckCircle,
  Video,
  MessageCircle,
  ExternalLink,
  Calendar,
  GraduationCap,
  ChevronRight,
  Filter,
  Phone,
  Mail,
  Award,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useGetInstructorStudentsQuery } from "@/redux/api/userApi";
import { useGetInstructorBatchesQuery } from "@/redux/api/batchApi";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/Auth/RequireAuth";

function InstructorStudentsContent() {
  const router = useRouter();

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

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const limit = 20;

  // Fetch batches for filter & metrics
  const { data: batchesRes } = useGetInstructorBatchesQuery();
  const batches = Array.isArray(batchesRes?.data) ? batchesRes.data : [];

  // Fetch students according to assigned batch / instructor cohorts
  const { data, isLoading, refetch, isFetching } = useGetInstructorStudentsQuery({
    page,
    limit,
    search: searchQuery,
    batchId: selectedBatchId || undefined,
  });

  const students = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const totalStudents = data?.pagination?.total || 0;

  // Reset to page 1 when search or batch filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedBatchId]);

  // Calculate metrics
  const activeBatchesCount = batches.filter(
    (b: any) => b.status === "ongoing" || b.status === "upcoming"
  ).length;

  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce((acc: number, s: any) => acc + (s.progress || s.completionPercentage || 0), 0) /
            students.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-blue-200/50">
                <GraduationCap className="w-3.5 h-3.5" />
                {isBn ? "ব্যাচ শিক্ষক ড্যাশবোর্ড" : "Cohort Instructor Portal"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 tracking-tight">
              {isBn ? "আমার দায়িত্বপ্রাপ্ত শিক্ষার্থী ও ব্যাচসমূহ" : "Enrolled Students by Batch"}
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              {isBn
                ? "আপনার পরিচালিত মাইক্রো-ব্যাচ ও কোর্সে যুক্ত শিক্ষার্থীদের লাইভ ট্র্যাকিং, শিডিউল, অগ্রগতি ও যোগাযোগের তথ্য।"
                : "Real-time tracking of students enrolled across your assigned cohorts, micro-batches, and live courses."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="flat"
              color="primary"
              startContent={<Layers className="w-4 h-4" />}
              onPress={() => router.push("/instructor/batches")}
              className="font-bold rounded-2xl"
            >
              {isBn ? "আমার ব্যাচসমূহ" : "View My Batches"}
            </Button>
            <Button
              isIconOnly
              variant="bordered"
              onPress={() => refetch()}
              isLoading={isFetching}
              className="rounded-2xl border-gray-200"
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-3xl border border-blue-100 shadow-sm bg-gradient-to-br from-white to-blue-50/30">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {isBn ? "মোট দায়িত্বপ্রাপ্ত শিক্ষার্থী" : "Total Enrolled Students"}
                  </p>
                  {isLoading ? (
                    <Skeleton className="h-9 w-20 rounded-xl" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-blue-600 tracking-tight">
                        {totalStudents}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {isBn ? "জন নিবন্ধিত" : "Learners"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-3xl border border-indigo-100 shadow-sm bg-gradient-to-br from-white to-indigo-50/30">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {isBn ? "সক্রিয় মাইক্রো-ব্যাচ" : "Assigned Micro-Batches"}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-indigo-600 tracking-tight">
                      {batches.length}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      ({activeBatchesCount} {isBn ? "চলমান" : "Active"})
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
                  <Layers className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="rounded-3xl border border-emerald-100 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    {isBn ? "গড় কোর্স অগ্রগতি" : "Average Progress"}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-emerald-600 tracking-tight">
                      {avgProgress}%
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {isBn ? "সম্পূর্ণ" : "Overall"}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filter Toolbar */}
        <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white">
          <CardBody className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1">
                <Input
                  placeholder={
                    isBn
                      ? "নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
                      : "Search by student name, email, or phone..."
                  }
                  startContent={<Search className="w-4 h-4 text-gray-400" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="bordered"
                  size="md"
                  radius="lg"
                  isClearable
                  onClear={() => setSearchQuery("")}
                  classNames={{
                    inputWrapper: "border-gray-200 bg-gray-50/50 hover:border-blue-400 focus-within:!border-blue-600",
                  }}
                />
              </div>

              {/* Batch Filter Dropdown */}
              <div className="flex items-center gap-3">
                <div className="relative min-w-[220px]">
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="">{isBn ? "🌟 সকল ব্যাচ (All Batches)" : "🌟 All Batches"}</option>
                    {batches.map((b: any) => (
                      <option key={b._id} value={b._id}>
                        {b.batchName} ({b.courseId?.title ? b.courseId.title.slice(0, 24) + "..." : "Course"})
                      </option>
                    ))}
                  </select>
                </div>

                {(searchQuery || selectedBatchId) && (
                  <Button
                    size="sm"
                    variant="flat"
                    color="default"
                    onPress={() => {
                      setSearchQuery("");
                      setSelectedBatchId("");
                    }}
                    className="rounded-xl text-xs font-semibold"
                  >
                    {isBn ? "রিসেট" : "Reset"}
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Students Table */}
        <Card className="rounded-3xl border border-gray-100 shadow-sm bg-white overflow-hidden">
          <CardBody className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Users className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {searchQuery || selectedBatchId
                    ? isBn
                      ? "কোন শিক্ষার্থী খুঁজে পাওয়া যায়নি"
                      : "No students matching your filters"
                    : isBn
                    ? "এখনো কোন শিক্ষার্থী আপনার ব্যাচে যুক্ত হয়নি"
                    : "No students assigned to your batches yet"}
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  {searchQuery || selectedBatchId
                    ? isBn
                      ? "অনুগ্রহ করে অনুসন্ধান শব্দ পরিবর্তন করুন অথবা ব্যাচ ফিল্টার রিসেট করুন।"
                      : "Try clearing your search query or selecting a different batch filter."
                    : isBn
                    ? "অ্যাডমিন বা সিস্টেম যখন কোর্সের শিক্ষার্থীকে আপনার ব্যাচে অ্যাসাইন করবে, তখন তারা এখানে দৃশ্যমান হবে।"
                    : "When students are enrolled and assigned to your batches by the admin, they will appear here automatically."}
                </p>
                {(searchQuery || selectedBatchId) && (
                  <Button
                    color="primary"
                    variant="flat"
                    className="font-bold rounded-2xl"
                    onPress={() => {
                      setSearchQuery("");
                      setSelectedBatchId("");
                    }}
                  >
                    {isBn ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  aria-label="Enrolled students table"
                  removeWrapper
                  className="min-w-full"
                >
                  <TableHeader>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4">
                      {isBn ? "শিক্ষার্থী" : "STUDENT"}
                    </TableColumn>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4">
                      {isBn ? "দায়িত্বপ্রাপ্ত ব্যাচ ও শিডিউল" : "ASSIGNED BATCH & SCHEDULE"}
                    </TableColumn>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4">
                      {isBn ? "কোর্স" : "COURSE"}
                    </TableColumn>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4">
                      {isBn ? "অগ্রগতি" : "PROGRESS"}
                    </TableColumn>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4">
                      {isBn ? "যোগাযোগ" : "CONTACT"}
                    </TableColumn>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4">
                      {isBn ? "স্ট্যাটাস" : "STATUS"}
                    </TableColumn>
                    <TableColumn className="bg-gray-50/80 text-xs font-bold text-gray-600 uppercase py-4 text-right">
                      {isBn ? "অ্যাকশন" : "ACTION"}
                    </TableColumn>
                  </TableHeader>
                  <TableBody>
                    {students.map((student: any) => {
                      const primaryBatch =
                        student.primaryBatch ||
                        (Array.isArray(student.batches) && student.batches[0]) ||
                        null;
                      const courseTitle =
                        student.primaryCourse?.title ||
                        primaryBatch?.course?.title ||
                        "Live Course";
                      const progressVal = student.progress ?? student.completionPercentage ?? 0;

                      return (
                        <TableRow
                          key={student._id}
                          className="hover:bg-blue-50/30 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          {/* Student Info */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={student.profileImage}
                                name={student.name}
                                size="md"
                                fallback={<Users className="w-5 h-5 text-gray-400" />}
                                className="ring-2 ring-blue-500/10 flex-shrink-0"
                              />
                              <div>
                                <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                                <p className="text-xs text-gray-400 font-mono">
                                  ID: {student._id.slice(-6).toUpperCase()}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Batch & Schedule */}
                          <TableCell className="py-4">
                            {primaryBatch ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-indigo-50 border border-indigo-200/80 text-indigo-700">
                                    <Layers className="w-3 h-3 text-indigo-500" />
                                    {primaryBatch.batchName || `Batch ${primaryBatch.batchNumber}`}
                                  </span>
                                  {primaryBatch.status && (
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                        primaryBatch.status === "ongoing"
                                          ? "bg-green-50 text-green-700"
                                          : primaryBatch.status === "completed"
                                          ? "bg-gray-100 text-gray-700"
                                          : "bg-amber-50 text-amber-700"
                                      }`}
                                    >
                                      {primaryBatch.status}
                                    </span>
                                  )}
                                </div>
                                {primaryBatch.schedule && (
                                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                    <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <span>{primaryBatch.schedule}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 pt-0.5">
                                  {primaryBatch.whatsappGroupUrl && (
                                    <Tooltip content={isBn ? "হোয়াটসঅ্যাপ গ্রুপ" : "WhatsApp Group"}>
                                      <a
                                        href={primaryBatch.whatsappGroupUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition"
                                      >
                                        <MessageCircle className="w-3 h-3" />
                                        <span>WhatsApp</span>
                                      </a>
                                    </Tooltip>
                                  )}
                                  {primaryBatch.zoomLink && (
                                    <Tooltip content={isBn ? "লাইভ ক্লাস লিংক" : "Live Zoom Link"}>
                                      <a
                                        href={primaryBatch.zoomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition"
                                      >
                                        <Video className="w-3 h-3" />
                                        <span>Live</span>
                                      </a>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                {isBn ? "কোন নির্দিষ্ট ব্যাচ নেই" : "General Cohort"}
                              </span>
                            )}
                          </TableCell>

                          {/* Course Title */}
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2 max-w-[220px]">
                              <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-xs font-semibold text-gray-800 line-clamp-2">
                                {courseTitle}
                              </span>
                            </div>
                          </TableCell>

                          {/* Progress */}
                          <TableCell className="py-4">
                            <div className="space-y-1 w-28">
                              <div className="flex justify-between text-xs font-bold">
                                <span className="text-gray-600">{progressVal}%</span>
                                {progressVal >= 100 && (
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                )}
                              </div>
                              <Progress
                                value={progressVal}
                                size="sm"
                                color={progressVal >= 100 ? "success" : "primary"}
                                className="h-1.5"
                              />
                            </div>
                          </TableCell>

                          {/* Contact Info */}
                          <TableCell className="py-4">
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span className="truncate max-w-[180px]">{student.email}</span>
                              </div>
                              {student.phoneNumber && (
                                <div className="flex items-center gap-1.5 text-gray-600">
                                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                  <span>{student.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          {/* Status */}
                          <TableCell className="py-4">
                            <Chip
                              color={student.isBlocked ? "danger" : "success"}
                              variant="flat"
                              size="sm"
                              className="font-bold text-xs"
                            >
                              {student.isBlocked
                                ? isBn
                                  ? "ব্লকড"
                                  : "Blocked"
                                : isBn
                                ? "সক্রিয়"
                                : "Active"}
                            </Chip>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="py-4 text-right">
                            <Button
                              size="sm"
                              color="primary"
                              variant="flat"
                              endContent={<ChevronRight className="w-3.5 h-3.5" />}
                              onPress={() => router.push(`/instructor/students/${student._id}`)}
                              className="font-bold text-xs rounded-xl"
                            >
                              {isBn ? "প্রোফাইল" : "Details"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center p-6 border-t border-gray-100">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={setPage}
                  showControls
                  color="primary"
                  size="md"
                  radius="lg"
                />
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default function InstructorStudentsPage() {
  return (
    <RequireAuth allowedRoles={["instructor", "admin", "manager"]}>
      <InstructorStudentsContent />
    </RequireAuth>
  );
}
