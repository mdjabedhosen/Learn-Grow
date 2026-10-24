"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_CONFIG } from "@/config/apiConfig";
import Image from "next/image";
import Link from "next/link";
import { 
  Check,
  Lock,
  Shield,
  CreditCard,
  Smartphone,
  Banknote,
  ChevronRight,
  Truck,
  Package,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Cpu,
  Wrench,
  BookOpen,
  Headphones,
  Gift,
  Star,
  Clock,
  Zap,
  Radio,
  RotateCw,
  Grid,
  Cable,
  Lightbulb,
} from "lucide-react";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { useGetCommissionQuery } from "@/redux/api/settingsApi";
import { trackPurchaseEvent } from "@/utils/tracking";
import { getCoursePricing } from "@/utils/pricing";

interface CourseData {
  _id: string;
  title: string;
  /** The ORIGINAL / list price of the course. */
  price: number;
  /** The price AFTER the discount. Undefined / 0 means "no discount". */
  discountPrice?: number | null;
  thumbnail?: string;
  category?: { name: string };
  level?: string;
}

interface PaymentMethod {
  _id: string;
  name: string;
  accountNumber: string;
  paymentNote: string;
  // Bank transfer details, shown as a labelled block when a bank transfer is
  // selected.
  accountName?: string;
  bankName?: string;
  branchName?: string;
  routingNumber?: string;
  swiftCode?: string;
  isActive?: boolean;
}

/**
 * True when a payment method is a bank transfer.
 *
 * A bank transfer shows the account details and makes the payment
 * screenshot mandatory. The backend applies the same rule before it
 * stores a screenshot on an order.
 */
const isBankTransferMethod = (method?: PaymentMethod | null): boolean =>
  !!method && /bank|transfer|npsb/i.test(method.name || "");

interface OrderData {
  _id: string;
  userId: string;
  courseId: string;
  totalAmount: number;
  paymentMethodId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: string;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface DeliveryAddress {
  name: string;
  phone: string;
  fullAddress: string;
  city: string;
  postalCode: string;
}

const KIT_COMPONENTS = [
  {
    nameEn: "Arduino Uno R3 Microcontroller",
    nameBn: "আর্ডুইনো উনো আর৩ মাইক্রোকন্ট্রোলার",
    descEn: "Original ATmega328P chip with blue USB programming cable",
    descBn: "অরিজিনাল ATmega328P চিপ ও ইউএসবি প্রোগ্রামিং ক্যাবলসহ",
    tagEn: "Main Brain",
    tagBn: "মূল মস্তিষ্ক",
    icon: Cpu,
  },
  {
    nameEn: "4WD Smart Robot Car Chassis",
    nameBn: "৪-হুইল স্মার্ট রোবট কার চ্যাসিস",
    descEn: "4x DC geared motors, high-grip rubber wheels & laser-cut frame",
    descBn: "৪টি ডিসি গিয়ার মোটর, হাই-গ্রিপ রাবার চাকা ও অ্যাক্রিলিক বডি",
    tagEn: "Drive Unit",
    tagBn: "ড্রাইভ ইউনিট",
    icon: RotateCw,
  },
  {
    nameEn: "HC-SR04 Ultrasonic Distance Sensor",
    nameBn: "HC-SR04 আল্ট্রাসোনিক দূরত্ব সেন্সর",
    descEn: "Obstacle detection & auto-navigation sonar with mounting bracket",
    descBn: "বাধা শনাক্তকরণ ও স্বয়ংক্রিয় টার্নিং সোনার সেন্সর ও মাউন্ট",
    tagEn: "Eyes / Sonar",
    tagBn: "সোনার চোখ",
    icon: Radio,
  },
  {
    nameEn: "L298N Dual Motor Driver Module",
    nameBn: "L298N ডুয়াল মোটর ড্রাইভার মডিউল",
    descEn: "High-power dual H-bridge motor speed & direction controller",
    descBn: "হাই-পাওয়ার মোটর স্পিড ও ডিরেকশন কন্ট্রোলার মডিউল",
    tagEn: "Motor Control",
    tagBn: "মোটর কন্ট্রোল",
    icon: Zap,
  },
  {
    nameEn: "400-Point Solderless Breadboard",
    nameBn: "৪০০-পয়েন্ট সোল্ডারলেস ব্রেডবোর্ড",
    descEn: "Zero-soldering plug-and-play safe circuit prototyping board",
    descBn: "ঝালাই ছাড়াই নিরাপদ সার্কিট তৈরির প্রোটোটাইপিং বোর্ড",
    tagEn: "Safe Prototyping",
    tagBn: "নিরাপদ সার্কিট",
    icon: Grid,
  },
  {
    nameEn: "40x Premium Jumper Wires Pack",
    nameBn: "৪০টি প্রিমিয়াম জাম্পার ওয়্যার প্যাক",
    descEn: "Multi-color Male-to-Male & Male-to-Female flexible cables",
    descBn: "রঙিন মেল-টু-মেল এবং মেল-টু-ফিমেল কানেক্টিং ওয়্যার",
    tagEn: "Cables",
    tagBn: "কানেক্টিং ওয়্যার",
    icon: Cable,
  },
  {
    nameEn: "Electronics & Sensor Lab Pack",
    nameBn: "ইলেকট্রনিক্স ও সেন্সর ল্যাব প্যাক",
    descEn: "10x LEDs, active buzzer, LDR light sensor, resistors & buttons",
    descBn: "১০টি এলইডি, বাজার, এলডিআর আলোক সেন্সর, পুশ বাটন ও রেজিস্টর",
    tagEn: "Lab Elements",
    tagBn: "ল্যাব উপাদান",
    icon: Lightbulb,
  },
  {
    nameEn: "Project Manual & Dual Battery Box",
    nameBn: "প্রজেক্ট বুক ও ডুয়াল ব্যাটারি হোল্ডার",
    descEn: "Step-by-step illustrated guide + power case with on/off switch",
    descBn: "সচিত্র গাইড বুক + অন/অফ সুইচসহ পাওয়ার ব্যাটারি কেস",
    tagEn: "Guide & Power",
    tagBn: "গাইড ও পাওয়ার",
    icon: BookOpen,
  },
];

const KIT_PERKS = [
  {
    titleEn: "Free Doorstep Delivery",
    titleBn: "সারা বাংলাদেশে ফ্রি হোম ডেলিভারি",
    descEn: "Express courier delivery to your home within 48-72 hours",
    descBn: "৪৮-৭২ ঘণ্টার মধ্যে এক্সপ্রেস কুরিয়ারে নিরাপদে হোম ডেলিভারি",
    icon: Truck,
    badgeEn: "100% Free",
    badgeBn: "১০০% ফ্রি",
  },
  {
    titleEn: "7-Day Replacement Warranty",
    titleBn: "৭ দিনের পার্টস রিপ্লেসমেন্ট ওয়ারেন্টি",
    descEn: "Any defective component replaced completely free of charge",
    descBn: "কোনো পার্টসে ত্রুটি থাকলে সম্পূর্ণ ফ্রি নতুন পার্টস প্রদান",
    icon: ShieldCheck,
    badgeEn: "Guaranteed",
    badgeBn: "নিশ্চয়তা",
  },
  {
    titleEn: "Video Assembly Tutorials",
    titleBn: "ভিডিও টিউটোরিয়াল ও সার্কিট গাইড",
    descEn: "High-definition video lessons and wiring diagrams included",
    descBn: "স্টেপ-বাই-স্টেপ ভিডিও ক্লাস ও নির্ভুল ওয়্যারিং ডায়াগ্রাম অ্যাক্সেস",
    icon: Sparkles,
    badgeEn: "Included",
    badgeBn: "অন্তর্ভুক্ত",
  },
  {
    titleEn: "Live Mentor Tech Support",
    titleBn: "লাইভ মেন্টর টেকনিক্যাল সাপোর্ট",
    descEn: "Dedicated WhatsApp & Discord support for assembly guidance",
    descBn: "রোবট তৈরিতে কোনো সমস্যায় ডেডিকেটেড মেন্টর সাপোর্ট",
    icon: Headphones,
    badgeEn: "Live Help",
    badgeBn: "লাইভ হেল্প",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams?.get("courseId") || "";
  const planType = (searchParams?.get("plan") || "single") as "single" | "quarterly" | "kit" | "school" | "combo";
  const comboId = searchParams?.get("comboId") || "";
  const [createOrder] = useCreateOrderMutation();
  const { data: settingsData } = useGetCommissionQuery();

  const kitPriceSetting = Number(settingsData?.data?.kitPrice) || undefined;
  const kitPriceEnv = process.env.NEXT_PUBLIC_KIT_PRICE ? Number(process.env.NEXT_PUBLIC_KIT_PRICE) : undefined;
  const resolvedKitPrice = !Number.isNaN(kitPriceSetting as number) && kitPriceSetting !== undefined
    ? kitPriceSetting
    : (kitPriceEnv && !Number.isNaN(kitPriceEnv) ? kitPriceEnv : 4500);

  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [senderNumber, setSenderNumber] = useState<string>("");
  // For a bank transfer the customer pays FROM a bank account, so these
  // four fields replace the mobile sender number.
  const [senderBankDetails, setSenderBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
  });
  const [transactionId, setTransactionId] = useState<string>("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);

  // The payment method the customer picked, and whether it is a bank
  // transfer. A bank transfer shows the account details and requires a
  // payment screenshot.
  const selectedMethod = React.useMemo(
    () => paymentMethods.find((m) => m._id === selectedPaymentMethod),
    [paymentMethods, selectedPaymentMethod]
  );
  const isBankTransfer = isBankTransferMethod(selectedMethod);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: "",
    phone: "",
    fullAddress: "",
    city: "",
    postalCode: "",
  });
  const [existingSubscription, setExistingSubscription] = useState<any>(null);
  const [hasPurchasedCombo, setHasPurchasedCombo] = useState<boolean>(false);
  const [existingComboOrder, setExistingComboOrder] = useState<any>(null);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  // Coupon state - the coupon discount applies on top of the (already
  // discounted) course price and is validated on the server.
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description?: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = (localStorage.getItem("language") || localStorage.getItem("preferredLanguage")) as "bn" | "en";
      if (stored) setLanguage(stored);

