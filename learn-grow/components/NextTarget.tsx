"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  GraduationCap,
  School,
  Globe,
  Bot,
  Smartphone,
  Sparkles,
  Trophy,
  Building2,
  Users,
  Zap,
} from "lucide-react";

const ROADMAP_ICONS = [GraduationCap, School, Globe, Bot];
const UPCOMING_ICONS = [Smartphone, Sparkles, Trophy, Building2, Users, Zap];

const roadmapData = {
  bn: {
    pill: "আমাদের পরিকল্পনা",
    titlePrefix: "আমাদের পরবর্তী ",
    titleHighlight: "লক্ষ্যমাত্রা",
    subtitle: "আমরা প্রতিনিয়ত বড় হচ্ছি এবং আরও বেশি শিক্ষার্থীর কাছে পৌঁছে যাচ্ছি।",
    roadmap: [
      {
        title: "১০,০০০+ শিক্ষার্থী",
        desc: "২০২৬ সালের মধ্যে ১০,০০০+ শিক্ষার্থীকে রোবটিক্স ও প্রোগ্রামিং শিক্ষা প্রদান।",
        year: "2026",
        bg: "bg-[#EAF4FB]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#3b82f6] text-white",
        iconColor: "text-[#1D4ED8]",
      },
      {
        title: "১০০+ স্কুল পার্টনার",
        desc: "দেশের সকল জেলায় স্কুল এবং প্রতিষ্ঠানের সাথে পার্টনারশিপ।",
        year: "2027",
        bg: "bg-[#F5F0FF]",
        border: "border-[#D4C0F9]",
        pill: "bg-[#7c3aed] text-white",
        iconColor: "text-[#7C3AED]",
      },
      {
        title: "আন্তর্জাতিক সম্প্রসারণ",
        desc: "দক্ষিণ এশিয়ার অন্যান্য দেশে আমাদের কোর্স পৌঁছে দেওয়া।",
        year: "2028",
        bg: "bg-[#EAF4FB]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#3B82F6] text-white",
        iconColor: "text-[#3B82F6]",
      },
      {
        title: "AI & Machine Learning",
        desc: "নতুন কোর্স: আর্টিফিশিয়াল ইন্টেলিজেন্স এবং মেশিন লার্নিং বাংলায়।",
        year: "2026",
        bg: "bg-[#FFFBEA]",
        border: "border-[#FDEFC0]",
        pill: "bg-[#F59E0B] text-white",
        iconColor: "text-[#B45309]",
      },
    ],
    upcomingTitle: "শীঘ্রই আসছে",
    upcoming: [
      { text: "মোবাইল অ্যাপ (iOS & Android)" },
      { text: "ইন্টারঅ্যাক্টিভ AR/VR লার্নিং" },
      { text: "গ্লোবাল রোবটিক্স কম্পিটিশন" },
      { text: "কর্পোরেট ট্রেনিং প্রোগ্রাম" },
      { text: "ফ্রি কমিউনিটি ওয়ার্কশপ" },
      { text: "এডভান্সড প্রজেক্ট চ্যালেঞ্জ" },
    ],
  },
  en: {
    pill: "Our Roadmap",
    titlePrefix: "Our Next ",
    titleHighlight: "Milestones",
    subtitle: "We are growing continuously and expanding our reach to inspire more young innovators.",
    roadmap: [
      {
        title: "10,000+ Students",
        desc: "Providing robotics and programming education to 10,000+ students by 2026.",
        year: "2026",
        bg: "bg-[#EAF4FB]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#3b82f6] text-white",
        iconColor: "text-[#1D4ED8]",
      },
      {
        title: "100+ School Partners",
        desc: "Partnering with schools and institutions across every district nationwide.",
        year: "2027",
        bg: "bg-[#F5F0FF]",
        border: "border-[#D4C0F9]",
        pill: "bg-[#7c3aed] text-white",
        iconColor: "text-[#7C3AED]",
      },
      {
        title: "Global Expansion",
        desc: "Extending our STEM courses and kits to other countries across South Asia.",
        year: "2028",
        bg: "bg-[#EAF4FB]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#3B82F6] text-white",
        iconColor: "text-[#3B82F6]",
      },
      {
        title: "AI & Machine Learning",
        desc: "Brand new curriculum: Artificial Intelligence and Machine Learning in native language.",
        year: "2026",
        bg: "bg-[#FFFBEA]",
        border: "border-[#FDEFC0]",
        pill: "bg-[#F59E0B] text-white",
        iconColor: "text-[#B45309]",
      },
    ],
    upcomingTitle: "Coming Soon",
    upcoming: [
      { text: "Mobile App (iOS & Android)" },
      { text: "Interactive AR/VR Learning" },
      { text: "Global Robotics Competition" },
      { text: "Corporate Training Programs" },
      { text: "Free Community Workshops" },
      { text: "Advanced Project Challenges" },
    ],
  },
};

export default function NextTarget() {
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

  const content = roadmapData[language];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#2C2C2C] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#F59E0B] text-black text-xs font-black rounded-full uppercase tracking-widest mb-6 shadow-sm">
            <Rocket className="w-3.5 h-3.5 text-black" />
            <span>{content.pill}</span>
          </span>
          <h2
            className={`text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.titlePrefix}
            <span className="text-[#F59E0B]">{content.titleHighlight}</span>
          </h2>
          <p
            className={`text-lg text-gray-400 max-w-2xl mx-auto ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.subtitle}
          </p>
        </div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {content.roadmap.map((item, i) => {
            const RoadmapIcon = ROADMAP_ICONS[i] || GraduationCap;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`${item.bg} border-2 ${item.border} rounded-[28px] p-6 flex flex-col text-[#2C2C2C] hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 border border-black/5 select-none">
                  <RoadmapIcon className={`w-7 h-7 ${item.iconColor}`} />
                </div>
                <span
                  className={`self-start text-xs font-black px-3 py-1 rounded-full mb-4 ${item.pill}`}
                >
                  {item.year}
                </span>
                <h3
                  className={`text-lg font-black mb-2 leading-snug ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-sm text-gray-500 leading-relaxed ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Upcoming Features */}
        <div className="bg-white/5 border border-white/10 rounded-[28px] p-8">
          <h3
            className={`text-2xl font-black text-[#F59E0B] mb-6 flex items-center gap-2 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            <Sparkles className="w-6 h-6 text-[#F59E0B]" />
            <span>{content.upcomingTitle}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.upcoming.map((item, i) => {
              const UpcomingIcon = UPCOMING_ICONS[i] || Sparkles;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <UpcomingIcon className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <span
                    className={`text-sm font-bold text-gray-300 ${
                      language === "bn" ? "font-siliguri" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
