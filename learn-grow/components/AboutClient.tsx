"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import {
    HiOutlineSparkles,
    HiOutlineCheckCircle,
    HiOutlineArrowRight,
    HiOutlineAcademicCap,
    HiOutlineCube,
    HiOutlineUserGroup,
    HiOutlineStar,
} from "react-icons/hi2";
import { openTrialModal } from "@/components/TrialBookingModal";
import { defaultAboutData } from "@/lib/aboutData";
import {
    GraduationCap,
    Cpu,
    Users,
    Star,
    Bot,
    Code,
    Gamepad2,
    Rocket,
    Award,
    ShieldCheck,
    Package,
    Check,
    ArrowRight,
    Sparkles,
    BookOpen,
} from "lucide-react";

const renderPillarIcon = (name: string) => {
    switch (name) {
        case "Bot":
        case "robot":
            return <Bot className="w-7 h-7 text-[#3B82F6]" />;
        case "Code":
        case "python":
            return <Code className="w-7 h-7 text-[#7C3AED]" />;
        case "Gamepad2":
        case "game":
            return <Gamepad2 className="w-7 h-7 text-[#F59E0B]" />;
        case "Rocket":
        case "rocket":
            return <Rocket className="w-7 h-7 text-[#06B6D4]" />;
        default:
            return <Bot className="w-7 h-7 text-[#3B82F6]" />;
    }
};

const renderWhyIcon = (name: string) => {
    switch (name) {
        case "GraduationCap":
        case "mentor":
            return <GraduationCap className="w-8 h-8 text-[#3B82F6]" />;
        case "Package":
        case "kit":
            return <Package className="w-8 h-8 text-[#7C3AED]" />;
        case "Award":
        case "certificate":
            return <Award className="w-8 h-8 text-[#F59E0B]" />;
        case "ShieldCheck":
        case "shield":
            return <ShieldCheck className="w-8 h-8 text-[#10B981]" />;
        default:
            return <Award className="w-8 h-8 text-[#3B82F6]" />;
    }
};

interface AboutClientProps {
    content?: any;
}

const PILLAR_THEMES: Record<string, { bg: string; border: string; pill: string; orb: string }> = {
    blue: {
        bg: "bg-gradient-to-br from-[#EAF4FB] via-[#DBEAFE]/40 to-[#EFF6FF]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#EAF4FB] text-[#1D4ED8] border-[#B3D9F5]",
        orb: "from-[#3B82F6]/20 to-[#60A5FA]/10",
    },
    purple: {
        bg: "bg-gradient-to-br from-[#F5F0FF] via-[#EDE9FE]/40 to-[#FAF5FF]",
        border: "border-[#D4C0F9]",
        pill: "bg-[#F5F0FF] text-[#5B21B6] border-[#D4C0F9]",
        orb: "from-[#7C3AED]/20 to-[#A78BFA]/10",
    },
    amber: {
        bg: "bg-gradient-to-br from-[#FFFBEA] via-[#FEF3C7]/40 to-[#FFFDF5]",
        border: "border-[#FFE082]",
        pill: "bg-[#FFF8E1] text-[#92400E] border-[#FFE082]",
        orb: "from-[#F59E0B]/20 to-[#FCD34D]/10",
    },
    cyan: {
        bg: "bg-gradient-to-br from-[#ECFEFF] via-[#CFFAFE]/40 to-[#F0FDFA]",
        border: "border-[#A5F3FC]",
        pill: "bg-[#ECFEFF] text-[#0E7490] border-[#A5F3FC]",
        orb: "from-[#06B6D4]/20 to-[#67E8F9]/10",
    },
};

