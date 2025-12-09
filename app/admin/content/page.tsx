"use client";

import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Tabs, Tab, Textarea } from "@nextui-org/react";
import { defaultTeamData } from "@/lib/teamData";
import { defaultBlogData } from "@/lib/blogData";
import { defaultEventsData } from "@/lib/eventsData";
import { defaultPressData } from "@/lib/pressData";
import { defaultContactData } from "@/lib/contactData";
import { defaultEducatorsData } from "@/lib/educatorsData";

// Map keys to default data
const SECTIONS = {
    "Team Page": { key: "siteContent_team", default: defaultTeamData },
    "Blog Page": { key: "siteContent_blog", default: defaultBlogData },
    "Events Page": { key: "siteContent_events", default: defaultEventsData },
    "Press Page": { key: "siteContent_press", default: defaultPressData },
    "Contact Page": { key: "siteContent_contact", default: defaultContactData },
    "Educators (Homepage)": { key: "siteContent_educators", default: defaultEducatorsData },
};

export default function ContentManagerPage() {
    const [selectedSection, setSelectedSection] = useState("Team Page");
    const [jsonContent, setJsonContent] = useState("");
    const [status, setStatus] = useState("");

    // Load content when section changes
    useEffect(() => {
        const { key, default: defaultData } = SECTIONS[selectedSection as keyof typeof SECTIONS];
        const stored = localStorage.getItem(key);
        if (stored) {
            setJsonContent(stored); // Already stringified
        } else {
            setJsonContent(JSON.stringify(defaultData, null, 4));
        }
        setStatus("");
    }, [selectedSection]);

    const handleSave = () => {
        try {
            const parsed = JSON.parse(jsonContent); // Validate JSON
            const key = SECTIONS[selectedSection as keyof typeof SECTIONS].key;
            localStorage.setItem(key, JSON.stringify(parsed));
            setStatus("✅ Saved successfully! Go check the page.");
        } catch (e) {
            setStatus("❌ Invalid JSON! Please check your syntax.");
        }
    };

    const handleReset = () => {
        if (!confirm("Are you sure? This will discard all custom changes.")) return;
        const { key, default: defaultData } = SECTIONS[selectedSection as keyof typeof SECTIONS];
        localStorage.removeItem(key);
        setJsonContent(JSON.stringify(defaultData, null, 4));
        setStatus("✅ Reset to original defaults.");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Site Content Manager</h1>
                <p className="mb-6 text-gray-600">
                    Edit the raw content for your website pages below.
                    You can add, remove, or modify any text, image, or list item here.
                </p>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-1/4">
                        <Card>
                            <CardBody className="p-0">
                                <div className="flex flex-col">
                                    {Object.keys(SECTIONS).map((section) => (
                                        <button
                                            key={section}
                                            onClick={() => setSelectedSection(section)}
                                            className={`p-4 text-left font-semibold border-b last:border-b-0 hover:bg-gray-100 transition-colors ${selectedSection === section ? "bg-primary-50 text-primary border-l-4 border-l-primary" : "text-gray-700"
                                                }`}
                                        >
                                            {section}
                                        </button>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Editor */}
                    <div className="w-full md:w-3/4">
                        <Card>
                            <CardBody className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">Editing: {selectedSection}</h2>
                                    <div className="flex gap-2">
                                        <Button color="danger" variant="light" onPress={handleReset}>
                                            Reset Default
                                        </Button>
                                        <Button color="primary" onPress={handleSave}>
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>

                                {status && (
                                    <div className={`p-3 mb-4 rounded-lg text-sm font-semibold ${status.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {status}
                                    </div>
                                )}

                                <Textarea
                                    minRows={20}
                                    maxRows={40}
                                    value={jsonContent}
                                    onChange={(e) => setJsonContent(e.target.value)}
                                    className="font-mono text-sm"
                                    placeholder="Loading content..."
                                    variant="bordered"
                                />

                                <p className="mt-4 text-xs text-gray-400">
                                    * Ensure you maintain valid JSON format. (Don't miss commas or quotes!)
                                </p>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
