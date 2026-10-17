"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaQuestionCircle,
  FaChevronDown,
  FaUsers,
  FaVideo,
  FaAward,
  FaCreditCard,
  FaLaptop,
  FaWhatsapp,
  FaPhoneAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

interface FAQItem {
  id: string;
  category: "live" | "curriculum" | "certificate" | "payment" | "support";
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  highlightBn?: string;
  highlightEn?: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Live Classes & Batches
  {
    id: "live-vs-recorded",
    category: "live",
    questionBn: "ক্লাসগুলো কি রেকর্ডেড নাকি লাইভ ইন্টারঅ্যাক্টিভ?",
    questionEn: "Are the classes pre-recorded videos or live interactive?",
    answerBn:
      "Learn & Grow-তে কোনো প্রি-রেকর্ডেড ভিডিও কোর্স বিক্রি করা হয় না! আমাদের প্রতিটি ক্লাস ১০০% লাইভ এবং ইন্টারঅ্যাক্টিভ। গুগল মিট বা জুম প্ল্যাটফর্মে সরাসরি অভিজ্ঞ মেন্টরের সাথে স্ক্রিন শেয়ার করে শিক্ষার্থীরা নিজের হাতে কোড করে এবং ক্লাসেই যে কোনো প্রশ্ন জিজ্ঞাসা করতে পারে।",
    answerEn:
      "We do not sell pre-recorded video tutorials! Every single class at Learn & Grow is 100% live and interactive via Google Meet/Zoom, where students write code under real-time mentor supervision and resolve doubts on the spot.",
    highlightBn: "১০০% লাইভ ক্লাস • কোনো রেকর্ডেড ভিডিও নয়",
    highlightEn: "100% Live Classes • No Recorded Tutorials",
  },
  {
    id: "batch-size",
    category: "live",
    questionBn: "প্রতিটি ব্যাচে সর্বোচ্চ কতজন শিক্ষার্থী থাকে?",
    questionEn: "What is the maximum student batch size in each class?",
    answerBn:
      "আমাদের প্রতিটি ব্যাচে সর্বোচ্চ ১০-১৫ জন শিক্ষার্থী থাকে। ছোট ব্যাচ সাইজ নিশ্চিত করার মূল উদ্দেশ্য হলো ক্লাসের প্রতিটি শিক্ষার্থীর কোডিংয়ের প্রতি মেন্টর যেন ব্যক্তিগত মনোযোগ (1-on-1 Guidance) দিতে পারেন এবং স্ক্রিন শেয়ারের মাধ্যমে তাৎক্ষণিক কোড ডিবাগিং সমাধান করতে পারেন।",
    answerEn:
      "Each batch is strictly capped at 10-15 students. We maintain this small batch size so every child gets personalized 1-on-1 attention, interactive participation, and instant live code debugging.",
    highlightBn: "১০-১৫ জনের এক্সক্লুসিভ ছোট ব্যাচ",
    highlightEn: "Small Batches of 10-15 Students Only",
  },
  {
    id: "missed-classes",
    category: "live",
    questionBn: "কোনো ক্লাস মিস হলে কি রেকর্ডিং বা ব্যাকআপ পাওয়া যাবে?",
    questionEn: "What happens if my child misses a live session?",
    answerBn:
      "হ্যাঁ! প্রতিটি লাইভ ক্লাসের ফুল এইচডি রেকর্ডিং, স্লাইডস এবং প্রজেক্টের সোর্স কোড স্বয়ংক্রিয়ভাবে স্টুডেন্ট ড্যাশবোর্ডে যুক্ত হয়ে যায়। এছাড়া কোনো ক্লাসে কোনো টপিক বুঝতে সমস্যা হলে মেন্টরের সাথে উইকেন্ড ডাউট সলভিং সেশনে সরাসরি ক্লিয়ার করে নেওয়া যায়।",
    answerEn:
      "Yes! Full HD recordings of every live session, along with slides and source code, are archived in the Student Dashboard. Additionally, students can join weekend 1-on-1 doubt-clearing sessions to catch up.",
  },

