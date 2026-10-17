"use client";
import dynamic from "next/dynamic";
import { Spinner } from "@nextui-org/react";

const BlogClient = dynamic(() => import("./BlogClient"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Spinner size="lg" label="Loading Blog..." />
    </div>
  )
});

export default function BlogPage() {
  return <BlogClient />;
}
