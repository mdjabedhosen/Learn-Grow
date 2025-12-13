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
"[project]/components/Auth/LoginForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/input/dist/chunk-JZOL6GD7.mjs [app-ssr] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-ssr] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-46NETW2U.mjs [app-ssr] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-5ALFRFZW.mjs [app-ssr] (ecmascript) <export card_body_default as CardBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-J333S7JQ.mjs [app-ssr] (ecmascript) <export card_header_default as CardHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$divider$2f$dist$2f$chunk$2d$44JHHBS2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__divider_default__as__Divider$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/divider/dist/chunk-44JHHBS2.mjs [app-ssr] (ecmascript) <export divider_default as Divider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$link$2f$dist$2f$chunk$2d$FGDGYNYV$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__link_default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/link/dist/chunk-FGDGYNYV.mjs [app-ssr] (ecmascript) <export link_default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/authApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function LoginForm() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        phone: "",
        password: ""
    });
    const [login, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLoginMutation"])();
    const handleInputChange = (e)=>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleLogin = async ()=>{
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
                    user: {
                        id: "admin-1",
                        name: "Admin Tester",
                        role: "admin",
                        phone: "01706276447"
                    }
                },
                {
                    phone: "01711111111",
                    password: "teacher123",
                    user: {
                        id: "teacher-1",
                        name: "Teacher Rahman",
                        role: "teacher",
                        phone: "01711111111"
                    }
                },
                {
                    phone: "01722222222",
                    password: "student123",
                    user: {
                        id: "student-1",
                        name: "Student Ahmed",
                        student_name: "Student Ahmed",
                        role: "student",
                        phone: "01722222222"
                    }
                },
                {
                    phone: "01733333333",
                    password: "guardian123",
                    user: {
                        id: "guardian-1",
                        name: "Guardian Khan",
                        guardian_name: "Guardian Khan",
                        role: "guardian",
                        phone: "01733333333"
                    }
                }
            ];
            const matchedAccount = testAccounts.find((acc)=>acc.phone === formData.phone && acc.password === formData.password);
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
                            children: "Welcome Back"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/LoginForm.tsx",
                            lineNumber: 88,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm text-default-500",
                            children: "Login to your account"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/LoginForm.tsx",
                            lineNumber: 89,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Auth/LoginForm.tsx",
                    lineNumber: 87,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$divider$2f$dist$2f$chunk$2d$44JHHBS2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__divider_default__as__Divider$3e$__["Divider"], {}, void 0, false, {
                    fileName: "[project]/components/Auth/LoginForm.tsx",
                    lineNumber: 91,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                    className: "gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "Mobile Number",
                            placeholder: "Enter your mobile number",
                            name: "phone",
                            value: formData.phone,
                            onChange: handleInputChange
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/LoginForm.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                            label: "Password",
                            placeholder: "Enter your password",
                            name: "password",
                            type: "password",
                            value: formData.password,
                            onChange: handleInputChange
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/LoginForm.tsx",
                            lineNumber: 100,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                            color: "primary",
                            onPress: handleLogin,
                            isLoading: isLoading,
                            children: "Login"
                        }, void 0, false, {
                            fileName: "[project]/components/Auth/LoginForm.tsx",
                            lineNumber: 108,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center text-sm",
                            children: [
                                "Don't have an account? ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$link$2f$dist$2f$chunk$2d$FGDGYNYV$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__link_default__as__Link$3e$__["Link"], {
                                    href: "/register",
                                    children: "Register"
                                }, void 0, false, {
                                    fileName: "[project]/components/Auth/LoginForm.tsx",
                                    lineNumber: 112,
                                    columnNumber: 48
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Auth/LoginForm.tsx",
                            lineNumber: 111,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Auth/LoginForm.tsx",
                    lineNumber: 92,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/Auth/LoginForm.tsx",
            lineNumber: 86,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Auth/LoginForm.tsx",
        lineNumber: 85,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_3f3c78be._.js.map