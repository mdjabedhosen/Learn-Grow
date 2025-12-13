(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/educatorsData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "defaultEducatorsData",
    ()=>defaultEducatorsData
]);
const defaultEducatorsData = [
    {
        imageURL: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
        name: "Muhammad Jabed",
        email: "jabed@learnandgrow.io",
        designation: "Lead Instructor",
        role: "tutor"
    },
    {
        imageURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
        name: "Kolpona Akter",
        email: "kolpona@learnandgrow.io",
        designation: "Senior Lecturer",
        role: "tutor"
    },
    {
        imageURL: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop",
        name: "Sarah Ahmed",
        email: "sarah@learnandgrow.io",
        designation: "Curriculum Head",
        role: "tutor"
    },
    {
        imageURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
        name: "Ronnie Wood",
        email: "ronnie@learnandgrow.io",
        designation: "Robotics Expert",
        role: "tutor"
    },
    {
        imageURL: "https://images.unsplash.com/photo-1558898479-33c0057a5d12?q=80&w=400&auto=format&fit=crop",
        name: "Sang Kim",
        email: "sang@learnandgrow.io",
        designation: "AI Specialist",
        role: "tutor"
    },
    {
        imageURL: "https://images.unsplash.com/photo-1590650516494-0c8e4a4dd67e?q=80&w=400&auto=format&fit=crop",
        name: "Linda Schafer",
        email: "linda@learnandgrow.io",
        designation: "Python Tutor",
        role: "tutor"
    }
];
;
const __TURBOPACK__default__export__ = defaultEducatorsData;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/redux/api/siteContentApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "siteContentApi",
    ()=>siteContentApi,
    "useGetSiteContentQuery",
    ()=>useGetSiteContentQuery,
    "useUpdateSiteContentMutation",
    ()=>useUpdateSiteContentMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$baseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/baseApi.ts [app-client] (ecmascript)");
