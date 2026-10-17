"use client";

import React, { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Chip, Spinner, Avatar, Divider } from "@nextui-org/react";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";

function AdminCourseDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || "";

  const { data, isLoading } = useGetCourseByIdQuery(id, { skip: !id });
  const course = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-10 text-center">
        <p className="text-gray-600">Course not found</p>
        <Button className="mt-4" onPress={() => router.push("/admin/courses")}>Back to Courses</Button>
      </div>
    );
  }

  const instructor: any = course.instructorId || course.instructor || null;
  const instructorName = instructor?.name || instructor?.fullName || "Unknown";
  const instructorEmail = instructor?.email || "";
  const instructorImage = instructor?.profileImage || "";

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex gap-3 mb-6">
        <Button variant="light" onPress={() => router.push("/admin/courses")}>← Back</Button>
        <Button variant="flat" onPress={() => router.push(`/admin/courses/edit?id=${id}`)}>Edit</Button>
      </div>

      <Card>
        <CardHeader className="flex-col items-start p-6 gap-2">
          <div className="flex items-start gap-4 w-full">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-24 h-24 rounded object-cover" />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Chip size="sm" variant="flat" color={course.isPublished ? "success" : "default"}>
                  {course.isPublished ? "Published" : "Draft"}
                </Chip>
                <Chip size="sm" variant="flat" color={course.isAdminApproved ? "success" : "warning"}>
                  {course.isAdminApproved ? "Approved" : "Pending Approval"}
                </Chip>
                {course.isFeatured && (
                  <Chip size="sm" variant="flat" color="secondary">Featured</Chip>
                )}
                <Chip size="sm" variant="flat">{course.level}</Chip>
                <Chip size="sm" variant="flat" color="primary">{course.category}</Chip>
                <Chip size="sm" variant="flat">Type: {course.type || "recorded"}</Chip>
                <Chip size="sm" variant="flat" color={course.isRegistrationOpen ? "success" : "default"}>
                  {course.isRegistrationOpen ? "Registration Open" : "Registration Closed"}
                </Chip>
                {course.registrationDeadline && (
                  <Chip size="sm" variant="flat">Deadline: {new Date(course.registrationDeadline).toLocaleDateString()}</Chip>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Description</h3>
            <p className="text-gray-700">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="font-semibold">BDT {course.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold">{course.duration} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tags</p>
              <p className="font-semibold">{(course.tags || []).join(", ") || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Learning Outcomes</p>
              <p className="font-semibold">{(course.learningOutcomes || []).length || 0}</p>
            </div>
          </div>

          <Divider />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar src={instructorImage || undefined} name={instructorName} size="lg" />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Primary Instructor</span>
                  <p className="text-gray-900 font-bold text-base mt-0.5">{instructorName}</p>
                  {instructorEmail && (
                    <p className="text-gray-500 text-sm">{instructorEmail}</p>
                  )}
                </div>
              </div>

              <Button
                color="secondary"
                variant="flat"
                className="font-bold"
                onPress={() => router.push(`/admin/batches?courseId=${id}`)}
              >
                Manage Batches & Teachers
              </Button>
            </div>

            {Array.isArray(course.instructorIds) && course.instructorIds.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-sm text-gray-700 mb-3">All Assigned Teachers & Batch Mentors ({course.instructorIds.length})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {course.instructorIds.map((inst: any) => (
                    <div key={inst._id || inst} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Avatar src={inst?.profileImage} name={inst?.name || "Teacher"} size="sm" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{inst?.name || "Instructor"}</p>
                        <p className="text-[11px] text-gray-500 truncate">{inst?.email || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {Array.isArray(course.modules) && course.modules.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3">Curriculum</h3>
              <div className="space-y-3">
                {course.modules.map((mod: any, idx: number) => (
                  <Card key={mod.id || mod._id} className="bg-gray-50">
                    <CardBody className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Module {idx + 1}: {mod.title}</p>
                          {mod.description && (
                            <p className="text-sm text-gray-600 mt-1">{mod.description}</p>
                          )}
                        </div>
                        <Chip size="sm" variant="flat">{(mod.lessons || []).length} Lessons</Chip>
                      </div>
                      {(mod.lessons || []).length > 0 && (
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {mod.lessons.map((lesson: any, lidx: number) => (
                            <div key={lesson.id || lesson._id} className="text-sm text-gray-700">
                              {lidx + 1}. {lesson.title} ({lesson.type})
                            </div>
                          ))}
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function AdminCourseDetailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><Spinner size="lg" /></div>}>
      <AdminCourseDetailContent />
    </Suspense>
  );
}
