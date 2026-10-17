"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Spinner,
    Chip,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Tabs,
    Tab,
} from "@nextui-org/react";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import CourseModules from "@/components/course/CourseModules";
import UnifiedAssessmentView from "@/components/assessment/UnifiedAssessmentView";
import { openTrialModal } from "@/components/TrialBookingModal";
import { findCourseDetail, getCourseSlug } from "@/lib/coursesData";
import { sanitizeHtml } from "@/lib/sanitize";
import { trackViewContentEvent } from "@/utils/tracking";
import Cookies from "js-cookie";
import Link from "next/link";
import {
    FaTrophy,
    FaDownload,
    FaCheck,
    FaClock,
    FaUsers,
    FaAward,
    FaShieldAlt,
    FaCode,
    FaRobot,
    FaLaptopCode,
    FaCalendarAlt,
    FaGraduationCap,
    FaChevronRight,
    FaStar,
} from "react-icons/fa";
import {
    Sparkles,
    Check,
    X,
    Clock,
    Users,
    Award,
    Shield,
    Code,
    Bot,
    Laptop,
    Calendar,
    GraduationCap,
    ChevronRight,
    Star,
    Video,
    Flame,
    CreditCard,
    Lock,
    Wrench,
    Radio,
    Zap,
    Cpu,
    BookOpen,
    HelpCircle,
    FileText,
    Target,
    AlertTriangle,
} from "lucide-react";
import "@/styles/prose.css";

const renderToolIcon = (name: string) => {
    switch (name) {
        case "Python 3.12":
            return <Code className="w-4 h-4 text-blue-600" />;
        case "VS Code":
            return <Laptop className="w-4 h-4 text-indigo-600" />;
        case "Google Colab":
            return <Zap className="w-4 h-4 text-amber-600" />;
        case "Pygame":
            return <Bot className="w-4 h-4 text-purple-600" />;
        case "OpenAI API":
            return <Sparkles className="w-4 h-4 text-emerald-600" />;
        case "Git & GitHub":
            return <Code className="w-4 h-4 text-slate-700" />;
        case "Arduino Uno R3":
            return <Cpu className="w-4 h-4 text-cyan-600" />;
        case "Arduino IDE":
            return <Laptop className="w-4 h-4 text-teal-600" />;
        case "Tinkercad Circuits":
            return <Zap className="w-4 h-4 text-amber-600" />;
        case "Ultrasonic Sensor":
            return <Radio className="w-4 h-4 text-blue-600" />;
        case "L298N Motor Driver":
            return <Wrench className="w-4 h-4 text-indigo-600" />;
        case "IR Line Sensors":
            return <Zap className="w-4 h-4 text-purple-600" />;
        default:
            return <Code className="w-4 h-4 text-blue-600" />;
    }
};

interface CourseDetailsProps {
    courseId: string;
}

