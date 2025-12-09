"use client";
import React from "react";
import { Button, Card, CardBody, CardHeader, Chip, Divider } from "@nextui-org/react";

export default function CareersPage() {
    const jobs = [
        {
            title: "Senior React Developer",
            type: "Full-time",
            location: "Remote / Dhaka",
            dept: "Engineering"
        },
        {
            title: "Science Content Creator",
            type: "Contract",
            location: "Remote",
            dept: "Content"
        },
        {
            title: "Product Designer (UI/UX)",
            type: "Full-time",
            location: "Dhaka",
            dept: "Design"
        }
    ];

    return (
        <div className="container mx-auto px-6 py-16 max-w-5xl">
            <div className="text-center mb-16 space-y-4">
                <Chip color="secondary" variant="flat" className="mb-2">We are hiring!</Chip>
                <h1 className="text-4xl md:text-5xl font-bold">Join Our Team</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Help us shape the future of education. We're looking for passionate individuals to join our mission.
                </p>
            </div>

            <div className="grid gap-6">
                {jobs.map((job, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardBody className="flex flex-col md:flex-row justify-between items-center gap-6 p-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-gray-500">
                                    <span>{job.dept}</span>
                                    <span>•</span>
                                    <span>{job.type}</span>
                                    <span>•</span>
                                    <span>{job.location}</span>
                                </div>
                            </div>
                            <Button color="primary" variant="ghost" radius="full">
                                View Details
                            </Button>
                        </CardBody>
                    </Card>
                ))}

                <div className="text-center mt-12 p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-semibold mb-2">Don't see a perfect fit?</h3>
                    <p className="text-gray-600 mb-6">We are always looking for talent. Send us your resume anyway!</p>
                    <Button as="a" href="mailto:careers@learnandgrow.io" color="secondary">
                        Email Us
                    </Button>
                </div>
            </div>
        </div>
    );
}
