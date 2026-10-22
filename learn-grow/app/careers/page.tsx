import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import CareersPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Careers - Join the Learn & Grow STEM Education Team",
  description:
    "Join Our Team - open roles in React development, science content creation and STEM instruction at Learn & Grow Academy, Bangladesh.",
  keywords: [
    "Learn and Grow careers",
    "STEM education jobs",
    "React developer job Bangladesh",
    "science content creator",
    "teaching job robotics",
  ],
  canonical: "https://learnandgrow.io/careers",
});

export default function CareersPageWrapper() {
  return <CareersPage />;
}
