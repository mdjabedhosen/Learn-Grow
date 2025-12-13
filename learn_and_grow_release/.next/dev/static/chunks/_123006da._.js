(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/redux/api/courseApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "courseApi",
    ()=>courseApi,
    "useCreateCourseMutation",
    ()=>useCreateCourseMutation,
    "useDeleteCourseMutation",
    ()=>useDeleteCourseMutation,
    "useGetAllCoursesQuery",
    ()=>useGetAllCoursesQuery,
    "useGetCourseByIdQuery",
    ()=>useGetCourseByIdQuery,
    "useUpdateCourseMutation",
    ()=>useUpdateCourseMutation,
    "useUpdateCourseStatusMutation",
    ()=>useUpdateCourseStatusMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$baseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/baseApi.ts [app-client] (ecmascript)");
;
const courseApi = __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$baseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["baseApi"].injectEndpoints({
    endpoints: (build)=>({
            getAllCourses: build.query({
                query: ()=>"/course/get-all-courses",
                providesTags: [
                    "Course"
                ]
            }),
            getCourseById: build.query({
                query: (id)=>`/course/get-single-course/${id}`,
                providesTags: (result, error, id)=>[
                        {
                            type: "Course",
                            id
                        }
                    ]
            }),
            createCourse: build.mutation({
                query: (data)=>({
                        url: "/course/create-course",
                        method: "POST",
                        body: data
                    }),
                invalidatesTags: [
                    "Course"
                ]
            }),
            updateCourse: build.mutation({
                query: ({ id, ...data })=>({
                        url: `/course/update-course/${id}`,
                        method: "PATCH",
                        body: data
                    }),
                invalidatesTags: [
                    "Course"
                ]
            }),
            deleteCourse: build.mutation({
                query: (id)=>({
                        url: `/course/delete-course/${id}`,
                        method: "DELETE"
                    }),
                invalidatesTags: [
                    "Course"
                ]
            }),
            updateCourseStatus: build.mutation({
                query: ({ id, status })=>({
                        url: `/course/update-status/${id}`,
                        method: "PATCH",
                        body: {
                            status
                        }
                    }),
                invalidatesTags: [
                    "Course"
                ]
            })
        })
});
const { useGetAllCoursesQuery, useGetCourseByIdQuery, useCreateCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation, useUpdateCourseStatusMutation } = courseApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/courses/CourseList.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CourseList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-46NETW2U.mjs [app-client] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-5ALFRFZW.mjs [app-client] (ecmascript) <export card_body_default as CardBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$JHUBASYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-JHUBASYZ.mjs [app-client] (ecmascript) <export card_footer_default as CardFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$image$2f$dist$2f$chunk$2d$VKW4DPLJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/image/dist/chunk-VKW4DPLJ.mjs [app-client] (ecmascript) <export image_default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/chip/dist/chunk-4WFLSIHH.mjs [app-client] (ecmascript) <export chip_default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$courseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/courseApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function CourseList() {
    _s();
    const { data, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$courseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllCoursesQuery"])({});
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [language] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("bn");
    // Placeholder data for offline mode - SAME AS HOMEPAGE to ensure consistency
    const sampleCourses = [
        {
            _id: "1",
            title: "Arduino দিয়ে রোবটিক্স",
            title_en: "Arduino Robotics",
            subtitle: "আমার রোবট তৈরি করুন ও ইলেকট্রনিক্স শিখুন",
            description: "Arduino ব্যবহার করে আমার রোবট তৈরির মাধ্যমে রোবটিক্স এবং ইলেকট্রনিক্সের মূল বিষয়গুলো আয়ত্ত করুন। শিক্ষার্থীরা...",
            description_en: "Master robotics and electronics fundamentals by building your own robot with Arduino",
            price: 3500,
            duration: "8 weeks",
            ageRange: "10-16 years",
            level: "Beginner",
            img: "https://images.unsplash.com/photo-1535378433864-ed1c29cee23d?q=80&w=1000&auto=format&fit=crop",
            features: [
                "লাইভ ইন্টারঅ্যাক্টিভ লেকচারিং (সন্ধ্যা সময়)",
                "Arduino Uno কিট র্যাসবেরি পাই",
                "ধাপে ধাপে প্রজেক্ট গাইড"
            ]
        },
        {
            _id: "2",
            title: "Python ও AI দিয়ে কোডিং",
            title_en: "Python & AI Coding",
            subtitle: "Python আয়ত্ত করুন ও AI আপ্লিকেশন তৈরি করুন",
            description: "সুন্দা থেকে Python প্রোগ্রামিং শিখুন এবং আর্টিফিশিয়াল ইন্টেলিজেন্সে তৈরি দিন। আমার AI টুল ও লাইব্রেরির ব্যবহার করে...",
            description_en: "Learn Python from scratch and dive into AI. Build real projects with AI tools",
            price: 4500,
            duration: "10 weeks",
            ageRange: "12-18 years",
            level: "Intermediate",
            img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop",
            features: [
                "লাইভ কোডিং সেশন (সন্ধ্যা সময়)",
                "ইন্টারঅ্যাক্টিভ কোডিং চ্যালেঞ্জ",
                "৫০+ হ্যান্ড-অন প্রজেক্ট"
            ]
        },
        {
            _id: "3",
            title: "কোডারদের জন্য গণিত",
            title_en: "Math for Coders",
            subtitle: "কোডিংয়ের মাধ্যমে গণিত মজাদার করুন",
            description: "আবিষ্কার করুন কীভাবে গণিত সব প্রযুক্তিকে চালিত করে। ইন্টার অ্যাক্টিভ কোডিং প্রজেক্টের মাধ্যমে গাণিতিক ধারণা শিখুন...",
            description_en: "Discover how math powers all technology through interactive coding projects",
            price: 2500,
            duration: "6 weeks",
            ageRange: "10-15 years",
            level: "Beginner",
            img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000&auto=format&fit=crop",
            features: [
                "জিরোজেরো থেকে ইন্টারমিডিয়েট পর্যা",
                "গেম ো আনিমেশনের মাধ্যমে শিক্ষা",
                "সাপ্তাহিক চ্যালেঞ্জ প্রব্লেম"
            ]
        },
        {
            _id: "4",
            title: "বাস্তব সাইয়া ল্যাব",
            title_en: "Practical Science Lab",
            subtitle: "হাতে-কলমে বিজ্ঞান পরীক্ষা",
            description: "আপনার বাড়িতে একটি সাইয়া ল্যাবের পরিবেশ করুন। উত্তেজনাপূর্ণ পরীক্ষা-নিরীক্ষা করুন, বৈজ্ঞানিক পদ্ধতি শিখুন...",
            description_en: "Turn your home into a science lab! Conduct exciting experiments and learn scientific methods",
            price: 3000,
            duration: "4 weeks",
            ageRange: "8-14 years",
            level: "Beginner",
            img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
            features: [
                "পরীক্ষা কিট বাসায় ডেলিভারি",
                "লাইভ পরীক্ষা দেখুন",
                "ধাপে ধাপে ভিডিও গাইড"
            ]
        }
    ];
    // Always show sample courses (don't wait for API in production)
    const courses = data?.data || sampleCourses;
    // Shadows mapping for visual variety (cycling through based on index) - reused from homepage
    const shadows = [
        "hover:shadow-glow-primary",
        "hover:shadow-glow-accent",
        "hover:shadow-glow-secondary",
        "hover:shadow-xl"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4",
        children: courses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "col-span-full text-center py-20",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-6xl mb-4",
                    children: "📚"
                }, void 0, false, {
                    fileName: "[project]/components/courses/CourseList.tsx",
                    lineNumber: 104,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-2xl font-bold text-gray-700",
                    children: "No courses found"
                }, void 0, false, {
                    fileName: "[project]/components/courses/CourseList.tsx",
                    lineNumber: 105,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-500",
                    children: "Please check back later for new programs!"
                }, void 0, false, {
                    fileName: "[project]/components/courses/CourseList.tsx",
                    lineNumber: 106,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/courses/CourseList.tsx",
            lineNumber: 103,
            columnNumber: 17
        }, this) : courses.map((course, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                className: `group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${shadows[index % shadows.length]} shadow-card border-0`,
                isPressable: true,
                onPress: ()=>router.push(`/courses/${course._id}`),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative h-48 overflow-hidden w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$image$2f$dist$2f$chunk$2d$VKW4DPLJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__["Image"], {
                                removeWrapper: true,
                                alt: course.title,
                                className: "z-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                                src: course.img || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 118,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-gradient-to-t from-blue-900/50 via-blue-900/20 to-transparent z-10"
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 125,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-4 left-4 z-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                    color: "primary",
                                    size: "sm",
                                    variant: "flat",
                                    className: "bg-white/90 text-primary-700 font-bold shadow-sm",
                                    children: course.level
                                }, void 0, false, {
                                    fileName: "[project]/components/courses/CourseList.tsx",
                                    lineNumber: 128,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 127,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/courses/CourseList.tsx",
                        lineNumber: 117,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold text-gray-900 mb-2 ${language === "bn" ? "font-siliguri" : ""}`,
                                children: course.title
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 136,
                                columnNumber: 29
                            }, this),
                            course.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-primary-600 text-sm font-semibold mb-3 ${language === "bn" ? "font-siliguri" : ""}`,
                                children: course.subtitle
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 142,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-gray-600 text-sm mb-4 line-clamp-3 ${language === "bn" ? "font-siliguri" : ""}`,
                                children: course.description
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 148,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 mb-4",
                                children: [
                                    course.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 text-sm text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "⏱️"
                                            }, void 0, false, {
                                                fileName: "[project]/components/courses/CourseList.tsx",
                                                lineNumber: 156,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: language === "bn" ? "font-siliguri" : "",
                                                children: course.duration
                                            }, void 0, false, {
                                                fileName: "[project]/components/courses/CourseList.tsx",
                                                lineNumber: 157,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/courses/CourseList.tsx",
                                        lineNumber: 155,
                                        columnNumber: 37
                                    }, this),
                                    course.ageRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 text-sm text-gray-600",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "👥"
                                            }, void 0, false, {
                                                fileName: "[project]/components/courses/CourseList.tsx",
                                                lineNumber: 162,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: language === "bn" ? "font-siliguri" : "",
                                                children: course.ageRange
                                            }, void 0, false, {
                                                fileName: "[project]/components/courses/CourseList.tsx",
                                                lineNumber: 163,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/courses/CourseList.tsx",
                                        lineNumber: 161,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 153,
                                columnNumber: 29
                            }, this),
                            course.features && course.features.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "space-y-2 mb-4",
                                children: course.features.slice(0, 2).map((feature, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-2 text-sm text-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green-500 mt-0.5",
                                                children: "✓"
                                            }, void 0, false, {
                                                fileName: "[project]/components/courses/CourseList.tsx",
                                                lineNumber: 173,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "line-clamp-1",
                                                children: feature
                                            }, void 0, false, {
                                                fileName: "[project]/components/courses/CourseList.tsx",
                                                lineNumber: 174,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/courses/CourseList.tsx",
                                        lineNumber: 172,
                                        columnNumber: 41
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 170,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/courses/CourseList.tsx",
                        lineNumber: 134,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$JHUBASYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__["CardFooter"], {
                        className: "p-6 pt-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                            className: "w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-md hover:shadow-lg transition-shadow",
                            size: "lg",
                            onPress: ()=>router.push(`/courses/${course._id}`),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: language === "bn" ? "font-siliguri" : "",
                                children: language === "en" ? "Enroll Now →" : "বিস্তারিত দেখুন →"
                            }, void 0, false, {
                                fileName: "[project]/components/courses/CourseList.tsx",
                                lineNumber: 187,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/courses/CourseList.tsx",
                            lineNumber: 182,
                            columnNumber: 29
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/courses/CourseList.tsx",
                        lineNumber: 181,
                        columnNumber: 25
                    }, this)
                ]
            }, course._id, true, {
                fileName: "[project]/components/courses/CourseList.tsx",
                lineNumber: 110,
                columnNumber: 21
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/courses/CourseList.tsx",
        lineNumber: 101,
        columnNumber: 9
    }, this);
}
_s(CourseList, "OqCZXdKgmSypNpmv3LLcwOK4adU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$courseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllCoursesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CourseList;
var _c;
__turbopack_context__.k.register(_c, "CourseList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_123006da._.js.map