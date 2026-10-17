"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { openTrialModal } from "@/components/TrialBookingModal";
import { Star, ShieldCheck, Video, ArrowRight, Zap, Sparkles } from "lucide-react";

const ModernBanner = () => {
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

  const isBn = language === "bn";

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#E7FB76]/45 via-[#F7FDC9]/20 to-white pt-24 sm:pt-32 pb-14 sm:pb-20">
      {/* Subtle curved background overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[420px] sm:h-[500px] bg-gradient-to-b from-[#E5F970]/30 to-transparent rounded-[50%] blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative flex flex-col items-center justify-center text-center">

          {/* Left Floating Student Card (Kodland "Brian" style - Desktop only) */}
          <div className="hidden lg:block absolute left-0 xl:-left-4 top-1/2 -translate-y-1/2 -rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300 pointer-events-auto">
            <div className="relative w-48 xl:w-56 h-60 xl:h-72 rounded-[28px] overflow-hidden bg-[#3B82F6] p-2.5 shadow-xl shadow-blue-500/15 border-4 border-white">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-100">
                <Image
                  src="/hero-illustration.jpg"
                  alt="Student coding"
                  fill
                  className="object-cover"
                  sizes="240px"
                  priority
                />
                <span className="absolute top-2.5 left-2.5 bg-white text-slate-800 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                  {isBn ? "রায়ান" : "Rayan"}
                </span>
                <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#F59E0B] text-slate-900 flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 fill-current" />
                </span>
              </div>
            </div>
          </div>

          {/* Right Floating Student Card (Kodland "Kate" style - Desktop only) */}
          <div className="hidden lg:block absolute right-0 xl:-right-4 top-1/2 -translate-y-1/2 rotate-3 transition-transform hover:rotate-0 hover:scale-105 duration-300 pointer-events-auto">
            <div className="relative w-48 xl:w-56 h-60 xl:h-72 rounded-[28px] overflow-hidden bg-[#EE4D90] p-2.5 shadow-xl shadow-pink-500/15 border-4 border-white">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-slate-100">
                <Image
                  src="/workshop/bpsc-students-2.jpg"
                  alt="Student with robotics"
                  fill
                  className="object-cover"
                  sizes="240px"
                  priority
                />
                <span className="absolute top-2.5 left-2.5 bg-white text-slate-800 text-xs font-black px-3 py-1 rounded-full shadow-sm">
                  {isBn ? "সায়রা" : "Saira"}
                </span>
                <span className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Center Content Block */}
          <div className="max-w-2xl mx-auto px-2">
            {/* Main Headline - Simple, Punchy, Kodland style */}
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black text-[#23272A] tracking-tight leading-[1.08] mb-3 sm:mb-4 ${isBn ? "font-siliguri" : ""}`}>
              {isBn ? (
                <>
                  শিশুদের অনলাইন স্কুল
                  <br />
                  <span className="inline-block bg-[#EE4D90] text-white px-5 sm:px-7 py-1 sm:py-1.5 rounded-full shadow-sm mt-1 text-2xl sm:text-4xl lg:text-5xl font-black tracking-normal align-middle">
                    ৮–১৭ বছর বয়সীদের জন্য
                  </span>
                </>
              ) : (
                <>
                  Online school
                  <br />
                  <span className="inline-block bg-[#EE4D90] text-white px-5 sm:px-7 py-1 sm:py-1.5 rounded-full shadow-sm mt-1 text-3xl sm:text-5xl lg:text-6xl font-black tracking-normal align-middle">
                    for kids ages 8–17
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle - Clean, Human, Compact (Not AI odd phrasing) */}
            <p className={`text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-snug sm:leading-normal mb-6 sm:mb-7 font-medium ${isBn ? "font-siliguri" : ""}`}>
              {isBn
                ? "শিশুদের আগ্রহকে রূপান্তর করি ভবিষ্যতের দক্ষতায়। আমরা সরাসরি লাইভ ক্লাসে হাতে-কলমে শেখাই কোডিং, রোবোটিক্স এবং ক্রিয়েটিভ থিংকিং।"
                : "We turn casual interests into skills for the future. We teach coding, robotics, and creative problem solving through live interactive classes."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <button
                onClick={() => openTrialModal({ source: "hero_banner" })}
                className={`w-full sm:w-auto bg-[#23272A] hover:bg-black text-white font-bold text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer ${isBn ? "font-siliguri" : ""}`}
              >
                <span>{isBn ? "ফ্রি ট্রায়াল ক্লাসে জয়েন করুন" : "Sign up for a free trial class"}</span>
                <ArrowRight className="w-4 h-4 text-[#E7FB76]" />
              </button>

              <button
                onClick={() => router.push("/courses")}
                className={`w-full sm:w-auto border-2 border-[#23272A] hover:bg-[#23272A]/5 text-[#23272A] font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all ${isBn ? "font-siliguri" : ""}`}
              >
                {isBn ? "সব কোর্স দেখুন" : "Explore Courses"}
              </button>
            </div>

            {/* Social Proof & Trust Badges Row (Kodland style) */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-600 font-semibold">
              {/* Parent reviews */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black border border-white">
                    P
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border border-white">
                    S
                  </div>
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-[10px] font-black border border-white">
                    R
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                    <span className="ml-1 text-[11px] font-black text-slate-900">4.9</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {isBn ? "১,২০০+ অভিভাবকের ভরসা" : "1,200+ Parent Reviews"}
                  </span>
                </div>
              </div>

              <span className="hidden sm:inline text-slate-300">•</span>

              {/* 100% Live */}
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  {isBn ? "১০০% সরাসরি লাইভ ক্লাস" : "100% Live Interactive"}
                </span>
              </div>

              <span className="hidden sm:inline text-slate-300">•</span>

              {/* STEM Accredited */}
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-bold text-slate-800">
                  {isBn ? "হাতে-কলমে প্র্যাকটিক্যাল প্রজেক্ট" : "Hands-on STEM Projects"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernBanner;
