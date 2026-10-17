"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Spinner,
  Alert,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiCheck,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlineArrowLeft,
  HiArrowRight,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { useGetComboByIdQuery, useGetUserComboPurchasesQuery } from "@/redux/api/comboApi";
import { IComboOrder } from "@/types/combo.types";

interface ComboDetailsProps {
  comboId: string;
}

export default function ComboDetails({ comboId }: ComboDetailsProps) {
  const router = useRouter();
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

  const safeComboId = (comboId || "").split("?")[0];
  const { data: comboData, isLoading: comboLoading } = useGetComboByIdQuery(safeComboId, {
    skip: !safeComboId,
  });
  const { data: purchasesData } = useGetUserComboPurchasesQuery();

  const combo = (comboData as any)?.data || (comboData as any)?.combo || (comboData as any);
  const purchases = purchasesData?.data || [];
  const courses = combo?.courses || [];

  // Check if user already purchased this combo
  const hasPurchased = purchases.some(
    (purchase: IComboOrder) => purchase.comboId?._id === safeComboId
  );

  if (comboLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <Spinner size="lg" color="primary" />
        <p className="text-gray-500 font-medium">
          {language === "en" ? "Loading bundle details..." : "বান্ডেলের তথ্য লোড হচ্ছে..."}
        </p>
      </div>
    );
  }

  if (!safeComboId || !combo) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl mx-auto mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {language === "en" ? "Bundle Not Found" : "বান্ডেলটি খুঁজে পাওয়া যায়নি"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {language === "en"
            ? "The requested course bundle is unavailable or may have been updated."
            : "অনুরোধকৃত কোর্স বান্ডেলটি বর্তমানে অনুপলব্ধ বা আপডেট করা হয়েছে।"}
        </p>
        <Button as={Link} href="/bundle" color="primary" radius="full" className="font-bold px-6">
          {language === "en" ? "← Back to Bundles" : "← সকল বান্ডেল দেখুন"}
        </Button>
      </div>
    );
  }

  const primaryPrice = combo.discountPrice || combo.price || 5749;
  const regularPrice = combo.price || 7499;
  const savings = regularPrice > primaryPrice ? regularPrice - primaryPrice : 1750;

  // Real curriculum learnings for robotics & arduino
  const learnings = [
    {
      titleEn: "Hands-on Robot Building & Hardware Wiring",
      titleBn: "নিজে হাতে সম্পূর্ণ রোবট কিট অ্যাসেম্বল ও ওয়্যারিং",
      descEn: "Assemble physical robot chassis, connect micro-controllers, motors, and wire breadboards with confidence.",
      descBn: "নিজে হাতে চ্যাসিস ও সার্কিট ব্রেডবোর্ডে আর্দুইনো বোর্ড, ব্যাটারি ও মোটর সংযোগ দিয়ে সচল রোবট তৈরি।",
    },
    {
      titleEn: "Sense → Think → Act Robotic Architecture",
      titleBn: "Sense → Think → Act আর্কিটেকচার অনুধাবন",
      descEn: "Master how sensors collect data, microcontrollers process inputs, and actuators perform intelligent physical motion.",
      descBn: "সেন্সর দিয়ে তথ্য নেওয়া, কোডিং দিয়ে লজিক চালনা এবং মোটরের সাহায্যে স্বয়ংক্রিয়ভাবে কাজ করার বাস্তব মডেল।",
    },
    {
      titleEn: "Visual Scratch & C++ Code Logic",
      titleBn: "ভিজ্যুয়াল স্ক্র্যাচ ও সি++ কোডিং লজিক",
      descEn: "Write block-based visual programs and transition into genuine syntax to control motors, LEDs, and buzzers.",
      descBn: "ব্লক কোডিং থেকে শুরু করে বাস্তব কোডিং সিনট্যাক্স দিয়ে বিভিন্ন হার্ডওয়্যার মডিউল নিয়ন্ত্রণ।",
    },
    {
      titleEn: "Autonomous Obstacle Detection & Sensor Integration",
      titleBn: "অবস্ট্যাকল ডিটেকশন ও স্বয়ংক্রিয় সেন্সর ইন্টিগ্রেশন",
      descEn: "Program ultrasonic distance sensors to detect obstacles and write obstacle-avoiding smart navigation algorithms.",
      descBn: "আল্ট্রাসনিক সেন্সর ব্যবহার করে বাধা শনাক্ত করা এবং স্বয়ংক্রিয় বাধা-এড়ানো স্মার্ট রোবট প্রোগ্রামিং।",
    },
    {
      titleEn: "Debugging, Logical Problem Solving & Creativity",
      titleBn: "লজিক্যাল প্রবলেম সলভিং ও ত্রুটি সংশোধন (Debugging)",
      descEn: "Empower kids to think like engineers by testing circuits, fixing wiring errors, and building custom inventive prototypes.",
      descBn: "মুখস্থ বিদ্যা নয়, সরাসরি সার্কিট পরীক্ষা, ভুল খুঁজে বের করা এবং নিজের চিন্তায় নতুন উদ্ভাবনের আত্মবিশ্বাস অর্জন।",
    },
  ];

  // Hardware kit inventory
  const kitItems = [
    { name: "Arduino UNO R3 Microcontroller Board", qty: "1 Pc", icon: "⚡" },
    { name: "Ultrasonic Distance Sensor (HC-SR04)", qty: "1 Pc", icon: "📡" },
    { name: "Micro Servo Motor (SG90)", qty: "1 Pc", icon: "🔄" },
    { name: "400-Point Solderless Breadboard", qty: "1 Pc", icon: "🔌" },
    { name: "65-Piece Multi-Color Jumper Wires", qty: "1 Set", icon: "🌈" },
    { name: "5V DC Toy Motor with Fan Blade", qty: "1 Pc", icon: "💨" },
    { name: "High-Brightness LEDs & Resistors Set", qty: "15 Pcs", icon: "💡" },
    { name: "Piezo Buzzer & Push Tactile Buttons", qty: "4 Pcs", icon: "🔔" },
    { name: "9V Battery Snap Connector with DC Jack", qty: "1 Pc", icon: "🔋" },
    { name: "High-Speed USB Programming Cable", qty: "1 Pc", icon: "💻" },
  ];

  const resolveBannerImage = (imgUrl?: string, title?: string): string => {
    // If the image is the old Cloudinary flyer or contains old gemini link, override it
    if (
      !imgUrl ||
      imgUrl.includes("gemini.google.com") ||
      imgUrl.includes("course-69ca5603e9e96ed80529474a") ||
      imgUrl.includes("daq7v0wmf/image/upload")
    ) {
      const lower = (title || "").toLowerCase();
      if (lower.includes("python") || lower.includes("পাইথন")) {
        return "/courses/python-course-banner.jpg";
      }
      return "/courses/robotics-course-banner.jpg";
    }

    // If title or name is robotics, prefer our clean modern generated banner
    const lower = (title || "").toLowerCase();
    if (
      lower.includes("robotics") ||
      lower.includes("রোবটিক্স") ||
      lower.includes("arduino") ||
      lower.includes("আর্ডুইনো")
    ) {
      return "/courses/robotics-course-banner.jpg";
    }

    return imgUrl;
  };

  const heroImage = resolveBannerImage(combo.thumbnail, combo.name);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-8 text-[#2C2C2C]">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/#pricing"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#3B82F6] transition-colors"
        >
          <HiOutlineArrowLeft className="text-base" />
          <span>{language === "en" ? "Back to Pricing Plans" : "প্রাইসিং প্ল্যানে ফিরে যান"}</span>
        </Link>
      </div>

      {hasPurchased && (
        <Alert color="success" className="mb-8 rounded-2xl border border-green-200">
          <p className="font-bold">
            {language === "en"
              ? "🎉 You already own this bundle! Head to your dashboard to access your classes."
              : "🎉 আপনি ইতিমধ্যেই এই বান্ডেলটি কিনেছেন! ক্লাসে অংশ নিতে ড্যাশবোর্ডে যান।"}
          </p>
        </Alert>
      )}

      {/* Hero Banner Section (Clean Kodland EdTech Presentation) */}
      <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-6 sm:p-10 md:p-12 mb-10 shadow-2xl border border-slate-700/50">
        {/* Background glow orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#3B82F6] text-white text-xs font-black uppercase tracking-wider shadow-sm">
                <HiOutlineSparkles className="text-sm" />
                {language === "en" ? "All-In-One STEM Bundle" : "সম্পূর্ণ অল-ইন-ওয়ান বান্ডেল"}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                <HiOutlineTruck className="text-sm" />
                {language === "en" ? "Free Home Delivery" : "ফ্রি হোম ডেলিভারি"}
              </span>
            </div>

            <h1
              className={`text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight ${
                language === "bn" ? "font-siliguri" : ""
              }`}
            >
              {combo.name}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {language === "en"
                ? "A complete practical package featuring 1 full live Robotics course plus a genuine Arduino Starter Kit delivered to your home. Turn screen time into real innovation!"
                : "১টি পূর্ণাঙ্গ লাইভ রোবটিক্স কোর্স এবং সাথে একটি অরিজিনাল Arduino স্টার্টার কিট আপনার ঠিকানায় সরাসরি হোম ডেলিভারি। মুখস্থ বিদ্যা নয়, স্ক্রিন টাইমকে মেকার দক্ষতায় রূপান্তরের নির্ভরযোগ্য সলিউশন।"}
            </p>

            {/* Quick Specs Badges */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-semibold">
                <HiOutlineAcademicCap className="text-blue-400 text-sm" />
                {language === "en" ? "Live Instructor-Led Lab" : "লাইভ মেন্টর গাইডেন্স"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-semibold">
                <HiOutlineCube className="text-amber-400 text-sm" />
                {language === "en" ? "Lifetime Hardware Kit" : "লাইফটাইম কিট ওনারশিপ"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-semibold">
                <HiOutlineShieldCheck className="text-emerald-400 text-sm" />
                {language === "en" ? "7-Day Money-Back Guarantee" : "৭ দিনের সন্তুষ্টি গ্যারান্টি"}
              </span>
            </div>

            {/* Hero Price & Action Row */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base text-slate-400 line-through font-bold">
                  ৳ {regularPrice.toLocaleString()}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ৳ {primaryPrice.toLocaleString()}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black">
                  {language === "en" ? `Save ৳${savings.toLocaleString()}` : `৳${savings.toLocaleString()} সাশ্রয়!`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  as={Link}
                  href={`/checkout?plan=combo&comboId=${safeComboId}`}
                  className="bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-sm px-7 py-3 rounded-full shadow-lg shadow-blue-500/30 hover:scale-105 transition-all"
                  size="lg"
                  isDisabled={hasPurchased}
                >
                  <span>{hasPurchased ? (language === "en" ? "Owned" : "কেনা হয়েছে") : (language === "en" ? "Get Bundle Access" : "বান্ডেলটি বুক করুন")}</span>
                  <HiArrowRight className="text-base" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-[24px] overflow-hidden border-2 border-slate-700 shadow-2xl relative bg-slate-800/60 aspect-[4/3] group">
              <img
                src={heroImage}
                alt={combo.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/courses/robotics-course-banner.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                  {language === "en" ? "Physical Kit + Live Course" : "হার্ডওয়্যার কিট + লাইভ কোর্স"}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  Junior Robotics & Arduino Lab
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Content & Details) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: What You'll Learn (STEM Focused) */}
          <div className="bg-white rounded-[28px] border-2 border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#3B82F6] flex items-center justify-center text-xl">
                <HiOutlineAcademicCap />
              </div>
              <h2
                className={`text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {language === "en" ? "What Your Child Will Master" : "শিক্ষার্থীরা এই কোর্সে যা যা শিখবে"}
              </h2>
            </div>

            <div className="space-y-4">
              {learnings.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-gray-50/80 border border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiCheck className="text-sm font-bold" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5">
                      {language === "en" ? item.titleEn : item.titleBn}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {language === "en" ? item.descEn : item.descBn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Included Robotics Kit Hardware Showcase */}
          <div className="bg-white rounded-[28px] border-2 border-amber-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden bg-gradient-to-b from-amber-50/30 via-white to-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#B45309] flex items-center justify-center text-xl">
                  <HiOutlineCube />
                </div>
                <div>
                  <h2
                    className={`text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight ${
                      language === "bn" ? "font-siliguri" : ""
                    }`}
                  >
                    {language === "en" ? "Included Robotics Hardware Kit" : "🎁 রোবটিক্স কিটে যা যা থাকছে"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {language === "en"
                      ? "Genuine components delivered right to your doorstep"
                      : "সরাসরি আপনার ঠিকানায় হোম ডেলিভারি করা হবে"}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shadow-sm">
                <HiOutlineTruck className="text-sm" />
                {language === "en" ? "Free Nationwide Delivery" : "সারাদেশে ফ্রি ডেলিভারি"}
              </span>
            </div>

            {/* Hardware Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {kitItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                    {item.qty}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-100/60 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <p className="leading-relaxed">
                {language === "en"
                  ? "Orders are dispatched within 24-48 hours via premium courier. You will receive an SMS tracking code."
                  : "অর্ডার কনফার্মের ২৪-৪৮ ঘণ্টার মধ্যে কিট কুরিয়ারের মাধ্যমে পাঠিয়ে ট্র্যাকিং নম্বর এসএমএস করে দেওয়া হবে।"}
              </p>
            </div>
          </div>

          {/* Section 3: Included Courses Showcase */}
          <div className="bg-white rounded-[28px] border-2 border-gray-100 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className={`text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {language === "en" ? "Included Live Courses" : "অন্তর্ভুক্ত লাইভ কোর্সসমূহ"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {language === "en"
                    ? "Full access to live classes, recordings, and projects"
                    : "সম্পূর্ণ লাইভ ক্লাস, রেকর্ডিং ও মেন্টরিং অ্যাক্সেস"}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-blue-100 text-[#3B82F6] text-xs font-bold">
                {courses.length} {language === "en" ? "Course Included" : "টি কোর্স অন্তর্ভুক্ত"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 mb-3">
                      <img
                        src={resolveBannerImage(course.thumbnail, course.title) || heroImage}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "/courses/robotics-course-banner.jpg";
                        }}
                      />
                      <div className="absolute top-2 left-2">
                        <span className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold">
                          {course.level || "Beginner (10-16 yrs)"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                      {course.description ? course.description.replace(/<[^>]*>?/gm, "").slice(0, 90) : "Hands-on Junior Robotics curriculum"}...
                    </p>
                  </div>

                  <Button
                    as={Link}
                    href={`/courses/${course.slug || (course.title?.toLowerCase().includes("python") ? "python-programming-for-teens" : "junior-robotics")}`}
                    size="sm"
                    className="w-full font-bold bg-[#EAF4FB] text-[#1B5C8A] hover:bg-[#3B82F6] hover:text-white transition-colors"
                    radius="full"
                  >
                    {language === "en" ? "View Full Curriculum" : "কোর্স কারিকুলাম দেখুন"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 100% Satisfaction Guarantee */}
          <div className="bg-gradient-to-r from-[#FFF8E1] via-white to-[#EAF4FB] border-2 border-[#FFE082] rounded-[28px] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                <HiOutlineShieldCheck />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#2C2C2C] mb-1">
                  {language === "en" ? "7-Day 100% Money-Back Guarantee" : "৭ দিনের ১০০% সন্তুষ্টির গ্যারান্টি"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xl">
                  {language === "en"
                    ? "If your child does not love their first live session, simply let us know within 7 days for a full, hassle-free refund. No questions asked!"
                    : "আপনার সন্তান যদি প্রথম লাইভ ক্লাসের পর সন্তুষ্ট না হয়, ৭ দিনের মধ্যে আমাদের জানালেই কোনো প্রশ্ন ছাড়া সম্পূর্ণ রিফান্ড সাপোর্ট পাবেন।"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sticky Purchase Summary) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-white rounded-[28px] border-2 border-[#3B82F6] p-6 sm:p-7 shadow-[0_12px_40px_rgba(59,130,246,0.12)] space-y-6 ring-4 ring-blue-50/50">
            {/* Price block */}
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                {language === "en" ? "Bundle Investment" : "সর্বমোট বান্ডেল মূল্য"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-[#2C2C2C]">
                  ৳ {primaryPrice.toLocaleString()}
                </span>
                <span className="text-sm line-through text-gray-400 font-bold">
                  ৳ {regularPrice.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-black text-[#B45309] bg-[#FFF8E1] px-2.5 py-1 rounded-md border border-[#FFE082]">
                  {language === "en" ? `Save ৳${savings.toLocaleString()}` : `🔥 ৳${savings.toLocaleString()} সাশ্রয়!`}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  {language === "en" ? "One-time payment" : "এককালীন পরিশোধ"}
                </span>
              </div>
            </div>

            {/* Benefits summary */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="text-[#3B82F6] text-base flex-shrink-0" />
                <span>{language === "en" ? "1 Full Live Robotics Course" : "১টি সম্পূর্ণ লাইভ রোবটিক্স কোর্স"}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="text-[#3B82F6] text-base flex-shrink-0" />
                <span>{language === "en" ? "Genuine Hardware Starter Kit" : "সম্পূর্ণ Arduino হার্ডওয়্যার কিট"}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="text-[#3B82F6] text-base flex-shrink-0" />
                <span>{language === "en" ? "Free Courier Home Delivery" : "ফ্রি হোম ডেলিভারি সার্ভিস"}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="text-[#3B82F6] text-base flex-shrink-0" />
                <span>{language === "en" ? "Lifetime Recording & Code Access" : "লাইফটাইম রেকর্ডিং ও কোড অ্যাক্সেস"}</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineCheckCircle className="text-[#3B82F6] text-base flex-shrink-0" />
                <span>{language === "en" ? "Official Verified Certificate" : "ভেরিফাইড কোর্স সার্টিফিকেট"}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="space-y-3 pt-2">
              <Button
                as={Link}
                href={`/checkout?plan=combo&comboId=${safeComboId}`}
                className="w-full py-4 rounded-full font-black text-sm sm:text-base bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                size="lg"
                isDisabled={hasPurchased}
              >
                {hasPurchased
                  ? language === "en" ? "Already Enrolled" : "ইতিমধ্যেই কিনেছেন"
                  : language === "en" ? "Enroll in Bundle Now" : "এখনই বান্ডেলটি বুক করুন"}
              </Button>

              <Button
                as={Link}
                href="/#pricing"
                variant="bordered"
                className="w-full rounded-full font-bold text-xs text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                {language === "en" ? "Compare All Plans" : "সকল প্ল্যান তুলনা করুন"}
              </Button>

              {hasPurchased && (
                <Button
                  as={Link}
                  href="/student/courses"
                  className="w-full rounded-full font-bold bg-emerald-600 text-white"
                >
                  {language === "en" ? "Go to My Dashboard" : "আমার ড্যাশবোর্ডে যান"}
                </Button>
              )}
            </div>

            {/* Trusted payment badge */}
            <div className="pt-2 border-t border-gray-100 text-center">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                {language === "en" ? "Secure Instant Payment" : "নিরাপদ ইনস্ট্যান্ট পেমেন্ট"}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 text-[11px] font-bold text-gray-600">
                <span className="px-2.5 py-1 rounded bg-gray-50 border border-gray-200">bKash</span>
                <span className="px-2.5 py-1 rounded bg-gray-50 border border-gray-200">Nagad</span>
                <span className="px-2.5 py-1 rounded bg-gray-50 border border-gray-200">Cards</span>
                <span className="px-2.5 py-1 rounded bg-gray-50 border border-gray-200">Rocket</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 border-t border-gray-200 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md p-3.5 flex items-center justify-between gap-4 shadow-2xl z-40">
        <div>
          <span className="text-lg font-black text-[#2C2C2C]">
            ৳ {primaryPrice.toLocaleString()}
          </span>
          <span className="block text-[10px] font-bold text-emerald-600">
            {language === "en" ? "Free Home Delivery" : "ফ্রি ডেলিভারি সহ"}
          </span>
        </div>
        <Button
          as={Link}
          href={`/checkout?plan=combo&comboId=${safeComboId}`}
          className="flex-1 rounded-full font-black text-sm bg-[#3B82F6] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
          size="md"
          isDisabled={hasPurchased}
        >
          {hasPurchased
            ? language === "en" ? "Purchased" : "কেনা হয়েছে"
            : language === "en" ? "Buy Bundle Now" : "বান্ডেলটি বুক করুন"}
        </Button>
      </div>
    </div>
  );
}
