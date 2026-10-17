"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle, AlertCircle, Lock, Check, Clock } from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";

interface ProcessingState {
  stage: "processing" | "success" | "error";
  message: string;
  countdown: number;
}

function PaymentProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [state, setState] = useState<ProcessingState>({
    stage: "processing",
    message: "Processing your payment securely...",
    countdown: 5,
  });
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    const cookieToken = Cookies.get("accessToken");
    if (cookieToken) return cookieToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  // Handle countdown timer
  useEffect(() => {
    if (state.stage === "success" && state.countdown > 0) {
      const timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          countdown: prev.countdown - 1,
        }));
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (state.stage === "success" && state.countdown === 0) {
      router.push("/student/orders");
    }
  }, [state, router]);

  // Process payment
  useEffect(() => {
    if (!orderId) {
      setError("Order ID not found");
      return;
    }

    const processPayment = async () => {
      try {
        // Simulate payment processing delay (3-5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Order was successfully created - just show success
        // No need to fetch order details since students can't access individual orders
        setOrderDetails({ _id: orderId });
        setState({
          stage: "success",
          message: "Order submitted successfully! Admin will review your payment.",
          countdown: 5,
        });
        toast.success("Order submitted! Wait for admin approval.");
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || "Failed to process order";
        setError(errorMessage);
        setState({
          stage: "error",
          message: errorMessage,
          countdown: 0,
        });
        toast.error(errorMessage);
      }
    };

    processPayment();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-3">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Processing Stage */}
        {state.stage === "processing" && (
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 text-center">
            {/* Animated Spinner */}
            <div className="mb-6 flex justify-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" />
                <div className="absolute inset-3 sm:inset-4 rounded-full border-2 border-blue-50 flex items-center justify-center animate-pulse">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
              Processing Payment / পেমেন্ট প্রসেস হচ্ছে
            </h1>

            <p className="text-slate-600 mb-5 text-sm">
              {state.message}
            </p>

            {/* Processing Steps - compact */}
            <ul className="space-y-2 mb-5 text-left text-xs">
              <li className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
                <span className="text-slate-700">Order verified / অর্ডার যাচাই</span>
              </li>
              <li className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg animate-pulse">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-blue-600" />
                <span className="text-slate-700">Processing / প্রসেসিং</span>
              </li>
            </ul>

            {/* Security note */}
            <p className="text-slate-500 text-xs">
              Don't close or refresh. / বন্ধ বা রিফ্রেশ করবেন না।
            </p>
          </div>
        )}

        {/* Success Stage */}
        {state.stage === "success" && (
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 text-center">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={36} className="text-green-600" />
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
              Order Submitted Successfully! / অর্ডার সফলভাবে সাবমিট হয়েছে!
            </h1>

            <p className="text-slate-600 mb-4 text-sm">
              Your order has been submitted. Admin will review and approve your payment. / আপনার অর্ডার সাবমিট হয়েছে। অ্যাডমিন আপনার পেমেন্ট যাচাই করে অনুমোদন করবেন।
            </p>

            {/* Order Details */}
            {orderDetails && (
              <div className="bg-slate-50 rounded-lg p-3 mb-5 text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order ID / অর্ডার আইডি:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {orderDetails._id?.substring(0, 12)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status / স্ট্যাটাস:</span>
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                    Pending Approval / অনুমোদনের অপেক্ষায়
                  </span>
                </div>
              </div>
            )}

            {/* Admin Approval Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 text-left">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-blue-900 font-semibold text-sm mb-1 leading-relaxed">
                    Waiting for Admin Approval / অ্যাডমিন অনুমোদনের অপেক্ষায়
                  </p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    An administrator will review your payment and approve your order. You'll receive access once approved. / একজন অ্যাডমিনিস্ট্রেটর আপনার পেমেন্ট যাচাই করবেন এবং অর্ডার অনুমোদন করবেন। অনুমোদনের পর আপনি এক্সেস পাবেন।
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5">
              <p className="text-slate-700 font-medium text-sm mb-1">
                Redirecting to orders page / অর্ডার পেজে নিয়ে যাওয়া হচ্ছে
              </p>
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-2xl font-bold text-blue-600">{state.countdown}</span>
              </div>
              <p className="text-xs text-slate-600">Check your order status in dashboard / ড্যাশবোর্ডে স্ট্যাটাস দেখুন</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-1 mb-4 overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all ease-linear"
                style={{
                  width: `${(state.countdown / 10) * 100}%`,
                  transitionDuration: "1s",
                }}
              />
            </div>

            <p className="text-slate-500 text-xs">Auto redirecting... / স্বয়ংক্রিয়ভাবে নিয়ে যাওয়া হচ্ছে...</p>
          </div>
        )}

        {/* Error Stage */}
        {state.stage === "error" && (
          <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 text-center">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={36} className="text-red-600" />
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">
              Payment Failed / পেমেন্ট ব্যর্থ হয়েছে
            </h1>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
              <p className="text-red-800 text-sm leading-relaxed">{error || state.message}</p>
            </div>

            <p className="text-slate-600 text-sm mb-4">
              Please try again or contact support for assistance. / অনুগ্রহ করে আবার চেষ্টা করুন বা সাহায্যের জন্য সাপোর্টে যোগাযোগ করুন।
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition active:scale-95 text-sm"
              >
                Try Again / আবার চেষ্টা করুন
              </button>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full px-5 py-2.5 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition text-sm"
              >
                Back to Checkout / চেকআউটে ফিরে যান
              </button>

              <a
                href="/help"
                className="inline-block px-3 py-2 text-blue-600 font-semibold hover:text-blue-700 transition text-sm"
              >
                Contact Support / সাপোর্টে যোগাযোগ করুন →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentProcessingContent />
    </Suspense>
  );
}
