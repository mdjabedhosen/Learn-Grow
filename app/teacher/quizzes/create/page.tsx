"use client";

import React, { useState, useEffect } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
    Card,
    CardBody,
    CardHeader,
    Input,
    Textarea,
    Button,
    Select,
    SelectItem,
    Chip,
    Tabs,
    Tab,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { QuizType, AssignmentType } from "@/redux/slices/quizAssignmentSlice";

type AssessmentCategory = "quiz-based" | "submission-based";

export default function CreateAssessmentPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);

    // Form State
    const [assessmentType, setAssessmentType] = useState<QuizType | AssignmentType>("quiz");
    const [formData, setFormData] = useState({
        courseId: "",
        title: "",
        description: "",
        // Quiz/Exam specific
        duration: 30,
        passingScore: 70,
        // Common
        totalMarks: 100,
        // Assignment/Project specific
        dueDate: "",
    });

    useEffect(() => {
        // TODO: Fetch courses assigned to this teacher
        setCourses([
            { id: "1", title: "Web Development Bootcamp" },
            { id: "2", title: "Python for Kids" },
            { id: "3", title: "Robotics Basics" },
        ]);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const isQuizBased = ["quiz", "mid-exam", "final-exam"].includes(assessmentType);

        const payload = {
            type: assessmentType,
            ...formData,
            createdAt: new Date().toISOString(),
            // Clean up irrelevant fields based on type
            ...(isQuizBased ? { dueDate: undefined } : { duration: undefined, passingScore: undefined })
        };

        console.log("Creating assessment:", payload);

        let successMessage = "";
        if (isQuizBased) {
            successMessage = "Assessment created successfully! (Mock mode)\nYou can now add questions to this assessment.";
        } else {
            successMessage = "Assignment created successfully! (Mock mode)\nStudents can now view this in their dashboard.";
        }

        alert(successMessage);
        router.push("/dashboard");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const renderQuizFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <Input
                type="number"
                label="Duration (minutes)"
                placeholder="30"
                name="duration"
                value={formData.duration.toString()}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                isRequired
                variant="bordered"
                description="Time allowed for the exam"
            />
            <Input
                type="number"
                label="Passing Score (%)"
                placeholder="70"
                name="passingScore"
                value={formData.passingScore.toString()}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                isRequired
                variant="bordered"
            />
            <Input
                type="number"
                label="Total Marks"
                placeholder="100"
                name="totalMarks"
                value={formData.totalMarks.toString()}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                isRequired
                variant="bordered"
            />
        </div>
    );

    const renderAssignmentFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <Input
                type="datetime-local"
                label="Due Date"
                placeholder="Select date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                isRequired
                variant="bordered"
                description="When is this assignment due?"
            />
            <Input
                type="number"
                label="Total Marks"
                placeholder="100"
                name="totalMarks"
                value={formData.totalMarks.toString()}
                onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                isRequired
                variant="bordered"
            />
        </div>
    );

    return (
        <RequireAuth allowedRoles={["teacher", "admin"]}>
            <div className="container mx-auto px-6 py-8 max-w-4xl">
                <Button
                    variant="light"
                    onPress={() => router.back()}
                    className="mb-6"
                >
                    ← Back to Dashboard
                </Button>

                <Card className="w-full">
                    <CardHeader className="flex-col items-start p-6 border-b border-gray-100">
                        <div className="flex justify-between w-full items-center mb-2">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">Create Assessment</h1>
                                <Chip color="secondary" variant="flat" size="sm">Teacher</Chip>
                            </div>
                        </div>
                        <p className="text-gray-600">Create quizzes, exams, assignments, or projects for your students.</p>
                    </CardHeader>
                    <CardBody className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Assessment Type Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Assessment Type</label>
                                <div className="flex flex-wrap gap-2">
                                    {(["quiz", "mid-exam", "final-exam", "assignment", "project"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setAssessmentType(type)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${assessmentType === type
                                                    ? "bg-primary text-white shadow-md scale-105"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                } capitalize`}
                                        >
                                            {type.replace("-", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select
                                    label="Select Course"
                                    placeholder="Choose a course"
                                    isRequired
                                    variant="bordered"
                                    selectedKeys={formData.courseId ? [formData.courseId] : []}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                >
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    label="Title"
                                    placeholder={`e.g., ${assessmentType === 'project' ? 'Final Year Project' : 'JavaScript Basics'}`}
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    isRequired
                                    variant="bordered"
                                />
                            </div>

                            <Textarea
                                label="Description"
                                placeholder="Describe the requirements, topics covered, or instructions..."
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                minRows={3}
                                variant="bordered"
                            />

                            {/* Conditional Rendering based on Type */}
                            {["quiz", "mid-exam", "final-exam"].includes(assessmentType)
                                ? renderQuizFields()
                                : renderAssignmentFields()}

                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-900 flex items-center gap-2">
                                    <span>ℹ️</span>
                                    <strong>Note:</strong>
                                    {["quiz", "mid-exam", "final-exam"].includes(assessmentType)
                                        ? " After creating, you will be redirected to the question editor to add your questions."
                                        : " Students will be able to upload files or text submissions for this assessment."
                                    }
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="flex-1 font-semibold"
                                >
                                    Create {assessmentType.replace("-", " ")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="bordered"
                                    size="lg"
                                    onPress={() => router.back()}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </RequireAuth>
    );
}
