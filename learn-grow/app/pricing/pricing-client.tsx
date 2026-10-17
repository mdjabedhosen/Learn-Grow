"use client";

import React from "react";
import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaRocket, FaBoxOpen, FaBuilding } from "react-icons/fa";
import { Lock, CheckCircle2, Package, Sparkles } from "lucide-react";

export default function PricingClient() {
  const pricingPlans = [
    {
      id: "single",
      name: "Single Course",
      price: 3500,
      duration: "প্রতি কোর্স",
      description: "একটি নির্দিষ্ট কোর্সে ৩ মাসের এক্সেস",
      icon: FaCheckCircle,
      features: [
        "১টি নির্দিষ্ট কোর্স",
        "৩ মাসের এক্সেস",
        "সার্টিফিকেট",
        "লাইভ ক্লাস এক্সেস",
      ],
      buttonText: "কোর্স সিলেক্ট করুন",
      redirect: "/courses",
      popular: false,
    },
    {
      id: "quarterly",
      name: "Quarterly Subscription",
      price: 9999,
      duration: "৩ মাস",
      description: "সব কোর্সে আনলিমিটেড এক্সেস + রোবোটিক্স কিট",
      icon: FaRocket,
      features: [
        "সব কোর্সে ফুল এক্সেস",
        "আনলিমিটেড লাইভ ক্লাস",
        "প্রায়োরিটি মেন্টর সাপোর্ট",
        "সার্টিফিকেট",
        "কমিউনিটি এক্সেস",
        "রোবোটিক্স কিট সহ",
      ],
      buttonText: "এখনই শুরু করুন",
      redirect: "/checkout?plan=quarterly",
      popular: true,
    },
    {
      id: "kit",
      name: "Robotics Kit Only",
      price: 4500,
      duration: "একবার",
      description: "শুধুমাত্র হার্ডওয়্যার ডেলিভারি",
      icon: FaBoxOpen,
      features: [
        "রোবোটিক্স কিট",
        "হোম ডেলিভারি",
        "কোর্স এক্সেস নেই",
      ],
      buttonText: "অর্ডার করুন",
      redirect: "/checkout?plan=kit",
      popular: false,
    },
    {
      id: "school",
      name: "School Partnership",
      price: null,
      duration: "কাস্টম",
      description: "স্কুল ও প্রতিষ্ঠানের জন্য বিশেষ প্যাকেজ",
      icon: FaBuilding,
      features: [
        "কাস্টম প্রাইসিং",
        "বাল্ক অ্যাক্সেস",
        "ডেডিকেটেড সাপোর্ট",
        "অন-সাইট ট্রেনিং",
      ],
      buttonText: "যোগাযোগ করুন",
      redirect: "/contact",
      popular: false,
    },
  ];

  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            আমাদের <span className="text-primary">প্রাইসিং প্ল্যান</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            আপনার প্রয়োজন অনুযায়ী সেরা প্ল্যানটি বেছে নিন এবং আজই শেখা শুরু করুন
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? "border-3 border-primary shadow-2xl scale-105"
                    : "border border-gray-200 hover:shadow-xl"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Chip color="primary" variant="solid" size="lg" className="font-bold">
                      সবচেয়ে জনপ্রিয়
                    </Chip>
                  </div>
                )}

                <CardBody className="p-8">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                      plan.popular ? "bg-primary/20" : "bg-gray-100"
                    }`}
                  >
                    <IconComponent
                      className={`text-3xl ${plan.popular ? "text-primary" : "text-gray-600"}`}
                    />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                  {/* Price */}
                  <div className="mb-4">
                    {plan.price ? (
                      <>
                        <span className="text-4xl font-bold text-primary">৳{plan.price.toLocaleString()}</span>
                        <span className="text-gray-600 ml-2">/ {plan.duration}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-600">কাস্টম প্রাইসিং</span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <FaCheckCircle className="text-success mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <Button
                    color={plan.popular ? "primary" : "default"}
                    variant={plan.popular ? "solid" : "bordered"}
                    size="lg"
                    className="w-full font-semibold"
                    onPress={() => {
                      if (plan.id === "single") {
                        router.push(plan.redirect);
                      } else if (plan.id === "school") {
                        router.push(plan.redirect);
                      } else {
                        router.push(plan.redirect);
                      }
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <Card className="bg-[#EAF4FB]/70 border border-[#B3D9F5] shadow-none rounded-[28px]">
            <CardBody className="p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-blue-700 text-xs font-black uppercase tracking-wider mb-4 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>সাবস্ক্রিপশন গাইড</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2C2C2C] mb-8">সাবস্ক্রিপশন কেনার আগে জেনে নিন</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-lg text-[#2C2C2C] mb-1">লগইন প্রয়োজন</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    অর্ডার করতে হলে অবশ্যই লগইন করতে হবে। নতুন ইউজার হলে এক ক্লিকেই রেজিস্ট্রেশন করুন।
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-lg text-[#2C2C2C] mb-1">ম্যানুয়াল ভেরিফিকেশন</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    পেমেন্ট সাবমিট করার পর দ্রুত ভেরিফিকেশন সম্পন্ন হলে আপনি কোর্সের ফুল এক্সেস পাবেন।
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <h4 className="font-bold text-lg text-[#2C2C2C] mb-1">ডেলিভারি অ্যাড্রেস</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Quarterly Subscription এবং Robotics Kit-এর জন্য সঠিক ডেলিভারি ঠিকানা প্রদান করুন।
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
