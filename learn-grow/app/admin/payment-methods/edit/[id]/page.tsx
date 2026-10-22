"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
  Switch,
  Spinner,
} from "@nextui-org/react";
import { useRouter, useParams } from "next/navigation";
import {
  useGetPaymentMethodByIdQuery,
  useUpdatePaymentMethodMutation,
} from "@/redux/api/paymentApi";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

export default function EditPaymentMethodPage() {
  const router = useRouter();
  const params = useParams();
  const paymentId = params.id as string;

  const { data: response, isLoading: loading } = useGetPaymentMethodByIdQuery(paymentId, {
    skip: !paymentId,
  });
  const [updatePaymentMethod, { isLoading: updating }] = useUpdatePaymentMethodMutation();

  const [formData, setFormData] = useState({
    name: "bKash",
    customName: "",
    accountNumber: "",
    paymentNote: "",
    accountName: "",
    bankName: "",
    branchName: "",
    routingNumber: "",
    swiftCode: "",
    isActive: true,
  });

  const [showCustomName, setShowCustomName] = useState(false);

  const paymentMethod = response?.data;

  useEffect(() => {
    if (paymentMethod) {
      const predefinedMethods = ["bKash", "Nagad", "Rocket", "Bank Transfer"];
      const isCustom = !predefinedMethods.includes(paymentMethod.name);
      
      setShowCustomName(isCustom);
      setFormData({
        name: isCustom ? "Other" : paymentMethod.name,
        customName: isCustom ? paymentMethod.name : "",
        accountNumber: paymentMethod.accountNumber || "",
        paymentNote: paymentMethod.paymentNote || "",
        accountName: paymentMethod.accountName || "",
        bankName: paymentMethod.bankName || "",
        branchName: paymentMethod.branchName || "",
        routingNumber: paymentMethod.routingNumber || "",
        swiftCode: paymentMethod.swiftCode || "",
        isActive: paymentMethod.isActive ?? true,
      });
    }
  }, [paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountNumber || !formData.paymentNote) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (showCustomName && !formData.customName) {
      toast.error("Please enter a custom payment name");
      return;
    }

    const submitData = {
      ...formData,
      name: showCustomName ? formData.customName : formData.name,
    };

    try {
      await updatePaymentMethod({ id: paymentId, ...submitData }).unwrap();
      toast.success("Payment method updated successfully");
      router.push("/admin/payment-methods");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update payment method");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Loading payment method..." />
      </div>
    );
  }

  if (!paymentMethod) {
    return (
      <div className="p-8">
        <Card className="border-2 border-red-500">
          <CardBody className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Payment Method Not Found
            </h2>
            <Button color="primary" onPress={() => router.push("/admin/payment-methods")}>
              Back to Payment Methods
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Button
        variant="light"
        startContent={<FaArrowLeft />}
        onPress={() => router.push("/admin/payment-methods")}
        className="mb-6"
      >
        Back to Payment Methods
      </Button>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Edit Payment Method</h1>

        <Card>
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="Payment Name"
                placeholder="Select payment method"
                selectedKeys={[showCustomName ? "Other" : formData.name]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  if (selected === "Other") {
                    setShowCustomName(true);
                  } else {
                    setShowCustomName(false);
                    setFormData({ ...formData, name: selected, customName: "" });
                  }
                }}
                isRequired
                variant="bordered"
                description="Choose the payment gateway or bank"
              >
                <SelectItem key="bKash">bKash</SelectItem>
                <SelectItem key="Nagad">Nagad</SelectItem>
                <SelectItem key="Rocket">Rocket</SelectItem>
                <SelectItem key="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem key="Other">Other (Custom)</SelectItem>
              </Select>

              {showCustomName && (
                <Input
                  label="Custom Payment Name"
                  placeholder="Enter bank name or payment method"
                  value={formData.customName}
                  onValueChange={(val) => setFormData({ ...formData, customName: val })}
                  isRequired
                  variant="bordered"
                  description="Enter the name of the payment method (e.g., Dutch Bangla Bank, City Bank)"
                />
              )}

              <Input
                label="Account Number"
                placeholder="01XXXXXXXXX or Bank Account Number"
                value={formData.accountNumber}
                onValueChange={(val) => setFormData({ ...formData, accountNumber: val })}
                isRequired
                variant="bordered"
                description="Mobile wallet number or bank account number"
              />

              <Textarea
                label="Payment Note"
                placeholder="Send Money / Cash Out / NPSB / Bank Transfer"
                value={formData.paymentNote}
                onValueChange={(val) => setFormData({ ...formData, paymentNote: val })}
                isRequired
                variant="bordered"
                minRows={3}
                description="Instructions for users on how to complete the payment"
              />

              {/* Bank transfer details - these are shown to the customer as a
                  labelled block on the checkout page, so they are managed as
                  their own fields rather than inside the payment note. */}
              <div className="border-t border-gray-200 pt-5 mt-2">
                <h3 className="font-semibold text-gray-800 mb-1">
                  Bank Transfer Details
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Only used for bank transfers. Leave blank for mobile wallets.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Account Name"
                    placeholder="e.g. MD. JABED HOSEN"
                    value={formData.accountName}
                    onValueChange={(val) => setFormData({ ...formData, accountName: val })}
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    label="Account Number"
                    placeholder="e.g. 1070448410001"
                    value={formData.accountNumber}
                    onValueChange={(val) => setFormData({ ...formData, accountNumber: val })}
                    variant="bordered"
                    size="lg"
                    isRequired
                  />
                  <Input
                    label="Bank Name"
                    placeholder="e.g. BRAC Bank PLC"
                    value={formData.bankName}
                    onValueChange={(val) => setFormData({ ...formData, bankName: val })}
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    label="Branch Name"
                    placeholder="e.g. ASHULIA BRANCH"
                    value={formData.branchName}
                    onValueChange={(val) => setFormData({ ...formData, branchName: val })}
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    label="Routing Number"
                    placeholder="e.g. 060260222"
                    value={formData.routingNumber}
                    onValueChange={(val) => setFormData({ ...formData, routingNumber: val })}
                    variant="bordered"
                    size="lg"
                  />
                  <Input
                    label="SWIFT Code"
                    placeholder="e.g. BRAKBDDH"
                    value={formData.swiftCode}
                    onValueChange={(val) => setFormData({ ...formData, swiftCode: val })}
                    variant="bordered"
                    size="lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">Active Status</p>
                  <p className="text-sm text-gray-600">
                    Only active payment methods will be shown to users
                  </p>
                </div>
                <Switch
                  isSelected={formData.isActive}
                  onValueChange={(val) => setFormData({ ...formData, isActive: val })}
                  size="lg"
                />
              </div>

              {/* Preview */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Preview</h3>
                <div className="bg-white p-4 rounded border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {showCustomName ? (formData.customName || "Custom Payment") : formData.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        formData.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {formData.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold">Account:</span>{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {formData.accountNumber}
                    </code>
                  </p>
                  <p className="text-sm text-gray-600">{formData.paymentNote}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  color="primary"
                  type="submit"
                  size="lg"
                  isLoading={updating}
                  className="flex-1"
                >
                  Update Payment Method
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={() => router.push("/admin/payment-methods")}
                  isDisabled={updating}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
