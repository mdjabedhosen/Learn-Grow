"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
  Skeleton,
} from "@nextui-org/react";
import { useGetApprovedInstructorsPublicQuery } from "@/redux/api/userApi";
import { useGetAllTeamMembersQuery } from "@/redux/api/teamApi";
import { openTrialModal } from "@/components/TrialBookingModal";
import { openRecruitmentModal } from "@/components/RecruitmentModal";
import RecruitmentProcess from "@/components/RecruitmentProcess";
import { GraduationCap, Sparkles, Rocket, Globe, Clock, Star, Award, ArrowRight } from "lucide-react";
import { resolveImageSrc } from "@/utils/image";

type InstructorItem = {
  id: string;
  name: string;
  role: string;
  category: "all" | "robotics" | "coding" | "gamedev" | "ai";
  categoryLabelEn: string;
  categoryLabelBn: string;
  tags: string[];
  image: string;
  themeIndex: number;
  bio: string;
  experience: string;
  rating: string;
  qualification?: string;
  institution?: string;
};

// 3D Illustrated Themes for Kodland-style tutor cards strictly following Learn & Grow brand palette
const TUTOR_THEMES = [
  {
    bg: "from-[#DBEAFE] via-[#BFDBFE] to-[#93C5FD]",
    orb: "from-[#2563EB] via-[#3B82F6] to-[#60A5FA]",
    orbShadow: "shadow-[0_25px_50px_rgba(37,99,235,0.35)]",
    ring: "border-[#60A5FA]/60",
    ringAngle: "rotate-12",
    orbPosition: "bottom-2 right-4 w-48 h-48",
    tagStyle: "bg-[#EAF4FB] text-[#1D4ED8] border-[#B3D9F5]",
  },
  {
    bg: "from-[#F5F0FF] via-[#EDE9FE] to-[#DDD6FE]",
    orb: "from-[#6D28D9] via-[#7C3AED] to-[#A78BFA]",
    orbShadow: "shadow-[0_25px_50px_rgba(109,40,217,0.35)]",
    ring: "border-[#A78BFA]/60",
    ringAngle: "-rotate-12",
    orbPosition: "bottom-4 left-4 w-48 h-48",
    tagStyle: "bg-[#F5F0FF] text-[#5B21B6] border-[#D4C0F9]",
  },
  {
    bg: "from-[#FFFBEA] via-[#FEF3C7] to-[#FDE68A]",
    orb: "from-[#D97706] via-[#F59E0B] to-[#FCD34D]",
    orbShadow: "shadow-[0_25px_50px_rgba(217,119,6,0.35)]",
    ring: "border-[#FCD34D]/60",
    ringAngle: "rotate-45",
    orbPosition: "bottom-2 right-6 w-48 h-48",
    tagStyle: "bg-[#FFF8E1] text-[#92400E] border-[#FFE082]",
  },
  {
    bg: "from-[#ECFEFF] via-[#CFFAFE] to-[#A5F3FC]",
    orb: "from-[#0284C7] via-[#06B6D4] to-[#67E8F9]",
    orbShadow: "shadow-[0_25px_50px_rgba(2,132,199,0.35)]",
    ring: "border-[#67E8F9]/60",
    ringAngle: "-rotate-45",
    orbPosition: "bottom-4 left-6 w-48 h-48",
    tagStyle: "bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC]",
  },
  {
    bg: "from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE]",
    orb: "from-[#4338CA] via-[#6366F1] to-[#818CF8]",
    orbShadow: "shadow-[0_25px_50px_rgba(67,56,202,0.35)]",
    ring: "border-[#818CF8]/60",
    ringAngle: "rotate-6",
    orbPosition: "bottom-2 right-4 w-48 h-48",
    tagStyle: "bg-[#EEF2FF] text-[#4338CA] border-[#C7D2FE]",
  },
];