export default function CourseDetails({ courseId }: CourseDetailsProps) {
    const { data, isLoading, error, refetch } = useGetCourseByIdQuery(courseId);
    const { data: ordersData } = useGetMyOrdersQuery();
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("overview");
    const [language, setLanguage] = useState<"en" | "bn">("bn");

    // Synchronize language from localStorage / event listener
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLang = localStorage.getItem("language") as "en" | "bn";
            if (storedLang) {
                setLanguage(storedLang);
            }
            const handleLangChange = () => {
                const updated = localStorage.getItem("language") as "en" | "bn";
                if (updated) setLanguage(updated);
            };
            window.addEventListener("languageChange", handleLangChange);
            return () => window.removeEventListener("languageChange", handleLangChange);
        }
    }, []);

    const course = data?.data || data;
    const actualCourseId = course?._id || courseId;

    const getAuthToken = () => {
        const cookieToken = Cookies.get("accessToken");
        if (cookieToken) return cookieToken;
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || "";
        }
        return "";
    };

    const getUserRole = () => {
        const roleFromCookie = Cookies.get("userRole");
        if (roleFromCookie) return roleFromCookie;
        if (typeof window !== "undefined") {
            const roleFromStorage = localStorage.getItem("userRole");
            if (roleFromStorage) return roleFromStorage;
            try {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    return (JSON.parse(storedUser).role as string) || "";
                }
            } catch {
                // ignore
            }
        }
        return "";
    };

    const token = getAuthToken();
    const isLoggedIn = !!token;

    // Check enrollment and orders
    const enrolledCourses = useSelector(
        (state: RootState) => state.enrollment.enrolledCourses
    );
    const isEnrolled = isLoggedIn && enrolledCourses.some(
        (e) => e.courseId === courseId || e.courseId === actualCourseId
    );

    const payments = useSelector((state: RootState) => state.payment.payments);
    const hasPaid = isLoggedIn && payments.some(
        (p) => (p.courseId === courseId || p.courseId === actualCourseId) && p.status === "completed"
    );

    const orders = ordersData?.orders || [];
    const now = new Date();

    const hasAllAccess = isLoggedIn && orders.some(
        order =>
            order.planType === "quarterly" &&
            order.paymentStatus === "approved" &&
            order.isActive &&
            (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
    );

    const hasPurchasedCourse = isLoggedIn && orders.some(
        order =>
            order.planType === "single" &&
            order.paymentStatus === "approved" &&
            order.isActive &&
            (order.courseId?._id === courseId || order.courseId?._id === actualCourseId) &&
            (order.endDate === null || (order.endDate && new Date(order.endDate) > now))
    );

    const hasComboAccess = isLoggedIn && orders.some(
        order => {
            if (order.planType === "combo" && 
                order.paymentStatus === "approved" && 
                order.isActive &&
                (order.endDate === null || (order.endDate && new Date(order.endDate) > now)) &&
                order.comboId) {
                const combo = typeof order.comboId === "object" ? order.comboId : null;
                if (combo && (combo as any).courses && Array.isArray((combo as any).courses)) {
                    return (combo as any).courses.some((c: any) => {
                        const cId = typeof c === "object" ? c._id : c;
                        return cId?.toString() === courseId || cId?.toString() === actualCourseId;
                    });
                }
            }
            return false;
        }
    );

    const isTeacherOfCourse = useMemo(() => {
        if (!isLoggedIn) return false;
        const role = getUserRole();
        if (role === "admin" || role === "manager") return true;
        if (role === "instructor") {
            try {
                const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
                const curUser = stored ? JSON.parse(stored) : null;
                const curId = curUser?._id || curUser?.id;
                if (curId) {
                    const pId = typeof course?.instructorId === "object" ? course.instructorId?._id || course.instructorId?.id : course?.instructorId;
                    if (pId && pId.toString() === curId.toString()) return true;
                    if (Array.isArray(course?.instructorIds) && course.instructorIds.some((ci: any) => {
                        const ciId = typeof ci === "object" ? ci._id || ci.id : ci;
                        return ciId?.toString() === curId.toString();
                    })) return true;
                }
            } catch (e) {
                // ignore
            }
        }
        return false;
    }, [isLoggedIn, course]);

    const hasAccess = isLoggedIn && (hasAllAccess || hasPurchasedCourse || hasComboAccess || hasPaid || isEnrolled || isTeacherOfCourse);

    const hasPendingAllAccess = isLoggedIn && orders.some(
        order =>
            order.planType === "quarterly" &&
            order.paymentStatus !== "approved" &&
            order.isActive
    );

    const hasPendingCourseOrder = isLoggedIn && orders.some(
        order =>
            order.planType === "single" &&
            (order.courseId?._id === courseId || order.courseId?._id === actualCourseId) &&
            order.paymentStatus !== "approved"
    );

    const isAwaitingApproval = hasPendingAllAccess || hasPendingCourseOrder;

    const handleEnrollClick = () => {
        const token = getAuthToken();
        if (!token) {
            alert(language === "en" ? "Please login to enroll in this course" : "কোর্সে এনরোল করতে অনুগ্রহ করে লগইন করুন");
            router.push(`/login?redirect=/courses/${course?.slug || courseId}`);
            return;
        }

        const role = getUserRole();
        if (role && role !== "student") {
            alert(language === "en" ? "Only students can purchase courses. Please switch to a student account." : "শুধুমাত্র শিক্ষার্থীরা কোর্স কিনতে পারবেন।");
            return;
        }

        router.push(`/checkout?plan=single&courseId=${actualCourseId}`);
    };

    // Matched enriched detail from coursesData.ts
    const enrichedDetail = useMemo(() => {
        return (
            findCourseDetail(courseId) ||
            findCourseDetail(course?.slug) ||
            findCourseDetail(course?.title)
        );
    }, [courseId, course?.slug, course?.title]);

    const isPython = (course?.title || "").toLowerCase().includes("python") || courseId.toLowerCase().includes("python");
    const isRobotics = (course?.title || "").toLowerCase().includes("robot") || (course?.title || "").toLowerCase().includes("arduino") || courseId.toLowerCase().includes("robot");

    // Standardized course title and subtitle
    const displayTitle = useMemo(() => {
        if (!course?.title) return "STEM Course";
        if (isPython) {
            return language === "bn" ? "টিনএজারদের জন্য পাইথন প্রোগ্রামিং ও এআই" : "Python Programming & AI for Teens";
        }
        if (isRobotics) {
            return language === "bn" ? "জুনিয়র রোবটিক্স উইথ আর্দুইনো" : "Junior Robotics with Arduino";
        }
        return course.title;
    }, [course?.title, isPython, isRobotics, language]);

    const displayTagline = useMemo(() => {
        if (enrichedDetail) {
            return enrichedDetail[language]?.tagline || enrichedDetail.en?.tagline;
        }
        if (isPython) {
            return language === "bn"
                ? "কোডিংয়ের হাতেখড়ি থেকে শুরু করে লাইভ মেন্টরশিপে এআই চ্যাটবট ও ইন্টারেক্টিভ গেম তৈরি শিখুন।"
                : "Master Python from scratch to building real AI chatbots, interactive 2D games, and smart automation with 1-on-1 expert mentorship.";
        }
        if (isRobotics) {
            return language === "bn"
                ? "আসল রোবট তৈরি করুন, আর্দুইনো প্রোগ্রামিং ও সেন্সর ইলেকট্রনিক্স শিখুন প্র্যাকটিক্যাল হার্ডওয়্যার কিট দিয়ে।"
                : "Build real physical robots, program Arduino microcontrollers, and master sensor electronics with hands-on hardware starter kits.";
        }
        return course?.subtitle || "";
    }, [enrichedDetail, isPython, isRobotics, language, course?.subtitle]);

    const isFree = course?.isFree || course?.price === 0;
    const canViewPreview = isFree || hasAccess;
    const isAvailable = course?.isPublished && course?.isAdminApproved;

    const modules = course?.modules || [];
    const allLessons = modules.flatMap((m: any) => m.lessons || []);
    const totalLessons = allLessons.length;
    const isCourseCompleted = course?.isCompleted;

    // Track ViewContent for Meta Pixel and Next.js CAPI
    useEffect(() => {
        if (course?.title) {
            trackViewContentEvent({
                title: course.title,
                category: course.category || "Course",
                id: actualCourseId,
                price: course.price,
            });
        }
    }, [course?.title, actualCourseId, course?.price, course?.category]);

    // Fallback tools & tech badges
    const toolsList = useMemo(() => {
        if (isPython) {
            return [
                { name: "Python 3.12", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { name: "VS Code", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                { name: "Google Colab", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { name: "Pygame", color: "bg-purple-50 text-purple-700 border-purple-200" },
                { name: "OpenAI API", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                { name: "Git & GitHub", color: "bg-slate-50 text-slate-700 border-slate-200" },
            ];
        }
        if (isRobotics) {
            return [
                { name: "Arduino Uno R3", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
                { name: "Arduino IDE", color: "bg-teal-50 text-teal-700 border-teal-200" },
                { name: "Tinkercad Circuits", color: "bg-amber-50 text-amber-700 border-amber-200" },
                { name: "Ultrasonic Sensor", color: "bg-blue-50 text-blue-700 border-blue-200" },
                { name: "L298N Motor Driver", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
                { name: "IR Line Sensors", color: "bg-purple-50 text-purple-700 border-purple-200" },
            ];
        }
        return [
            { name: "Interactive IDE", color: "bg-blue-50 text-blue-700 border-blue-200" },
            { name: "Live Class Tools", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { name: "STEM Simulator", color: "bg-amber-50 text-amber-700 border-amber-200" },
        ];
    }, [isPython, isRobotics]);

    // Learning outcomes
    const learningOutcomes = useMemo(() => {
        if (enrichedDetail && enrichedDetail[language]?.whatYouWillLearn) {
            return enrichedDetail[language].whatYouWillLearn;
        }
        if (course?.learningOutcomes && course.learningOutcomes.length > 0) {
            return course.learningOutcomes;
        }
        if (isPython) {
            return language === "bn"
                ? [
                    "পাইথন ৩ এর মৌলিক বিষয়: সিনট্যাক্স, ভ্যারিয়েবল, ডেটা টাইপ ও লজিক",
                    "ইন্টারেক্টিভ গেম এবং স্বয়ংক্রিয় টার্মিনাল প্রোগ্রাম তৈরি",
                    "অবজেক্ট ওরিয়েন্টেড প্রোগ্রামিং (OOP) ও রিউজেবল ক্লাস ডিজাইন",
                    "এআই চ্যাটবট ডেভেলপমেন্ট এবং আধুনিক এআই এপিআই ইন্টিগ্রেশন",
                    "ফাইল সিস্টেম অটোমেশন, জেসন (JSON) ও ওয়েব এপিআই নিয়ে কাজ",
                    "গিট ও গিটহাবের মাধ্যমে নিজস্ব কোডিং পোর্টফোলিও তৈরি",
                ]
                : [
                    "Master Python 3 fundamentals: syntax, data types, logic, and functions",
                    "Build interactive 2D games and automated command-line utilities",
                    "Implement Object-Oriented Programming (OOP) with clean reusable classes",
                    "Build real-world AI applications and intelligent chatbots with modern APIs",
                    "Work with external web APIs, JSON data, and file system automation",
                    "Learn version control with Git & GitHub to showcase your portfolio",
                ];
        }
        return language === "bn"
            ? [
                "ইলেকট্রনিক্স ও সার্কিট ডিজাইনের মৌলিক বিষয়সমূহ হাতে-কলমে শেখা",
                "আর্দুইনো আইডিই (Arduino IDE) তে C/C++ প্রোগ্রামিংয়ের দক্ষতা অর্জন",
                "আল্ট্রাসনিক, আইআর ও তাপমাত্রা সেন্সর সফলভাবে ইন্টিগ্রেট করা",
                "ডিসি মোটর ও প্রিসিশন সার্ভো মোটর নিয়ন্ত্রণ ও গতিবিধি প্রোগ্রামিং",
                "স্বয়ংক্রিয় অবস্ট্যাকল অ্যাভয়ডিং ও লাইন ফলোয়ার রোবট তৈরি",
                "ব্যবহারিক হার্ডওয়্যার ট্রাবলশুটিং ও অলিম্পিয়াডের জন্য প্রস্তুতি",
            ]
            : [
                "Master core electronics: breadboards, voltage, resistors, and circuit safety",
                "Program Arduino microcontrollers using C/C++ in Arduino IDE",
                "Integrate digital and analog sensors (Ultrasonic, IR, Temperature, LDR)",
                "Control DC motors, servo motors, and motor driver shields for movement",
                "Build an autonomous obstacle-avoiding robot and an intelligent line follower",
                "Develop practical engineering problem-solving and debugging skills",
            ];
    }, [enrichedDetail, language, course?.learningOutcomes, isPython]);

    // Who is this for
    const whoIsThisFor = useMemo(() => {
        if (enrichedDetail && enrichedDetail[language]?.whoIsThisFor) {
            return enrichedDetail[language].whoIsThisFor;
        }
        if (isPython) {
            return language === "bn"
                ? [
                    "১২ থেকে ১৮ বছর বয়সী স্কুল ও কলেজের শিক্ষার্থী",
                    "প্রোগ্রামিংয়ের কোনো পূর্ব অভিজ্ঞতা ছাড়া সম্পূর্ণ নতুন শিক্ষার্থী",
                    "যারা গেম ডেভেলপমেন্ট ও আধুনিক এআই তৈরিতে আগ্রহী",
                    "ভবিষ্যতে কম্পিউটার সায়েন্স ও সফটওয়্যার ইঞ্জিনিয়ারিং পড়ার লক্ষ্য যাদের",
                ]
                : [
                    "Students aged 12-18 interested in coding and artificial intelligence",
                    "Complete beginners with zero prior programming experience",
                    "Curious students who want to create their own games and apps",
                    "Future computer science and software engineering aspirants",
                ];
        }
        return language === "bn"
            ? [
                "১০ থেকে ১৬ বছর বয়সী রোবটিক্স ও প্রযুক্তিতে আগ্রহী শিক্ষার্থী",
                "ইলেকট্রনিক্স বা প্রোগ্রামিংয়ের কোনো পূর্ব অভিজ্ঞতা নেই এমন শিক্ষার্থী",
                "যারা নিজের হাতে আসল হার্ডওয়্যার ও সার্কিট তৈরি করতে ভালোবাসে",
                "ভবিষ্যৎ ইঞ্জিনিয়ার ও রোবটিক্স অলিম্পিয়াডে অংশ নিতে ইচ্ছুক তরুণরা",
            ]
            : [
                "Students aged 10-16 enthusiastic about robotics and hardware",
                "Beginners with no prior electronics or coding knowledge",
                "Hands-on makers who love building tangible physical devices",
                "Future robotics engineers and STEM Olympiad participants",
            ];
    }, [enrichedDetail, language, isPython]);

    // Prerequisites
    const prerequisites = useMemo(() => {
        if (course?.prerequisites && course.prerequisites.length > 0) {
            return course.prerequisites;
        }
        return language === "bn"
            ? [
                "কোডিং বা রোবটিক্সের কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই",
                "ইন্টারনেট সংযোগসহ একটি ল্যাপটপ বা ডেস্কটপ কম্পিউটার (Windows, Mac বা Linux)",
                "নতুন কিছু শেখা ও সমস্যা সমাধানের আগ্রহ ও কৌতূহল",
            ]
            : [
                "No prior programming or electronics experience required",
                "A desktop or laptop computer with reliable internet access",
                "Curiosity, creativity, and enthusiasm to build real projects",
            ];
    }, [course?.prerequisites, language]);

    // Instructor info resolution dynamically from backend (supports single & multiple assigned mentors)
    const instructorsList = useMemo(() => {
        const list: any[] = [];
        const seen = new Set<string>();

        const formatInst = (inst: any, isLead: boolean = false) => {
            if (!inst || typeof inst !== "object") return null;
            const key = String(inst._id || inst.id || inst.name || Math.random()).toLowerCase();
            if (seen.has(key)) return null;
            seen.add(key);

            const name = inst.name || "Course Mentor";
            const defaultRole = isLead 
                ? (language === "en" ? "Lead Course Mentor" : "প্রধান কোর্স মেন্টর") 
                : (language === "en" ? "Course Mentor" : "কোর্স মেন্টর");
            const role = inst.qualification || inst.role || defaultRole;
            const institution = inst.institution || "Learn & Grow STEM Academy";
            const qualification = inst.qualification || inst.role || "";
            const bio = inst.bio || (language === "en" 
                ? "Dedicated educator and mentor empowering students with practical hands-on skills."
                : "অভিজ্ঞ মেন্টর ও শিক্ষক, যিনি বাস্তব প্রজেক্টের মাধ্যমে শিক্ষার্থীদের দক্ষ করে তোলেন।");
            const image = inst.profileImage || "/images/tutors/tutor-tanvir.png";

            return { id: key, name, role, institution, qualification, bio, image, isLead };
        };

        if (course?.instructorId && typeof course.instructorId === "object") {
            const primary = formatInst(course.instructorId, true);
            if (primary) list.push(primary);
        }

        if (Array.isArray(course?.instructorIds)) {
            course.instructorIds.forEach((inst: any) => {
                const item = formatInst(inst, list.length === 0);
                if (item) list.push(item);
            });
        }

        if (list.length === 0) {
            list.push({
                id: "default-mentor",
                name: course?.instructorName || "Md Jabed Hosen",
                role: "Founder & CEO | Lead AI & Python Mentor",
                institution: "Learn & Grow STEM Academy",
                qualification: "Founder & CEO | Lead AI & Python Mentor",
                bio: language === "en" 
                    ? "Founder & CEO of Learn & Grow. Lead Instructor specializing in Python Programming, Artificial Intelligence, and Robotics."
                    : "লার্ন অ্যান্ড গ্রো-এর প্রতিষ্ঠাতা ও প্রধান শিক্ষক। শিশু-কিশোরদের পাইথন কোডিং ও কৃত্রিম বুদ্ধিমত্তা শিক্ষায় নিবেদিতপ্রাণ।",
                image: "/images/tutors/tutor-jabed.png",
                isLead: true,
            });
        }

        return list;
    }, [course?.instructorId, course?.instructorIds, course?.instructorName, language]);

    const instructor = instructorsList[0];

    // Pricing calculation
    const currentPrice = course?.price || (isPython ? 2999 : 3499);
    const regularPrice = Math.round(currentPrice * 1.6); // 37-40% discount display

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
                <Spinner size="lg" color="primary" />
                <p className="text-gray-600 font-medium">
                    {language === "en" ? "Loading course details..." : "কোর্স লোড হচ্ছে..."}
                </p>
            </div>
        );
    }

    if (error && !course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {language === "en" ? "Course Not Found" : "কোর্সটি পাওয়া যায়নি"}
                </h2>
                <p className="text-gray-500 max-w-md">
                    {language === "en"
                        ? "The requested course could not be loaded. Please return to the course catalog."
                        : "অনুরোধকৃত কোর্সটি পাওয়া যায়নি। অনুগ্রহ করে সকল কোর্সের তালিকা দেখুন।"}
                </p>
                <Button color="primary" radius="full" onPress={() => router.push("/courses")}>
                    {language === "en" ? "Browse All Courses" : "সব কোর্স দেখুন"}
                </Button>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Course Not Found</h2>
                <Button color="primary" radius="full" onPress={() => router.push("/courses")}>
                    Go to Courses
                </Button>
            </div>
        );
    }

    if (!isAvailable) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {language === "en" ? "Course Under Review" : "কোর্সটি বর্তমানে পর্যালোচনায় রয়েছে"}
                </h2>
                <p className="text-gray-500 max-w-lg">
                    {language === "en"
                        ? "This course is pending publishing or admin approval. Please check back soon."
                        : "এই কোর্সটি শিগগিরই লাইভ হবে। নিয়মিত চোখ রাখুন লার্ন অ্যান্ড গ্রোতে।"}
                </p>
                <Button color="primary" radius="full" onPress={() => router.push("/courses")}>
                    {language === "en" ? "View Published Courses" : "চলতি কোর্সগুলো দেখুন"}
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#F8F9FA] min-h-screen py-6 sm:py-10">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                
                {/* 1. Breadcrumb navigation */}
                <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6 font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">
                        {language === "en" ? "Home" : "হোম"}
                    </Link>
                    <FaChevronRight className="text-[10px] text-gray-400" />
                    <Link href="/courses" className="hover:text-primary transition-colors">
                        {language === "en" ? "Courses" : "কোর্সসমূহ"}
                    </Link>
                    <FaChevronRight className="text-[10px] text-gray-400" />
                    <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-md">
                        {displayTitle}
                    </span>
                </nav>

                {/* 2. Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left 2-Columns: Hero, Video/Thumbnail, Stats, Tabs */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Course Header Banner */}
                        <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm">
                            
                            {/* Badges row */}
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#3B82F6] text-xs font-bold rounded-full border border-blue-100">
                                    {isPython ? (
                                        <>
                                            <Code className="w-3.5 h-3.5" />
                                            <span>Programming & AI</span>
                                        </>
                                    ) : (
                                        <>
                                            <Bot className="w-3.5 h-3.5" />
                                            <span>Robotics & STEM</span>
                                        </>
                                    )}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-[#92620A] text-xs font-bold rounded-full border border-amber-200">
                                    <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" /> 4.9 (120+ {language === "en" ? "reviews" : "রিভিউ"})
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    {language === "en" ? "100% Live Interactive" : "১০০% লাইভ ক্লাস"}
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                    {enrichedDetail?.ageRange || (isPython ? "Ages 12-18" : "Ages 10-16")}
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-3">
                                {displayTitle}
                            </h1>

                            {/* Tagline */}
                            <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
                                {displayTagline}
                            </p>

                            {/* Featured Media / Thumbnail with 16:9 aspect */}
                            <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-gray-900 border border-gray-100 mb-6">
                                <div className="relative w-full pt-[52%]">
                                    <img
                                        src={
                                            isPython
                                                ? "/courses/python-course-banner.jpg"
                                                : isRobotics
                                                    ? "/courses/robotics-course-banner.jpg"
                                                    : (course.thumbnail || course.img || "/logo.png")
                                        }
                                        alt={displayTitle}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                             const img = e.currentTarget;
                                            img.onerror = null;
                                            img.src = "/logo.png";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 sm:p-6">
                                        <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-semibold bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                            <span>{language === "en" ? "Live Sessions with Screen Share & Mentoring" : "লাইভ ক্লাস • স্ক্রিন শেয়ার ও মেন্টরিং"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 4-Stat Ribbon */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-100">
                                <div className="p-3 bg-[#F8F9FA] rounded-2xl text-center">
                                    <FaClock className="text-[#3B82F6] text-lg mx-auto mb-1" />
                                    <p className="text-[11px] text-gray-500 font-bold uppercase">{language === "en" ? "Duration" : "মেয়াদ"}</p>
                                    <p className="text-xs sm:text-sm font-black text-gray-900">{isPython ? "10 Weeks" : "8 Weeks"}</p>
                                </div>
                                <div className="p-3 bg-[#F8F9FA] rounded-2xl text-center">
                                    <FaUsers className="text-[#7C3AED] text-lg mx-auto mb-1" />
                                    <p className="text-[11px] text-gray-500 font-bold uppercase">{language === "en" ? "Batch Size" : "ব্যাচ সাইজ"}</p>
                                    <p className="text-xs sm:text-sm font-black text-gray-900">10-15 {language === "en" ? "Students" : "জন শিক্ষার্থী"}</p>
                                </div>
                                <div className="p-3 bg-[#F8F9FA] rounded-2xl text-center">
                                    <FaLaptopCode className="text-[#F59E0B] text-lg mx-auto mb-1" />
                                    <p className="text-[11px] text-gray-500 font-bold uppercase">{language === "en" ? "Projects" : "প্রজেক্ট"}</p>
                                    <p className="text-xs sm:text-sm font-black text-gray-900">5+ {language === "en" ? "Real Projects" : "বাস্তব প্রজেক্ট"}</p>
                                </div>
                                <div className="p-3 bg-[#F8F9FA] rounded-2xl text-center">
                                    <FaAward className="text-emerald-600 text-lg mx-auto mb-1" />
                                    <p className="text-[11px] text-gray-500 font-bold uppercase">{language === "en" ? "Certificate" : "সার্টিফিকেট"}</p>
                                    <p className="text-xs sm:text-sm font-black text-gray-900">{language === "en" ? "Verified STEM" : "ভেরিফায়েড"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate banner (if completed) */}
                        {isCourseCompleted && (
                            <Card className="border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-[28px] shadow-sm">
                                <CardHeader className="flex items-center gap-3 p-6 pb-2">
                                    <FaTrophy className="text-3xl text-emerald-600" />
                                    <div>
                                        <h3 className="font-black text-lg text-emerald-950 flex items-center gap-1.5">
                                            <span>{language === "en" ? "Congratulations! Course Completed" : "অভিনন্দন! কোর্স সফলভাবে সম্পন্ন হয়েছে"}</span>
                                            <Sparkles className="w-5 h-5 text-emerald-600" />
                                        </h3>
                                        <p className="text-xs text-emerald-800">
                                            {language === "en" ? "Your verifiable certificate of completion is ready." : "আপনার অফিসিয়াল ভেরিফায়েড সার্টিফিকেট প্রস্তুত।"}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody className="p-6 pt-2">
                                    <Button
                                        color="success"
                                        size="lg"
                                        radius="full"
                                        className="font-black text-white shadow-md"
                                        startContent={<FaDownload />}
                                        onPress={() => {
                                             const certificateUrl = `/api/certificate/generate?courseId=${actualCourseId}&courseName=${encodeURIComponent(course.title)}`;
                                            window.open(certificateUrl, "_blank");
                                        }}
                                    >
                                        {language === "en" ? "Download Official Certificate" : "সার্টিফিকেট ডাউনলোড করুন"}
                                    </Button>
                                </CardBody>
                            </Card>
                        )}

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm">
                            <Tabs
                                selectedKey={selectedTab}
                                onSelectionChange={(key) => setSelectedTab(key as string)}
                                size="lg"
                                radius="full"
                                color="primary"
                                variant="solid"
                                className="mb-6"
                                classNames={{
                                    tabList: "bg-[#F0F4F8] p-1.5 rounded-full flex flex-wrap sm:flex-nowrap gap-1",
                                    tab: "font-black text-xs sm:text-sm py-3 px-5 transition-all data-[selected=true]:shadow-md",
                                    cursor: "bg-[#3B82F6] text-white rounded-full",
                                }}
                            >
                                <Tab
                                    key="overview"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{language === "en" ? "Course Overview" : "কোর্স বিবরণ"}</span>
                                        </div>
                                    }
                                />
                                <Tab
                                    key="curriculum"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{language === "en" ? "Curriculum & Modules" : "সিলেবাস ও পাঠ্যসূচি"}</span>
                                        </div>
                                    }
                                />
                                <Tab
                                    key="instructor"
                                    title={
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            <span>
                                                {instructorsList.length > 1
                                                    ? (language === "en" ? `Meet Mentors (${instructorsList.length})` : `ইন্সট্রাক্টরবৃন্দ (${instructorsList.length})`)
                                                    : (language === "en" ? "Meet Instructor" : "ইন্সট্রাক্টর পরিচিতি")}
                                            </span>
                                        </div>
                                    }
                                />
                                {hasAccess && (
                                    <Tab
                                        key="assessments"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                <span>{language === "en" ? "Assessments" : "অ্যাসাইনমেন্ট ও কুইজ"}</span>
                                            </div>
                                        }
                                    />
                                )}
                            </Tabs>

                            {/* TAB 1: OVERVIEW */}
                            {selectedTab === "overview" && (
                                <div className="space-y-8 animate-fadeIn">
                                    
                                    {/* About Section */}
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2C] mb-3 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-amber-500" />
                                            <span>{language === "en" ? "About This Course" : "কোর্সটি কেন বিশেষ?"}</span>
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                            {enrichedDetail?.[language]?.overview ||
                                             (isPython
                                                ? "লার্ন অ্যান্ড গ্রোর 'পাইথন প্রোগ্রামিং ফর টিনস' কোর্সটি বিশেষভাবে স্কুল ও কলেজের শিক্ষার্থীদের জন্য ডিজাইন করা হয়েছে। এখানে তত্ত্বীয় মুখস্থবিদ্যার বদলে হাতে-কলমে প্রজেক্ট তৈরি করে প্রোগ্রামিংয়ের মূল দর্শন শেখানো হয়। শিক্ষার্থীরা ভ্যারিয়েবল ও লুপ থেকে শুরু করে অবজেক্ট ওরিয়েন্টেড ডিজাইন এবং আধুনিক এআই চ্যাটবট অ্যাপ্লিকেশন তৈরি করতে সক্ষম হবে।"
                                                : "জুনিয়র রোবটিক্স উইথ আর্দুইনো কোর্সটি শিশুদের প্রযুক্তি নির্মাতা হিসেবে গড়ে তোলে। মাইক্রোকন্ট্রোলার প্রোগ্রামিং, সার্কিট মেকিং, সেন্সর লজিক এবং মোটর নিয়ন্ত্রণের মাধ্যমে শিক্ষার্থীরা রোবট তৈরি করে বাস্তব পৃথিবীর নানা সমস্যার উদ্ভাবনী সমাধান তৈরি করতে শেখে।")}
                                        </p>
                                        {course.description && (
                                            <div
                                                className="prose prose-sm max-w-none text-gray-500 overflow-x-hidden pt-2 border-t border-gray-100"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeHtml(String(course.description || "")),
                                                }}
                                            />
                                        )}
                                    </div>

                                    {/* What You Will Learn (6 Core Outcomes) */}
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2C] mb-4 flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            <span>{language === "en" ? "What You Will Learn" : "এই কোর্সে যা যা শিখবেন"}</span>
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                            {learningOutcomes.map((outcome: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 hover:border-blue-200 transition-colors"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </div>
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                                                        {outcome}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tools & Tech Stack */}
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2C] mb-4 flex items-center gap-2">
                                            <Wrench className="w-5 h-5 text-indigo-600" />
                                            <span>{language === "en" ? "Tools & Technologies You'll Master" : "যেসব সফটওয়্যার ও টুলস শেখানো হবে"}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-2.5">
                                            {toolsList.map((tool, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border ${tool.color}`}
                                                >
                                                    <span>{renderToolIcon(tool.name)}</span>
                                                    <span>{tool.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Who Is This Course For */}
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2C] mb-4 flex items-center gap-2">
                                            <Users className="w-5 h-5 text-purple-600" />
                                            <span>{language === "en" ? "Who Is This Course For?" : "কোর্সটি কাদের জন্য উপযুক্ত?"}</span>
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {whoIsThisFor.map((item: string, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/50 border border-blue-100/60"
                                                >
                                                    <Check className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                                                        {item}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Prerequisites */}
                                    <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                                        <h4 className="text-base font-black text-[#92620A] mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-[#92620A]" />
                                            <span>{language === "en" ? "Prerequisites & Requirements" : "পূর্বপ্রস্তুতি ও প্রয়োজনীয় উপকরণ"}</span>
                                        </h4>
                                        <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                                            {prerequisites.map((req: string, idx: number) => (
                                                <li key={idx} className="flex items-center gap-2 font-medium">
                                                    <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                                    <span>{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Kodland Differentiator Cards */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2C] mb-4 flex items-center gap-2">
                                            <Award className="w-5 h-5 text-[#3B82F6]" />
                                            <span>{language === "en" ? "The Learn & Grow Advantage" : "লার্ন অ্যান্ড গ্রোর বিশেষ সুবিধাসমূহ"}</span>
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 text-center">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#3B82F6] flex items-center justify-center mx-auto mb-2 text-lg">
                                                    <Video className="w-5 h-5 text-[#3B82F6]" />
                                                </div>
                                                <h5 className="font-black text-sm text-gray-900 mb-1">
                                                    {language === "en" ? "Live, Not Recorded" : "১০০% লাইভ ক্লাস"}
                                                </h5>
                                                <p className="text-xs text-gray-500 leading-snug">
                                                    {language === "en"
                                                        ? "Direct 2-way live video instruction with real-time feedback."
                                                        : "কোনো রেকর্ডেড ভিডিও নয়; শিক্ষক ও শিক্ষার্থী সরাসরি লাইভে কোডিং করেন।"}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 text-center">
                                                <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto mb-2 text-lg">
                                                    <Users className="w-5 h-5 text-[#7C3AED]" />
                                                </div>
                                                <h5 className="font-black text-sm text-gray-900 mb-1">
                                                    {language === "en" ? "1-on-1 Mentorship" : "ব্যক্তিগত মেন্টরিং"}
                                                </h5>
                                                <p className="text-xs text-gray-500 leading-snug">
                                                    {language === "en"
                                                        ? "Screen-sharing bug fixes & dedicated doubt-solving assistance."
                                                        : "ছোট ব্যাচে প্রতি শিশুর কোড স্ক্রিন-শেয়ারে সাথে সাথে ডিবাগ করা হয়।"}
                                                </p>
                                            </div>
                                            <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 text-center">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-lg">
                                                    <Award className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <h5 className="font-black text-sm text-gray-900 mb-1">
                                                    {language === "en" ? "Global Credential" : "ভেরিফায়েড সার্টিফিকেট"}
                                                </h5>
                                                <p className="text-xs text-gray-500 leading-snug">
                                                    {language === "en"
                                                        ? "Online verifiable digital certificate for school & college portfolios."
                                                        : "অনলাইনে ভেরিফিকেশনযোগ্য সনদপত্র যা ভবিষ্যৎ কলেজ আবেদনের উপযোগী।"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: CURRICULUM */}
                            {selectedTab === "curriculum" && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900">
                                                {language === "en" ? "Detailed Course Modules" : "কোর্স মডিউল ও পাঠ্যসূচি"}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {modules.length > 0 ? `${modules.length} Modules • ${totalLessons} Lessons` : "Comprehensive step-by-step syllabus"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Render API CourseModules */}
                                    <CourseModules
                                        courseId={actualCourseId}
                                        isEnrolled={isEnrolled}
                                        modulesFromApi={course.modules}
                                        hasAccess={hasAccess}
                                        canViewPreview={canViewPreview}
                                    />

                                    {/* Also render syllabus roadmap if from coursesData */}
                                    {enrichedDetail && enrichedDetail[language]?.syllabus && (
                                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                                            <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-[#3B82F6]" />
                                                <span>{language === "en" ? "Weekly Learning Milestones" : "সাপ্তাহিক শিখন মাইলফলক"}</span>
                                            </h4>
                                            <div className="space-y-3">
                                                {enrichedDetail[language].syllabus.map((weekItem: any) => (
                                                    <div
                                                        key={weekItem.week}
                                                        className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 flex flex-col sm:flex-row sm:items-start gap-3"
                                                    >
                                                        <div className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-black rounded-lg self-start">
                                                            {language === "en" ? `Week ${weekItem.week}` : `সপ্তাহ ${weekItem.week}`}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-bold text-sm text-gray-900 mb-1.5">
                                                                {weekItem.title}
                                                            </h5>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {weekItem.topics.map((t: string, tidx: number) => (
                                                                    <span
                                                                        key={tidx}
                                                                        className="px-2.5 py-1 bg-white text-gray-600 rounded-md text-xs border border-gray-200"
                                                                    >
                                                                        • {t}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: INSTRUCTOR */}
                            {selectedTab === "instructor" && (
                                <div className="space-y-6 animate-fadeIn">
                                    {instructorsList.map((inst, index) => (
                                        <div 
                                            key={inst.id || index}
                                            className="p-6 sm:p-8 rounded-[24px] bg-[#F8F9FA] border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left transition-all hover:shadow-sm"
                                        >
                                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-[#3B82F6] to-[#F59E0B] shadow-lg flex-shrink-0">
                                                <img
                                                    src={inst.image}
                                                    alt={inst.name}
                                                    className="w-full h-full object-cover rounded-full bg-white"
                                                    onError={(e) => {
                                                        const img = e.currentTarget;
                                                        img.onerror = null;
                                                        img.src = "/logo.png";
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                                                    <h3 className="text-2xl font-black text-[#2C2C2C]">
                                                        {inst.name}
                                                    </h3>
                                                    {instructorsList.length > 1 && (
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                                                            index === 0
                                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                                : "bg-purple-50 text-purple-700 border-purple-200"
                                                        }`}>
                                                            {index === 0 
                                                                ? (language === "en" ? "Lead Instructor" : "প্রধান শিক্ষক")
                                                                : (language === "en" ? "Co-Instructor" : "সহযোগী শিক্ষক")}
                                                        </span>
                                                    )}
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                                        <Check className="w-3 h-3 text-emerald-600 inline mr-0.5" />
                                                        {language === "en" ? "Verified Mentor" : "ভেরিফায়েড শিক্ষক"}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-[#3B82F6] mb-1">
                                                    {inst.role}
                                                </p>
                                                <p className="text-xs text-gray-500 mb-3">
                                                    {inst.institution} {inst.qualification && `• ${inst.qualification}`}
                                                </p>
                                                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                    {inst.bio}
                                                </p>
                                                <Button
                                                    color="primary"
                                                    variant="flat"
                                                    size="sm"
                                                    radius="full"
                                                    className="font-bold text-xs"
                                                    onPress={() => openTrialModal({ program: `${displayTitle} (${inst.name})`, source: "instructor-tab" })}
                                                >
                                                    {language === "en" 
                                                        ? `Book Trial with ${inst.name.split(" ")[0]}` 
                                                        : `${inst.name}-এর সাথে ট্রায়াল বুক করুন`}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TAB 4: ASSESSMENTS (Enrolled only) */}
                            {selectedTab === "assessments" && hasAccess && (
                                <div className="space-y-4 animate-fadeIn">
                                    <UnifiedAssessmentView courseId={actualCourseId} hasAccess={hasAccess} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sticky Column: Kodland Pricing & Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[28px] border-2 border-[#3B82F6]/30 shadow-xl p-6 lg:sticky lg:top-24 space-y-6 overflow-hidden">
                            
                            {/* Top Batch Alert Ribbon */}
                            <div className="bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white py-2 px-3.5 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm">
                                <Flame className="w-4 h-4 text-amber-300" />
                                <span>{language === "en" ? "Live Cohort • Limited Seats" : "সীমিত আসন • পরবর্তী ব্যাচ শিগগিরই"}</span>
                            </div>

                            {/* Price Block */}
                            <div className="text-center pt-1 pb-2">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <span className="text-sm text-gray-400 line-through font-semibold">
                                        ৳{regularPrice.toLocaleString()}
                                    </span>
                                    <span className="px-2 py-0.5 bg-[#FFF8E1] text-[#92620A] text-xs font-black rounded-full border border-[#FFE082]">
                                        {language === "en" ? "SAVE 40%" : "৪০% ছাড়"}
                                    </span>
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-[#2C2C2C] tracking-tight">
                                    ৳ {currentPrice.toLocaleString()}
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1">
                                    {language === "en" ? "Full Course Tuition • No Hidden Fees" : "সম্পূর্ণ কোর্সের ফি • কোনো অতিরিক্ত ফি নেই"}
                                </p>
                            </div>

                            <Divider className="my-1" />

                            {/* Mentor Quick Info */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                                        {instructorsList.length > 1
                                            ? (language === "en" ? "Course Mentors" : "কোর্স মেন্টরবৃন্দ")
                                            : (language === "en" ? "Course Mentor" : "কোর্স মেন্টর")}
                                    </span>
                                    {instructorsList.length > 1 && (
                                        <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                                            {instructorsList.length} {language === "en" ? "Mentors" : "জন শিক্ষক"}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {instructorsList.map((inst, idx) => (
                                        <div key={inst.id || idx} className="flex items-center gap-3 p-2.5 bg-[#F8F9FA] rounded-2xl border border-gray-100 hover:border-blue-200 transition-colors">
                                            <img
                                                src={inst.image}
                                                alt={inst.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-[#3B82F6] flex-shrink-0"
                                                onError={(e) => {
                                                    const img = e.currentTarget;
                                                    img.onerror = null;
                                                    img.src = "/logo.png";
                                                }}
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{inst.name}</p>
                                                    {instructorsList.length > 1 && (
                                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                                            idx === 0 
                                                                ? "text-blue-700 bg-blue-100/70" 
                                                                : "text-purple-700 bg-purple-100/70"
                                                        }`}>
                                                            {idx === 0 
                                                                ? (language === "en" ? "Lead" : "প্রধান") 
                                                                : (language === "en" ? "Mentor" : "সহযোগী")}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-[#3B82F6] font-medium truncate">{inst.institution || inst.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 7-Point Course Value Checklist */}
                            <div className="space-y-2.5">
                                <p className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">
                                    {language === "en" ? "Course Package Includes:" : "কোর্সে যা যা পাচ্ছেন:"}
                                </p>
                                <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "100% Live Interactive Classes (2x/week)" : "১০০% লাইভ ইন্টারঅ্যাক্টিভ ক্লাস (সপ্তাহে ২ দিন)"}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "Batch Size (10-15 Students per Cohort)" : "ব্যাচ সাইজ (১০-১৫ জন শিক্ষার্থী)"}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "1-on-1 Live Doubt Solving & Support" : "ক্লাসেই সরাসরি ১-অন-১ ডাউট সলভিং"}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "5+ Hands-on Portfolio Projects" : "৫+ বাস্তব প্রজেক্ট পোর্টফোলিও"}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "Verifiable STEM Completion Certificate" : "ভেরিফায়েড কোর্স সমাপন সার্টিফিকেট"}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "Lifetime Access to Recordings & Notes" : "রেকর্ডিং ও রিসোর্সে লাইফটাইম অ্যাক্সেস"}</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        <span className="leading-snug">{language === "en" ? "Continuous Parent Progress Updates" : "অভিভাবকদের নিয়মিত অগ্রগতি রিপোর্ট"}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Urgency Countdown info */}
                            <RegistrationInfo course={course} language={language} />

                            {/* Action Buttons */}
                            <div className="space-y-2.5 pt-2">
                                {isAwaitingApproval ? (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                                        <p className="text-amber-800 text-xs font-bold">
                                            {language === "en"
                                                ? "Your order is pending admin verification."
                                                : "আপনার এনরোলমেন্ট অনুমোদনের অপেক্ষায় রয়েছে।"}
                                        </p>
                                    </div>
                                ) : hasAccess ? (
                                    <Button
                                        color="success"
                                        size="lg"
                                        radius="full"
                                        className="w-full font-black text-white shadow-lg shadow-emerald-500/25 py-6 text-base"
                                        onPress={() => router.push(`/student/course/${actualCourseId}/dashboard`)}
                                        startContent={<GraduationCap className="w-5 h-5" />}
                                    >
                                        {language === "en" ? "Start Learning Now" : "ক্লাস শুরু করুন"}
                                    </Button>
                                ) : isFree ? (
                                    <Button
                                        color="success"
                                        size="lg"
                                        radius="full"
                                        className="w-full font-black text-white shadow-lg py-6 text-base"
                                        onPress={handleEnrollClick}
                                        startContent={<GraduationCap className="w-5 h-5" />}
                                    >
                                        {language === "en" ? "Enroll for Free" : "ফ্রিতে এনরোল করুন"}
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            className="w-full font-black text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-xl shadow-blue-500/30 py-6 text-base rounded-2xl transition-all hover:scale-[1.02]"
                                            onPress={handleEnrollClick}
                                            isDisabled={!isEnrollmentOpen(course)}
                                        >
                                            {isEnrollmentOpen(course) 
                                                ? `${language === "en" ? "Enroll Now — ৳" : "এনরোল করুন — ৳"}${currentPrice.toLocaleString()}`
                                                : (language === "en" ? "Enrollment Closed" : "ভর্তি বন্ধ রয়েছে")}
                                        </Button>

                                        {/* Book Free Trial Button */}
                                        <Button
                                            variant="bordered"
                                            className="w-full font-extrabold text-[#3B82F6] border-2 border-[#3B82F6] hover:bg-blue-50 py-5 text-sm rounded-2xl transition-all"
                                            onPress={() => openTrialModal({ program: displayTitle, source: "course_sidebar" })}
                                        >
                                            {language === "en" ? "Book Free Trial Class" : "ফ্রি ট্রায়াল ক্লাস বুক করুন"}
                                        </Button>
                                    </>
                                )}
                            </div>

                            <Divider className="my-1" />

                            {/* Trust Guarantees */}
                            <div className="space-y-2 pt-1 text-[11px] text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <span>{language === "en" ? "7-Day 100% Money-Back Guarantee" : "৭ দিনের ১০০% মানি-ব্যাক গ্যারান্টি"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span>{language === "en" ? "bKash, Nagad, Rocket & Cards accepted" : "বিকাশ, নগদ, রকেট ও কার্ডে পেমেন্ট গ্রহণযোগ্য"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span>{language === "en" ? "256-Bit SSL Encrypted Safe Checkout" : "নিরাপদ ও এনক্রিপ্টেড পেমেন্ট গেটওয়ে"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function isEnrollmentOpen(course: any): boolean {
    if (course?.isRegistrationOpen === undefined) return true;
    const open = !!course?.isRegistrationOpen;
    const deadline = course?.registrationDeadline ? new Date(course.registrationDeadline) : null;
    const now = new Date();
    if (deadline && !isNaN(deadline.getTime())) {
        return open && now < deadline;
    }
    return open;
}

function RegistrationInfo({ course, language }: { course: any; language: "en" | "bn" }) {
    const deadline = useMemo(() => {
        if (!course?.registrationDeadline) return null;
        const d = new Date(course.registrationDeadline);
        return isNaN(d.getTime()) ? null : d;
    }, [course?.registrationDeadline]);

    const [remaining, setRemaining] = useState<string>("");

    useEffect(() => {
        if (!deadline) return;
        const tick = () => {
            const now = new Date().getTime();
            const end = deadline.getTime();
            const diff = end - now;
            if (diff <= 0) {
                setRemaining(language === "en" ? "Closed" : "সময় শেষ");
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [deadline, language]);

    const open = isEnrollmentOpen(course);

    return (
        <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-gray-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-600">
                    {language === "en" ? "Batch Status:" : "ব্যাচ স্ট্যাটাস:"}
                </span>
                <span className={`font-black ${open ? "text-emerald-600" : "text-red-500"}`}>
                    {open ? (language === "en" ? "Admissions Open" : "ভর্তি চলছে") : (language === "en" ? "Batch Full" : "ভর্তি বন্ধ")}
                </span>
            </div>
            {deadline && (
                <div className="flex items-center justify-between font-medium">
                    <span className="text-gray-500">
                        {language === "en" ? "Deadline in:" : "রেজিস্ট্রেশন বাকি:"}
                    </span>
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {remaining}
                    </span>
                </div>
            )}
        </div>
    );
}
