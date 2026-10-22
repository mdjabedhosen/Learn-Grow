import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import EventsPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Robotics Workshops, Competitions & STEM Events",
  description:
    "Join our community events to learn, compete and network. Free live trial classes, robotics workshops, competitions and seminars for young learners in Bangladesh.",
  keywords: [
    "robotics workshop Bangladesh",
    "STEM competition",
    "free live trial class",
    "robotics event",
    "STEM seminar",
  ],
  canonical: "https://learnandgrow.io/events",
});

export default function EventsPageWrapper() {
  return <EventsPage />;
}
