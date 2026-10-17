"use client";

import React, { useState, useEffect } from "react";
import { openRecruitmentModal } from "@/components/RecruitmentModal";
import { Plus, X, ArrowRight, Sparkles } from "lucide-react";

interface RoleGroup {
  id: string;
  titleEn: string;
  titleBn: string;
  rolesEn: string[];
  rolesBn: string[];
  defaultRole: string;
}

const ROLE_GROUPS: RoleGroup[] = [
  {
    id: "teaching",
    titleEn: "Learning Experience (Teaching) Team",
    titleBn: "লার্নিং এক্সপেরিয়েন্স ও শিক্ষকতা টিম",
    rolesEn: [
      "Tutors (Python, Scratch, Roblox, Arduino, Robotics etc.)",
      "Teaching Quality Assessor",
      "Technical Support Specialists",
      "Customer Service & Student Care Manager",
    ],
    rolesBn: [
      "টিউটর ও প্রশিক্ষক (পাইথন, স্ক্র্যাচ, আর্ডুইনো, রোবটিক্স ইত্যাদি)",
      "টিচিং কোয়ালিটি অ্যাসেসর ও মেন্টর ট্রেইনার",
      "টেকনিক্যাল সাপোর্ট ও ল্যাব স্পেশালিস্ট",
      "কাস্টমার সার্ভিস ও স্টুডেন্ট কেয়ার ম্যানেজার",
    ],
    defaultRole: "Tutor (Robotics & Arduino)",
  },
  {
    id: "operational",
    titleEn: "Operational team",
    titleBn: "অপারেশনাল ও ম্যানেজমেন্ট টিম",
    rolesEn: [
      "Call Center Managers (Booking & Confirmation)",
      "Sales Representatives (Trial Class Managers for Coding & Robotics)",
      "Internal Operations & Kit Dispatch Managers",
      "Sales Manager (work with current customers)",
    ],
    rolesBn: [
      "কল সেন্টার ম্যানেজার (ফ্রি ট্রায়াল বুকিং ও কনফার্মেশন)",
      "সেলস রিপ্রেজেন্টেটিভ (ট্রায়াল ক্লাস ও কোর্স কাউন্সিলর)",
      "ইন্টারনাল অপারেশনস ও রোবটিক্স কিট ডিসপ্যাচ ম্যানেজার",
      "স্টুডেন্ট সাকসেস ও পেরেন্ট রিলেশনশিপ ম্যানেজার",
    ],
    defaultRole: "Call Center Manager (Booking & Confirmation)",
  },
  {
    id: "core",
    titleEn: "Core team",
    titleBn: "কোর টেকনোলজি ও কারিকুলাম টিম",
    rolesEn: [
      "Curriculum Developers (STEM, Robotics & Coding)",
      "Full-Stack Ed-Tech Software Engineers",
      "Video Producers & Creative Media Designers",
      "Growth Marketing & Partnership Specialists",
    ],
    rolesBn: [
      "কারিকুলাম ডেভেলপার (স্টেম, রোবটিক্স ও হ্যান্ডস-অন প্রজেক্ট)",
      "ফুল-স্ট্যাক এড-টেক সফটওয়্যার ইঞ্জিনিয়ার",
      "ভিডিও প্রোডিউসার ও ক্রিয়েটিভ মিডিয়া ডিজাইনার",
      "গ্রোথ মার্কেটিং ও পার্টনারশিপ স্পেশালিস্ট",
    ],
    defaultRole: "STEM Curriculum Developer",
  },
];

export default function RecruitmentProcess({ className = "" }: { className?: string }) {
  // Teaching open by default like screenshot 3
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    teaching: true,
    operational: false,
    core: false,
  });

  // Language state
  const [lang, setLang] = useState<"en" | "bn">("bn");
  useEffect(() => {
    const currentLang = (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn";
    setLang(currentLang);
    const handleLangChange = (e: any) => {
      setLang(e.detail?.language || (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className={`py-12 scroll-mt-28 ${className}`} id="recruitment-process">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="mb-10 text-left">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF4FB] text-[#3B82F6] text-xs font-black uppercase tracking-widest border border-[#B3D9F5] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {lang === "bn" ? "রিক্রুটমেন্ট প্রসেস" : "Recruitment Process"}
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-[#2C2C2C] tracking-tight leading-tight">
            {lang === "bn" ? "আপনার পছন্দের পদ বেছে নিন:" : "Choose a role:"}
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-6">
          {ROLE_GROUPS.map((group) => {
            const isOpen = !!openGroups[group.id];
            const title = lang === "bn" ? group.titleBn : group.titleEn;
            const roles = lang === "bn" ? group.rolesBn : group.rolesEn;

            return (
              <div
                key={group.id}
                className="border-b border-gray-200/80 pb-6 transition-all duration-300"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between py-2 text-left group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-2xl sm:text-3xl font-bold text-[#2C2C2C] group-hover:text-[#3B82F6] transition-colors">
                    {title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isOpen
                        ? "bg-rose-100 text-rose-500 rotate-90"
                        : "bg-gray-100 text-[#EC4899] group-hover:bg-rose-50"
                    }`}
                  >
                    {isOpen ? (
                      <X className="w-5 h-5 font-bold" />
                    ) : (
                      <Plus className="w-5 h-5 font-bold" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="pt-4 pb-2 pl-2 space-y-4 animate-fadeIn">
                    <ul className="space-y-2.5">
                      {roles.map((roleText, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => openRecruitmentModal({ role: roleText })}
                            className="group/item w-full flex items-center justify-between text-left p-2.5 -mx-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-start gap-3 text-base sm:text-lg text-[#2C2C2C] font-semibold group-hover/item:text-[#3B82F6] transition-colors">
                              <span className="text-pink-500 mt-1 text-xs">●</span>
                              <span>{roleText}</span>
                            </div>
                            <span className="opacity-0 group-hover/item:opacity-100 text-xs font-black px-3 py-1 rounded-full bg-[#EAF4FB] text-[#3B82F6] transition-all duration-200 flex items-center gap-1 flex-shrink-0 ml-3">
                              <span>{lang === "bn" ? "আবেদন" : "Apply"}</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* More details link */}
                    <div className="pt-2">
                      <button
                        onClick={() => openRecruitmentModal({ role: group.defaultRole })}
                        className="inline-flex items-center gap-1.5 text-[#3B82F6] hover:text-blue-700 font-bold text-base sm:text-lg underline underline-offset-4 cursor-pointer transition-colors"
                      >
                        <span>{lang === "bn" ? "বিস্তারিত ও সরাসরি আবেদন করুন" : "More details & apply"}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
