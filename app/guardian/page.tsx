"use client";

import React from "react";
import { Card, CardBody, Button, Progress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
    FaChild,
    FaChartLine,
    FaClock,
    FaTrophy,
    FaBell,
    FaCalendar,
} from "react-icons/fa";

export default function GuardianDashboard() {
    const router = useRouter();

    // Mock data for guardian's children
    const children = [
        {
            id: "1",
            name: "আয়শা খান",
            age: 12,
            enrolledCourses: 3,
            averageProgress: 75,
            lastActive: "2 hours ago",
            upcomingClasses: 2,
        },
        {
            id: "2",
            name: "রাফি আহমেদ",
            age: 10,
            enrolledCourses: 2,
            averageProgress: 60,
            lastActive: "5 hours ago",
            upcomingClasses: 1,
        },
    ];

    const notifications = [
        { message: "আয়শা completed Python Basics course", time: "1 day ago", type: "success" },
        { message: "রাফি has a live class tomorrow at 4 PM", time: "2 hours ago", type: "info" },
        { message: "Payment due for Web Development course", time: "3 days ago", type: "warning" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Guardian Dashboard 👨‍👩‍👧‍👦</h1>
                <p className="text-gray-600">Monitor your children's learning progress</p>
            </div>

            {/* Overview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600">
                    <CardBody className="text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Children</p>
                                <p className="text-3xl font-bold mt-1">{children.length}</p>
                            </div>
                            <FaChild className="text-4xl opacity-50" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600">
                    <CardBody className="text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Courses</p>
                                <p className="text-3xl font-bold mt-1">
                                    {children.reduce((sum, child) => sum + child.enrolledCourses, 0)}
                                </p>
                            </div>
                            <FaChartLine className="text-4xl opacity-50" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600">
                    <CardBody className="text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Avg. Progress</p>
                                <p className="text-3xl font-bold mt-1">
                                    {Math.round(children.reduce((sum, child) => sum + child.averageProgress, 0) / children.length)}%
                                </p>
                            </div>
                            <FaTrophy className="text-4xl opacity-50" />
                        </div>
                    </CardBody>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600">
                    <CardBody className="text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Upcoming Classes</p>
                                <p className="text-3xl font-bold mt-1">
                                    {children.reduce((sum, child) => sum + child.upcomingClasses, 0)}
                                </p>
                            </div>
                            <FaCalendar className="text-4xl opacity-50" />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Children Progress Cards */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Children's Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {children.map((child) => (
                        <Card key={child.id} className="hover:shadow-xl transition-shadow">
                            <CardBody className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl mb-1">{child.name}</h3>
                                        <p className="text-sm text-gray-600">Age: {child.age} years</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FaChild className="text-2xl text-blue-600" />
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span>Enrolled Courses:</span>
                                        <span className="font-semibold">{child.enrolledCourses}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Last Active:</span>
                                        <span className="font-semibold text-green-600">{child.lastActive}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Upcoming Classes:</span>
                                        <span className="font-semibold text-orange-600">{child.upcomingClasses}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Average Progress</span>
                                        <span className="font-semibold text-primary">{child.averageProgress}%</span>
                                    </div>
                                    <Progress
                                        value={child.averageProgress}
                                        color={child.averageProgress > 70 ? "success" : "warning"}
                                        size="lg"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        color="primary"
                                        className="flex-1"
                                        onPress={() => router.push(`/guardian/child/${child.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    <Button
                                        variant="bordered"
                                        onPress={() => router.push(`/guardian/child/${child.id}/schedule`)}
                                    >
                                        Schedule
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Notifications */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">Recent Updates</h2>
                    <Card>
                        <CardBody className="p-6">
                            <div className="space-y-4">
                                {notifications.map((notification, index) => (
                                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                                        <div className={`p-3 rounded-lg ${notification.type === "success" ? "bg-green-100" :
                                            notification.type === "info" ? "bg-blue-100" : "bg-orange-100"
                                            }`}>
                                            <FaBell className={`text-xl ${notification.type === "success" ? "text-green-600" :
                                                notification.type === "info" ? "text-blue-600" : "text-orange-600"
                                                }`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{notification.message}</p>
                                            <p className="text-sm text-gray-500">{notification.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <Card>
                        <CardBody className="p-6 space-y-3">
                            <Button
                                color="primary"
                                className="w-full"
                                onPress={() => router.push("/guardian/enroll")}
                            >
                                Enroll in New Course
                            </Button>
                            <Button
                                variant="bordered"
                                className="w-full"
                                onPress={() => router.push("/guardian/payments")}
                            >
                                View Payments
                            </Button>
                            <Button
                                variant="bordered"
                                className="w-full"
                                onPress={() => router.push("/guardian/reports")}
                            >
                                Download Reports
                            </Button>
                            <Button
                                variant="bordered"
                                className="w-full"
                                onPress={() => router.push("/guardian/settings")}
                            >
                                Settings
                            </Button>
                        </CardBody>
                    </Card>

                    <Card className="mt-6 bg-blue-50">
                        <CardBody className="p-6">
                            <h3 className="font-bold mb-2">💡 Tip</h3>
                            <p className="text-sm text-gray-700">
                                Regular monitoring helps children stay motivated. Check their progress weekly!
                            </p>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
