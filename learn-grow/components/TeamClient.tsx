"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { HiOutlineUser, HiOutlineSparkles } from "react-icons/hi2";
import { openTrialModal } from "@/components/TrialBookingModal";
import { Sparkles, GraduationCap, Briefcase, Target, Rocket, Bot, Clock } from "lucide-react";
import { resolveImageSrc } from "@/utils/image";

interface TeamClientProps {
    content: any;
}

interface TeamMember {
    _id: string;
    image?: string;
    name: string;
    role: string;
    domain?: string;
    yearsOfExperience?: string | number;
    expertise?: string[] | string;
    bio?: string;
    linkedIn?: string;
    linkedin?: string;
    twitter?: string;
    position?: number;
}

const TEAM_THEMES = [
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

export default function TeamClient({ content }: TeamClientProps) {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    // Handle loading state
    if (!content) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#3B82F6] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    const { hero = {}, leadership = {}, instructors = [], executives = [] } = content;
    const { cLevel = [], teamLeads = [] } = leadership;

    const handleMemberClick = (member: TeamMember) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const MemberCard = ({ member, themeIndex = 0 }: { member: TeamMember; themeIndex?: number }) => {
        const [imageError, setImageError] = useState(false);
        const imageSrc = resolveImageSrc(member.image);
        const theme = TEAM_THEMES[themeIndex % TEAM_THEMES.length];

        const getInitials = (name: string) => {
            return (
                name
                    .split(" ")
                    .filter(Boolean)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "LG"
            );
        };

        const socialLinkedIn = member.linkedIn || member.linkedin;
        const hasLinkedIn = Boolean(socialLinkedIn && socialLinkedIn !== "#" && socialLinkedIn.trim() !== "");
        const hasTwitter = Boolean(member.twitter && member.twitter !== "#" && member.twitter.trim() !== "");
        const isInstructor = /\b(instructor|teacher|educator|trainer|mentor|faculty)\b/i.test(member.role || "");

        // Format tags / expertise list
        const memberTags: string[] = Array.isArray(member.expertise)
            ? member.expertise
            : typeof member.expertise === "string" && member.expertise.trim()
            ? member.expertise.split(",").map((s) => s.trim()).filter(Boolean)
            : [];

        // Format experience display
        const expLabel = member.yearsOfExperience
            ? String(member.yearsOfExperience).toLowerCase().includes("year")
                ? String(member.yearsOfExperience)
                : `${member.yearsOfExperience}+ Years Exp`
            : "";

        return (
            <div
                onClick={() => handleMemberClick(member)}
                className="group cursor-pointer flex flex-col transition-all duration-300 hover:-translate-y-2"
            >
                {/* Portrait Container with 3D Illustrated Backdrop (Tutor Style) */}
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
                    <div className="absolute top-10 right-6 text-white/80 select-none pointer-events-none">
                        <Sparkles className="w-4 h-4 text-white/70" />
                    </div>
                    <div className="absolute bottom-12 left-5 text-white/60 select-none pointer-events-none">
                        <Sparkles className="w-3 h-3 text-white/50" />
                    </div>

                    {/* Top-Left: Role Badge */}
                    {member.role && (
                        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-[#2C2C2C] shadow-md flex items-center gap-1.5 border border-white/60">
                            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                            <span className="tracking-wide uppercase text-[11px] font-black">{member.role}</span>
                        </div>
                    )}

                    {/* Top-Right: Experience Badge (Tutor Style) or Social Icon */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {expLabel ? (
                            <div className="bg-[#2C2C2C] text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
                                {expLabel}
                            </div>
                        ) : hasLinkedIn ? (
                            <a
                                href={socialLinkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-[#2C2C2C] hover:bg-[#0077b5] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin className="text-xs" />
                            </a>
                        ) : hasTwitter ? (
                            <a
                                href={member.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full bg-[#2C2C2C] hover:bg-[#1DA1F2] text-white flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <FaTwitter className="text-xs" />
                            </a>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#2C2C2C] flex items-center justify-center shadow-md text-xs font-black">
                                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                            </div>
                        )}
                    </div>

                    {/* Member Cutout / Portrait Image (Flush with bottom border, no border space) */}
                    <div className="relative z-10 w-full h-full flex items-end justify-center overflow-hidden">
                        {imageSrc && !imageError ? (
                            <img
                                src={imageSrc}
                                alt={member.name}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 select-none drop-shadow-xl"
                                loading="lazy"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 select-none">
                                <div className="w-28 h-28 rounded-full bg-white/40 backdrop-blur-md border-2 border-white/80 shadow-inner flex items-center justify-center text-white font-black text-3xl mb-3">
                                    {getInitials(member.name || "LG")}
                                </div>
                                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">{member.role || "Team Member"}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Member Info Below Card (Kodland Signature Layout) */}
                <div className="pt-4 text-center">
                    <h3
                        className={`text-xl font-black text-[#2C2C2C] tracking-tight group-hover:text-[#3B82F6] transition-colors ${
                            language === "bn" ? "font-siliguri" : ""
                        }`}
                    >
                        {member.name}
                    </h3>

                    {/* Domain / Specialization or Role */}
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5 mb-2">
                        {member.domain || member.role}
                    </p>

                    {/* Expertise Tags (e.g. IoT, Microcontrollers, Circuits) */}
                    {memberTags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mb-2.5">
                            {memberTags.map((tag, i) => (
                                <span
                                    key={i}
                                    className={`text-[11px] font-black px-3 py-0.5 rounded-full border shadow-xs ${theme.tagStyle}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {member.bio ? (
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 max-w-xs mx-auto mb-3">
                            {member.bio}
                        </p>
                    ) : null}

                    {/* Brand Pastel Pill Action */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {isInstructor ? (
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = "/tutors";
                                }}
                                className="inline-flex items-center gap-1.5 text-[11px] font-black px-3.5 py-1 rounded-full bg-[#EAF4FB] hover:bg-[#3B82F6] text-[#1D4ED8] hover:text-white border border-[#B3D9F5] shadow-xs transition-all duration-200"
                            >
                                <GraduationCap className="w-3.5 h-3.5 inline flex-shrink-0" />
                                <span>{language === "en" ? "Tutor Profile →" : "টিউটর প্রোফাইল →"}</span>
                            </span>
                        ) : (
                            <span className={`text-[11px] font-black px-3.5 py-1 rounded-full border shadow-xs transition-colors ${theme.tagStyle}`}>
                                {language === "en" ? "View Profile →" : "প্রোফাইল দেখুন →"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#2C2C2C]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF4FB] via-[#F5F0FF]/40 to-[#F8F9FA] pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 border-b border-gray-100/80">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white text-xs font-black rounded-full uppercase tracking-widest mb-6 shadow-sm">
                        <HiOutlineSparkles className="text-base" />
                        {language === "en" ? "Meet Our Team" : "আমাদের নিবেদিত টিম"}
                    </span>

                    <h1
                        className={`text-3xl sm:text-5xl lg:text-6xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4 ${
                            language === "bn" ? "font-siliguri" : ""
                        }`}
                    >
                        {language === "en" ? "The Minds Behind Learn & Grow" : "Learn & Grow-এর পেছনের দক্ষ টিম"}
                    </h1>

                    <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {language === "en"
                            ? "A team of visionary leaders, experienced software engineers, robotics mentors, and educators building the next generation of tech leaders."
                            : "ভবিষ্যত প্রজন্মকে কোডিং, রোবটিক্স ও প্রযুক্তিতে পারদর্শী করে গড়ে তুলতে একঝাঁক অভিজ্ঞ সফটওয়্যার ইঞ্জিনিয়ার, মেন্টর ও লিডারশিপ টিম।"}
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mx-auto max-w-7xl space-y-16 sm:space-y-24">
                    {/* Section 1: Executive Leadership (C-Level) */}
                    {cLevel.length > 0 && (
                        <section>
                            <div className="text-center mb-10 sm:mb-12">
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-100/80 text-blue-700 uppercase tracking-wider mb-3">
                                    <Briefcase className="w-3.5 h-3.5 inline text-blue-700" />
                                    <span>{language === "en" ? "Executive Leadership" : "এক্সিকিউটিভ লিডারশিপ"}</span>
                                </span>
                                <h2
                                    className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C2C2C] tracking-tight mb-2 ${
                                        language === "bn" ? "font-siliguri" : ""
                                    }`}
                                >
                                    {language === "en" ? "Leadership & Direction" : "বোর্ড ও শীর্ষ নেতৃত্ব"}
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                                    {language === "en"
                                        ? "Guiding the strategic vision and long-term educational mission"
                                        : "কৌশলগত দিকনির্দেশনা ও সার্বিক তত্ত্বাবধানে শীর্ষ নেতৃত্ব"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {cLevel.map((member: any, index: number) => (
                                    <MemberCard key={member._id || index} member={member} themeIndex={index} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Section 2: Management Team & Coordinators */}
                    {teamLeads.length > 0 && (
                        <section>
                            <div className="text-center mb-10 sm:mb-12">
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-100/80 text-purple-700 uppercase tracking-wider mb-3">
                                    <Target className="w-3.5 h-3.5 inline text-purple-700" />
                                    <span>{language === "en" ? "Management & Coordination" : "ম্যানেজমেন্ট ও কোঅর্ডিনেশন"}</span>
                                </span>
                                <h2
                                    className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C2C2C] tracking-tight mb-2 ${
                                        language === "bn" ? "font-siliguri" : ""
                                    }`}
                                >
                                    {language === "en" ? "Operations & Strategy" : "অপারেশনস ও টিম ম্যানেজমেন্ট"}
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                                    {language === "en"
                                        ? "Driving daily execution, academic coordination, and student success"
                                        : "কার্যক্রম বাস্তবায়ন, একাডেমিক সমন্বয় ও সার্বিক ব্যবস্থাপনা"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                                {teamLeads.map((member: any, index: number) => (
                                    <MemberCard key={member._id || index} member={member} themeIndex={index + 1} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Section 3: Instructors */}
                    {instructors.length > 0 && (
                        <section>
                            <div className="text-center mb-10 sm:mb-12">
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-100/80 text-amber-800 uppercase tracking-wider mb-3">
                                    <GraduationCap className="w-3.5 h-3.5 inline text-amber-800" />
                                    <span>{language === "en" ? "Expert Instructors" : "বিশেষজ্ঞ শিক্ষকবৃন্দ"}</span>
                                </span>
                                <h2
                                    className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C2C2C] tracking-tight mb-2 ${
                                        language === "bn" ? "font-siliguri" : ""
                                    }`}
                                >
                                    {language === "en" ? "Mentors & Educators" : "আমাদের মেন্টর ও শিক্ষকগণ"}
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto mb-5">
                                    {language === "en"
                                        ? "Passionate teachers inspiring young minds through practical, project-based STEM"
                                        : "শিশুদের লাইভ ক্লাসে হাতে-কলমে কোডিং ও রোবটিক্স শেখাতে নিবেদিত মেন্টরবৃন্দ"}
                                </p>
                                <div className="flex justify-center">
                                    <Link
                                        href="/tutors"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-xl hover:scale-105 transition-all"
                                    >
                                        <span>{language === "en" ? "Explore Full Tutor Profiles & Book a Trial" : "সকল টিউটর প্রোফাইল দেখুন ও ১:১ ফ্রি ট্রায়াল বুক করুন"}</span>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
                                {instructors.map((instructor: any, index: number) => (
                                    <MemberCard key={instructor._id || index} member={instructor} themeIndex={index + 2} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Section 4: Executives & Specialists */}
                    {executives.length > 0 && (
                        <section>
                            <div className="text-center mb-10 sm:mb-12">
                                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-800 uppercase tracking-wider mb-3">
                                    <Rocket className="w-3.5 h-3.5 inline text-emerald-800" />
                                    <span>{language === "en" ? "Core Team" : "কোর টিম"}</span>
                                </span>
                                <h2
                                    className={`text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C2C2C] tracking-tight mb-2 ${
                                        language === "bn" ? "font-siliguri" : ""
                                    }`}
                                >
                                    {language === "en" ? "Executives & Specialists" : "অন্যান্য এক্সিকিউটিভবৃন্দ"}
                                </h2>
                                <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
                                    {language === "en"
                                        ? "Specialists dedicated to student support, marketing, and technology"
                                        : "স্টুডেন্ট সাপোর্ট, প্রযুক্তি ও অপারেশনসে নিয়োজিত টিম মেম্বার্স"}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
                                {executives.map((executive: any, index: number) => (
                                    <MemberCard key={executive._id || index} member={executive} themeIndex={index + 3} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Member Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                size="lg"
                backdrop="blur"
                classNames={{
                    backdrop: "bg-black/60 backdrop-blur-sm",
                    wrapper: "overflow-y-auto",
                    base: "m-3 sm:m-4 max-w-xl rounded-[28px] overflow-hidden bg-white shadow-2xl border border-gray-100",
                    header: "border-b border-gray-100 p-6 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50",
                    body: "p-6 sm:p-8",
                    footer: "border-t border-gray-100 p-4 bg-gray-50/60",
                }}
            >
                <ModalContent>
                    {(onClose) => {
                        const getInitials = (name: string) => {
                            return (
                                name
                                    .split(" ")
                                    .filter(Boolean)
                                    .map((w) => w[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2) || "LG"
                            );
                        };

                        const selectedImageSrc = resolveImageSrc(selectedMember?.image);
                        const socialLinkedIn = selectedMember?.linkedIn || selectedMember?.linkedin;
                        const hasLinkedIn = Boolean(socialLinkedIn && socialLinkedIn !== "#" && socialLinkedIn.trim() !== "");
                        const hasTwitter = Boolean(selectedMember?.twitter && selectedMember.twitter !== "#" && selectedMember.twitter.trim() !== "");

                        return (
                            <>
                                <ModalHeader className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <HiOutlineUser className="text-lg" />
                                        </div>
                                        <h2 className="text-lg sm:text-xl font-black text-[#2C2C2C]">
                                            {language === "en" ? "Profile Details" : "প্রোফাইল বিবরণ"}
                                        </h2>
                                    </div>
                                </ModalHeader>

                                <ModalBody>
                                    {selectedMember && (
                                        <div className="flex flex-col items-center text-center">
                                            {/* Profile Avatar Frame (Kodland 3D Card Style) */}
                                            <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-[28px] overflow-hidden shadow-lg border border-black/5 mb-5 flex items-end justify-center bg-gradient-to-b from-[#DBEAFE] via-[#BFDBFE] to-[#3B82F6]">
                                                {/* Ambient 3D orb */}
                                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-white/40 blur-xl pointer-events-none" />
                                                
                                                {selectedImageSrc ? (
                                                    <img
                                                        src={selectedImageSrc}
                                                        alt={selectedMember.name}
                                                        className="w-full h-full object-cover object-top drop-shadow-xl relative z-10"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 text-white relative z-10">
                                                        <div className="w-20 h-20 rounded-full bg-white/40 backdrop-blur-md border-2 border-white/80 shadow-inner flex items-center justify-center text-white font-black text-2xl mb-2">
                                                            {getInitials(selectedMember.name || "U")}
                                                        </div>
                                                        <span className="text-xs font-bold text-white/90">Learn & Grow</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Name & Role */}
                                            <h3 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] mb-2 tracking-tight">
                                                {selectedMember.name}
                                            </h3>

                                            {/* Badges: Domain, Experience, Role */}
                                            <div className="flex flex-wrap justify-center items-center gap-2 mb-4">
                                                {selectedMember.domain && (
                                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                                                        <Bot className="w-3.5 h-3.5 inline text-blue-700" />
                                                        <span>{selectedMember.domain}</span>
                                                    </span>
                                                )}
                                                {selectedMember.yearsOfExperience && (
                                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wide">
                                                        <Clock className="w-3.5 h-3.5 inline text-amber-800" />
                                                        <span>
                                                            {String(selectedMember.yearsOfExperience).toLowerCase().includes("year")
                                                                ? selectedMember.yearsOfExperience
                                                                : `${selectedMember.yearsOfExperience}+ Years Experience`}
                                                        </span>
                                                    </span>
                                                )}
                                                {selectedMember.role && (
                                                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                        {selectedMember.role}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Expertise Tags in Modal */}
                                            {(() => {
                                                const modalTags = Array.isArray(selectedMember.expertise)
                                                    ? selectedMember.expertise
                                                    : typeof selectedMember.expertise === "string" && selectedMember.expertise.trim()
                                                    ? selectedMember.expertise.split(",").map((s) => s.trim()).filter(Boolean)
                                                    : [];
                                                if (modalTags.length === 0) return null;
                                                return (
                                                    <div className="w-full bg-white border border-gray-200/80 rounded-2xl p-4 mb-5 text-left shadow-xs">
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                                            {language === "en" ? "Domain & Key Expertise" : "ডোমেইন ও বিশেষ দক্ষতা"}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {modalTags.map((tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="px-3.5 py-1 rounded-full text-xs font-black bg-[#EAF4FB] text-[#1D4ED8] border border-[#B3D9F5]"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Bio Section */}
                                            <div className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl p-5 mb-5 text-left">
                                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                    {language === "en" ? "Biography" : "জীবনবৃত্তান্ত ও পরিচয়"}
                                                </h4>
                                                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                                    {selectedMember.bio ||
                                                        (language === "en"
                                                            ? "Dedicated team member at Learn & Grow, actively working towards transforming education and empowering students with practical skills."
                                                            : "Learn & Grow-এর নিবেদিতপ্রাণ সদস্য, যিনি শিশুদের হাতে-কলমে আধুনিক প্রযুক্তি ও কোডিং শিক্ষায় উদ্বুদ্ধ করতে নিরলস কাজ করে যাচ্ছেন।")}
                                                </p>
                                            </div>

                                            {/* Instructor specific direct actions */}
                                            {selectedMember.role && /\b(instructor|teacher|educator|trainer|mentor|faculty)\b/i.test(selectedMember.role) && (
                                                <div className="w-full flex flex-col sm:flex-row gap-3 pt-1 mb-5">
                                                    <Button
                                                        className="flex-1 font-black bg-[#F59E0B] hover:bg-amber-500 text-black shadow-md text-xs sm:text-sm py-2 flex items-center justify-center gap-1.5"
                                                        radius="full"
                                                        onPress={() => {
                                                            onClose();
                                                            openTrialModal({ program: selectedMember.role || "Robotics & Coding", source: "team-modal" });
                                                        }}
                                                    >
                                                        <Target className="w-4 h-4 inline" />
                                                        <span>{language === "en" ? "Book 1-on-1 Free Trial" : "১:১ ফ্রি ট্রায়াল বুক করুন"}</span>
                                                    </Button>
                                                    <Link
                                                        href="/tutors"
                                                        onClick={onClose}
                                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#3B82F6] font-bold text-xs sm:text-sm border border-blue-200 transition-colors"
                                                    >
                                                        <GraduationCap className="w-4 h-4 inline" />
                                                        <span>{language === "en" ? "View on Tutors Page" : "টিউটর পেজে দেখুন"}</span>
                                                    </Link>
                                                </div>
                                            )}

                                            {/* Social Links */}
                                            {(hasLinkedIn || hasTwitter) && (
                                                <div className="flex items-center justify-center gap-3 pt-2">
                                                    {hasLinkedIn && (
                                                        <a
                                                            href={socialLinkedIn}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white rounded-full font-bold text-xs transition-all duration-200"
                                                        >
                                                            <FaLinkedin className="text-base" />
                                                            <span>LinkedIn Profile</span>
                                                        </a>
                                                    )}
                                                    {hasTwitter && (
                                                        <a
                                                            href={selectedMember.twitter}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2] text-[#1DA1F2] hover:text-white rounded-full font-bold text-xs transition-all duration-200"
                                                        >
                                                            <FaTwitter className="text-base" />
                                                            <span>Twitter / X</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </ModalBody>

                                <ModalFooter className="flex justify-center sm:justify-end">
                                    <Button
                                        color="primary"
                                        radius="full"
                                        onPress={onClose}
                                        className="font-bold px-8 bg-[#3B82F6] hover:bg-blue-600 text-white"
                                    >
                                        {language === "en" ? "Close" : "বন্ধ করুন"}
                                    </Button>
                                </ModalFooter>
                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </div>
    );
}
