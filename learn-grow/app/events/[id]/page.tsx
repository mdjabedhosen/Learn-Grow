"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useGetEventByIdQuery, useRegisterForEventMutation } from "@/redux/api/eventApi";
import {
  FaArrowLeft,
  FaCalendar,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaUsers,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaChevronRight,
  FaCheck,
  FaLock,
  FaCopy,
  FaExternalLinkAlt,
  FaLaptop,
  FaAward,
  FaGift,
  FaQuestionCircle,
  FaShareAlt,
} from "react-icons/fa";
import {
  Sparkles,
  Rocket,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Mail,
  Headphones,
  Laptop as LucideLaptop,
  Globe,
  Radio,
  MapPin,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { Spinner } from "@nextui-org/react";
import toast from "react-hot-toast";
import { sanitizeHtml } from "@/lib/sanitize";
import { trackLeadEvent, trackViewContentEvent } from "@/utils/tracking";

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  // Registration states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [registeredData, setRegisteredData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const { data: response, isLoading } = useGetEventByIdQuery(eventId, { skip: !eventId });
  const [registerForEvent, { isLoading: registering }] = useRegisterForEventMutation();

  const event = response?.data;

  // Track ViewContent for STEM event page
  useEffect(() => {
    if (event?.title) {
      trackViewContentEvent({
        title: event.title,
        category: "STEM Event",
        id: eventId,
        price: 0,
      });
    }
  }, [event?.title, eventId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phoneNumber.trim()) {
      toast.error(language === "en" ? "Please fill in all fields" : "দয়া করে সকল তথ্য পূরণ করুন");
      return;
    }

    try {
      const res = await registerForEvent({ eventId, ...formData }).unwrap();
      const payload = res?.data || res;
      
      // Track Lead event (Client-side Pixel + Server-side CAPI with SHA-256 deduplication)
      trackLeadEvent({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        program: event?.title || "STEM Event Registration",
        source: "event_detail_page",
      });

      setRegisteredData({
        registration: payload?.registration || {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        },
        meetingLink: payload?.meetingLink,
        platformType: payload?.platformType || event?.platformType,
        platformInstructions: payload?.platformInstructions || event?.platformInstructions,
        event: payload?.event || event,
      });

      toast.success(
        language === "en"
          ? "Registration successful! Live meeting details have been confirmed."
          : "রেজিস্ট্রেশন সফল হয়েছে! ক্লাসরুম লিংক ও বিস্তারিত তথ্য কনফার্ম করা হয়েছে।"
      );
    } catch (error: any) {
      toast.error(error?.data?.message || (language === "en" ? "Registration failed" : "রেজিস্ট্রেশন সম্পন্ন করা যায়নি"));
    }
  };

  const copyMeetingLink = (linkToCopy: string) => {
    if (!linkToCopy) return;
    navigator.clipboard.writeText(linkToCopy);
    setCopiedLink(true);
    toast.success(language === "en" ? "Meeting link copied to clipboard!" : "মিটিং লিংক ক্লিপবোর্ডে কপি করা হয়েছে!");
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getGoogleCalendarUrl = () => {
    if (!event) return "#";
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `${event.shortDescription || ""}\n\nPlatform: ${event.platformType || event.mode}\n${
        registeredData?.meetingLink ? `Live Link: ${registeredData.meetingLink}` : ""
      }`
    );
    const location = encodeURIComponent(
      event.mode === "Online" ? "Online Live Class" : event.venueAddress || event.venueName || "Dhaka"
    );

    const d = new Date(event.eventDate);
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    const dates = `${yyyy}${mm}${dd}T130000Z/${yyyy}${mm}${dd}T150000Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[#F8F9FA]">
        <Spinner size="lg" color="primary" />
        <p className="text-sm font-semibold text-gray-500">
          {language === "en" ? "Loading event details..." : "ইভেন্ট বিবরণ লোড হচ্ছে..."}
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
        <div className="bg-white rounded-[28px] border border-gray-100 p-8 sm:p-12 text-center max-w-lg shadow-lg">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            {language === "en" ? "Event Not Found" : "ইভেন্টটি খুঁজে পাওয়া যায়নি"}
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {language === "en"
              ? "The event you are looking for may have been completed, rescheduled, or removed."
              : "আপনি যে ইভেন্টটি খুঁজছেন তা সমাপ্ত হয়েছে অথবা সরিয়ে নেওয়া হয়েছে।"}
          </p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 bg-[#1E1E1E] text-white text-xs font-bold rounded-full hover:bg-black transition-colors cursor-pointer"
          >
            {language === "en" ? "← Back to All Events" : "← সকল ইভেন্টে ফিরে যান"}
          </button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const seatsAvailable = Math.max(0, event.maxSeats - (event.registeredCount || 0));
  const isFull = seatsAvailable <= 0;
  const canRegister = event.isRegistrationOpen && !isFull;
  const percentageFilled = Math.min(100, Math.round(((event.registeredCount || 0) / event.maxSeats) * 100));

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 pt-6 sm:pt-8 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => router.push("/events")}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-900 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs text-[#3B82F6]" />
            <span>{language === "en" ? "Back to Events" : "সকল ইভেন্টে ফিরে যান"}</span>
          </button>

          <nav className="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium truncate">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <FaChevronRight className="text-[10px]" />
            <Link href="/events" className="hover:text-gray-700">Events</Link>
            <FaChevronRight className="text-[10px]" />
            <span className="text-gray-900 font-semibold truncate max-w-xs">{event.title}</span>
          </nav>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Banner, Details, Highlights, Guests (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Banner Container with 16:9 Aspect */}
            <div className="relative w-full aspect-[16/9] rounded-[28px] overflow-hidden shadow-lg border border-gray-100 bg-gray-900">
              <img
                src={event.bannerImage || "/courses/robotics-course-banner.jpg"}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = "/courses/robotics-course-banner.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              {/* Overlay chips */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span className="px-3.5 py-1 bg-white/95 backdrop-blur-md text-[#1E1E1E] text-xs font-black rounded-full shadow-sm">
                  {event.type}
                </span>
                <span className={`px-3.5 py-1 text-xs font-bold rounded-full backdrop-blur-md text-white shadow-sm flex items-center gap-1.5 ${
                  event.mode === "Online" ? "bg-emerald-500/95" : "bg-blue-600/95"
                }`}>
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>{event.mode === "Online" ? (language === "en" ? "Live Online Workshop" : "অনলাইন লাইভ কর্মশালা") : (language === "en" ? "In-Person STEM Event" : "সরাসরি ভেন্যুতে ইভেন্ট")}</span>
                </span>
                <span className="px-3 py-1 bg-[#F59E0B] text-white text-xs font-black rounded-full shadow-sm">
                  {language === "en" ? "Free Registration" : "ফ্রি রেজিস্ট্রেশন"}
                </span>
              </div>
            </div>

            {/* Event Header Information Box */}
            <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
              
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
                  <span className="text-[#3B82F6]">Learn & Grow Live STEM</span>
                  <span>•</span>
                  <span>{language === "en" ? "Ages 10-18" : "বয়স ১০-১৮ বছর"}</span>
                  <span>•</span>
                  <span>{language === "en" ? "Batch Size: 10-15 Students" : "ব্যাচ সাইজ: ১০-১৫ জন"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1E1E1E] tracking-tight leading-tight">
                  {event.title}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
                  {event.shortDescription}
                </p>
              </div>

              {/* Date, Time, Venue 3-Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100 flex items-start gap-3">
                  <FaCalendar className="text-[#3B82F6] text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">{language === "en" ? "Date" : "তারিখ"}</p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 mt-0.5">
                      {eventDate.toLocaleDateString(language === "en" ? "en-US" : "bn-BD", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100 flex items-start gap-3">
                  <FaClock className="text-[#F59E0B] text-lg mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-gray-400">{language === "en" ? "Time" : "সময়সূচী"}</p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 mt-0.5">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-gray-100 flex items-start gap-3">
                  {event.mode === "Online" ? (
                    <FaVideo className="text-emerald-500 text-lg mt-0.5 flex-shrink-0" />
                  ) : (
                    <FaMapMarkerAlt className="text-red-500 text-lg mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase text-gray-400">
                      {event.mode === "Online" ? (language === "en" ? "Platform" : "প্ল্যাটফর্ম") : (language === "en" ? "Venue" : "ভেন্যু")}
                    </p>
                    <p className="text-xs sm:text-sm font-black text-gray-900 mt-0.5 truncate">
                      {event.mode === "Online" ? (event.platformType || "Google Meet") : (event.venueName || "Dhaka")}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECURITY & PRIVACY NOTICE: Do NOT show meeting link before register */}
              {event.mode === "Online" && !registeredData && (
                <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-blue-50/80 rounded-2xl border border-blue-200/80 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#3B82F6] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <FaLock className="text-sm" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-blue-950 flex items-center gap-2">
                      <span>{language === "en" ? "Private Live Classroom Access" : "সিকিউর লাইভ ক্লাসরুম লিংক"}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-200/70 text-blue-800">
                        {event.platformType || "Google Meet"}
                      </span>
                    </h4>
                    <p className="text-xs text-blue-900/80 leading-relaxed font-normal">
                      {language === "en"
                        ? "To ensure an engaging small-batch environment (10-15 students), the private meeting link will be revealed immediately upon completing registration and sent to your email with reminders."
                        : "প্রতিটি শিক্ষার্থীর জন্য ১০-১৫ জনের ছোট ব্যাচে সরাসরি মেন্টর গাইডেন্স নিশ্চিত করতে লাইভ ক্লাসের গুগল মিট/জুম লিংকটি ফ্রি রেজিস্ট্রেশন সম্পন্ন হওয়ার পর সরাসরি কনফার্মেশনে দেওয়া হবে এবং রেজিস্টার্ড ইমেইলেও স্বয়ংক্রিয়ভাবে পাঠিয়ে দেওয়া হবে।"}
                    </p>
                  </div>
                </div>
              )}

              {/* Offline Venue address */}
              {event.mode === "Offline" && event.venueAddress && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-900">{event.venueName}</p>
                      <p className="text-gray-600">{event.venueAddress}</p>
                    </div>
                  </div>
                  {event.googleMapLink && (
                    <a
                      href={event.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#3B82F6] hover:underline flex-shrink-0 inline-flex items-center gap-1"
                    >
                      <span>{language === "en" ? "View on Google Maps" : "গুগল ম্যাপে দেখুন"}</span>
                      <FaExternalLinkAlt className="text-[10px]" />
                    </a>
                  )}
                </div>
              )}

            </div>

            {/* 4 Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#3B82F6] flex items-center justify-center mx-auto text-base">
                  <FaUsers />
                </div>
                <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "10-15 Students" : "১০-১৫ জন শিক্ষার্থী"}</h4>
                <p className="text-[11px] text-gray-500">{language === "en" ? "Small interactive batch" : "ছোট ব্যাচ কেয়ার"}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-amber-50 text-[#F59E0B] flex items-center justify-center mx-auto text-base">
                  <FaLaptop />
                </div>
                <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "Live Hands-on" : "লাইভ প্রজেক্ট কোডিং"}</h4>
                <p className="text-[11px] text-gray-500">{language === "en" ? "Not recorded videos" : "সরাসরি কোড ল্যাব"}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto text-base">
                  <FaAward />
                </div>
                <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "Certificate" : "ভেরিফায়েড সার্টিফিকেট"}</h4>
                <p className="text-[11px] text-gray-500">{language === "en" ? "For all participants" : "অংশগ্রহণকারী সকলের জন্য"}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs text-center space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-base">
                  <FaGift />
                </div>
                <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "Scholarship" : "বিশেষ স্কলারশিপ"}</h4>
                <p className="text-[11px] text-gray-500">{language === "en" ? "Main course discount" : "পরবর্তী কোর্সে ছাড়"}</p>
              </div>
            </div>

            {/* Detailed Description & Curriculum Structure */}
            <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-lg sm:text-xl font-black text-[#1E1E1E] flex items-center gap-2.5">
                  <ClipboardList className="w-5 h-5 text-blue-600 inline" />
                  <span>{language === "en" ? "About This Event & Program Structure" : "ইভেন্ট বিস্তারিত ও কারিকুলাম"}</span>
                </h2>
                <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {event.type}
                </span>
              </div>

              <div
                className="text-sm sm:text-base text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.detailedDescription) }}
              />
            </div>

            {/* Prerequisites & Requirements */}
            <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E1E] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500 inline" />
                <span>{language === "en" ? "Class Preparation & Requirements" : "ক্লাসের প্রয়োজনীয় প্রস্তুতি"}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <LucideLaptop className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "Laptop or Desktop Computer" : "ল্যাপটপ বা কম্পিউটার"}</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">{language === "en" ? "Windows, Mac, or Linux with Google Chrome browser." : "উইন্ডোজ, ম্যাক বা লিনাক্স পিসিতে ক্রোম ব্রাউজার।"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Globe className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "Stable Internet Connection" : "স্থিতিশীল ইন্টারনেট সংযোগ"}</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">{language === "en" ? "At least 2-5 Mbps connection for seamless video." : "লাইভ স্ক্রিন শেয়ার দেখার জন্য ন্যূনতম ইন্টারনেট সংযোগ।"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Headphones className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "Headphone with Microphone" : "হেডফোন ও মাইক্রোফোন"}</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">{language === "en" ? "Recommended for speaking directly with the mentor." : "মেন্টরের সাথে কথা বলে সরাসরি প্রশ্ন করার জন্য বাঞ্ছনীয়।"}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{language === "en" ? "No Prior Coding Needed" : "কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই"}</h4>
                    <p className="text-[11px] text-gray-600 mt-0.5">{language === "en" ? "Designed for absolute beginners from scratch." : "একদম শুরু থেকে হাতে-কলমে শেখানো হবে।"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Guests / Judges */}
            {event.guests && event.guests.length > 0 && (
              <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-lg sm:text-xl font-black text-[#1E1E1E] flex items-center gap-2.5">
                  <FaUsers className="text-purple-600 text-lg" />
                  <span>{language === "en" ? "Featured Guests & Lead Mentors" : "আমন্ত্রিত বিচারক ও লিড মেন্টরবৃন্দ"}</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {event.guests.map((guest: any) => (
                    <div
                      key={guest._id}
                      className="p-4.5 bg-[#F8F9FA] rounded-2xl border border-gray-100 flex items-start gap-3.5 hover:border-gray-200 transition-all"
                    >
                      <img
                        src={guest.profileImage || "/logo.png"}
                        alt={guest.fullName}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#3B82F6] flex-shrink-0 shadow-xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                            {guest.fullName}
                          </h3>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#3B82F6]">
                            {guest.role}
                          </span>
                        </div>
                        {guest.designation && (
                          <p className="text-xs text-gray-600 truncate mt-0.5">{guest.designation}</p>
                        )}
                        {guest.organization && (
                          <p className="text-xs font-semibold text-[#3B82F6] truncate">{guest.organization}</p>
                        )}
                        {guest.bio && (
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-snug">{guest.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Asked Questions */}
            <div className="bg-white rounded-[28px] border border-gray-100 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E1E] flex items-center gap-2.5">
                <FaQuestionCircle className="text-[#3B82F6]" />
                <span>{language === "en" ? "Frequently Asked Questions" : "সাধারণ জিজ্ঞাসা ও উত্তর"}</span>
              </h2>

              <div className="space-y-3 pt-1 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 space-y-1">
                  <h4 className="font-bold text-gray-900">
                    {language === "en" ? "1. Is this live trial class completely free?" : "১. এই লাইভ ক্লাসটি কি সম্পূর্ণ ফ্রি?"}
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-normal">
                    {language === "en"
                      ? "Yes, this trial workshop is 100% free with zero hidden charges. Simply fill out the registration form to secure your seat."
                      : "হ্যাঁ, এই ওয়ার্কশপটি সম্পূর্ণ ১০০% ফ্রি এবং কোনো গোপন ফি নেই। আপনার সন্তানের আসন নিশ্চিত করতে কেবল ফর্মটি পূরণ করুন।"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 space-y-1">
                  <h4 className="font-bold text-gray-900">
                    {language === "en" ? "2. How and when will we get the meeting link?" : "২. ক্লাসের মিটিং লিংক কখন ও কীভাবে পাব?"}
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-normal">
                    {language === "en"
                      ? "The Google Meet/Zoom link is generated instantly upon registration on your screen, and an automated confirmation email with calendar reminder is also sent to your registered email address."
                      : "ফর্মটি সাবমিট করার সাথে সাথেই স্ক্রিনে লাইভ মিটিং লিংক দেখতে পাবেন এবং আপনার দেওয়া ইমেইলেও স্বয়ংক্রিয়ভাবে বিস্তারিত লিংক ও ইনস্ট্রাকশন পাঠিয়ে দেওয়া হবে।"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-gray-100 space-y-1">
                  <h4 className="font-bold text-gray-900">
                    {language === "en" ? "3. What if my child misses the live class?" : "৩. কোনো কারণে ক্লাস মিস হলে কি রেকর্ডিং পাওয়া যাবে?"}
                  </h4>
                  <p className="text-gray-600 leading-relaxed font-normal">
                    {language === "en"
                      ? "Registered participants will receive the session project code, slides, and class summary to their email."
                      : "হ্যাঁ, রেজিস্টার্ড সকল শিক্ষার্থী ও অভিভাবকদের ক্লাসের প্রজেক্ট সোর্স কোড এবং গুরুত্বপূর্ণ সামারি ইমেইলে সরবরাহ করা হবে।"}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Registration & Confirmation Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[28px] border-2 border-[#3B82F6]/30 shadow-xl p-6 lg:sticky lg:top-24 space-y-5 overflow-hidden">
              
              {/* STATE A: REGISTRATION CONFIRMED (POST-REGISTER SCREEN) */}
              {registeredData ? (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  
                  {/* Confirmed Banner */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1.5">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white text-xl flex items-center justify-center mx-auto shadow-md">
                      <FaCheck />
                    </div>
                    <h3 className="text-base font-black text-emerald-950 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                      <span>{language === "en" ? "Registration Confirmed!" : "রেজিস্ট্রেশন সফল হয়েছে!"}</span>
                    </h3>
                    <p className="text-xs text-emerald-800 font-medium">
                      {language === "en" ? "Your seat has been reserved." : "আপনার আসনটি নিশ্চিত করা হয়েছে।"}
                    </p>
                  </div>

                  {/* Registered Details Box */}
                  <div className="p-3.5 bg-[#F8F9FA] rounded-2xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center pb-1.5 border-b border-gray-200/60">
                      <span className="text-gray-500 font-semibold">{language === "en" ? "Student Name" : "শিক্ষার্থীর নাম"}</span>
                      <span className="font-bold text-gray-900">{registeredData.registration.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-gray-200/60">
                      <span className="text-gray-500 font-semibold">{language === "en" ? "Email" : "ইমেইল"}</span>
                      <span className="font-semibold text-gray-900 truncate max-w-[170px]">{registeredData.registration.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-semibold">{language === "en" ? "Event Date" : "তারিখ ও সময়"}</span>
                      <span className="font-bold text-[#3B82F6]">{event.startTime} - {event.endTime}</span>
                    </div>
                  </div>

                  {/* REVEALED MEETING LINK FOR ONLINE EVENTS */}
                  {event.mode === "Online" && registeredData.meetingLink && (
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-2xl border-2 border-[#3B82F6]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                          <FaVideo className="text-[#3B82F6]" />
                          <span>{language === "en" ? "Live Meeting Room Access" : "লাইভ ক্লাসরুম এক্সেস"}</span>
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-[#3B82F6]">
                          {registeredData.platformType || "Google Meet"}
                        </span>
                      </div>

                      {/* 1-Click Join Button */}
                      <a
                        href={registeredData.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center"
                      >
                        <Rocket className="w-4 h-4 text-white inline" />
                        <span>{language === "en" ? "Join Live Meeting Now" : "সরাসরি ক্লাসে যোগ দিন"}</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </a>

                      {/* Copy Link Button */}
                      <button
                        type="button"
                        onClick={() => copyMeetingLink(registeredData.meetingLink)}
                        className="w-full py-2 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FaCopy className="text-xs text-gray-500" />
                        <span>
                          {copiedLink
                            ? (language === "en" ? "Link Copied!" : "লিংক কপি হয়েছে!")
                            : (language === "en" ? "Copy Meeting Link" : "মিটিং লিংক কপি করুন")}
                        </span>
                      </button>

                      <p className="text-[11px] text-blue-900/80 text-center leading-snug flex items-center justify-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-blue-600 inline flex-shrink-0" />
                        <span>
                          {language === "en"
                            ? "We have also emailed this meeting link to your email address."
                            : "এই লিংকটি আপনার দেওয়া ইমেইলেও পাঠিয়ে দেওয়া হয়েছে।"}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Add to Google Calendar CTA */}
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <FaCalendar className="text-amber-500 text-xs" />
                    <span>{language === "en" ? "Add to Google Calendar" : "গুগল ক্যালেন্ডারে রিমাইন্ডার রাখুন"}</span>
                  </a>

                  {/* Register Another Participant */}
                  <button
                    type="button"
                    onClick={() => {
                      setRegisteredData(null);
                      setFormData({ fullName: "", email: "", phoneNumber: "" });
                    }}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer pt-1"
                  >
                    {language === "en" ? "← Register another student" : "← অপর শিক্ষার্থী রেজিস্ট্রেশন করুন"}
                  </button>
                </div>
              ) : (
                /* STATE B: ACTIVE REGISTRATION FORM (BEFORE REGISTER) */
                <div className="space-y-4">
                  {/* Header Ribbon */}
                  <div className="bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white py-2 px-3.5 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs">
                    <Flame className="w-3.5 h-3.5 text-amber-300 inline" />
                    <span>{language === "en" ? "Live Registration Open" : "লাইভ রেজিস্ট্রেশন চলছে"}</span>
                  </div>

                  {/* Seat Counter */}
                  <div className="text-center pt-1 pb-1">
                    <div className="text-3xl font-black text-[#1E1E1E]">
                      {isFull ? (
                        <span className="text-red-500">{language === "en" ? "Full" : "আসন পূর্ণ"}</span>
                      ) : (
                        <span>{seatsAvailable}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      {language === "en" ? "Seats available out of " : "টি আসন অবশিষ্ট রয়েছে মোট "} {event.maxSeats}
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFull ? "bg-red-500" : percentageFilled > 75 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${percentageFilled}%` }}
                      />
                    </div>
                  </div>

                  {/* Registration Form */}
                  {canRegister ? (
                    <form onSubmit={handleRegister} className="space-y-3.5 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "en" ? "Student's Full Name" : "শিক্ষার্থীর পূর্ণ নাম"} *
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder={language === "en" ? "e.g. Tanvir Hasan" : "যেমন: তানভীর হাসান"}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "en" ? "Guardian Email Address" : "অভিভাবকের ইমেইল অ্যাড্রেস"} *
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="parent@example.com"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === "en" ? "Phone / WhatsApp" : "ফোন বা হোয়াটসঅ্যাপ নম্বর"} *
                        </label>
                        <div className="relative">
                          <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                          <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="017XXXXXXXX"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={registering}
                        className="w-full py-3.5 bg-[#1E1E1E] hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {registering ? (
                          <>
                            <Spinner size="sm" color="white" />
                            <span>{language === "en" ? "Confirming Seat..." : "আসন নিশ্চিত হচ্ছে..."}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === "en" ? "Confirm Free Registration" : "ফ্রি রেজিস্ট্রেশন সম্পন্ন করুন"}</span>
                            <span>→</span>
                          </>
                        )}
                      </button>

                      <p className="text-[11px] text-gray-400 text-center leading-snug flex items-center justify-center gap-1">
                        <Lock size={12} className="text-gray-400 inline" />
                        <span>
                          {language === "en"
                            ? "Safe & secure. Meeting link sent instantly upon registration."
                            : "সম্পূর্ণ নিরাপদ। রেজিস্ট্রেশন করার সাথে সাথেই মিটিং লিংক পাবেন।"}
                        </span>
                      </p>
                    </form>
                  ) : (
                    <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-center">
                      <p className="text-xs font-black text-red-600">
                        {language === "en" ? "Registration is currently full or closed." : "রেজিস্ট্রেশন বর্তমানে বন্ধ রয়েছে বা আসন পূর্ণ।"}
                      </p>
                    </div>
                  )}

                  {/* 3 Quick Assurances */}
                  <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-emerald-500 text-xs flex-shrink-0" />
                      <span>{language === "en" ? "Verified Certificate of Completion" : "ভেরিফায়েড পার্টিসিপেশন সার্টিফিকেট"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-emerald-500 text-xs flex-shrink-0" />
                      <span>{language === "en" ? "Small batch: 10-15 students only" : "১০-১৫ জনের ছোট ব্যাচ ওয়ান-টু-ওয়ান কেয়ার"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-emerald-500 text-xs flex-shrink-0" />
                      <span>{language === "en" ? "Source code and slides provided" : "সম্পূর্ণ সোর্স কোড ও ক্লাস ম্যাটেরিয়ালস"}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
