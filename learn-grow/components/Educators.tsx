"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useGetHomeTeamMembersQuery } from "@/redux/api/teamApi";
import { useGetApprovedInstructorsPublicQuery } from "@/redux/api/userApi";
import { openTrialModal } from "@/components/TrialBookingModal";

type TutorCardItem = {
  id: string;
  name: string;
  roleEn: string;
  roleBn: string;
  experienceEn: string;
  experienceBn: string;
  tags: string[];
  image: string;
  bioEn: string;
  bioBn: string;
  theme: {
    cardBg: string;
    detailsBg: string;
    orbColor: string;
    orbShadow: string;
    ringColor: string;
    tagBg: string;
  };
};

// 5 Brand-Aligned Themes strictly following Learn & Grow Palette (Blue, Purple, Gold, Cyan, Indigo)
const BRAND_THEMES = [
  {
    cardBg: "from-[#DBEAFE] via-[#BFDBFE] to-[#3B82F6]",
    detailsBg: "from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]",
    orbColor: "from-white/80 via-blue-200/60 to-cyan-300/40",
    orbShadow: "shadow-[0_20px_45px_rgba(59,130,246,0.35)]",
    ringColor: "border-blue-200/50",
    tagBg: "bg-[#EAF4FB] text-[#1D4ED8] border border-[#B3D9F5]",
  },
  {
    cardBg: "from-[#EDE9FE] via-[#DDD6FE] to-[#7C3AED]",
    detailsBg: "from-[#8B5CF6] via-[#7C3AED] to-[#5B21B6]",
    orbColor: "from-white/80 via-purple-200/60 to-violet-300/40",
    orbShadow: "shadow-[0_20px_45px_rgba(124,58,237,0.35)]",
    ringColor: "border-purple-200/50",
    tagBg: "bg-[#F5F0FF] text-[#5B21B6] border border-[#D4C0F9]",
  },
  {
    cardBg: "from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B]",
    detailsBg: "from-[#F59E0B] via-[#D97706] to-[#B45309]",
    orbColor: "from-white/80 via-amber-200/60 to-yellow-300/40",
    orbShadow: "shadow-[0_20px_45px_rgba(245,158,11,0.35)]",
    ringColor: "border-amber-200/50",
    tagBg: "bg-[#FFF8E1] text-[#92400E] border border-[#FFE082]",
  },
  {
    cardBg: "from-[#CFFAFE] via-[#A5F3FC] to-[#06B6D4]",
    detailsBg: "from-[#06B6D4] via-[#0284C7] to-[#0369A1]",
    orbColor: "from-white/80 via-cyan-200/60 to-sky-300/40",
    orbShadow: "shadow-[0_20px_45px_rgba(6,182,212,0.35)]",
    ringColor: "border-cyan-200/50",
    tagBg: "bg-[#ECFEFF] text-[#0E7490] border border-[#A5F3FC]",
  },
  {
    cardBg: "from-[#E0E7FF] via-[#C7D2FE] to-[#6366F1]",
    detailsBg: "from-[#6366F1] via-[#4F46E5] to-[#3730A3]",
    orbColor: "from-white/80 via-indigo-200/60 to-purple-300/40",
    orbShadow: "shadow-[0_20px_45px_rgba(99,102,241,0.35)]",
    ringColor: "border-indigo-200/50",
    tagBg: "bg-[#EEF2FF] text-[#4338CA] border border-[#C7D2FE]",
  },
  {
    cardBg: "from-[#D1FAE5] via-[#A7F3D0] to-[#10B981]",
    detailsBg: "from-[#10B981] via-[#059669] to-[#047857]",
    orbColor: "from-white/80 via-emerald-200/60 to-teal-300/40",
    orbShadow: "shadow-[0_20px_45px_rgba(16,185,129,0.35)]",
    ringColor: "border-emerald-200/50",
    tagBg: "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]",
  },
];

