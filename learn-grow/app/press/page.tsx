import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import PressPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Press & Media - Learn & Grow STEM Education",
  description:
    "Press releases, media coverage, brand assets and official information about Learn & Grow Academy, the robotics and STEM education platform for young learners.",
  keywords: [
    "Learn and Grow press",
    "STEM education media",
    "robotics academy news",
    "brand assets",
    "press release",
  ],
  canonical: "https://learnandgrow.io/press",
});

export default function PressPageWrapper() {
  return <PressPage />;
}
