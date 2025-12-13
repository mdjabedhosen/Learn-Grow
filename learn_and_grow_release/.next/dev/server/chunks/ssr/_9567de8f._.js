module.exports = [
"[project]/redux/api/authApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authApi",
    ()=>authApi,
    "useChangePasswordMutation",
    ()=>useChangePasswordMutation,
    "useDeleteUserMutation",
    ()=>useDeleteUserMutation,
    "useForgetPasswordMutation",
    ()=>useForgetPasswordMutation,
    "useGetAllUsersQuery",
    ()=>useGetAllUsersQuery,
    "useGetProfileQuery",
    ()=>useGetProfileQuery,
    "useLoginMutation",
    ()=>useLoginMutation,
    "useRegisterMutation",
    ()=>useRegisterMutation,
    "useResendOtpMutation",
    ()=>useResendOtpMutation,
    "useResetPasswordMutation",
    ()=>useResetPasswordMutation,
    "useSendOtpMutation",
    ()=>useSendOtpMutation,
    "useUpdateProfileMutation",
    ()=>useUpdateProfileMutation,
    "useVerifyOtpMutation",
    ()=>useVerifyOtpMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$baseApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/baseApi.ts [app-ssr] (ecmascript)");
;
const authApi = __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$baseApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["baseApi"].injectEndpoints({
    endpoints: (build)=>({
            sendOtp: build.mutation({
                query: (data)=>({
                        url: "/user/send-otp",
                        method: "POST",
                        body: data
                    })
            }),
            verifyOtp: build.mutation({
                query: (data)=>({
                        url: "/user/verify-sms",
                        method: "POST",
                        body: data
                    })
            }),
            register: build.mutation({
                query: (data)=>({
                        url: "/user/user-create",
                        method: "POST",
                        body: data
                    })
            }),
            login: build.mutation({
                query: (data)=>({
                        url: "/user/login",
                        method: "POST",
                        body: data
                    })
            }),
            changePassword: build.mutation({
                query: (data)=>({
                        url: "/user/change-password",
                        method: "POST",
                        body: data
                    })
            }),
            forgetPassword: build.mutation({
                query: (data)=>({
                        url: "/user/forget-password",
                        method: "POST",
                        body: data
                    })
            }),
            resetPassword: build.mutation({
                query: (data)=>({
                        url: "/user/reset-password",
                        method: "POST",
                        body: data
                    })
            }),
            resendOtp: build.mutation({
                query: (data)=>({
                        url: "/user/resend-otp",
                        method: "POST",
                        body: data
                    })
            }),
            getProfile: build.query({
                query: ()=>"/user/profile",
                providesTags: [
                    "User"
                ]
            }),
            updateProfile: build.mutation({
                query: (data)=>({
                        url: "/user/update-profile",
                        method: "PATCH",
                        body: data
                    }),
                invalidatesTags: [
                    "User"
                ]
            }),
            getAllUsers: build.query({
                query: ()=>"/user/all-users",
                providesTags: [
                    "User"
                ]
            }),
            deleteUser: build.mutation({
                query: (id)=>({
                        url: `/user/delete-user/${id}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "User"
                ]
            })
        })
});
const { useSendOtpMutation, useVerifyOtpMutation, useRegisterMutation, useLoginMutation, useChangePasswordMutation, useForgetPasswordMutation, useResetPasswordMutation, useResendOtpMutation, useGetProfileQuery, useUpdateProfileMutation, useGetAllUsersQuery, useDeleteUserMutation } = authApi;
}),
"[project]/components/Auth/RegistrationForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RegistrationForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/input/dist/chunk-JZOL6GD7.mjs [app-ssr] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-ssr] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$select$2f$dist$2f$chunk$2d$7H6JMIKS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/select/dist/chunk-7H6JMIKS.mjs [app-ssr] (ecmascript) <export select_default as Select>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$select$2f$node_modules$2f40$nextui$2d$org$2f$listbox$2f$dist$2f$chunk$2d$VHPYXGWP$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/select/node_modules/@nextui-org/listbox/dist/chunk-VHPYXGWP.mjs [app-ssr] (ecmascript) <export listbox_item_base_default as SelectItem>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-46NETW2U.mjs [app-ssr] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-5ALFRFZW.mjs [app-ssr] (ecmascript) <export card_body_default as CardBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-J333S7JQ.mjs [app-ssr] (ecmascript) <export card_header_default as CardHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$divider$2f$dist$2f$chunk$2d$44JHHBS2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__divider_default__as__Divider$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/divider/dist/chunk-44JHHBS2.mjs [app-ssr] (ecmascript) <export divider_default as Divider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/authApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function RegistrationForm() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [country, setCountry] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("BD"); // BD = Bangladesh, MY = Malaysia, IT = Italy
    const [serviceSid, setServiceSid] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        phone: "",
        otp: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    // Country codes mapping
    const countryData = {
        BD: {
            name: "Bangladesh",
            code: "+880",
            flag: "🇧🇩",
            placeholder: "01XXXXXXXXX"
        },
        MY: {
            name: "Malaysia",
            code: "+60",
            flag: "🇲🇾",
            placeholder: "12XXXXXXXX"
        },
        IT: {
            name: "Italy",
            code: "+39",
            flag: "🇮🇹",
            placeholder: "3XXXXXXXXX"
        }
    };
    const [sendOtp, { isLoading: isSendingOtp }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSendOtpMutation"])();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useVerifyOtpMutation"])();
    const [register, { isLoading: isRegistering }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRegisterMutation"])();
    const handleInputChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSendOtp = async ()=>{
        try {
            const selectedCountry = countryData[country];
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
            const result = await sendOtp({
                phone: formattedPhone
            }).unwrap();
            // Store the Service SID for verification
            if (result.data) {
                setServiceSid(result.data);
            }
            // Update form with formatted phone
            setFormData({
                ...formData,
                phone: formattedPhone
            });
            alert(`OTP sent successfully to ${formattedPhone} (${selectedCountry.flag} ${selectedCountry.name})! Check your phone.`);
        } catch (error) {
            const errorMsg = error?.data?.message || error?.error || error?.message || 'Unknown error';
            alert(`Failed to send OTP: ${errorMsg}`);
        }
    };
    const handleVerifyOtp = async ()=>{
        try {
            await verifyOtp({
                phone: formData.phone,
                otp: formData.otp,
                verifyServiceSid: serviceSid
            }).unwrap();
            setStep(2);
        } catch (error) {
            alert(`Invalid OTP: ${error?.data?.message || error?.message || 'Please try again'}`);
        }
    };
    const handleRegister = async ()=>{
        try {
            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            };
            console.log('Registering user:', payload);
            const result = await register(payload).unwrap();
            console.log('Registration result:', result);
            alert("Registration successful!");
            router.push("/auth/login");
        } catch (error) {
            console.error("Registration failed", error);
            alert(`Registration failed: ${error?.data?.message || error?.message || 'Unknown error'}`);
        }
    };
    const selectedCountry = countryData[country];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex justify-center items-center min-h-screen bg-gray-100 p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
            className: "w-full max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__["CardHeader"], {
                    className: "flex flex-col gap-1 items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold",
                            children: "Create Account"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                            lineNumber: 122,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-default-500",
                            children: [
                                "Step ",
                                step,
                                " of 3"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                            lineNumber: 123,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                    lineNumber: 121,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$divider$2f$dist$2f$chunk$2d$44JHHBS2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__divider_default__as__Divider$3e$__["Divider"], {}, void 0, false, {
                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                    lineNumber: 125,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                    className: "gap-4",
                    children: [
                        step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$select$2f$dist$2f$chunk$2d$7H6JMIKS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__select_default__as__Select$3e$__["Select"], {
                                    label: "Country",
                                    placeholder: "Select Country",
                                    selectedKeys: [
                                        country
                                    ],
                                    onChange: (e)=>setCountry(e.target.value),
                                    startContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xl",
                                        children: selectedCountry.flag
                                    }, void 0, false, {
                                        fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                        lineNumber: 134,
                                        columnNumber: 47
                                    }, void 0),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$select$2f$node_modules$2f40$nextui$2d$org$2f$listbox$2f$dist$2f$chunk$2d$VHPYXGWP$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                            value: "BD",
                                            children: "🇧🇩 Bangladesh (+880)"
                                        }, "BD", false, {
                                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                            lineNumber: 136,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$select$2f$node_modules$2f40$nextui$2d$org$2f$listbox$2f$dist$2f$chunk$2d$VHPYXGWP$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                            value: "MY",
                                            children: "🇲🇾 Malaysia (+60)"
                                        }, "MY", false, {
                                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                            lineNumber: 139,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$select$2f$node_modules$2f40$nextui$2d$org$2f$listbox$2f$dist$2f$chunk$2d$VHPYXGWP$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__listbox_item_base_default__as__SelectItem$3e$__["SelectItem"], {
                                            value: "IT",
                                            children: "🇮🇹 Italy (+39)"
                                        }, "IT", false, {
                                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                            lineNumber: 142,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 129,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Mobile Number",
                                    placeholder: selectedCountry.placeholder,
                                    name: "phone",
                                    value: formData.phone,
                                    onChange: handleInputChange,
                                    description: `We'll add ${selectedCountry.code} if needed`,
                                    startContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-default-500",
                                        children: selectedCountry.code
                                    }, void 0, false, {
                                        fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                        lineNumber: 154,
                                        columnNumber: 47
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 147,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "primary",
                                    onPress: handleSendOtp,
                                    isLoading: isSendingOtp,
                                    children: "Send OTP"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 157,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "OTP",
                                    placeholder: "Enter the 6-digit OTP",
                                    name: "otp",
                                    value: formData.otp,
                                    onChange: handleInputChange
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 161,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "secondary",
                                    onPress: handleVerifyOtp,
                                    isLoading: isVerifyingOtp,
                                    children: "Verify & Next"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 169,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                            lineNumber: 128,
                            columnNumber: 25
                        }, this),
                        step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Full Name",
                                    placeholder: "Enter full name",
                                    name: "name",
                                    value: formData.name,
                                    onChange: handleInputChange,
                                    isRequired: true
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 177,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Email",
                                    placeholder: "Enter email address",
                                    name: "email",
                                    type: "email",
                                    value: formData.email,
                                    onChange: handleInputChange,
                                    isRequired: true
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 186,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "primary",
                                    onPress: ()=>setStep(3),
                                    children: "Next"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 196,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                            lineNumber: 176,
                            columnNumber: 25
                        }, this),
                        step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Password",
                                    placeholder: "Create a strong password",
                                    name: "password",
                                    type: "password",
                                    value: formData.password,
                                    onChange: handleInputChange,
                                    isRequired: true
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 204,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                    label: "Confirm Password",
                                    placeholder: "Confirm your password",
                                    name: "confirmPassword",
                                    type: "password",
                                    value: formData.confirmPassword,
                                    onChange: handleInputChange,
                                    isRequired: true
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 213,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "success",
                                    onPress: handleRegister,
                                    isLoading: isRegistering,
                                    children: "Complete Registration"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 222,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    variant: "light",
                                    onPress: ()=>setStep(2),
                                    children: "Back"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                                    lineNumber: 225,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Auth/RegistrationForm.tsx",
                            lineNumber: 203,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Auth/RegistrationForm.tsx",
                    lineNumber: 126,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Auth/RegistrationForm.tsx",
            lineNumber: 120,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Auth/RegistrationForm.tsx",
        lineNumber: 119,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_9567de8f._.js.map