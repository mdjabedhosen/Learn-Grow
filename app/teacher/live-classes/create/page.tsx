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
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function TeacherScheduleClassPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        courseId: "",
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 60,
        meetingLink: "",
        maxParticipants: 50,
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
        console.log("Scheduling live class:", formData);
        alert("Live class scheduled successfully! (Mock mode)\nStudents will be notified via email.");
        router.push("/dashboard");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

                <Card>
                    <CardHeader className="flex-col items-start p-6">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">Schedule Live Class</h1>
                            <Chip color="secondary" variant="flat">Teacher</Chip>
                        </div>
                        <p className="text-gray-600">Schedule a live class for one of your courses</p>
                    </CardHeader>
                    <CardBody className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                label="Class Title"
                                placeholder="e.g., React Hooks Deep Dive"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                isRequired
                                variant="bordered"
                            />

                            <Textarea
                                label="Description"
                                placeholder="What will be covered in this class..."
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                minRows={3}
                                variant="bordered"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    type="date"
                                    label="Date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    isRequired
                                    variant="bordered"
                                />

                                <Input
                                    type="time"
                                    label="Time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    isRequired
                                    variant="bordered"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    type="number"
                                    label="Duration (minutes)"
                                    placeholder="60"
                                    name="duration"
                                    value={formData.duration.toString()}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                    isRequired
                                    variant="bordered"
                                />

                                <Input
                                    type="number"
                                    label="Max Participants"
                                    placeholder="50"
                                    name="maxParticipants"
                                    value={formData.maxParticipants.toString()}
                                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                                    isRequired
                                    variant="bordered"
                                />
                            </div>

                            <Input
                                label="Meeting Link"
                                placeholder="https://meet.google.com/xxx-xxxx-xxx or Zoom link"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                isRequired
                                variant="bordered"
                                description="Google Meet, Zoom, or any video conferencing link"
                            />

                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-900">
                                    🎥 <strong>Note:</strong> All enrolled students will receive an email notification with the class details and meeting link.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="flex-1"
                                >
                                    Schedule Class
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