  // 2. Curriculum & Ages
  {
    id: "age-groups",
    category: "curriculum",
    questionBn: "কোন বয়সের শিশু-কিশোররা এই কোর্সগুলোতে অংশ নিতে পারবে?",
    questionEn: "What age groups are these STEM & coding courses designed for?",
    answerBn:
      "আমাদের কারিকুলাম ৭ থেকে ১৮ বছর বয়সী স্কুল ও কলেজ শিক্ষার্থীদের মানসিক বিকাশ ও বয়স উপযোগী করে তৈরি। জুনিয়রদের (বয়স ৭-১২) জন্য ভিজ্যুয়াল ব্লক ও স্ক্র্যাচ কোডিং, আর টিনএজারদের (বয়স ১২-১৮) জন্য রয়েছে ইন্ডাস্ট্রি-স্ট্যান্ডার্ড পাইথন প্রোগ্রামিং, এআই চ্যাটবট এবং আর্দুইনো রোবটিক্স।",
    answerEn:
      "Our curriculum is age-tailored for students aged 7 to 18. We offer visual block coding and creative logic for juniors (ages 7-12), and professional Python 3, AI Chatbot engineering, and Arduino Robotics for teens (ages 12-18).",
    highlightBn: "বয়স ৭-১৮ বছর উপযোগী স্পেশাল কারিকুলাম",
    highlightEn: "Customized for Ages 7 to 18",
  },
  {
    id: "prior-experience",
    category: "curriculum",
    questionBn: "কোর্স শুরুর আগে কি কোনো পূর্ব প্রোগ্রামিং অভিজ্ঞতার প্রয়োজন আছে?",
    questionEn: "Is any prior coding or electronics background required?",
    answerBn:
      "একদমই কোনো পূর্ব অভিজ্ঞতার প্রয়োজন নেই! আমাদের প্রতিটি কোর্স একদম জিরো লেভেল (Zero Ground) থেকে হাতে-কলমে শুরু হয়। কম্পিউটার চালু করা এবং টাইপ করার সাধারণ ধারণা থাকলেই মেন্টররা ধাপে ধাপে জটিল অ্যালগরিদম ও সার্কিট মেকিং শিখিয়ে দেন।",
    answerEn:
      "Zero prior experience required! Every track starts from absolute fundamentals. As long as the student knows basic computer operations and typing, our mentors will guide them step-by-step from zero to creator.",
  },
  {
    id: "robotics-kit",
    category: "curriculum",
    questionBn: "রোবটিক্স কোর্সের হার্ডওয়্যার কিট কীভাবে সংগ্রহ করব?",
    questionEn: "How do we receive the hardware kit for the Robotics course?",
    answerBn:
      "জুনিয়র রোবটিক্স কোর্সে এনরোল করার পর আমাদের অফিশিয়াল 'Learn & Grow Robotics Starter Kit' (আর্দুইনো বোর্ড, আল্ট্রাসনিক সেন্সর, মোটর ড্রাইভার, জাম্পার ওয়্যার, ব্রেডবোর্ড ইত্যাদি) কুরিয়ারের মাধ্যমে সারা বাংলাদেশের যে কোনো ঠিকানায় শিক্ষার্থীর ঘরে পৌঁছে দেওয়া হয়।",
    answerEn:
      "Upon enrolling in our Junior Robotics course, our custom 'Learn & Grow Robotics Starter Kit' (Arduino microcontroller, ultrasonic sensors, motors, chassis, jumper wires, and breadboard) is shipped directly to your home anywhere in Bangladesh.",
    highlightBn: "হোম ডেলিভারিতে রোবটিক্স কিট সরবরাহ",
    highlightEn: "Doorstep Hardware Kit Delivery",
  },

