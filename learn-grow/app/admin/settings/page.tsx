"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Card,
  CardBody,
  Button,
  Input,
  Spinner,
  Checkbox,
  Progress,
  Chip,
  Tabs,
  Tab,
  Tooltip,
} from "@nextui-org/react";
import {
  useGetCommissionQuery,
  useUpdateCommissionMutation,
  useGetSMTPConfigQuery,
  useUpdateSMTPConfigMutation,
  useTestSMTPConnectionMutation,
  useGetTrackingConfigQuery,
  useUpdateTrackingConfigMutation,
  useTestTrackingEventMutation,
} from "@/redux/api/settingsApi";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  Mail,
  Coins,
  TrendingUp,
  Activity,
  Database,
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  HelpCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Sliders,
  Radio,
  Info,
} from "lucide-react";
import {
  FaPercentage,
  FaEnvelope,
  FaServer,
  FaLock,
  FaUser,
  FaPaperPlane,
  FaShieldAlt,
  FaWallet,
  FaGlobe,
  FaBoxOpen,
  FaEye,
  FaEyeSlash,
  FaDatabase,
  FaDownload,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

export default function AdminSettingsPage() {
  const router = useRouter();

  // Role & Current User State
  const [userRole, setUserRole] = useState<string>("admin");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role) setUserRole(u.role);
        if (u.name) setUserName(u.name);
      } else {
        const cookieRole = Cookies.get("userRole");
        if (cookieRole) setUserRole(cookieRole);
      }
    } catch {
      // Default fallback
    }
  }, []);

  const isSuperAdmin = userRole === "admin";
  const dashboardRoute = userRole === "manager" ? "/manager" : "/admin";

  // Commission & Kit Price State
  const { data: commissionData, isLoading: commissionLoading, refetch: refetchCommission } = useGetCommissionQuery();
  const [updateCommission, { isLoading: commissionSaving }] = useUpdateCommissionMutation();
  const [commission, setCommission] = useState<number>(20);
  const [kitPrice, setKitPrice] = useState<number>(4500);
  const payout = Math.max(0, 100 - (Number.isFinite(commission) ? commission : 0));

  useEffect(() => {
    if (commissionData?.data?.platformCommissionPercent != null) {
      setCommission(commissionData.data.platformCommissionPercent);
    }
    if (commissionData?.data?.kitPrice != null) {
      setKitPrice(Number(commissionData.data.kitPrice));
    }
  }, [commissionData]);

  // SMTP State
  const { data: smtpData, isLoading: smtpLoading, refetch: refetchSMTP } = useGetSMTPConfigQuery();
  const [updateSMTP, { isLoading: smtpSaving }] = useUpdateSMTPConfigMutation();
  const [testSMTP, { isLoading: smtpTesting }] = useTestSMTPConnectionMutation();
  const [smtp, setSMTP] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
  });
  const [testEmail, setTestEmail] = useState("");
  const [smtpSource, setSMTPSource] = useState("");
  const [showSMTPPassword, setShowSMTPPassword] = useState(false);

  useEffect(() => {
    if (smtpData?.data) {
      setSMTP({
        host: smtpData.data.host || "",
        port: smtpData.data.port || 587,
        secure: smtpData.data.secure || false,
        user: smtpData.data.user || "",
        password: "",
        fromName: smtpData.data.fromName || "",
        fromEmail: smtpData.data.fromEmail || "",
        replyTo: smtpData.data.replyTo || "",
      });
      setSMTPSource(smtpData.data.source || "");
    }
  }, [smtpData]);

  // Database Backup State
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);

  // Tracking & CAPI State
  const { data: trackingData, isLoading: trackingLoading, refetch: refetchTracking } = useGetTrackingConfigQuery();
  const [updateTracking, { isLoading: trackingSaving }] = useUpdateTrackingConfigMutation();
  const [testTracking, { isLoading: trackingTesting }] = useTestTrackingEventMutation();

  const [tracking, setTracking] = useState({
    isEnabled: true,
    metaEnabled: true,
    metaPixelId: "",
    metaAccessToken: "",
    metaTestEventCode: "",
    tiktokEnabled: true,
    tiktokPixelId: "",
    tiktokAccessToken: "",
    tiktokTestEventCode: "",
    googleEnabled: true,
    ga4MeasurementId: "",
    ga4ApiSecret: "",
    googleAdsConversionId: "",
    googleAdsConversionLabel: "",
    linkedinEnabled: true,
    linkedinPartnerId: "",
    linkedinAccessToken: "",
    linkedinConversionId: "",
  });

  // Masking toggles for sensitive tokens
  const [showMetaToken, setShowMetaToken] = useState(false);
  const [showTikTokToken, setShowTikTokToken] = useState(false);
  const [showGA4Secret, setShowGA4Secret] = useState(false);
  const [showLinkedInToken, setShowLinkedInToken] = useState(false);

  // Copied state indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, keyName: string) => {
    if (!text) {
      toast.info("No value to copy");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    toast.success(`Copied ${keyName} to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const [testPlatform, setTestPlatform] = useState<"all" | "meta" | "tiktok" | "google" | "linkedin">("all");
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    if (trackingData?.data) {
      const d = trackingData.data;
      setTracking({
        isEnabled: d.isEnabled ?? true,
        metaEnabled: d.meta?.enabled ?? true,
        metaPixelId: d.meta?.pixelId || "",
        metaAccessToken: d.meta?.accessToken || "",
        metaTestEventCode: d.meta?.testEventCode || "",
        tiktokEnabled: d.tiktok?.enabled ?? true,
        tiktokPixelId: d.tiktok?.pixelId || "",
        tiktokAccessToken: d.tiktok?.accessToken || "",
        tiktokTestEventCode: d.tiktok?.testEventCode || "",
        googleEnabled: d.google?.enabled ?? true,
        ga4MeasurementId: d.google?.ga4MeasurementId || "",
        ga4ApiSecret: d.google?.ga4ApiSecret || "",
        googleAdsConversionId: d.google?.adsConversionId || "",
        googleAdsConversionLabel: d.google?.adsConversionLabel || "",
        linkedinEnabled: d.linkedin?.enabled ?? true,
        linkedinPartnerId: d.linkedin?.partnerId || "",
        linkedinAccessToken: d.linkedin?.accessToken || "",
        linkedinConversionId: d.linkedin?.conversionId || "",
      });
    }
  }, [trackingData]);

  // Handlers
  const handleSaveCommission = async () => {
    try {
      await updateCommission({
        platformCommissionPercent: Number(commission) || 0,
        kitPrice: Number(kitPrice) || 0,
      }).unwrap();
      await refetchCommission();
      toast.success("কমিশন রেট সফলভাবে সংরক্ষিত হয়েছে! | Commission settings updated!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update commission settings");
    }
  };

  const handleSMTPSave = async () => {
    try {
      const payload: any = {
        host: smtp.host.trim(),
        port: Number(smtp.port) || 587,
        secure: smtp.secure,
        user: smtp.user.trim(),
        fromName: smtp.fromName.trim(),
        fromEmail: smtp.fromEmail.trim(),
      };
      if (smtp.password) payload.password = smtp.password;
      if (smtp.replyTo) payload.replyTo = smtp.replyTo.trim();

      await updateSMTP(payload).unwrap();
      await refetchSMTP();
      setSMTP((prev) => ({ ...prev, password: "" }));
      toast.success("SMTP সার্ভার সেটিংস সফলভাবে সংরক্ষিত হয়েছে! | SMTP settings saved successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update SMTP settings");
    }
  };

  const handleTestSMTP = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("সঠিক ইমেইল এড্রেস লিখুন | Please enter a valid test email address");
      return;
    }
    try {
      const result = await testSMTP({ testEmail }).unwrap();
      toast.success(result.message || "টেস্ট ইমেইল সফলভাবে পাঠানো হয়েছে! | Test email sent successfully");
      setTestEmail("");
    } catch (error: any) {
      toast.error(error?.data?.message || "SMTP connection test failed. Check host, port & credentials.");
    }
  };

  const applySMTPPreset = (preset: "gmail" | "titan" | "ses") => {
    if (preset === "gmail") {
      setSMTP((prev) => ({
        ...prev,
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
      }));
      toast.info("Applied Gmail / Google Workspace preset (Host: smtp.gmail.com, Port: 465 SSL)");
    } else if (preset === "titan") {
      setSMTP((prev) => ({
        ...prev,
        host: "smtp.titan.email",
        port: 465,
        secure: true,
      }));
      toast.info("Applied Titan Mail preset (Host: smtp.titan.email, Port: 465 SSL)");
    } else if (preset === "ses") {
      setSMTP((prev) => ({
        ...prev,
        host: "email-smtp.ap-south-1.amazonaws.com",
        port: 587,
        secure: false,
      }));
      toast.info("Applied Amazon SES preset (Port: 587 TLS)");
    }
  };

  const handleTrackingSave = async () => {
    try {
      await updateTracking({
        isEnabled: tracking.isEnabled,
        metaEnabled: tracking.metaEnabled,
        metaPixelId: tracking.metaPixelId.trim(),
        metaAccessToken: tracking.metaAccessToken.trim(),
        metaTestEventCode: tracking.metaTestEventCode.trim(),
        tiktokEnabled: tracking.tiktokEnabled,
        tiktokPixelId: tracking.tiktokPixelId.trim(),
        tiktokAccessToken: tracking.tiktokAccessToken.trim(),
        tiktokTestEventCode: tracking.tiktokTestEventCode.trim(),
        googleEnabled: tracking.googleEnabled,
        ga4MeasurementId: tracking.ga4MeasurementId.trim(),
        ga4ApiSecret: tracking.ga4ApiSecret.trim(),
        googleAdsConversionId: tracking.googleAdsConversionId.trim(),
        googleAdsConversionLabel: tracking.googleAdsConversionLabel.trim(),
        linkedinEnabled: tracking.linkedinEnabled,
        linkedinPartnerId: tracking.linkedinPartnerId.trim(),
        linkedinAccessToken: tracking.linkedinAccessToken.trim(),
        linkedinConversionId: tracking.linkedinConversionId.trim(),
      }).unwrap();
      await refetchTracking();
      toast.success("সার্ভার ট্র্যাকিং সেটিংস সংরক্ষিত হয়েছে! | Tracking settings updated!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update tracking settings");
    }
  };

  const handleTestTracking = async () => {
    try {
      setTestResult(null);
      const res = await testTracking({ platform: testPlatform }).unwrap();
      setTestResult(res.results);
      toast.success("সার্ভার টেস্ট ইভেন্ট সফলভাবে পাঠানো হয়েছে! | Test event sent successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to dispatch test event to advertising servers");
    }
  };

  // Secure Database Backup Handler with JWT Auth & API_CONFIG Base URL
  const handleBackupDatabase = async () => {
    if (!isSuperAdmin) {
      toast.error("শুধুমাত্র সুপার অ্যাডমিন ডাটাবেস ব্যাকআপ নিতে পারেন | Super Admin privileges required");
      return;
    }

    const confirmed = window.confirm(
      "SECURITY CONFIRMATION:\n\nThis will trigger a full MongoDB database export including all collections, user profiles, and order data. The file will be streamed directly to your browser as an encrypted archive.\n\nDo you want to proceed?"
    );
    if (!confirmed) return;

    setBackupLoading(true);
    try {
      const token =
        Cookies.get("accessToken") ||
        (typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("accessToken") : null);

      const backupUrl = `${API_CONFIG.BASE_URL}/settings/backup/database`;

      const response = await fetch(backupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        let errMessage = "Failed to create database backup";
        try {
          const errData = await response.json();
          if (errData?.message) errMessage = errData.message;
        } catch {
          errMessage = `HTTP error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errMessage);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers.get("content-disposition");
      let filename = `learn-grow-backup-${new Date().toISOString().split("T")[0]}.tar.gz`;
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="?([^";\n]+)"?/i);
        if (matches) filename = matches[1];
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      const now = new Date().toLocaleString();
      setLastBackupTime(now);
      toast.success("ডাটাবেস ব্যাকআপ সম্পন্ন হয়েছে! | Database export downloaded successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create database backup");
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-5 md:px-8 py-6 md:py-10 max-w-6xl space-y-6">
      {/* Enterprise SaaS Header with Brand Depth */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 sm:p-8 md:p-10 text-white shadow-2xl border border-slate-800/80">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top navigation row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Button
              variant="flat"
              startContent={<ArrowLeft className="w-4 h-4 text-white" />}
              onPress={() => router.push(dashboardRoute)}
              className="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-md rounded-xl transition-all"
              size="sm"
            >
              <span>Back to {userRole === "manager" ? "Manager Console" : "Dashboard"}</span>
            </Button>

            {/* Security Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-Bit Vault Encrypted
              </span>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-sm ${
                  isSuperAdmin
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {isSuperAdmin ? "Super Admin" : "Operations Manager"}
              </span>
            </div>
          </div>

          {/* Main title banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-widest mb-1.5">
                <span>Infrastructure & Security</span>
                <span>•</span>
                <span>Config Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                Platform Settings & Integrations
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Centralized control room for revenue commissions, transactional SMTP relays, secure database backups, and direct server-side advertising conversions.
              </p>
            </div>

            {/* Quick sync status pill */}
            <div className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60 backdrop-blur-md self-start md:self-auto">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs">
                <p className="font-bold text-white">System Status: Operational</p>
                <p className="text-slate-400 text-[11px]">API Services & Telemetry Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-[28px] shadow-xl border border-slate-200/90 overflow-hidden">
        <Tabs
          aria-label="Platform Configuration Tabs"
          color="primary"
          variant="underlined"
          classNames={{
            base: "w-full max-w-full overflow-x-auto scrollbar-none",
            tabList: "w-full flex items-center justify-between sm:justify-start gap-1 sm:gap-2.5 md:gap-5 relative rounded-none p-0 border-b border-slate-200 px-2 sm:px-6 pt-2.5 overflow-x-auto scrollbar-none",
            cursor: "w-full bg-blue-600 h-[3px] rounded-full",
            tab: "max-w-fit px-2 sm:px-3 md:px-4 h-12 sm:h-14 min-w-fit shrink-0 whitespace-nowrap",
            tabContent: "group-data-[selected=true]:text-blue-600 font-bold text-xs sm:text-sm",
          }}
        >
          {/* TAB 1: Finance & Commission */}
          <Tab
            key="finance"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2 py-1">
                <Coins className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Finance & Commission</span>
                <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
                  {commission}% Platform
                </span>
              </div>
            }
          >
            <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100/70 text-purple-600 rounded-2xl border border-purple-200">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                      Platform Revenue Distribution & Kit Pricing
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Govern standard course sale commission splits and standalone Robotics Kit baseline prices.
                    </p>
                  </div>
                </div>
                {!isSuperAdmin && (
                  <Chip size="sm" variant="flat" color="warning" startContent={<Lock className="w-3 h-3" />}>
                    Manager View Mode
                  </Chip>
                )}
              </div>

              {commissionLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" color="primary" />
                  <p className="text-xs text-slate-500 font-medium">Loading financial policies...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Dynamic Visualizer Bar */}
                  <div className="bg-gradient-to-br from-purple-50/70 via-indigo-50/50 to-blue-50/60 p-5 rounded-2xl border border-purple-100/90 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-600" />
                        <span className="font-bold text-sm sm:text-base text-purple-900">
                          Platform Share: {commission}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-600" />
                        <span className="font-bold text-sm sm:text-base text-emerald-900">
                          Instructor Payout: {payout}%
                        </span>
                      </div>
                    </div>

                    <Progress
                      size="lg"
                      radius="lg"
                      classNames={{
                        track: "bg-emerald-100 border border-purple-200 h-5",
                        indicator: "bg-gradient-to-r from-purple-600 to-indigo-600 h-5",
                      }}
                      value={commission}
                      aria-label="Platform revenue split progress"
                    />

                    {/* Simulation Calculation */}
                    <div className="mt-4 pt-4 border-t border-purple-100/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                      <span className="font-medium">
                        <strong>Real-time Simulation (per ৳ 10,000 Course Enrollment):</strong>
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="text-purple-700 font-bold bg-purple-100/60 px-2.5 py-1 rounded-lg">
                          Platform: ৳ {(10000 * (commission / 100)).toLocaleString("en-BD")}
                        </span>
                        <span className="text-emerald-700 font-bold bg-emerald-100/60 px-2.5 py-1 rounded-lg">
                          Instructor: ৳ {(10000 * (payout / 100)).toLocaleString("en-BD")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      type="number"
                      label="Platform Commission (%)"
                      value={String(commission)}
                      onChange={(e) => setCommission(Math.min(100, Math.max(0, Number(e.target.value))))}
                      variant="bordered"
                      size="lg"
                      isDisabled={!isSuperAdmin}
                      description="Default percentage platform keeps from course enrollments"
                      startContent={<FaPercentage className="text-purple-500" />}
                      classNames={{
                        inputWrapper: "border-2 border-slate-200 hover:border-purple-400 focus-within:border-purple-600 rounded-xl",
                      }}
                    />

                    <Input
                      isReadOnly
                      label="Instructor Net Payout (%)"
                      value={`${payout}%`}
                      variant="flat"
                      size="lg"
                      description="Automatically calculated balance credited to tutor balances"
                      startContent={<FaWallet className="text-emerald-600" />}
                      classNames={{
                        inputWrapper: "bg-emerald-50/70 border-2 border-emerald-200/80 rounded-xl font-bold text-emerald-800",
                      }}
                    />

                    <Input
                      type="number"
                      label="Hardware Kit Retail Price (BDT)"
                      value={String(kitPrice)}
                      onChange={(e) => setKitPrice(Math.max(0, Number(e.target.value)))}
                      variant="bordered"
                      size="lg"
                      isDisabled={!isSuperAdmin}
                      className="sm:col-span-2"
                      description="Used for standalone robotics kit orders and kit cost deductions during course checkout"
                      startContent={<span className="text-slate-400 font-bold text-sm">৳</span>}
                      classNames={{
                        inputWrapper: "border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-600 rounded-xl",
                      }}
                    />
                  </div>

                  {/* Policy Alert Note */}
                  <div className="flex items-start gap-3 bg-blue-50/80 p-4 rounded-2xl border border-blue-200/80 text-xs sm:text-sm text-blue-900">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Global Policy Enforcement:</strong> Changes made here take immediate effect for all newly placed course enrollments. Specific instructor override contracts take precedence over standard global commission tiers.
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      color="primary"
                      onPress={handleSaveCommission}
                      isLoading={commissionSaving}
                      isDisabled={!isSuperAdmin}
                      size="lg"
                      className="font-bold shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl px-8"
                    >
                      {commissionSaving ? "Saving Rates..." : "Save Financial Settings"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Tab>

          {/* TAB 2: Email Configuration (SMTP) */}
          <Tab
            key="smtp"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2 py-1">
                <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Email (SMTP)</span>
                {smtp.host && (
                  <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    {smtp.host}
                  </span>
                )}
              </div>
            }
          >
            <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100/70 text-blue-600 rounded-2xl border border-blue-200">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                      Transactional SMTP Relays & Notifications
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Configure authenticated email transport for OTPs, course purchase confirmations, and mentor assignments.
                    </p>
                  </div>
                </div>
                {smtpSource && (
                  <Chip size="sm" variant="flat" color="primary">
                    Active Config: {smtpSource}
                  </Chip>
                )}
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5 px-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Quick Presets:
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  className="bg-white text-xs font-semibold border border-slate-200 hover:border-blue-400"
                  onPress={() => applySMTPPreset("gmail")}
                >
                  Gmail / Google Workspace (Port 465 SSL)
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  className="bg-white text-xs font-semibold border border-slate-200 hover:border-blue-400"
                  onPress={() => applySMTPPreset("titan")}
                >
                  Titan Email (Port 465 SSL)
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  className="bg-white text-xs font-semibold border border-slate-200 hover:border-blue-400"
                  onPress={() => applySMTPPreset("ses")}
                >
                  Amazon SES (Port 587 TLS)
                </Button>
              </div>

              {smtpLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" color="primary" />
                  <p className="text-xs text-slate-500 font-medium">Loading SMTP parameters...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Config Form */}
                  <div className="lg:col-span-2 space-y-5">
                    {/* Server Connection Group */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        Host Connection
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="SMTP Host Address"
                          placeholder="smtp.gmail.com"
                          value={smtp.host}
                          onChange={(e) => setSMTP({ ...smtp, host: e.target.value })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                        <Input
                          type="number"
                          label="Port Number"
                          placeholder="465 or 587"
                          value={String(smtp.port)}
                          onChange={(e) => setSMTP({ ...smtp, port: Number(e.target.value) })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                      </div>
                      <div className="bg-slate-50/90 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-slate-800">Enforce SSL / TLS Encryption</p>
                          <p className="text-xs text-slate-500">Required for Port 465; recommended for all cloud mail services.</p>
                        </div>
                        <Checkbox
                          isSelected={smtp.secure}
                          onValueChange={(checked) => setSMTP({ ...smtp, secure: checked })}
                          color="primary"
                          size="md"
                        />
                      </div>
                    </div>

                    {/* Authentication Group */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Credentials & Authentication
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="SMTP Username / Email"
                          placeholder="info@learnandgrow.io"
                          value={smtp.user}
                          onChange={(e) => setSMTP({ ...smtp, user: e.target.value })}
                          variant="bordered"
                          startContent={<FaUser className="text-slate-400 text-xs" />}
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                        <Input
                          type={showSMTPPassword ? "text" : "password"}
                          label="SMTP Password / App Key"
                          placeholder="Leave blank to keep current"
                          value={smtp.password}
                          onChange={(e) => setSMTP({ ...smtp, password: e.target.value })}
                          variant="bordered"
                          startContent={<KeyRound className="w-4 h-4 text-slate-400" />}
                          endContent={
                            <div className="flex items-center gap-1">
                              {smtp.password && (
                                <button
                                  type="button"
                                  onClick={() => handleCopy(smtp.password, "SMTP Password")}
                                  className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                  {copiedKey === "SMTP Password" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setShowSMTPPassword(!showSMTPPassword)}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                {showSMTPPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          }
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                      </div>
                    </div>

                    {/* Sender Identity */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Sender Identity & Branding
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="From Sender Display Name"
                          placeholder="Learn & Grow STEM Academy"
                          value={smtp.fromName}
                          onChange={(e) => setSMTP({ ...smtp, fromName: e.target.value })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                        <Input
                          type="email"
                          label="From Sender Email"
                          placeholder="noreply@learnandgrow.io"
                          value={smtp.fromEmail}
                          onChange={(e) => setSMTP({ ...smtp, fromEmail: e.target.value })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                      </div>
                      <Input
                        type="email"
                        label="Reply-To Email Address (Optional)"
                        placeholder="support@learnandgrow.io"
                        value={smtp.replyTo}
                        onChange={(e) => setSMTP({ ...smtp, replyTo: e.target.value })}
                        variant="bordered"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        color="primary"
                        onPress={handleSMTPSave}
                        isLoading={smtpSaving}
                        size="lg"
                        className="font-bold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-8"
                      >
                        {smtpSaving ? "Saving Configuration..." : "Save SMTP Configuration"}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Live Test Console */}
                  <div className="lg:col-span-1">
                    <Card className="bg-gradient-to-br from-slate-50 to-blue-50/60 border border-blue-100 shadow-sm rounded-2xl lg:sticky lg:top-6">
                      <CardBody className="p-5 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-blue-100">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          <h3 className="font-bold text-slate-800 text-base">Relay Diagnostic Test</h3>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          Transmit an authenticated test email to prove your credentials, port, and sender reputation before saving changes.
                        </p>

                        <div className="space-y-3">
                          <Input
                            type="email"
                            label="Target Recipient Email"
                            placeholder="yourname@gmail.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            variant="flat"
                            classNames={{
                              inputWrapper: "bg-white border border-slate-200 rounded-xl",
                            }}
                          />
                          <Button
                            color="secondary"
                            variant="flat"
                            onPress={handleTestSMTP}
                            isLoading={smtpTesting}
                            fullWidth
                            startContent={<Send className="w-4 h-4" />}
                            className="font-bold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 rounded-xl min-h-[44px]"
                          >
                            {smtpTesting ? "Transmitting..." : "Send Verification Email"}
                          </Button>
                        </div>

                        <div className="pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 space-y-1.5">
                          <p className="font-bold text-slate-700">Verification Tips:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>For Gmail, generate an <strong>App Password</strong> in Google Account Security.</li>
                            <li>Ensure DNS records (SPF, DKIM) authorize your sending IP.</li>
                            <li>Port 465 requires SSL checked; Port 587 requires TLS.</li>
                          </ul>
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </Tab>

          {/* TAB 3: Database Backup (RBAC Protected) */}
          <Tab
            key="backup"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2 py-1">
                <Database className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Database Backup</span>
                {!isSuperAdmin ? (
                  <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
                    Admin Only
                  </span>
                ) : (
                  <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    MongoDB
                  </span>
                )}
              </div>
            }
          >
            <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                <div className="p-3 bg-amber-100/70 text-amber-600 rounded-2xl border border-amber-200">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Disaster Recovery & Database Export
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Full raw MongoDB collection dump and compressed archive download for off-site backups.
                  </p>
                </div>
              </div>

              {/* RBAC Gate: Manager Restriction Card */}
              {!isSuperAdmin ? (
                <div className="p-6 md:p-8 rounded-[24px] bg-gradient-to-br from-rose-50/70 via-amber-50/50 to-orange-50/60 border-2 border-rose-200/80 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center border-2 border-rose-300">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="max-w-lg mx-auto">
                    <h3 className="text-lg font-bold text-rose-950 mb-1">
                      Super Administrator Clearance Required
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      You are signed in as <strong>{userName || "Operations Manager"}</strong> (Role: <code className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded text-xs">manager</code>). Raw database dumps contain sensitive student Personally Identifiable Information (PII), password hashes, billing logs, and API credentials.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-200 text-xs font-semibold text-rose-800 shadow-sm">
                    <ShieldAlert className="w-4 h-4 text-rose-500" />
                    Direct export capability is restricted to Super Admins.
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Security Clearance Alert */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-2xl border border-amber-200 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                      <strong className="font-bold">Privileged Operation:</strong> Initiating an export collects all MongoDB collections (Users, Courses, Orders, Mentors, Blogs, and Settings) and bundles them into an encrypted gzip archive. Keep downloaded archives stored in access-controlled environments.
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-slate-800">100% Complete Snapshot</p>
                        <p className="text-xs text-slate-500 mt-0.5">Exports every collection with full document schemas and metadata.</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-slate-800">Streamed Archive</p>
                        <p className="text-xs text-slate-500 mt-0.5">Streamed directly as a compressed .tar.gz file for rapid storage.</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-slate-800">Automatic Storage Cleanup</p>
                        <p className="text-xs text-slate-500 mt-0.5">Backend server auto-purges temporary server archives older than 7 days.</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm text-slate-800">JWT Authenticated</p>
                        <p className="text-xs text-slate-500 mt-0.5">Requires verified Super Admin Bearer Token to authorize transmission.</p>
                      </div>
                    </div>
                  </div>

                  {/* Last Backup Record */}
                  {lastBackupTime && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm text-emerald-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span><strong>Last Successful Export:</strong> {lastBackupTime}</span>
                      </div>
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg text-xs">
                        Verified
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    <Button
                      color="warning"
                      size="lg"
                      onPress={handleBackupDatabase}
                      isLoading={backupLoading}
                      disabled={backupLoading}
                      startContent={backupLoading ? null : <Download className="w-5 h-5" />}
                      className="font-bold shadow-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl px-8"
                    >
                      {backupLoading ? "Extracting & Compressing Database..." : "Generate & Download Database Backup"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Tab>

          {/* TAB 4: Server-Side Tracking & Conversions API */}
          <Tab
            key="tracking"
            title={
              <div className="flex items-center gap-1.5 sm:gap-2 py-1">
                <Activity className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">Server-Side & CAPI</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
            }
          >
            <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100/70 text-emerald-600 rounded-2xl border border-emerald-200 shrink-0">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                        Server-Side Tracking & Conversions API (CAPI)
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Server Deduplication
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Direct server-to-server dispatch for Meta (Facebook/Instagram/WhatsApp), TikTok, GA4, and LinkedIn with SHA-256 deduplication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Jump / Status Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <a
                  href="#meta-capi"
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all hover:shadow-sm ${
                    tracking.metaPixelId && tracking.metaAccessToken
                      ? "bg-blue-50/70 border-blue-200 hover:border-blue-300"
                      : "bg-slate-50 border-slate-200 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-xs shrink-0">f</div>
                    <span className="font-bold text-xs text-slate-800">Meta CAPI</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tracking.metaEnabled && tracking.metaPixelId
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {tracking.metaEnabled && tracking.metaPixelId ? "Active" : "Inactive"}
                  </span>
                </a>

                <a
                  href="#tiktok-capi"
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all hover:shadow-sm ${
                    tracking.tiktokPixelId && tracking.tiktokAccessToken
                      ? "bg-slate-100/80 border-slate-300 hover:border-slate-400"
                      : "bg-slate-50 border-slate-200 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px] shrink-0">TT</div>
                    <span className="font-bold text-xs text-slate-800">TikTok CAPI</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tracking.tiktokEnabled && tracking.tiktokPixelId
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {tracking.tiktokEnabled && tracking.tiktokPixelId ? "Active" : "Inactive"}
                  </span>
                </a>

                <a
                  href="#ga4-capi"
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all hover:shadow-sm ${
                    tracking.ga4MeasurementId
                      ? "bg-amber-50/70 border-amber-200 hover:border-amber-300"
                      : "bg-slate-50 border-slate-200 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-xs shrink-0">G</div>
                    <span className="font-bold text-xs text-slate-800">Google GA4</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tracking.googleEnabled && tracking.ga4MeasurementId
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {tracking.googleEnabled && tracking.ga4MeasurementId ? "Active" : "Inactive"}
                  </span>
                </a>

                <a
                  href="#linkedin-capi"
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all hover:shadow-sm ${
                    tracking.linkedinPartnerId && tracking.linkedinAccessToken
                      ? "bg-sky-50/70 border-sky-200 hover:border-sky-300"
                      : "bg-slate-50 border-slate-200 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#0A66C2] text-white flex items-center justify-center font-bold text-[10px] shrink-0">in</div>
                    <span className="font-bold text-xs text-slate-800">LinkedIn</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tracking.linkedinEnabled && tracking.linkedinPartnerId
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {tracking.linkedinEnabled && tracking.linkedinPartnerId ? "Active" : "Inactive"}
                  </span>
                </a>
              </div>

              {trackingLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" color="primary" />
                  <p className="text-xs text-slate-500 font-medium">Connecting to advertising credentials vault...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Master Switch Banner */}
                  <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 p-5 rounded-2xl border border-blue-200/80 flex items-center justify-between shadow-sm">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Radio className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-slate-900 text-base">Global Server Dispatch Engine</h3>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        When enabled, every Course Purchase, Kit Order, and Event Registration is asynchronously relayed from your backend with hashed user data (`em`, `ph`, `client_ip`, `user_agent`) to recover 30-40% of conversions lost to iOS privacy & ad blockers.
                      </p>
                    </div>
                    <Checkbox
                      isSelected={tracking.isEnabled}
                      onValueChange={(val) => setTracking({ ...tracking, isEnabled: val })}
                      size="lg"
                      color="primary"
                    />
                  </div>

                  {/* 1. META / FACEBOOK CAPI */}
                  <Card id="meta-capi" className="scroll-mt-6 border-2 border-blue-100/80 shadow-sm rounded-2xl overflow-hidden hover:border-blue-300 transition-all">
                    <CardBody className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md">
                            <span className="font-black text-lg">f</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-base">
                                Meta Conversions API (CAPI) & Pixel
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  tracking.metaPixelId && tracking.metaAccessToken
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {tracking.metaPixelId && tracking.metaAccessToken ? "● Configured" : "○ Incomplete"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Facebook, Instagram & Click-to-WhatsApp Ads with Event Deduplication
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          isSelected={tracking.metaEnabled}
                          onValueChange={(val) => setTracking({ ...tracking, metaEnabled: val })}
                          color="primary"
                        >
                          <span className="text-xs font-bold text-slate-700">Active</span>
                        </Checkbox>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Meta Pixel ID"
                          placeholder="e.g. 123456789012345"
                          value={tracking.metaPixelId}
                          onChange={(e) => setTracking({ ...tracking, metaPixelId: e.target.value.trim() })}
                          variant="bordered"
                          endContent={
                            tracking.metaPixelId && (
                              <button
                                type="button"
                                onClick={() => handleCopy(tracking.metaPixelId, "Meta Pixel ID")}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                {copiedKey === "Meta Pixel ID" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )
                          }
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                        <Input
                          label="Test Event Code (Optional for Live Testing)"
                          placeholder="e.g. TEST12345 (from Events Manager)"
                          value={tracking.metaTestEventCode}
                          onChange={(e) => setTracking({ ...tracking, metaTestEventCode: e.target.value.trim() })}
                          variant="bordered"
                          description="Found in Events Manager > Test events tab"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                      </div>

                      <Input
                        type={showMetaToken ? "text" : "password"}
                        label="Meta CAPI Access Token (Long-Lived System User Token)"
                        placeholder="EAAB..."
                        value={tracking.metaAccessToken}
                        onChange={(e) => setTracking({ ...tracking, metaAccessToken: e.target.value.trim() })}
                        variant="bordered"
                        startContent={<KeyRound className="w-4 h-4 text-blue-500" />}
                        endContent={
                          <div className="flex items-center gap-1.5">
                            {tracking.metaAccessToken && (
                              <button
                                type="button"
                                onClick={() => handleCopy(tracking.metaAccessToken, "Meta Token")}
                                className="text-slate-400 hover:text-slate-600 p-1"
                                title="Copy Access Token"
                              >
                                {copiedKey === "Meta Token" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowMetaToken(!showMetaToken)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                              title={showMetaToken ? "Mask Token" : "Reveal Token"}
                            >
                              {showMetaToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        }
                        description="Generated in Meta Events Manager > Settings > Conversions API > Set up manually > Generate access token"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl font-mono text-xs" }}
                      />
                    </CardBody>
                  </Card>

                  {/* 2. TIKTOK EVENTS API */}
                  <Card id="tiktok-capi" className="scroll-mt-6 border-2 border-slate-200 shadow-sm rounded-2xl overflow-hidden hover:border-slate-400 transition-all">
                    <CardBody className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white shadow-md">
                            <span className="font-bold text-sm">TT</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-base">
                                TikTok Events API (Server Tracking)
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  tracking.tiktokPixelId && tracking.tiktokAccessToken
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {tracking.tiktokPixelId && tracking.tiktokAccessToken ? "● Configured" : "○ Incomplete"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">Direct Server Events + Pixel Match for TikTok Ads</p>
                          </div>
                        </div>
                        <Checkbox
                          isSelected={tracking.tiktokEnabled}
                          onValueChange={(val) => setTracking({ ...tracking, tiktokEnabled: val })}
                          color="primary"
                        >
                          <span className="text-xs font-bold text-slate-700">Active</span>
                        </Checkbox>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="TikTok Pixel ID (Pixel Code)"
                          placeholder="e.g. C5XXXXXXXXXXXXXXX"
                          value={tracking.tiktokPixelId}
                          onChange={(e) => setTracking({ ...tracking, tiktokPixelId: e.target.value.trim() })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                        <Input
                          label="Test Event Code (Optional)"
                          placeholder="e.g. TEST_CODE"
                          value={tracking.tiktokTestEventCode}
                          onChange={(e) => setTracking({ ...tracking, tiktokTestEventCode: e.target.value.trim() })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                      </div>

                      <Input
                        type={showTikTokToken ? "text" : "password"}
                        label="TikTok Access Token"
                        placeholder="Long-lived API access token"
                        value={tracking.tiktokAccessToken}
                        onChange={(e) => setTracking({ ...tracking, tiktokAccessToken: e.target.value.trim() })}
                        variant="bordered"
                        startContent={<KeyRound className="w-4 h-4 text-slate-700" />}
                        endContent={
                          <div className="flex items-center gap-1.5">
                            {tracking.tiktokAccessToken && (
                              <button
                                type="button"
                                onClick={() => handleCopy(tracking.tiktokAccessToken, "TikTok Token")}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                {copiedKey === "TikTok Token" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowTikTokToken(!showTikTokToken)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              {showTikTokToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        }
                        description="Generated in TikTok Events Manager > Settings > Events API"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl font-mono text-xs" }}
                      />
                    </CardBody>
                  </Card>

                  {/* 3. GOOGLE ANALYTICS 4 & GOOGLE ADS */}
                  <Card id="ga4-capi" className="scroll-mt-6 border-2 border-amber-100/80 shadow-sm rounded-2xl overflow-hidden hover:border-amber-300 transition-all">
                    <CardBody className="p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
                            <span className="font-bold text-sm">G</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-base">
                                Google Analytics 4 & Google Ads Enhanced Conversions
                              </h3>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  tracking.ga4MeasurementId
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {tracking.ga4MeasurementId ? "● Configured" : "○ Incomplete"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">Measurement Protocol v2 + Google Ads Conversion Tracking</p>
                          </div>
                        </div>
                        <Checkbox
                          isSelected={tracking.googleEnabled}
                          onValueChange={(val) => setTracking({ ...tracking, googleEnabled: val })}
                          color="primary"
                        >
                          <span className="text-xs font-bold text-slate-700">Active</span>
                        </Checkbox>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="GA4 Measurement ID"
                          placeholder="G-XXXXXXXXXX"
                          value={tracking.ga4MeasurementId}
                          onChange={(e) => setTracking({ ...tracking, ga4MeasurementId: e.target.value.trim() })}
                          variant="bordered"
                          classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                        />
                        <Input
                          type={showGA4Secret ? "text" : "password"}
                          label="GA4 Measurement Protocol API Secret"
                          placeholder="API Secret String"
                          value={tracking.ga4ApiSecret}
                          onChange={(e) => setTracking({ ...tracking, ga4ApiSecret: e.target.value.trim() })}
                          variant="bordered"
                          startContent={<KeyRound className="w-4 h-4 text-amber-500" />}
                          endContent={
                            <div className="flex items-center gap-1.5">
                              {tracking.ga4ApiSecret && (
                                <button
                                type="button"
                                onClick={() => handleCopy(tracking.ga4ApiSecret, "GA4 Secret")}
                                className="text-slate-400 hover:text-slate-600 p-1"
                              >
                                {copiedKey === "GA4 Secret" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowGA4Secret(!showGA4Secret)}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              {showGA4Secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        }
                        description="GA4 Admin > Data Streams > Web Stream > Measurement Protocol API secrets"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl font-mono text-xs" }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Google Ads Conversion ID (Optional)"
                        placeholder="AW-XXXXXXXXX"
                        value={tracking.googleAdsConversionId}
                        onChange={(e) => setTracking({ ...tracking, googleAdsConversionId: e.target.value.trim() })}
                        variant="bordered"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                      />
                      <Input
                        label="Google Ads Conversion Label (Optional)"
                        placeholder="e.g. AbC-123_xYz"
                        value={tracking.googleAdsConversionLabel}
                        onChange={(e) => setTracking({ ...tracking, googleAdsConversionLabel: e.target.value.trim() })}
                        variant="bordered"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* 4. LINKEDIN CONVERSIONS API */}
                <Card id="linkedin-capi" className="scroll-mt-6 border-2 border-blue-100/60 shadow-sm rounded-2xl overflow-hidden hover:border-blue-300 transition-all">
                  <CardBody className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white shadow-md">
                          <span className="font-black text-sm">in</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">
                              LinkedIn Conversions API & Insight Tag
                            </h3>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                tracking.linkedinPartnerId && tracking.linkedinAccessToken
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {tracking.linkedinPartnerId && tracking.linkedinAccessToken ? "● Configured" : "○ Incomplete"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">B2B Ad Tracking + Server Conversion Events</p>
                        </div>
                      </div>
                      <Checkbox
                        isSelected={tracking.linkedinEnabled}
                        onValueChange={(val) => setTracking({ ...tracking, linkedinEnabled: val })}
                        color="primary"
                      >
                        <span className="text-xs font-bold text-slate-700">Active</span>
                      </Checkbox>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="LinkedIn Partner ID (Insight Tag ID)"
                        placeholder="e.g. 1234567"
                        value={tracking.linkedinPartnerId}
                        onChange={(e) => setTracking({ ...tracking, linkedinPartnerId: e.target.value.trim() })}
                        variant="bordered"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                      />
                      <Input
                        label="LinkedIn Conversion ID / Rule URN"
                        placeholder="e.g. 9876543 (from Campaign Manager)"
                        value={tracking.linkedinConversionId}
                        onChange={(e) => setTracking({ ...tracking, linkedinConversionId: e.target.value.trim() })}
                        variant="bordered"
                        classNames={{ inputWrapper: "border-slate-200 rounded-xl" }}
                      />
                    </div>

                    <Input
                      type={showLinkedInToken ? "text" : "password"}
                      label="LinkedIn OAuth Access Token"
                      placeholder="AQ..."
                      value={tracking.linkedinAccessToken}
                      onChange={(e) => setTracking({ ...tracking, linkedinAccessToken: e.target.value.trim() })}
                      variant="bordered"
                      startContent={<KeyRound className="w-4 h-4 text-[#0A66C2]" />}
                      endContent={
                        <div className="flex items-center gap-1.5">
                          {tracking.linkedinAccessToken && (
                            <button
                              type="button"
                              onClick={() => handleCopy(tracking.linkedinAccessToken, "LinkedIn Token")}
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              {copiedKey === "LinkedIn Token" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setShowLinkedInToken(!showLinkedInToken)}
                            className="text-slate-400 hover:text-slate-600 p-1"
                          >
                            {showLinkedInToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      }
                      description="Generated via LinkedIn Developer Portal with rw_ads or r_ads permission"
                      classNames={{ inputWrapper: "border-slate-200 rounded-xl font-mono text-xs" }}
                    />
                  </CardBody>
                </Card>

                {/* Live Diagnostic Sandbox Console */}
                <Card className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                  <CardBody className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                        <h4 className="font-bold text-sm tracking-wide text-white uppercase">
                          Live CAPI Event Transmission Sandbox
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">Payload: Lead Event</span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Transmit a simulated test <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-400">Lead</code> event to verify server connectivity and inspect Graph API response codes in real time.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={testPlatform}
                        onChange={(e: any) => setTestPlatform(e.target.value)}
                        className="px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-blue-500"
                      >
                        <option value="all">All Enabled Ad Networks</option>
                        <option value="meta">Meta (Facebook/WhatsApp CAPI) Only</option>
                        <option value="tiktok">⬛ TikTok Events API Only</option>
                        <option value="google">Google Analytics 4 (MP) Only</option>
                        <option value="linkedin">LinkedIn Conversions API Only</option>
                      </select>

                      <Button
                        color="secondary"
                        size="md"
                        onPress={handleTestTracking}
                        isLoading={trackingTesting}
                        disabled={trackingTesting}
                        startContent={trackingTesting ? null : <Send className="w-4 h-4" />}
                        className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-5"
                      >
                        {trackingTesting ? "Transmitting..." : "Send Test Event"}
                      </Button>
                    </div>

                    {testResult && (
                      <div className="mt-3 p-4 bg-black/80 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                          <span>Graph API Response Stream:</span>
                          <span className="text-emerald-400">● 200 OK</span>
                        </div>
                        <pre className="text-[11px] leading-relaxed">{JSON.stringify(testResult, null, 2)}</pre>
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Save Tracking Settings Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    color="primary"
                    size="lg"
                    onPress={handleTrackingSave}
                    isLoading={trackingSaving}
                    disabled={trackingSaving}
                    className="font-bold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl px-8"
                  >
                    {trackingSaving ? "Saving Settings..." : "Save Tracking Settings"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  </div>
);
}
