"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { openTrialModal } from "@/components/TrialBookingModal";
import {
  Mic,
  MonitorUp,
  Video,
  Check,
  X,
  ArrowRight,
  Users,
  Sparkles,
} from "lucide-react";

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
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-[-10%] w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-[-10%] w-[450px] h-[450px] bg-purple-100/40 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header Badge & Title */}
        <div className="text-center mb-14 sm:mb-16 animate-fadeIn">
          {/* Live Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-200/80 rounded-full mb-5 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span className="text-rose-700 text-xs font-bold tracking-wide uppercase">
              {language === "en"
                ? "100% Live Mentoring • Zero Pre-Recorded Videos"
                : "১০০% সরাসরি লাইভ ক্লাস • কোনো প্রি-রেকর্ডেড ভিডিও নয়"}
            </span>
          </div>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {language === "en" ? (
              <>
                Live Mentors. Real Interaction. <br />
                <span className="text-[#3B82F6]">Zero Passive Video Watching.</span>
              </>
            ) : (
              <>
                অভিজ্ঞ মেন্টরের সাথে সরাসরি ইন্টারঅ্যাকশন, <br />
                <span className="text-[#3B82F6]">হাতে-কলমে লাইভ কোডিং ও প্রজেক্ট ল্যাব</span>
              </>
            )}
          </h2>

          <p
            className={`text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {language === "en"
              ? "Unlike traditional online courses where kids watch passive videos and get stuck, our expert instructors teach live on camera, debug student code on screen, and guide every build in real-time."
              : "গতানুগতিক রেকর্ডেড কোর্সে বাচ্চারা একা ভিডিও দেখে উৎসাহ হারিয়ে ফেলে। Learn & Grow-তে প্রতিটি ক্লাস হয় গুগল মিট/জুমে লাইভ—শিক্ষক সরাসরি স্ক্রিন দেখে কোড শুধরে দেন এবং প্রতিটি সার্কিট নিখুঁতভাবে শেষ করান।"}
          </p>
        </div>

        {/* 2-Column Showcase: Live Classroom Mockup + Key Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-14">
          {/* Left Column: Interactive Live Classroom Window */}
          <div className="lg:col-span-7 relative">
            <div className="bg-slate-900 p-4 sm:p-5 rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-800 relative overflow-hidden group">
              {/* Window Header / Status Bar */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800 mb-3 text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="font-semibold ml-2 text-slate-300 hidden sm:inline">
                    Learn & Grow Interactive Classroom
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-[11px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold text-[11px] border border-slate-700">
                    <Users className="w-3 h-3 text-blue-400" />
                    {language === "en" ? "1:4 Small Batch" : "১:৪ অনুপাত"}
                  </span>
                </div>
              </div>

              {/* Main Visual Image Container */}
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                <Image
                  src="/live-class-illustration.jpg"
                  alt="Learn and Grow Live Interactive Class"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
              </div>

              {/* Floating Bottom Live Features Row */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-3 pt-3 border-t border-slate-800 text-center">
                <div className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-2.5 border border-slate-700/50 flex flex-col items-center justify-center transition-colors">
                  <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-1" />
                  <p className="text-[11px] sm:text-xs font-medium text-slate-200">
                    {language === "en" ? "2-Way Live Audio" : "সরাসরি প্রশ্নোত্তর"}
                  </p>
                </div>
                <div className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-2.5 border border-slate-700/50 flex flex-col items-center justify-center transition-colors">
                  <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mb-1" />
                  <p className="text-[11px] sm:text-xs font-medium text-slate-200">
                    {language === "en" ? "Live Screen Share" : "লাইভ স্ক্রিন শেয়ার"}
                  </p>
                </div>
                <div className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-2.5 border border-slate-700/50 flex flex-col items-center justify-center transition-colors">
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-1" />
                  <p className="text-[11px] sm:text-xs font-medium text-slate-200">
                    {language === "en" ? "Hardware Video Demo" : "ক্যামেরায় কিট ডেমো"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comparison (Why Live Beats Recorded) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-5">
            {/* Preferred Choice: Learn & Grow Live */}
            <div className="bg-white border-2 border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden ring-4 ring-blue-50/50">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#3B82F6] text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Learn & Grow
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  {language === "en" ? "Recommended Format" : "শিক্ষার্থীদের জন্য সেরা"}
                </span>
              </div>

              <h3
                className={`text-xl sm:text-2xl font-black text-slate-900 mb-4 ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {language === "en"
                  ? "100% Live Interactive Classroom"
                  : "১০০% সরাসরি ইন্টারঅ্যাক্টিভ লাইভ ক্লাস"}
              </h3>

              <ul className="space-y-3 text-xs sm:text-sm font-semibold text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Instructor answers questions instantly during the class"
                      : "ক্লাসের ভেতরেই সাথে সাথে সব প্রশ্নের উত্তর ও সমস্যার সমাধান মেলে"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Teacher checks wiring and Arduino code via webcam"
                      : "ওয়েবক্যামের মাধ্যমে সার্কিট ও কোড সরাসরি মনিটর করে শুধরে দেওয়া হয়"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Build & test real projects in every single class"
                      : "প্রতিটি ক্লাসেই বাস্তব প্রজেক্ট তৈরি করে সরাসরি রান করানো হয়"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Friendly mentors who keep kids engaged and motivated"
                      : "অভিজ্ঞ মেন্টর বন্ধুসুলভ আচরণে কোডিং শেখাকে আনন্দদায়ক করে তোলেন"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Muted Comparison: Traditional Recorded Videos */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6">
              <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-3">
                {language === "en" ? "Traditional Pre-Recorded Courses" : "সাধারণ প্রি-রেকর্ডেড কোর্স"}
              </span>

              <h4
                className={`text-base sm:text-lg font-bold text-slate-800 mb-3 ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {language === "en"
                  ? "Why Recorded Videos Don't Work for Young Learners:"
                  : "রেকর্ডেড ভিডিওতে কেন শিশুরা সাধারণত শেখে না:"}
              </h4>

              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Zero real-time feedback or personal mentor support"
                      : "কোনো সরাসরি শিক্ষক থাকে না, শুধু একতরফা ভিডিও দেখা"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Kids get stuck on minor syntax/wiring errors and lose interest"
                      : "ছোট ভুলে আটকে গেলে সমাধান মেলে না এবং আগ্রহ দ্রুত নষ্ট হয়ে যায়"}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    {language === "en"
                      ? "Over 85% of self-paced pre-recorded courses go unfinished"
                      : "৮০-৯০% শিশুই রেকর্ডেড ভিডিও কোর্স শেষ না করে মাঝপথে ছেড়ে দেয়"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Trial CTA button */}
            <Button
              className="bg-slate-900 text-white font-bold text-sm sm:text-base py-6 rounded-full hover:bg-black transition-all shadow-md flex items-center justify-center gap-3 w-full cursor-pointer"
              onPress={() => openTrialModal({ source: "live_class_section" })}
            >
              <span>
                {language === "en"
                  ? "Book a 1-on-1 Free Live Trial Class"
                  : "ফ্রি লাইভ ক্লাসের ট্রায়াল বুক করুন"}
              </span>
              <span className="w-7 h-7 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveClassSection;
