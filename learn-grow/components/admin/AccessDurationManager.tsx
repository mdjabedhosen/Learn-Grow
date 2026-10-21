"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Divider,
  Spinner,
  Alert,
} from "@nextui-org/react";
import {
  useSetAccessDurationMutation,
  useExtendAccessMutation,
  useReduceAccessMutation,
  useGetUserCourseAccessQuery,
} from "@/redux/api/accessManagementApi";
import { hasValidAccess, getRemainingDays, formatDate } from "@/lib/access-control";
import toast from "react-hot-toast";

/** The access windows the backend accepts for an enrollment. */
type AccessDuration = "1-month" | "2-months" | "3-months" | "lifetime";

const DURATION_OPTIONS: { key: AccessDuration; label: string }[] = [
  { key: "1-month", label: "1 Month" },
  { key: "2-months", label: "2 Months" },
  { key: "3-months", label: "3 Months" },
  { key: "lifetime", label: "Lifetime" },
];

export default function AccessDurationManager() {
  const [userId, setUserId] = useState("");
  const [enrollmentId, setEnrollmentId] = useState("");
  const [duration, setDuration] = useState<AccessDuration>("lifetime");
  const [extendDuration, setExtendDuration] = useState<AccessDuration>("lifetime");
  const [reduceDuration, setReduceDuration] = useState<AccessDuration>("lifetime");

  const [setAccessDuration] = useSetAccessDurationMutation();
  const [extendAccess] = useExtendAccessMutation();
  const [reduceAccess] = useReduceAccessMutation();

  const { data: accessData, isLoading } = useGetUserCourseAccessQuery(userId, {
    skip: !userId,
  });

  // The endpoint reports active and expired access separately; this manager
  // shows both in a single list.
  const accesses = useMemo(
    () => [
      ...(accessData?.data?.activeAccess ?? []),
      ...(accessData?.data?.expiredAccess ?? []),
    ],
    [accessData]
  );

  const handleSetDuration = async () => {
    if (!userId.trim() || !enrollmentId) {
      toast.error("Please select a course");
      return;
    }

    try {
      await setAccessDuration({ enrollmentId, duration }).unwrap();
      toast.success("Access duration set!");
      setEnrollmentId("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to set access");
    }
  };

  const handleExtend = async () => {
    if (!userId.trim() || !enrollmentId) {
      toast.error("Please select a course");
      return;
    }

    try {
      await extendAccess({ enrollmentId, newDuration: extendDuration }).unwrap();
      toast.success(`Access extended to ${extendDuration}!`);
      setEnrollmentId("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to extend access");
    }
  };

  const handleReduce = async () => {
    if (!userId.trim() || !enrollmentId) {
      toast.error("Please select a course");
      return;
    }

    try {
      await reduceAccess({ enrollmentId, newDuration: reduceDuration }).unwrap();
      toast.success(`Access reduced to ${reduceDuration}!`);
      setEnrollmentId("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reduce access");
    }
  };

  const renderCourseSelect = (selectedKeys: Set<string>, onChange: (id: string) => void) => (
    <Select
      label="Select Course"
      selectedKeys={selectedKeys}
      onSelectionChange={(keys) => {
        const next = Array.from(keys)[0];
        if (typeof next === "string") onChange(next);
      }}
    >
      {accesses.map((access) => (
        <SelectItem key={access._id} value={access._id}>
          {access.courseId?.title || "Unknown Course"}
        </SelectItem>
      ))}
    </Select>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Access Duration Manager</h1>
        <p className="text-default-500 mt-1">Manage student course access duration</p>
      </div>

      {/* User Selection Card */}
      <Card>
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-foreground">Search User</p>
            <p className="text-sm text-default-500">Enter user ID to view their course access</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          <Input
            placeholder="Enter user ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            isClearable
          />
        </CardBody>
      </Card>

      {/* Access Management Cards */}
      {userId && (
        <>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner label="Loading user's course access..." />
            </div>
          ) : (
            <>
              {accesses.length === 0 ? (
                <Alert color="warning">
                  No course access found for this user
                </Alert>
              ) : (
                <>
                  {/* User's Current Access */}
                  <Card>
                    <CardHeader>
                      <p className="text-lg font-semibold text-foreground">
                        {accesses.length} Course{accesses.length !== 1 ? "s" : ""} Found
                      </p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <Table>
                        <TableHeader>
                          <TableColumn>COURSE</TableColumn>
                          <TableColumn>STATUS</TableColumn>
                          <TableColumn>REMAINING DAYS</TableColumn>
                          <TableColumn>END DATE</TableColumn>
                          <TableColumn>PURCHASE TYPE</TableColumn>
                        </TableHeader>
                        <TableBody>
                          {accesses.map((access) => {
                            const isValid = hasValidAccess(access.accessEndDate);
                            const remaining = getRemainingDays(access.accessEndDate);

                            return (
                              <TableRow key={access._id}>
                                <TableCell>
                                  <p className="font-semibold text-foreground">
                                    {access.courseId?.title || "Unknown Course"}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <Badge color={isValid ? "success" : "danger"}>
                                    {isValid ? "Active" : "Expired"}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <p className="font-semibold">
                                    {access.accessEndDate ? remaining : "∞"}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <p className="text-sm">
                                    {access.accessEndDate
                                      ? formatDate(new Date(access.accessEndDate))
                                      : "Lifetime"}
                                  </p>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="flat">
                                    {access.purchaseType === "combo"
                                      ? "Combo"
                                      : "Single Course"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardBody>
                  </Card>

                  {/* Management Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Set Access Duration */}
                    <Card>
                      <CardHeader>
                        <p className="font-semibold text-foreground">Set Access Duration</p>
                      </CardHeader>
                      <Divider />
                      <CardBody className="gap-4">
                        {renderCourseSelect(
                          enrollmentId ? new Set([enrollmentId]) : new Set(),
                          setEnrollmentId
                        )}

                        <Select
                          label="Duration"
                          selectedKeys={new Set([duration])}
                          onSelectionChange={(keys) => {
                            const next = Array.from(keys)[0] as AccessDuration;
                            if (next) setDuration(next);
                          }}
                        >
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>

                        <Button
                          color="primary"
                          onPress={handleSetDuration}
                          fullWidth
                        >
                          Set Duration
                        </Button>
                      </CardBody>
                    </Card>

                    {/* Extend Access */}
                    <Card>
                      <CardHeader>
                        <p className="font-semibold text-foreground">Extend Access</p>
                      </CardHeader>
                      <Divider />
                      <CardBody className="gap-4">
                        {renderCourseSelect(
                          enrollmentId ? new Set([enrollmentId]) : new Set(),
                          setEnrollmentId
                        )}

                        <Select
                          label="New Duration"
                          selectedKeys={new Set([extendDuration])}
                          onSelectionChange={(keys) => {
                            const next = Array.from(keys)[0] as AccessDuration;
                            if (next) setExtendDuration(next);
                          }}
                        >
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>

                        <Button
                          color="success"
                          onPress={handleExtend}
                          fullWidth
                        >
                          Extend Access
                        </Button>
                      </CardBody>
                    </Card>

                    {/* Reduce Access */}
                    <Card>
                      <CardHeader>
                        <p className="font-semibold text-foreground">Reduce Access</p>
                      </CardHeader>
                      <Divider />
                      <CardBody className="gap-4">
                        {renderCourseSelect(
                          enrollmentId ? new Set([enrollmentId]) : new Set(),
                          setEnrollmentId
                        )}

                        <Select
                          label="New Duration"
                          selectedKeys={new Set([reduceDuration])}
                          onSelectionChange={(keys) => {
                            const next = Array.from(keys)[0] as AccessDuration;
                            if (next) setReduceDuration(next);
                          }}
                        >
                          {DURATION_OPTIONS.map((option) => (
                            <SelectItem key={option.key} value={option.key}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>

                        <Button
                          color="danger"
                          onPress={handleReduce}
                          fullWidth
                        >
                          Reduce Access
                        </Button>
                      </CardBody>
                    </Card>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
