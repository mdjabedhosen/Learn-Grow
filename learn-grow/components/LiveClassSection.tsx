"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { openTrialModal } from "@/components/TrialBookingModal";
import { Users, MonitorCheck, Cpu, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

const LiveClassSection = () => {
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

  const features = [
    {
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      titleBn: "ছোট ব্যাচে ক্লাস (১:৪ অনুপাত)",
      titleEn: "Small Batches (1:4 Ratio)",
      descBn: "শিক্ষক প্রতিটি শিক্ষার্থীর অগ্রগতির ওপর ব্যক্তিগতভাবে নজর রাখেন। কেউ পিছিয়ে পড়ে না।",
      descEn: "Instructors pay individual attention to every student's learning pace so no child is left behind.",
    },
    {
      icon: MonitorCheck,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      titleBn: "সরাসরি কোড ও সার্কিট মনিটরিং",
      titleEn: "Live Screen & Hardware Check",
      descBn: "লাইভ স্ক্রিন শেয়ার ও ওয়েবক্যামের মাধ্যমে মেন্টর প্রতিটি সার্কিট ও কোড তাৎক্ষণিক পরীক্ষা করে দেন।",
      descEn: "Mentors verify wiring and debug code in real time through webcam and live screen sharing.",
    },
    {
      icon: Cpu,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      titleBn: "হাতে-কলমে প্রজেক্ট ল্যাব",
      titleEn: "Hands-on Project Lab",
      descBn: "কেবল তাত্ত্বিক পড়া নয়, প্রতিটি ক্লাসেই বাস্তব রোবট, গেম ও সার্কিট তৈরি করে রান করানো হয়।",
      descEn: "Beyond theory: kids construct real robotics models and write working code in every single lesson.",
    },
    {
      icon: MessageSquare,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      titleBn: "খোলামেলা প্রশ্নোত্তর ও আলোচনা",
      titleEn: "Open 2-Way Discussion",
      descBn: "শিশুরা দ্বিধাহীনভাবে যে কোনো প্রশ্ন করতে পারে এবং সাথে সাথেই মেন্টরের কাছ থেকে সমাধান পায়।",
      descEn: "A friendly environment where students ask questions freely and receive instant, patient explanations.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Clean & Minimal */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {isBn ? "লাইভ লার্নিং ফরম্যাট" : "Live Learning Format"}
          </span>

          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-3 ${isBn ? "font-siliguri" : ""}`}>
            {isBn ? "সরাসরি লাইভ ক্লাসে যেভাবে শেখে শিশুরা" : "How Kids Learn in Live Classes"}
          </h2>

          <p className={`text-sm sm:text-base text-slate-600 leading-relaxed font-medium ${isBn ? "font-siliguri" : ""}`}>
            {isBn
              ? "কোনো প্রি-রেকর্ডেড একতরফা ভিডিও নয়—আমাদের অভিজ্ঞ মেন্টরদের সাথে সরাসরি ক্লাসে প্রতিটি শিক্ষার্থী শেখে হাতে-কলমে।"
              : "No passive pre-recorded videos. Real mentors teach live, guide every step, and spark genuine curiosity."}
          </p>
        </div>

        {/* 2-Column Clean Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
          
          {/* Left: Clean, Authentic Classroom Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[28px] overflow-hidden bg-slate-100 border border-slate-200/80 shadow-lg aspect-[4/3] w-full">
              <Image
                src="/live-class-illustration.jpg"
                alt="Interactive Live Classroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>{isBn ? "১০০% সরাসরি লাইভ" : "100% Live Mentoring"}</span>
              </div>
            </div>
          </div>

          {/* Right: 4 Clean Minimal Feature Points */}
          <div className="lg:col-span-6 flex flex-col gap-3.5 sm:gap-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 sm:p-4.5 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl ${feat.color} border flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm sm:text-base font-bold text-slate-900 mb-1 ${isBn ? "font-siliguri" : ""}`}>
                      {isBn ? feat.titleBn : feat.titleEn}
                    </h3>
                    <p className={`text-xs sm:text-sm text-slate-600 leading-relaxed ${isBn ? "font-siliguri" : ""}`}>
                      {isBn ? feat.descBn : feat.descEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Minimal Bottom CTA */}
        <div className="text-center pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className={`text-sm text-slate-600 font-semibold ${isBn ? "font-siliguri" : ""}`}>
            {isBn ? "আপনার সন্তানের জন্য একটি ফ্রি লাইভ ক্লাস ট্রাই করে দেখুন:" : "Experience an interactive live session for your child:"}
          </p>
          <button
            onClick={() => openTrialModal({ source: "live_class_section" })}
            className={`bg-[#2C2C2C] hover:bg-black text-white text-sm font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer ${isBn ? "font-siliguri" : ""}`}
          >
            <span>{isBn ? "ফ্রি ট্রায়াল ক্লাস বুক করুন" : "Book a Free Trial Class"}</span>
            <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default LiveClassSection;
