import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import ContactPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Learn & Grow - Talk to Our STEM & Robotics Team",
  description:
    "Get in touch with Learn & Grow. Call, WhatsApp or email our team about robotics courses, STEM kits, free trial classes and school or institutional programmes in Bangladesh.",
  keywords: [
    "contact Learn and Grow",
    "robotics course enquiry",
    "STEM education contact",
    "free trial class Bangladesh",
    "robotics kit order",
  ],
  canonical: "https://learnandgrow.io/contact",
});

export default function ContactPageWrapper() {
  return <ContactPage />;
}
