"use client";
import React, { useState, useEffect } from "react";

const goalsData = {
  bn: {
    pill: "🎯 আমাদের লক্ষ্য",
    title: "কেন Learn & Grow?",
    subtitle: "আমরা প্রতিশ্রুতিবদ্ধ বাংলাদেশের শিক্ষার্থীদের জন্য মানসম্পন্ন রোবটিক্স এবং প্রযুক্তি শিক্ষা নিশ্চিত করতে।",
    cards: [
      {
        emoji: "🧠",
        title: "শিক্ষার মান উন্নয়ন",
        description:
          "আধুনিক প্রযুক্তি এবং রোবটিক্স শিক্ষার মাধ্যমে শিক্ষার্থীদের দক্ষতা বৃদ্ধি করা এবং তাদের ভবিষ্যৎ ক্যারিয়ারের জন্য প্রস্তুত করা।",
        bg: "bg-[#EAF4FB]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#B3D9F5] text-[#1B5C8A]",
        pillLabel: "Education",
      },
      {
        emoji: "🚀",
        title: "উদ্ভাবনী চিন্তাভাবনা",
        description:
          "শিক্ষার্থীদের মধ্যে সৃজনশীলতা এবং সমস্যা সমাধানের দক্ষতা গড়ে তোলা, যাতে তারা ভবিষ্যতের চ্যালেঞ্জ মোকাবেলা করতে পারে।",
        bg: "bg-[#F5F0FF]",
        border: "border-[#D4C0F9]",
        pill: "bg-[#D4C0F9] text-[#5B21B6]",
        pillLabel: "Innovation",
      },
      {
        emoji: "🤝",
        title: "সবার জন্য শিক্ষা",
        description:
          "দেশের প্রতিটি কোণে মানসম্পন্ন রোবটিক্স এবং STEM শিক্ষা পৌঁছে দেওয়া এবং সবার জন্য শেখার সুযোগ সৃষ্টি করা।",
        bg: "bg-[#F0FFF4]",
        border: "border-[#BBEED0]",
        pill: "bg-[#BBEED0] text-[#166534]",
        pillLabel: "Inclusion",
      },
      {
        emoji: "🌏",
        title: "আন্তর্জাতিক মানের শিক্ষা",
        description:
          "বাংলাদেশের শিক্ষার্থীদের বিশ্বমানের শিক্ষা প্রদান করা এবং তাদের আন্তর্জাতিক প্রতিযোগিতায় সক্ষম করে তোলা।",
        bg: "bg-[#FFFBEA]",
        border: "border-[#FDEFC0]",
        pill: "bg-[#FDEFC0] text-[#92620A]",
        pillLabel: "Global",
      },
    ],
    stats: [
      { num: "500+", label: "শিক্ষার্থী" },
      { num: "20+", label: "কোর্স" },
      { num: "10+", label: "বিশেষজ্ঞ শিক্ষক" },
      { num: "98%", label: "সন্তুষ্টি রেট" },
    ],
  },
  en: {
    pill: "🎯 Our Mission",
    title: "Why Learn & Grow?",
    subtitle: "We are committed to delivering world-class robotics and technology education for every student in Bangladesh.",
    cards: [
      {
        emoji: "🧠",
        title: "Quality Education",
        description:
          "Empowering students with modern technology and robotics skills to prepare them for rewarding future careers.",
        bg: "bg-[#EAF4FB]",
        border: "border-[#B3D9F5]",
        pill: "bg-[#B3D9F5] text-[#1B5C8A]",
        pillLabel: "Education",
      },
      {
        emoji: "🚀",
        title: "Innovative Thinking",
        description:
          "Cultivating creativity and computational problem-solving abilities so learners can confidently tackle tomorrow's challenges.",
        bg: "bg-[#F5F0FF]",
        border: "border-[#D4C0F9]",
        pill: "bg-[#D4C0F9] text-[#5B21B6]",
        pillLabel: "Innovation",
      },
      {
        emoji: "🤝",
        title: "Education for All",
        description:
          "Taking high-quality STEM & robotics learning to every district, creating open opportunities for all young minds.",
        bg: "bg-[#F0FFF4]",
        border: "border-[#BBEED0]",
        pill: "bg-[#BBEED0] text-[#166534]",
        pillLabel: "Inclusion",
      },
      {
        emoji: "🌏",
        title: "Global Standards",
        description:
          "Equipping Bangladeshi students with world-class education to excel in global robotics and coding competitions.",
        bg: "bg-[#FFFBEA]",
        border: "border-[#FDEFC0]",
        pill: "bg-[#FDEFC0] text-[#92620A]",
        pillLabel: "Global",
      },
    ],
    stats: [
      { num: "500+", label: "Students" },
      { num: "20+", label: "Courses" },
      { num: "10+", label: "Expert Mentors" },
      { num: "98%", label: "Satisfaction Rate" },
    ],
  },
};

export default function OurGoals() {
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

  const content = goalsData[language];

  return (
    <section id="goals" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#7C3AED] text-white text-xs font-black rounded-full uppercase tracking-widest mb-6">
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
            className={`text-lg text-gray-500 max-w-2xl mx-auto font-medium ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {content.subtitle}
          </p>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {content.cards.map((goal, index) => (
            <div
              key={index}
              className={`${goal.bg} border-2 ${goal.border} rounded-[28px] p-7 flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
            >
              <span className="text-5xl mb-5">{goal.emoji}</span>
              <span className={`self-start text-xs font-black px-3 py-1 rounded-full mb-4 ${goal.pill}`}>
                {goal.pillLabel}
              </span>
              <h3
                className={`text-xl font-black text-[#2C2C2C] mb-3 leading-snug ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {goal.title}
              </h3>
              <p className={`text-sm text-gray-600 leading-relaxed ${language === "bn" ? "font-siliguri" : ""}`}>
                {goal.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {content.stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white border-2 border-gray-100 rounded-[24px] p-6 text-center hover:shadow-lg transition-all"
            >
              <p className="text-4xl font-black text-[#2C2C2C] mb-1">{stat.num}</p>
              <p
                className={`text-sm font-bold text-gray-500 ${
                  language === "bn" ? "font-siliguri" : ""
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
