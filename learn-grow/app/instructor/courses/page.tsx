"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardFooter,
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
    Select,
    SelectItem,
    Switch,
    Pagination,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaChartLine } from "react-icons/fa";
import { useGetInstructorCoursesQuery, useCreateCourseMutation, useDeleteCourseMutation } from "@/redux/api/courseApi";
import { useGetInstructorStatsQuery } from "@/redux/api/userApi";
import { refreshUserStatus, getApprovalStatus } from "@/lib/utils/userStatus";

// Course level options
const COURSE_LEVELS = [
    { key: "Beginner", label: "Beginner" },
    { key: "Intermediate", label: "Intermediate" },
    { key: "Advanced", label: "Advanced" },
    { key: "Expert", label: "Expert" },
];

// Popular languages including Bangla
const COURSE_LANGUAGES = [
    { key: "English", label: "English" },
    { key: "Bangla", label: "Bangla (বাংলা)" },
    { key: "Spanish", label: "Spanish" },
    { key: "French", label: "French" },
    { key: "German", label: "German" },
    { key: "Chinese", label: "Chinese (中文)" },
    { key: "Japanese", label: "Japanese (日本語)" },
    { key: "Arabic", label: "Arabic (العربية)" },
    { key: "Hindi", label: "Hindi (हिंदी)" },
    { key: "Portuguese", label: "Portuguese" },
];

