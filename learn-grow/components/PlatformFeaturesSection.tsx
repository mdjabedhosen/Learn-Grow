"use client";
import React from "react";
import { BiRevision } from "react-icons/bi";
import { PiCertificateFill } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdPayment } from "react-icons/md";

const PlatformFeaturesSection = () => {
  const features = [
    {
      icon: "🔄",
      title: "7 Day",
      subtitle: "Money-Back",
      tag: "রিফান্ড গ্যারান্টি",
      bg: "bg-[#F5F0FF]",
      border: "border-[#D4C0F9]",
      pill: "bg-[#D4C0F9] text-[#5B21B6]",
    },
    {
      icon: "🏅",
      title: "100%",
      subtitle: "Certificate",
      tag: "সার্টিফিকেট",
      bg: "bg-[#FFFBEA]",
      border: "border-[#FDEFC0]",
      pill: "bg-[#FEF2C0] text-[#92620A]",
    },
    {
      icon: "🤖",
      title: "STEM Kits",
      subtitle: "Hands-on Hardware",
      tag: "প্র্যাকটিক্যাল কিট",
      bg: "bg-[#EAF4FB]",
      border: "border-[#B3D9F5]",
      pill: "bg-[#B3D9F5] text-[#1B5C8A]",
    },
    {
      icon: "💳",
      title: "Easy",
      subtitle: "Payment",
      tag: "সহজ পেমেন্ট",
      bg: "bg-[#F5F0FF]",
      border: "border-[#D4C0F9]",
      pill: "bg-[#E5D8FD] text-[#5B21B6]",
    },
  ];

  return (
    <section className="py-10 px-4 bg-white border-b border-gray-100/80">
      <div className="container mx-auto max-w-6xl">
        {/* Section label */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-[#2C2C2C] text-white text-xs font-black rounded-full uppercase tracking-widest">
            ✨ আমাদের সুবিধা
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {features.map((item, index) => (
            <div
              key={index}
              className={`${item.bg} border-2 ${item.border} rounded-[28px] p-6 flex flex-col items-center text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
            >
              <span className="text-5xl mb-4">{item.icon}</span>
              <h3 className="text-3xl font-black text-[#2C2C2C] mb-1 tracking-tight">
                {item.title}
              </h3>
              <p className="text-base font-bold text-gray-600 mb-3">{item.subtitle}</p>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${item.pill}`}>
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
