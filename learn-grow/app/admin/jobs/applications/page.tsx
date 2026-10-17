"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Link as NextUILink,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaArrowLeft,
  FaClipboardList,
  FaSearch,
  FaSync,
  FaEye,
  FaEnvelope,
  FaTrash,
  FaUser,
  FaPhone,
  FaBriefcase,
  FaLinkedin,
  FaFileDownload,
  FaTimes,
  FaFilePdf,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useSendApplicationEmailMutation,
} from "@/redux/api/jobApi";
import SendEmailModal from "@/components/SendEmailModal";
import toast from "react-hot-toast";

const statusColors: Record<string, "warning" | "primary" | "secondary" | "danger" | "success" | "default"> = {
  pending: "warning",
  reviewed: "primary",
  shortlisted: "secondary",
  rejected: "danger",
  accepted: "success",
};

export default function ApplicationsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const isManager = pathname?.startsWith("/manager");
  const basePath = isManager ? "/manager" : "/admin";

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "general_cv" | "job">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedForEmail, setSelectedForEmail] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEmailOpen, onOpen: onEmailOpen, onClose: onEmailClose } = useDisclosure();

  const { data: applicationsData, isLoading, refetch } = useGetApplicationsQuery({
    status: statusFilter !== "all" ? statusFilter : undefined,
    applicationType: typeFilter !== "all" ? typeFilter : undefined,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateApplicationStatusMutation();
  const [deleteApplication] = useDeleteApplicationMutation();
  const [sendEmail, { isLoading: isSendingEmail }] = useSendApplicationEmailMutation();

  const applications = applicationsData?.data || [];

  const filteredApplications = applications.filter((app: any) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    const nameMatch = app.fullName?.toLowerCase().includes(term);
    const emailMatch = app.email?.toLowerCase().includes(term);
    const phoneMatch = app.phone?.toLowerCase().includes(term);
    const jobTitleMatch = app.jobId?.title?.toLowerCase().includes(term);
    const positionMatch = app.positionOfInterest?.toLowerCase().includes(term);
    const additionalMatch = app.additionalInfo?.toLowerCase().includes(term);

    return nameMatch || emailMatch || phoneMatch || jobTitleMatch || positionMatch || additionalMatch;
  });

  const totalApplications = applications.length;
  const directCvCount = applications.filter((app: any) => app.applicationType === "general_cv" || !app.jobId).length;
  const jobPostCount = applications.filter((app: any) => app.applicationType === "job" && app.jobId).length;
  const pendingCount = applications.filter((app: any) => app.status === "pending").length;
  const shortlistedCount = applications.filter((app: any) => app.status === "shortlisted").length;
  const acceptedCount = applications.filter((app: any) => app.status === "accepted").length;

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await updateStatus({ id: appId, status: newStatus }).unwrap();
      toast.success("Status updated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (appId: string) => {
    if (confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(appId).unwrap();
        toast.success("Application deleted successfully");
        refetch();
        onClose();
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete application");
      }
    }
  };

  const openDetails = (app: any) => {
    setSelectedApplication(app);
    onOpen();
  };

  const openEmailModal = (app: any) => {
    setSelectedForEmail(app);
    onEmailOpen();
  };

  const handleSendEmail = async (data: { subject: string; message: string }) => {
    try {
      await sendEmail({
        applicationId: selectedForEmail._id,
        recipientEmail: selectedForEmail.email,
        recipientName: selectedForEmail.fullName,
        subject: data.subject,
        message: data.message,
      }).unwrap();

      toast.success("Email sent successfully!");
      refetch();
      onEmailClose();
      setSelectedForEmail(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send email");
      throw error;
    }
  };

  const getRoleDisplay = (app: any) => {
    if (app.applicationType === "general_cv" || !app.jobId) {
      return app.positionOfInterest || "Direct CV / Open Application";
    }
    return app.jobId?.title || app.positionOfInterest || "Job Posting";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
      {/* Header with Gradient */}
      <div className="mb-6 sm:mb-8 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <Button
          variant="light"
          startContent={<FaArrowLeft />}
          onPress={() => router.push(`${basePath}/jobs`)}
          className="mb-3 sm:mb-4 text-white hover:bg-white/20 min-h-[44px]"
          size="lg"
        >
          Back to Jobs
        </Button>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-white/20 p-3 sm:p-4 rounded-2xl backdrop-blur-sm">
              <FaClipboardList className="text-3xl sm:text-4xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
                  Job Applications & Direct CVs
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">
                  {isManager ? "Manager Portal" : "Admin Portal"}
                </span>
              </div>
              <p className="text-sm sm:text-base text-white/90 mt-1 font-medium">
                Review specific job applicants and direct CV submissions from the Career page
              </p>
            </div>
          </div>
          <Button
            isLoading={isLoading}
            onPress={() => refetch()}
            className="bg-white text-teal-700 font-bold shadow-md hover:bg-slate-50"
            startContent={<FaSync />}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-all rounded-2xl">
          <CardBody className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl">
            <p className="text-xs opacity-90 font-semibold mb-1">Total Received</p>
            <p className="text-2xl sm:text-3xl font-black">{totalApplications}</p>
          </CardBody>
        </Card>

        <Card className="shadow-md border border-amber-200 hover:shadow-lg transition-all rounded-2xl">
          <CardBody className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl">
            <p className="text-xs opacity-90 font-semibold mb-1">Direct CVs</p>
            <p className="text-2xl sm:text-3xl font-black">{directCvCount}</p>
          </CardBody>
        </Card>

        <Card className="shadow-md border border-teal-200 hover:shadow-lg transition-all rounded-2xl">
          <CardBody className="p-4 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl">
            <p className="text-xs opacity-90 font-semibold mb-1">Job Post Apps</p>
            <p className="text-2xl sm:text-3xl font-black">{jobPostCount}</p>
          </CardBody>
        </Card>

        <Card className="shadow-md border border-yellow-200 hover:shadow-lg transition-all rounded-2xl">
          <CardBody className="p-4 bg-gradient-to-br from-yellow-500 to-amber-600 text-white rounded-2xl">
            <p className="text-xs opacity-90 font-semibold mb-1 flex items-center gap-1.5">
              <FaClock className="w-3 h-3 text-white/90" />
              <span>Pending Review</span>
            </p>
            <p className="text-2xl sm:text-3xl font-black">{pendingCount}</p>
          </CardBody>
        </Card>

        <Card className="shadow-md border border-purple-200 hover:shadow-lg transition-all rounded-2xl col-span-2 lg:col-span-1">
          <CardBody className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl">
            <p className="text-xs opacity-90 font-semibold mb-1">Shortlisted / Won</p>
            <p className="text-2xl sm:text-3xl font-black">{shortlistedCount + acceptedCount}</p>
          </CardBody>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4">
        {/* Source Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <Tabs
            selectedKey={typeFilter}
            onSelectionChange={(key) => setTypeFilter(key as any)}
            color="primary"
            variant="solid"
            radius="full"
          >
            <Tab key="all" title={`All Submissions (${totalApplications})`} />
            <Tab key="general_cv" title={`Direct CVs (${directCvCount})`} />
            <Tab key="job" title={`Job Post Applications (${jobPostCount})`} />
          </Tabs>

          <span className="text-xs text-gray-500 font-semibold">
            Showing {filteredApplications.length} candidate(s)
          </span>
        </div>

        {/* Search & Status Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search by name, email, phone, role, or notes..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              isClearable
              size="lg"
              startContent={<FaSearch className="text-gray-400" />}
              classNames={{
                inputWrapper: "min-h-[48px] rounded-2xl border border-gray-200 bg-gray-50/50",
              }}
            />
          </div>

          <div>
            <Select
              label="Status Filter"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="sm"
              variant="bordered"
              classNames={{
                trigger: "min-h-[48px] rounded-2xl border-gray-200 bg-white",
              }}
            >
              <SelectItem key="all" value="all">All Statuses</SelectItem>
              <SelectItem key="pending" value="pending">Pending Review</SelectItem>
              <SelectItem key="reviewed" value="reviewed">Reviewed</SelectItem>
              <SelectItem key="shortlisted" value="shortlisted">Shortlisted</SelectItem>
              <SelectItem key="accepted" value="accepted">Accepted / Hired</SelectItem>
              <SelectItem key="rejected" value="rejected">Rejected</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Table / Applications List */}
      <Card className="shadow-sm border border-gray-200 rounded-3xl overflow-hidden">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner size="lg" label="Loading applications & direct CVs..." />
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                <FaClipboardList />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">No Applications Found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No job applications or direct CVs match the selected filter or search keyword.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table aria-label="Job Applications Table" shadow="none">
                  <TableHeader>
                    <TableColumn>APPLICANT</TableColumn>
                    <TableColumn>TYPE & ROLE</TableColumn>
                    <TableColumn>CONTACT</TableColumn>
                    <TableColumn>RESUME / CV</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>APPLIED DATE</TableColumn>
                    <TableColumn align="center">ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app: any) => {
                      const isDirectCv = app.applicationType === "general_cv" || !app.jobId;
                      return (
                        <TableRow key={app._id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Applicant */}
                          <TableCell>
                            <div>
                              <p className="font-bold text-gray-900">{app.fullName}</p>
                              {app.linkedinProfile && (
                                <a
                                  href={app.linkedinProfile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <FaLinkedin /> LinkedIn Profile
                                </a>
                              )}
                            </div>
                          </TableCell>

                          {/* Type & Role */}
                          <TableCell>
                            <div className="space-y-1">
                              {isDirectCv ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                                  Direct CV
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                  Job Post
                                </span>
                              )}
                              <p className="text-sm font-bold text-gray-800">{getRoleDisplay(app)}</p>
                            </div>
                          </TableCell>

                          {/* Contact */}
                          <TableCell>
                            <div className="text-xs space-y-0.5">
                              <p className="font-medium text-gray-900">{app.phone}</p>
                              <a href={`mailto:${app.email}`} className="text-teal-600 hover:underline font-mono">
                                {app.email}
                              </a>
                            </div>
                          </TableCell>

                          {/* Resume */}
                          <TableCell>
                            <Button
                              as="a"
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="sm"
                              variant="flat"
                              color="primary"
                              startContent={<FaFilePdf />}
                              className="font-bold rounded-xl"
                            >
                              Open CV
                            </Button>
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <Chip size="sm" color={statusColors[app.status] || "default"} variant="flat" className="font-bold uppercase tracking-wider text-[11px]">
                              {app.status}
                            </Chip>
                          </TableCell>

                          {/* Date */}
                          <TableCell className="text-xs text-gray-500 font-medium whitespace-nowrap">
                            {new Date(app.appliedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </TableCell>

                          {/* Actions */}
                          <TableCell>
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                size="sm"
                                variant="flat"
                                onPress={() => openDetails(app)}
                                startContent={<FaEye />}
                                className="font-bold rounded-xl"
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                onPress={() => openEmailModal(app)}
                                startContent={<FaEnvelope />}
                                className="font-bold rounded-xl"
                              >
                                Email
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                isIconOnly
                                onPress={() => handleDelete(app._id)}
                                className="rounded-xl"
                                aria-label="Delete application"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile / Tablet Cards */}
              <div className="lg:hidden p-4 space-y-3">
                {filteredApplications.map((app: any) => {
                  const isDirectCv = app.applicationType === "general_cv" || !app.jobId;
                  return (
                    <Card key={app._id} className="border border-gray-200 rounded-2xl shadow-xs">
                      <CardBody className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {isDirectCv ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  Direct CV
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                  Job Post
                                </span>
                              )}
                              <Chip size="sm" color={statusColors[app.status] || "default"} variant="flat" className="text-[10px] uppercase font-bold">
                                {app.status}
                              </Chip>
                            </div>
                            <h3 className="font-black text-gray-900 text-base">{app.fullName}</h3>
                            <p className="text-xs font-bold text-gray-700">{getRoleDisplay(app)}</p>
                          </div>
                          <Button
                            as="a"
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={<FaFilePdf />}
                            className="font-bold rounded-xl"
                          >
                            CV
                          </Button>
                        </div>

                        <div className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl space-y-1">
                          <p className="flex items-center gap-2">
                            <FaPhone className="text-gray-400" /> {app.phone}
                          </p>
                          <p className="flex items-center gap-2 font-mono">
                            <FaEnvelope className="text-gray-400" /> {app.email}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="flat"
                            className="flex-1 font-bold rounded-xl"
                            startContent={<FaEye />}
                            onPress={() => openDetails(app)}
                          >
                            Details
                          </Button>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            className="flex-1 font-bold rounded-xl"
                            startContent={<FaEnvelope />}
                            onPress={() => openEmailModal(app)}
                          >
                            Email
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            isIconOnly
                            className="rounded-xl"
                            onPress={() => handleDelete(app._id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </CardBody>
      </Card>

      {/* Application Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
        <ModalContent className="rounded-3xl overflow-hidden">
          <ModalHeader className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white p-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-black">Candidate Application Dossier</h2>
                <p className="text-sm text-white/90">{selectedApplication?.fullName}</p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="p-6 space-y-5">
            {selectedApplication && (
              <>
                {/* Application Type & Role Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      {selectedApplication.applicationType === "general_cv" ? "Direct CV / Career Page" : "Specific Job Post Application"}
                    </span>
                    <h3 className="text-lg font-black text-gray-900">
                      {getRoleDisplay(selectedApplication)}
                    </h3>
                  </div>
                  <Chip
                    color={statusColors[selectedApplication.status] || "default"}
                    variant="solid"
                    className="text-white font-bold uppercase"
                  >
                    {selectedApplication.status}
                  </Chip>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Full Name</p>
                    <p className="font-bold text-gray-900">{selectedApplication.fullName}</p>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Phone Number</p>
                    <p className="font-bold text-gray-900 font-mono">{selectedApplication.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Email Address</p>
                    <a href={`mailto:${selectedApplication.email}`} className="font-bold text-teal-600 hover:underline font-mono">
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold mb-0.5">Submission Date</p>
                    <p className="font-bold text-gray-900">
                      {new Date(selectedApplication.appliedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Resume & Portfolio Links */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Candidate Attachments & Links</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      as="a"
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      className="font-bold rounded-2xl"
                      startContent={<FaFilePdf />}
                    >
                      Open Attached Resume / CV
                    </Button>

                    {selectedApplication.linkedinProfile && (
                      <Button
                        as="a"
                        href={selectedApplication.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="bordered"
                        className="font-bold rounded-2xl border-gray-200"
                        startContent={<FaLinkedin className="text-blue-600" />}
                      >
                        LinkedIn Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Additional Info / Cover Letter */}
                {selectedApplication.additionalInfo && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Cover Letter / Notes</p>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {selectedApplication.additionalInfo}
                    </div>
                  </div>
                )}

                {/* Status Update Dropdown */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Change Application Status</p>
                  <Select
                    selectedKeys={[selectedApplication.status]}
                    onChange={(e) => {
                      const newStat = e.target.value;
                      if (newStat) {
                        handleStatusChange(selectedApplication._id, newStat);
                        setSelectedApplication({ ...selectedApplication, status: newStat });
                      }
                    }}
                    isDisabled={isUpdating}
                    size="md"
                    variant="bordered"
                    classNames={{
                      trigger: "rounded-2xl border-gray-200",
                    }}
                  >
                    <SelectItem key="pending" value="pending">Pending Review</SelectItem>
                    <SelectItem key="reviewed" value="reviewed">Mark as Reviewed</SelectItem>
                    <SelectItem key="shortlisted" value="shortlisted">Shortlist Candidate</SelectItem>
                    <SelectItem key="accepted" value="accepted">Accept / Hire Candidate</SelectItem>
                    <SelectItem key="rejected" value="rejected">Reject Candidate</SelectItem>
                  </Select>
                </div>
              </>
            )}
          </ModalBody>

          <ModalFooter className="p-6 bg-gray-50 border-t border-gray-100">
            <Button
              color="primary"
              variant="flat"
              onPress={() => {
                onClose();
                openEmailModal(selectedApplication);
              }}
              className="font-bold rounded-2xl"
              startContent={<FaEnvelope />}
            >
              Compose Email to Candidate
            </Button>
            <Button
              color="default"
              variant="light"
              onPress={onClose}
              className="font-bold rounded-2xl"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Send Email Modal */}
      <SendEmailModal
        isOpen={isEmailOpen}
        onClose={onEmailClose}
        applicantEmail={selectedForEmail?.email || ""}
        applicantName={selectedForEmail?.fullName || ""}
        onSendEmail={handleSendEmail}
        isSending={isSendingEmail}
      />
    </div>
  );
}