// Rich authentic profiles of Learn & Grow core educators
const REAL_TUTOR_SPECS: (Omit<TutorCardItem, "theme"> & { matchKeys: string[] })[] = [
  {
    id: "tutor-jabed",
    matchKeys: ["jabed", "md jabed", "m.riyad3834@gmail.com"],
    name: "Md Jabed Hosen",
    roleEn: "Founder & Lead AI Mentor",
    roleBn: "প্রতিষ্ঠাতা ও লিড এআই মেন্টর",
    experienceEn: "3+ years of experience",
    experienceBn: "৩+ বছরের শিক্ষকতার অভিজ্ঞতা",
    tags: ["Python", "Artificial Intelligence"],
    image: "/images/tutors/tutor-jabed.png",
    bioEn: "AI/ML Engineer and Data Science researcher pursuing MSc at University of Milano-Bicocca, Italy. Passionate about empowering kids and teens in Python programming and Artificial Intelligence.",
    bioBn: "ইতালির ইউনিভার্সিটি অফ মিলানো-বিকোকার ডেটা সায়েন্স গবেষক ও উদ্যোক্তা। শিশুদের পাইথন কোডিং, মেশিন লার্নিং ও এআই অ্যালগরিদমে বাস্তব দক্ষতা গড়তে নিবেদিত।",
  },
  {
    id: "tutor-tanvir",
    matchKeys: ["tanvir", "tanvirhassan1201@gmail.com"],
    name: "Md. Tanvir Hassan",
    roleEn: "Senior Robotics Lead",
    roleBn: "সিনিয়র রোবটিক্স ও হার্ডওয়্যার ট্রেইনার",
    experienceEn: "6 years of experience",
    experienceBn: "৬ বছরের শিক্ষকতার অভিজ্ঞতা",
    tags: ["Robotics", "Arduino"],
    image: "/images/tutors/tutor-tanvir.png",
    bioEn: "Innovative hardware engineer driving R&D at Cybernetics Hi-Tech Solutions and robotics mentor at Learn & Grow. Guided 300+ students in national robotics competitions.",
    bioBn: "উদ্ভাবনী হার্ডওয়্যার ইঞ্জিনিয়ার ও রোবটিক্স ট্রেইনার। শিশু ও তরুণদের প্রজেক্ট-ভিত্তিক আর্দুইনো, সেন্সর ও সার্কিট ডিজাইনে বাস্তব দক্ষতা গড়ে তোলেন।",
  },
  {
    id: "tutor-tonni",
    matchKeys: ["tonni", "tasnim", "tasnimtonni024@gmail.com"],
    name: "Tasnim Jahan Tonni",
    roleEn: "Lead Coding & AI Mentor",
    roleBn: "লিড কোডিং ও এআই মেন্টর",
    experienceEn: "5 years of experience",
    experienceBn: "৫ বছরের শিক্ষকতার অভিজ্ঞতা",
    tags: ["Python", "Artificial Intelligence"],
    image: "/images/tutors/tutor-tonni.png",
    bioEn: "Computer Science researcher and lecturer at Daffodil International University. Passionate about teaching kids Python coding, AI logic, and creative projects.",
    bioBn: "কম্পিউটার সায়েন্স গবেষক ও অভিজ্ঞ বিশ্ববিদ্যালয় শিক্ষক। শিশুদের পাইথন কোডিং, মেশিন লার্নিং ও এআই অ্যালগরিদম সহজ ভাষায় বাস্তব প্রজেক্টের মাধ্যমে শেখান।",
  },
  {
    id: "tutor-saiful",
    matchKeys: ["saiful", "saifulislam@learngrow.academy"],
    name: "Saiful Islam",
    roleEn: "Master Coder & Algorithms Lead",
    roleBn: "মাস্টার কোডার ও অ্যালগরিদম ট্রেইনার",
    experienceEn: "7 years of experience",
    experienceBn: "৭ বছরের শিক্ষকতার অভিজ্ঞতা",
    tags: ["Python", "Algorithms"],
    image: "/images/tutors/tutor-saiful.png",
    bioEn: "MS in Data Science from Sapienza University of Rome, Italy. Inspires kids to master algorithmic problem-solving, structured programming, and full-stack logic.",
    bioBn: "ইতালির স্যাপিয়েনজা ইউনিভার্সিটির ডেটা সায়েন্স গবেষক। শিশুদের ক্রিটিক্যাল থিংকিং, অ্যালগরিদম ও ক্রিয়েটিভ প্রবলেম সলভিংয়ে বিশ্বমানের দক্ষতা তৈরিতে নিবেদিত।",
  },
  {
    id: "tutor-shakil",
    matchKeys: ["shakil", "shakilrana@learngrow.academy"],
    name: "Shakil Rana",
    roleEn: "Junior Game Creator & STEM Lead",
    roleBn: "জুনিয়র গেম ক্রিয়েটর ও স্টেম লিড",
    experienceEn: "5 years of experience",
    experienceBn: "৫ বছরের শিক্ষকতার অভিজ্ঞতা",
    tags: ["Scratch", "Game Dev"],
    image: "/images/tutors/tutor-shakil.png",
    bioEn: "M.Sc. in AI and Intelligent Systems, University of Bremen, Germany. Dedicated to teaching kids game design in Scratch and Roblox, building problem-solving skills.",
    bioBn: "জার্মানির ব্রেমেন ইউনিভার্সিটির এআই গবেষক। শিশু-কিশোরদের স্ক্র্যাচ, রবলক্স গেম ডেভেলপমেন্ট ও সৃজনশীল কোডিং শেখাতে নিবেদিত।",
  },
  {
    id: "tutor-sovon",
    matchKeys: ["sovon", "shovan", "shovanparvez@learngrow.academy"],
    name: "Shovan Parvez",
    roleEn: "Hands-on Robotics & IoT Specialist",
    roleBn: "হ্যান্ডস-অন রোবটিক্স ও আইওটি ট্রেইনার",
    experienceEn: "5 years of experience",
    experienceBn: "৫ বছরের শিক্ষকতার অভিজ্ঞতা",
    tags: ["IoT", "Microcontrollers"],
    image: "/images/tutors/tutor-sovon.png",
    bioEn: "Rehabilitation Engineer at CRP and IoT specialist. Inspires young learners through hands-on circuit prototyping, sensors, and real-world microcontrollers.",
    bioBn: "সিআরপি-র রিহ্যাবিলিটেশন ইঞ্জিনিয়ার ও আইওটি বিশেষজ্ঞ। শিশুদের হাতে-কলমে সার্কিট মেকিং, সেন্সর প্রোগ্রামিং এবং বাস্তব হার্ডওয়্যার রোবট প্রজেক্ট তৈরি শেখান।",
  },
];