  // 3. Certificates & Olympiad
  {
    id: "certification",
    category: "certificate",
    questionBn: "কোর্স সম্পন্ন করার পর কি সার্টিফিকেট দেওয়া হয়?",
    questionEn: "Do students receive a verified certificate upon completion?",
    answerBn:
      "হ্যাঁ! প্রতিটি মডিউল সম্পন্ন করে ফাইনাল ক্যাপস্টোন প্রজেক্ট জমা দেওয়ার পর শিক্ষার্থীদের ভেরিফায়েড ডিজিটাল সার্টিফিকেট এবং ডিটেইলড পারফরম্যান্স রিপোর্ট প্রদান করা হয়। এই সার্টিফিকেট স্কুল ও কলেজ পর্যায়ের বিজ্ঞান মেলা ও পোর্টফোলিওতে ব্যবহারযোগ্য।",
    answerEn:
      "Yes! Upon completing the interactive modules and submitting the final capstone project, students receive a verified digital certificate and performance evaluation report suitable for school profiles and academic portfolios.",
    highlightBn: "ভেরিফায়েড ডিজিটাল সার্টিফিকেট",
    highlightEn: "Verified Digital Certificate",
  },
  {
    id: "olympiad-prep",
    category: "certificate",
    questionBn: "শিক্ষার্থীরা কি জাতীয় রোবটিক্স বা কোডিং প্রতিযোগিতায় অংশ নিতে পারবে?",
    questionEn: "Will students be prepared for national and international STEM Olympiads?",
    answerBn:
      "অবশ্যই! আমাদের শিক্ষার্থীদের বাংলাদেশ রোবট অলিম্পিয়াড (BDRO), ন্যাশনাল হাই স্কুল প্রোগ্রামিং কনটেস্ট (NHSPC) এবং আন্তর্জাতিক স্টেম প্রতিযোগিতায় অংশ নেওয়ার জন্য বিশেষ প্রজেক্ট-বেইজড ট্রেনিং ও মেন্টর গাইডেন্স দেওয়া হয়।",
    answerEn:
      "Absolutely! We train and groom our top students for prestigious competitions including the Bangladesh Robot Olympiad (BDRO), National High School Programming Contest (NHSPC), and international youth STEM hackathons.",
  },

  // 4. Payments & Refund Policy
  {
    id: "payment-methods",
    category: "payment",
    questionBn: "পেমেন্ট কীভাবে করা যায়? কিস্তির (Installment) সুযোগ আছে কি?",
    questionEn: "What payment methods are supported? Are installment plans available?",
    answerBn:
      "বিকাশ (bKash), নগদ (Nagad), রকেট, যে কোনো ভিসা/মাস্টারকার্ড এবং ইন্টারনেট ব্যাংকিংয়ের মাধ্যমে সুরক্ষিতভাবে পেমেন্ট করা যায়। দীর্ঘমেয়াদী (৩ মাস বা ৬ মাসের) ফুল ট্র্যাক কোর্সগুলোর জন্য ২ বা ৩ কিস্তিতে ফি পরিশোধের সহজ সুযোগ রয়েছে।",
    answerEn:
      "We accept bKash, Nagad, Rocket, Visa, Mastercard, and direct bank transfers. For multi-month comprehensive tracks, flexible 2 or 3-part installment payment plans are available.",
  },
  {
    id: "money-back-guarantee",
    category: "payment",
    questionBn: "আপনাদের রিফান্ড বা মানি-ব্যাক গ্যারান্টি পলিসি কী?",
    questionEn: "What is your refund and money-back guarantee policy?",
    answerBn:
      "আমরা প্রতিটি কোর্সে ১০০% মানি-ব্যাক গ্যারান্টি প্রদান করি। কোর্সে যুক্ত হওয়ার পর প্রথম ২টি লাইভ ক্লাস করার পরেও যদি কোনো কারণে শিক্ষার্থী বা অভিভাবক সন্তুষ্ট না হন, তবে কোনো প্রশ্ন ছাড়াই সম্পূর্ণ কোর্স ফি ফেরত দেওয়া হয়।",
    answerEn:
      "We offer a 100% money-back guarantee. If you or your child are not completely satisfied after attending the first 2 live classes, we issue a full refund with zero questions asked.",
    highlightBn: "১০০% মানি-ব্যাক গ্যারান্টি (প্রথম ২ ক্লাস)",
    highlightEn: "100% Money-Back Guarantee (First 2 Classes)",
  },
  {
    id: "free-trial-class",
    category: "payment",
    questionBn: "কোর্স কেনার আগে কি কোনো ফ্রি ট্রায়াল ক্লাস করে দেখার সুযোগ আছে?",
    questionEn: "Can my child attend a free trial class before enrolling?",
    answerBn:
      "হ্যাঁ! আপনি সরাসরি আমাদের 'ইভেন্টস' পেজে গিয়ে অথবা হোমপেজ থেকে ১ ঘণ্টার স্পেশাল ফ্রি লাইভ ট্রায়াল ক্লাসে রেজিস্ট্রেশন করতে পারেন। রেজিস্ট্রেশন করার সাথে সাথে ক্লাসরুমের প্রাইভেট লিংক আপনার ইমেইলে পৌঁছে যাবে।",
    answerEn:
      "Yes! You can register for a 1-hour free live trial class from our Events page or homepage. The private interactive classroom link is generated and emailed to you immediately upon registration.",
  },

