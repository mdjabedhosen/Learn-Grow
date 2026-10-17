"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/Footer";
import { TrialBookingModal } from "@/components/TrialBookingModal";
import RecruitmentModal from "@/components/RecruitmentModal";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navbar and footer for admin, manager, and instructor dashboard routes
  const isDashboardRoute = pathname.startsWith("/admin") || 
                          pathname.startsWith("/instructor") ||
                          pathname.startsWith("/manager");

  return (
    <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
      {!isDashboardRoute && <Navbar />}

      <main className={`flex-grow ${!isDashboardRoute ? 'pt-24 sm:pt-28 md:pt-24' : ''}`}>{children}</main>

      {!isDashboardRoute && <Footer />}

      <TrialBookingModal />
      <RecruitmentModal />
    </div>
  );
}
