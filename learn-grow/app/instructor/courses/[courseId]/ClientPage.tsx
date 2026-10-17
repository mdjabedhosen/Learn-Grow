"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    Button,
    Tabs,
    Tab,
    Chip,
    Progress,
    Input,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Accordion,
    AccordionItem,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaEdit,
    FaUsers,
    FaBookOpen,
    FaChartLine,
    FaClipboardList,
    FaPlus,
    FaGraduationCap,
    FaEye,
    FaTrash,
    FaVideo,
    FaFileAlt,
    FaEllipsisV,
    FaCheckCircle,
    FaCloudUploadAlt,
    FaLink,
    FaTimesCircle,
    FaStar,
    FaMoneyBillWave,
    FaClock,
    FaCheck,
    FaChalkboardTeacher,
    FaCertificate,
    FaLayerGroup,
    FaExternalLinkAlt,
    FaCrown,
    FaSyncAlt,
} from "react-icons/fa";
import {
    useGetCourseByIdQuery,
    useGetCourseStatsQuery,
    useCreateModuleMutation,
    useUpdateModuleMutation,
    useDeleteModuleMutation,
    useCreateLessonMutation,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    usePublishCourseMutation,
    useUnpublishCourseMutation,
} from "@/redux/api/courseApi";
import { useGetEnrolledStudentsQuery } from "@/redux/api/orderApi";
import { useGetQuizzesByCourseQuery } from "@/redux/api/quizApi";
import { useGetAssignmentsByCourseQuery } from "@/redux/api/assignmentApi";
import { toast } from "react-toastify";
import DOMPurify from "isomorphic-dompurify";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface ContentLink {
    id?: string;
    title: string;
    url: string;
    type: "video" | "drive" | "pdf" | "resource" | "other";
    isPrimary?: boolean;
}

interface Lesson {
    id: string;
    title: string;
    type: "video" | "pdf" | "quiz" | "assignment";
    description?: string;
    contentUrl?: string;
    contentLinks?: ContentLink[];
    isFreePreview?: boolean;
    isPublished?: boolean;
}

interface Module {
    id: string;
    title: string;
    description?: string;
    lessons: Lesson[];
    resources?: string;
    isPublished?: boolean;
}

