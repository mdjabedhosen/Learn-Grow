import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import ServicesPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "STEM Learning Services - Tutoring, Kits & Live Classes",
  description:
    "Explore our STEM services: one-to-one tutoring, study materials, robotics kits, live mentor-led classes and institutional programmes for schools.",
  keywords: [
    "STEM tutoring service",
    "robotics study materials",
    "STEM learning kit",
    "live online class",
    "school STEM programme",
  ],
  canonical: "https://learnandgrow.io/services",
});

export default function ServicesPageWrapper() {
  return <ServicesPage />;
}
