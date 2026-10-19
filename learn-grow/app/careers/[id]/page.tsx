"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  Chip,
  Spinner,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useGetJobByIdQuery } from "@/redux/api/jobApi";
import Link from "next/link";
import JobApplicationForm from "@/components/JobApplicationForm";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  Clock,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Sparkles,
  Building2,
  Calendar,
  Rocket,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const { data, isLoading, isError } = useGetJobByIdQuery(id);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(
        language === "en"
          ? "Job link copied to clipboard!"
          : "চাকরির লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে!"
      );
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Spinner size="lg" label="Loading job details..." color="primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 px-4">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-[#2C2C2C] mb-2">Job Post Not Found</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          The job position you are looking for may have been closed or removed.
        </p>
        <Button
          as={Link}
          href="/careers"
          className="bg-[#3B82F6] text-white font-bold rounded-full px-6 shadow-md"
        >
          Explore All Careers
        </Button>
      </div>
    );
  }

  const job = data.data;

  // Format location string cleanly to avoid duplicate "REMOTE • Remote"
  const rawLoc = (job.location || "").trim();
  const isLocRemote = rawLoc.toLowerCase() === "remote";
  const displayLocation = isLocRemote
    ? "Remote"
    : rawLoc && job.isRemote
    ? `${rawLoc} (Remote)`
    : rawLoc || (job.isRemote ? "Remote" : "Dhaka, Bangladesh");

  // Clean description paragraphs
  const descriptionParagraphs = (job.description || "")
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString(
        language === "bn" ? "bn-BD" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 sm:pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* BREADCRUMB & BACK NAVIGATION */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/careers" className="hover:text-blue-600 transition-colors">
              Careers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {job.title}
            </span>
          </div>

          <Button
            as={Link}
            href="/careers"
            variant="light"
            size="sm"
            startContent={<ArrowLeft className="w-4 h-4" />}
            className="text-gray-600 hover:text-blue-600 font-semibold text-xs sm:text-sm rounded-full"
          >
            {language === "en" ? "All Positions" : "সকল পদসমূহ"}
          </Button>
        </div>

        {/* HERO BANNER CARD */}
        <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-slate-700/50">
          {/* Ambient Glowing Blobs */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 border border-blue-400/30 text-blue-300">
                  <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                  <span>{job.department || "Instructor"}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{job.jobType || "Contract"}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500/20 border border-purple-400/30 text-purple-300">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>{displayLocation}</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{job.isPublished ? "Actively Hiring" : "Closed"}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                {job.title}
              </h1>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>Learn &amp; Grow STEM Academy</span>
                </div>
                {postedDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Posted {postedDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <Button
                color="primary"
                size="lg"
                radius="full"
                onPress={onOpen}
                disabled={!job.isPublished}
                className="bg-[#3B82F6] hover:bg-blue-600 text-white font-black px-8 py-6 text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02]"
              >
                {language === "en" ? "Apply for Position" : "আবেদন করুন"}
              </Button>

              <Button
                variant="bordered"
                size="lg"
                radius="full"
                onPress={handleShare}
                startContent={<Share2 className="w-4 h-4 text-slate-300" />}
                className="border-slate-600 text-slate-200 hover:bg-white/10 text-xs sm:text-sm font-semibold"
              >
                {copied ? "Link Copied!" : "Share Job"}
              </Button>
            </div>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {submitSuccess && (
          <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-6 rounded-3xl shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-900">Application Submitted Successfully!</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Thank you for applying for the <strong>{job.title}</strong> role at Learn &amp; Grow. Our recruitment team will review your profile and reach out via email/phone soon.
              </p>
            </div>
          </div>
        )}

        {/* 2-COLUMN MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Job Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* SALARY & COMPENSATION CARD */}
            {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/90 rounded-[28px] p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                        Offered Compensation
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-[#1E293B] tracking-tight mt-0.5">
                        {job.salaryRange.currency || "BDT"}{" "}
                        {job.salaryRange.min ? job.salaryRange.min.toLocaleString() : ""}
                        {job.salaryRange.min && job.salaryRange.max ? " – " : ""}
                        {job.salaryRange.max ? job.salaryRange.max.toLocaleString() : ""}{" "}
                        <span className="text-xs sm:text-sm font-bold text-gray-500 font-sans">
                          / month (batch scale)
                        </span>
                      </h2>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs self-start sm:self-auto">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Performance Bonuses Included
                  </span>
                </div>
              </div>
            )}

            {/* JOB DESCRIPTION CARD */}
            <Card className="rounded-[32px] border border-gray-100 shadow-sm bg-white overflow-hidden">
              <CardBody className="p-6 sm:p-9 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#3B82F6]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight">
                      Job Overview &amp; Responsibilities
                    </h2>
                    <p className="text-xs text-gray-500">What you will do in this role</p>
                  </div>
                </div>

                {/* Paragraphs with enhanced typography */}
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                  {descriptionParagraphs.map((paragraph: string, idx: number) => (
                    <p key={idx} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* REQUIREMENTS CARD */}
            {job.requirements && job.requirements.length > 0 && (
              <Card className="rounded-[32px] border border-gray-100 shadow-sm bg-white overflow-hidden">
                <CardBody className="p-6 sm:p-9 space-y-6">
                  <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight">
                        Requirements &amp; Qualifications
                      </h2>
                      <p className="text-xs text-gray-500">Skills, background and mindset we seek</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {job.requirements.map((req: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-gray-100 hover:border-blue-200 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 font-medium leading-relaxed">
                          {req}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* PERKS & CULTURE HIGHLIGHTS */}
            <Card className="rounded-[32px] border border-gray-100 shadow-sm bg-white overflow-hidden">
              <CardBody className="p-6 sm:p-9 space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#2C2C2C] tracking-tight">
                      Why Join Learn &amp; Grow?
                    </h2>
                    <p className="text-xs text-gray-500">Perks of working with our edtech platform</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-100 bg-[#EAF4FB]/50 space-y-1.5">
                    <span className="text-2xl">🌐</span>
                    <h3 className="text-sm font-bold text-gray-900">100% Remote Flexibility</h3>
                    <p className="text-xs text-gray-600">
                      Teach weekend and evening live batches conveniently from anywhere with high-speed internet.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-[#FFF8E1]/50 space-y-1.5">
                    <span className="text-2xl">📈</span>
                    <h3 className="text-sm font-bold text-gray-900">Scalable Earnings Model</h3>
                    <p className="text-xs text-gray-600">
                      Earn direct revenue shares per student enrollment with opportunities to teach multiple batches.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-[#F5F0FF]/50 space-y-1.5">
                    <span className="text-2xl">🚀</span>
                    <h3 className="text-sm font-bold text-gray-900">World-Class Curriculum</h3>
                    <p className="text-xs text-gray-600">
                      Full access to ready-to-teach slide decks, coding project files, and interactive student exercises.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-[#ECFDF5]/50 space-y-1.5">
                    <span className="text-2xl">🎓</span>
                    <h3 className="text-sm font-bold text-gray-900">Direct Mentorship Impact</h3>
                    <p className="text-xs text-gray-600">
                      Inspire bright teenagers aged 10-17 and guide them to build real software and robotics portfolios.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* APPLICATION TIMELINE STEPS */}
            <div className="bg-white rounded-[32px] p-6 sm:p-9 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-[#2C2C2C] flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <span>Our 3-Step Hiring Process</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                  <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-black text-xs inline-flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-xs font-bold text-gray-800">Quick Online Application</h4>
                  <p className="text-[11px] text-gray-500">Takes only 2 minutes with basic contact details</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                  <span className="w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs inline-flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-xs font-bold text-gray-800">15-Min Demo &amp; Chat</h4>
                  <p className="text-[11px] text-gray-500">Short interactive session with our academic team</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-center space-y-1">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs inline-flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-xs font-bold text-gray-800">Batch Onboarding</h4>
                  <p className="text-[11px] text-gray-500">Receive batch schedule, curriculum &amp; student list</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Summary & Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            {/* APPLY CTA CARD */}
            <Card className="rounded-[32px] border-2 border-blue-100 shadow-xl bg-white overflow-hidden">
              <CardBody className="p-6 sm:p-7 space-y-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                    Ready to inspire young innovators?
                  </span>
                  <h3 className="text-xl font-black text-[#2C2C2C] mt-1">
                    Apply for this Role
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Submissions are reviewed continuously on a rolling basis.
                  </p>
                </div>

                <Button
                  color="primary"
                  size="lg"
                  radius="full"
                  onPress={onOpen}
                  disabled={!job.isPublished}
                  className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-black py-6 text-base shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02]"
                >
                  {job.isPublished ? "Apply Now" : "Position Closed"}
                </Button>

                <div className="space-y-3.5 border-t border-gray-100 pt-5 text-xs text-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      Department
                    </span>
                    <span className="font-bold text-gray-800">{job.department || "Instructor"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Job Type
                    </span>
                    <span className="font-bold text-gray-800">{job.jobType || "Contract"}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      Location
                    </span>
                    <span className="font-bold text-gray-800">{displayLocation}</span>
                  </div>

                  {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-gray-400" />
                        Compensation
                      </span>
                      <span className="font-bold text-emerald-700">
                        {job.salaryRange.currency || "BDT"}{" "}
                        {job.salaryRange.min ? job.salaryRange.min.toLocaleString() : ""}
                        {job.salaryRange.min && job.salaryRange.max ? " – " : ""}
                        {job.salaryRange.max ? job.salaryRange.max.toLocaleString() : ""}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                      Application Time
                    </span>
                    <span className="font-bold text-gray-800">Under 2 minutes</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <p className="text-[11px] text-blue-800 font-medium">
                    Equal opportunity employer. Fast response guaranteed within 3 business days.
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* ABOUT COMPANY CARD */}
            <Card className="rounded-[32px] border border-gray-100 shadow-sm bg-white overflow-hidden">
              <CardBody className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                    LG
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">Learn &amp; Grow STEM Academy</h4>
                    <p className="text-[11px] text-gray-500">Dhaka, Bangladesh • EdTech Startup</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  We empower Bangladeshi teenagers (ages 10-17) through practical, project-based STEM, robotics, Python, and AI education.
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href="/about"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    About Us
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link
                    href="/courses"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                  >
                    Explore Courses
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM APPLY BAR ON MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 lg:hidden shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-900 truncate">{job.title}</p>
          <p className="text-[11px] text-emerald-600 font-semibold truncate">
            {job.salaryRange && (job.salaryRange.min || job.salaryRange.max)
              ? `${job.salaryRange.currency || "BDT"} ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}`
              : displayLocation}
          </p>
        </div>

        <Button
          color="primary"
          size="md"
          radius="full"
          onPress={onOpen}
          disabled={!job.isPublished}
          className="bg-[#3B82F6] text-white font-bold px-6 shadow-md shrink-0"
        >
          {job.isPublished ? "Apply Now" : "Closed"}
        </Button>
      </div>

      {/* APPLICATION FORM MODAL */}
      <JobApplicationForm
        jobId={job._id}
        jobTitle={job.title}
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={() => {
          setSubmitSuccess(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => setSubmitSuccess(false), 8000);
        }}
      />
    </div>
  );
}
