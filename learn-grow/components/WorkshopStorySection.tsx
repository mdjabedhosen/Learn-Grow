"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight, FaRobot, FaUsers, FaCheckCircle, FaQuoteLeft } from "react-icons/fa";

export default function WorkshopStorySection() {
  const [language, setLanguage] = useState<"en" | "bn">("bn");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language") as "en" | "bn";
      if (stored) setLanguage(stored);

      const handler = () => {
        const updated = localStorage.getItem("language") as "en" | "bn";
        if (updated) setLanguage(updated);
      };

      window.addEventListener("languageChange", handler);
      return () => window.removeEventListener("languageChange", handler);
    }
  }, []);

  const content = {
    bn: {
      pill: "🏆 মাঠপর্যায়ের সাফল্য ও কর্মশালা",
      titlePrefix: "স্ক্রিন টাইম থেকে প্রোগ্রামিং: ",
      titleHighlight: "৩০০ শিক্ষার্থীর প্রথম রোবট",
      subtitle:
        "বসুন্ধরা পাবলিক স্কুল অ্যান্ড কলেজে ২ দিনের ফ্রি রোবটিক্স কর্মশালায় অংশগ্রহণকারী প্রতিটি শিক্ষার্থী তৈরি করেছে নিজস্ব সার্কিট এবং চালিয়েছে সুমো বট!",
      quote:
        "“আমার ছেলে সবসময় মোবাইলে গেম খেলত। কিন্তু এই ২ দিন সে বাসায় গিয়ে সারাক্ষণ আর্ডুইনোর ওয়্যার কানেক্ট করেছে আর কোড লিখেছে। তার এই পরিবর্তন দেখে আমি সত্যিই আনন্দিত।”",
      quoteAuthor: "— একজন অভিভাবক (Mother of Grade 6 Student)",
      stats: [
        { label: "প্রশিক্ষিত শিক্ষার্থী", value: "৩০০+", icon: FaUsers },
        { label: "আর্ডুইনো রোবটো বক্স কিট", value: "৩০০", icon: FaRobot },
        { label: "সফলভাবে সমাপ্তির হার", value: "১০০%", icon: FaCheckCircle },
      ],
      venue: "বসুন্ধরা পাবলিক স্কুল অ্যান্ড কলেজ, ঢাকা",
      cta: "সম্পূর্ণ গল্প ও গ্যালারি পড়ুন",
    },
    en: {
      pill: "🏆 Flagship Workshop & Success Story",
      titlePrefix: "Screen Time to Programming: ",
      titleHighlight: "300 Students Build Their First Robot",
      subtitle:
        "At Bashundhara Public School & College, 300 young students — most of whom had never touched hardware before — coded, built, and battled their own autonomous sumo bots in just 2 days.",
      quote:
        "“My son used to spend all his time playing mobile games. But over these two days, after returning home, he was constantly connecting Arduino wires and writing code. I am truly delighted to see this transformation.”",
      quoteAuthor: "— A Parent (Mother of Grade 6 Student)",
      stats: [
        { label: "Students Trained", value: "300+", icon: FaUsers },
        { label: "Roboto Box Kits", value: "300", icon: FaRobot },
        { label: "Completion Rate", value: "100%", icon: FaCheckCircle },
      ],
      venue: "Bashundhara Public School & College, Dhaka",
      cta: "Read Full Story & Gallery",
    },
  }[language];

  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#F8F9FA] to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#F59E0B] text-white text-xs font-black rounded-full uppercase tracking-widest mb-5">
            {content.pill}
          </span>
          <h2
            className={`text-3xl md:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.titlePrefix}
            <span className="text-[#3B82F6]">{content.titleHighlight}</span>
          </h2>
          <p
            className={`text-base md:text-lg text-gray-600 max-w-3xl mx-auto ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.subtitle}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#EAF4FB]/50 border-2 border-[#B3D9F5] rounded-[32px] p-6 md:p-10 shadow-sm">
          {/* Left: Image / Banner */}
          <div className="lg:col-span-6 relative rounded-[24px] overflow-hidden shadow-xl border border-gray-200 aspect-[16/10] group">
            <Image
              src="/workshop/bpsc-img1.jpg"
              alt="BPSC Robotics Workshop"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <span className="text-white text-xs md:text-sm font-bold bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                📍 {content.venue}
              </span>
            </div>
          </div>

          {/* Right: Metrics & Testimonial */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Stat Counters */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {content.stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="bg-white border-2 border-gray-100 rounded-2xl p-4 text-center shadow-sm"
                  >
                    <Icon className="w-6 h-6 text-[#3B82F6] mx-auto mb-2" />
                    <div className="text-2xl md:text-3xl font-black text-[#2C2C2C]">
                      {stat.value}
                    </div>
                    <div
                      className={`text-xs text-gray-500 font-bold mt-1 ${
                        language === "bn" ? "font-siliguri" : ""
                      }`}
                    >
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mother's Testimonial Card */}
            <div className="bg-[#FFF8E1] border-2 border-[#FFE082] rounded-[24px] p-6 relative shadow-sm">
              <FaQuoteLeft className="text-[#F59E0B] text-2xl mb-3 opacity-60" />
              <p
                className={`text-[#2C2C2C] text-sm md:text-base italic font-semibold leading-relaxed mb-3 ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {content.quote}
              </p>
              <p
                className={`text-xs md:text-sm font-black text-[#B45309] ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {content.quoteAuthor}
              </p>
            </div>

            {/* CTA Button to Full Blog Story */}
            <div>
              <Link
                href="/blog/screen-time-to-programming-bpsc-robotics-workshop"
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#2C2C2C] hover:bg-black text-white text-sm md:text-base font-black rounded-full shadow-lg hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
              >
                <span className={language === "bn" ? "font-siliguri" : ""}>
                  {content.cta}
                </span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
