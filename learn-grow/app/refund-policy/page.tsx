import React from "react";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Learn Grow refund and cancellation policy for courses and subscriptions.",
};

async function fetchRefundHtml() {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    try {
        const res = await fetch(`${base.replace(/\/$/, "")}/site-content/refund-policy`, { cache: "no-store" });
        const json = await res.json();
        // Check if content exists and is not empty
        if (json?.success && json?.data?.content && typeof json.data.content === "string" && json.data.content.trim() !== "") {
            return json.data.content as string;
        }
    } catch (error) {
    }
    // Return null if no valid content found in database
    return null;
}

import { DEFAULT_REFUND_POLICY_HTML } from "@/lib/legalPolicies";

export default async function RefundPolicyPage() {
    const html = await fetchRefundHtml();
    const displayHtml = html || DEFAULT_REFUND_POLICY_HTML;
    
    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#2C2C2C]">Refund Policy / রিফান্ড পলিসি</h1>
            <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 break-words overflow-hidden" 
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} 
                dangerouslySetInnerHTML={{ __html: displayHtml }} 
            />
        </div>
    );
}