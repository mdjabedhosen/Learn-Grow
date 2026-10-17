import CourseList from "@/components/courses/CourseList";
import CoursesHero from "@/components/courses/CoursesHero";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Robotics & STEM Courses - Learn Arduino, Coding & Engineering",
  description: "Explore our comprehensive robotics and STEM courses. Learn Arduino programming, robot building, coding fundamentals, and engineering principles with expert instructors and hands-on projects.",
  keywords: [
    "robotics courses",
    "Arduino programming",
    "STEM courses online",
    "learn coding",
    "robot building course",
    "engineering courses",
    "programming classes",
    "robotics training",
    "online STEM education",
    "coding bootcamp"
  ],
  openGraph: {
    title: "Robotics & STEM Courses - Master Technology Skills",
    description: "Browse our comprehensive collection of robotics, coding, and STEM education courses. Expert-led training for all skill levels.",
    type: "website",
    url: "https://learnandgrow.io/courses",
    images: [
      {
        url: "https://learnandgrow.io/og-courses.jpg",
        width: 1200,
        height: 630,
        alt: "Learn & Grow Courses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robotics & STEM Courses - Learn & Grow",
    description: "Master robotics, coding, and engineering with our expert-led courses.",
    images: ["https://learnandgrow.io/og-courses.jpg"],
  },
  alternates: {
    canonical: "https://learnandgrow.io/courses",
  },
};

export default function CoursesPage() {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Robotics & STEM Courses",
      "description": "Comprehensive collection of robotics, coding, and STEM education courses",
      "url": "https://learnandgrow.io/courses",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Learn & Grow Academy",
        "url": "https://learnandgrow.io"
      }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen bg-[#F8F9FA]">
                {/* Kodland-inspired Hero Section with Realistic Student & 3D Illustration Badges */}
                <CoursesHero />

                {/* Course List */}
                <div className="container mx-auto px-4 pb-16">
                    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>}>
                        <CourseList />
                    </Suspense>
                </div>
            </div>
        </>
    );
}
