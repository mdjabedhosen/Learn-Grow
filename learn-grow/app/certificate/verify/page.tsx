"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaCertificate,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaPrint,
  FaShieldAlt,
  FaChevronRight,
  FaCopy,
  FaCheck,
  FaUndoAlt,
} from "react-icons/fa";
import { useVerifyCertificateQuery } from "@/redux/api/certificateApi";

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id") || searchParams.get("certId") || searchParams.get("code") || "";

  const [inputCertificateId, setInputCertificateId] = useState(urlId);
  const [activeQueryId, setActiveQueryId] = useState(urlId);
  const [hasCopied, setHasCopied] = useState(false);

  // Auto-search if ID is present in URL
  useEffect(() => {
    if (urlId && urlId.trim()) {
      setInputCertificateId(urlId.trim());
      setActiveQueryId(urlId.trim());
    }
  }, [urlId]);

  const { data, isLoading, isFetching } = useVerifyCertificateQuery(
    activeQueryId,
    { skip: !activeQueryId.trim() }
  );

  const isValid = data?.data?.isValid || false;
  const certificate = data?.data?.certificate;
  const hasSearched = Boolean(activeQueryId.trim());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCertificateId.trim()) {
      setActiveQueryId(inputCertificateId.trim());
    }
  };

  const handleReset = () => {
    setInputCertificateId("");
    setActiveQueryId("");
  };

  const handleCopyId = (id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(id);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-10 sm:py-16 text-slate-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6 print:hidden">
          <Link href="/" className="hover:text-blue-600 transition-colors">হোম (Home)</Link>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="text-slate-400">সনদপত্র (Credentials)</span>
          <FaChevronRight className="text-[10px] text-slate-400" />
          <span className="font-semibold text-slate-800">সার্টিফিকেট যাচাই (Verify Certificate)</span>
        </nav>

        {/* Header */}
        <header className="mb-8 sm:mb-10 text-center sm:text-left print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <FaShieldAlt className="text-blue-600" />
            <span>Official Credential Registry • পাবলিক সনদপত্র যাচাইকরণ</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Certificate Verification / সনদ যাচাই
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Learn &amp; Grow প্ল্যাটফর্ম থেকে ইস্যুকৃত অফিসিয়াল ডিজিটাল সনদের সত্যতা যাচাই করতে সার্টিফিকেটে উল্লেখিত ইউনিক আইডি কোডটি লিখুন।
          </p>
        </header>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-8 print:hidden">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="certificateId" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                সার্টিফিকেট আইডি (Certificate Identification Code)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <FaSearch className="text-sm" />
                  </div>
                  <input
                    id="certificateId"
                    type="text"
                    value={inputCertificateId}
                    onChange={(e) => setInputCertificateId(e.target.value)}
                    placeholder="e.g. CERT-2026-ROBOTICS-8A4F"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-2xl text-slate-900 font-mono text-sm sm:text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {inputCertificateId && (
                    <button
                      type="button"
                      onClick={() => setInputCertificateId("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={!inputCertificateId.trim() || isLoading || isFetching}
                    className="flex-1 sm:flex-none px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading || isFetching ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <FaSearch className="text-xs" />
                    )}
                    <span>যাচাই করুন (Verify)</span>
                  </button>

                  {hasSearched && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-2xl transition-colors flex items-center gap-1.5"
                      title="Reset search"
                    >
                      <FaUndoAlt className="text-xs text-slate-500" />
                      <span className="hidden sm:inline">রিসেট</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              আইডি ফরম্যাট সাধারণত <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">CERT-XXXXXXXXXX</code> হয়ে থাকে। এটি আপনার ডিজিটাল সার্টিফিকেট পিডিএফ-এর নিচের বাম পাশে এবং স্টুডেন্ট ড্যাশবোর্ডে পাওয়া যাবে।
            </p>
          </form>
        </div>

        {/* Verification Results State */}
        {hasSearched && (
          <div className="mb-10">
            {isLoading || isFetching ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-base font-bold text-slate-900">সনদপত্র যাচাই করা হচ্ছে...</h3>
                <p className="text-xs text-slate-500 mt-1">Connecting to official verification registry</p>
              </div>
            ) : isValid && certificate ? (
              /* Verified Certificate Official Card */
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden print:shadow-none print:border-none">
                {/* Official Header Strip */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent px-6 sm:px-10 py-5 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <FaCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                        Official Verified Credential
                      </span>
                      <h2 className="text-lg font-bold text-slate-900">
                        বৈধ ও সত্যায়িত সনদপত্র (Authentic Record)
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
                    >
                      <FaPrint className="text-slate-500" />
                      <span>প্রিন্ট রসিদ (Print)</span>
                    </button>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-10 space-y-8">
                  {/* Student Title Banner */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center sm:text-left">
                    <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      সার্টিফিকেট প্রাপকের নাম (Recipient Student)
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {certificate.studentName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      কোর্স সফলভাবে সম্পন্নকারী শিক্ষার্থী হিসেবে Learn &amp; Grow প্ল্যাটফর্মে নিবন্ধিত।
                    </p>
                  </div>

                  {/* 2-Column Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Course */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaBookOpen className="text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          কোর্স (Course Title)
                        </span>
                        <p className="text-base font-bold text-slate-900 leading-snug">
                          {certificate.courseName}
                        </p>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">লাইভ ইন্টারঅ্যাক্টিভ স্টেম প্রোগ্রাম</span>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaChalkboardTeacher className="text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          প্রধান শিক্ষক / মেন্টর (Instructor)
                        </span>
                        <p className="text-base font-bold text-slate-900 leading-snug">
                          {certificate.courseInstructor || "Learn & Grow Academic Team"}
                        </p>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">সার্টিফাইড স্টেম ট্রেইনার</span>
                      </div>
                    </div>

                    {/* Completion Date */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCalendarAlt className="text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          সমাপ্তির তারিখ (Completion Date)
                        </span>
                        <p className="text-base font-bold text-slate-900 leading-snug">
                          {new Date(certificate.completionDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Issued At */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                        <FaCertificate className="text-base" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          ইস্যুর তারিখ (Issued Date)
                        </span>
                        <p className="text-base font-bold text-slate-900 leading-snug">
                          {new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Monospace Certificate ID & Copy */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                        Official Unique Certificate ID
                      </span>
                      <span className="font-mono text-sm sm:text-base font-bold text-slate-800 break-all">
                        {certificate.certificateId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyId(certificate.certificateId)}
                      className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      {hasCopied ? (
                        <>
                          <FaCheck className="text-emerald-600 text-xs" />
                          <span className="text-emerald-700">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <FaCopy className="text-slate-400 text-xs" />
                          <span>কপি আইডি</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Verification Seal & Platform Notice */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-emerald-600 text-base shrink-0" />
                      <span>
                        ডিজিটাল রেকর্ড যাচাই সম্পন্ন। এটি একটি অফিসিয়াল সত্য সনদপত্র।
                      </span>
                    </div>
                    <span className="text-slate-400">
                      Learn &amp; Grow EdTech Platform
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Invalid or Not Found Card */
              <div className="bg-white rounded-3xl border border-red-200/80 p-8 sm:p-12 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <FaTimesCircle className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  সনদপত্রটি খুঁজে পাওয়া যায়নি (Certificate Not Found)
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                  {data?.message || "প্রদত্ত আইডি নম্বরের বিপরীতে কোনো বৈধ সনদপত্র পাওয়া যায়নি। অনুগ্রহ করে স্পেলিং ও ক্যাপিটালাইজেশন মিলিয়ে পুনরায় চেষ্টা করুন।"}
                </p>

                {activeQueryId && (
                  <div className="inline-block p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 mb-6">
                    অনুসন্ধানকৃত আইডি: <strong>{activeQueryId}</strong>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    নতুন আইডি লিখুন (Try Another ID)
                  </button>
                  <a
                    href="mailto:support@learnandgrow.io"
                    className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                  >
                    সহায়তা নিন (Contact Support)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Security & Verification Desk Guidance (When not searched or as footer) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 text-blue-600 font-bold text-sm mb-2">
              <FaShieldAlt className="text-base" />
              <span>ডিজিটাল সনদপত্রের নিরাপত্তা মান</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learn &amp; Grow-এর প্রতিটি সার্টিফিকেট ক্রিপ্টোগ্রাফিক কিউআর কোড এবং পাবলিক রেজিস্ট্রি হাশের সাথে সংযুক্ত, যা যেকোনো অননুমোদিত পরিবর্তন বা নকল প্রতিরোধ করে।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-sm mb-2">
              <FaUserGraduate className="text-base text-purple-600" />
              <span>আইডি খুঁজে পাচ্ছেন না?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              আপনার সার্টিফিকেট আইডি উদ্ধার করতে ইমেইল করুন <a href="mailto:support@learnandgrow.io" className="text-blue-600 font-semibold hover:underline">support@learnandgrow.io</a> বা যোগাযোগ করুন অফিসিয়াল হেল্পলাইনে।
            </p>
            <span className="text-[11px] text-slate-400">
              হোয়াটসঅ্যাপ: <a href="https://wa.me/8801706276447" target="_blank" className="font-semibold text-slate-700 hover:underline">+880 1706-276447</a> (সকাল ১০টা - সন্ধ্যা ৬টা, শনি-বৃহস্পতি)
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CertificateVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <VerifyCertificateContent />
    </Suspense>
  );
}
