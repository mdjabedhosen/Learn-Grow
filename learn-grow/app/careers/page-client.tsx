"use client";

import { Button, Card, CardBody, Chip, Spinner, Input, Pagination } from "@nextui-org/react";
import { useGetPublishedJobsQuery } from "@/redux/api/jobApi";
import { useGetSiteContentQuery } from "@/redux/api/siteContentApi";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import RecruitmentProcess from "@/components/RecruitmentProcess";
import { openRecruitmentModal } from "@/components/RecruitmentModal";
import { Briefcase, Zap, Globe, MapPin, Banknote, Rocket } from "lucide-react";

const JOBS_PER_PAGE = 6;

export default function CareersPage() {
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const { data: cmsData } = useGetSiteContentQuery("careers");
  const { data: jobsData, isLoading } = useGetPublishedJobsQuery({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync language with navbar & localStorage
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

  const hero = cmsData?.data?.content?.hero ?? {
    tag: language === "en" ? "Careers" : "ক্যারিয়ার",
    title: language === "en" ? "Join Our Team" : "আমাদের টিমে যোগ দিন",
    subtitle: language === "en" ? "Shape the future of kids education with us" : "শিশুদের প্রযুক্তিশিক্ষায় বিপ্লব ঘটাতে আমাদের সাথে গড়ুন আপনার ভবিষ্যৎ",
  };

  const allJobs = jobsData?.data ?? [];

  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job: any) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobType?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allJobs, searchTerm]);

  // Paginate jobs
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" label="Loading jobs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        <div className="text-center mb-14 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EAF4FB] text-[#3B82F6] text-xs font-black rounded-full uppercase tracking-widest border border-[#B3D9F5]">
            <Briefcase className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>{hero.tag}</span>
          </span>

          <h1 className={`text-4xl sm:text-6xl font-black text-[#2C2C2C] tracking-tight leading-tight ${language === "bn" ? "font-siliguri" : ""}`}>
            {hero.title}
          </h1>

          <p className={`text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto ${language === "bn" ? "font-siliguri" : ""}`}>
            {hero.subtitle}
          </p>
        </div>

        {/* RECRUITMENT ACCORDION (Kodland "Choose a role:" Style) */}
        <RecruitmentProcess className="mb-20" />

        {/* SEARCH AND FILTER HEADER */}
        <div className="mb-8 border-t border-gray-100 pt-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-black text-[#2C2C2C] ${language === "bn" ? "font-siliguri" : ""}`}>
                {language === "en" ? "Open Positions & Opportunities" : "বর্তমান শূন্যপদ ও সুযোগসমূহ"}
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {language === "en"
                  ? `Showing ${filteredJobs.length} active opportunities`
                  : `বর্তমানে ${filteredJobs.length}টি সক্রিয় পদে নিয়োগ চলছে`}
              </p>
            </div>

            <Button
              className="bg-[#2C2C2C] hover:bg-black text-white font-black rounded-full px-6 py-2 shadow-md cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
              onPress={() => openRecruitmentModal()}
            >
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>{language === "en" ? "General Application" : "সরাসরি সিভি ড্রপ করুন"}</span>
            </Button>
          </div>

          <Input
            isClearable
            fullWidth
            placeholder={language === "en" ? "Search by title, department, location..." : "পদবীর নাম, ডিপার্টমেন্ট বা লোকেশন দিয়ে খুঁজুন..."}
            startContent={<FaSearch className="text-gray-400" />}
            value={searchTerm}
            onValueChange={handleSearch}
            classNames={{
              inputWrapper: "rounded-2xl border border-gray-200 bg-gray-50/50 shadow-xs h-12",
            }}
          />
        </div>

        {/* JOB LIST */}
        <div className="grid gap-5">
          {paginatedJobs.length === 0 && (
            <div className="text-center text-gray-500 py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-lg font-bold mb-2 text-gray-700">
                {language === "en" ? "No jobs match your search" : "আপনার সার্চের সাথে মিল রয়েছে এমন পদ পাওয়া যায়নি"}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {language === "en" ? "Try searching with different keywords or submit an open application." : "ভিন্ন কি-ওয়ার্ড দিয়ে খুঁজুন অথবা আপনার সিভি ড্রপ করুন।"}
              </p>
              <Button
                className="bg-[#3B82F6] text-white font-black rounded-full px-6"
                onPress={() => openRecruitmentModal()}
              >
                {language === "en" ? "Submit Open Application" : "ওপেন অ্যাপ্লিকেশন জমা দিন"}
              </Button>
            </div>
          )}

          {paginatedJobs.map((job: any) => (
            <Card
              key={job._id}
              className="rounded-[24px] border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group"
            >
              <CardBody className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 sm:p-7">
                {/* LEFT INFO */}
                <div className="text-left space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-black text-[#2C2C2C] group-hover:text-[#3B82F6] transition-colors">
                      {job.title}
                    </h3>
                    {job.isRemote && (
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                        <Globe className="w-3 h-3 text-emerald-700" />
                        <span>Remote</span>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {job.department && (
                      <span className="font-bold px-3 py-1 rounded-full bg-[#EAF4FB] text-[#1B5C8A]">
                        {job.department}
                      </span>
                    )}
                    {job.jobType && (
                      <span className="font-bold px-3 py-1 rounded-full bg-[#FAF5FF] text-[#7C3AED]">
                        {job.jobType}
                      </span>
                    )}
                    {job.location && (
                      <span className="font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span>{job.location}</span>
                      </span>
                    )}
                  </div>

                  {job.salaryRange && (
                    <p className="text-sm text-emerald-700 font-extrabold flex items-center gap-1.5 pt-1">
                      <Banknote className="w-4 h-4 text-emerald-600 inline" />
                      <span>
                        {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} – {job.salaryRange.max.toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Button
                    as={Link}
                    href={`/careers/${job._id}`}
                    variant="bordered"
                    className="font-bold rounded-full border-gray-200 text-gray-700 flex-1 md:flex-initial"
                  >
                    {language === "en" ? "Details" : "বিস্তারিত"}
                  </Button>
                  <Button
                    className="bg-[#2C2C2C] hover:bg-black text-white font-black rounded-full px-6 shadow-md flex-1 md:flex-initial cursor-pointer"
                    onPress={() => openRecruitmentModal({ role: job.title })}
                  >
                    {language === "en" ? "Quick Apply →" : "আবেদন করুন →"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* FALLBACK CTA */}
          <div className="text-center mt-12 p-8 sm:p-10 bg-gradient-to-br from-[#EAF4FB]/50 to-[#FAF5FF]/50 rounded-[32px] border border-blue-100/60 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Rocket className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className={`text-2xl font-black text-[#2C2C2C] mb-2 ${language === "bn" ? "font-siliguri" : ""}`}>
              {language === "en" ? "Don't see a perfect fit?" : "আপনার পছন্দের পদটি খুঁজে পাননি?"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
              {language === "en"
                ? "We are always looking for passionate teachers, engineers, and creators. Send us your CV directly and we'll reach out!"
                : "আমরা সবসময় প্রতিভাবান শিক্ষক, প্রযুক্তিবিদ ও সংগঠকদের খুঁজছি। আপনার সিভি পাঠান, সুযোগ তৈরি হলেই আমরা যোগাযোগ করব!"}
            </p>
            <Button
              className="bg-[#F59E0B] hover:bg-[#d97706] text-black font-black px-8 py-3 rounded-full text-base shadow-lg cursor-pointer transition-all hover:scale-105"
              onPress={() => openRecruitmentModal()}
            >
              {language === "en" ? "Drop Your CV" : "আপনার সিভি জমা দিন →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

