"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CourseDetails from "@/components/courses/CourseDetails";

function CourseViewContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    if (!id) return <div>Invalid Course ID</div>;

    return <CourseDetails courseId={id} />;
}

export default function CourseViewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading course...</div>}>
            <CourseViewContent />
        </Suspense>
    );
}
