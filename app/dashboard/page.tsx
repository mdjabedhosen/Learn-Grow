"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Get user role from localStorage
        const userRole = localStorage.getItem("userRole");

        // Redirect based on role
        switch (userRole?.toLowerCase()) {
            case "admin":
                router.replace("/admin");
                break;
            case "instructor":
            case "teacher":
                router.replace("/instructor");
                break;
            case "guardian":
            case "parent":
                router.replace("/guardian");
                break;
            case "student":
            default:
                router.replace("/student");
                break;
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                <p className="text-xl font-semibold text-gray-700">Loading your dashboard...</p>
                <p className="text-sm text-gray-500 mt-2">Redirecting based on your role</p>
            </div>
        </div>
    );
}
