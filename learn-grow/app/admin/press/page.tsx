import React from "react";
import PressManagementTab from "@/components/admin/PressManagementTab";

export const metadata = {
  title: "Press & Media Management | Admin",
  description: "Manage public news coverage, official press releases, and media desk contact information.",
  alternates: {
    canonical: "https://learnandgrow.io/admin/press",
  },
};

export default function AdminPressPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-6 sm:py-8 px-4 sm:px-6">
      <PressManagementTab />
    </div>
  );
}
