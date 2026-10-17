"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Avatar,
  Skeleton,
  Divider,
  Progress,
} from "@nextui-org/react";
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaBook,
  FaCheckCircle,
  FaClock,
  FaTrophy,
  FaMapMarkerAlt,
  FaCrown,
  FaBox,
  FaCheckDouble,
} from "react-icons/fa";
import { useGetInstructorStudentByIdQuery } from "@/redux/api/userApi";
import { useGetStudentOrdersQuery } from "@/redux/api/orderApi";
import RequireAuth from "@/components/Auth/RequireAuth";

function InstructorStudentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  // Use instructor-specific endpoint to get student details
  const { data, isLoading, error } = useGetInstructorStudentByIdQuery(studentId, {
    // Only query if we have a valid ID
    skip: !studentId,
  });
  
  const student = data?.data;
  const studentBatches = Array.isArray(student?.batches) ? student.batches : [];
  const studentEnrollments = Array.isArray(student?.enrollments) ? student.enrollments : [];
  const enrolledCoursesCount = studentEnrollments.length || studentBatches.length || 0;
  const completedCount = studentEnrollments.filter(
    (e: any) => e.isCompleted || (e.completionPercentage ?? e.progress ?? 0) >= 100
  ).length;
  const inProgressCount = studentEnrollments.filter(
    (e: any) => !e.isCompleted && (e.completionPercentage ?? e.progress ?? 0) < 100
  ).length;

  // Fetch student's orders
  const { data: ordersData, isLoading: ordersLoading } = useGetStudentOrdersQuery({
    studentId,
    page: 1,
    limit: 10,
  });

  const orders = ordersData?.data || [];

  // Find active quarterly subscription
  const activeQuarterlyOrder = orders.find(
    (order: any) =>
      order.planType === "quarterly" &&
      order.paymentStatus === "approved" &&
      order.isActive &&
      new Date(order.endDate) > new Date()
  );

  // Calculate remaining time
  const calculateRemainingTime = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;

    if (diffMonths > 0) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ${remainingDays > 0 ? `${remainingDays} days` : ''}`;
    }
    return `${diffDays} days`;
  };
  
  const errorMessage = error && typeof error === 'object' && 'status' in error 
    ? `Error ${error.status}: ${(error as any).data?.message || 'Failed to load'}`
    : error ? 'Failed to load student data' : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-8 max-w-5xl">
        <Skeleton className="h-12 w-48 mb-8 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-lg" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!student || error) {
    return (
      <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-8 max-w-5xl">
        <Button
          startContent={<FaArrowLeft />}
          variant="light"
          onPress={() => router.push("/instructor/students")}
          className="mb-6"
        >
          Back to Students
        </Button>
        <Card>
          <CardBody className="p-12 text-center">
            <FaUser className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Student Not Found</h3>
            <p className="text-gray-600 mb-4">
              {errorMessage || "Unable to load student information"}
            </p>
            <Button color="primary" onPress={() => router.push("/instructor/students")}>
              Back to Students
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button
        startContent={<FaArrowLeft />}
        variant="light"
        onPress={() => router.push("/instructor/students")}
        className="mb-6"
      >
        Back to Students
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Student Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardBody className="p-6">
              <div className="text-center">
                <Avatar
                  src={student.profileImage}
                  name={student.name}
                  className="w-32 h-32 mx-auto mb-4"
                  fallback={<FaUser className="text-4xl" />}
                />
                <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
                <Chip
                  color={student.isApproved === false ? "danger" : "success"}
                  variant="flat"
                  className="mb-4"
                >
                  {student.isApproved === false ? "Not Approved" : "Active"}
                </Chip>
                <p className="text-sm text-gray-500 mb-2">Student ID: {student._id.slice(-8)}</p>
                <Chip size="sm" variant="bordered">
                  {student.role}
                </Chip>
              </div>
            </CardBody>
          </Card>

          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Contact Information</h3>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
              <div className="flex items-start gap-3">
                <FaEnvelope className="text-gray-400 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-medium break-all">{student.email}</p>
                </div>
              </div>

              {student.phone && (
                <div className="flex items-start gap-3">
                  <FaPhone className="text-gray-400 text-xl mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm font-medium">{student.phone}</p>
                  </div>
                </div>
              )}

              {student.institution && (
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gray-400 text-xl mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Institution</p>
                    <p className="text-sm font-medium">{student.institution}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FaCalendar className="text-gray-400 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Joined</p>
                  <p className="text-sm font-medium">
                    {new Date(student.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Account Info</h3>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Verified</span>
                <Chip size="sm" color={student.isVerified ? "success" : "warning"} variant="flat">
                  {student.isVerified ? "Yes" : "No"}
                </Chip>
              </div>
              {student.googleId && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Google Account</span>
                  <Chip size="sm" color="primary" variant="flat">
                    Connected
                  </Chip>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Active Subscription Card */}
          {activeQuarterlyOrder && (
            <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaCrown className="text-green-600 text-xl" />
                  <h3 className="font-bold text-green-900">Active Subscription</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Plan Type</span>
                  <Chip size="sm" color="success" variant="solid">
                    Quarterly - Full Access
                  </Chip>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Time Remaining</span>
                  <span className="text-sm font-bold text-green-700">
                    {calculateRemainingTime(activeQuarterlyOrder.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">End Date</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {new Date(activeQuarterlyOrder.endDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Started</span>
                  <span className="text-sm text-gray-600">
                    {new Date(activeQuarterlyOrder.startDate).toLocaleDateString("en-GB")}
                  </span>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Right Column - Activity & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-blue-500">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaBook className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Enrolled Courses</p>
                    <p className="text-2xl font-bold">{enrolledCoursesCount}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaCheckCircle className="text-xl text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">{completedCount}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-l-4 border-orange-500">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <FaClock className="text-xl text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressCount}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Orders/Purchases */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Purchase History</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              {ordersLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-3 rounded-lg flex-shrink-0 ${
                          order.planType === "quarterly" 
                            ? "bg-green-100" 
                            : order.planType === "kit" 
                            ? "bg-amber-100" 
                            : "bg-blue-100"
                        }`}>
                          {order.planType === "quarterly" ? (
                            <FaCrown className="text-green-600 text-lg" />
                          ) : order.planType === "kit" ? (
                            <FaBox className="text-amber-600 text-lg" />
                          ) : (
                            <FaBook className="text-blue-600 text-lg" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {order.planType === "quarterly" 
                              ? "Quarterly Subscription - Full Access" 
                              : order.planType === "kit" 
                              ? "Robotics Kit Only" 
                              : order.courseId?.title || "Course Purchase"}
                          </p>
                          {order.planType === "single" && order.courseId && (
                            <p className="text-xs text-blue-600 mt-1">
                              Course: {order.courseId.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Transaction ID: {order.transactionId.slice(0, 12)}...
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <span>Purchased: {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}</span>
                            {order.endDate && order.paymentStatus === "approved" && (
                              <span className="text-green-600">
                                Valid Until: {new Date(order.endDate).toLocaleDateString("en-GB")}
                              </span>
                            )}
                          </div>
                          {order.deliveryAddress && (
                            <p className="text-xs text-gray-500 mt-1">
                              Delivery: {order.deliveryAddress.city}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">৳{order.price}</p>
                          <Chip
                            size="sm"
                            color={
                              order.paymentStatus === "approved"
                                ? "success"
                                : order.paymentStatus === "rejected"
                                ? "danger"
                                : "warning"
                            }
                            variant="flat"
                            className="mt-2"
                          >
                            {order.paymentStatus === "approved" ? (
                              <div className="flex items-center gap-1">
                                <FaCheckDouble className="text-xs" />
                                <span>Approved</span>
                              </div>
                            ) : order.paymentStatus === "rejected" ? (
                              "Rejected"
                            ) : (
                              "Pending"
                            )}
                          </Chip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No purchases yet</p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Course & Batch Progress */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Assigned Batches & Course Progress</h3>
                <p className="text-xs text-gray-500">Live cohorts and learning completion under your instruction</p>
              </div>
              <Chip size="sm" color="primary" variant="flat">
                {studentEnrollments.length || studentBatches.length} Cohorts
              </Chip>
            </CardHeader>
            <Divider />
            <CardBody>
              {(studentEnrollments.length > 0 || studentBatches.length > 0) ? (
                <div className="space-y-4">
                  {studentEnrollments.map((enr: any, idx: number) => {
                    const batch = enr.batchId || (studentBatches[idx] || null);
                    const course = enr.courseId || batch?.courseId || null;
                    const progVal = enr.progress ?? enr.completionPercentage ?? 0;

                    return (
                      <div
                        key={enr._id || idx}
                        className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                              <FaBook />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">
                                {course?.title || "Enrolled Course"}
                              </p>
                              {batch && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700">
                                    {batch.batchName || `Batch ${batch.batchNumber}`}
                                  </span>
                                  {batch.schedule && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <FaClock className="text-gray-400" />
                                      {batch.schedule}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            {batch?.whatsappGroupUrl && (
                              <a
                                href={batch.whatsappGroupUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 transition"
                              >
                                WhatsApp Group
                              </a>
                            )}
                            {batch?.zoomLink && (
                              <a
                                href={batch.zoomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition"
                              >
                                Live Class
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-gray-600">Overall Course Progress</span>
                            <span className={progVal >= 100 ? "text-emerald-600 font-bold" : "text-blue-600 font-bold"}>
                              {progVal}% {progVal >= 100 ? "(Completed)" : "(In Progress)"}
                            </span>
                          </div>
                          <Progress
                            value={progVal}
                            size="md"
                            color={progVal >= 100 ? "success" : "primary"}
                            className="h-2 rounded-full"
                          />
                        </div>

                        {/* Sub-metrics */}
                        <div className="flex flex-wrap gap-4 pt-1 text-xs text-gray-500">
                          {Array.isArray(enr.completedLessons) && (
                            <span>Lessons: {enr.completedLessons.length}</span>
                          )}
                          {Array.isArray(enr.completedModules) && (
                            <span>Modules: {enr.completedModules.length}</span>
                          )}
                          {Array.isArray(enr.completedAssignments) && (
                            <span>Assignments: {enr.completedAssignments.length}</span>
                          )}
                          {enr.createdAt && (
                            <span>Enrolled: {new Date(enr.createdAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No active cohorts or course progress recorded yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Student enrollments will appear here once assigned to your batches
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Recent Activity</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="text-center py-12">
                <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500 mt-2">
                  Student activity will be tracked here
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-lg">Achievements</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="text-center py-12">
                <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No achievements yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Badges and certificates will appear here
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InstructorStudentDetailPage() {
  return (
    <RequireAuth allowedRoles={["instructor", "admin", "manager"]}>
      <InstructorStudentDetailContent />
    </RequireAuth>
  );
}