function categorizeInstructor(inst: any): "robotics" | "coding" | "gamedev" | "ai" {
  const combined = `${inst.name || ""} ${Array.isArray(inst.expertise) ? inst.expertise.join(" ") : inst.expertise || ""} ${inst.qualification || ""} ${inst.bio || ""}`.toLowerCase();

  if (
    combined.includes("রোবট") ||
    combined.includes("robot") ||
    combined.includes("arduino") ||
    combined.includes("আর্ডুইনো") ||
    combined.includes("iot") ||
    combined.includes("mechatronics") ||
    combined.includes("circuit")
  ) {
    return "robotics";
  }
  if (
    combined.includes("গেম") ||
    combined.includes("game") ||
    combined.includes("scratch") ||
    combined.includes("roblox")
  ) {
    return "gamedev";
  }
  if (
    combined.includes("পাইথন") ||
    combined.includes("python") ||
    combined.includes("ai") ||
    combined.includes("এআই") ||
    combined.includes("data science") ||
    combined.includes("vision") ||
    combined.includes("machine learning")
  ) {
    return "ai";
  }
  if (
    combined.includes("কোডার") ||
    combined.includes("coder") ||
    combined.includes("competitive") ||
    combined.includes("algorithm") ||
    combined.includes("full stack") ||
    combined.includes("web")
  ) {
    return "coding";
  }
  return "robotics";
}

