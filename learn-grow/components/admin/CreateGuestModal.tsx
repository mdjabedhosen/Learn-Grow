"use client";

import React, { useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Spinner,
  Avatar,
} from "@nextui-org/react";
import {
  FaUserPlus,
  FaChalkboardTeacher,
  FaUserEdit,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaIdBadge,
  FaLink,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useCreateGuestMutation } from "@/redux/api/eventApi";
import { useGetAllInstructorsQuery } from "@/redux/api/userApi";

const GUEST_ROLES = ["Guest", "Host", "Speaker", "Mentor", "Judge"] as const;
type GuestRole = (typeof GUEST_ROLES)[number];

export interface CreatedGuest {
  _id: string;
  fullName: string;
  role: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  profileImage?: string;
  organization?: string;
  designation?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  userId?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the saved guest so the caller can select it straight away. */
  onCreated?: (guest: CreatedGuest) => void;
}

const EMPTY_FORM = {
  fullName: "",
  role: "Guest" as GuestRole,
  email: "",
  phoneNumber: "",
  organization: "",
  designation: "",
  bio: "",
  profileImage: "",
  linkedinUrl: "",
  twitterUrl: "",
  websiteUrl: "",
};

export const CreateGuestModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [mode, setMode] = useState<"instructor" | "manual">("instructor");
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [createGuest, { isLoading }] = useCreateGuestMutation();
  const { data: instructorsData, isLoading: loadingInstructors } =
    useGetAllInstructorsQuery({ page: 1, limit: 100 });

  const instructors: any[] = useMemo(
    () => (instructorsData as any)?.data || [],
    [instructorsData]
  );

  const selectedInstructor = useMemo(
    () => instructors.find((i) => i._id === selectedInstructorId),
    [instructors, selectedInstructorId]
  );

  const set = (key: keyof typeof EMPTY_FORM, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => {
    setForm({ ...EMPTY_FORM });
    setSelectedInstructorId("");
    setMode("instructor");
  };

  const handleClose = () => {
    if (isLoading) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      let payload: any;

      if (mode === "instructor") {
        if (!selectedInstructorId) {
          toast.error("Please select an instructor");
          return;
        }
        // The server copies the instructor's name, email, phone and profile
        // image across. Anything typed in the detail fields wins.
        payload = {
          userId: selectedInstructorId,
          role: form.role,
          organization: form.organization || undefined,
          designation: form.designation || undefined,
          bio: form.bio || undefined,
        };
      } else {
        if (!form.fullName.trim()) {
          toast.error("Guest name is required");
          return;
        }
        if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
          toast.error("Please enter a valid email address");
          return;
        }
        payload = {
          fullName: form.fullName.trim(),
          role: form.role,
          email: form.email.trim() || undefined,
          phoneNumber: form.phoneNumber.trim() || undefined,
          organization: form.organization.trim() || undefined,
          designation: form.designation.trim() || undefined,
          bio: form.bio.trim() || undefined,
          profileImage: form.profileImage.trim() || undefined,
          linkedinUrl: form.linkedinUrl.trim() || undefined,
          twitterUrl: form.twitterUrl.trim() || undefined,
          websiteUrl: form.websiteUrl.trim() || undefined,
        };
      }

      const result: any = await createGuest(payload).unwrap();
      const guest = result?.data as CreatedGuest;

      toast.success(
        mode === "instructor"
          ? `${guest.fullName} is now an event guest`
          : "Guest created successfully"
      );

      reset();
      onCreated?.(guest);
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create guest");
    }
  };

  // Input/Textarea expose an `inputWrapper` slot, Select exposes a `trigger`
  // slot. One object carries both so the same border treatment applies
  // everywhere.
  const fieldClassNames = {
    inputWrapper:
      "border-2 border-gray-200 hover:border-indigo-400 focus-within:border-indigo-500 transition-all duration-300",
    trigger:
      "border-2 border-gray-200 hover:border-indigo-400 focus:border-indigo-500 transition-all duration-300",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "bg-white rounded-3xl",
        header: "flex flex-col gap-1 pb-4 border-b border-gray-100",
        footer: "border-t border-gray-100",
      }}
    >
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-xl">
              <FaUserPlus className="text-xl text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add an event guest</h2>
              <p className="text-sm text-gray-500 font-normal">
                Pick one of our instructors, or enter the details by hand.
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody>
          <Tabs
            selectedKey={mode}
            onSelectionChange={(key) => {
              setMode(key as "instructor" | "manual");
            }}
            color="primary"
            fullWidth
            classNames={{ tabList: "bg-gray-100 p-1 rounded-xl gap-1" }}
          >
            <Tab
              key="instructor"
              title={
                <span className="flex items-center gap-2">
                  <FaChalkboardTeacher /> Pick an instructor
                </span>
              }
            />
            <Tab
              key="manual"
              title={
                <span className="flex items-center gap-2">
                  <FaUserEdit /> Enter details
                </span>
              }
            />
          </Tabs>

          {mode === "instructor" ? (
            <div className="space-y-4 pt-2">
              {loadingInstructors ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" label="Loading instructors..." />
                </div>
              ) : instructors.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  No instructor accounts yet. Use &quot;Enter details&quot; to add a
                  guest manually.
                </p>
              ) : (
                <Select
                  label="Instructor"
                  placeholder="Select an instructor account"
                  selectedKeys={
                    selectedInstructorId ? new Set([selectedInstructorId]) : new Set()
                  }
                  onSelectionChange={(keys) =>
                    setSelectedInstructorId(
                      (Array.from(keys)[0] as string) || ""
                    )
                  }
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaChalkboardTeacher className="text-gray-400" />}
                >
                  {instructors.map((i: any) => (
                    <SelectItem key={i._id} value={i._id} textValue={i.name}>
                      <div className="flex flex-col">
                        <span className="text-small font-bold">{i.name}</span>
                        <span className="text-tiny text-default-500">
                          {i.email || "no email"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              )}

              {selectedInstructor && (
                <div className="bg-indigo-50 border-2 border-indigo-100 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={selectedInstructor.profileImage}
                      name={selectedInstructor.name}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">
                        {selectedInstructor.name}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {selectedInstructor.email || "no email on file"}
                      </p>
                    </div>
                    <FaCheckCircle className="text-indigo-500 text-xl ml-auto shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Their name, email, phone and profile photo are copied over
                    automatically. Add the extra detail below.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Guest role"
                  selectedKeys={new Set([form.role])}
                  onSelectionChange={(keys) =>
                    set("role", (Array.from(keys)[0] as string) || "Guest")
                  }
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                >
                  {GUEST_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  label="Designation"
                  placeholder="e.g. Lead AI & Coding Mentor"
                  value={form.designation}
                  onValueChange={(v) => set("designation", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaIdBadge className="text-gray-400" />}
                />
              </div>

              <Input
                label="Organisation"
                placeholder="e.g. University of Asia Pacific (UAP)"
                value={form.organization}
                onValueChange={(v) => set("organization", v)}
                variant="bordered"
                size="lg"
                classNames={fieldClassNames}
                startContent={<FaBuilding className="text-gray-400" />}
              />

              <Textarea
                label="Short bio"
                placeholder="A line or two about the guest, shown on the event page"
                value={form.bio}
                onValueChange={(v) => set("bio", v)}
                variant="bordered"
                minRows={3}
                maxRows={6}
                classNames={fieldClassNames}
              />
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  isRequired
                  placeholder="e.g. Md. Tanvir Hassan"
                  value={form.fullName}
                  onValueChange={(v) => set("fullName", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaUserEdit className="text-gray-400" />}
                />

                <Select
                  label="Guest role"
                  isRequired
                  selectedKeys={new Set([form.role])}
                  onSelectionChange={(keys) =>
                    set("role", (Array.from(keys)[0] as string) || "Guest")
                  }
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                >
                  {GUEST_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="guest@example.com"
                  value={form.email}
                  onValueChange={(v) => set("email", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaEnvelope className="text-gray-400" />}
                  description="Used to recognise the same guest. Leave empty if there is none."
                />

                <Input
                  label="Phone"
                  placeholder="+8801XXXXXXXXX"
                  value={form.phoneNumber}
                  onValueChange={(v) => set("phoneNumber", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaPhone className="text-gray-400" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organisation"
                  placeholder="e.g. University of Asia Pacific (UAP)"
                  value={form.organization}
                  onValueChange={(v) => set("organization", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaBuilding className="text-gray-400" />}
                />

                <Input
                  label="Designation"
                  placeholder="e.g. Senior Robotics Lead"
                  value={form.designation}
                  onValueChange={(v) => set("designation", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaIdBadge className="text-gray-400" />}
                />
              </div>

              <Textarea
                label="Short bio"
                placeholder="A line or two about the guest, shown on the event page"
                value={form.bio}
                onValueChange={(v) => set("bio", v)}
                variant="bordered"
                minRows={3}
                maxRows={6}
                classNames={fieldClassNames}
              />

              <Input
                label="Profile image URL"
                placeholder="https://res.cloudinary.com/..."
                value={form.profileImage}
                onValueChange={(v) => set("profileImage", v)}
                variant="bordered"
                size="lg"
                classNames={fieldClassNames}
                startContent={<FaImage className="text-gray-400" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="LinkedIn"
                  placeholder="linkedin.com/in/..."
                  value={form.linkedinUrl}
                  onValueChange={(v) => set("linkedinUrl", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaLink className="text-gray-400" />}
                />
                <Input
                  label="Twitter / X"
                  placeholder="x.com/..."
                  value={form.twitterUrl}
                  onValueChange={(v) => set("twitterUrl", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaLink className="text-gray-400" />}
                />
                <Input
                  label="Website"
                  placeholder="example.com"
                  value={form.websiteUrl}
                  onValueChange={(v) => set("websiteUrl", v)}
                  variant="bordered"
                  size="lg"
                  classNames={fieldClassNames}
                  startContent={<FaLink className="text-gray-400" />}
                />
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="light" color="default" onPress={handleClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isLoading}
            startContent={!isLoading ? <FaUserPlus /> : undefined}
            className="font-semibold"
          >
            {mode === "instructor" ? "Add instructor as guest" : "Create guest"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateGuestModal;
