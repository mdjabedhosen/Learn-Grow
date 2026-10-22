import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import AboutPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "About Learn & Grow - STEM & Robotics Education Academy",
  description:
    "Learn & Grow is a STEM education academy in Bangladesh offering robotics, Arduino and coding courses for kids and teens, plus hands-on learning kits and live mentor-led classes.",
  keywords: [
    "about Learn and Grow",
    "STEM education academy Bangladesh",
    "robotics academy",
    "robotics education for kids",
    "coding school Bangladesh",
  ],
  canonical: "https://learnandgrow.io/about",
});

export default function AboutPageWrapper() {
  return <AboutPage />;
}
