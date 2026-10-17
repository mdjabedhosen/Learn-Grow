"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Spinner,
  Image,
} from "@nextui-org/react";
import { useGetFeaturedCoursesQuery } from "@/redux/api/courseApi";
import { useRouter } from "next/navigation";
import { getCourseSlug } from "@/lib/coursesData";
import { Clock, Users as UsersIcon, PhoneCall, BookOpen, ArrowRight } from "lucide-react";

const CoursesSection = () => {
  const [language, setLanguage] = useState<"en" | "bn">("bn");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language") as "en" | "bn";
      if (storedLang) {
        setLanguage(storedLang);
      }

      const handleLangChange = () => {
        const updatedLang = localStorage.getItem("language") as "en" | "bn";
        if (updatedLang) {
          setLanguage(updatedLang);
        }
      };

      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);
  const { data, isLoading, error } = useGetFeaturedCoursesQuery();
  const router = useRouter();
  
  const sanitizeDescription = (value: string, maxLength = 120) => {
    if (!value) return "";

    const cleanText = value
      .replace(/<[^>]*>/g, " ") // remove HTML tags
      .replace(/&nbsp;|&#160;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return "";

    return cleanText.length > maxLength
      ? `${cleanText.slice(0, maxLength)}...`
      : cleanText;
  };

  // Show only courses returned by the backend.
  const displayCourses = useMemo(() => {
    const fromApi = data?.data || data || [];
    const filtered = fromApi.filter(
      (c: any) => c.isPublished && c.isAdminApproved && c.isFeatured
    );
    return filtered;
  }, [data]);

  // Pastel gradient mapping configured in tailwind.config.js
  const gradients = [
    "bg-gradient-coding",    // Soft Peach/Orange
    "bg-gradient-robotics",  // Soft Blue
    "bg-gradient-math",      // Soft Purple
    "bg-gradient-science",   // Soft Green
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" label="Loading courses..." />
      </div>
    );
  }

  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 bg-gradient-to-b from-white via-[#EAF4FB]/30 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-block mb-4">
            <Chip
              className="bg-primary-100 text-primary-700 font-bold px-4 py-2"
              size="lg"
              variant="flat"
            >
              {language === "en" ? "📚 Our Courses" : "📚 আমাদের কোর্সসমূহ"}
            </Chip>
          </div>
          <h2
            className={`text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight ${language === "bn" ? "font-siliguri" : ""}`}
          >
            {language === "en" ? "Explore Our Programs" : "আমাদের প্রোগ্রামসমূহ দেখুন"}
          </h2>
          <p
            className={`text-lg md:text-xl text-gray-600 max-w-3xl mx-auto ${language === "bn" ? "font-siliguri" : ""}`}
          >
            {language === "en"
              ? "Choose from our carefully designed courses to start your STEM journey"
              : "আপনার সন্তানকে স্ক্রিন টাইম থেকে কোডিং এবং রোবটিক্স হিরো করে তুলতে কোর্স নির্বাচন করুন"}
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {displayCourses.length === 0 ? (
            <div className="w-full text-center text-gray-500">
              No courses available at the moment.
            </div>
          ) : (
            displayCourses.map((course: any, index: number) => (
              <Card
                key={course._id || index}
                className={`group cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.1)] border-0 w-full max-w-sm rounded-[32px] overflow-hidden ${gradients[index % gradients.length]}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Course Image Header */}
                <div className="relative h-56 overflow-hidden p-6 pb-0">
                  <div className="relative w-full h-full rounded-[24px] overflow-hidden">
                    <Image
                      removeWrapper
                      alt={course.title}
                      className="z-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                      src={
                        course.thumbnail ||
                        course.img ||
                        "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
                      }
                    />
                    <div className="absolute inset-0 bg-black/10 z-10" />
                    <div className="absolute bottom-4 left-4 z-20">
                      <Chip
                        size="sm"
                        className="bg-white/90 text-gray-900 font-extrabold shadow-sm px-3 py-1"
                      >
                        {course.level}
                      </Chip>
                    </div>
                  </div>
                </div>

                <CardBody className="p-6 pt-5">
                  {/* Course Title */}
                  <h3
                    className={`text-2xl font-black text-gray-900 mb-1 leading-tight tracking-tight ${language === "bn" ? "font-siliguri" : ""}`}
                  >
                    {course.title}
                  </h3>

                  {/* Subtitle */}
                  {course.subtitle && (
                    <p
                      className={`text-secondary-600 text-xs font-bold uppercase tracking-wider mb-3 ${language === "bn" ? "font-siliguri" : ""}`}
                    >
                      {course.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {sanitizeDescription(course.description) ||
                      "No description available"}
                  </p>

                  {/* Duration & Age Range */}
                  <div className="flex gap-4 mb-4 border-t border-black/5 pt-4">
                    {course.duration && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className={language === "bn" ? "font-siliguri" : ""}>
                          {course.duration}
                        </span>
                      </div>
                    )}
                    {course.ageRange && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <UsersIcon className="w-3.5 h-3.5 text-purple-500" />
                        <span className={language === "bn" ? "font-siliguri" : ""}>
                          {course.ageRange}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  {course.features && course.features.length > 0 && (
                    <ul className="space-y-1.5">
                      {course.features.slice(0, 3).map((feature: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs font-medium text-gray-800"
                        >
                          <span className="text-primary-500 font-bold">✓</span>
                          <span className={language === "bn" ? "font-siliguri" : ""}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>

                <CardFooter className="p-6 pt-0 flex items-center justify-between border-t border-black/5">
                  {/* Price Display */}
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                      {language === "en" ? "Course Price" : "কোর্স ফি"}
                    </span>
                    <span className="text-2xl font-black text-gray-900">
                      ৳{course.price || 0}
                    </span>
                  </div>

                  {/* Enroll Button */}
                  <Button
                    className="bg-[#2C2C2C] text-white font-black rounded-xl px-5 py-5 hover:bg-black transition-colors text-sm"
                    onPress={() => {
                      router.push(`/courses/${getCourseSlug(course)}`);
                    }}
                  >
                    <span className={language === "bn" ? "font-siliguri" : ""}>
                      {language === "en" ? "Details →" : "বিস্তারিত →"}
                    </span>
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Bottom Advisor CTA */}
        <div
          className="text-center mt-20 animate-fadeIn"
          style={{ animationDelay: "600ms" }}
        >
          <p
            className={`text-gray-600 mb-6 font-bold ${language === "bn" ? "font-siliguri" : ""}`}
          >
            {language === "en"
              ? "Can't decide? We'll help you choose the perfect track!"
              : "আপনার সন্তানের জন্য সঠিক প্রোগ্রাম সিলেক্ট করতে পরামর্শ পেতে চান?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              className="border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50 rounded-full px-6 py-6"
              size="lg"
              variant="bordered"
              onPress={() => router.push("/contact")}
            >
              <PhoneCall className="w-4 h-4 mr-1 text-primary-500" />
              <span className={language === "bn" ? "font-siliguri" : ""}>
                {language === "en" ? "Talk to Advisor" : "অ্যাডভাইজরের সাথে কথা বলুন"}
              </span>
            </Button>
            <Button
              className="bg-primary text-white font-bold shadow-glow-primary rounded-full px-7 py-6 flex items-center"
              size="lg"
              onPress={() => router.push("/courses")}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              <span className={language === "bn" ? "font-siliguri" : ""}>
                {language === "en" ? "View All Courses" : "সকল কোর্স দেখুন"}
              </span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
