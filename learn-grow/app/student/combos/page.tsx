import React from "react";
import Link from "next/link";
import ComboListing from "@/components/combo/ComboListing";
import { Package, Sparkles, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Course Bundles & Combos | Learn & Grow",
  description: "Browse our course combo bundles and save up to 40% on multiple courses with hardware kits.",
};

export default function CombosPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Ambient Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#1E1B4B] text-white pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 rounded-b-[28px] sm:rounded-b-[36px] shadow-lg">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/student"
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Package className="w-3.5 h-3.5 text-blue-300" />
              বান্ডেল প্যাকেজ ও কম্বো অফার
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            কোর্স কম্বো বান্ডেল
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            একাধিক লাইভ কোর্স একসাথে নিয়ে সাশ্রয় করুন সর্বোচ্চ ৪০% পর্যন্ত। পাইথন ও রোবটিক্স কম্বোতে পাচ্ছেন ফ্রি হার্ডওয়্যার কিট ও মেন্টরিং।
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-6 -mt-6 relative z-20">
        <ComboListing />
      </div>
    </div>
  );
}
