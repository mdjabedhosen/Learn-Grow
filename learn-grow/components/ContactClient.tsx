"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Input, Textarea, Button, Card, CardBody, Chip, Spinner } from "@nextui-org/react";
import { MdEmail, MdLocationOn, MdAccessTime, MdSecurity } from "react-icons/md";
import { FaWhatsapp, FaPhoneVolume, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

interface ContactClientProps {
    content: any;
}

export default function ContactClient({ content }: ContactClientProps) {
    const [language, setLanguage] = useState<"bn" | "en">("bn");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<string>("trial");
    
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "ফ্রি ট্রায়াল ক্লাস সংক্রান্ত তথ্য",
        message: "",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedLang = (localStorage.getItem("language") || localStorage.getItem("preferredLanguage")) as "bn" | "en";
            if (savedLang) setLanguage(savedLang);

            const handleLangChange = (e: any) => {
                const newLang = (e.detail?.language || localStorage.getItem("language") || localStorage.getItem("preferredLanguage") || "bn") as "bn" | "en";
                setLanguage(newLang);
                if (newLang === "en") {
                    setFormData(prev => ({
                        ...prev,
                        subject: prev.subject === "ফ্রি ট্রায়াল ক্লাস সংক্রান্ত তথ্য" ? "Free Trial Class Inquiry" : prev.subject
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        subject: prev.subject === "Free Trial Class Inquiry" ? "ফ্রি ট্রায়াল ক্লাস সংক্রান্ত তথ্য" : prev.subject
                    }));
                }
            };
            window.addEventListener("languageChange", handleLangChange);
            return () => window.removeEventListener("languageChange", handleLangChange);
        }
    }, []);

    const whatsappNumber = "+880 1706-276447";
    const rawWhatsapp = "8801706276447";

    const topics = [
        { id: "trial", labelEn: "🎯 Free Trial Class", labelBn: "🎯 ফ্রি ট্রায়াল ক্লাস", defaultSubjectEn: "Free Trial Class Inquiry", defaultSubjectBn: "ফ্রি ট্রায়াল ক্লাস সংক্রান্ত তথ্য" },
        { id: "admission", labelEn: "📚 Course Admission", labelBn: "📚 কোর্স ভর্তি সংক্রান্ত", defaultSubjectEn: "Course Admission Details", defaultSubjectBn: "কোর্স ভর্তি সংক্রান্ত প্রশ্ন" },
        { id: "robotics", labelEn: "🤖 Robotics Kit & Hardware", labelBn: "🤖 রোবটিক্স কিট ডেলিভারি", defaultSubjectEn: "Robotics Kit Delivery Question", defaultSubjectBn: "রোবটিক্স কিট ও ডেলিভারি তথ্য" },
        { id: "general", labelEn: "💡 Other Questions", labelBn: "💡 সাধারণ জিজ্ঞাসা", defaultSubjectEn: "General Question", defaultSubjectBn: "সাধারণ তথ্য জানতে চাই" },
    ];

    const handleTopicSelect = (topic: typeof topics[0]) => {
        setSelectedTopic(topic.id);
        setFormData(prev => ({
            ...prev,
            subject: language === "en" ? topic.defaultSubjectEn : topic.defaultSubjectBn
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.message.trim()) {
            toast.error(language === "en" ? "Please fill in all required fields" : "দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন");
            return;
        }

        setIsSubmitting(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api";
            const res = await fetch(`${base.replace(/\/$/, "")}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (json.success) {
                toast.success(
                    language === "en" 
                        ? "Thank you! Your message has been received. Our team will contact you shortly."
                        : "ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি। খুব শীঘ্রই আমাদের প্রতিনিধি যোগাযোগ করবেন।"
                );
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    subject: language === "en" ? "Free Trial Class Inquiry" : "ফ্রি ট্রায়াল ক্লাস সংক্রান্ত তথ্য",
                    message: "",
                });
            } else {
                toast.error(json.message || (language === "en" ? "Failed to send message" : "বার্তা পাঠাতে ব্যর্থ হয়েছে"));
            }
        } catch (error) {
            toast.error(language === "en" ? "Failed to send message. Please try WhatsApp." : "বার্তা পাঠানো সম্ভব হয়নি। দয়া করে হোয়াটসঅ্যাপে যোগাযোগ করুন।");
        } finally {
            setIsSubmitting(false);
        }
    };

    const faqs = [
        {
            qEn: "How does the free trial class work?",
            qBn: "ফ্রি ট্রায়াল ক্লাস কীভাবে পরিচালিত হয়?",
            aEn: "Our 45-minute live 1-on-1 trial class allows your child to interact with a lead mentor, write their first lines of code or test a virtual circuit, and get an individual learning roadmap.",
            aBn: "আমাদের ৪৫ মিনিটের লাইভ ১-অন-১ ট্রায়াল ক্লাসে আপনার সন্তান একজন বিশ্ববিদ্যালয় মেন্টরের সাথে সরাসরি ইন্টারঅ্যাক্ট করে প্রথম কোড লেখা বা রোবটিক্স লজিক শিখবে এবং তার জন্য একটি কাস্টম লার্নিং রোডম্যাপ তৈরি হবে।"
        },
        {
            qEn: "How is the Robotics Starter Kit delivered?",
            qBn: "রোবটিক্স স্টার্টার কিট কীভাবে পাব?",
            aEn: "Once enrolled in Junior Robotics, we deliver the complete hardware kit (Arduino board, 4-wheel chassis, sensors, motors, breadboard) right to your doorstep anywhere in Bangladesh within 48-72 hours.",
            aBn: "জুনিয়র রোবটিক্সে ভর্তির পর সম্পূর্ণ হার্ডওয়্যার কিট (আর্দুইনো বোর্ড, ৪-হুইল চেসিস, সেন্সর, মোটর, জাম্পার ওয়্যার) ৪৮-৭২ ঘণ্টার মধ্যে সারা বাংলাদেশের যেকোনো ঠিকানায় হোম ডেলিভারি পৌঁছে দেওয়া হয়।"
        },
        {
            qEn: "What devices do we need for classes?",
            qBn: "ক্লাসের জন্য কী ধরনের কম্পিউটার লাগবে?",
            aEn: "A basic laptop or desktop computer (Windows, Mac, or Linux) with webcam, microphone, and a stable internet connection. No expensive gaming PC is required.",
            aBn: "একটি সাধারণ ল্যাপটপ বা ডেস্কটপ কম্পিউটার (Windows, Mac বা Linux), ওয়েবক্যাম, মাইক্রোফোন এবং ইন্টারনেট কানেকশনই যথেষ্ট। কোনো ভারী গেমিং পিসির প্রয়োজন নেই।"
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24">
            
            {/* 1. Kodland-inspired Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#EAF4FB]/70 via-[#F5F0FF]/30 to-[#F8F9FA] pt-8 pb-14 sm:pt-12 sm:pb-16 border-b border-gray-100">
                {/* Background decorative blurs */}
                <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10 text-center">
                    
                    {/* Breadcrumb */}
                    <nav className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium mb-6">
                        <Link href="/" className="hover:text-gray-900 transition-colors">
                            {language === "en" ? "Home" : "হোম"}
                        </Link>
                        <FaChevronRight className="text-[10px] text-gray-400" />
                        <span className="text-gray-900 font-semibold">
                            {language === "en" ? "Contact & Support" : "যোগাযোগ ও সহায়তা"}
                        </span>
                    </nav>

                    {/* Pill Badge */}
                    <div className="flex justify-center mb-4">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFF8E1] border border-[#FFE082] rounded-full shadow-xs">
                            <span>💬</span>
                            <span className="text-xs font-bold text-[#92620A] uppercase tracking-wider">
                                {language === "en" ? "We're Here to Help • Admission & Support" : "আমরা সাহায্য করতে প্রস্তুত • অ্যাডমিশন ও সাপোর্ট"}
                            </span>
                        </span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-[#1E1E1E] tracking-tight leading-tight mb-4">
                        {language === "en" ? "Get in Touch with Our Team" : "আমাদের সাথে যোগাযোগ করুন"}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-normal leading-relaxed mb-8">
                        {language === "en"
                            ? "Have questions about courses, free trial classes, curriculum, or hardware kits? Our mentors and admission counselors are always ready to assist you."
                            : "কোর্সে ভর্তি, ফ্রি ট্রায়াল ক্লাস, সিলেবাস কিংবা রোবটিক্স কিট সংক্রান্ত যেকোনো প্রশ্নে আমাদের মেন্টর ও অ্যাডমিশন টিম সার্বক্ষণিক আপনার পাশে আছে।"}
                    </p>

                    {/* Quick Value Ribbons */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm font-bold text-gray-700">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-xs border border-gray-200">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {language === "en" ? "Avg. Response: 15 Mins" : "গড় রিপ্লাই টাইম: ১৫ মিনিট"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-xs border border-gray-200">
                            📞 {language === "en" ? "Hotline: 10 AM - 10 PM Everyday" : "হটলাইন: প্রতিদিন সকাল ১০টা - রাত ১০টা"}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-xs border border-gray-200">
                            🟢 {language === "en" ? "Live WhatsApp Support" : "হোয়াটসঅ্যাপে তাৎক্ষণিক সহায়তা"}
                        </span>
                    </div>
                </div>
            </section>

            {/* 2. Main Content Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl -mt-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: 4 Interactive Channels (5 cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        
                        {/* Channel 1: WhatsApp Support (Priority) */}
                        <a
                            href={`https://wa.me/${rawWhatsapp}?text=Hello%20Learn%20%26%20Grow%2C%20I%20have%20an%20inquiry%20about%20your%20STEM%20courses.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-5 sm:p-6 bg-[#F0FDF4] hover:bg-[#DCFCE7] border-2 border-[#BBF7D0] rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-13 h-13 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <FaWhatsapp />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black uppercase tracking-wider text-[#166534] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                                            {language === "en" ? "Fastest Response" : "সবচেয়ে দ্রুত রেসপন্স"}
                                        </span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-black text-[#1E1E1E]">
                                        {language === "en" ? "Chat on WhatsApp" : "হোয়াটসঅ্যাপে মেসেজ দিন"}
                                    </h3>
                                    <p className="text-sm font-bold text-[#16A34A] my-0.5">
                                        {whatsappNumber}
                                    </p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        {language === "en"
                                            ? "Direct chat with our admission advisors. Instant support."
                                            : "আমাদের অ্যাডমিশন কাউন্সিলরের সাথে সরাসরি কথা বলুন (তাৎক্ষণিক রিপ্লাই)।"}
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Channel 2: Phone Hotline */}
                        <a
                            href="tel:+8801706276447"
                            className="block p-5 sm:p-6 bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-13 h-13 rounded-2xl bg-[#3B82F6] text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <FaPhoneVolume />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#1E40AF]">
                                        {language === "en" ? "Direct Voice Call" : "সরাসরি ফোন কল"}
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black text-[#1E1E1E]">
                                        {language === "en" ? "Call Our Hotline" : "আমাদের হেল্পলাইনে কল করুন"}
                                    </h3>
                                    <p className="text-sm font-bold text-[#2563EB] my-0.5">
                                        {whatsappNumber}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {language === "en" ? "Available everyday from 10:00 AM to 10:00 PM" : "প্রতিদিন সকাল ১০:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত খোলা"}
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Channel 3: Official Email */}
                        <a
                            href="mailto:info@learnandgrow.io"
                            className="block p-5 sm:p-6 bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E9D5FF] rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-13 h-13 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <MdEmail />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#5B21B6]">
                                        {language === "en" ? "Official Correspondence" : "অফিশিয়াল ইমেইল"}
                                    </span>
                                    <h3 className="text-base sm:text-lg font-black text-[#1E1E1E]">
                                        {language === "en" ? "Email Inquiries" : "ইমেইলে যোগাযোগ"}
                                    </h3>
                                    <p className="text-sm font-bold text-[#7C3AED] my-0.5">
                                        info@learnandgrow.io
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {language === "en" ? "Send detailed inquiries, partnership, or school proposals" : "বিস্তারিত প্রশ্ন, প্রাতিষ্ঠানিক অংশীদারিত্ব বা স্কুলের প্রস্তাবনার জন্য"}
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Channel 4: Physical Learning Hub (Dhaka) */}
                        <div className="p-5 sm:p-6 bg-white border border-gray-200 rounded-[24px] shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-13 h-13 rounded-2xl bg-[#F59E0B] text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                                    <MdLocationOn />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-[#92400E]">
                                            {language === "en" ? "Dhaka STEM Hub" : "ধানমন্ডি লার্নিং হাব"}
                                        </span>
                                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                                            HQ
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-[#1E1E1E]">
                                        {language === "en" ? "Main Learning Center" : "হেড অফিস ও ল্যাব"}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-700 font-semibold my-1 leading-snug">
                                        Level 4, 35 Green Road, Dhanmondi, Dhaka - 1205
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {language === "en" ? "In-person kit collection & curriculum review by appointment" : "রোবটিক্স ল্যাব পরিদর্শন ও কিট সংগ্রহের জন্য স্বাগতম"}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Upgraded Contact Form (7 cols) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[28px] border-2 border-gray-100 p-6 sm:p-8 md:p-10 shadow-xl">
                            
                            {/* Form Header */}
                            <div className="mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#3B82F6] text-xs font-bold rounded-full mb-3">
                                    ✉️ {language === "en" ? "Quick Message" : "দ্রুত বার্তা পাঠান"}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E1E] tracking-tight">
                                    {language === "en" ? "Send us a Message" : "আমাদের একটি বার্তা পাঠান"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {language === "en"
                                        ? "Fill out the form below. An education advisor will reach out to you within 15 minutes."
                                        : "নিচের ফর্মটি পূরণ করুন। আমাদের শিক্ষা পরামর্শক খুব দ্রুত আপনার সাথে যোগাযোগ করবেন।"}
                                </p>
                            </div>

                            {/* Topic Selector Chips */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
                                    {language === "en" ? "What is your inquiry about?" : "আপনার অনুসন্ধানের বিষয় কোনটি?"}
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                                    {topics.map((topic) => (
                                        <button
                                            key={topic.id}
                                            type="button"
                                            onClick={() => handleTopicSelect(topic)}
                                            className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all border ${
                                                selectedTopic === topic.id
                                                    ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm"
                                                    : "bg-[#F8F9FA] text-gray-700 hover:bg-gray-100 border-gray-200"
                                            }`}
                                        >
                                            {language === "en" ? topic.labelEn : topic.labelBn}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* The Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                
                                {/* Row 1: First Name & Last Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                            {language === "en" ? "First Name" : "নামের প্রথম অংশ"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            placeholder={language === "en" ? "e.g. Tanvir" : "যেমন: তানভীর"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                            {language === "en" ? "Last Name" : "নামের শেষ অংশ"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            placeholder={language === "en" ? "e.g. Hasan" : "যেমন: হাসান"}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Email & Phone Number */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                            {language === "en" ? "Email Address" : "ইমেইল অ্যাড্রেস"} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="name@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                            {language === "en" ? "Phone / WhatsApp Number" : "ফোন / হোয়াটসঅ্যাপ নম্বর"}
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="017XXXXXXXX"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Row 3: Subject */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        {language === "en" ? "Subject" : "বিষয়"} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder={language === "en" ? "How can we help?" : "কী বিষয়ে জানতে চান?"}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all"
                                    />
                                </div>

                                {/* Row 4: Message */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        {language === "en" ? "Your Message" : "আপনার বার্তা"} <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder={
                                            language === "en"
                                                ? "Tell us about your student's age, course preferences, or any specific questions..."
                                                : "শিক্ষার্থীর বয়স, পছন্দের কোর্স অথবা আপনার যেকোনো প্রশ্ন এখানে লিখুন..."
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none text-sm font-medium transition-all resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#1E1E1E] hover:bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-60"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner size="sm" color="white" />
                                            <span>{language === "en" ? "Sending..." : "পাঠানো হচ্ছে..."}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{language === "en" ? "Send Message" : "বার্তা পাঠান"}</span>
                                            <span>→</span>
                                        </>
                                    )}
                                </button>

                                {/* Privacy guarantee */}
                                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-gray-400">
                                    <MdSecurity className="text-sm text-emerald-500" />
                                    <span>
                                        {language === "en"
                                            ? "Your information is 100% private and protected."
                                            : "আপনার তথ্য সম্পূর্ণ নিরাপদ ও সুরক্ষিত থাকবে।"}
                                    </span>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>

                {/* 3. Quick FAQ Section */}
                <div className="mt-16 sm:mt-20 pt-12 border-t border-gray-200">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-[#92620A] text-xs font-bold rounded-full mb-3 border border-amber-200">
                            ❓ {language === "en" ? "Frequently Asked Questions" : "সাধারণ প্রশ্নোত্তর"}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E1E] tracking-tight">
                            {language === "en" ? "Quick Answers Before You Reach Out" : "যোগাযোগের আগে জেনে নিন"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-base font-bold text-gray-900 mb-2 flex items-start gap-2">
                                    <span className="text-[#3B82F6] font-black">Q.</span>
                                    <span>{language === "en" ? faq.qEn : faq.qBn}</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-5">
                                    {language === "en" ? faq.aEn : faq.aBn}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
