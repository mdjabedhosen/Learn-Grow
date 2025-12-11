"use client";

import React, { useState } from "react";
import {
    Card,
    CardBody,
    Button,
    Chip,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import {
    FaPlus,
    FaSearch,
    FaBriefcase,
    FaEdit,
    FaTrash,
    FaEye,
    FaMapMarkerAlt,
} from "react-icons/fa";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: "Full-time" | "Part-time" | "Contract" | "Internship";
    status: "Active" | "Closed" | "Draft";
    applicants: number;
    postedDate: string;
}

export default function JobsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock Data
    const [jobs, setJobs] = useState<Job[]>([
        {
            id: "1",
            title: "Senior React Developer",
            company: "Learn & Grow Tech",
            location: "Remote",
            type: "Full-time",
            status: "Active",
            applicants: 45,
            postedDate: "2024-12-01",
        },
        {
            id: "2",
            title: "UX/UI Designer",
            company: "Learn & Grow Tech",
            location: "Dhaka, Bangladesh",
            type: "Full-time",
            status: "Active",
            applicants: 28,
            postedDate: "2024-12-05",
        },
        {
            id: "3",
            title: "Content Marketing Intern",
            company: "Learn & Grow Tech",
            location: "Remote",
            type: "Internship",
            status: "Draft",
            applicants: 0,
            postedDate: "2024-12-10",
        },
    ]);

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this job posting?")) {
            setJobs(jobs.filter(job => job.id !== id));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "success";
            case "Closed": return "danger";
            case "Draft": return "warning";
            default: return "default";
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <FaBriefcase className="text-primary" /> Job Management
                    </h1>
                    <p className="text-gray-600 mt-1">Manage job openings, applications, and hiring pipelines.</p>
                </div>
                <Button
                    color="primary"
                    size="lg"
                    startContent={<FaPlus />}
                    onPress={() => router.push("/admin/jobs/create")}
                    className="shadow-lg"
                >
                    Post New Job
                </Button>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardBody className="flex flex-col md:flex-row gap-4">
                    <Input
                        placeholder="Search jobs..."
                        startContent={<FaSearch className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3"
                    />
                    {/* Add more filters if needed */}
                </CardBody>
            </Card>

            {/* Jobs Table */}
            <Card>
                <CardBody>
                    <Table aria-label="Jobs table">
                        <TableHeader>
                            <TableColumn>JOB TITLE</TableColumn>
                            <TableColumn>TYPE</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>APPLICANTS</TableColumn>
                            <TableColumn>POSTED DATE</TableColumn>
                            <TableColumn>ACTIONS</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No jobs found."}>
                            {jobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-bold text-lg">{job.title}</p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><FaBriefcase /> {job.company}</span>
                                                <span className="flex items-center gap-1"><FaMapMarkerAlt /> {job.location}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat">{job.type}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip color={getStatusColor(job.status) as any} size="sm" variant="dot">
                                            {job.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {/* Mock avatars */}
                                            {[...Array(Math.min(3, job.applicants))].map((_, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                            ))}
                                            {job.applicants > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500">
                                                    +{job.applicants - 3}
                                                </div>
                                            )}
                                            {job.applicants === 0 && <span className="text-gray-400 text-sm">No applicants</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {job.postedDate}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Tooltip content="View Details">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <FaEye />
                                                </span>
                                            </Tooltip>
                                            <Tooltip content="Edit Job">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <FaEdit />
                                                </span>
                                            </Tooltip>
                                            <Tooltip color="danger" content="Delete Job">
                                                <span
                                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                                    onClick={() => handleDelete(job.id)}
                                                >
                                                    <FaTrash />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
