"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Tooltip } from "@nextui-org/react";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Upload,
  Video,
  Users,
  TrendingUp,
  FileText,
  LifeBuoy,
  PenLine,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarCheck
} from "lucide-react";

interface NavItem {
  labelEn: string;
  labelBn: string;
  icon: any;
  href: string;
  badge?: number;
}

export default function InstructorSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Bilingual support
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  useEffect(() => {
    const saved = (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn";
    setLanguage(saved);
    const handleLangChange = (e: any) => {
      setLanguage(e.detail?.language || (localStorage.getItem("preferredLanguage") as "bn" | "en") || "bn");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);
  const isBn = language === "bn";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems: NavItem[] = [
    { labelEn: "Dashboard", labelBn: "ড্যাশবোর্ড", icon: LayoutDashboard, href: "/instructor" },
    { labelEn: "My Courses", labelBn: "আমার কোর্সসমূহ", icon: BookOpen, href: "/instructor/courses" },
    { labelEn: "My Batches", labelBn: "আমার ব্যাচসমূহ", icon: Users, href: "/instructor/batches" },
    { labelEn: "Trial Sessions", labelBn: "ফ্রি ট্রায়াল ক্লাস", icon: CalendarCheck, href: "/instructor/trials" },
    { labelEn: "Assessments", labelBn: "অ্যাসাইনমেন্ট ও টাস্ক", icon: ClipboardCheck, href: "/instructor/assessments" },
    { labelEn: "Quizzes", labelBn: "কুইজ ম্যানেজমেন্ট", icon: Upload, href: "/instructor/quizzes" },
    { labelEn: "Live Classes", labelBn: "লাইভ ক্লাস শিডিউল", icon: Video, href: "/instructor/live-classes" },
    { labelEn: "Students", labelBn: "শিক্ষার্থী তালিকা", icon: Users, href: "/instructor/students" },
    { labelEn: "Analytics", labelBn: "অ্যানালিটিক্স", icon: TrendingUp, href: "/instructor/analytics" },
    { labelEn: "My Articles", labelBn: "আমার ব্লগসমূহ", icon: FileText, href: "/instructor/blogs" },
    { labelEn: "Write Article", labelBn: "নতুন ব্লগ লিখুন", icon: PenLine, href: "/blog/create" },
    { labelEn: "Support Tickets", labelBn: "সাপোর্ট টিকিট", icon: LifeBuoy, href: "/instructor/tickets" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/instructor") return pathname === "/instructor";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex fixed left-2 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 p-2 rounded-full shadow-md hover:bg-slate-50 transition-all hover:scale-105"
        style={{ left: isCollapsed ? "72px" : "252px" }}
        aria-label="Toggle sidebar width"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        )}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-slate-200/80 z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64 flex flex-col shadow-xl lg:shadow-none`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-slate-100 flex items-center justify-between ${
          isCollapsed ? "lg:justify-center" : ""
        }`}>
          <div className={`flex items-center gap-2.5 ${isCollapsed ? "lg:hidden" : ""}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20">
              LG
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#2C2C2C] leading-tight block">Learn & Grow</span>
              <span className="text-[10px] text-indigo-600 font-bold block uppercase tracking-wider">
                {isBn ? "শিক্ষক স্টুডিও" : "Educator Studio"}
              </span>
            </div>
          </div>

          <div className={isCollapsed ? "lg:block" : "lg:hidden"}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-indigo-500/20">
              LG
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const label = isBn ? item.labelBn : item.labelEn;

            const NavLink = (
              <Link key={item.href} href={item.href} className="block">
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                    active
                      ? "bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/30"
                      : "hover:bg-slate-50 text-slate-600 hover:text-indigo-600 font-medium"
                  } ${isCollapsed ? "lg:justify-center px-2" : ""}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
                  <span className={`text-xs flex-1 truncate ${isCollapsed ? "lg:hidden" : ""}`}>
                    {label}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      active ? "bg-white text-indigo-600" : "bg-rose-500 text-white"
                    } ${isCollapsed ? "lg:hidden" : ""}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.href} content={label} placement="right">
                  {NavLink}
                </Tooltip>
              );
            }

            return NavLink;
          })}
        </nav>
      </aside>
    </>
  );
}
