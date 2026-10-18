import React from "react";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Learn Grow platform and services.",
};

async function fetchTermsHtml() {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    try {
        const res = await fetch(`${base.replace(/\/$/, "")}/site-content/terms-of-use`, { cache: "no-store" });
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

import { DEFAULT_TERMS_OF_USE_HTML } from "@/lib/legalPolicies";

export default async function TermsOfUsePage() {
    const html = await fetchTermsHtml();
    const displayHtml = html || DEFAULT_TERMS_OF_USE_HTML;
    
    return (
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-[#2C2C2C]">Terms of Service / ব্যবহারের শর্তাবলী</h1>
            <div 
                className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 break-words overflow-hidden" 
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }} 
                dangerouslySetInnerHTML={{ __html: displayHtml }} 
            />
        </div>
    );
}
