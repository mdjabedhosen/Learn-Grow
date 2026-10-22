"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import {
  FaNewspaper,
  FaDownload,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaEnvelope,
  FaPhoneAlt,
  FaPalette,
  FaBullhorn,
  FaFilePdf,
  FaAward,
  FaArrowRight,
  FaGlobe,
  FaUsers,
  FaMicrochip,
} from "react-icons/fa";
import { useGetSiteContentQuery } from "@/redux/api/siteContentApi";
import { defaultPressData, PressData, NewsItem, PressReleaseItem } from "@/lib/pressData";

const BRAND_COLORS = [
  { name: "Primary Blue", hex: "#3B82F6", role: "Primary Accent & Brand Energy" },
  { name: "Royal Purple", hex: "#7C3AED", role: "Innovation, Logic & Depth" },
  { name: "Golden Amber", hex: "#F59E0B", role: "Creativity, Warmth & Spark" },
  { name: "Charcoal Slate", hex: "#2C2C2C", role: "High-Contrast Typography" },
  { name: "Ice Blue Pastel", hex: "#EAF4FB", role: "Soft Canvas & Highlights" },
];

export default function PressPage() {
  const [lang, setLang] = useState<"en" | "bn">("bn");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "tech" | "national" | "feature">("all");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Sync language with navbar / localStorage
  useEffect(() => {
    const saved = (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn";
    setLang(saved);
    const handler = (e: any) => {
      setLang(e.detail?.language || (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn");
    };
    window.addEventListener("languageChange", handler);
    return () => window.removeEventListener("languageChange", handler);
  }, []);

  const isBn = lang === "bn";

  // Fetch dynamic press content from database
  const { data: siteContentData } = useGetSiteContentQuery("press");

  const pressContent: PressData = useMemo(() => {
    if (siteContentData?.data?.content && typeof siteContentData.data.content === "object") {
      const c = siteContentData.data.content;
      return {
        hero: {
          tagEn: c.hero?.tagEn || defaultPressData.hero.tagEn,
          tagBn: c.hero?.tagBn || defaultPressData.hero.tagBn,
          titleEn: c.hero?.titleEn || defaultPressData.hero.titleEn,
          titleBn: c.hero?.titleBn || defaultPressData.hero.titleBn,
          subtitleEn: c.hero?.subtitleEn || defaultPressData.hero.subtitleEn,
          subtitleBn: c.hero?.subtitleBn || defaultPressData.hero.subtitleBn,
          metrics: {
            mediaStoriesEn: c.hero?.metrics?.mediaStoriesEn || defaultPressData.hero.metrics.mediaStoriesEn,
            mediaStoriesBn: c.hero?.metrics?.mediaStoriesBn || defaultPressData.hero.metrics.mediaStoriesBn,
            batchSizeEn: c.hero?.metrics?.batchSizeEn || defaultPressData.hero.metrics.batchSizeEn,
            batchSizeBn: c.hero?.metrics?.batchSizeBn || defaultPressData.hero.metrics.batchSizeBn,
            practicalLabEn: c.hero?.metrics?.practicalLabEn || defaultPressData.hero.metrics.practicalLabEn,
            practicalLabBn: c.hero?.metrics?.practicalLabBn || defaultPressData.hero.metrics.practicalLabBn,
            nationwideReachEn: c.hero?.metrics?.nationwideReachEn || defaultPressData.hero.metrics.nationwideReachEn,
            nationwideReachBn: c.hero?.metrics?.nationwideReachBn || defaultPressData.hero.metrics.nationwideReachBn,
          },
        },
        newsCoverage: Array.isArray(c.newsCoverage) && c.newsCoverage.length > 0 ? c.newsCoverage : defaultPressData.newsCoverage,
        pressReleases: Array.isArray(c.pressReleases) && c.pressReleases.length > 0 ? c.pressReleases : defaultPressData.pressReleases,
        mediaContact: {
          email: (c.mediaContact?.email && c.mediaContact.email.endsWith("@learnandgrow.io"))
            ? c.mediaContact.email
            : "press@learnandgrow.io",
          whatsapp: c.mediaContact?.whatsapp || defaultPressData.mediaContact.whatsapp,
          phone: c.mediaContact?.phone || defaultPressData.mediaContact.phone,
        },
      };
    }
    return defaultPressData;
  }, [siteContentData]);

  const mediaEmail = (pressContent?.mediaContact?.email && pressContent.mediaContact.email.endsWith("@learnandgrow.io"))
    ? pressContent.mediaContact.email
    : "press@learnandgrow.io";

  const filteredNews = useMemo(() => {
    if (selectedFilter === "all") return pressContent.newsCoverage;
    return pressContent.newsCoverage.filter((item) => item.sourceCategory === selectedFilter);
  }, [selectedFilter, pressContent.newsCoverage]);

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#2C2C2C]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#EAF4FB] via-[#F5F0FF]/40 to-[#F8F9FA] pt-28 pb-16 md:pt-36 md:pb-24 border-b border-blue-100/60">
        {/* Subtle Decorative Floating Shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10 text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white text-xs font-black rounded-full uppercase tracking-widest mb-6 shadow-sm shadow-blue-500/20">
            <FaBullhorn className="text-white text-xs" />
            <span>{isBn ? pressContent.hero.tagBn : pressContent.hero.tagEn}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#2C2C2C] tracking-tight leading-[1.15] mb-5 max-w-4xl mx-auto">
            {isBn ? pressContent.hero.titleBn : pressContent.hero.titleEn}
          </h1>

          <p className="text-base sm:text-xl text-gray-600 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            {isBn ? pressContent.hero.subtitleBn : pressContent.hero.subtitleEn}
          </p>

          {/* Key Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-blue-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#3B82F6] mb-1">
                {isBn ? pressContent.hero.metrics.mediaStoriesBn : pressContent.hero.metrics.mediaStoriesEn}
              </div>
              <div className="text-xs font-bold text-gray-600">
                {isBn ? "মিডিয়া কাভারেজ" : "Media Stories"}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-purple-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#7C3AED] mb-1">
                {isBn ? pressContent.hero.metrics.batchSizeBn : pressContent.hero.metrics.batchSizeEn}
              </div>
              <div className="text-xs font-bold text-gray-600">
                {isBn ? "মাইক্রো-ব্যাচ সাইজ" : "Max Batch Size"}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-amber-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#F59E0B] mb-1">
                {isBn ? pressContent.hero.metrics.practicalLabBn : pressContent.hero.metrics.practicalLabEn}
              </div>
              <div className="text-xs font-bold text-gray-600">
                {isBn ? "লাইভ প্র্যাকটিক্যাল ল্যাব" : "Hands-On Live"}
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-sky-100 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-sky-600 mb-1">
                {isBn ? pressContent.hero.metrics.nationwideReachBn : pressContent.hero.metrics.nationwideReachEn}
              </div>
              <div className="text-xs font-bold text-gray-600">
                {isBn ? "সারাদেশে ব্যাপ্তি" : "Nationwide Reach"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 -mt-4 relative z-20 space-y-16">
        
        {/* Section: In The News */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#EAF4FB] text-[#3B82F6] border border-[#B3D9F5] text-xs font-bold rounded-full mb-3">
                <FaNewspaper className="text-xs" />
                <span>{isBn ? "গণমাধ্যমে আমরা" : "Featured Articles"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#2C2C2C]">
                {isBn ? "সংবাদ ও ফিচার প্রতিবেদন" : "In The News"}
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { id: "all", labelEn: "All Stories", labelBn: "সকল সংবাদ" },
                { id: "national", labelEn: "National Press", labelBn: "জাতীয় সংবাদ" },
                { id: "tech", labelEn: "Tech & Global", labelBn: "টেক ও আন্তর্জাতিক" },
                { id: "feature", labelEn: "In-Depth Features", labelBn: "বিশেষ ফিচার" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedFilter === tab.id
                      ? "bg-[#3B82F6] text-white shadow-sm shadow-blue-500/20"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {isBn ? tab.labelBn : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Card
                key={item.id}
                className="rounded-[28px] border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 bg-white flex flex-col justify-between"
              >
                <CardBody className="p-6 flex flex-col justify-between h-full">
                  <div>
                    {/* Header: Source Badge + Date */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black border ${item.sourceBadgeBg} ${item.sourceBadgeBorder} ${item.sourceBadgeText}`}
                      >
                        {item.source}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400">
                        {isBn ? item.dateBn : item.dateEn}
                      </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-lg font-bold text-[#2C2C2C] leading-snug mb-3 group-hover:text-blue-600 transition-colors">
                      {isBn ? item.titleBn : item.titleEn}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {isBn ? item.summaryBn : item.summaryEn}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-gray-400">
                      {isBn ? item.readTimeBn : item.readTimeEn}
                    </span>
                    <Button
                      as="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="light"
                      color="primary"
                      className="font-bold text-xs"
                      endContent={<FaExternalLinkAlt className="text-[10px]" />}
                    >
                      {isBn ? "মূল প্রতিবেদন" : "Read Article"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Section: Official Press Releases */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-[#7C3AED] border border-purple-200 text-xs font-bold rounded-full mb-2">
                <FaFilePdf className="text-xs" />
                <span>{isBn ? "অফিসিয়াল ঘোষণা" : "Official Statements"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                {isBn ? "প্রেস রিলিজ ও ঘোষণা" : "Official Press Releases"}
              </h2>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {isBn ? "গণমাধ্যম ব্যবহারের জন্য অনুমোদিত" : "Authorized for Editorial Use"}
            </span>
          </div>

          <div className="space-y-4">
            {pressContent.pressReleases.map((pr) => (
              <div
                key={pr.id}
                className="p-5 sm:p-6 rounded-2xl bg-gray-50/70 hover:bg-[#F5F0FF]/50 border border-gray-200/80 hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] font-bold text-[11px]">
                      {isBn ? pr.tagBn : pr.tagEn}
                    </span>
                    <span className="text-gray-400 font-medium">
                      {isBn ? pr.dateBn : pr.dateEn}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2C2C2C]">
                    {isBn ? pr.titleBn : pr.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {isBn ? pr.excerptBn : pr.excerptEn}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Button
                    as="a"
                    href={`mailto:${mediaEmail}?subject=Press Release Inquiry: ${encodeURIComponent(pr.titleEn)}`}
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="font-bold text-xs rounded-xl"
                  >
                    {isBn ? "মিডিয়া তথ্য" : "Media Kit"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Brand Assets & Media Kit */}
        <div className="bg-gradient-to-br from-white via-[#EAF4FB]/30 to-[#F5F0FF]/30 rounded-[32px] p-6 sm:p-10 border border-blue-100 shadow-sm">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-[#F59E0B] border border-amber-200 text-xs font-bold rounded-full mb-3">
              <FaPalette className="text-xs" />
              <span>{isBn ? "ভিজ্যুয়াল রিসোর্স" : "Brand Identity"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] mb-2">
              {isBn ? "মিডিয়া কিট ও ব্র্যান্ড অ্যাসেট" : "Media Kit & Official Brand Assets"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isBn
                ? "সংবাদ, কলাম, টিভি ফিচার কিংবা প্রকাশনায় ব্যবহারের জন্য অফিসিয়াল হাই-রেজোলিউশন লোগো, ভেক্টর গ্রাফিক্স ও ব্র্যান্ড গাইডলাইন এখান থেকে ডাউনলোড করতে পারেন।"
                : "Download our verified high-resolution logos, brand vector icons, official color palette, and press kit guidelines for editorial usage."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Logo Downloads Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#3B82F6] flex items-center justify-center text-xl mb-4">
                  <FaDownload />
                </div>
                <h3 className="text-base font-bold text-[#2C2C2C] mb-1">
                  {isBn ? "অফিসিয়াল লোগো প্যাকেজ" : "Official Logo Pack"}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  {isBn
                    ? "পিএনজি (PNG) এবং স্কেলযোগ্য ভেক্টর (SVG) ফরম্যাটে ডার্ক ও লাইট ব্যাকগ্রাউন্ড ভার্সন।"
                    : "High-resolution transparent PNG and crisp SVG vectors for dark & light backgrounds."}
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  as="a"
                  href="/brand-text.svg"
                  download="learn-grow-logo.svg"
                  color="primary"
                  className="w-full font-bold text-xs rounded-xl shadow-sm shadow-blue-500/20"
                  startContent={<FaDownload />}
                >
                  {isBn ? "ভেক্টর লোগো (SVG)" : "Download Vector (SVG)"}
                </Button>
                <Button
                  as="a"
                  href="/logo.png"
                  download="learn-grow-logo.png"
                  variant="bordered"
                  className="w-full font-bold text-xs rounded-xl"
                  startContent={<FaDownload />}
                >
                  {isBn ? "পিএনজি লোগো (PNG)" : "Download PNG Pack"}
                </Button>
              </div>
            </div>

            {/* Brand Color Tokens Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center text-xl">
                    <FaPalette />
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">
                    {isBn ? "ক্লিক করে হেক্স কোড কপি করুন" : "Click to copy HEX"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#2C2C2C] mb-1">
                  {isBn ? "ব্র্যান্ড কালার প্যালেট" : "Official Brand Color Tokens"}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  {isBn
                    ? "আমাদের অফিসিয়াল সিগনেচার রং—কোডল্যান্ড স্টাইল আধুনিক ডিজিটাল এডুকেশনের প্রাণবন্ত প্যালেট।"
                    : "Signature brand colors that embody our Kodland-inspired creative STEM education philosophy."}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => handleCopyColor(c.hex)}
                    className="p-3 rounded-xl border border-gray-100 hover:border-gray-300 text-left transition-all hover:scale-[1.02] bg-gray-50/50"
                  >
                    <div
                      className="w-full h-8 rounded-lg mb-2 shadow-inner border border-black/5 flex items-center justify-center"
                      style={{ backgroundColor: c.hex }}
                    >
                      {copiedColor === c.hex && (
                        <FaCheck className="text-white text-xs drop-shadow" />
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-gray-800 truncate">{c.name}</div>
                    <div className="text-[10px] font-mono text-gray-500 flex items-center justify-between">
                      <span>{c.hex}</span>
                      <FaCopy className="text-[9px] text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Press Inquiry & Media Relations Box */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#3B82F6] to-[#7C3AED] rounded-[32px] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Subtle Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                <FaEnvelope className="text-xs" />
                <span>{isBn ? "মিডিয়া যোগাযোগ" : "Media Relations"}</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                {isBn
                  ? "সাক্ষাৎকার কিংবা সংবাদ সম্পর্কিত যেকোনো অনুসন্ধানে"
                  : "Have a Media Inquiry or Interview Request?"}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                {isBn
                  ? "আমাদের প্রতিষ্ঠাতা ও মেন্টরদের সাথে সাক্ষাৎকার, ক্যাম্পাস স্টোরি কিংবা প্রেস সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের জনসংযোগ দলের সাথে যোগাযোগ করুন।"
                  : "We are always excited to collaborate with journalists, tech writers, podcasters, and researchers exploring STEM education."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                as="a"
                href={`mailto:${mediaEmail}?subject=Media Inquiry - Learn & Grow`}
                size="lg"
                className="bg-white text-[#1E3A8A] font-black text-sm rounded-2xl shadow-lg hover:bg-gray-100"
                startContent={<FaEnvelope />}
              >
                {mediaEmail}
              </Button>
              <Button
                as="a"
                href={pressContent.mediaContact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="bg-[#F59E0B] text-white font-black text-sm rounded-2xl shadow-lg hover:bg-amber-600"
                startContent={<FaPhoneAlt />}
              >
                {isBn ? "হোয়াটসঅ্যাপ মিডিয়া ডেস্ক" : "Media WhatsApp"}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
