"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Chip } from "@nextui-org/react";
import { HiCheck, HiOutlineSparkles, HiOutlineShieldCheck, HiArrowRight } from "react-icons/hi2";
import { useGetActiveCombosQuery } from "@/redux/api/comboApi";
import { useGetCommissionQuery } from "@/redux/api/settingsApi";
import { pricingPlans } from "@/lib/platformData";

const PricingSection: React.FC = () => {
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

  const pricing = pricingPlans[language];
  const { data: combosData } = useGetActiveCombosQuery({ page: 1, limit: 1 });
  const firstCombo = combosData?.data?.[0];
  const { data: settingsData } = useGetCommissionQuery();
  const kitPriceSetting = settingsData?.data?.kitPrice;
  const kitPriceEnv = process.env.NEXT_PUBLIC_KIT_PRICE;

  const handleCtaClick = (planId: string, comboId?: string) => {
    switch (planId) {
      case "single-course":
        router.push("/courses");
        break;
      case "combo":
        router.push(comboId ? `/bundle/${comboId}` : "/bundle");
        break;
      case "robotics-kit":
        router.push("/checkout?plan=kit");
        break;
      case "school":
        router.push("/contact");
        break;
      default:
        router.push("/courses");
        break;
    }
  };

  // Structured professional card data
  const cards = [
    {
      id: "single-course",
      badge: language === "en" ? "Single Track" : "কোর্সভিত্তিক",
      name: language === "en" ? "Single Course" : "একক কোর্স",
      subtitle:
        language === "en"
          ? "Ideal for starting with a specific programming or robotics track"
          : "নির্দিষ্ট কোডিং বা রোবটিক্স কোর্স দিয়ে শুরু করার জন্য সেরা",
      originalPrice: null,
      price: language === "en" ? "2,999" : "২,৯৯৯",
      currency: language === "en" ? "BDT" : "৳",
      period: language === "en" ? "starts from" : "শুরু থেকে",
      priceNote: language === "en" ? "Individual course access" : "প্রতিটি কোর্সে আলাদা ভর্তি",
      saveBadge: null,
      popular: false,
      features: [
        language === "en" ? "Full access to chosen live course" : "১টি সম্পূর্ণ লাইভ কোর্সে অ্যাক্সেস",
        language === "en" ? "Interactive instructor-led classes" : "অভিজ্ঞ মেন্টরের সাথে লাইভ ক্লাস",
        language === "en" ? "Complete course materials & HD recordings" : "ক্লাস রেকর্ডিং ও স্টাডি ম্যাটেরিয়াল",
        language === "en" ? "Hands-on quizzes & guided assignments" : "হাতে-কলমে প্র্যাকটিস কুইজ ও প্রজেক্ট",
        language === "en" ? "Verified Certificate of Completion" : "কোর্স সম্পন্ন শেষে ভেরিফাইড সার্টিফিকেট",
      ],
      ctaText: language === "en" ? "Browse Courses" : "কোর্সসমূহ দেখুন",
    },
    {
      id: "combo",
      badge: language === "en" ? "⭐ Best Value Bundle" : "⭐ সবচেয়ে জনপ্রিয় বান্ডেল",
      name: language === "en" ? "Course + Robotics Kit" : "কোর্স + রোবটিক্স কিট",
      subtitle:
        language === "en"
          ? "Complete live course access plus genuine Arduino starter hardware kit"
          : "লাইভ কোর্স এবং সম্পূর্ণ Arduino রোবটিক্স কিটের পূর্ণাঙ্গ প্যাকেজ",
      originalPrice: firstCombo?.price ? (language === "en" ? `BDT ${firstCombo.price}` : `৳ ${firstCombo.price}`) : (language === "en" ? "BDT 7,499" : "৳ ৭,৪৯৯"),
      price: firstCombo?.discountPrice ? String(firstCombo.discountPrice) : (language === "en" ? "5,749" : "৫,৭৪৯"),
      currency: language === "en" ? "BDT" : "৳",
      period: language === "en" ? "complete bundle" : "এককালীন বান্ডেল",
      priceNote: language === "en" ? "Lifetime kit ownership & course access" : "কিটের আজীবন মালিকানা ও লাইভ ক্লাস",
      saveBadge: language === "en" ? "🔥 Save 1,750 BDT!" : "🔥 ১,৭৫০ টাকা সাশ্রয়!",
      popular: true,
      comboId: firstCombo?._id,
      features: [
        language === "en" ? "1 Full live Robotics or Coding course" : "১টি সম্পূর্ণ লাইভ রোবটিক্স/কোডিং কোর্স",
        language === "en" ? "Genuine Arduino Starter Kit included" : "সম্পূর্ণ Arduino স্টার্টার কিট অন্তর্ভুক্ত",
        language === "en" ? "25+ sensors, motors & controllers" : "২৫+ সেন্সর, মোটর ও কন্ট্রোলার হার্ডওয়্যার",
        language === "en" ? "Free home delivery all across Bangladesh" : "সারাদেশে ফ্রি হোম ডেলিভারি সুবিধা",
        language === "en" ? "Priority mentor support & official certificate" : "প্রাইওরিটি মেন্টর সাপোর্ট ও সার্টিফিকেট",
      ],
      ctaText: language === "en" ? "Get Bundle Access" : "বান্ডেলটি বুক করুন",
    },
    {
      id: "robotics-kit",
      badge: language === "en" ? "Hardware Only" : "হার্ডওয়্যার কিট",
      name: language === "en" ? "Robotics Starter Kit" : "শুধু রোবটিক্স কিট",
      subtitle:
        language === "en"
          ? "Hands-on hardware components kit for self-learning and building experiments"
          : "বাড়িতে বা ক্লাবের জন্য আলাদাভাবে প্র্যাকটিক্যাল কিট কিনুন",
      originalPrice: null,
      price: kitPriceSetting ? String(kitPriceSetting) : kitPriceEnv ? String(kitPriceEnv) : (language === "en" ? "3,999" : "৩,৯৯৯"),
      currency: language === "en" ? "BDT" : "৳",
      period: language === "en" ? "one-time" : "এককালীন",
      priceNote: language === "en" ? "Lifetime hardware ownership" : "হার্ডওয়্যারের আজীবন মালিকানা",
      saveBadge: null,
      popular: false,
      features: [
        language === "en" ? "Arduino UNO R3 micro-controller board" : "Arduino UNO R3 মাইক্রোকন্ট্রোলার বোর্ড",
        language === "en" ? "Ultrasonic, IR, servo & sensor modules" : "আল্ট্রাসনিক, সার্ভো, IR ও সেন্সর মডিউল",
        language === "en" ? "Breadboard, jumper wires & USB cable" : "ব্রেডবোর্ড, জাম্পার ওয়্যার ও কেবল",
        language === "en" ? "Online illustrated setup & project guide" : "অনলাইন ইলাস্ট্রেটেড সেটআপ গাইড",
        language === "en" ? "100% compatible with Learn & Grow labs" : "আমাদের সকল কোর্সের সাথে সামঞ্জস্যপূর্ণ",
      ],
      ctaText: language === "en" ? "Order Kit" : "কিট অর্ডার করুন",
    },
    {
      id: "school",
      badge: language === "en" ? "Institutions" : "স্কুল পার্টনারশিপ",
      name: language === "en" ? "School Partnership" : "স্কুল ও ল্যাব পার্টনারশিপ",
      subtitle:
        language === "en"
          ? "Empower your school with customized STEM curriculum, labs, and teacher training"
          : "আপনার প্রতিষ্ঠানে রোবটিক্স ল্যাব সেটআপ ও বিশ্বমানের STEM শিক্ষা",
      originalPrice: null,
      price: language === "en" ? "Custom" : "কাস্টম",
      currency: "",
      period: language === "en" ? "tailored for schools" : "প্রতিষ্ঠান অনুযায়ী",
      priceNote: language === "en" ? "Flexible cohort packages" : "শিক্ষার্থী সংখ্যা অনুযায়ী নির্ধারিত",
      saveBadge: null,
      popular: false,
      features: [
        language === "en" ? "Customized age-appropriate STEM syllabus" : "বয়সোপযোগী কাস্টমাইজড STEM কারিকুলাম",
        language === "en" ? "Volume discounts on kits & student licenses" : "কিট ও লাইসেন্সিং-এ বিশেষ প্রাতিষ্ঠানিক ছাড়",
        language === "en" ? "On-site and online teachers' training" : "শিক্ষকদের জন্য বিশেষ ট্রেইনার্স ট্রেইনিং",
        language === "en" ? "Campus lab setup & competition coaching" : "ক্যাম্পাস ল্যাব সেটআপ ও অলিম্পিয়াড মেন্টরিং",
        language === "en" ? "Institutional partner accreditation" : "অফিশিয়াল পার্টনারশিপ এক্রিডিটেশন",
      ],
      ctaText: language === "en" ? "Contact Partnerships" : "পার্টনারশিপের জন্য যোগাযোগ",
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-[#EAF4FB]/30 to-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 sm:mb-18 animate-fadeIn">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#3B82F6] text-white text-xs font-black rounded-full uppercase tracking-widest mb-5 shadow-sm">
            <HiOutlineSparkles className="text-base" />
            {language === "en" ? "Pricing Plans" : "সহজ ও স্বচ্ছ প্রাইসিং"}
          </span>

          <h2
            className={`text-3xl sm:text-5xl lg:text-6xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4 ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {pricing.title}
          </h2>

          <p
            className={`text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed ${
              language === "bn" ? "font-siliguri" : ""
            }`}
          >
            {pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards Grid - Perfectly Balanced 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7 items-stretch mb-16">
          {cards.map((card) => {
            const isFeatured = card.popular;

            return (
              <div
                key={card.id}
                className={`relative rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                  isFeatured
                    ? "bg-white border-2 border-[#3B82F6] shadow-[0_12px_40px_rgba(59,130,246,0.18)] scale-[1.02] lg:scale-105 z-20 ring-4 ring-blue-50"
                    : "bg-white border-2 border-gray-100 hover:border-[#3B82F6]/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 z-10"
                }`}
              >
                {/* Popular Floating Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] text-white font-extrabold text-xs shadow-lg uppercase tracking-wider whitespace-nowrap">
                      {card.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Badge (non-featured cards) */}
                  {!isFeatured && (
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                        {card.badge}
                      </span>
                    </div>
                  )}

                  {/* Card Title & Subtitle */}
                  <div className={isFeatured ? "pt-2" : ""}>
                    <h3
                      className={`text-xl sm:text-2xl font-black text-[#2C2C2C] mb-2 tracking-tight ${
                        language === "bn" ? "font-siliguri" : ""
                      }`}
                    >
                      {card.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed min-h-[38px] mb-6">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Price Block - Guaranteed Equal Height */}
                  <div className="bg-[#F8F9FA] rounded-2xl p-4 mb-6 border border-gray-100">
                    {/* Strikethrough original price if discount */}
                    {card.originalPrice && (
                      <div className="text-xs text-gray-400 line-through font-bold mb-0.5">
                        {card.originalPrice}
                      </div>
                    )}

                    <div className="flex items-baseline gap-1.5">
                      {card.currency && (
                        <span className="text-xl font-bold text-gray-600">
                          {card.currency}
                        </span>
                      )}
                      <span
                        className={`text-3xl sm:text-4xl font-black tracking-tight ${
                          isFeatured ? "text-[#3B82F6]" : "text-[#2C2C2C]"
                        } ${language === "bn" ? "font-siliguri" : ""}`}
                      >
                        {card.price}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        /{card.period}
                      </span>
                    </div>

                    {/* Savings or note pill */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 font-medium">
                        {card.priceNote}
                      </span>
                      {card.saveBadge && (
                        <span className="text-[11px] font-black text-[#B45309] bg-[#FFF8E1] px-2 py-0.5 rounded-md border border-[#FFE082]">
                          {card.saveBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features Divider */}
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    {language === "en" ? "What's Included:" : "যা যা থাকছে:"}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-left">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isFeatured
                              ? "bg-blue-100 text-[#3B82F6]"
                              : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          <HiCheck className="text-xs font-bold" />
                        </div>
                        <span
                          className={`text-xs sm:text-sm text-gray-700 leading-snug ${
                            language === "bn" ? "font-siliguri" : ""
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Button - Locked to bottom */}
                <div className="pt-2 mt-auto">
                  <button
                    onClick={() => handleCtaClick(card.id, card.comboId)}
                    className={`w-full py-3.5 px-6 rounded-full font-black text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm ${
                      isFeatured
                        ? "bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-500/25 hover:shadow-lg hover:scale-[1.02]"
                        : "bg-[#2C2C2C] hover:bg-black text-white hover:shadow-md"
                    }`}
                  >
                    <span>{card.ctaText}</span>
                    <HiArrowRight className="text-base transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 100% Satisfaction Guarantee Card */}
        <div className="max-w-4xl mx-auto mb-14">
          <div className="bg-gradient-to-r from-[#FFF8E1] via-white to-[#EAF4FB] border-2 border-[#FFE082] rounded-[28px] p-6 sm:p-8 text-center shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
                <HiOutlineShieldCheck />
              </div>
              <div className="text-center sm:text-left">
                <h3
                  className={`text-xl sm:text-2xl font-black text-[#2C2C2C] mb-1.5 ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {language === "en"
                    ? "100% Satisfaction Guarantee"
                    : "১০০% সন্তুষ্টির গ্যারান্টি"}
                </h3>
                <p
                  className={`text-gray-600 text-xs sm:text-sm max-w-2xl leading-relaxed ${
                    language === "bn" ? "font-siliguri" : ""
                  }`}
                >
                  {language === "en"
                    ? "Try any course risk-free. If you're not completely satisfied within the first 7 days, we'll give you a full refund - no questions asked!"
                    : "যেকোনো কোর্স রিস্ক-ফ্রি শুরু করুন। প্রথম ৭ দিনের মধ্যে সম্পূর্ণ সন্তুষ্ট না হলে ফুল রিফান্ড সাপোর্ট — কোনো প্রশ্ন ছাড়াই!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            {language === "en" ? "Accepted Payment Methods" : "নিরাপদ পেমেন্ট মাধ্যমসমূহ"}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {["bKash", "Nagad", "Rocket", "Visa / Mastercard", "Bank Transfer"].map(
              (method, idx) => (
                <span
                  key={idx}
                  className="px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 text-gray-700 shadow-sm"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
