"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Divider,
  Spinner,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@nextui-org/react";
import {
  Newspaper,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Mail,
  Phone,
  BarChart3,
  FileText,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { useGetSiteContentQuery, useUpdateSiteContentMutation } from "@/redux/api/siteContentApi";
import { defaultPressData, PressData, NewsItem, PressReleaseItem } from "@/lib/pressData";
import toast from "react-hot-toast";

export default function PressManagementTab() {
  const [pressData, setPressData] = useState<PressData>(defaultPressData);
  const [hasChanges, setHasChanges] = useState(false);

  // Modal State for News Story
  const newsModal = useDisclosure();
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<NewsItem>({
    id: "",
    source: "",
    sourceCategory: "national",
    sourceColor: "#1E3A8A",
    sourceBadgeBg: "bg-blue-50",
    sourceBadgeBorder: "border-blue-200",
    sourceBadgeText: "text-blue-800",
    dateEn: "",
    dateBn: "",
    titleEn: "",
    titleBn: "",
    summaryEn: "",
    summaryBn: "",
    link: "",
    readTimeEn: "4 min read",
    readTimeBn: "৪ মিনিট পাঠ",
  });

  // Modal State for Press Release
  const prModal = useDisclosure();
  const [editingPR, setEditingPR] = useState<PressReleaseItem | null>(null);
  const [prForm, setPrForm] = useState<PressReleaseItem>({
    id: "",
    dateEn: "",
    dateBn: "",
    tagEn: "Platform Update",
    tagBn: "প্ল্যাটফর্ম আপডেট",
    titleEn: "",
    titleBn: "",
    excerptEn: "",
    excerptBn: "",
  });

  const { data: apiData, isLoading } = useGetSiteContentQuery("press");
  const [updateContent, { isLoading: isSaving }] = useUpdateSiteContentMutation();

  // Load content from API
  useEffect(() => {
    if (apiData?.data?.content && typeof apiData.data.content === "object") {
      const remote = apiData.data.content;
      setPressData({
        hero: {
          tagEn: remote.hero?.tagEn || defaultPressData.hero.tagEn,
          tagBn: remote.hero?.tagBn || defaultPressData.hero.tagBn,
          titleEn: remote.hero?.titleEn || defaultPressData.hero.titleEn,
          titleBn: remote.hero?.titleBn || defaultPressData.hero.titleBn,
          subtitleEn: remote.hero?.subtitleEn || defaultPressData.hero.subtitleEn,
          subtitleBn: remote.hero?.subtitleBn || defaultPressData.hero.subtitleBn,
          metrics: {
            mediaStoriesEn: remote.hero?.metrics?.mediaStoriesEn || defaultPressData.hero.metrics.mediaStoriesEn,
            mediaStoriesBn: remote.hero?.metrics?.mediaStoriesBn || defaultPressData.hero.metrics.mediaStoriesBn,
            batchSizeEn: remote.hero?.metrics?.batchSizeEn || defaultPressData.hero.metrics.batchSizeEn,
            batchSizeBn: remote.hero?.metrics?.batchSizeBn || defaultPressData.hero.metrics.batchSizeBn,
            practicalLabEn: remote.hero?.metrics?.practicalLabEn || defaultPressData.hero.metrics.practicalLabEn,
            practicalLabBn: remote.hero?.metrics?.practicalLabBn || defaultPressData.hero.metrics.practicalLabBn,
            nationwideReachEn: remote.hero?.metrics?.nationwideReachEn || defaultPressData.hero.metrics.nationwideReachEn,
            nationwideReachBn: remote.hero?.metrics?.nationwideReachBn || defaultPressData.hero.metrics.nationwideReachBn,
          },
        },
        newsCoverage: Array.isArray(remote.newsCoverage) && remote.newsCoverage.length > 0 
          ? remote.newsCoverage 
          : defaultPressData.newsCoverage,
        pressReleases: Array.isArray(remote.pressReleases) && remote.pressReleases.length > 0 
          ? remote.pressReleases 
          : defaultPressData.pressReleases,
        mediaContact: {
          email: remote.mediaContact?.email || defaultPressData.mediaContact.email,
          whatsapp: remote.mediaContact?.whatsapp || defaultPressData.mediaContact.whatsapp,
          phone: remote.mediaContact?.phone || defaultPressData.mediaContact.phone,
        },
      });
      setHasChanges(false);
    }
  }, [apiData]);

  const handleSave = async () => {
    try {
      await updateContent({
        page: "press",
        content: pressData,
      }).unwrap();
      toast.success("প্রেস ও মিডিয়া পেজ সফলভাবে সংরক্ষণ করা হয়েছে!");
      setHasChanges(false);
    } catch (err: any) {
      console.error("Failed to update press content:", err);
      toast.error(err?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
    }
  };

  const handleReset = () => {
    if (confirm("আপনি কি নিশ্চিত যে সকল পরিবর্তন বাতিল করে ডিফল্ট কনটেন্টে ফিরে যেতে চান?")) {
      setPressData(defaultPressData);
      setHasChanges(true);
      toast.success("ডিফল্ট ডেটা লোড করা হয়েছে। ডেটাবেজে সংরক্ষণ করতে 'Save Changes' বাটনে ক্লিক করুন।");
    }
  };

  // News Stories handlers
  const openAddNews = () => {
    setEditingNews(null);
    setNewsForm({
      id: "news-" + Date.now(),
      source: "",
      sourceCategory: "national",
      sourceColor: "#1E3A8A",
      sourceBadgeBg: "bg-blue-50",
      sourceBadgeBorder: "border-blue-200",
      sourceBadgeText: "text-blue-800",
      dateEn: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      dateBn: "",
      titleEn: "",
      titleBn: "",
      summaryEn: "",
      summaryBn: "",
      link: "https://",
      readTimeEn: "4 min read",
      readTimeBn: "৪ মিনিট পাঠ",
    });
    newsModal.onOpen();
  };

  const openEditNews = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({ ...item });
    newsModal.onOpen();
  };

  const saveNewsItem = () => {
    if (!newsForm.source || (!newsForm.titleEn && !newsForm.titleBn)) {
      toast.error("অনুগ্রহ করে মিডিয়া সোর্স এবং শিরোনাম পূরণ করুন।");
      return;
    }

    let updatedNews: NewsItem[];
    if (editingNews) {
      updatedNews = pressData.newsCoverage.map((n) => (n.id === editingNews.id ? newsForm : n));
    } else {
      updatedNews = [newsForm, ...pressData.newsCoverage];
    }

    setPressData({ ...pressData, newsCoverage: updatedNews });
    setHasChanges(true);
    newsModal.onClose();
    toast.success(editingNews ? "সংবাদ আপডেট করা হয়েছে।" : "নতুন সংবাদ যুক্ত করা হয়েছে।");
  };

  const deleteNewsItem = (id: string) => {
    if (confirm("এই সংবাদ প্রতিবেদনটি মুছে ফেলতে চান?")) {
      const updated = pressData.newsCoverage.filter((n) => n.id !== id);
      setPressData({ ...pressData, newsCoverage: updated });
      setHasChanges(true);
      toast.success("সংবাদ মুছে ফেলা হয়েছে।");
    }
  };

  // Press Release handlers
  const openAddPR = () => {
    setEditingPR(null);
    setPrForm({
      id: "pr-" + Date.now(),
      dateEn: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      dateBn: "",
      tagEn: "Official Statement",
      tagBn: "অফিসিয়াল ঘোষণা",
      titleEn: "",
      titleBn: "",
      excerptEn: "",
      excerptBn: "",
    });
    prModal.onOpen();
  };

  const openEditPR = (item: PressReleaseItem) => {
    setEditingPR(item);
    setPrForm({ ...item });
    prModal.onOpen();
  };

  const savePRItem = () => {
    if (!prForm.titleEn && !prForm.titleBn) {
      toast.error("অনুগ্রহ করে প্রেস রিলিজের শিরোনাম পূরণ করুন।");
      return;
    }

    let updatedPRs: PressReleaseItem[];
    if (editingPR) {
      updatedPRs = pressData.pressReleases.map((p) => (p.id === editingPR.id ? prForm : p));
    } else {
      updatedPRs = [prForm, ...pressData.pressReleases];
    }

    setPressData({ ...pressData, pressReleases: updatedPRs });
    setHasChanges(true);
    prModal.onClose();
    toast.success(editingPR ? "প্রেস রিলিজ আপডেট করা হয়েছে।" : "নতুন প্রেস রিলিজ যুক্ত করা হয়েছে।");
  };

  const deletePRItem = (id: string) => {
    if (confirm("এই প্রেস রিলিজটি মুছে ফেলতে চান?")) {
      const updated = pressData.pressReleases.filter((p) => p.id !== id);
      setPressData({ ...pressData, pressReleases: updated });
      setHasChanges(true);
      toast.success("প্রেস রিলিজ মুছে ফেলা হয়েছে।");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="প্রেস কনটেন্ট লোড হচ্ছে..." color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#2C2C2C]">
                প্রেস ও মিডিয়া পেজ পরিচালনা
              </h2>
              {hasChanges && (
                <Chip size="sm" color="warning" variant="flat" className="font-bold text-[10px]">
                  Unsaved Changes
                </Chip>
              )}
            </div>
            <p className="text-xs text-slate-500">
              পাবলিক পেজ (/press) এর সংবাদ, প্রেস রিলিজ, পরিসংখ্যান ও মিডিয়া ডেস্ক আপডেট করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            as="a"
            href="/press"
            target="_blank"
            variant="bordered"
            size="sm"
            className="font-bold text-xs rounded-xl border-slate-200 text-slate-700"
            startContent={<ExternalLink className="w-3.5 h-3.5" />}
          >
            লাইভ পেজ দেখুন
          </Button>

          <Button
            variant="flat"
            color="default"
            size="sm"
            className="font-bold text-xs rounded-xl"
            onPress={handleReset}
            startContent={<RotateCcw className="w-3.5 h-3.5" />}
          >
            ডিফল্ট লোড করুন
          </Button>

          <Button
            color="primary"
            size="sm"
            className="font-bold text-xs rounded-xl shadow-md shadow-blue-500/25 bg-blue-600 text-white"
            onPress={handleSave}
            isLoading={isSaving}
            startContent={!isSaving && <Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* 1. Hero Banner & Key Metrics */}
      <Card className="rounded-[24px] border border-slate-200/80 shadow-xs bg-white">
        <CardBody className="p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Radio className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-base text-[#2C2C2C]">
              ১. হিরো ব্যানার ও মূল বার্তা (Hero Section)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="টপ ব্যাজ (বাংলা)"
              placeholder="প্রেস ও মিডিয়া হাব"
              value={pressData.hero.tagBn}
              onChange={(e) => {
                setPressData({ ...pressData, hero: { ...pressData.hero, tagBn: e.target.value } });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
            />
            <Input
              label="Top Badge (English)"
              placeholder="Press & Media Center"
              value={pressData.hero.tagEn}
              onChange={(e) => {
                setPressData({ ...pressData, hero: { ...pressData.hero, tagEn: e.target.value } });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="প্রধান শিরোনাম (বাংলা)"
              placeholder="আমাদের উদ্ভাবনী যাত্রা ও গণমাধ্যম প্রকাশনা"
              value={pressData.hero.titleBn}
              onChange={(e) => {
                setPressData({ ...pressData, hero: { ...pressData.hero, titleBn: e.target.value } });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
            />
            <Input
              label="Main Headline (English)"
              placeholder="Shaping the Next Wave of STEM Innovators"
              value={pressData.hero.titleEn}
              onChange={(e) => {
                setPressData({ ...pressData, hero: { ...pressData.hero, titleEn: e.target.value } });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="সাব-শিরোনাম বা বিবরণ (বাংলা)"
              placeholder="Learn & Grow-এর সর্বশেষ সাফল্য, প্রতিবেদন এবং মিডিয়া সেন্টার..."
              value={pressData.hero.subtitleBn}
              onChange={(e) => {
                setPressData({ ...pressData, hero: { ...pressData.hero, subtitleBn: e.target.value } });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
              minRows={2}
            />
            <Textarea
              label="Subtitle / Description (English)"
              placeholder="Read the latest news coverage, official press releases..."
              value={pressData.hero.subtitleEn}
              onChange={(e) => {
                setPressData({ ...pressData, hero: { ...pressData.hero, subtitleEn: e.target.value } });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
              minRows={2}
            />
          </div>

          {/* 4 Metrics Box */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                ব্যানার পরিসংখ্যান (Key Metrics)
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <Input
                  label="মিডিয়া স্টোরিজ (BN)"
                  value={pressData.hero.metrics.mediaStoriesBn}
                  onChange={(e) => {
                    setPressData({
                      ...pressData,
                      hero: {
                        ...pressData.hero,
                        metrics: { ...pressData.hero.metrics, mediaStoriesBn: e.target.value },
                      },
                    });
                    setHasChanges(true);
                  }}
                  variant="flat"
                  size="sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <Input
                  label="ব্যাচ সাইজ (BN)"
                  value={pressData.hero.metrics.batchSizeBn}
                  onChange={(e) => {
                    setPressData({
                      ...pressData,
                      hero: {
                        ...pressData.hero,
                        metrics: { ...pressData.hero.metrics, batchSizeBn: e.target.value },
                      },
                    });
                    setHasChanges(true);
                  }}
                  variant="flat"
                  size="sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <Input
                  label="প্র্যাকটিক্যাল ল্যাব (BN)"
                  value={pressData.hero.metrics.practicalLabBn}
                  onChange={(e) => {
                    setPressData({
                      ...pressData,
                      hero: {
                        ...pressData.hero,
                        metrics: { ...pressData.hero.metrics, practicalLabBn: e.target.value },
                      },
                    });
                    setHasChanges(true);
                  }}
                  variant="flat"
                  size="sm"
                />
              </div>

              <div className="p-3 rounded-xl bg-sky-50/60 border border-sky-100">
                <Input
                  label="সারাদেশে ব্যাপ্তি (BN)"
                  value={pressData.hero.metrics.nationwideReachBn}
                  onChange={(e) => {
                    setPressData({
                      ...pressData,
                      hero: {
                        ...pressData.hero,
                        metrics: { ...pressData.hero.metrics, nationwideReachBn: e.target.value },
                      },
                    });
                    setHasChanges(true);
                  }}
                  variant="flat"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 2. News Coverage Manager */}
      <Card className="rounded-[24px] border border-slate-200/80 shadow-xs bg-white">
        <CardBody className="p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-black text-base text-[#2C2C2C]">
                  ২. গণমাধ্যমে সংবাদ প্রতিবেদন (In The News)
                </h3>
                <p className="text-xs text-slate-500">
                  মোট {pressData.newsCoverage.length} টি সংবাদ প্রতিবেদন প্রকাশিত আছে
                </p>
              </div>
            </div>

            <Button
              color="primary"
              size="sm"
              className="font-bold text-xs rounded-xl bg-indigo-600 text-white shadow-xs"
              onPress={openAddNews}
              startContent={<Plus className="w-4 h-4" />}
            >
              নতুন সংবাদ যোগ করুন
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pressData.newsCoverage.map((item, index) => (
              <div
                key={item.id || index}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.source}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.dateBn || item.dateEn}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#2C2C2C] line-clamp-2 mb-2">
                    {item.titleBn || item.titleEn}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {item.summaryBn || item.summaryEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {item.sourceCategory}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-slate-600 hover:text-indigo-600"
                      onPress={() => openEditNews(item)}
                      aria-label="Edit news"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      className="text-rose-500"
                      onPress={() => deleteNewsItem(item.id)}
                      aria-label="Delete news"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 3. Official Press Releases Manager */}
      <Card className="rounded-[24px] border border-slate-200/80 shadow-xs bg-white">
        <CardBody className="p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Newspaper className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-black text-base text-[#2C2C2C]">
                  ৩. অফিসিয়াল প্রেস রিলিজ ও ঘোষণা (Press Releases)
                </h3>
                <p className="text-xs text-slate-500">
                  মোট {pressData.pressReleases.length} টি অফিসিয়াল বিজ্ঞপ্তি রয়েছে
                </p>
              </div>
            </div>

            <Button
              color="secondary"
              size="sm"
              className="font-bold text-xs rounded-xl bg-purple-600 text-white shadow-xs"
              onPress={openAddPR}
              startContent={<Plus className="w-4 h-4" />}
            >
              প্রেস রিলিজ যোগ করুন
            </Button>
          </div>

          <div className="space-y-3">
            {pressData.pressReleases.map((pr, index) => (
              <div
                key={pr.id || index}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                      {pr.tagBn || pr.tagEn}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {pr.dateBn || pr.dateEn}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#2C2C2C]">
                    {pr.titleBn || pr.titleEn}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-1">
                    {pr.excerptBn || pr.excerptEn}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="flat"
                    className="text-xs font-bold rounded-lg"
                    onPress={() => openEditPR(pr)}
                    startContent={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    এডিট
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => deletePRItem(pr.id)}
                    aria-label="Delete press release"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 4. Media Contact Desk */}
      <Card className="rounded-[24px] border border-slate-200/80 shadow-xs bg-white">
        <CardBody className="p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Mail className="w-5 h-5 text-emerald-600" />
            <h3 className="font-black text-base text-[#2C2C2C]">
              ৪. মিডিয়া যোগাযোগ ও জনসংযোগ ডেস্ক (Media Relations Contact)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="প্রেস ইমেইল (Press Inquiries Email)"
              placeholder="press@learn-grow.com"
              value={pressData.mediaContact.email}
              onChange={(e) => {
                setPressData({
                  ...pressData,
                  mediaContact: { ...pressData.mediaContact, email: e.target.value },
                });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
              startContent={<Mail className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="মিডিয়া হোয়াটসঅ্যাপ লিংক বা নম্বর"
              placeholder="https://wa.me/8801810184511"
              value={pressData.mediaContact.whatsapp}
              onChange={(e) => {
                setPressData({
                  ...pressData,
                  mediaContact: { ...pressData.mediaContact, whatsapp: e.target.value },
                });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
              startContent={<Phone className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="ফোন নম্বর (Media Desk Phone)"
              placeholder="+8801810184511"
              value={pressData.mediaContact.phone}
              onChange={(e) => {
                setPressData({
                  ...pressData,
                  mediaContact: { ...pressData.mediaContact, phone: e.target.value },
                });
                setHasChanges(true);
              }}
              variant="bordered"
              size="sm"
              startContent={<Phone className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </CardBody>
      </Card>

      {/* News Modal */}
      <Modal isOpen={newsModal.isOpen} onClose={newsModal.onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-bold text-lg text-[#2C2C2C]">
                {editingNews ? "সংবাদ প্রতিবেদন এডিট করুন" : "নতুন সংবাদ প্রতিবেদন যোগ করুন"}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="মিডিয়া সোর্স (যেমন: The Daily Star)"
                    value={newsForm.source}
                    onChange={(e) => setNewsForm({ ...newsForm, source: e.target.value })}
                    variant="bordered"
                    size="sm"
                    isRequired
                  />
                  <Select
                    label="ক্যাটাগরি"
                    selectedKeys={[newsForm.sourceCategory]}
                    onChange={(e) => setNewsForm({ ...newsForm, sourceCategory: e.target.value as any })}
                    variant="bordered"
                    size="sm"
                  >
                    <SelectItem key="national" value="national">National Press (জাতীয়)</SelectItem>
                    <SelectItem key="tech" value="tech">Tech & Global (প্রযুক্তি)</SelectItem>
                    <SelectItem key="feature" value="feature">In-Depth Feature (ফিচার)</SelectItem>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="তারিখ (বাংলা)"
                    placeholder="১০ অক্টোবর, ২০২৬"
                    value={newsForm.dateBn}
                    onChange={(e) => setNewsForm({ ...newsForm, dateBn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Date (English)"
                    placeholder="October 10, 2026"
                    value={newsForm.dateEn}
                    onChange={(e) => setNewsForm({ ...newsForm, dateEn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                </div>

                <Input
                  label="প্রতিবেদন শিরোনাম (বাংলা)"
                  value={newsForm.titleBn}
                  onChange={(e) => setNewsForm({ ...newsForm, titleBn: e.target.value })}
                  variant="bordered"
                  size="sm"
                />

                <Input
                  label="Headline (English)"
                  value={newsForm.titleEn}
                  onChange={(e) => setNewsForm({ ...newsForm, titleEn: e.target.value })}
                  variant="bordered"
                  size="sm"
                />

                <Textarea
                  label="সংক্ষিপ্ত সারসংক্ষেপ (বাংলা)"
                  value={newsForm.summaryBn}
                  onChange={(e) => setNewsForm({ ...newsForm, summaryBn: e.target.value })}
                  variant="bordered"
                  size="sm"
                  minRows={2}
                />

                <Textarea
                  label="Summary Excerpt (English)"
                  value={newsForm.summaryEn}
                  onChange={(e) => setNewsForm({ ...newsForm, summaryEn: e.target.value })}
                  variant="bordered"
                  size="sm"
                  minRows={2}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="মূল সংবাদের লিংক (URL)"
                    placeholder="https://..."
                    value={newsForm.link}
                    onChange={(e) => setNewsForm({ ...newsForm, link: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="পড়ার সময় (Read Time)"
                    placeholder="৪ মিনিট পাঠ / 4 min read"
                    value={newsForm.readTimeBn}
                    onChange={(e) => setNewsForm({ ...newsForm, readTimeBn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" size="sm" onPress={onClose}>
                  বাতিল
                </Button>
                <Button color="primary" size="sm" className="font-bold bg-indigo-600" onPress={saveNewsItem}>
                  সংরক্ষণ করুন
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Press Release Modal */}
      <Modal isOpen={prModal.isOpen} onClose={prModal.onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-bold text-lg text-[#2C2C2C]">
                {editingPR ? "প্রেস রিলিজ এডিট করুন" : "নতুন প্রেস রিলিজ তৈরি করুন"}
              </ModalHeader>
              <ModalBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="ট্যাগ বা ধরন (বাংলা)"
                    placeholder="নতুন কারিকুলাম / প্ল্যাটফর্ম মাইলফলক"
                    value={prForm.tagBn}
                    onChange={(e) => setPrForm({ ...prForm, tagBn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Tag / Topic (English)"
                    placeholder="Curriculum Launch / Platform Milestone"
                    value={prForm.tagEn}
                    onChange={(e) => setPrForm({ ...prForm, tagEn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="তারিখ (বাংলা)"
                    placeholder="০১ নভেম্বর, ২০২৬"
                    value={prForm.dateBn}
                    onChange={(e) => setPrForm({ ...prForm, dateBn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                  <Input
                    label="Date (English)"
                    placeholder="November 01, 2026"
                    value={prForm.dateEn}
                    onChange={(e) => setPrForm({ ...prForm, dateEn: e.target.value })}
                    variant="bordered"
                    size="sm"
                  />
                </div>

                <Input
                  label="প্রেস রিলিজ শিরোনাম (বাংলা)"
                  value={prForm.titleBn}
                  onChange={(e) => setPrForm({ ...prForm, titleBn: e.target.value })}
                  variant="bordered"
                  size="sm"
                />

                <Input
                  label="Press Release Title (English)"
                  value={prForm.titleEn}
                  onChange={(e) => setPrForm({ ...prForm, titleEn: e.target.value })}
                  variant="bordered"
                  size="sm"
                />

                <Textarea
                  label="বিজ্ঞপ্তির মূল অংশ (বাংলা)"
                  value={prForm.excerptBn}
                  onChange={(e) => setPrForm({ ...prForm, excerptBn: e.target.value })}
                  variant="bordered"
                  size="sm"
                  minRows={3}
                />

                <Textarea
                  label="Official Statement Excerpt (English)"
                  value={prForm.excerptEn}
                  onChange={(e) => setPrForm({ ...prForm, excerptEn: e.target.value })}
                  variant="bordered"
                  size="sm"
                  minRows={3}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" size="sm" onPress={onClose}>
                  বাতিল
                </Button>
                <Button color="secondary" size="sm" className="font-bold bg-purple-600 text-white" onPress={savePRItem}>
                  সংরক্ষণ করুন
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
