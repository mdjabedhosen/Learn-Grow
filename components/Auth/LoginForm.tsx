"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody, CardHeader, Divider, Link } from "@nextui-org/react";
import { useLoginMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const [login, { isLoading }] = useLoginMutation();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        try {
            const result = await login(formData).unwrap();
            console.log("API Login Result:", result);

            if (result.data?.accessToken) {
                localStorage.setItem("token", result.data.accessToken);
                if (result.data?.user) {
                    localStorage.setItem("user", JSON.stringify(result.data.user));
                }
                alert("Login successful!");
                router.push("/dashboard");
            } else {
                console.error("Token structure mismatch", result);
                throw new Error("Invalid response structure");
            }
        } catch (error) {
            console.error("Login failed", error);

            // FALLBACK FOR TESTING (If API is down) - 4 TEST ACCOUNTS
            const testAccounts = [
                {
                    phone: "01706276447",
                    password: "@M.jabed3834",
                    user: { id: "admin-1", name: "Admin Tester", role: "admin", phone: "01706276447" }
                },
                {
                    phone: "01711111111",
                    password: "teacher123",
                    user: { id: "teacher-1", name: "Teacher Rahman", role: "teacher", phone: "01711111111" }
                },
                {
                    phone: "01722222222",
                    password: "student123",
                    user: { id: "student-1", name: "Student Ahmed", student_name: "Student Ahmed", role: "student", phone: "01722222222" }
                },
                {
                    phone: "01733333333",
                    password: "guardian123",
                    user: { id: "guardian-1", name: "Guardian Khan", guardian_name: "Guardian Khan", role: "guardian", phone: "01733333333" }
                }
            ];

            const matchedAccount = testAccounts.find(
                acc => acc.phone === formData.phone && acc.password === formData.password
            );

            if (matchedAccount) {
                console.warn(`Using MOCK LOGIN as ${matchedAccount.user.role.toUpperCase()} for testing due to API failure`);
                const mockToken = "mock-jwt-token-for-testing-" + Date.now();

                localStorage.setItem("token", mockToken);
                localStorage.setItem("user", JSON.stringify(matchedAccount.user));

                alert(`⚠️ LOGGED IN AS ${matchedAccount.user.role.toUpperCase()} (Mock Mode)\nSome features requiring backend might not work.`);
                window.location.href = "/dashboard";
                return;
            }

            alert("Login failed. Check console for details.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col gap-1 items-center">
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-default-500">Login to your account</p>
                </CardHeader>
                <Divider />
                <CardBody className="gap-4">
                    <Input
                        label="Mobile Number"
                        placeholder="Enter your mobile number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    <Button color="primary" onPress={handleLogin} isLoading={isLoading}>
                        Login
                    </Button>
                    <div className="text-center text-sm">
                        Don't have an account? <Link href="/register">Register</Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
