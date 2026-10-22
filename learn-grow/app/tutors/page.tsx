import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import TutorsPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Our Tutors - Expert Robotics, Arduino & Coding Teachers",
  description:
    "Meet the certified tutors and mentors teaching robotics, Arduino, Python and STEM engineering to kids and teens at Learn & Grow.",
  keywords: [
    "robotics tutors Bangladesh",
    "certified STEM instructor",
    "Arduino tutor",
    "coding mentor for kids",
    "robotics teacher",
  ],
  canonical: "https://learnandgrow.io/tutors",
});

export default function TutorsPageWrapper() {
  return <TutorsPage />;
}
