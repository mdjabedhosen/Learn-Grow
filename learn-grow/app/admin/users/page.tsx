"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Chip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Spinner,
    Select,
    SelectItem,
    Card,
    CardBody,
    Avatar,
    Skeleton,
} from "@nextui-org/react";
import { useGetUsersAdminQuery, useDeleteUserMutation, useCreateUserMutation, useUpdateUserMutation } from "@/redux/api/userApi";
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaEllipsisV,
    FaSearch,
    FaArrowLeft,
    FaUsers,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaUserShield,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaUserPlus,
    FaUserCheck,
    FaDice,
    FaUserTie,
    FaCheckCircle,
    FaTimes,
    FaShieldAlt,
    FaKey,
} from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function UserManagementPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [roleFilter, setRoleFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const user = JSON.parse(userStr);
                setCurrentUserRole(user.role || "");
            }
        }
    }, []);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    // Auto-open modal if openModal=true in URL (ADMIN ONLY)
    useEffect(() => {
        const shouldOpenModal = searchParams.get("openModal");
        const roleFromUrl = searchParams.get("role");
        if (shouldOpenModal === "true") {
            if (currentUserRole && currentUserRole !== "admin") {
                toast.error("Only administrators can add new users.");
                router.replace("/admin/users", { scroll: false });
                return;
            }
            if (roleFromUrl) {
                setNewUser(prev => ({ ...prev, role: roleFromUrl }));
            }
            if (currentUserRole === "admin") {
                onOpen();
                // Clean up URL after opening modal
                router.replace("/admin/users", { scroll: false });
            }
        }
    }, [searchParams, onOpen, router, currentUserRole]);

    const { data, isLoading, refetch, isFetching } = useGetUsersAdminQuery({ page, limit, search: searchQuery, role: roleFilter });
    const [deleteUser] = useDeleteUserMutation();
    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "student",
    });

    const [editingUser, setEditingUser] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        role: "student",
    });

    const generateStrongPassword = () => {
        const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const lower = "abcdefghijkmnpqrstuvwxyz";
        const numbers = "23456789";
        const symbols = "!@#$%&*";
        const all = upper + lower + numbers + symbols;
        let pwd = "";
        pwd += upper.charAt(Math.floor(Math.random() * upper.length));
        pwd += lower.charAt(Math.floor(Math.random() * lower.length));
        pwd += numbers.charAt(Math.floor(Math.random() * numbers.length));
        pwd += symbols.charAt(Math.floor(Math.random() * symbols.length));
        for (let i = 4; i < 10; i++) {
            pwd += all.charAt(Math.floor(Math.random() * all.length));
        }
        setNewUser(prev => ({ ...prev, password: pwd }));
        setShowPassword(true);
        toast.success("Secure password generated!");
    };

    const users = data?.data || [];
    const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 };
    const counts = data?.counts || { totalUsers: 0, students: 0, instructors: 0, admins: 0, guardians: 0 };

    const handleOpenEditModal = (user: any) => {
        setEditingUser(user);
        setEditForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "student",
        });
        onEditOpen();
    };

    const handleEditUser = async () => {
        if (!editForm.name.trim() || !editForm.email.trim()) {
            toast.error("Please fill in Name and Email");
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUser({
                id: editingUser._id,
                name: editForm.name.trim(),
                email: editForm.email.trim().toLowerCase(),
                phone: editForm.phone.trim() || undefined,
                role: editForm.role,
            }).unwrap();
            toast.success("User updated successfully!");
            onEditClose();
            setEditingUser(null);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            try {
                await deleteUser(userId).unwrap();
                toast.success(`User "${userName}" deleted successfully!`);
                refetch();
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to delete user");
            }
        }
    };

    const handleCreateUser = async () => {
        if (currentUserRole !== "admin") {
            toast.error("Access denied. Only administrators can add new users.");
            return;
        }

        if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
            toast.error("Please fill in all required fields (Name, Email, Password)");
            return;
        }

        if (newUser.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        try {
            await createUser({
                name: newUser.name.trim(),
                email: newUser.email.trim().toLowerCase(),
                phone: newUser.phone.trim() || undefined,
                password: newUser.password,
                role: newUser.role,
            }).unwrap();
            toast.success(`User "${newUser.name}" created successfully as ${newUser.role.toUpperCase()}!`);
            setNewUser({ name: "", email: "", phone: "", password: "", role: "student" });
            setShowPassword(false);
            onClose();
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create user");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "admin":
                return "danger";
            case "manager":
                return "success";
            case "instructor":
                return "warning";
            default:
                return "primary";
        }
    };

    const roleOptions = useMemo(() => [
        { key: "", label: "All" },
        { key: "student", label: "Student" },
        { key: "instructor", label: "Instructor" },
        { key: "guardian", label: "Guardian" },
        { key: "admin", label: "Admin" },
        { key: "manager", label: "Manager" },
    ], []);


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
            {/* Header with Gradient */}
            <div className="mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <Button
                            variant="light"
                            startContent={<FaArrowLeft />}
                            onPress={() => router.push(currentUserRole === "manager" ? "/manager" : "/admin")}
                            className="mb-3 sm:mb-4 text-white hover:bg-white/20 min-h-[44px]"
                            size="lg"
                        >
                            Back to Dashboard
                        </Button>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-white/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm">
                                <FaUsers className="text-3xl sm:text-4xl" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                                    User Management
                                </h1>
                                <p className="text-sm sm:text-base text-white/90 mt-1">
                                    Manage all platform users
                                </p>
                            </div>
                        </div>
                    </div>
                    {currentUserRole === "admin" && (
                        <Button
                            color="default"
                            startContent={<FaPlus />}
                            onPress={onOpen}
                            size="lg"
                            className="w-full sm:w-auto min-h-[44px] bg-white text-blue-600 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                        >
                            Add New User
                        </Button>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-5 sm:mb-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} className="shadow-md">
                            <CardBody className="p-4 sm:p-5 lg:p-6">
                                <Skeleton className="h-20 w-full rounded-lg" />
                            </CardBody>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200">
                            <CardBody className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm opacity-90 mb-1 truncate font-medium">Total Users</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{counts.totalUsers}</p>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-full flex-shrink-0 ml-2">
                                        <FaUsers className="text-2xl sm:text-3xl lg:text-4xl" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-green-200">
                            <CardBody className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm opacity-90 mb-1 truncate font-medium">Students</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{counts.students}</p>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-full flex-shrink-0 ml-2">
                                        <FaUserGraduate className="text-2xl sm:text-3xl lg:text-4xl" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-orange-200">
                            <CardBody className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm opacity-90 mb-1 truncate font-medium">Instructors</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{counts.instructors}</p>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-full flex-shrink-0 ml-2">
                                        <FaChalkboardTeacher className="text-2xl sm:text-3xl lg:text-4xl" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-200">
                            <CardBody className="p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-red-500 to-red-600 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm opacity-90 mb-1 truncate font-medium">Admins</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">{counts.admins}</p>
                                    </div>
                                    <div className="bg-white/20 p-3 rounded-full flex-shrink-0 ml-2">
                                        <FaUserShield className="text-2xl sm:text-3xl lg:text-4xl" />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>

            {/* Filters */}
            <Card className="mb-5 sm:mb-6 shadow-lg border border-gray-200">
                <CardBody className="p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input
                            label="Search"
                            placeholder="Search users by name or email..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            startContent={<FaSearch className="text-primary-500" />}
                            size="lg"
                            variant="bordered"
                            classNames={{
                                input: "text-sm sm:text-base",
                                inputWrapper: "min-h-[44px] border-2 hover:border-primary-400 transition-colors",
                            }}
                        />
                        <Select
                            label="Role"
                            selectedKeys={[roleFilter]}
                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                            size="lg"
                            variant="bordered"
                            classNames={{
                                trigger: "min-h-[44px]",
                            }}
                        >
                            {roleOptions.map((opt) => (
                                <SelectItem key={opt.key}>{opt.label}</SelectItem>
                            ))}
                        </Select>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Rows per page</label>
                            <select
                                value={String(limit)}
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-primary-400 focus:border-primary-500 focus:outline-none transition-all duration-300 bg-white text-base"
                            >
                                {[10, 20, 50, 100].map((n) => (
                                    <option key={n} value={String(n)}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Users Table/Cards */}
            <Card className="shadow-xl">
                <CardBody className="p-0 sm:p-4 lg:p-6">
                    {isLoading ? (
                        <div className="space-y-3 sm:space-y-4 p-4">
                            {[...Array(10)].map((_, i) => (
                                <Skeleton key={i} className="h-16 sm:h-20 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-10 sm:py-12 lg:py-16 px-4">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaUsers className="text-4xl sm:text-5xl text-blue-600" />
                            </div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                                No users found
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
                                {searchQuery ? "Try adjusting your search or filter criteria" : "Add your first user to get started"}
                            </p>
                            {currentUserRole === "admin" && (
                                <Button
                                    color="primary"
                                    startContent={<FaPlus />}
                                    onPress={onOpen}
                                    size="lg"
                                    className="min-h-[44px] font-semibold shadow-lg"
                                >
                                    Add New User
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <Table aria-label="Users table" classNames={{ wrapper: "shadow-none" }} removeWrapper>
                                    <TableHeader>
                                        <TableColumn>NAME</TableColumn>
                                        <TableColumn>EMAIL</TableColumn>
                                        <TableColumn>ROLE</TableColumn>
                                        <TableColumn>JOINED</TableColumn>
                                        <TableColumn>ACTIONS</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="No users found" isLoading={isFetching} loadingContent={<Spinner label="Loading..." />}>
                                        {users.map((user: any) => (
                                            <TableRow key={user._id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar
                                                            src={user.profileImage}
                                                            name={user.name}
                                                            size="sm"
                                                            fallback={
                                                                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-full h-full flex items-center justify-center text-white text-sm font-bold">
                                                                    {user.name?.charAt(0).toUpperCase()}
                                                                </div>
                                                            }
                                                        />
                                                        <div className="font-medium">{user.name}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-gray-600 truncate max-w-xs">{user.email || user.phone || "-"}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        color={getRoleBadgeColor(user.role)}
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        {user.role?.toUpperCase()}
                                                    </Chip>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-500">
                                                        {user.createdAt
                                                            ? new Date(user.createdAt).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {(currentUserRole === "admin" || currentUserRole === "manager") ? (
                                                        <Dropdown>
                                                            <DropdownTrigger>
                                                                <Button
                                                                    variant="light"
                                                                    size="sm"
                                                                    isIconOnly
                                                                >
                                                                    <FaEllipsisV />
                                                                </Button>
                                                            </DropdownTrigger>
                                                            <DropdownMenu aria-label="User actions">
                                                                <DropdownItem
                                                                    key="edit"
                                                                    startContent={<FaEdit />}
                                                                    onPress={() => handleOpenEditModal(user)}
                                                                >
                                                                    Edit User
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    key="delete"
                                                                    className="text-danger"
                                                                    color="danger"
                                                                    startContent={<FaTrash />}
                                                                    onPress={() => handleDeleteUser(user._id, user.name)}
                                                                >
                                                                    Delete User
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">View Only</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Mobile/Tablet Card View */}
                            <div className="lg:hidden space-y-3 sm:space-y-4 p-4">
                                {users.map((user: any) => (
                                    <Card
                                        key={user._id}
                                        className="border border-gray-200 hover:border-primary-300 transition-colors shadow-sm hover:shadow-md"
                                    >
                                        <CardBody className="p-4 sm:p-5">
                                            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                                <Avatar
                                                    src={user.profileImage}
                                                    name={user.name}
                                                    size="lg"
                                                    fallback={
                                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-full h-full flex items-center justify-center text-white text-xl font-bold">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    }
                                                    className="flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-1 truncate">
                                                        {user.name}
                                                    </h3>
                                                    <Chip
                                                        color={getRoleBadgeColor(user.role)}
                                                        variant="flat"
                                                        size="sm"
                                                    >
                                                        {user.role?.toUpperCase()}
                                                    </Chip>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3">
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Email:</span>
                                                    <span className="text-gray-700 ml-2 truncate block">{user.email || user.phone || "-"}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Joined:</span>
                                                    <span className="text-gray-700 ml-2">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {(currentUserRole === "admin" || currentUserRole === "manager") && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="md"
                                                        color="primary"
                                                        variant="flat"
                                                        className="flex-1 min-h-[44px] font-semibold"
                                                        startContent={<FaEdit />}
                                                        onPress={() => handleOpenEditModal(user)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="md"
                                                        color="danger"
                                                        variant="flat"
                                                        className="flex-1 min-h-[44px] font-semibold"
                                                        startContent={<FaTrash />}
                                                        onPress={() => handleDeleteUser(user._id, user.name)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
                                <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                                    Page <span className="font-bold text-primary-600">{meta.page}</span> of <span className="font-bold">{meta.totalPages}</span> • Total: <span className="font-bold text-primary-600">{meta.total}</span> users
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        isDisabled={page <= 1}
                                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                                        variant="flat"
                                        size="md"
                                        className="min-h-[44px] font-semibold"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        isDisabled={page >= meta.totalPages}
                                        onPress={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                                        variant="flat"
                                        size="md"
                                        className="min-h-[44px] font-semibold"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardBody>
            </Card>

            {/* Add User Modal (Admin Only) */}
            <Modal
                isOpen={isOpen && currentUserRole === "admin"}
                onClose={onClose}
                size="2xl"
                backdrop="blur"
                classNames={{
                    base: "rounded-[32px] overflow-hidden border border-gray-100 shadow-2xl bg-white",
                    closeButton: "top-5 right-5 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all cursor-pointer",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            {/* Premium Header */}
                            <ModalHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-7 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
                                        <FaUserPlus className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                                                User Provisioning
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">Add New User</h2>
                                        <p className="text-xs sm:text-sm text-slate-300 font-medium">
                                            Create credentials and set platform permissions
                                        </p>
                                    </div>
                                </div>
                            </ModalHeader>

                            {/* Modal Body */}
                            <ModalBody className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
                                {/* Credentials Form */}
                                <div className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                                            Full Name <span className="text-rose-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Enter user's full name (e.g. Tanvir Ahmed)"
                                            value={newUser.name}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, name: e.target.value })
                                            }
                                            size="lg"
                                            isRequired
                                            variant="bordered"
                                            startContent={<FaUser className="text-gray-400 text-base mr-1" />}
                                            classNames={{
                                                inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                            }}
                                        />
                                    </div>

                                    {/* Email & Phone Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="user@example.com"
                                                value={newUser.email}
                                                onChange={(e) =>
                                                    setNewUser({ ...newUser, email: e.target.value })
                                                }
                                                size="lg"
                                                isRequired
                                                variant="bordered"
                                                startContent={<FaEnvelope className="text-gray-400 text-base mr-1" />}
                                                classNames={{
                                                    inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                                                Phone Number (Optional)
                                            </label>
                                            <Input
                                                type="tel"
                                                placeholder="01712345678"
                                                value={newUser.phone}
                                                onChange={(e) =>
                                                    setNewUser({ ...newUser, phone: e.target.value })
                                                }
                                                size="lg"
                                                variant="bordered"
                                                startContent={<FaPhone className="text-gray-400 text-base mr-1" />}
                                                classNames={{
                                                    inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Password with Generator & Visibility Toggle */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                                                Temporary Password <span className="text-rose-500">*</span>
                                            </label>
                                            <button
                                                type="button"
                                                onClick={generateStrongPassword}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer transition-colors"
                                            >
                                                <FaDice className="text-sm" /> Generate Secure Password
                                            </button>
                                        </div>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter secure password (min 6 chars)"
                                            value={newUser.password}
                                            onChange={(e) =>
                                                setNewUser({ ...newUser, password: e.target.value })
                                            }
                                            size="lg"
                                            isRequired
                                            variant="bordered"
                                            startContent={<FaLock className="text-gray-400 text-base mr-1" />}
                                            endContent={
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                                                    aria-label="Toggle password"
                                                >
                                                    {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                                </button>
                                            }
                                            classNames={{
                                                inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                            <FaShieldAlt className="text-blue-600" /> Platform Role & Access Level
                                        </label>
                                        <span className="text-xs font-semibold text-gray-500">
                                            Selected: <span className="font-bold text-blue-600 uppercase">{newUser.role}</span>
                                        </span>
                                    </div>

                                    {/* 4 Interactive Role Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            {
                                                id: "student",
                                                title: "Student",
                                                titleBn: "শিক্ষার্থী",
                                                desc: "Courses, live classes, batches & quizzes",
                                                icon: FaUserGraduate,
                                                iconBg: "bg-blue-100 text-blue-700",
                                                activeStyle: "border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/25",
                                            },
                                            {
                                                id: "instructor",
                                                title: "Instructor",
                                                titleBn: "শিক্ষক ও মেন্টর",
                                                desc: "Teach classes, manage curriculum & students",
                                                icon: FaChalkboardTeacher,
                                                iconBg: "bg-amber-100 text-amber-800",
                                                activeStyle: "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/25",
                                            },
                                            {
                                                id: "manager",
                                                title: "Manager",
                                                titleBn: "অপারেশনস ম্যানেজার",
                                                desc: "Manage orders, trials, combos, jobs & users",
                                                icon: FaUserTie,
                                                iconBg: "bg-emerald-100 text-emerald-800",
                                                activeStyle: "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/25",
                                            },
                                            {
                                                id: "admin",
                                                title: "Administrator",
                                                titleBn: "সিস্টেম অ্যাডমিন",
                                                desc: "Full platform authority, security & billing",
                                                icon: FaUserShield,
                                                iconBg: "bg-purple-100 text-purple-800",
                                                activeStyle: "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/25",
                                            },
                                        ].map((r) => {
                                            const isSelected = newUser.role === r.id;
                                            const RoleIcon = r.icon;
                                            return (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setNewUser({ ...newUser, role: r.id })}
                                                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                                                        isSelected
                                                            ? r.activeStyle
                                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white"
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.iconBg}`}>
                                                        <RoleIcon className="text-lg" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 pr-6">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                                                            <span className="text-[11px] text-gray-500 font-medium">({r.titleBn})</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">{r.desc}</p>
                                                    </div>
                                                    <div className="absolute top-3.5 right-3.5">
                                                        {isSelected ? (
                                                            <FaCheckCircle className="text-base text-blue-600" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </ModalBody>

                            {/* Modal Footer */}
                            <ModalFooter className="bg-gray-50 border-t border-gray-200 p-5 sm:p-6 flex items-center justify-between">
                                <Button
                                    variant="bordered"
                                    onPress={onClose}
                                    size="lg"
                                    className="min-h-[46px] rounded-2xl font-bold border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    isLoading={isSubmitting}
                                    onPress={handleCreateUser}
                                    size="lg"
                                    startContent={!isSubmitting && <FaUserCheck className="text-lg" />}
                                    className="min-h-[46px] rounded-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 px-8"
                                >
                                    Create User Account
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={onEditClose}
                size="2xl"
                backdrop="blur"
                classNames={{
                    base: "rounded-[32px] overflow-hidden border border-gray-100 shadow-2xl bg-white",
                    closeButton: "top-5 right-5 z-20 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all cursor-pointer",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            {/* Header */}
                            <ModalHeader className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-7 relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 flex-shrink-0">
                                        <FaEdit className="text-2xl" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                                                Edit Account
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-black text-white tracking-tight">Modify User Profile</h2>
                                        <p className="text-xs sm:text-sm text-slate-300 font-medium">
                                            Update name, email, phone and role assignments
                                        </p>
                                    </div>
                                </div>
                            </ModalHeader>

                            {/* Body */}
                            <ModalBody className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
                                <div className="space-y-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                                            Full Name <span className="text-rose-500">*</span>
                                        </label>
                                        <Input
                                            placeholder="Enter user's full name"
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm({ ...editForm, name: e.target.value })
                                            }
                                            size="lg"
                                            isRequired
                                            variant="bordered"
                                            startContent={<FaUser className="text-gray-400 text-base mr-1" />}
                                            classNames={{
                                                inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                            }}
                                        />
                                    </div>

                                    {/* Email & Phone Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                                                Email Address <span className="text-rose-500">*</span>
                                            </label>
                                            <Input
                                                type="email"
                                                placeholder="user@example.com"
                                                value={editForm.email}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, email: e.target.value })
                                                }
                                                size="lg"
                                                isRequired
                                                variant="bordered"
                                                startContent={<FaEnvelope className="text-gray-400 text-base mr-1" />}
                                                classNames={{
                                                    inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
                                                Phone Number
                                            </label>
                                            <Input
                                                type="tel"
                                                placeholder="01712345678"
                                                value={editForm.phone}
                                                onChange={(e) =>
                                                    setEditForm({ ...editForm, phone: e.target.value })
                                                }
                                                size="lg"
                                                variant="bordered"
                                                startContent={<FaPhone className="text-gray-400 text-base mr-1" />}
                                                classNames={{
                                                    inputWrapper: "min-h-[50px] rounded-2xl border-gray-200 hover:border-blue-400 focus-within:!border-blue-600 bg-gray-50/50 shadow-xs transition-all",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="pt-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                            <FaShieldAlt className="text-indigo-600" /> Platform Role Assignment
                                        </label>
                                        <span className="text-xs font-semibold text-gray-500">
                                            Current: <span className="font-bold text-indigo-600 uppercase">{editForm.role}</span>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {[
                                            {
                                                id: "student",
                                                title: "Student",
                                                titleBn: "শিক্ষার্থী",
                                                desc: "Courses, live classes, batches & quizzes",
                                                icon: FaUserGraduate,
                                                iconBg: "bg-blue-100 text-blue-700",
                                                activeStyle: "border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/25",
                                            },
                                            {
                                                id: "instructor",
                                                title: "Instructor",
                                                titleBn: "শিক্ষক ও মেন্টর",
                                                desc: "Teach classes, manage curriculum & students",
                                                icon: FaChalkboardTeacher,
                                                iconBg: "bg-amber-100 text-amber-800",
                                                activeStyle: "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/25",
                                            },
                                            {
                                                id: "manager",
                                                title: "Manager",
                                                titleBn: "অপারেশনস ম্যানেজার",
                                                desc: "Manage orders, trials, combos, jobs & users",
                                                icon: FaUserTie,
                                                iconBg: "bg-emerald-100 text-emerald-800",
                                                activeStyle: "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/25",
                                            },
                                            {
                                                id: "admin",
                                                title: "Administrator",
                                                titleBn: "সিস্টেম অ্যাডমিন",
                                                desc: "Full platform authority, security & billing",
                                                icon: FaUserShield,
                                                iconBg: "bg-purple-100 text-purple-800",
                                                activeStyle: "border-purple-600 bg-purple-50/60 ring-2 ring-purple-600/25",
                                            },
                                        ].map((r) => {
                                            const isSelected = editForm.role === r.id;
                                            const RoleIcon = r.icon;
                                            return (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setEditForm({ ...editForm, role: r.id })}
                                                    className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                                                        isSelected
                                                            ? r.activeStyle
                                                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white"
                                                    }`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.iconBg}`}>
                                                        <RoleIcon className="text-lg" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 pr-6">
                                                        <div className="flex items-center gap-1.5">
                                                            <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                                                            <span className="text-[11px] text-gray-500 font-medium">({r.titleBn})</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-snug">{r.desc}</p>
                                                    </div>
                                                    <div className="absolute top-3.5 right-3.5">
                                                        {isSelected ? (
                                                            <FaCheckCircle className="text-base text-indigo-600" />
                                                        ) : (
                                                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </ModalBody>

                            {/* Footer */}
                            <ModalFooter className="bg-gray-50 border-t border-gray-200 p-5 sm:p-6 flex items-center justify-between">
                                <Button
                                    variant="bordered"
                                    onPress={onClose}
                                    size="lg"
                                    className="min-h-[46px] rounded-2xl font-bold border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    isLoading={isSubmitting}
                                    onPress={handleEditUser}
                                    size="lg"
                                    startContent={!isSubmitting && <FaCheckCircle className="text-lg" />}
                                    className="min-h-[46px] rounded-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 px-8"
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
