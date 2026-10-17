import React from "react";
import ComboManagement from "@/components/admin/ComboManagement";

export const metadata = {
  title: "Combo Management | Manager | Learn Grow",
  description: "Manage course combos and bundles from manager dashboard.",
};

export default function ManagerComboManagementPage() {
  return (
    <div className="min-h-screen bg-default-50">
      <div className="container mx-auto px-4 py-8">
        <ComboManagement />
      </div>
    </div>
  );
}
