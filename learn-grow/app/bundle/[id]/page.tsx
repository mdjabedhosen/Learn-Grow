import React from "react";
import { Metadata } from "next";
import ComboDetails from "@/components/combo/ComboDetails";

interface BundleDetailsPageProps {
  params: Promise<{ id: string }>;
}

// The canonical must be per-bundle. A single static canonical pointing at
// /bundle tells search engines every detail page is a duplicate of the
// listing, which de-indexes them all.
export async function generateMetadata({
  params,
}: BundleDetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const safeId = typeof id === "string" ? id.split("?")[0] : "";
  const canonical = `https://learnandgrow.io/bundle/${encodeURIComponent(safeId)}`;

  return {
    title: "Course Bundle Details",
    description:
      "See exactly what is included in this course bundle - the courses, the robotics kit, the live classes and the price - and enroll in one step.",
    alternates: {
      canonical,
    },
    openGraph: {
      title: "Course Bundle Details | Learn & Grow",
      description:
        "See exactly what is included in this course bundle - the courses, the robotics kit, the live classes and the price - and enroll in one step.",
      url: canonical,
      type: "website",
    },
  };
}

export default async function BundleDetailsPage({ params }: BundleDetailsPageProps) {
  const resolvedParams = await params;
  const idParam = resolvedParams?.id;
  const safeId = typeof idParam === "string" ? idParam.split("?")[0] : "";

  if (!safeId) {
    return (
      <div className="min-h-screen bg-default-50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-danger text-lg mb-4">Invalid bundle URL</p>
          <a href="/bundle" className="text-primary underline">Back to Bundles</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-50">
      <div className="container mx-auto px-4 py-8">
        <ComboDetails comboId={safeId} />
      </div>
    </div>
  );
}
