"use client";

import React, { useState, useEffect } from "react";
import RequireAuth from "@/components/Auth/RequireAuth";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { courses, Course } from "@/lib/coursesData";

export default function ManageCoursesPage() {
    const router = useRouter();
    const [courseList, setCourseList] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        // Load courses from data file
        setCourseList(courses);
    }, []);

    const filteredCourses = courseList.filter((course) =>
        course.en.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (courseId: string) => {
        if (confirm("Are you sure you want to delete this course?")) {
            setCourseList(courseList.filter((c) => c.id !== courseId));
            alert("Course deleted successfully! (Mock mode)");
            onClose();
        }
    };

    const handleViewDetails = (course: Course) => {
        setSelectedCourse(course);
        onOpen();
    };

    return (
        <RequireAuth allowedRoles={["admin"]}>
            <div className="container mx-auto px-6 py-8 max-w-7xl">
                <Button
                    variant="light"
                    onPress={() => router.push("/admin")}
                    className="mb-6"
                >
                    ← Back to Admin Dashboard
                </Button>

                <Card>
                    <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Manage Courses</h1>
                            <p className="text-gray-600 mt-1">
                                View, edit, and delete all courses
                            </p>
                        </div>
                        <Button
                            color="primary"
                            size="lg"
                            onPress={() => router.push("/admin/courses/create")}
                        >
                            + Create New Course
                        </Button>
                    </CardHeader>
                    <CardBody className="p-6">
                        {/* Search */}
                        <div className="mb-6">
                            <Input
                                placeholder="Search courses by name or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="lg"
                                startContent={<span>🔍</span>}
                                variant="bordered"
                            />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-blue-50">
                                <CardBody className="p-4">
                                    <p className="text-sm text-gray-600">Total Courses</p>
                                    <p className="text-3xl font-bold text-blue-600">{courseList.length}</p>
                                </CardBody>
                            </Card>
                            <Card className="bg-green-50">
                                <CardBody className="p-4">
                                    <p className="text-sm text-gray-600">Robotics</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {courseList.filter((c) => c.category === "Robotics").length}
                                    </p>
                                </CardBody>
                            </Card>
                            <Card className="bg-purple-50">
                                <CardBody className="p-4">
                                    <p className="text-sm text-gray-600">Programming</p>
                                    <p className="text-3xl font-bold text-purple-600">
                                        {courseList.filter((c) => c.category === "Programming").length}
                                    </p>
                                </CardBody>
                            </Card>
                            <Card className="bg-orange-50">
                                <CardBody className="p-4">
                                    <p className="text-sm text-gray-600">Mathematics</p>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {courseList.filter((c) => c.category === "Mathematics").length}
                                    </p>
                                </CardBody>
                            </Card>
                        </div>

                        {/* Courses Table */}
                        <Table aria-label="Courses table">
                            <TableHeader>
                                <TableColumn>COURSE</TableColumn>
                                <TableColumn>CATEGORY</TableColumn>
                                <TableColumn>DURATION</TableColumn>
                                <TableColumn>AGE RANGE</TableColumn>
                                <TableColumn>LEVEL</TableColumn>
                                <TableColumn>ACTIONS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{course.icon}</span>
                                                <div>
                                                    <p className="font-semibold">{course.en.title}</p>
                                                    <p className="text-xs text-gray-500">{course.bn.title}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip color="primary" variant="flat">
                                                {course.category}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>{course.duration}</TableCell>
                                        <TableCell>{course.ageRange}</TableCell>
                                        <TableCell>
                                            <Chip
                                                color={
                                                    course.level.includes("Beginner")
                                                        ? "success"
                                                        : course.level.includes("Advanced")
                                                            ? "danger"
                                                            : "warning"
                                                }
                                                variant="flat"
                                                size="sm"
                                            >
                                                {course.level}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    color="primary"
                                                    variant="flat"
                                                    onPress={() => handleViewDetails(course)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="warning"
                                                    variant="flat"
                                                    onPress={() => {
                                                        setSelectedCourse(course);
                                                        onEditOpen();
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    onPress={() => {
                                                        setSelectedCourse(course);
                                                        if (
                                                            confirm(
                                                                `Delete "${course.en.title}"? This action cannot be undone.`
                                                            )
                                                        ) {
                                                            handleDelete(course.id);
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {filteredCourses.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No courses found</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Try adjusting your search or create a new course
                                </p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Course Details Modal */}
                <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            {selectedCourse && (
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{selectedCourse.icon}</span>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {selectedCourse.en.title}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            {selectedCourse.bn.title}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </ModalHeader>
                        <ModalBody>
                            {selectedCourse && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Overview</h3>
                                        <p className="text-gray-700">{selectedCourse.en.overview}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Duration</p>
                                            <p className="font-semibold">{selectedCourse.duration}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Age Range</p>
                                            <p className="font-semibold">{selectedCourse.ageRange}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Category</p>
                                            <p className="font-semibold">{selectedCourse.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Level</p>
                                            <p className="font-semibold">{selectedCourse.level}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg mb-2">What You'll Learn</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {selectedCourse.en.whatYouWillLearn.map((item, idx) => (
                                                <li key={idx} className="text-gray-700">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg mb-2">
                                            Syllabus ({selectedCourse.en.syllabus.length} weeks)
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedCourse.en.syllabus.map((week) => (
                                                <Card key={week.week} className="bg-gray-50">
                                                    <CardBody className="p-3">
                                                        <p className="font-semibold">
                                                            Week {week.week}: {week.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {week.topics.join(" • ")}
                                                        </p>
                                                    </CardBody>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Edit Course Modal */}
                <Modal isOpen={isEditOpen} onClose={onEditClose} size="3xl" scrollBehavior="inside">
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{selectedCourse?.icon}</span>
                                <div>
                                    <h2 className="text-2xl font-bold">How to Edit This Course</h2>
                                    <p className="text-sm text-gray-500 font-normal">
                                        {selectedCourse?.en.title}
                                    </p>
                                </div>
                            </div>
                        </ModalHeader>
                        <ModalBody>
                            {selectedCourse && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                        <h3 className="font-bold text-blue-900 mb-2">📝 Manual Editing Required</h3>
                                        <p className="text-sm text-blue-800">
                                            This site uses <strong>static export</strong> for hosting on Hostinger.
                                            To edit courses, you need to modify the source code directly.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-lg mb-2">📍 Steps to Edit:</h3>
                                        <ol className="list-decimal list-inside space-y-2 text-sm">
                                            <li>Open file: <code className="bg-gray-100 px-2 py-1 rounded">lib/coursesData.ts</code></li>
                                            <li>Find course with ID: <code className="bg-gray-100 px-2 py-1 rounded">{selectedCourse.id}</code></li>
                                            <li>Edit the course object (see structure below)</li>
                                            <li>Save the file</li>
                                            <li>Rebuild: <code className="bg-gray-100 px-2 py-1 rounded">npm run build</code></li>
                                        </ol>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-lg">📋 Course Data Structure:</h3>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                variant="flat"
                                                onPress={() => {
                                                    const courseData = JSON.stringify({
                                                        id: selectedCourse.id,
                                                        category: selectedCourse.category,
                                                        duration: selectedCourse.duration,
                                                        ageRange: selectedCourse.ageRange,
                                                        level: selectedCourse.level,
                                                        icon: selectedCourse.icon,
                                                        "en.title": selectedCourse.en.title,
                                                        "bn.title": selectedCourse.bn.title,
                                                    }, null, 2);
                                                    navigator.clipboard.writeText(courseData);
                                                    alert("Course ID copied to clipboard!");
                                                }}
                                            >
                                                📋 Copy Course ID
                                            </Button>
                                        </div>
                                        <Card className="bg-gray-900">
                                            <CardBody className="p-4">
                                                <pre className="text-xs text-green-400 overflow-x-auto">
                                                    {`{
  id: "${selectedCourse.id}",
  category: "${selectedCourse.category}",
  duration: "${selectedCourse.duration}",
  ageRange: "${selectedCourse.ageRange}",
  level: "${selectedCourse.level}",
  icon: "${selectedCourse.icon}",
  en: {
    title: "${selectedCourse.en.title}",
    tagline: "${selectedCourse.en.tagline}",
    overview: "...",
  },
  bn: {
    title: "${selectedCourse.bn.title}",
    tagline: "${selectedCourse.bn.tagline}",
    overview: "...",
  }
}`}
                                                </pre>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                                        <h3 className="font-bold text-orange-900 mb-2">💡 Want Dynamic Editing?</h3>
                                        <p className="text-sm text-orange-800">
                                            To enable full admin panel with database-backed editing:
                                        </p>
                                        <ul className="list-disc list-inside text-sm text-orange-800 mt-2 space-y-1">
                                            <li>Remove <code className="bg-orange-100 px-1 rounded">output: 'export'</code> from next.config.js</li>
                                            <li>Add a database (MongoDB/PostgreSQL)</li>
                                            <li>Create API routes for CRUD operations</li>
                                            <li>Deploy to Vercel/Railway instead of Hostinger</li>
                                        </ul>
                                        <p className="text-xs text-orange-700 mt-3">
                                            See <strong>STATIC_EXPORT_LIMITATIONS.md</strong> for details.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onEditClose}>
                                Got It
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </RequireAuth>
    );
}