  // 5. Devices & Support
  {
    id: "device-requirements",
    category: "support",
    questionBn: "ক্লাস করার জন্য কী ধরনের কম্পিউটার বা ডিভাইস প্রয়োজন?",
    questionEn: "What computer hardware and internet connection are needed?",
    answerBn:
      "ক্লাসে অংশ নিতে একটি সচল ল্যাপটপ বা ডেস্কটপ কম্পিউটার (উইন্ডোজ, ম্যাক বা লিনাক্স) এবং অন্তত ২-৫ এমবিপিএস গতির ইন্টারনেট সংযোগ প্রয়োজন। মোবাইল ফোন দিয়ে লাইভ কোডিং ল্যাবে অংশ নেওয়া যায় না, তাই ল্যাপটপ/পিসি বাধ্যতামূলক।",
    answerEn:
      "A working laptop or desktop computer (Windows, Mac, or Linux) with Google Chrome and a 2-5 Mbps stable internet connection is required. Smartphones are not suitable for live coding labs.",
  },
  {
    id: "after-class-support",
    category: "support",
    questionBn: "ক্লাসের বাইরে হোমওয়ার্ক বা কোনো কোড আটকে গেলে কীভাবে সাহায্য পাব?",
    questionEn: "How do students get help with bugs or homework outside class hours?",
    answerBn:
      "আমাদের প্রতিটি ব্যাচের জন্য রয়েছে ডেডিকেটেড ডিসকর্ড ও হোয়াটসঅ্যাপ সাপোর্ট কমিউনিটি। ক্লাসের বাইরে যে কোনো দিন কোনো বাগ বা প্রজেক্টে আটকে গেলে স্ক্রিনশট শেয়ার করলে আমাদের অ্যাসিস্ট্যান্ট মেন্টররা সরাসরি সমাধান করে দেন।",
    answerEn:
      "Every batch has an active WhatsApp and Discord community where dedicated assistant mentors answer questions, review student code, and help debug issues 7 days a week.",
    highlightBn: "সপ্তাহে ৭ দিন মেন্টর সাপোর্ট কমিউনিটি",
    highlightEn: "7 Days a Week Dedicated Mentor Support",
  },
];

