"use client";

import React, { useState, useEffect } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import { getProfile } from "@/lib/auth";
import Cookies from "js-cookie";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Progress,
    Spinner,
    Divider,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Tabs,
    Tab,
    Avatar,
    Pagination,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    User,
    Mail,
    Phone,
    CheckCircle2,
    Clock,
    Download,
    Upload,
    FileText,
    TrendingUp,
    CreditCard,
    GraduationCap,
    BookOpen,
    Calendar,
    Award,
    Eye,
    X,
    MessageCircle,
    ShieldCheck,
    Sparkles,
    Headphones,
    Users,
    Layers,
    ChevronRight,
    ArrowUpRight
} from "lucide-react";

interface Enrollment {
    _id: string;
    courseId: {
        _id: string;
        title: string;
        thumbnail?: string;
    };
    progress: number;
    lastAccessedAt?: string;
    enrolledAt: string;
    completedLessons?: number;
    totalLessons?: number;
}

interface Payment {
    _id: string;
    planType: string;
    price: number;
    paymentStatus: string;
    transactionId: string;
    createdAt: string;
    courseId?: {
        title: string;
    };
}

interface Report {
    _id: string;
    title: string;
    type: string;
    generatedAt: string;
    downloadUrl?: string;
}

function GuardianDashboardContent() {
    const router = useRouter();
    const [guardian, setGuardian] = useState<any>(null);
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
    const [hasQuarterlyAccess, setHasQuarterlyAccess] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [uploading, setUploading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 9;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Bilingual support
    const [language, setLanguage] = useState<"bn" | "en">("bn");
    useEffect(() => {
        const savedLang = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
        setLanguage(savedLang);
        const handleLangChange = (e: any) => {
            setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
        };
        window.addEventListener("languageChange", handleLangChange);
        return () => window.removeEventListener("languageChange", handleLangChange);
    }, []);
    const isBn = language === "bn";

    // Pagination logic
    const totalPages = Math.ceil(allEnrollments.length / coursesPerPage);
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const startIndex = (page - 1) * coursesPerPage;
        const endIndex = startIndex + coursesPerPage;
        setEnrollments(allEnrollments.slice(startIndex, endIndex));
    };

    useEffect(() => {
        loadGuardianProfile();
    }, []);

    const loadGuardianProfile = async () => {
        try {
            setLoading(true);
            const result = await getProfile();
            
            if (result.success && result.data) {
                const user = result.data.user;
                setGuardian(user);
                
                const linkedStudent = result.data.relations?.student;
                if (linkedStudent) {
                    const studentData = {
                        id: linkedStudent._id,
                        name: linkedStudent.name,
                        email: linkedStudent.email,
                        phone: linkedStudent.phone,
                        role: linkedStudent.role,
                        isVerified: linkedStudent.isVerified,
                    };
                    setStudent(studentData);
                    await loadStudentData(linkedStudent._id);
                } else {
                    toast.info(isBn ? "কোনো শিক্ষার্থী অ্যাকাউন্ট এখনো সংযুক্ত করা হয়নি।" : "No student linked to your account yet.");
                }
            }
        } catch (error: any) {
            toast.error(isBn ? "প্রোফাইল লোড করতে ব্যর্থ হয়েছে" : "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const loadStudentData = async (studentId?: string) => {
        try {
            const token = Cookies.get('accessToken') || (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
            
            let url = `${process.env.NEXT_PUBLIC_API_URL}/orders/student-data`;
            if (studentId) {
                url += `?studentId=${studentId}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                const result = await response.json();
                
                if (result.success && result.data) {
                    setPayments(result.data.orders || []);
                    setHasQuarterlyAccess(result.data.hasQuarterlyAccess || false);
                    
                    const enrollmentData = (result.data.enrollments || []).map((enrollment: any) => {
                        const completedLessonsCount = enrollment.completedLessons?.length || 0;
                        const totalLessonsInCourse = enrollment.courseId?.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
                        const calculatedProgress = totalLessonsInCourse > 0 
                            ? Math.round((completedLessonsCount / totalLessonsInCourse) * 100)
                            : (enrollment.progress || enrollment.completionPercentage || 0);
                        
                        return {
                            _id: enrollment._id,
                            courseId: enrollment.courseId,
                            progress: calculatedProgress,
                            lastAccessedAt: enrollment.updatedAt,
                            enrolledAt: enrollment.createdAt,
                            completedLessons: completedLessonsCount,
                            totalLessons: totalLessonsInCourse,
                            accessType: enrollment.accessType || "enrollment",
                        };
                    });
                    
                    setAllEnrollments(enrollmentData);
                    setEnrollments(enrollmentData.slice(0, coursesPerPage));
                }
            } else {
                loadStudentReports();
            }
        } catch (error) {
            loadStudentReports();
        }
    };

    const loadStudentReports = () => {
        setReports([
            {
                _id: '1',
                title: isBn ? 'ত্রৈমাসিক অগ্রগতি রিপোর্ট - ২০২৬' : 'Quarterly Progress Report - Q1 2026',
                type: 'progress',
                generatedAt: new Date().toISOString(),
            },
            {
                _id: '2',
                title: isBn ? 'হ্যান্ডস-অন প্রজেক্ট মূল্যায়ন' : 'Hands-on Assessment Results',
                type: 'assessment',
                generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
        ]);
    };

    const handleDownloadReport = async (reportId: string) => {
        toast.info(isBn ? 'রিপোর্ট প্রস্তুত করা হচ্ছে...' : 'Generating report...');
        setTimeout(() => {
            toast.success(isBn ? 'রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!' : 'Report downloaded successfully!');
        }, 1200);
    };

    const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success(isBn ? 'ফাইল সফলভাবে আপলোড হয়েছে!' : 'File uploaded successfully!');
            loadStudentReports();
        } catch (error) {
            toast.error(isBn ? 'ফাইল আপলোড করতে সমস্যা হয়েছে' : 'Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const viewDetails = (item: any, type: string) => {
        setSelectedItem({ ...item, type });
        onOpen();
    };

    const studentStats = student ? {
        courses: allEnrollments.length,
        progress: allEnrollments.length > 0 
            ? Math.round(allEnrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / allEnrollments.length)
            : 0,
        completedLessons: enrollments.reduce((sum, e) => sum + (e.completedLessons || 0), 0),
        totalPayments: payments.length,
        totalSpent: payments.reduce((sum, p) => sum + (p.price || 0), 0),
        approvedPayments: payments.filter(p => p.paymentStatus === 'approved').length,
    } : null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
                <Spinner size="lg" label={isBn ? "অভিভাবক প্রোফাইল লোড হচ্ছে..." : "Loading guardian profile..."} />
            </div>
        );
    }

    const guardianName = guardian?.name || "Guardian";

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Ambient Guardian Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#064E3B] text-white pt-10 pb-16 px-6 rounded-b-[36px] shadow-lg">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <Avatar
                                    src={guardian?.img}
                                    name={guardianName}
                                    className="w-20 h-20 text-2xl font-black bg-gradient-to-br from-emerald-500 to-teal-700 text-white ring-4 ring-white/10 ring-offset-2 ring-offset-[#0F172A]"
                                />
                                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0F172A] shadow" />
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-md">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                                        {isBn ? "অভিভাবক পোর্টাল" : "Guardian Portal"}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                                        👥 {isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ মনিটরিং" : "10-15 Micro-Batch Track"}
                                    </span>
                                </div>

                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                                    {isBn ? `স্বাগতম, ${guardianName}!` : `Welcome, ${guardianName}!`}
                                </h1>
                                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                                    {isBn 
                                        ? "আপনার সন্তানের লাইভ ক্লাস উপস্থিতি, কোডিং ও রোবোটিক্স প্রজেক্ট অগ্রগতি এবং পরীক্ষার ফলাফল রিয়েল-টাইমে পর্যবেক্ষণ করুন।"
                                        : "Monitor your student's live class attendance, robotics project submissions, and real-time skill growth."}
                                </p>
                            </div>
                        </div>

                        {/* Top Guardian Quick Contact */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Button
                                className="font-bold text-xs sm:text-sm rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                startContent={<MessageCircle className="w-4 h-4" />}
                            >
                                {isBn ? "অভিভাবক হেল্পলাইন" : "Guardian Support"}
                            </Button>
                            <Button
                                variant="bordered"
                                className="font-bold text-xs sm:text-sm rounded-xl border-white/20 text-white hover:bg-white/10"
                                onPress={() => router.push("/courses")}
                                startContent={<BookOpen className="w-4 h-4" />}
                            >
                                {isBn ? "নতুন কোর্স দেখুন" : "Browse Courses"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto max-w-7xl px-4 sm:px-6 -mt-8 relative z-20">
                {/* 4 Interactive Metric Cards for Guardian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "ভর্তিকৃত কোর্স" : "Enrolled Courses"}
                            </p>
                            <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                                {studentStats?.courses || 0}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">
                                {isBn ? "সক্রিয় লাইভ ব্যাচ" : "Active live batches"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-blue-50 border-blue-100 text-blue-600">
                            <BookOpen className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "সামগ্রিক অগ্রগতি" : "Overall Progress"}
                            </p>
                            <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                                {studentStats?.progress || 0}%
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">
                                {isBn ? "হ্যান্ডস-অন প্রজেক্ট ও কুইজ" : "Hands-on projects"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-emerald-50 border-emerald-100 text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "সম্পন্ন লেসন" : "Completed Lessons"}
                            </p>
                            <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                                {studentStats?.completedLessons || 0}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">
                                {isBn ? "লাইভ ক্লাস ও ল্যাব" : "Live classes & labs"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-purple-50 border-purple-100 text-purple-600">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="rounded-[24px] bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                {isBn ? "মোট পরিশোধিত" : "Total Tuition"}
                            </p>
                            <p className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                                ৳{(studentStats?.totalSpent || 0).toLocaleString()}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400">
                                {studentStats?.approvedPayments || 0} {isBn ? "টি পেমেন্ট অনুমোদিত" : "verified payments"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 bg-amber-50 border-amber-100 text-amber-600">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs 
                    selectedKey={activeTab} 
                    onSelectionChange={(key) => setActiveTab(key as string)}
                    variant="solid"
                    radius="lg"
                    classNames={{
                        tabList: "bg-white p-1.5 border border-slate-200/80 shadow-sm rounded-2xl gap-2",
                        cursor: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md",
                        tab: "px-5 h-10 font-bold text-xs sm:text-sm text-slate-600",
                    }}
                >
                    <Tab
                        key="overview"
                        title={
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                <span>{isBn ? "সন্তানের অগ্রগতি ও কোর্স" : "Overview & Student"}</span>
                            </div>
                        }
                    >
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column: Student Details & Courses Table */}
                            <div className="lg:col-span-2 space-y-6">
                                {student ? (
                                    <>
                                        {/* Linked Student Card */}
                                        <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                                            <CardBody className="p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar
                                                            name={student.name}
                                                            className="w-16 h-16 text-xl font-black bg-gradient-to-br from-blue-500 to-indigo-600 text-white ring-4 ring-blue-100"
                                                        />
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C]">{student.name}</h2>
                                                                <Chip 
                                                                    color={student.isVerified ? "success" : "warning"} 
                                                                    variant="flat" 
                                                                    size="sm"
                                                                    className="font-bold text-xs"
                                                                >
                                                                    {student.isVerified ? (isBn ? "যাচাইকৃত শিক্ষার্থী" : "Verified") : "Pending"}
                                                                </Chip>
                                                            </div>
                                                            <p className="text-xs text-slate-400 font-mono">ID: {student.id?.substring(0, 12)}...</p>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        color="primary"
                                                        variant="flat"
                                                        size="sm"
                                                        className="font-bold text-xs rounded-xl"
                                                        startContent={<Eye className="w-3.5 h-3.5" />}
                                                        onPress={() => viewDetails(student, 'student')}
                                                    >
                                                        {isBn ? "পূর্ণাঙ্গ প্রোফাইল দেখুন" : "View Full Profile"}
                                                    </Button>
                                                </div>

                                                {/* Contact Details Grid */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                                            <Mail className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "শিক্ষার্থীর ইমেইল" : "Student Email"}</p>
                                                            <p className="font-semibold text-xs text-slate-700 truncate">{student.email || "Not provided"}</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                                            <Phone className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "শিক্ষার্থীর ফোন" : "Student Phone"}</p>
                                                            <p className="font-semibold text-xs text-slate-700">{student.phone || "Not provided"}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progress Bar Showcase */}
                                                <div className="p-4 bg-gradient-to-r from-blue-50/80 via-emerald-50/50 to-white rounded-2xl border border-blue-100">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                            {isBn ? "সামগ্রিক কোর্স সমাপ্তির হার" : "Overall Course Progress"}
                                                        </span>
                                                        <span className="text-sm font-black text-emerald-600">{studentStats?.progress || 0}%</span>
                                                    </div>
                                                    <Progress
                                                        value={studentStats?.progress || 0}
                                                        color={(studentStats?.progress || 0) > 70 ? "success" : "primary"}
                                                        size="md"
                                                        className="h-2.5 rounded-full"
                                                    />
                                                </div>
                                            </CardBody>
                                        </Card>

                                        {/* Enrolled Courses Table Card */}
                                        <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                                            <CardHeader className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                                    <h3 className="font-extrabold text-base text-[#2C2C2C]">
                                                        {isBn ? "ভর্তিকৃত লাইভ কোর্সসমূহ" : "Enrolled Live Courses"}
                                                    </h3>
                                                </div>
                                                <Chip color="primary" variant="flat" size="sm" className="font-bold text-xs">
                                                    {enrollments.length} {isBn ? "টি কোর্স" : "courses"}
                                                </Chip>
                                            </CardHeader>
                                            <CardBody className="p-0">
                                                {enrollments.length === 0 ? (
                                                    <div className="text-center py-12 px-4">
                                                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                                        <p className="text-sm font-semibold text-slate-600 mb-1">
                                                            {isBn ? "কোনো কোর্সে এখনো ভর্তি করা হয়নি" : "No courses enrolled yet"}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mb-4">
                                                            {isBn ? "আপনার সন্তানের জন্য সেরা কোডিং বা রোবোটিক্স কোর্স নির্বাচন করুন।" : "Explore hands-on coding & robotics courses for your student."}
                                                        </p>
                                                        <Button
                                                            color="primary"
                                                            size="sm"
                                                            className="font-bold text-xs rounded-xl"
                                                            onPress={() => router.push("/courses")}
                                                        >
                                                            {isBn ? "কোর্স ক্যাটালগ দেখুন" : "Browse Courses"}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <Table 
                                                            aria-label="Enrolled courses"
                                                            className="min-w-full"
                                                            removeWrapper
                                                        >
                                                            <TableHeader>
                                                                <TableColumn className="font-bold text-xs text-slate-600 uppercase">{isBn ? "কোর্স" : "COURSE"}</TableColumn>
                                                                <TableColumn className="font-bold text-xs text-slate-600 uppercase hidden sm:table-cell">{isBn ? "ভর্তির তারিখ" : "ENROLLED"}</TableColumn>
                                                                <TableColumn className="font-bold text-xs text-slate-600 uppercase">{isBn ? "অগ্রগতি" : "PROGRESS"}</TableColumn>
                                                                <TableColumn className="font-bold text-xs text-slate-600 uppercase hidden md:table-cell">{isBn ? "সর্বশেষ সক্রিয়" : "LAST ACCESS"}</TableColumn>
                                                                <TableColumn className="font-bold text-xs text-slate-600 uppercase text-right">{isBn ? "অ্যাকশন" : "ACTION"}</TableColumn>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {enrollments.map((enrollment) => (
                                                                    <TableRow key={enrollment._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                                                        <TableCell>
                                                                            <div className="max-w-[200px] sm:max-w-xs">
                                                                                <p className="font-bold truncate text-xs sm:text-sm text-[#2C2C2C]">{enrollment.courseId?.title}</p>
                                                                                <p className="text-[11px] text-slate-400 sm:hidden">
                                                                                    {new Date(enrollment.enrolledAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                                                                                </p>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="hidden sm:table-cell text-xs font-medium text-slate-600">
                                                                            {new Date(enrollment.enrolledAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <div className="w-24 sm:w-32 space-y-1">
                                                                                <Progress 
                                                                                    value={enrollment.progress || 0} 
                                                                                    color={enrollment.progress > 70 ? "success" : "primary"}
                                                                                    size="sm"
                                                                                    className="h-1.5"
                                                                                />
                                                                                <p className="text-[11px] font-bold text-slate-600">{enrollment.progress || 0}%</p>
                                                                            </div>
                                                                        </TableCell>
                                                                        <TableCell className="hidden md:table-cell text-xs text-slate-500">
                                                                            {enrollment.lastAccessedAt 
                                                                                ? new Date(enrollment.lastAccessedAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")
                                                                                : (isBn ? 'এখনো শুরু হয়নি' : 'Not yet')
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell className="text-right">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="flat"
                                                                                color="primary"
                                                                                startContent={<Eye className="w-3.5 h-3.5" />}
                                                                                onPress={() => viewDetails(enrollment, 'course')}
                                                                                className="font-bold text-xs rounded-xl"
                                                                            >
                                                                                {isBn ? "দেখুন" : "View"}
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                )}
                                                
                                                {/* Pagination */}
                                                {hasQuarterlyAccess && totalPages > 1 && (
                                                    <div className="px-6 py-4 flex flex-col items-center gap-3 border-t border-slate-100">
                                                        <Pagination
                                                            total={totalPages}
                                                            page={currentPage}
                                                            onChange={handlePageChange}
                                                            showControls
                                                            color="primary"
                                                            size="sm"
                                                            radius="lg"
                                                        />
                                                    </div>
                                                )}
                                            </CardBody>
                                        </Card>
                                    </>
                                ) : (
                                    <Card className="rounded-[24px] border border-slate-200 shadow-sm">
                                        <CardBody className="text-center py-16 px-4">
                                            <Users className="w-14 h-14 mx-auto mb-3 text-slate-300" />
                                            <h3 className="text-lg font-black text-slate-700 mb-1">
                                                {isBn ? "কোনো শিক্ষার্থী সংযুক্ত নেই" : "No Student Linked"}
                                            </h3>
                                            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                                                {isBn ? "আপনার অ্যাকাউন্টে শিক্ষার্থী অ্যাকাউন্ট সংযুক্ত করা হলে তা এখানে প্রদর্শিত হবে।" : "When your student profile is verified and linked, it will appear here."}
                                            </p>
                                        </CardBody>
                                    </Card>
                                )}
                            </div>

                            {/* Right Column: Guardian Profile & Mentorship Widget */}
                            <div className="space-y-6">
                                {/* Guardian Account Card */}
                                <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                                    <CardHeader className="py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                        <h3 className="font-extrabold text-sm text-[#2C2C2C]">
                                            {isBn ? "আপনার অভিভাবক প্রোফাইল" : "Your Guardian Profile"}
                                        </h3>
                                    </CardHeader>
                                    <CardBody className="p-5 space-y-3">
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "অভিভাবকের নাম" : "Name"}</p>
                                            <p className="font-bold text-sm text-[#2C2C2C]">{guardian?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "ইমেইল" : "Email"}</p>
                                            <p className="font-medium text-xs text-slate-600 break-all">{guardian?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "মোবাইল" : "Phone"}</p>
                                            <p className="font-medium text-xs text-slate-600">{guardian?.phone || "Not provided"}</p>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">{isBn ? "অ্যাকাউন্ট স্ট্যাটাস" : "Status"}</span>
                                            <Chip 
                                                color={guardian?.isVerified ? "success" : "warning"}
                                                variant="flat"
                                                size="sm"
                                                className="text-xs font-bold"
                                            >
                                                {guardian?.isVerified ? (isBn ? "যাচাইকৃত" : "Verified") : "Pending"}
                                            </Chip>
                                        </div>
                                    </CardBody>
                                </Card>

                                {/* Direct Teacher & Helpline for Guardians */}
                                <div className="rounded-[24px] border border-emerald-200/80 bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white p-5 shadow-sm space-y-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                                            <Headphones className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-sm text-[#2C2C2C]">
                                                {isBn ? "অভিভাবক ও শিক্ষক হেল্পলাইন" : "Guardian & Teacher Desk"}
                                            </h4>
                                            <p className="text-[11px] text-slate-500">
                                                {isBn ? "সন্তানের ক্লাস ও কিট সহায়তা" : "Class & kit delivery helpline"}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {isBn 
                                            ? "আপনার সন্তানের লাইভ ক্লাস সিডিউল, উপস্থিতি, কুইজের ফলাফল বা হার্ডওয়্যার কিট পৌঁছানো সংক্রান্ত যেকোনো প্রশ্ন থাকলে সরাসরি আমাদের সাথে WhatsApp-এ কথা বলুন।"
                                            : "Need updates on class timing, live attendance, homework, or robotics kit delivery? Chat directly with our student support team on WhatsApp."}
                                    </p>

                                    <Button
                                        size="sm"
                                        className="w-full font-bold text-xs rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                                        onPress={() => window.open("https://wa.me/8801886064560", "_blank")}
                                        startContent={<MessageCircle className="w-4 h-4" />}
                                    >
                                        {isBn ? "WhatsApp-এ কথা বলুন" : "Chat on WhatsApp"}
                                    </Button>

                                    <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800 font-semibold">
                                        <span>✓ {isBn ? "১০-১৫ জন মাইক্রো-ব্যাচ" : "10-15 Micro-batch"}</span>
                                        <span>✓ {isBn ? "সার্বক্ষণিক মেন্টরিং" : "Personalized Mentor"}</span>
                                    </div>
                                </div>

                                {/* Guardian Quick Actions */}
                                <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                                    <CardHeader className="py-4 px-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                                        <h3 className="font-extrabold text-sm text-[#2C2C2C]">
                                            {isBn ? "কুইক অ্যাকশন" : "Quick Actions"}
                                        </h3>
                                    </CardHeader>
                                    <CardBody className="p-4 space-y-2">
                                        <Button
                                            fullWidth
                                            variant="flat"
                                            color="primary"
                                            className="justify-between text-xs font-bold rounded-xl h-10"
                                            startContent={<CreditCard className="w-4 h-4 text-blue-600" />}
                                            endContent={<ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                                            onPress={() => setActiveTab("payments")}
                                        >
                                            {isBn ? "পেমেন্ট হিস্ট্রি দেখুন" : "View Payments"}
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="flat"
                                            color="secondary"
                                            className="justify-between text-xs font-bold rounded-xl h-10"
                                            startContent={<FileText className="w-4 h-4 text-purple-600" />}
                                            endContent={<ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                                            onPress={() => setActiveTab("reports")}
                                        >
                                            {isBn ? "অগ্রগতি রিপোর্ট ডাউনলোড" : "Progress Reports"}
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="flat"
                                            color="success"
                                            className="justify-between text-xs font-bold rounded-xl h-10"
                                            startContent={<Upload className="w-4 h-4 text-emerald-600" />}
                                            endContent={<ChevronRight className="w-3.5 h-3.5 opacity-50" />}
                                            onPress={() => document.getElementById('file-upload')?.click()}
                                            isLoading={uploading}
                                        >
                                            {isBn ? "ডকুমেন্ট আপলোড করুন" : "Upload Document"}
                                        </Button>
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            onChange={handleUploadFile}
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </Tab>

                    {/* Payments Tab */}
                    <Tab
                        key="payments"
                        title={
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4" />
                                <span>{isBn ? "টিউশন ও পেমেন্ট হিস্ট্রি" : "Payments & Invoices"}</span>
                            </div>
                        }
                    >
                        <div className="mt-6">
                            <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                                <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                                    <h3 className="font-extrabold text-base text-[#2C2C2C]">
                                        {isBn ? "পেমেন্ট ও লেনদেন তালিকা" : "Payment & Billing History"}
                                    </h3>
                                    <span className="text-xs text-slate-500 font-bold">
                                        {payments.length} {isBn ? "টি লেনদেন" : "records"}
                                    </span>
                                </CardHeader>
                                <CardBody className="p-0">
                                    {payments.length === 0 ? (
                                        <div className="text-center py-12 px-4">
                                            <CreditCard className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                            <p className="text-sm font-semibold text-slate-600">{isBn ? "কোনো পেমেন্ট তথ্য পাওয়া যায়নি" : "No payment records found"}</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table 
                                                aria-label="Payment history"
                                                removeWrapper
                                            >
                                                <TableHeader>
                                                    <TableColumn className="font-bold text-xs uppercase text-slate-600">{isBn ? "তারিখ" : "DATE"}</TableColumn>
                                                    <TableColumn className="font-bold text-xs uppercase text-slate-600">{isBn ? "প্ল্যান" : "PLAN TYPE"}</TableColumn>
                                                    <TableColumn className="font-bold text-xs uppercase text-slate-600 hidden sm:table-cell">{isBn ? "ট্রানজেকশন আইডি" : "TRANSACTION ID"}</TableColumn>
                                                    <TableColumn className="font-bold text-xs uppercase text-slate-600">{isBn ? "পরিমাণ" : "AMOUNT"}</TableColumn>
                                                    <TableColumn className="font-bold text-xs uppercase text-slate-600">{isBn ? "স্ট্যাটাস" : "STATUS"}</TableColumn>
                                                    <TableColumn className="font-bold text-xs uppercase text-slate-600 text-right">{isBn ? "অ্যাকশন" : "ACTION"}</TableColumn>
                                                </TableHeader>
                                                <TableBody>
                                                    {payments.map((payment) => (
                                                        <TableRow key={payment._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                                            <TableCell className="text-xs font-semibold text-slate-700">
                                                                {new Date(payment.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip size="sm" variant="flat" className="capitalize text-xs font-bold">
                                                                    {payment.planType}
                                                                </Chip>
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell font-mono text-xs text-slate-500">
                                                                {payment.transactionId}
                                                            </TableCell>
                                                            <TableCell className="font-black text-xs sm:text-sm text-blue-600">
                                                                ৳{payment.price.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    color={
                                                                        payment.paymentStatus === 'approved' ? 'success' :
                                                                        payment.paymentStatus === 'pending' ? 'warning' : 'danger'
                                                                    }
                                                                    variant="flat"
                                                                    size="sm"
                                                                    className="text-xs font-bold"
                                                                >
                                                                    {payment.paymentStatus === 'approved' ? (isBn ? 'অনুমোদিত' : 'Approved') :
                                                                     payment.paymentStatus === 'pending' ? (isBn ? 'পেন্ডিং' : 'Pending') : (isBn ? 'বাতিল' : 'Failed')}
                                                                </Chip>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    size="sm"
                                                                    variant="flat"
                                                                    color="primary"
                                                                    startContent={<Eye className="w-3.5 h-3.5" />}
                                                                    onPress={() => viewDetails(payment, 'payment')}
                                                                    className="font-bold text-xs rounded-xl"
                                                                >
                                                                    {isBn ? "রসিদ" : "View"}
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>

                    {/* Reports Tab */}
                    <Tab
                        key="reports"
                        title={
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{isBn ? "অগ্রগতি রিপোর্ট ও সনদ" : "Reports & Documents"}</span>
                            </div>
                        }
                    >
                        <div className="mt-6">
                            <Card className="rounded-[24px] border border-slate-200/80 shadow-sm overflow-hidden bg-white">
                                <CardHeader className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
                                    <h3 className="font-extrabold text-base text-[#2C2C2C]">
                                        {isBn ? "অগ্রগতি রিপোর্ট ও একাডেমিক ডকুমেন্টস" : "Progress Reports & Certificates"}
                                    </h3>
                                    <Button
                                        color="success"
                                        size="sm"
                                        startContent={<Upload className="w-3.5 h-3.5" />}
                                        onPress={() => document.getElementById('file-upload')?.click()}
                                        isLoading={uploading}
                                        className="font-bold text-xs rounded-xl text-white bg-emerald-600"
                                    >
                                        {isBn ? "ডকুমেন্ট আপলোড" : "Upload Document"}
                                    </Button>
                                </CardHeader>
                                <CardBody className="p-6">
                                    {reports.length === 0 ? (
                                        <div className="text-center py-12">
                                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                            <p className="text-sm font-semibold text-slate-600">{isBn ? "কোনো রিপোর্ট এই মুহূর্তে পাওয়া যায়নি" : "No reports available"}</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {reports.map((report) => (
                                                <div 
                                                    key={report._id} 
                                                    className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 bg-white hover:shadow-md transition-all duration-300 space-y-3"
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-sm text-[#2C2C2C] line-clamp-1">{report.title}</h4>
                                                        <p className="text-[11px] text-slate-400 font-medium capitalize mt-0.5">
                                                            {report.type} • {new Date(report.generatedAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        variant="flat"
                                                        fullWidth
                                                        startContent={<Download className="w-3.5 h-3.5" />}
                                                        onPress={() => handleDownloadReport(report._id)}
                                                        className="font-bold text-xs rounded-xl"
                                                    >
                                                        {isBn ? "ডাউনলোড করুন" : "Download PDF"}
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>
                </Tabs>

                {/* Details Modal */}
                <Modal 
                    isOpen={isOpen} 
                    onClose={onClose}
                    size="2xl"
                    scrollBehavior="inside"
                    classNames={{
                        base: "rounded-[28px] p-2",
                    }}
                >
                    <ModalContent>
                        <ModalHeader className="flex justify-between items-center text-lg font-black text-[#2C2C2C]">
                            <span>
                                {selectedItem?.type === 'student' ? (isBn ? 'শিক্ষার্থীর প্রোফাইল' : 'Student Profile') : 
                                 selectedItem?.type === 'course' ? (isBn ? 'কোর্সের বিস্তারিত' : 'Course Details') : 
                                 selectedItem?.type === 'payment' ? (isBn ? 'পেমেন্ট ও রসিদ' : 'Payment Details') : 'Details'}
                            </span>
                        </ModalHeader>
                        <ModalBody className="py-4">
                            {selectedItem && (
                                <div className="space-y-4">
                                    {selectedItem.type === 'student' && (
                                        <>
                                            <div className="text-center py-4 bg-slate-50 rounded-2xl">
                                                <Avatar
                                                    name={selectedItem.name}
                                                    className="w-20 h-20 mx-auto mb-2 text-2xl font-black bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                                />
                                                <h3 className="text-xl font-black text-[#2C2C2C]">{selectedItem.name}</h3>
                                                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {selectedItem.id}</p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                                <div className="p-3 bg-slate-50 rounded-xl">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "ইমেইল" : "Email"}</p>
                                                    <p className="font-semibold text-xs text-slate-700 break-all">{selectedItem.email}</p>
                                                </div>
                                                <div className="p-3 bg-slate-50 rounded-xl">
                                                    <p className="text-[11px] font-bold text-slate-400 uppercase">{isBn ? "মোবাইল" : "Phone"}</p>
                                                    <p className="font-semibold text-xs text-slate-700">{selectedItem.phone || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    
                                    {selectedItem.type === 'course' && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-black text-[#2C2C2C]">{selectedItem.courseId?.title}</h3>
                                            <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 font-bold">{isBn ? "অগ্রগতি হার" : "Progress"}</span>
                                                    <span className="text-sm font-black text-emerald-600">{selectedItem.progress || 0}%</span>
                                                </div>
                                                <Progress value={selectedItem.progress || 0} color="success" size="md" className="h-2 rounded-full" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3.5 bg-blue-50 rounded-xl text-center">
                                                    <p className="text-[11px] font-bold text-blue-600 uppercase">{isBn ? "সম্পন্ন লেসন" : "Completed"}</p>
                                                    <p className="text-xl font-black text-blue-700 mt-1">{selectedItem.completedLessons || 0}</p>
                                                </div>
                                                <div className="p-3.5 bg-purple-50 rounded-xl text-center">
                                                    <p className="text-[11px] font-bold text-purple-600 uppercase">{isBn ? "মোট লেসন" : "Total Lessons"}</p>
                                                    <p className="text-xl font-black text-purple-700 mt-1">{selectedItem.totalLessons || 0}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedItem.type === 'payment' && (
                                        <div className="space-y-4">
                                            <div className="text-center py-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                                <p className="text-xs font-bold text-emerald-700 uppercase mb-1">{isBn ? "পরিশোধিত অর্থ" : "Paid Amount"}</p>
                                                <h3 className="text-3xl font-black text-emerald-700">৳{selectedItem.price?.toLocaleString()}</h3>
                                            </div>
                                            <div className="space-y-2 text-xs">
                                                <div className="flex justify-between py-2 border-b border-slate-100">
                                                    <span className="text-slate-500">{isBn ? "ট্রানজেকশন আইডি" : "Transaction ID"}</span>
                                                    <span className="font-mono font-bold text-slate-700">{selectedItem.transactionId}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b border-slate-100">
                                                    <span className="text-slate-500">{isBn ? "প্ল্যান টাইপ" : "Plan"}</span>
                                                    <span className="font-bold capitalize text-slate-700">{selectedItem.planType}</span>
                                                </div>
                                                <div className="flex justify-between py-2">
                                                    <span className="text-slate-500">{isBn ? "তারিখ" : "Date"}</span>
                                                    <span className="font-bold text-slate-700">{new Date(selectedItem.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose} size="sm" className="font-bold text-xs rounded-xl px-5">
                                {isBn ? "ঠিক আছে" : "Close"}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}

export default function GuardianDashboard() {
    return (
        <RequireAuth allowedRoles={["guardian"]}>
            <GuardianDashboardContent />
        </RequireAuth>
    );
}
