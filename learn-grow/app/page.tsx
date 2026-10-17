import React from "react";
import { Metadata } from "next";

import ModernBanner from "@/components/ModernBanner";
import CoursesSection from "@/components/CoursesSection";
import PlatformFeaturesSection from "@/components/PlatformFeaturesSection";
import LiveClassSection from "@/components/LiveClassSection";
import PricingSection from "@/components/PricingSection";
import WhyBestCourses from "@/components/WhyBestCourses";
import WorkshopStorySection from "@/components/WorkshopStorySection";
import Educators from "@/components/Educators";

export const metadata: Metadata = {
  title: "Learn & Grow - Robotics Courses & STEM Education Kits",
  description: "Transform your learning journey with expert-led robotics courses, coding classes, and hands-on STEM education kits. Join thousands of students mastering robotics, Arduino, programming, and engineering fundamentals.",
  keywords: [
    "robotics courses online",
    "STEM education kits",
    "learn robotics",
    "coding classes for kids",
    "Arduino tutorials",
    "robotics training programs",
    "educational robot kits",
    "programming courses",
    "engineering education",
    "hands-on STEM learning"
  ],
  openGraph: {
    title: "Learn & Grow - Premier Robotics Courses & STEM Education Kits",
    description: "Master robotics and coding with expert instructors. Shop premium STEM kits and enroll in world-class courses designed for all skill levels.",
    type: "website",
    url: "https://learnandgrow.io",
    images: [
      {
        url: "https://learnandgrow.io/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Learn & Grow Robotics Education Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn & Grow - Robotics Courses & STEM Kits",
    description: "Expert robotics education and premium STEM kits for learners of all ages.",
    images: ["https://learnandgrow.io/og-home.jpg"],
  },
  alternates: {
    canonical: "https://learnandgrow.io",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Learn & Grow",
    "url": "https://learnandgrow.io",
    "description": "Premier robotics courses and STEM education kits",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://learnandgrow.io/courses?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col">
        {/* Hero Banner */}
        <ModernBanner />

        {/* Courses Offered */}
        <CoursesSection />

        {/* Platform Key Value Highlights */}
        <PlatformFeaturesSection />

        {/* 100% Live Interactive Classes (Not Recorded) */}
        <LiveClassSection />

        {/* Real Flagship Workshop & Success Story (BPSC 300 Students) */}
        <WorkshopStorySection />

        {/* Pricing Plans */}
        <PricingSection />

        {/* Our Educators / Tutors (Kodland-Style Interactive Carousel) */}
        <Educators />

        {/* Why Our Courses Are Best - Stats & FAQ */}
        <WhyBestCourses />
      </div>
    </>
  );
}
