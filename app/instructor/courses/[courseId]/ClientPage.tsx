"use client";

import React, { useState } from "react";
import {
    Card,
    CardBody,
    Button,
    Tabs,
    Tab,
    Chip,
    Progress,
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
    FaEye
} from "react-icons/fa";

// Reuse the instructor quizzes page component logic or import it?
// For now, I'll inline a simplified assessment list for this course.

// Hardcoded sample/main courses for static generation (needs to be available here too if we want to look it up client side, 
// or ideally passed as props from the server page, but for now I'll duplicate/move it or just accept props)

export default function InstructorCourseDashboardClient({ params }: { params: { courseId: string } }) {
    const router = useRouter();
    const { courseId } = params;
    const [activeTab, setActiveTab] = useState("overview");

    // Hardcoded sample/main courses (same as in page.tsx for consistency)
    const SAMPLE_COURSES = [
        {
            id: "1",
            title: "Web Development Bootcamp",
            description: "The complete guide to becoming a full-stack developer.",
            price: 2000,
            enrolled: 45,
            rating: 4.8,
            status: "published"
        },
        {
            id: "2",
            title: "Python for Kids",
            description: "A fun and interactive introduction to Python programming.",
            price: 1500,
            enrolled: 32,
            rating: 4.9,
            status: "published"
        },
        {
            id: "3",
            title: "Robotics Basics",
            description: "Learn the fundamentals of robotics and electronics.",
            price: 2500,
            enrolled: 18,
            rating: 4.7,
            status: "published"
        },
        {
            id: "4",
            title: "Game Development with Scratch",
            description: "Create your own games using Scratch visual programming.",
            price: 1200,
            enrolled: 60,
            rating: 4.9,
            status: "published"
        }
    ];

    // Find the current course from mock data
    const courseData = SAMPLE_COURSES.find(c => c.id === courseId) || SAMPLE_COURSES[0];

    const course = {
        ...courseData,
        lastUpdated: "2024-12-08",
        progress: 35, // Average student progress
        modules: 12,
        lessons: 48,
        totalDuration: "24h 30m"
    };

    // Assessment Logic
    const assessments = [
        { id: "101", type: "quiz", title: "HTML Basics Quiz", questions: 15, status: "published", submissions: 42 },
        { id: "102", type: "assignment", title: "Build a Portfolio Website", dueDate: "2024-12-20", status: "active", submissions: 12 },
        { id: "103", type: "mid-exam", title: "Mid-Term Exam", questions: 40, status: "draft", submissions: 0 },
    ];

    const getStatusColor = (status: string) => status === "published" || status === "active" ? "success" : "warning";

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Top Navigation */}
            <Button
                variant="light"
                startContent={<FaArrowLeft />}
                onPress={() => router.push("/instructor/courses")}
                className="mb-6"
            >
                Back to Courses
            </Button>

            {/* Course Header */}
            <Card className="mb-8 border-none shadow-md bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                <CardBody className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Chip
                                    color={course.status === "published" ? "success" : "warning"}
                                    variant="solid"
                                    className="border border-white/30"
                                >
                                    {course.status.toUpperCase()}
                                </Chip>
                                <span className="text-blue-100 flex items-center gap-1">
                                    <FaUsers /> {course.enrolled} Enrolled
                                </span>
                                <span className="text-blue-100 flex items-center gap-1">
                                    ⭐ {course.rating}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                            <p className="text-blue-100 max-w-2xl">{course.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                startContent={<FaEdit />}
                                className="bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
                            >
                                Edit Details
                            </Button>
                            <Button
                                startContent={<FaEye />}
                                className="bg-white text-blue-900 font-semibold"
                                onPress={() => router.push(`/courses/${courseId}`)}
                            >
                                Preview
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>

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
                    tab: "max-w-fit px-0 h-12",
                    tabContent: "group-data-[selected=true]:text-primary font-semibold text-lg"
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <Card>
                            <CardBody className="p-6">
                                <h3 className="text-gray-500 font-medium mb-2">Student Engagement</h3>
                                <div className="text-4xl font-bold mb-4">87%</div>
                                <Progress value={87} color="success" className="h-2" />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="p-6">
                                <h3 className="text-gray-500 font-medium mb-2">Completion Rate</h3>
                                <div className="text-4xl font-bold mb-4">12%</div>
                                <Progress value={12} color="warning" className="h-2" />
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="p-6">
                                <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
                                <div className="text-4xl font-bold text-green-600">৳ 90,000</div>
                                <p className="text-xs text-gray-400 mt-1">+15% from last month</p>
                            </CardBody>
                        </Card>
                    </div>
                </Tab>

                {/* Curriculum Tab (Placeholder) */}
                <Tab
                    key="curriculum"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaBookOpen />
                            <span>Curriculum</span>
                        </div>
                    }
                >
                    <Card className="mt-6">
                        <CardBody className="p-8 text-center text-gray-500">
                            <FaBookOpen className="text-6xl mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-bold mb-2">Curriculum Management</h3>
                            <p>Manage modules, lectures, and video content here.</p>
                            <Button className="mt-4" color="primary" variant="flat">Manage Curriculum</Button>
                        </CardBody>
                    </Card>
                </Tab>

                {/* Students Tab (Placeholder) */}
                <Tab
                    key="students"
                    title={
                        <div className="flex items-center space-x-2">
                            <FaUsers />
                            <span>Students</span>
                        </div>
                    }
                >
                    <Card className="mt-6">
                        <CardBody className="p-8 text-center text-gray-500">
                            <FaGraduationCap className="text-6xl mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-bold mb-2">Enrolled Students</h3>
                            <p>View and manage the {course.enrolled} students enrolled in this course.</p>
                        </CardBody>
                    </Card>
                </Tab>

                {/* ASSESSMENTS TAB - The user's request */}
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
                                <p className="text-gray-600">Manage quizzes, exams, and assignments for this course.</p>
                            </div>
                            {/* Auto-select this course when creating */}
                            <Button
                                color="primary"
                                size="lg"
                                startContent={<FaPlus />}
                                onPress={() => router.push(`/instructor/quizzes/create?courseId=${courseId}&courseTitle=${encodeURIComponent(course.title)}`)}
                            >
                                Create Assessment
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {assessments.map((assessment) => (
                                <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                                    <CardBody className="p-4 flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-lg ${assessment.type === 'quiz' ? 'bg-purple-100 text-purple-600' :
                                                assessment.type === 'mid-exam' ? 'bg-orange-100 text-orange-600' :
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
                                                    {assessment.type === 'assignment'
                                                        ? `Due: ${new Date(assessment.dueDate!).toLocaleDateString()}`
                                                        : `${assessment.questions} Questions`}
                                                    {' • '}
                                                    {assessment.submissions} Submissions
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
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
                                    <Button
                                        color="primary"
                                        variant="flat"
                                        onPress={() => router.push(`/instructor/quizzes/create?courseId=${courseId}&courseTitle=${encodeURIComponent(course.title)}`)}
                                    >
                                        Create Your First Assessment
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}
