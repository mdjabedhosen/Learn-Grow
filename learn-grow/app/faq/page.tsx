import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import FAQPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Frequently Asked Questions - Robotics & STEM Courses",
  description:
    "Answers to common questions about our robotics and STEM courses, free trial classes, learning kits, course fees, live mentor-led classes and certificates.",
  keywords: [
    "robotics course FAQ",
    "STEM course questions",
    "how to join a trial class",
    "robotics kit delivery",
    "STEM certificate",
  ],
  canonical: "https://learnandgrow.io/faq",
});

export default function FAQPageWrapper() {
  return <FAQPage />;
}