const resolveImageSrc = (value?: string) => {
  if (!value || value === "placeholder" || value.trim() === "") return "";
  if (value.startsWith("data:image")) return value;
  if (value.startsWith("http")) return value;
  return `data:image/jpeg;base64,${value}`;
};

export default function Educators() {
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  // Sync language with navbar & localStorage
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

  // Fetch real team members & approved instructors from database
  const { data: teamData } = useGetHomeTeamMembersQuery({});
  const { data: instructorsData } = useGetApprovedInstructorsPublicQuery();

  const tutorsList: TutorCardItem[] = useMemo(() => {
    const dbTeam = Array.isArray(teamData?.data) ? teamData.data : [];
    const dbInstructors = Array.isArray(instructorsData?.data) ? instructorsData.data : [];

    const result: TutorCardItem[] = [];
    const processedIds = new Set<string>();

    // 1. Process Core Real Tutor Specs (with DB data overlay if available)
    REAL_TUTOR_SPECS.forEach((spec, idx) => {
      // Find matching DB team member or approved instructor
      const matchedTeam = dbTeam.find((m: any) => {
        const str = `${m.name || ""} ${m.email || ""}`.toLowerCase();
        return spec.matchKeys.some((k) => str.includes(k));
      });

      // If matched in dbTeam, check if admin explicitly hid this member
      if (matchedTeam && matchedTeam.showOnHome === false) {
        return;
      }

      const matchedInstructor = !matchedTeam
        ? dbInstructors.find((inst: any) => {
            const str = `${inst.name || ""} ${inst.email || ""}`.toLowerCase();
            return spec.matchKeys.some((k) => str.includes(k));
          })
        : null;

      const matchedDb = matchedTeam || matchedInstructor;
      const theme = BRAND_THEMES[idx % BRAND_THEMES.length];

      if (matchedDb) {
        const dbId = String(matchedDb._id || spec.id);
        processedIds.add(dbId);
        processedIds.add(spec.id);
        const normName = (matchedDb.name || spec.name).toLowerCase().trim();
        processedIds.add(normName);

        let tags = spec.tags;
        if (Array.isArray(matchedDb.expertise) && matchedDb.expertise.length > 0) {
          tags = matchedDb.expertise.slice(0, 2);
        } else if (typeof matchedDb.expertise === "string" && matchedDb.expertise.trim()) {
          tags = matchedDb.expertise.split(",").map((s: string) => s.trim()).slice(0, 2);
        }

        const dbImg = resolveImageSrc(matchedDb.image || matchedDb.profileImage);
        const finalImage = dbImg || spec.image || "/images/tutors/tutor-tanvir.png";

        result.push({
          id: dbId,
          name: matchedDb.name || spec.name,
          roleEn: matchedDb.role || spec.roleEn,
          roleBn: matchedDb.role || spec.roleBn,
          experienceEn: matchedDb.yearsOfExperience
            ? (String(matchedDb.yearsOfExperience).toLowerCase().includes("year") || String(matchedDb.yearsOfExperience).toLowerCase().includes("exp")
                ? String(matchedDb.yearsOfExperience)
                : `${matchedDb.yearsOfExperience} years of experience`)
            : spec.experienceEn,
          experienceBn: matchedDb.yearsOfExperience
            ? (String(matchedDb.yearsOfExperience).toLowerCase().includes("year") || String(matchedDb.yearsOfExperience).toLowerCase().includes("exp")
                ? String(matchedDb.yearsOfExperience)
                : `${matchedDb.yearsOfExperience} শিক্ষকতার অভিজ্ঞতা`)
            : spec.experienceBn,
          tags,
          image: finalImage,
          bioEn: matchedDb.bio || spec.bioEn,
          bioBn: matchedDb.bio || spec.bioBn || matchedDb.bio,
          theme,
        });
      } else {
        processedIds.add(spec.id);
        processedIds.add(spec.name.toLowerCase().trim());
        result.push({
          id: spec.id,
          name: spec.name,
          roleEn: spec.roleEn,
          roleBn: spec.roleBn,
          experienceEn: spec.experienceEn,
          experienceBn: spec.experienceBn,
          tags: spec.tags,
          image: spec.image,
          bioEn: spec.bioEn,
          bioBn: spec.bioBn,
          theme,
        });
      }
    });

    // 2. Add ANY EXTRA TEAM MEMBERS selected by Admin from admin panel (showOnHome: true)
    dbTeam.forEach((member: any) => {
      const memberId = String(member._id);
      const normName = (member.name || "").toLowerCase().trim();

      // Skip if already processed in Core Specs
      if (processedIds.has(memberId) || processedIds.has(normName)) {
        return;
      }

      // Only include if showOnHome is not false
      if (member.showOnHome === false) {
        return;
      }

      processedIds.add(memberId);
      processedIds.add(normName);

      const theme = BRAND_THEMES[result.length % BRAND_THEMES.length];
      const finalImage = resolveImageSrc(member.image) || "/images/tutors/tutor-tanvir.png";

      let tags: string[] = [];
      if (Array.isArray(member.expertise) && member.expertise.length > 0) {
        tags = member.expertise.slice(0, 2);
      } else if (typeof member.expertise === "string" && member.expertise.trim()) {
        tags = member.expertise.split(",").map((s: string) => s.trim()).slice(0, 2);
      } else if (member.domain) {
        tags = [member.domain];
      } else {
        tags = ["STEM", "Technology"];
      }

      const roleStr = member.role || "Mentor";
      const expStr = member.yearsOfExperience
        ? (String(member.yearsOfExperience).includes("year") || String(member.yearsOfExperience).includes("Year")
            ? String(member.yearsOfExperience)
            : `${member.yearsOfExperience} years of experience`)
        : "3+ years of experience";

      result.push({
        id: memberId,
        name: member.name,
        roleEn: roleStr,
        roleBn: roleStr,
        experienceEn: expStr,
        experienceBn: member.yearsOfExperience ? `${member.yearsOfExperience} শিক্ষকতার অভিজ্ঞতা` : "অভিজ্ঞ ট্রেইনার",
        tags,
        image: finalImage,
        bioEn: member.bio || "Dedicated educator and mentor at Learn & Grow.",
        bioBn: member.bio || "লার্ন অ্যান্ড গ্রো-এর নিবেদিতপ্রাণ মেন্টর ও শিক্ষক।",
        theme,
      });
    });

    return result;
  }, [teamData, instructorsData]);

  // Ensure enough items for seamless infinite 4-column loop advancing 1-by-1
  const displayTutors = useMemo(() => {
    if (tutorsList.length === 0) return [];
    if (tutorsList.length < 8) {
      return [...tutorsList, ...tutorsList];
    }
    return tutorsList;
  }, [tutorsList]);

  const toggleCard = (id: string) => {
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl 2xl:max-w-[1440px] mx-auto">
        {/* Header - Brand-Aligned Professional Kodland Style */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#EAF4FB] text-[#3B82F6] text-xs font-black rounded-full uppercase tracking-widest border border-[#B3D9F5] mb-5">
            👨‍🏫 {language === "en" ? "Our Expert Tutors" : "আমাদের বিশেষজ্ঞ শিক্ষকবৃন্দ"}
          </span>

          <h2
            className={`text-4xl sm:text-6xl lg:text-7xl font-black text-[#2C2C2C] tracking-tight leading-[1.12] max-w-4xl mx-auto ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {language === "en" ? (
              <>
                Our tutors{" "}
                <span className="bg-[#3B82F6] text-white px-4 py-1 rounded-full inline-block font-black shadow-md shadow-blue-500/20 -rotate-1 mx-1.5">
                  are the core
                </span>{" "}
                of our school
              </>
            ) : (
              <>
                আমাদের শিক্ষকবৃন্দই{" "}
                <span className="bg-[#3B82F6] text-white px-4 py-1 rounded-full inline-block font-black shadow-md shadow-blue-500/20 -rotate-1 mx-1.5">
                  আমাদের স্কুলের মূল ভিত্তি
                </span>
              </>
            )}
          </h2>

          <p
            className={`text-gray-600 text-base sm:text-lg max-w-3xl mx-auto mt-4 font-medium leading-relaxed ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {language === "en"
              ? "Each mentor is handpicked for deep technical mastery and the natural ability to spark curiosity in young learners."
              : "আমাদের প্রতিটি মেন্টরকে গভীর প্রযুক্তিগত দক্ষতা এবং তরুণ শিক্ষার্থীদের মাঝে কৌতূহল ও উদ্ভাবনী চিন্তা জাগিয়ে তোলার স্বাভাবিক ক্ষমতার ভিত্তিতে বেছে নেওয়া হয়েছে।"}
          </p>
        </div>

        {/* Tutors Carousel - 4 Persons Shown at Once on Desktop, Moves 1-by-1 */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            loop={true}
            slidesPerGroup={1}
            speed={600}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: "#educators-prev-btn",
              nextEl: "#educators-next-btn",
            }}
            pagination={{
              el: "#educators-pagination-dots",
              clickable: true,
              bulletActiveClass: "!bg-[#2C2C2C] !w-7 !rounded-full transition-all duration-300",
              bulletClass: "inline-block w-2.5 h-2.5 rounded-full bg-gray-300 mx-1 cursor-pointer transition-all",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.15,
                spaceBetween: 14,
                centeredSlides: true,
                slidesPerGroup: 1,
              },
              640: {
                slidesPerView: 2.15,
                spaceBetween: 16,
                centeredSlides: false,
                slidesPerGroup: 1,
              },
              1024: {
                slidesPerView: 3.2,
                spaceBetween: 18,
                slidesPerGroup: 1,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 20,
                slidesPerGroup: 1,
              },
              1536: {
                slidesPerView: 4,
                spaceBetween: 24,
                slidesPerGroup: 1,
              },
            }}
            className="!pb-4 select-none"
          >
            {displayTutors.map((tutor, idx) => {
              const cardInstanceKey = `${tutor.id}-${idx}`;
              const isFlipped = flippedCardId === cardInstanceKey;

              return (
                <SwiperSlide key={cardInstanceKey} className="h-auto">
                  <div
                    onClick={() => toggleCard(cardInstanceKey)}
                    className={`group relative w-full h-[470px] sm:h-[490px] rounded-[32px] sm:rounded-[36px] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-black/5 bg-gradient-to-b ${tutor.theme.cardBg}`}
                  >
                    {/* FRONT CARD STATE (Tutor Portrait & 3D Elements) */}
                    <div
                      className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ${
                        isFlipped
                          ? "opacity-0 pointer-events-none scale-95"
                          : "opacity-100 scale-100 group-hover:opacity-0 group-hover:pointer-events-none group-hover:scale-95"
                      }`}
                    >
                      {/* Top Content: Name & Brand-Themed Skill Tags */}
                      <div className="pt-6 px-4 text-center relative z-20">
                        <h3
                          className={`text-xl sm:text-[22px] font-black text-[#1E293B] tracking-tight mb-2 line-clamp-1 ${
                            language === "bn" ? "font-siliguri" : ""
                          }`}
                        >
                          {tutor.name}
                        </h3>

                        <div className="flex flex-wrap justify-center gap-1.5">
                          {tutor.tags.map((tag, i) => (
                            <span
                              key={i}
                              className={`text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs ${tutor.theme.tagBg}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3D Celestial / Illustrated Background Behind Tutor (Kodland Exact Style) */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {/* Cratered 3D Celestial Moon/Sphere */}
                        <div
                          className={`absolute top-24 left-1/2 -translate-x-1/2 w-52 h-52 rounded-full bg-gradient-to-br ${tutor.theme.orbColor} ${tutor.theme.orbShadow} backdrop-blur-sm opacity-90`}
                        >
                          {/* Moon crater dots */}
                          <div className="absolute top-7 left-8 w-7 h-7 rounded-full bg-black/10 shadow-inner" />
                          <div className="absolute top-14 right-10 w-10 h-10 rounded-full bg-black/10 shadow-inner" />
                          <div className="absolute bottom-10 left-12 w-6 h-6 rounded-full bg-black/8 shadow-inner" />
                          <div className="absolute bottom-12 right-8 w-5 h-5 rounded-full bg-black/10 shadow-inner" />
                        </div>

                        {/* 3D Tilted Orbital Wing / Ring */}
                        <div
                          className={`absolute top-32 left-1/2 -translate-x-1/2 w-64 h-36 rounded-[100%] border-[4px] ${tutor.theme.ringColor} rotate-12 opacity-80`}
                        />
                      </div>

                      {/* Bottom Content: Clean Transparent PNG Tutor Cutout (Flush to bottom) */}
                      <div className="relative z-10 w-full h-[73%] flex items-end justify-center overflow-hidden">
                        <img
                          src={tutor.image}
                          alt={tutor.name}
                          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 select-none drop-shadow-2xl"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* HOVER / FLIPPED DETAILS STATE */}
                    <div
                      className={`absolute inset-0 p-6 sm:p-7 flex flex-col justify-between text-white transition-all duration-500 bg-gradient-to-b ${
                        tutor.theme.detailsBg
                      } ${
                        isFlipped
                          ? "opacity-100 scale-100 pointer-events-auto"
                          : "opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                      }`}
                    >
                      {/* Diagonal Soft Glass Sheen */}
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/20 via-transparent to-transparent pointer-events-none" />

                      {/* Details Content */}
                      <div className="relative z-10">
                        {/* Name in Large White Font */}
                        <h3
                          className={`text-xl sm:text-2xl font-black text-white text-center tracking-tight mb-1 ${
                            language === "bn" ? "font-siliguri" : ""
                          }`}
                        >
                          {tutor.name}
                        </h3>

                        {/* Experience Subtitle */}
                        <p className="text-xs sm:text-sm font-bold text-white/90 text-center mb-3 sm:mb-4">
                          {language === "en" ? tutor.experienceEn : tutor.experienceBn}
                        </p>

                        {/* Bio Paragraphs */}
                        <p
                          className={`text-xs sm:text-sm leading-relaxed text-white/95 font-medium line-clamp-5 sm:line-clamp-6 text-left ${
                            language === "bn" ? "font-siliguri" : ""
                          }`}
                        >
                          {language === "en" ? tutor.bioEn : tutor.bioBn}
                        </p>
                      </div>

                      {/* Action Button at Bottom of Flipped Card */}
                      <div className="relative z-10 pt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openTrialModal({
                              program: tutor.tags[0] || "Robotics & Coding",
                              source: `home_card_${tutor.name}`,
                            });
                          }}
                          className="w-full bg-[#18181B] hover:bg-black text-white font-black py-3 px-4 rounded-full text-xs sm:text-sm shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer text-center flex items-center justify-center gap-2"
                        >
                          <span>{language === "en" ? "Book Free Trial" : "ফ্রি ট্রায়াল নিন"}</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Navigation Arrows & Pagination Dots for moving one by one */}
        <div className="flex items-center justify-center gap-4 mt-6 mb-2">
          <button
            id="educators-prev-btn"
            aria-label="Previous Tutor"
            className="w-11 h-11 rounded-full bg-white hover:bg-gray-100 text-[#2C2C2C] shadow-md border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots Container */}
          <div id="educators-pagination-dots" className="flex items-center justify-center gap-1 min-h-[16px]" />

          <button
            id="educators-next-btn"
            aria-label="Next Tutor"
            className="w-11 h-11 rounded-full bg-white hover:bg-gray-100 text-[#2C2C2C] shadow-md border border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Bottom CTA Row: Explore All Tutors & Free Trial */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#2C2C2C] hover:bg-black text-white text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>{language === "en" ? "Meet All Our Tutors" : "সকল শিক্ষক দেখুন"}</span>
            <span className="text-lg">→</span>
          </Link>

          <button
            onClick={() => openTrialModal({ source: "home_educators_footer" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F59E0B] hover:bg-[#d97706] text-black text-base font-black shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span>{language === "en" ? "Book a Free 1:1 Class" : "ফ্রি ১:১ ট্রায়াল বুক করুন"}</span>
            <span>✨</span>
          </button>
        </div>
      </div>
    </section>
  );
}
