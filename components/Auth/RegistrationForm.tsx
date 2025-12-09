"use client";

import React, { useState } from "react";
import {
    Input,
    Button,
    Select,
    SelectItem,
    Card,
    CardBody,
    CardHeader,
    Divider,
} from "@nextui-org/react";
import { useSendOtpMutation, useVerifyOtpMutation, useRegisterMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";

export default function RegistrationForm() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [country, setCountry] = useState("BD"); // BD = Bangladesh, MY = Malaysia, IT = Italy
    const [formData, setFormData] = useState({
        phone: "",
        otp: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Country codes mapping
    const countryData = {
        BD: { name: "Bangladesh", code: "+880", flag: "🇧🇩", placeholder: "01XXXXXXXXX" },
        MY: { name: "Malaysia", code: "+60", flag: "🇲🇾", placeholder: "12XXXXXXXX" },
        IT: { name: "Italy", code: "+39", flag: "🇮🇹", placeholder: "3XXXXXXXXX" },
    };

    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
    const [register, { isLoading: isRegistering }] = useRegisterMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        try {
            const selectedCountry = countryData[country as keyof typeof countryData];
            let formattedPhone = formData.phone.trim();

            // Remove any spaces, dashes, or parentheses
            formattedPhone = formattedPhone.replace(/[\s\-()]/g, '');

            // Add country code if it doesn't have one
            if (!formattedPhone.startsWith('+')) {
                // Remove leading 0 if present (common in BD, MY, IT)
                if (formattedPhone.startsWith('0')) {
                    formattedPhone = formattedPhone.substring(1);
                }
                // Add the selected country code
                formattedPhone = selectedCountry.code + formattedPhone;
            }

            console.log('Selected country:', selectedCountry.name, selectedCountry.code);
            console.log('Sending OTP to:', formattedPhone);

            const result = await sendOtp({ phone: formattedPhone }).unwrap();
            console.log('OTP Response:', result);

            // Update form with formatted phone
            setFormData({ ...formData, phone: formattedPhone });

            alert(`OTP sent successfully to ${formattedPhone} (${selectedCountry.flag} ${selectedCountry.name})! Check your phone.`);
        } catch (error: any) {
            console.error('Failed to send OTP:', error);
            console.error('Error details:', {
                status: error?.status,
                data: error?.data,
                message: error?.data?.message || error?.message
            });
            alert(`Failed to send OTP: ${error?.data?.message || error?.message || 'Unknown error'}`);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await verifyOtp({ phone: formData.phone, otp: formData.otp }).unwrap();
            setStep(2);
        } catch (error: any) {
            console.error("Invalid OTP", error);
            alert(`Invalid OTP: ${error?.data?.message || error?.message || 'Please try again'}`);
        }
    };

    const handleRegister = async () => {
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            };

            console.log('Registering user:', payload);
            const result = await register(payload).unwrap();
            console.log('Registration result:', result);

            alert("Registration successful!");
            router.push("/auth/login");
        } catch (error: any) {
            console.error("Registration failed", error);
            alert(`Registration failed: ${error?.data?.message || error?.message || 'Unknown error'}`);
        }
    };

    const selectedCountry = countryData[country as keyof typeof countryData];

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col gap-1 items-center">
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-sm text-default-500">Step {step} of 3</p>
                </CardHeader>
                <Divider />
                <CardBody className="gap-4">
                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <Select
                                label="Country"
                                placeholder="Select Country"
                                selectedKeys={[country]}
                                onChange={(e) => setCountry(e.target.value)}
                                startContent={<span className="text-xl">{selectedCountry.flag}</span>}
                            >
                                <SelectItem key="BD" value="BD">
                                    🇧🇩 Bangladesh (+880)
                                </SelectItem>
                                <SelectItem key="MY" value="MY">
                                    🇲🇾 Malaysia (+60)
                                </SelectItem>
                                <SelectItem key="IT" value="IT">
                                    🇮🇹 Italy (+39)
                                </SelectItem>
                            </Select>

                            <Input
                                label="Mobile Number"
                                placeholder={selectedCountry.placeholder}
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                description={`We'll add ${selectedCountry.code} if needed`}
                                startContent={<span className="text-xs text-default-500">{selectedCountry.code}</span>}
                            />

                            <Button color="primary" onPress={handleSendOtp} isLoading={isSendingOtp}>
                                Send OTP
                            </Button>

                            <Input
                                label="OTP"
                                placeholder="Enter the 6-digit OTP"
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                            />

                            <Button color="secondary" onPress={handleVerifyOtp} isLoading={isVerifyingOtp}>
                                Verify & Next
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Full Name"
                                placeholder="Enter full name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                isRequired
                            />

                            <Input
                                label="Email"
                                placeholder="Enter email address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                isRequired
                            />

                            <Button color="primary" onPress={() => setStep(3)}>
                                Next
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Password"
                                placeholder="Create a strong password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                isRequired
                            />
                            <Input
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                isRequired
                            />
                            <Button color="success" onPress={handleRegister} isLoading={isRegistering}>
                                Complete Registration
                            </Button>
                            <Button variant="light" onPress={() => setStep(2)}>
                                Back
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
