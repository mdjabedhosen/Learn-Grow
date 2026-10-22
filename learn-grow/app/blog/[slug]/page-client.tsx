"use client";

import React, { useEffect, useState } from "react";
import {
  Chip,
  Button,
  Spinner,
  Divider,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useGetBlogBySlugQuery } from "@/redux/api/blogApi";
import { FaArrowLeft, FaEdit, FaCalendarAlt, FaClock, FaEye, FaShareAlt, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";

// Helper function to decode HTML entities & replace non-breaking spaces with standard spaces
const cleanHtmlString = (html: string): string => {
  if (!html) return "";
  let clean = html
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\u200B/g, "") // strip zero-width space
    .replace(/\u00AD/g, "") // strip soft hyphens causing word splits
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\u00A0/g, " ");

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = clean;
    clean = textarea.value.replace(/\u00A0/g, " ");
  }

  return clean;
};

export default function BlogDetailPage({
  slug: slugProp,
}: {
  slug?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const blogSlug = (slugProp ?? (params.slug as string)) as string;
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [displayContent, setDisplayContent] = useState<string>("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user._id || user.id);
        setUserRole(user.role);
      } catch (e) {}
    }
  }, []);

  const { data: blogResponse, isLoading } = useGetBlogBySlugQuery(blogSlug, {
    skip: !blogSlug,
  });

  const blog = blogResponse?.data;

  useEffect(() => {
    if (blog?.content) {
      const raw = cleanHtmlString(blog.content);
      // Dynamically load dompurify in the browser safely
      import("dompurify")
        .then((mod) => {
          const DOMPurify = mod.default || mod;
          if (DOMPurify && typeof DOMPurify.sanitize === "function") {
            const sanitized = DOMPurify.sanitize(raw, {
              ADD_TAGS: ["iframe", "img", "figure", "figcaption"],
              ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "src", "alt", "class", "style", "target", "rel"],
            });
            setDisplayContent(sanitized);
          } else {
            setDisplayContent(raw);
          }
        })
        .catch(() => {
          setDisplayContent(raw);
        });
    }
  }, [blog?.content]);

  const isOwner = blog && userId && (blog.author?._id === userId || blog.author?.id === userId);
  const isAdmin = userRole === "admin";
  const canManage = isOwner || isAdmin;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("ব্লগের লিংক কপি করা হয়েছে!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Spinner size="lg" label="ব্লগ লোড হচ্ছে..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border-2 border-red-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
            <FaSearch />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2 font-siliguri">
            ব্লগটি পাওয়া যায়নি
          </h2>
          <p className="text-gray-500 mb-6 text-sm font-siliguri">
            আপনার কাঙ্ক্ষিত ব্লগ পোস্টটি সরানো হয়েছে অথবা লিঙ্কটি ভুল।
          </p>
          <Button
            className="bg-[#2C2C2C] text-white font-bold rounded-full px-6"
            onPress={() => router.push("/blog")}
          >
            সকল ব্লগে ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  const isBangla = /[\u0980-\u09FF]/.test(blog.title);

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <FaArrowLeft className="text-xs" />
            <span>ব্লগ তালিকায় ফিরে যান</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-full shadow-sm transition-all cursor-pointer"
              title="শেয়ার করুন"
            >
              <FaShareAlt className="text-xs text-primary" />
              <span className="hidden sm:inline">শেয়ার</span>
            </button>

            {canManage && (
              <button
                onClick={() => router.push(`/blog/${blogSlug}/edit`)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-bold rounded-full shadow-md transition-all cursor-pointer"
              >
                <FaEdit className="text-xs" />
                <span>এডিট</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Article Container */}
        <article className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden p-6 sm:p-12 md:p-16">
          {/* Category & Tags Header */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {blog.category && (
              <span className="px-4 py-1.5 bg-[#EAF4FB] text-[#1B5C8A] border border-[#B3D9F5] text-xs font-black rounded-full uppercase tracking-wider">
                {blog.category.name}
              </span>
            )}
            {blog.metaTags &&
              blog.metaTags.map((tag: string, index: number) => (
                <span
                  key={`${tag}-${index}`}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Main Title */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-black text-[#2C2C2C] tracking-tight leading-tight sm:leading-snug mb-6 ${
              isBangla ? "font-siliguri" : ""
            }`}
            style={{ wordBreak: "normal", overflowWrap: "break-word" }}
          >
            {blog.title}
          </h1>

          {/* Author & Publication Meta Bar */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm py-5 border-y border-gray-100 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#EAF4FB] border border-[#B3D9F5] flex items-center justify-center overflow-hidden flex-shrink-0 text-[#1B5C8A] font-black text-base">
                {blog.author?.profileImage ? (
                  <img
                    src={blog.author.profileImage}
                    alt={blog.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{blog.author?.name?.charAt(0).toUpperCase() || "L"}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-[#2C2C2C] leading-snug">
                  {blog.author?.name || "Learn & Grow Team"}
                </p>
                <p className="text-xs text-gray-400">অফিসিয়াল পাবলিকেশন</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 ml-auto">
              <span className="flex items-center gap-1.5">
                <FaCalendarAlt className="text-gray-400" />
                {new Date(blog.createdAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FaClock className="text-gray-400" />
                {blog.readTime || 5} মিনিট পড়ার সময়
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <FaEye className="text-gray-400" />
                {blog.viewCount || 1} ভিউ
              </span>
            </div>
          </div>

          {/* Hero Featured Image */}
          {blog.image && (
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[24px] overflow-hidden shadow-lg border border-gray-100 mb-10 group">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-102 transition-transform duration-500"
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>
          )}

          {/* Excerpt Lead Box */}
          {blog.excerpt && (
            <div className="bg-[#FFF8E1] border-l-4 border-[#F59E0B] p-6 rounded-r-2xl mb-10">
              <p
                className={`text-lg sm:text-xl font-medium text-gray-800 leading-relaxed ${
                  isBangla ? "font-siliguri" : ""
                }`}
                style={{ wordBreak: "normal", overflowWrap: "break-word" }}
              >
                {blog.excerpt}
              </p>
            </div>
          )}

          {/* Article Rich Body Content */}
          <div
            className={`prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal ${
              isBangla ? "font-siliguri" : ""
            }`}
            style={{
              wordBreak: "normal",
              overflowWrap: "break-word",
              lineHeight: "1.9",
            }}
            dangerouslySetInnerHTML={{
              __html: displayContent || cleanHtmlString(blog.content),
            }}
          />

          <Divider className="my-10" />

          {/* Author Sign-off & Footer */}
          <div className="bg-[#F8F9FA] border border-gray-100 rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#7C3AED] text-white flex items-center justify-center font-black text-2xl shadow-md flex-shrink-0">
              LG
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xl font-black text-[#2C2C2C] mb-1 font-siliguri">
                Learn & Grow
              </h4>
              <p className="text-sm text-gray-600 mb-3 font-siliguri leading-relaxed">
                বাংলাদেশের তরুণ প্রজন্মকে রোবটিক্স, প্রোগ্রামিং এবং বাস্তবমুখী STEM শিক্ষায় দক্ষ করে গড়ে তোলার জাতীয় প্ল্যাটফর্ম।
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <span>ঢাকা, বাংলাদেশ</span>
                </span>
                <span>•</span>
                <a
                  href="https://learnandgrow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3B82F6] hover:underline"
                >
                  learnandgrow.io
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
