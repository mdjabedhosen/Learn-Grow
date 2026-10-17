"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Pagination,
  Input,
  Skeleton,
} from "@nextui-org/react";
import { useGetPublishedCoursesQuery } from "@/redux/api/courseApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { useRouter, useSearchParams } from "next/navigation";
import { getCourseSlug } from "@/lib/coursesData";
import {
  FaSearch,
  FaClock,
  FaUsers,
  FaAward,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";

// Skeleton Loader Component
const CourseCardSkeleton = () => (
  <Card className="w-full rounded-[28px] p-0 border border-gray-100 shadow-sm" radius="lg">
    <Skeleton className="rounded-t-[28px]">
      <div className="h-56 rounded-t-[28px] bg-default-300"></div>
    </Skeleton>
    <div className="space-y-3 p-6">
      <Skeleton className="w-1/3 rounded-lg">
        <div className="h-4 w-1/3 rounded-lg bg-default-200"></div>
      </Skeleton>
      <Skeleton className="w-4/5 rounded-lg">
        <div className="h-7 w-4/5 rounded-lg bg-default-200"></div>
      </Skeleton>
      <Skeleton className="w-full rounded-lg">
        <div className="h-4 w-full rounded-lg bg-default-300"></div>
      </Skeleton>
      <div className="flex gap-2 pt-2">
        <Skeleton className="w-24 rounded-lg">
          <div className="h-6 w-24 rounded-lg bg-default-200"></div>
        </Skeleton>
        <Skeleton className="w-24 rounded-lg">
          <div className="h-6 w-24 rounded-lg bg-default-200"></div>
        </Skeleton>
      </div>
    </div>
  </Card>
);

export default function CourseList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useGetPublishedCoursesQuery({
    page,
    limit: 6,
  });
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "python" | "robotics">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Sync language with site-wide toggle
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language") as "en" | "bn";
      if (stored) setLanguage(stored);

      const handleLangChange = () => {
        const updated = localStorage.getItem("language") as "en" | "bn";
        if (updated) setLanguage(updated);
      };

      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  const urlQuery = searchParams?.get("search") || searchParams?.get("category") || searchParams?.get("q") || "";

  useEffect(() => {
    if (urlQuery) {
      setSearchTerm(urlQuery);
    }
  }, [urlQuery]);

  const pageSize = data?.data?.pagination?.limit || 6;
  const totalPages = data?.data?.pagination?.totalPages || 1;
  const totalCourses = data?.data?.pagination?.total || 0;

  const apiCourses = data?.data?.courses || [];

  // Helper to determine accurate thumbnail
  const getCourseThumbnail = (course: any) => {
    const title = (course.title || "").toLowerCase();
    const slug = (course.slug || "").toLowerCase();
    if (title.includes("python") || slug.includes("python") || course._id === "69ce553ce9e96ed805295101") {
      return "/courses/python-course-banner.jpg";
    }
    if (title.includes("robot") || title.includes("arduino") || slug.includes("robot") || course._id === "69ca5603e9e96ed80529474a") {
      return "/courses/robotics-course-banner.jpg";
    }
    return course.thumbnail || course.img || "/images/course-placeholder.jpg";
  };

  // Helper for title & subtitle localization
  const getCourseMeta = (course: any) => {
    const title = (course.title || "").toLowerCase();
    const isPython = title.includes("python") || course._id === "69ce553ce9e96ed805295101";
    const isRobotics = title.includes("robot") || title.includes("arduino") || course._id === "69ca5603e9e96ed80529474a";

    if (isPython) {
      return {
        displayTitle: language === "bn" ? "টিনএজারদের জন্য পাইথন প্রোগ্রামিং ও এআই" : "Python Programming & AI for Teens",
        displayTagline: language === "bn" 
          ? "লাইভ মেন্টরশিপে পাইথন কোডিং, এআই চ্যাটবট ও ইন্টারেক্টিভ গেম তৈরি শিখুন।"
          : "Master Python from scratch to building real AI chatbots, 2D games, and automation.",
        ageRange: language === "bn" ? "১২-১৮ বছর" : "Ages 12-18",
        duration: "10 Weeks",
        price: course.price || 2999,
        regularPrice: 4999,
        badge: "💻 Programming & AI",
        features: language === "bn" 
          ? ["১০০% লাইভ ক্লাস (সপ্তাহে ২ দিন)", "৫+ বাস্তব প্রজেক্ট পোর্টফোলিও", "ভেরিফায়েড কোর্স সমাপন সনদ"]
          : ["100% Live Classes (2x/week)", "5+ Real-world Projects", "Verified Completion Certificate"]
      };
    }

    if (isRobotics) {
      return {
        displayTitle: language === "bn" ? "জুনিয়র রোবটিক্স উইথ আর্দুইনো" : "Junior Robotics with Arduino",
        displayTagline: language === "bn" 
          ? "আসল রোবট তৈরি, মাইক্রোকন্ট্রোলার কোডিং ও সেন্সর ইলেকট্রনিক্স হাতে-কলমে শিখুন।"
          : "Build real physical robots, program Arduino, and master sensor electronics with hardware kit.",
        ageRange: language === "bn" ? "১০-১৬ বছর" : "Ages 10-16",
        duration: "8 Weeks",
        price: course.price || 3499,
        regularPrice: 5499,
        badge: "🤖 Robotics & STEM",
        features: language === "bn" 
          ? ["১০০% লাইভ ক্লাস ও হার্ডওয়্যার গাইড", "অবস্ট্যাকল ও লাইন-ফলোয়ার রোবট", "ভেরিফায়েড কোর্স সমাপন সনদ"]
          : ["100% Live Sessions & Hardware Kit", "Build 2 Autonomous Robots", "Verified Completion Certificate"]
      };
    }

    return {
      displayTitle: course.title,
      displayTagline: course.subtitle || "Comprehensive hands-on STEM curriculum.",
      ageRange: "All Ages",
      duration: `${course.duration || 8}h`,
      price: course.price || 2999,
      regularPrice: Math.round((course.price || 2999) * 1.5),
      badge: "STEM Course",
      features: ["Live interactive class", "Hands-on projects", "Verified Certificate"]
    };
  };

  // Filter logic
  const courses = useMemo(() => {
    let filtered = apiCourses.filter(
      (c: any) => c.isPublished && c.isAdminApproved
    );

    // Filter by quick pill
    if (selectedFilter === "python") {
      filtered = filtered.filter((c: any) => 
        (c.title || "").toLowerCase().includes("python") || c._id === "69ce553ce9e96ed805295101"
      );
    } else if (selectedFilter === "robotics") {
      filtered = filtered.filter((c: any) => 
        (c.title || "").toLowerCase().includes("robot") || (c.title || "").toLowerCase().includes("arduino") || c._id === "69ca5603e9e96ed80529474a"
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((c: any) => {
        const title = (c.title || "").toLowerCase();
        const desc = (c.description || "").toLowerCase();
        return title.includes(searchLower) || desc.includes(searchLower);
      });
    }

    return filtered;
  }, [apiCourses, selectedFilter, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Search & Quick Filter Chips Container */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => { setSelectedFilter("all"); setPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
              selectedFilter === "all"
                ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                : "bg-[#F8F9FA] text-gray-700 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            {language === "en" ? "✨ All Courses" : "✨ সকল প্রোগ্রাম"}
          </button>
          <button
            onClick={() => { setSelectedFilter("python"); setPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
              selectedFilter === "python"
                ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                : "bg-[#F8F9FA] text-gray-700 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            🐍 {language === "en" ? "Python & AI Programming" : "পাইথন ও এআই কোডিং"}
          </button>
          <button
            onClick={() => { setSelectedFilter("robotics"); setPage(1); }}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all ${
              selectedFilter === "robotics"
                ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                : "bg-[#F8F9FA] text-gray-700 hover:bg-gray-100 border border-gray-200/80"
            }`}
          >
            🤖 {language === "en" ? "Junior Robotics & Arduino" : "জুনিয়র রোবটিক্স"}
          </button>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80">
          <Input
            placeholder={language === "en" ? "Search courses..." : "কোর্স অনুসন্ধান করুন..."}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            startContent={<FaSearch className="text-gray-400 text-sm" />}
            size="md"
            radius="full"
            classNames={{
              input: "text-sm font-medium",
              inputWrapper:
                "bg-[#F8F9FA] border border-gray-200 hover:border-[#3B82F6] transition-colors h-11",
            }}
            isClearable
            onClear={() => setSearchTerm("")}
          />
        </div>
      </div>

      {/* Results Count bar */}
      <div className="flex items-center justify-between px-2">
        <p className="text-gray-500 text-xs sm:text-sm font-medium">
          {language === "en" ? "Showing" : "প্রদর্শিত হচ্ছে"}{" "}
          <span className="font-black text-[#2C2C2C]">{courses.length}</span>{" "}
          {language === "en" ? "of" : "টি কোর্স (মোট"}{" "}
          <span className="font-black text-[#2C2C2C]">{totalCourses || courses.length}</span>
          {language === "en" ? " courses" : " টির মধ্যে)"}
        </p>
      </div>

      {/* Course Grid: 2-columns on large screens for wide 16:9 banner impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {courses.length === 0 ? (
          <div className="col-span-full bg-white rounded-[28px] border border-gray-100 text-center py-16 px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-black text-gray-800 mb-2">
              {language === "en" ? "No courses found" : "কোনো কোর্স পাওয়া যায়নি"}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              {language === "en"
                ? "Try searching with different keywords or reset your filters."
                : "অন্য কোনো কি-ওয়ার্ড দিয়ে সার্চ করুন অথবা ফিল্টার রিসেট করুন।"}
            </p>
            <Button
              color="primary"
              radius="full"
              className="font-bold text-xs"
              onPress={() => {
                setSearchTerm("");
                setSelectedFilter("all");
              }}
            >
              {language === "en" ? "View All Courses" : "সব কোর্স দেখুন"}
            </Button>
          </div>
        ) : (
          courses.map((course: any, index: number) => {
            const meta = getCourseMeta(course);
            const thumbnail = getCourseThumbnail(course);
            const slug = getCourseSlug(course);

            return (
              <div
                key={course._id || index}
                className="bg-white rounded-[28px] border-2 border-gray-100 hover:border-[#3B82F6]/50 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => router.push(`/courses/${slug}`)}
              >
                <div>
                  {/* Course 16:9 Thumbnail Header */}
                  <div className="relative w-full pt-[54%] overflow-hidden bg-gray-900">
                    <img
                      src={thumbnail}
                      alt={meta.displayTitle}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = "/logo.png";
                      }}
                    />
                    {/* Subtle gradient vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Top Overlay Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-gray-900 text-xs font-black rounded-full shadow-sm">
                        {meta.ageRange}
                      </span>
                      <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-black rounded-full shadow-sm">
                        {course.level || "Beginner"}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 text-white text-xs font-black rounded-full shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        LIVE
                      </span>
                    </div>

                    {/* Bottom overlay badge inside image */}
                    <div className="absolute bottom-3 left-4 z-10">
                      <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {meta.badge}
                      </span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    
                    {/* Course Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#2C2C2C] group-hover:text-[#3B82F6] transition-colors leading-tight">
                      {meta.displayTitle}
                    </h3>

                    {/* Tagline / Subtitle */}
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {meta.displayTagline}
                    </p>

                    {/* 3 Value Points */}
                    <div className="space-y-1.5 pt-1">
                      {meta.features.map((feat: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] flex-shrink-0">
                            <FaCheck />
                          </span>
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Meta stats pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] rounded-xl text-xs font-bold text-gray-600">
                        <FaClock className="text-[#3B82F6]" />
                        <span>{meta.duration}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] rounded-xl text-xs font-bold text-gray-600">
                        <FaUsers className="text-[#7C3AED]" />
                        <span>10-15 {language === "en" ? "Students" : "জন"}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] rounded-xl text-xs font-bold text-gray-600">
                        <FaAward className="text-emerald-600" />
                        <span>{language === "en" ? "Certificate" : "সার্টিফিকেট"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer with Price and Action */}
                <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through font-semibold">
                        ৳{meta.regularPrice.toLocaleString()}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-md border border-amber-200">
                        40% OFF
                      </span>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                      ৳{meta.price.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black rounded-2xl px-6 py-6 text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all"
                    endContent={<FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />}
                    onPress={() => router.push(`/courses/${slug}`)}
                  >
                    {language === "en" ? "View Details" : "বিস্তারিত দেখুন"}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination (if applicable) */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination
            page={page}
            total={totalPages}
            onChange={setPage}
            color="primary"
            size="lg"
            showControls
            className="gap-2"
            radius="full"
          />
        </div>
      )}
    </div>
  );
}
