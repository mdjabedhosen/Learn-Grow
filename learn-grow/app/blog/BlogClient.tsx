"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Pagination, Spinner } from "@nextui-org/react";
import DOMPurify from "isomorphic-dompurify";
import {
  useGetAllBlogsQuery,
  useGetAllBlogCategoriesQuery,
} from "@/redux/api/blogApi";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Plus,
  BookOpen,
  Tag,
  CheckCircle2,
  X,
  Share2,
  TrendingUp,
  GraduationCap,
  Newspaper,
  Star,
} from "lucide-react";

// Helper function to decode HTML entities
const decodeHtmlEntities = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'");
};

// Helper function to strip HTML tags for clean card excerpt
const stripHtml = (html: string): string => {
  if (!html) return "";
  const decoded = decodeHtmlEntities(html);
  return decoded.replace(/<[^>]*>?/gm, "").trim();
};

export default function BlogClient() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  // Language sync
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = (localStorage.getItem("language") || localStorage.getItem("preferredLanguage")) as "bn" | "en";
      if (stored) setLanguage(stored);

      const handleLangChange = (e: any) => {
        const newLang = (e.detail?.language || localStorage.getItem("language") || localStorage.getItem("preferredLanguage") || "bn") as "bn" | "en";
        setLanguage(newLang);
      };
      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  // Get user role from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      }
    } catch (e) {}
  }, []);

  // Fetch blogs and categories
  const { data: blogsResponse, isLoading: blogsLoading } = useGetAllBlogsQuery({
    page,
    limit: 10,
    search: search || undefined,
    category: selectedCategory || undefined,
    status: "approved",
  });

  const { data: categoriesResponse } = useGetAllBlogCategoriesQuery();

  const blogs = blogsResponse?.data || [];
  const pagination = blogsResponse?.pagination || {};
  const categories = categoriesResponse?.data || [];

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setPage(1);
  };

  // Determine if featured layout is applicable
  const isDefaultView = page === 1 && !search && !selectedCategory;
  const featuredBlog = isDefaultView && blogs.length > 0 ? blogs[0] : null;
  const regularBlogs = isDefaultView && blogs.length > 1 ? blogs.slice(1) : isDefaultView ? [] : blogs;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-[#2C2C2C]">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#EAF4FB]/80 via-[#F5F0FF]/40 to-[#F8F9FA] pt-14 pb-20 px-4 border-b border-slate-200/60 overflow-hidden">
        {/* Soft background glow circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7C3AED] text-white text-xs font-black rounded-full uppercase tracking-widest shadow-md shadow-purple-500/20 mb-5">
            <Newspaper className="w-3.5 h-3.5 text-white" />
            <span>{language === "bn" ? "লার্ন অ্যান্ড গ্রো ব্লগ ও রিসোর্স" : "Learn & Grow Blog & Articles"}</span>
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#2C2C2C] tracking-tight leading-tight mb-4">
            {language === "bn" ? (
              <>
                প্রযুক্তি, কোডিং ও রোবোটিক্স এর{" "}
                <span className="bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                  সেরা গাইডলাইন
                </span>
              </>
            ) : (
              <>
                Insights on Tech, Coding &{" "}
                <span className="bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#F59E0B] bg-clip-text text-transparent">
                  Robotics for Kids
                </span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium mb-6">
            {language === "bn"
              ? "শিশু ও কিশোরদের প্রোগ্রামিং শেখার টিপস, স্টেম প্রজেক্ট গাইড এবং বিশেষজ্ঞদের বাস্তব অভিজ্ঞতা থেকে শিখুন।"
              : "Practical coding tutorials, robotics guides, and inspiring innovation stories from our expert instructors."}
          </p>

          {/* Quick value badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-slate-700 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-xs">
              <CheckCircle2 size={14} className="text-emerald-500" />
              {language === "bn" ? "বাস্তবমুখী প্রজেক্ট গাইড" : "Hands-On Project Guides"}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-xs">
              <Sparkles size={14} className="text-amber-500" />
              {language === "bn" ? "রোবোটিক্স ও কোডিং টিপস" : "Robotics & Coding Tips"}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-xs">
              <GraduationCap size={14} className="text-blue-500" />
              {language === "bn" ? "অভিজ্ঞ মেন্টরদের লেখা" : "Expert Instructor Written"}
            </span>
          </div>

          {/* Write a Blog CTA if logged in as student, instructor, admin */}
          {userRole && ["student", "instructor", "admin"].includes(userRole) && (
            <button
              onClick={() => router.push("/blog/create")}
              className="inline-flex items-center gap-2 bg-[#2C2C2C] hover:bg-[#3B82F6] text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <Plus size={16} />
              <span>{language === "bn" ? "নতুন ব্লগ লিখুন" : "Write an Article"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Categories Bar */}
        <div className="-mt-8 relative z-20 mb-12">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200/80 p-4 sm:p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "কী শিখতে চান? অনুসন্ধান করুন (যেমন: পাইথন, রোবোটিক্স, এআই)..."
                    : "Search articles, topics, guides (e.g., Python, Robotics, Arduino)..."
                }
                className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:bg-white transition"
              />
              {search && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              <button
                onClick={() => handleCategoryClick("")}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === ""
                    ? "bg-[#7C3AED] text-white shadow-md shadow-purple-500/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{language === "bn" ? "সকল বিষয়" : "All Categories"}</span>
              </button>

              {categories.map((cat: any) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryClick(cat._id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat._id
                      ? "bg-[#7C3AED] text-white shadow-md shadow-purple-500/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Filter Status / Reset */}
            {(search || selectedCategory) && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
                <span>
                  {language === "bn" ? "ফিল্টার করা ফলাফল:" : "Filtered results:"}{" "}
                  <strong className="text-slate-900">{blogs.length} টি ব্লগ</strong>
                </span>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                >
                  {language === "bn" ? "ফিল্টার মুছুন" : "Clear filters"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {blogsLoading ? (
          <div className="py-24 text-center">
            <Spinner size="lg" color="secondary" />
            <p className="text-sm font-bold text-slate-500 mt-4">
              {language === "bn" ? "ব্লগ লোড হচ্ছে..." : "Loading articles..."}
            </p>
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-[28px] border-2 border-dashed border-slate-200 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {language === "bn" ? "কোনো ব্লগ খুঁজে পাওয়া যায়নি" : "No articles found"}
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              {search || selectedCategory
                ? language === "bn"
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ব্লগ পাওয়া যায়নি। অন্য কোনো বিষয় দিয়ে চেষ্টা করুন।"
                  : "We couldn't find any articles matching your search or category."
                : language === "bn"
                  ? "শীঘ্রই আমাদের নতুন ব্লগ ও টিউটোরিয়াল প্রকাশিত হবে।"
                  : "New articles and tutorials will be published soon!"}
            </p>
            {(search || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-[#2C2C2C] hover:bg-[#3B82F6] text-white rounded-full text-xs sm:text-sm font-bold transition"
              >
                {language === "bn" ? "সকল ব্লগ দেখুন" : "View all articles"}
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Article Hero (Spotlight) */}
            {featuredBlog && (
              <div className="mb-12">
                <div
                  onClick={() => router.push(`/blog/${featuredBlog.slug}`)}
                  className="group cursor-pointer bg-white rounded-[28px] border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Featured Image */}
                    <div className="lg:col-span-7 relative min-h-[260px] sm:min-h-[360px] bg-slate-100 overflow-hidden">
                      {featuredBlog.image ? (
                        <Image
                          src={featuredBlog.image}
                          alt={featuredBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                          <BookOpen size={48} className="text-blue-400" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                          <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                          <span>{language === "bn" ? "ফিচার্ড আর্টিকেল" : "Featured Spotlight"}</span>
                        </span>
                        {featuredBlog.category && (
                          <span className="bg-white/95 backdrop-blur-md text-[#7C3AED] font-black text-xs px-3 py-1 rounded-full shadow-sm">
                            {featuredBlog.category.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Featured Details */}
                    <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-blue-500" />
                            {new Date(featuredBlog.createdAt).toLocaleDateString(
                              language === "bn" ? "bn-BD" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-amber-500" />
                            {featuredBlog.readTime || 5} {language === "bn" ? "মিনিট পাঠ" : "min read"}
                          </span>
                        </div>

                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#2C2C2C] group-hover:text-blue-600 transition-colors leading-tight mb-4">
                          {featuredBlog.title}
                        </h2>

                        <p className="text-sm sm:text-base text-slate-600 line-clamp-3 leading-relaxed mb-6">
                          {stripHtml(featuredBlog.excerpt) || stripHtml(featuredBlog.content).slice(0, 180)}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                            {featuredBlog.author?.name ? featuredBlog.author.name.charAt(0).toUpperCase() : "L"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-none">
                              {featuredBlog.author?.name || "Learn & Grow Mentor"}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {language === "bn" ? "শিক্ষক ও গবেষক" : "STEM Educator"}
                            </p>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-2 text-sm font-black text-[#3B82F6] group-hover:translate-x-1 transition-transform">
                          <span>{language === "bn" ? "পড়ুন" : "Read"}</span>
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Grid Header */}
            {isDefaultView && regularBlogs.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {language === "bn" ? "সর্বশেষ প্রকাশিত আর্টিকেল" : "Latest Articles & Guides"}
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {regularBlogs.length} {language === "bn" ? "টি লেখা" : "stories"}
                </span>
              </div>
            )}

            {/* Standard Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
              {(isDefaultView ? regularBlogs : blogs).map((blog: any) => (
                <div
                  key={blog._id}
                  onClick={() => router.push(`/blog/${blog.slug}`)}
                  className="group cursor-pointer bg-white rounded-[26px] border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                >
                  {/* Card Thumbnail */}
                  <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center">
                        <BookOpen size={36} className="text-slate-300" />
                      </div>
                    )}

                    {/* Floating Category Tag */}
                    {blog.category && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-md text-[#2C2C2C] text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-slate-100">
                          {blog.category.name}
                        </span>
                      </div>
                    )}

                    {/* Reading time */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock size={11} />
                        <span>{blog.readTime || 5}m</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-2.5">
                        <Calendar size={13} />
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString(
                            language === "bn" ? "bn-BD" : "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 group-hover:text-[#3B82F6] transition-colors line-clamp-2 leading-snug mb-2.5">
                        {blog.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {stripHtml(blog.excerpt) || stripHtml(blog.content).slice(0, 120)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[130px]">
                          {blog.author?.name || "Author"}
                        </span>
                      </div>

                      <span className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-all duration-300">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {(pagination as any)?.totalPages > 1 && (
              <div className="flex justify-center mt-12 mb-16">
                <Pagination
                  color="secondary"
                  page={page}
                  total={(pagination as any)?.totalPages || 1}
                  onChange={setPage}
                  className="shadow-sm"
                />
              </div>
            )}
          </>
        )}

        {/* Counseling / Trial Lesson Bottom Card */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[32px] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-black rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{language === "bn" ? "ভবিষ্যৎ বিনির্মাণ" : "Future-Ready STEM"}</span>
            </span>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              {language === "bn"
                ? "আপনার সন্তানের কোডিং ও রোবোটিক্স যাত্রা শুরু হোক আজই!"
                : "Empower Your Child with Robotics & Coding Skills Today!"}
            </h3>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed mb-6 font-medium">
              {language === "bn"
                ? "১০-১৫ জনের ছোট ব্যাচ, অভিজ্ঞ শিক্ষক এবং শতভাগ লাইভ ইন্টারঅ্যাক্টিভ ক্লাসের সাথে আপনার সন্তানকে এগিয়ে রাখুন।"
                : "Join 100% interactive live batches of 10-15 students, real hardware kits, and certified mentors."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-white text-blue-900 hover:bg-amber-400 hover:text-black font-black text-sm px-6 py-3.5 rounded-full shadow-lg transition-all hover:scale-105"
              >
                <span>{language === "bn" ? "কোর্সসমূহ দেখুন" : "Explore Courses"}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-full backdrop-blur-md transition"
              >
                <span>{language === "bn" ? "পরামর্শের জন্য যোগাযোগ করুন" : "Free Consultation"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