;
const siteContentApi = __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$baseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["baseApi"].injectEndpoints({
    endpoints: (build)=>({
            getSiteContent: build.query({
                query: (page)=>({
                        url: `/site-content/${page}`,
                        method: "GET"
                    }),
                providesTags: [
                    "SiteContent"
                ]
            }),
            updateSiteContent: build.mutation({
                query: (data)=>({
                        url: "/site-content",
                        method: "POST",
                        body: data
                    }),
                invalidatesTags: [
                    "SiteContent"
                ]
            })
        })
});
const { useGetSiteContentQuery, useUpdateSiteContentMutation } = siteContentApi;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/Educators.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/autoplay.mjs [app-client] (ecmascript) <export default as Autoplay>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$pi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/pi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$educatorsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/educatorsData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$siteContentApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/siteContentApi.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const Educators = ()=>{
    _s();
    const { data: apiData, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$siteContentApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetSiteContentQuery"])("educators");
    // Use API data if available, otherwise default
    const educators = apiData?.data?.content && apiData.data.content.length > 0 ? apiData.data.content : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$educatorsData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultEducatorsData"];
    if (isLoading) return null; // Or skeleton
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-10 px-6 bg-gradient-to-b from-white to-gray-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto max-w-7xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-primary-600 font-semibold text-sm uppercase tracking-wide mb-2",
                            children: "The Team"
                        }, void 0, false, {
                            fileName: "[project]/components/Educators.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-4xl md:text-5xl font-black text-gray-900",
                            children: "Our Educators"
                        }, void 0, false, {
                            fileName: "[project]/components/Educators.tsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Educators.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Swiper"], {
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                            spaceBetween: 20
                        },
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 30
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 40
                        }
                    },
                    className: "!pb-10",
                    loop: true,
                    modules: [
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__["Autoplay"]
                    ],
                    slidesPerView: 1,
                    spaceBetween: 30,
                    children: educators.length > 0 && educators.map((educator, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                            className: "h-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 h-full flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center mb-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            alt: `${educator.name}'s profile`,
                                            className: "w-32 h-32 rounded-full object-cover border-4 border-primary-100",
                                            height: 120,
                                            src: educator.imageURL,
                                            width: 120
                                        }, void 0, false, {
                                            fileName: "[project]/components/Educators.tsx",
                                            lineNumber: 79,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/Educators.tsx",
                                        lineNumber: 78,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center space-y-4 flex-grow flex flex-col items-center w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xl font-bold text-gray-900",
                                                children: educator.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/Educators.tsx",
                                                lineNumber: 91,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "flex items-center justify-center gap-2 text-gray-600 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdEmail"], {
                                                        className: "text-primary-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Educators.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    educator.email
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Educators.tsx",
                                                lineNumber: 96,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$pi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PiCertificateFill"], {
                                                        className: "text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Educators.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: educator.designation
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Educators.tsx",
                                                        lineNumber: 104,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Educators.tsx",
                                                lineNumber: 102,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-center gap-3 pt-4 mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        "aria-label": "GitHub",
                                                        className: "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-900 hover:text-white transition-all duration-300",
                                                        href: "#",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaGithub"], {
                                                            className: "text-lg"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Educators.tsx",
                                                            lineNumber: 114,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Educators.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        "aria-label": "Dribbble",
                                                        className: "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-pink-500 hover:text-white transition-all duration-300",
                                                        href: "#",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaDribbble"], {
                                                            className: "text-lg"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Educators.tsx",
                                                            lineNumber: 121,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Educators.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        "aria-label": "Twitter",
                                                        className: "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-400 hover:text-white transition-all duration-300",
                                                        href: "#",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaTwitter"], {
                                                            className: "text-lg"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Educators.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Educators.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Educators.tsx",
                                                lineNumber: 108,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Educators.tsx",
                                        lineNumber: 89,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Educators.tsx",
                                lineNumber: 76,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, index, false, {
                            fileName: "[project]/components/Educators.tsx",
                            lineNumber: 75,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/components/Educators.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/Educators.tsx",
            lineNumber: 36,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/Educators.tsx",
        lineNumber: 35,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Educators, "HwsNKtVcUnEYZZR0/q56n/JAog8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$siteContentApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetSiteContentQuery"]
    ];
});
_c = Educators;
const __TURBOPACK__default__export__ = Educators;
var _c;
__turbopack_context__.k.register(_c, "Educators");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/content.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Bilingual Content System for Learn & Grow EdTech Platform
 * All website content in English and Bangla
 */ __turbopack_context__.s([
    "content",
    ()=>content,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const content = {
    // Hero Section
    hero: {
        en: {
            headline: "Learn Coding, Robotics & STEM",
            subheadline: "Built for Young Innovators of Bangladesh",
            description: "Join us to build the next generation of innovators! Our carefully crafted courses provide hands-on learning in programming, robotics, and game development, making learning fun and effective.",
            cta: {
                primary: "Start Learning",
                secondary: "Browse Courses"
            }
        },
        bn: {
            headline: "কোডিং, রোবটিক্স ও STEM শিখুন",
            subheadline: "বাংলাদেশের তরুণ উদ্ভাবকদের জন্য তৈরি",
            description: "পরবর্তী প্রজন্মের উদ্ভাবক তৈরিতে আমাদের সাথে যুক্ত হন! আমাদের বিশেষভাবে ডিজাইন করা কোর্সগুলো প্রোগ্রামিং, রোবটিক্স এবং গেম ডেভেলপমেন্টে হাতে-কলমে শেখার সুযোগ দেয়, যা শেখাকে মজাদার এবং কার্যকর করে তোলে।",
            cta: {
                primary: "শেখা শুরু করুন",
                secondary: "কোর্স ব্রাউজ করুন"
            }
        }
    },
    // Mission & Vision
    mission: {
        en: {
            title: "Our Mission & Vision",
            mission: "To empower young learners with robotics & coding skills that prepare them for the future. We believe every child deserves access to world-class STEM education.",
            vision: "To make global STEM education accessible in Bangladesh and create a generation of problem-solvers, innovators, and future leaders ready for tomorrow's challenges.",
            values: [
                {
                    title: "Future-Ready Education",
                    description: "Preparing students for careers that don't exist yet"
                },
                {
                    title: "Hands-On Learning",
                    description: "Learning by doing, not just theory"
                },
                {
                    title: "Global Standards",
                    description: "International quality education at local prices"
                }
            ]
        },
        bn: {
            title: "আমাদের লক্ষ্য ও উদ্দেশ্য",
            mission: "তরুণ শিক্ষার্থীদের রোবটিক্স ও কোডিং দক্ষতায় সমৃদ্ধ করা যা তাদের ভবিষ্যতের জন্য প্রস্তুত করে। আমরা বিশ্বাস করি প্রতিটি শিশু বিশ্বমানের STEM  শিক্ষা পাওয়ার যোগ্য।",
            vision: "বাংলাদেশে বিশ্বমানের STEM শিক্ষা সহজলভ্য করা এবং সমস্যা সমাধানকারী, উদ্ভাবক এবং ভবিষ্যৎ নেতৃত্বের একটি প্রজন্ম তৈরি করা যারা আগামীর চ্যালেঞ্জ মোকাবেলায় প্রস্তুত।",
            values: [
                {
                    title: "ভবিষ্যৎমুখী শিক্ষা",
                    description: "যেসব পেশা এখনও তৈরি হয়নি তার জন্য প্রস্তুতি"
                },
                {
                    title: "হাতে-কলমে শেখা",
                    description: "শুধু তত্ত্ব নয়, কাজ করে শেখা"
                },
                {
                    title: "আন্তর্জাতিক মান",
                    description: "স্থানীয় মূল্যে বিশ্বমানের শিক্ষা"
                }
            ]
        }
    },
    // For Students
    forStudents: {
        en: {
            title: "For Students (Ages 8-18)",
            subtitle: "Become a Future Innovator",
            description: "Learn skills that schools don't teach. Master coding, robotics, AI, and create real projects. Build robots, design games, and solve real-world problems.",
            benefits: [
                "Learn Python, Arduino, and cutting-edge technologies",
                "Build actual robots and interactive projects",
                "Develop problem-solving and critical thinking",
                "Get recognized with certificates and achievements",
                "Join a community of young innovators",
                "Prepare for future tech careers"
            ],
            cta: "Register as Student"
        },
        bn: {
            title: "শিক্ষার্থীদের জন্য (৮-১৮ বছর)",
            subtitle: "ভবিষ্যৎ উদ্ভাবক হয়ে উঠুন",
            description: "স্কুলে যা শেখানো হয় না সেসব দক্ষতা শিখুন। কোডিং, রোবটিক্স, AI তে দক্ষ হোন এবং বাস্তব প্রজেক্ট তৈরি করুন। রোবট বানান, গেম ডিজাইন করুন এবং বাস্তব সমস্যার সমাধান করুন।",
            benefits: [
                "Python, Arduino এবং আধুনিক প্রযুক্তি শিখুন",
                "আসল রোবট এবং ইন্টারেক্টিভ প্রজেক্ট তৈরি করুন",
                "সমস্যা সমাধান ও চিন্তন দক্ষতা বিকশিত করুন",
                "সার্টিফিকেট ও অর্জন দিয়ে স্বীকৃতি পান",
                "তরুণ উদ্ভাবকদের সম্প্রদায়ে যোগ দিন",
                "ভবিষ্যৎ টেক ক্যারিয়ারের জন্য প্রস্তুত হন"
            ],
            cta: "শিক্ষার্থী হিসেবে নিবন্ধন করুন"
        }
    },
    // For Parents
    forParents: {
        en: {
            title: "For Parents",
            subtitle: "Why Coding & Robotics Matter",
            description: "Coding is the literacy of the 21st century. Give your child the skills they need to succeed in an AI-driven world. Our platform ensures safe, tracked progress with certified learning outcomes.",
            benefits: [
                "Live instructor-led classes, not pre-recorded videos",
                "Track your child's progress in real-time",
                "Verified certificates recognized globally",
                "Affordable pricing with flexible payment options (bKash/Nagad)",
                "Safe, monitored learning environment",
                "Physical robotics kits included in courses",
                "Parent dashboard for complete transparency"
            ],
            cta: "Register as Guardian"
        },
        bn: {
            title: "অভিভাবকদের জন্য",
            subtitle: "কেন কোডিং ও রোবটিক্স গুরুত্বপূর্ণ",
            description: "কোডিং হলো ২১শ শতাব্দীর সাক্ষরতা। আপনার সন্তানকে AI-চালিত বিশ্বে সফল হওয়ার দক্ষতা দিন। আমাদের প্ল্যাটফর্ম নিরাপদ, ট্র্যাক করা অগ্রগতি এবং সার্টিফাইড শেখার ফলাফল নিশ্চিত করে।",
            benefits: [
                "লাইভ ইন্সট্রাক্টর-নেতৃত্বাধীন ক্লাস, রেকর্ডেড ভিডিও নয়",
                "রিয়েল-টাইমে আপনার সন্তানের অগ্রগতি দেখুন",
                "আন্তর্জাতিকভাবে স্বীকৃত সার্টিফিকেট",
                "বিকাশ/নগদে নমনীয় পেমেন্ট সহ সাশ্রয়ী মূল্য",
                "নিরাপদ, তত্ত্বাবধান করা শেখার পরিবেশ",
                "কোর্সে ফিজিক্যাল রোবটিক্স কিট অন্তর্ভুক্ত",
                "সম্পূর্ণ স্বচ্ছতার জন্য অভিভাবক ড্যাশবোর্ড"
            ],
            cta: "অভিভাবক হিসেবে নিবন্ধন করুন"
        }
    },
    // CTAs (Call to Actions)
    ctas: {
        en: {
            startLearning: "Start Learning",
            browseCourses: "Browse Courses",
            joinLiveClasses: "Join Live Classes",
            exploreRobotics: "Explore Robotics",
            becomeInnovator: "Become a Young Innovator",
            registerParent: "Register as Parent",
            registerStudent: "Register as Student",
            viewDashboard: "View Dashboard",
            contactSupport: "Contact Support",
            enrollNow: "Enroll Now",
            learnMore: "Learn More",
            getStarted: "Get Started",
            viewCourse: "View Course Details",
            downloadKit: "Download Kit Guide"
        },
        bn: {
            startLearning: "শেখা শুরু করুন",
            browseCourses: "কোর্স ব্রাউজ করুন",
            joinLiveClasses: "লাইভ ক্লাসে যোগ দিন",
            exploreRobotics: "রোবটিক্স অন্বেষণ করুন",
            becomeInnovator: "তরুণ উদ্ভাবক হয়ে উঠুন",
            registerParent: "অভিভাবক হিসেবে নিবন্ধন করুন",
            registerStudent: "শিক্ষার্থী হিসেবে নিবন্ধন করুন",
            viewDashboard: "ড্যাশবোর্ড দেখুন",
            contactSupport: "সহায়তা যোগাযোগ করুন",
            enrollNow: "এখনই ভর্তি হন",
            learnMore: "আরও জানুন",
            getStarted: "শুরু করুন",
            viewCourse: "কোর্সের বিস্তারিত দেখুন",
            downloadKit: "কিট গাইড ডাউনলোড করুন"
        }
    }
};
const __TURBOPACK__default__export__ = content;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ModernBanner.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swiper/swiper-react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/navigation.mjs [app-client] (ecmascript) <export default as Navigation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/autoplay.mjs [app-client] (ecmascript) <export default as Autoplay>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/pagination.mjs [app-client] (ecmascript) <export default as Pagination>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$effect$2d$fade$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EffectFade$3e$__ = __turbopack_context__.i("[project]/node_modules/swiper/modules/effect-fade.mjs [app-client] (ecmascript) <export default as EffectFade>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/content.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
const ModernBanner = ()=>{
    _s();
    const [language, setLanguage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("bn");
    const heroContent = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$content$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["content"].hero[language];
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
            title: language === "en" ? "Learn Robotics & Arduino" : "রোবটিক্স ও Arduino শিখুন",
            highlight: language === "en" ? "Build Real Robots" : "আসল রোবট তৈরি করুন",
            gradient: "from-blue-600/70 via-cyan-600/60 to-transparent"
        },
        {
            image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=2032&auto=format&fit=crop",
            title: language === "en" ? "Master Python & AI" : "Python ও AI তে দক্ষ হোন",
            highlight: language === "en" ? "Code the Future" : "ভবিষ্যৎ কোড করুন",
            gradient: "from-green-600/70 via-emerald-600/60 to-transparent"
        },
        {
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop",
            title: language === "en" ? "STEM Education" : "STEM শিক্ষা",
            highlight: language === "en" ? "For Young Innovators" : "তরুণ উদ্ভাবকদের জন্য",
            gradient: "from-purple-600/70 via-pink-600/60 to-transparent"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Swiper"], {
            autoplay: {
                delay: 50000,
                disableOnInteraction: false
            },
            className: "h-[120vh]",
            effect: "fade",
            loop: true,
            modules: [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$autoplay$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Autoplay$3e$__["Autoplay"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$navigation$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Navigation$3e$__["Navigation"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$pagination$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pagination$3e$__["Pagination"],
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$modules$2f$effect$2d$fade$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EffectFade$3e$__["EffectFade"]
            ],
            navigation: true,
            pagination: {
                clickable: true,
                dynamicBullets: true
            },
            children: slides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swiper$2f$swiper$2d$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SwiperSlide"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative w-full h-full flex items-center justify-center overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        fill: true,
                                        alt: slide.title,
                                        className: "object-cover",
                                        priority: index === 0,
                                        src: slide.image
                                    }, void 0, false, {
                                        fileName: "[project]/components/ModernBanner.tsx",
                                        lineNumber: 71,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `absolute inset-0 bg-gradient-to-r ${slide.gradient}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/ModernBanner.tsx",
                                        lineNumber: 79,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ModernBanner.tsx",
                                lineNumber: 70,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-20 container mx-auto px-4 md:px-6 lg:px-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "max-w-6xl mx-auto text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "inline-block mb-10 mt-6 px-2 animate-slideDown",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center px-4 sm:px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white text-base sm:text-lg font-semibold border border-white/30 whitespace-nowrap",
                                                children: language === "en" ? "🚀 Future-Ready Education" : "🚀 ভবিষ্যৎমুখী শিক্ষা"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ModernBanner.tsx",
                                                lineNumber: 89,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ModernBanner.tsx",
                                            lineNumber: 88,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: `text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 animate-slideUp ${language === "bn" ? "font-siliguri" : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block mb-2",
                                                    children: slide.title
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 100,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "block text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]",
                                                    children: slide.highlight
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ModernBanner.tsx",
                                            lineNumber: 97,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-lg md:text-xl lg:text-2xl text-white/90 mb-10 max-w-4xl mx-auto animate-fadeIn ${language === "bn" ? "font-siliguri" : ""}`,
                                            children: heroContent.description
                                        }, void 0, false, {
                                            fileName: "[project]/components/ModernBanner.tsx",
                                            lineNumber: 107,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col sm:flex-row gap-4 justify-center items-center animate-scaleIn",
                                            style: {
                                                animationDelay: "200ms"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                                    className: "bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold px-8 py-6 text-lg rounded-2xl shadow-glow-primary hover:scale-105 transition-transform",
                                                    size: "lg",
                                                    children: [
                                                        heroContent.cta.primary,
                                                        " →"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 118,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                                    className: "border-2 border-white text-white font-bold px-8 py-6 text-lg rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all",
                                                    size: "lg",
                                                    variant: "bordered",
                                                    children: heroContent.cta.secondary
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ModernBanner.tsx",
                                            lineNumber: 114,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto animate-fadeIn",
                                            style: {
                                                animationDelay: "400ms"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-3xl md:text-4xl font-black text-white mb-1",
                                                            children: "500+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ModernBanner.tsx",
                                                            lineNumber: 139,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm md:text-base text-white/80 ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: language === "en" ? "Students" : "শিক্ষার্থী"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ModernBanner.tsx",
                                                            lineNumber: 142,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-3xl md:text-4xl font-black text-white mb-1",
                                                            children: "50+"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ModernBanner.tsx",
                                                            lineNumber: 149,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm md:text-base text-white/80 ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: language === "en" ? "Projects" : "প্রজেক্ট"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ModernBanner.tsx",
                                                            lineNumber: 152,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 148,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-3xl md:text-4xl font-black text-white mb-1",
                                                            children: "95%"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ModernBanner.tsx",
                                                            lineNumber: 159,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm md:text-base text-white/80 ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: language === "en" ? "Satisfaction" : "সন্তুষ্টি"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ModernBanner.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ModernBanner.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ModernBanner.tsx",
                                            lineNumber: 134,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ModernBanner.tsx",
                                    lineNumber: 86,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/ModernBanner.tsx",
                                lineNumber: 85,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute bottom-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl animate-float hidden lg:block"
                            }, void 0, false, {
                                fileName: "[project]/components/ModernBanner.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-20 right-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full animate-float hidden lg:block",
                                style: {
                                    animationDelay: "1s"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ModernBanner.tsx",
                                lineNumber: 174,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ModernBanner.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, index, false, {
                    fileName: "[project]/components/ModernBanner.tsx",
                    lineNumber: 67,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)))
        }, void 0, false, {
            fileName: "[project]/components/ModernBanner.tsx",
            lineNumber: 51,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ModernBanner.tsx",
        lineNumber: 50,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ModernBanner, "l68XlmZuBSQ7p1YlZsypPRJFSw8=");
_c = ModernBanner;
const __TURBOPACK__default__export__ = ModernBanner;
var _c;
__turbopack_context__.k.register(_c, "ModernBanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/components/CoursesSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-46NETW2U.mjs [app-client] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-5ALFRFZW.mjs [app-client] (ecmascript) <export card_body_default as CardBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$JHUBASYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-JHUBASYZ.mjs [app-client] (ecmascript) <export card_footer_default as CardFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/chip/dist/chunk-4WFLSIHH.mjs [app-client] (ecmascript) <export chip_default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$spinner$2f$dist$2f$chunk$2d$TDOFO53L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__spinner_default__as__Spinner$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/spinner/dist/chunk-TDOFO53L.mjs [app-client] (ecmascript) <export spinner_default as Spinner>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$image$2f$dist$2f$chunk$2d$VKW4DPLJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/image/dist/chunk-VKW4DPLJ.mjs [app-client] (ecmascript) <export image_default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$courseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/redux/api/courseApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const CoursesSection = ()=>{
    _s();
    const [language] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("bn");
    const { data, isLoading, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$courseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllCoursesQuery"])({});
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Placeholder data for offline mode
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
            description: "আবিষ্কার করুন কীভাবে গণিত সব প্রযুক্তিকে চালিত করে। ইন্টারঅ্যাক্টিভ কোডিং প্রজেক্টের মাধ্যমে গাণিতিক ধারণা শিখুন...",
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
    if (error) {
        // If API fails, show sample courses instead of error message
        console.warn("API Error: Using sample courses for display.");
    // We mutate the courses array below if it's empty, but since 'courses' is derived from data, 
    // we'll just handle it in the render logic or re-assign here if we were using a let.
    // Better strategy: Return content using sampleCourses directly here.
    }
    // Use API data or fallback to sampleCourses if error exists
    const displayCourses = data?.data || data ? data?.data || data : error ? sampleCourses : [];
    // Gradient mapping for visual variety (cycling through based on index)
    const gradients = [
        "bg-gradient-robotics",
        "bg-gradient-coding",
        "bg-gradient-math",
        "bg-gradient-science"
    ];
    const shadows = [
        "hover:shadow-glow-primary",
        "hover:shadow-glow-accent",
        "hover:shadow-glow-secondary",
        "hover:shadow-xl"
    ];
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center py-20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$spinner$2f$dist$2f$chunk$2d$TDOFO53L$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__spinner_default__as__Spinner$3e$__["Spinner"], {
                size: "lg",
                label: "Loading courses..."
            }, void 0, false, {
                fileName: "[project]/components/CoursesSection.tsx",
                lineNumber: 117,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/CoursesSection.tsx",
            lineNumber: 116,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-8 px-6 bg-gradient-to-b from-white via-gray-50 to-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 md:px-6 lg:px-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-10 animate-fadeIn",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "inline-block mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                className: "bg-primary-100 text-primary-700 font-semibold",
                                size: "lg",
                                variant: "flat",
                                children: language === "en" ? "📚 Our Courses" : "📚 আমাদের কোর্স"
                            }, void 0, false, {
                                fileName: "[project]/components/CoursesSection.tsx",
                                lineNumber: 128,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/CoursesSection.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: `text-4xl md:text-5xl font-black text-gray-900 mb-4 ${language === "bn" ? "font-siliguri" : ""}`,
                            children: language === "en" ? "Explore Our Programs" : "আমাদের প্রোগ্রাম দেখুন"
                        }, void 0, false, {
                            fileName: "[project]/components/CoursesSection.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-lg md:text-xl text-gray-600 max-w-3xl mx-auto ${language === "bn" ? "font-siliguri" : ""}`,
                            children: language === "en" ? "Choose from our carefully designed courses to start your STEM journey" : "আপনার STEM যাত্রা শুরু করতে আমাদের সযত্নে ডিজাইন করা কোর্স থেকে বেছে নিন"
                        }, void 0, false, {
                            fileName: "[project]/components/CoursesSection.tsx",
                            lineNumber: 143,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CoursesSection.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
                    children: displayCourses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "col-span-full text-center text-gray-500",
                        children: "No courses available at the moment."
                    }, void 0, false, {
                        fileName: "[project]/components/CoursesSection.tsx",
                        lineNumber: 155,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : displayCourses.map((course, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                            className: `group cursor-pointer transition-all duration-300 hover:-translate-y-2 ${shadows[index % shadows.length]} shadow-card animate-slideUp border-0`,
                            style: {
                                animationDelay: `${index * 100}ms`
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-48 overflow-hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$image$2f$dist$2f$chunk$2d$VKW4DPLJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__image_default__as__Image$3e$__["Image"], {
                                            removeWrapper: true,
                                            alt: course.title,
                                            className: "z-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
                                            src: course.img || "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 167,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-gradient-to-t from-blue-900/50 via-blue-900/20 to-transparent z-10"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 173,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-4 left-4 z-20",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                                color: "primary",
                                                size: "sm",
                                                variant: "flat",
                                                className: "bg-white/90 text-primary-700 font-bold shadow-sm",
                                                children: course.level
                                            }, void 0, false, {
                                                fileName: "[project]/components/CoursesSection.tsx",
                                                lineNumber: 175,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 174,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CoursesSection.tsx",
                                    lineNumber: 166,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                    className: "p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `text-xl font-bold text-gray-900 mb-2 ${language === "bn" ? "font-siliguri" : ""}`,
                                            children: course.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 183,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        course.subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-primary-600 text-sm font-semibold mb-3 ${language === "bn" ? "font-siliguri" : ""}`,
                                            children: course.subtitle
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 191,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-gray-600 text-sm mb-4 line-clamp-3 ${language === "bn" ? "font-siliguri" : ""}`,
                                            children: course.description
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 199,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-4 mb-4",
                                            children: [
                                                course.duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1 text-sm text-gray-600",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "⏱️"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CoursesSection.tsx",
                                                            lineNumber: 209,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: language === "bn" ? "font-siliguri" : "",
                                                            children: course.duration
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CoursesSection.tsx",
                                                            lineNumber: 210,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CoursesSection.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                course.ageRange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1 text-sm text-gray-600",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "👥"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CoursesSection.tsx",
                                                            lineNumber: 215,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: language === "bn" ? "font-siliguri" : "",
                                                            children: course.ageRange
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CoursesSection.tsx",
                                                            lineNumber: 216,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/CoursesSection.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 206,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        course.features && course.features.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-2 mb-4",
                                            children: course.features.map((feature, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2 text-sm text-gray-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-green-500 mt-0.5",
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CoursesSection.tsx",
                                                            lineNumber: 226,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: language === "bn" ? "font-siliguri" : "",
                                                            children: feature
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/CoursesSection.tsx",
                                                            lineNumber: 227,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/components/CoursesSection.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 223,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CoursesSection.tsx",
                                    lineNumber: 181,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$JHUBASYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__["CardFooter"], {
                                    className: "p-6 pt-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                        className: "w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-md hover:shadow-lg transition-shadow",
                                        size: "lg",
                                        onPress: ()=>{
                                            // Check if user is logged in
                                            const token = localStorage.getItem("token");
                                            if (!token) {
                                                // Redirect to register if not logged in
                                                router.push("/register");
                                            } else {
                                                // Go to course details if logged in
                                                router.push(`/courses/${course._id}`);
                                            }
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: language === "bn" ? "font-siliguri" : "",
                                            children: language === "en" ? "Enroll Now →" : "এনরোল করুন →"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CoursesSection.tsx",
                                            lineNumber: 250,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoursesSection.tsx",
                                        lineNumber: 235,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/CoursesSection.tsx",
                                    lineNumber: 234,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-gradient-to-t from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"
                                }, void 0, false, {
                                    fileName: "[project]/components/CoursesSection.tsx",
                                    lineNumber: 257,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, course._id, true, {
                            fileName: "[project]/components/CoursesSection.tsx",
                            lineNumber: 160,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/components/CoursesSection.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mt-12 animate-fadeIn",
                    style: {
                        animationDelay: "600ms"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: `text-gray-600 mb-6 ${language === "bn" ? "font-siliguri" : ""}`,
                            children: language === "en" ? "Can't decide? We'll help you choose the perfect course!" : "সিদ্ধান্ত নিতে পারছেন না? আমরা আপনাকে নিখুঁত কোর্স বেছে নিতে সাহায্য করব!"
                        }, void 0, false, {
                            fileName: "[project]/components/CoursesSection.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row gap-4 justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    className: "border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50",
                                    size: "lg",
                                    variant: "bordered",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: language === "bn" ? "font-siliguri" : "",
                                        children: language === "en" ? "📞 Talk to Advisor" : "📞 পরামর্শদাতার সাথে কথা বলুন"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoursesSection.tsx",
                                        lineNumber: 281,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/CoursesSection.tsx",
                                    lineNumber: 276,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    className: "bg-gradient-secondary text-white font-bold shadow-glow-secondary",
                                    size: "lg",
                                    onPress: ()=>router.push("/courses"),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: language === "bn" ? "font-siliguri" : "",
                                        children: language === "en" ? "🎁 View All Courses" : "🎁 সব কোর্স দেখুন"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CoursesSection.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/CoursesSection.tsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CoursesSection.tsx",
                            lineNumber: 275,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CoursesSection.tsx",
                    lineNumber: 264,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/CoursesSection.tsx",
            lineNumber: 124,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/CoursesSection.tsx",
        lineNumber: 123,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CoursesSection, "zuoVyF+idme6tsgK2mmvHuA8pj4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$redux$2f$api$2f$courseApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGetAllCoursesQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CoursesSection;
const __TURBOPACK__default__export__ = CoursesSection;
var _c;
__turbopack_context__.k.register(_c, "CoursesSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PlatformFeaturesSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/bi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$pi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/pi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/md/index.mjs [app-client] (ecmascript)");
"use client";
;
;
;
;
;
const PlatformFeaturesSection = ()=>{
    const features = [
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$bi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BiRevision"], {}, void 0, false, {
                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                lineNumber: 11,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "7 Day",
            subtitle: "রিফান্ড",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$pi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PiCertificateFill"], {}, void 0, false, {
                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                lineNumber: 18,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "100%",
            subtitle: "সার্টিফিকেট",
            color: "text-yellow-600",
            bg: "bg-yellow-50"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaChalkboardTeacher"], {}, void 0, false, {
                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                lineNumber: 25,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "Live",
            subtitle: "ক্লাস",
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$md$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MdPayment"], {}, void 0, false, {
                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                lineNumber: 32,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            title: "Easy",
            subtitle: "পেমেন্ট",
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "py-10 border-b border-gray-100 bg-white",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 max-w-6xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-6 text-center",
                children: features.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center justify-center group hover:-translate-y-1 transition-transform duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-16 h-16 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-3xl mb-4 shadow-sm group-hover:shadow-md transition-shadow`,
                                children: item.icon
                            }, void 0, false, {
                                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                                lineNumber: 47,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold text-gray-900",
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                                lineNumber: 52,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 font-medium font-siliguri",
                                children: item.subtitle
                            }, void 0, false, {
                                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                                lineNumber: 53,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, index, true, {
                        fileName: "[project]/components/PlatformFeaturesSection.tsx",
                        lineNumber: 45,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/components/PlatformFeaturesSection.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/PlatformFeaturesSection.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/PlatformFeaturesSection.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PlatformFeaturesSection;
const __TURBOPACK__default__export__ = PlatformFeaturesSection;
var _c;
__turbopack_context__.k.register(_c, "PlatformFeaturesSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/platformData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Platform Features, Pricing, Technology Stack, and Additional Content
 * Learn & Grow EdTech Platform
 */ // Platform Features
__turbopack_context__.s([
    "competitorComparison",
    ()=>competitorComparison,
    "default",
    ()=>__TURBOPACK__default__export__,
    "platformFeatures",
    ()=>platformFeatures,
    "pricingPlans",
    ()=>pricingPlans,
    "registrationFlow",
    ()=>registrationFlow,
    "techStack",
    ()=>techStack
]);
const platformFeatures = {
    en: [
        {
            id: "auth",
            icon: "🔐",
            title: "Secure Authentication",
            description: "JWT-based authentication with mobile OTP verification. Your data is safe and encrypted."
        },
        {
            id: "dashboards",
            icon: "📊",
            title: "Role-Based Dashboards",
            description: "Dedicated dashboards for students, parents, instructors, and admins with tailored features."
        },
        {
            id: "live-classes",
            icon: "🎥",
            title: "Interactive Live Classes",
            description: "Real-time instructor-led sessions with video, chat, and screen sharing capabilities."
        },
        {
            id: "recorded",
            icon: "📹",
            title: "Recorded Sessions",
            description: "Access class recordings anytime. Review difficult concepts at your own pace."
        },
        {
            id: "quizzes",
            icon: "✅",
            title: "Quizzes & Assessments",
            description: "Interactive quizzes, assignments, and automated grading to track learning progress."
        },
        {
            id: "projects",
            icon: "🛠️",
            title: "Hands-On Projects",
            description: "Real robotics and coding projects with step-by-step guidance and mentor support."
        },
        {
            id: "progress",
            icon: "📈",
            title: "Progress Tracking",
            description: "Real-time progress monitoring for students and parents with detailed analytics."
        },
        {
            id: "certificates",
            icon: "🏆",
            title: "Digital Certificates",
            description: "Industry-recognized certificates upon course completion with blockchain verification."
        },
        {
            id: "payment",
            icon: "💳",
            title: "Flexible Payments",
            description: "Pay via bKash, Nagad, or card. Installment options available for all courses."
        }
    ],
    bn: [
        {
            id: "auth",
            icon: "🔐",
            title: "সুরক্ষিত প্রমাণীকরণ",
            description: "মোবাইল OTP যাচাইকরণ সহ JWT-ভিত্তিক প্রমাণীকরণ। আপনার ডেটা নিরাপদ এবং এনক্রিপ্টেড।"
        },
        {
            id: "dashboards",
            icon: "📊",
            title: "ভূমিকা-ভিত্তিক ড্যাশবোর্ড",
            description: "শিক্ষার্থী, অভিভাবক, ইন্সট্রাক্টর এবং অ্যাডমিনদের জন্য উপযোগী ফিচার সহ ডেডিকেটেড ড্যাশবোর্ড।"
        },
        {
            id: "live-classes",
            icon: "🎥",
            title: "ইন্টারেক্টিভ লাইভ ক্লাস",
            description: "ভিডিও, চ্যাট এবং স্ক্রিন শেয়ারিং সহ রিয়েল-টাইম ইন্সট্রাক্টর-নেতৃত্বাধীন সেশন।"
        },
        {
            id: "recorded",
            icon: "📹",
            title: "রেকর্ডেড সেশন",
            description: "যেকোনো সময় ক্লাস রেকর্ডিং দেখুন। আপনার নিজস্ব গতিতে কঠিন ধারণা পর্যালোচনা করুন।"
        },
        {
            id: "quizzes",
            icon: "✅",
            title: "কুইজ ও মূল্যায়ন",
            description: "শেখার অগ্রগতি ট্র্যাক করতে ইন্টারেক্টিভ কুইজ, অ্যাসাইনমেন্ট এবং স্বয়ংক্রিয় গ্রেডিং।"
        },
        {
            id: "projects",
            icon: "🛠️",
            title: "হাতে-কলমে প্রজেক্ট",
            description: "ধাপে ধাপে গাইডেন্স এবং মেন্টর সাপোর্ট সহ আসল রোবটিক্স ও কোডিং প্রজেক্ট।"
        },
        {
            id: "progress",
            icon: "📈",
            title: "অগ্রগতি ট্র্যাকিং",
            description: "বিস্তারিত অ্যানালিটিক্স সহ শিক্ষার্থী ও অভিভাবকদের জন্য রিয়েল-টাইম অগ্রগতি পর্যবেক্ষণ।"
        },
        {
            id: "certificates",
            icon: "🏆",
            title: "ডিজিটাল সার্টিফিকেট",
            description: "ব্লকচেইন যাচাইকরণ সহ কোর্স সম্পন্নের পরে ইন্ডাস্ট্রি-স্বীকৃত সার্টিফিকেট।"
        },
        {
            id: "payment",
            icon: "💳",
            title: "নমনীয় পেমেন্ট",
            description: "বিকাশ, নগদ বা কার্ডে পেমেন্ট করুন। সব কোর্সের জন্য কিস্তির সুবিধা উপলব্ধ।"
        }
    ]
};
const registrationFlow = {
    en: {
        title: "Simple 3-Step Registration",
        steps: [
            {
                step: 1,
                title: "Mobile Verification",
                description: "Enter your mobile number and verify with OTP code sent to your phone.",
                icon: "📱"
            },
            {
                step: 2,
                title: "Fill Information",
                description: "Complete student or guardian information form with basic details.",
                icon: "📝"
            },
            {
                step: 3,
                title: "Set Password",
                description: "Create a secure password and you're ready to start learning!",
                icon: "🔒"
            }
        ],
        securityTips: [
            "Use a strong password with letters, numbers, and symbols",
            "Never share your password with anyone",
            "Enable two-factor authentication for extra security"
        ]
    },
    bn: {
        title: "সহজ ৩-ধাপ নিবন্ধন",
        steps: [
            {
                step: 1,
                title: "মোবাইল যাচাইকরণ",
                description: "আপনার মোবাইল নম্বর লিখুন এবং ফোনে পাঠানো OTP কোড দিয়ে যাচাই করুন।",
                icon: "📱"
            },
            {
                step: 2,
                title: "তথ্য পূরণ করুন",
                description: "মৌলিক বিবরণ সহ শিক্ষার্থী বা অভিভাবকের তথ্য ফর্ম পূরণ করুন।",
                icon: "📝"
            },
            {
                step: 3,
                title: "পাসওয়ার্ড সেট করুন",
                description: "একটি সুরক্ষিত পাসওয়ার্ড তৈরি করুন এবং শেখা শুরু করার জন্য প্রস্তুত হন!",
                icon: "🔒"
            }
        ],
        securityTips: [
            "অক্ষর, সংখ্যা এবং চিহ্ন সহ একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন",
            "কখনও কারো সাথে আপনার পাসওয়ার্ড শেয়ার করবেন না",
            "অতিরিক্ত নিরাপত্তার জন্য টু-ফ্যাক্টর অথেন্টিকেশন সক্রিয় করুন"
        ]
    }
};
const pricingPlans = {
    en: {
        title: "Choose Your Learning Path",
        subtitle: "Flexible pricing for every student",
        plans: [
            {
                id: "single-course",
                name: "Single Course",
                price: "3,500",
                currency: "BDT",
                period: "per course",
                description: "Perfect for trying out a specific course",
                features: [
                    "Full access to one course",
                    "Live instructor sessions",
                    "Course materials & recordings",
                    "Quizzes & assignments",
                    "Digital certificate",
                    "3 months access"
                ],
                popular: false,
                cta: "Enroll in Course"
            },
            {
                id: "quarterly",
                name: "Quarterly Subscription",
                price: "9,999",
                currency: "BDT",
                period: "per 3 months",
                description: "Best value for dedicated learners",
                features: [
                    "Access to ALL courses",
                    "Unlimited live classes",
                    "All robotics kits included",
                    "Priority mentor support",
                    "Progress tracking",
                    "Community access",
                    "All certificates",
                    "Save 40% vs single courses"
                ],
                popular: true,
                cta: "Subscribe Now"
            },
            {
                id: "robotics-kit",
                name: "Robotics Kit Only",
                price: "4,500",
                currency: "BDT",
                period: "one-time",
                description: "Purchase kit separately for home learning",
                features: [
                    "Complete Arduino starter kit",
                    "Sensors & motors included",
                    "Online kit guide",
                    "Lifetime hardware ownership",
                    "Compatible with our courses"
                ],
                popular: false,
                cta: "Buy Kit"
            },
            {
                id: "school",
                name: "School Partnership",
                price: "Custom",
                currency: "",
                period: "contact us",
                description: "Bring STEM education to your institution",
                features: [
                    "Customized curriculum",
                    "Bulk licensing discounts",
                    "On-site training",
                    "Dedicated support team",
                    "Progress reports",
                    "Partnership certificate"
                ],
                popular: false,
                cta: "Contact Sales"
            }
        ],
        paymentMethods: {
            title: "We Accept",
            methods: [
                "bKash",
                "Nagad",
                "Rocket",
                "Credit/Debit Card",
                "Bank Transfer"
            ]
        }
    },
    bn: {
        title: "আপনার শেখার পথ বেছে নিন",
        subtitle: "প্রতিটি শিক্ষার্থীর জন্য নমনীয় মূল্য",
        plans: [
            {
                id: "single-course",
                name: "একক কোর্স",
                price: "৩,৫০০",
                currency: "টাকা",
                period: "প্রতি কোর্স",
                description: "একটি নির্দিষ্ট কোর্স চেষ্টা করার জন্য উপযুক্ত",
                features: [
                    "একটি কোর্সে সম্পূর্ণ অ্যাক্সেস",
                    "লাইভ ইন্সট্রাক্টর সেশন",
                    "কোর্স ম্যাটেরিয়াল ও রেকর্ডিং",
                    "কুইজ ও অ্যাসাইনমেন্ট",
                    "ডিজিটাল সার্টিফিকেট",
                    "৩ মাসের অ্যাক্সেস"
                ],
                popular: false,
                cta: "কোর্সে ভর্তি হন"
            },
            {
                id: "quarterly",
                name: "ত্রৈমাসিক সাবস্ক্রিপশন",
                price: "৯,৯৯৯",
                currency: "টাকা",
                period: "প্রতি ৩ মাস",
                description: "নিবেদিত শিক্ষার্থীদের জন্য সেরা মূল্য",
                features: [
                    "সব কোর্সে অ্যাক্সেস",
                    "আনলিমিটেড লাইভ ক্লাস",
                    "সব রোবটিক্স কিট অন্তর্ভুক্ত",
                    "অগ্রাধিকার মেন্টর সাপোর্ট",
                    "অগ্রগতি ট্র্যাকিং",
                    "কমিউনিটি অ্যাক্সেস",
                    "সব সার্টিফিকেট",
                    "একক কোর্স থেকে ৪০% সাশ্রয়"
                ],
                popular: true,
                cta: "এখনই সাবস্ক্রাইব করুন"
            },
            {
                id: "robotics-kit",
                name: "শুধু রোবটিক্স কিট",
                price: "৪,৫০০",
                currency: "টাকা",
                period: "একবার",
                description: "বাড়িতে শেখার জন্য আলাদাভাবে কিট কিনুন",
                features: [
                    "সম্পূর্ণ Arduino স্টার্টার কিট",
                    "সেন্সর ও মোটর অন্তর্ভুক্ত",
                    "অনলাইন কিট গাইড",
                    "লাইফটাইম হার্ডওয়্যার মালিকানা",
                    "আমাদের কোর্সের সাথে সামঞ্জস্যপূর্ণ"
                ],
                popular: false,
                cta: "কিট কিনুন"
            },
            {
                id: "school",
                name: "স্কুল পার্টনারশিপ",
                price: "কাস্টম",
                currency: "",
                period: "আমাদের সাথে যোগাযোগ করুন",
                description: "আপনার প্রতিষ্ঠানে STEM শিক্ষা আনুন",
                features: [
                    "কাস্টমাইজড পাঠ্যক্রম",
                    "বাল্ক লাইসেন্সিং ছাড়",
                    "অন-সাইট প্রশিক্ষণ",
                    "ডেডিকেটেড সাপোর্ট টিম",
                    "অগ্রগতি রিপোর্ট",
                    "পার্টনারশিপ সার্টিফিকেট"
                ],
                popular: false,
                cta: "সেলসের সাথে যোগাযোগ করুন"
            }
        ],
        paymentMethods: {
            title: "আমরা গ্রহণ করি",
            methods: [
                "বিকাশ",
                "নগদ",
                "রকেট",
                "ক্রেডিট/ডেবিট কার্ড",
                "ব্যাংক ট্রান্সফার"
            ]
        }
    }
};
const techStack = {
    en: {
        short: "Built with modern technologies: Next.js, TypeScript, MongoDB, and more for a fast, secure, and scalable learning platform.",
        detailed: {
            title: "Powering Your Learning Experience",
            description: "Learn & Grow is built on cutting-edge technology stack ensuring fast performance, security, and reliability.",
            categories: [
                {
                    category: "Frontend",
                    technologies: [
                        {
                            name: "Next.js 14",
                            description: "React framework with App Router for blazing-fast performance"
                        },
                        {
                            name: "TypeScript",
                            description: "Type-safe code for fewer bugs and better development"
                        },
                        {
                            name: "Tailwind CSS",
                            description: "Modern, responsive design system"
                        },
                        {
                            name: "NextUI",
                            description: "Beautiful, accessible UI components"
                        },
                        {
                            name: "Framer Motion",
                            description: "Smooth animations and transitions"
                        }
                    ]
                },
                {
                    category: "Backend",
                    technologies: [
                        {
                            name: "Node.js & Express",
                            description: "High-performance server infrastructure"
                        },
                        {
                            name: "MongoDB",
                            description: "Flexible, scalable database for learning data"
                        },
                        {
                            name: "Mongoose",
                            description: "Elegant data modeling and validation"
                        },
                        {
                            name: "JWT Authentication",
                            description: "Secure user authentication and authorization"
                        }
                    ]
                },
                {
                    category: "State Management",
                    technologies: [
                        {
                            name: "Redux Toolkit",
                            description: "Predictable state management"
                        },
                        {
                            name: "RTK Query",
                            description: "Powerful data fetching and caching"
                        },
                        {
                            name: "Redux Persist",
                            description: "Seamless offline experience"
                        }
                    ]
                },
                {
                    category: "Integration",
                    technologies: [
                        {
                            name: "Zoom/Google Meet",
                            description: "Live class video conferencing"
                        },
                        {
                            name: "Nodemailer",
                            description: "Email notifications and communication"
                        },
                        {
                            name: "bKash/Nagad API",
                            description: "Local payment gateway integration"
                        },
                        {
                            name: "SMS Gateway",
                            description: "OTP verification and notifications"
                        }
                    ]
                },
                {
                    category: "Performance",
                    technologies: [
                        {
                            name: "Next.js SSR/SSG",
                            description: "Server-side rendering for SEO and speed"
                        },
                        {
                            name: "Image Optimization",
                            description: "Automatic image compression and lazy loading"
                        },
                        {
                            name: "Code Splitting",
                            description: "Faster page loads with optimized bundles"
                        }
                    ]
                }
            ]
        }
    },
    bn: {
        short: "আধুনিক প্রযুক্তি দিয়ে তৈরি: Next.js, TypeScript, MongoDB, এবং আরও অনেক কিছু দ্রুত, নিরাপদ এবং স্কেলেবল শেখার প্ল্যাটফর্মের জন্য।",
        detailed: {
            title: "আপনার শেখার অভিজ্ঞতা চালিত করছে",
            description: "Learn & Grow অত্যাধুনিক প্রযুক্তি স্ট্যাকে তৈরি যা দ্রুত পারফরম্যান্স, নিরাপত্তা এবং নির্ভরযোগ্যতা নিশ্চিত করে।",
            categories: [
                {
                    category: "ফ্রন্টএন্ড",
                    technologies: [
                        {
                            name: "Next.js 14",
                            description: "অতি দ্রুত পারফরম্যান্সের জন্য App Router সহ React ফ্রেমওয়ার্ক"
                        },
                        {
                            name: "TypeScript",
                            description: "কম বাগ এবং ভালো ডেভেলপমেন্টের জন্য টাইপ-সেফ কোড"
                        },
                        {
                            name: "Tailwind CSS",
                            description: "আধুনিক, রেসপন্সিভ ডিজাইন সিস্টেম"
                        },
                        {
                            name: "NextUI",
                            description: "সুন্দর, অ্যাক্সেসিবল UI কম্পোনেন্ট"
                        },
                        {
                            name: "Framer Motion",
                            description: "মসৃণ অ্যানিমেশন এবং ট্রানজিশন"
                        }
                    ]
                },
                {
                    category: "ব্যাকএন্ড",
                    technologies: [
                        {
                            name: "Node.js ও Express",
                            description: "উচ্চ-পারফরম্যান্স সার্ভার ইনফ্রাস্ট্রাকচার"
                        },
                        {
                            name: "MongoDB",
                            description: "শেখার ডেটার জন্য নমনীয়, স্কেলেবল ডেটাবেস"
                        },
                        {
                            name: "Mongoose",
                            description: "মার্জিত ডেটা মডেলিং এবং যাচাইকরণ"
                        },
                        {
                            name: "JWT Authentication",
                            description: "সুরক্ষিত ইউজার প্রমাণীকরণ এবং অনুমোদন"
                        }
                    ]
                },
                {
                    category: "স্টেট ম্যানেজমেন্ট",
                    technologies: [
                        {
                            name: "Redux Toolkit",
                            description: "পূর্বাভাসযোগ্য স্টেট ম্যানেজমেন্ট"
                        },
                        {
                            name: "RTK Query",
                            description: "শক্তিশালী ডেটা ফেচিং এবং ক্যাশিং"
                        },
                        {
                            name: "Redux Persist",
                            description: "নির্বিঘ্ন অফলাইন অভিজ্ঞতা"
                        }
                    ]
                },
                {
                    category: "ইন্টিগ্রেশন",
                    technologies: [
                        {
                            name: "Zoom/Google Meet",
                            description: "লাইভ ক্লাস ভিডিও কনফারেন্সিং"
                        },
                        {
                            name: "Nodemailer",
                            description: "ইমেইল বিজ্ঞপ্তি এবং যোগাযোগ"
                        },
                        {
                            name: "বিকাশ/নগদ API",
                            description: "স্থানীয় পেমেন্ট গেটওয়ে ইন্টিগ্রেশন"
                        },
                        {
                            name: "SMS Gateway",
                            description: "OTP যাচাইকরণ এবং বিজ্ঞপ্তি"
                        }
                    ]
                },
                {
                    category: "পারফরম্যান্স",
                    technologies: [
                        {
                            name: "Next.js SSR/SSG",
                            description: "SEO এবং গতির জন্য সার্ভার-সাইড রেন্ডারিং"
                        },
                        {
                            name: "ইমেজ অপ্টিমাইজেশন",
                            description: "স্বয়ংক্রিয় ইমেজ কম্প্রেশন এবং ল্যাজি লোডিং"
                        },
                        {
                            name: "কোড স্প্লিটিং",
                            description: "অপ্টিমাইজড বান্ডেল সহ দ্রুত পেজ লোড"
                        }
                    ]
                }
            ]
        }
    }
};
const competitorComparison = {
    en: {
        title: "Why Choose Learn & Grow?",
        subtitle: "See how we compare to other EdTech platforms in Bangladesh",
        competitors: [
            {
                name: "Learn & Grow",
                logo: "🚀"
            },
            {
                name: "10 Minute School",
                logo: "📱"
            },
            {
                name: "Shikho",
                logo: "📚"
            },
            {
                name: "Others",
                logo: "🏫"
            }
        ],
        features: [
            {
                feature: "Hands-On Robotics",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "Physical Kits Included",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "Live Instructor Classes",
                learnGrow: true,
                competitor1: false,
                competitor2: true,
                competitor3: true
            },
            {
                feature: "STEM-First Curriculum",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "1-on-1 Mentorship",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "Project-Based Learning",
                learnGrow: true,
                competitor1: false,
                competitor2: true,
                competitor3: false
            },
            {
                feature: "School Partnerships",
                learnGrow: true,
                competitor1: true,
                competitor2: true,
                competitor3: false
            },
            {
                feature: "Affordable Pricing",
                learnGrow: true,
                competitor1: true,
                competitor2: true,
                competitor3: true
            }
        ]
    },
    bn: {
        title: "কেন Learn & Grow বেছে নেবেন?",
        subtitle: "দেখুন বাংলাদেশের অন্যান্য এডটেক প্ল্যাটফর্মের সাথে আমরা কীভাবে তুলনা করি",
        competitors: [
            {
                name: "Learn & Grow",
                logo: "🚀"
            },
            {
                name: "10 Minute School",
                logo: "📱"
            },
            {
                name: "Shikho",
                logo: "📚"
            },
            {
                name: "অন্যান্য",
                logo: "🏫"
            }
        ],
        features: [
            {
                feature: "হাতে-কলমে রোবটিক্স",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "ফিজিক্যাল কিট অন্তর্ভুক্ত",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "লাইভ ইন্সট্রাক্টর ক্লাস",
                learnGrow: true,
                competitor1: false,
                competitor2: true,
                competitor3: true
            },
            {
                feature: "STEM-ফার্স্ট পাঠ্যক্রম",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "১-অন-১ মেন্টরশিপ",
                learnGrow: true,
                competitor1: false,
                competitor2: false,
                competitor3: false
            },
            {
                feature: "প্রজেক্ট-ভিত্তিক শিক্ষা",
                learnGrow: true,
                competitor1: false,
                competitor2: true,
                competitor3: false
            },
            {
                feature: "স্কুল পার্টনারশিপ",
                learnGrow: true,
                competitor1: true,
                competitor2: true,
                competitor3: false
            },
            {
                feature: "সাশ্রয়ী মূল্য",
                learnGrow: true,
                competitor1: true,
                competitor2: true,
                competitor3: true
            }
        ]
    }
};
const __TURBOPACK__default__export__ = {
    platformFeatures,
    registrationFlow,
    pricingPlans,
    techStack,
    competitorComparison
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PricingSection.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-46NETW2U.mjs [app-client] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-5ALFRFZW.mjs [app-client] (ecmascript) <export card_body_default as CardBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-J333S7JQ.mjs [app-client] (ecmascript) <export card_header_default as CardHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$JHUBASYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-JHUBASYZ.mjs [app-client] (ecmascript) <export card_footer_default as CardFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-client] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/chip/dist/chunk-4WFLSIHH.mjs [app-client] (ecmascript) <export chip_default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$platformData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/platformData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const PricingSection = ()=>{
    _s();
    const [language] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('bn');
    const pricing = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$platformData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pricingPlans"][language];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "pt-0 pb-10 bg-gradient-to-b from-white via-primary-50/30 to-white relative overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 22,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-0 left-0 w-96 h-96 bg-secondary-500 rounded-full blur-3xl"
                    }, void 0, false, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 23,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/PricingSection.tsx",
                lineNumber: 21,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 md:px-6 lg:px-8 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-16 animate-fadeIn",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "inline-block mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                    className: "bg-accent-100 text-accent-700 font-semibold",
                                    size: "lg",
                                    variant: "flat",
                                    children: language === "en" ? "💰 Pricing Plans" : "💰 প্রাইসিং প্ল্যান"
                                }, void 0, false, {
                                    fileName: "[project]/components/PricingSection.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: `text-4xl md:text-5xl font-black text-gray-900 mb-4 ${language === "bn" ? "font-siliguri" : ""}`,
                                children: pricing.title
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 38,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-lg md:text-xl text-gray-600 max-w-3xl mx-auto ${language === "bn" ? "font-siliguri" : ""}`,
                                children: pricing.subtitle
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12",
                        children: pricing.plans.map((plan, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                className: `group transition-all duration-300 animate-slideUp overflow-visible ${plan.popular ? "border-2 border-primary-500 shadow-glow-primary hover:shadow-glow-primary scale-105 lg:scale-110" : "border-0 shadow-card hover:shadow-card-hover hover:-translate-y-1"}`,
                                style: {
                                    animationDelay: `${index * 100}ms`
                                },
                                children: [
                                    plan.popular && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute -top-4 left-1/2 transform -translate-x-1/2 z-10",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                            className: "bg-gradient-primary text-white font-bold px-4 shadow-lg",
                                            size: "lg",
                                            children: [
                                                "⭐ ",
                                                language === "en" ? "Most Popular" : "সবচেয়ে জনপ্রিয়"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/PricingSection.tsx",
                                            lineNumber: 64,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 63,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__["CardHeader"], {
                                        className: "flex flex-col items-start p-6 pb-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: `text-2xl font-bold text-gray-900 mb-2 ${language === "bn" ? "font-siliguri" : ""}`,
                                                children: plan.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/PricingSection.tsx",
                                                lineNumber: 75,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm text-gray-600 mb-4 ${language === "bn" ? "font-siliguri" : ""}`,
                                                children: plan.description
                                            }, void 0, false, {
                                                fileName: "[project]/components/PricingSection.tsx",
                                                lineNumber: 82,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full mb-4",
                                                children: plan.price === "Custom" || plan.price === "কাস্টম" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-4xl font-black bg-gradient-cool bg-clip-text text-transparent",
                                                            children: plan.price
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 92,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `text-sm text-gray-500 ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: plan.period
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 95,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PricingSection.tsx",
                                                    lineNumber: 91,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap items-baseline gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-2xl font-bold text-gray-600 ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: plan.currency
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 103,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-5xl font-black bg-gradient-primary bg-clip-text text-transparent ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: plan.price
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 108,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm text-gray-500 ml-1 whitespace-nowrap ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: [
                                                                "/",
                                                                plan.period
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 113,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/PricingSection.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/components/PricingSection.tsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                        className: "p-6 pt-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            className: "space-y-3",
                                            children: plan.features.map((feature, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    className: "flex items-start gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `${plan.popular ? "text-primary-500" : "text-accent-500"} mt-0.5 flex-shrink-0`,
                                                            children: "✓"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `text-sm text-gray-700 ${language === "bn" ? "font-siliguri" : ""}`,
                                                            children: feature
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/PricingSection.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, idx, true, {
                                                    fileName: "[project]/components/PricingSection.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/components/PricingSection.tsx",
                                            lineNumber: 125,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 123,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$JHUBASYZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_footer_default__as__CardFooter$3e$__["CardFooter"], {
                                        className: "p-6 pt-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                            className: `w-full font-bold ${plan.popular ? "bg-gradient-primary text-white shadow-glow-primary" : "bg-gray-900 text-white hover:bg-gray-800"}`,
                                            size: "lg",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: language === "bn" ? "font-siliguri" : "",
                                                children: plan.cta
                                            }, void 0, false, {
                                                fileName: "[project]/components/PricingSection.tsx",
                                                lineNumber: 151,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/PricingSection.tsx",
                                            lineNumber: 144,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    plan.popular && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-primary-500/5 rounded-xl pointer-events-none"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 159,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, plan.id, true, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mb-12 animate-fadeIn",
                        style: {
                            animationDelay: "500ms"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: `text-xl font-bold text-gray-900 mb-4 ${language === "bn" ? "font-siliguri" : ""}`,
                                children: pricing.paymentMethods.title
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap justify-center gap-4",
                                children: pricing.paymentMethods.methods.map((method, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                        className: "bg-white border border-gray-200 text-gray-700 font-semibold",
                                        size: "lg",
                                        variant: "flat",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: language === "bn" ? "font-siliguri" : "",
                                            children: method
                                        }, void 0, false, {
                                            fileName: "[project]/components/PricingSection.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, idx, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-4xl mx-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                            className: "bg-gradient-to-r from-accent-50 to-primary-50 border-2 border-accent-200 animate-fadeIn",
                            style: {
                                animationDelay: "600ms"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                className: "p-8 text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-5xl mb-4",
                                        children: "🎯"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 198,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: `text-2xl font-bold text-gray-900 mb-3 ${language === "bn" ? "font-siliguri" : ""}`,
                                        children: language === "en" ? "100% Satisfaction Guarantee" : "১০০% সন্তুষ্টির গ্যারান্টি"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 199,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-gray-700 max-w-2xl mx-auto ${language === "bn" ? "font-siliguri" : ""}`,
                                        children: language === "en" ? "Try any course risk-free. If you're not completely satisfied within the first 7 days, we'll give you a full refund - no questions asked!" : "যেকোনো কোর্স রিস্ক-ফ্রি ট্রাই করুন। প্রথম ৭ দিনের মধ্যে সম্পূর্ণভাবে সন্তুষ্ট না হলে, আমরা আপনাকে সম্পূর্ণ রিফান্ড দেব - কোন প্রশ্ন ছাড়াই!"
                                    }, void 0, false, {
                                        fileName: "[project]/components/PricingSection.tsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/PricingSection.tsx",
                            lineNumber: 193,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center mt-12 animate-fadeIn",
                        style: {
                            animationDelay: "700ms"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: `text-gray-600 mb-4 ${language === "bn" ? "font-siliguri" : ""}`,
                                children: language === "en" ? "Have questions about pricing? Our team is here to help!" : "প্রাইসিং সম্পর্কে প্রশ্ন আছে? আমাদের টিম সাহায্য করতে এখানে আছে!"
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                className: "border-2 border-primary-500 text-primary-600 font-bold hover:bg-primary-50",
                                size: "lg",
                                variant: "bordered",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: language === "bn" ? "font-siliguri" : "",
                                    children: language === "en" ? "📞 Contact Sales Team" : "📞 সেলস টিমের সাথে যোগাযোগ করুন"
                                }, void 0, false, {
                                    fileName: "[project]/components/PricingSection.tsx",
                                    lineNumber: 234,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/PricingSection.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/PricingSection.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/PricingSection.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/PricingSection.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(PricingSection, "X3/2nnvq4vPCQ8I/1+HHGZWSbFk=");
_c = PricingSection;
const __TURBOPACK__default__export__ = PricingSection;
var _c;
__turbopack_context__.k.register(_c, "PricingSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_7ef6ba37._.js.map