export default function FAQPage() {
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIds, setOpenIds] = useState<string[]>(["live-vs-recorded", "batch-size"]);

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

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: "all", labelBn: "সবগুলো প্রশ্ন", labelEn: "All Questions", icon: FaQuestionCircle },
    { id: "live", labelBn: "লাইভ ক্লাস ও ব্যাচ", labelEn: "Live Classes & Batch", icon: FaVideo },
    { id: "curriculum", labelBn: "বয়সসীমা ও কোর্স", labelEn: "Curriculum & Ages", icon: FaUsers },
    { id: "certificate", labelBn: "সার্টিফিকেট ও কিট", labelEn: "Certificates & Kits", icon: FaAward },
    { id: "payment", labelBn: "পেমেন্ট ও রিফান্ড", labelEn: "Payment & Refund", icon: FaCreditCard },
    { id: "support", labelBn: "ডিভাইস ও মেন্টর সাপোর্ট", labelEn: "Device & Support", icon: FaLaptop },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesCategory =
        activeCategory === "all" || faq.category === activeCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchBn =
        faq.questionBn.toLowerCase().includes(q) ||
        faq.answerBn.toLowerCase().includes(q);
      const matchEn =
        faq.questionEn.toLowerCase().includes(q) ||
        faq.answerEn.toLowerCase().includes(q);

      return matchBn || matchEn;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 pt-8 sm:pt-12 font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3B82F6] text-white text-xs font-black uppercase tracking-wider shadow-xs">
            <span>❓</span>
            <span>{language === "en" ? "Help & Support Center" : "সাধারণ জিজ্ঞাসা ও উত্তর"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#1E1E1E] tracking-tight leading-tight">
            {language === "en" ? (
              <>Frequently Asked <span className="text-[#3B82F6]">Questions</span></>
            ) : (
              <>অভিভাবক ও শিক্ষার্থীদের <span className="text-[#3B82F6]">সাধারণ জিজ্ঞাসা</span></>
            )}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
            {language === "en"
              ? "Everything you need to know about our 100% live interactive classes, 10-15 students batch size, robotics kits, and verified certification."
              : "আমাদের ১০০% লাইভ ইন্টারঅ্যাক্টিভ ক্লাস, ১০-১৫ জনের ছোট ব্যাচ, রোবটিক্স কিট ডেলিভারি ও সার্টিফিকেট সম্পর্কে প্রয়োজনীয় সকল উত্তর জেনে নিন।"}
          </p>

          {/* Interactive Live Search Input */}
          <div className="pt-2 max-w-xl mx-auto relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "en"
                  ? "Search by keyword (e.g. live, batch, fee, kit, refund)..."
                  : "যেকোনো প্রশ্ন খুঁজুন (যেমন: ব্যাচ সাইজ, রোবটিক্স কিট, রিফান্ড, ফি)..."
              }
              className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-2xs ${
                  isActive
                    ? "bg-[#1E1E1E] text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:text-black border border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className={`text-xs ${isActive ? "text-[#F59E0B]" : "text-[#3B82F6]"}`} />
                <span>{language === "en" ? cat.labelEn : cat.labelBn}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-14">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-[28px] border border-gray-100 p-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 text-2xl flex items-center justify-center mx-auto">
                🔍
              </div>
              <h3 className="text-lg font-black text-gray-900">
                {language === "en" ? "No matching questions found" : "কোনো প্রশ্ন খুঁজে পাওয়া যায়নি"}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {language === "en"
                  ? "Try searching with different keywords, or reach out to our counseling team directly."
                  : "অন্য কোনো শব্দ দিয়ে খুঁজুন অথবা আমাদের কাউন্সেলিং টিমের সাথে সরাসরি যোগাযোগ করুন।"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-5 py-2 bg-[#3B82F6] text-white text-xs font-bold rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
              >
                {language === "en" ? "Reset Search" : "সকল প্রশ্ন দেখুন"}
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);
              const question = language === "en" ? faq.questionEn : faq.questionBn;
              const answer = language === "en" ? faq.answerEn : faq.answerBn;
              const highlight = language === "en" ? faq.highlightEn : faq.highlightBn;

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-[24px] border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#3B82F6]/50 shadow-md ring-2 ring-[#3B82F6]/10"
                      : "border-gray-100 shadow-xs hover:border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1 pr-2">
                      {highlight && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-[#3B82F6]">
                          <FaCheckCircle className="text-[9px]" />
                          {highlight}
                        </span>
                      )}
                      <h3
                        className={`text-sm sm:text-base font-bold transition-colors ${
                          isOpen ? "text-[#3B82F6]" : "text-[#1E1E1E]"
                        }`}
                      >
                        {question}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-[#3B82F6] text-white rotate-180"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FaChevronDown className="text-xs" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 animate-in fade-in duration-200">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA Banner */}
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2C2C2C] text-white rounded-[28px] p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-[#3B82F6]/20 to-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="px-3.5 py-1 bg-[#F59E0B] text-[#1E1E1E] text-xs font-black rounded-full uppercase tracking-wider">
                {language === "en" ? "Need Personal Guidance?" : "ব্যক্তিগত পরামর্শ প্রয়োজন?"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {language === "en"
                  ? "Still have questions about our classes?"
                  : "সন্তানের উপযোগী কোর্স বাছাইয়ে সাহায্য চান?"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
                {language === "en"
                  ? "Speak directly with our senior academic counselors to discuss your child's age, interests, and free trial class schedule."
                  : "আমাদের অ্যাকাডেমিক কাউন্সেলরের সাথে সরাসরি কথা বলুন এবং জেনে নিন সন্তানের জন্য কোন কোর্স ও ব্যাচ সবচেয়ে কার্যকরী হবে।"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <FaWhatsapp className="text-base" />
                <span>{language === "en" ? "Chat on WhatsApp" : "হোয়াটসঅ্যাপে কথা বলুন"}</span>
              </a>

              <Link
                href="/events"
                className="px-6 py-3.5 bg-white text-[#1E1E1E] hover:bg-gray-100 text-xs font-black rounded-full flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer"
              >
                <span>{language === "en" ? "Book Free Trial" : "ফ্রি ট্রায়াল বুক করুন"}</span>
                <FaArrowRight className="text-xs text-[#3B82F6]" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
