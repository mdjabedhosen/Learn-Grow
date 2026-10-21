"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Avatar,
  Input,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import {
  Users,
  Calendar,
  Video,
  MessageCircle,
  ExternalLink,
  Edit,
  Search,
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Shield,
  Layers,
} from "lucide-react";
import {
  useGetInstructorBatchesQuery,
  useUpdateInstructorBatchMutation,
} from "@/redux/api/batchApi";
import RequireAuth from "@/components/Auth/RequireAuth";
import toast from "react-hot-toast";

function InstructorBatchesContent() {
  // Bilingual state
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

  const { data: batchesRes, isLoading, refetch } = useGetInstructorBatchesQuery();
  const batches = batchesRes?.data || [];

  const [updateBatch, { isLoading: isUpdating }] = useUpdateInstructorBatchMutation();

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Student view modal
  const {
    isOpen: isStudentsOpen,
    onOpen: onOpenStudents,
    onClose: onCloseStudents,
  } = useDisclosure();
  const [selectedBatchForStudents, setSelectedBatchForStudents] = useState<any>(null);

  // Edit batch modal
  const {
    isOpen: isEditOpen,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    schedule: "",
    zoomLink: "",
    whatsappGroupUrl: "",
    notes: "",
  });

  const handleOpenEdit = (batch: any) => {
    setEditingBatch(batch);
    setEditForm({
      schedule: batch.schedule || "",
      zoomLink: batch.zoomLink || "",
      whatsappGroupUrl: batch.whatsappGroupUrl || "",
      notes: batch.notes || "",
    });
    onOpenEdit();
  };

  const handleSaveEdit = async () => {
    if (!editingBatch) return;
    try {
      await updateBatch({
        id: editingBatch._id,
        ...editForm,
      }).unwrap();
      toast.success(isBn ? "ব্যাচ তথ্য সফলভাবে আপডেট হয়েছে!" : "Batch updated successfully!");
      onCloseEdit();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || (isBn ? "আপডেট করতে ব্যর্থ হয়েছে" : "Failed to update batch"));
    }
  };

  const handleOpenStudents = (batch: any) => {
    setSelectedBatchForStudents(batch);
    onOpenStudents();
  };

  // Filtered batches
  const filteredBatches = batches.filter((b: any) => {
    const courseTitle = b.courseId?.title?.toLowerCase() || "";
    const batchName = b.batchName?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return courseTitle.includes(term) || batchName.includes(term);
  });

  // Calculate metrics
  const totalBatches = batches.length;
  const totalStudents = batches.reduce(
    (acc: number, b: any) => acc + (b.enrolledStudents?.length || 0),
    0
  );
  const fullBatches = batches.filter(
    (b: any) => (b.enrolledStudents?.length || 0) >= (b.maxStudents || 15)
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                {isBn ? "শিক্ষক ড্যাশবোর্ড" : "Teacher Dashboard"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
              {isBn ? "আমার দায়িত্বপ্রাপ্ত ব্যাচসমূহ" : "My Assigned Batches"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isBn
                ? "আপনার পরিচালিত সকল ব্যাচের তালিকা, সময়সূচী, লাইভ লিংক এবং শিক্ষার্থীদের সম্পূর্ণ তালিকা দেখুন।"
                : "Manage your assigned batches, student rosters, class schedules, and meeting links."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              color="primary"
              variant="flat"
              onPress={() => refetch()}
              className="font-bold"
              startContent={<Sparkles className="w-4 h-4" />}
            >
              {isBn ? "রিফ্রেশ করুন" : "Refresh Batches"}
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
            <CardBody className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isBn ? "মোট বরাদ্দকৃত ব্যাচ" : "Assigned Batches"}
                </p>
                <p className="text-2xl font-black text-gray-900">{totalBatches}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm">
            <CardBody className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isBn ? "মোট সক্রিয় শিক্ষার্থী" : "Active Students"}
                </p>
                <p className="text-2xl font-black text-gray-900">{totalStudents}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 shadow-sm">
            <CardBody className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {isBn ? "পরিপূর্ণ ব্যাচ (১৫/১৫ জন)" : "Full Batches (15/15)"}
                </p>
                <p className="text-2xl font-black text-gray-900">{fullBatches}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
          <Input
            placeholder={isBn ? "কোর্স বা ব্যাচের নাম দিয়ে খুঁজুন..." : "Search by course or batch name..."}
            value={searchTerm}
            onValueChange={setSearchTerm}
            startContent={<Search className="w-4 h-4 text-gray-400" />}
            size="sm"
            variant="bordered"
            isClearable
            className="max-w-md"
          />
        </div>

        {/* Batches Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white rounded-2xl animate-pulse border border-gray-200" />
            ))}
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 shadow-sm">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700">
              {isBn ? "কোনো ব্যাচ পাওয়া যায়নি" : "No Batches Found"}
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {isBn
                ? "বর্তমানে আপনার কোনো ব্যাচ বরাদ্দ নেই অথবা সার্চের সাথে মেলেনি।"
                : "You currently have no assigned batches, or none match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch: any) => {
              const enrolledCount = batch.enrolledStudents?.length || 0;
              const maxCount = batch.maxStudents || 15;
              const fillPercent = Math.min(100, Math.round((enrolledCount / maxCount) * 100));
              const isFull = enrolledCount >= maxCount;

              return (
                <Card
                  key={batch._id}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <CardBody className="p-5 space-y-4">
                    {/* Course Header */}
                    <div className="flex items-start gap-3">
                      {batch.courseId?.thumbnail ? (
                        <img
                          src={batch.courseId.thumbnail}
                          alt={batch.courseId.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                          <BookOpen className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#3B82F6] truncate">
                          {batch.courseId?.title || (isBn ? "কোর্স" : "Course")}
                        </p>
                        <h3 className="text-base font-black text-gray-900 flex items-center gap-2 mt-0.5">
                          <span>{batch.batchName || `Batch ${batch.batchNumber}`}</span>
                          <Chip
                            size="sm"
                            color={isFull ? "danger" : fillPercent >= 80 ? "warning" : "success"}
                            variant="flat"
                            className="font-bold text-[10px]"
                          >
                            {isFull ? (isBn ? "পরিপূর্ণ" : "Full") : `${fillPercent}%`}
                          </Chip>
                        </h3>
                      </div>
                    </div>

                    {/* Assigned Batch Tutor */}
                    {batch.instructorId && (
                      <div className="flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-xl border border-blue-100/80">
                        <Avatar
                          src={batch.instructorId?.profileImage}
                          name={batch.instructorId?.name || "Tutor"}
                          size="sm"
                          className="ring-2 ring-blue-500/20 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded">
                              {isBn ? "দায়িত্বপ্রাপ্ত শিক্ষক" : "Assigned Batch Tutor"}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-900 truncate mt-0.5">
                            {batch.instructorId?.name || (isBn ? "শিক্ষক নির্ধারিত" : "Assigned Instructor")}
                          </p>
                          {batch.instructorId?.email && (
                            <p className="text-[11px] text-gray-500 truncate">
                              {batch.instructorId.email}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Capacity Progress Bar (Max 15 per batch rule) */}
                    <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {isBn ? "ভর্তি শিক্ষার্থী:" : "Enrolled:"}
                        </span>
                        <span className={isFull ? "text-red-600 font-bold" : "text-gray-900 font-bold"}>
                          {enrolledCount} / {maxCount} {isBn ? "জন" : "students"}
                        </span>
                      </div>
                      <Progress
                        value={fillPercent}
                        color={isFull ? "danger" : fillPercent >= 80 ? "warning" : "primary"}
                        size="sm"
                        className="rounded-full"
                      />
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50/50 p-2.5 rounded-lg border border-blue-50">
                      <Calendar className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                      <span className="font-medium">
                        {batch.schedule || (isBn ? "সময়সূচী নির্ধারিত হয়নি" : "Schedule TBA")}
                      </span>
                    </div>

                    {/* Links if available */}
                    <div className="grid grid-cols-2 gap-2">
                      {batch.zoomLink ? (
                        <a
                          href={batch.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <Video className="w-3.5 h-3.5" />
                          {isBn ? "লাইভ ক্লাস" : "Live Room"}
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-50 text-gray-400 rounded-lg text-xs font-medium">
                          <Video className="w-3.5 h-3.5" />
                          {isBn ? "লিংক নেই" : "No Live Link"}
                        </div>
                      )}

                      {batch.whatsappGroupUrl ? (
                        <a
                          href={batch.whatsappGroupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-1 py-2 px-3 bg-gray-50 text-gray-400 rounded-lg text-xs font-medium">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {isBn ? "গ্রুপ নেই" : "No Group"}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        className="font-bold flex-1"
                        startContent={<Users className="w-3.5 h-3.5" />}
                        onPress={() => handleOpenStudents(batch)}
                      >
                        {isBn ? `শিক্ষার্থী তালিকা (${enrolledCount})` : `Students (${enrolledCount})`}
                      </Button>

                      <Button
                        size="sm"
                        variant="light"
                        isIconOnly
                        className="text-gray-500 hover:text-gray-900"
                        onPress={() => handleOpenEdit(batch)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal: View Batch Students */}
        <Modal
          isOpen={isStudentsOpen}
          onClose={onCloseStudents}
          size="3xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-2 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Users className="w-5 h-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-bold">
                        {selectedBatchForStudents?.batchName || "Batch Students"}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedBatchForStudents?.courseId?.title} • {selectedBatchForStudents?.enrolledStudents?.length || 0} / {selectedBatchForStudents?.maxStudents || 15} {isBn ? "জন শিক্ষার্থী" : "students"}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Tutor Info */}
                  {selectedBatchForStudents?.instructorId && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-xs text-gray-800">
                      <Avatar
                        src={selectedBatchForStudents.instructorId.profileImage}
                        name={selectedBatchForStudents.instructorId.name || "Tutor"}
                        size="sm"
                        className="ring-1 ring-blue-400"
                      />
                      <span className="font-extrabold text-blue-700">
                        {isBn ? "দায়িত্বপ্রাপ্ত ব্যাচ শিক্ষক:" : "Assigned Batch Tutor:"}
                      </span>
                      <span className="font-bold text-gray-900">
                        {selectedBatchForStudents.instructorId.name}
                      </span>
                      {selectedBatchForStudents.instructorId.email && (
                        <span className="text-gray-500">
                          ({selectedBatchForStudents.instructorId.email})
                        </span>
                      )}
                    </div>
                  )}
                </ModalHeader>

                <ModalBody className="py-4">
                  {(!selectedBatchForStudents?.enrolledStudents || selectedBatchForStudents.enrolledStudents.length === 0) ? (
                    <div className="text-center py-10 text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>{isBn ? "এই ব্যাচে এখনও কোনো শিক্ষার্থী অন্তর্ভুক্ত হয়নি।" : "No students currently enrolled in this batch."}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table aria-label="Batch Students Table">
                        <TableHeader>
                          <TableColumn>{isBn ? "রোল/সিরিয়াল" : "SL"}</TableColumn>
                          <TableColumn>{isBn ? "শিক্ষার্থী" : "Student"}</TableColumn>
                          <TableColumn>{isBn ? "যোগাযোগ" : "Contact"}</TableColumn>
                          <TableColumn>{isBn ? "ভর্তির সময়" : "Enrolled At"}</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {selectedBatchForStudents.enrolledStudents.map((student: any, idx: number) => (
                            <TableRow key={student._id || idx}>
                              <TableCell>
                                <span className="font-bold text-gray-500 text-xs">
                                  #{idx + 1}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    src={student.profileImage}
                                    name={student.name}
                                    size="sm"
                                  />
                                  <div>
                                    <p className="font-bold text-sm text-gray-900">{student.name}</p>
                                    <p className="text-xs text-gray-500">{student.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1 text-xs text-gray-600">
                                  {student.phone ? (
                                    <div className="flex items-center gap-1.5 text-gray-700">
                                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{student.phone}</span>
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 italic">{isBn ? "ফোন নেই" : "No phone"}</span>
                                  )}
                                  <div className="flex items-center gap-1.5 text-gray-500">
                                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                                    <span>{student.email}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-xs text-gray-500">
                                  {student.createdAt
                                    ? new Date(student.createdAt).toLocaleDateString()
                                    : "N/A"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </ModalBody>

                <ModalFooter className="border-t pt-3">
                  <Button variant="flat" onPress={onClose}>
                    {isBn ? "বন্ধ করুন" : "Close"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Modal: Edit Batch Schedule & Links */}
        <Modal
          isOpen={isEditOpen}
          onClose={onCloseEdit}
          size="lg"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 border-b pb-3">
                  <h2 className="text-xl font-bold">
                    {isBn ? "ব্যাচের শিডিউল ও লিংক আপডেট করুন" : "Update Batch Schedule & Links"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editingBatch?.batchName} • {editingBatch?.courseId?.title}
                  </p>
                </ModalHeader>

                <ModalBody className="py-4 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {isBn ? "ক্লাসের সময়সূচী (Schedule)" : "Class Schedule"}
                    </label>
                    <Input
                      placeholder="e.g. Sat & Tue 7:00 PM - 8:00 PM"
                      value={editForm.schedule}
                      onValueChange={(val) => setEditForm({ ...editForm, schedule: val })}
                      size="sm"
                      variant="bordered"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {isBn ? "লাইভ ক্লাস লিংক (Zoom / Google Meet URL)" : "Live Class URL (Zoom / Meet)"}
                    </label>
                    <Input
                      placeholder="https://zoom.us/j/..."
                      value={editForm.zoomLink}
                      onValueChange={(val) => setEditForm({ ...editForm, zoomLink: val })}
                      size="sm"
                      variant="bordered"
                      startContent={<Video className="w-4 h-4 text-gray-400" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {isBn ? "হোয়াটসঅ্যাপ গ্রুপ ইনভাইট লিংক (WhatsApp Group URL)" : "WhatsApp Group Invite URL"}
                    </label>
                    <Input
                      placeholder="https://chat.whatsapp.com/..."
                      value={editForm.whatsappGroupUrl}
                      onValueChange={(val) => setEditForm({ ...editForm, whatsappGroupUrl: val })}
                      size="sm"
                      variant="bordered"
                      startContent={<MessageCircle className="w-4 h-4 text-green-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      {isBn ? "বিশেষ নোট / দিকনির্দেশনা (Notes)" : "Special Notes"}
                    </label>
                    <Input
                      placeholder={isBn ? "শিক্ষার্থীদের জন্য বিশেষ কোনো নির্দেশনা..." : "Instructions for students..."}
                      value={editForm.notes}
                      onValueChange={(val) => setEditForm({ ...editForm, notes: val })}
                      size="sm"
                      variant="bordered"
                    />
                  </div>
                </ModalBody>

                <ModalFooter className="border-t pt-3">
                  <Button variant="flat" onPress={onClose} disabled={isUpdating}>
                    {isBn ? "বাতিল" : "Cancel"}
                  </Button>
                  <Button
                    color="primary"
                    className="font-bold"
                    onPress={handleSaveEdit}
                    isLoading={isUpdating}
                  >
                    {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default function InstructorBatchesPage() {
  return (
    <RequireAuth allowedRoles={["instructor", "admin", "manager"]}>
      <InstructorBatchesContent />
    </RequireAuth>
  );
}
