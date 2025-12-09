"use client";

import React from "react";
import { Card, CardBody, CardHeader, Button, Avatar, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
    const router = useRouter();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const stats = [
        { label: "My Courses", value: 5, color: "bg-blue-500", icon: "📚" },
        { label: "Total Students", value: 127, color: "bg-green-500", icon: "👨‍🎓" },
        { label: "Live Classes Today", value: 2, color: "bg-orange-500", icon: "🎥" },
        { label: "Pending Grading", value: 8, color: "bg-purple-500", icon: "📝" },
    ];

    const upcomingClasses = [
        { id: 1, title: "React Fundamentals", time: "10:00 AM", students: 32, course: "Web Development" },
        { id: 2, title: "Python Basics", time: "2:00 PM", students: 28, course: "Programming" },
    ];

    const myCourses = [
        { id: "1", title: "Web Development Bootcamp", students: 45, avgProgress: 68 },
        { id: "2", title: "Python for Kids", students: 38, avgProgress: 75 },
        { id: "3", title: "Robotics Basics", students: 44, avgProgress: 52 },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center gap-6">
                        <Avatar
                            src={user?.img}
                            name={user?.name || "Teacher"}
                            className="w-20 h-20 text-large"
                            isBordered
                            color="secondary"
                        />
                        <div>
                            <h1 className="text-3xl font-bold">Welcome, {user?.name || "Teacher"}!</h1>
                            <p className="text-purple-100 mt-2">Ready to inspire minds today?</p>
                            <Chip className="mt-2" color="secondary" variant="flat">
                                👨‍🏫 Instructor
                            </Chip>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-6 -mt-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="shadow-md">
                            <CardBody className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Schedule & Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Today's Schedule */}
                        <Card>
                            <CardHeader className="flex justify-between">
                                <h2 className="text-xl font-bold">Today's Live Classes</h2>
                                <Button size="sm" color="primary" variant="flat" onPress={() => router.push("/teacher/live-classes/create")}>
                                    Schedule New
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <Table aria-label="Today's classes">
                                    <TableHeader>
                                        <TableColumn>TIME</TableColumn>
                                        <TableColumn>CLASS</TableColumn>
                                        <TableColumn>COURSE</TableColumn>
                                        <TableColumn>STUDENTS</TableColumn>
                                        <TableColumn>ACTION</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {upcomingClasses.map((cls) => (
                                            <TableRow key={cls.id}>
                                                <TableCell>
                                                    <Chip color="primary" size="sm" variant="flat">{cls.time}</Chip>
                                                </TableCell>
                                                <TableCell className="font-medium">{cls.title}</TableCell>
                                                <TableCell className="text-sm text-gray-600">{cls.course}</TableCell>
                                                <TableCell>{cls.students}</TableCell>
                                                <TableCell>
                                                    <Button size="sm" color="success" variant="flat">
                                                        Start Class
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardBody>
                        </Card>

                        {/* My Courses */}
                        <Card>
                            <CardHeader className="flex justify-between">
                                <h2 className="text-xl font-bold">My Courses</h2>
                                <Button size="sm" color="primary" variant="flat">
                                    View All
                                </Button>
                            </CardHeader>
                            <CardBody className="space-y-3">
                                {myCourses.map((course) => (
                                    <Card key={course.id} isPressable className="bg-gray-50">
                                        <CardBody className="flex flex-row items-center justify-between">
                                            <div>
                                                <h3 className="font-bold">{course.title}</h3>
                                                <p className="text-sm text-gray-600">{course.students} students enrolled</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-600">Avg. Progress</p>
                                                <p className="text-xl font-bold text-primary">{course.avgProgress}%</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))}
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right - Quick Actions & Pending */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold">Quick Actions</h3>
                            </CardHeader>
                            <CardBody className="space-y-3">
                                <Button className="h-20 w-full flex-col" variant="flat" color="success" onPress={() => router.push("/teacher/quizzes/create")}>
                                    <span className="text-2xl mb-1">📝</span>
                                    <span className="text-xs">Create Quiz</span>
                                </Button>
                                <Button className="h-20 w-full flex-col" variant="flat" color="secondary" onPress={() => router.push("/teacher/live-classes/create")}>
                                    <span className="text-2xl mb-1">🎥</span>
                                    <span className="text-xs">Schedule Class</span>
                                </Button>
                                <Button className="h-20 w-full flex-col" variant="flat" color="primary" onPress={() => router.push("/teacher/modules/create")}>
                                    <span className="text-2xl mb-1">📚</span>
                                    <span className="text-xs">Create Module</span>
                                </Button>
                                <Button className="h-20 w-full flex-col" variant="flat" color="warning">
                                    <span className="text-2xl mb-1">👥</span>
                                    <span className="text-xs">View Students</span>
                                </Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h3 className="font-bold text-warning">Pending Grading (8)</h3>
                            </CardHeader>
                            <CardBody className="space-y-2">
                                {[
                                    { student: "Ahmed Khan", quiz: "React Quiz", date: "2 hours ago" },
                                    { student: "Fatima Ali", quiz: "Python Quiz", date: "5 hours ago" },
                                    { student: "Omar Hassan", quiz: "HTML Quiz", date: "1 day ago" }
                                ].map((item, index) => (
                                    <div key={index} className="bg-orange-50 p-3 rounded-lg">
                                        <p className="font-medium text-sm">{item.student}</p>
                                        <p className="text-xs text-gray-600">{item.quiz}</p>
                                        <p className="text-xs text-orange-600 mt-1">{item.date}</p>
                                    </div>
                                ))}
                                <Button size="sm" color="warning" className="w-full mt-2">
                                    Grade All →
                                </Button>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h3 className="font-bold">Student Messages</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="space-y-2 text-sm">
                                    <div className="bg-blue-50 p-2 rounded">
                                        <p className="font-medium">Ahmed: Question about React Hooks</p>
                                        <p className="text-xs text-gray-600">10 min ago</p>
                                    </div>
                                    <Button size="sm" variant="bordered" className="w-full">
                                        View All Messages →
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
