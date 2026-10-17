"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Avatar, 
  Button,
  Chip
} from "@nextui-org/react";
import { User, Home, LogOut, Globe, ShieldCheck } from "lucide-react";
import Cookies from "js-cookie";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [userRole, setUserRole] = useState<"admin" | "manager" | "instructor" | "student" | "guardian">("admin");
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

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

  const toggleLanguage = () => {
    const nextLang = language === "bn" ? "en" : "bn";
    setLanguage(nextLang);
    localStorage.setItem("preferredLanguage", nextLang);
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: nextLang } }));
  };

  const isBn = language === "bn";

  useEffect(() => {
    try {
      const loggingOut = sessionStorage.getItem("loggingOut") === "1";
      if (loggingOut) return;

      const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (!userStr) {
        router.replace("/login");
        return;
      }

      const user = JSON.parse(userStr);
      if (!user?.role || (user.role !== "admin" && user.role !== "manager")) {
        router.replace("/unauthorized");
        return;
      }

      setUserRole(user.role);
      setUserName(user.name || "Admin");
      setUserEmail(user.email || "");
      setProfileImage(user.profileImage || "");
    } catch {}
    setChecking(false);
  }, [router]);

  const handleLogout = async () => {
    sessionStorage.setItem("loggingOut", "1");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("userRole", { path: "/" });
    Cookies.remove("token", { path: "/" });
    router.replace("/");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
          {/* Left Section - Title */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xs shadow-md">
              LG
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-[#2C2C2C]">
                  {isBn ? "অ্যাডমিন পোর্টাল" : "Admin Command"}
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {isBn ? `স্বাগতম, ${userName}` : `Welcome back, ${userName}`}
              </p>
            </div>
          </div>

          {/* Right Section - Language Toggle & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Toggle */}
            <button
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all shadow-2xs"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === "bn" ? "English" : "বাংলা"}</span>
            </button>

            {/* Role Badge */}
            <Chip 
              color={userRole === "admin" ? "primary" : "secondary"}
              variant="flat"
              size="sm"
              className="hidden sm:flex font-bold text-xs"
            >
              {userRole === "admin" ? (isBn ? "অ্যাডমিন" : "Admin") : (isBn ? "ম্যানেজার" : "Manager")}
            </Chip>

            {/* User Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity p-1 rounded-xl">
                  <Avatar
                    src={profileImage}
                    name={userName}
                    size="sm"
                    className="w-8 h-8 ring-2 ring-blue-500/30 text-xs font-black bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-[#2C2C2C] leading-tight">{userName}</p>
                    <p className="text-[10px] text-slate-400 capitalize leading-tight">{userRole}</p>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat" className="p-1">
                <DropdownItem
                  key="profile"
                  startContent={<User className="w-4 h-4 text-blue-600" />}
                  onPress={() => router.push("/profile")}
                  className="rounded-lg text-xs font-semibold"
                >
                  {isBn ? "আমার প্রোফাইল" : "My Profile"}
                </DropdownItem>
                <DropdownItem
                  key="home"
                  startContent={<Home className="w-4 h-4 text-emerald-600" />}
                  onPress={() => router.push("/")}
                  className="rounded-lg text-xs font-semibold"
                >
                  {isBn ? "মূল হোমপেজ" : "Go to Website"}
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut className="w-4 h-4" />}
                  onPress={handleLogout}
                  className="rounded-lg text-xs font-semibold text-rose-600"
                >
                  {isBn ? "লগআউট" : "Logout"}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-[calc(100vh-56px)] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