      const handleLangChange = (e: any) => {
        const newLang = (e.detail?.language || localStorage.getItem("language") || localStorage.getItem("preferredLanguage") || "bn") as "bn" | "en";
        setLanguage(newLang);
      };
      window.addEventListener("languageChange", handleLangChange);
      return () => window.removeEventListener("languageChange", handleLangChange);
    }
  }, []);

  // Pricing based on plan type.
  // For a single course the price comes from the backend record: `price` is
  // the original price and `discountPrice` (when set) is the price after the
  // discount. The percentage is derived, never hardcoded.
  const coursePricing = React.useMemo(
    () => getCoursePricing(courseData),
    [courseData]
  );

  const planPrice = React.useMemo(() => {
    switch (planType) {
      case "single":
        return coursePricing.effectivePrice;
      case "quarterly":
        return 9999;
      case "kit":
        return resolvedKitPrice;
      case "combo":
        return courseData?.discountPrice ?? courseData?.price ?? 0;
      case "school":
      default:
        return 0;
    }
  }, [planType, coursePricing.effectivePrice, courseData, resolvedKitPrice]);

  // Coupon discount applies on top of the discounted course price.
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const finalPrice = Math.max(0, planPrice - couponDiscount);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code) {
      setCouponError("Enter a coupon code");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");
    try {
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/coupon/validate`,
        {
          code,
          orderAmount: planPrice,
          courseId: planType === "single" ? courseData?._id : undefined,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data?.success && response.data?.data) {
        setAppliedCoupon(response.data.data);
        setCouponError("");
        toast.success(
          language === "bn" ? "কুপন প্রয়োগ হয়েছে!" : "Coupon applied!"
        );
      } else {
        setAppliedCoupon(null);
        setCouponError(response.data?.message || "Invalid coupon code");
      }
    } catch (error: any) {
      setAppliedCoupon(null);
      setCouponError(
        error?.response?.data?.message || "Could not apply the coupon"
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const getAuthToken = () => {
    const cookieToken = Cookies.get("accessToken");
    if (cookieToken) return cookieToken;
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch course data (only for single course plan)
        if (planType === "single" && courseId) {
          const courseResponse = await axios.get(
            `${API_CONFIG.BASE_URL}/course/get-course/${courseId}`
          );
          setCourseData(courseResponse.data?.data || courseResponse.data);
        } else if (planType === "combo") {
          if (!comboId) {
            toast.error("Bundle is missing. Please reopen from the bundle page.");
            router.push("/bundle");
            return;
          }
          const comboResponse = await axios.get(
            `${API_CONFIG.BASE_URL}/combo/${comboId}`
          );
          const combo = comboResponse.data?.data || comboResponse.data;
          setCourseData({
            _id: combo._id,
            title: combo.name,
            price: combo.discountPrice || combo.price,
            thumbnail: combo.thumbnail,
          });
        } else if (planType !== "single") {
          // For non-single plans, create dummy course data (kit uses dynamic price)
          const fallbackPrice = planType === "kit" ? resolvedKitPrice : planType === "quarterly" ? 9999 : 0;
          setCourseData({
            _id: planType,
            title: planType === "quarterly" 
              ? "ত্রৈমাসিক সাবস্ক্রিপশন - All Course Access" 
              : planType === "kit" 
                ? "Official Robotics Starter Kit (Arduino Edition)" 
                : "School Partnership",
            price: fallbackPrice,
            thumbnail: planType === "kit" ? "/courses/robotics-course-banner.jpg" : "/images/default-plan.jpg",
          });
        }

        // Fetch user profile
        const userResponse = await axios.get(
          `${API_CONFIG.BASE_URL}/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = userResponse.data?.data?.user;
        setUserData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        });

        // Auto-populate delivery address with user data
        setDeliveryAddress((prev) => ({
          ...prev,
          name: user?.name || "",
          phone: user?.phone || "",
        }));

        // Check if user already has an active quarterly subscription
        if (planType === "quarterly") {
          try {
            const ordersResponse = await axios.get(
              `${API_CONFIG.BASE_URL}/orders/my`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const userOrders = ordersResponse.data?.orders || ordersResponse.data?.data || [];
            
            // Find active quarterly subscription
            const now = new Date();
            const activeSubscription = userOrders.find((order: any) => 
              order.planType === "quarterly" && 
              order.paymentStatus === "approved" &&
              order.isActive === true &&
              new Date(order.endDate) > now
            );

            if (activeSubscription) {
              setExistingSubscription(activeSubscription);
            }
          } catch (error) {
          }
        }

        // Precheck: Has user already purchased this combo?
        if (planType === "combo" && comboId) {
          try {
            const purchasesResponse = await axios.get(
              `${API_CONFIG.BASE_URL}/combo/my/purchases`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const purchases = purchasesResponse.data?.data || purchasesResponse.data?.orders || [];
            const existing = purchases.find((p: any) => p?.comboId?._id === comboId && p.paymentStatus === "approved" && p.isActive === true);
            if (existing) {
              setHasPurchasedCombo(true);
              setExistingComboOrder(existing);
            }
          } catch (error) {
          }
        }

        // Fetch payment methods
        const paymentResponse = await axios.get(
          `${API_CONFIG.BASE_URL}/payment-methods`
        );
        const methods = (paymentResponse.data?.data || paymentResponse.data || []).filter(
          (m: PaymentMethod) => m.isActive !== false
        );
        setPaymentMethods(methods);
        if (methods[0]?._id) {
          setSelectedPaymentMethod(methods[0]._id);
        }
      } catch (error) {
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, comboId, planType, router, resolvedKitPrice]);

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    // Validate delivery address for kit and quarterly plans
    if ((planType === "kit" || planType === "quarterly") &&
        (!deliveryAddress.name || !deliveryAddress.phone || !deliveryAddress.fullAddress || !deliveryAddress.city)) {
      toast.error("Please fill in delivery address");
      return;
    }

    if (!userData) {
      toast.error("Missing user data");
      return;
    }

    if (planType === "single" && !courseData) {
      toast.error("Course data not found");
      return;
    }

    const effectiveComboId = planType === "combo" ? (comboId || (courseData?._id?.length === 24 ? courseData._id : "")) : "";

    if (planType === "combo" && !effectiveComboId) {
      toast.error("Bundle ID missing. Please reopen from the bundle page.");
      return;
    }

    try {
      setSubmitting(true);

      // Validate payment details.
      // A bank transfer is paid FROM a bank account, so the four account
      // fields replace the mobile sender number for that method.
      if (isBankTransfer) {
        const missing = [
          senderBankDetails.accountName.trim() && "account name",
          senderBankDetails.accountNumber.trim() && "account number",
          senderBankDetails.bankName.trim() && "bank name",
        ].filter((v) => !v);

        if (missing.length > 0) {
          toast.error(
            language === "bn"
              ? "যে ব্যাংক অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন তার তথ্য দিন"
              : `Please enter the ${missing.join(", ")} you sent the money from`
          );
          setSubmitting(false);
          return;
        }
      } else if (!senderNumber.trim()) {
        toast.error("Please enter the account number/mobile you sent payment from");
        setSubmitting(false);
        return;
      }

      if (!transactionId.trim()) {
        toast.error("Please enter your transaction ID");
        setSubmitting(false);
        return;
      }

      // For bank transfers, payment screenshot is mandatory
      if (isBankTransfer && !paymentScreenshot) {
        toast.error(language === "bn" ? "অনুগ্রহ করে পেমেন্ট স্ক্রিনশট আপলোড করুন" : "Please upload a payment screenshot for bank transfers");
        setSubmitting(false);
        return;
      }

      // Create order
      const orderPayload: any = {
        planType,
        paymentMethodId: selectedPaymentMethod,
        transactionId: transactionId.trim(),
        senderNumber: senderNumber.trim(),
        price: finalPrice,
      };

      // Add courseId only for single course plan
      if (planType === "single" && courseData) {
        orderPayload.courseId = courseData._id;
      }

      // Add comboId for combo plan
      if (planType === "combo") {
        orderPayload.comboId = effectiveComboId;
      }

      // Add payment screenshot if available
      if (paymentScreenshot) {
        orderPayload.paymentScreenshot = paymentScreenshot;
      }

      // Bank transfer only: the account the customer paid FROM. The backend
      // matches it against the bank statement.
      if (isBankTransfer) {
        orderPayload.senderBankDetails = {
          accountName: senderBankDetails.accountName.trim(),
          accountNumber: senderBankDetails.accountNumber.trim(),
          bankName: senderBankDetails.bankName.trim(),
          branchName: senderBankDetails.branchName.trim(),
        };
        // The sender number is what the admin column shows and searches by.
        // For a bank transfer the account number identifies the payer.
        if (!orderPayload.senderNumber) {
          orderPayload.senderNumber = senderBankDetails.accountNumber.trim();
        }
      }

      // Add the coupon code. The backend re-validates it and re-derives the
      // discount itself - the client never decides the discount amount.
      if (appliedCoupon?.code) {
        orderPayload.couponCode = appliedCoupon.code;
      }

      // Add delivery address for kit and quarterly plans
      if (planType === "kit" || planType === "quarterly") {
        orderPayload.deliveryAddress = deliveryAddress;
      }

      const res = await createOrder(orderPayload).unwrap();
      const order = (res as any)?.order || (res as any)?.data || res;
      if (order?._id) {
        // Track Purchase event (Client Pixel + Next.js Server CAPI with SHA-256 deduplication)
        try {
          trackPurchaseEvent({
            orderId: order._id,
            value: Number(planPrice) || 0,
            currency: "BDT",
            content_name: courseData?.title || `Plan: ${planType}`,
            content_ids: courseData?._id ? [courseData._id] : undefined,
            email: userData?.email,
            phone: senderNumber || deliveryAddress?.phone || userData?.phone,
            name: userData?.name || deliveryAddress?.name,
          });
        } catch (trackErr) {
          // Non-blocking for checkout flow
        }

        // Redirect to payment processing page
        router.push(`/payment-processing?orderId=${order._id}`);
      } else {
        toast.error("Failed to create order");
      }
    } catch (error: any) {
      const msg = error?.data?.message || error?.message || "Failed to create order";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === "bn" ? "ফাইলটি খুব বড়। ৫ মেগাবাইটের কম ফাইল আপলোড করুন।" : "File too large. Please upload a file smaller than 5MB.");
      return;
    }

    setUploadingScreenshot(true);
    const formData = new FormData();
    formData.append("screenshot", file);

    try {
      const token = getAuthToken();
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/orders/upload-screenshot`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.success && response.data?.data?.url) {
        setPaymentScreenshot(response.data.data.url);
        toast.success(language === "bn" ? "স্ক্রিনশট আপলোড সফল হয়েছে!" : "Screenshot uploaded successfully!");
      } else {
        toast.error(language === "bn" ? "আপলোড ব্যর্থ হয়েছে" : "Upload failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || (language === "bn" ? "আপলোড করতে সমস্যা হয়েছে" : "Problem uploading screenshot"));
    } finally {
      setUploadingScreenshot(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
          <p className="text-slate-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if ((planType === "single" && !courseData) || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{planType === "single" ? "Course data not found" : "User data not found"}</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
            <Link href="/courses" className="hover:text-blue-600 transition">
              {language === "bn" ? "কোর্সসমূহ" : "Courses"}
            </Link>
            <ChevronRight size={16} />
            <span className="text-slate-900 font-medium">
              {language === "bn" ? "চেকআউট" : "Checkout"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {language === "bn" ? "আপনার অর্ডার সম্পন্ন করুন" : "Complete Your Purchase"}
          </h1>
          <p className="text-slate-600 mt-2 font-medium flex items-center gap-2">
            <Lock size={15} className="text-emerald-600 inline" />
            <span>
              {language === "bn"
                ? "সুরক্ষিত চেকআউট • দ্রুত পেমেন্ট অনুমোদন • নির্ভরযোগ্য ডেলিভারি"
                : "Secure checkout • Instant payment verification • Reliable delivery"}
            </span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Extension Notice */}
            {existingSubscription && planType === "quarterly" && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white rounded-full p-3 flex-shrink-0">
                    <Check size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-2">
                      Subscription Extension / সাবস্ক্রিপশন এক্সটেনশন
                    </h3>
                    <p className="text-sm text-green-800 mb-3">
                      You already have an active quarterly subscription! This purchase will extend your subscription by 3 more months.
                    </p>
                    <p className="text-sm text-green-800 mb-3">
                      আপনার ইতিমধ্যে একটি সক্রিয় ত্রৈমাসিক সাবস্ক্রিপশন আছে! এই ক্রয়টি আপনার সাবস্ক্রিপশন আরও ৩ মাস বৃদ্ধি করবে।
                    </p>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Time Remaining / বাকি সময়:</span>
                        <span className="font-semibold text-blue-700">
                          {(() => {
                            const now = new Date();
                            const endDate = new Date(existingSubscription.endDate);
                            const diffTime = endDate.getTime() - now.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const diffMonths = Math.floor(diffDays / 30);
                            const remainingDays = diffDays % 30;
                            
                            if (diffMonths > 0) {
                              return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ${remainingDays > 0 ? `${remainingDays} days` : ''}`;
                            }
                            return `${diffDays} days`;
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Current End Date / বর্তমান শেষ তারিখ:</span>
                        <span className="font-semibold text-slate-900">
                          {new Date(existingSubscription.endDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-green-200">
                        <span className="text-green-700 font-medium">New End Date (+ 3 months) / নতুন শেষ তারিখ:</span>
                        <span className="font-bold text-green-700">
                          {(() => {
                            const newEndDate = new Date(existingSubscription.endDate);
                            newEndDate.setMonth(newEndDate.getMonth() + 3);
                            return newEndDate.toLocaleDateString('en-GB');
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Total Time After Extension / মোট সময়:</span>
                        <span className="font-bold text-green-700">
                          {(() => {
                            const now = new Date();
                            const newEndDate = new Date(existingSubscription.endDate);
                            newEndDate.setMonth(newEndDate.getMonth() + 3);
                            const diffTime = newEndDate.getTime() - now.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            const diffMonths = Math.floor(diffDays / 30);
                            const remainingDays = diffDays % 30;
                            
                            if (diffMonths > 0) {
                              return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ${remainingDays > 0 ? `${remainingDays} days` : ''}`;
                            }
                            return `${diffDays} days`;
                          })()}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <Check size={14} className="text-emerald-600 inline flex-shrink-0" />
                          <span>Your subscription will be automatically extended after payment approval</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
                <div>
                  {planType === "kit" && (
                    <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mb-2">
                      {language === "bn" ? "অফিসিয়াল হার্ডওয়্যার কিট" : "Official Hardware Kit"}
                    </span>
                  )}
                  <h2 className="text-xl md:text-2xl font-black text-slate-900">
                    {language === "bn" ? "অর্ডার সারাংশ" : "Order Summary"}
                  </h2>
                </div>
                {planType === "kit" && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>{language === "bn" ? "স্টক অ্যাভেইলেবল • সারাদেশে ফ্রি ডেলিভারি" : "In Stock • Free Nationwide Delivery"}</span>
                  </div>
                )}
              </div>

              {/* Combo precheck notice */}
              {planType === "combo" && hasPurchasedCombo && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-900 font-semibold">
                    {language === "bn" ? "আপনি ইতিমধ্যে এই বান্ডেলটি কিনেছেন। অনুগ্রহ করে My Courses এ যান।" : "You already purchased this bundle. Please go to My Courses."}
                  </p>
                  <div className="mt-3">
                    <Link href="/student/courses" className="inline-block px-4 py-2 bg-green-600 text-white rounded-md text-sm">
                      {language === "bn" ? "আমার কোর্সে যান" : "Go to My Courses"}
                    </Link>
                  </div>
                </div>
              )}

              {planType === "kit" ? (
                <>
                  {/* Kit Product Hero Header */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl p-4 md:p-6 border border-slate-200/80 mb-6">
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                      <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden flex-shrink-0 shadow-md border border-slate-200 bg-white">
                        <Image
                          src="/courses/robotics-course-banner.jpg"
                          alt="Learn & Grow Robotics Kit"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute top-2 left-2 bg-[#2C2C2C]/90 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-sm">
                          Arduino Uno R3
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{language === "bn" ? "প্রিমিয়াম স্টেম কিট" : "Premium STEM Kit"}</span>
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {language === "bn" ? "বয়স: ৯-১৬ বছর" : "Ages: 9-16 Yrs"}
                          </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug">
                          {language === "bn" 
                            ? "লার্ন অ্যান্ড গ্রো অফিসিয়াল রোবোটিক্স স্টার্টার কিট (আর্ডুইনো এডিশন)" 
                            : "Learn & Grow Official Robotics Starter Kit (Arduino Edition)"}
                        </h3>
                        
                        <p className="text-xs md:text-sm text-slate-600 mt-1.5 leading-relaxed">
                          {language === "bn"
                            ? "বাচ্চা ও কিশোরদের জন্য কমপ্লিট ৪-হুইল স্মার্ট কার ও ইলেকট্রনিক্স ল্যাব। সোল্ডারিং ছাড়াই নিরাপদ প্লাগ অ্যান্ড প্লে প্রোটোটাইপিং।"
                            : "All-in-one 4WD smart robot car & electronics prototyping lab for kids. Zero-soldering safe plug & play components."}
                        </p>

                        <div className="flex flex-wrap items-baseline gap-3 mt-3">
                          <span className="text-2xl font-black text-blue-600">
                            ৳{planPrice.toLocaleString()}
                          </span>
                          <span className="text-sm font-semibold text-slate-400 line-through">
                            ৳4,500
                          </span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                            {language === "bn" ? "৳৫০১ ছাড়" : "Save ৳501"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium ml-auto">
                            {language === "bn" ? "পরিমাণ: ১ সেট" : "Qty: 1 Set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What's In The Box Grid */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Package size={18} className="text-blue-600" />
                      <h4 className="text-sm md:text-base font-bold text-slate-900">
                        {language === "bn" ? "বক্সে যা যা থাকছে (৮টি মূল উপাদান):" : "What's in the Box (8 Core Modules):"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {KIT_COMPONENTS.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                          <div 
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 transition"
                          >
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-blue-600">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <h5 className="text-xs md:text-sm font-bold text-slate-900 truncate">
                                {language === "bn" ? item.nameBn : item.nameEn}
                              </h5>
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded flex-shrink-0">
                                {language === "bn" ? item.tagBn : item.tagEn}
                              </span>
                            </div>
                              <p className="text-[11px] text-slate-600 leading-snug">
                                {language === "bn" ? item.descBn : item.descEn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kit Guarantees & Perks */}
                  <div className="mb-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-amber-500" />
                      <h4 className="text-sm md:text-base font-bold text-slate-900">
                        {language === "bn" ? "সাথে পাচ্ছেন বিশেষ সেবা ও গ্যারান্টি:" : "Included Services & Guarantees:"}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {KIT_PERKS.map((perk, idx) => {
                        const IconComp = perk.icon;
                        return (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <IconComp size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className="text-xs font-bold text-slate-900">
                                  {language === "bn" ? perk.titleBn : perk.titleEn}
                                </span>
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  {language === "bn" ? perk.badgeBn : perk.badgeEn}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">
                                {language === "bn" ? perk.descBn : perk.descEn}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 text-sm pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>{language === "bn" ? "রোবোটিক্স কিট সাবটোটাল" : "Robotics Kit Subtotal"}</span>
                      <span className="font-semibold text-slate-900">৳{planPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <Truck size={14} className="text-emerald-600" />
                        <span>{language === "bn" ? "সারাদেশে এক্সপ্রেস ডেলিভারি (৪৮-৭২ ঘণ্টা)" : "Nationwide Express Delivery (48-72h)"}</span>
                      </span>
                      <span className="font-bold text-emerald-600">{language === "bn" ? "সম্পূর্ণ ফ্রি (৳০)" : "FREE (৳0)"}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-blue-600" />
                        <span>{language === "bn" ? "৭ দিনের যন্ত্রাংশ রিপ্লেসমেন্ট ওয়ারেন্টি" : "7-Day Replacement Warranty"}</span>
                      </span>
                      <span className="font-semibold text-blue-600">{language === "bn" ? "অন্তর্ভুক্ত" : "Included"}</span>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between font-black text-xl text-slate-900">
                        <span>{language === "bn" ? "মোট প্রদেয় টাকা" : "Total Payable Amount"}</span>
                        <span className="text-blue-600">৳{planPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Standard Course Item */}
                  <div className="flex gap-4 pb-6 border-b border-slate-200">
                    <div className="relative w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                      {courseData?.thumbnail ? (
                        <Image
                          src={courseData.thumbnail}
                          alt={courseData?.title || "Course"}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.onerror = null;
                            img.src = "/logo.png";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <BookOpen className="w-7 h-7 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-2">
                        {courseData?.title}
                      </h3>
                      {courseData?.category && (
                        <p className="text-sm text-slate-600 mt-1">{courseData.category.name}</p>
                      )}
                      {courseData?.level && (
                        <p className="text-xs text-slate-500 mt-1 capitalize">
                          {language === "bn" ? "লেভেল:" : "Level:"} {courseData.level}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-slate-900">৳{finalPrice.toLocaleString()}</p>
                      <p className="text-xs text-slate-600 mt-1">{language === "bn" ? "পরিমাণ: ১" : "Qty: 1"}</p>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {language === "bn" ? "কুপন কোড" : "Coupon Code"}
                    </label>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-green-800 truncate">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-xs text-green-700">
                            {language === "bn"
                              ? `৳${appliedCoupon.discountAmount.toLocaleString()} ছাড় প্রয়োগ হয়েছে`
                              : `You saved ৳${appliedCoupon.discountAmount.toLocaleString()}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-xs font-bold text-green-700 hover:text-green-900 underline shrink-0"
                        >
                          {language === "bn" ? "সরান" : "Remove"}
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value);
                            if (couponError) setCouponError("");
                          }}
                          placeholder={language === "bn" ? "কুপন কোড লিখুন" : "Enter coupon code"}
                          className={`flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                            couponError
                              ? "border-red-300 focus:ring-red-400"
                              : "border-slate-300 focus:border-blue-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon}
                          className="shrink-0 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700 disabled:opacity-50"
                        >
                          {applyingCoupon
                            ? language === "bn"
                              ? "প্রয়োগ হচ্ছে..."
                              : "Applying..."
                            : language === "bn"
                              ? "প্রয়োগ করুন"
                              : "Apply"}
                        </button>
                      </div>
                    )}
                    {couponError && (
                      <p className="mt-2 text-xs font-semibold text-red-600">{couponError}</p>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 text-sm mt-6">
                    <div className="flex justify-between text-slate-600">
                      <span>{language === "bn" ? "সাবটোটাল" : "Subtotal"}</span>
                      <span>৳{planPrice.toLocaleString()}</span>
                    </div>
                    {coursePricing.hasDiscount ? (
                      <div className="flex justify-between text-slate-600">
                        <span>
                          {language === "bn"
                            ? `কোর্স ছাড় (${coursePricing.discountPercent}%)`
                            : `Course discount (${coursePricing.discountPercent}%)`}
                        </span>
                        <span className="text-green-600">
                          -৳{(coursePricing.originalPrice - planPrice).toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                    {appliedCoupon ? (
                      <div className="flex justify-between text-slate-600">
                        <span>
                          {language === "bn"
                            ? `কুপন ছাড় (${appliedCoupon.code})`
                            : `Coupon (${appliedCoupon.code})`}
                        </span>
                        <span className="text-green-600">
                          -৳{appliedCoupon.discountAmount.toLocaleString()}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-slate-600">
                      <span>{language === "bn" ? "ভ্যাট / ট্যাক্স (০%)" : "Tax (0%)"}</span>
                      <span>৳0</span>
                    </div>

                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold text-lg text-slate-900">
                        <span>{language === "bn" ? "মোট টাকা" : "Total Amount"}</span>
                        <span className="text-blue-600">৳{finalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {language === "bn" ? "বিলিং তথ্য" : "Billing Information"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === "bn" ? "পুরো নাম" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    disabled
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {language === "bn" ? "ফোন নম্বর" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={userData.phone}
                    disabled
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 cursor-not-allowed"
                  />
                </div>

                <p className="text-xs text-slate-500 mt-4">
                  {language === "bn" 
                    ? "আপনার প্রোফাইল থেকে সংগৃহীত। পরিবর্তন করতে চাইলে প্রোফাইল সেটিংস আপডেট করুন।" 
                    : "Information retrieved from your profile. To change, please update your profile settings."}
                </p>
              </div>
            </div>

            {/* Delivery Address Card (for kit and quarterly plans) */}
            {(planType === "kit" || planType === "quarterly") && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {planType === "kit"
                      ? (language === "bn" ? "রোবোটিক্স কিট ডেলিভারি ঠিকানা" : "Robotics Kit Delivery Address")
                      : (language === "bn" ? "ডেলিভারি ঠিকানা" : "Delivery Address")}
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {language === "bn" ? "ফ্রি এক্সপ্রেস ডেলিভারি" : "Free Express Courier"}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {language === "bn" ? "প্রাপকের নাম" : "Recipient Name"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress.name || ""}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                      placeholder={language === "bn" ? "প্রাপকের নাম লিখুন" : "Enter recipient name"}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {language === "bn" ? "মোবাইল নম্বর" : "Phone Number"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={deliveryAddress.phone || ""}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {language === "bn" ? "সম্পূর্ণ ঠিকানা (বাসা/ফ্ল্যাট, রোড, এলাকা)" : "Full Address (House/Flat, Road, Area)"} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={deliveryAddress.fullAddress || ""}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, fullAddress: e.target.value })}
                      placeholder={language === "bn" ? "যেমন: ফ্ল্যাট ৪বি, বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা" : "e.g., Flat 4B, House 12, Road 5, Dhanmondi, Dhaka"}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {language === "bn" ? "শহর / জেলা" : "City / District"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.city || ""}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        placeholder={language === "bn" ? "যেমন: ঢাকা / চট্টগ্রাম / সিলেট" : "e.g., Dhaka, Chittagong, Sylhet"}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {language === "bn" ? "পোস্টাল কোড (ঐচ্ছিক)" : "Postal Code (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress.postalCode || ""}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, postalCode: e.target.value })}
                        placeholder="e.g., 1205"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mt-4">
                    <div className="flex gap-3 items-start">
                      <Truck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-blue-900">
                          {planType === "kit" 
                            ? (language === "bn" ? "রোবোটিক্স কিট হোম ডেলিভারি (সম্পূর্ণ ফ্রি)" : "Robotics Kit Home Delivery (100% Free)")
                            : (language === "bn" ? "কোর্সের সাথে কিট ডেলিভারি অন্তর্ভুক্ত" : "Kit Delivery Included with Plan")}
                        </p>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                          {language === "bn"
                            ? "অর্ডার অনুমোদনের পর ৪৮-৭২ ঘণ্টার মধ্যে এক্সপ্রেস কুরিয়ারে যত্নসহকারে কিট বক্স পৌঁছে দেওয়া হবে। সারাদেশে হোম ডেলিভারি ফ্রি।"
                            : "Your robotics kit box will be dispatched within 24 hours and delivered within 48-72 hours via express courier. Free nationwide delivery."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {language === "bn" ? "পেমেন্ট মাধ্যম নির্বাচন" : "Select Payment Method"}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {language === "bn" ? "পেমেন্ট পদ্ধতি পছন্দ করুন" : "Choose a payment method"}
                </label>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition"
                >
                  <option value="">{language === "bn" ? "একটি পদ্ধতি নির্বাচন করুন" : "Choose a payment method"}</option>
                  {paymentMethods.map((method) => (
                    <option key={method._id} value={method._id}>
                      {method.name} {method.accountNumber ? `- ${method.accountNumber}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Show selected payment method details */}
              {selectedPaymentMethod && paymentMethods.find(m => m._id === selectedPaymentMethod) && (
                <div className="mt-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-1">
                    {selectedMethod?.name?.toLowerCase().includes("rocket") && (
                      <CreditCard size={20} className="text-blue-600" />
                    )}
                    {selectedMethod?.name?.toLowerCase().includes("bkash") && (
                      <Smartphone size={20} className="text-pink-600" />
                    )}
                    {selectedMethod?.name?.toLowerCase().includes("bank") && (
                      <Banknote size={20} className="text-green-600" />
                    )}
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {selectedMethod?.name}
                      </h3>
                      {selectedMethod?.accountNumber && (
                        <p className="text-sm font-semibold text-slate-700">
                          {language === "bn" ? "অ্যাকাউন্ট নম্বর:" : "Account Number:"} {selectedMethod?.accountNumber}
                        </p>
                      )}
                    </div>
                    <Check size={20} className="text-blue-600 ml-auto flex-shrink-0" />
                  </div>
                </div>
              )}

              {/* Bank Transfer Details - only for a bank transfer.
                  These are OUR account details: the customer reads them here
                  so they know where to send the money, then fills in the
                  transaction details below. */}
              {selectedPaymentMethod &&
                isBankTransferMethod(selectedMethod) && (
                  <div className="mt-4 p-5 bg-emerald-50 border-2 border-emerald-300 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-emerald-600 text-white rounded-full p-2 flex-shrink-0">
                        <Banknote size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-900 text-base">
                          {language === "bn"
                            ? "ব্যাংক ট্রান্সফারের তথ্য"
                            : "Bank Transfer Details"}
                        </h3>
                        <p className="text-xs text-emerald-800">
                          {language === "bn"
                            ? "নিচের অ্যাকাউন্টে টাকা পাঠান, তারপর নিচে লিখুন।"
                            : "Send the money to this account, then fill in the details below."}
                        </p>
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {selectedMethod?.accountName && (
                        <div>
                          <dt className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                            {language === "bn" ? "অ্যাকাউন্ট নাম" : "Account Name"}
                          </dt>
                          <dd className="font-bold text-emerald-950 break-words">
                            {selectedMethod.accountName}
                          </dd>
                        </div>
                      )}
                      {selectedMethod?.accountNumber && (
                        <div>
                          <dt className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                            {language === "bn"
                              ? "অ্যাকাউন্ট নম্বর"
                              : "Account Number"}
                          </dt>
                          <dd className="font-bold text-emerald-950 font-mono break-all">
                            {selectedMethod.accountNumber}
                          </dd>
                        </div>
                      )}
                      {selectedMethod?.bankName && (
                        <div>
                          <dt className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                            {language === "bn" ? "ব্যাংকের নাম" : "Bank Name"}
                          </dt>
                          <dd className="font-bold text-emerald-950 break-words">
                            {selectedMethod.bankName}
                          </dd>
                        </div>
                      )}
                      {selectedMethod?.branchName && (
                        <div>
                          <dt className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                            {language === "bn" ? "শাখার নাম" : "Branch Name"}
                          </dt>
                          <dd className="font-bold text-emerald-950 break-words">
                            {selectedMethod.branchName}
                          </dd>
                        </div>
                      )}
                      {selectedMethod?.routingNumber && (
                        <div>
                          <dt className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                            {language === "bn" ? "রাউটিং নম্বর" : "Routing Number"}
                          </dt>
                          <dd className="font-bold text-emerald-950 font-mono break-all">
                            {selectedMethod.routingNumber}
                          </dd>
                        </div>
                      )}
                      {selectedMethod?.swiftCode && (
                        <div>
                          <dt className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                            SWIFT Code
                          </dt>
                          <dd className="font-bold text-emerald-950 font-mono break-all">
                            {selectedMethod.swiftCode}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

              {/* Show detailed payment note when method selected */}
              {selectedPaymentMethod && selectedMethod?.paymentNote && (
                <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 text-white rounded-full p-2 flex-shrink-0">
                      <Shield size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-2 text-base">
                        {language === "bn" ? "পেমেন্ট নির্দেশনা" : "Payment Instructions"}
                      </h3>
                      <div className="text-sm text-slate-700 space-y-2 whitespace-pre-line leading-relaxed">
                        {selectedMethod?.paymentNote}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Details Card */}
            {selectedPaymentMethod && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {language === "bn" ? "পেমেন্ট লেনদেনের তথ্য" : "Payment Transaction Details"}
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  {language === "bn" ? "আপনার লেনদেনের ট্রানজেকশন নম্বর ও প্রেরকের ফোন দিন" : "Enter the payment details from your mobile or bank transfer"}
                </p>

                <div className="space-y-4">
                  {/* Mobile wallet: the customer sends from a bKash / Nagad /
                      Rocket number. */}
                  {!isBankTransfer && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "bn" ? "যে নম্বর থেকে পেমেন্ট করেছেন *" : "Sender Account / Mobile Number *"}
                      </label>
                      <input
                        type="text"
                        placeholder={language === "bn" ? "যেমন: ০১৭১২-৩৪৫৬৭৮" : "e.g., 01712345678"}
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {language === "bn" ? "যে বিকাশ / নগদ / রকেট নম্বর থেকে টাকা পাঠিয়েছেন তা লিখুন" : "Enter the mobile number you sent the money from"}
                      </p>
                    </div>
                  )}

                  {/* Bank transfer: the money comes from a bank account, so
                      the account fields replace the mobile number. The admin
                      matches them against the bank statement. */}
                  {isBankTransfer && (
                    <div className="space-y-4 p-4 bg-emerald-50/60 border-2 border-emerald-200 rounded-xl">
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">
                          {language === "bn"
                            ? "যে ব্যাংক অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন"
                            : "The bank account you sent the money from"}
                        </p>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          {language === "bn"
                            ? "যে ব্যাংক অ্যাকাউন্ট থেকে টাকা পাঠিয়েছেন তার তথ্য দিন।"
                            : "Give us the account you paid from so we can match it on the bank statement."}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === "bn" ? "অ্যাকাউন্ট নাম *" : "Account Name *"}
                          </label>
                          <input
                            type="text"
                            placeholder={language === "bn" ? "যেমন: মোহাম্মদ হাসান" : "e.g., MD. JABED HOSEN"}
                            value={senderBankDetails.accountName}
                            onChange={(e) =>
                              setSenderBankDetails({
                                ...senderBankDetails,
                                accountName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === "bn" ? "অ্যাকাউন্ট নম্বর *" : "Account Number *"}
                          </label>
                          <input
                            type="text"
                            placeholder={language === "bn" ? "যেমন: ১০৭০৪৪৮৪১০০০১" : "e.g., 1070448410001"}
                            value={senderBankDetails.accountNumber}
                            onChange={(e) =>
                              setSenderBankDetails({
                                ...senderBankDetails,
                                accountNumber: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === "bn" ? "ব্যাংকের নাম *" : "Bank Name *"}
                          </label>
                          <input
                            type="text"
                            placeholder={language === "bn" ? "যেমন: ব্র্যাঙ্ক ব্যাংক পিএলসি" : "e.g., BRAC Bank PLC"}
                            value={senderBankDetails.bankName}
                            onChange={(e) =>
                              setSenderBankDetails({
                                ...senderBankDetails,
                                bankName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            {language === "bn" ? "শাখার নাম" : "Branch Name"}
                          </label>
                          <input
                            type="text"
                            placeholder={language === "bn" ? "যেমন: আশুলিয়া শাখা" : "e.g., ASHULIA BRANCH"}
                            value={senderBankDetails.branchName}
                            onChange={(e) =>
                              setSenderBankDetails({
                                ...senderBankDetails,
                                branchName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transaction ID Field */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {language === "bn" ? "ট্রানজেকশন আইডি (TrxID) *" : "Transaction ID (TrxID) *"}
                    </label>
                    <input
                      type="text"
                      placeholder={language === "bn" ? "যেমন: TXN987654321" : "e.g., TXN987654321"}
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 uppercase"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      {language === "bn" ? "পেমেন্ট কনফার্মেশন এসএমএস থেকে TrxID টি দিন" : "Enter the transaction ID from your confirmation SMS"}
                    </p>
                  </div>

                  {/* Payment Screenshot Upload (Mandatory for Bank Transfers) */}
                  {selectedPaymentMethod && isBankTransfer && (
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        {language === "bn" ? "পেমেন্ট স্ক্রিনশট আপলোড করুন *" : "Upload Payment Screenshot *"}
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshotUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            disabled={uploadingScreenshot}
                          />
                          <div className={`w-full px-4 py-2.5 border-2 border-dashed rounded-lg text-sm text-center transition ${
                            paymentScreenshot
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                              : "border-slate-300 bg-white text-slate-500 hover:border-blue-400"
                          }`}>
                            {uploadingScreenshot
                              ? (language === "bn" ? "আপলোড হচ্ছে..." : "Uploading...")
                              : paymentScreenshot
                                ? (language === "bn" ? "✅ আপলোড সম্পন্ন হয়েছে" : "✅ Uploaded successfully")
                                : (language === "bn" ? "ছবি নির্বাচন করুন" : "Select Image")}
                          </div>
                        </div>
                        {paymentScreenshot && (
                          <button
                            type="button"
                            onClick={() => setPaymentScreenshot(null)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                            title={language === "bn" ? "মুছে ফেলুন" : "Remove"}
                          >
                            <RotateCw size={18} />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                        <Shield size={12} />
                        {language === "bn"
                          ? "শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) সমর্থিত। সর্বোচ্চ ৫ মেগাবাইট।"
                          : "Only image files (JPG, PNG, WebP) supported. Max 5MB."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex gap-3">
                  <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      {language === "bn" ? "নিরাপদ ও এনক্রিপ্টেড পেমেন্ট" : "Secure Payment"}
                    </p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      {language === "bn" 
                        ? "আপনার পেমেন্ট তথ্য নিরাপদ এবং এনক্রিপ্টেড। আমরা প্রতিটি লেনদেন যাচাই করে দ্রুত সার্ভিস সচল করি।"
                        : "Your payment information is encrypted and secure. We verify all transactions before processing."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-blue-600 rounded"
                />
                <span className="text-sm text-slate-700 leading-relaxed">
                  {language === "bn" ? (
                    <>
                      আমি লার্ন অ্যান্ড গ্রো এর{" "}
                      <a href="/terms-of-use" target="_blank" className="text-blue-600 font-semibold hover:underline">
                        শর্তাবলী
                      </a>{" "}
                      এবং{" "}
                      <a href="/privacy-policy" target="_blank" className="text-blue-600 font-semibold hover:underline">
                        গোপনীয়তা নীতি
                      </a>{" "}
                      মেনে নিচ্ছি।
                    </>
                  ) : (
                    <>
                      I agree to the{" "}
                      <a href="/terms-of-use" target="_blank" className="text-blue-600 font-semibold hover:underline">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/privacy-policy" target="_blank" className="text-blue-600 font-semibold hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </>
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-6">
            {/* Price Summary Sticky */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <h3 className="font-black text-slate-900 text-lg mb-4 pb-3 border-b border-slate-100">
                  {language === "bn" ? "পেমেন্ট সারাংশ" : "Payment Summary"}
                </h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 text-sm">
                  <div className="flex justify-between text-slate-700">
                    <span>{language === "bn" ? "সাবটোটাল" : "Subtotal"}</span>
                    <span className="font-semibold">৳{planPrice.toLocaleString()}</span>
                  </div>
                  {(planType === "kit" || planType === "quarterly") && (
                    <div className="flex justify-between text-slate-700">
                      <span>{language === "bn" ? "সারাদেশে কুরিয়ার ডেলিভারি" : "Nationwide Courier Delivery"}</span>
                      <span className="font-bold text-emerald-600">{language === "bn" ? "ফ্রি (৳০)" : "FREE (৳0)"}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-700">
                    <span>{language === "bn" ? "ছাড়" : "Discount"}</span>
                    <span className="font-semibold text-emerald-600">৳0</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="text-slate-700 font-bold">{language === "bn" ? "মোট প্রদেয়" : "Total Amount"}</span>
                    <span className="text-3xl font-black text-blue-600">৳{planPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={hasPurchasedCombo || submitting || !agreeTerms || !selectedPaymentMethod || !transactionId.trim() || !(isBankTransfer ? senderBankDetails.accountName.trim() && senderBankDetails.accountNumber.trim() && senderBankDetails.bankName.trim() : senderNumber.trim())}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-white text-base transition flex items-center justify-center gap-2 shadow-md ${
                    hasPurchasedCombo || submitting || !agreeTerms || !selectedPaymentMethod || !transactionId.trim() || !(isBankTransfer ? senderBankDetails.accountName.trim() && senderBankDetails.accountNumber.trim() && senderBankDetails.bankName.trim() : senderNumber.trim())
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-500/20"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{language === "bn" ? "প্রসেসিং হচ্ছে..." : "Processing..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{hasPurchasedCombo ? (language === "bn" ? "ইতিমধ্যে কেনা হয়েছে" : "Already Purchased") : (language === "bn" ? "অর্ডার নিশ্চিত করুন" : "Confirm & Place Order")}</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                {planType === "kit" && (
                  <div className="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-100 flex items-center gap-2.5 text-xs text-blue-800">
                    <Truck size={16} className="text-blue-600 flex-shrink-0" />
                    <span>
                      {language === "bn" ? "এক্সপ্রেস ডেলিভারি: ৪৮-৭২ ঘণ্টার মধ্যে" : "Express Delivery: Within 48-72 hours"}
                    </span>
                  </div>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mt-6">
                <h3 className="font-bold text-slate-900 text-sm mb-4">
                  {language === "bn" ? "নিরাপদ চেকআউট গ্যারান্টি" : "Secure Checkout Guarantee"}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Lock size={18} className="text-emerald-600" />
                    </div>
                    <span className="text-xs md:text-sm text-slate-700">
                      {language === "bn" ? "২৫৬-বিট SSL এনক্রিপ্টেড সংযোগ" : "256-bit SSL encrypted connection"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Shield size={18} className="text-blue-600" />
                    </div>
                    <span className="text-xs md:text-sm text-slate-700">
                      {language === "bn" ? "১০০% নিরাপদ পেমেন্ট ভেরিফিকেশন" : "100% Secure payment verification"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <Check size={18} className="text-emerald-600" />
                    </div>
                    <span className="text-xs md:text-sm text-slate-700">
                      {language === "bn" ? "৭ দিনের পার্টস রিপ্লেসমেন্ট নিশ্চয়তা" : "7-Day component replacement guarantee"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500 text-center">
                  <Lock size={12} className="text-slate-400 inline" />
                  <span>
                    {language === "bn" 
                      ? "আপনার তথ্য সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড।" 
                      : "This is a secure page. Your information is protected."}
                  </span>
                </div>
              </div>

              {/* Need Help */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5 mt-6">
                <p className="text-sm font-bold text-blue-900 mb-1">
                  {language === "bn" ? "সাহায্য প্রয়োজন?" : "Need Assistance?"}
                </p>
                <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                  {language === "bn" 
                    ? "পেমেন্ট বা ডেলিভারি নিয়ে যেকোনো প্রশ্নে সরাসরি আমাদের সাপোর্ট টিমে নক দিন।"
                    : "Have questions about payment or delivery? Our dedicated support team is ready to help."}
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-xs transition"
                >
                  <Headphones size={14} />
                  <span>{language === "bn" ? "সাপোর্টে যোগাযোগ করুন →" : "Contact Support →"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
