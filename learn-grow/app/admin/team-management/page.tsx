"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Tabs,
    Tab,
    Image,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Spinner,
    Checkbox,
    Select,
    SelectItem,
    Textarea,
} from "@nextui-org/react";
import toast from "react-hot-toast";
import {
    FaTrash,
    FaEdit,
    FaDownload,
    FaEye,
    FaEyeSlash,
    FaUsers,
    FaPlus,
    FaUserTie,
    FaLinkedin,
    FaTwitter,
    FaArrowLeft,
    FaUpload,
    FaGripVertical,
    FaTags,
    FaCloudUploadAlt,
    FaUser,
    FaUserPlus,
    FaTimes,
    FaCheckCircle,
    FaClock,
} from "react-icons/fa";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    useGetAllTeamMembersQuery,
    useCreateTeamMemberMutation,
    useUpdateTeamMemberMutation,
    useDeleteTeamMemberMutation,
    useToggleShowHomeMutation,
    useReorderMembersMutation,
    useGetApprovedInstructorsForImportQuery,
    useImportInstructorsMutation,
    useGetAllRolesQuery,
    useCreateRoleMutation,
    useReorderRolesMutation,
    useDeleteRoleMutation,
    useSeedDefaultRolesMutation,
} from "@/redux/api/teamApi";
import SweetAlert2 from "sweetalert2";
import { useRouter } from "next/navigation";

interface Role {
    _id: string;
    name: string;
    position: number;
    isActive: boolean;
}

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    domain?: string;
    yearsOfExperience?: string | number;
    expertise?: string[] | string;
    image: string;
    profileImage?: string; // optional external image when imported
    imageSize: number;
    linkedIn?: string;
    twitter?: string;
    bio?: string;
    showOnHome: boolean;
    userId?: string;
    position: number;
}

interface Instructor {
    _id: string;
    name: string;
    profileImage?: string;
}

const resolveImageSrc = (value?: string) => {
    if (!value || value === "placeholder") return "";
    if (value.startsWith("data:image")) return value;
    if (value.startsWith("http")) return value;
    return `data:image/jpeg;base64,${value}`;
};

// Sortable Role Item Component
function SortableRoleItem({ role, onDelete }: { role: Role; onDelete: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: role._id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <FaGripVertical className="text-gray-400" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{role.name}</p>
                <p className="text-xs text-gray-500">Position: {role.position}</p>
            </div>
            <Button
                size="sm"
                color="danger"
                variant="flat"
                isIconOnly
                aria-label={`Delete role ${role.name}`}
                onPress={() => onDelete(role._id)}
            >
                <FaTrash className="text-sm" />
            </Button>
        </div>
    );
}