export default function AboutClient({ content }: AboutClientProps) {
    const [language, setLanguage] = useState<"en" | "bn">("bn");

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

    // Merge API content with robust default data
    const data = content && typeof content === "object" && Object.keys(content).length > 2
        ? { ...defaultAboutData, ...content }
        : defaultAboutData;

    const { hero, metrics, story, pillars, whyChooseUs } = data;

    return (
        <div className="min-h-screen bg-white text-[#2C2C2C]">
            {/* Hero Section (Kodland Modern STEM Academy Header) */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF4FB] via-[#F5F0FF]/40 to-white pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100/80">
                {/* Ambient glow orbs */}
                <div className="absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
                <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10 animate-fadeIn">
                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white text-xs font-black rounded-full uppercase tracking-widest mb-6 shadow-sm">
                        <HiOutlineSparkles className="text-base" />
                        {language === "en" ? hero.badgeEn : hero.badgeBn}
                    </span>

                    <h1
                        className={`text-4xl sm:text-6xl lg:text-7xl font-black text-[#2C2C2C] tracking-tight leading-[1.08] mb-6 ${
                            language === "bn" ? "font-siliguri" : ""
                        }`}
                    >
                        {language === "en" ? (
                            <>
                                Empowering young minds with{" "}
                                <span className="bg-[#3B82F6] text-white px-4 py-0.5 rounded-full inline-block font-black shadow-md shadow-blue-500/20 -rotate-1">
                                    real tech
                                </span>{" "}
                                skills
                            </>
                        ) : (
                            <>
                                ভবিষ্যতের প্রযুক্তি নির্মাতা গড়ে তোলার{" "}
                                <span className="bg-[#3B82F6] text-white px-4 py-0.5 rounded-full inline-block font-black shadow-md shadow-blue-500/20 -rotate-1">
                                    দৃঢ় প্রত্যয়
                                </span>
                            </>
                        )}
                    </h1>

                    <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                        {language === "en" ? hero.subtitleEn : hero.subtitleBn}
                    </p>

                    {/* Quick CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <Button
                            size="lg"
                            className="bg-[#2C2C2C] hover:bg-black text-white font-black rounded-full px-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-sm sm:text-base h-12 sm:h-14 flex items-center gap-2 cursor-pointer"
                            onPress={() => openTrialModal({ source: "about-hero" })}
                        >
                            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                            <span>{language === "en" ? "Book a Free Trial Lesson" : "ফ্রি ট্রায়াল ক্লাস বুক করুন"}</span>
                        </Button>
                        <Link
                            href="/team"
                            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 h-12 sm:h-14 rounded-full bg-white hover:bg-gray-50 text-gray-800 font-bold border-2 border-gray-200 text-sm sm:text-base shadow-sm hover:border-gray-300 transition-all duration-200"
                        >
                            <Users className="w-4 h-4 text-slate-600" />
                            <span>{language === "en" ? "Meet Our Team" : "আমাদের টিম দেখুন"}</span>
                        </Link>
                        <Link
                            href="/tutors"
                            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 h-12 sm:h-14 rounded-full bg-blue-50 hover:bg-blue-100 text-[#3B82F6] font-bold border border-blue-200 text-sm sm:text-base transition-all duration-200"
                        >
                            <GraduationCap className="w-4 h-4 text-[#3B82F6]" />
                            <span>{language === "en" ? "Live Mentors" : "বিশেষজ্ঞ মেন্টর"}</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Key Metrics Counters Grid */}
            <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {metrics.map((metric: any, idx: number) => {
                            const MetricIcon = idx === 0 ? GraduationCap : idx === 1 ? Cpu : idx === 2 ? Users : Star;
                            const iconColor = idx === 0 ? "text-blue-600 bg-blue-50" : idx === 1 ? "text-purple-600 bg-purple-50" : idx === 2 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";

                            return (
                                <div
                                    key={idx}
                                    className="group relative p-6 sm:p-8 rounded-[28px] bg-gradient-to-b from-gray-50/80 to-white border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
                                >
                                    <div className={`w-12 h-12 rounded-2xl ${iconColor} flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110`}>
                                        <MetricIcon className="w-6 h-6" />
                                    </div>
                                    <div className="text-3xl sm:text-5xl font-black text-[#2C2C2C] tracking-tight mb-1 group-hover:text-[#3B82F6] transition-colors">
                                        {metric.value}
                                    </div>
                                <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                                    {language === "en" ? metric.labelEn : metric.labelBn}
                                </div>
                                <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2">
                                    {language === "en" ? metric.descEn : metric.descBn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story & Origin Section */}
            <section className="py-16 sm:py-24 bg-[#F8F9FA] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* Left: Real Workshop Photo with 3D Overlays */}
                        <div className="lg:col-span-6 relative">
                            <div className="relative rounded-[36px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3]">
                                <img
                                    src={story.image || "/workshop/bpsc-main.png"}
                                    alt="Learn & Grow STEM Workshop"
                                    className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                                {/* Floating Live Badge */}
                                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-[#2C2C2C] shadow-md flex items-center gap-1.5 border border-white/60">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>{language === "en" ? "Real STEM Lab & Kits" : "বাস্তব স্টেম ল্যাব ও কিট"}</span>
                                </div>

                                {/* Bottom caption */}
                                <div className="absolute bottom-4 left-4 right-4 text-white text-xs sm:text-sm font-bold bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                                    {language === "en"
                                        ? "Hands-on robotics and microcontrollers workshop conducted by Learn & Grow educators."
                                        : "Learn & Grow-এর প্রশিক্ষকদের পরিচালনায় সরাসরি স্কুলে অনুষ্ঠিত হ্যান্ডস-অন রোবোটিক্স ওয়ার্কশপ।"}
                                </div>
                            </div>

                            {/* Floating Decorative Card */}
                            <div className="hidden sm:flex absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center text-xl shadow-md">
                                    <Cpu className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">{language === "en" ? "Curriculum Designed For" : "কারিকুলাম বয়সসীমা"}</p>
                                    <p className="text-sm font-black text-[#2C2C2C]">{language === "en" ? "Kids Aged 6 – 16 Years" : "৬ থেকে ১৬ বছর বয়সী"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Inspiring Narrative */}
                        <div className="lg:col-span-6 space-y-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#EAF4FB] text-[#3B82F6] text-xs font-black rounded-full uppercase tracking-widest border border-[#B3D9F5]">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{language === "en" ? story.badgeEn : story.badgeBn}</span>
                            </span>

                            <h2
                                className={`text-3xl sm:text-4xl lg:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight ${
                                    language === "bn" ? "font-siliguri" : ""
                                }`}
                            >
                                {language === "en" ? story.titleEn : story.titleBn}
                            </h2>

                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                {language === "en" ? story.p1En : story.p1Bn}
                            </p>

                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                {language === "en" ? story.p2En : story.p2Bn}
                            </p>

                            {/* Key Highlights Checklist */}
                            <div className="space-y-3.5 pt-2">
                                {story.highlights.map((item: any, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-gray-200/70 shadow-xs">
                                        <div className="w-7 h-7 rounded-full bg-blue-100 text-[#3B82F6] flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-[#3B82F6]" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs sm:text-sm font-black text-gray-900">
                                                {language === "en" ? item.titleEn : item.titleBn}
                                            </h4>
                                            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-relaxed">
                                                {language === "en" ? item.descEn : item.descBn}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Teaching Pillars (4 Kodland 3D Pastel Cards) */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 text-xs font-black rounded-full uppercase tracking-widest border border-purple-200 mb-4">
                            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                            <span>{language === "en" ? "Pedagogy & Learning Tracks" : "আমাদের ৪টি মূল শিক্ষণ স্তম্ভ"}</span>
                        </span>
                        <h2
                            className={`text-3xl sm:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4 ${
                                language === "bn" ? "font-siliguri" : ""
                            }`}
                        >
                            {language === "en"
                                ? "How We Make STEM Fun, Engaging & Impactful"
                                : "শিশুরা যেভাবে আনন্দ নিয়ে প্রযুক্তি শেখে"}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            {language === "en"
                                ? "From visual drag-and-drop game design to raw microchip assembly and AI algorithms, our curriculum builds progressive confidence."
                                : "প্রাথমিক ব্লক কোডিং থেকে শুরু করে বাস্তব মাইক্রোকন্ট্রোলার সার্কিট এবং এআই অ্যালগরিদম—প্রতিটি ধাপ শিশুদের বয়সোচিত দক্ষতার সাথে সাজানো।"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map((pillar: any, index: number) => {
                            const theme = PILLAR_THEMES[pillar.color] || PILLAR_THEMES.blue;
                            return (
                                <div
                                    key={index}
                                    className={`relative p-7 rounded-[32px] border ${theme.border} ${theme.bg} shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden group`}
                                >
                                    {/* Ambient decorative circle */}
                                    <div
                                        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full bg-gradient-to-tr ${theme.orb} blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-700`}
                                    />

                                    <div>
                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-white/60 flex items-center justify-center mb-5 select-none">
                                            {renderPillarIcon(pillar.icon)}
                                        </div>

                                        <h3
                                            className={`text-lg sm:text-xl font-black text-[#2C2C2C] tracking-tight mb-3 leading-snug ${
                                                language === "bn" ? "font-siliguri" : ""
                                            }`}
                                        >
                                            {language === "en" ? pillar.titleEn : pillar.titleBn}
                                        </h3>

                                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                                            {language === "en" ? pillar.descEn : pillar.descBn}
                                        </p>
                                    </div>

                                    <div>
                                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3.5 py-1 rounded-full border shadow-xs ${theme.pill}`}>
                                            <span>{language === "en" ? "Explore Track" : "ট্র্যাক বিস্তারিত"}</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Learn & Grow (Distinctive Edge) */}
            <section className="py-16 sm:py-24 bg-[#F8F9FA] border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-14">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8E1] text-[#92400E] text-xs font-black rounded-full uppercase tracking-widest border border-[#FFE082] mb-4">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>{language === "en" ? "Why Parents Trust Us" : "অভিভাবকদের আস্থার কারণ"}</span>
                        </span>
                        <h2
                            className={`text-3xl sm:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4 ${
                                language === "bn" ? "font-siliguri" : ""
                            }`}
                        >
                            {language === "en" ? "Why Choose Learn & Grow?" : "কেন Learn & Grow সবার চেয়ে আলাদা?"}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            {language === "en"
                                ? "We replace passive YouTube watching with real maker confidence, personalized instruction, and tangible hardware builds."
                                : "ইউটিউবে অলস সময় কাটানোর বদলে বাস্তব হার্ডওয়্যার উদ্ভাবক হওয়ার আত্মবিশ্বাস গড়ে তুলতে আমরা নিয়ে এসেছি সেরা লার্নিং ইকোসিস্টেম।"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item: any, i: number) => (
                            <div
                                key={i}
                                className="p-7 rounded-[28px] bg-white border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-start"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 select-none">
                                    {renderWhyIcon(item.icon)}
                                </div>
                                <h3
                                    className={`text-base sm:text-lg font-black text-gray-900 tracking-tight mb-2 ${
                                        language === "bn" ? "font-siliguri" : ""
                                    }`}
                                >
                                    {language === "en" ? item.titleEn : item.titleBn}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                                    {language === "en" ? item.descEn : item.descBn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global CTA Banner (Kodland Signature Blue Replica) */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] rounded-[38px] sm:rounded-[52px] p-8 sm:p-14 lg:p-16 text-white overflow-hidden shadow-[0_20px_50px_rgba(37,99,235,0.28)] border border-blue-400/20">
                        {/* Ambient light sweeps */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-300/30 blur-3xl" />
                            <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/30 blur-3xl" />
                        </div>

                        <div className="relative z-10 max-w-3xl">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-black rounded-full uppercase tracking-widest mb-6 border border-white/20">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{language === "en" ? "Ready To Get Started?" : "আপনার সন্তানের যাত্রা শুরু করুন"}</span>
                            </span>

                            <h2
                                className={`text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6 ${
                                    language === "bn" ? "font-siliguri" : ""
                                }`}
                            >
                                {language === "en"
                                    ? "Turn your child's curiosity into tech mastery with a free live class."
                                    : "আপনার সন্তানের সৃজনশীলতাকে প্রযুক্তির শক্তিতে রূপান্তর করতে ফ্রি লাইভ ক্লাসে অংশ নিন।"}
                            </h2>

                            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
                                {language === "en"
                                    ? "Try our interactive 1-on-1 trial session. A dedicated mentor will introduce basic programming, circuits, and assess your child's learning style."
                                    : "আমাদের ১:১ ফ্রি ট্রায়াল সেশনে অংশ নিয়ে জেনে নিন কীভাবে আপনার সন্তান রোবোটিক্স ও কোডিংয়ে দক্ষ হয়ে উঠবে। কোনো পেমেন্ট বা বাধ্যবাধকতা নেই।"}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-white hover:bg-gray-100 text-[#1D4ED8] font-black rounded-full px-8 sm:px-10 shadow-2xl text-sm sm:text-base h-12 sm:h-14 transition-all duration-300 flex items-center gap-2"
                                    onPress={() => openTrialModal({ source: "about-cta-banner" })}
                                >
                                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                                    <span>{language === "en" ? "Book 1-on-1 Free Trial" : "১:১ ফ্রি ট্রায়াল বুক করুন"}</span>
                                </Button>
                                <Link
                                    href="/team"
                                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 h-12 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold border border-white/30 text-sm sm:text-base transition-all duration-200"
                                >
                                    <Users className="w-4 h-4 text-white" />
                                    <span>{language === "en" ? "Meet Our Team" : "আমাদের টিম সম্পর্কে জানুন"}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
