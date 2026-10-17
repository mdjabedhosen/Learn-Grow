"use client";
import React, { useState, useEffect } from "react";
import { RotateCcw, Award, Cpu, CreditCard, Sparkles } from "lucide-react";

const PlatformFeaturesSection = () => {
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

  const features = [
    {
      icon: RotateCcw,
      iconColor: "text-[#7C3AED]",
      iconBg: "bg-purple-50 group-hover:bg-[#7C3AED] group-hover:text-white",
      title: language === "en" ? "7-Day Refund" : "৭ দিনের মানি-ব্যাক",
      subtitle: language === "en" ? "100% Money-Back" : "রিফান্ড গ্যারান্টি",
      tag: language === "en" ? "Risk-Free Trial" : "রিস্ক-ফ্রি ট্রায়াল",
      border: "hover:border-[#7C3AED]/40",
      pill: "bg-purple-100/70 text-[#6D28D9]",
    },
    {
      icon: Award,
      iconColor: "text-[#D97706]",
      iconBg: "bg-amber-50 group-hover:bg-[#F59E0B] group-hover:text-white",
      title: language === "en" ? "Verified" : "১০০% ভেরিফাইড",
      subtitle: language === "en" ? "Course Certificate" : "অফিশিয়াল সার্টিফিকেট",
      tag: language === "en" ? "Skill Validation" : "যোগ্যতার স্বীকৃতি",
      border: "hover:border-[#F59E0B]/40",
      pill: "bg-amber-100/70 text-[#92400E]",
    },
    {
      icon: Cpu,
      iconColor: "text-[#2563EB]",
      iconBg: "bg-blue-50 group-hover:bg-[#3B82F6] group-hover:text-white",
      title: language === "en" ? "STEM Kits" : "প্র্যাকটিক্যাল কিট",
      subtitle: language === "en" ? "Hands-on Hardware" : "হাতে-কলমে হার্ডওয়্যার",
      tag: language === "en" ? "Home Delivery" : "ফ্রি হোম ডেলিভারি",
      border: "hover:border-[#3B82F6]/40",
      pill: "bg-blue-100/70 text-[#1D4ED8]",
    },
    {
      icon: CreditCard,
      iconColor: "text-[#059669]",
      iconBg: "bg-emerald-50 group-hover:bg-[#059669] group-hover:text-white",
      title: language === "en" ? "Easy Payment" : "সহজ পেমেন্ট",
      subtitle: language === "en" ? "Multiple Gateways" : "বিকাশ • নগদ • কার্ড",
      tag: language === "en" ? "Secure Checkout" : "নিরাপদ লেনদেন",
      border: "hover:border-emerald-400/40",
      pill: "bg-emerald-100/70 text-[#047857]",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-y border-slate-200/60">
      <div className="container mx-auto max-w-6xl">
        {/* Section label */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
            {language === "en" ? "Platform Guarantees" : "আমাদের প্রতিশ্রুতি ও সুবিধা"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`bg-white border border-slate-200/80 ${item.border} rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col items-center text-center group hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-4 transition-all duration-300 shadow-sm`}
                >
                  <Icon className="w-7 h-7 transition-transform group-hover:scale-110" />
                </div>
                <h3
                  className={`text-lg sm:text-xl font-black text-slate-900 mb-1 tracking-tight ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-xs sm:text-sm font-semibold text-slate-600 mb-3 ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {item.subtitle}
                </p>
                <span
                  className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full ${item.pill} ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
