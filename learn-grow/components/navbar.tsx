"use client";
import React from "react";
import clsx from "clsx";
import { IoPersonAddSharp } from "react-icons/io5";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { siteConfig } from "@/config/site";
import Logo from "@/public/logo.png";
import { LearnGrowBrand } from "@/components/LearnGrowBrand";
import { openTrialModal } from "@/components/TrialBookingModal";
import {
  ChevronDown,
  BookOpen,
  Bot,
  Code,
  Gamepad2,
  GraduationCap,
  Target,
} from "lucide-react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Skeleton,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { getDashboardUrl } from "@/lib/utils/dashboard";
import { logout as apiLogout } from "@/lib/auth";

const AuthButtons = ({ isScrolled, language }: { isScrolled: boolean; language: "en" | "bn" }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [dashboardUrl, setDashboardUrl] = React.useState("/dashboard");
  const [mounted, setMounted] = React.useState(false);

  const syncAuth = React.useCallback(() => {
    setIsLoading(true);
    const loggingOut = sessionStorage.getItem("loggingOut");

    const tokenCookie = Cookies.get("accessToken");
    const tokenLocal =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const token = tokenCookie || tokenLocal;
    const userStr = localStorage.getItem("user");
    const role = Cookies.get("userRole") || localStorage.getItem("userRole");

    // If logout flag is set but new auth data exists (e.g., Google login), clear the stale flag
    if (loggingOut === "1" && (token || userStr)) {
      sessionStorage.removeItem("loggingOut");
    }

    // If logout is truly in progress and no auth data is present, short-circuit
    if (loggingOut === "1" && !token && !userStr) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    if (!token && !userStr) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const parsed = userStr ? JSON.parse(userStr) : null;
      setIsAuthenticated(true);
      setUser(parsed);
      const resolvedRole = parsed?.role || role || undefined;
      setDashboardUrl(getDashboardUrl(resolvedRole));
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    setMounted(true);
    syncAuth();

    const onAuthChange = () => {
      syncAuth();
    };
    const onStorage = () => {
      syncAuth();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        syncAuth();
      }
    };

    window.addEventListener("auth-change", onAuthChange);
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("auth-change", onAuthChange);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [syncAuth]);

  const handleLogout = async () => {
    try {
      // Set logout flag FIRST
      sessionStorage.setItem("loggingOut", "1");

      // Call API logout (don't wait for it)
      try {
        await apiLogout();
      } catch (e) {
        // API logout failed, continuing with client-side logout
      }

      // Clear cookies
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("userRole", { path: "/" });

      // Clear localStorage (minimal)
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");

      // Update local state
      setIsAuthenticated(false);
      setUser(null);
      // Use router.replace for Next.js, with window.location.href as fallback for mobile reliability
      setTimeout(() => {
        router.replace("/");
        // Fallback for mobile devices that might have issues with router
        setTimeout(() => {
          if (window.location.pathname !== "/") {
            window.location.href = "/";
          }
        }, 500);
      }, 100);
    } catch (error) {
      // Emergency logout - just go to home page
      window.location.href = "/";
    }
  };

  if (isLoading && !mounted) {
    return <Skeleton className="rounded-full w-10 h-10" />;
  }

  // If we have auth data in state, show authenticated view immediately
  if (isAuthenticated && user) {
    return (
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="primary"
            name={user?.name || user?.email || user?.phone || "User"}
            size="sm"
            src={user?.profileImage || undefined}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">
              {user?.email || user?.phone || "User"}
            </p>
          </DropdownItem>
          <DropdownItem
            key="dashboard"
            onPress={() => router.push(dashboardUrl)}
          >
            Dashboard
          </DropdownItem>
          <DropdownItem key="settings" onPress={() => router.push("/profile")}>
            My Profile
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onPress={handleLogout}
            className="cursor-pointer touch-manipulation active:opacity-80"
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  // ... (previous imports remain, no change needed)

  return (
    <div className="flex gap-2 sm:gap-3 items-center">
      <NextLink
        href="/login"
        className="text-xs sm:text-sm font-black text-[#2C2C2C] hover:text-[#3B82F6] transition-colors px-3 py-2 flex items-center gap-1.5"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span>{language === "en" ? "Log in" : "লগইন"}</span>
      </NextLink>
      <button
        onClick={() => openTrialModal({ source: "navbar" })}
        className="bg-[#2C2C2C] hover:bg-black text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center whitespace-nowrap cursor-pointer"
      >
        <span>{language === "en" ? "Free lesson" : "ফ্রি ট্রায়াল"}</span>
      </button>
    </div>
  );
};

export const Navbar = () => {
  const router = useRouter();
  const rawPathname = usePathname();
  const pathname = rawPathname || "";
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileAuth, setMobileAuth] = React.useState<{
    authed: boolean;
    user?: any;
  }>({ authed: false });

  const [language, setLanguage] = React.useState<"en" | "bn">("bn");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = (localStorage.getItem("language") || localStorage.getItem("preferredLanguage")) as "en" | "bn";
      if (storedLang) {
        setLanguage(storedLang);
      }
    }
  }, []);

  const changeLanguage = (newLang: "en" | "bn") => {
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLang);
      localStorage.setItem("preferredLanguage", newLang);
      window.dispatchEvent(new CustomEvent("languageChange", { detail: { language: newLang } }));
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const syncMobile = () => {
      const loggingOut = sessionStorage.getItem("loggingOut");
      const tokenCookie = Cookies.get("accessToken");
      const tokenLocal =
        typeof window !== "undefined"
          ? localStorage.getItem("token") || localStorage.getItem("accessToken")
          : null;
      const token = tokenCookie || tokenLocal;
      const userStr =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;

      if (loggingOut === "1" && (token || userStr)) {
        sessionStorage.removeItem("loggingOut");
      }

      if (loggingOut === "1" && !token && !userStr) {
        setMobileAuth({ authed: false });
        return;
      }

      if (token || userStr) {
        try {
          setMobileAuth({
            authed: true,
            user: userStr ? JSON.parse(userStr) : undefined,
          });
        } catch {
          setMobileAuth({ authed: true });
        }
      } else {
        setMobileAuth({ authed: false });
      }
    };

    syncMobile();
    window.addEventListener("auth-change", syncMobile);
    window.addEventListener("storage", syncMobile);
    document.addEventListener("visibilitychange", syncMobile);
    return () => {
      window.removeEventListener("auth-change", syncMobile);
      window.removeEventListener("storage", syncMobile);
      document.removeEventListener("visibilitychange", syncMobile);
    };
  }, []);

  return (
    <NextUINavbar
      isBlurred={false}
      classNames={{
        base: "py-3 transition-all duration-300 !h-auto !min-h-[76px] !fixed top-0 left-0 right-0 z-50 overflow-visible bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm",
        wrapper: "px-4 sm:px-6 lg:px-8 items-center",
      }}
      height="auto"
      maxWidth="full"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-auto" justify="start">
        <NavbarBrand as="li" className="max-w-fit shrink-0">
          <NextLink
            className="flex items-center py-1 select-none group"
            href="/"
            title="Learn & Grow Home"
          >
            <LearnGrowBrand className="h-7 sm:h-8 w-auto text-[#2C2C2C] group-hover:text-[#3B82F6] transition-colors" />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex basis-full" justify="center">
        <ul className="flex items-center gap-1 lg:gap-2">
          {/* Courses with Dropdown */}
          <Dropdown placement="bottom-start" className="rounded-2xl shadow-xl border border-gray-100">
            <DropdownTrigger>
              <button
                className={clsx(
                  "flex items-center gap-1 text-sm lg:text-base font-bold transition-all px-3 py-1.5 rounded-full cursor-pointer",
                  pathname.startsWith("/courses")
                    ? "bg-gray-100 text-[#2C2C2C]"
                    : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
                )}
              >
                <span>{language === "en" ? "Courses" : "কোর্সসমূহ"}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Course Categories" 
              className="p-2"
              onAction={(key) => {
                router.push(key as string);
              }}
            >
              <DropdownItem 
                key="/courses" 
                onPress={() => router.push("/courses")} 
                className="rounded-xl font-bold py-2.5 cursor-pointer"
                startContent={<BookOpen className="w-4 h-4 text-blue-500" />}
              >
                {language === "en" ? "All Courses" : "সকল কোর্সসমূহ"}
              </DropdownItem>
              <DropdownItem 
                key="/courses?search=robotics" 
                onPress={() => router.push("/courses?search=robotics")} 
                className="rounded-xl font-bold py-2.5 cursor-pointer"
                startContent={<Bot className="w-4 h-4 text-purple-500" />}
              >
                {language === "en" ? "Robotics & Arduino" : "রোবটিক্স ও আর্ডুইনো"}
              </DropdownItem>
              <DropdownItem 
                key="/courses?search=python" 
                onPress={() => router.push("/courses?search=python")} 
                className="rounded-xl font-bold py-2.5 cursor-pointer"
                startContent={<Code className="w-4 h-4 text-emerald-500" />}
              >
                {language === "en" ? "Python & AI" : "পাইথন ও এআই"}
              </DropdownItem>
              <DropdownItem 
                key="/courses?search=game" 
                onPress={() => router.push("/courses?search=game")} 
                className="rounded-xl font-bold py-2.5 cursor-pointer"
                startContent={<Gamepad2 className="w-4 h-4 text-amber-500" />}
              >
                {language === "en" ? "Game Coding" : "গেম ডেভেলপমেন্ট"}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Tutors Link */}
          <li>
            <NextLink
              href="/tutors"
              className={clsx(
                "inline-block text-sm lg:text-base font-bold transition-all px-3.5 py-1.5 rounded-full",
                pathname === "/tutors"
                  ? "bg-gray-100 text-[#2C2C2C] shadow-inner font-black"
                  : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
              )}
            >
              {language === "en" ? "Tutors" : "শিক্ষকবৃন্দ"}
            </NextLink>
          </li>

          {/* Events Link */}
          <li>
            <NextLink
              href="/events"
              className={clsx(
                "inline-block text-sm lg:text-base font-bold transition-all px-3.5 py-1.5 rounded-full",
                pathname.startsWith("/events")
                  ? "bg-gray-100 text-[#2C2C2C] shadow-inner font-black"
                  : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
              )}
            >
              {language === "en" ? "Events" : "ইভেন্টস"}
            </NextLink>
          </li>

          {/* About with Dropdown */}
          <Dropdown placement="bottom-start" className="rounded-2xl shadow-xl border border-gray-100">
            <DropdownTrigger>
              <button
                className={clsx(
                  "flex items-center gap-1 text-sm lg:text-base font-bold transition-all px-3 py-1.5 rounded-full cursor-pointer",
                  pathname.startsWith("/about")
                    ? "bg-gray-100 text-[#2C2C2C]"
                    : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
                )}
              >
                <span>{language === "en" ? "About" : "আমাদের সম্পর্কে"}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="About Menu" 
              className="p-2"
              onAction={(key) => {
                const target = key as string;
                if (target.startsWith("/#")) {
                  if (pathname === "/") {
                    const el = document.getElementById(target.substring(2));
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push(target);
                  }
                } else {
                  router.push(target);
                }
              }}
            >
              <DropdownItem 
                key="/about" 
                onPress={() => router.push("/about")} 
                className="rounded-xl font-bold py-2.5 cursor-pointer"
                startContent={<GraduationCap className="w-4 h-4 text-blue-500" />}
              >
                {language === "en" ? "About Academy" : "একাডেমি পরিচিতি"}
              </DropdownItem>
              <DropdownItem 
                key="/#goals" 
                onPress={() => {
                  if (pathname === "/") {
                    const el = document.getElementById("goals");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  } else {
                    router.push("/#goals");
                  }
                }} 
                className="rounded-xl font-bold py-2.5 cursor-pointer"
                startContent={<Target className="w-4 h-4 text-purple-500" />}
              >
                {language === "en" ? "Our Mission" : "আমাদের লক্ষ্য ও উদ্দেশ্য"}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Blog Link */}
          <li>
            <NextLink
              href="/blog"
              className={clsx(
                "inline-block text-sm lg:text-base font-bold transition-all px-3.5 py-1.5 rounded-full",
                pathname.startsWith("/blog")
                  ? "bg-gray-100 text-[#2C2C2C] shadow-inner font-black"
                  : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
              )}
            >
              {language === "en" ? "Blog" : "ব্লগ"}
            </NextLink>
          </li>

          {/* FAQ Link */}
          <li>
            <NextLink
              href="/faq"
              className={clsx(
                "inline-block text-sm lg:text-base font-bold transition-all px-4 py-1.5 rounded-full",
                pathname === "/faq"
                  ? "bg-gray-100 text-[#2C2C2C] font-black"
                  : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
              )}
            >
              {language === "en" ? "FAQ" : "সাধারণ প্রশ্ন"}
            </NextLink>
          </li>

          {/* Contact Link */}
          <li>
            <NextLink
              href="/contact"
              className={clsx(
                "inline-block text-sm lg:text-base font-bold transition-all px-4 py-1.5 rounded-full",
                pathname === "/contact"
                  ? "bg-gray-100 text-[#2C2C2C] font-black"
                  : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50"
              )}
            >
              {language === "en" ? "Contact" : "যোগাযোগ"}
            </NextLink>
          </li>
        </ul>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex basis-auto items-center gap-4" justify="end">
        {/* Language Switcher */}
        <NavbarItem className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => changeLanguage("bn")}
            className={clsx(
              "px-3 py-1 text-xs font-bold rounded-lg transition-all",
              language === "bn"
                ? "bg-[#2C2C2C] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            বাং
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={clsx(
              "px-3 py-1 text-xs font-bold rounded-lg transition-all",
              language === "en"
                ? "bg-[#2C2C2C] text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            EN
          </button>
        </NavbarItem>

        <NavbarItem>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <AuthButtons isScrolled={isScrolled} language={language} />
          </motion.div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1/5 items-center gap-2" justify="end">
        {/* Mobile Language Switcher */}
        <div className="flex items-center gap-0.5 bg-gray-500/10 backdrop-blur-md border border-gray-500/20 p-0.5 rounded-lg">
          <button
            onClick={() => changeLanguage("bn")}
            className={clsx(
              "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all",
              language === "bn"
                ? "bg-[#2C2C2C] text-white"
                : isScrolled ? "text-gray-600" : "text-white/80"
            )}
          >
            বাং
          </button>
          <button
            onClick={() => changeLanguage("en")}
            className={clsx(
              "px-2 py-0.5 text-[10px] font-bold rounded-md transition-all",
              language === "en"
                ? "bg-[#2C2C2C] text-white"
                : "text-gray-700 hover:text-[#3B82F6]"
            )}
          >
            EN
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.9 }}
        >
          <NavbarMenuToggle
            className="ml-2 touch-manipulation active:scale-95 transition-all duration-500 ease-out w-8 h-8 [&>span]:w-6 [&>span]:h-0.5 [&>span:nth-child(2)]:my-1 [&>span]:transition-all [&>span]:duration-500 text-gray-800"
            aria-label="Toggle navigation menu"
          />
        </motion.div>
      </NavbarContent>

      <NavbarMenu
        className="pt-6 pb-safe max-h-[calc(100vh-80px)] overflow-y-auto transition-all duration-300 ease-out bg-white/98 backdrop-blur-2xl border-t border-gray-100 shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-4 select-none space-y-1.5"
        >
          {siteConfig.navItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`}>
              <NextLink
                className={clsx(
                  "w-full text-base font-bold py-3.5 px-4 rounded-2xl touch-manipulation transition-all duration-200 flex items-center justify-between",
                  pathname === item.href
                    ? "bg-gray-100 text-[#2C2C2C] font-black"
                    : "text-gray-700 hover:text-[#3B82F6] hover:bg-gray-50 active:bg-gray-100"
                )}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{item.label}</span>
                <span className="text-gray-400 text-xs">→</span>
              </NextLink>
            </NavbarMenuItem>
          ))}
        </motion.div>
        <NavbarMenuItem>
          <div className="flex flex-col gap-3 mt-6 w-full px-4 pb-6 border-t border-gray-100 pt-6">
            {mobileAuth.authed ? (
              <>
                <Button
                  as={NextLink}
                  className="text-sm font-bold border-2 border-gray-200 text-gray-800 rounded-full min-h-[48px]"
                  href={getDashboardUrl(mobileAuth.user?.role)}
                  variant="bordered"
                  fullWidth
                  onPress={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Button>
                <Button
                  className="text-sm font-bold bg-red-500 text-white rounded-full min-h-[48px]"
                  fullWidth
                  onPress={async () => {
                    try {
                      sessionStorage.setItem("loggingOut", "1");
                      await apiLogout();
                      Cookies.remove("accessToken", { path: "/" });
                      Cookies.remove("refreshToken", { path: "/" });
                      Cookies.remove("userRole", { path: "/" });
                      localStorage.removeItem("user");
                      localStorage.removeItem("userRole");
                      localStorage.removeItem("token");
                      localStorage.removeItem("accessToken");
                      window.dispatchEvent(new Event("auth-change"));
                      setMobileAuth({ authed: false });
                      setIsMenuOpen(false);
                      window.location.href = "/";
                    } catch (error) {
                      window.location.href = "/";
                    }
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={NextLink}
                  className="text-sm font-bold border-2 border-gray-200 text-gray-800 rounded-full min-h-[48px] hover:border-gray-400"
                  href="/login"
                  variant="bordered"
                  fullWidth
                  onPress={() => setIsMenuOpen(false)}
                >
                  {language === "en" ? "Log in" : "লগইন"}
                </Button>
                <Button
                  className="text-sm font-black bg-[#2C2C2C] hover:bg-black text-white rounded-full min-h-[48px] shadow-lg cursor-pointer"
                  variant="solid"
                  fullWidth
                  onPress={() => {
                    setIsMenuOpen(false);
                    openTrialModal({ source: "navbar_mobile" });
                  }}
                >
                  {language === "en" ? "Free lesson" : "ফ্রি ট্রায়াল"}
                </Button>
              </>
            )}
          </div>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
