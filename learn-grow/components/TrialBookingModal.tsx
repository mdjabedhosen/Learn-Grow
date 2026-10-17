"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useCreateTrialBookingMutation } from "@/redux/api/trialBookingApi";
import { useGetPublishedCoursesQuery, useGetAllCoursesQuery } from "@/redux/api/courseApi";
import { trackLeadEvent, generateEventId } from "@/utils/tracking";

export const openTrialModal = (details?: { program?: string; source?: string }) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-trial-modal", {
        detail: details || {},
      })
    );
  }
};

export const TrialBookingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "bn">("bn");
  const [source, setSource] = useState("website");
  const [createTrialBooking, { isLoading: isSubmitting }] = useCreateTrialBookingMutation();

  const { data: publishedCoursesData } = useGetPublishedCoursesQuery({ limit: 100 });
  const { data: allCoursesData } = useGetAllCoursesQuery({ limit: 100 });

  const courses = React.useMemo(() => {
    const rawA =
      (publishedCoursesData as any)?.data?.courses ||
      (publishedCoursesData as any)?.data ||
      [];
    const rawB =
      (allCoursesData as any)?.data?.courses ||
      (allCoursesData as any)?.data ||
      [];
    const list = [...rawA, ...rawB];
    const map = new Map<string, any>();

    list.forEach((c: any) => {
      if (c && (c._id || c.id) && c.title) {
        const id = (c._id || c.id).toString();
        if (!map.has(id)) {
          map.set(id, { _id: id, title: c.title });
        }
      }
    });

    return Array.from(map.values());
  }, [publishedCoursesData, allCoursesData]);

  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    studentAge: "",
    trackInterest: "Robotics & Arduino",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = (localStorage.getItem("preferredLanguage") || localStorage.getItem("language") || "bn") as "en" | "bn";
      if (stored) setLanguage(stored);

      const handleLang = (e: any) => {
        const current = e.detail?.language || (localStorage.getItem("preferredLanguage") || localStorage.getItem("language") || "bn") as "en" | "bn";
        if (current) setLanguage(current);
      };
      window.addEventListener("languageChange", handleLang);

      const handleOpen = (e: any) => {
        const detail = e.detail || {};
        if (detail.program) {
          setFormData((prev) => ({ ...prev, trackInterest: detail.program }));
        }
        if (detail.source) {
          setSource(detail.source);
        }
        setIsOpen(true);
      };
      window.addEventListener("open-trial-modal", handleOpen);

      return () => {
        window.removeEventListener("languageChange", handleLang);
        window.removeEventListener("open-trial-modal", handleOpen);
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.parentEmail || !formData.parentPhone) {
      toast.error(
        language === "en"
          ? "Please fill in all required fields."
          : "অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।"
      );
      return;
    }

    try {
      const eventId = generateEventId("lead");
      const payload = {
        ...formData,
        studentAge: formData.studentAge || "10 years",
        source,
        eventId,
      };

      // Fire client-side pixel event with matching eventId for hybrid CAPI deduplication
      trackLeadEvent({
        name: formData.parentName,
        email: formData.parentEmail,
        phone: formData.parentPhone,
        program: formData.trackInterest,
        source,
        eventId,
      });

      const result = await createTrialBooking(payload).unwrap();

      if (result.success || result.data) {
        setIsOpen(false);
        toast.success(
          language === "en"
            ? "Free trial booked! We will contact you on WhatsApp soon."
            : "ফ্রি ট্রায়াল বুকিং সম্পন্ন হয়েছে! আমরা দ্রুত হোয়াটসঅ্যাপে যোগাযোগ করব।"
        );
        setFormData({
          parentName: "",
          parentEmail: "",
          parentPhone: "",
          studentAge: "",
          trackInterest: "Robotics & Arduino",
        });
      } else {
        toast.error(result.message || "Failed to submit booking");
      }
    } catch (err: any) {
      // Fallback direct fetch if RTK query had network anomaly
      try {
        const res = await fetch("/api/trial-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            studentAge: formData.studentAge || "10 years",
            source,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setIsOpen(false);
          toast.success(
            language === "en"
              ? "Free trial booked! We will contact you on WhatsApp soon."
              : "ফ্রি ট্রায়াল বুকিং সম্পন্ন হয়েছে! আমরা দ্রুত হোয়াটসঅ্যাপে যোগাযোগ করব।"
          );
          setFormData({
            parentName: "",
            parentEmail: "",
            parentPhone: "",
            studentAge: "",
            trackInterest: "Robotics & Arduino",
          });
          return;
        }
      } catch {}

      toast.error(err?.data?.message || err?.message || "Failed to submit booking. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-6 sm:p-8 border border-gray-100 relative animate-scaleIn max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
          {language === "en" ? "Book a Free Trial" : "ফ্রি ট্রায়াল ক্লাস বুক করুন"}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {language === "en"
            ? "Experience our hands-on coding & robotics classes for free!"
            : "আমাদের কোডিং ও রোবটিক্স ক্লাসের হাতে-কলমে অভিজ্ঞতা নিন সম্পূর্ণ ফ্রি!"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {language === "en" ? "Parent's Name" : "অভিভাবকের নাম"} *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kamal Hossain"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900 text-sm"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {language === "en" ? "Mobile Number" : "মোবাইল নম্বর"} *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 017XXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900 text-sm"
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {language === "en" ? "Email Address" : "ইমেইল এড্রেস"} *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. parent@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900 text-sm"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {language === "en" ? "Child's Age/Grade" : "বয়স/শ্রেণি"}
              </label>
              <input
                type="text"
                placeholder="e.g. 10 years"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900 text-sm"
                value={formData.studentAge}
                onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {language === "en" ? "Select Program" : "প্রোগ্রাম"}
              </label>
              <select
                className="w-full px-3 sm:px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] text-gray-900 text-sm bg-white"
                value={formData.trackInterest}
                onChange={(e) => setFormData({ ...formData, trackInterest: e.target.value })}
              >
                {courses.length > 0 ? (
                  courses.map((course: any) => (
                    <option key={course._id} value={course.title}>
                      {course.title}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Robotics & Arduino">Robotics & Arduino</option>
                    <option value="Python Coding & AI">Python Coding & AI</option>
                    <option value="Game Development">Game Coding</option>
                    <option value="Master Code">Master Code</option>
                  </>
                )}
                {formData.trackInterest &&
                  courses.every((c: any) => c.title !== formData.trackInterest) && (
                    <option value={formData.trackInterest}>{formData.trackInterest}</option>
                  )}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 sm:py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm mt-4 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <span>
                {language === "en" ? "Book Free Trial Now" : "ফ্রি বুকিং কনফার্ম করুন"}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
