"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { openTrialModal } from "@/components/TrialBookingModal";
import { Check, ArrowRight } from "lucide-react";

const ModernBanner = () => {
  const router = useRouter();
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

  return (
    <div className="relative w-full min-h-[95vh] pt-32 pb-16 flex items-center justify-center bg-gradient-to-br from-[#EAF4FB]/70 via-[#F5F0FF]/30 to-[#FFF8E1]/70 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-[-10%] w-[40%] h-[40%] rounded-full bg-[#EAF4FB] blur-[80px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[40%] h-[40%] rounded-full bg-[#FFF8E1] blur-[80px] opacity-60 pointer-events-none" />



      <div className="container mx-auto px-6 md:px-12 lg:px-16 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="flex flex-col text-left">
            {/* Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-6 animate-slideDown">
              <span className="inline-flex items-center px-4 py-2 bg-[#7C3AED] text-white text-xs sm:text-sm font-black rounded-full uppercase tracking-wider border border-[#6D28D9] shadow-sm">
                {language === "en" ? "Future skills platform" : "ভবিষ্যৎ দক্ষতা শিক্ষার প্ল্যাটফর্ম"}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-600 text-xs sm:text-sm font-black rounded-full uppercase tracking-wider shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                {language === "en" ? "100% Live Classes • Not Recorded" : "১০০% সরাসরি লাইভ ক্লাস • কোনো রেকর্ডেড ভিডিও নয়"}
              </span>
            </div>

            {/* Main Heading */}
            <h1
              className={`text-5xl md:text-7xl font-black text-[#2C2C2C] mb-6 tracking-tight leading-[1.02] animate-slideUp ${language === "bn" ? "font-siliguri" : ""}`}
            >
              {language === "en" ? (
                <>
                  Turn curiosity
                  <br />
                  into <span className="text-[#3b82f6]">real skills</span>
                  <br />
                  for kids ages 8–17
                </>
              ) : (
                <>
                  জিজ্ঞাসাকে রূপান্তর
                  <br />
                  করুন <span className="text-[#7c3aed]">বাস্তব দক্ষতায়</span>
                  <br />
                  বয়স ৮-১৭ বছরের জন্য
                </>
              )}
            </h1>

            {/* Subtitle / Description */}
            <p
              className={`text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed animate-fadeIn ${language === "bn" ? "font-siliguri" : ""}`}
            >
              {language === "en"
                ? "Kids learn coding, math, and digital media through live lessons, hands-on practice, and real projects."
                : "আমাদের লাইভ ক্লাসে হাতে-কলমে প্রজেক্ট এবং মজার কোডিংয়ের মাধ্যমে শিশুরা সহজে শিখবে প্রোগ্রামিং ও ডিজিটাল লজিক।"}
            </p>

            {/* CTA Button Block */}
            <div className="flex flex-col sm:flex-row gap-4 items-center animate-scaleIn">
              {/* Kodland style trial button */}
              <button
                onClick={() => openTrialModal({ source: "hero_banner" })}
                className="group bg-[#2C2C2C] hover:bg-black text-white font-black pl-8 pr-2 py-2 rounded-full flex items-center justify-between gap-4 transition-all w-full sm:w-[320px] shadow-lg shadow-black/10 cursor-pointer"
              >
                <span className={`text-base tracking-wide ${language === "bn" ? "font-siliguri" : ""}`}>
                  {language === "en" ? "Book a free trial class" : "ফ্রি ট্রায়াল বুক করুন"}
                </span>
                <span className="w-11 h-11 bg-[#F59E0B] rounded-full flex items-center justify-center text-black font-extrabold group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </button>

              <Button
                className="border-2 border-[#2C2C2C] text-[#2C2C2C] font-extrabold px-8 py-6 rounded-full hover:bg-[#2C2C2C]/5 transition-all w-full sm:w-auto text-base"
                variant="bordered"
                onClick={() => router.push("/courses")}
              >
                <span className={language === "bn" ? "font-siliguri" : ""}>
                  {language === "en" ? "Browse Courses" : "কোর্সসমূহ দেখুন"}
                </span>
              </Button>
            </div>

            {/* Bullet Tags */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 text-xs text-gray-500 font-bold tracking-wider uppercase">
              <span className="text-red-600 font-black flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                {language === "en" ? "LIVE INTERACTIVE" : "সরাসরি লাইভ ক্লাস"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> {language === "en" ? "FREE TRIAL" : "ফ্রি ট্রায়াল"}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> {language === "en" ? "UP TO 60 MIN" : "৬০ মিনিট ডেমো"}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-600" /> {language === "en" ? "1-TO-1 DEMO" : "১:১ গাইডেন্স"}</span>
            </div>
          </div>

          {/* Right Column: Generated Mascot Illustration */}
          <div className="relative flex justify-center items-center animate-fadeIn">
            {/* Soft decorative back drop card */}
            <div className="absolute w-[95%] h-[95%] bg-white/40 rounded-[44px] rotate-3 -z-10 border border-white/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-[44px] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                fill
                priority
                alt="Young student with tablet and coding symbols"
                className="object-cover"
                src="/hero-illustration.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernBanner;
