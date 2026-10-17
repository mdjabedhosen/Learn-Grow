"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const faqData = {
  bn: {
    pill: "💡 কেন আমরা?",
    title: "সাধারণ প্রশ্নোত্তর",
    subtitle: "আমাদের সম্পর্কে আপনার সব প্রশ্নের উত্তর এখানে পাবেন।",
    featuresTitle: "আমাদের সুবিধাসমূহ ✅",
    features: [
      "১০০% বাংলা ভাষায় শিক্ষা",
      "লাইভ ইন্টারঅ্যাক্টিভ ক্লাস",
      "সার্টিফিকেট",
      "লাইফটাইম কোর্স অ্যাক্সেস",
      "হ্যান্ডস-অন প্রজেক্ট",
      "ক্যারিয়ার গাইডেন্স সাপোর্ট",
    ],
    faqs: [
      {
        q: "কেন আমাদের কোর্স সবচেয়ে ভালো?",
        a: "আমরা হ্যান্ডস-অন প্রজেক্ট-বেসড লার্নিং পদ্ধতি অনুসরণ করি। প্রতিটি ক্লাসে শিক্ষার্থীরা বাস্তব প্রজেক্ট তৈরি করে। আমাদের কোর্স মডিউলগুলো আন্তর্জাতিক মানসম্পন্ন এবং বাংলাদেশের শিক্ষার্থীদের জন্য বিশেষভাবে ডিজাইন করা।",
      },
      {
        q: "আমাদের শিক্ষকরা কেন বিশেষ?",
        a: "আমাদের সকল শিক্ষক রোবটিক্স ও প্রোগ্রামিংয়ে অভিজ্ঞ। তারা শুধু পড়ান না, বরং শিক্ষার্থীদের সঙ্গে হাতে-কলমে প্রজেক্টে কাজ করেন এবং শেখার পুরো পথে দিকনির্দেশনা দেন।",
      },
      {
        q: "কোর্সের পরে কী সুবিধা পাবেন?",
        a: "কোর্স সম্পন্ন করার পরে আপনি পাবেন সার্টিফিকেট, লাইফটাইম কোর্স অ্যাক্সেস, প্রজেক্ট পোর্টফোলিও এবং ক্যারিয়ার সাপোর্ট। এছাড়াও আমাদের কমিউনিটিতে অন্যান্য শিক্ষার্থীদের সাথে নেটওয়ার্কিং এর সুযোগ পাবেন।",
      },
      {
        q: "আমাদের কিট কেন অনন্য?",
        a: "আমাদের STEM কিটগুলো আন্তর্জাতিক মানের কম্পোনেন্ট দিয়ে তৈরি এবং প্রতিটি কিটের সাথে আসে বাংলা টিউটোরিয়াল, অনলাইন সাপোর্ট এবং প্রজেক্ট গাইড।",
      },
      {
        q: "অনলাইন ক্লাস কি লাইভ হয়?",
        a: "হ্যাঁ! আমাদের সকল ক্লাস লাইভ এবং ইন্টারঅ্যাক্টিভ। শিক্ষার্থীরা সরাসরি প্রশ্ন করতে পারবে এবং ইন্সট্রাক্টরের সাথে প্রজেক্ট তৈরি করতে পারবে।",
      },
      {
        q: "বাচ্চারা কি সহজেই শিখতে পারবে?",
        a: "অবশ্যই! আমাদের কোর্স মডিউল বয়স অনুযায়ী তৈরি করা। ৬ বছরের বাচ্চা থেকে শুরু করে ১৮+ যে কেউ আমাদের কোর্স করতে পারবে। আমরা খেলার মাধ্যমে শেখানোর পদ্ধতি ব্যবহার করি।",
      },
    ],
  },
  en: {
    pill: "💡 Why Us?",
    title: "Frequently Asked Questions",
    subtitle: "Find answers to all your common questions about our platform and courses.",
    featuresTitle: "Our Advantages ✅",
    features: [
      "100% Native Language Instruction",
      "Live Interactive Classes",
      "Verified Digital Certificates",
      "Lifetime Course Access",
      "Hands-on Project Building",
      "Career & Mentorship Support",
    ],
    faqs: [
      {
        q: "Why are our courses the best?",
        a: "We follow a project-based hands-on learning approach. Students build real-world projects in every class. Our curricula adhere to international STEM standards while being thoughtfully tailored for Bangladeshi students.",
      },
      {
        q: "Why are our instructors special?",
        a: "All our instructors are highly qualified in robotics, computer science, and engineering. They don't just lecture—they guide students hands-on through live project development every step of the way.",
      },
      {
        q: "What benefits do students get after completing a course?",
        a: "Upon completion, students receive verified digital certificates, lifetime access to course materials and recordings, a verified project portfolio, and dedicated career guidance alongside our growing tech community.",
      },
      {
        q: "What makes our robotics kit unique?",
        a: "Our STEM robotics kits feature high-grade microcontrollers and sensors, complemented by comprehensive tutorials in Bengali, direct instructor support, and guided project templates.",
      },
      {
        q: "Are online classes conducted live?",
        a: "Yes! All sessions are 100% live and interactive. Students can ask questions in real-time, get instant debugging help, and build projects alongside their instructor.",
      },
      {
        q: "Can young children learn easily?",
        a: "Absolutely! Our curriculum is age-appropriate from ages 6 to 18+. We use game-based, visual, and experiential teaching methods that make learning engaging, intuitive, and fun.",
      },
    ],
  },
};

