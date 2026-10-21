"use client";

import  { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Divider,
  Spinner,
  Alert,
} from "@nextui-org/react";
import { FaSave, FaUndo, FaPlus, FaTrash } from "react-icons/fa";
import { useGetSiteContentQuery, useUpdateSiteContentMutation } from "@/redux/api/siteContentApi";
import { defaultAboutData } from "@/lib/aboutData";
import toast from "react-hot-toast";

/**
 * The shape of the About page content.
 *
 * Derived from the shipped defaults so the admin editor and the public
 * `AboutClient` can never drift apart. The content is bilingual: every
 * editable text field has an `...En` and a `...Bn` variant.
 */
type AboutData = typeof defaultAboutData;

export default function AboutPageTab() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultAboutData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: apiData, isLoading } = useGetSiteContentQuery("about");
  const [updateContent] = useUpdateSiteContentMutation();

  // Load content from API
  useEffect(() => {
    if (apiData?.data?.content && typeof apiData.data.content === "object") {
      // Create a deep copy to avoid read-only issues
      const content = JSON.parse(JSON.stringify(apiData.data.content));
      // Ensure the pillar array has the proper structure
      if (content.pillars && Array.isArray(content.pillars)) {
        content.pillars = content.pillars.map((p: any) => ({
          icon: p.icon || "",
          titleEn: p.titleEn || "",
          titleBn: p.titleBn || "",
          descEn: p.descEn || p.desc || "",
          descBn: p.descBn || "",
          color: p.color || "blue",
        }));
      }
      setAboutData(content);
      setHasChanges(false);
    }
  }, [apiData]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateContent({
        page: "about",
        content: aboutData,
      }).unwrap();
      toast.success("About page updated successfully!");
      setHasChanges(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Reset to default content?")) {
      setAboutData(defaultAboutData);
      setHasChanges(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner label="Loading About page content..." color="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert for changes */}
      {hasChanges && (
        <Alert color="warning" title="You have unsaved changes" />
      )}

      {/* Hero Section */}
      <Card className="shadow-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-orange-700">Hero Section</h2>
          <div className="space-y-4">
            <Input
              label="Hero Title (English)"
              placeholder="Enter hero title"
              value={aboutData.hero.titleEn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  hero: { ...aboutData.hero, titleEn: e.target.value },
                });
                setHasChanges(true);
              }}
              size="lg"
              variant="bordered"
            />
            <Input
              label="Hero Title (Bangla)"
              placeholder="Enter hero title"
              value={aboutData.hero.titleBn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  hero: { ...aboutData.hero, titleBn: e.target.value },
                });
                setHasChanges(true);
              }}
              size="lg"
              variant="bordered"
            />
            <Textarea
              label="Hero Subtitle (English)"
              placeholder="Enter hero subtitle"
              value={aboutData.hero.subtitleEn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  hero: { ...aboutData.hero, subtitleEn: e.target.value },
                });
                setHasChanges(true);
              }}
              minRows={2}
              variant="bordered"
            />
            <Textarea
              label="Hero Subtitle (Bangla)"
              placeholder="Enter hero subtitle"
              value={aboutData.hero.subtitleBn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  hero: { ...aboutData.hero, subtitleBn: e.target.value },
                });
                setHasChanges(true);
              }}
              minRows={2}
              variant="bordered"
            />
          </div>
        </CardBody>
      </Card>

      {/* Story Section */}
      <Card className="shadow-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Our Story</h2>
          <div className="space-y-4">
            <Input
              label="Story Title (English)"
              placeholder="Enter story title"
              value={aboutData.story.titleEn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, titleEn: e.target.value },
                });
                setHasChanges(true);
              }}
              size="lg"
              variant="bordered"
            />
            <Input
              label="Story Title (Bangla)"
              placeholder="Enter story title"
              value={aboutData.story.titleBn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, titleBn: e.target.value },
                });
                setHasChanges(true);
              }}
              size="lg"
              variant="bordered"
            />
            <Input
              label="Story Image URL"
              placeholder="https://example.com/image.jpg"
              value={aboutData.story.image}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, image: e.target.value },
                });
                setHasChanges(true);
              }}
              size="lg"
              variant="bordered"
            />
            <Textarea
              label="Story Paragraph 1 (English)"
              placeholder="Enter first paragraph"
              value={aboutData.story.p1En}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, p1En: e.target.value },
                });
                setHasChanges(true);
              }}
              minRows={3}
              variant="bordered"
            />
            <Textarea
              label="Story Paragraph 1 (Bangla)"
              placeholder="Enter first paragraph"
              value={aboutData.story.p1Bn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, p1Bn: e.target.value },
                });
                setHasChanges(true);
              }}
              minRows={3}
              variant="bordered"
            />
            <Textarea
              label="Story Paragraph 2 (English)"
              placeholder="Enter second paragraph"
              value={aboutData.story.p2En}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, p2En: e.target.value },
                });
                setHasChanges(true);
              }}
              minRows={3}
              variant="bordered"
            />
            <Textarea
              label="Story Paragraph 2 (Bangla)"
              placeholder="Enter second paragraph"
              value={aboutData.story.p2Bn}
              onChange={(e) => {
                setAboutData({
                  ...aboutData,
                  story: { ...aboutData.story, p2Bn: e.target.value },
                });
                setHasChanges(true);
              }}
              minRows={3}
              variant="bordered"
            />
          </div>
        </CardBody>
      </Card>

      {/* Pillars / Features Section */}
      <Card className="shadow-lg border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-700">Learning Tracks</h2>
            <Button
              isIconOnly
              color="success"
              variant="flat"
              startContent={<FaPlus />}
              onPress={() => {
                setAboutData({
                  ...aboutData,
                  pillars: [
                    ...aboutData.pillars,
                    {
                      icon: "",
                      titleEn: "",
                      titleBn: "",
                      descEn: "",
                      descBn: "",
                      color: "blue",
                    },
                  ],
                });
                setHasChanges(true);
              }}
              title="Add new track"
            />
          </div>

          <div className="space-y-4">
            {aboutData.pillars.map((pillar, index) => (
              <div key={index}>
                <Card className="bg-white border border-gray-200 hover:border-green-300 transition-colors">
                  <CardBody className="p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1 space-y-3 min-w-0">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Icon/Emoji</label>
                          <Input
                            placeholder="(paste icon code or text)"
                            value={pillar.icon}
                            onChange={(e) => {
                              const newPillars = [...aboutData.pillars];
                              newPillars[index] = { ...newPillars[index], icon: e.target.value };
                              setAboutData({ ...aboutData, pillars: newPillars });
                              setHasChanges(true);
                            }}
                            size="sm"
                            variant="bordered"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Title (English)</label>
                          <Input
                            placeholder="Enter title"
                            value={pillar.titleEn}
                            onChange={(e) => {
                              const newPillars = [...aboutData.pillars];
                              newPillars[index] = { ...newPillars[index], titleEn: e.target.value };
                              setAboutData({ ...aboutData, pillars: newPillars });
                              setHasChanges(true);
                            }}
                            size="sm"
                            variant="bordered"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Title (Bangla)</label>
                          <Input
                            placeholder="Enter title"
                            value={pillar.titleBn}
                            onChange={(e) => {
                              const newPillars = [...aboutData.pillars];
                              newPillars[index] = { ...newPillars[index], titleBn: e.target.value };
                              setAboutData({ ...aboutData, pillars: newPillars });
                              setHasChanges(true);
                            }}
                            size="sm"
                            variant="bordered"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Description (English)</label>
                          <Textarea
                            placeholder="Enter description"
                            value={pillar.descEn}
                            onChange={(e) => {
                              const newPillars = [...aboutData.pillars];
                              newPillars[index] = { ...newPillars[index], descEn: e.target.value };
                              setAboutData({ ...aboutData, pillars: newPillars });
                              setHasChanges(true);
                            }}
                            minRows={3}
                            variant="bordered"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">Description (Bangla)</label>
                          <Textarea
                            placeholder="Enter description"
                            value={pillar.descBn}
                            onChange={(e) => {
                              const newPillars = [...aboutData.pillars];
                              newPillars[index] = { ...newPillars[index], descBn: e.target.value };
                              setAboutData({ ...aboutData, pillars: newPillars });
                              setHasChanges(true);
                            }}
                            minRows={3}
                            variant="bordered"
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="flex lg:flex-col justify-end">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="flat"
                          startContent={<FaTrash />}
                          onPress={() => {
                            const newPillars = aboutData.pillars.filter(
                              (_, i) => i !== index
                            );
                            setAboutData({ ...aboutData, pillars: newPillars });
                            setHasChanges(true);
                          }}
                          title="Delete track"
                          className="min-h-[44px]"
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Divider />

      {/* Action Buttons */}
      <div className="flex gap-3 sticky bottom-0 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <Button
          color="warning"
          variant="flat"
          startContent={<FaUndo />}
          onPress={handleReset}
          size="lg"
          className="min-h-[44px] font-semibold"
        >
          Reset to Default
        </Button>
        <Button
          color="success"
          startContent={<FaSave />}
          onPress={handleSave}
          isLoading={isSaving}
          isDisabled={!hasChanges || isSaving}
          size="lg"
          className="flex-1 min-h-[44px] font-semibold"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