// Sortable Member Item Component
function SortableMemberItem({
    member,
    onEdit,
    onDelete,
    onToggleShow,
}: {
    member: TeamMember;
    onEdit: (member: TeamMember) => void;
    onDelete: (id: string, name: string) => void;
    onToggleShow: (id: string, currentValue: boolean) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: member._id,
    });

    const displayImage = member.image || member.profileImage || "";
    const displayImageSrc = resolveImageSrc(displayImage);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group hover:shadow-xl transition-all duration-300 border border-gray-200/80 rounded-2xl bg-white overflow-hidden"
        >
            <Card className="shadow-none border-none">
                <CardBody className="p-0">
                    <div className="relative h-52 bg-gradient-to-b from-slate-50 to-blue-50/30 overflow-hidden flex items-center justify-center">
                        {displayImageSrc ? (
                            <Image
                                src={displayImageSrc}
                                alt={member.name}
                                width="100%"
                                height="100%"
                                classNames={{
                                    img: "w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500",
                                }}
                                radius="none"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <FaUserTie size={48} />
                            </div>
                        )}
                        <div className="absolute top-3 left-3 z-10 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white text-gray-600">
                                <FaGripVertical />
                            </div>
                        </div>
                        <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                            <Chip
                                startContent={member.showOnHome ? <FaEye size={12} className="text-emerald-500" /> : <FaEyeSlash size={12} className="text-slate-400" />}
                                variant="flat"
                                color={member.showOnHome ? "success" : "default"}
                                size="sm"
                                className="shadow-sm font-bold text-[10px]"
                            >
                                {member.showOnHome ? "On Home Slider" : "Hidden from Slider"}
                            </Chip>
                            {member.yearsOfExperience && (
                                <span className="bg-[#2C2C2C] text-white px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md inline-flex items-center gap-1">
                                    <FaClock size={10} className="text-amber-400" />
                                    <span>{String(member.yearsOfExperience).toLowerCase().includes("year")
                                        ? member.yearsOfExperience
                                        : `${member.yearsOfExperience}+ Years`}</span>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-4 sm:p-5">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{member.name}</h3>
                        <p className="text-xs sm:text-sm text-[#3B82F6] font-semibold mb-1 truncate">{member.role}</p>

                        {member.domain && (
                            <div className="mb-2">
                                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 inline-block">
                                    {member.domain}
                                </span>
                            </div>
                        )}

                        {/* Expertise tags */}
                        {(() => {
                            const tags = Array.isArray(member.expertise)
                                ? member.expertise
                                : typeof member.expertise === "string" && member.expertise.trim()
                                ? member.expertise.split(",").map((s) => s.trim()).filter(Boolean)
                                : [];
                            if (tags.length === 0) return null;
                            return (
                                <div className="flex flex-wrap gap-1 mb-2.5">
                                    {tags.slice(0, 4).map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="text-[10px] font-bold bg-[#EAF4FB] text-[#1D4ED8] border border-[#B3D9F5] px-2 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {tags.length > 4 && (
                                        <span className="text-[10px] font-bold text-gray-400">
                                            +{tags.length - 4}
                                        </span>
                                    )}
                                </div>
                            );
                        })()}

                        {member.bio && (
                            <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed">{member.bio}</p>
                        )}

                        <div className="flex gap-2 mb-4">
                            {member.linkedIn && (
                                <a
                                    href={member.linkedIn}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-50 text-[#0A66C2] rounded-full hover:bg-blue-100 transition-colors"
                                >
                                    <FaLinkedin />
                                </a>
                            )}
                            {member.twitter && (
                                <a
                                    href={member.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-sky-50 text-[#1DA1F2] rounded-full hover:bg-sky-100 transition-colors"
                                >
                                    <FaTwitter />
                                </a>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-3 border-t border-gray-100">
                            <Button
                                size="sm"
                                variant="flat"
                                color={member.showOnHome ? "warning" : "success"}
                                onPress={() => onToggleShow(member._id, member.showOnHome)}
                                className="w-full min-h-[36px] text-[11px] px-1 font-bold"
                            >
                                {member.showOnHome ? "Hide Slider" : "Add Slider"}
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                aria-label={`Edit ${member.name}`}
                                onPress={() => onEdit(member)}
                                isIconOnly
                                className="w-full min-h-[36px]"
                            >
                                <FaEdit className="text-sm" />
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                aria-label={`Delete ${member.name}`}
                                onPress={() => onDelete(member._id, member.name)}
                                isIconOnly
                                className="w-full min-h-[36px]"
                            >
                                <FaTrash className="text-sm" />
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default function TeamManagementPage() {
    const router = useRouter();

    // Queries and Mutations
    const { data: teamData, isLoading: teamLoading, refetch } = useGetAllTeamMembersQuery(undefined);
    const { data: rolesData, isLoading: rolesLoading } = useGetAllRolesQuery(undefined);
    const { data: instructorsData, isLoading: instructorsLoading } =
        useGetApprovedInstructorsForImportQuery(undefined);

    const [createTeamMember, { isLoading: createLoading }] = useCreateTeamMemberMutation();
    const [updateTeamMember, { isLoading: updateLoading }] = useUpdateTeamMemberMutation();
    const [deleteTeamMember] = useDeleteTeamMemberMutation();
    const [toggleShowHome] = useToggleShowHomeMutation();
    const [reorderMembers] = useReorderMembersMutation();
    const [importInstructors, { isLoading: importLoading }] = useImportInstructorsMutation();

    const [createRole] = useCreateRoleMutation();
    const [reorderRoles] = useReorderRolesMutation();
    const [deleteRole] = useDeleteRoleMutation();
    const [seedDefaultRoles, { isLoading: seedingRoles }] = useSeedDefaultRolesMutation();

    // State
    const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [newRoleName, setNewRoleName] = useState("");
    const [localRoles, setLocalRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [editCustomRoleActive, setEditCustomRoleActive] = useState(false);
    const [addCustomRoleActive, setAddCustomRoleActive] = useState(false);

    // Add Member Form
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        domain: "",
        yearsOfExperience: "",
        expertise: "",
        linkedIn: "",
        twitter: "",
        bio: "",
    });
    const [imageUrl, setImageUrl] = useState<string>("");

    const fileToDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string) || "");
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });

    const toBase64Payload = (value: string) => {
        if (value.startsWith("data:image") && value.includes(",")) {
            return value.split(",")[1] || "";
        }
        return value;
    };

    const validateImageFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file (PNG, JPG, or WebP)");
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be 5MB or smaller");
            return false;
        }
        return true;
    };

    const handleAddImageUpload = async (file: File) => {
        if (!validateImageFile(file)) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setImageUrl(toBase64Payload(dataUrl));
            toast.success("Image selected");
        } catch {
            toast.error("Failed to process image");
        }
    };

    const handleEditImageUpload = async (file: File) => {
        if (!editingMember || !validateImageFile(file)) return;
        try {
            const dataUrl = await fileToDataUrl(file);
            setEditingMember({
                ...editingMember,
                image: toBase64Payload(dataUrl),
            });
            toast.success("Image selected");
        } catch {
            toast.error("Failed to process image");
        }
    };

    const teamMembers = (teamData?.data || []) as TeamMember[];
    const roles = (rolesData?.data || []) as Role[];
    const instructors = (instructorsData?.data || []) as Instructor[];

    // Update local roles when data changes
    useEffect(() => {
        if (roles.length > 0) {
            setLocalRoles([...roles]);
        }
    }, [roles]);

    // Drag and drop sensors for roles
    const roleSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Drag and drop sensors for members
    const memberSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle role drag end
    const handleRoleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localRoles.findIndex((r) => r._id === active.id);
            const newIndex = localRoles.findIndex((r) => r._id === over.id);

            const newRoles = arrayMove(localRoles, oldIndex, newIndex);
            setLocalRoles(newRoles);

            // Update positions in backend
            const roleOrders = newRoles.map((role, index) => ({
                id: role._id,
                position: index + 1,
            }));

            try {
                await reorderRoles(roleOrders).unwrap();
                toast.success("Roles reordered successfully!");
            } catch (error) {
                toast.error("Failed to reorder roles");
                setLocalRoles([...roles]); // Revert on error
            }
        }
    };

    // Handle member drag end within a role
    const handleMemberDragEnd = async (event: DragEndEvent, roleMembers: TeamMember[]) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = roleMembers.findIndex((m) => m._id === active.id);
            const newIndex = roleMembers.findIndex((m) => m._id === over.id);

            const newMembers = arrayMove(roleMembers, oldIndex, newIndex);

            // Update positions in backend
            const memberOrders = newMembers.map((member, index) => ({
                id: member._id,
                position: index + 1,
            }));

            try {
                await reorderMembers(memberOrders).unwrap();
                toast.success("Members reordered successfully!");
                refetch();
            } catch (error) {
                toast.error("Failed to reorder members");
            }
        }
    };

    // Handle Add Role
    const handleAddRole = async () => {
        if (!newRoleName.trim()) {
            toast.error("Role name is required");
            return;
        }

        try {
            await createRole({ name: newRoleName }).unwrap();
            toast.success("Role added successfully!");
            setNewRoleName("");
        } catch (error) {
            toast.error((error as any)?.data?.message || "Failed to add role");
        }
    };

    // Handle Delete Role
    const handleDeleteRole = async (id: string) => {
        const result = await SweetAlert2.fire({
            title: "Delete Role",
            text: "Are you sure you want to delete this role?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        });

        if (result.isConfirmed) {
            try {
                await deleteRole(id).unwrap();
                toast.success("Role deleted successfully!");
            } catch (error) {
                toast.error((error as any)?.data?.message || "Failed to delete role");
            }
        }
    };

    // Handle Seed Default Roles
    const handleSeedRoles = async () => {
        try {
            await seedDefaultRoles({} as any).unwrap();
            toast.success("Default roles seeded successfully!");
        } catch (error) {
            toast.error("Failed to seed roles");
        }
    };

    // Handle Add Member
    const handleAddMember = async () => {
        if (!formData.name || !formData.role || !imageUrl) {
            toast.error("Name, Role, and Image are required");
            return;
        }

        try {
            await createTeamMember({
                name: formData.name,
                role: formData.role,
                domain: formData.domain,
                yearsOfExperience: formData.yearsOfExperience,
                expertise: formData.expertise,
                image: imageUrl,
                linkedIn: formData.linkedIn,
                twitter: formData.twitter,
                bio: formData.bio,
            }).unwrap();

            toast.success("Team member added successfully!");
            setFormData({
                name: "",
                role: "",
                domain: "",
                yearsOfExperience: "",
                expertise: "",
                linkedIn: "",
                twitter: "",
                bio: "",
            });
            setImageUrl("");
            setAddCustomRoleActive(false);
        } catch (error) {
            toast.error((error as any)?.data?.message || "Failed to add member");
        }
    };

    // Handle Update Member
    const handleUpdateMember = async () => {
        if (!editingMember) return;

        try {
            await updateTeamMember({
                id: editingMember._id,
                ...editingMember,
            }).unwrap();

            toast.success("Team member updated successfully!");
            setIsEditOpen(false);
            setEditingMember(null);
            setEditCustomRoleActive(false);
        } catch (error) {
            toast.error((error as any)?.data?.message || "Failed to update member");
        }
    };

    // Handle Delete Member
    const handleDeleteMember = async (id: string, name: string) => {
        const result = await SweetAlert2.fire({
            title: "Delete Team Member",
            text: `Are you sure you want to delete ${name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Delete",
        });

        if (result.isConfirmed) {
            try {
                await deleteTeamMember(id).unwrap();
                toast.success("Team member deleted successfully!");
                refetch();
            } catch (error) {
                toast.error("Failed to delete member");
            }
        }
    };

    // Handle Toggle Show Home
    const handleToggleShowHome = async (id: string, currentValue: boolean) => {
        try {
            await toggleShowHome({ id, showOnHome: !currentValue }).unwrap();
            toast.success("Visibility updated!");
            refetch();
        } catch (error) {
            toast.error("Failed to update visibility");
        }
    };

    // Handle Import Instructors
    const handleImportInstructors = async () => {
        if (selectedInstructors.length === 0) {
            toast.error("Select at least one instructor");
            return;
        }

        try {
            await importInstructors(selectedInstructors).unwrap();
            toast.success("Instructors imported successfully!");
            setSelectedInstructors([]);
            refetch();
        } catch (error) {
            toast.error((error as any)?.data?.message || "Failed to import instructors");
        }
    };

    // Group members by role with flexible matching
    const membersByRole = teamMembers.reduce((acc: Record<string, TeamMember[]>, member) => {
        // Match member role with existing roles in the roles list (supports "CEO" <-> "Founder & CEO")
        const matchedRole = roles.find((r) => 
            r.name.toLowerCase().trim() === (member.role || "").toLowerCase().trim() ||
            (r.name.toLowerCase() === "ceo" && /\bceo\b/i.test(member.role || "")) ||
            ((member.role || "").toLowerCase() === "ceo" && /\bceo\b/i.test(r.name))
        );
        const roleKey = matchedRole ? matchedRole.name : (member.role || "Other");
        if (!acc[roleKey]) {
            acc[roleKey] = [];
        }
        acc[roleKey].push(member);
        return acc;
    }, {});

    // Sort members within each role by position
    Object.keys(membersByRole).forEach((role) => {
        membersByRole[role].sort((a, b) => a.position - b.position);
    });

    // Sort roles by their position to display in correct order
    const sortedRoles = [...roles].sort((a, b) => a.position - b.position);

    // Filter members by selected role
    const filteredMembers = selectedRole
        ? teamMembers.filter((m) => m.role === selectedRole).sort((a, b) => a.position - b.position)
        : [];

    return (
        <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 max-w-7xl">
            {/* Header with Brand Gradient */}
            <div className="mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E3A8A] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 text-white shadow-2xl relative overflow-hidden border border-slate-700/50">
                {/* Ambient glowing orb accents */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <Button
                        variant="light"
                        startContent={<FaArrowLeft className="text-sm sm:text-base" />}
                        onPress={() => router.push("/admin")}
                        className="mb-2 sm:mb-3 md:mb-4 text-white/80 hover:text-white hover:bg-white/10 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm rounded-xl"
                        size="sm"
                    >
                        <span className="hidden xs:inline">Back to Dashboard</span>
                        <span className="xs:hidden">Back</span>
                    </Button>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-gradient-to-tr from-[#3B82F6] to-[#6366F1] p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                                <FaUsers className="text-2xl sm:text-3xl md:text-4xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
                                    Team &amp; Role Management
                                </h1>
                                <p className="text-xs sm:text-sm md:text-base text-slate-300 mt-0.5 sm:mt-1 line-clamp-2">
                                    Manage executive leadership, STEM instructors, display order, and public showcase status
                                </p>
                            </div>
                        </div>

                        {/* Quick Stats Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-2 shadow-sm">
                                <FaUsers className="text-blue-400 text-xs" /> Total Members: {teamMembers.length}
                            </span>
                            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-2 shadow-sm">
                                <FaTags className="text-purple-400 text-xs" /> Roles: {roles.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden min-h-[400px] sm:min-h-[600px]">
                <Tabs
                    aria-label="Team Management Tabs"
                    color="primary"
                    variant="underlined"
                    classNames={{
                        tabList:
                            "gap-2 sm:gap-4 md:gap-6 w-full relative rounded-none p-0 border-b border-divider px-2 sm:px-4 md:px-6 pt-2 sm:pt-3 md:pt-4 overflow-x-auto",
                        cursor: "w-full bg-[#3B82F6]",
                        tab: "max-w-fit px-2 sm:px-3 md:px-4 h-12 sm:h-14 min-w-fit whitespace-nowrap",
                        tabContent:
                            "group-data-[selected=true]:text-[#3B82F6] font-bold text-xs sm:text-sm md:text-base lg:text-lg",
                    }}
                >
                    {/* Manage Roles Tab */}
                    <Tab
                        key="roles"
                        title={
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <FaTags className="text-xs sm:text-sm" />
                                <span className="hidden sm:inline">Manage Roles</span>
                                <span className="sm:hidden">Roles</span>
                            </div>
                        }
                    >
                        <div className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
                            <Card className="shadow-lg border border-gray-100 mb-6">
                                <CardHeader className="flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-0">
                                    <div className="p-2 sm:p-3 bg-purple-100 text-purple-600 rounded-lg sm:rounded-xl">
                                        <FaTags size={20} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                            Add New Role
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                                            Create custom roles for team members
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody className="space-y-4 p-3 sm:p-4 md:p-6">
                                    <div className="flex gap-3">
                                        <Input
                                            label="Role Name"
                                            placeholder="e.g. Senior Developer"
                                            value={newRoleName}
                                            onChange={(e) => setNewRoleName(e.target.value)}
                                            variant="bordered"
                                            className="flex-1"
                                        />
                                        <Button
                                            color="primary"
                                            onPress={handleAddRole}
                                            startContent={<FaPlus />}
                                            className="min-w-[120px]"
                                        >
                                            Add Role
                                        </Button>
                                    </div>
                                  
                                </CardBody>
                            </Card>

                            <Card className="shadow-lg border border-gray-100">
                                <CardHeader className="px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-4">
                                    <p className="text-base sm:text-lg font-bold text-gray-800">
                                        All Roles ({localRoles.length})
                                    </p>
                                    <p className="text-xs text-gray-500 ml-2">Drag to reorder</p>
                                </CardHeader>
                                <CardBody className="p-3 sm:p-4 md:p-6">
                                    {rolesLoading ? (
                                        <div className="h-40 flex items-center justify-center">
                                            <Spinner size="lg" label="Loading roles..." />
                                        </div>
                                    ) : localRoles.length === 0 ? (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 font-medium">
                                                No roles available. Add or seed roles.
                                            </p>
                                        </div>
                                    ) : (
                                        <DndContext
                                            sensors={roleSensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleRoleDragEnd}
                                        >
                                            <SortableContext
                                                items={localRoles.map((r) => r._id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-2">
                                                    {localRoles.map((role) => (
                                                        <SortableRoleItem
                                                            key={role._id}
                                                            role={role}
                                                            onDelete={handleDeleteRole}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>

                    {/* Add Member Tab */}
                    <Tab
                        key="add"
                        title={
                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                                <FaPlus className="text-xs sm:text-sm" />
                                <span className="hidden sm:inline">Add New Member</span>
                                <span className="sm:hidden">Add</span>
                            </div>
                        }
                    >
                        <div className="p-3 sm:p-6 md:p-8 max-w-3xl mx-auto">
                            <Card className="shadow-xl border border-gray-100 rounded-3xl overflow-hidden bg-white">
                                {/* Card Header with Brand Accent */}
                                <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white px-5 sm:px-8 py-5 sm:py-6 border-b border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3.5 sm:gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                                            <FaUserPlus size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                                    New Team Member
                                                </h2>
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                                                    Official Profile
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                                Add details manually for executive leadership or faculty showcase
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <CardBody className="p-5 sm:p-8 space-y-6">
                                    {/* Primary Credentials Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                        <Input
                                            label="Full Name"
                                            placeholder="e.g. Engr. Tanvir Hassan"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            variant="bordered"
                                            radius="lg"
                                            isRequired
                                            classNames={{
                                                label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                                inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                            }}
                                            startContent={<FaUser className="text-gray-400 text-sm" />}
                                        />

                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                                                    Designation / Role <span className="text-danger">*</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => setAddCustomRoleActive(!addCustomRoleActive)}
                                                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    {addCustomRoleActive ? "← Choose standard role" : "+ Custom role"}
                                                </button>
                                            </div>
                                            {addCustomRoleActive ? (
                                                <Input
                                                    placeholder="e.g. Master Coder & Algorithms Lead"
                                                    value={formData.role}
                                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                    variant="bordered"
                                                    radius="lg"
                                                    classNames={{
                                                        inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white h-10",
                                                    }}
                                                    startContent={<FaUserTie className="text-gray-400 text-sm" />}
                                                />
                                            ) : (
                                                <select
                                                    value={formData.role}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val === "__custom__") {
                                                            setAddCustomRoleActive(true);
                                                        } else {
                                                            setFormData({ ...formData, role: val });
                                                        }
                                                    }}
                                                    aria-label="Designation / Role"
                                                    className="w-full h-10 px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 hover:border-blue-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl outline-none transition-colors text-gray-800 cursor-pointer"
                                                >
                                                    <option value="" disabled>Select an official role</option>
                                                    {roles.map((role) => (
                                                        <option key={role._id || role.name} value={role.name}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                    <option value="__custom__">✏️ + Enter Custom Role...</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    {/* Domain & Experience of Year (Kodland Tutor & Faculty Profile Spec) */}
                                    <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-4">
                                        <div>
                                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                                                Domain Specialization, Experience & Skills
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Add subject domain, teaching experience, and technical skill tags to display on cards
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Domain Name (e.g. Robotics & Arduino)"
                                                    placeholder="Robotics & Arduino"
                                                    value={formData.domain}
                                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                                    variant="bordered"
                                                    radius="lg"
                                                    classNames={{
                                                        label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                                        inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                                    }}
                                                />
                                                {/* Domain Quick Presets */}
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {["Robotics & Arduino", "Robotics & IoT", "Python & AI", "Game Dev & Scratch"].map((d) => (
                                                        <button
                                                            key={d}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, domain: d })}
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            {d}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <Input
                                                    label="Experience of Year (e.g. 5+ Years Exp)"
                                                    placeholder="5+ Years Exp"
                                                    value={String(formData.yearsOfExperience || "")}
                                                    onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                                                    variant="bordered"
                                                    radius="lg"
                                                    classNames={{
                                                        label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                                        inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                                    }}
                                                />
                                                {/* Experience Quick Presets */}
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {["3+ Years Exp", "5+ Years Exp", "6+ Years Exp", "8+ Years Exp"].map((exp) => (
                                                        <button
                                                            key={exp}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, yearsOfExperience: exp })}
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
                                                        >
                                                            {exp}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Core Expertise / Skills Tags */}
                                        <div>
                                            <Input
                                                label="Skills & Expertise Tags (comma separated)"
                                                placeholder="IoT, Microcontrollers, Circuits"
                                                value={formData.expertise}
                                                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                                variant="bordered"
                                                radius="lg"
                                                classNames={{
                                                    label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                                    inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                                }}
                                            />
                                            {/* Quick Tag Pills */}
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                <span className="text-[11px] text-gray-400 font-medium mr-1">Quick Add:</span>
                                                {["IoT", "Microcontrollers", "Circuits", "Arduino IDE", "Sensors", "Python", "AI", "Scratch"].map((tag) => (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = formData.expertise
                                                                ? formData.expertise.split(",").map((s) => s.trim()).filter(Boolean)
                                                                : [];
                                                            if (!current.includes(tag)) {
                                                                setFormData({ ...formData, expertise: [...current, tag].join(", ") });
                                                            }
                                                        }}
                                                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50/80 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                                                    >
                                                        + {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Biography */}
                                    <Textarea
                                        label="Professional Biography (Bio)"
                                        placeholder="e.g. Senior hardware engineer and researcher with 6+ years of experience leading robotics competitions, Arduino microcontrollers, and STEM curriculums."
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        variant="bordered"
                                        radius="lg"
                                        minRows={3}
                                        maxRows={5}
                                        classNames={{
                                            label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                            inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                        }}
                                    />

                                    {/* Social & Professional Links */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                                        <Input
                                            label="LinkedIn Profile (Optional)"
                                            placeholder="https://linkedin.com/in/username"
                                            value={formData.linkedIn}
                                            onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                            startContent={<FaLinkedin className="text-[#0A66C2] text-lg" />}
                                            variant="bordered"
                                            radius="lg"
                                            classNames={{
                                                label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                                inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                            }}
                                        />
                                        <Input
                                            label="Twitter / X or Portfolio (Optional)"
                                            placeholder="https://x.com/username or portfolio URL"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                            startContent={<FaTwitter className="text-[#1DA1F2] text-lg" />}
                                            variant="bordered"
                                            radius="lg"
                                            classNames={{
                                                label: "font-semibold text-gray-700 text-xs sm:text-sm",
                                                inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 transition-colors bg-white",
                                            }}
                                        />
                                    </div>

                                    {/* Profile Picture Upload Container */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <label className="text-xs sm:text-sm font-semibold text-gray-800">
                                                    Profile Picture <span className="text-red-500">*</span>
                                                </label>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Transparent cutout PNG recommended for pristine card design (or JPG/WebP, max 5MB).
                                                </p>
                                            </div>
                                            {imageUrl && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                    <FaCheckCircle className="text-xs" /> Ready
                                                </span>
                                            )}
                                        </div>

                                        {!imageUrl ? (
                                            <label className="group relative flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl bg-gray-50/70 hover:bg-blue-50/40 cursor-pointer transition-all">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleAddImageUpload(file);
                                                    }}
                                                />
                                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm border border-gray-200 group-hover:border-blue-300 group-hover:scale-105 flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-all mb-3">
                                                    <FaCloudUploadAlt size={26} />
                                                </div>
                                                <p className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors text-center">
                                                    Click to upload portrait photo <span className="text-gray-400 font-normal">or drag &amp; drop</span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                                                    <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-white border border-gray-200 text-gray-600">
                                                        PNG (Transparent)
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-white border border-gray-200 text-gray-600">
                                                        JPG
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-white border border-gray-200 text-gray-600">
                                                        WebP
                                                    </span>
                                                    <span className="text-[11px] text-gray-400">Up to 5MB</span>
                                                </div>
                                            </label>
                                        ) : (
                                            <div className="relative p-4 rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col sm:flex-row items-center gap-5">
                                                {/* Checkerboard container to verify transparent background */}
                                                <div className="relative w-32 h-36 sm:w-36 sm:h-40 rounded-xl overflow-hidden border border-gray-300 shadow-inner bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0] flex items-center justify-center">
                                                    <Image
                                                        src={resolveImageSrc(imageUrl)}
                                                        alt="Member Preview"
                                                        width={140}
                                                        height={160}
                                                        className="max-h-full w-auto object-contain drop-shadow-md"
                                                    />
                                                </div>

                                                <div className="flex-1 text-center sm:text-left space-y-2">
                                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                                        <span className="text-sm font-bold text-gray-800">Portrait Uploaded</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">
                                                            Ready to save
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        The cutout will render smoothly with brand color themes across the platform.
                                                    </p>
                                                    <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                                                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors border border-gray-200">
                                                            <FaUpload className="text-[10px]" /> Change Photo
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="sr-only"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleAddImageUpload(file);
                                                                }}
                                                            />
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() => setImageUrl("")}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-200"
                                                        >
                                                            <FaTimes className="text-[10px]" /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <Button
                                            size="lg"
                                            onPress={handleAddMember}
                                            isLoading={createLoading}
                                            className="w-full font-bold text-white shadow-xl shadow-blue-500/25 bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] hover:from-blue-600 hover:to-blue-800 rounded-xl min-h-[48px] text-sm sm:text-base transition-all"
                                            startContent={!createLoading && <FaUserPlus />}
                                        >
                                            Add Team Member
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>

                    {/* Import Instructors Tab */}
                    <Tab
                        key="import"
                        title={
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <FaDownload className="text-xs sm:text-sm" />
                                <span className="hidden sm:inline">Import Instructors</span>
                                <span className="sm:hidden">Import</span>
                            </div>
                        }
                    >
                        <div className="p-2 sm:p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
                            <Card className="shadow-lg border border-gray-100">
                                <CardHeader className="flex gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-0">
                                    <div className="p-2 sm:p-3 bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl">
                                        <FaUpload size={20} className="sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                                            Import Approved Instructors
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                                            Quickly add existing instructors to your team showcase.
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardBody className="p-3 sm:p-4 md:p-6">
                                    {instructorsLoading ? (
                                        <div className="h-60 flex items-center justify-center">
                                            <Spinner size="lg" label="Loading instructors..." color="primary" />
                                        </div>
                                    ) : instructors.length === 0 ? (
                                        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 font-medium">
                                                No approved instructors available to import.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                <p className="text-sm text-yellow-800">
                                                    Instructors without profile pictures will be marked with a warning icon.
                                                </p>
                                            </div>
                                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border border-gray-200 rounded-xl p-2 mb-4 bg-gray-50/50">
                                                {instructors.map((instructor) => {
                                                    const profileImage = instructor.profileImage?.trim();
                                                    const hasProfileImage = Boolean(profileImage);
                                                    const profileImageSrc = resolveImageSrc(profileImage);
                                                    
                                                    return (
                                                        <div
                                                            key={instructor._id}
                                                            className={`flex items-center gap-3 p-3 border rounded-lg transition-all cursor-pointer ${
                                                                selectedInstructors.includes(instructor._id)
                                                                    ? "bg-blue-50 border-blue-300 shadow-sm"
                                                                    : "bg-white hover:bg-gray-50 border-gray-100"
                                                            }`}
                                                            onClick={() => {
                                                                if (selectedInstructors.includes(instructor._id)) {
                                                                    setSelectedInstructors(
                                                                        selectedInstructors.filter((id) => id !== instructor._id)
                                                                    );
                                                                } else {
                                                                    setSelectedInstructors([
                                                                        ...selectedInstructors,
                                                                        instructor._id,
                                                                    ]);
                                                                }
                                                            }}
                                                        >
                                                            <Checkbox
                                                                isSelected={selectedInstructors.includes(instructor._id)}
                                                                onValueChange={() => {}}
                                                                size="lg"
                                                                radius="full"
                                                            />
                                                            {hasProfileImage ? (
                                                                <Image
                                                                    src={profileImageSrc}
                                                                    alt={instructor.name}
                                                                    width={48}
                                                                    height={48}
                                                                    className="rounded-full border-2 border-white shadow-sm object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 border-2 border-yellow-300">
                                                                    <FaUserTie />
                                                                </div>
                                                            )}
                                                            <div className="flex-1">
                                                                <span className="font-semibold text-gray-800">
                                                                    {instructor.name}
                                                                </span>
                                                                {!hasProfileImage && (
                                                                    <p className="text-xs text-yellow-600 mt-1">
                                                                        No profile picture
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <Button
                                                size="lg"
                                                color="primary"
                                                onPress={handleImportInstructors}
                                                isLoading={importLoading}
                                                className="w-full font-bold shadow-lg min-h-[44px] text-sm sm:text-base"
                                                isDisabled={selectedInstructors.length === 0}
                                                startContent={<FaDownload />}
                                            >
                                                Import Selected ({selectedInstructors.length})
                                            </Button>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    </Tab>

                    {/* Team Members List Tab - All Members */}
                    <Tab
                        key="list"
                        title={
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <FaUsers className="text-xs sm:text-sm" />
                                <span className="hidden sm:inline">All Members ({teamMembers.length})</span>
                                <span className="sm:hidden">List ({teamMembers.length})</span>
                            </div>
                        }
                    >
                        <div className="p-2 sm:p-4 md:p-6 lg:p-8">
                            {teamLoading ? (
                                <div className="h-60 flex items-center justify-center">
                                    <Spinner size="lg" label="Loading team..." color="primary" />
                                </div>
                            ) : teamMembers.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-700">No team members yet</h3>
                                    <p className="text-gray-500 mt-2">Add or import members to display them here.</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Display all members organized by role - sorted by role position */}
                                    {sortedRoles.map((role) => (
                                        membersByRole[role.name] && membersByRole[role.name].length > 0 && (
                                            <Card key={role._id} className="shadow-lg border border-gray-100">
                                                <CardHeader className="px-4 pt-4 pb-2">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-xl font-bold text-gray-800">{role.name}</h3>
                                                            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-semibold">
                                                                Position: {role.position}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">({membersByRole[role.name]?.length || 0} members)</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 ml-2">Drag to reorder members</p>
                                                </CardHeader>
                                                <CardBody className="p-4">
                                                    <DndContext
                                                        sensors={memberSensors}
                                                        collisionDetection={closestCenter}
                                                        onDragEnd={(event) => handleMemberDragEnd(event, membersByRole[role.name])}
                                                    >
                                                        <SortableContext
                                                            items={membersByRole[role.name].map((m) => m._id)}
                                                            strategy={verticalListSortingStrategy}
                                                        >
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                                {membersByRole[role.name].map((member) => (
                                                                    <SortableMemberItem
                                                                        key={member._id}
                                                                        member={member}
                                                                        onEdit={setEditingMember}
                                                                        onDelete={handleDeleteMember}
                                                                        onToggleShow={handleToggleShowHome}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </SortableContext>
                                                    </DndContext>
                                                </CardBody>
                                            </Card>
                                        )
                                    ))}
                                    {/* Render unlisted/custom roles so no team member is ever missing */}
                                    {Object.keys(membersByRole)
                                        .filter((rName) => !sortedRoles.some((sr) => sr.name === rName) && membersByRole[rName]?.length > 0)
                                        .map((unlistedRole) => (
                                            <Card key={unlistedRole} className="shadow-lg border border-gray-100">
                                                <CardHeader className="px-4 pt-4 pb-2">
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-xl font-bold text-gray-800">{unlistedRole}</h3>
                                                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-semibold">
                                                                Custom Role
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500">({membersByRole[unlistedRole]?.length || 0} members)</p>
                                                    </div>
                                                </CardHeader>
                                                <CardBody className="p-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {membersByRole[unlistedRole].map((member) => (
                                                            <SortableMemberItem
                                                                key={member._id}
                                                                member={member}
                                                                onEdit={setEditingMember}
                                                                onDelete={handleDeleteMember}
                                                                onToggleShow={handleToggleShowHome}
                                                            />
                                                        ))}
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditOpen || !!editingMember}
                onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (!open) {
                        setEditingMember(null);
                        setEditCustomRoleActive(false);
                    }
                }}
                size="lg"
                scrollBehavior="inside"
                classNames={{
                    backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
                    wrapper: "overflow-y-auto",
                    base: "m-2 sm:m-4",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="bg-gray-50 border-b border-gray-100 text-base sm:text-lg">
                                Edit Team Member
                            </ModalHeader>
                            <ModalBody className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
                                {editingMember && (
                                    <>
                                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2">
                                            {(editingMember.image || editingMember.profileImage) && (
                                                <Image
                                                    src={resolveImageSrc(editingMember.image || editingMember.profileImage || "")}
                                                    alt={editingMember.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full shadow-sm border-2 border-white sm:w-16 sm:h-16 object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-base sm:text-lg truncate">
                                                    {editingMember.name}
                                                </p>
                                                <p className="text-xs text-gray-500">Updating profile details</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <Input
                                                label="Name"
                                                value={editingMember.name}
                                                onChange={(e) =>
                                                    setEditingMember({ ...editingMember, name: e.target.value })
                                                }
                                                variant="bordered"
                                            />
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-xs font-semibold text-gray-700">
                                                        Designation / Role <span className="text-danger">*</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditCustomRoleActive(!editCustomRoleActive)}
                                                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                                    >
                                                        {editCustomRoleActive ? "← Choose standard role" : "+ Custom role"}
                                                    </button>
                                                </div>
                                                {editCustomRoleActive ? (
                                                    <Input
                                                        placeholder="e.g. Master Coder & Algorithms Lead"
                                                        value={editingMember.role || ""}
                                                        onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                                                        variant="bordered"
                                                        radius="lg"
                                                        size="sm"
                                                        classNames={{
                                                            inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-white h-10",
                                                        }}
                                                    />
                                                ) : (
                                                    <select
                                                        value={editingMember.role || ""}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === "__custom__") {
                                                                setEditCustomRoleActive(true);
                                                            } else {
                                                                setEditingMember({ ...editingMember, role: val });
                                                            }
                                                        }}
                                                        aria-label="Designation / Role"
                                                        className="w-full h-10 px-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 hover:border-blue-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-xl outline-none transition-colors text-gray-800 cursor-pointer"
                                                    >
                                                        <option value="" disabled>Select an official role</option>
                                                        {/* If member has a custom role not in roles list, keep it visible and selected */}
                                                        {editingMember.role && !roles.some((r) => r.name.toLowerCase() === editingMember.role.toLowerCase()) && (
                                                            <option value={editingMember.role}>
                                                                {editingMember.role} (Current)
                                                            </option>
                                                        )}
                                                        {roles.map((role) => (
                                                            <option key={role._id || role.name} value={role.name}>
                                                                {role.name}
                                                            </option>
                                                        ))}
                                                        <option value="__custom__">✏️ + Enter Custom Role...</option>
                                                    </select>
                                                )}
                                            </div>
                                        </div>

                                        {/* Domain & Experience of Year for Edit Modal */}
                                        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-gray-200 space-y-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <Input
                                                        label="Domain / Specialization"
                                                        placeholder="Robotics & Arduino"
                                                        value={editingMember.domain || ""}
                                                        onChange={(e) =>
                                                            setEditingMember({ ...editingMember, domain: e.target.value })
                                                        }
                                                        variant="bordered"
                                                        radius="lg"
                                                    />
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {["Robotics & Arduino", "Robotics & IoT", "Python & AI", "Game Dev & Scratch"].map((d) => (
                                                            <button
                                                                key={d}
                                                                type="button"
                                                                onClick={() => setEditingMember({ ...editingMember, domain: d })}
                                                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:text-blue-600"
                                                            >
                                                                {d}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <Input
                                                        label="Experience of Year"
                                                        placeholder="5+ Years Exp"
                                                        value={String(editingMember.yearsOfExperience || "")}
                                                        onChange={(e) =>
                                                            setEditingMember({ ...editingMember, yearsOfExperience: e.target.value })
                                                        }
                                                        variant="bordered"
                                                        radius="lg"
                                                    />
                                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                                        {["3+ Years Exp", "5+ Years Exp", "6+ Years Exp", "8+ Years Exp"].map((exp) => (
                                                            <button
                                                                key={exp}
                                                                type="button"
                                                                onClick={() => setEditingMember({ ...editingMember, yearsOfExperience: exp })}
                                                                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-gray-200 text-gray-700 hover:text-amber-700"
                                                            >
                                                                {exp}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Input
                                                    label="Expertise Tags (comma separated)"
                                                    placeholder="IoT, Microcontrollers, Circuits"
                                                    value={
                                                        Array.isArray(editingMember.expertise)
                                                            ? editingMember.expertise.join(", ")
                                                            : editingMember.expertise || ""
                                                    }
                                                    onChange={(e) =>
                                                        setEditingMember({ ...editingMember, expertise: e.target.value })
                                                    }
                                                    variant="bordered"
                                                    radius="lg"
                                                />
                                                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                                    <span className="text-[10px] text-gray-400 font-medium">Quick add:</span>
                                                    {["IoT", "Microcontrollers", "Circuits", "Arduino IDE", "Sensors", "Python", "AI", "Scratch"].map((tag) => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => {
                                                                const currentStr = Array.isArray(editingMember.expertise)
                                                                    ? editingMember.expertise.join(", ")
                                                                    : editingMember.expertise || "";
                                                                const currentArr = currentStr ? currentStr.split(",").map((s) => s.trim()).filter(Boolean) : [];
                                                                if (!currentArr.includes(tag)) {
                                                                    setEditingMember({ ...editingMember, expertise: [...currentArr, tag].join(", ") });
                                                                }
                                                            }}
                                                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                                        >
                                                            + {tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <Textarea
                                            label="Professional Biography"
                                            value={editingMember.bio || ""}
                                            onChange={(e) =>
                                                setEditingMember({ ...editingMember, bio: e.target.value })
                                            }
                                            variant="bordered"
                                            radius="lg"
                                            minRows={2}
                                            maxRows={4}
                                        />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <Input
                                                label="LinkedIn URL"
                                                value={editingMember.linkedIn || ""}
                                                onChange={(e) =>
                                                    setEditingMember({ ...editingMember, linkedIn: e.target.value })
                                                }
                                                variant="bordered"
                                                radius="lg"
                                                startContent={<FaLinkedin className="text-blue-600" />}
                                            />
                                            <Input
                                                label="Twitter / X URL"
                                                value={editingMember.twitter || ""}
                                                onChange={(e) =>
                                                    setEditingMember({ ...editingMember, twitter: e.target.value })
                                                }
                                                variant="bordered"
                                                radius="lg"
                                                startContent={<FaTwitter className="text-sky-500" />}
                                            />
                                        </div>
                                        <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-700">Profile Picture</p>
                                                <span className="text-[11px] text-gray-500">PNG Transparent, JPG, WebP (Max 5MB)</span>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                {editingMember.image && (
                                                    <div className="w-24 h-28 rounded-xl overflow-hidden border border-gray-300 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[size:12px_12px] bg-[position:0_0,0_6px,6px_-6px,-6px_0] flex items-center justify-center p-1">
                                                        <Image
                                                            src={resolveImageSrc(editingMember.image)}
                                                            alt={editingMember.name}
                                                            width={96}
                                                            height={112}
                                                            className="max-h-full w-auto object-contain drop-shadow"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 w-full">
                                                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 text-xs font-semibold text-gray-700 hover:text-blue-700 cursor-pointer transition-all">
                                                        <FaCloudUploadAlt size={18} /> Choose New Photo
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="sr-only"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) handleEditImageUpload(file);
                                                            }}
                                                        />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-sm text-blue-950">Feature on Home Mentor Slider</p>
                                                    <p className="text-xs text-blue-700">Slide this member alongside mentors/tutors in the homepage carousel</p>
                                                </div>
                                                <Checkbox
                                                    isSelected={Boolean(editingMember.showOnHome)}
                                                    onValueChange={() =>
                                                        setEditingMember({ ...editingMember, showOnHome: !editingMember.showOnHome })
                                                    }
                                                    size="lg"
                                                    color="primary"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter className="bg-gray-50 border-t border-gray-100">
                                <Button color="default" variant="flat" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleUpdateMember}
                                    isLoading={updateLoading}
                                    className="font-semibold shadow-md"
                                >
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