const statsData = {
  bn: [
    { num: "৫০০+", label: "সফল শিক্ষার্থী" },
    { num: "২০+", label: "হ্যান্ডস-অন কোর্স" },
    { num: "১০+", label: "বিশেষজ্ঞ শিক্ষক" },
    { num: "৯৮%", label: "অভিভাবক সন্তুষ্টি" },
  ],
  en: [
    { num: "500+", label: "Enrolled Students" },
    { num: "20+", label: "Hands-on Courses" },
    { num: "10+", label: "Expert Mentors" },
    { num: "98%", label: "Parent Satisfaction" },
  ],
};

export default function WhyBestCourses() {
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const content = faqData[language];

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#3b82f6] text-white text-xs font-black rounded-full uppercase tracking-widest mb-6">
            {content.pill}
          </span>
          <h2
            className={`text-4xl md:text-6xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.title}
          </h2>
          <p
            className={`text-lg text-gray-500 max-w-2xl mx-auto ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.subtitle}
          </p>
        </div>

        {/* Impact Stats Counter Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
          {statsData[language].map((stat, i) => (
            <div
              key={i}
              className="bg-[#F8F9FA] border-2 border-gray-100 rounded-[24px] p-5 sm:p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <p className="text-3xl sm:text-4xl font-black text-[#2C2C2C] mb-1">{stat.num}</p>
              <p
                className={`text-xs sm:text-sm font-bold text-gray-500 ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left: Feature Pills */}
          <div className="lg:col-span-2 bg-[#F8F9FA] border-2 border-gray-100 rounded-[28px] p-8">
            <h3
              className={`text-2xl font-black text-[#2C2C2C] mb-6 ${
                language === "bn" ? "font-siliguri" : ""
              }`}
            >
              {content.featuresTitle}
            </h3>
            <div className="flex flex-col gap-3">
              {content.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-[#2C2C2C] text-xs" />
                  </span>
                  <span
                    className={`text-sm font-bold text-gray-700 ${
                      language === "bn" ? "font-siliguri" : ""
                    }`}
                  >
                    {f}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {content.faqs.map((faq, i) => (
              <div
                key={i}
                className={`border-2 rounded-[20px] overflow-hidden transition-all duration-300 ${
                  openIndex === i
                    ? "border-[#3b82f6] bg-[#EAF4FB]"
                    : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span
                    className={`font-black text-[#2C2C2C] text-base leading-snug ${
                      language === "bn" ? "font-siliguri" : ""
                    }`}
                  >
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2C2C2C] text-white flex items-center justify-center"
                  >
                    <FaChevronDown className="text-xs" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p
                        className={`px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-[#B3D9F5] pt-4 ${
                          language === "bn" ? "font-siliguri" : ""
                        }`}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
