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

export default function TeacherCreateModulePage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        courseId: "",
        title: "",
        description: "",
        order: 1,
    });

    useEffect(() => {
        // TODO: Fetch courses assigned to this teacher
        // Mock data for now
        setCourses([
            { id: "1", title: "Web Development Bootcamp" },
            { id: "2", title: "Python for Kids" },
            { id: "3", title: "Robotics Basics" },
        ]);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Replace with actual API call
        console.log("Creating module:", formData);
        alert("Module created successfully! (Mock mode)");
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
                            <h1 className="text-2xl font-bold">Create New Module</h1>
                            <Chip color="secondary" variant="flat">Teacher</Chip>
                        </div>
                        <p className="text-gray-600">Add a new module to one of your courses</p>
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
                                label="Module Title"
                                placeholder="e.g., Introduction to React Hooks"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                isRequired
                                variant="bordered"
                            />

                            <Textarea
                                label="Description"
                                placeholder="Describe what students will learn in this module..."
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                minRows={4}
                                isRequired
                                variant="bordered"
                            />

                            <Input
                                type="number"
                                label="Module Order"
                                placeholder="1"
                                name="order"
                                value={formData.order.toString()}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                isRequired
                                variant="bordered"
                                description="The position of this module in the course sequence"
                            />

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    color="primary"
                                    size="lg"
                                    className="flex-1"
                                >
                                    Create Module
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
