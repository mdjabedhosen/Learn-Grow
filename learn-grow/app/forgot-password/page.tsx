import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo-helpers";
import ForgotPasswordPage from "./page-client";

export const metadata: Metadata = generatePageMetadata({
  title: "Reset Your Password - Learn & Grow",
  description:
    "Forgot your Learn & Grow password? Reset it securely with the OTP sent to your registered email address or phone number.",
  keywords: [
    "reset password",
    "forgot password Learn and Grow",
    "account recovery",
    "change account password",
  ],
  canonical: "https://learnandgrow.io/forgot-password",
});

export default function ForgotPasswordPageWrapper() {
  return <ForgotPasswordPage />;
}