export default function TutorsPage() {
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedTutor, setSelectedTutor] = useState<InstructorItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch approved instructors from users AND authentic instructors from team collection
  const { data: instructorsResponse, isLoading: isInstructorsLoading, isError: isInstructorsError } = useGetApprovedInstructorsPublicQuery();
  const { data: teamResponse, isLoading: isTeamLoading, isError: isTeamError } = useGetAllTeamMembersQuery({});

  const isLoading = isInstructorsLoading && isTeamLoading;
  const isError = isInstructorsError && isTeamError;

  // Sync language with navbar & localStorage
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

  const categories = [
    { key: "all", labelEn: "All", labelBn: "সকল" },
    { key: "robotics", labelEn: "Robotics & Arduino", labelBn: "রোবটিক্স ও আর্দুইনো" },
    { key: "coding", labelEn: "Master Coder", labelBn: "মাস্টার কোডার" },
    { key: "gamedev", labelEn: "Game Development", labelBn: "গেম ডেভেলপমেন্ট" },
    { key: "ai", labelEn: "Python & AI", labelBn: "পাইথন ও এআই" },
  ];

  // Authentic Learn & Grow Real Tutors Specification
  const AUTHENTIC_TUTORS_SPEC = useMemo(
    () => [
      {
        key: "jabed",
        matchKeys: ["jabed", "md jabed", "m.riyad3834@gmail.com"],
        name: "Md Jabed Hosen",
        roleEn: "Founder & Lead AI Mentor",
        roleBn: "প্রতিষ্ঠাতা ও লিড এআই মেন্টর",
        qualification: "Lead AI & Python Instructor | Founder & CEO",
        institution: "M.Sc. in Data Science, University of Milano-Bicocca, Italy | Founder, Learn & Grow",
        image: "/images/tutors/tutor-jabed.png",
        category: "ai" as const,
        categoryLabelEn: "Python & AI",
        categoryLabelBn: "পাইথন ও এআই",
        tags: ["Python", "Artificial Intelligence", "Data Science"],
        bio: "ইতালির ইউনিভার্সিটি অফ মিলানো-বিকোকার ডেটা সায়েন্স গবেষক ও উদ্যোক্তা। শিশু-কিশোরদের পাইথন কোডিং, মেশিন লার্নিং ও এআই প্রযুক্তির রোমাঞ্চকর জগতে দক্ষ করে তুলতে নিবেদিত।",
        experience: "3+ Years Exp",
        rating: "5.0",
        themeIndex: 1,
      },
      {
        key: "tanvir",
        matchKeys: ["tanvir", "tanvirhassan1201@gmail.com"],
        name: "Md. Tanvir Hassan",
        roleEn: "Senior Robotics Lead",
        roleBn: "সিনিয়র রোবটিক্স ট্রেইনার",
        qualification: "Senior Robotics & Hardware Engineer",
        institution: "R&D at Cybernetics Hi-Tech Solutions | Robotics Teacher at Learn & Grow",
        image: "/images/tutors/tutor-tanvir.png",
        category: "robotics" as const,
        categoryLabelEn: "Robotics & Arduino",
        categoryLabelBn: "রোবটিক্স ও আর্দুইনো",
        tags: ["Robotics & Arduino", "STEM Education", "Hardware"],
        bio: "উদ্ভাবনী হার্ডওয়্যার ইঞ্জিনিয়ার ও রোবটিক্স ট্রেইনার। শিশু ও তরুণদের প্রজেক্ট-ভিত্তিক আর্দুইনো, সেন্সর ও সার্কিট ডিজাইনে বাস্তব দক্ষতা গড়ে তোলেন।",
        experience: "6+ Years Exp",
        rating: "4.9",
        themeIndex: 0,
      },
      {
        key: "tonni",
        matchKeys: ["tonni", "tasnim", "tasnimtonni024@gmail.com"],
        name: "Tasnim Jahan Tonni",
        roleEn: "Lead Coding & AI Mentor",
        roleBn: "লিড কোডিং ও এআই মেন্টর",
        qualification: "Lead Coding & AI Mentor",
        institution: "Lecturer, Daffodil International University | Researcher at Quantonova Ltd",
        image: "/images/tutors/tutor-tonni.png",
        category: "ai" as const,
        categoryLabelEn: "Python & AI",
        categoryLabelBn: "পাইথন ও এআই",
        tags: ["Python", "AI & Machine Learning", "Coding"],
        bio: "কম্পিউটার সায়েন্স গবেষক ও অভিজ্ঞ বিশ্ববিদ্যালয় শিক্ষক। শিশুদের পাইথন কোডিং, মেশিন লার্নিং ও এআই অ্যালগরিদম সহজ ভাষায় বাস্তব প্রজেক্টের মাধ্যমে শেখান।",
        experience: "5+ Years Exp",
        rating: "4.9",
        themeIndex: 1,
      },
      {
        key: "saiful",
        matchKeys: ["saiful", "saifulislam@learngrow.academy"],
        name: "Saiful Islam",
        roleEn: "Master Coder & Algorithms Lead",
        roleBn: "মাস্টার কোডার ও অ্যালগরিদম ট্রেইনার",
        qualification: "Master Coder & Algorithms Lead",
        institution: "MS, Data Science at Sapienza Università di Roma, Italy",
        image: "/images/tutors/tutor-saiful.png",
        category: "coding" as const,
        categoryLabelEn: "Master Coder",
        categoryLabelBn: "মাস্টার কোডার",
        tags: ["Data Science", "Python", "Algorithms"],
        bio: "ইতালির স্যাপিয়েনজা ইউনিভার্সিটির ডেটা সায়েন্স গবেষক। শিশুদের ক্রিটিক্যাল থিংকিং, অ্যালগরিদম ও ক্রিয়েটিভ প্রবলেম সলভিংয়ে বিশ্বমানের দক্ষতা তৈরিতে নিবেদিত।",
        experience: "7+ Years Exp",
        rating: "4.9",
        themeIndex: 2,
      },
      {
        key: "shakil",
        matchKeys: ["shakil", "shakilrana@learngrow.academy"],
        name: "Shakil Rana",
        roleEn: "Junior Game Creator & STEM Lead",
        roleBn: "জুনিয়র গেম ক্রিয়েটর ও স্টেম লিড",
        qualification: "Junior Game Creator & STEM Lead",
        institution: "M.Sc. in AI and Intelligent Systems, University of Bremen, Germany",
        image: "/images/tutors/tutor-shakil.png",
        category: "gamedev" as const,
        categoryLabelEn: "Game Development",
        categoryLabelBn: "গেম ডেভেলপমেন্ট",
        tags: ["Scratch", "Roblox", "Game Development"],
        bio: "জার্মানির ব্রেমেন ইউনিভার্সিটির এআই গবেষক। শিশু-কিশোরদের স্ক্র্যাচ, রবলক্স গেম ডেভেলপমেন্ট ও সৃজনশীল কোডিং শেখাতে নিবেদিত।",
        experience: "5+ Years Exp",
        rating: "4.9",
        themeIndex: 3,
      },
      {
        key: "sovon",
        matchKeys: ["sovon", "shovan", "shovanparvez@learngrow.academy"],
        name: "Shovan Parvez",
        roleEn: "Hands-on Robotics & IoT Specialist",
        roleBn: "হ্যান্ডস-অন রোবটিক্স ও আইওটি ট্রেইনার",
        qualification: "Hands-on Robotics & IoT Specialist",
        institution: "Rehabilitation Engineer, Centre for the Rehabilitation of the Paralysed (CRP)",
        image: "/images/tutors/tutor-sovon.png",
        category: "robotics" as const,
        categoryLabelEn: "Robotics & Arduino",
        categoryLabelBn: "রোবটিক্স ও আর্দুইনো",
        tags: ["IoT", "Microcontrollers", "Circuits"],
        bio: "সিআরপি-র রিহ্যাবিলিটেশন ইঞ্জিনিয়ার ও আইওটি বিশেষজ্ঞ। শিশুদের হাতে-কলমে সার্কিট মেকিং, সেন্সর প্রোগ্রামিং এবং বাস্তব হার্ডওয়্যার রোবট প্রজেক্ট তৈরি শেখান।",
        experience: "5+ Years Exp",
        rating: "4.9",
        themeIndex: 4,
      },
    ],
    []
  );

  // Map real backend database instructors into display items
  const tutors: InstructorItem[] = useMemo(() => {
    const userInstructors = Array.isArray(instructorsResponse?.data) ? instructorsResponse.data : [];
    const teamMembers = Array.isArray(teamResponse?.data) ? teamResponse.data : [];

    // Filter team members who are instructors/teachers/educators/trainers/mentors or leaders
    const pool: any[] = [];
    teamMembers
      .filter((m: any) => /\b(instructor|teacher|educator|trainer|mentor|faculty|founder|ceo)\b/i.test(m.role || "") || (m.domain && m.domain.trim().length > 0))
      .forEach((m: any) => pool.push(m));

    userInstructors.forEach((m: any) => {
      if (!pool.some((x) => (x.name || "").toLowerCase() === (m.name || "").toLowerCase())) {
        pool.push(m);
      }
    });

    // Map strictly the 5 authentic Learn & Grow educators
    const mappedTutors: InstructorItem[] = AUTHENTIC_TUTORS_SPEC.map((spec) => {
      // Find matching database records in users and team collections
      const userRecord = userInstructors.find((u: any) => {
        const nameAndEmail = `${u.name || ""} ${u.email || ""}`.toLowerCase();
        return spec.matchKeys.some((k) => nameAndEmail.includes(k));
      });
      const teamRecord = teamMembers.find((t: any) => {
        const nameAndEmail = `${t.name || ""} ${t.email || ""}`.toLowerCase();
        return spec.matchKeys.some((k) => nameAndEmail.includes(k));
      });
      const matchedDb = teamRecord || userRecord;

      if (matchedDb || userRecord || teamRecord) {
        const dbExpertise = teamRecord?.expertise?.length ? teamRecord.expertise : userRecord?.expertise;
        let tags = spec.tags;
        if (Array.isArray(dbExpertise) && dbExpertise.length > 0) {
          tags = dbExpertise.slice(0, 3);
        } else if (typeof dbExpertise === "string" && dbExpertise.trim()) {
          tags = dbExpertise.split(",").map((s: string) => s.trim()).slice(0, 3);
        }

        const rawExp = teamRecord?.yearsOfExperience || userRecord?.yearsOfExperience;
        const exp = rawExp
          ? (String(rawExp).toLowerCase().includes("exp") || String(rawExp).toLowerCase().includes("year")
              ? String(rawExp)
              : `${rawExp}+ Years Exp`)
          : spec.experience;

        const dynamicImg = teamRecord?.image || userRecord?.profileImage;

        return {
          id: String(userRecord?._id || teamRecord?._id || spec.key),
          name: teamRecord?.name || userRecord?.name || spec.name,
          role: userRecord?.qualification || teamRecord?.role || spec.qualification,
          category: spec.category,
          categoryLabelEn: spec.categoryLabelEn,
          categoryLabelBn: spec.categoryLabelBn,
          tags,
          image: resolveImageSrc(dynamicImg) || spec.image,
          themeIndex: spec.themeIndex,
          bio: teamRecord?.bio || userRecord?.bio || spec.bio,
          experience: exp,
          rating: spec.rating,
          qualification: userRecord?.qualification || teamRecord?.role || spec.qualification,
          institution: userRecord?.institution || spec.institution,
        };
      }

      return {
        id: spec.key,
        name: spec.name,
        role: spec.qualification,
        category: spec.category,
        categoryLabelEn: spec.categoryLabelEn,
        categoryLabelBn: spec.categoryLabelBn,
        tags: spec.tags,
        image: spec.image,
        themeIndex: spec.themeIndex,
        bio: spec.bio,
        experience: spec.experience,
        rating: spec.rating,
        qualification: spec.qualification,
        institution: spec.institution,
      };
    });

    return mappedTutors;
  }, [instructorsResponse, teamResponse, AUTHENTIC_TUTORS_SPEC]);

  // Filter tutors based on active tab
  const filteredTutors = useMemo(() => {
    if (activeCategory === "all") return tutors;
    return tutors.filter((t) => t.category === activeCategory);
  }, [activeCategory, tutors]);

  const handleCardClick = (tutor: InstructorItem) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 animate-fadeIn">
          <div className="inline-block mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EAF4FB] text-[#3B82F6] text-xs font-black rounded-full uppercase tracking-widest border border-[#B3D9F5]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{language === "en" ? "Live Mentors" : "আমাদের শিক্ষকবৃন্দ"}</span>
            </span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-black text-[#2C2C2C] tracking-tight leading-[1.05] mb-4 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {language === "en" ? (
              <>
                Meet our expert{" "}
                <span className="bg-[#3B82F6] text-white px-4 py-0.5 rounded-full inline-block font-black shadow-md shadow-blue-500/20 -rotate-1">
                  mentors
                </span>
              </>
            ) : (
              <>
                আমাদের বিশেষজ্ঞ{" "}
                <span className="bg-[#3B82F6] text-white px-4 py-0.5 rounded-full inline-block font-black shadow-md shadow-blue-500/20 -rotate-1">
                  মেন্টরদের
                </span>{" "}
                সাথে পরিচিত হোন
              </>
            )}
          </h1>

          <p
            className={`text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {language === "en"
              ? "Handpicked from premier engineering universities and tech industries to spark curiosity, hands-on maker confidence, and future-ready coding skills in every young innovator."
              : "প্রকৌশল ও প্রযুক্তিবিদ্যায় অভিজ্ঞ আমাদের প্রতিটি মেন্টর শিশুদের মাঝে রোবটিক্স উদ্ভাবন, প্রোগ্রামিং এবং হাতে-কলমে সার্কিট মেকিংয়ের আনন্দ ও আত্মবিশ্বাস ছড়িয়ে দিতে নিবেদিত।"}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2.5 mb-14 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-black transition-all duration-200 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.key
                  ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20 scale-105"
                  : "bg-gray-100 text-[#2C2C2C] hover:bg-gray-200"
              }`}
            >
              {language === "en" ? cat.labelEn : cat.labelBn}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-20">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="w-full aspect-[4/5] rounded-[32px]" />
                <Skeleton className="h-6 w-3/4 mx-auto rounded-lg" />
                <Skeleton className="h-4 w-1/2 mx-auto rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Error state: only show when there is an error AND no fallback tutors available */}
        {!isLoading && isError && filteredTutors.length === 0 && (
          <div className="text-center py-16 bg-red-50 rounded-3xl mb-20 p-8 border border-red-100">
            <p className="text-red-600 font-bold text-lg mb-2">
              শিক্ষকবৃন্দের তথ্য লোড করতে সমস্যা হয়েছে।
            </p>
            <p className="text-gray-500 text-sm">
              অনুগ্রহ করে পুনরায় চেষ্টা করুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>
        )}

        {/* Empty Category State */}
        {!isLoading && filteredTutors.length === 0 && !isError && (
          <div className="text-center py-16 bg-gray-50 rounded-3xl mb-20 p-8 border border-gray-100">
            <p className="text-gray-600 font-bold text-lg mb-4">
              এই ক্যাটাগরিতে শীঘ্রই আরও শিক্ষক যুক্ত হবেন।
            </p>
            <Button
              className="bg-[#3B82F6] text-white font-bold rounded-full px-6"
              onClick={() => setActiveCategory("all")}
            >
              সকল শিক্ষক দেখুন
            </Button>
          </div>
        )}

        {/* Tutors Grid (Real Live Data from MongoDB Dashboard + Authentic Educators) */}
        {!isLoading && filteredTutors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 mb-20">
            {filteredTutors.map((tutor) => {
              const theme = TUTOR_THEMES[tutor.themeIndex % TUTOR_THEMES.length];
              return (
                <div
                  key={tutor.id}
                  onClick={() => handleCardClick(tutor)}
                  className="group cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Portrait Container with 3D Illustrated Backdrop */}
                  <div className="relative w-full aspect-[4/5] rounded-[32px] overflow-hidden flex flex-col justify-end shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-black/5">
                    {/* Ambient pastel background */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${theme.bg}`} />

                    {/* 3D Glowing Orb / Sphere */}
                    <div
                      className={`absolute rounded-full bg-gradient-to-tr ${theme.orb} ${theme.orbShadow} ${theme.orbPosition} filter blur-[0.5px] transform transition-transform duration-700 group-hover:scale-110 pointer-events-none`}
                    >
                      {/* Specular 3D light reflection */}
                      <div className="absolute top-4 left-6 w-12 h-12 rounded-full bg-white/40 blur-[3px]" />
                    </div>

                    {/* 3D Orbital Ellipse / Ring */}
                    <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-36 rounded-[100%] border-[4px] ${theme.ring} ${theme.ringAngle} pointer-events-none opacity-80 group-hover:scale-105 transition-transform duration-700`}
                    />

                    {/* Floating sparkles */}
                    <div className="absolute top-10 right-6 text-white/60 pointer-events-none">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black text-[#2C2C2C] shadow-md flex items-center gap-1">
                      {tutor.rating}
                    </div>

                    {/* Experience Badge */}
                    <div className="absolute top-4 right-4 z-20 bg-[#2C2C2C] text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
                      {tutor.experience}
                    </div>

                    {/* Tutor Cutout / Portrait Image (Flush with bottom border) */}
                    <div className="relative z-10 w-full h-full flex items-end justify-center overflow-hidden">
                      <img
                        src={resolveImageSrc(tutor.image)}
                        alt={tutor.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 select-none drop-shadow-xl"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Tutor Info Below Card (Kodland Signature Layout) */}
                  <div className="pt-4 text-center">
                    <h3
                      className={`text-xl font-black text-[#2C2C2C] tracking-tight group-hover:text-[#3B82F6] transition-colors ${
                        language === "bn" ? "font-siliguri" : ""
                      }`}
                    >
                      {tutor.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5 mb-2.5">
                      {language === "en" ? tutor.categoryLabelEn : tutor.categoryLabelBn}
                    </p>

                    {/* Brand Pastel Pill Tags */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {tutor.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`text-[11px] font-black px-3 py-0.5 rounded-full border shadow-xs ${theme.tagStyle}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Global Tutor Recruitment Blue Banner (Kodland Exact Style Replica) */}
        <div className="my-16 relative bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-[38px] sm:rounded-[52px] p-8 sm:p-14 lg:p-16 text-white overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.28)] border border-blue-400/20">
          {/* Elegant ambient light sweeps & soft wave */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-64 bg-cyan-400/20 blur-3xl rounded-full transform -rotate-12" />
            {/* Ambient luminous arc curves */}
            <div className="absolute -bottom-24 right-0 w-[600px] h-[350px] border-[1px] border-white/20 rounded-[100%] opacity-40 pointer-events-none" />
            <div className="absolute -bottom-16 right-16 w-[450px] h-[250px] border-[1px] border-white/15 rounded-[100%] opacity-30 pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider mb-5 border border-white/30">
                <Rocket className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === "en" ? "We Are Hiring Tutors" : "আমরা শিক্ষক খুঁজছি"}</span>
              </span>

              <h2
                className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5 text-white ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {language === "en" ? (
                  <>
                    Join our{" "}
                    <span className="bg-[#D0FA61] text-[#14532D] px-4 py-0.5 rounded-full inline-block font-black shadow-sm -rotate-1 mx-1">
                      global
                    </span>{" "}
                    team of tutors
                  </>
                ) : (
                  <>
                    আমাদের{" "}
                    <span className="bg-[#D0FA61] text-[#14532D] px-4 py-0.5 rounded-full inline-block font-black shadow-sm -rotate-1 mx-1">
                      গ্লোবাল
                    </span>{" "}
                    শিক্ষক দলে যোগ দিন
                  </>
                )}
              </h2>

              <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-9 max-w-xl font-medium">
                {language === "en"
                  ? "Share your expertise with the next generation of coders, game creators, and robotics innovators. Flexible hours, competitive pay, and an inspiring international community."
                  : "পরবর্তী প্রজন্মের ক্ষুদে কোডার, গেম ক্রিয়েটর ও রোবটিক্স উদ্ভাবকদের গড়ে তুলুন। সুবিধাজনক সময়সূচি, সম্মানজনক পারিশ্রমিক এবং আন্তর্জাতিক শিক্ষক পরিবার।"}
              </p>

              <Link
                href="/careers#recruitment-process"
                className="bg-[#18181B] hover:bg-black text-white font-black px-9 py-4 sm:py-4.5 rounded-full text-base sm:text-lg shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-3 group"
              >
                <span>{language === "en" ? "Apply now" : "এখনই আবেদন করুন"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Column: Kodland Signature Glowing 3D Speech Bubbles */}
            <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center gap-6 pt-4 lg:pt-0">
              {/* Bubble 1: Pink / Rose Glowing Speech Bubble */}
              <div className="relative bg-gradient-to-r from-[#FF5E8E] to-[#FF7B90] text-white font-black text-sm sm:text-base px-7 py-4.5 rounded-[28px] shadow-[0_16px_36px_rgba(255,94,142,0.45)] max-w-xs transition-transform duration-300 hover:scale-105 animate-bounce duration-1000">
                <p className="leading-snug">
                  {language === "en" ? "Looking for a flexible remote position?" : "সুবিধাজনক রিমোট টিচিং পজিশন খুঁজছেন?"}
                </p>
                {/* Speech bubble pointer tail */}
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#FF7B90] transform rotate-45 rounded-xs" />
              </div>

              {/* Bubble 2: Coral / Orange Glowing Speech Bubble */}
              <div className="relative bg-gradient-to-r from-[#FF7B40] to-[#FF9345] text-white font-black text-sm sm:text-base px-7 py-4.5 rounded-[28px] shadow-[0_16px_36px_rgba(255,123,64,0.45)] max-w-xs transition-transform duration-300 hover:scale-105 lg:mr-8">
                <p className="leading-snug">
                  {language === "en" ? "Want to teach coding or digital arts?" : "কোডিং, রোবটিক্স বা এআই শেখাতে চান?"}
                </p>
                {/* Speech bubble pointer tail */}
                <div className="absolute -bottom-2 left-8 w-4 h-4 bg-[#FF9345] transform rotate-45 rounded-xs" />
              </div>

              {/* Mobile Info Badges */}
              <div className="flex flex-wrap gap-2 lg:hidden mt-2">
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "Flexible hours" : "সুবিধাজনক সময়"}</span>
                </span>
                <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>{language === "en" ? "100% Remote" : "১০০% রিমোট"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner: Free Trial with Tutor (Polished Premium Container) */}
        <div className="mt-20 mb-12 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-[38px] sm:rounded-[48px] p-8 sm:p-14 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="relative z-10 max-w-2xl text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F59E0B] text-black text-xs font-black uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === "en" ? "1-On-1 Interactive Trial" : "১:১ সরাসরি ট্রায়াল ক্লাস"}</span>
            </span>

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] mb-4 text-white ${
                language === "bn" ? "font-siliguri" : ""
              }`}
            >
              {language === "en" ? "Learn directly from our top tutors" : "আমাদের সেরা মেন্টরদের সাথে সরাসরি ক্লাস করুন"}
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
              {language === "en"
                ? "Book a free 60-minute trial class and see how our instructors inspire your child to build amazing robotics and coding projects."
                : "আপনার সন্তানের জন্য ৬০ মিনিটের ফ্রি ডেমো ক্লাস বুক করুন এবং দেখুন কীভাবে আমাদের শিক্ষকরা তাকে কোডিং ও রোবটিক্সের জাদুকরী দুনিয়ায় নিয়ে যান।"}
            </p>

            {/* Social Proof Row with Tutor Cutout Avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-3 overflow-hidden">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-800 object-cover bg-blue-100"
                  src="/images/tutors/tutor-tanvir.png"
                  alt="Tanvir"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-800 object-cover bg-purple-100"
                  src="/images/tutors/tutor-tonni.png"
                  alt="Tonni"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-800 object-cover bg-amber-100"
                  src="/images/tutors/tutor-saiful.png"
                  alt="Saiful"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-800 object-cover bg-cyan-100"
                  src="/images/tutors/tutor-shakil.png"
                  alt="Shakil"
                />
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-300 flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </span>
                <span>{language === "en" ? "4.9/5 from 1,200+ parents" : "৪.৯/৫ রেটিং (১২০০+ অভিভাবক)"}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={() => openTrialModal({ source: "tutors_page_banner" })}
              className="inline-flex items-center justify-center gap-3 bg-[#F59E0B] hover:bg-[#d97706] text-black font-black px-10 py-5 rounded-full text-base sm:text-lg shadow-[0_12px_32px_rgba(245,158,11,0.35)] transition-all hover:scale-105 w-full lg:w-auto text-center cursor-pointer group"
            >
              <span>{language === "en" ? "Book a Free Trial" : "ফ্রি ট্রায়াল বুক করুন"}</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* Decorative ambient background glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Tutor Detail Modal */}
      {selectedTutor && (
        <Modal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          size="lg"
          backdrop="blur"
          classNames={{
            base: "rounded-[32px] p-2",
            header: "border-b border-gray-100 pb-3",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary-500 flex-shrink-0 bg-gray-100">
                    <img
                      src={selectedTutor.image}
                      alt={selectedTutor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#2C2C2C]">
                      {selectedTutor.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-500">
                      {selectedTutor.role} • {selectedTutor.experience}
                    </p>
                  </div>
                </ModalHeader>

                <ModalBody className="py-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                        {language === "en" ? "About Instructor" : "শিক্ষক পরিচিতি"}
                      </p>
                      <p className="text-sm leading-relaxed text-gray-700 font-medium">
                        {selectedTutor.bio}
                      </p>
                    </div>

                    {(selectedTutor.qualification || selectedTutor.institution) && (
                      <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                        <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1">
                          {language === "en" ? "Academic Background" : "শিক্ষাগত যোগ্যতা ও প্রতিষ্ঠান"}
                        </p>
                        <p className="text-sm font-bold text-[#2C2C2C]">
                          {selectedTutor.qualification}{selectedTutor.institution ? ` • ${selectedTutor.institution}` : ""}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                        {language === "en" ? "Core Expertise" : "দক্ষতার ক্ষেত্রসমূহ"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTutor.tags.map((tag, i) => (
                          <Chip
                            key={i}
                            className="bg-[#EAF4FB] text-[#1B5C8A] font-bold text-xs"
                            size="sm"
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FFFBEA] border border-[#FDEFC0] p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-[#92620A] uppercase">
                          {language === "en" ? "Student Satisfaction" : "শিক্ষার্থী সন্তুষ্টি"}
                        </p>
                        <p className="text-xl font-black text-[#2C2C2C]">
                          {selectedTutor.rating} (Top Rated)
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[#FFE082]/60 flex items-center justify-center text-[#92620A]">
                        <Award className="w-6 h-6 text-[#92620A]" />
                      </div>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter className="flex justify-between items-center gap-3 border-t border-gray-100 pt-4">
                  <Button
                    variant="bordered"
                    onPress={onClose}
                    className="font-bold rounded-full border-gray-200"
                  >
                    {language === "en" ? "Close" : "বন্ধ করুন"}
                  </Button>
                  <Button
                    className="bg-[#2C2C2C] hover:bg-black text-white font-black rounded-full px-6 shadow-md cursor-pointer"
                    onPress={() => {
                      const tutorTrack = selectedTutor?.categoryLabelEn || "Robotics & Arduino";
                      onClose();
                      openTrialModal({
                        program: tutorTrack,
                        source: `tutor_${selectedTutor?.name || "mentor"}`,
                      });
                    }}
                  >
                    {language === "en" ? "Book Trial with Mentor →" : "মেন্টরের সাথে ট্রায়াল নিন →"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