export default function InstructorCoursesPage() {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Language sync
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

    const resolveCourseBanner = (url?: string, title?: string) => {
        if (url && (url.startsWith("http") || url.startsWith("/")) && !url.includes("placeholder") && !url.includes("via.placeholder")) {
            return url;
        }
        const t = (title || "").toLowerCase();
        if (t.includes("robot") || t.includes("arduino") || t.includes("stem")) {
            return "/courses/robotics-course-banner.jpg";
        }
        return "/courses/python-course-banner.jpg";
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [instructorId, setInstructorId] = useState<string | null>(null);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const checkAndRefreshApprovalStatus = async () => {
        // Fetch fresh user data from server
        const freshUser = await refreshUserStatus();
        if (freshUser) {
            const freshApprovalStatus = !!freshUser.isApproved;
            setIsApproved(freshApprovalStatus);
        }
    };

    // Resolve current instructor id from local storage (client-only)
    useEffect(() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw) {
                const parsed = JSON.parse(raw);
                setInstructorId(parsed?._id || parsed?.id || null);
                setIsApproved(!!parsed?.isApproved);
            }
        } catch (_) {
            setInstructorId(null);
            setIsApproved(false);
        }
    }, []);

    // Poll for approval status changes every 5 seconds when not approved
    useEffect(() => {
        if (isApproved) return; // Stop polling once approved

        const interval = setInterval(() => {
            checkAndRefreshApprovalStatus();
        }, 5000);

        return () => clearInterval(interval);
    }, [isApproved]);

    // Check approval on page focus
    useEffect(() => {
        const handleFocus = () => {
            checkAndRefreshApprovalStatus();
        };

        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    // Data query for instructor courses (stateless, skips until id ready)
    const { data: instructorCoursesResp, isLoading } = useGetInstructorCoursesQuery(
        { instructorId: instructorId as string, page: currentPage, limit: itemsPerPage },
        { skip: !instructorId }
    );

    // Get instructor stats for accurate totals
    const { data: statsData } = useGetInstructorStatsQuery(
        { instructorId: instructorId as string },
        { skip: !instructorId }
    );
    const stats = statsData?.data;

    // Mutations
    const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();

    // Mock courses data - replace with API
    // Mock courses data - replace with API
    const [courses, setCourses] = useState<any[]>([]);

    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        category: "",
        type: "recorded",
        price: "",
        level: "Beginner",
        language: "English",
        duration: "",
        thumbnailUrl: "",
        isRegistrationOpen: false,
        registrationDeadline: "",
    });
    const [courseErrors, setCourseErrors] = useState<Record<string, string>>({});

    // Prefer API data when available
    const hydratedCourses = Array.isArray(instructorCoursesResp?.data)
        ? instructorCoursesResp!.data
        : courses;

    // Get pagination info from API response
    const totalPages = instructorCoursesResp?.pagination?.totalPages || 1;

    // Filter courses by search (client-side for now)
    const filteredCourses = hydratedCourses.filter((course: any) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleCreateCourse = () => {
        // Reset errors
        setCourseErrors({});
        const errors: Record<string, string> = {};

        // Validation
        if (!newCourse.title || newCourse.title.length < 5) {
            errors.title = "Title must be at least 5 characters";
        }
        if (!newCourse.description || newCourse.description.length < 20) {
            errors.description = "Description must be at least 20 characters";
        }
        if (!newCourse.price) {
            errors.price = "Price is required";
        }
        if (!newCourse.duration) {
            errors.duration = "Duration is required";
        }
        if (!newCourse.level) {
            errors.level = "Level is required";
        }
        if (!newCourse.language) {
            errors.language = "Language is required";
        }
        if (!newCourse.thumbnailUrl) {
            errors.thumbnailUrl = "Thumbnail URL is required";
        }

        if (Object.keys(errors).length > 0) {
            setCourseErrors(errors);
            return;
        }

        if (instructorId) {
            createCourse({
                title: newCourse.title,
                description: newCourse.description,
                category: newCourse.category,
                type: newCourse.type as any,
                price: parseInt(newCourse.price),
                level: newCourse.level,
                language: newCourse.language,
                duration: parseInt(newCourse.duration),
                thumbnail: newCourse.thumbnailUrl,
                isRegistrationOpen: !!newCourse.isRegistrationOpen,
                registrationDeadline: newCourse.registrationDeadline ? newCourse.registrationDeadline : undefined,
                instructorId: instructorId,
            } as any).then(() => {
                setNewCourse({ title: "", description: "", category: "", type: "recorded", price: "", level: "Beginner", language: "English", duration: "", thumbnailUrl: "", isRegistrationOpen: false, registrationDeadline: "" });
                setCourseErrors({});
                onClose();
                alert("Course created successfully!");
            }).catch((err: any) => {
                // Handle API validation errors
                const apiErrors = err.data?.errors;
                if (Array.isArray(apiErrors)) {
                    const fieldErrors: Record<string, string> = {};
                    apiErrors.forEach((err: any) => {
                        const field = err.field?.split(".").pop() || "general";
                        fieldErrors[field] = err.message;
                    });
                    setCourseErrors(fieldErrors);
                } else {
                    setCourseErrors({ general: "Failed to create course. Please try again." });
                }
            });
        } else {
            setCourseErrors({ general: "You must be logged in to create a course." });
        }
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            setCourses(courses.filter((c) => c.id !== id));
            alert("Course deleted!");
        }
    };

    const getStatusColor = (status: string) => {
        return status === "published" ? "success" : "warning";
    };

    // Gracefully format dates from API or fallback fields
    const formatDate = (value?: string) => {
        if (!value) return "Not set";
        const parsed = new Date(value);
        return isNaN(parsed.getTime()) ? "Not set" : parsed.toLocaleDateString();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
            {/* Ambient Kodland Hero */}
            <div className="relative mb-8 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] p-6 sm:p-10 text-white shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                {lang === "bn" ? "ইনস্ট্রাক্টর কারিকুলাম হাব" : "Educator Curriculum Hub"}
                            </span>
                            <span className="text-xs text-white/50 font-medium">
                                {lang === "bn" ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-Batches"}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                            {lang === "bn" ? "আমার কোর্স ও মডিউলসমূহ" : "My Course Portfolio"}
                        </h1>
                        <p className="text-sm sm:text-base text-indigo-200/80 max-w-2xl">
                            {lang === "bn"
                                ? "আপনার পরিচালিত লাইভ কোর্স, লেসন মডিউল এবং শিক্ষার্থীদের প্রজেক্ট প্রগ্রেস পরিচালনা করুন।"
                                : "Manage your interactive live cohorts, curriculum modules, and project milestones."}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <Button
                            variant="flat"
                            onPress={() => router.push("/instructor")}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/15 min-h-[44px]"
                        >
                            {lang === "bn" ? "ড্যাশবোর্ডে ফিরুন" : "Back to Hub"}
                        </Button>
                        <Button
                            color="primary"
                            startContent={<FaPlus />}
                            onPress={() => router.push("/instructor/courses/create")}
                            isLoading={isLoading || isCreating}
                            isDisabled={!isApproved}
                            className="bg-[#3B82F6] hover:bg-blue-600 font-bold rounded-xl shadow-lg min-h-[44px]"
                        >
                            {lang === "bn" ? "নতুন কোর্স তৈরি করুন" : "Create New Course"}
                        </Button>
                    </div>
                </div>
            </div>

            {!isApproved && (
                <Card className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50/80">
                    <CardBody className="p-4 sm:p-5 flex flex-row items-center gap-3 text-amber-800">
                        <span className="text-xl font-bold text-amber-500">!</span>
                        <p className="text-sm font-medium">
                            {lang === "bn"
                                ? "আপনার শিক্ষক প্রোফাইলটি অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে। অনুমোদন পাওয়ার পর নতুন কোর্স তৈরি করতে পারবেন।"
                                : "Your instructor profile is pending admin approval. You can browse your courses but cannot publish new ones yet."}
                        </p>
                    </CardBody>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
                <Card className="rounded-[24px] border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                    <CardBody className="p-5">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                            {lang === "bn" ? "মোট কোর্স" : "Total Courses"}
                        </p>
                        <p className="text-3xl font-black text-[#2C2C2C]">{hydratedCourses?.length || 0}</p>
                    </CardBody>
                </Card>

                <Card className="rounded-[24px] border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                    <CardBody className="p-5">
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                            {lang === "bn" ? "প্রকাশিত কোর্স" : "Published"}
                        </p>
                        <p className="text-3xl font-black text-emerald-600">
                            {hydratedCourses?.filter((c: any) => c.isPublished)?.length || 0}
                        </p>
                    </CardBody>
                </Card>

                <Card className="rounded-[24px] border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                    <CardBody className="p-5">
                        <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
                            {lang === "bn" ? "মোট শিক্ষার্থী" : "Total Students"}
                        </p>
                        <p className="text-3xl font-black text-purple-600">
                            {stats?.totalStudents || 0}
                        </p>
                    </CardBody>
                </Card>

                <Card className="rounded-[24px] border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
                    <CardBody className="p-5">
                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                            {lang === "bn" ? "গড় রেটিং" : "Avg. Rating"}
                        </p>
                        <p className="text-3xl font-black text-amber-600">
                            {(
                                hydratedCourses
                                    .filter((c: any) => c.rating)
                                    .reduce((sum: number, c: any) => sum + (c.rating || 0), 0) /
                                hydratedCourses.filter((c: any) => c.rating).length || 0
                            ).toFixed(1)} ⭐
                        </p>
                    </CardBody>
                </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
                <Input
                    placeholder={lang === "bn" ? "কোর্সের নাম দিয়ে খুঁজুন..." : "Search courses by title..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                    startContent={<FaEdit className="text-gray-400" />}
                    classNames={{
                        inputWrapper: "rounded-[20px] bg-white border border-gray-200 shadow-sm min-h-[50px]",
                    }}
                />
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course: any, index: number) => (
                    <Card key={course._id || course.id || index} className="rounded-[24px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                                src={resolveCourseBanner(course.thumbnail, course.title)}
                                alt={course.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = course.title?.toLowerCase().includes("robot")
                                        ? "/courses/robotics-course-banner.jpg"
                                        : "/courses/python-course-banner.jpg";
                                }}
                            />
                            <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                                    {lang === "bn" ? "১০-১৫ ব্যাচ" : "10-15 Batch"}
                                </span>
                            </div>
                            <div className="absolute top-3 right-3">
                                <Chip color={getStatusColor(course.isPublished ? "published" : "draft") as any} size="sm" variant="solid" className="font-bold">
                                    {course.isPublished ? (lang === "bn" ? "প্রকাশিত" : "PUBLISHED") : (lang === "bn" ? "ড্রাফট" : "DRAFT")}
                                </Chip>
                            </div>
                        </div>

                        <CardBody className="p-5">
                            {/* Course Title */}
                            <h3 className="font-black text-lg text-[#2C2C2C] mb-3 line-clamp-2">{course.title}</h3>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="text-sm text-gray-600">
                                    <span className="font-black text-emerald-600">{course.price || "N/A"} BDT</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <span className="font-semibold text-blue-600">
                                      {course.accessDuration === "lifetime" ? "Lifetime" : `${course.accessDuration || "N/A"} Mo`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 col-span-2 mt-1">
                                    <span className="font-bold text-gray-700">{course.modulesCount ?? course.modules?.length ?? 0}</span>
                                    <span>{lang === "bn" ? "টি মডিউল" : "Modules"}</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="font-bold text-gray-700">{course.lessonsCount ?? 0}</span>
                                    <span>{lang === "bn" ? "টি লেসন" : "Lessons"}</span>
                                </div>
                            </div>

                            {/* Last Updated */}
                            <p className="text-[11px] text-gray-400">
                                {lang === "bn" ? "আপডেট:" : "Updated:"} {formatDate(course.updatedAt || course.lastUpdated || course.createdAt)}
                            </p>
                        </CardBody>

                        <CardFooter className="p-5 pt-0 flex gap-2">
                            <Button
                                size="sm"
                                variant="bordered"
                                startContent={<FaEye />}
                                className="flex-1 rounded-xl font-bold border-gray-200 hover:border-gray-400"
                                onPress={() => router.push(`/instructor/courses/${course._id || course.id}`)}
                            >
                                {lang === "bn" ? "দেখুন" : "View"}
                            </Button>
                            <Button
                                size="sm"
                                color="primary"
                                variant="flat"
                                startContent={<FaChartLine />}
                                className="flex-1 rounded-xl font-bold bg-blue-50 text-blue-600 hover:bg-blue-100"
                                onPress={() => router.push(`/instructor/courses/${course._id || course.id}`)}
                            >
                                {lang === "bn" ? "বিশ্লেষণ" : "Analytics"}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <Pagination
                        total={totalPages}
                        page={currentPage}
                        onChange={setCurrentPage}
                        showControls
                        color="primary"
                    />
                </div>
            )}

            {/* Modal removed; creation now on /instructor/courses/create */}
        </div>
    );
}
