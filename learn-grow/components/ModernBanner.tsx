"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { openTrialModal } from "@/components/TrialBookingModal";
import { Star, ArrowRight, Cpu, Video, ShieldCheck, Sparkles } from "lucide-react";

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
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#EAF4FB]/80 via-white to-white pt-24 sm:pt-32 pb-12 sm:pb-16">
      {/* Background Soft Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[350px] bg-gradient-to-b from-blue-100/40 via-purple-50/20 to-transparent rounded-[50%] blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Authentic Brand Messaging & Action */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            
            {/* Category / Target Age Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200/80 rounded-full mb-3.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className={`text-xs font-bold text-blue-800 tracking-wide ${isBn ? "font-siliguri" : ""}`}>
                {isBn ? "৭–১৬ বছর বয়সীদের জন্য • লাইভ স্টেম শিক্ষা" : "Ages 7–16 • Live Interactive STEM Learning"}
              </span>
            </div>

            {/* Main Title - Compact, confident, natural */}
            <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C2C2C] tracking-tight leading-[1.18] mb-3.5 break-words ${isBn ? "font-siliguri" : ""}`}>
              {isBn ? (
                <>
                  কোডিং ও রোবোটিক্সে গড়ে উঠুক{" "}
                  <span className="text-[#3B82F6]">আপনার সন্তানের</span> ভবিষ্যৎ
                </>
              ) : (
                <>
                  Empower Your Child&apos;s Future with{" "}
                  <span className="text-[#3B82F6]">Coding</span> &{" "}
                  <span className="text-[#7C3AED]">Robotics</span>
                </>
              )}
            </h1>

            {/* Subtitle - Professional, direct, human */}
            <p className={`text-sm sm:text-base lg:text-lg text-slate-600 leading-normal sm:leading-relaxed max-w-xl mb-6 font-medium ${isBn ? "font-siliguri" : ""}`}>
              {isBn
                ? "অভিজ্ঞ মেন্টরদের সরাসরি লাইভ ক্লাসে শিশুরা শিখবে প্রোগ্রামিং লজিক, সার্কিট তৈরি এবং ক্রিয়েটিভ প্রজেক্ট—যা তাদের প্রযুক্তিগত চিন্তাভাবনাকে করবে আরো শাণিত।"
                : "Live interactive classes where kids build real circuits, master coding fundamentals, and bring their creative ideas to life with dedicated mentors."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6">
              <button
                onClick={() => openTrialModal({ source: "hero_banner" })}
                className={`bg-[#2C2C2C] hover:bg-black text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-black/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer group hover:-translate-y-0.5 active:translate-y-0 ${isBn ? "font-siliguri" : ""}`}
              >
                <span>{isBn ? "ফ্রি ট্রায়াল ক্লাস বুক করুন" : "Book a Free Trial Class"}</span>
                <span className="w-7 h-7 rounded-full bg-[#F59E0B] text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </button>

              <button
                onClick={() => router.push("/courses")}
                className={`border-2 border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-sm sm:text-base px-6 py-3 rounded-full hover:bg-slate-50 transition-all ${isBn ? "font-siliguri" : ""}`}
              >
                {isBn ? "কোর্সসমূহ দেখুন" : "Explore Courses"}
              </button>
            </div>

            {/* Micro Trust Points */}
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-xs font-semibold text-slate-600 pt-3 border-t border-slate-100 w-full">
              <div className="flex items-center gap-1.5 shrink-0">
                <Video className="w-4 h-4 text-blue-600" />
                <span>{isBn ? "১০০% সরাসরি লাইভ ক্লাস" : "100% Live Classes"}</span>
              </div>
              <span className="text-slate-300 hidden xs:inline">•</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>{isBn ? "প্র্যাকটিক্যাল হার্ডওয়্যার কিট" : "Hands-on Project Kit"}</span>
              </div>
              <span className="text-slate-300 hidden xs:inline">•</span>
              <div className="flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? "১:১ পার্সোনালাইজড কেয়ার" : "Personalized Care"}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase (Clean, Rounded, High-Quality) */}
          <div className="lg:col-span-5 relative flex justify-center items-center mt-4 lg:mt-0">
            {/* Decorative background aura card */}
            <div className="absolute w-[92%] h-[92%] bg-gradient-to-tr from-blue-100 to-purple-100 rounded-[32px] -rotate-2 -z-10" />

            {/* Main Showcase Card */}
            <div className="relative w-full max-w-[380px] lg:max-w-[420px] rounded-[32px] overflow-hidden bg-white border-4 border-white shadow-2xl">
              <div className="relative aspect-[3/4] w-full bg-[#EAF4FB]">
                <Image
                  src="/hero-illustration.jpg"
                  alt="Student learning coding and robotics"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 420px"
                  priority
                />
              </div>

              {/* Floating Bottom Card: Parent Trust Badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                    <Sparkles className="w-4 h-4 fill-amber-500" />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-black text-slate-900 ${isBn ? "font-siliguri" : ""}`}>
                      {isBn ? "অভিভাবকদের আস্থায় সেরা" : "Trusted by 1,200+ Parents"}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="font-bold text-slate-800">4.9/5</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                  {isBn ? "লাইভ ক্লাস" : "Live Class"}
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
