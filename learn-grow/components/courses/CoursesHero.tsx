"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { openTrialModal } from "@/components/TrialBookingModal";
import { FaChevronRight } from "react-icons/fa";

export default function CoursesHero() {
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [activeTab, setActiveTab] = useState<"coding" | "robotics">("coding");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("preferredLanguage") as "bn" | "en";
      if (savedLang) setLanguage(savedLang);

      const handleLangChange = (e: any) => {
        setLanguage(e.detail?.language || "bn");
      };
      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4]/50 via-[#F8FAFC] to-[#F8F9FA] pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-gray-100">
      {/* Background organic blur spots */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        {/* Breadcrumb - Kodland Style */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-6 sm:mb-8">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            {language === "en" ? "Home" : "হোম"}
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <Link href="/courses" className="hover:text-gray-900 transition-colors">
            {language === "en" ? "Courses" : "কোর্সসমূহ"}
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="text-gray-900 font-semibold">
            {language === "en" ? "STEM & Coding" : "কোডিং ও রোবটিক্স"}
          </span>
        </nav>

        {/* 2-Column Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle, CTA (Kodland Style) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8E1] border border-[#FFE082] rounded-full shadow-xs">
              <span className="text-xs">⚡</span>
              <span className="text-xs font-bold text-[#92620A] uppercase tracking-wider">
                {language === "en" ? "Live Interactive STEM Programs" : "লাইভ ইন্টারঅ্যাক্টিভ স্টেম প্রোগ্রাম"}
              </span>
            </div>

            {/* Giant Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1E1E1E] tracking-tight leading-[1.15]">
              {language === "en" ? (
                <>
                  Coding and robotics <br className="hidden sm:inline" />
                  for kids and teens
                </>
              ) : (
                <>
                  শিশু-কিশোরদের জন্য <br className="hidden sm:inline" />
                  কোডিং ও রোবটিক্স প্রোগ্রাম
                </>
              )}
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-normal leading-relaxed max-w-2xl">
              {language === "en"
                ? "Every lesson bridges curiosity and real-world career skills. We focus on making things real, not just writing code. As such, we turn \"what ifs?\" into real projects built on the child's passion."
                : "প্রতিটি ক্লাস কৌতূহলকে রূপান্তর করে ভবিষ্যৎমুখী বাস্তব দক্ষতায়। আমরা কেবল কোড শেখাই না—শিশুদের আইডিয়াগুলোকে পরিণত করি বাস্তব রোবট, গেম ও এআই প্রজেক্টে।"}
            </p>

            {/* CTA Button Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => openTrialModal({ source: "courses_hero_cta" })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1E1E1E] hover:bg-black text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <span>{language === "en" ? "Sign up for a free trial class" : "ফ্রি ট্রায়াল ক্লাসের জন্য সাইন আপ করুন"}</span>
                <span>→</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 px-2">
                <span>⏱️</span>
                <span>{language === "en" ? "45-min live 1-on-1 session • Free kit consultation" : "৪৫ মিনিটের লাইভ ট্রায়াল • সম্পূর্ণ ফ্রি"}</span>
              </div>
            </div>

            {/* 4 Feature Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-bold text-gray-700">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                {language === "en" ? "100% Live Classes" : "১০০% লাইভ ক্লাস"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
                👥 {language === "en" ? "Batch Size: 10-15" : "ব্যাচ সাইজ: ১০-১৫ জন"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
                🛠️ {language === "en" ? "Hands-on Projects" : "বাস্তব প্রজেক্ট পোর্টফোলিও"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
                🏆 {language === "en" ? "Verified Certificate" : "ভেরিফায়েড সার্টিফিকেট"}
              </span>
            </div>
          </div>

          {/* Right Column: Kodland-Style Student Showcase Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Tab switch between Python & Robotics */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <button
                onClick={() => setActiveTab("coding")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === "coding"
                    ? "bg-[#3B82F6] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                🐍 {language === "en" ? "Coding Track" : "পাইথন ট্র্যাক"}
              </button>
              <button
                onClick={() => setActiveTab("robotics")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeTab === "robotics"
                    ? "bg-[#F59E0B] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                🤖 {language === "en" ? "Robotics Track" : "রোবটিক্স ট্র্যাক"}
              </button>
            </div>

            {/* Showcase Main Card with rounded-[32px] */}
            <div className="relative rounded-[32px] overflow-hidden bg-white p-2.5 sm:p-3 shadow-xl border border-gray-100 group">
              
              <div className="relative w-full aspect-[4/3] rounded-[26px] overflow-hidden bg-gradient-to-br from-[#EAF4FB] via-[#F5F0FF] to-[#FFF8E1]">
                <img
                  src={
                    activeTab === "coding"
                      ? "/courses/python-course-banner.jpg"
                      : "/courses/robotics-course-banner.jpg"
                  }
                  alt={activeTab === "coding" ? "Python Student" : "Robotics Student"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Overlay live indicator */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {activeTab === "coding" ? "Student Spotlight • Python" : "Student Spotlight • Robotics"}
                  </span>
                </div>
              </div>

              {/* Card Footer summary */}
              <div className="pt-3 pb-1 px-3 flex items-center justify-between text-xs text-gray-600">
                <span className="font-semibold text-gray-900">
                  {activeTab === "coding" ? "Tanvir (15) • Built an AI Chatbot" : "Nabil (11) • Built an Obstacle Robot"}
                </span>
                <Link
                  href={
                    activeTab === "coding"
                      ? "/courses/python-programming-for-teens"
                      : "/courses/junior-robotics"
                  }
                  className="font-bold text-[#3B82F6] hover:underline"
                >
                  {language === "en" ? "View Track →" : "সিলেবাস দেখুন →"}
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
