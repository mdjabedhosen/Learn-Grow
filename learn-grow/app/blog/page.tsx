import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import BlogPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Learn & Grow Blog - STEM, Robotics & Coding Tutorials",
  description:
    "Insights, tutorials and stories from the world of technology and STEM education. Learn Arduino, Python, robotics and engineering from the Learn & Grow blog.",
  keywords: [
    "STEM education blog",
    "robotics tutorials",
    "Arduino tutorial Bangladesh",
    "learn Python for kids",
    "coding for beginners",
  ],
  canonical: "https://learnandgrow.io/blog",
});

export default function BlogPageWrapper() {
  return <BlogPage />;
}
