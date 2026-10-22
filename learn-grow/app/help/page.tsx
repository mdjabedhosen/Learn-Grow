import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import HelpPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Help & Support - Learn & Grow",
  description:
    "How can we help you? Find answers, troubleshooting steps and contact options for your Learn & Grow courses, robotics kits and live classes.",
  keywords: [
    "Learn and Grow help",
    "support centre",
    "course troubleshooting",
    "robotics kit help",
    "contact support",
  ],
  canonical: "https://learnandgrow.io/help",
});

export default function HelpPageWrapper() {
  return <HelpPage />;
}
