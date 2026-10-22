import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { FaFileContract, FaChevronRight, FaShieldAlt, FaUndoAlt, FaCertificate } from "react-icons/fa";
import { DEFAULT_TERMS_OF_USE_HTML } from "@/lib/legalPolicies";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Learn & Grow platform, live STEM courses, hardware kits, and educational services.",
  alternates: {
    canonical: "https://learnandgrow.io/terms-of-use",
  },
};

async function fetchTermsHtml() {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/site-content/terms-of-use`, { cache: "no-store" });
    const json = await res.json();
    if (json?.success && json?.data?.content && typeof json.data.content === "string" && json.data.content.trim() !== "") {
      return json.data.content as string;
    }
  } catch (error) {
    // Fall back to default
  }
  return null;
}

export default async function TermsOfUsePage() {
  const html = await fetchTermsHtml();
  const displayHtml = html || DEFAULT_TERMS_OF_USE_HTML;

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">হোম (Home)</Link>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="text-slate-400">আইন ও সম্মতি (Legal)</span>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="font-semibold text-slate-800">ব্যবহারের শর্তাবলী (Terms of Service)</span>
        </nav>

        {/* Page Header */}
        <header className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <FaFileContract className="text-slate-600" />
            <span>Platform Agreement • ব্যবহার নীতিমালা ও শর্তাবলী</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Terms of Service / ব্যবহারের শর্তাবলী
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            Learn & Grow প্ল্যাটফর্মের লাইভ কোর্স, ডিজিটাল ক্লাসরুম ও হার্ডওয়্যার ল্যাব ব্যবহারের আইনি রূপরেখা।
          </p>
        </header>

        {/* Policy Content Card */}
        <article className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-12 mb-10">
          <div 
            className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed overflow-hidden" 
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} 
            dangerouslySetInnerHTML={{ __html: displayHtml }} 
          />
        </article>

        {/* Quick Links Navigation */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4">
            সম্পর্কিত অন্যান্য ডকুমেন্টস (Related Legal Policies)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/privacy-policy"
              className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              <span className="flex items-center gap-2">
                <FaShieldAlt className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Privacy Policy</span>
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/refund-policy"
              className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              <span className="flex items-center gap-2">
                <FaUndoAlt className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Refund Policy</span>
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/certificate/verify"
              className="group flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/60 hover:border-blue-200 transition-all text-xs sm:text-sm font-semibold text-slate-700 hover:text-blue-700"
            >
              <span className="flex items-center gap-2">
                <FaCertificate className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span>Verify Certificate</span>
              </span>
              <FaChevronRight className="text-[10px] text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

