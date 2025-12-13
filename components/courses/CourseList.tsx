"use client";

import React, { useState } from "react";
import { Card, CardBody, CardFooter, Image, Button, Spinner, Chip } from "@nextui-org/react";
import { useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { useRouter } from "next/navigation";

export default function CourseList() {
    const { data, isLoading, error } = useGetAllCoursesQuery({});
    const router = useRouter();
    const [language] = useState<"en" | "bn">("bn");

    // Placeholder data for offline mode - SAME AS HOMEPAGE to ensure consistency
    const sampleCourses = [
        {
            _id: "1",
            title: "Arduino দিয়ে রোবটিক্স",
            title_en: "Arduino Robotics",
            subtitle: "আমার রোবট তৈরি করুন ও ইলেকট্রনিক্স শিখুন",
            description: "Arduino ব্যবহার করে আমার রোবট তৈরির মাধ্যমে রোবটিক্স এবং ইলেকট্রনিক্সের মূল বিষয়গুলো আয়ত্ত করুন। শিক্ষার্থীরা...",
            description_en: "Master robotics and electronics fundamentals by building your own robot with Arduino",
            price: 3500,
            duration: "8 weeks",
            ageRange: "10-16 years",
            level: "Beginner",
            img: "https://images.unsplash.com/photo-1535378433864-ed1c29cee23d?q=80&w=1000&auto=format&fit=crop",
            features: [
                "লাইভ ইন্টারঅ্যাক্টিভ লেকচারিং (সন্ধ্যা সময়)",
                "Arduino Uno কিট র্যাসবেরি পাই",
                "ধাপে ধাপে প্রজেক্ট গাইড"
            ]
        },
        {
            _id: "2",
            title: "Python ও AI দিয়ে কোডিং",
            title_en: "Python & AI Coding",
            subtitle: "Python আয়ত্ত করুন ও AI আপ্লিকেশন তৈরি করুন",
            description: "সুন্দা থেকে Python প্রোগ্রামিং শিখুন এবং আর্টিফিশিয়াল ইন্টেলিজেন্সে তৈরি দিন। আমার AI টুল ও লাইব্রেরির ব্যবহার করে...",
            description_en: "Learn Python from scratch and dive into AI. Build real projects with AI tools",
            price: 4500,
            duration: "10 weeks",
            ageRange: "12-18 years",
            level: "Intermediate",
            img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
            features: [
                "লাইভ কোডিং সেশন (সন্ধ্যা সময়)",
                "ইন্টারঅ্যাক্টিভ কোডিং চ্যালেঞ্জ",
                "৫০+ হ্যান্ড-অন প্রজেক্ট"
            ]
        },
        {
            _id: "3",
            title: "কোডারদের জন্য গণিত",
            title_en: "Math for Coders",
            subtitle: "কোডিংয়ের মাধ্যমে গণিত মজাদার করুন",
            description: "আবিষ্কার করুন কীভাবে গণিত সব প্রযুক্তিকে চালিত করে। ইন্টার অ্যাক্টিভ কোডিং প্রজেক্টের মাধ্যমে গাণিতিক ধারণা শিখুন...",
            description_en: "Discover how math powers all technology through interactive coding projects",
            price: 2500,
            duration: "6 weeks",
            ageRange: "10-15 years",
            level: "Beginner",
            img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
            features: [
                "জিরোজেরো থেকে ইন্টারমিডিয়েট পর্যা",
                "গেম ো আনিমেশনের মাধ্যমে শিক্ষা",
                "সাপ্তাহিক চ্যালেঞ্জ প্রব্লেম"
            ]
        },
        {
            _id: "4",
            title: "বাস্তব সাইয়া ল্যাব",
            title_en: "Practical Science Lab",
            subtitle: "হাতে-কলমে বিজ্ঞান পরীক্ষা",
            description: "আপনার বাড়িতে একটি সাইয়া ল্যাবের পরিবেশ করুন। উত্তেজনাপূর্ণ পরীক্ষা-নিরীক্ষা করুন, বৈজ্ঞানিক পদ্ধতি শিখুন...",
            description_en: "Turn your home into a science lab! Conduct exciting experiments and learn scientific methods",
            price: 3000,
            duration: "4 weeks",
            ageRange: "8-14 years",
            level: "Beginner",
            img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
            features: [
                "পরীক্ষা কিট বাসায় ডেলিভারি",
                "লাইভ পরীক্ষা দেখুন",
                "ধাপে ধাপে ভিডিও গাইড"
            ]
        }
    ];

    // Always show sample courses (don't wait for API in production)
    const courses = data?.data || sampleCourses;

    // Shadows mapping for visual variety (cycling through based on index) - reused from homepage
    const shadows = [
        "hover:shadow-glow-primary",
        "hover:shadow-glow-accent",
        "hover:shadow-glow-secondary",
        "hover:shadow-xl",
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4">
            {courses.length === 0 ? (
                <div className="col-span-full text-center py-20">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-2xl font-bold text-gray-700">No courses found</h3>
                    <p className="text-gray-500">Please check back later for new programs!</p>
                </div>
            ) : (
                courses.map((course: any, index: number) => (
                    <Card
                        key={course._id}
                        className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${shadows[index % shadows.length]} shadow-card border-0`}
                        isPressable
                        onPress={() => router.push(`/courses/view?id=${course._id}`)}
                    >
                        {/* Course Image Header */}
                        <div className="relative h-48 overflow-hidden w-full">
                            <Image
                                removeWrapper
                                alt={course.title}
                                className="z-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                src={course.img || course.thumbnail || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"}
                            />
                            {/* Gradient Overlay - Fixed Blue Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-blue-900/20 to-transparent z-10" />

                            <div className="absolute bottom-4 left-4 z-20">
                                <Chip color="primary" size="sm" variant="flat" className="bg-white/90 text-primary-700 font-bold shadow-sm">
                                    {course.level}
                                </Chip>
                            </div>
                        </div>

                        <CardBody className="p-6">
                            {/* Course Title */}
                            <h3 className={`text-xl font-bold text-gray-900 mb-2 ${language === "bn" ? "font-siliguri" : ""}`}>
                                {course.title}
                            </h3>

                            {/* Subtitle */}
                            {course.subtitle && (
                                <p className={`text-primary-600 text-sm font-semibold mb-3 ${language === "bn" ? "font-siliguri" : ""}`}>
                                    {course.subtitle}
                                </p>
                            )}

                            {/* Description */}
                            <p className={`text-gray-600 text-sm mb-4 line-clamp-3 ${language === "bn" ? "font-siliguri" : ""}`}>
                                {course.description}
                            </p>

                            {/* Duration & Age Range */}
                            <div className="flex gap-4 mb-4">
                                {course.duration && (
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <span>⏱️</span>
                                        <span className={language === "bn" ? "font-siliguri" : ""}>{course.duration}</span>
                                    </div>
                                )}
                                {course.ageRange && (
                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                        <span>👥</span>
                                        <span className={language === "bn" ? "font-siliguri" : ""}>{course.ageRange}</span>
                                    </div>
                                )}
                            </div>

                            {/* Features List */}
                            {course.features && course.features.length > 0 && (
                                <ul className="space-y-2 mb-4">
                                    {course.features.slice(0, 2).map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-green-500 mt-0.5">✓</span>
                                            <span className="line-clamp-1">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardBody>

                        <CardFooter className="p-6 pt-0">
                            <Button
                                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-md hover:shadow-lg transition-shadow"
                                size="lg"
                                onPress={() => router.push(`/courses/view?id=${course._id}`)}
                            >
                                <span className={language === "bn" ? "font-siliguri" : ""}>
                                    {language === "en" ? "Enroll Now →" : "বিস্তারিত দেখুন →"}
                                </span>
                            </Button>
                        </CardFooter>
                    </Card>
                ))
            )}
        </div>
    );
}
