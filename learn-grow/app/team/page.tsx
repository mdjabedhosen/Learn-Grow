import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import TeamPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Meet the Team - Expert Robotics & Coding Mentors",
  description:
    "Meet the engineers, instructors and mentors behind Learn & Grow. Our team teaches kids and teens robotics, Arduino, Python and STEM engineering in Bangladesh.",
  keywords: [
    "Learn and Grow team",
    "robotics instructors Bangladesh",
    "STEM mentor",
    "coding teacher",
    "Arduino instructor",
  ],
  canonical: "https://learnandgrow.io/team",
});

export default function TeamPageWrapper() {
  return <TeamPage />;
}
