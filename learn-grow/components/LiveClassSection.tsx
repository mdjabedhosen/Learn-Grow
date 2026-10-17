"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { openTrialModal } from "@/components/TrialBookingModal";

const LiveClassSection = () => {
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "bn">("bn");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("language") as "en" | "bn";
      if (storedLang) setLanguage(storedLang);

      const handleLangChange = () => {
        const updatedLang = localStorage.getItem("language") as "en" | "bn";
        if (updatedLang) setLanguage(updatedLang);
      };

      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#EAF4FB]/40 to-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-[-10%] w-[450px] h-[450px] bg-[#EAF4FB] rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-[-10%] w-[450px] h-[450px] bg-[#F5F0FF] rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header Badge & Title */}
        <div className="text-center mb-16 animate-fadeIn">
          {/* Pulsing Live Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-red-500/10 border-2 border-red-500/30 rounded-full mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-red-600 text-xs sm:text-sm font-black tracking-widest uppercase">
              {language === "en" ? "100% Live Online Classes • Not Pre-Recorded" : "১০০% সরাসরি লাইভ ক্লাস • কোনো রেকর্ডেড ভিডিও নয়"}
            </span>
          </div>

          <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black text-[#2C2C2C] tracking-tight leading-[1.1] mb-5 ${language === "bn" ? "font-siliguri" : ""}`}>
            {language === "en" ? (
              <>
                Live Mentors. Real Interactions. <br />
                <span className="text-[#3B82F6]">Zero Boring Pre-Recorded Videos.</span>
              </>
            ) : (
              <>
                অভিজ্ঞ শিক্ষকের সাথে সরাসরি লাইভ ক্লাস, <br />
                <span className="text-[#7C3AED]">বোরিং কোনো রেকর্ডেড ভিডিও নয়!</span>
              </>
            )}
          </h2>

          <p className={`text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${language === "bn" ? "font-siliguri" : ""}`}>
            {language === "en"
              ? "Unlike traditional online courses where kids watch passive videos and get stuck, our expert instructors teach live on camera, debug student code on screen, and guide every build in real-time."
              : "গতানুগতিক রেকর্ডেড কোর্সে বাচ্চারা একা ভিডিও দেখে উৎসাহ হারিয়ে ফেলে। Learn & Grow-তে প্রতিটি ক্লাস হয় গুগল মিট/জুমে লাইভ—শিক্ষক সরাসরি স্ক্রিন দেখে কোড শুধরে দেন এবং হাতে-কলমে প্রজেক্ট শেষ করান।"}
          </p>
        </div>

        {/* 2-Column Showcase: Live Classroom Mockup/Illustration + Key Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Left Column: Rich Interactive Live Class Illustration Window */}
          <div className="lg:col-span-7 relative">
            {/* Window Container */}
            <div className="bg-[#2C2C2C] p-4 sm:p-5 rounded-[36px] shadow-2xl border-4 border-white relative overflow-hidden group">
              {/* Window Header / Status Bar */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 mb-3 text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-bold ml-2 text-gray-300 hidden sm:inline">
                    Learn & Grow Live Studio™
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white font-extrabold text-[11px] uppercase tracking-wider animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-gray-300 font-bold text-[11px]">
                    4/4 Students
                  </span>
                </div>
              </div>

              {/* Main Visual Image / Illustration Container */}
              <div className="relative w-full aspect-[16/9] rounded-[24px] overflow-hidden bg-black border border-white/10 shadow-inner">
                <Image
                  src="/live-class-illustration.jpg"
                  alt="Learn and Grow Live Interactive Class"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Floating Bottom Live Features Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 pt-3 border-t border-white/10 text-center">
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                  <p className="text-base sm:text-xl">🎙️</p>
                  <p className="text-[11px] sm:text-xs font-bold text-white mt-1">
                    {language === "en" ? "2-Way Talking" : "সরাসরি প্রশ্নোত্তর"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                  <p className="text-base sm:text-xl">💻</p>
                  <p className="text-[11px] sm:text-xs font-bold text-white mt-1">
                    {language === "en" ? "Live Screen Share" : "লাইভ স্ক্রিন শেয়ার"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                  <p className="text-base sm:text-xl">🤖</p>
                  <p className="text-[11px] sm:text-xs font-bold text-white mt-1">
                    {language === "en" ? "Hardware Video Demo" : "ক্যামেরায় কিট ডেমো"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comparison (Why Live Beats Recorded) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Winner Card: Learn & Grow Live */}
            <div className="bg-[#EAF4FB] border-2 border-[#B3D9F5] rounded-[32px] p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-black rounded-full uppercase tracking-wider">
                  Learn & Grow
                </span>
                <span className="text-xs font-bold text-[#1B5C8A]">
                  ⭐ {language === "en" ? "Recommended for Kids" : "শিশুদের জন্য সেরা মাধ্যম"}
                </span>
              </div>

              <h3 className={`text-2xl font-black text-[#2C2C2C] mb-4 ${language === "bn" ? "font-siliguri" : ""}`}>
                {language === "en" ? "✅ 100% Live Interactive Classroom" : "✅ ১০০% সরাসরি ইন্টারঅ্যাক্টিভ লাইভ ক্লাস"}
              </h3>

              <ul className="space-y-3 text-sm font-bold text-gray-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <span>{language === "en" ? "Instructor answers questions instantly during the class" : "ক্লাসের ভেতরেই সাথে সাথে সব প্রশ্নের উত্তর মেলে"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <span>{language === "en" ? "Teacher checks wiring and Arduino code via webcam" : "ওয়েবক্যামের মাধ্যমে সার্কিট ও কোড সরাসরি মনিটর করা হয়"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <span>{language === "en" ? "Build & test real projects in every single class" : "প্রতিটি ক্লাসেই প্রজেক্ট তৈরি করে সরাসরি রান করানো হয়"}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">✓</span>
                  <span>{language === "en" ? "Friendly mentors who make coding enjoyable and engaging" : "শিক্ষক বন্ধুসুলভ আচরণে কোডিংকে দারুণ আকর্ষণীয় করে তোলেন"}</span>
                </li>
              </ul>
            </div>

            {/* Loser Card: Old Recorded Courses */}
            <div className="bg-[#FFF8E1] border-2 border-[#FFE082] rounded-[28px] p-6 opacity-90">
              <span className="px-3 py-1 bg-gray-400 text-white text-xs font-black rounded-full uppercase tracking-wider inline-block mb-3">
                {language === "en" ? "Traditional Recorded Courses" : "সাধারণ রেকর্ডেড কোর্স"}
              </span>

              <h4 className={`text-lg font-black text-gray-700 mb-3 ${language === "bn" ? "font-siliguri" : ""}`}>
                {language === "en" ? "❌ Why Recorded Videos Fail for Kids:" : "❌ কেন রেকর্ডেড ভিডিওতে বাচ্চারা শেখে না:"}
              </h4>

              <ul className="space-y-2 text-xs sm:text-sm font-semibold text-gray-600">
                <li className="flex items-center gap-2 text-red-600">
                  <span>✕</span>
                  <span className="text-gray-600">{language === "en" ? "Zero real-time interaction or guidance" : "কোনো শিক্ষক থাকে না, শুধু একতরফা ভিডিও দেখা"}</span>
                </li>
                <li className="flex items-center gap-2 text-red-600">
                  <span>✕</span>
                  <span className="text-gray-600">{language === "en" ? "Kids get stuck on minor syntax/wiring errors" : "একটু ভুল হলেই আটকে যায় এবং আগ্রহ নষ্ট হয়ে যায়"}</span>
                </li>
                <li className="flex items-center gap-2 text-red-600">
                  <span>✕</span>
                  <span className="text-gray-600">{language === "en" ? "Over 90% of pre-recorded courses are abandoned" : "৮০-৯০% বাচ্চাই ভিডিও কোর্স শেষ না করে বাদ দিয়ে দেয়"}</span>
                </li>
              </ul>
            </div>

            {/* Trial CTA button */}
            <Button
              className="bg-[#2C2C2C] text-white font-black text-base py-6 rounded-full hover:bg-black transition-all shadow-lg flex items-center justify-center gap-3 w-full cursor-pointer"
              onPress={() => openTrialModal({ source: "live_class_section" })}
            >
              <span>{language === "en" ? "Try a 1-on-1 Free Live Class" : "ফ্রি লাইভ ক্লাসের ট্রায়াল নিন"}</span>
              <span className="w-8 h-8 rounded-full bg-[#F59E0B] text-black flex items-center justify-center font-extrabold text-sm">
                →
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveClassSection;