export default function InstructorCourseDashboardClient({ params }: { params: { courseId: string } }) {
    const router = useRouter();
    const { courseId } = params;
    const [activeTab, setActiveTab] = useState("overview");
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const isAdmin = userRole === "admin";
    const isInstructor = userRole === "instructor";

    // Decode JWT (base64 URL) to extract user id/role as source of truth
    const decodeJwt = (token?: string) => {
        if (!token) return null;
        const parts = token.split(".");
        if (parts.length < 2) return null;
        try {
            const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (e) {
            return null;
        }
    };

    // Basic auth/role guard (instructor-only, must own course). Uses decoded token when available.
    useEffect(() => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("accessToken") : null;
            const decoded = decodeJwt(token || undefined);
            const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
            const userFromStorage = userStr ? JSON.parse(userStr) : null;

            const effectiveRole = decoded?.role || userFromStorage?.role;
            const effectiveId = decoded?.userId || decoded?._id || userFromStorage?._id || userFromStorage?.id;

            if (!effectiveRole || !["instructor", "admin"].includes(effectiveRole)) {
                setIsAuthorized(false);
                router.replace("/login");
                return;
            }
            // Store effective user info for later ownership check
            (window as any).__lg_user__ = { id: effectiveId, role: effectiveRole };
            setUserRole(effectiveRole);
        } catch (err) {
            setIsAuthorized(false);
            router.replace("/login");
            return;
        }
        setAuthChecked(true);
    }, [router]);

    // Fetch course data from backend
    const { data: courseResponse, isLoading: courseLoading, error: courseError, refetch: refetchCourse } = useGetCourseByIdQuery(courseId);
    const courseData = courseResponse?.data || null;

    // Fetch course statistics (optimized endpoint)
    const { data: statsResponse, isLoading: statsLoading } = useGetCourseStatsQuery(courseId);
    const courseStats = statsResponse?.data || null;

    // Mutations
    const [createModule, { isLoading: moduleCreating }] = useCreateModuleMutation();
    const [updateModule, { isLoading: moduleUpdating }] = useUpdateModuleMutation();
    const [deleteModule, { isLoading: moduleDeleting }] = useDeleteModuleMutation();
    const [createLesson, { isLoading: lessonCreating }] = useCreateLessonMutation();
    const [updateLesson, { isLoading: lessonUpdating }] = useUpdateLessonMutation();
    const [deleteLesson, { isLoading: lessonDeleting }] = useDeleteLessonMutation();
    const [publishCourse, { isLoading: publishingCourse }] = usePublishCourseMutation();
    const [unpublishCourse, { isLoading: unpublishingCourse }] = useUnpublishCourseMutation();

    // Local state for modules and lessons
    const [modules, setModules] = useState<Module[]>([]);

    // Load modules when course data is available
    useEffect(() => {
        if (courseData?.modules) {
            setModules(courseData.modules);
        }
    }, [courseData]);

    // Module management
    const { isOpen: isModuleModalOpen, onOpen: onOpenModuleModal, onClose: onCloseModuleModal } = useDisclosure();
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [newModuleDescription, setNewModuleDescription] = useState("");
    const [newModuleResource, setNewModuleResource] = useState("");
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [moduleErrors, setModuleErrors] = useState<Record<string, string>>({});

    // Lesson management
    const { isOpen: isLessonModalOpen, onOpen: onOpenLessonModal, onClose: onCloseLessonModal } = useDisclosure();
    const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
    const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ type: "video" });
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
    const [lessonErrors, setLessonErrors] = useState<Record<string, string>>({});
    const [contentLinks, setContentLinks] = useState<ContentLink[]>([]);

    // Fetch quizzes and assignments for this course
    const { data: quizzesResp } = useGetQuizzesByCourseQuery(courseId, { skip: !courseId });
    const { data: assignmentsResp } = useGetAssignmentsByCourseQuery(courseId, { skip: !courseId });

    // Combine quizzes and assignments into unified assessments list
    const quizzes = quizzesResp?.data || [];
    const assignments = assignmentsResp?.data || [];
    
    const assessments = [
        ...quizzes.map((quiz: any) => ({
            _id: quiz._id,
            id: quiz._id,
            title: quiz.title,
            type: quiz.assessmentType || 'quiz',
            status: quiz.status,
            questions: quiz.questions?.length || 0,
            submissionsCount: 0, // TODO: fetch from submissions
        })),
        ...assignments.map((assignment: any) => ({
            _id: assignment._id,
            id: assignment._id,
            title: assignment.title,
            type: assignment.assessmentType || 'assignment',
            status: assignment.status || 'draft',
            dueDate: assignment.dueDate,
            submissionsCount: assignment.submissions?.length || 0,
        })),
    ];

    const getStatusColor = (status: string) => status === "published" || status === "active" ? "success" : "warning";

    // Gracefully format dates from API or fallback fields
    const formatDate = (value?: string) => {
        if (!value) return "Not set";
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? "Not set" : parsed.toLocaleDateString();
    };

    const handleToggleCoursePublish = async () => {
        try {
            if (courseData?.isPublished) {
                await unpublishCourse(courseId).unwrap();
                toast.success("Course unpublished successfully");
            } else {
                await publishCourse(courseId).unwrap();
                toast.success("Course published successfully");
            }
        } catch (err: any) {
            const errorMsg = err?.data?.message || err?.message || "Failed to update publish status";
            toast.error(errorMsg);
        }
    };

    // --- Curriculum Handlers ---

    const handleSaveModule = async () => {
        setModuleErrors({});
        if (!newModuleTitle.trim()) {
            setModuleErrors({ title: "Module title is required" });
            return;
        }

        try {
            if (editingModuleId) {
                await updateModule({
                    id: editingModuleId,
                    title: newModuleTitle,
                    description: newModuleDescription,
                    resources: newModuleResource,
                }).unwrap();
                toast.success("Module updated successfully!");
            } else {
                await createModule({
                    courseId,
                    title: newModuleTitle,
                    description: newModuleDescription,
                    resources: newModuleResource,
                    orderIndex: modules.length,
                }).unwrap();
                toast.success("Module created successfully!");
            }
            setNewModuleTitle("");
            setNewModuleDescription("");
            setNewModuleResource("");
            setEditingModuleId(null);
            onCloseModuleModal();
            // Non-blocking refetch to prevent hanging
            refetchCourse().catch(() => {})
        } catch (err: any) {
            const errorMsg = err?.data?.message || "Failed to save module";
            toast.error(errorMsg);
            setModuleErrors({ general: errorMsg });
        }
    };

    const handleDeleteModule = async (moduleId: string) => {
        if (confirm("Are you sure you want to delete this module and all its lessons?")) {
            try {
                await deleteModule(moduleId).unwrap();
                toast.success("Module deleted successfully!");
                // Non-blocking refetch to prevent hanging
                refetchCourse().catch(() => {})
            } catch (err: any) {
                const errorMsg = err?.data?.message || "Failed to delete module";
                toast.error(errorMsg);
            }
        }
    };

    const handleSaveLesson = async () => {
        setLessonErrors({});
        if (!newLesson.title || !currentModuleId) {
            setLessonErrors({ title: "Lesson title is required" });
            return;
        }

        try {
            if (editingLessonId) {
                await updateLesson({
                    id: editingLessonId,
                    title: newLesson.title,
                    type: newLesson.type,
                    description: newLesson.description,
                    contentUrl: newLesson.contentUrl,
                    contentLinks: contentLinks.length > 0 ? contentLinks : undefined,
                    isFreePreview: newLesson.isFreePreview,
                }).unwrap();
                toast.success("Lesson updated successfully!");
            } else {
                // Find the current module to get lesson count for orderIndex
                const currentModule = modules.find(m => m.id === currentModuleId);
                const lessonCount = currentModule?.lessons?.length || 0;
                
                await createLesson({
                    moduleId: currentModuleId,
                    title: newLesson.title,
                    type: newLesson.type,
                    description: newLesson.description,
                    contentUrl: newLesson.contentUrl,
                    contentLinks: contentLinks.length > 0 ? contentLinks : undefined,
                    isFreePreview: newLesson.isFreePreview,
                    orderIndex: lessonCount,
                }).unwrap();
                toast.success("Lesson created successfully!");
            }
            setNewLesson({ type: "video" });
            setContentLinks([]);
            setEditingLessonId(null);
            onCloseLessonModal();
            // Non-blocking refetch to prevent hanging
            refetchCourse().catch(() => {})
        } catch (err: any) {
            const errorMsg = err?.data?.message || "Failed to save lesson";
            toast.error(errorMsg);
            setLessonErrors({ general: errorMsg });
        }
    };

    const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
        if (confirm("Delete this lesson?")) {
            try {
                await deleteLesson(lessonId).unwrap();
                toast.success("Lesson deleted successfully!");
                // Non-blocking refetch to prevent hanging
                refetchCourse().catch(() => {})
            } catch (err: any) {
                const errorMsg = err?.data?.message || "Failed to delete lesson";
                toast.error(errorMsg);
            }
        }
    };

    // Ownership guard after data loads
    useEffect(() => {
        if (!authChecked || !courseData) return;
        const userInfo = (typeof window !== "undefined" && (window as any).__lg_user__)
            || (() => {
                const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
                const decoded = decodeJwt(token || undefined);
                if (decoded) return { id: decoded.userId || decoded._id, role: decoded.role };
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const u = JSON.parse(userStr);
                    return { id: u._id || u.id, role: u.role };
                }
                return null;
            })();
        if (!userInfo) return;

        const instructorId = typeof courseData.instructorId === "object"
            ? (courseData.instructorId as any)?._id || (courseData.instructorId as any)?.id
            : courseData.instructorId;

        if (!["instructor", "admin"].includes(userInfo.role)) {
            setIsAuthorized(false);
            toast.error("Only instructors or admins can access this page");
            router.replace("/login");
            return;
        }

        // Check if instructor is primary or in instructorIds
        const isPrimary = instructorId && userInfo.id && (userInfo.id.toString() === instructorId.toString());
        const isCoInstructor = Array.isArray(courseData.instructorIds) && courseData.instructorIds.some((inst: any) => {
            const instId = typeof inst === "object" ? inst._id || inst.id : inst;
            return instId?.toString() === userInfo.id?.toString();
        });

        // If backend returned courseData, the user is authorized
        if (userInfo.role === "instructor" && !isPrimary && !isCoInstructor && !courseData?._id) {
            setIsAuthorized(false);
            toast.error("You cannot access this course");
            router.replace("/instructor/courses");
        }
    }, [authChecked, courseData, router]);

    if (!authChecked) {
        return null;
    }

    if (courseLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Button
                    variant="light"
                    startContent={<FaArrowLeft />}
                    onPress={() => router.push("/instructor/courses")}
                    className="mb-6"
                >
                    Back to Courses
                </Button>
                <Card className="mb-8">
                    <CardBody className="p-8 text-center">
                        <p className="text-lg text-gray-500">Loading course details...</p>
                    </CardBody>
                </Card>
            </div>
        );
    }

    // Show error/unauthorized state
    if (!isAuthorized || courseError || !courseData) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Button
                    variant="light"
                    startContent={<FaArrowLeft />}
                    onPress={() => router.push("/instructor/courses")}
                    className="mb-6"
                >
                    Back to Courses
                </Button>
                <Card className="mb-8 border-2 border-red-500">
                    <CardBody className="p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-2">Course Not Found</h2>
                            <p className="text-gray-600 mb-4">
                                We couldn't find the course you're looking for. The course may have been deleted or you don't have permission to access it.
                            </p>
                            {courseError && (
                                <p className="text-sm text-gray-500 mb-4 bg-gray-50 p-3 rounded">
                                    Error: {(courseError as any)?.data?.message || (courseError as any)?.message || "Unknown error"}
                                </p>
                            )}
                            <Button color="primary" onPress={() => router.push("/instructor/courses")}>
                                Back to My Courses
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const instructor = typeof courseData?.instructorId === "object" ? courseData.instructorId : null;
    const instructorName = instructor?.name || "Md Jabed Hosen";
    const instructorRole = instructor?.qualification || instructor?.role || "Founder & CEO | Lead AI Mentor";
    const instructorInstitution = instructor?.institution || "Learn & Grow STEM Academy";
    const instructorImage = instructor?.profileImage || "/images/tutors/tutor-tanvir.png";
    const instructorBio = instructor?.bio || "Founder & CEO of Learn & Grow. Lead Instructor specializing in Python Programming, Artificial Intelligence, and Robotics.";

    const getCleanTagline = (htmlStr?: string) => {
        if (!htmlStr) return "Interactive live STEM course designed to empower the next generation of innovators.";
        const text = htmlStr.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        const match = text.match(/^([^.?!]+[.?!])/);
        if (match && match[1] && match[1].length >= 25 && match[1].length <= 180) {
            return match[1].trim();
        }
        return text.slice(0, 160) + "...";
    };

    return (
        <div className="container mx-auto px-3 sm:px-6 py-6 sm:py-8 max-w-7xl">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="flat"
                        startContent={<FaArrowLeft className="text-xs" />}
                        onPress={() => router.push("/instructor/courses")}
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs h-9 shadow-xs"
                        size="sm"
                    >
                        My Courses
                    </Button>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-md">
                        {courseData?.title || "Course Details"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="light"
                        size="sm"
                        onPress={() => router.push("/instructor")}
                        className="text-slate-600 hover:text-slate-900 font-medium text-xs h-9"
                    >
                        Dashboard
                    </Button>
                </div>
            </div>

            {/* Course Header Banner */}
            <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B132B] via-[#1C2541] to-[#0A1128] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-slate-700/50">
                {/* Decorative Ambient Accents */}
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    {/* Left: Course Info */}
                    <div className="flex-1 max-w-3xl">
                        {/* Status Chips */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                                courseData?.isPublished
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}>
                                <span className={`w-2 h-2 rounded-full ${courseData?.isPublished ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                                {courseData?.isPublished ? "Published" : "Draft"}
                            </span>

                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                                courseData?.isAdminApproved
                                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                                    : "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                            }`}>
                                <FaCheckCircle className="text-xs" />
                                {courseData?.isAdminApproved ? "Admin Approved" : "Pending Review"}
                            </span>

                            {courseData?.level && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                                    {courseData.level}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
                            {courseData?.title || "Untitled Course"}
                        </h1>

                        {/* Clean Tagline / Subtitle */}
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-normal">
                            {getCleanTagline(courseData?.description)}
                        </p>

                        {/* Quick Stats Ribbon */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-slate-700/60 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-slate-200 font-semibold">
                                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <FaUsers />
                                </span>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Enrolled</p>
                                    <p className="text-white font-bold">{courseStats?.enrolledStudents ?? courseData?.studentsEnrolled ?? 0} Students</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-200 font-semibold">
                                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                                    <FaStar />
                                </span>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rating</p>
                                    <p className="text-white font-bold">{courseData?.rating || 4.9} ⭐</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-200 font-semibold">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <FaBookOpen />
                                </span>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Curriculum</p>
                                    <p className="text-white font-bold">{modules.length} Modules • {totalLessons} Lessons</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-slate-200 font-semibold">
                                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <FaMoneyBillWave />
                                </span>
                                <div>
                                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Course Fee</p>
                                    <p className="text-white font-bold">৳ {courseData?.price?.toLocaleString() || "2,999"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Action Controls */}
                    <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0 justify-start lg:justify-center">
                        <Button
                            startContent={<FaCheckCircle />}
                            color={courseData?.isPublished ? "warning" : "success"}
                            className="font-bold text-white shadow-lg flex-1 lg:flex-initial min-w-[150px]"
                            variant="solid"
                            size="md"
                            isLoading={publishingCourse || unpublishingCourse}
                            onPress={handleToggleCoursePublish}
                        >
                            {courseData?.isPublished ? "Unpublish Course" : "Publish Course"}
                        </Button>
                        <Button
                            startContent={<FaEdit />}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold backdrop-blur-md flex-1 lg:flex-initial min-w-[150px]"
                            size="md"
                            onPress={() => {
                                if (isAdmin) {
                                    router.push(`/admin/courses/edit?id=${courseId}`);
                                } else {
                                    router.push(`/instructor/courses/edit?id=${courseId}`);
                                }
                            }}
                        >
                            Edit Details
                        </Button>
                        <Button
                            startContent={<FaEye />}
                            className="bg-white hover:bg-slate-100 text-slate-900 font-bold shadow-md flex-1 lg:flex-initial min-w-[150px]"
                            size="md"
                            onPress={() => window.open(`/courses/${courseData?.slug || courseId}`, "_blank")}
                        >
                            Preview Public
                        </Button>
                    </div>
                </div>
            </div>

            {/* Admin Approval Notice */}
            {!courseData?.isAdminApproved && (
                <Card className="mb-6 border border-warning-200 bg-warning-50/60 rounded-2xl shadow-xs">
                    <CardBody className="p-5">
                        <div className="flex items-start gap-4">
                            <div className="text-warning text-2xl font-bold">!</div>
                            <div className="flex-1">
                                <h3 className="font-bold text-base mb-1 text-warning-800">Pending Admin Approval</h3>
                                <p className="text-xs sm:text-sm text-slate-700 mb-2">
                                    Your course is currently under review by our admin team. Once approved, it will be visible to students on the public course directory.
                                </p>
                                <p className="text-xs text-slate-500">
                                    <strong>Tip:</strong> You can continue to add modules, lessons, and assignments while waiting for approval.
                                </p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Main Content Tabs */}
            <Tabs
                aria-label="Course Options"
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                color="primary"
                variant="underlined"
                classNames={{
                    tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                    cursor: "w-full bg-primary",
                    tab: "max-w-fit px-1 h-12",
                    tabContent: "group-data-[selected=true]:text-primary font-bold text-base sm:text-lg"
                }}
            >
                {/* Overview Tab */}
                <Tab
                    key="overview"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaChartLine />
                            <span>Overview</span>
                        </div>
                    }
                >
                    <div className="mt-6 space-y-6">
                        {/* 4 Metric Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <Card className="shadow-xs border border-slate-200/80 rounded-2xl bg-white">
                                <CardBody className="p-5 flex flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                                        <FaUsers />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Students</p>
                                        <p className="text-2xl font-black text-slate-800">
                                            {courseStats?.enrolledStudents ?? courseData?.studentsEnrolled ?? 0}
                                        </p>
                                        <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Active Learners</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="shadow-xs border border-slate-200/80 rounded-2xl bg-white">
                                <CardBody className="p-5 flex flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Course Revenue</p>
                                        <p className="text-2xl font-black text-slate-800">
                                            ৳ {(courseStats?.revenue ?? ((courseStats?.enrolledStudents || 0) * (courseData?.price || 2999))).toLocaleString()}
                                        </p>
                                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">Gross Enrollment Revenue</p>
                                    </div>
                                </CardBody>
                            </Card>

                            <Card className="shadow-xs border border-slate-200/80 rounded-2xl bg-white">
                                <CardBody className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Engagement</p>
                                        <span className="text-sm font-bold text-purple-600">{courseStats?.engagementRate ?? 85}%</span>
                                    </div>
                                    <Progress value={courseStats?.engagementRate ?? 85} color="secondary" className="h-2 rounded-full" />
                                    <p className="text-[11px] text-slate-400 mt-2 font-medium">Class attendance & interaction</p>
                                </CardBody>
                            </Card>

                            <Card className="shadow-xs border border-slate-200/80 rounded-2xl bg-white">
                                <CardBody className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completion Rate</p>
                                        <span className="text-sm font-bold text-amber-600">{courseStats?.completionRate ?? 72}%</span>
                                    </div>
                                    <Progress value={courseStats?.completionRate ?? 72} color="warning" className="h-2 rounded-full" />
                                    <p className="text-[11px] text-slate-400 mt-2 font-medium">Project & certificate completion</p>
                                </CardBody>
                            </Card>
                        </div>

                        {/* 2-Column Split: Detailed Content & Quick Specs */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column (2 Cols) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Detailed Description Card */}
                                <Card className="shadow-xs border border-slate-200/80 rounded-3xl bg-white overflow-hidden">
                                    <CardBody className="p-6 sm:p-8">
                                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                                                    <FaBookOpen />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">Course Overview & Syllabus</h3>
                                                    <p className="text-xs text-slate-500">Comprehensive curriculum guide for learners & parents</p>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                startContent={<FaEdit />}
                                                onPress={() => {
                                                    if (isAdmin) router.push(`/admin/courses/edit?id=${courseId}`);
                                                    else router.push(`/instructor/courses/edit?id=${courseId}`);
                                                }}
                                                className="text-xs font-semibold"
                                            >
                                                Edit Content
                                            </Button>
                                        </div>

                                        <div 
                                            className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-normal
                                                       prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                                                       prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3
                                                       prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                                                       prose-p:my-2.5 prose-ul:my-2.5 prose-li:my-1 prose-strong:text-slate-900"
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(courseData?.description || "")) }}
                                        />
                                    </CardBody>
                                </Card>

                                {/* Learning Outcomes Card (if available) */}
                                {Array.isArray(courseData?.learningOutcomes) && courseData.learningOutcomes.length > 0 && (
                                    <Card className="shadow-xs border border-slate-200/80 rounded-3xl bg-white">
                                        <CardBody className="p-6 sm:p-8">
                                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <FaCheckCircle className="text-emerald-500" />
                                                Key Learning Outcomes
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {courseData.learningOutcomes.map((outcome: string, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                        <FaCheck className="text-emerald-500 text-xs mt-1 shrink-0" />
                                                        <span className="text-xs sm:text-sm text-slate-700 font-medium">{outcome}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                            </div>

                            {/* Right Column (1 Col) */}
                            <div className="space-y-6">
                                {/* Course Thumbnail Card */}
                                <Card className="shadow-xs border border-slate-200/80 rounded-3xl bg-white overflow-hidden">
                                    <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                                        <img
                                            src={courseData?.thumbnail || "/courses/python-course-banner.jpg"}
                                            alt={courseData?.title || "Course"}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                                            Course Banner
                                        </div>
                                    </div>
                                    <CardBody className="p-5">
                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                            <span>Format: 16:9 Landscape</span>
                                            <span className="text-emerald-600 font-semibold">Active Banner</span>
                                        </div>
                                        <Button
                                            fullWidth
                                            size="sm"
                                            variant="bordered"
                                            startContent={<FaEdit />}
                                            onPress={() => {
                                                if (isAdmin) router.push(`/admin/courses/edit?id=${courseId}`);
                                                else router.push(`/instructor/courses/edit?id=${courseId}`);
                                            }}
                                            className="font-semibold text-xs"
                                        >
                                            Change Thumbnail
                                        </Button>
                                    </CardBody>
                                </Card>

                                {/* Lead Instructor Card */}
                                <Card className="shadow-xs border border-slate-200/80 rounded-3xl bg-white overflow-hidden">
                                    <CardBody className="p-6">
                                        <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Assigned Lead Mentor</p>
                                        <div className="flex items-center gap-4 mb-4">
                                            <img
                                                src={instructorImage}
                                                alt={instructorName}
                                                className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border-2 border-slate-200 shrink-0"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-bold text-slate-900 text-base truncate">{instructorName}</h4>
                                                <p className="text-xs font-semibold text-blue-600 truncate">{instructorRole}</p>
                                                <p className="text-[11px] text-slate-500 truncate">{instructorInstitution}</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                                            {instructorBio}
                                        </p>
                                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>Verified Lead Instructor • Batch Mentor</span>
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Course Quick Specifications */}
                                <Card className="shadow-xs border border-slate-200/80 rounded-3xl bg-white">
                                    <CardBody className="p-6">
                                        <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4">Course Specifications</p>
                                        <div className="space-y-3 text-xs sm:text-sm">
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <FaLayerGroup className="text-slate-400 text-xs" /> Level
                                                </span>
                                                <span className="font-bold text-slate-800">{courseData?.level || "Beginner to Advanced"}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <FaClock className="text-slate-400 text-xs" /> Duration
                                                </span>
                                                <span className="font-bold text-slate-800">{courseData?.duration || "12 Weeks (24 Sessions)"}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <FaUsers className="text-slate-400 text-xs" /> Batch Size
                                                </span>
                                                <span className="font-bold text-slate-800">Max 15 Students</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <FaCertificate className="text-slate-400 text-xs" /> Certificate
                                                </span>
                                                <span className="font-bold text-emerald-600">Verified Included</span>
                                            </div>
                                            <div className="flex items-center justify-between py-1.5">
                                                <span className="text-slate-500 flex items-center gap-2">
                                                    <FaChalkboardTeacher className="text-slate-400 text-xs" /> Mode
                                                </span>
                                                <span className="font-bold text-blue-600">100% Live Classes</span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Tab>

                {/* Curriculum Tab (Complete implementation) */}
                <Tab
                    key="curriculum"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaBookOpen />
                            <span>Curriculum</span>
                        </div>
                    }
                >
                    <div className="mt-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Course Curriculum</h2>
                                <p className="text-gray-600">Organize your course into modules and lessons.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="flat"
                                    isIconOnly
                                    onPress={() => refetchCourse()}
                                    title="Refresh curriculum"
                                >
                                    <FaSyncAlt className="w-4 h-4" />
                                </Button>
                                <Button
                                    color="primary"
                                    startContent={<FaPlus />}
                                    onPress={() => {
                                        setNewModuleTitle("");
                                        setNewModuleDescription("");
                                        setNewModuleResource("");
                                        setEditingModuleId(null);
                                        onOpenModuleModal();
                                    }}
                                >
                                    Add Module
                                </Button>
                            </div>
                        </div>

                        {modules.length === 0 ? (
                            <Card className="border-2 border-dashed border-gray-300">
                                <CardBody className="p-12 text-center text-gray-500">
                                    <FaBookOpen className="text-4xl mx-auto mb-3 text-gray-300" />
                                    <p className="mb-4">No curriculum content yet. Start by adding a module!</p>
                                    <Button color="primary" variant="flat" onPress={onOpenModuleModal}>Create Module</Button>
                                </CardBody>
                            </Card>
                        ) : (
                            <Accordion variant="splitted" defaultExpandedKeys={["1"]}>
                                {modules.map((module) => (
                                    <AccordionItem
                                        key={module.id}
                                        aria-label={module.title}
                                        title={
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex flex-col flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-lg">{module.title}</span>
                                                        <Chip 
                                                            size="sm" 
                                                            color={module.isPublished ? "success" : "warning"}
                                                            variant="flat"
                                                        >
                                                            {module.isPublished ? "Published" : "Draft"}
                                                        </Chip>
                                                    </div>
                                                    {module.resources && (
                                                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                                                            <FaLink />
                                                            <span>Resources attached</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm text-gray-500 mr-2">{module.lessons?.length || 0} lessons</span>
                                            </div>
                                        }
                                        subtitle={
                                            <div className="flex items-center gap-2 mt-1">
                                                {module.description && <span className="text-xs text-gray-400 max-w-sm truncate">{module.description}</span>}
                                            </div>
                                        }
                                        classNames={{
                                            title: "flex-1",
                                        }}
                                    >
                                        <div className="flex flex-col gap-2 p-2">
                                            {/* Module Actions */}
                                            <div className="flex justify-end gap-2 mb-2 pb-2 border-b">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color={module.isPublished ? "warning" : "success"}
                                                    onPress={() => {
                                                        // Toggle publish status
                                                        updateModule({
                                                            id: module.id,
                                                            isPublished: !module.isPublished,
                                                        });
                                                    }}
                                                >
                                                    {module.isPublished ? "Unpublish" : "Publish"}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    startContent={<FaEdit />}
                                                    onPress={() => {
                                                        setEditingModuleId(module.id);
                                                        setNewModuleTitle(module.title);
                                                        setNewModuleDescription(module.description || "");
                                                        setNewModuleResource(module.resources || "");
                                                        onOpenModuleModal();
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    startContent={<FaTrash />}
                                                    onPress={() => handleDeleteModule(module.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>

                                            {/* Lessons */}
                                            {module.lessons.map((lesson) => (
                                                <div
                                                    key={lesson.id}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="p-2 bg-white rounded-md shadow-sm text-gray-500">
                                                            {lesson.type === "video" ? <FaVideo /> : <FaFileAlt />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">{lesson.title}</p>
                                                                <Chip 
                                                                    size="sm" 
                                                                    color={lesson.isPublished ? "success" : "default"}
                                                                    variant="flat"
                                                                >
                                                                    {lesson.isPublished ? "Published" : "Draft"}
                                                                </Chip>
                                                                {lesson.isFreePreview && (
                                                                    <Chip size="sm" color="primary" variant="flat">
                                                                        Free Preview
                                                                    </Chip>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                                <span className="capitalize">{lesson.type}</span>
                                                                {lesson.description && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="truncate max-w-[200px]">{lesson.description}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="flat"
                                                            color={lesson.isPublished ? "warning" : "success"}
                                                            onPress={() => {
                                                                updateLesson({
                                                                    id: lesson.id,
                                                                    isPublished: !lesson.isPublished,
                                                                });
                                                            }}
                                                        >
                                                            {lesson.isPublished ? "Unpublish" : "Publish"}
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            onPress={() => {
                                                                setCurrentModuleId(module.id);
                                                                setEditingLessonId(lesson.id);
                                                                setNewLesson(lesson);
                                                                setContentLinks(lesson.contentLinks || []);
                                                                onOpenLessonModal();
                                                            }}
                                                        >
                                                            <FaEdit className="text-gray-500" />
                                                        </Button>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            color="danger"
                                                            onPress={() => handleDeleteLesson(module.id, lesson.id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                            <Button
                                                className="mt-2"
                                                variant="bordered"
                                                startContent={<FaPlus />}
                                                onPress={() => {
                                                    setCurrentModuleId(module.id);
                                                    setEditingLessonId(null);
                                                    setNewLesson({ type: "video" });
                                                    setContentLinks([]);
                                                    onOpenLessonModal();
                                                }}
                                            >
                                                Add Lesson
                                            </Button>
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </Tab>

                {/* Students Tab */}
                <Tab
                    key="students"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaUsers />
                            <span>Students</span>
                        </div>
                    }
                >
                    <EnrolledStudentsList courseId={courseId} />
                </Tab>

                {/* ASSESSMENTS TAB - Unified view of all assessment types */}
                <Tab
                    key="assessments"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaClipboardList />
                            <span>Assessments</span>
                        </div>
                    }
                >
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">Course Assessments</h2>
                                <p className="text-gray-600">Manage quizzes, exams, assignments, and projects for this course.</p>
                            </div>
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        color="primary"
                                        size="lg"
                                        startContent={<FaPlus />}
                                    >
                                        Create Assessment
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Assessment types">
                                    <DropdownItem
                                        key="quiz"
                                        startContent={<FaClipboardList />}
                                        onPress={() => router.push(`/instructor/quizzes/create?courseId=${courseId}&type=quiz`)}
                                    >
                                        Quiz
                                    </DropdownItem>
                                    <DropdownItem
                                        key="mid-exam"
                                        startContent={<FaGraduationCap />}
                                        onPress={() => router.push(`/instructor/assignments/create?courseId=${courseId}&type=mid-term`)}
                                    >
                                        Mid Exam
                                    </DropdownItem>
                                    <DropdownItem
                                        key="final-exam"
                                        startContent={<FaGraduationCap />}
                                        onPress={() => router.push(`/instructor/assignments/create?courseId=${courseId}&type=final-exam`)}
                                    >
                                        Final Exam
                                    </DropdownItem>
                                    <DropdownItem
                                        key="assignment"
                                        startContent={<FaFileAlt />}
                                        onPress={() => router.push(`/instructor/assignments/create?courseId=${courseId}&type=assignment`)}
                                    >
                                        Assignment
                                    </DropdownItem>
                                    <DropdownItem
                                        key="project"
                                        startContent={<FaFileAlt />}
                                        onPress={() => router.push(`/instructor/assignments/create?courseId=${courseId}&type=project`)}
                                    >
                                        Project
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {assessments.map((assessment: any) => (
                                <Card key={assessment._id || assessment.id} className="hover:shadow-md transition-shadow">
                                    <CardBody className="p-4 flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${assessment.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                                                assessment.type === 'mid-exam' ? 'bg-orange-100 text-orange-600' :
                                                    assessment.type === 'final-exam' ? 'bg-red-100 text-red-600' :
                                                        assessment.type === 'project' ? 'bg-green-100 text-green-600' :
                                                            'bg-blue-100 text-blue-600'
                                                }`}>
                                                <FaClipboardList className="text-xl" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-lg">{assessment.title}</h3>
                                                    <Chip size="sm" variant="flat" color="secondary" className="capitalize">
                                                        {assessment.type.replace("-", " ")}
                                                    </Chip>
                                                    <Chip size="sm" variant="dot" color={getStatusColor(assessment.status) as any}>
                                                        {assessment.status}
                                                    </Chip>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {assessment.type === 'assignment' || assessment.type === 'project'
                                                        ? `Due: ${assessment.dueDate ? new Date(assessment.dueDate).toLocaleDateString() : "N/A"}`
                                                        : `${assessment.questions || 0} Questions`}
                                                    {' • '}
                                                    <span className="font-medium text-primary cursor-pointer hover:underline">
                                                        {assessment.submissionsCount || 0} Submissions
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="flat" 
                                                color="primary"
                                                startContent={<FaEye />}
                                                onPress={() => {
                                                    // Navigate to unified assessments page
                                                    router.push(`/instructor/assessments?courseId=${courseId}`);
                                                }}
                                            >
                                                View All
                                            </Button>
                                            <Button isIconOnly variant="light" onPress={() => router.push(`/instructor/quizzes/${assessment.id}/edit`)}>
                                                <FaEdit className="text-gray-500" />
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}

                            {assessments.length === 0 && (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <FaClipboardList className="text-4xl text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-4">No assessments created for this course yet.</p>
                                    <p className="text-sm text-gray-400 mb-4">Create quizzes, exams, assignments, or projects to assess student learning.</p>
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        startContent={<FaPlus />}
                                        onPress={() => router.push(`/instructor/assessments?courseId=${courseId}`)}
                                    >
                                        Go to Assessments
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Tab>
            </Tabs>

            {/* Module Modal */}
            <Modal isOpen={isModuleModalOpen} onClose={onCloseModuleModal} size="2xl">
                <ModalContent>
                    <ModalHeader>{editingModuleId ? "Edit Module" : "Add New Module"}</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Module Title"
                            placeholder="e.g., Introduction to CSS"
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            isRequired
                        />
                        <Textarea
                            label="Description"
                            placeholder="Brief summary of this module..."
                            minRows={2}
                            className="mt-4"
                            value={newModuleDescription}
                            onChange={(e) => setNewModuleDescription(e.target.value)}
                        />

                        {/* Module Resource Section */}
                      

                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onCloseModuleModal}>Cancel</Button>
                        <Button color="primary" onPress={handleSaveModule}>Save Module</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Lesson Modal */}
            <Modal isOpen={isLessonModalOpen} onClose={onCloseLessonModal} size="4xl">
                <ModalContent>
                    <ModalHeader>{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</ModalHeader>
                    <ModalBody className="overflow-y-auto max-h-[80vh]">
                        {/* Lesson Title */}
                        <Input
                            label="Lesson Title *"
                            placeholder="e.g., CSS Selectors Introduction"
                            value={newLesson.title || ""}
                            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                            isRequired
                            size="lg"
                            className="font-semibold"
                        />

                        {/* Lesson Type */}
                        <div className="mt-4">
                            <label className="text-sm font-medium block mb-2">Content Type *</label>
                            <div className="flex gap-3 flex-wrap">
                                <Button
                                    size="sm"
                                    color={newLesson.type === "video" ? "primary" : "default"}
                                    variant={newLesson.type === "video" ? "solid" : "bordered"}
                                    onPress={() => setNewLesson({ ...newLesson, type: "video" })}
                                    startContent={<FaVideo />}
                                    className="font-semibold"
                                >
                                    Video
                                </Button>
                                <Button
                                    size="sm"
                                    color={newLesson.type === "pdf" ? "primary" : "default"}
                                    variant={newLesson.type === "pdf" ? "solid" : "bordered"}
                                    onPress={() => setNewLesson({ ...newLesson, type: "pdf" })}
                                    startContent={<FaFileAlt />}
                                    className="font-semibold"
                                >
                                    Article
                                </Button>
                            </div>
                        </div>

                        {/* Rich Text Description Editor */}
                        <div className="mt-4">
                            <label className="text-sm font-semibold block mb-2">Description</label>
                            <div className="border rounded-lg overflow-hidden bg-white">
                                <ReactQuill
                                    value={newLesson.description || ""}
                                    onChange={(value) => setNewLesson({ ...newLesson, description: value })}
                                    theme="snow"
                                    modules={{
                                        toolbar: [
                                            ["bold", "italic", "underline", "strike"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            ["blockquote", "code-block"],
                                            ["link"],
                                            ["clean"],
                                        ],
                                    }}
                                    style={{ minHeight: "150px" }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Add detailed description with formatting</p>
                        </div>

                        {/* Primary Content URL */}
                        <div className="mt-4">
                            <label className="text-sm font-semibold block mb-2">Primary Content URL</label>
                            <Input
                                placeholder="e.g., https://www.youtube.com/watch?v=..."
                                startContent={<FaLink className="text-gray-400" />}
                                value={newLesson.contentUrl || ""}
                                onChange={(e) => setNewLesson({ ...newLesson, contentUrl: e.target.value })}
                                description="Primary video/document link"
                                size="sm"
                            />
                        </div>

                        {/* Additional Content Links */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-sm flex items-center gap-2">
                                    <FaPlus className="text-sm" /> Additional Resources
                                </h4>
                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    startContent={<FaPlus />}
                                    onPress={() => {
                                        setContentLinks([
                                            ...contentLinks,
                                            { title: "", url: "", type: "other", isPrimary: false },
                                        ]);
                                    }}
                                >
                                    Add Link
                                </Button>
                            </div>

                            {contentLinks.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No additional links added yet. Click "Add Link" to include Google Drive, documents, or other resources.</p>
                            ) : (
                                <div className="space-y-3">
                                    {contentLinks.map((link, idx) => (
                                        <div key={idx} className="p-3 bg-white border border-gray-200 rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                                                {/* Link Title */}
                                                <Input
                                                    size="sm"
                                                    placeholder="e.g., Lecture Notes"
                                                    value={link.title}
                                                    onChange={(e) => {
                                                        const updated = [...contentLinks];
                                                        updated[idx].title = e.target.value;
                                                        setContentLinks(updated);
                                                    }}
                                                    label="Title"
                                                />

                                                {/* Link Type */}
                                                <select
                                                    className="h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm"
                                                    value={link.type}
                                                    onChange={(e) => {
                                                        const updated = [...contentLinks];
                                                        updated[idx].type = e.target.value as any;
                                                        setContentLinks(updated);
                                                    }}
                                                >
                                                    <option value="video">Video</option>
                                                    <option value="drive">Google Drive</option>
                                                    <option value="pdf">PDF</option>
                                                    <option value="resource">Resource</option>
                                                    <option value="other">Other</option>
                                                </select>

                                                {/* Delete Button */}
                                                <div className="flex items-end gap-1">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onPress={() => {
                                                            setContentLinks(contentLinks.filter((_, i) => i !== idx));
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Link URL */}
                                            <Input
                                                size="sm"
                                                placeholder="https://drive.google.com/..."
                                                value={link.url}
                                                onChange={(e) => {
                                                    const updated = [...contentLinks];
                                                    updated[idx].url = e.target.value;
                                                    setContentLinks(updated);
                                                }}
                                                startContent={<FaLink className="text-gray-400 text-xs" />}
                                                label="URL"
                                                className="mb-2"
                                            />

                                            {/* Primary Link Checkbox */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id={`primary-${idx}`}
                                                    checked={link.isPrimary || false}
                                                    onChange={(e) => {
                                                        const updated = [...contentLinks];
                                                        updated[idx].isPrimary = e.target.checked;
                                                        setContentLinks(updated);
                                                    }}
                                                    className="w-4 h-4 text-primary rounded"
                                                />
                                                <label
                                                    htmlFor={`primary-${idx}`}
                                                    className="text-xs cursor-pointer flex items-center gap-1 select-none"
                                                >
                                                    <FaStar className="text-yellow-500 text-xs" /> Mark as primary
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Free Preview Toggle */}
                        <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <input
                                type="checkbox"
                                id="freePreview"
                                checked={newLesson.isFreePreview || false}
                                onChange={(e) => setNewLesson({ ...newLesson, isFreePreview: e.target.checked })}
                                className="w-4 h-4 text-primary rounded"
                            />
                            <label htmlFor="freePreview" className="text-sm select-none cursor-pointer font-medium">
                                Make this lesson free for preview (allow non-enrolled users to view)
                            </label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onCloseLessonModal}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSaveLesson}>
                            {editingLessonId ? "Update Lesson" : "Create Lesson"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div >
    );
}


// Enrolled Students List Component
function EnrolledStudentsList({ courseId }: { courseId: string }) {
    const { data: studentsResp, isLoading, error } = useGetEnrolledStudentsQuery({ 
        courseId, 
        page: 1, 
        limit: 20 
    });

    const students = studentsResp?.data?.students || [];
    const totalCount = studentsResp?.data?.pagination?.total || 0;

    if (isLoading) {
        return (
            <Card className="mt-6">
                <CardBody className="p-8 text-center">
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                    <p className="text-gray-500 mt-4">Loading enrolled students...</p>
                </CardBody>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="mt-6 border-2 border-red-200">
                <CardBody className="p-8 text-center">
                    <p className="text-red-500">Failed to load enrolled students</p>
                    <p className="text-sm text-gray-500 mt-2">{(error as any)?.data?.message || "Unknown error"}</p>
                </CardBody>
            </Card>
        );
    }

    if (students.length === 0) {
        return (
            <Card className="mt-6">
                <CardBody className="p-8 text-center text-gray-500">
                    <FaGraduationCap className="text-6xl mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold mb-2">No Students Enrolled Yet</h3>
                    <p>Students who purchase this course will appear here.</p>
                </CardBody>
            </Card>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="mt-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <FaUsers className="text-2xl text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <p className="text-2xl font-bold">{totalCount}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <FaBookOpen className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Showing</p>
                                <p className="text-2xl font-bold">{students.length} of {totalCount}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Students List */}
            <Card>
                <CardBody className="p-6">
                    <h3 className="text-xl font-bold mb-4">Enrolled Students</h3>
                    <div className="space-y-3">
                        {students.map((student) => (
                            <div
                                key={student._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {student.profileImage ? (
                                        <img
                                            src={student.profileImage}
                                            alt={student.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                            {student.name[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-lg">{student.name}</p>
                                        <p className="text-sm text-gray-500">{student.email}</p>
                                        {student.phone && (
                                            <p className="text-sm text-gray-400">{student.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color={student.accessType === "quarterly" ? "success" : "primary"}
                                        className="mb-2"
                                    >
                                        {student.accessType === "quarterly" ? "All Courses" : "Single Course"}
                                    </Chip>
                                    <p className="text-xs text-gray-500">
                                        Enrolled: {formatDate(student.enrolledAt)}
                                    </p>
                                    {student.expiresAt && (
                                        <p className="text-xs text-gray-500">
                                            Expires: {formatDate(student.expiresAt)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
