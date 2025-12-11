"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Courses", href: "/admin/courses", icon: "📚" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Live Classes", href: "/admin/live-classes", icon: "🎥" },
    { name: "Quizzes", href: "/admin/quizzes", icon: "📝" },
    { name: "Jobs", href: "/admin/jobs", icon: "💼" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Admin Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md border-b">
        <div className="container mx-auto px-6">
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-6 py-4 font-medium transition-colors ${pathname === item.href
                    ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        {children}
      </div>
    </div>
  );
}
