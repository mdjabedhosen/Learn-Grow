"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllEventsQuery } from "@/redux/api/eventApi";
import {
  FaSearch,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaUsers,
  FaChevronRight,
  FaAward,
  FaCheck,
  FaArrowRight,
} from "react-icons/fa";
import {
  Trophy,
  Laptop,
  Wrench,
  Mic,
  Globe,
  MapPin,
  Video,
  Sparkles,
  Rocket,
  FileText,
  Users,
  Calendar,
  Flame,
} from "lucide-react";
import { Spinner } from "@nextui-org/react";

export default function EventsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [selectedMode, setSelectedMode] = useState<string>("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = (localStorage.getItem("language") || localStorage.getItem("preferredLanguage")) as "bn" | "en";
      if (savedLang) setLanguage(savedLang);

      const handleLangChange = (e: any) => {
        const newLang = (e.detail?.language || localStorage.getItem("language") || localStorage.getItem("preferredLanguage") || "bn") as "bn" | "en";
        setLanguage(newLang);
      };
      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  const { data: response, isLoading } = useGetAllEventsQuery({
    page,
    limit: 12,
    search: search || undefined,
    type: selectedType !== "All" ? selectedType : undefined,
    mode: selectedMode !== "All" ? selectedMode : undefined,
  });

  // Normalize API response
  const events = useMemo(() => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray((response as any)?.data?.events)) return (response as any).data.events;
    return [];
  }, [response]);

  const pagination = (response as any)?.pagination || (response as any)?.data?.pagination || {};
  const totalPages = pagination?.totalPages || Math.max(1, Math.ceil((pagination?.total || events.length) / 12));

  const typeFilters = [
    { id: "All", labelEn: "All Events", labelBn: "সকল ইভেন্ট" },
    { id: "Competition", labelEn: "Competitions", labelBn: "প্রতিযোগিতা" },
    { id: "Bootcamp", labelEn: "Bootcamps", labelBn: "কোডিং বুটক্যাম্প" },
    { id: "Workshop", labelEn: "Workshops", labelBn: "প্র্যাকটিক্যাল কর্মশালা" },
    { id: "Seminar", labelEn: "Seminars", labelBn: "সেমিনার" },
    { id: "Webinar", labelEn: "Webinars", labelBn: "লাইভ ওয়েবিনার" },
  ];

  const modeFilters = [
    { id: "All", labelEn: "All Modes", labelBn: "সকল মোড" },
    { id: "Offline", labelEn: "In-Person (Dhaka)", labelBn: "সরাসরি ভেন্যুতে" },
    { id: "Online", labelEn: "Online (Live Zoom)", labelBn: "অনলাইন লাইভ" },
  ];

  // Fallback banner generator
  const getEventBanner = (event: any) => {
    if (event.bannerImage) return event.bannerImage;
    const title = (event.title || "").toLowerCase();
    if (title.includes("robot") || title.includes("olympiad") || title.includes("arduino")) {
      return "/courses/robotics-course-banner.jpg";
    }
    if (title.includes("python") || title.includes("ai") || title.includes("coding")) {
      return "/courses/python-course-banner.jpg";
    }
    return "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop";
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      
      {/* 1. Kodland-inspired Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF4FB]/70 via-[#F5F0FF]/30 to-[#F8F9FA] pt-8 pb-14 sm:pt-12 sm:pb-16 border-b border-gray-100">
        {/* Background decorative blurs */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 text-center">
          
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-6">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              {language === "en" ? "Home" : "হোম"}
            </Link>
            <FaChevronRight className="text-[10px] text-gray-400" />
            <span className="text-gray-900 font-semibold">
              {language === "en" ? "Events & Workshops" : "ইভেন্টস ও কর্মশালা"}
            </span>
          </nav>

          {/* Pill Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8E1] border border-[#FFE082] rounded-full shadow-xs">
              <Rocket className="w-3.5 h-3.5 text-[#92620A]" />
              <span className="text-xs font-bold text-[#92620A] uppercase tracking-wider">
                {language === "en" ? "STEM Events, Competitions & Maker Labs" : "স্টেম ইভেন্টস, অলিম্পিয়াড ও মেকার ল্যাব"}
              </span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1E1E1E] tracking-tight leading-tight mb-4">
            {language === "en" ? "Workshops & Competitions" : "বিজ্ঞান ও প্রযুক্তির রোমাঞ্চকর ইভেন্টস"}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
            {language === "en"
              ? "Join national robotics olympiads, coding bootcamps, and interactive maker workshops to turn curiosity into real-world achievements."
              : "রোবটিক্স অলিম্পিয়াড, কোডিং বুটক্যাম্প ও প্র্যাকটিক্যাল ল্যাব সেশনে অংশ নিয়ে আপনার উদ্ভাবনী দক্ষতাকে জাতীয় পর্যায়ে তুলে ধরুন।"}
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-bold text-gray-700">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === "en" ? "National Olympiad & Trophies" : "জাতীয় অলিম্পিয়াড ও প্রাইজপুল"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              <span>{language === "en" ? "Hands-on Hardware Lab" : "হাতে-কলমে হার্ডওয়্যার ল্যাব"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === "en" ? "Verified Certificate" : "ভেরিফায়েড সার্টিফিকেট"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full shadow-xs border border-gray-200">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span>{language === "en" ? "Mentors from DIU & Top Universities" : "ডিআইইউ ও শীর্ষ বিশ্ববিদ্যালয়ের মেন্টর"}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. Interactive Filter Bar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl -mt-6 relative z-20">
        <div className="bg-white rounded-[24px] border border-gray-200/80 p-4 sm:p-5 shadow-lg space-y-4">
          
          {/* Top row: Search Bar & Mode Selector */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder={language === "en" ? "Search events by title, keyword, or venue..." : "ইভেন্ট, বিষয় বা ভেন্যুর নাম দিয়ে খুঁজুন..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F8F9FA] rounded-2xl border border-gray-200 focus:border-[#3B82F6] focus:bg-white focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all"
              />
            </div>

            {/* Mode Selector Buttons */}
            <div className="flex items-center gap-1.5 bg-[#F8F9FA] p-1.5 rounded-2xl border border-gray-200">
              {modeFilters.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedMode === m.id
                      ? "bg-[#3B82F6] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {language === "en" ? m.labelEn : m.labelBn}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: Type Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {typeFilters.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedType === type.id
                    ? "bg-[#1E1E1E] text-white border-[#1E1E1E] shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
                }`}
              >
                {language === "en" ? type.labelEn : type.labelBn}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 3. Event Cards Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-10">
        
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" color="primary" />
            <p className="text-sm font-semibold text-gray-500">
              {language === "en" ? "Loading STEM events..." : "ইভেন্ট তালিকা লোড হচ্ছে..."}
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-[28px] border-2 border-dashed border-gray-200 p-12 text-center max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#3B82F6]" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {language === "en" ? "No matching events found" : "কোনো ইভেন্ট পাওয়া যায়নি"}
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              {language === "en"
                ? "Try adjusting your search terms or filters to find upcoming workshops and competitions."
                : "আপনার সার্চ অথবা ফিল্টার অপশন পরিবর্তন করে পুনরায় চেষ্টা করুন।"}
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedType("All");
                setSelectedMode("All");
              }}
              className="px-6 py-2.5 bg-[#3B82F6] text-white text-xs font-bold rounded-full hover:bg-blue-600 transition-colors cursor-pointer"
            >
              {language === "en" ? "Clear Filters" : "সকল ফিল্টার মুছুন"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event: any) => {
              const eventDate = new Date(event.eventDate);
              const seatsAvailable = Math.max(0, event.maxSeats - (event.registeredCount || 0));
              const isFull = seatsAvailable <= 0;
              const banner = getEventBanner(event);
              const percentageFilled = Math.min(100, Math.round(((event.registeredCount || 0) / event.maxSeats) * 100));

              return (
                <div
                  key={event._id}
                  onClick={() => router.push(`/events/${event._id}`)}
                  className="bg-white rounded-[28px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
                >
                  {/* 16:9 Banner Header */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={banner}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = "/courses/robotics-course-banner.jpg";
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur-md text-[#1E1E1E] text-[11px] font-black rounded-full shadow-sm">
                        {event.type === "Competition" && <Trophy className="w-3 h-3 text-amber-500 inline" />}
                        {event.type === "Bootcamp" && <Laptop className="w-3 h-3 text-blue-500 inline" />}
                        {event.type === "Workshop" && <Wrench className="w-3 h-3 text-emerald-500 inline" />}
                        {event.type === "Seminar" && <Mic className="w-3 h-3 text-purple-500 inline" />}
                        {event.type === "Webinar" && <Globe className="w-3 h-3 text-cyan-500 inline" />}
                        <span>{event.type}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold rounded-full backdrop-blur-md shadow-sm ${
                          event.mode === "Online"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-blue-600/90 text-white"
                        }`}
                      >
                        {event.mode === "Online" ? <FaVideo className="text-[10px]" /> : <FaMapMarkerAlt className="text-[10px]" />}
                        <span>{event.mode}</span>
                      </span>
                    </div>

                    {/* Bottom Status Ribbon on Image */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white text-xs font-semibold">
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <FaCalendar className="text-[#F59E0B]" />
                        <span>
                          {eventDate.toLocaleDateString(language === "en" ? "en-US" : "bn-BD", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </span>

                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        <FaClock className="text-[#3B82F6]" />
                        <span>{event.startTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      
                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-black text-[#1E1E1E] leading-snug line-clamp-2 group-hover:text-[#3B82F6] transition-colors">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {event.shortDescription}
                      </p>

                      {/* Venue or Online Platform Info */}
                      <div className="pt-1 flex items-center gap-2 text-xs text-gray-500">
                        {event.mode === "Offline" ? (
                          <>
                            <FaMapMarkerAlt className="text-amber-500 flex-shrink-0" />
                            <span className="truncate">{event.venueName || event.venueAddress || "Dhaka, Bangladesh"}</span>
                          </>
                        ) : (
                          <>
                            <FaVideo className="text-emerald-500 flex-shrink-0" />
                            <span>{event.platformType ? `${event.platformType} Live Session` : "Live Interactive Online"}</span>
                          </>
                        )}
                      </div>

                      {/* Guests / Mentors preview */}
                      {event.guests && event.guests.length > 0 && (
                        <div className="pt-2 flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            {event.guests.slice(0, 3).map((g: any, idx: number) => (
                              <img
                                key={idx}
                                src={g.profileImage || "/logo.png"}
                                alt={g.fullName}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] font-bold text-gray-500 truncate">
                            {event.guests.map((g: any) => g.fullName).join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Seat availability and Action */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      {/* Seat Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className={isFull ? "text-red-500 font-black" : "text-emerald-600 font-black flex items-center gap-1"}>
                            {isFull ? (
                              <span>{language === "en" ? "Sold Out / Full" : "আসন পূর্ণ"}</span>
                            ) : (
                              <>
                                <Flame className="w-3.5 h-3.5 text-amber-500 inline flex-shrink-0" />
                                <span>{language === "en" ? `${seatsAvailable} seats left` : `মাত্র ${seatsAvailable}টি আসন বাকি`}</span>
                              </>
                            )}
                          </span>
                          <span className="text-gray-400">
                            {event.registeredCount || 0} / {event.maxSeats}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFull ? "bg-red-500" : percentageFilled > 75 ? "bg-amber-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${percentageFilled}%` }}
                          />
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/events/${event._id}`);
                        }}
                        disabled={isFull}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          isFull
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#1E1E1E] hover:bg-[#3B82F6] text-white shadow-sm hover:shadow-md"
                        }`}
                      >
                        <span>{language === "en" ? "View Details & Register" : "বিস্তারিত ও রেজিস্ট্রেশন"}</span>
                        <FaArrowRight className="text-[10px]" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
