"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { X, Send, CheckCircle2, Phone, Mail, User, Link as LinkIcon, Briefcase } from "lucide-react";
import { toast } from "react-toastify";
import { useApplyForJobMutation } from "@/redux/api/jobApi";
import { trackEvent } from "@/utils/tracking";

export const RECRUITMENT_ROLES = [
  // Teaching
  "Tutor (Robotics & Arduino)",
  "Tutor (Python & AI for Teens)",
  "Tutor (Scratch & Game Coding)",
  "Teaching Quality Assessor",
  "Technical Support Specialist",
  "Student Mentor & Care",
  // Operations
  "Call Center Manager (Booking & Confirmation)",
  "Sales Representative (Trial Class Specialist)",
  "Internal Operations & Dispatch Manager",
  "Customer Relationship Lead",
  // Core & Tech
  "STEM Curriculum Developer",
  "Full-Stack Ed-Tech Engineer",
  "Creative Video & Media Producer",
];

type ModalEventDetail = {
  role?: string;
};

// Global trigger function to open from anywhere
export const openRecruitmentModal = (detail?: ModalEventDetail) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-recruitment-modal", { detail: detail || {} })
    );
  }
};

export default function RecruitmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Language state
  const [lang, setLang] = useState<"en" | "bn">("bn");
  useEffect(() => {
    const currentLang = (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn";
    setLang(currentLang);
    const handleLangChange = (e: any) => {
      setLang(e.detail?.language || (localStorage.getItem("preferredLanguage") as "en" | "bn") || "bn");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const [formData, setFormData] = useState({
    role: "Tutor (Robotics & Arduino)",
    fullName: "",
    phone: "",
    email: "",
    cvLink: "",
    contactMethod: "whatsapp",
  });

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.role) {
        setFormData((prev) => ({ ...prev, role: e.detail.role }));
      }
      setIsSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener("open-recruitment-modal", handleOpen);
    return () => window.removeEventListener("open-recruitment-modal", handleOpen);
  }, []);

  const [applyForJob] = useApplyForJobMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error(lang === "bn" ? "অনুগ্রহ করে নাম, ইমেইল এবং ফোন নম্বর প্রদান করুন।" : "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const cvLink = formData.cvLink.trim() || `Direct Contact via Phone: ${formData.phone.trim()}`;
      const eventId = `cv_${Date.now()}`;

      await applyForJob({
        applicationType: "general_cv",
        positionOfInterest: formData.role,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        resumeUrl: cvLink,
        additionalInfo: `Position of Interest: ${formData.role} | Preferred Contact: ${formData.contactMethod}`,
        eventId,
      } as any).unwrap();

      // Fire client tracking (Meta, TikTok, GA4, LinkedIn)
      trackEvent(
        "Lead",
        {
          content_name: formData.role,
          content_category: "Direct CV Submission",
          lead_type: "general_career_cv",
        },
        {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        eventId
      );

      setIsSubmitted(true);
      toast.success(
        lang === "bn"
          ? "আপনার সিভি ও আবেদন সফলভাবে জমা হয়েছে! অ্যাডমিন ও ম্যানেজমেন্ট টিম দ্রুত পর্যালোচনা করবে।"
          : "Your CV & application have been submitted successfully! Our management team will review it shortly."
      );
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          (lang === "bn"
            ? "আবেদন জমা দিতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।"
            : "Failed to submit application. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      backdrop="blur"
      placement="center"
      hideCloseButton
      classNames={{
        base: "bg-[#D9F99D] sm:bg-[#D9F99D] rounded-[36px] p-2 sm:p-4 border-4 border-[#BEF264] shadow-2xl overflow-hidden max-w-lg",
        body: "p-4 sm:p-6",
      }}
    >
      <ModalContent>
        {() => (
          <div className="relative">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute -top-1 -right-1 z-20 w-10 h-10 rounded-full bg-black/10 hover:bg-black/20 text-[#2C2C2C] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5 font-bold" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-10 px-4 space-y-4">
                <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#2C2C2C]">
                  {lang === "bn" ? "আবেদন সফল হয়েছে!" : "Thank You!"}
                </h3>
                <p className="text-sm sm:text-base text-gray-800 font-medium max-w-sm mx-auto leading-relaxed">
                  {lang === "bn"
                    ? `ধন্যবাদ ${formData.fullName}! "${formData.role}" পদের জন্য আপনার আবেদনটি আমাদের টিম পর্যালোচনা করছে। আমরা দ্রুত ${formData.contactMethod.toUpperCase()}-এ যোগাযোগ করব।`
                    : `Thank you ${formData.fullName}! We received your application for "${formData.role}". Our HR team will reach out via ${formData.contactMethod.toUpperCase()} shortly.`}
                </p>
                <Button
                  onPress={handleClose}
                  className="bg-[#3B82F6] hover:bg-blue-600 text-white font-black px-8 py-3 rounded-full shadow-lg mt-4 cursor-pointer"
                >
                  {lang === "bn" ? "ঠিক আছে" : "Got it!"}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="pr-8">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-black text-[#D9F99D] text-[11px] font-black uppercase tracking-wider mb-2">
                    {lang === "bn" ? "ক্যারিয়ার সুযোগ" : "Career Opportunities"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] tracking-tight leading-snug">
                    {lang === "bn" ? "আমাদের টিমে যোগ দিতে চান?" : "Would you like to join our team?"}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-800 font-medium mt-1">
                    {lang === "bn"
                      ? "ফর্মটি পূরণ করুন এবং আমাদের রিক্রুটমেন্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে।"
                      : "Fill out the short form below and we will get in touch with you shortly."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Role Dropdown */}
                  <div>
                    <label className="block text-xs font-black text-[#2C2C2C] uppercase tracking-wider mb-1 ml-1">
                      {lang === "bn" ? "কাঙ্ক্ষিত পদ (Role)" : "Role"}
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-white text-[#2C2C2C] font-bold text-sm px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                    >
                      {RECRUITMENT_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-black text-[#2C2C2C] uppercase tracking-wider mb-1 ml-1">
                      {lang === "bn" ? "আপনার পূর্ণ নাম (Full Name)" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={lang === "bn" ? "যেমন: আদনান সামী" : "e.g. John Doe"}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-white text-[#2C2C2C] font-semibold text-sm px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-[#3B82F6] focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="block text-xs font-black text-[#2C2C2C] uppercase tracking-wider mb-1 ml-1">
                      {lang === "bn" ? "ফোন বা হোয়াটসঅ্যাপ নম্বর" : "Phone / WhatsApp"}
                    </label>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center gap-1 bg-white px-3.5 py-3 rounded-2xl border-2 border-black/10 text-xs font-black text-[#2C2C2C] shadow-sm select-none">
                        +880
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="17XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="flex-1 bg-white text-[#2C2C2C] font-semibold text-sm px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-[#3B82F6] focus:outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-black text-[#2C2C2C] uppercase tracking-wider mb-1 ml-1">
                      {lang === "bn" ? "ইমেইল এড্রেস" : "Email"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white text-[#2C2C2C] font-semibold text-sm px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-[#3B82F6] focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* CV / Portfolio Link */}
                  <div>
                    <label className="block text-xs font-black text-[#2C2C2C] uppercase tracking-wider mb-1 ml-1">
                      {lang === "bn" ? "সিভি বা লিঙ্কডইন লিংক (Link for CV / LinkedIn)" : "Link for CV / LinkedIn"}
                    </label>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... or linkedin.com/in/..."
                      value={formData.cvLink}
                      onChange={(e) => setFormData({ ...formData, cvLink: e.target.value })}
                      className="w-full bg-white text-[#2C2C2C] font-semibold text-sm px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-[#3B82F6] focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-xs font-black text-[#2C2C2C] uppercase tracking-wider mb-1 ml-1">
                      {lang === "bn" ? "পছন্দের যোগাযোগ মাধ্যম" : "Preferred contact method"}
                    </label>
                    <select
                      value={formData.contactMethod}
                      onChange={(e) => setFormData({ ...formData, contactMethod: e.target.value })}
                      className="w-full bg-white text-[#2C2C2C] font-bold text-sm px-4 py-3 rounded-2xl border-2 border-black/10 focus:border-[#3B82F6] focus:outline-none shadow-sm cursor-pointer"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="phone">Phone Call</option>
                      <option value="telegram">Telegram</option>
                      <option value="email">Email</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-black text-base py-6 rounded-full shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      {lang === "bn" ? "আবেদন জমা দিন (Send)" : "Send Application"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
